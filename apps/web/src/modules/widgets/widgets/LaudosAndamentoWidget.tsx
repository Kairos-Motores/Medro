import { useCallback, useEffect } from "react";
import { FileText } from "lucide-react";
import { useWM } from "@/lib/wm";
import { useRascunhos } from "@/modules/laudos-gen/api";
import { useWidgetRefetch, WidgetLoading, WidgetError, WidgetEmpty } from "../WidgetShell";
import type { WidgetProps } from "../types";

function fmt(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function LaudosAndamentoWidget({ size }: WidgetProps) {
  const open = useWM((s) => s.open);
  const q = useRascunhos();
  useWidgetRefetch(useCallback(() => q.refetch(), [q]));
  useEffect(() => {
    const id = setInterval(() => q.refetch(), 90_000);
    return () => clearInterval(id);
  }, [q]);

  if (q.isLoading) return <WidgetLoading />;
  if (q.isError) return <WidgetError onRetry={() => q.refetch()} />;

  const rows = q.data ?? [];
  if (rows.length === 0) return <WidgetEmpty>Nenhum laudo em andamento.</WidgetEmpty>;

  const max = size === "sm" ? 3 : size === "lg" ? 8 : 5;

  return (
    <div className="flex h-full flex-col">
      <p className="text-[22px] font-semibold leading-none text-foreground tabular-nums">
        {rows.length}
        <span className="ml-1 text-[11px] font-normal text-muted-foreground">
          rascunho{rows.length === 1 ? "" : "s"}
        </span>
      </p>
      <ul className="mt-1.5 min-h-0 flex-1 divide-y divide-border/60 overflow-auto">
        {rows.slice(0, max).map((r) => (
          <li key={`${r.osId}:${r.tipo}`}>
            <button
              onClick={() => open("laudos-gen", `Laudo ${r.osId}`, { osId: r.osId })}
              className="flex w-full items-center gap-2 py-1 text-left text-[11.5px] hover:text-primary"
            >
              <FileText className="size-3 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate font-medium text-foreground">{r.osId}</span>
              <span className="shrink-0 text-[10px] text-muted-foreground">{fmt(r.atualizadoEm)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
