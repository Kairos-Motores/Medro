import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";
import type { WinRect } from "@/lib/wm";
import { useWidgets, cellsToPx, gridToPx, pxToGrid, PITCH, ORIGIN_X, ORIGIN_Y } from "@/lib/useWidgets";
import { moduleById } from "@/modules/registry";
import { widgetById } from "./registry";
import { SIZE_CELLS, type PlacedWidget, type WidgetDef, type WidgetSize } from "./types";
import { WidgetShell } from "./WidgetShell";

const sizePx = (size: WidgetSize) => {
  const c = SIZE_CELLS[size];
  return { w: cellsToPx(c.w), h: cellsToPx(c.h) };
};

/** dentre os tamanhos permitidos, o mais próximo das dimensões arrastadas. */
function pickSize(def: WidgetDef, targetW: number, targetH: number): WidgetSize {
  return def.sizes.reduce((best, s) => {
    const b = sizePx(best);
    const c = sizePx(s);
    const db = Math.abs(b.w - targetW) + Math.abs(b.h - targetH);
    const dc = Math.abs(c.w - targetW) + Math.abs(c.h - targetH);
    return dc < db ? s : best;
  }, def.sizes[0]!);
}

function useCanShow() {
  const can = useAuth((s) => s.can);
  return (def: WidgetDef) => {
    const modAcc = def.module ? moduleById(def.module).access : undefined;
    if (modAcc?.length && !can(...modAcc)) return false;
    if (def.access?.length && !can(...def.access)) return false;
    return true;
  };
}

/** Tela inicial de widgets — dentro de um container que rola na vertical. */
export function WidgetLayer({ bounds }: { bounds: WinRect }) {
  const { mode, items, moveGrid, moveFree, resize } = useWidgets();
  const canShow = useCanShow();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const drag = useRef<null | {
    id: string;
    kind: "move" | "resize";
    px: number;
    py: number;
    ox: number;
    oy: number;
    w: number;
    h: number;
    def: WidgetDef;
  }>(null);
  const [movePv, setMovePv] = useState<{ id: string; x: number; y: number } | null>(null);
  const [sizePv, setSizePv] = useState<{ id: string; size: WidgetSize } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function baseXY(it: PlacedWidget) {
    return mode === "grid"
      ? { x: gridToPx(it.gx, "x"), y: gridToPx(it.gy, "y") }
      : { x: it.fx, y: it.fy };
  }

  const posOf = (it: PlacedWidget) => (movePv?.id === it.instanceId ? movePv : baseXY(it));
  const sizeOf = (it: PlacedWidget) => (sizePv?.id === it.instanceId ? sizePv.size : it.size);

  // altura do conteúdo: cabe a área visível + o widget mais baixo (rola se passar)
  const contentH = useMemo(() => {
    let max = 0;
    for (const it of items) {
      const def = widgetById(it.widgetId);
      if (!def || !canShow(def)) continue;
      const { h } = sizePx(sizeOf(it));
      max = Math.max(max, posOf(it).y + h);
    }
    return Math.max(bounds.h, max + 32);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, movePv, sizePv, mode, bounds.h]);

  function start(e: React.PointerEvent, it: PlacedWidget, def: WidgetDef, kind: "move" | "resize") {
    if (e.button !== 0) return;
    e.stopPropagation();
    setSelectedId(it.instanceId);
    const { w, h } = sizePx(sizeOf(it));
    const { x, y } = baseXY(it);
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { id: it.instanceId, kind, px: e.clientX, py: e.clientY, ox: x, oy: y, w, h, def };
    if (kind === "move") setMovePv({ id: it.instanceId, x, y });
    else setSizePv({ id: it.instanceId, size: it.size });
  }

  function onMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    if (d.kind === "move") {
      const nx = Math.max(0, Math.min(d.ox + (e.clientX - d.px), Math.max(0, bounds.w - d.w)));
      const ny = Math.max(0, d.oy + (e.clientY - d.py));
      setMovePv({ id: d.id, x: nx, y: ny });
    } else {
      const tw = d.w + (e.clientX - d.px);
      const th = d.h + (e.clientY - d.py);
      setSizePv({ id: d.id, size: pickSize(d.def, tw, th) });
    }
  }

  function onUp(e: React.PointerEvent) {
    const d = drag.current;
    if (d) {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
      if (d.kind === "move" && movePv?.id === d.id) {
        if (mode === "grid") moveGrid(d.id, pxToGrid(movePv.x, "x"), pxToGrid(movePv.y, "y"));
        else moveFree(d.id, movePv.x, movePv.y);
      } else if (d.kind === "resize" && sizePv?.id === d.id) {
        resize(d.id, sizePv.size);
      }
    }
    drag.current = null;
    setMovePv(null);
    setSizePv(null);
  }

  return (
    <div
      className="relative w-full"
      style={{ minHeight: contentH }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) setSelectedId(null);
      }}
    >
      {drag.current && mode === "grid" && (
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: "radial-gradient(rgb(var(--border)) 1px, transparent 1px)",
            backgroundSize: `${PITCH}px ${PITCH}px`,
            backgroundPosition: `${ORIGIN_X}px ${ORIGIN_Y}px`,
          }}
          aria-hidden
        />
      )}

      {items.map((it) => {
        const def = widgetById(it.widgetId);
        if (!def || !canShow(def)) return null;
        const size = sizeOf(it);
        const { w, h } = sizePx(size);
        const raw = posOf(it);
        const left = Math.min(raw.x, Math.max(0, bounds.w - w));
        const busy = drag.current?.id === it.instanceId;
        const selected = selectedId === it.instanceId;
        return (
          <div
            key={it.instanceId}
            className={cn(
              "group/wl absolute",
              busy
                ? "z-50 transition-none"
                : "transition-[left,top,width,height] duration-150 ease-ios",
            )}
            style={{ left, top: raw.y, width: w, height: h }}
            onPointerDownCapture={() => setSelectedId(it.instanceId)}
          >
            <WidgetShell
              def={def}
              placed={{ ...it, size }}
              selected={selected || busy}
              dragHandleProps={{
                onPointerDown: (e) => start(e, it, def, "move"),
                onPointerMove: onMove,
                onPointerUp: onUp,
              }}
            >
              <WidgetBody def={def} it={it} size={size} />
            </WidgetShell>

            {def.sizes.length > 1 && (
              <div
                onPointerDown={(e) => start(e, it, def, "resize")}
                onPointerMove={onMove}
                onPointerUp={onUp}
                title="Redimensionar"
                className="absolute bottom-0 right-0 z-10 flex size-6 cursor-se-resize touch-none select-none items-end justify-end p-1 opacity-0 transition-opacity group-hover/wl:opacity-100"
              >
                <span className="size-2.5 rounded-[3px] border-b-2 border-r-2 border-muted-foreground/70" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function WidgetBody({ def, it, size }: { def: WidgetDef; it: PlacedWidget; size: WidgetSize }) {
  const setConfig = useWidgets((s) => s.setConfig);
  const Comp = def.Component;
  return (
    <Comp size={size} config={it.config} setConfig={(patch) => setConfig(it.instanceId, patch)} />
  );
}

/** Pilha vertical simples para o mobile (o remodel do mobile virá depois). */
export function MobileWidgetStack() {
  const items = useWidgets((s) => s.items);
  const canShow = useCanShow();
  const setConfig = useWidgets((s) => s.setConfig);
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 p-4">
      {items.map((it) => {
        const def = widgetById(it.widgetId);
        if (!def || !canShow(def)) return null;
        const { h } = SIZE_CELLS[it.size];
        return (
          <div key={it.instanceId} style={{ minHeight: cellsToPx(Math.min(h, 3)) }}>
            <WidgetShell def={def} placed={it} selected>
              <def.Component
                size={it.size}
                config={it.config}
                setConfig={(patch) => setConfig(it.instanceId, patch)}
              />
            </WidgetShell>
          </div>
        );
      })}
    </div>
  );
}
