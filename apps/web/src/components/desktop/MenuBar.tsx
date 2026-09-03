import { Sun, Moon } from "lucide-react";
import { useWM } from "@/lib/wm";
import { useClock } from "@/lib/useClock";
import { useTheme } from "@/lib/theme";
import { NotificationsButton } from "@/components/layout/NotificationsButton";
import { UserMenu } from "@/components/layout/UserMenu";

export function MenuBar() {
  const { windows, activeId, setLaunchpad } = useWM();
  const active = windows.find((w) => w.id === activeId && !w.minimized);
  const { time, weekday, dateShort } = useClock();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="material-toolbar fixed inset-x-0 top-0 z-40 flex h-7 items-center gap-3 border-b border-border px-3 text-[12px]">
      <button onClick={() => setLaunchpad(true)} className="font-semibold text-foreground">
        Medro
      </button>
      {active && <span className="font-medium text-foreground-secondary">{active.title}</span>}

      <div className="ml-auto flex items-center gap-2">
        {/* Alternador direto de tema no clique (sem abrir menu) */}
        <button
          onClick={toggleTheme}
          className="flex size-6 items-center justify-center rounded-md text-foreground-secondary transition hover:bg-surface hover:text-foreground active:scale-90"
          title={theme === "dark" ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
          aria-label="Alternar tema"
        >
          {theme === "dark" ? (
            <Moon className="size-3.5 text-primary" />
          ) : (
            <Sun className="size-3.5 text-amber-500" />
          )}
        </button>

        <NotificationsButton />
        <span className="hidden tabular-nums text-foreground-secondary xs:inline">
          <span className="capitalize">{weekday}</span> {dateShort} · {time}
        </span>
        <UserMenu size={6} />
      </div>
    </div>
  );
}
