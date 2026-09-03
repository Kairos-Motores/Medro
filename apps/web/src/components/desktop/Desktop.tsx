import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useWM, type WinRect } from "@/lib/wm";
import { useIsDesktop } from "@/lib/useMedia";
import { ModuleHost } from "@/modules/ModuleHost";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { Launchpad } from "./Launchpad";
import { WindowFrame } from "./WindowFrame";
import { WallpaperBackground } from "./WallpaperBackground";
import { FloatingDockTrigger } from "./FloatingDockTrigger";

/** Ambiente de janelas macOS com papel de parede adaptativo e auto-ocultação inteligente do Dock. */
export function Desktop() {
  const isDesktop = useIsDesktop();
  const { windows, activeId, close } = useWM();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<WinRect>({ x: 0, y: 0, w: 1200, h: 700 });
  const [dockManualShow, setDockManualShow] = useState(false);

  useLayoutEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setBounds({ x: 0, y: 0, w: el.clientWidth, h: el.clientHeight }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [isDesktop]);

  const openWindows = windows.filter((w) => !w.minimized);
  const topId =
    openWindows.length > 0
      ? openWindows.reduce((a, b) => (a.z >= b.z ? a : b)).id
      : null;

  const active = windows.find((w) => w.id === activeId) ?? openWindows.at(-1) ?? null;

  // Identifica se há aplicativo em tela cheia (maximizada) ou preenchendo a área inferior do dock
  const isCoveringDock = !isDesktop
    ? !!active
    : openWindows.some((w) => w.maximized || (w.rect.y + w.rect.h >= bounds.h - 65));

  // Quando nenhuma janela estiver cobrindo a área da barra, desativa o modo manual para voltar ao padrão
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
              <div className="material-toolbar sticky top-0 z-10 flex h-10 items-center gap-2 border-b border-border px-3">
                <button
                  onClick={() => close(active.id)}
                  className="size-3 rounded-full bg-[#ec6a5e]"
                  aria-label="Fechar"
                />
                <span className="flex-1 truncate text-center text-[13px] font-semibold text-foreground">
                  {active.title}
                </span>
                <span className="w-3" />
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
    </div>
  );
}
