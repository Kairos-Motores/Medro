import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SIZE_CELLS, type PlacedWidget, type WidgetId, type WidgetSize } from "@/modules/widgets/types";

/**
 * Tela inicial de widgets — layout escolhido pelo usuário e persistido só neste
 * navegador (localStorage, mesmo padrão de `useDesktopShortcuts` /
 * `useLaunchpadLayout`; combinado: como vira PWA, localStorage basta).
 *
 * Dois modos de arranjo, à escolha do usuário:
 *  - "grid":  cada widget ocupa células de uma grade e faz snap ao soltar;
 *  - "free":  posição livre em px dentro da área útil.
 */
export type WidgetLayoutMode = "grid" | "free";

/** largura de uma célula da grade + espaçamento (mantido em sync com WidgetLayer). */
export const CELL = 84;
export const GAP = 10;
export const PITCH = CELL + GAP;
/** deslocamento da 1ª célula em relação ao canto da área útil */
export const ORIGIN_X = 16;
export const ORIGIN_Y = 12;
export const cellsToPx = (n: number) => n * CELL + (n - 1) * GAP;
export const gridToPx = (g: number, axis: "x" | "y") =>
  (axis === "x" ? ORIGIN_X : ORIGIN_Y) + g * PITCH;
export const pxToGrid = (p: number, axis: "x" | "y") =>
  Math.max(0, Math.round((p - (axis === "x" ? ORIGIN_X : ORIGIN_Y)) / PITCH));

interface WidgetsState {
  mode: WidgetLayoutMode;
  items: PlacedWidget[];
  storeOpen: boolean;
  /** já semeou os widgets padrão neste navegador? */
  seeded: boolean;
  /** opacidade do fundo dos widgets (10 a 100%, padrão 45% translúcido) */
  opacity: number;

  setMode: (m: WidgetLayoutMode) => void;
  setStoreOpen: (v: boolean) => void;
  setOpacity: (v: number) => void;

  add: (widgetId: WidgetId, size: WidgetSize) => void;
  remove: (instanceId: string) => void;
  resize: (instanceId: string, size: WidgetSize) => void;
  moveGrid: (instanceId: string, gx: number, gy: number) => void;
  moveFree: (instanceId: string, fx: number, fy: number) => void;
  setConfig: (instanceId: string, patch: Record<string, unknown>) => void;
  /** semeia uma vez, só se a tela ainda estiver vazia */
  seedDefaults: (picks: { widgetId: WidgetId; size: WidgetSize }[]) => void;
  reset: () => void;
}

const uid = () => `w_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

/** acha a 1ª posição de grade livre para um widget wxh, varrendo coluna a coluna. */
function freeGridSpot(items: PlacedWidget[], w: number, h: number): { gx: number; gy: number } {
  const occ = (gx: number, gy: number) =>
    items.some((it) => {
      const s = SIZE_CELLS[it.size];
      return gx < it.gx + s.w && gx + w > it.gx && gy < it.gy + s.h && gy + h > it.gy;
    });
  for (let gy = 0; gy < 40; gy++) {
    for (let gx = 0; gx < 24; gx++) {
      if (!occ(gx, gy)) return { gx, gy };
    }
  }
  return { gx: 0, gy: 0 };
}

export const useWidgets = create<WidgetsState>()(
  persist(
    (set, get) => ({
      mode: "grid",
      items: [],
      storeOpen: false,
      seeded: false,
      opacity: 45,

      setOpacity: (opacity) =>
        set({ opacity: Math.max(10, Math.min(100, Math.round(opacity))) }),

      // ao trocar de modo, converte as posições para não empilhar os widgets
      setMode: (mode) =>
        set((s) => {
          if (mode === s.mode) return { mode };
          const items = s.items.map((it) =>
            mode === "free"
              ? { ...it, fx: gridToPx(it.gx, "x"), fy: gridToPx(it.gy, "y") }
              : { ...it, gx: pxToGrid(it.fx, "x"), gy: pxToGrid(it.fy, "y") },
          );
          return { mode, items };
        }),
      setStoreOpen: (storeOpen) => set({ storeOpen }),

      add: (widgetId, size) => {
        const { w, h } = SIZE_CELLS[size];
        const spot = freeGridSpot(get().items, w, h);
        set((s) => ({
          items: [
            ...s.items,
            {
              instanceId: uid(),
              widgetId,
              size,
              gx: spot.gx,
              gy: spot.gy,
              fx: gridToPx(spot.gx, "x"),
              fy: gridToPx(spot.gy, "y"),
              config: {},
            },
          ],
        }));
      },

      remove: (instanceId) =>
        set((s) => ({ items: s.items.filter((it) => it.instanceId !== instanceId) })),

      resize: (instanceId, size) =>
        set((s) => ({
          items: s.items.map((it) => (it.instanceId === instanceId ? { ...it, size } : it)),
        })),

      // move mantém as DUAS representações em sync (grade + livre)
      moveGrid: (instanceId, gx, gy) =>
        set((s) => ({
          items: s.items.map((it) => {
            if (it.instanceId !== instanceId) return it;
            const ngx = Math.max(0, Math.round(gx));
            const ngy = Math.max(0, Math.round(gy));
            return { ...it, gx: ngx, gy: ngy, fx: gridToPx(ngx, "x"), fy: gridToPx(ngy, "y") };
          }),
        })),

      moveFree: (instanceId, fx, fy) =>
        set((s) => ({
          items: s.items.map((it) => {
            if (it.instanceId !== instanceId) return it;
            const nfx = Math.max(0, fx);
            const nfy = Math.max(0, fy);
            return { ...it, fx: nfx, fy: nfy, gx: pxToGrid(nfx, "x"), gy: pxToGrid(nfy, "y") };
          }),
        })),

      setConfig: (instanceId, patch) =>
        set((s) => ({
          items: s.items.map((it) =>
            it.instanceId === instanceId ? { ...it, config: { ...it.config, ...patch } } : it,
          ),
        })),

      seedDefaults: (picks) => {
        if (get().seeded) return;
        set({ seeded: true });
        if (get().items.length > 0) return; // usuário já montou a tela
        for (const p of picks) get().add(p.widgetId, p.size);
      },

      reset: () => set({ items: [] }),
    }),
    {
      name: "medro.widgets",
      version: 1,
      // v0 gravava fx/fy empilhados na criação — recalcula pela posição de grade
      migrate: (persisted, version) => {
        const s = persisted as WidgetsState;
        if (version < 1 && s?.items) {
          s.items = s.items.map((it) => ({
            ...it,
            fx: gridToPx(it.gx ?? 0, "x"),
            fy: gridToPx(it.gy ?? 0, "y"),
          }));
        }
        if (s && typeof s.opacity !== "number") {
          s.opacity = 45;
        }
        return s;
      },
    },
  ),
);
