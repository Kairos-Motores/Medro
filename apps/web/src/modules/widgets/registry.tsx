import { Clock, StickyNote, Activity, FileClock, History, CloudSun } from "lucide-react";
import type { WidgetDef, WidgetId } from "./types";
import { RelogioWidget } from "./widgets/RelogioWidget";
import { NotasWidget } from "./widgets/NotasWidget";
import { ClimaWidget } from "./widgets/ClimaWidget";
import { FarolOsWidget, FarolOsConfig } from "./widgets/FarolOsWidget";
import { LaudosAndamentoWidget } from "./widgets/LaudosAndamentoWidget";
import { UltimosPdfsWidget } from "./widgets/UltimosPdfsWidget";

export const WIDGETS: WidgetDef[] = [
  {
    id: "relogio",
    title: "Relógio e Calendário",
    desc: "Hora ao vivo e um calendário para consultar datas.",
    icon: Clock,
    module: null,
    accent: "blue",
    sizes: ["sm", "md", "lg"],
    defaultSize: "md",
    Component: RelogioWidget,
  },
  {
    id: "notas",
    title: "Notas rápidas",
    desc: "Um bloco de anotações que fica na tela inicial.",
    icon: StickyNote,
    module: null,
    accent: "amber",
    sizes: ["sm", "md", "lg", "wide"],
    defaultSize: "md",
    Component: NotasWidget,
  },
  {
    id: "clima",
    title: "Clima da unidade",
    desc: "Temperatura e condição do tempo na sua localização.",
    icon: CloudSun,
    module: null,
    accent: "cyan",
    sizes: ["sm", "md"],
    defaultSize: "sm",
    Component: ClimaWidget,
  },
  {
    id: "farol-os",
    title: "Farol de OS",
    desc: "Ordens de serviço no prazo, aguardando e fora do prazo.",
    icon: Activity,
    module: "medro-pro",
    sizes: ["sm", "md", "wide"],
    defaultSize: "md",
    Component: FarolOsWidget,
    ConfigForm: FarolOsConfig,
  },
  {
    id: "laudos-andamento",
    title: "Laudos em andamento",
    desc: "Rascunhos de laudo para continuar de onde parou.",
    icon: FileClock,
    module: "laudos-gen",
    access: ["DPT"],
    sizes: ["sm", "md", "lg"],
    defaultSize: "md",
    Component: LaudosAndamentoWidget,
  },
  {
    id: "ultimos-pdfs",
    title: "Últimos PDFs emitidos",
    desc: "Histórico recente de laudos emitidos.",
    icon: History,
    module: "laudos-gen",
    access: ["DPT"],
    sizes: ["md", "lg"],
    defaultSize: "md",
    Component: UltimosPdfsWidget,
  },
];

const BY_ID = new Map(WIDGETS.map((w) => [w.id, w]));
export const widgetById = (id: WidgetId): WidgetDef | undefined => BY_ID.get(id);
