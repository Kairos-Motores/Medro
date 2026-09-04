import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export interface ScriptRunnerDefinition {
  id: string;
  name: string;
  scriptFile: string;
  category: string;
  description: string;
  featured?: boolean;
}

export interface RunnerState {
  id: string;
  name: string;
  scriptFile: string;
  category: string;
  description: string;
  featured: boolean;
  status: "idle" | "running" | "success" | "error";
  lastRunAt: string | null;
  lastDurationMs: number | null;
  lastExitCode: number | null;
  logs: string[];
  recentLines: string[];
  pid?: number | null;
}

interface PersistedRunnerHistory {
  [scriptId: string]: {
    lastRunAt: string | null;
    lastDurationMs: number | null;
    lastExitCode: number | null;
    lastStatus: "idle" | "running" | "success" | "error";
    logs: string[];
  };
}

const REGISTERED_SCRIPTS: ScriptRunnerDefinition[] = [
  {
    id: "dataverse_margens",
    name: "Sincronização de Margens & Custos",
    scriptFile: "dataverse_margens.py",
    category: "Financeiro & Custos",
    description: "Calcula custos e margens de O.S. (SD3, ZP1, SRA) a partir do Protheus SQL e atualiza o Dataverse.",
    featured: true,
  },
  {
    id: "atualizarzb6",
    name: "Atualização de Relatórios ZB6",
    scriptFile: "atualizarzb6.py",
    category: "Serviços & O.S.",
    description: "Puxa relatórios de serviço da tabela ZB6010 do Protheus SQL e sincroniza com a entidade cr4a1_zb6_relatorios.",
    featured: true,
  },
  {
    id: "atualizarsb2",
    name: "Sincronização de Saldos de Estoque",
    scriptFile: "atualizarsb2.py",
    category: "Almoxarifado & Estoque",
    description: "Extrai saldos físico e financeiro, empenhos, reservas e descrição dos itens (SB2 + SB1) do Protheus SQL e sincroniza com a entidade cr4a1_sb2_saldo_estoque.",
    featured: true,
  },
];

class RunnersService {
  private activeProcesses = new Map<string, ChildProcessWithoutNullStreams>();
  private states = new Map<string, RunnerState>();
  private historyFilePath: string;
  private referenciaDir: string;

  constructor() {
    this.referenciaDir = this.resolveReferenciaDir();
    this.historyFilePath = this.resolveHistoryPath();
    this.initStates();
  }

  private resolveReferenciaDir(): string {
    const candidates = [
      path.resolve(process.cwd(), "Referência"),
      path.resolve(process.cwd(), "../../Referência"),
      path.resolve(process.cwd(), "../Referência"),
      "c:\\Users\\Rodri\\Documents\\Codes\\Medro\\Referência",
    ];

    for (const c of candidates) {
      if (fs.existsSync(c)) {
        return c;
      }
    }
    return candidates[0] ?? path.resolve(process.cwd(), "Referência");
  }

  private resolveHistoryPath(): string {
    const dataDir = path.resolve(process.cwd(), "data");
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      return path.join(dataDir, "runners_state.json");
    } catch {
      return path.resolve(process.cwd(), ".runners_state.json");
    }
  }

  private loadPersistedHistory(): PersistedRunnerHistory {
    try {
      if (fs.existsSync(this.historyFilePath)) {
        const content = fs.readFileSync(this.historyFilePath, "utf-8");
        return JSON.parse(content) as PersistedRunnerHistory;
      }
    } catch (err) {
      console.warn("Não foi possível carregar histórico de runners:", err);
    }
    return {};
  }

  private savePersistedHistory() {
    try {
      const history: PersistedRunnerHistory = {};
      for (const [id, state] of this.states.entries()) {
        history[id] = {
          lastRunAt: state.lastRunAt,
          lastDurationMs: state.lastDurationMs,
          lastExitCode: state.lastExitCode,
          lastStatus: state.status === "running" ? "error" : state.status,
          logs: state.logs.slice(-50),
        };
      }
      fs.writeFileSync(this.historyFilePath, JSON.stringify(history, null, 2), "utf-8");
    } catch (err) {
      console.warn("Falha ao salvar histórico de runners:", err);
    }
  }

  private initStates() {
    const history = this.loadPersistedHistory();

    for (const def of REGISTERED_SCRIPTS) {
      const hist = history[def.id];
      const initialLogs = hist?.logs && hist.logs.length > 0
        ? hist.logs
        : [`Pronto para disparo. Aguardando comando.`];

      this.states.set(def.id, {
        id: def.id,
        name: def.name,
        scriptFile: def.scriptFile,
        category: def.category,
        description: def.description,
        featured: !!def.featured,
        status: (hist?.lastStatus as any) || "idle",
        lastRunAt: hist?.lastRunAt ?? null,
        lastDurationMs: hist?.lastDurationMs ?? null,
        lastExitCode: hist?.lastExitCode ?? null,
        logs: initialLogs,
        recentLines: initialLogs.slice(-3),
        pid: null,
      });
    }
  }

  public getAllRunners(): RunnerState[] {
    return Array.from(this.states.values());
  }

  public getRunner(id: string): RunnerState | undefined {
    return this.states.get(id);
  }

  public runScript(id: string): { success: boolean; message: string; runner?: RunnerState } {
    const state = this.states.get(id);
    if (!state) {
      return { success: false, message: `Script '${id}' não encontrado.` };
    }

    if (state.status === "running" || this.activeProcesses.has(id)) {
      return { success: false, message: `O script '${state.name}' já está em execução.` };
    }

    const scriptFullPath = path.join(this.referenciaDir, state.scriptFile);
    if (!fs.existsSync(scriptFullPath)) {
      state.status = "error";
      state.logs.push(`[ERRO] Arquivo de script não encontrado: ${scriptFullPath}`);
      state.recentLines = state.logs.slice(-3);
      return { success: false, message: `Arquivo não localizado: ${state.scriptFile}` };
    }

    const startedAt = new Date();
    const startTimeMs = Date.now();

    state.status = "running";
    state.lastRunAt = startedAt.toISOString();
    state.lastExitCode = null;
    state.logs = [
      `[${startedAt.toLocaleTimeString("pt-BR")}] Disparo iniciado: python ${state.scriptFile}`,
      `>_ Diretório: ${this.referenciaDir}`,
    ];
    state.recentLines = state.logs.slice(-3);

    try {
      const proc = spawn("python", [state.scriptFile], {
        cwd: this.referenciaDir,
        env: {
          ...process.env,
          PYTHONUNBUFFERED: "1",
        },
        shell: process.platform === "win32",
      });

      state.pid = proc.pid ?? null;
      this.activeProcesses.set(id, proc);

      const appendLog = (chunk: Buffer | string) => {
        const text = chunk.toString();
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        for (const line of lines) {
          state.logs.push(line);
        }
        if (state.logs.length > 200) {
          state.logs = state.logs.slice(-200);
        }
        state.recentLines = state.logs.slice(-3);
      };

      proc.stdout.on("data", (data) => {
        appendLog(data);
      });

      proc.stderr.on("data", (data) => {
        appendLog(data);
      });

      proc.on("error", (err) => {
        const errorMsg = `[ERRO] Falha ao iniciar processo: ${err.message}`;
        state.logs.push(errorMsg);
        state.recentLines = state.logs.slice(-3);
        state.status = "error";
        state.lastExitCode = -1;
        state.lastDurationMs = Date.now() - startTimeMs;
        this.activeProcesses.delete(id);
        state.pid = null;
        this.savePersistedHistory();
      });

      proc.on("close", (code) => {
        const duration = Date.now() - startTimeMs;
        state.lastDurationMs = duration;
        state.lastExitCode = code;
        state.status = code === 0 ? "success" : "error";
        this.activeProcesses.delete(id);
        state.pid = null;

        const durationSec = (duration / 1000).toFixed(1);
        const conclusionMsg =
          code === 0
            ? `[OK] Concluído com sucesso em ${durationSec}s.`
            : `[ERRO] Processo finalizado com código de erro ${code} em ${durationSec}s.`;

        state.logs.push(conclusionMsg);
        state.recentLines = state.logs.slice(-3);
        this.savePersistedHistory();
      });

      return {
        success: true,
        message: `Script '${state.name}' iniciado com sucesso.`,
        runner: state,
      };
    } catch (err) {
      state.status = "error";
      const msg = `Falha ao disparar processo: ${(err as Error).message}`;
      state.logs.push(msg);
      state.recentLines = state.logs.slice(-3);
      this.savePersistedHistory();
      return { success: false, message: msg };
    }
  }

  public stopScript(id: string): { success: boolean; message: string } {
    const proc = this.activeProcesses.get(id);
    const state = this.states.get(id);

    if (!proc && (!state || state.status !== "running")) {
      return { success: false, message: "O script não está em execução." };
    }

    try {
      if (proc && proc.pid) {
        if (process.platform === "win32") {
          spawn("taskkill", ["/pid", proc.pid.toString(), "/T", "/F"]);
        } else {
          proc.kill("SIGTERM");
        }
      }

      this.activeProcesses.delete(id);
      if (state) {
        state.status = "error";
        state.pid = null;
        state.logs.push(`[AVISO] Execução interrompida manualmente pelo usuário.`);
        state.recentLines = state.logs.slice(-3);
        this.savePersistedHistory();
      }

      return { success: true, message: "Execução interrompida com sucesso." };
    } catch (err) {
      return { success: false, message: `Erro ao interromper: ${(err as Error).message}` };
    }
  }

  public clearLogs(id: string): boolean {
    const state = this.states.get(id);
    if (!state) return false;
    state.logs = [`Logs limpos pelo usuário. Aguardando novo disparo.`];
    state.recentLines = state.logs.slice(-3);
    this.savePersistedHistory();
    return true;
  }
}

export const runnersService = new RunnersService();
