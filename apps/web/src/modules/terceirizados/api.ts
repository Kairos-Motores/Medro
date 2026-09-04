import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Terceirizado = {
  id: string;
  titulo: string;
  nOr: string | null;
  peca: string;
  situacao: string;
  empresa: string | null;
  carcaca: string | null;
  fabricante: string | null;
  unidade: string;
  observacao: string | null;
  orcFornecedor: string | null;
  servicos: (string | null)[];
  valores: (string | null)[];
  totalValor: string | null;
  dataRegistro: string | null;
  dataRetorno: string | null;
  previsaoRetorno: string | null;
  dataAprovacaoValor: string | null;
  dataEnvio: string | null;
  avaliacaoRetorno: string | null;
  avaliacaoDescricao: string | null;
  avaliacaoMedida: string | null;
  pendente: boolean;
  createdon: string | null;
  modifiedon: string | null;
};

export type TerceirizadosKpis = {
  totalPendentes: number;
  emergenciais: number;
  atrasados: number;
  retornaram7d: number;
  valorPendente: number;
};

export type TerceirizadosFilter = {
  filial?: string;
  status?: "pendentes" | "historico" | "todos";
  situacao?: "Emergencial" | "Normal";
  search?: string;
  order?: "asc" | "desc";
};

/** Peças e situações (espelham o option set do Dataverse). */
export const PECA_OPCOES = [
  "Tampa LA", "Tampa LOA", "Eixo", "Rosca do olhal", "Caixa de Ligação", "Anel coletor",
  "Armadura de freio", "Estator", "Anel de fixação", "Defletora", "Bobina", "Ventilador",
  "Pino", "Parafuso", "Acoplamento", "Anel Labirinto", "Caixa Metálica", "Porta Escova",
  "Tapes", "Rosca", "Peça",
];
export const EMPRESA_SUGESTOES = [
  "Torneadora Ágape", "Santo Antônio", "Gefferssom", "Antônio Jateamento", "Rubenilson",
  "Sítio/ Maracujá",
];

// ---------------------------------------------------------------------------
// Fallback local (backend offline) — igual ao padrão da Caldeiraria
// ---------------------------------------------------------------------------
const h = (n: number) => new Date(Date.now() - n * 3600 * 1000).toISOString();
function seed(p: Partial<Terceirizado> & { id: string; titulo: string }): Terceirizado {
  return {
    nOr: null, peca: "Eixo", situacao: "Normal", empresa: "Torneadora Ágape", carcaca: null,
    fabricante: null, unidade: "São Luís", observacao: null, orcFornecedor: null,
    servicos: [null, null, null, null, null], valores: [null, null, null, null, null],
    totalValor: null, dataRegistro: null, dataRetorno: null, previsaoRetorno: null,
    dataAprovacaoValor: null, dataEnvio: null, avaliacaoRetorno: null, avaliacaoDescricao: null,
    avaliacaoMedida: null, pendente: true, createdon: h(0), modifiedon: h(0), ...p,
  };
}
let FALLBACK: Terceirizado[] = [
  seed({ id: "terc-1", titulo: "4821-AL", nOr: "OR-10233", peca: "Eixo", situacao: "Emergencial",
    empresa: "Torneadora Ágape", carcaca: "355 M/L", fabricante: "WEG", orcFornecedor: "R$ 4.800,00",
    servicos: ["Cromagem dura da ponta de eixo", "Retífica de sede de rolamento", null, null, null],
    valores: ["3200", "1600", null, null, null], totalValor: "4800",
    dataRegistro: h(72), previsaoRetorno: h(-96), dataEnvio: h(72), createdon: h(72), modifiedon: h(72) }),
  seed({ id: "terc-2", titulo: "4790-PA", nOr: "OR-10240", peca: "Caixa de Ligação", situacao: "Normal",
    empresa: "Antônio Jateamento", carcaca: "250 S/M", fabricante: "Siemens", orcFornecedor: "R$ 950,00",
    servicos: ["Jateamento e pintura eletrostática", null, null, null, null],
    valores: ["950", null, null, null, null], totalValor: "950",
    dataRegistro: h(120), previsaoRetorno: h(-24), dataEnvio: h(120), createdon: h(120), modifiedon: h(120) }),
  seed({ id: "terc-3", titulo: "4712-AL", nOr: "OR-10190", peca: "Ventilador", situacao: "Normal",
    empresa: "Gefferssom", carcaca: "200 L", fabricante: "WEG", orcFornecedor: "R$ 700,00",
    servicos: ["Balanceamento dinâmico do ventilador metálico", null, null, null, null],
    valores: ["700", null, null, null, null], totalValor: "700",
    dataRegistro: h(240), dataRetorno: h(48), previsaoRetorno: h(96), dataEnvio: h(240),
    avaliacaoRetorno: "Aprovado", avaliacaoDescricao: "Vibração dentro da norma ISO 10816.",
    pendente: false, createdon: h(240), modifiedon: h(48) }),
];

function applyFilter(items: Terceirizado[], f: TerceirizadosFilter): Terceirizado[] {
  let out = [...items];
  if (f.filial && f.filial !== "Todas")
    out = out.filter((i) => i.unidade.toLowerCase() === f.filial!.toLowerCase());
  if (f.status === "pendentes") out = out.filter((i) => i.pendente);
  else if (f.status === "historico") out = out.filter((i) => !i.pendente);
  if (f.situacao) out = out.filter((i) => i.situacao === f.situacao);
  if (f.search) {
    const s = f.search.toLowerCase();
    out = out.filter(
      (i) =>
        (i.nOr ?? "").toLowerCase().includes(s) ||
        i.titulo.toLowerCase().includes(s) ||
        (i.empresa ?? "").toLowerCase().includes(s) ||
        (i.fabricante ?? "").toLowerCase().includes(s),
    );
  }
  out.sort((a, b) => {
    const d = new Date(a.createdon ?? 0).getTime() - new Date(b.createdon ?? 0).getTime();
    return f.order === "asc" ? d : -d;
  });
  return out;
}

// ---------------------------------------------------------------------------
// Hooks React Query
// ---------------------------------------------------------------------------
const keys = {
  all: ["terceirizados"] as const,
  list: (f: TerceirizadosFilter) => ["terceirizados", "list", f] as const,
  one: (id: string) => ["terceirizados", "one", id] as const,
  kpis: (filial?: string) => ["terceirizados", "kpis", filial ?? "todas"] as const,
};

export function useTerceirizados(filter: TerceirizadosFilter) {
  return useQuery({
    queryKey: keys.list(filter),
    queryFn: async () => {
      const p = new URLSearchParams();
      if (filter.filial && filter.filial !== "Todas") p.set("filial", filter.filial);
      if (filter.status) p.set("status", filter.status);
      if (filter.situacao) p.set("situacao", filter.situacao);
      if (filter.search) p.set("search", filter.search);
      if (filter.order) p.set("order", filter.order);
      try {
        return await api<{ items: Terceirizado[]; fromDataverse: boolean }>(
          `/terceirizados?${p.toString()}`,
        );
      } catch {
        return { items: applyFilter(FALLBACK, filter), fromDataverse: false };
      }
    },
    refetchInterval: 20_000,
  });
}

export function useTerceirizadosKpis(filial?: string) {
  return useQuery({
    queryKey: keys.kpis(filial),
    queryFn: async () => {
      const p = new URLSearchParams();
      if (filial && filial !== "Todas") p.set("filial", filial);
      try {
        return await api<TerceirizadosKpis>(`/terceirizados/kpis?${p.toString()}`);
      } catch {
        const scope = applyFilter(FALLBACK, { filial, status: "todos" });
        const pend = scope.filter((i) => i.pendente);
        const now = Date.now();
        return {
          totalPendentes: pend.length,
          emergenciais: pend.filter((i) => i.situacao === "Emergencial").length,
          atrasados: pend.filter(
            (i) => i.previsaoRetorno && new Date(i.previsaoRetorno).getTime() < now,
          ).length,
          retornaram7d: scope.filter(
            (i) => i.dataRetorno && new Date(i.dataRetorno).getTime() >= now - 7 * 864e5,
          ).length,
          valorPendente: pend.reduce(
            (a, i) => a + (Number(String(i.totalValor ?? "").replace(/[^0-9.,-]/g, "").replace(",", ".")) || 0),
            0,
          ),
        } satisfies TerceirizadosKpis;
      }
    },
    refetchInterval: 20_000,
  });
}

export type CreateTerceirizadoInput = {
  titulo: string;
  nOr?: string;
  peca?: string;
  situacao?: "Emergencial" | "Normal";
  empresa?: string;
  carcaca?: string;
  fabricante?: string;
  unidade?: string;
  observacao?: string;
  previsaoRetorno?: string;
  dataRegistro?: string;
  servicos?: (string | null)[];
};

export function useCreateTerceirizado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTerceirizadoInput) => {
      try {
        return await api<Terceirizado>("/terceirizados", { method: "POST", body: data });
      } catch {
        const row = seed({
          id: `terc-${Date.now()}`,
          titulo: data.titulo,
          nOr: data.nOr || null,
          peca: data.peca || "Peça",
          situacao: data.situacao || "Normal",
          empresa: data.empresa || null,
          carcaca: data.carcaca || null,
          fabricante: data.fabricante || null,
          unidade: data.unidade || "São Luís",
          observacao: data.observacao || null,
          previsaoRetorno: data.previsaoRetorno || null,
          dataRegistro: data.dataRegistro || new Date().toISOString(),
          servicos: [0, 1, 2, 3, 4].map((i) => data.servicos?.[i] || null),
          dataEnvio: new Date().toISOString(),
        });
        FALLBACK.unshift(row);
        return row;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export type UpdateTerceirizadoInput = Partial<{
  nOr: string;
  peca: string;
  situacao: "Emergencial" | "Normal";
  empresa: string;
  carcaca: string;
  fabricante: string;
  observacao: string;
  orcFornecedor: string;
  servicos: (string | null)[];
  valores: (string | null)[];
  totalValor: string;
  dataRegistro: string;
  dataRetorno: string;
  previsaoRetorno: string;
  dataAprovacaoValor: string;
  avaliacaoRetorno: string;
  avaliacaoDescricao: string;
  avaliacaoMedida: string;
}>;

export function useUpdateTerceirizado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTerceirizadoInput }) => {
      try {
        return await api<Terceirizado>(`/terceirizados/${id}`, { method: "PATCH", body: data });
      } catch {
        const idx = FALLBACK.findIndex((i) => i.id === id);
        if (idx === -1) throw new Error("Registro não encontrado");
        const cur = FALLBACK[idx]!;
        const next: Terceirizado = {
          ...cur,
          ...data,
          servicos: data.servicos ? cur.servicos.map((s, i) => data.servicos![i] ?? s) : cur.servicos,
          valores: data.valores ? cur.valores.map((v, i) => data.valores![i] ?? v) : cur.valores,
          modifiedon: new Date().toISOString(),
        } as Terceirizado;
        next.pendente = !next.dataRetorno;
        FALLBACK[idx] = next;
        return next;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useDeleteTerceirizado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await api<{ success: boolean }>(`/terceirizados/${id}`, { method: "DELETE" });
      } catch {
        FALLBACK = FALLBACK.filter((i) => i.id !== id);
        return { success: true };
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
