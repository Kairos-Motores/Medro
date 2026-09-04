import { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  RefreshCw,
  Terminal,
  Maximize2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Database,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Package,
  X,
  Minimize2,
} from "lucide-react";
import { api } from "@/lib/api";

export interface RunnerItem {
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

interface RunnersApiResponse {
  status: string;
  isLocalHost: boolean;
  total: number;
  data: RunnerItem[];
}

function formatDateTime(isoString: string | null): string {
  if (!isoString) return "Nunca disparado";
  try {
    const d = new Date(isoString);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function formatDuration(ms: number | null): string {
  if (ms === null || ms === undefined) return "";
  if (ms < 1000) return `${ms}ms`;
  const sec = (ms / 1000).toFixed(1);
  return `${sec}s`;
}

function getLineColor(line: string): string {
  const lower = line.toLowerCase();
  if (lower.includes("[ok]") || lower.includes("sucesso") || lower.includes("concluído")) {
    return "text-emerald-400";
  }
  if (lower.includes("[erro]") || lower.includes("error") || lower.includes("falha") || lower.includes("exception")) {
    return "text-rose-400";
  }
  if (lower.includes("[aviso]") || lower.includes("warning") || lower.includes("alerta")) {
    return "text-amber-400";
  }
  if (line.startsWith(">_") || line.startsWith("[")) {
    return "text-cyan-400/90";
  }
  return "text-zinc-300";
}

/**
 * Mini Terminal de exatamente 3 linhas visíveis
 */
function MiniTerminal({
  lines,
  status,
  onExpand,
  onClear,
}: {
  lines: string[];
  status: RunnerItem["status"];
  onExpand: () => void;
  onClear: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const displayLines = lines && lines.length > 0 ? lines : [">_ Aguardando comando de disparo..."];

  return (
    <div className="group/term relative mt-2.5 overflow-hidden rounded-xl border border-border/80 bg-[#0a0d14] shadow-inner">
      {/* Barra superior do mini terminal */}
      <div className="flex h-6 items-center justify-between border-b border-border/40 bg-zinc-950/60 px-2.5 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1.5 font-mono">
          <span
            className={`size-1.5 rounded-full ${
              status === "running"
                ? "animate-ping bg-amber-400"
                : status === "success"
                ? "bg-emerald-400"
                : status === "error"
                ? "bg-rose-400"
                : "bg-zinc-500"
            }`}
          />
          <Terminal className="size-3 text-cyan-400" />
          <span>mini-terminal • 3 linhas</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Limpar logs"
            onClick={onClear}
            className="rounded p-0.5 text-zinc-400 hover:bg-zinc-800 hover:text-foreground active:scale-95"
          >
            <Trash2 className="size-2.5" />
          </button>
          <button
            type="button"
            title="Expandir terminal"
            onClick={onExpand}
            className="flex items-center gap-0.5 rounded px-1 py-0.5 text-zinc-400 hover:bg-zinc-800 hover:text-foreground active:scale-95"
          >
            <Maximize2 className="size-2.5" />
            <span className="text-[9.5px]">Expandir</span>
          </button>
        </div>
      </div>

      {/* Caixa do mini terminal — Altura exata para 3 linhas com rolagem */}
      <div
        ref={scrollRef}
        className="h-[4.75rem] overflow-y-auto px-3 py-1.5 font-mono text-[11px] leading-[1.35rem] tracking-tight selection:bg-cyan-500/30"
      >
        {displayLines.map((line, idx) => (
          <div key={idx} className={`truncate font-mono ${getLineColor(line)}`}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScriptRunnersSection() {
  const [runners, setRunners] = useState<RunnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalRunnerId, setModalRunnerId] = useState<string | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  // Estado para colapsar cada card individualmente (ou todos)
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({});

  const modalRunner = modalRunnerId ? runners.find((r) => r.id === modalRunnerId) ?? null : null;

  const fetchRunners = async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const res = await api<RunnersApiResponse>("/runners");
      if (res && res.data) {
        setRunners(res.data);
      }
    } catch (err) {
      console.error("Erro ao carregar runners:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRunners();
  }, []);

  // Polling automático inteligente: 1.5s se houver algo rodando, 8s caso contrário
  useEffect(() => {
    const isAnyRunning = runners.some((r) => r.status === "running");
    const intervalTime = isAnyRunning ? 1500 : 8000;

    const timer = setInterval(() => {
      fetchRunners(true);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [runners]);

  const toggleCollapse = (id: string) => {
    setCollapsedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allCollapsed = runners.length > 0 && runners.every((r) => collapsedCards[r.id]);

  const toggleCollapseAll = () => {
    const nextState = !allCollapsed;
    const updated: Record<string, boolean> = {};
    for (const r of runners) {
      updated[r.id] = nextState;
    }
    setCollapsedCards(updated);
  };

  const handleRun = async (runner: RunnerItem) => {
    setActiveActionId(runner.id);
    try {
      await api(`/runners/${runner.id}/run`, { method: "POST", body: {} });
      await fetchRunners(true);
    } catch (err: any) {
      alert(`Falha ao disparar ${runner.name}: ${err.message || err}`);
    } finally {
      setActiveActionId(null);
    }
  };

  const handleStop = async (runner: RunnerItem) => {
    setActiveActionId(runner.id);
    try {
      await api(`/runners/${runner.id}/stop`, { method: "POST", body: {} });
      await fetchRunners(true);
    } catch (err: any) {
      alert(`Falha ao interromper ${runner.name}: ${err.message || err}`);
    } finally {
      setActiveActionId(null);
    }
  };

  const handleClear = async (runner: RunnerItem) => {
    try {
      await api(`/runners/${runner.id}/clear`, { method: "POST", body: {} });
      await fetchRunners(true);
    } catch (err) {
      console.error("Erro ao limpar logs:", err);
    }
  };

  return (
    <div className="space-y-3">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold tracking-tight text-foreground">
              Disparadores de Sincronização (SQL → Dataverse)
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10.5px] font-semibold text-cyan-400">
              <Cpu className="size-3" /> Localhost
            </span>
          </div>
          <p className="text-[12px] text-muted-foreground">
            Dispare as rotinas de extração do Protheus e envio ao Dataverse com feedback em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={toggleCollapseAll}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11.5px] font-medium text-muted-foreground shadow-2xs hover:bg-surface-2 hover:text-foreground active:scale-95"
            title={allCollapsed ? "Expandir todos os disparadores" : "Colapsar todos para mostrar só o nome"}
          >
            {allCollapsed ? <Maximize2 className="size-3" /> : <Minimize2 className="size-3" />}
            <span>{allCollapsed ? "Expandir Tudo" : "Colapsar Tudo"}</span>
          </button>

          <button
            type="button"
            onClick={() => fetchRunners()}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11.5px] font-medium text-foreground shadow-2xs hover:bg-surface-2 active:scale-95"
          >
            <RefreshCw className={`size-3 ${refreshing ? "animate-spin text-primary" : ""}`} />
            Atualizar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-border bg-surface p-8 text-sm text-muted-foreground">
          <RefreshCw className="mr-2 size-4 animate-spin text-primary" /> Carregando disparadores...
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {runners.map((runner) => {
            const isRunning = runner.status === "running";
            const isBusy = activeActionId === runner.id;
            const isCollapsed = !!collapsedCards[runner.id];

            return (
              <div
                key={runner.id}
                className="flex flex-col rounded-2xl border border-border bg-surface p-4.5 shadow-xs transition-all hover:border-border/90"
              >
                <div>
                  {/* Header do Card (Nome, Ícone, Badges, Status e Botão de Colapsar) */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl shadow-xs ${
                          runner.id === "dataverse_margens"
                            ? "bg-amber-500/15 text-amber-500"
                            : runner.id === "atualizarsb2"
                            ? "bg-sky-500/15 text-sky-400"
                            : "bg-emerald-500/15 text-emerald-500"
                        }`}
                      >
                        {runner.id === "dataverse_margens" ? (
                          <Database className="size-5" />
                        ) : runner.id === "atualizarsb2" ? (
                          <Package className="size-5" />
                        ) : (
                          <Layers className="size-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-[14.5px] font-bold text-foreground">{runner.name}</h4>
                          <span className="rounded-md border border-border/80 bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-foreground/90">
                            {runner.scriptFile}
                          </span>
                          <span className="rounded-md bg-surface-2/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                            {runner.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill + Botão de Colapsar */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div>
                        {isRunning ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-[11.5px] font-semibold text-amber-500">
                            <RefreshCw className="size-3.5 animate-spin" /> Executando
                          </span>
                        ) : runner.status === "success" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11.5px] font-semibold text-emerald-500">
                            <CheckCircle2 className="size-3.5" /> Sucesso
                          </span>
                        ) : runner.status === "error" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[11.5px] font-semibold text-rose-500">
                            <AlertCircle className="size-3.5" /> Falha
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-500/10 px-2.5 py-0.5 text-[11.5px] font-medium text-muted-foreground">
                            Pronto
                          </span>
                        )}
                      </div>

                      {/* Botão para colapsar e deixar só o nome */}
                      <button
                        type="button"
                        onClick={() => toggleCollapse(runner.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
                        title={isCollapsed ? "Expandir detalhes e terminal" : "Colapsar para deixar só o nome"}
                      >
                        {isCollapsed ? (
                          <ChevronDown className="size-4.5" />
                        ) : (
                          <ChevronUp className="size-4.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CONTEÚDO EXPANDIDO (Ocultado quando colapsado) */}
                  {!isCollapsed ? (
                    <>
                      {/* Descrição */}
                      <p className="mt-2.5 text-[12.5px] text-muted-foreground leading-relaxed">
                        {runner.description}
                      </p>

                      {/* Metadados da Última Execução */}
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-lg bg-surface-2/60 px-3 py-2 text-[11.5px] text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5 text-cyan-400" />
                          <span className="font-medium text-foreground">Última vez:</span>
                          <span>{formatDateTime(runner.lastRunAt)}</span>
                        </div>
                        {runner.lastDurationMs !== null && (
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-foreground">Duração:</span>
                            <span className="font-mono text-cyan-400">{formatDuration(runner.lastDurationMs)}</span>
                          </div>
                        )}
                      </div>

                      {/* MINI TERMINAL (3 LINHAS) */}
                      <MiniTerminal
                        lines={runner.recentLines}
                        status={runner.status}
                        onExpand={() => setModalRunnerId(runner.id)}
                        onClear={() => handleClear(runner)}
                      />

                      {/* Ações / Botões Expandidos */}
                      <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/60 pt-3">
                        {isRunning ? (
                          <button
                            type="button"
                            onClick={() => handleStop(runner)}
                            disabled={isBusy}
                            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow-xs hover:bg-rose-700 active:scale-95 disabled:opacity-50 transition-all"
                          >
                            <Square className="size-3.5 fill-current" /> Interromper
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRun(runner)}
                            disabled={isBusy}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-[12.5px] font-semibold text-primary-foreground shadow-xs hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
                          >
                            <Play className="size-3.5 fill-current" /> Disparar Agora
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    /* Ações Compactas quando Colapsado (deixa só o nome com botão rápido) */
                    <div className="mt-2.5 flex items-center justify-between border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
                      <span className="text-[10.5px]">Última vez: {formatDateTime(runner.lastRunAt)}</span>
                      <div>
                        {isRunning ? (
                          <button
                            type="button"
                            onClick={() => handleStop(runner)}
                            disabled={isBusy}
                            className="flex items-center gap-1 rounded bg-rose-600 px-2.5 py-0.5 text-[11px] font-semibold text-white hover:bg-rose-700 active:scale-95"
                          >
                            <Square className="size-2.5 fill-current" /> Parar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRun(runner)}
                            disabled={isBusy}
                            className="flex items-center gap-1 rounded bg-primary/90 px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground hover:bg-primary active:scale-95"
                          >
                            <Play className="size-2.5 fill-current" /> Disparar
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL EXPANDIDO DE LOG COMPLETO */}
      {modalRunner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setModalRunnerId(null)}
        >
          <div
            className="relative flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 bg-surface-2/70">
              <div className="flex items-center gap-2 font-mono">
                <Terminal className="size-4 text-cyan-400" />
                <span className="font-bold text-foreground text-sm">{modalRunner.name}</span>
                <span className="rounded bg-surface px-1.5 py-0.2 text-[11px] text-muted-foreground">
                  {modalRunner.scriptFile}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleClear(modalRunner)}
                  className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-surface hover:text-foreground"
                >
                  <Trash2 className="size-3.5" /> Limpar
                </button>
                <button
                  type="button"
                  onClick={() => setModalRunnerId(null)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Console Log */}
            <div className="flex-1 overflow-y-auto bg-[#070a10] p-4 font-mono text-[11.5px] leading-relaxed text-zinc-300 select-text">
              {modalRunner.logs && modalRunner.logs.length > 0 ? (
                modalRunner.logs.map((line, idx) => (
                  <div key={idx} className={`whitespace-pre-wrap ${getLineColor(line)}`}>
                    {line}
                  </div>
                ))
              ) : (
                <div className="text-zinc-500 italic">Nenhuma saída registrada para esta rotina.</div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-border/80 px-4 py-2.5 bg-surface text-[11px] text-muted-foreground">
              <div>
                Última execução: <span className="text-foreground">{formatDateTime(modalRunner.lastRunAt)}</span>
              </div>
              <button
                type="button"
                onClick={() => setModalRunnerId(null)}
                className="rounded-lg bg-surface-2 px-3 py-1 text-foreground font-medium hover:bg-surface-2/80"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
