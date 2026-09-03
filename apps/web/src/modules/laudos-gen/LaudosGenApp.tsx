import { useEffect, useMemo, useState } from "react";
import {
  Search,
  FileDown,
  Save,
  Loader2,
  GripVertical,
  AlertTriangle,
  Building2,
  User,
  Hash,
} from "lucide-react";
import { Skeleton } from "reshaped";
import { cn } from "@/lib/cn";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useOs,
  useRascunho,
  useSalvarRascunho,
  useBalanceamento,
  useGerarPdf,
  useArquivoStatus,
} from "./api";
import { DEFAULT_LAYOUT, type LaudoPage } from "./layout";

export function LaudosGenApp() {
  const [osInput, setOsInput] = useState("");
  const [osId, setOsId] = useState<string | null>(null);
  const [layout, setLayout] = useState<LaudoPage[]>(DEFAULT_LAYOUT);
  const [selectedPageId, setSelectedPageId] = useState<string>(DEFAULT_LAYOUT[0]!.id);
  const [pdfMsg, setPdfMsg] = useState<string | null>(null);
  const [acompanharArquivo, setAcompanharArquivo] = useState(false);
  const arquivo = useArquivoStatus(osId, acompanharArquivo);

  useEffect(() => {
    const st = arquivo.data?.estado;
    if (!acompanharArquivo || !st || st === "arquivando") return;
    if (st === "ok") setPdfMsg("PDF gerado e arquivado no SharePoint.");
    else if (st === "erro") setPdfMsg("PDF gerado. Não foi possível arquivar no SharePoint.");
    setAcompanharArquivo(false);
  }, [arquivo.data, acompanharArquivo]);

  const os = useOs(osId);
  const rascunho = useRascunho(osId);
  const balanceamento = useBalanceamento(osId);
  const salvar = useSalvarRascunho();
  const gerarPdf = useGerarPdf();

  // aplica o layout salvo no rascunho, se houver
  useEffect(() => {
    const saved = rascunho.data as { modelConfig?: { layout?: LaudoPage[] } } | undefined;
    if (saved?.modelConfig?.layout?.length) {
      setLayout(saved.modelConfig.layout);
      setSelectedPageId((prev) =>
        saved.modelConfig!.layout!.some((p) => p.id === prev) ? prev : saved.modelConfig!.layout![0]!.id,
      );
    }
  }, [rascunho.data]);

  const selectedPage = useMemo(
    () => layout.find((p) => p.id === selectedPageId) ?? layout[0],
    [layout, selectedPageId],
  );

  const osNumero = (os.data?.cr4a1_novacoluna as string) || osId || "";
  const cliente = (os.data?.cr4a1_cliente_nome as string) || "—";
  const unidade = os.data?.unidade_nome || "—";

  function carregar(valor?: string) {
    const v = (valor ?? osInput).trim();
    if (v) setOsId(v);
  }

  function salvarRascunho() {
    if (!osId) return;
    salvar.mutate({
      osId,
      tipo: "padrao",
      state: { ...(rascunho.data ?? {}), modelConfig: { layout }, _via: "medro-web" },
    });
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* toolbar do módulo */}
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
        <Button size="sm" onClick={() => carregar()} disabled={os.isFetching}>
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

            <div className="ml-auto flex items-center gap-2">
              <Button variant="neutral" size="sm" onClick={salvarRascunho} disabled={salvar.isPending}>
                {salvar.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Salvar rascunho
              </Button>
              <Button
                size="sm"
                disabled={!osId || gerarPdf.isPending}
                onClick={async () => {
                  if (!osId) return;
                  setPdfMsg(null);
                  try {
                    const r = await gerarPdf.mutateAsync({ osId });
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
                }}
              >
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

      {pdfMsg && (
        <div className="flex items-center gap-2 border-b border-border bg-primary/[0.06] px-4 py-1.5 text-[12px] text-primary">
          <FileDown className="size-3.5" />
          {pdfMsg}
        </div>
      )}

      {/* corpo */}
      {!osId ? (
        <EmptyState />
      ) : os.isLoading ? (
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
        <div className="grid min-h-0 flex-1 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* navegador de páginas */}
          <aside className="min-h-0 overflow-y-auto border-r border-border bg-surface-2 p-3">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Páginas do laudo
            </p>
            <ol className="space-y-0.5">
              {layout.map((p, i) => (
                <li key={p.id}>
                  <button
                    onClick={() => setSelectedPageId(p.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12.5px] transition-colors",
                      p.id === selectedPageId
                        ? "bg-primary/12 font-medium text-primary"
                        : "text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                    )}
                  >
                    <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="w-5 shrink-0 text-[11px] text-muted-foreground">{i + 1}</span>
                    <span className="truncate">{p.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </aside>

          {/* editor da página (placeholder — porte dos editores na próxima fase) */}
          <section className="min-h-0 overflow-y-auto p-6">
            <header className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Editor
              </p>
              <h2 className="text-[16px] font-semibold text-foreground">{selectedPage?.title}</h2>
              <p className="text-[12px] text-muted-foreground">
                Tipo: <code>{selectedPage?.type}</code>
              </p>
            </header>

            <div className="rounded-lg border border-dashed border-border bg-surface p-8 text-center text-[13px] text-muted-foreground">
              Editor desta página será portado do app <code>Gerador_relatorios</code> na próxima
              fase, com a identidade visual do Medro.
              <div className="mt-3 text-[12px]">
                Dados já disponíveis:{" "}
                <strong>{Object.keys(os.data ?? {}).length}</strong> campos da OS
                {balanceamento.data?.encontrado ? " · balanceamento encontrado" : ""}
              </div>
            </div>

            {selectedPage?.id === "summary" && os.data && (
              <div className="mt-4 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-[12px]">
                  <tbody>
                    {[
                      ["Cliente", cliente],
                      ["Unidade", unidade],
                      ["TAG", (os.data.cr4a1_tag_kairos as string) || "—"],
                      ["Equipamento", (os.data.cr4a1_zb6_equipamento as string) || "—"],
                      ["Fabricante", (os.data.cr4a1_zb6_fabricante as string) || "—"],
                      ["Potência", (os.data.cr4a1_zb6_potencia as string) || "—"],
                    ].map(([k, v]) => (
                      <tr key={k} className="border-b border-border last:border-0">
                        <td className="w-40 bg-surface-2 px-3 py-1.5 font-medium text-muted-foreground">{k}</td>
                        <td className="px-3 py-1.5 text-foreground">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center text-muted-foreground">
      <FileDown className="size-8 opacity-40" />
      <p className="text-[13px]">
        Informe o número da OS acima para começar a montar o laudo.
      </p>
      <p className="text-[12px] opacity-70">Acesso restrito ao Departamento Técnico.</p>
    </div>
  );
}
