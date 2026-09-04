import { useRef, useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { Minus, Square, Copy, X, LayoutGrid, AppWindow } from "lucide-react";
import { cn } from "@/lib/cn";
import { SPRING, EASE_OUT } from "@/lib/motion";
import { useWM, WIN_MIN, type MedroWindow, type WinRect } from "@/lib/wm";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

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

/** abre com um leve "settle"; sai por fade discreto (fechar) ou desce um pouco (minimizar). */
const frameVariants: Variants = {
  initial: { opacity: 0, scale: 0.985, y: 6 },
  animate: { opacity: 1, scale: 1, y: 0, transition: SPRING },
  exit: (minimized: boolean) =>
    minimized
      ? { opacity: 0, scale: 0.9, y: 48, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }
      : { opacity: 0, scale: 0.985, y: 6, transition: EASE_OUT },
};

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
  const { focus, close, minimize, move, resize, toggleMax, tile, setTaskView, windows } = useWM();
  const drag = useRef<null | { px: number; py: number; r: WinRect; dir?: Dir }>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canTile = windows.filter((w) => !w.minimized).length >= 2;

  function clampMove(x: number, y: number): [number, number] {
    const maxX = bounds.w - Math.min(win.rect.w, bounds.w);
    return [Math.max(0, Math.min(x, Math.max(0, maxX))), Math.max(0, Math.min(y, bounds.h - 44))];
  }

  function onTitleDown(e: React.PointerEvent) {
    if (win.maximized) return;
    focus(win.id);
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, r: { ...win.rect } };
    setIsDragging(true);
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
    setIsDragging(false);
  }

  function onHandleDown(e: React.PointerEvent, dir: Dir) {
    e.stopPropagation();
    focus(win.id);
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, r: { ...win.rect }, dir };
    setIsDragging(true);
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
    <motion.div
      layout={false}
      custom={win.minimized}
      variants={frameVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        left: win.rect.x,
        top: win.rect.y,
        width: win.rect.w,
        height: win.rect.h,
        zIndex: win.z,
        transformOrigin: "50% 0%",
      }}
      className={cn(
        "absolute flex flex-col overflow-hidden border bg-surface will-change-transform",
        win.maximized ? "rounded-none border-transparent shadow-none" : "rounded-lg",
        focused
          ? "border-border-strong shadow-mac-2 ring-1 ring-primary/20"
          : "border-border shadow-mac-1",
        isDragging
          ? "select-none transition-none"
          : "transition-[left,top,width,height,box-shadow,border-color] duration-300 ease-out",
      )}
      onPointerDown={() => !focused && focus(win.id)}
    >
      {/* barra de título — controles à direita (estilo Windows/Linux) */}
      <ContextMenu>
      <ContextMenuTrigger asChild>
      <div
        className={cn(
          "flex h-8 shrink-0 items-stretch border-b border-border transition-colors",
          focused ? "bg-surface-2" : "bg-surface",
        )}
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => toggleMax(win.id, bounds)}
      >
        <span className="pointer-events-none flex flex-1 items-center truncate px-3 text-[12px] font-semibold text-foreground">
          {win.title}
        </span>
        <div className="flex items-stretch">
          <motion.button
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.1 }}
            onClick={() => minimize(win.id)}
            className="flex w-10 items-center justify-center text-foreground-secondary transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Minimizar"
            title="Minimizar"
          >
            <Minus className="size-3.5" strokeWidth={2.5} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.1 }}
            onClick={() => toggleMax(win.id, bounds)}
            className="flex w-10 items-center justify-center text-foreground-secondary transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            aria-label={win.maximized ? "Restaurar" : "Maximizar"}
            title={win.maximized ? "Restaurar" : "Maximizar"}
          >
            {win.maximized ? <Copy className="size-3" strokeWidth={2.5} /> : <Square className="size-3" strokeWidth={2.5} />}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.1 }}
            onClick={() => close(win.id)}
            className="flex w-10 items-center justify-center text-foreground-secondary transition-colors hover:bg-danger hover:text-white"
            aria-label="Fechar"
            title="Fechar"
          >
            <X className="size-3.5" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => minimize(win.id)}>
          <Minus className="size-3.5" /> Minimizar
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => toggleMax(win.id, bounds)}>
          {win.maximized ? <Copy className="size-3.5" /> : <Square className="size-3.5" />}
          {win.maximized ? "Restaurar" : "Maximizar"}
        </ContextMenuItem>
        <ContextMenuItem disabled={!canTile} onSelect={() => tile()}>
          <LayoutGrid className="size-3.5" /> Organizar janelas
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => setTaskView(true)}>
          <AppWindow className="size-3.5" /> Ver janelas abertas
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem destructive onSelect={() => close(win.id)}>
          <X className="size-3.5" /> Fechar
        </ContextMenuItem>
      </ContextMenuContent>
      </ContextMenu>

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
            onPointerCancel={endDrag}
          />
        ))}
    </motion.div>
  );
}
