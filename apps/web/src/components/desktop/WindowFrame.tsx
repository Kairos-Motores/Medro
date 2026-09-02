import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useWM, WIN_MIN, type MedroWindow, type WinRect } from "@/lib/wm";

type Dir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const HANDLES: { dir: Dir; cls: string }[] = [
  { dir: "n", cls: "top-0 inset-x-2 h-1.5 cursor-ns-resize" },
  { dir: "s", cls: "bottom-0 inset-x-2 h-1.5 cursor-ns-resize" },
  { dir: "e", cls: "right-0 inset-y-2 w-1.5 cursor-ew-resize" },
  { dir: "w", cls: "left-0 inset-y-2 w-1.5 cursor-ew-resize" },
  { dir: "ne", cls: "top-0 right-0 size-2.5 cursor-nesw-resize" },
  { dir: "nw", cls: "top-0 left-0 size-2.5 cursor-nwse-resize" },
  { dir: "se", cls: "bottom-0 right-0 size-2.5 cursor-nwse-resize" },
  { dir: "sw", cls: "bottom-0 left-0 size-2.5 cursor-nesw-resize" },
];

export function WindowFrame({
  win,
  bounds,
  focused,
  children,
}: {
  win: MedroWindow;
  bounds: WinRect;
  focused: boolean;
  children: ReactNode;
}) {
  const { focus, close, minimize, move, resize, toggleMax } = useWM();
  const drag = useRef<null | { px: number; py: number; r: WinRect; dir?: Dir }>(null);

  function clampMove(x: number, y: number): [number, number] {
    const maxX = bounds.w - Math.min(win.rect.w, bounds.w);
    return [Math.max(0, Math.min(x, Math.max(0, maxX))), Math.max(0, Math.min(y, bounds.h - 44))];
  }

  function onTitleDown(e: React.PointerEvent) {
    if (win.maximized) return;
    focus(win.id);
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, r: { ...win.rect } };
  }
  function onTitleMove(e: React.PointerEvent) {
    if (!drag.current || drag.current.dir) return;
    const dx = e.clientX - drag.current.px;
    const dy = e.clientY - drag.current.py;
    const [x, y] = clampMove(drag.current.r.x + dx, drag.current.r.y + dy);
    move(win.id, x, y);
  }
  function endDrag(e: React.PointerEvent) {
    if (drag.current) (e.target as Element).releasePointerCapture?.(e.pointerId);
    drag.current = null;
  }

  function onHandleDown(e: React.PointerEvent, dir: Dir) {
    e.stopPropagation();
    focus(win.id);
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, r: { ...win.rect }, dir };
  }
  function onHandleMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d?.dir) return;
    const dx = e.clientX - d.px;
    const dy = e.clientY - d.py;
    let { x, y, w, h } = d.r;
    if (d.dir.includes("e")) w = d.r.w + dx;
    if (d.dir.includes("s")) h = d.r.h + dy;
    if (d.dir.includes("w")) {
      w = d.r.w - dx;
      x = d.r.x + dx;
    }
    if (d.dir.includes("n")) {
      h = d.r.h - dy;
      y = d.r.y + dy;
    }
    if (w < WIN_MIN.w) {
      if (d.dir.includes("w")) x = d.r.x + (d.r.w - WIN_MIN.w);
      w = WIN_MIN.w;
    }
    if (h < WIN_MIN.h) {
      if (d.dir.includes("n")) y = d.r.y + (d.r.h - WIN_MIN.h);
      h = WIN_MIN.h;
    }
    x = Math.max(0, x);
    y = Math.max(0, y);
    w = Math.min(w, bounds.w - x);
    h = Math.min(h, bounds.h - y);
    resize(win.id, { x, y, w, h });
  }

  return (
    <div
      className={cn(
        "absolute flex flex-col overflow-hidden rounded-xl border border-black/15 bg-surface",
        focused ? "shadow-mac-2" : "shadow-mac-1",
        drag.current ? "select-none" : "transition-[box-shadow] duration-150",
      )}
      style={{ left: win.rect.x, top: win.rect.y, width: win.rect.w, height: win.rect.h, zIndex: win.z }}
      onPointerDown={() => !focused && focus(win.id)}
    >
      {/* barra de título */}
      <div
        className="material-toolbar flex h-9 shrink-0 items-center gap-2 border-b border-border px-3"
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={endDrag}
        onDoubleClick={() => toggleMax(win.id, bounds)}
      >
        <div className="group flex items-center gap-2">
          <button
            onClick={() => close(win.id)}
            className="size-3 rounded-full bg-[#ec6a5e] transition hover:brightness-90"
            aria-label="Fechar"
          />
          <button
            onClick={() => minimize(win.id)}
            className="size-3 rounded-full bg-[#f4bf4f] transition hover:brightness-90"
            aria-label="Minimizar"
          />
          <button
            onClick={() => toggleMax(win.id, bounds)}
            className="size-3 rounded-full bg-[#61c454] transition hover:brightness-90"
            aria-label="Zoom"
          />
        </div>
        <span className="pointer-events-none flex-1 truncate text-center text-[12.5px] font-semibold text-foreground">
          {win.title}
        </span>
        <span className="w-[54px]" />
      </div>

      {/* conteúdo */}
      <div className="relative min-h-0 flex-1 overflow-auto bg-bg">{children}</div>

      {/* handles de redimensionamento */}
      {!win.maximized &&
        HANDLES.map((h) => (
          <div
            key={h.dir}
            className={cn("absolute z-10", h.cls)}
            onPointerDown={(e) => onHandleDown(e, h.dir)}
            onPointerMove={onHandleMove}
            onPointerUp={endDrag}
          />
        ))}
    </div>
  );
}
