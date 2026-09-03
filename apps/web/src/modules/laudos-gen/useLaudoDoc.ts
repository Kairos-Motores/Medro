import { useCallback, useEffect, useRef, useState } from "react";
import {
  useOs,
  useRascunho,
  useSalvarRascunho,
  useBalanceamento,
  useHistoricoServicos,
} from "./api";
import { emptyLaudoState, mergeRascunho, applyModelo, type LaudoState } from "./state";
import type { ModeloRow } from "./api";

export type PatchFn = (recipe: (draft: LaudoState) => void) => void;

export interface LaudoDoc {
  osId: string | null;
  doc: LaudoState;
  patch: PatchFn;
  loading: boolean;
  error: unknown;
  dirty: boolean;
  saving: boolean;
  savedAt: number | null;
  saveError: unknown;
  save: () => Promise<void>;
  applyModelo: (modelo: ModeloRow) => void;
  /** dados brutos da OS (query separada, sempre atualizada) */
  os: ReturnType<typeof useOs>;
  balanceamento: ReturnType<typeof useBalanceamento>;
}

/**
 * Reúne OS + rascunho + auxiliares num único documento editável.
 *
 * - o rascunho salvo é a fonte da verdade do conteúdo do laudo;
 * - `osData` / `historyData` / `balanceData` são semeados das queries quando o
 *   rascunho ainda não os tem (primeira edição de uma OS), porque o PDF em
 *   `?print=true` lê essas chaves do rascunho e não refaz o fetch;
 * - `save()` persiste o documento inteiro (sempre com `osData` embutido).
 */
export function useLaudoDoc(osId: string | null, tipo = "padrao"): LaudoDoc {
  const os = useOs(osId);
  const rascunho = useRascunho(osId, tipo);
  const balanceamento = useBalanceamento(osId);
  const tag = (os.data?.cr4a1_tag_kairos as string | undefined) ?? undefined;
  const historico = useHistoricoServicos(tag);
  const salvar = useSalvarRascunho();

  const [doc, setDoc] = useState<LaudoState>(emptyLaudoState);
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // chave de hidratação: só re-hidrata quando muda a OS ou chega o rascunho
  const hydratedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!osId) {
      setDoc(emptyLaudoState());
      setDirty(false);
      hydratedFor.current = null;
      return;
    }
    if (rascunho.isLoading) return;
    const key = `${osId}:${tipo}`;
    if (hydratedFor.current === key && !rascunho.isFetching) return;
    hydratedFor.current = key;

    const merged = mergeRascunho(rascunho.data);
    if (!merged.osData && os.data) merged.osData = os.data;
    if (merged.historyData.length === 0 && historico.data?.length) {
      merged.historyData = historico.data;
    }
    if (!merged.balanceData && balanceamento.data?.encontrado && balanceamento.data.dados) {
      merged.balanceData = balanceamento.data.dados;
    }
    setDoc(merged);
    setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [osId, tipo, rascunho.isLoading, rascunho.dataUpdatedAt]);

  // quando OS / histórico / balanceamento chegam DEPOIS da hidratação e o
  // documento ainda não tem esses dados, completa sem sujar o rascunho.
  useEffect(() => {
    if (!osId) return;
    setDoc((d) => {
      let changed = false;
      const next = { ...d };
      if (!next.osData && os.data) {
        next.osData = os.data;
        changed = true;
      }
      if (next.historyData.length === 0 && historico.data?.length) {
        next.historyData = historico.data;
        changed = true;
      }
      if (!next.balanceData && balanceamento.data?.encontrado && balanceamento.data.dados) {
        next.balanceData = balanceamento.data.dados;
        changed = true;
      }
      return changed ? next : d;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [os.data, historico.data, balanceamento.data, osId]);

  const patch = useCallback<PatchFn>((recipe) => {
    setDoc((prev) => {
      const draft = structuredClone(prev);
      recipe(draft);
      return draft;
    });
    setDirty(true);
  }, []);

  const aplicarModelo = useCallback((modelo: ModeloRow) => {
    setDoc((prev) => {
      const draft = structuredClone(prev);
      applyModelo(draft, modelo.cr4a1_configuracao_json, modelo.cr4a1_modelos_relatoriosid);
      return draft;
    });
    setDirty(true);
  }, []);

  const save = useCallback(async () => {
    if (!osId) return;
    const payload: LaudoState = {
      ...doc,
      osData: doc.osData ?? os.data ?? null,
      _via: "medro-web",
    };
    await salvar.mutateAsync({ osId, tipo, state: payload });
    setDirty(false);
    setSavedAt(Date.now());
  }, [osId, tipo, doc, os.data, salvar]);

  return {
    osId,
    doc,
    patch,
    loading: os.isLoading || rascunho.isLoading,
    error: os.error ?? rascunho.error,
    dirty,
    saving: salvar.isPending,
    savedAt,
    saveError: salvar.error,
    save,
    applyModelo: aplicarModelo,
    os,
    balanceamento,
  };
}
