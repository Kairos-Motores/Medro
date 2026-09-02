import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Laudo {
  id: string;
  os: string | null;
  osSemSigla: string | null;
  cliente: string | null;
  filial: string | null;
  emissor: string | null;
  dataLaudo: string | null;
  tipoLaudo: string | null;
  classeLaudo: string | null;
  tipoPatch: string | null;
  xStatus: string | null;
  xId: string | null;
  qrValid: string | null;
  sintomas: string | null;
  falhaPrincipal: string | null;
  parecerTecnico: string | null;
  conclusao: string | null;
  observacao: string | null;
  ensaioEletrico: string | null;
  ensaioTemperatura: string | null;
  ensaioVibracao: string | null;
  dataMotorPeritado: string | null;
  dataMotorPronto: string | null;
  createdon: string | null;
  modifiedon: string | null;
}

export type LaudoInput = Partial<Omit<Laudo, "id" | "createdon" | "modifiedon" | "xStatus" | "qrValid">> & {
  os: string;
};

export type LaudoFilter = { search?: string; tipo?: "todos" | "dpt" | "tec"; filial?: string };

const keys = {
  all: ["laudos"] as const,
  list: (f: LaudoFilter) => ["laudos", "list", f] as const,
  one: (id: string) => ["laudos", "one", id] as const,
};

export function useLaudos(filter: LaudoFilter) {
  return useQuery({
    queryKey: keys.list(filter),
    queryFn: () => {
      const p = new URLSearchParams();
      if (filter.search) p.set("search", filter.search);
      if (filter.tipo && filter.tipo !== "todos") p.set("tipo", filter.tipo);
      if (filter.filial) p.set("filial", filter.filial);
      return api<{ items: Laudo[]; nextLink?: string }>(`/laudos?${p.toString()}`);
    },
    placeholderData: (prev) => prev,
  });
}

export function useLaudo(id: string | undefined) {
  return useQuery({
    queryKey: keys.one(id ?? ""),
    queryFn: () => api<Laudo>(`/laudos/${id}`),
    enabled: !!id,
  });
}

export function useCreateLaudo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: LaudoInput) => api<Laudo>("/laudos", { method: "POST", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useUpdateLaudo(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<LaudoInput>) => api<Laudo>(`/laudos/${id}`, { method: "PATCH", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useArchiveLaudo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/laudos/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

/** indicador "tem PDF no SharePoint" para os laudos visíveis. */
export function usePdfStatus(ids: string[]) {
  const key = [...ids].sort().join(",");
  return useQuery({
    queryKey: ["laudos", "pdf-status", key],
    enabled: ids.length > 0,
    staleTime: 5 * 60 * 1000,
    queryFn: () =>
      api<{ status: Record<string, boolean> }>("/laudos/pdf-status", {
        method: "POST",
        body: { ids },
      }).then((r) => r.status),
  });
}
