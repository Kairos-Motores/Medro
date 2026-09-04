import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ModuleId } from "@/modules/registry";

export type ShortcutKind = "module" | "laudo" | "rascunhos";

export interface DesktopShortcut {
  id: string;
  kind: ShortcutKind;
  label: string;
  moduleId: ModuleId;
  /** só para kind "laudo" */
  osId?: string;
  x?: number;
  y?: number;
}

interface State {
  shortcuts: DesktopShortcut[];
  /** garante que a pasta "Rascunhos" só seja semeada uma vez por usuário */
  seeded: boolean;
  add: (sc: Omit<DesktopShortcut, "id">) => void;
  remove: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  resetPosition: (id: string) => void;
  resetAllPositions: () => void;
  seedRascunhos: () => void;
}

const key = (sc: Pick<DesktopShortcut, "kind" | "moduleId" | "osId">) =>
  `${sc.kind}:${sc.moduleId}:${sc.osId ?? ""}`;

export const useDesktopShortcuts = create<State>()(
  persist(
    (set, get) => ({
      shortcuts: [],
      seeded: false,
      add: (sc) =>
        set((s) => {
          if (s.shortcuts.some((x) => key(x) === key(sc))) return s;
          return {
            shortcuts: [
              ...s.shortcuts,
              { ...sc, id: `sc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}` },
            ],
          };
        }),
      remove: (id) => set((s) => ({ shortcuts: s.shortcuts.filter((x) => x.id !== id) })),
      updatePosition: (id, x, y) =>
        set((s) => ({
          shortcuts: s.shortcuts.map((it) =>
            it.id === id ? { ...it, x: Math.round(x), y: Math.round(y) } : it,
          ),
        })),
      resetPosition: (id) =>
        set((s) => ({
          shortcuts: s.shortcuts.map((it) =>
            it.id === id ? { ...it, x: undefined, y: undefined } : it,
          ),
        })),
      resetAllPositions: () =>
        set((s) => ({
          shortcuts: s.shortcuts.map((it) => ({ ...it, x: undefined, y: undefined })),
        })),
      seedRascunhos: () => {
        if (get().seeded) return;
        get().add({ kind: "rascunhos", moduleId: "laudos-gen", label: "Rascunhos DPT" });
        set({ seeded: true });
      },
    }),
    { name: "medro.desktop-shortcuts" },
  ),
);
