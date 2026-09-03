import { Sun, Moon, LayoutGrid, AppWindow } from "lucide-react";
import { useWM } from "@/lib/wm";
import { useClock } from "@/lib/useClock";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/cn";
import { NotificationsButton } from "@/components/layout/NotificationsButton";
import { UserMenu } from "@/components/layout/UserMenu";
import { DeviceStatus } from "./DeviceStatus";

export function MenuBar() {
  const { windows, activeId, setLaunchpad, setTaskView, tile } = useWM();
  const active = windows.find((w) => w.id === activeId && !w.minimized);
  const { time, weekday, dateShort } = useClock();
  const { theme, toggleTheme } = useTheme();

  const openCount = windows.length;
  const canTile = windows.filter((w) => !w.minimized).length >= 2;

  return (
    <div className="material-toolbar fixed inset-x-0 top-0 z-40 flex h-7 items-center gap-2 border-b border-border px-3 text-[12px]">
      <button onClick={() => setLaunchpad(true)} className="font-semibold text-foreground">
        Medro
      </button>
      {active && (
        <span className="hidden truncate font-medium text-foreground-secondary sm:inline">
          {active.title}
        </span>
      )}

      {openCount > 0 && (
        <div className="ml-1 flex items-center gap-0.5">
          <button
            onClick={() => tile()}
            disabled={!canTile}
            title="Organizar janelas na tela"
            aria-label="Organizar janelas"
            className="flex size-6 items-center justify-center rounded-md text-foreground-secondary transition hover:bg-surface hover:text-foreground active:scale-90 disabled:opacity-30"
          >
            <LayoutGrid className="size-3.5" />
          </button>
          <button
            onClick={() => setTaskView(true)}
            title="Janelas abertas (multitarefa)"
            aria-label="Multitarefa"
            className="relative flex size-6 items-center justify-center rounded-md text-foreground-secondary transition hover:bg-surface hover:text-foreground active:scale-90"
          >
            <AppWindow className="size-3.5" />
            <span
              className={cn(
                "absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold leading-none text-primary-foreground",
              )}
            >
              {openCount}
            </span>
          </button>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
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

        <DeviceStatus />
        <NotificationsButton />
        <span className="hidden tabular-nums text-foreground-secondary xs:inline">
          <span className="capitalize">{weekday}</span> {dateShort} · {time}
        </span>
        <UserMenu size={6} />
      </div>
    </div>
  );
}
