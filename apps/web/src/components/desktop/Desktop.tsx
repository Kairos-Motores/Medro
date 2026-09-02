import { useLayoutEffect, useRef, useState } from "react";
import { MousePointerClick } from "lucide-react";
import { useWM, type WinRect } from "@/lib/wm";
import { useIsDesktop } from "@/lib/useMedia";
import { ModuleHost } from "@/modules/ModuleHost";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { Launchpad } from "./Launchpad";
import { WindowFrame } from "./WindowFrame";

/** Ambiente de janelas macOS. Desktop: janelas livres. Mobile: janela ativa em tela cheia. */
export function Desktop() {
  const isDesktop = useIsDesktop();
  const { windows, activeId, close, setLaunchpad } = useWM();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<WinRect>({ x: 0, y: 0, w: 1200, h: 700 });

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

  if (!isDesktop) {
    const active = windows.find((w) => w.id === activeId) ?? openWindows.at(-1) ?? null;
    return (
      <div className="flex h-dvh flex-col bg-bg">
        <MenuBar />
        <div className="min-h-0 flex-1 overflow-auto pb-16 pt-7">
          {active ? (
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
          ) : (
            <EmptyDesktop onLaunchpad={() => setLaunchpad(true)} />
          )}
        </div>
        <Dock />
        <Launchpad />
      </div>
    );
  }

  return (
    <div className="relative h-dvh overflow-hidden bg-gradient-to-b from-[#e4e7ec] to-[#d5dae2] dark:from-[#20242c] dark:to-[#171a20]">
      <MenuBar />
      <div ref={surfaceRef} className="absolute inset-x-0 bottom-0 top-7">
        {openWindows.length === 0 && <EmptyDesktop onLaunchpad={() => setLaunchpad(true)} />}
        {openWindows.map((w) => (
          <WindowFrame key={w.id} win={w} bounds={bounds} focused={w.id === topId}>
            <ModuleHost moduleId={w.moduleId} />
          </WindowFrame>
        ))}
      </div>
      <Dock />
      <Launchpad />
    </div>
  );
}

function EmptyDesktop({ onLaunchpad }: { onLaunchpad: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-foreground-secondary">
      <MousePointerClick className="size-8 opacity-50" />
      <p className="text-[13px]">
        Abra um módulo pelo{" "}
        <button
          onClick={onLaunchpad}
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          Launchpad
        </button>{" "}
        ou pelo Dock.
      </p>
    </div>
  );
}
