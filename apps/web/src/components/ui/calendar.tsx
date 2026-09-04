import { DayPicker, type DayPickerProps } from "react-day-picker";
import { ptBR } from "date-fns/locale";

/** react-day-picker v10 com a identidade Medro (tokens do app). */
const CLS: Record<string, string> = {
  months: "relative",
  month: "space-y-1.5",
  month_caption: "flex h-7 items-center justify-center px-8",
  caption_label: "text-[12.5px] font-semibold capitalize text-foreground",
  nav: "absolute inset-x-0 top-0 flex items-center justify-between",
  button_previous:
    "inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.06]",
  button_next:
    "inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.06]",
  month_grid: "border-collapse",
  weekdays: "flex",
  weekday: "w-7 text-[10px] font-medium capitalize text-muted-foreground",
  week: "mt-0.5 flex",
  day: "p-0",
  day_button:
    "inline-flex size-7 items-center justify-center rounded-md text-[11.5px] text-foreground hover:bg-primary/10 aria-selected:hover:bg-primary",
  today: "font-semibold text-primary",
  selected: "!bg-primary [&_button]:!text-primary-foreground [&_button]:font-medium",
  outside: "text-muted-foreground/40",
  disabled: "opacity-40",
  hidden: "invisible",
};

export function Calendar(props: DayPickerProps) {
  return <DayPicker locale={ptBR} showOutsideDays classNames={CLS} {...props} />;
}
