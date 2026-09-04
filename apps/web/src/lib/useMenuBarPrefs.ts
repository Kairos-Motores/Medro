import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Preferências de customização da barra do sistema (menu bar). Só no desktop. */
export type BarSurface = "solid" | "glass" | "transparent";
export type BarPosition = "top" | "left" | "right";

export type BarItemKey =
  | "appName"
  | "windowTitle"
  | "windowControls"
  | "filial"
  | "network"
  | "battery"
  | "location"
  | "clock"
  | "theme"
  | "notifications";

export const BAR_ITEM_LABELS: Record<BarItemKey, string> = {
  appName: "Nome do app (Medro)",
  windowTitle: "Título da janela ativa",
  windowControls: "Controles de janelas",
  filial: "Filial",
  network: "Rede",
  battery: "Bateria",
  location: "Localização",
  clock: "Data e hora",
  theme: "Tema (claro/escuro)",
  notifications: "Notificações",
};

interface MenuBarPrefs {
  surface: BarSurface;
  position: BarPosition;
  autohide: boolean;
  hidden: Partial<Record<BarItemKey, boolean>>;
  setSurface: (s: BarSurface) => void;
  setPosition: (p: BarPosition) => void;
  setAutohide: (v: boolean) => void;
  toggleItem: (k: BarItemKey) => void;
  isVisible: (k: BarItemKey) => boolean;
  reset: () => void;
}

const DEFAULTS = { surface: "glass" as BarSurface, position: "top" as BarPosition, autohide: false };

export const useMenuBarPrefs = create<MenuBarPrefs>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,
      hidden: {},
      setSurface: (surface) => set({ surface }),
      setPosition: (position) => set({ position }),
      setAutohide: (autohide) => set({ autohide }),
      toggleItem: (k) => set((s) => ({ hidden: { ...s.hidden, [k]: !s.hidden[k] } })),
      isVisible: (k) => !get().hidden[k],
      reset: () => set({ ...DEFAULTS, hidden: {} }),
    }),
    { name: "medro.menubar" },
  ),
);

/** true quando a barra fica na vertical (borda esquerda/direita). */
export const isVerticalBar = (p: BarPosition) => p === "left" || p === "right";
