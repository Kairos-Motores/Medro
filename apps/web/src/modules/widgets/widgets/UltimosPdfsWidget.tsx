import { useCallback, useEffect } from "react";
import { FileDown } from "lucide-react";
import { useWM } from "@/lib/wm";
import { useHistoricoPdf } from "@/modules/laudos-gen/api";
import { useWidgetRefetch, WidgetLoading, WidgetError, WidgetEmpty } from "../WidgetShell";
import type { WidgetProps } from "../types";

function fmt(iso: unknown): string {
  const d = new Date(String(iso ?? ""));
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function UltimosPdfsWidget({ size }: WidgetProps) {
  const open = useWM((s) => s.open);
  const q = useHistoricoPdf();
  useWidgetRefetch(useCallback(() => q.refetch(), [q]));
  useEffect(() => {
    const id = setInterval(() => q.refetch(), 120_000);
    return () => clearInterval(id);
  }, [q]);

  if (q.isLoading) return <WidgetLoading />;
  if (q.isError) return <WidgetError onRetry={() => q.refetch()} />;

  const rows = q.data ?? [];
  if (rows.length === 0) return <WidgetEmpty>Nenhum PDF emitido ainda.</WidgetEmpty>;

  const max = size === "sm" ? 4 : size === "lg" ? 9 : 6;

  return (
    <ul className="flex h-full min-h-0 flex-col divide-y divide-border/60 overflow-auto">
      {rows.slice(0, max).map((h, i) => {
        const os = String(h.cr4a1_os ?? "—");
        return (
          <li key={i}>
            <button
              onClick={() => open("laudos-gen", `Laudo ${os}`, { osId: os })}
              className="flex w-full items-center gap-2 py-1 text-left text-[11.5px] hover:text-primary"
            >
              <FileDown className="size-3 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1">
                <span className="font-medium text-foreground">{os}</span>
                <span className="ml-1.5 truncate text-[10px] text-muted-foreground">
                  {String(h.cr4a1_cliente ?? "")}
                </span>
              </span>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {fmt(h.cr4a1_adicionado_em)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
