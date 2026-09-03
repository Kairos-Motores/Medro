import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CaldeirariaItem {
  id: string;
  os: string;
  pecas: string;
  servicos: string | null;
  prazo: number | null;
  regime: "Normal" | "Prioridade" | string;
  status: "Pendente" | "Concluído" | "Suspenso" | string;
  xxStatus: string | null;
  unidade: string;
  inseridoPor: string | null;
  concluidoPor: string | null;
  dataEnvio: string | null;
  dataPrazo: string | null;
  dataConclusao: string | null;
  dataModificacao: string | null;
  comentario: string | null;
  imagemReferencia: string | null;
  evidencia: string | null;
  createdon: string | null;
  modifiedon: string | null;
}

export interface CaldeirariaPeca {
  id: string;
  pecas: string;
}

export interface CaldeirariaKpis {
  totalPendentes: number;
  totalPrioridade: number;
  totalSuspensos: number;
  totalConcluidos: number;
  totalOSComPendencia: number;
  concluidosNoPrazoPercent: number;
}

export type CaldeirariaFilter = {
  filial?: string;
  status?: "todos" | "pendentes" | "concluidos" | "suspensos";
  regime?: "Normal" | "Prioridade";
  os?: string;
  search?: string;
};

// -------------------------------------------------------------
// Sementes operacionais realistas para quando o backend estiver offline
// -------------------------------------------------------------
const FALLBACK_PECAS: CaldeirariaPeca[] = [
  { id: "peca-1", pecas: "Eixo Rotor Principal" },
  { id: "peca-2", pecas: "Tampa Dianteira (DE)" },
  { id: "peca-3", pecas: "Tampa Traseira (NDE)" },
  { id: "peca-4", pecas: "Carcaça Estator" },
  { id: "peca-5", pecas: "Caixa de Ligação Principal" },
  { id: "peca-6", pecas: "Defletor de Ar Externo" },
  { id: "peca-7", pecas: "Alojamento de Mancal DE" },
  { id: "peca-8", pecas: "Alojamento de Mancal NDE" },
  { id: "peca-9", pecas: "Ventilador Metálico" },
  { id: "peca-10", pecas: "Flange de Fixação" },
  { id: "peca-11", pecas: "Base de Suporte Metálica" },
];

let FALLBACK_ITENS: CaldeirariaItem[] = [
  {
    id: "cald-101",
    os: "2026-4821",
    pecas: "Tampa Dianteira (DE)",
    servicos: "Recuperação por solda e usinagem de precisão do alojamento de rolamento 6318. Tolerância H7.",
    prazo: 3,
    regime: "Prioridade",
    status: "Pendente",
    xxStatus: "Ativo",
    unidade: "São Luís",
    inseridoPor: "Carlos Eduardo Silva",
    concluidoPor: null,
    dataEnvio: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    dataPrazo: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    dataConclusao: null,
    dataModificacao: null,
    comentario: "Cliente solicitou urgência devido a parada de fábrica no sábado.",
    imagemReferencia: null,
    evidencia: null,
    createdon: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    modifiedon: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "cald-102",
    os: "2026-4821",
    pecas: "Eixo Rotor Principal",
    servicos: "Cromagem dura e retífica da ponta de eixo para acoplamento rígido.",
    prazo: 4,
    regime: "Prioridade",
    status: "Pendente",
    xxStatus: "Ativo",
    unidade: "São Luís",
    inseridoPor: "Carlos Eduardo Silva",
    concluidoPor: null,
    dataEnvio: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    dataPrazo: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    dataConclusao: null,
    dataModificacao: null,
    comentario: null,
    imagemReferencia: null,
    evidencia: null,
    createdon: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    modifiedon: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
  },
  {
    id: "cald-103",
    os: "2026-4790",
    pecas: "Carcaça Estator",
    servicos: "Reconstrução dos furos de fixação das sapatas com insertos roscados M24 e caldeiraria no defletor.",
    prazo: 5,
    regime: "Normal",
    status: "Pendente",
    xxStatus: "Ativo",
    unidade: "São Luís",
    inseridoPor: "Rodrigo de Paula Nascimento",
    concluidoPor: null,
    dataEnvio: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    dataPrazo: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    dataConclusao: null,
    dataModificacao: null,
    comentario: null,
    imagemReferencia: null,
    evidencia: null,
    createdon: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    modifiedon: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
  {
    id: "cald-104",
    os: "2026-4755",
    pecas: "Alojamento de Mancal NDE",
    servicos: "Metalização e torneamento interno do mancal bipartido.",
    prazo: 2,
    regime: "Normal",
    status: "Suspenso",
    xxStatus: "Ativo",
    unidade: "São Luís",
    inseridoPor: "Carlos Eduardo Silva",
    concluidoPor: null,
    dataEnvio: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    dataPrazo: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    dataConclusao: null,
    dataModificacao: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    comentario: "Aguardando definição do cliente sobre folga radial do rolamento autocompensador.",
    imagemReferencia: null,
    evidencia: null,
    createdon: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    modifiedon: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: "cald-105",
    os: "2026-4712",
    pecas: "Ventilador Metálico",
    servicos: "Recuperação de aletas de ventilação trincadas e usinagem de cubo.",
    prazo: 2,
    regime: "Normal",
    status: "Concluído",
    xxStatus: "Ativo",
    unidade: "São Luís",
    inseridoPor: "Carlos Eduardo Silva",
    concluidoPor: "José Raimundo Caldeireiro",
    dataEnvio: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    dataPrazo: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    dataConclusao: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    dataModificacao: null,
    comentario: "Executado teste de líquido penetrante após solda. Aprovado.",
    imagemReferencia: null,
    evidencia: null,
    createdon: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    modifiedon: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
  {
    id: "cald-106",
    os: "2026-5100",
    pecas: "Tampa Traseira (NDE)",
    servicos: "Usinagem da face de assentamento e embuchamento do alojamento de vedação labirinto.",
    prazo: 3,
    regime: "Prioridade",
    status: "Pendente",
    xxStatus: "Ativo",
    unidade: "Parauapebas",
    inseridoPor: "Marcos Antônio Ferreira",
    concluidoPor: null,
    dataEnvio: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    dataPrazo: new Date(Date.now() + 60 * 3600 * 1000).toISOString(),
    dataConclusao: null,
    dataModificacao: null,
    comentario: null,
    imagemReferencia: null,
    evidencia: null,
    createdon: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    modifiedon: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
  },
];

const keys = {
  all: ["caldeiraria"] as const,
  itens: (f: CaldeirariaFilter) => ["caldeiraria", "itens", f] as const,
  pecas: () => ["caldeiraria", "pecas"] as const,
  kpis: (filial?: string) => ["caldeiraria", "kpis", filial] as const,
};

export function useCaldeirariaItens(filter: CaldeirariaFilter) {
  return useQuery({
    queryKey: keys.itens(filter),
    queryFn: async () => {
      try {
        const p = new URLSearchParams();
        if (filter.filial && filter.filial !== "Todas") p.set("filial", filter.filial);
        if (filter.status && filter.status !== "todos") p.set("status", filter.status);
        if (filter.regime) p.set("regime", filter.regime);
        if (filter.os) p.set("os", filter.os);
        if (filter.search) p.set("search", filter.search);
        const res = await api<{ items: CaldeirariaItem[]; nextLink?: string; fromDataverse: boolean }>(
          `/caldeiraria/itens?${p.toString()}`,
        );
        return {
          ...res,
          items: res.items.filter((i) => i.pecas?.trim().toLowerCase() !== "balanceamento"),
        };
      } catch {
        // Fallback local caso o backend não esteja ativo na porta 3333
        let items = FALLBACK_ITENS.filter((i) => i.pecas?.trim().toLowerCase() !== "balanceamento");
        if (filter.filial && filter.filial !== "Todas") {
          items = items.filter((i) => i.unidade.toLowerCase() === filter.filial?.toLowerCase());
        }
        if (filter.status === "pendentes") {
          items = items.filter((i) => i.status !== "Concluído" && i.status !== "Suspenso");
        } else if (filter.status === "concluidos") {
          items = items.filter((i) => i.status === "Concluído");
        } else if (filter.status === "suspensos") {
          items = items.filter((i) => i.status === "Suspenso");
        }
        if (filter.regime) {
          items = items.filter((i) => i.regime === filter.regime);
        }
        if (filter.search) {
          const s = filter.search.toLowerCase();
          items = items.filter(
            (i) =>
              i.os.toLowerCase().includes(s) ||
              i.pecas.toLowerCase().includes(s) ||
              (i.servicos && i.servicos.toLowerCase().includes(s)),
          );
        }
        return { items, fromDataverse: false };
      }
    },
    refetchInterval: 15_000,
  });
}

export function useCaldeirariaPecas() {
  return useQuery({
    queryKey: keys.pecas(),
    queryFn: async () => {
      try {
        const res = await api<{ items: CaldeirariaPeca[] }>("/caldeiraria/pecas");
        return {
          items: res.items.filter((p) => p.pecas?.trim().toLowerCase() !== "balanceamento"),
        };
      } catch {
        return { items: FALLBACK_PECAS.filter((p) => p.pecas?.trim().toLowerCase() !== "balanceamento") };
      }
    },
    staleTime: 60_000,
  });
}

export function useCaldeirariaKpis(filial?: string) {
  return useQuery({
    queryKey: keys.kpis(filial),
    queryFn: async () => {
      try {
        const p = new URLSearchParams();
        if (filial && filial !== "Todas") p.set("filial", filial);
        return await api<CaldeirariaKpis>(`/caldeiraria/kpis?${p.toString()}`);
      } catch {
        let items = [...FALLBACK_ITENS];
        if (filial && filial !== "Todas") {
          items = items.filter((i) => i.unidade.toLowerCase() === filial.toLowerCase());
        }
        const pendentes = items.filter((i) => i.status !== "Concluído" && i.status !== "Suspenso");
        const prioritarios = pendentes.filter((i) => i.regime === "Prioridade");
        const suspensos = items.filter((i) => i.status === "Suspenso");
        const concluidos = items.filter((i) => i.status === "Concluído");
        const osComPendencia = new Set(pendentes.map((i) => i.os)).size;

        return {
          totalPendentes: pendentes.length,
          totalPrioridade: prioritarios.length,
          totalSuspensos: suspensos.length,
          totalConcluidos: concluidos.length,
          totalOSComPendencia: osComPendencia,
          concluidosNoPrazoPercent: 100,
        };
      }
    },
    refetchInterval: 15_000,
  });
}

export function useCreateCaldeirariaItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      os: string;
      pecas: string;
      servicos?: string;
      prazo?: number;
      regime?: "Normal" | "Prioridade";
      unidade?: string;
      inseridoPor?: string;
      dataEnvio?: string;
      imagemReferencia?: string;
    }) => {
      try {
        return await api<CaldeirariaItem>("/caldeiraria/itens", { method: "POST", body: data });
      } catch {
        const newItem: CaldeirariaItem = {
          id: `cald-${Date.now()}`,
          os: data.os,
          pecas: data.pecas,
          servicos: data.servicos || null,
          prazo: data.prazo || 3,
          regime: data.regime || "Normal",
          status: "Pendente",
          xxStatus: "Ativo",
          unidade: data.unidade || "São Luís",
          inseridoPor: data.inseridoPor || "Operador",
          concluidoPor: null,
          dataEnvio: data.dataEnvio || new Date().toISOString(),
          dataPrazo: new Date(Date.now() + (data.prazo || 3) * 24 * 3600 * 1000).toISOString(),
          dataConclusao: null,
          dataModificacao: null,
          comentario: null,
          imagemReferencia: data.imagemReferencia || null,
          evidencia: null,
          createdon: new Date().toISOString(),
          modifiedon: new Date().toISOString(),
        };
        FALLBACK_ITENS.unshift(newItem);
        return newItem;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useCreateCaldeirariaLote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (itens: Array<{
      os: string;
      pecas: string;
      servicos?: string;
      prazo?: number;
      regime?: "Normal" | "Prioridade";
      unidade?: string;
      inseridoPor?: string;
      dataEnvio?: string;
      imagemReferencia?: string;
    }>) => {
      try {
        return await api<{ items: CaldeirariaItem[] }>("/caldeiraria/itens", {
          method: "POST",
          body: { itens },
        });
      } catch {
        const createdList: CaldeirariaItem[] = itens.map((data, idx) => ({
          id: `cald-${Date.now()}-${idx}`,
          os: data.os,
          pecas: data.pecas,
          servicos: data.servicos || null,
          prazo: data.prazo || 3,
          regime: data.regime || "Normal",
          status: "Pendente",
          xxStatus: "Ativo",
          unidade: data.unidade || "São Luís",
          inseridoPor: data.inseridoPor || "Operador",
          concluidoPor: null,
          dataEnvio: data.dataEnvio || new Date().toISOString(),
          dataPrazo: new Date(Date.now() + (data.prazo || 3) * 24 * 3600 * 1000).toISOString(),
          dataConclusao: null,
          dataModificacao: null,
          comentario: null,
          imagemReferencia: data.imagemReferencia || null,
          evidencia: null,
          createdon: new Date().toISOString(),
          modifiedon: new Date().toISOString(),
        }));
        FALLBACK_ITENS.unshift(...createdList);
        return { items: createdList };
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useUpdateCaldeirariaItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CaldeirariaItem>;
    }) => {
      try {
        return await api<CaldeirariaItem>(`/caldeiraria/itens/${id}`, { method: "PATCH", body: data });
      } catch {
        const idx = FALLBACK_ITENS.findIndex((i) => i.id === id);
        if (idx >= 0) {
          FALLBACK_ITENS[idx] = { ...FALLBACK_ITENS[idx]!, ...data };
          return FALLBACK_ITENS[idx]!;
        }
        throw new Error("Item não encontrado");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useCreatePeca() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pecas: string) => {
      try {
        return await api<CaldeirariaPeca>("/caldeiraria/pecas", { method: "POST", body: { pecas } });
      } catch {
        const newPeca = { id: `peca-${Date.now()}`, pecas };
        FALLBACK_PECAS.push(newPeca);
        return newPeca;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.pecas() });
    },
  });
}

export function useDeletePeca() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await api<{ success: boolean }>(`/caldeiraria/pecas/${id}`, { method: "DELETE" });
      } catch {
        const idx = FALLBACK_PECAS.findIndex((p) => p.id === id);
        if (idx >= 0) FALLBACK_PECAS.splice(idx, 1);
        return { success: true };
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.pecas() });
    },
  });
}
