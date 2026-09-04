import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { FiliaisKPIsMap } from "@medro/shared";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { Select, SelectItem } from "@/components/ui/select";
import { useWidgetRefetch, WidgetLoading, WidgetError } from "../WidgetShell";
import type { WidgetConfigProps, WidgetProps } from "../types";

const FILIAIS = ["São Luís", "Barcarena", "Parauapebas", "São José dos Campos"];

function useFarol() {
  return useQuery({
    queryKey: ["medro-pro", "kpis", "torre-macro"],
    queryFn: () => api<{ status: string; data: FiliaisKPIsMap }>("/medro-pro/kpis/torre-macro"),
    refetchInterval: 120_000,
    refetchIntervalInBackground: false,
  });
}

export function FarolOsWidget({ size, config }: WidgetProps) {
  const sessionFilial = useAuth((s) => s.user?.filial);
  const pick = typeof config.filial === "string" ? config.filial : "";
  const q = useFarol();
  useWidgetRefetch(useCallback(() => q.refetch(), [q]));

  if (q.isLoading) return <WidgetLoading />;
  if (q.isError || !q.data?.data) return <WidgetError onRetry={() => q.refetch()} />;

  const map = q.data.data;
  // resolve o escopo: filial escolhida > todas (explícito) > filial da sessão > todas
  let base = Object.values(map);
  let escopo = "Todas as filiais";
  if (pick && pick !== "__todas" && map[pick]) {
    base = [map[pick]];
    escopo = pick;
  } else if (!pick && sessionFilial && map[sessionFilial]) {
    base = [map[sessionFilial]];
    escopo = sessionFilial;
  }

  const agg = base.reduce(
    (a, k) => ({
      total: a.total + (k?.os_na_filial ?? 0),
      aprovadas: a.aprovadas + (k?.os_aprovadas ?? 0),
      dentro: a.dentro + (k?.os_dentro_prazo ?? 0),
      fora: a.fora + (k?.os_fora_prazo ?? 0),
    }),
    { total: 0, aprovadas: 0, dentro: 0, fora: 0 },
  );
  const aguardando = Math.max(0, agg.total - agg.aprovadas);
  const denom = Math.max(1, agg.dentro + agg.fora + aguardando);

  const seg = [
    { v: agg.dentro, cls: "bg-success", label: "No prazo" },
    { v: aguardando, cls: "bg-warning", label: "Aguardando" },
    { v: agg.fora, cls: "bg-danger", label: "Fora do prazo" },
  ];

  return (
    <div className="flex h-full flex-col">
      <p className="truncate text-[10.5px] text-muted-foreground">{escopo}</p>
      <p className="mt-0.5 text-[22px] font-semibold leading-none text-foreground tabular-nums">
        {agg.total}
        <span className="ml-1 text-[11px] font-normal text-muted-foreground">OS na filial</span>
      </p>

      <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-surface-2">
        {seg.map((s, i) => (
          <div key={i} className={cn("h-full", s.cls)} style={{ width: `${(s.v / denom) * 100}%` }} />
        ))}
      </div>

      <div className={cn("mt-2 grid gap-1.5", size === "sm" ? "grid-cols-1" : "grid-cols-3")}>
        {seg.map((s, i) => (
          <div key={i} className="min-w-0">
            <p className="text-[15px] font-semibold leading-none text-foreground tabular-nums">{s.v}</p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-muted-foreground">
              <span className={cn("size-1.5 rounded-full", s.cls)} /> {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FarolOsConfig({ config, setConfig }: WidgetConfigProps) {
  const value = typeof config.filial === "string" && config.filial ? config.filial : "__auto";
  return (
    <label className="block space-y-1">
      <span className="text-[12px] font-medium text-foreground-secondary">Filial exibida</span>
      <Select
        value={value}
        onValueChange={(v) => setConfig({ filial: v === "__auto" ? "" : v })}
      >
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
