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

let seq = 0;
const nextId = () => `w${++seq}`;

function cascadeRect(n: number): WinRect {
  const off = (n % 6) * 28;
  return { x: 120 + off, y: 70 + off, w: 880, h: 560 };
}

/** calcula os retângulos para N janelas dentro de `area` */
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
    const existing = get().windows.find((w) => w.moduleId === moduleId);
    if (existing) {
      get().focus(existing.id);
      set((s) => ({
        windows: s.windows.map((w) =>
          w.id === existing.id
            ? {
                ...w,
                minimized: false,
                ...(params
                  ? { params, paramsNonce: (w.paramsNonce ?? 0) + 1, title: title || w.title }
                  : {}),
              }
            : w,
        ),
        activeId: existing.id,
        launchpad: false,
        taskview: false,
      }));
      return;
    }
    const z = get().zTop + 1;
    const win: MedroWindow = {
      id: nextId(),
      moduleId,
      title,
      rect: cascadeRect(get().windows.length),
      z,
      minimized: false,
      maximized: false,
      params,
      paramsNonce: params ? 1 : 0,
    };
    set((s) => ({
      windows: [...s.windows, win],
      zTop: z,
      activeId: win.id,
      launchpad: false,
      taskview: false,
    }));
  },

  close: (id) =>
    set((s) => {
      const rest = s.windows.filter((w) => w.id !== id);
      return { windows: rest, activeId: s.activeId === id ? (rest.at(-1)?.id ?? null) : s.activeId };
    }),

  focus: (id) =>
    set((s) => {
      const z = s.zTop + 1;
      return {
        zTop: z,
        activeId: id,
        taskview: false,
        windows: s.windows.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)),
      };
    }),

  move: (id, x, y) =>
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, rect: { ...w.rect, x, y } } : w)) })),

  resize: (id, rect) =>
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, rect: { ...w.rect, ...rect } } : w)) })),

  minimize: (id) =>
    set((s) => {
      const rest = s.windows.filter((w) => w.id !== id && !w.minimized);
      return {
        windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
        activeId: s.activeId === id ? (rest.at(-1)?.id ?? null) : s.activeId,
      };
    }),

  toggleMax: (id, desktop) =>
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) return { ...w, maximized: false, rect: w.restoreRect ?? w.rect };
        return { ...w, maximized: true, restoreRect: w.rect, rect: desktop };
      }),
    })),

  setBounds: (r) => set({ bounds: r }),
  setLaunchpad: (v) => set({ launchpad: v }),
  setTaskView: (v) => set({ taskview: v }),
  setActive: (id) => set({ activeId: id }),

  tile: () =>
    set((s) => {
      const open = s.windows.filter((w) => !w.minimized).sort((a, b) => a.z - b.z);
      if (open.length === 0) return {};
      const B = s.bounds;
      const pad = 8;
      const area: WinRect = { x: pad, y: pad, w: Math.max(200, B.w - pad * 2), h: Math.max(160, B.h - pad * 2) };
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
