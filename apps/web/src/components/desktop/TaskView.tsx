import { useEffect } from "react";
import { X, LayoutGrid, Minus, Maximize2 } from "lucide-react";
import { useWM } from "@/lib/wm";
import { cn } from "@/lib/cn";
import { moduleById, ACCENT } from "@/modules/registry";

/** Multitarefa — visão geral das janelas (apps) abertas. */
export function TaskView() {
  const { taskview, setTaskView, windows, focus, close, minimize, tile } = useWM();

  useEffect(() => {
    if (!taskview) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTaskView(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [taskview, setTaskView]);

  if (!taskview) return null;

  const list = [...windows].sort((a, b) => b.z - a.z);

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-black/45 backdrop-blur-md"
      onClick={() => setTaskView(false)}
    >
      <div
        className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-[15px] font-semibold text-white">
            Janelas abertas <span className="text-white/50">({windows.length})</span>
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => tile()}
              disabled={windows.filter((w) => !w.minimized).length < 2}
              className="flex items-center gap-1.5 rounded-md bg-white/12 px-3 py-1.5 text-[12.5px] font-medium text-white transition hover:bg-white/20 disabled:opacity-40"
            >
              <LayoutGrid className="size-4" /> Organizar na tela
            </button>
            <button
              onClick={() => setTaskView(false)}
              className="flex size-8 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/20"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {windows.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-[13px] text-white/60">
            Nenhum app aberto.
          </div>
        ) : (
          <div className="grid flex-1 auto-rows-min grid-cols-2 gap-4 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4">
            {list.map((w) => {
              const m = moduleById(w.moduleId);
              const Icon = m.icon;
              const a = ACCENT[m.accent];
              return (
                <div
                  key={w.id}
                  className={cn(
                    "group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-surface transition",
                    w.minimized ? "border-white/10 opacity-60" : "border-white/20 hover:border-primary/60",
                  )}
                  onClick={() => focus(w.id)}
                >
                  {/* "preview" simbólico */}
                  <div className={cn("flex h-28 items-center justify-center", a.softBg)}>
                    <Icon className={cn("size-9", a.text)} strokeWidth={1.6} />
                  </div>
                  <div className="flex items-center gap-2 border-t border-border px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-semibold text-foreground">{w.title}</p>
                      <p className="truncate text-[10.5px] text-muted-foreground">
                        {w.minimized ? "minimizada" : w.maximized ? "maximizada" : "aberta"}
                      </p>
                    </div>
                    {!w.minimized && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          minimize(w.id);
                        }}
                        className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-surface-2"
                        title="Minimizar"
                      >
                        <Minus className="size-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        focus(w.id);
                      }}
                      className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-surface-2"
                      title="Abrir"
                    >
                      <Maximize2 className="size-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        close(w.id);
                      }}
                      className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-danger hover:text-white"
                      title="Fechar"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
