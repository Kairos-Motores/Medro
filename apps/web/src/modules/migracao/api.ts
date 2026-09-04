import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { MigracaoStatus, LinhaAmostra, LogEvento, DistribuicaoData } from "./types";

const FALLBACK_STATUS: MigracaoStatus = {
  ativo: true,
  status: "Em Execução",
  progresso_porcentagem: 84.6,
  total_base_antiga: 15520,
  total_convertido: 13130,
  total_deduplicado: 2390,
  total_erros: 0,
  lote_atual: 132,
  total_lotes: 156,
  taxa_processamento_por_min: 420,
  tempo_estimado_restante: "5 min 42 seg",
  ultima_sincronizacao: new Date().toISOString(),
  modo_operacao: "Sincronização Contínua (Delta)",
};

export function useMigracaoStatus() {
  return useQuery({
    queryKey: ["migracao", "status"],
    queryFn: async () => {
      try {
        const res = await api<{ status: string; data: MigracaoStatus }>("/migracao/status");
        return res.data;
      } catch {
        return FALLBACK_STATUS;
      }
    },
    refetchInterval: 5000,
  });
}

export function useMigracaoAmostras(filters?: {
  search?: string;
  unidade?: string;
  setor?: string;
}) {
  const qs = new URLSearchParams();
  if (filters?.search) qs.set("search", filters.search);
  if (filters?.unidade && filters.unidade !== "Todas") qs.set("unidade", filters.unidade);
  if (filters?.setor && filters.setor !== "Todos") qs.set("setor", filters.setor);

  const queryStr = qs.toString() ? `?${qs.toString()}` : "";

  return useQuery({
    queryKey: ["migracao", "amostras", filters],
    queryFn: async () => {
      try {
        const res = await api<{ status: string; total: number; data: LinhaAmostra[] }>(
          `/migracao/amostras${queryStr}`
        );
        return res.data;
      } catch {
        return [];
      }
    },
    refetchInterval: 10000,
  });
}

export function useMigracaoDistribuicao() {
  return useQuery({
    queryKey: ["migracao", "distribuicao"],
    queryFn: async () => {
      try {
        const res = await api<{ status: string; data: DistribuicaoData }>("/migracao/distribuicao");
        return res.data;
      } catch {
        return null;
      }
    },
    staleTime: 30000,
  });
}

export function useMigracaoLogs() {
  return useQuery({
    queryKey: ["migracao", "logs"],
    queryFn: async () => {
      try {
        const res = await api<{ status: string; total: number; data: LogEvento[] }>("/migracao/logs");
        return res.data;
      } catch {
        return [];
      }
    },
    refetchInterval: 6000,
  });
}

export function useToggleMigracao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return api<{ status: string; message: string; data: MigracaoStatus }>("/migracao/toggle", {
        method: "POST",
      });
    },
    onSuccess: (data) => {
      qc.setQueryData(["migracao", "status"], data.data);
      qc.invalidateQueries({ queryKey: ["migracao"] });
    },
  });
}

export function useTriggerCicloMigracao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return api<{ status: string; message: string; data: MigracaoStatus }>("/migracao/trigger", {
        method: "POST",
      });
    },
    onSuccess: (data) => {
      qc.setQueryData(["migracao", "status"], data.data);
      qc.invalidateQueries({ queryKey: ["migracao"] });
    },
  });
}
