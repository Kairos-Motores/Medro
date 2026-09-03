import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const API_ORIGIN = import.meta.env.VITE_API_URL ?? "/api";

/** Dados brutos da OS vindos do Dataverse (cr4a1_zb6_relatorios), achatados. */
export type OsDados = Record<string, unknown> & {
  unidade_nome: string;
  cr4a1_novacoluna?: string;
  cr4a1_cliente_nome?: string;
  cr4a1_tag_kairos?: string;
};

export type ModeloRow = {
  cr4a1_modelos_relatoriosid: string;
  cr4a1_nome_modelo: string;
  cr4a1_configuracao_json: string;
};

const keys = {
  os: (osId: string) => ["laudos-gen", "os", osId] as const,
  rascunho: (osId: string, tipo: string) => ["laudos-gen", "rascunho", osId, tipo] as const,
  modelos: ["laudos-gen", "modelos"] as const,
  historicoPdf: ["laudos-gen", "historico-pdf"] as const,
};

export function useOs(osId: string | null) {
  return useQuery({
    queryKey: keys.os(osId ?? ""),
    enabled: !!osId,
    retry: false,
    queryFn: () => api<OsDados>(`/laudos-gen/os/${encodeURIComponent(osId!)}`),
  });
}

export function useRascunho(osId: string | null, tipo = "padrao") {
  return useQuery({
    queryKey: keys.rascunho(osId ?? "", tipo),
    enabled: !!osId,
    queryFn: () =>
      api<Record<string, unknown>>(`/laudos-gen/rascunho/${encodeURIComponent(osId!)}?tipo=${tipo}`),
  });
}

export function useSalvarRascunho() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { osId: string; state: unknown; tipo?: string }) =>
      api<{ success: true }>("/laudos-gen/rascunho", { method: "POST", body }),
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: keys.rascunho(v.osId, v.tipo ?? "padrao") }),
  });
}

export function useModelos() {
  return useQuery({ queryKey: keys.modelos, queryFn: () => api<ModeloRow[]>("/laudos-gen/modelos") });
}

export function useCriarModelo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { cr4a1_nome_modelo: string; cr4a1_configuracao_json: string }) =>
      api<{ success: true }>("/laudos-gen/modelos", { method: "POST", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.modelos }),
  });
}

export function useBalanceamento(osId: string | null) {
  return useQuery({
    queryKey: ["laudos-gen", "balanceamento", osId],
    enabled: !!osId,
    queryFn: () =>
      api<{ encontrado: boolean; dados?: Record<string, Record<string, string>> }>(
        `/laudos-gen/balanceamento/${encodeURIComponent(osId!)}`,
      ),
  });
}

export function useHistoricoServicos(tag: string | null | undefined) {
  return useQuery({
    queryKey: ["laudos-gen", "historico-servicos", tag],
    enabled: !!tag,
    queryFn: () =>
      api<{ ano: number; REBOBINAMENTO: number; REJUVENESCIMENTO: number; OUTROS: number }[]>(
        `/laudos-gen/historico-servicos/${encodeURIComponent(tag!)}`,
      ),
  });
}

export function useHistoricoPdf() {
  return useQuery({
    queryKey: keys.historicoPdf,
    queryFn: () => api<Record<string, unknown>[]>("/laudos-gen/historico-pdf"),
  });
}

export interface PdfResult {
  url: string;
  arquivado: "pending" | "true" | "false" | null;
  sharepointUrl: string | null;
}

/** Gera o PDF do laudo (via pdf-worker), arquiva no SharePoint e devolve um object URL. */
export function useGerarPdf() {
  const token = useAuth((s) => s.token);
  return useMutation({
    mutationFn: async ({
      osId,
      tipo,
      arquivar,
    }: {
      osId: string;
      tipo?: string;
      arquivar?: boolean;
    }): Promise<PdfResult> => {
      const res = await fetch(`${API_ORIGIN}/laudos-gen/render`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ osId, tipo: tipo ?? "padrao", arquivar: arquivar ?? true }),
      });
      if (!res.ok) {
        let msg = `Falha ao gerar o PDF (${res.status}).`;
        try {
          const j = await res.json();
          msg = j.message || j.error || msg;
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }
      const blob = await res.blob();
      return {
        url: URL.createObjectURL(blob),
        arquivado: (res.headers.get("X-Arquivado") as PdfResult["arquivado"]) ?? null,
        sharepointUrl: res.headers.get("X-Sharepoint-Url"),
      };
    },
  });
}

export type ArquivoStatus = {
  estado: "arquivando" | "ok" | "erro" | "nenhum";
  em?: number;
  url?: string | null;
  erro?: string;
};

/** acompanha o arquivamento do PDF no SharePoint (roda em 2º plano no backend). */
export function useArquivoStatus(osId: string | null, ativo: boolean) {
  return useQuery({
    queryKey: ["laudos-gen", "arquivo-status", osId],
    enabled: !!osId && ativo,
    refetchInterval: (q) =>
      (q.state.data as ArquivoStatus | undefined)?.estado === "arquivando" ? 2000 : false,
    queryFn: () => api<ArquivoStatus>(`/laudos-gen/render/status/${encodeURIComponent(osId!)}`),
  });
}

export function useFotosOs(osId: string | null, unidade?: string, cliente?: string) {
  return useQuery({
    queryKey: ["laudos-gen", "fotos", osId, unidade, cliente],
    enabled: !!osId,
    queryFn: () => {
      const p = new URLSearchParams();
      if (unidade) p.set("unidade", unidade);
      if (cliente) p.set("cliente", cliente);
      return api<Record<string, { id: string; nome: string; url: string }[]>>(
        `/laudos-gen/os/${encodeURIComponent(osId!)}/fotos?${p.toString()}`,
      );
    },
  });
}
