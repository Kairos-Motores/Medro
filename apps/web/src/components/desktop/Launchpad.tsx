import { useEffect } from "react";
import { Lock, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useWM } from "@/lib/wm";
import { cn } from "@/lib/cn";
import { MODULES, ACCENT } from "@/modules/registry";

export function Launchpad() {
  const can = useAuth((s) => s.can);
  const { launchpad, setLaunchpad, open } = useWM();

  useEffect(() => {
    if (!launchpad) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLaunchpad(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [launchpad, setLaunchpad]);

  if (!launchpad) return null;

  const mods = MODULES.map((m) => ({ ...m, allowed: !m.access || can(...m.access) }));

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-black/40 px-6 pb-16 pt-16 backdrop-blur-xl"
      onClick={() => setLaunchpad(false)}
    >
      <button
        onClick={() => setLaunchpad(false)}
        className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="size-5" />
      </button>

      <div
        className="grid max-w-4xl grid-cols-3 gap-x-8 gap-y-7 sm:grid-cols-4 lg:grid-cols-6"
        onClick={(e) => e.stopPropagation()}
      >
        {mods.map((m) => {
          const Icon = m.icon;
          const a = ACCENT[m.accent];
          return (
            <button
              key={m.id}
              disabled={!m.allowed}
              onClick={() => m.allowed && open(m.id, m.label)}
              className="group flex w-24 flex-col items-center gap-2 disabled:opacity-40"
            >
              <span
                className={cn(
                  "relative flex size-16 items-center justify-center rounded-2xl border border-white/20 bg-surface shadow-mac-2 transition-transform duration-150",
                  m.allowed && "group-hover:scale-105 group-active:scale-95",
                  a.text,
                )}
              >
                <Icon className="size-7" strokeWidth={1.9} />
                {!m.allowed && (
                  <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-elevated-dark text-white">
                    <Lock className="size-3" />
                  </span>
                )}
              </span>
              <span className="text-center text-[12px] font-medium leading-tight text-white">
                {m.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
