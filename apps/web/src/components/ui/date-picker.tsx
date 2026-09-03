import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { format, parse, isValid } from "date-fns";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const OUT = "dd/MM/yyyy";
const TRY_FORMATS = ["dd/MM/yyyy", "d/M/yyyy", "yyyy-MM-dd", "yyyyMMdd", "dd/MM/yy", "dd-MM-yyyy"];

function parseLoose(v: string): Date | undefined {
  const s = (v ?? "").trim();
  if (!s) return undefined;
  for (const f of TRY_FORMATS) {
    const d = parse(s, f, new Date());
    if (isValid(d)) return d;
  }
  const d = new Date(s);
  return isValid(d) ? d : undefined;
}

/**
 * Campo de data: input de texto (aceita o valor como está no Dataverse) + um
 * calendário do próprio app (react-day-picker com a identidade Medro). Escolher
 * um dia grava a data em `dd/MM/yyyy`.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
  disabled,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = parseLoose(value);

  return (
    <div className={cn("relative", className)}>
      <Input
        value={value ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="pr-9"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label="Abrir calendário"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-black/[0.04] disabled:opacity-50 dark:hover:bg-white/[0.06]"
          >
            <CalendarDays className="size-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto">
          <DayPicker
            mode="single"
            locale={ptBR}
            defaultMonth={selected}
            selected={selected}
            onSelect={(d) => {
              if (d) onChange(format(d, OUT));
              setOpen(false);
            }}
            classNames={CAL}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/** classes do react-day-picker v10 mapeadas para os tokens do Medro. */
const CAL: Record<string, string> = {
  months: "relative",
  month: "space-y-2",
  month_caption: "flex h-8 items-center justify-center px-8",
  caption_label: "text-[13px] font-semibold capitalize text-foreground",
  nav: "absolute inset-x-0 top-0 flex items-center justify-between",
  button_previous:
    "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
  button_next:
    "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
  month_grid: "border-collapse",
  weekdays: "flex",
  weekday: "w-8 text-[11px] font-medium capitalize text-muted-foreground",
  week: "mt-0.5 flex",
  day: "p-0",
  day_button:
    "inline-flex size-8 items-center justify-center rounded-md text-[12.5px] text-foreground hover:bg-primary/10 aria-selected:hover:bg-primary",
  today: "font-semibold text-primary",
  selected: "!bg-primary [&_button]:!text-primary-foreground [&_button]:font-medium",
  outside: "text-muted-foreground/50",
  disabled: "opacity-40",
  hidden: "invisible",
};
