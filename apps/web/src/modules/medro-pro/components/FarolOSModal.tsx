import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Search,
  Calendar,
  RotateCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Building2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { CarcacaEquiv, GrupoPorte, FarolConfig } from "../types";

interface FarolOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RawOSRow {
  "OS Kairos"?: string;
  Filial?: string;
  "Nome Cliente"?: string;
  Equipamento?: string;
  Carcaca?: string;
  Tensao?: string;
  CV?: string;
  KW?: string;
  "Dt Recebimento"?: string;
  "DT Autoriza"?: string;
  "Prazo Contra"?: string;
  "Dt Entreg Eq"?: string;
  "Desc Servico"?: string;
  "TAG Kairos"?: string;
  [key: string]: any;
}

interface EnrichedOSRow extends RawOSRow {
  carcacaEquivalente: string;
  classePorte: string;
  statusFarol: "No Prazo" | "Atenção" | "Crítico" | "Sem Aprovação";
  dtLimite: string;
  diasRestantes: number | null;
}

function parsePtBrDate(dateStr?: string): Date | null {
  if (!dateStr || typeof dateStr !== "string") return null;
  const clean = dateStr.trim();
  const parts = clean.split("/");
  if (parts.length === 3) {
    const d = parseInt(parts[0]!, 10);
    const m = parseInt(parts[1]!, 10) - 1;
    const y = parseInt(parts[2]!, 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
      return new Date(y, m, d);
    }
  }
  const iso = new Date(clean);
  return isNaN(iso.getTime()) ? null : iso;
}

function formatDatePtBr(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export function FarolOSModal({ isOpen, onClose }: FarolOSModalProps) {
  const [data, setData] = useState<EnrichedOSRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filialFilter, setFilialFilter] = useState("TODAS");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [dateFilter, setDateFilter] = useState("");

  const [sortConfig, setSortConfig] = useState<{
    key: keyof EnrichedOSRow;
    direction: "asc" | "desc";
  } | null>({ key: "Dt Recebimento", direction: "desc" });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async (force = false) => {
    setLoading(true);
    setError("");

    try {
      // 1. Carrega parâmetros de carcaças e grupos do localStorage
      let carcacasList: CarcacaEquiv[] = [];
      try {
        const stored = localStorage.getItem("medro_carcacas");
        if (stored) carcacasList = JSON.parse(stored);
      } catch {}

      const carcacasMap = new Map<string, string>();
      carcacasList.forEach((c) => {
        if (c.original && c.equivalente) {
          carcacasMap.set(c.original.toUpperCase().trim(), c.equivalente.toUpperCase().trim());
        }
      });

      let gruposList: GrupoPorte[] = [];
      try {
        const stored = localStorage.getItem("medro_grupos_porte");
        if (stored) gruposList = JSON.parse(stored);
      } catch {}

      let farolConfig: FarolConfig = { diasNoPrazo: 3, diasAtencao: 1, crCritico: 0.8, crAlerta: 1.0 };
      try {
        const stored = localStorage.getItem("medro_farol_config");
        if (stored) farolConfig = JSON.parse(stored);
      } catch {}

      // 2. Busca dados da API do Medro Pro (Extraídos do Dataverse cr4a1_zb6_relatorios)
      const endpoint = force ? "/medro-pro/bases/farol-os?refresh=true" : "/medro-pro/bases/farol-os";
      const res = await api<{ status: string; data: RawOSRow[] }>(endpoint);
      const rawRows = res?.data || [];

      // 3. Enriquece com regras de negócio e cálculo de Farol
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const enriched: EnrichedOSRow[] = rawRows.map((row) => {
        const carcacaOrig = String(row["Carcaca"] || "").toUpperCase().trim();
        const equiv = carcacaOrig && carcacaOrig !== "-" ? (carcacasMap.get(carcacaOrig) || carcacaOrig) : "-";

        // Classificação de porte
        let classe = "-";
        const tensaoStr = String(row["Tensao"] || "").toUpperCase();
        const numTensao = parseInt(tensaoStr.replace(/\D/g, ""), 10);
        const isAT = tensaoStr.includes("KV") || (numTensao && numTensao > 1000);

        const matchNum = equiv.match(/\d+/);
        if (matchNum) {
          const valNum = parseInt(matchNum[0]!, 10);
          for (const g of gruposList) {
            const rangeMatch = g.faixaCarcaca?.match(/(\d+)\s*-\s*(\d+)/);
            if (rangeMatch) {
              const min = parseInt(rangeMatch[1]!, 10);
              const max = parseInt(rangeMatch[2]!, 10);
              if (valNum >= min && valNum <= max) {
                if ((isAT && g.tensao === "AT") || (!isAT && g.tensao === "BT")) {
                  classe = g.nome;
                  break;
                }
              }
            }
          }
        }
        if (classe === "-") {
          // Fallback padrão se não houver match no grupo configurado
          classe = isAT ? "AT Média/Alta" : "BT Médio";
        }

        // Cálculo do Farol Projetado
        const dtAutorizaStr = row["DT Autoriza"]?.trim();
        const prazoContraStr = row["Prazo Contra"]?.trim();
        let statusFarol: "No Prazo" | "Atenção" | "Crítico" | "Sem Aprovação" = "Sem Aprovação";
        let dtLimiteStr = "-";
        let diasRestantes: number | null = null;

        if (dtAutorizaStr) {
          const dtAutoriza = parsePtBrDate(dtAutorizaStr);
          const prazoDias = parseFloat(prazoContraStr || "0");

          if (dtAutoriza && !isNaN(prazoDias)) {
            const dtLimite = new Date(dtAutoriza.getTime() + prazoDias * 86400000);
            dtLimiteStr = formatDatePtBr(dtLimite);

            const diffMs = dtLimite.getTime() - hoje.getTime();
            diasRestantes = Math.round(diffMs / 86400000);

            if (diasRestantes < 0) {
              statusFarol = "Crítico";
            } else if (diasRestantes <= farolConfig.diasAtencao) {
              statusFarol = "Atenção";
            } else {
              statusFarol = "No Prazo";
            }
          }
        }

        return {
          ...row,
          carcacaEquivalente: equiv,
          classePorte: classe,
          statusFarol,
          dtLimite: dtLimiteStr,
          diasRestantes,
        };
      });

      setData(enriched);
    } catch (err: any) {
      setError(err?.message || "Erro ao consultar a base Farol de OS.");
    } finally {
      setLoading(false);
    }
  };

  // Filtragem
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Busca geral
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        String(row["OS Kairos"] || "").toLowerCase().includes(term) ||
        String(row["Nome Cliente"] || "").toLowerCase().includes(term) ||
        String(row["Equipamento"] || "").toLowerCase().includes(term) ||
        String(row["TAG Kairos"] || "").toLowerCase().includes(term);

      // Filtro filial
      const matchFilial =
        filialFilter === "TODAS" ||
        String(row["Filial"] || "").toUpperCase() === filialFilter.toUpperCase();

      // Filtro status farol
      const matchStatus =
        statusFilter === "TODOS" || row.statusFarol === statusFilter;

      // Filtro de data
      let matchDate = true;
      if (dateFilter) {
        const dtRec = String(row["Dt Recebimento"] || "");
        const dtLim = String(row.dtLimite || "");
        matchDate = dtRec.includes(dateFilter) || dtLim.includes(dateFilter);
      }

      return matchSearch && matchFilial && matchStatus && matchDate;
    });
  }, [data, searchTerm, filialFilter, statusFilter, dateFilter]);

  // Ordenação precisa e robusta sobre toda a base de dados
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const key = sortConfig.key;
      const valA = a[key] ?? "";
      const valB = b[key] ?? "";

      // 1. Tratamento de Datas (Dt Recebimento, DT Autoriza, dtLimite)
      if (key === "Dt Recebimento" || key === "DT Autoriza" || key === "dtLimite") {
        const timeA = parsePtBrDate(String(valA))?.getTime() ?? 0;
        const timeB = parsePtBrDate(String(valB))?.getTime() ?? 0;
        if (timeA !== timeB) {
          return sortConfig.direction === "asc" ? timeA - timeB : timeB - timeA;
        }
        return 0;
      }

      // 2. Tratamento de Status Farol (Prioridade de criticidade)
      if (key === "statusFarol") {
        const priority: Record<string, number> = {
          "Crítico": 1,
          "Atenção": 2,
          "Sem Aprovação": 3,
          "No Prazo": 4,
        };
        const pA = priority[String(valA)] ?? 99;
        const pB = priority[String(valB)] ?? 99;
        if (pA !== pB) {
          return sortConfig.direction === "asc" ? pA - pB : pB - pA;
        }
        return 0;
      }

      // 3. Tratamento de Prazo (Dias) ou números puros
      if (key === "Prazo Contra") {
        const numA = parseInt(String(valA).replace(/\D/g, ""), 10) || 0;
        const numB = parseInt(String(valB).replace(/\D/g, ""), 10) || 0;
        return sortConfig.direction === "asc" ? numA - numB : numB - numA;
      }

      // 4. Tratamento de OS Kairós (ordenação alfanumérica natural: 1, 2, 10, 100)
      if (key === "OS Kairos") {
        const res = String(valA).localeCompare(String(valB), "pt-BR", { numeric: true, sensitivity: "base" });
        return sortConfig.direction === "asc" ? res : -res;
      }

      // 5. Tratamento de texto geral (Filial, Cliente, Equipamento, Carcaça, Tensão)
      const res = String(valA).localeCompare(String(valB), "pt-BR", { sensitivity: "base" });
      return sortConfig.direction === "asc" ? res : -res;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const handleSort = (key: keyof EnrichedOSRow) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Sempre reinicia na primeira página ao ordenar
  };

  // Paginação
  const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filialFilter, statusFilter, dateFilter]);

  // Contagens dos Faróis
  const stats = useMemo(() => {
    return {
      total: data.length,
      noPrazo: data.filter((d) => d.statusFarol === "No Prazo").length,
      atencao: data.filter((d) => d.statusFarol === "Atenção").length,
      critico: data.filter((d) => d.statusFarol === "Crítico").length,
      semAprovacao: data.filter((d) => d.statusFarol === "Sem Aprovação").length,
    };
  }, [data]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-bg text-foreground animate-in fade-in duration-150 overflow-hidden">
      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between border-b border-border bg-surface/90 px-4 py-2.5 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-accent-indigo text-white shadow-sm">
            <Clock className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
                Farol de OS — Acompanhamento Projetado
              </h2>
              <span className="rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                Dataverse · ZB6
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Monitoramento operacional direto do Dataverse (cr4a1_zb6_relatorios) com cálculo de prazos e carcaças
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="neutral"
            size="sm"
            onClick={() => fetchData(true)}
            disabled={loading}
            className="h-7 px-2.5 text-xs gap-1.5 border-border"
          >
            <RotateCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Sincronizando..." : "Atualizar Base"}</span>
          </Button>

          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
            title="Fechar"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>

      {/* Farol Counter Summary Cards (Slim Bar) */}
      <div className="grid grid-cols-2 gap-2 border-b border-border bg-surface/40 px-4 py-2 sm:grid-cols-5 shrink-0">
        <div className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-surface/80 px-2.5 py-1.5 shadow-sm">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Building2 className="size-3.5" />
          </div>
          <div className="min-w-0">
            <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground">Total OS</span>
            <p className="text-xs font-bold text-foreground leading-tight">{stats.total}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border border-accent-green/30 bg-accent-green/10 px-2.5 py-1.5 shadow-sm">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent-green/20 text-accent-green">
            <CheckCircle2 className="size-3.5" />
          </div>
          <div className="min-w-0">
            <span className="block text-[9px] font-medium uppercase tracking-wider text-accent-green">No Prazo</span>
            <p className="text-xs font-bold text-accent-green leading-tight">{stats.noPrazo}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-2.5 py-1.5 shadow-sm">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent-amber/20 text-accent-amber">
            <AlertTriangle className="size-3.5" />
          </div>
          <div className="min-w-0">
            <span className="block text-[9px] font-medium uppercase tracking-wider text-accent-amber">Atenção</span>
            <p className="text-xs font-bold text-accent-amber leading-tight">{stats.atencao}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border border-accent-rose/30 bg-accent-rose/10 px-2.5 py-1.5 shadow-sm">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent-rose/20 text-accent-rose">
            <AlertTriangle className="size-3.5" />
          </div>
          <div className="min-w-0">
            <span className="block text-[9px] font-medium uppercase tracking-wider text-accent-rose">Crítico</span>
            <p className="text-xs font-bold text-accent-rose leading-tight">{stats.critico}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-surface-2/60 px-2.5 py-1.5 shadow-sm">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-border text-muted-foreground">
            <HelpCircle className="size-3.5" />
          </div>
          <div className="min-w-0">
            <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground">S/ Aprovação</span>
            <p className="text-xs font-bold text-muted-foreground leading-tight">{stats.semAprovacao}</p>
          </div>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-border bg-surface px-4 py-2 shrink-0">
        {/* Search */}
        <div className="relative min-w-[180px] flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar OS, cliente, equipamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-7 pl-7 text-xs"
          />
        </div>

        {/* Filial */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">Filial:</span>
          <select
            value={filialFilter}
            onChange={(e) => setFilialFilter(e.target.value)}
            className="h-7 rounded-md border border-border bg-surface px-2 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="TODAS">Todas as Filiais</option>
            <option value="São Luís">São Luís</option>
            <option value="Barcarena">Barcarena</option>
            <option value="Parauapebas">Parauapebas</option>
            <option value="São José dos Campos">São José dos Campos</option>
          </select>
        </div>

        {/* Status Farol */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">Farol:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-7 rounded-md border border-border bg-surface px-2 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="No Prazo">No Prazo</option>
            <option value="Atenção">Atenção</option>
            <option value="Crítico">Crítico</option>
            <option value="Sem Aprovação">Sem Aprovação</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1.5">
          <Calendar className="size-3 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Data (DD/MM/AAAA)..."
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-7 w-36 text-xs font-mono"
          />
        </div>

        <div className="ml-auto text-[11px] text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{sortedData.length}</span> ordens filtradas
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden p-2.5 sm:p-4">
        {loading && data.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
            <RotateCw className="size-8 animate-spin text-primary mb-3" />
            <p className="text-sm font-medium">Carregando base do Farol de OS...</p>
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center text-accent-rose">
            <AlertTriangle className="size-8 mb-2" />
            <p className="text-sm font-semibold">{error}</p>
            <Button variant="neutral" size="sm" onClick={() => fetchData(true)} className="mt-4">
              Tentar Novamente
            </Button>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
            <Filter className="size-8 mb-2 opacity-50" />
            <p className="text-sm">Nenhuma ordem de serviço corresponde aos filtros aplicados.</p>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="flex-1 min-h-0 overflow-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="border-b border-border bg-surface-2/90 text-[11px] uppercase tracking-wider text-muted-foreground sticky top-0 z-10 backdrop-blur-sm">
                  <tr>
                    {/* 1. Filial */}
                    <th
                      className="cursor-pointer px-3.5 py-2.5 font-semibold hover:text-foreground transition-colors"
                      onClick={() => handleSort("Filial")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Filial</span>
                        {sortConfig?.key === "Filial" ? (
                          sortConfig.direction === "asc" ? <ArrowUp className="size-3 text-primary" /> : <ArrowDown className="size-3 text-primary" />
                        ) : (
                          <ArrowUpDown className="size-3 opacity-40" />
                        )}
                      </div>
                    </th>

                    {/* 2. OS Kairós */}
                    <th
                      className="cursor-pointer px-3.5 py-2.5 font-semibold hover:text-foreground transition-colors"
                      onClick={() => handleSort("OS Kairos")}
                    >
                      <div className="flex items-center gap-1">
                        <span>OS Kairós</span>
                        {sortConfig?.key === "OS Kairos" ? (
                          sortConfig.direction === "asc" ? <ArrowUp className="size-3 text-primary" /> : <ArrowDown className="size-3 text-primary" />
                        ) : (
                          <ArrowUpDown className="size-3 opacity-40" />
                        )}
                      </div>
                    </th>

                    {/* 3. Dt Recebimento */}
                    <th
                      className="cursor-pointer px-3.5 py-2.5 font-semibold hover:text-foreground transition-colors"
                      onClick={() => handleSort("Dt Recebimento")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Dt Recebimento</span>
                        {sortConfig?.key === "Dt Recebimento" ? (
                          sortConfig.direction === "asc" ? <ArrowUp className="size-3 text-primary" /> : <ArrowDown className="size-3 text-primary" />
                        ) : (
                          <ArrowUpDown className="size-3 opacity-40" />
                        )}
                      </div>
                    </th>

                    {/* 4. Status Farol */}
                    <th
                      className="cursor-pointer px-3.5 py-2.5 font-semibold hover:text-foreground transition-colors"
                      onClick={() => handleSort("statusFarol")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Status Farol</span>
                        {sortConfig?.key === "statusFarol" ? (
                          sortConfig.direction === "asc" ? <ArrowUp className="size-3 text-primary" /> : <ArrowDown className="size-3 text-primary" />
                        ) : (
                          <ArrowUpDown className="size-3 opacity-40" />
                        )}
                      </div>
                    </th>

                    {/* 5. Cliente */}
                    <th
                      className="cursor-pointer px-3.5 py-2.5 font-semibold hover:text-foreground transition-colors"
                      onClick={() => handleSort("Nome Cliente")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Cliente</span>
                        {sortConfig?.key === "Nome Cliente" ? (
                          sortConfig.direction === "asc" ? <ArrowUp className="size-3 text-primary" /> : <ArrowDown className="size-3 text-primary" />
                        ) : (
                          <ArrowUpDown className="size-3 opacity-40" />
                        )}
                      </div>
                    </th>

                    {/* 6. Equipamento */}
                    <th className="px-3.5 py-2.5 font-semibold">Equipamento</th>

                    {/* 7. Carcaça */}
                    <th className="px-3.5 py-2.5 font-semibold">Carcaça</th>

                    {/* 8. Carcaça Equiv. */}
                    <th className="px-3.5 py-2.5 font-semibold">Carcaça Equiv.</th>

                    {/* 9. Porte Motor */}
                    <th className="px-3.5 py-2.5 font-semibold">Porte Motor</th>

                    {/* 10. Tensão */}
                    <th className="px-3.5 py-2.5 font-semibold">Tensão</th>

                    {/* 11. CV / KW */}
                    <th className="px-3.5 py-2.5 font-semibold">CV / KW</th>

                    {/* 12. DT Autoriza */}
                    <th
                      className="cursor-pointer px-3.5 py-2.5 font-semibold hover:text-foreground transition-colors"
                      onClick={() => handleSort("DT Autoriza")}
                    >
                      <div className="flex items-center gap-1">
                        <span>DT Autoriza</span>
                        {sortConfig?.key === "DT Autoriza" ? (
                          sortConfig.direction === "asc" ? <ArrowUp className="size-3 text-primary" /> : <ArrowDown className="size-3 text-primary" />
                        ) : (
                          <ArrowUpDown className="size-3 opacity-40" />
                        )}
                      </div>
                    </th>

                    {/* 13. Prazo (Dias) */}
                    <th
                      className="cursor-pointer px-3.5 py-2.5 font-semibold hover:text-foreground transition-colors"
                      onClick={() => handleSort("Prazo Contra")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Prazo (Dias)</span>
                        {sortConfig?.key === "Prazo Contra" ? (
                          sortConfig.direction === "asc" ? <ArrowUp className="size-3 text-primary" /> : <ArrowDown className="size-3 text-primary" />
                        ) : (
                          <ArrowUpDown className="size-3 opacity-40" />
                        )}
                      </div>
                    </th>

                    {/* 14. Data Limite */}
                    <th
                      className="cursor-pointer px-3.5 py-2.5 font-semibold hover:text-foreground transition-colors"
                      onClick={() => handleSort("dtLimite")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Data Limite</span>
                        {sortConfig?.key === "dtLimite" ? (
                          sortConfig.direction === "asc" ? <ArrowUp className="size-3 text-primary" /> : <ArrowDown className="size-3 text-primary" />
                        ) : (
                          <ArrowUpDown className="size-3 opacity-40" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedData.map((row, idx) => {
                    const isCrit = row.statusFarol === "Crítico";
                    const isAtencao = row.statusFarol === "Atenção";
                    const isNoPrazo = row.statusFarol === "No Prazo";

                    return (
                      <tr
                        key={idx}
                        className={`transition-colors hover:bg-surface-2/40 ${
                          isCrit ? "bg-accent-rose/5" : ""
                        }`}
                      >
                        {/* 1. Filial */}
                        <td className="px-3.5 py-2 font-medium text-foreground">
                          {row["Filial"] || "-"}
                        </td>

                        {/* 2. OS Kairos */}
                        <td className="px-3.5 py-2 font-mono font-bold text-foreground">
                          {row["OS Kairos"] || "-"}
                        </td>

                        {/* 3. Dt Recebimento */}
                        <td className="px-3.5 py-2 font-mono text-muted-foreground">
                          {row["Dt Recebimento"] || "-"}
                        </td>

                        {/* 4. Status Farol Badge */}
                        <td className="px-3.5 py-2">
                          {isNoPrazo && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-green/30 bg-accent-green/15 px-2 py-0.5 text-[10px] font-semibold text-accent-green">
                              <span className="size-1.5 rounded-full bg-accent-green animate-pulse" />
                              No Prazo
                            </span>
                          )}
                          {isAtencao && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-amber/30 bg-accent-amber/15 px-2 py-0.5 text-[10px] font-semibold text-accent-amber">
                              <span className="size-1.5 rounded-full bg-accent-amber" />
                              Atenção ({row.diasRestantes}d)
                            </span>
                          )}
                          {isCrit && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-rose/30 bg-accent-rose/15 px-2 py-0.5 text-[10px] font-semibold text-accent-rose">
                              <span className="size-1.5 rounded-full bg-accent-rose" />
                              Crítico ({Math.abs(row.diasRestantes || 0)}d atraso)
                            </span>
                          )}
                          {!isNoPrazo && !isAtencao && !isCrit && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              Sem Aprovação
                            </span>
                          )}
                        </td>

                        {/* 5. Cliente */}
                        <td className="px-3.5 py-2 max-w-[200px] truncate text-foreground font-medium" title={row["Nome Cliente"]}>
                          {row["Nome Cliente"] || "-"}
                        </td>

                        {/* 6. Equipamento */}
                        <td className="px-3.5 py-2 max-w-[220px] truncate text-muted-foreground" title={row["Equipamento"]}>
                          {row["Equipamento"] || "-"}
                        </td>

                        {/* 7. Carcaça Original */}
                        <td className="px-3.5 py-2 font-mono text-muted-foreground">
                          {row["Carcaca"] || "-"}
                        </td>

                        {/* 8. Carcaça Equivalente */}
                        <td className="px-3.5 py-2 font-mono font-semibold text-primary">
                          {row.carcacaEquivalente || "-"}
                        </td>

                        {/* 9. Classe de Porte */}
                        <td className="px-3.5 py-2">
                          <span className="rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                            {row.classePorte}
                          </span>
                        </td>

                        {/* 10. Tensão */}
                        <td className="px-3.5 py-2 font-mono text-muted-foreground">
                          {row["Tensao"] || "-"}
                        </td>

                        {/* 11. CV / KW */}
                        <td className="px-3.5 py-2 font-mono text-muted-foreground">
                          {row["CV"] ? `${row["CV"]} CV` : row["KW"] ? `${row["KW"]} KW` : "-"}
                        </td>

                        {/* 12. DT Autoriza */}
                        <td className="px-3.5 py-2 font-mono text-muted-foreground">
                          {row["DT Autoriza"] || "-"}
                        </td>

                        {/* 13. Prazo (Dias) */}
                        <td className="px-3.5 py-2 font-mono text-center text-foreground font-semibold">
                          {row["Prazo Contra"] ? `${row["Prazo Contra"]}d` : "-"}
                        </td>

                        {/* 14. Data Limite */}
                        <td className="px-3.5 py-2 font-mono font-bold text-foreground">
                          {row.dtLimite}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-2 text-xs text-muted-foreground shrink-0">
              <div>
                Mostrando{" "}
                <span className="font-semibold text-foreground">
                  {sortedData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}
                </span>{" "}
                a{" "}
                <span className="font-semibold text-foreground">
                  {Math.min(sortedData.length, currentPage * rowsPerPage)}
                </span>{" "}
                de <span className="font-semibold text-foreground">{sortedData.length}</span> ordens
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-6 px-2 text-xs"
                >
                  Anterior
                </Button>
                <span className="font-medium text-foreground px-1 text-xs">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-6 px-2 text-xs"
                >
                  Próxima
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
