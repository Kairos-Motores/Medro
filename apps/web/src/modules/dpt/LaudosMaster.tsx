import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Plus, FileText, QrCode, ChevronRight, RefreshCw, Paperclip } from "lucide-react";
import { Skeleton } from "reshaped";
import { useAuth } from "@/lib/auth";
import { FILIAIS } from "@medro/shared";
import { cn } from "@/lib/cn";
import { Input, Select } from "@/components/ui/input";
import { useLaudos, usePdfStatus, type Laudo } from "./api";

function monthKey(l: Laudo): string {
  const raw = l.dataLaudo || l.createdon;
  if (!raw) return "Sem data";
  try {
    return format(parseISO(raw), "MMMM yyyy", { locale: ptBR });
  } catch {
    return "Sem data";
  }
}

const badgeTone = [
  "bg-accent-teal/12 text-accent-teal",
  "bg-accent-violet/12 text-accent-violet",
  "bg-accent-cyan/12 text-accent-cyan",
  "bg-accent-amber/12 text-accent-amber",
  "bg-accent-indigo/12 text-accent-indigo",
];
function toneFor(tipo: string, tipos: string[]) {
  const idx = tipos.indexOf(tipo);
  return badgeTone[idx % badgeTone.length] ?? "bg-surface-muted text-muted-foreground";
}

export function LaudosMaster({ activeId }: { activeId?: string }) {
  const navigate = useNavigate();
  const userFilial = useAuth((s) => s.user?.filial);
  const [search, setSearch] = useState("");
  const [tipoSel, setTipoSel] = useState<string>("todos");
  const [filial, setFilial] = useState<string>(userFilial ?? "");

  const q = useLaudos({ search: search.trim() || undefined, filial: filial || undefined });
  const all = q.data?.items ?? [];

  const tipos = useMemo(
    () => [...new Set(all.map((l) => l.tipoLaudo).filter(Boolean) as string[])].sort(),
    [all],
  );
  const items = useMemo(
    () => (tipoSel === "todos" ? all : all.filter((l) => l.tipoLaudo === tipoSel)),
    [all, tipoSel],
  );

  const pdfStatus = usePdfStatus(items.map((l) => l.id));

  const groups = useMemo(() => {
    const map = new Map<string, Laudo[]>();
    for (const l of items) {
      const k = monthKey(l);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(l);
    }
    return [...map.entries()];
  }, [items]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="OS, emissor, cliente, classe…"
          className="pl-9"
          inputMode="search"
        />
      </div>

      {tipos.length > 1 && (
        <div className="flex gap-1 overflow-x-auto rounded-md bg-surface-muted p-1">
          {["todos", ...tipos].map((t) => (
            <button
              key={t}
              onClick={() => setTipoSel(t)}
              className={cn(
                "shrink-0 rounded-sm px-3 py-1.5 text-[12.5px] font-semibold capitalize transition-all duration-200 ease-ios",
                tipoSel === t ? "bg-surface text-foreground shadow-ios-1" : "text-muted-foreground",
              )}
            >
              {t === "todos" ? "Todos" : t}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Select value={filial} onChange={(e) => setFilial(e.target.value)} className="h-9 text-[13px]">
          <option value="">Todas as filiais</option>
          {FILIAIS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </Select>
        <span className="shrink-0 text-[12px] text-muted-foreground">{items.length}</span>
        <button
          onClick={() => q.refetch()}
          className="ml-auto flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-[13px] text-primary active:opacity-60"
        >
          <RefreshCw className={cn("size-3.5", q.isFetching && "animate-spin")} />
        </button>
      </div>

      {q.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} height={16} borderRadius="small" />
          ))}
        </div>
      ) : q.isError ? (
        <p className="rounded-lg bg-danger/10 p-4 text-center text-[13px] text-danger">
          Não foi possível carregar os laudos.
        </p>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-14 text-center text-muted-foreground">
          <FileText className="size-8" />
          <p className="text-[14px]">Nenhum laudo encontrado.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(([label, rows]) => (
            <section key={label}>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {label} · {rows.length}
              </p>
              <div className="ios-list">
                {rows.map((l, i) => {
                  const hasPdf = pdfStatus.data?.[l.id];
                  return (
                    <button
                      key={l.id}
                      onClick={() => navigate(`/dpt/laudo/${l.id}`)}
                      className={cn(
                        "ios-row stagger-item w-full text-left",
                        activeId === l.id && "bg-primary/[0.06]",
                      )}
                      style={{ animationDelay: `${Math.min(i, 8) * 22}ms` }}
                    >
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-md",
                          l.tipoLaudo ? toneFor(l.tipoLaudo, tipos) : "bg-primary/10 text-primary",
                        )}
                      >
                        <FileText className="size-[18px]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14.5px] font-semibold text-foreground">
                          {l.os || l.osSemSigla || "—"}
                        </p>
                        <p className="truncate text-[11.5px] text-muted-foreground">
                          {[l.cliente, l.classeLaudo, l.emissor].filter(Boolean).join(" · ") || "—"}
                        </p>
                      </div>
                      {hasPdf && (
                        <span title="PDF disponível no SharePoint">
                          <Paperclip className="size-3.5 shrink-0 text-accent-teal" />
                        </span>
                      )}
                      {l.qrValid && <QrCode className="size-3.5 shrink-0 text-success" />}
                      {l.tipoLaudo && (
                        <span
                          className={cn(
                            "shrink-0 rounded px-1.5 py-0.5 text-[10.5px] font-semibold capitalize",
                            toneFor(l.tipoLaudo, tipos),
                          )}
                        >
                          {l.tipoLaudo}
                        </span>
                      )}
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate("/dpt/laudo/novo")}
        className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-4 z-20 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-ios-2 transition-transform duration-200 ease-ios active:scale-90 lg:static lg:h-10 lg:w-full lg:gap-2 lg:rounded-md lg:text-[13.5px] lg:font-semibold lg:shadow-none"
        aria-label="Novo laudo"
      >
        <Plus className="size-7 lg:size-4" />
        <span className="hidden lg:inline">Novo laudo</span>
      </button>
    </div>
  );
}
