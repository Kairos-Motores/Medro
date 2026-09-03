import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  FileDown,
  Save,
  Loader2,
  AlertTriangle,
  Building2,
  User,
  Hash,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  ExternalLink,
  FileClock,
  History,
} from "lucide-react";
import { Skeleton } from "reshaped";
import { cn } from "@/lib/cn";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import {
  useGerarPdf,
  useArquivoStatus,
  useModelos,
  useRascunhos,
  useHistoricoPdf,
} from "./api";
import { useLaudoDoc } from "./useLaudoDoc";
import { renderEditor } from "./editors";
import type { LaudoPage } from "./layout";
import type { LaudoState } from "./state";

const REPORT_PRINT_URL =
  (import.meta.env.VITE_REPORT_PRINT_URL as string | undefined) || "http://localhost:5180";
const REPORT_PRINT_ORIGIN = (() => {
  try {
    return new URL(REPORT_PRINT_URL).origin;
  } catch {
    return "*";
  }
})();

export function LaudosGenApp() {
  const [osInput, setOsInput] = useState("");
  const [osId, setOsId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [pdfMsg, setPdfMsg] = useState<string | null>(null);
  const [lastPdf, setLastPdf] = useState<{ url: string; sharepointUrl: string | null } | null>(null);
  const [acompanharArquivo, setAcompanharArquivo] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewReload, setPreviewReload] = useState(0);

  const token = useAuth((s) => s.token);
  const L = useLaudoDoc(osId);
  const gerarPdf = useGerarPdf();
  const arquivo = useArquivoStatus(osId, acompanharArquivo);
  const modelos = useModelos();

  const layout = L.doc.modelConfig.layout;
  const selectedPage: LaudoPage | undefined = useMemo(
    () => layout.find((p) => p.id === selectedPageId) ?? layout[0],
    [layout, selectedPageId],
  );

  useEffect(() => {
    if (!layout.length) return;
    if (!selectedPageId || !layout.some((p) => p.id === selectedPageId)) {
      setSelectedPageId(layout[0]!.id);
    }
  }, [layout, selectedPageId]);

  useEffect(() => {
    const st = arquivo.data?.estado;
    if (!acompanharArquivo || !st || st === "arquivando") return;
    if (st === "ok") {
      setPdfMsg("PDF gerado e arquivado no SharePoint.");
      if (arquivo.data?.url) setLastPdf((p) => (p ? { ...p, sharepointUrl: arquivo.data!.url! } : p));
    } else if (st === "erro") {
      setPdfMsg("PDF gerado. Não foi possível arquivar no SharePoint.");
    }
    setAcompanharArquivo(false);
  }, [arquivo.data, acompanharArquivo]);

  const os = L.os;
  const osNumero = (os.data?.cr4a1_novacoluna as string) || osId || "";
  const cliente = (os.data?.cr4a1_cliente_nome as string) || "—";
  const unidade = os.data?.unidade_nome || "—";

  const carregar = useCallback((valor: string) => {
    const v = valor.trim();
    if (!v) return;
    setOsId(v);
    setOsInput(v);
    setSelectedPageId(null);
    setPdfMsg(null);
    setLastPdf(null);
  }, []);

  async function salvar() {
    if (!L.dirty || !osId) return;
    try {
      await L.save();
    } catch {
      setPdfMsg("Falha ao salvar o rascunho.");
    }
  }

  async function selecionarPagina(id: string) {
    if (id === selectedPage?.id) return;
    if (L.dirty) await salvar();
    setSelectedPageId(id);
  }

  async function gerar() {
    if (!osId) return;
    setPdfMsg(null);
    if (L.dirty) await salvar();
    try {
      const r = await gerarPdf.mutateAsync({ osId });
      setLastPdf({ url: r.url, sharepointUrl: r.sharepointUrl });
      window.open(r.url, "_blank");
      if (r.arquivado === "pending") {
        setPdfMsg("PDF gerado. Arquivando no SharePoint…");
        setAcompanharArquivo(true);
      } else {
        setPdfMsg("PDF gerado.");
      }
    } catch (e) {
      setPdfMsg(e instanceof Error ? e.message : "Falha ao gerar o PDF.");
    }
  }

  function trocarModelo(id: string) {
    const m = modelos.data?.find((x) => x.cr4a1_modelos_relatoriosid === id);
    if (m) L.applyModelo(m);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={osInput}
            onChange={(e) => setOsInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && carregar(e.currentTarget.value)}
            placeholder="Nº da OS (ex.: 11539-AL)"
            className="w-52 pl-8"
          />
        </div>
        <Button size="sm" onClick={() => carregar(osInput)} disabled={os.isFetching}>
          {os.isFetching ? <Loader2 className="size-4 animate-spin" /> : "Carregar"}
        </Button>

        {os.data && (
          <>
            <div className="mx-1 hidden h-5 w-px bg-border sm:block" />
            <span className="flex items-center gap-1.5 text-[12.5px] text-foreground">
              <Hash className="size-3.5 text-muted-foreground" />
              <strong>{osNumero}</strong>
            </span>
            <span className="hidden items-center gap-1.5 text-[12.5px] text-muted-foreground sm:flex">
              <User className="size-3.5" /> {cliente}
            </span>
            <span className="hidden items-center gap-1.5 text-[12.5px] text-muted-foreground md:flex">
              <Building2 className="size-3.5" /> {unidade}
            </span>

            <Select
              value={L.doc.activeTemplateId ?? ""}
              onChange={(e) => trocarModelo(e.target.value)}
              className="ml-2 hidden h-[26px] w-40 text-[12px] lg:block"
              title="Modelo do laudo"
            >
              <option value="">— sem modelo —</option>
              {modelos.data?.map((m) => (
                <option key={m.cr4a1_modelos_relatoriosid} value={m.cr4a1_modelos_relatoriosid}>
                  {m.cr4a1_nome_modelo}
                </option>
              ))}
            </Select>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview((v) => !v)}
                title={showPreview ? "Ocultar prévia" : "Mostrar prévia"}
              >
                {showPreview ? (
                  <PanelRightClose className="size-4" />
                ) : (
                  <PanelRightOpen className="size-4" />
                )}
              </Button>
              <Button variant="neutral" size="sm" onClick={salvar} disabled={!L.dirty || L.saving}>
                {L.saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {L.dirty ? "Salvar" : "Salvo"}
              </Button>
              <Button size="sm" disabled={!osId || gerarPdf.isPending} onClick={gerar}>
                {gerarPdf.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <FileDown className="size-4" />
                )}
                Gerar PDF
              </Button>
            </div>
          </>
        )}
      </div>

      {(pdfMsg || lastPdf) && (
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-primary/[0.06] px-4 py-1.5 text-[12px] text-primary">
          <span className="flex items-center gap-2">
            <FileDown className="size-3.5" />
            {pdfMsg}
          </span>
          {lastPdf && (
            <button
              onClick={() => window.open(lastPdf.url, "_blank")}
              className="inline-flex items-center gap-1 font-medium underline underline-offset-2"
            >
              <ExternalLink className="size-3" /> Abrir PDF gerado
            </button>
          )}
          {lastPdf?.sharepointUrl && (
            <a
              href={lastPdf.sharepointUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium underline underline-offset-2"
            >
              <ExternalLink className="size-3" /> Ver no SharePoint
            </a>
          )}
        </div>
      )}

      {/* corpo */}
      {!osId ? (
        <EmptyState onPick={carregar} />
      ) : L.loading ? (
        <div className="space-y-3 p-6">
          <Skeleton height={24} borderRadius="small" />
          <Skeleton height={200} borderRadius="medium" />
        </div>
      ) : os.isError ? (
        <div className="m-6 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 p-4 text-[13px] text-danger">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>
            {os.error instanceof ApiError
              ? os.error.message
              : "Falha ao carregar a OS. Verifique o número e tente novamente."}
          </span>
        </div>
      ) : (
        <div
          className={cn(
            "grid min-h-0 flex-1",
            showPreview
              ? "lg:grid-cols-[220px_minmax(340px,440px)_minmax(0,1fr)]"
              : "lg:grid-cols-[220px_minmax(0,1fr)]",
          )}
        >
          {/* navegador de páginas */}
          <aside className="min-h-0 overflow-y-auto border-r border-border bg-surface-2 p-3">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Páginas do laudo
            </p>
            <ol className="space-y-0.5">
              {layout.map((p, i) => (
                <li key={p.id}>
                  <button
                    onClick={() => selecionarPagina(p.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12.5px] transition-colors",
                      p.id === selectedPage?.id
                        ? "bg-primary/12 font-medium text-primary"
                        : "text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                    )}
                  >
                    <span className="w-5 shrink-0 text-[11px] text-muted-foreground">{i + 1}</span>
                    <span className="truncate">{p.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </aside>

          {/* editor da página */}
          <section className="min-h-0 overflow-y-auto border-r border-border p-5">
            {selectedPage && (
              <>
                <header className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Editor
                  </p>
                  <h2 className="text-[16px] font-semibold text-foreground">{selectedPage.title}</h2>
                </header>
                {renderEditor({ page: selectedPage, doc: L.doc, patch: L.patch })}
              </>
            )}
          </section>

          {/* prévia do PDF (bundle de impressão, em tempo real via postMessage) */}
          {showPreview && (
            <section className="min-h-0 flex-col overflow-hidden bg-surface-2 max-lg:hidden lg:flex">
              <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Prévia do PDF · tempo real
                </span>
                <button
                  onClick={() => setPreviewReload((n) => n + 1)}
                  className="rounded p-1 text-muted-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  title="Recarregar prévia"
                >
                  <RefreshCw className="size-3.5" />
                </button>
              </div>
              <PreviewFrame
                osId={osId}
                token={token}
                doc={L.doc}
                reloadKey={previewReload}
              />
            </section>
          )}
        </div>
      )}
    </div>
  );
}

/** iframe do report-print em modo embutido — recebe o estado por postMessage. */
function PreviewFrame({
  osId,
  token,
  doc,
  reloadKey,
}: {
  osId: string;
  token: string | null;
  doc: LaudoState;
  reloadKey: number;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const ready = useRef(false);
  const src = `${REPORT_PRINT_URL}/admin?os=${encodeURIComponent(
    osId,
  )}&print=true&embed=1&t=${encodeURIComponent(token ?? "")}`;

  const post = useCallback(() => {
    ref.current?.contentWindow?.postMessage(
      { type: "laudo:preview", state: doc },
      REPORT_PRINT_ORIGIN,
    );
  }, [doc]);

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

  // empurra o estado ~250ms depois da última edição
  useEffect(() => {
    if (!ready.current) return;
    const id = setTimeout(post, 250);
    return () => clearTimeout(id);
  }, [doc, post]);

  // ao trocar de OS ou recarregar, o iframe reinicia → aguarda novo "ready"
  useEffect(() => {
    ready.current = false;
  }, [osId, reloadKey]);

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

function EmptyState({ onPick }: { onPick: (osId: string) => void }) {
  const rascunhos = useRascunhos();
  const historico = useHistoricoPdf();

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6 p-8 sm:grid-cols-2">
      <div className="sm:col-span-2 flex flex-col items-center gap-2 py-4 text-center text-muted-foreground">
        <FileDown className="size-8 opacity-40" />
        <p className="text-[13px]">Informe o número da OS acima para começar a montar o laudo.</p>
        <p className="text-[12px] opacity-70">Acesso restrito ao Departamento Técnico.</p>
      </div>

      <Panel icon={<FileClock className="size-3.5" />} title="Rascunhos — continuar de onde parou">
        {rascunhos.isLoading ? (
          <Skeleton height={80} borderRadius="small" />
        ) : rascunhos.data?.length ? (
          <ul className="divide-y divide-border">
            {rascunhos.data.slice(0, 12).map((r) => (
              <li key={`${r.osId}:${r.tipo}`}>
                <button
                  onClick={() => onPick(r.osId)}
                  className="flex w-full items-center justify-between gap-2 px-1 py-1.5 text-left text-[12.5px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                >
                  <span className="font-medium text-foreground">{r.osId}</span>
                  <span className="text-[11px] text-muted-foreground">{fmtData(r.atualizadoEm)}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-1 py-2 text-[12px] text-muted-foreground">Nenhum rascunho salvo ainda.</p>
        )}
      </Panel>

      <Panel icon={<History className="size-3.5" />} title="Últimos PDFs emitidos">
        {historico.isLoading ? (
          <Skeleton height={80} borderRadius="small" />
        ) : historico.data?.length ? (
          <ul className="divide-y divide-border">
            {historico.data.slice(0, 12).map((h, i) => (
              <li key={i}>
                <button
                  onClick={() => onPick(String(h.cr4a1_os ?? ""))}
                  className="flex w-full items-center justify-between gap-2 px-1 py-1.5 text-left text-[12.5px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                >
                  <span className="min-w-0">
                    <span className="font-medium text-foreground">{String(h.cr4a1_os ?? "—")}</span>
                    <span className="ml-2 truncate text-[11px] text-muted-foreground">
                      {String(h.cr4a1_cliente ?? "")}
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {fmtData(h.cr4a1_adicionado_em as string)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-1 py-2 text-[12px] text-muted-foreground">Nenhum PDF emitido ainda.</p>
        )}
      </Panel>
    </div>
  );
}

function Panel({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {title}
      </p>
      {children}
    </div>
  );
}

function fmtData(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}
