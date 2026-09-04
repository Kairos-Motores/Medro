import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DockAlignment = "left" | "center" | "right";

interface DockPrefs {
  alignment: DockAlignment;
  setAlignment: (alignment: DockAlignment) => void;
}

export const useDockPrefs = create<DockPrefs>()(
  persist(
    (set) => ({
      alignment: "center",
      setAlignment: (alignment) => set({ alignment }),
    }),
    { name: "medro.dock" },
  ),
);
