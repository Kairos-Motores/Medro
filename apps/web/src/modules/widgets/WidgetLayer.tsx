import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";
import type { WinRect } from "@/lib/wm";
import { useWidgets, cellsToPx, gridToPx, pxToGrid, PITCH, ORIGIN_X, ORIGIN_Y } from "@/lib/useWidgets";
import { moduleById } from "@/modules/registry";
import { widgetById } from "./registry";
import { SIZE_CELLS, type PlacedWidget, type WidgetDef } from "./types";
import { WidgetShell } from "./WidgetShell";

const sizePx = (def: WidgetDef, size: PlacedWidget["size"]) => {
  const c = SIZE_CELLS[size];
  return { w: cellsToPx(c.w), h: cellsToPx(c.h) };
};

function useCanShow() {
  const can = useAuth((s) => s.can);
  return (def: WidgetDef) => {
    const modAcc = def.module ? moduleById(def.module).access : undefined;
    if (modAcc?.length && !can(...modAcc)) return false;
    if (def.access?.length && !can(...def.access)) return false;
    return true;
  };
}

/** Tela inicial de widgets sobre a área útil do desktop. */
export function WidgetLayer({ bounds }: { bounds: WinRect }) {
  const { mode, items, moveGrid, moveFree } = useWidgets();
  const canShow = useCanShow();

  const drag = useRef<null | {
    id: string;
    px: number;
    py: number;
    ox: number;
    oy: number;
    w: number;
    h: number;
  }>(null);
  const [preview, setPreview] = useState<{ id: string; x: number; y: number } | null>(null);

  function baseXY(it: PlacedWidget) {
    return mode === "grid"
      ? { x: gridToPx(it.gx, "x"), y: gridToPx(it.gy, "y") }
      : { x: it.fx, y: it.fy };
  }

  function onDown(e: React.PointerEvent, it: PlacedWidget, def: WidgetDef) {
    // ignora clique com botão direito (menu de contexto)
    if (e.button !== 0) return;
    const { w, h } = sizePx(def, it.size);
    const { x, y } = baseXY(it);
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { id: it.instanceId, px: e.clientX, py: e.clientY, ox: x, oy: y, w, h };
    setPreview({ id: it.instanceId, x, y });
  }

  function onMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const nx = Math.max(0, Math.min(d.ox + (e.clientX - d.px), bounds.w - d.w));
    const ny = Math.max(0, Math.min(d.oy + (e.clientY - d.py), bounds.h - d.h));
    setPreview({ id: d.id, x: nx, y: ny });
  }

  function onUp(e: React.PointerEvent) {
    const d = drag.current;
    if (d) {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
      const p = preview;
      if (p && p.id === d.id) {
        if (mode === "grid") {
          moveGrid(d.id, pxToGrid(p.x, "x"), pxToGrid(p.y, "y"));
        } else {
          moveFree(d.id, p.x, p.y);
        }
      }
    }
    drag.current = null;
    setPreview(null);
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      {drag.current && mode === "grid" && (
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(rgb(var(--border)) 1px, transparent 1px)",
            backgroundSize: `${PITCH}px ${PITCH}px`,
            backgroundPosition: `${ORIGIN_X}px ${ORIGIN_Y}px`,
          }}
          aria-hidden
        />
      )}

      {items.map((it) => {
        const def = widgetById(it.widgetId);
        if (!def || !canShow(def)) return null;
        const { w, h } = sizePx(def, it.size);
        const pos = preview?.id === it.instanceId ? preview : baseXY(it);
        const dragging = drag.current?.id === it.instanceId;
        return (
          <div
            key={it.instanceId}
            className={cn(
              "pointer-events-auto absolute",
              dragging ? "z-50 scale-[1.02] shadow-ios-2 transition-none" : "transition-[left,top] duration-150 ease-ios",
            )}
            style={{ left: pos.x, top: pos.y, width: w, height: h }}
          >
            <WidgetShell
              def={def}
              placed={it}
              dragHandleProps={{
                onPointerDown: (e) => onDown(e, it, def),
                onPointerMove: onMove,
                onPointerUp: onUp,
              }}
            >
              <WidgetBody def={def} it={it} />
            </WidgetShell>
          </div>
        );
      })}
    </div>
  );
}

function WidgetBody({ def, it }: { def: WidgetDef; it: PlacedWidget }) {
  const setConfig = useWidgets((s) => s.setConfig);
  const Comp = def.Component;
  return (
    <Comp
      size={it.size}
      config={it.config}
      setConfig={(patch) => setConfig(it.instanceId, patch)}
    />
  );
}

/** Pilha vertical simples para o mobile (Fase 1 — o remodel do mobile virá depois). */
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
            <WidgetShell def={def} placed={it}>
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
