import { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  LayoutGrid,
  AppWindow,
  CalendarClock,
  PanelTop,
  PanelLeft,
  PanelRight,
  Eye,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { useWM } from "@/lib/wm";
import { useClock } from "@/lib/useClock";
import { useTheme } from "@/lib/theme";
import { useIsDesktop } from "@/lib/useMedia";
import { cn } from "@/lib/cn";
import {
  useMenuBarPrefs,
  isVerticalBar,
  BAR_ITEM_LABELS,
  type BarItemKey,
  type BarSurface,
  type BarPosition,
} from "@/lib/useMenuBarPrefs";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu";
import { NotificationsButton } from "@/components/layout/NotificationsButton";
import { UserMenu } from "@/components/layout/UserMenu";
import { DeviceStatus } from "./DeviceStatus";
import { ClockCard } from "./MenuBarCards";

export function MenuBar() {
  const { windows, activeId, setLaunchpad, setTaskView, tile } = useWM();
  const active = windows.find((w) => w.id === activeId && !w.minimized);
  const { time, weekday, dateShort } = useClock();
  const { theme, toggleTheme } = useTheme();
  const isDesktop = useIsDesktop();
  const prefs = useMenuBarPrefs();

  // customização de posição/auto-ocultar é só desktop; mobile fica sempre no topo
  const position: BarPosition = isDesktop ? prefs.position : "top";
  const surface: BarSurface = isDesktop ? prefs.surface : "glass";
  const autohide = isDesktop && prefs.autohide;
  const vertical = isVerticalBar(position);

  const [revealed, setRevealed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const shown = !autohide || revealed || menuOpen;

  // ao ligar o auto-ocultar, recolhe; ao desligar, mostra
  useEffect(() => {
    if (!autohide) setRevealed(false);
  }, [autohide]);

  const openCount = windows.length;
  const canTile = windows.filter((w) => !w.minimized).length >= 2;
  const V = prefs.isVisible;

  const surfaceCls =
    surface === "solid"
      ? "bg-surface border-border shadow-ios-1"
      : surface === "transparent"
        ? "border-transparent [text-shadow:0_1px_2px_rgb(0_0_0/0.28)] dark:[text-shadow:0_1px_3px_rgb(0_0_0/0.6)]"
        : "material-toolbar border-border";

  const posCls = vertical
    ? cn(
        "inset-y-0 w-10 flex-col items-center gap-1.5 py-2.5",
        position === "left" ? "left-0 border-r" : "right-0 border-l",
      )
    : "inset-x-0 top-0 h-7 flex-row items-center px-3 border-b";

  const offCls = shown
    ? "translate-x-0 translate-y-0"
    : position === "top"
      ? "-translate-y-[calc(100%+3px)]"
      : position === "left"
        ? "-translate-x-[calc(100%+3px)]"
        : "translate-x-[calc(100%+3px)]";

  const itemBtn =
    "flex size-6 items-center justify-center rounded-md text-foreground-secondary transition hover:bg-surface hover:text-foreground active:scale-90";

  const clockTrigger = vertical ? (
    <button className={itemBtn} aria-label="Data e hora" title={`${weekday} ${dateShort} · ${time}`}>
      <CalendarClock className="size-3.5" />
    </button>
  ) : (
    <button className="rounded px-1 tabular-nums text-foreground-secondary transition-colors hover:text-foreground">
      <span className="capitalize">{weekday}</span> {dateShort} · {time}
    </button>
  );

  return (
    <>
      <ContextMenu onOpenChange={setMenuOpen}>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              "fixed z-40 flex gap-2 border-[0.5px] text-[12px] transition-transform duration-300 ease-ios",
              posCls,
              surfaceCls,
              offCls,
            )}
            onPointerLeave={() => autohide && !menuOpen && setRevealed(false)}
          >
            {V("appName") && (
              <button
                onClick={() => setLaunchpad(true)}
                className={cn("font-semibold text-foreground", vertical && "text-[11px]")}
                title="Central de apps"
              >
                {vertical ? "M" : "Medro"}
              </button>
            )}

            {!vertical && active && V("windowTitle") && (
              <span className="hidden truncate font-medium text-foreground-secondary sm:inline">
                {active.title}
              </span>
            )}

            {openCount > 0 && V("windowControls") && (
              <div className={cn("flex items-center gap-0.5", vertical ? "mt-1 flex-col" : "ml-1")}>
                <button
                  onClick={() => tile()}
                  disabled={!canTile}
                  title="Organizar janelas na tela"
                  aria-label="Organizar janelas"
                  className={cn(itemBtn, "disabled:opacity-30")}
                >
                  <LayoutGrid className="size-3.5" />
                </button>
                <button
                  onClick={() => setTaskView(true)}
                  title="Janelas abertas (multitarefa)"
                  aria-label="Multitarefa"
                  className={cn(itemBtn, "relative")}
                >
                  <AppWindow className="size-3.5" />
                  <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold leading-none text-primary-foreground">
                    {openCount}
                  </span>
                </button>
              </div>
            )}

            {vertical && <div className="flex-1" />}

            <div className={cn("flex items-center gap-2", vertical ? "flex-col" : "ml-auto")}>
              {V("theme") && (
                <button
                  onClick={toggleTheme}
                  className={itemBtn}
                  title={theme === "dark" ? "Modo Claro" : "Modo Escuro"}
                  aria-label="Alternar tema"
                >
                  {theme === "dark" ? (
                    <Moon className="size-3.5 text-primary" />
                  ) : (
                    <Sun className="size-3.5 text-amber-500" />
                  )}
                </button>
              )}

              <DeviceStatus vertical={vertical} />
              {V("notifications") && <NotificationsButton />}
              {V("clock") && <ClockCard>{clockTrigger}</ClockCard>}
              <UserMenu size={vertical ? 5 : 6} />
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-56">
          <ContextMenuLabel>Barra do sistema</ContextMenuLabel>

          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <SlidersHorizontal className="size-3.5" /> Aparência
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuRadioGroup
                value={prefs.surface}
                onValueChange={(v) => prefs.setSurface(v as BarSurface)}
              >
                <ContextMenuRadioItem value="glass">Translúcida</ContextMenuRadioItem>
                <ContextMenuRadioItem value="solid">Sólida</ContextMenuRadioItem>
                <ContextMenuRadioItem value="transparent">
                  Transparente (só as informações)
                </ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <PanelTop className="size-3.5" /> Posição
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuRadioGroup
                value={prefs.position}
                onValueChange={(v) => prefs.setPosition(v as BarPosition)}
              >
                <ContextMenuRadioItem value="top">
                  <PanelTop className="size-3.5" /> Topo
                </ContextMenuRadioItem>
                <ContextMenuRadioItem value="left">
                  <PanelLeft className="size-3.5" /> Borda esquerda
                </ContextMenuRadioItem>
                <ContextMenuRadioItem value="right">
                  <PanelRight className="size-3.5" /> Borda direita
                </ContextMenuRadioItem>
              </ContextMenuRadioGroup>
              {!isDesktop && (
                <p className="px-2.5 py-1 text-[10.5px] text-muted-foreground">
                  Posição lateral só no desktop.
                </p>
              )}
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuCheckboxItem
            checked={prefs.autohide}
            onCheckedChange={() => prefs.setAutohide(!prefs.autohide)}
          >
            <Eye className="size-3.5" /> Ocultar automaticamente
          </ContextMenuCheckboxItem>

          <ContextMenuSeparator />

          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <SlidersHorizontal className="size-3.5" /> Mostrar itens
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-52">
              {(Object.keys(BAR_ITEM_LABELS) as BarItemKey[]).map((k) => (
                <ContextMenuCheckboxItem
                  key={k}
                  checked={prefs.isVisible(k)}
                  onCheckedChange={() => prefs.toggleItem(k)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {BAR_ITEM_LABELS[k]}
                </ContextMenuCheckboxItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSeparator />
          <ContextMenuItem onSelect={() => prefs.reset()}>
            <RotateCcw className="size-3.5" /> Restaurar padrão
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {autohide && !shown && (
        <div
          onPointerEnter={() => setRevealed(true)}
          className={cn(
            "fixed z-40",
            position === "top" && "inset-x-0 top-0 h-2",
            position === "left" && "inset-y-0 left-0 w-2",
            position === "right" && "inset-y-0 right-0 w-2",
          )}
          aria-hidden
        />
      )}
    </>
  );
}
