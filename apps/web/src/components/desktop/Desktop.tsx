import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  X,
  LayoutGrid,
  AppWindow,
  LayoutDashboard,
  FilePlus2,
  LayoutPanelLeft,
  Move,
  Plus,
} from "lucide-react";
import { useWM, type WinRect } from "@/lib/wm";
import { useAuth } from "@/lib/auth";
import { useIsDesktop } from "@/lib/useMedia";
import { useMenuBarPrefs } from "@/lib/useMenuBarPrefs";
import { useWidgets } from "@/lib/useWidgets";
import { cn } from "@/lib/cn";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from "@/components/ui/context-menu";
import { ModuleHost } from "@/modules/ModuleHost";
import { MenuBar } from "./MenuBar";
import { DesktopIcons } from "./DesktopIcons";
import { Dock } from "./Dock";
import { Launchpad } from "./Launchpad";
import { TaskView } from "./TaskView";
import { WindowFrame } from "./WindowFrame";
import { WallpaperBackground } from "./WallpaperBackground";
import { FloatingDockTrigger } from "./FloatingDockTrigger";
import { WidgetLayer, MobileWidgetStack } from "@/modules/widgets/WidgetLayer";
import { WidgetStore } from "@/modules/widgets/WidgetStore";
import { api } from "@/lib/api";
import type { UserSession } from "@medro/shared";
import type { WidgetId, WidgetSize } from "@/modules/widgets/types";

/** Ambiente de janelas macOS com papel de parede adaptativo, dock dinâmico e auto-ocultação inteligente. */
export function Desktop() {
  const isDesktop = useIsDesktop();
  const { windows, activeId, close, setBounds: setStoreBounds, open, tile, setTaskView, setLaunchpad } =
    useWM();
  const canDpt = useAuth((s) => s.can("DPT"));
  const canCal = useAuth((s) => s.can("CAL"));
  const hasUser = useAuth((s) => !!s.user);
  const barPosition = useMenuBarPrefs((s) => s.position);
  const barAutohide = useMenuBarPrefs((s) => s.autohide);
  const widgetMode = useWidgets((s) => s.mode);
  const setWidgetMode = useWidgets((s) => s.setMode);
  const setWidgetStore = useWidgets((s) => s.setStoreOpen);
  const seedWidgets = useWidgets((s) => s.seedDefaults);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<WinRect>({ x: 0, y: 0, w: 1200, h: 700 });
  const [dockManualShow, setDockManualShow] = useState(false);

  // Tela inicial de widgets padrão — só na 1ª vez neste navegador e se vazia.
  useEffect(() => {
    if (!hasUser) return;
    const picks: { widgetId: WidgetId; size: WidgetSize }[] = [
      { widgetId: "relogio", size: "md" },
      { widgetId: "farol-os", size: "md" },
    ];
    if (canDpt) picks.push({ widgetId: "laudos-andamento", size: "md" });
    if (canCal) picks.push({ widgetId: "caldeiraria-kpis", size: "md" });
    seedWidgets(picks);
  }, [hasUser, canDpt, canCal, seedWidgets]);

  // Sincroniza sessão do usuário com o Dataverse no carregamento
  useEffect(() => {
    api<{ user: UserSession }>("/auth/me")
      .then((res) => {
        if (res.user && useAuth.getState().token) {
          useAuth.getState().refreshUser(res.user);
        }
      })
      .catch(() => {});
  }, []);

  useLayoutEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const sync = () => {
      const r = { x: 0, y: 0, w: el.clientWidth, h: el.clientHeight };
      setBounds(r);
      setStoreBounds(r);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isDesktop, setStoreBounds, barPosition, barAutohide]);

  const openWindows = windows.filter((w) => !w.minimized);
  const topId =
    openWindows.length > 0
      ? openWindows.reduce((a, b) => (a.z >= b.z ? a : b)).id
      : null;

  const active = windows.find((w) => w.id === activeId) ?? openWindows.at(-1) ?? null;

  // Identifica se há aplicativo em tela cheia (maximizada) ou preenchendo a área inferior do dock
  const isCoveringDock = !isDesktop
    ? !!active
    : openWindows.some((w) => w.maximized || w.rect.y + w.rect.h >= bounds.h - 65);

  // Quando nenhuma janela estiver cobrindo a área da barra, reseta o estado manual
  useEffect(() => {
    if (!isCoveringDock) {
      setDockManualShow(false);
    }
  }, [isCoveringDock]);

  // Se estiver cobrindo o dock, oculta automaticamente a menos que o usuário tenha clicado no ícone flutuante
  const isDockHidden = isCoveringDock && !dockManualShow;

  if (!isDesktop) {
    return (
      <div className="relative flex h-dvh flex-col overflow-hidden bg-bg">
        <WallpaperBackground />
        <MenuBar />
        <div className="relative z-10 min-h-0 flex-1 overflow-auto pb-16 pt-7">
          {active ? (
            <div className="flex min-h-full flex-col">
              <div className="material-toolbar sticky top-0 z-10 flex h-10 items-center gap-2 border-b border-border pl-3 pr-1">
                <span className="flex-1 truncate text-[13px] font-semibold text-foreground">
                  {active.title}
                </span>
                <button
                  onClick={() => close(active.id)}
                  className="flex size-8 items-center justify-center rounded-md text-foreground-secondary transition hover:bg-danger hover:text-white"
                  aria-label="Fechar"
                >
                  <X className="size-4" strokeWidth={2.5} />
                </button>
              </div>
              <ModuleHost
                key={active.id}
                moduleId={active.moduleId}
                params={active.params}
                paramsNonce={active.paramsNonce}
              />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-4 pt-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Tela inicial
                </span>
                <button
                  onClick={() => setWidgetStore(true)}
                  className="flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[11.5px] font-medium text-foreground"
                >
                  <Plus className="size-3" /> Widgets
                </button>
              </div>
              <MobileWidgetStack />
            </>
          )}
        </div>

        <Dock hidden={isDockHidden} />

        {isCoveringDock && (
          <FloatingDockTrigger
            revealed={dockManualShow}
            onToggle={() => setDockManualShow((v) => !v)}
          />
        )}

        <Launchpad />
        <TaskView />
        <WidgetStore />
      </div>
    );
  }

  // a área útil recua conforme a barra do sistema; com auto-ocultar ela some e a
  // área ocupa tudo (a barra passa a flutuar por cima).
  const surfaceInset = barAutohide
    ? "inset-0"
    : barPosition === "left"
      ? "inset-y-0 right-0 left-10"
      : barPosition === "right"
        ? "inset-y-0 left-0 right-10"
        : "inset-x-0 bottom-0 top-7";

  return (
    <div className="relative h-dvh overflow-hidden bg-bg">
      <WallpaperBackground />
      <MenuBar />
      <div ref={surfaceRef} className={cn("absolute z-10", surfaceInset)}>
        <DesktopIcons />
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="absolute inset-0 z-0 overflow-x-hidden overflow-y-auto overscroll-contain">
              <WidgetLayer bounds={bounds} />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onSelect={() => setLaunchpad(true)}>
              <LayoutDashboard className="size-3.5" /> Central de apps
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => setWidgetStore(true)}>
              <LayoutPanelLeft className="size-3.5" /> Adicionar widget…
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Move className="size-3.5" /> Organização dos widgets
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuRadioGroup
                  value={widgetMode}
                  onValueChange={(v) => setWidgetMode(v as "grid" | "free")}
                >
                  <ContextMenuRadioItem value="grid">
                    <LayoutGrid className="size-3.5" /> Grade (alinha ao soltar)
                  </ContextMenuRadioItem>
                  <ContextMenuRadioItem value="free">
                    <Move className="size-3.5" /> Livre (posição solta)
                  </ContextMenuRadioItem>
                </ContextMenuRadioGroup>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem
              disabled={openWindows.length < 2}
              onSelect={() => tile()}
            >
              <LayoutGrid className="size-3.5" /> Organizar janelas
            </ContextMenuItem>
            <ContextMenuItem
              disabled={windows.length === 0}
              onSelect={() => setTaskView(true)}
            >
              <AppWindow className="size-3.5" /> Ver janelas abertas
            </ContextMenuItem>
            {canDpt && (
              <>
                <ContextMenuSeparator />
                <ContextMenuItem onSelect={() => open("laudos-gen", "Gerador de Laudos")}>
                  <FilePlus2 className="size-3.5" /> Novo laudo
                </ContextMenuItem>
              </>
            )}
          </ContextMenuContent>
        </ContextMenu>
        {openWindows.map((w) => (
          <WindowFrame key={w.id} win={w} bounds={bounds} focused={w.id === topId}>
            <ModuleHost moduleId={w.moduleId} params={w.params} paramsNonce={w.paramsNonce} />
          </WindowFrame>
        ))}
      </div>

      <Dock hidden={isDockHidden} />

      {isCoveringDock && (
        <FloatingDockTrigger
          revealed={dockManualShow}
          onToggle={() => setDockManualShow((v) => !v)}
        />
      )}

      <Launchpad />
      <TaskView />
      <WidgetStore />
    </div>
  );
}
