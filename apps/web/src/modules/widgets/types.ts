import type { LucideIcon } from "lucide-react";
import type { AccessToken } from "@medro/shared";
import type { ModuleId } from "@/modules/registry";

export type WidgetId =
  | "relogio"
  | "notas"
  | "farol-os"
  | "laudos-andamento"
  | "ultimos-pdfs";

/** tamanhos em CÉLULAS da grade (ver GRID em WidgetLayer). */
export type WidgetSize = "sm" | "md" | "lg" | "wide";

export const SIZE_CELLS: Record<WidgetSize, { w: number; h: number }> = {
  sm: { w: 2, h: 2 },
  md: { w: 3, h: 2 },
  lg: { w: 3, h: 3 },
  wide: { w: 4, h: 2 },
};

export const SIZE_LABEL: Record<WidgetSize, string> = {
  sm: "Pequeno",
  md: "Médio",
  lg: "Grande",
  wide: "Largo",
};

export interface WidgetProps {
  /** tamanho atual da instância — o componente adapta o conteúdo */
  size: WidgetSize;
  /** config por instância (ex.: filial escolhida) — Fase 2 usa mais */
  config: Record<string, unknown>;
  setConfig: (patch: Record<string, unknown>) => void;
}

export interface WidgetDef {
  id: WidgetId;
  title: string;
  desc: string;
  icon: LucideIcon;
  /** menu que o widget representa — herda o `accent` e some se o usuário não tem acesso */
  module: ModuleId | null;
  /** cor de acento própria quando `module` é null */
  accent?: import("@/modules/registry").AccentKey;
  sizes: WidgetSize[];
  defaultSize: WidgetSize;
  /** exigências extras de acesso, além das do módulo */
  access?: AccessToken[];
  Component: React.FC<WidgetProps>;
}

/** instância posicionada na tela inicial. */
export interface PlacedWidget {
  instanceId: string;
  widgetId: WidgetId;
  size: WidgetSize;
  /** posição na grade (células) */
  gx: number;
  gy: number;
  /** posição livre (px, relativo à área útil) */
  fx: number;
  fy: number;
  config: Record<string, unknown>;
}
