import { useCallback } from "react";
import { useLaudosResumo } from "@/modules/laudos-gen/api";
import { cn } from "@/lib/cn";
import { useWidgetRefetch, WidgetLoading, WidgetError } from "../WidgetShell";
import type { WidgetProps } from "../types";

function Tile({ n, label }: { n: number; label: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[19px] font-semibold leading-none text-foreground tabular-nums">{n}</p>
      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

export function LaudosResumoWidget({ size }: WidgetProps) {
  const q = useLaudosResumo();
  useWidgetRefetch(useCallback(() => q.refetch(), [q]));

  if (q.isLoading) return <WidgetLoading />;
  if (q.isError || !q.data) return <WidgetError onRetry={() => q.refetch()} />;

  const { rascunhos, pdfsHoje, pdfs7d } = q.data;
  return (
    <div className={cn("grid h-full items-center gap-2", size === "sm" ? "grid-cols-2" : "grid-cols-3")}>
      <Tile n={rascunhos} label="rascunhos" />
      <Tile n={pdfsHoje} label="PDFs hoje" />
      {size !== "sm" && <Tile n={pdfs7d} label="PDFs · 7 dias" />}
    </div>
  );
}
