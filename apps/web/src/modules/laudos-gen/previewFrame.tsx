import { useCallback, useEffect, useRef } from "react";
import type { LaudoState } from "./state";

/** URL do bundle de impressão (`apps/report-print`) — também serve a prévia embutida. */
export const REPORT_PRINT_URL =
  (import.meta.env.VITE_REPORT_PRINT_URL as string | undefined) || "http://localhost:5180";

export const REPORT_PRINT_ORIGIN = (() => {
  try {
    return new URL(REPORT_PRINT_URL).origin;
  } catch {
    return "*";
  }
})();

/**
 * iframe do report-print em modo embutido (`?print=true&embed=1`). Não faz
 * nenhuma chamada à API: recebe o `state` inteiro do documento por postMessage
 * (~250 ms após cada edição) e reidrata os setters do bundle. Só leitura.
 *
 * - `osParam`: valor de `?os=` na URL (a OS real, ou `"MODELO"` no construtor).
 * - `overrideOsData`: substitui `doc.osData` no postMessage — o construtor de
 *   modelos usa uma OS fictícia porque não há OS carregada.
 */
export function LaudoPreviewFrame({
  osParam,
  token,
  doc,
  reloadKey,
  overrideOsData,
}: {
  osParam: string;
  token: string | null;
  doc: LaudoState;
  reloadKey: number;
  overrideOsData?: Record<string, unknown>;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const ready = useRef(false);
  const src = `${REPORT_PRINT_URL}/admin?os=${encodeURIComponent(
    osParam,
  )}&print=true&embed=1&t=${encodeURIComponent(token ?? "")}`;

  const post = useCallback(() => {
    const state = overrideOsData ? { ...doc, osData: overrideOsData } : doc;
    ref.current?.contentWindow?.postMessage({ type: "laudo:preview", state }, REPORT_PRINT_ORIGIN);
  }, [doc, overrideOsData]);

  // o iframe avisa quando está pronto para receber o estado
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type === "laudo:preview-ready") {
        ready.current = true;
        post();
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [post]);

  // empurra o estado ~250 ms depois da última edição
  useEffect(() => {
    if (!ready.current) return;
    const id = setTimeout(post, 250);
    return () => clearTimeout(id);
  }, [doc, post]);

  // ao trocar de OS/modelo ou recarregar, o iframe reinicia → aguarda novo "ready"
  useEffect(() => {
    ready.current = false;
  }, [osParam, reloadKey]);

  return (
    <iframe
      ref={ref}
      key={`${src}#${reloadKey}`}
      src={src}
      title="Prévia do laudo"
      onLoad={post}
      className="min-h-0 flex-1 bg-white"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
