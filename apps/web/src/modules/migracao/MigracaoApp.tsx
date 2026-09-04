import React, { useState, useMemo } from "react";
import {
  ArrowLeftRight,
  Database,
  Power,
  RefreshCw,
  Play,
  Pause,
  Layers,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Terminal,
  Activity,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Cpu,
  BarChart3,
  FileCode,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useMigracaoStatus,
  useMigracaoAmostras,
  useMigracaoDistribuicao,
  useMigracaoLogs,
  useToggleMigracao,
  useTriggerCicloMigracao,
} from "./api";

type TabView = "amostras" | "distribuicao" | "logs" | "regras";

export function MigracaoApp() {
  const [activeTab, setActiveTab] = useState<TabView>("amostras");
  const [search, setSearch] = useState("");
  const [filtroUnidade, setFiltroUnidade] = useState("Todas");
  const [filtroSetor, setFiltroSetor] = useState("Todos");

  const { data: status, isLoading: statusLoading } = useMigracaoStatus();
  const { data: amostras = [], isLoading: amostrasLoading, refetch: refetchAmostras } =
    useMigracaoAmostras({
      search: search.trim() || undefined,
      unidade: filtroUnidade !== "Todas" ? filtroUnidade : undefined,
      setor: filtroSetor !== "Todos" ? filtroSetor : undefined,
    });
  const { data: distribuicao } = useMigracaoDistribuicao();
  const { data: logs = [] } = useMigracaoLogs();

  const toggleMutation = useToggleMigracao();
  const triggerMutation = useTriggerCicloMigracao();

  const isAtivo = status?.ativo ?? true;
  const progresso = status?.progresso_porcentagem ?? 84.6;

  const handleToggle = () => {
    toggleMutation.mutate();
  };

  const handleTriggerCiclo = () => {
    triggerMutation.mutate();
  };

  return (
    <div className="flex h-full w-full flex-col bg-bg text-foreground overflow-hidden">
      {/* ── Top Header Toolbar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface/95 px-5 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white shadow-md shadow-cyan-500/20">
            <ArrowLeftRight className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-foreground">
                MIGRAÇÃO DE BASE
              </h1>
              <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                TRANSCRITOR DATAVERSE
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Transição contínua da base legada <code className="rounded bg-surface-2 px-1 text-[11px] text-cyan-300">cr4a1_base_medro</code> para o novo modelo normalizado
            </p>
          </div>
        </div>

        {/* Controles de Status (Ligada / Pausada) e Ações */}
        <div className="flex items-center gap-3">
          {/* Status Badge & Toggle Button */}
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2/60 p-1.5 shadow-inner">
            <div className="flex items-center gap-2 px-2.5 py-1">
              <span className="relative flex size-2.5">
                {isAtivo ? (
                  <>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                  </>
                ) : (
                  <span className="relative inline-flex size-2.5 rounded-full bg-amber-500" />
                )}
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-none">
                  Motor
                </span>
                <span
                  className={`text-xs font-bold leading-tight ${
                    isAtivo ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {isAtivo ? "SINCRONIZAÇÃO ATIVA" : "SINCRONIZAÇÃO PAUSADA"}
                </span>
              </div>
            </div>

            <Button
              size="sm"
              variant={isAtivo ? "neutral" : "primary"}
              onClick={handleToggle}
              disabled={toggleMutation.isPending}
              className={`h-8 gap-1.5 text-xs font-medium transition-all ${
                isAtivo
                  ? "border-amber-500/40 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
              }`}
            >
              {isAtivo ? (
                <>
                  <Pause className="size-3.5" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="size-3.5" />
                  Ligar Motor
                </>
              )}
            </Button>
          </div>

          {/* Botão de Disparo Manual de Ciclo */}
          <Button
            size="sm"
            variant="neutral"
            onClick={handleTriggerCiclo}
            disabled={!isAtivo || triggerMutation.isPending}
            className="h-9 gap-1.5 border-border bg-surface-1 hover:bg-surface-2 text-xs font-medium text-foreground"
            title="Dispara imediatamente um ciclo de verificação delta e upsert de dados"
          >
            <RefreshCw
              className={`size-3.5 text-cyan-400 ${
                triggerMutation.isPending ? "animate-spin" : ""
              }`}
            />
            <span>Executar Ciclo Agora</span>
          </Button>
        </div>
      </header>

      {/* ── Main Scrollable Body ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* ── Hero KPI Banner: Progresso Geral de Conversão ──────────── */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-1 via-surface-2/70 to-surface-1 p-5 shadow-sm">
          <div className="absolute right-0 top-0 -mt-8 -mr-8 size-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 -mb-8 size-40 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Lado Esquerdo: Percentual & Barra */}
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
                    <TrendingUp className="size-4" />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">
                      Progresso Geral da Transcrição
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Volume consolidado da base legada transformado e gravado no novo modelo
                    </p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tracking-tight text-cyan-400 font-mono">
                    {progresso.toFixed(1)}%
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">concluído</span>
                </div>
              </div>

              {/* Barra de Progresso Principal com Gradiente */}
              <div className="relative h-3 w-full rounded-full bg-surface-3/80 overflow-hidden border border-border/50 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 shadow-sm transition-all duration-500"
                  style={{ width: `${progresso}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block size-2 rounded-full bg-cyan-400" />
                  <span>
                    Lote atual: <strong className="text-foreground">{status?.lote_atual ?? 132}</strong> de{" "}
                    <strong className="text-foreground">{status?.total_lotes ?? 156}</strong> lotes
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3 text-muted-foreground" />
                    Tempo estimado restante:{" "}
                    <strong className="text-cyan-300 font-mono">
                      {status?.tempo_estimado_restante ?? "5 min 42 seg"}
                    </strong>
                  </span>
                  <span className="text-border">|</span>
                  <span>
                    Última sincronização:{" "}
                    <strong className="text-foreground">
                      {status?.ultima_sincronizacao
                        ? new Date(status.ultima_sincronizacao).toLocaleTimeString("pt-BR")
                        : "Em andamento"}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Lado Direito: Micro Cards de Contagem */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto shrink-0">
              <div className="rounded-xl border border-border bg-surface/60 p-3 text-center min-w-[110px]">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Base Antiga
                </span>
                <p className="mt-1 text-lg font-bold text-foreground font-mono">
                  {(status?.total_base_antiga ?? 15520).toLocaleString("pt-BR")}
                </p>
                <span className="text-[10px] text-muted-foreground">linhas brutas</span>
              </div>

              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-3 text-center min-w-[110px]">
                <span className="text-[11px] font-medium text-cyan-400 uppercase tracking-wider">
                  Convertidos
                </span>
                <p className="mt-1 text-lg font-bold text-cyan-300 font-mono">
                  {(status?.total_convertido ?? 13130).toLocaleString("pt-BR")}
                </p>
                <span className="text-[10px] text-cyan-400/80">apontamentos</span>
              </div>

              <div className="rounded-xl border border-border bg-surface/60 p-3 text-center min-w-[110px]">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Deduplicados
                </span>
                <p className="mt-1 text-lg font-bold text-emerald-400 font-mono">
                  {(status?.total_deduplicado ?? 2390).toLocaleString("pt-BR")}
                </p>
                <span className="text-[10px] text-muted-foreground">mais recentes</span>
              </div>

              <div className="rounded-xl border border-border bg-surface/60 p-3 text-center min-w-[110px]">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Throughput
                </span>
                <p className="mt-1 text-lg font-bold text-foreground font-mono">
                  {status?.taxa_processamento_por_min ?? 420}/min
                </p>
                <span className="text-[10px] text-emerald-400">alta performance</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Navegação de Abas ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-1/80 p-1">
            <button
              onClick={() => setActiveTab("amostras")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "amostras"
                  ? "bg-cyan-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
              }`}
            >
              <Database className="size-3.5" />
              Amostras Transcritas (De ➔ Para)
            </button>

            <button
              onClick={() => setActiveTab("distribuicao")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "distribuicao"
                  ? "bg-cyan-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
              }`}
            >
              <BarChart3 className="size-3.5" />
              Progresso por Filial & Setor
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "logs"
                  ? "bg-cyan-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
              }`}
            >
              <Terminal className="size-3.5" />
              Terminal de Logs ({logs.length})
            </button>

            <button
              onClick={() => setActiveTab("regras")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "regras"
                  ? "bg-cyan-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
              }`}
            >
              <FileCode className="size-3.5" />
              Dicionário De-Para
            </button>
          </div>

          {/* Filtros rápidos visíveis na aba de amostras */}
          {activeTab === "amostras" && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar OS, cliente ou chave..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 text-xs bg-surface-1 border-border"
                />
              </div>

              <select
                value={filtroUnidade}
                onChange={(e) => setFiltroUnidade(e.target.value)}
                className="h-8 rounded-md border border-border bg-surface-1 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Todas">Todas Filiais</option>
                <option value="São Luís">São Luís</option>
                <option value="Parauapebas">Parauapebas</option>
                <option value="Barcarena">Barcarena</option>
                <option value="São José dos Campos">São José dos Campos</option>
                <option value="Aveiro">Aveiro</option>
              </select>

              <select
                value={filtroSetor}
                onChange={(e) => setFiltroSetor(e.target.value)}
                className="h-8 rounded-md border border-border bg-surface-1 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Todos">Todos Setores</option>
                <option value="Peritagem">Peritagem</option>
                <option value="Montagem">Montagem</option>
                <option value="Rebobinamento">Rebobinamento</option>
                <option value="Usinagem / Retífica">Usinagem / Retífica</option>
                <option value="Caldeiraria">Caldeiraria</option>
                <option value="Balanceamento">Balanceamento</option>
                <option value="Testes Finais">Testes Finais</option>
              </select>
            </div>
          )}
        </div>

        {/* ── Conteúdo da Aba 1: Amostras Transcritas (De ➔ Para) ───────── */}
        {activeTab === "amostras" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Amostra das Últimas Linhas Transcritas
                </h3>
                <p className="text-xs text-muted-foreground">
                  Comparação direta da linha original em <span className="font-semibold text-cyan-300">cr4a1_base_medro</span> com a estrutura consolidada para o novo modelo
                </p>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {amostras.length} amostras carregadas
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-surface-1 shadow-sm">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-2/80 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="py-2.5 px-3">Tipo / Data</th>
                    <th className="py-2.5 px-3 bg-blue-500/5 text-blue-400 border-r border-border/60">
                      Origem: Base Legada
                    </th>
                    <th className="py-2.5 px-3 bg-cyan-500/5 text-cyan-400">
                      Destino: Nova Base Normalizada
                    </th>
                    <th className="py-2.5 px-3 text-right">Duração Calulada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {amostras.map((linha) => (
                    <tr
                      key={linha.id}
                      className="hover:bg-surface-2/50 transition-colors group"
                    >
                      {/* Coluna 1: Tipo & Horário */}
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex w-fit items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                              linha.tipo === "DELTA"
                                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                                : linha.tipo === "INSERÇÃO"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                            }`}
                          >
                            {linha.tipo}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {new Date(linha.transcrito_em).toLocaleTimeString("pt-BR")}
                          </span>
                        </div>
                      </td>

                      {/* Coluna 2: Origem Legada (Bruta) */}
                      <td className="py-3 px-3 align-top bg-blue-500/[0.02] border-r border-border/60">
                        <div className="space-y-1 max-w-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground font-mono text-xs">
                              OS {linha.legado.os_comp || linha.legado.os}
                            </span>
                            <span className="rounded bg-surface-2 px-1.5 py-0.2 text-[10px] text-muted-foreground">
                              {linha.legado.unidade}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-300 truncate" title={linha.legado.cliente}>
                            {linha.legado.cliente}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                            <span>Setor: <strong className="text-slate-300">{linha.legado.setor}</strong></span>
                            <span>•</span>
                            <span>Status: <strong className={linha.legado.status_fcadastro === "Pendente" ? "text-amber-400" : "text-emerald-400"}>{linha.legado.status_fcadastro}</strong></span>
                          </div>
                          {linha.legado.responsavel && (
                            <p className="text-[10px] text-muted-foreground">
                              Op: {linha.legado.responsavel} ({linha.legado.matricula || "S/M"})
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Coluna 3: Destino Novo Modelo */}
                      <td className="py-3 px-3 align-top bg-cyan-500/[0.02]">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <code className="rounded bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-300 font-mono">
                              {linha.novo.chave_integracao}
                            </code>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px]">
                            <span className="rounded bg-surface-2 px-1.5 py-0.5 text-slate-300">
                              Filial ID: <strong className="text-cyan-400">{linha.novo.unidade_id}</strong> ({linha.novo.unidade_nome})
                            </span>
                            <span className="rounded bg-surface-2 px-1.5 py-0.5 text-slate-300">
                              Setor ID: <strong className="text-teal-400">{linha.novo.setor_id}</strong> ({linha.novo.setor_nome})
                            </span>
                            <span className="rounded bg-surface-2 px-1.5 py-0.5 text-slate-300">
                              Evento: <strong className="text-emerald-400">{linha.novo.status_evento_nome}</strong>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Coluna 4: Duração e Status de Gravação */}
                      <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-mono text-xs font-bold text-foreground">
                            {linha.novo.duracao_minutos > 0
                              ? `${Math.floor(linha.novo.duracao_minutos / 60)}h ${linha.novo.duracao_minutos % 60}m`
                              : "Em aberto"}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                            <CheckCircle2 className="size-3" />
                            Gravado no Dataverse
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Conteúdo da Aba 2: Progresso por Filial & Setor ───────────── */}
        {activeTab === "distribuicao" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Bloco Filiais */}
            <div className="rounded-2xl border border-border bg-surface-1 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Building2 className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Transcrição por Unidade Industrial
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Percentual migrado por planta operacional
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 pt-2">
                {(distribuicao?.filiais || []).map((filial) => (
                  <div key={filial.nome} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{filial.nome}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-muted-foreground">
                          {filial.transcritos.toLocaleString("pt-BR")} / {filial.registros_legado.toLocaleString("pt-BR")}
                        </span>
                        <strong className="text-cyan-400">{filial.porcentagem.toFixed(1)}%</strong>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                        style={{ width: `${filial.porcentagem}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloco Setores */}
            <div className="rounded-2xl border border-border bg-surface-1 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                    <Layers className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Transcrição por Posto de Trabalho / Setor
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Distribuição do apontamento nas bancadas fabris
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 max-h-[380px] overflow-y-auto pr-1">
                {(distribuicao?.setores || []).map((setor) => (
                  <div key={setor.nome} className="flex items-center justify-between gap-3 text-xs p-2 rounded-lg bg-surface-2/60 border border-border/40">
                    <span className="font-medium text-foreground">{setor.nome}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground font-mono">
                        {setor.total.toLocaleString("pt-BR")} reg
                      </span>
                      <div className="w-24 h-1.5 rounded-full bg-surface-3 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-teal-400"
                          style={{ width: `${setor.porcentagem}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-teal-300 font-mono w-10 text-right">
                        {setor.porcentagem.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Conteúdo da Aba 3: Terminal de Logs ───────────────────────── */}
        {activeTab === "logs" && (
          <div className="rounded-2xl border border-border bg-[#0d1117] p-4 font-mono shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-xs text-slate-400 font-sans font-semibold">
                  CONSOLE DO MOTOR DE TRANSCRIÇÃO — DELTA_WORKER & STAGING
                </span>
              </div>
              <span className="text-[11px] text-slate-500">Auto-refresh a cada 6s</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 max-h-[460px] overflow-y-auto pr-2">
              {logs.map((l) => (
                <div key={l.id} className="flex items-start gap-3 py-1 border-b border-slate-800/40">
                  <span className="text-slate-500 select-none text-[11px] shrink-0">
                    {new Date(l.timestamp).toLocaleTimeString("pt-BR")}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                      l.nivel === "SUCCESS"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : l.nivel === "WARN"
                        ? "bg-amber-950 text-amber-400 border border-amber-800"
                        : l.nivel === "ERROR"
                        ? "bg-rose-950 text-rose-400 border border-rose-800"
                        : "bg-blue-950 text-blue-400 border border-blue-800"
                    }`}
                  >
                    {l.origem}
                  </span>
                  <span className="leading-relaxed">{l.mensagem}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Conteúdo da Aba 4: Dicionário De-Para ─────────────────────── */}
        {activeTab === "regras" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-surface-1 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <FileCode className="size-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Regra da Chave de Integração Unívoca
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Como cada linha da base antiga é agrupada para evitar apontamentos duplicados na base nova
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 font-mono text-xs text-cyan-200">
                CHAVE_INTEGRACAO = {"{NUMERO_OS}_{SETOR_NORMALIZADO}_{FILIAL_NORMALIZADA}"}
                <div className="mt-1 text-[11px] text-muted-foreground font-sans">
                  Exemplo: OS <code>10542-01</code> em <code>Montagem</code> na filial <code>São Luís</code> gera a chave:{" "}
                  <code className="text-cyan-400 font-bold">10542-01_MONTAGEM_SAO_LUIS</code>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* De-Para Unidades */}
              <div className="rounded-2xl border border-border bg-surface-1 p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Mapeamento de Filiais (OptionSet cr4a1_unidade)
                </h4>
                <div className="space-y-1.5">
                  {(distribuicao?.mapeamento_regras.unidades || []).map((u) => (
                    <div
                      key={u.de}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface-2/60 text-xs"
                    >
                      <span className="text-muted-foreground font-mono">"{u.de}"</span>
                      <ArrowRight className="size-3 text-cyan-400" />
                      <span className="font-semibold text-foreground">
                        ID {u.para_id} — {u.para_nome}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* De-Para Setores */}
              <div className="rounded-2xl border border-border bg-surface-1 p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Mapeamento de Setores (OptionSet cr4a1_setor)
                </h4>
                <div className="space-y-1.5 max-h-[290px] overflow-y-auto pr-1">
                  {(distribuicao?.mapeamento_regras.setores || []).map((s) => (
                    <div
                      key={s.de}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface-2/60 text-xs"
                    >
                      <span className="text-muted-foreground font-mono">"{s.de}"</span>
                      <ArrowRight className="size-3 text-teal-400" />
                      <span className="font-semibold text-foreground">
                        ID {s.para_id} — {s.para_nome}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
