import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Printer, Search, SlidersHorizontal, CheckSquare, Square } from "lucide-react";
import { Skeleton } from "reshaped";
import { FILIAIS } from "@medro/shared";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";
import { useLaudos, usePdfStatus, type Laudo } from "./api";

type Encode = "app" | "token";
type Opts = {
  cols: number;
  size: number;
  level: "L" | "M" | "Q" | "H";
  encode: Encode;
  title: string;
  fields: { os: boolean; cliente: boolean; classe: boolean; emissor: boolean; data: boolean };
  onlyValid: boolean;
  onlyPdf: boolean;
};

const DEFAULT: Opts = {
  cols: 3,
  size: 120,
  level: "M",
  encode: "app",
  title: "Laudos — QR Codes",
  fields: { os: true, cliente: true, classe: true, emissor: false, data: false },
  onlyValid: false,
  onlyPdf: false,
};

export function QrCodesPage() {
  const userFilial = useAuth((s) => s.user?.filial);
  const [search, setSearch] = useState("");
  const [filial, setFilial] = useState(userFilial ?? "");
  const [opts, setOpts] = useState<Opts>(DEFAULT);
  const [showOpts, setShowOpts] = useState(true);
  const [selected, setSelected] = useState<Set<string> | null>(null); // null = todos

  const q = useLaudos({ search: search.trim() || undefined, filial: filial || undefined });
  const base = q.data?.items ?? [];
  const pdfStatus = usePdfStatus(opts.onlyPdf ? base.map((l) => l.id) : []);

  const items = useMemo(() => {
    let list = base;
    if (opts.onlyValid) list = list.filter((l) => l.qrValid);
    if (opts.onlyPdf) list = list.filter((l) => pdfStatus.data?.[l.id]);
    return list;
  }, [base, opts.onlyValid, opts.onlyPdf, pdfStatus.data]);

  const printItems = selected ? items.filter((l) => selected.has(l.id)) : items;
  const origin = window.location.origin;

  function encodeValue(l: Laudo) {
    if (opts.encode === "token" && l.qrValid) return l.qrValid;
    return `${origin}/dpt/laudo/${l.id}`;
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev ?? items.map((l) => l.id));
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  const allSelected = !selected || selected.size === items.length;

  const set = <K extends keyof Opts>(k: K, v: Opts[K]) => setOpts((o) => ({ ...o, [k]: v }));

  return (
    <div className="space-y-4">
      {/* filtros */}
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto] print:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="OS, cliente…" className="pl-9" />
        </div>
        <Select value={filial} onChange={(e) => setFilial(e.target.value)} className="text-[13px] sm:w-44">
          <option value="">Todas as filiais</option>
          {FILIAIS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </Select>
        <Button variant="neutral" size="sm" onClick={() => setShowOpts((v) => !v)}>
          <SlidersHorizontal className="size-4" /> Opções
        </Button>
      </div>

      {/* painel de opções de impressão */}
      {showOpts && (
        <div className="space-y-3 rounded-lg border border-border bg-surface p-4 print:hidden">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
            Opções de impressão
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1">
              <span className="text-[12px] font-medium text-muted-foreground">Colunas / página</span>
              <Select value={opts.cols} onChange={(e) => set("cols", Number(e.target.value))} className="h-9 text-[13px]">
                {[2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </Select>
            </label>
            <label className="space-y-1">
              <span className="text-[12px] font-medium text-muted-foreground">Tamanho do QR</span>
              <Select value={opts.size} onChange={(e) => set("size", Number(e.target.value))} className="h-9 text-[13px]">
                <option value={80}>Pequeno</option>
                <option value={120}>Médio</option>
                <option value={160}>Grande</option>
                <option value={200}>Extra</option>
              </Select>
            </label>
            <label className="space-y-1">
              <span className="text-[12px] font-medium text-muted-foreground">Correção de erro</span>
              <Select value={opts.level} onChange={(e) => set("level", e.target.value as Opts["level"])} className="h-9 text-[13px]">
                <option value="L">Baixa (L)</option>
                <option value="M">Média (M)</option>
                <option value="Q">Alta (Q)</option>
                <option value="H">Máxima (H)</option>
              </Select>
            </label>
            <label className="space-y-1">
              <span className="text-[12px] font-medium text-muted-foreground">Conteúdo do QR</span>
              <Select value={opts.encode} onChange={(e) => set("encode", e.target.value as Encode)} className="h-9 text-[13px]">
                <option value="app">Link do laudo (app)</option>
                <option value="token">Token de validação</option>
              </Select>
            </label>
          </div>

          <label className="block space-y-1">
            <span className="text-[12px] font-medium text-muted-foreground">Título da folha</span>
            <Input value={opts.title} onChange={(e) => set("title", e.target.value)} className="h-9" />
          </label>

          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
            {(
              [
                ["os", "OS"],
                ["cliente", "Cliente"],
                ["classe", "Classe"],
                ["emissor", "Emissor"],
                ["data", "Data"],
              ] as const
            ).map(([k, lbl]) => (
              <label key={k} className="flex items-center gap-2 text-[13px] text-foreground">
                <input
                  type="checkbox"
                  checked={opts.fields[k]}
                  onChange={(e) => set("fields", { ...opts.fields, [k]: e.target.checked })}
                  className="size-4 accent-[rgb(var(--primary))]"
                />
                {lbl}
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-3">
            <label className="flex items-center gap-2 text-[13px] text-foreground">
              <input type="checkbox" checked={opts.onlyValid} onChange={(e) => set("onlyValid", e.target.checked)} className="size-4 accent-[rgb(var(--primary))]" />
              Só QR válido
            </label>
            <label className="flex items-center gap-2 text-[13px] text-foreground">
              <input type="checkbox" checked={opts.onlyPdf} onChange={(e) => set("onlyPdf", e.target.checked)} className="size-4 accent-[rgb(var(--primary))]" />
              Só com PDF no SharePoint
            </label>
          </div>
        </div>
      )}

      {/* ações */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => setSelected(allSelected ? new Set() : null)}
          className="flex items-center gap-1.5 text-[13px] text-primary"
        >
          {allSelected ? <CheckSquare className="size-4" /> : <Square className="size-4" />}
          {allSelected ? "Todos selecionados" : `${selected?.size ?? 0} selecionado(s)`}
        </button>
        <Button size="sm" onClick={() => window.print()} disabled={printItems.length === 0}>
          <Printer className="size-4" /> Imprimir {printItems.length}
        </Button>
      </div>

      {/* grade */}
      {q.isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={150} borderRadius="medium" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="py-14 text-center text-[14px] text-muted-foreground">Nenhum laudo.</p>
      ) : (
        <>
          <h2 className="hidden text-center text-[15px] font-semibold print:block">{opts.title}</h2>
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${opts.cols}, minmax(0, 1fr))` }}
          >
            {(selected ? items : items).map((l) => {
              const inPrint = !selected || selected.has(l.id);
              return (
                <div
                  key={l.id}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-3",
                    !inPrint && "opacity-40 print:hidden",
                  )}
                >
                  <label className="flex w-full items-start justify-between print:hidden">
                    <input
                      type="checkbox"
                      checked={inPrint}
                      onChange={() => toggle(l.id)}
                      className="size-4 accent-[rgb(var(--primary))]"
                    />
                  </label>
                  <div className="rounded bg-white p-2">
                    <QRCodeSVG value={encodeValue(l)} size={opts.size} level={opts.level} fgColor="#27323E" />
                  </div>
                  <div className="w-full text-center leading-tight">
                    {opts.fields.os && <p className="text-[12.5px] font-semibold text-foreground">{l.os || l.osSemSigla}</p>}
                    {opts.fields.cliente && l.cliente && <p className="truncate text-[10.5px] text-muted-foreground">{l.cliente}</p>}
                    {opts.fields.classe && l.classeLaudo && <p className="text-[10.5px] text-muted-foreground">{l.classeLaudo}</p>}
                    {opts.fields.emissor && l.emissor && <p className="truncate text-[10px] text-muted-foreground">{l.emissor}</p>}
                    {opts.fields.data && l.dataLaudo && (
                      <p className="text-[10px] text-muted-foreground">{l.dataLaudo.slice(0, 10)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
