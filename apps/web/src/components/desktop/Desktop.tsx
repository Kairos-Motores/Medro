import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useWM, type WinRect } from "@/lib/wm";
import { useIsDesktop } from "@/lib/useMedia";
import { ModuleHost } from "@/modules/ModuleHost";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { Launchpad } from "./Launchpad";
import { TaskView } from "./TaskView";
import { WindowFrame } from "./WindowFrame";
import { WallpaperBackground } from "./WallpaperBackground";
import { FloatingDockTrigger } from "./FloatingDockTrigger";

/** Ambiente de janelas macOS com papel de parede adaptativo, dock dinâmico e auto-ocultação inteligente. */
export function Desktop() {
  const isDesktop = useIsDesktop();
  const { windows, activeId, close, setBounds: setStoreBounds } = useWM();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<WinRect>({ x: 0, y: 0, w: 1200, h: 700 });
  const [dockManualShow, setDockManualShow] = useState(false);

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
  }, [isDesktop, setStoreBounds]);

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
          {active && (
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
              <ModuleHost key={active.id} moduleId={active.moduleId} />
            </div>
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
      </div>
    );
  }

  return (
    <div className="relative h-dvh overflow-hidden bg-bg">
      <WallpaperBackground />
      <MenuBar />
      <div ref={surfaceRef} className="absolute inset-x-0 bottom-0 top-7 z-10">
        {openWindows.map((w) => (
          <WindowFrame key={w.id} win={w} bounds={bounds} focused={w.id === topId}>
            <ModuleHost moduleId={w.moduleId} />
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
    </div>
  );
}
