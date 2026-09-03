import { useCallback, useEffect, useRef, useState } from "react";
import {
  emptyLaudoState,
  mergeRascunho,
  applyModelo,
  modeloConfigFromDoc,
  type LaudoState,
} from "./state";
import { useModelo, useCriarModelo, useAtualizarModelo } from "./api";
import type { PatchFn } from "./useLaudoDoc";

export interface ModeloDoc {
  doc: LaudoState;
  patch: PatchFn;
  nome: string;
  setNome: (v: string) => void;
  /** id atual — null enquanto o modelo ainda não foi salvo pela 1ª vez */
  modeloId: string | null;
  loading: boolean;
  dirty: boolean;
  saving: boolean;
  savedAt: number | null;
  /** persiste (POST se novo, PUT se existente); devolve o id resultante */
  save: () => Promise<string | null>;
}

/**
 * Documento editável de um MODELO de laudo — análogo a `useLaudoDoc`, mas sem OS.
 *
 * - `initialModeloId` truthy → carrega o modelo e aplica a estrutura sobre um
 *   estado vazio (`applyModelo`);
 * - `initialModeloId` null → começa do `emptyLaudoState()` (modelo novo);
 * - `save()` serializa só a estrutura (`modeloConfigFromDoc`) — nada de `osData`.
 *
 * `nonce` muda a cada reabertura da janela (params do window-manager) para
 * forçar re-hidratação quando o mesmo componente troca de modelo.
 */
export function useModeloDoc(initialModeloId: string | null, nonce = 0): ModeloDoc {
  const [modeloId, setModeloId] = useState<string | null>(initialModeloId);
  const modelo = useModelo(modeloId);
  const criar = useCriarModelo();
  const atualizar = useAtualizarModelo();

  const [doc, setDoc] = useState<LaudoState>(emptyLaudoState);
  const [nome, setNome] = useState("");
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // "new" | <id> — evita re-hidratar (e apagar edições) quando nada mudou
  const hydratedFor = useRef<string | null>(null);

  // reabertura da janela apontando para outro modelo
  useEffect(() => {
    setModeloId(initialModeloId);
    hydratedFor.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialModeloId, nonce]);

  useEffect(() => {
    if (!modeloId) {
      if (hydratedFor.current === "new") return;
      hydratedFor.current = "new";
      const base = emptyLaudoState();
      base.osData = null;
      setDoc(base);
      setNome("");
      setDirty(false);
      return;
    }
    if (modelo.isLoading || !modelo.data) return;
    if (hydratedFor.current === modeloId && !modelo.isFetching) return;
    hydratedFor.current = modeloId;

    const draft = mergeRascunho({});
    draft.osData = null;
    applyModelo(draft, modelo.data.cr4a1_configuracao_json || "{}", modeloId);
    setDoc(draft);
    setNome(modelo.data.cr4a1_nome_modelo ?? "");
    setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeloId, modelo.isLoading, modelo.dataUpdatedAt]);

  const patch = useCallback<PatchFn>((recipe) => {
    setDoc((prev) => {
      const draft = structuredClone(prev);
      recipe(draft);
      return draft;
    });
    setDirty(true);
  }, []);

  const setNomeDirty = useCallback((v: string) => {
    setNome(v);
    setDirty(true);
  }, []);

  const save = useCallback(async (): Promise<string | null> => {
    const configuracaoJson = modeloConfigFromDoc(doc);
    const nomeFinal = nome.trim() || "Modelo sem nome";
    if (modeloId) {
      await atualizar.mutateAsync({ id: modeloId, nome: nomeFinal, configuracaoJson });
      setDirty(false);
      setSavedAt(Date.now());
      return modeloId;
    }
    const novo = await criar.mutateAsync({
      cr4a1_nome_modelo: nomeFinal,
      cr4a1_configuracao_json: configuracaoJson,
    });
    setDirty(false);
    setSavedAt(Date.now());
    // passa a editar o modelo recém-criado (sem re-hidratar sobre as edições).
    // se a API não devolveu o id, segue como "novo" com o doc intacto.
    if (novo?.id) {
      hydratedFor.current = novo.id;
      setModeloId(novo.id);
      return novo.id;
    }
    return null;
  }, [doc, nome, modeloId, atualizar, criar]);

  return {
    doc,
    patch,
    nome,
    setNome: setNomeDirty,
    modeloId,
    loading: !!modeloId && modelo.isLoading,
    dirty,
    saving: criar.isPending || atualizar.isPending,
    savedAt,
    save,
  };
}
