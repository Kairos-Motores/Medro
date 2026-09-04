import { useEffect, useMemo, useState } from "react";
import { X, Search, Plus, Check, LayoutGrid, Move } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";
import { useWidgets } from "@/lib/useWidgets";
import { ACCENT, moduleById } from "@/modules/registry";
import { WIDGETS } from "./registry";
import { SIZE_LABEL, type WidgetDef } from "./types";

/** Loja de widgets — escolha e adicione à tela inicial. */
export function WidgetStore() {
  const can = useAuth((s) => s.can);
  const { storeOpen, setStoreOpen, mode, setMode, items, add } = useWidgets();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!storeOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setStoreOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [storeOpen, setStoreOpen]);

  const allowed = useMemo(
    () =>
      WIDGETS.filter((w) => {
        const modAcc = w.module ? moduleById(w.module).access : undefined;
        if (modAcc?.length && !can(...modAcc)) return false;
        if (w.access?.length && !can(...w.access)) return false;
        if (!q.trim()) return true;
        const t = q.toLowerCase();
        return w.title.toLowerCase().includes(t) || w.desc.toLowerCase().includes(t);
      }),
    [can, q],
  );

  // agrupa por módulo (ou "Sistema")
  const groups = useMemo(() => {
    const m = new Map<string, WidgetDef[]>();
    for (const w of allowed) {
      const key = w.module ? moduleById(w.module).label : "Sistema";
      const arr = m.get(key) ?? [];
      if (!m.has(key)) m.set(key, arr);
      arr.push(w);
    }
    return [...m.entries()];
  }, [allowed]);

  const countOnScreen = (id: string) => items.filter((it) => it.widgetId === id).length;

  if (!storeOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[55] flex flex-col bg-black/45 backdrop-blur-md"
      onClick={() => setStoreOpen(false)}
    >
      <div
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-[17px] font-semibold text-white">Widgets</h2>
          <div className="ml-2 flex items-center gap-1 rounded-lg bg-white/10 p-0.5 text-[11px]">
            <button
              onClick={() => setMode("grid")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 font-medium text-white/70",
                mode === "grid" && "bg-white/15 text-white",
              )}
            >
              <LayoutGrid className="size-3" /> Grade
            </button>
            <button
              onClick={() => setMode("free")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 font-medium text-white/70",
                mode === "free" && "bg-white/15 text-white",
              )}
            >
              <Move className="size-3" /> Livre
            </button>
          </div>
          <div className="relative ml-auto">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar widget…"
              className="w-56 rounded-lg bg-white/10 py-1.5 pl-8 pr-3 text-[12.5px] text-white placeholder:text-white/45 outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>
          <button
            onClick={() => setStoreOpen(false)}
            className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pr-1">
          {groups.length === 0 && (
            <p className="py-10 text-center text-[13px] text-white/60">Nenhum widget encontrado.</p>
          )}
          {groups.map(([label, list]) => (
            <div key={label}>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/50">
                {label}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {list.map((w) => {
                  const accent = w.module ? moduleById(w.module).accent : (w.accent ?? "slate");
                  const a = ACCENT[accent];
                  const Icon = w.icon;
                  const on = countOnScreen(w.id);
                  return (
                    <div
                      key={w.id}
                      className="flex gap-3 rounded-xl border border-white/12 bg-white/[0.06] p-3"
                    >
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface",
                          a.text,
                        )}
                      >
                        <Icon className="size-4.5" strokeWidth={1.9} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-white">
                          {w.title}
                          {on > 0 && (
                            <span className="rounded-full bg-white/15 px-1.5 text-[10px] font-medium text-white/80">
                              {on} na tela
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-[11.5px] text-white/55">{w.desc}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => add(w.id, w.defaultSize)}
                            className="flex items-center gap-1 rounded-md bg-white/15 px-2 py-1 text-[11px] font-medium text-white hover:bg-white/25"
                          >
                            {on > 0 ? <Check className="size-3" /> : <Plus className="size-3" />}
                            Adicionar
                          </button>
                          <span className="text-[10.5px] text-white/40">
                            {w.sizes.map((s) => SIZE_LABEL[s]).join(" · ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
