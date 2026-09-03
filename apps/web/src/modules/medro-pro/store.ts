import { create } from "zustand";

interface MedroProState {
  currentLayer: number; // 1: Torre Macro, 2: Cockpit Filial, 3: Kanban Setor
  selectedFilial: string | null;
  selectedSetor: string | null;

  // Modais
  isSetoresOpen: boolean;
  isCarcacasOpen: boolean;
  isGruposPorteOpen: boolean;
  isFarolOSOpen: boolean;

  // Alerta de hora extra no kanban
  horaExtra: boolean;

  // Ações de navegação de camadas
  goToLayer: (layer: number) => void;
  selectFilial: (filial: string) => void;
  selectSetor: (setor: string) => void;
  resetDrilldown: () => void;

  // Ações de modais
  setSetoresOpen: (open: boolean) => void;
  setCarcacasOpen: (open: boolean) => void;
  setGruposPorteOpen: (open: boolean) => void;
  setFarolOSOpen: (open: boolean) => void;
  toggleHoraExtra: () => void;
}

export const useMedroProStore = create<MedroProState>((set) => ({
  currentLayer: 1,
  selectedFilial: null,
  selectedSetor: null,

  isSetoresOpen: false,
  isCarcacasOpen: false,
  isGruposPorteOpen: false,
  isFarolOSOpen: false,

  horaExtra: false,

  goToLayer: (layer) =>
    set((state) => ({
      currentLayer: layer,
      selectedFilial: layer === 1 ? null : state.selectedFilial,
      selectedSetor: layer <= 2 ? null : state.selectedSetor,
    })),

  selectFilial: (filial) =>
    set({
      selectedFilial: filial,
      selectedSetor: null,
      currentLayer: 2,
    }),

  selectSetor: (setor) =>
    set({
      selectedSetor: setor,
      currentLayer: 3,
    }),

  resetDrilldown: () =>
    set({
      currentLayer: 1,
      selectedFilial: null,
      selectedSetor: null,
    }),

  setSetoresOpen: (open) => set({ isSetoresOpen: open }),
  setCarcacasOpen: (open) => set({ isCarcacasOpen: open }),
  setGruposPorteOpen: (open) => set({ isGruposPorteOpen: open }),
  setFarolOSOpen: (open) => set({ isFarolOSOpen: open }),
  toggleHoraExtra: () => set((s) => ({ horaExtra: !s.horaExtra })),
}));
