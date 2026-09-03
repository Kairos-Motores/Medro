import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Search,
  Check,
  Trash2,
  Wrench,
  FileText,
  Gauge,
  ClipboardCheck,
  FlaskConical,
  Flame,
  Hammer,
  Sliders,
  Layers,
  Building2,
  X,
  KeyRound,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

export interface UserAccessRow {
  id: string;
  nome: string;
  login: string;
  filial: string;
  cargo: string;
  matProtheus: string;
  permissoes: string[]; // tokens como ["OS", "DPT", "_OS_EDOS"]
  status?: string;
}

// Colunas de Módulos (Macro-Acesso)
const MODULE_COLUMNS = [
  { id: "OS", label: "OS Medro", short: "OS", icon: Wrench, desc: "Abertura, execução e encerramento de OS" },
  { id: "DPT", label: "Dep. Técnico", short: "DPT", icon: FileText, desc: "Laudos técnicos, fotos e QR codes" },
  { id: "AVA", label: "Avaliação Final", short: "Avaliação", icon: Gauge, desc: "Peritagem e inspeções finais" },
  { id: "INS", label: "Inspeção", short: "Inspeção", icon: ClipboardCheck, desc: "Checklist de qualidade e conformidade" },
  { id: "TES", label: "Ensaios", short: "Ensaios", icon: FlaskConical, desc: "Ensaios elétricos, Surge Test e isolamento" },
  { id: "CAL", label: "Usinagem e Caldeiraria", short: "Usinagem & Cald.", icon: Flame, desc: "Ordens de recuperação e usinagem de peças mecânicas" },
  { id: "FER", label: "Ferramentaria", short: "Ferram.", icon: Hammer, desc: "Controle de ferramentas e almoxarifado" },
  { id: "SSMA", label: "SSMA", short: "SSMA", icon: ShieldCheck, desc: "Saúde, Segurança e Meio Ambiente" },
  { id: "TER", label: "Terceirizados", short: "Terceir.", icon: Users, desc: "Gestão de serviços externos e fornecedores" },
  { id: "GER", label: "Configurações", short: "Config", icon: Sliders, desc: "Ajustes do sistema e gestão de acessos" },
  { id: "ESCOPO", label: "Escopo", short: "Escopo", icon: Layers, desc: "Definição de escopo de manutenção" },
];

// Colunas de Atividades Operacionais Especiais
const ACTIVITY_COLUMNS = [
  { id: "_OS_EDOS", label: "Editar OS", short: "Edit OS", desc: "Permissão para alterar campos sensíveis da OS" },
  { id: "_OS_REP", label: "Reprovar OS", short: "Reprov OS", desc: "Autorização para reprovar etapas técnicas" },
  { id: "_OS_REMOVE", label: "Excluir OS", short: "Excl OS", desc: "Exclusão lógica de ordens de serviço" },
  { id: "_DTI_LINK", label: "Gerar Link Laudo", short: "Link Laudo", desc: "Criar links públicos externos de laudos técnicos" },
  { id: "_AVA_LIB", label: "Liberar Avaliação", short: "Lib Aval", desc: "Assinatura e liberação técnica de avaliação" },
  { id: "_CAL_CAD", label: "Cadastrar Usinagem e Caldeiraria", short: "Cad Usin/Cald", desc: "Inserir novas demandas no setor de usinagem e caldeiraria" },
  { id: "_TER_CAD", label: "Cadastrar Terceirizado", short: "Cad Terceir", desc: "Envio de motor para fornecedor externo" },
];

const FALLBACK_USERS: UserAccessRow[] = [
  {
    id: "usr-1",
    nome: "Rodrigo de Paula Nascimento",
    login: "rodrigo.paula",
    filial: "São Luís",
    cargo: "Administrador / Sistema",
    matProtheus: "010245",
    permissoes: ["OS", "DPT", "AVA", "INS", "TES", "CAL", "FER", "SSMA", "TER", "GER", "ESCOPO", "_OS_EDOS", "_DTI_LINK", "_AVA_LIB"],
  },
  {
    id: "usr-2",
    nome: "Carlos Eduardo Silva",
    login: "carlos.silva",
    filial: "São Luís",
    cargo: "Mecânico Líder",
    matProtheus: "010189",
    permissoes: ["OS", "CAL", "FER", "_OS_EDOS", "_CAL_CAD"],
  },
  {
    id: "usr-3",
    nome: "António Manuel Ribeiro",
    login: "antonio.ribeiro",
    filial: "Aveiro",
    cargo: "Responsável Oficina PT",
    matProtheus: "030088",
    permissoes: ["OS", "DPT", "AVA", "INS", "TES", "FER", "_OS_EDOS", "_AVA_LIB", "_DTI_LINK"],
  },
  {
    id: "usr-4",
    nome: "Marcos Antônio Ferreira",
    login: "marcos.ferreira",
    filial: "Parauapebas",
    cargo: "Inspetor de Qualidade",
    matProtheus: "020412",
    permissoes: ["OS", "AVA", "INS", "TES", "_AVA_LIB", "_OS_REP"],
  },
  {
    id: "usr-5",
    nome: "Fabiana Soares Costa",
    login: "fabiana.costa",
    filial: "Barcarena",
    cargo: "Supervisora Usinagem e Caldeiraria",
    matProtheus: "040115",
    permissoes: ["OS", "CAL", "FER", "TER", "_CAL_CAD", "_TER_CAD"],
  },
  {
    id: "usr-6",
    nome: "Lucas Gabriel Mendes",
    login: "lucas.mendes",
    filial: "São José dos Campos",
    cargo: "Técnico de Ensaios",
    matProtheus: "050230",
    permissoes: ["OS", "TES", "AVA"],
  },
  {
    id: "usr-7",
    nome: "Juliana Rocha Martins",
    login: "juliana.martins",
    filial: "São Luís",
    cargo: "Engenheira / Laudos DPT",
    matProtheus: "010372",
    permissoes: ["OS", "DPT", "INS", "_DTI_LINK"],
  },
  {
    id: "usr-8",
    nome: "Bruno Henrique Alves",
    login: "bruno.alves",
    filial: "São Luís",
    cargo: "Especialista em Bobinagem",
    matProtheus: "010411",
    permissoes: ["OS", "INS", "TES"],
  },
  {
    id: "usr-9",
    nome: "Daniel Oliveira Santos",
    login: "daniel.santos",
    filial: "Aveiro",
    cargo: "Técnico Mecânico PT",
    matProtheus: "030104",
    permissoes: ["OS", "CAL", "FER"],
  },
  {
    id: "usr-10",
    nome: "Patrícia Lima Souza",
    login: "patricia.souza",
    filial: "Parauapebas",
    cargo: "Coordenadora SSMA",
    matProtheus: "020556",
    permissoes: ["SSMA", "TER"],
  },
  {
    id: "usr-11",
    nome: "Thiago Moreira Silva",
    login: "thiago.moreira",
    filial: "Barcarena",
    cargo: "Caldeireiro Soldador",
    matProtheus: "040228",
    permissoes: ["OS", "CAL"],
  },
  {
    id: "usr-12",
    nome: "Amanda Cristine Ramos",
    login: "amanda.ramos",
    filial: "São José dos Campos",
    cargo: "Laboratório de Ensaios",
    matProtheus: "050312",
    permissoes: ["TES", "AVA", "INS", "_AVA_LIB"],
  },
  {
    id: "usr-13",
    nome: "Rafael Costa Peixoto",
    login: "rafael.peixoto",
    filial: "São Luís",
    cargo: "Almoxarife / Ferramentaria",
    matProtheus: "010567",
    permissoes: ["FER"],
  },
  {
    id: "usr-14",
    nome: "Gabriel Silva Nogueira",
    login: "gabriel.nogueira",
    filial: "Aveiro",
    cargo: "Perito Técnico PT",
    matProtheus: "030219",
    permissoes: ["OS", "AVA", "DPT", "_DTI_LINK"],
  },
  {
    id: "usr-15",
    nome: "Eduardo Farias Ramos",
    login: "eduardo.ramos",
    filial: "São Luís",
    cargo: "Técnico de Campo",
    matProtheus: "010643",
    permissoes: ["SSMA", "OS"],
  },
];

export function GestaoUsuariosSection() {
  const currentUser = useAuth((s) => s.user);
  const qc = useQueryClient();

  // Filtros
  const [busca, setBusca] = useState("");
  const [filialFiltro, setFilialFiltro] = useState("");
  const [visaoColunas, setVisaoColunas] = useState<"todos" | "modulos" | "atividades">("todos");

  // Modal Novo Usuário
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoLogin, setNovoLogin] = useState("");
  const [novoCargo, setNovoCargo] = useState("");
  const [novaFilial, setNovaFilial] = useState("São Luís");
  const [novaMatricula, setNovaMatricula] = useState("");
  const [novasPermissoes, setNovasPermissoes] = useState<string[]>(["OS"]);

  // Estado de salvamento em andamento
  const [salvandoUserId, setSalvandoUserId] = useState<string | null>(null);

  // Consulta de usuários conectada ao Dataverse cr4a1_credenciaises
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["usuarios", filialFiltro, busca],
    queryFn: async () => {
      try {
        const p = new URLSearchParams();
        if (filialFiltro) p.set("filial", filialFiltro);
        if (busca.trim()) p.set("search", busca.trim());
        return await api<{ usuarios: UserAccessRow[]; fromDataverse: boolean }>(
          `/usuarios?${p.toString()}`,
        );
      } catch {
        // Fallback local caso o backend esteja offline
        let items = [...FALLBACK_USERS];
        if (filialFiltro) {
          items = items.filter((u) => u.filial.toLowerCase() === filialFiltro.toLowerCase());
        }
        if (busca.trim()) {
          const q = busca.toLowerCase().trim();
          items = items.filter(
            (u) =>
              u.nome.toLowerCase().includes(q) ||
              u.login.toLowerCase().includes(q) ||
              u.cargo.toLowerCase().includes(q) ||
              u.matProtheus.includes(q),
          );
        }
        return { usuarios: items, fromDataverse: false };
      }
    },
    staleTime: 30_000,
  });

  const usuarios = data?.usuarios || FALLBACK_USERS;
  const fromDataverse = data?.fromDataverse ?? false;

  // Mutação para atualizar permissões de um usuário no Dataverse (cr4a1_acesso_mod)
  const updatePermissoesMutation = useMutation({
    mutationFn: async ({ id, permissoes }: { id: string; permissoes: string[] }) => {
      setSalvandoUserId(id);
      return await api<{ id: string; permissoes: string[]; acessoMod: string }>(
        `/usuarios/${id}/permissoes`,
        {
          method: "PATCH",
          body: { permissoes },
        },
      );
    },
    onMutate: async ({ id, permissoes }) => {
      await qc.cancelQueries({ queryKey: ["usuarios"] });
      const previousData = qc.getQueryData<{ usuarios: UserAccessRow[]; fromDataverse: boolean }>([
        "usuarios",
        filialFiltro,
        busca,
      ]);

      if (previousData) {
        qc.setQueryData(["usuarios", filialFiltro, busca], {
          ...previousData,
          usuarios: previousData.usuarios.map((u) => (u.id === id ? { ...u, permissoes } : u)),
        });
      }

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        qc.setQueryData(["usuarios", filialFiltro, busca], context.previousData);
      }
      alert("Erro ao salvar permissões no Dataverse.");
    },
    onSettled: () => {
      setSalvandoUserId(null);
      qc.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });

  // Mutação para criar novo colaborador
  const createUsuarioMutation = useMutation({
    mutationFn: async (novoUsuario: {
      nome: string;
      login: string;
      filial: string;
      cargo: string;
      matProtheus: string;
      permissoes: string[];
    }) => {
      return await api<UserAccessRow>("/usuarios", {
        method: "POST",
        body: novoUsuario,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["usuarios"] });
      setModalNovoAberto(false);
      setNovoNome("");
      setNovoLogin("");
      setNovoCargo("");
      setNovaMatricula("");
      setNovasPermissoes(["OS"]);
    },
    onError: () => {
      alert("Erro ao cadastrar novo colaborador no Dataverse.");
    },
  });

  // Iniciais para avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "?";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  };

  // Sigla da filial
  const getFilialSigla = (f: string) => {
    if (f.includes("Luís")) return "SLZ";
    if (f.includes("Aveiro")) return "AVE";
    if (f.includes("Barcarena")) return "BRC";
    if (f.includes("Parauapebas")) return "PRP";
    if (f.includes("Campos")) return "SJC";
    return f.slice(0, 3).toUpperCase();
  };

  // Colunas ativas com base no filtro de visão
  const colunasExibidas = useMemo(() => {
    if (visaoColunas === "modulos") return { modulos: MODULE_COLUMNS, atividades: [] };
    if (visaoColunas === "atividades") return { modulos: [], atividades: ACTIVITY_COLUMNS };
    return { modulos: MODULE_COLUMNS, atividades: ACTIVITY_COLUMNS };
  }, [visaoColunas]);

  // Alterna uma permissão de um usuário
  const togglePermissao = (u: UserAccessRow, permId: string) => {
    const exists = u.permissoes.includes(permId);
    const next = exists ? u.permissoes.filter((p) => p !== permId) : [...u.permissoes, permId];
    updatePermissoesMutation.mutate({ id: u.id, permissoes: next });
  };

  // Revoga todos os acessos de um usuário
  const revogarTodos = (u: UserAccessRow) => {
    if (!confirm(`Deseja realmente revogar todos os acessos de ${u.nome}?`)) return;
    updatePermissoesMutation.mutate({ id: u.id, permissoes: [] });
  };

  // Salva novo usuário
  const handleSalvarNovoUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) return;

    createUsuarioMutation.mutate({
      nome: novoNome.trim(),
      login: novoLogin.trim() || novoNome.toLowerCase().replace(/\s+/g, "."),
      cargo: novoCargo.trim() || "Colaborador",
      filial: novaFilial,
      matProtheus: novaMatricula.trim() || "010999",
      permissoes: novasPermissoes,
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* ── CABEÇALHO DA SEÇÃO ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">Gestão de Usuários & Acessos</h2>
              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                Matriz de Permissões
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                  fromDataverse
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-border bg-surface-2 text-muted-foreground"
                }`}
              >
                {fromDataverse ? "Dataverse Live (Credenciaiss)" : "Base Local"}
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground">
              Configure o que cada colaborador pode acessar: módulos principais e atividades operacionais com sincronização Dataverse.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            title="Atualizar lista de credenciais"
            className="flex size-9 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground hover:bg-surface-2 hover:text-foreground transition"
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
          </button>
          <button
            onClick={() => setModalNovoAberto(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-[12.5px] font-semibold text-white shadow-xs transition hover:bg-primary-hover active:scale-95"
          >
            <UserPlus className="size-4" />
            Novo Colaborador
          </button>
        </div>
      </div>

      {/* ── CARDS DE RESUMO OPERACIONAL COMPACTOS ── */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-2.5 shadow-xs">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground leading-none">Colaboradores</p>
            <p className="mt-1 text-base font-bold text-foreground leading-none">{usuarios.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-2.5 shadow-xs">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <Wrench className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground leading-none">Módulos</p>
            <p className="mt-1 text-base font-bold text-foreground leading-none">{MODULE_COLUMNS.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-2.5 shadow-xs">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <KeyRound className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground leading-none">Atividades</p>
            <p className="mt-1 text-base font-bold text-foreground leading-none">{ACTIVITY_COLUMNS.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-2.5 shadow-xs">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <Building2 className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground leading-none">Filiais</p>
            <p className="mt-1 text-base font-bold text-foreground leading-none">5 Unidades</p>
          </div>
        </div>
      </div>

      {/* ── BARRA DE FERRAMENTAS & FILTROS ── */}
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-2.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome, login, cargo ou matrícula no Dataverse..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded-lg border border-border/80 bg-surface-2/60 py-1.5 pl-8 pr-3 text-[12px] text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-surface"
          />
        </div>

        {/* Filtro de Filial */}
        <div className="flex items-center gap-2">
          <select
            value={filialFiltro}
            onChange={(e) => setFilialFiltro(e.target.value)}
            className="rounded-lg border border-border/80 bg-surface-2/60 px-2.5 py-1.5 text-[12px] font-medium text-foreground focus:border-primary focus:outline-none dark:bg-surface"
          >
            <option value="">Todas as Filiais</option>
            <option value="São Luís">São Luís (SLZ)</option>
            <option value="Aveiro">Aveiro (AVE)</option>
            <option value="Barcarena">Barcarena (BRC)</option>
            <option value="Parauapebas">Parauapebas (PRP)</option>
            <option value="São José dos Campos">São José dos Campos (SJC)</option>
          </select>

          {/* Abas de Visualização */}
          <div className="flex rounded-lg border border-border/70 bg-surface-2/70 p-0.5 text-[11.5px]">
            <button
              onClick={() => setVisaoColunas("todos")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                visaoColunas === "todos"
                  ? "bg-surface text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setVisaoColunas("modulos")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                visaoColunas === "modulos"
                  ? "bg-surface text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Módulos
            </button>
            <button
              onClick={() => setVisaoColunas("atividades")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                visaoColunas === "atividades"
                  ? "bg-surface text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Atividades
            </button>
          </div>
        </div>
      </div>

      {/* ── GRADE / MATRIZ DE GESTÃO DE ACESSOS ── */}
      <div className="w-full rounded-xl border border-border bg-surface shadow-xs overflow-hidden">
        {/* Barra superior de instrução */}
        <div className="border-b border-border/80 bg-surface-2/40 px-3.5 py-2 flex items-center justify-between text-[11.5px]">
          <span className="text-muted-foreground flex items-center gap-1.5">
            {salvandoUserId ? (
              <span className="flex items-center gap-1 text-primary font-medium">
                <Loader2 className="size-3 animate-spin" /> Salvando alteração no Dataverse...
              </span>
            ) : (
              <span>Clique nas caixas de marcação para conceder ou revogar o acesso imediatamente.</span>
            )}
          </span>
          <span className="font-semibold text-muted-foreground">
            {usuarios.length} colaboradores na grade
          </span>
        </div>

        {/* Contêiner com rolagem VERTICAL e HORIZONTAL e cabeçalhos fixos */}
        <div className="overflow-auto max-h-[calc(100dvh-340px)] min-h-[420px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-2">
              <RefreshCw className="size-6 animate-spin text-primary" />
              <p className="text-xs">Carregando usuários da tabela Credenciaiss no Dataverse...</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-[12px]">
              <thead className="sticky top-0 z-30 bg-surface-2/95 backdrop-blur-md">
                <tr className="border-b border-border/80 font-semibold text-foreground-secondary">
                  {/* Coluna Fixa do Usuário (Top-Left corner) */}
                  <th className="sticky top-0 left-0 z-40 min-w-[240px] bg-surface-2/95 px-3.5 py-2.5 shadow-[1px_0_0_0] shadow-border backdrop-blur-md">
                    Colaborador
                  </th>

                  {/* Colunas de Módulos */}
                  {colunasExibidas.modulos.map((m) => {
                    const Icon = m.icon;
                    return (
                      <th
                        key={m.id}
                        title={`${m.label}: ${m.desc}`}
                        className="min-w-[65px] px-1 py-2 text-center border-l border-border/40 hover:bg-surface-2"
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <Icon className="size-3.5 text-muted-foreground" />
                          <span className="truncate max-w-[60px] font-medium text-[11px]">
                            {m.short}
                          </span>
                        </div>
                      </th>
                    );
                  })}

                  {/* Colunas de Atividades Operacionais */}
                  {colunasExibidas.atividades.map((a) => (
                    <th
                      key={a.id}
                      title={`${a.label}: ${a.desc}`}
                      className="min-w-[72px] px-1 py-2 text-center border-l border-border/40 bg-amber-500/5 hover:bg-amber-500/10"
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <KeyRound className="size-3 text-amber-500" />
                        <span className="truncate max-w-[68px] font-medium text-[10.5px] text-amber-600 dark:text-amber-400">
                          {a.short}
                        </span>
                      </div>
                    </th>
                  ))}

                  {/* Total */}
                  <th className="min-w-[55px] border-l border-border/40 px-2 py-2 text-center font-bold">
                    Total
                  </th>

                  {/* Ações */}
                  <th className="min-w-[40px] border-l border-border/40 px-1 py-2 text-center">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {usuarios.length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        1 +
                        colunasExibidas.modulos.length +
                        colunasExibidas.atividades.length +
                        2
                      }
                      className="py-16 text-center text-muted-foreground"
                    >
                      Nenhum colaborador encontrado com os filtros informados.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u) => {
                    const isLoggedUser = currentUser?.login === u.login;
                    const isSavingThis = salvandoUserId === u.id;
                    return (
                      <tr
                        key={u.id}
                        className={`group transition-colors hover:bg-surface-2/60 ${
                          isSavingThis ? "opacity-75" : ""
                        }`}
                      >
                        {/* Célula Fixa: Usuário */}
                        <td className="sticky left-0 z-20 bg-surface px-3.5 py-2 shadow-[1px_0_0_0] shadow-border group-hover:bg-surface-2/95 backdrop-blur-md">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                              {getInitials(u.nome)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <p className="truncate font-semibold text-foreground text-[12.5px]">
                                  {u.nome}
                                </p>
                                {isLoggedUser && (
                                  <span className="rounded bg-blue-500/10 px-1 py-0.2 text-[9px] font-semibold text-primary">
                                    Você
                                  </span>
                                )}
                              </div>
                              <p className="truncate text-[10.5px] text-muted-foreground">
                                <span className="font-semibold text-primary">
                                  [{getFilialSigla(u.filial)}]
                                </span>{" "}
                                {u.cargo} • Mat. {u.matProtheus || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Células de Módulos */}
                        {colunasExibidas.modulos.map((m) => {
                          const hasAccess = u.permissoes.includes(m.id);
                          return (
                            <td
                              key={m.id}
                              onClick={() => togglePermissao(u, m.id)}
                              className="cursor-pointer border-l border-border/40 px-1 py-2 text-center transition-colors hover:bg-primary/10"
                            >
                              <div className="flex items-center justify-center">
                                <div
                                  className={`flex size-5 items-center justify-center rounded-md border transition-all ${
                                    hasAccess
                                      ? "border-emerald-500 bg-emerald-500 text-white shadow-2xs"
                                      : "border-border/80 bg-surface hover:border-primary/60"
                                  }`}
                                >
                                  {hasAccess && <Check className="size-3.5 stroke-[3]" />}
                                </div>
                              </div>
                            </td>
                          );
                        })}

                        {/* Células de Atividades */}
                        {colunasExibidas.atividades.map((a) => {
                          const hasAccess = u.permissoes.includes(a.id);
                          return (
                            <td
                              key={a.id}
                              onClick={() => togglePermissao(u, a.id)}
                              className="cursor-pointer border-l border-border/40 bg-amber-500/5 px-1 py-2 text-center transition-colors hover:bg-amber-500/20"
                            >
                              <div className="flex items-center justify-center">
                                <div
                                  className={`flex size-5 items-center justify-center rounded-md border transition-all ${
                                    hasAccess
                                      ? "border-amber-500 bg-amber-500 text-white shadow-2xs"
                                      : "border-amber-500/40 bg-surface hover:border-amber-500"
                                  }`}
                                >
                                  {hasAccess && <Check className="size-3.5 stroke-[3]" />}
                                </div>
                              </div>
                            </td>
                          );
                        })}

                        {/* Total */}
                        <td className="border-l border-border/40 px-2 py-2 text-center">
                          <span className="inline-flex rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-bold text-foreground tabular-nums">
                            {u.permissoes.length}
                          </span>
                        </td>

                        {/* Ação: Revogar */}
                        <td className="border-l border-border/40 px-1 py-2 text-center">
                          <button
                            onClick={() => revogarTodos(u)}
                            title="Revogar todos os acessos"
                            className="rounded p-1 text-muted-foreground opacity-40 transition hover:bg-danger/10 hover:text-danger hover:opacity-100 group-hover:opacity-80"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── MODAL: ADICIONAR NOVO COLABORADOR ── */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-5 shadow-2xl space-y-4 text-foreground">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-white">
                  <UserPlus className="size-4" />
                </div>
                <h3 className="text-base font-bold text-foreground">Novo Colaborador na Matriz</h3>
              </div>
              <button
                onClick={() => setModalNovoAberto(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-surface-2"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSalvarNovoUsuario} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-medium text-foreground mb-1">
                  Nome Completo
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Fernando Rocha"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-[13px] text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1">
                    Login de Acesso
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: fernando.rocha"
                    value={novoLogin}
                    onChange={(e) => setNovoLogin(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-[13px] text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1">
                    Matrícula Protheus
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 010884"
                    value={novaMatricula}
                    onChange={(e) => setNovaMatricula(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-[13px] text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1">
                    Filial
                  </label>
                  <select
                    value={novaFilial}
                    onChange={(e) => setNovaFilial(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-[13px] text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="São Luís">São Luís (MA)</option>
                    <option value="Aveiro">Aveiro (PT)</option>
                    <option value="Barcarena">Barcarena (PA)</option>
                    <option value="Parauapebas">Parauapebas (PA)</option>
                    <option value="São José dos Campos">São José dos Campos (SP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1">
                    Cargo / Função
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Inspetor Técnico"
                    value={novoCargo}
                    onChange={(e) => setNovoCargo(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-[13px] text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Módulos Iniciais */}
              <div>
                <label className="block text-[12px] font-medium text-foreground mb-1.5">
                  Módulos Iniciais Concedidos
                </label>
                <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-border bg-surface-2/40 p-2 text-[11.5px]">
                  {MODULE_COLUMNS.map((m) => {
                    const checked = novasPermissoes.includes(m.id);
                    return (
                      <label
                        key={m.id}
                        className="flex items-center gap-1.5 cursor-pointer rounded p-1 hover:bg-surface"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setNovasPermissoes((prev) =>
                              checked ? prev.filter((p) => p !== m.id) : [...prev, m.id],
                            );
                          }}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="truncate">{m.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/70">
                <button
                  type="button"
                  onClick={() => setModalNovoAberto(false)}
                  className="rounded-xl border border-border px-3.5 py-1.5 text-[12.5px] font-medium text-foreground hover:bg-surface-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createUsuarioMutation.isPending}
                  className="rounded-xl bg-primary px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-primary-hover active:scale-95"
                >
                  {createUsuarioMutation.isPending ? "Cadastrando no Dataverse..." : "Salvar Colaborador"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
