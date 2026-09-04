import { useCallback, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { Select, SelectItem } from "@/components/ui/select";
import { useCaldeirariaKpis } from "@/modules/caldeiraria/api";
import { useWidgetRefetch, WidgetLoading, WidgetError } from "../WidgetShell";
import type { WidgetConfigProps, WidgetProps } from "../types";

const FILIAIS = ["São Luís", "Barcarena", "Parauapebas", "São José dos Campos"];

export function CaldeirariaWidget({ size, config }: WidgetProps) {
  const sessionFilial = useAuth((s) => s.user?.filial);
  const pick = typeof config.filial === "string" ? config.filial : "";
  const filial = pick === "__todas" ? undefined : pick || sessionFilial || undefined;

  const q = useCaldeirariaKpis(filial);
  useWidgetRefetch(useCallback(() => q.refetch(), [q]));
  useEffect(() => {
    const id = setInterval(() => q.refetch(), 120_000);
    return () => clearInterval(id);
  }, [q]);

  if (q.isLoading) return <WidgetLoading />;
  if (q.isError || !q.data) return <WidgetError onRetry={() => q.refetch()} />;

  const k = q.data;
  const escopo = pick === "__todas" ? "Todas as filiais" : filial || "Todas as filiais";

  return (
    <div className="flex h-full flex-col">
      <p className="truncate text-[10.5px] text-muted-foreground">{escopo}</p>
      <p className="mt-0.5 text-[22px] font-semibold leading-none text-foreground tabular-nums">
        {k.totalPendentes}
        <span className="ml-1 text-[11px] font-normal text-muted-foreground">pendentes</span>
      </p>

      <div className={cn("mt-2 grid gap-1.5", size === "sm" ? "grid-cols-2" : "grid-cols-3")}>
        <div>
          <p className="text-[15px] font-semibold leading-none text-danger tabular-nums">
            {k.totalPrioridade}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">prioridade</p>
        </div>
        <div>
          <p className="text-[15px] font-semibold leading-none text-warning tabular-nums">
            {k.totalSuspensos}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">suspensos</p>
        </div>
        {size !== "sm" && (
          <div>
            <p className="text-[15px] font-semibold leading-none text-success tabular-nums">
              {k.concluidosNoPrazoPercent}%
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">no prazo</p>
          </div>
        )}
      </div>

      {size !== "sm" && (
        <p className="mt-auto pt-2 text-[10.5px] text-muted-foreground">
          {k.totalOSComPendencia} OS com pendência · {k.totalConcluidos} concluídas
        </p>
      )}
    </div>
  );
}

export function CaldeirariaConfig({ config, setConfig }: WidgetConfigProps) {
  const value = typeof config.filial === "string" && config.filial ? config.filial : "__auto";
  return (
    <label className="block space-y-1">
      <span className="text-[12px] font-medium text-foreground-secondary">Filial exibida</span>
      <Select value={value} onValueChange={(v) => setConfig({ filial: v === "__auto" ? "" : v })}>
        <SelectItem value="__auto">Automática (minha filial)</SelectItem>
        <SelectItem value="__todas">Todas as filiais</SelectItem>
        {FILIAIS.map((f) => (
          <SelectItem key={f} value={f}>
            {f}
          </SelectItem>
        ))}
      </Select>
    </label>
  );
}
