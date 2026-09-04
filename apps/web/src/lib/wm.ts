import { create } from "zustand";
import type { ModuleId } from "@/modules/registry";

export interface WinRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** parâmetros de abertura passados ao módulo (ex.: laudos-gen → { osId }). */
export type WinParams = Record<string, string | number | boolean | null | undefined>;

export interface MedroWindow {
  id: string;
  moduleId: ModuleId;
  title: string;
  rect: WinRect;
  /** rect salvo antes de maximizar / organizar */
  restoreRect?: WinRect;
  z: number;
  minimized: boolean;
  maximized: boolean;
  params?: WinParams;
  /** muda a cada reabertura para o módulo re-reagir aos params */
  paramsNonce?: number;
}

export const WIN_MIN = { w: 360, h: 280 };

interface WMState {
  windows: MedroWindow[];
  zTop: number;
  /** área útil da mesa (entre a barra e o dock) — mantida pelo Desktop */
  bounds: WinRect;
  /** mobile: id da janela em foco (tela cheia) */
  activeId: string | null;
  launchpad: boolean;
  taskview: boolean;

  open: (moduleId: ModuleId, title: string, params?: WinParams) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, rect: Partial<WinRect>) => void;
  minimize: (id: string) => void;
  toggleMax: (id: string, desktop: WinRect) => void;
  setBounds: (r: WinRect) => void;
  setLaunchpad: (v: boolean) => void;
  setTaskView: (v: boolean) => void;
  setActive: (id: string) => void;
  /** organiza as janelas abertas em grade proporcional */
  tile: () => void;
}

export const DOCK_RESERVED_BOTTOM = 78;
export const WINDOW_GAP_TOP = 10;
export const WINDOW_GAP_SIDE = 20;
export const SPLIT_GAP = 12;

let seq = 0;
const nextId = () => `w${++seq}`;

/** Retorna o retângulo de "semi-fullsize" preenchendo quase a área de trabalho inteira, com margens elegantes e espaço para o dock */
export function getSemiFullscreenRect(bounds: WinRect): WinRect {
  const mx = Math.min(WINDOW_GAP_SIDE, Math.max(12, Math.round(bounds.w * 0.018)));
  const y = WINDOW_GAP_TOP;
  const h = Math.max(WIN_MIN.h, bounds.h - y - DOCK_RESERVED_BOTTOM);
  const w = Math.max(WIN_MIN.w, bounds.w - mx * 2);
  const x = Math.max(0, Math.round((bounds.w - w) / 2));
  return { x, y, w, h };
}

/** Retorna os retângulos lado a lado dividindo a tela em fullsize entre 2 janelas */
export function getSplitScreenRects(bounds: WinRect): [WinRect, WinRect] {
  const mx = Math.min(WINDOW_GAP_SIDE, Math.max(12, Math.round(bounds.w * 0.018)));
  const y = WINDOW_GAP_TOP;
  const h = Math.max(WIN_MIN.h, bounds.h - y - DOCK_RESERVED_BOTTOM);
  const totalW = bounds.w - mx * 2;
  const halfW = Math.max(WIN_MIN.w, Math.floor((totalW - SPLIT_GAP) / 2));
  const actualW = Math.min(halfW, bounds.w - mx * 2);

  const leftRect: WinRect = {
    x: mx,
    y,
    w: actualW,
    h,
  };
  const rightX = Math.max(mx, bounds.w - mx - actualW);
  const rightRect: WinRect = {
    x: rightX,
    y,
    w: actualW,
    h,
  };
  return [leftRect, rightRect];
}

/** Janelinha flutuante normal para 3ª janela em diante ("a janelinha conforme já temos hoje") */
export function getFloatingCascadeRect(indexAboveTwo: number, bounds: WinRect): WinRect {
  const w = Math.min(880, Math.max(WIN_MIN.w, bounds.w - 80));
  const h = Math.min(560, Math.max(WIN_MIN.h, bounds.h - 140));
  const off = (Math.max(0, indexAboveTwo) % 6) * 30;
  const baseX = Math.max(20, Math.round((bounds.w - w) / 2));
  const baseY = Math.max(20, Math.round((bounds.h - h) / 2) - 30);
  return {
    x: Math.min(bounds.w - w - 20, baseX + off),
    y: Math.min(bounds.h - h - DOCK_RESERVED_BOTTOM, baseY + off),
    w,
    h,
  };
}

/** calcula os retângulos para N janelas dentro de `area` (usado no tile manual de 3+ janelas) */
function layoutRects(n: number, area: WinRect): WinRect[] {
  const gap = 8;
  const R = (x: number, y: number, w: number, h: number): WinRect => ({
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(w),
    h: Math.round(h),
  });
  const { x: ax, y: ay, w: aw, h: ah } = area;

  if (n <= 1) return [R(ax, ay, aw, ah)];

  if (n === 2) {
    const w = (aw - gap) / 2;
    return [R(ax, ay, w, ah), R(ax + w + gap, ay, w, ah)];
  }

  if (n === 3) {
    const w = (aw - gap) / 2;
    const h = (ah - gap) / 2;
    return [
      R(ax, ay, w, ah),
      R(ax + w + gap, ay, w, h),
      R(ax + w + gap, ay + h + gap, w, h),
    ];
  }

  if (n === 4) {
    const w = (aw - gap) / 2;
    const h = (ah - gap) / 2;
    return [
      R(ax, ay, w, h),
      R(ax + w + gap, ay, w, h),
      R(ax, ay + h + gap, w, h),
      R(ax + w + gap, ay + h + gap, w, h),
    ];
  }

  // 5+ : grade cols x rows
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const cw = (aw - gap * (cols - 1)) / cols;
  const ch = (ah - gap * (rows - 1)) / rows;
  const out: WinRect[] = [];
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    out.push(R(ax + c * (cw + gap), ay + r * (ch + gap), cw, ch));
  }
  return out;
}

export const useWM = create<WMState>((set, get) => ({
  windows: [],
  zTop: 10,
  bounds: { x: 0, y: 0, w: 1200, h: 700 },
  activeId: null,
  launchpad: false,
  taskview: false,

  open: (moduleId, title, params) => {
    const s = get();
    const existing = s.windows.find((w) => w.moduleId === moduleId);
    if (existing) {
      s.focus(existing.id);
      if (params || (title && title !== existing.title)) {
        set((st) => ({
          windows: st.windows.map((w) =>
            w.id === existing.id
              ? {
                  ...w,
                  ...(params
                    ? { params, paramsNonce: (w.paramsNonce ?? 0) + 1, title: title || w.title }
                    : {}),
                }
              : w,
          ),
        }));
      }
      return;
    }

    const z = s.zTop + 1;
    const activeBefore = s.windows.filter((w) => !w.minimized);
    const countBefore = activeBefore.length;

    let newRect: WinRect;
    let updatedWindows = [...s.windows];

    if (countBefore === 0) {
      // 1ª janela aberta -> semi-fullsize preenchendo quase a área de trabalho inteira
      newRect = getSemiFullscreenRect(s.bounds);
    } else if (countBefore === 1 && activeBefore[0]) {
      // 2ª janela aberta -> divide as duas na tela em fullsize da janela
      const [leftRect, rightRect] = getSplitScreenRects(s.bounds);
      const prevWin = activeBefore[0];
      updatedWindows = updatedWindows.map((w) =>
        w.id === prevWin.id && !w.maximized
          ? { ...w, rect: leftRect, restoreRect: leftRect }
          : w,
      );
      newRect = rightRect;
    } else {
      // 3ª janela em diante -> abre a janelinha normal flutuante
      newRect = getFloatingCascadeRect(countBefore - 2, s.bounds);
    }

    const win: MedroWindow = {
      id: nextId(),
      moduleId,
      title,
      rect: newRect,
      restoreRect: newRect,
      z,
      minimized: false,
      maximized: false,
      params,
      paramsNonce: params ? 1 : 0,
    };

    set((st) => ({
      windows: [...updatedWindows, win],
      zTop: z,
      activeId: win.id,
      launchpad: false,
      taskview: false,
    }));
  },

  close: (id) =>
    set((s) => {
      const target = s.windows.find((w) => w.id === id);
      const rest = s.windows.filter((w) => w.id !== id);
      const activeRest = rest.filter((w) => !w.minimized);

      let updatedWindows = rest;

      if (target && !target.minimized) {
        if (activeRest.length === 1 && activeRest[0]) {
          // Volta para 1 janela ativa -> reajusta para semi-fullsize
          const only = activeRest[0];
          const semiRect = getSemiFullscreenRect(s.bounds);
          updatedWindows = rest.map((w) =>
            w.id === only.id && !w.maximized
              ? { ...w, rect: semiRect, restoreRect: semiRect }
              : w,
          );
        } else if (activeRest.length === 2 && activeRest[0] && activeRest[1]) {
          // Volta para 2 janelas ativas -> divide lado a lado
          const first = activeRest[0];
          const second = activeRest[1];
          const [leftRect, rightRect] = getSplitScreenRects(s.bounds);
          updatedWindows = rest.map((w) => {
            if (w.id === first.id && !w.maximized) {
              return { ...w, rect: leftRect, restoreRect: leftRect };
            }
            if (w.id === second.id && !w.maximized) {
              return { ...w, rect: rightRect, restoreRect: rightRect };
            }
            return w;
          });
        }
      }

      return {
        windows: updatedWindows,
        activeId: s.activeId === id ? (updatedWindows.at(-1)?.id ?? null) : s.activeId,
      };
    }),

  focus: (id) =>
    set((s) => {
      const z = s.zTop + 1;
      const target = s.windows.find((w) => w.id === id);
      if (!target) return { zTop: z, activeId: id, taskview: false };

      const wasMinimized = target.minimized;
      let updatedWindows = s.windows.map((w) =>
        w.id === id ? { ...w, z, minimized: false } : w,
      );

      // Se a janela estava minimizada e foi restaurada, avalia contagem ativa
      if (wasMinimized) {
        const activeNow = updatedWindows.filter((w) => !w.minimized);
        if (activeNow.length === 1) {
          const semiRect = getSemiFullscreenRect(s.bounds);
          updatedWindows = updatedWindows.map((w) =>
            w.id === id && !w.maximized ? { ...w, rect: semiRect, restoreRect: semiRect } : w,
          );
        } else if (activeNow.length === 2 && activeNow[0] && activeNow[1]) {
          const [leftRect, rightRect] = getSplitScreenRects(s.bounds);
          const first = activeNow.find((w) => w.id !== id) ?? activeNow[0];
          const second = activeNow.find((w) => w.id === id) ?? activeNow[1];
          updatedWindows = updatedWindows.map((w) => {
            if (w.id === first.id && !w.maximized) {
              return { ...w, rect: leftRect, restoreRect: leftRect };
            }
            if (w.id === second.id && !w.maximized) {
              return { ...w, rect: rightRect, restoreRect: rightRect };
            }
            return w;
          });
        }
      }

      return {
        zTop: z,
        activeId: id,
        taskview: false,
        windows: updatedWindows,
      };
    }),

  move: (id, x, y) =>
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, rect: { ...w.rect, x, y } } : w)) })),

  resize: (id, rect) =>
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, rect: { ...w.rect, ...rect } } : w)) })),

  minimize: (id) =>
    set((s) => {
      const activeRest = s.windows.filter((w) => w.id !== id && !w.minimized);
      let updatedWindows = s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w));

      if (activeRest.length === 1 && activeRest[0]) {
        // Reduziu para 1 janela ativa -> reajusta para semi-fullsize
        const only = activeRest[0];
        const semiRect = getSemiFullscreenRect(s.bounds);
        updatedWindows = updatedWindows.map((w) =>
          w.id === only.id && !w.maximized
            ? { ...w, rect: semiRect, restoreRect: semiRect }
            : w,
        );
      } else if (activeRest.length === 2 && activeRest[0] && activeRest[1]) {
        // Reduziu para 2 janelas ativas -> divide lado a lado
        const first = activeRest[0];
        const second = activeRest[1];
        const [leftRect, rightRect] = getSplitScreenRects(s.bounds);
        updatedWindows = updatedWindows.map((w) => {
          if (w.id === first.id && !w.maximized) {
            return { ...w, rect: leftRect, restoreRect: leftRect };
          }
          if (w.id === second.id && !w.maximized) {
            return { ...w, rect: rightRect, restoreRect: rightRect };
          }
          return w;
        });
      }

      return {
        windows: updatedWindows,
        activeId: s.activeId === id ? (activeRest.at(-1)?.id ?? null) : s.activeId,
      };
    }),

  toggleMax: (id, desktop) =>
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          const active = s.windows.filter((x) => !x.minimized);
          let restoredRect = w.restoreRect ?? w.rect;
          if (active.length === 1) {
            restoredRect = getSemiFullscreenRect(s.bounds);
          } else if (active.length === 2 && active[0]) {
            const [leftRect, rightRect] = getSplitScreenRects(s.bounds);
            restoredRect = active[0].id === id ? leftRect : rightRect;
          }
          return { ...w, maximized: false, rect: restoredRect };
        }
        return { ...w, maximized: true, restoreRect: w.rect, rect: desktop };
      }),
    })),

  setBounds: (r) => {
    const prev = get().bounds;
    if (prev.w === r.w && prev.h === r.h && prev.x === r.x && prev.y === r.y) return;
    set((s) => {
      const active = s.windows.filter((w) => !w.minimized);
      let updatedWindows = s.windows;

      if (active.length === 1 && active[0] && !active[0].maximized) {
        const only = active[0];
        const semiRect = getSemiFullscreenRect(r);
        updatedWindows = s.windows.map((w) =>
          w.id === only.id ? { ...w, rect: semiRect, restoreRect: semiRect } : w,
        );
      } else if (active.length === 2 && active[0] && active[1]) {
        const first = active[0];
        const second = active[1];
        const [leftRect, rightRect] = getSplitScreenRects(r);
        updatedWindows = s.windows.map((w) => {
          if (w.id === first.id && !w.maximized) {
            return { ...w, rect: leftRect, restoreRect: leftRect };
          }
          if (w.id === second.id && !w.maximized) {
            return { ...w, rect: rightRect, restoreRect: rightRect };
          }
          return w;
        });
      }

      return {
        bounds: r,
        windows: updatedWindows,
      };
    });
  },

  setLaunchpad: (v) => set({ launchpad: v }),
  setTaskView: (v) => set({ taskview: v }),
  setActive: (id) => set({ activeId: id }),

  tile: () =>
    set((s) => {
      const open = s.windows.filter((w) => !w.minimized).sort((a, b) => a.z - b.z);
      if (open.length === 0) return {};
      if (open.length === 1 && open[0]) {
        const r = getSemiFullscreenRect(s.bounds);
        const only = open[0];
        return {
          windows: s.windows.map((w) => (w.id === only.id ? { ...w, rect: r, restoreRect: r, maximized: false } : w)),
        };
      }
      if (open.length === 2 && open[0] && open[1]) {
        const first = open[0];
        const second = open[1];
        const [leftRect, rightRect] = getSplitScreenRects(s.bounds);
        return {
          windows: s.windows.map((w) => {
            if (w.id === first.id) return { ...w, rect: leftRect, restoreRect: leftRect, maximized: false };
            if (w.id === second.id) return { ...w, rect: rightRect, restoreRect: rightRect, maximized: false };
            return w;
          }),
        };
      }
      const B = s.bounds;
      const pad = 8;
      const area: WinRect = {
        x: pad,
        y: WINDOW_GAP_TOP,
        w: Math.max(200, B.w - pad * 2),
        h: Math.max(160, B.h - WINDOW_GAP_TOP - DOCK_RESERVED_BOTTOM),
      };
      const rects = layoutRects(open.length, area);
      const byId = new Map(open.map((w, i) => [w.id, rects[Math.min(i, rects.length - 1)]!]));
      let z = s.zTop;
      return {
        zTop: z + open.length,
        taskview: false,
        windows: s.windows.map((w) =>
          byId.has(w.id)
            ? { ...w, maximized: false, restoreRect: w.rect, rect: byId.get(w.id)!, z: ++z }
            : w,
        ),
      };
    }),
}));
