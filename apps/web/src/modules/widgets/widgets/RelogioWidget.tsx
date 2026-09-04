import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import type { WidgetProps } from "../types";

export function RelogioWidget({ size }: WidgetProps) {
  const [now, setNow] = useState(() => new Date());
  const [picked, setPicked] = useState<Date | undefined>();
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const showCal = size !== "sm";
  const info = useMemo(
    () =>
      picked ? format(picked, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR }) : null,
    [picked],
  );

  return (
    <div className="flex h-full flex-col items-center">
      <p className="font-mono text-[24px] font-semibold leading-none tracking-tight text-foreground tabular-nums">
        {format(now, "HH:mm")}
        <span className="text-[15px] text-muted-foreground">:{format(now, "ss")}</span>
      </p>
      <p className="mt-1 text-[11px] capitalize text-muted-foreground">
        {format(now, "EEEE, d 'de' MMMM", { locale: ptBR })}
      </p>

      {showCal && (
        <>
          <div className="mt-2 w-full rounded-lg border border-border bg-surface/60 p-1.5">
            <Calendar mode="single" selected={picked} onSelect={setPicked} />
          </div>
          <div className="mt-1.5 flex w-full items-center justify-between gap-2 text-[10.5px] text-muted-foreground">
            <span className="truncate">{info || ""}</span>
            {picked && (
              <button
                onClick={() => setPicked(undefined)}
                className="shrink-0 rounded px-1.5 py-0.5 font-medium text-primary hover:bg-primary/10"
              >
                Hoje
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
