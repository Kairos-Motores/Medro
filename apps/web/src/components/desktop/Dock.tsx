import { LayoutGrid } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useWM } from "@/lib/wm";
import { cn } from "@/lib/cn";
import { MODULES, ACCENT, moduleById } from "@/modules/registry";

export function Dock() {
  const can = useAuth((s) => s.can);
  const { windows, open, focus, setLaunchpad, activeId } = useWM();
  const visible = MODULES.filter((m) => !m.access || can(...m.access));
  const minimized = windows.filter((w) => w.minimized);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-2 lg:pb-2.5">
      <div className="material-menu pointer-events-auto flex items-end gap-1.5 rounded-2xl border border-white/25 px-2 py-1.5 shadow-mac-2">
        <button
          onClick={() => setLaunchpad(true)}
          className="group relative flex size-11 items-center justify-center rounded-xl bg-gradient-to-b from-slate-500/90 to-slate-700/90 text-white transition-transform duration-150 hover:-translate-y-1"
          title="Launchpad"
        >
          <LayoutGrid className="size-5" />
        </button>

        <span className="mx-1 h-9 w-px self-center bg-black/10" />

        {visible.map((m) => {
          const Icon = m.icon;
          const a = ACCENT[m.accent];
          const win = windows.find((w) => w.moduleId === m.id);
          const running = !!win;
          const isActive = win && win.id === activeId && !win.minimized;
          return (
            <button
              key={m.id}
              onClick={() => open(m.id, m.label)}
              title={m.label}
              className={cn(
                "group relative flex size-11 items-center justify-center rounded-xl border border-black/5 bg-surface transition-transform duration-150 hover:-translate-y-1",
                a.text,
              )}
            >
              <Icon className="size-[22px]" strokeWidth={2} />
              {running && (
                <span
                  className={cn(
                    "absolute -bottom-1 size-1 rounded-full",
                    isActive ? "bg-foreground" : "bg-foreground/40",
                  )}
                />
              )}
              <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-elevated-dark px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {m.label}
              </span>
            </button>
          );
        })}

        {minimized.length > 0 && <span className="mx-1 h-9 w-px self-center bg-black/10" />}
        {minimized.map((w) => {
          const m = moduleById(w.moduleId);
          const Icon = m.icon;
          return (
            <button
              key={w.id}
              onClick={() => focus(w.id)}
              title={w.title}
              className="group relative flex size-11 items-center justify-center rounded-xl border border-black/5 bg-surface/70 text-muted-foreground transition-transform duration-150 hover:-translate-y-1"
            >
              <Icon className="size-[20px]" />
              <span className="absolute -bottom-1 size-1 rounded-full bg-foreground/30" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
