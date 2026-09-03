import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";
export type WallpaperOption = "option-1" | "option-2";

interface CustomWallpapers {
  "option-1"?: { light?: string; dark?: string };
  "option-2"?: { light?: string; dark?: string };
}

interface ThemeState {
  theme: ThemeMode;
  wallpaper: WallpaperOption;
  customWallpapers: CustomWallpapers;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setWallpaper: (wallpaper: WallpaperOption) => void;
  setCustomWallpaper: (
    option: WallpaperOption,
    mode: ThemeMode,
    dataUrl: string | undefined,
  ) => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      wallpaper: "option-1",
      customWallpapers: {},
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      toggleTheme: () => {
        set((state) => {
          const next = state.theme === "light" ? "dark" : "light";
          applyTheme(next);
          return { theme: next };
        });
      },
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setCustomWallpaper: (option, mode, dataUrl) =>
        set((state) => ({
          customWallpapers: {
            ...state.customWallpapers,
            [option]: {
              ...state.customWallpapers[option],
              [mode]: dataUrl,
            },
          },
        })),
    }),
    {
      name: "medro.theme",
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyTheme(state.theme);
        }
      },
    },
  ),
);

/** Aplica os atributos de tema no elemento raiz do documento */
export function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}
