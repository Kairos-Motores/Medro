import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  FileText, Link2, Pencil, Archive, Loader2, ExternalLink, X, AlertTriangle,
} from "lucide-react";
import { Skeleton } from "reshaped";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import {
  Sheet, SheetContent, SheetTitle, SheetDescription, SheetClose,
} from "@/components/ui/sheet";
import { useLaudo, useArchiveLaudo } from "./api";

const API = import.meta.env.VITE_API_URL ?? "/api";

function fmtDate(raw: string | null) {
  if (!raw) return "—";
  try {
    return format(parseISO(raw), "d 'de' MMM yyyy", { locale: ptBR });
  } catch {
    return raw;
  }
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 px-4 py-2.5 text-[14px]">
      <span className="w-36 shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 flex-1 whitespace-pre-wrap break-words text-foreground">{value}</span>
    </div>
  );
}

/** Visualizador de PDF do laudo (SharePoint via /api/laudos/:id/pdf). */
function PdfViewer({ id, onClose }: { id: string; onClose: () => void }) {
  const token = useAuth((s) => s.token);
  const [state, setState] = useState<"loading" | "ok" | "unavailable" | "notfound" | "error">("loading");
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let objUrl: string | null = null;
    (async () => {
      try {
        const res = await fetch(`${API}/laudos/${id}/pdf`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 503) return setState("unavailable");
        if (res.status === 404) return setState("notfound");
        if (!res.ok) return setState("error");
        const blob = await res.blob();
        objUrl = URL.createObjectURL(blob);
        setUrl(objUrl);
        setState("ok");
      } catch {
        setState("error");
      }
    })();
    return () => {
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [id, token]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-[13px] font-semibold text-foreground">Laudo (SharePoint)</span>
        <div className="flex items-center gap-1">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-muted"
            >
              <ExternalLink className="size-4" />
            </a>
          )}
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-muted"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
      {state === "loading" && (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      )}
      {state === "ok" && url && (
        <iframe title="Laudo PDF" src={url} className="h-[70vh] w-full bg-white" />
      )}
      {state !== "loading" && state !== "ok" && (
        <div className="flex flex-col items-center gap-2 p-8 text-center text-[13px] text-muted-foreground">
          <AlertTriangle className="size-6 text-warning" />
          {state === "unavailable" && "Conector SharePoint não configurado (GRAPH_ENABLED)."}
          {state === "notfound" && "PDF do laudo não localizado na biblioteca Doc Técnicos."}
          {state === "error" && "Falha ao carregar o PDF."}
        </div>
      )}
    </div>
  );
}

export function LaudoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: l, isLoading, isError } = useLaudo(id);
  const archive = useArchiveLaudo();
  const [showPdf, setShowPdf] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function gerarLink() {
    setMsg(null);
    try {
      const r = await api<{ webUrl: string }>(`/laudos/${id}/link`, { method: "POST" });
      await navigator.clipboard?.writeText(r.webUrl).catch(() => {});
      setMsg("Link de visualização copiado.");
    } catch (e) {
      setMsg(
        e instanceof ApiError && e.status === 503
          ? "SharePoint não configurado."
          : e instanceof ApiError && e.status === 404
            ? "PDF do laudo não encontrado."
            : "Falha ao gerar link.",
      );
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton height={28} borderRadius="small" />
        <Skeleton height={120} borderRadius="medium" />
        <Skeleton height={160} borderRadius="medium" />
      </div>
    );
  }
  if (isError || !l) {
    return <p className="rounded-lg bg-danger/10 p-4 text-center text-[13px] text-danger">Laudo não encontrado.</p>;
  }

  return (
    <div className="space-y-4">
      <header className="px-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">{l.os || l.osSemSigla}</h1>
          {l.tipoLaudo && (
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[12px] font-semibold",
                l.tipoLaudo === "DPT"
                  ? "bg-accent-teal/12 text-accent-teal"
                  : "bg-accent-violet/12 text-accent-violet",
              )}
            >
              {l.tipoLaudo}
            </span>
          )}
          {l.qrValid && (
            <span className="rounded bg-success/12 px-1.5 py-0.5 text-[12px] font-semibold text-success">
              QR válido
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          {[l.cliente, l.filial, fmtDate(l.dataLaudo)].filter(Boolean).join(" · ")}
        </p>
      </header>

      {msg && <p className="rounded-md bg-info/10 px-3 py-2 text-[13px] text-info">{msg}</p>}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button variant="primary" size="sm" onClick={() => setShowPdf((v) => !v)}>
          <FileText className="size-4" /> {showPdf ? "Ocultar PDF" : "Ver laudo"}
        </Button>
        <Button variant="tinted" size="sm" onClick={gerarLink}>
          <Link2 className="size-4" /> Gerar link
        </Button>
        <Button variant="neutral" size="sm" onClick={() => navigate(`/dpt/laudo/${l.id}/editar`)}>
          <Pencil className="size-4" /> Editar
        </Button>
        <Button variant="neutral" size="sm" className="text-danger" onClick={() => setConfirmArchive(true)}>
          <Archive className="size-4" /> Arquivar
        </Button>
      </div>

      {showPdf && id && <PdfViewer id={id} onClose={() => setShowPdf(false)} />}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="ios-list divide-y divide-border/70">
          <Row label="Emissor" value={l.emissor} />
          <Row label="Classe" value={l.classeLaudo} />
          <Row label="Motor peritado" value={l.dataMotorPeritado} />
          <Row label="Motor pronto" value={l.dataMotorPronto} />
          <Row label="Ensaio elétrico" value={l.ensaioEletrico} />
          <Row label="Ensaio temperatura" value={l.ensaioTemperatura} />
          <Row label="Ensaio vibração" value={l.ensaioVibracao} />
        </section>

        {(l.sintomas || l.falhaPrincipal || l.parecerTecnico || l.conclusao || l.observacao) && (
          <section className="ios-list divide-y divide-border/70">
            <Row label="Sintomas" value={l.sintomas} />
            <Row label="Falha principal" value={l.falhaPrincipal} />
            <Row label="Parecer técnico" value={l.parecerTecnico} />
            <Row label="Conclusão" value={l.conclusao} />
            <Row label="Observação" value={l.observacao} />
          </section>
        )}
      </div>

      <p className="pb-4 text-center text-[12px] text-muted-foreground">
        Criado {fmtDate(l.createdon)} · atualizado {fmtDate(l.modifiedon)}
      </p>

      <Sheet open={confirmArchive} onOpenChange={setConfirmArchive}>
        <SheetContent side="center">
          <SheetTitle>Arquivar laudo?</SheetTitle>
          <SheetDescription>
            O laudo {l.os} ficará com <code>xStatus = "Inativo"</code> e sairá da listagem.
          </SheetDescription>
          <div className="mt-1 flex gap-2">
            <SheetClose asChild>
              <Button variant="neutral" block>
                Cancelar
              </Button>
            </SheetClose>
            <Button
              variant="danger"
              block
              disabled={archive.isPending}
              onClick={async () => {
                await archive.mutateAsync(l.id);
                navigate("/dpt", { replace: true });
              }}
            >
              {archive.isPending ? <Loader2 className="size-4 animate-spin" /> : "Arquivar"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
