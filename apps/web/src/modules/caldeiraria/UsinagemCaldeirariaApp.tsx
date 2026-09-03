import React, { useState, useMemo } from "react";
import {
  Flame,
  Wrench,
  Search,
  Plus,
  Filter,
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  ChevronRight,
  Layers,
  ArrowUpDown,
  SlidersHorizontal,
  Eye,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { FILIAIS } from "@medro/shared";
import {
  useCaldeirariaItens,
  useCaldeirariaKpis,
  type CaldeirariaItem,
} from "./api";
import { NovoServicoModal } from "./components/NovoServicoModal";
import { DetalhesServicoModal } from "./components/DetalhesServicoModal";
import { PecasCatalogoModal } from "./components/PecasCatalogoModal";

type TabMode = "por-os" | "fila-pecas" | "historico";

export function UsinagemCaldeirariaApp() {
  const { user, can } = useAuth();
  const canCadastrar = can("_CAL_CAD");

  // Filtros principais
  const [filial, setFilial] = useState<string>(user?.filial || "São Luís");
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabMode>("por-os");
  const [filtroRegime, setFiltroRegime] = useState<"todos" | "Normal" | "Prioridade">("todos");
  const [incluirSuspensos, setIncluirSuspensos] = useState<boolean>(true);

  // Modais
  const [isNovoModalOpen, setIsNovoModalOpen] = useState(false);
  const [isCatalogoModalOpen, setIsCatalogoModalOpen] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<CaldeirariaItem | null>(null);

  // Queries
  const { data: itensData, isLoading, refetch, isFetching } = useCaldeirariaItens({
    filial,
    search: search.trim() || undefined,
  });
  const { data: kpisData } = useCaldeirariaKpis(filial);

  const todosItens = useMemo(() => {
    return (itensData?.items || []).filter(
      (item) => item.pecas?.trim().toLowerCase() !== "balanceamento",
    );
  }, [itensData]);

  // Filtragem dos itens pendentes
  const itensPendentes = useMemo(() => {
    return todosItens.filter((item) => {
      if (item.status === "Concluído") return false;
      if (!incluirSuspensos && item.status === "Suspenso") return false;
      if (filtroRegime !== "todos" && item.regime !== filtroRegime) return false;
      return true;
    });
  }, [todosItens, incluirSuspensos, filtroRegime]);

  // Itens concluídos (Histórico)
  const itensConcluidos = useMemo(() => {
    return todosItens.filter((item) => item.status === "Concluído");
  }, [todosItens]);

  // Agrupamento por Ordem de Serviço (como Caldeiraria_Pendentes_OS)
  const osAgrupadas = useMemo(() => {
    const mapa = new Map<
      string,
      {
        os: string;
        unidade: string;
        itens: CaldeirariaItem[];
        totalPrioridades: number;
        totalNormais: number;
        possuiSuspenso: boolean;
        dataMaisAntiga: string;
      }
    >();

    for (const item of itensPendentes) {
      const osKey = item.os || "SEM-OS";
      const existing = mapa.get(osKey);
      const isPrioridade = item.regime === "Prioridade";
      const isSuspenso = item.status === "Suspenso";

      if (!existing) {
        mapa.set(osKey, {
          os: osKey,
          unidade: item.unidade,
          itens: [item],
          totalPrioridades: isPrioridade ? 1 : 0,
          totalNormais: !isPrioridade ? 1 : 0,
          possuiSuspenso: isSuspenso,
          dataMaisAntiga: item.dataEnvio || new Date().toISOString(),
        });
      } else {
        existing.itens.push(item);
        if (isPrioridade) existing.totalPrioridades++;
        else existing.totalNormais++;
        if (isSuspenso) existing.possuiSuspenso = true;
        if (item.dataEnvio && new Date(item.dataEnvio) < new Date(existing.dataMaisAntiga)) {
          existing.dataMaisAntiga = item.dataEnvio;
        }
      }
    }

    return Array.from(mapa.values()).sort((a, b) => {
      if (a.totalPrioridades !== b.totalPrioridades) {
        return b.totalPrioridades - a.totalPrioridades;
      }
      return new Date(a.dataMaisAntiga).getTime() - new Date(b.dataMaisAntiga).getTime();
    });
  }, [itensPendentes]);

  // Fila de peças ordenada por Prazo (como Caldeiraria_Pendentes_Peças)
  const filaPecasOrdenada = useMemo(() => {
    return [...itensPendentes].sort((a, b) => {
      const prazoA = a.dataPrazo ? new Date(a.dataPrazo).getTime() : Infinity;
      const prazoB = b.dataPrazo ? new Date(b.dataPrazo).getTime() : Infinity;
      return prazoA - prazoB;
    });
  }, [itensPendentes]);

  return (
    <div className="flex flex-col h-full bg-bg text-foreground overflow-y-auto">
      {/* Barra de Topo / Header do Módulo */}
      <div className="border-b border-border bg-surface px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-amber/15 border border-accent-amber/30 text-accent-amber shadow-inner">
              <Flame className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-foreground tracking-tight">Usinagem e Caldeiraria</h1>
                <span className="rounded-full bg-accent-amber/15 px-2 py-0.5 text-[11px] font-semibold text-accent-amber border border-accent-amber/30">
                  Dataverse Live
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Controle operacional, fila de retrabalho mecânico e acompanhamento de peças
              </p>
            </div>
          </div>

          {/* Controles de Ação e Filtro de Filial */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Seletor de Filial */}
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-xs">
              <Building2 className="size-3.5 text-accent-amber" />
              <select
                value={filial}
                onChange={(e) => setFilial(e.target.value)}
                className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
              >
                <option value="Todas" className="bg-surface text-foreground">
                  Todas as Filiais
                </option>
                {FILIAIS.map((f) => (
                  <option key={f} value={f} className="bg-surface text-foreground">
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Catálogo de Peças */}
            <Button
              variant="neutral"
              size="sm"
              onClick={() => setIsCatalogoModalOpen(true)}
              className="text-xs gap-1.5 h-8"
              title="Gerenciar lista de peças padronizadas"
            >
              <Wrench className="size-3.5 text-accent-amber" />
              Catálogo de Peças
            </Button>

            {/* Recarregar */}
            <Button
              variant="neutral"
              size="sm"
              onClick={() => refetch()}
              className="text-xs h-8 w-8 p-0"
              title="Atualizar dados"
            >
              <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin text-accent-amber" : ""}`} />
            </Button>

            {/* Botão Novo Serviço (Requer _CAL_CAD ou Administrador) */}
            {canCadastrar && (
              <Button
                size="sm"
                onClick={() => setIsNovoModalOpen(true)}
                className="gap-1.5 bg-accent-amber hover:brightness-95 text-white font-semibold text-xs h-8 shadow-sm"
              >
                <Plus className="size-4" />
                Nova Demanda
              </Button>
            )}
          </div>
        </div>

        {/* Hero KPIs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {/* Card 1: Serviços Pendentes */}
          <div className="flex items-center justify-between rounded-xl border border-accent-amber/30 bg-accent-amber/10 p-3 shadow-sm">
            <div>
              <span className="text-[11px] font-medium text-accent-amber block uppercase tracking-wider">
                Serviços Pendentes
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-accent-amber">
                  {kpisData?.totalPendentes ?? itensPendentes.length}
                </span>
                {(kpisData?.totalPrioridade || 0) > 0 && (
                  <span className="text-[11px] font-semibold text-danger">
                    ({kpisData?.totalPrioridade} prioritários)
                  </span>
                )}
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-amber/20 text-accent-amber">
              <Clock className="size-5" />
            </div>
          </div>

          {/* Card 2: Ordens de Serviço Ativas */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 shadow-sm">
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block uppercase tracking-wider">
                OS com Demanda
              </span>
              <span className="text-2xl font-black text-foreground mt-0.5 block">
                {kpisData?.totalOSComPendencia ?? osAgrupadas.length}
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-muted-foreground">
              <Layers className="size-5" />
            </div>
          </div>

          {/* Card 3: Serviços Suspensos */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 shadow-sm">
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block uppercase tracking-wider">
                Serviços Suspensos
              </span>
              <span className="text-2xl font-black text-warning mt-0.5 block">
                {kpisData?.totalSuspensos ?? 0}
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/15 text-warning">
              <AlertTriangle className="size-5" />
            </div>
          </div>

          {/* Card 4: Concluídos Recentes & % no Prazo */}
          <div className="flex items-center justify-between rounded-xl border border-success/30 bg-success/10 p-3 shadow-sm">
            <div>
              <span className="text-[11px] font-medium text-success block uppercase tracking-wider">
                Concluídos (% no Prazo)
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-success">
                  {kpisData?.totalConcluidos ?? itensConcluidos.length}
                </span>
                <span className="text-[11px] font-semibold text-success/90">
                  ({kpisData?.concluidosNoPrazoPercent ?? 100}% pontual)
                </span>
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/20 text-success">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por Abas + Filtros Operacionais */}
      <div className="border-b border-border bg-surface/50 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Abas de Visão */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("por-os")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "por-os"
                ? "bg-accent-amber text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="size-3.5" />
            Visão por O.S.
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === "por-os" ? "bg-black/20 text-white font-bold" : "bg-surface text-muted-foreground"}`}>
              {osAgrupadas.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("fila-pecas")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "fila-pecas"
                ? "bg-accent-amber text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Wrench className="size-3.5" />
            Fila de Peças & Prazos
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === "fila-pecas" ? "bg-black/20 text-white font-bold" : "bg-surface text-muted-foreground"}`}>
              {filaPecasOrdenada.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("historico")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "historico"
                ? "bg-accent-amber text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle2 className="size-3.5" />
            Histórico de Concluídos
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === "historico" ? "bg-black/20 text-white font-bold" : "bg-surface text-muted-foreground"}`}>
              {itensConcluidos.length}
            </span>
          </button>
        </div>

        {/* Barra de Pesquisa e Filtros Rápidos */}
        <div className="flex items-center gap-3">
          {/* Busca textual */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar OS, Peça, Serviço..."
              className="h-8 w-52 sm:w-64 bg-surface-2 border-border pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:w-72 transition-all"
            />
          </div>

          {/* Filtros rápidos de regime */}
          {activeTab !== "historico" && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground text-[11px] mr-1 hidden sm:inline">Regime:</span>
              <button
                type="button"
                onClick={() => setFiltroRegime("todos")}
                className={`rounded px-2 py-1 text-[11px] font-medium ${
                  filtroRegime === "todos"
                    ? "bg-surface-2 text-foreground font-semibold border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFiltroRegime("Prioridade")}
                className={`rounded px-2 py-1 text-[11px] font-medium flex items-center gap-1 ${
                  filtroRegime === "Prioridade"
                    ? "bg-danger/15 text-danger border border-danger/30 font-semibold"
                    : "text-muted-foreground hover:text-danger"
                }`}
              >
                <Flame className="size-3 text-danger" />
                Prioridade
              </button>
              <button
                type="button"
                onClick={() => setFiltroRegime("Normal")}
                className={`rounded px-2 py-1 text-[11px] font-medium ${
                  filtroRegime === "Normal"
                    ? "bg-primary/15 text-primary border border-primary/30 font-semibold"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Normal
              </button>

              <div className="h-4 w-px bg-border mx-1" />

              {/* Toggle de Suspensos */}
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-muted-foreground hover:text-foreground select-none">
                <input
                  type="checkbox"
                  checked={incluirSuspensos}
                  onChange={(e) => setIncluirSuspensos(e.target.checked)}
                  className="rounded border-border bg-surface-2 text-accent-amber focus:ring-0 size-3"
                />
                Suspensos
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo Principal conforme a Aba Selecionada */}
      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
            <RefreshCw className="size-8 animate-spin text-accent-amber" />
            <p className="text-sm">Consultando base de Usinagem e Caldeiraria no Dataverse...</p>
          </div>
        ) : (
          <>
            {/* ------------------------------------------------------------- */}
            {/* 1. VISÃO POR ORDEM DE SERVIÇO (Caldeiraria_Pendentes_OS)       */}
            {/* ------------------------------------------------------------- */}
            {activeTab === "por-os" && (
              <div className="flex flex-col gap-4">
                {osAgrupadas.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-surface/50 p-12 text-center text-muted-foreground">
                    <CheckCircle2 className="size-10 text-success/60 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-foreground">Nenhum serviço pendente nesta filial!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Todas as ordens de serviço estão em dia ou foram concluídas.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {osAgrupadas.map((grupo) => (
                      <div
                        key={grupo.os}
                        className={`rounded-xl border p-4 bg-surface shadow-sm transition-all hover:border-accent-amber/50 hover:shadow-md flex flex-col justify-between ${
                          grupo.possuiSuspenso
                            ? "border-warning/40 ring-1 ring-warning/20"
                            : grupo.totalPrioridades > 0
                            ? "border-danger/30"
                            : "border-border"
                        }`}
                      >
                        <div>
                          {/* Cabeçalho do Card da OS */}
                          <div className="flex items-center justify-between border-b border-border pb-2.5 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-base font-black text-foreground tracking-wide">
                                {grupo.os}
                              </span>
                              <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border">
                                {grupo.unidade}
                              </span>
                            </div>

                            {/* Badges de Contagem (Prioridade, Normal, Suspenso) */}
                            <div className="flex items-center gap-1.5">
                              {grupo.possuiSuspenso && (
                                <span
                                  className="rounded bg-warning/15 px-1.5 py-0.5 text-[10px] font-bold text-warning border border-warning/30 flex items-center gap-1"
                                  title="Contém itens suspensos aguardando retorno"
                                >
                                  <AlertTriangle className="size-3" /> Suspenso
                                </span>
                              )}
                              {grupo.totalPrioridades > 0 && (
                                <span
                                  className="rounded bg-danger/15 px-1.5 py-0.5 text-[10px] font-bold text-danger border border-danger/30"
                                  title="Itens com regime de Prioridade"
                                >
                                  {grupo.totalPrioridades} Prioritário{grupo.totalPrioridades > 1 ? "s" : ""}
                                </span>
                              )}
                              <span
                                className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border"
                                title="Itens com regime Normal"
                              >
                                {grupo.totalNormais} Normal
                              </span>
                            </div>
                          </div>

                          {/* Lista de Peças e Serviços daquela OS */}
                          <div className="flex flex-col gap-2 mb-3">
                            {grupo.itens.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => setItemSelecionado(item)}
                                className="group cursor-pointer rounded-lg border border-border bg-surface-2/60 p-2.5 hover:border-accent-amber/40 hover:bg-surface-2 transition-all flex items-start justify-between gap-3"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold text-foreground group-hover:text-accent-amber transition-colors">
                                      {item.pecas}
                                    </span>
                                    {item.regime === "Prioridade" && (
                                      <span className="size-1.5 rounded-full bg-danger" />
                                    )}
                                    {item.status === "Suspenso" && (
                                      <span className="text-[10px] font-bold text-warning">[Suspenso]</span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                                    {item.servicos || "Sem descrição de serviço."}
                                  </p>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="text-[10px] text-muted-foreground block font-mono">
                                    {item.prazo}d prazo
                                  </span>
                                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-accent-amber group-hover:translate-x-0.5 transition-all ml-auto mt-1" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rodapé do Card com Data de Envio */}
                        <div className="flex items-center justify-between pt-2 border-t border-border text-[11px] text-muted-foreground">
                          <span>
                            Total: <strong className="text-foreground">{grupo.itens.length}</strong> peças
                          </span>
                          <span>
                            Desde:{" "}
                            {new Date(grupo.dataMaisAntiga).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 2. FILA DE PEÇAS & PRAZOS (Caldeiraria_Pendentes_Peças)         */}
            {/* ------------------------------------------------------------- */}
            {activeTab === "fila-pecas" && (
              <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border bg-surface-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Ordem de Serviço</th>
                        <th className="px-4 py-3 font-semibold">Peça Mecânica</th>
                        <th className="px-4 py-3 font-semibold">Serviço / Escopo</th>
                        <th className="px-4 py-3 font-semibold">Regime</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Data Envio</th>
                        <th className="px-4 py-3 font-semibold">Prazo / Previsão</th>
                        <th className="px-4 py-3 text-right font-semibold">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filaPecasOrdenada.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-muted-foreground">
                            Nenhuma peça encontrada na fila com os filtros aplicados.
                          </td>
                        </tr>
                      ) : (
                        filaPecasOrdenada.map((item) => {
                          const isAtrasado =
                            item.dataPrazo && new Date(item.dataPrazo).getTime() < Date.now();
                          return (
                            <tr
                              key={item.id}
                              onClick={() => setItemSelecionado(item)}
                              className="group cursor-pointer hover:bg-surface-2 transition-colors"
                            >
                              <td className="px-4 py-3 font-mono font-bold text-foreground">
                                {item.os}
                              </td>
                              <td className="px-4 py-3 font-medium text-foreground group-hover:text-accent-amber">
                                {item.pecas}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                                {item.servicos || "—"}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                                    item.regime === "Prioridade"
                                      ? "bg-danger/15 text-danger border border-danger/30"
                                      : "bg-primary/15 text-primary border border-primary/30"
                                  }`}
                                >
                                  {item.regime}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                                    item.status === "Suspenso"
                                      ? "bg-warning/15 text-warning border border-warning/30"
                                      : "bg-surface-2 text-muted-foreground border border-border"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {item.dataEnvio ? new Date(item.dataEnvio).toLocaleDateString("pt-BR") : "—"}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-col">
                                  <span className={`font-semibold ${isAtrasado ? "text-danger" : "text-foreground"}`}>
                                    {item.dataPrazo ? new Date(item.dataPrazo).toLocaleDateString("pt-BR") : "—"}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    ({item.prazo} dias úteis)
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs text-accent-amber hover:text-accent-amber/80 gap-1"
                                >
                                  <Eye className="size-3.5" /> Abrir
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 3. HISTÓRICO DE CONCLUÍDOS (Controle_Caldeiraria / Histórico)  */}
            {/* ------------------------------------------------------------- */}
            {activeTab === "historico" && (
              <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border bg-surface-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Ordem de Serviço</th>
                        <th className="px-4 py-3 font-semibold">Peça Mecânica</th>
                        <th className="px-4 py-3 font-semibold">Serviço Realizado</th>
                        <th className="px-4 py-3 font-semibold">Responsável Conclusão</th>
                        <th className="px-4 py-3 font-semibold">Data Conclusão</th>
                        <th className="px-4 py-3 font-semibold">Evidência Fotográfica</th>
                        <th className="px-4 py-3 text-right font-semibold">Detalhes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {itensConcluidos.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-muted-foreground">
                            Nenhum serviço concluído registrado no histórico.
                          </td>
                        </tr>
                      ) : (
                        itensConcluidos.map((item) => (
                          <tr
                            key={item.id}
                            onClick={() => setItemSelecionado(item)}
                            className="group cursor-pointer hover:bg-surface-2 transition-colors"
                          >
                            <td className="px-4 py-3 font-mono font-bold text-foreground">
                              {item.os}
                            </td>
                            <td className="px-4 py-3 font-semibold text-foreground group-hover:text-success">
                              {item.pecas}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                              {item.servicos || "—"}
                            </td>
                            <td className="px-4 py-3 text-foreground">
                              {item.concluidoPor || "—"}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {item.dataConclusao
                                ? new Date(item.dataConclusao).toLocaleString("pt-BR")
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              {item.evidencia ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success">
                                  <Check className="size-3.5" /> Foto Anexada
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-[11px]">Sem foto</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                              >
                                Ver Ficha
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modais Operacionais */}
      <NovoServicoModal
        isOpen={isNovoModalOpen}
        onClose={() => setIsNovoModalOpen(false)}
        defaultFilial={filial}
      />

      <DetalhesServicoModal
        isOpen={Boolean(itemSelecionado)}
        onClose={() => setItemSelecionado(null)}
        item={itemSelecionado}
      />

      <PecasCatalogoModal
        isOpen={isCatalogoModalOpen}
        onClose={() => setIsCatalogoModalOpen(false)}
      />
    </div>
  );
}
