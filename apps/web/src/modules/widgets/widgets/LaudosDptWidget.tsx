import { useCallback, useEffect } from "react";
import { FileText } from "lucide-react";
import { useWM } from "@/lib/wm";
import { useLaudos } from "@/modules/dpt/api";
import { useWidgetRefetch, WidgetLoading, WidgetError, WidgetEmpty } from "../WidgetShell";
import type { WidgetProps } from "../types";

function fmt(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function LaudosDptWidget({ size }: WidgetProps) {
  const open = useWM((s) => s.open);
  const q = useLaudos({ tipo: "todos" });
  useWidgetRefetch(useCallback(() => q.refetch(), [q]));
  useEffect(() => {
    const id = setInterval(() => q.refetch(), 120_000);
    return () => clearInterval(id);
  }, [q]);

  if (q.isLoading) return <WidgetLoading />;
  if (q.isError) return <WidgetError onRetry={() => q.refetch()} />;

  const items = q.data?.items ?? [];
  if (items.length === 0) return <WidgetEmpty>Nenhum laudo técnico.</WidgetEmpty>;

  const max = size === "sm" ? 3 : size === "lg" ? 8 : 5;

  return (
    <div className="flex h-full flex-col">
      <p className="text-[22px] font-semibold leading-none text-foreground tabular-nums">
        {items.length}
        <span className="ml-1 text-[11px] font-normal text-muted-foreground">laudos recentes</span>
      </p>
      <ul className="mt-1.5 min-h-0 flex-1 divide-y divide-border/60 overflow-auto">
        {items.slice(0, max).map((l) => (
          <li key={l.id}>
            <button
              onClick={() => open("dpt-laudos", "Dep. Técnico")}
              className="flex w-full items-center gap-2 py-1 text-left text-[11.5px] hover:text-primary"
            >
              <FileText className="size-3 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1">
                <span className="font-medium text-foreground">{l.os || l.osSemSigla || "—"}</span>
                <span className="ml-1.5 truncate text-[10px] text-muted-foreground">
                  {l.cliente || ""}
                </span>
              </span>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {fmt(l.dataLaudo || l.modifiedon)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
