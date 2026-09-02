import { create } from "zustand";
import type { ModuleId } from "@/modules/registry";

export interface WinRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MedroWindow {
  id: string;
  moduleId: ModuleId;
  title: string;
  rect: WinRect;
  /** rect salvo antes de maximizar */
  restoreRect?: WinRect;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

export const WIN_MIN = { w: 360, h: 280 };

interface WMState {
  windows: MedroWindow[];
  zTop: number;
  /** mobile: id da janela em foco (tela cheia) */
  activeId: string | null;
  launchpad: boolean;

  open: (moduleId: ModuleId, title: string) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, rect: Partial<WinRect>) => void;
  minimize: (id: string) => void;
  toggleMax: (id: string, desktop: WinRect) => void;
  setLaunchpad: (v: boolean) => void;
  setActive: (id: string) => void;
}

let seq = 0;
const nextId = () => `w${++seq}`;

function cascadeRect(n: number): WinRect {
  const off = (n % 6) * 28;
  return { x: 120 + off, y: 70 + off, w: 880, h: 560 };
}

export const useWM = create<WMState>((set, get) => ({
  windows: [],
  zTop: 10,
  activeId: null,
  launchpad: false,

  open: (moduleId, title) => {
    const existing = get().windows.find((w) => w.moduleId === moduleId);
    if (existing) {
      get().focus(existing.id);
      if (existing.minimized) set((s) => ({ windows: s.windows.map((w) => (w.id === existing.id ? { ...w, minimized: false } : w)) }));
      set({ activeId: existing.id, launchpad: false });
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
    };
    set((s) => ({ windows: [...s.windows, win], zTop: z, activeId: win.id, launchpad: false }));
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

  setLaunchpad: (v) => set({ launchpad: v }),
  setActive: (id) => set({ activeId: id }),
}));
