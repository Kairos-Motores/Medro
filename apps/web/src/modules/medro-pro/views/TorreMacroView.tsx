import { useEffect, useState } from "react";
import { MapPin, Activity, Users, ArrowRight } from "lucide-react";
import { useMedroProStore } from "../store";
import { api } from "@/lib/api";
import type { FiliaisKPIsMap } from "@medro/shared";
import type { FilialCardData } from "../types";

const BASE_FILIAIS: FilialCardData[] = [
  { id: 1, nome: "São Luís", ocupacao: 94, status: "Gargalo Crítico (CR Baixo)", colaboradoresAtivos: 45, colaboradoresTotal: 48, cod: "0102" },
  { id: 2, nome: "Barcarena", ocupacao: 82, status: "Operação Normal", colaboradoresAtivos: 20, colaboradoresTotal: 22, cod: "0101" },
  { id: 3, nome: "Parauapebas", ocupacao: 71, status: "Ocioso (Capacidade Ociosa)", colaboradoresAtivos: 15, colaboradoresTotal: 25, cod: "0103" },
  { id: 4, nome: "São José dos Campos", ocupacao: 63, status: "Operação Normal", colaboradoresAtivos: 30, colaboradoresTotal: 32, cod: "0104" },
];

export function TorreMacroView() {
  const selectFilial = useMedroProStore((s) => s.selectFilial);
  const [kpis, setKpis] = useState<FiliaisKPIsMap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api<{ status: string; data: FiliaisKPIsMap }>("/medro-pro/kpis/torre-macro")
      .then((res) => {
        if (mounted && res?.data) {
          setKpis(res.data);
        }
      })
      .catch((err) => {
        console.warn("Usando dados de contingência para KPIs", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Torre de Controle Macro</h2>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Visão consolidada multiunidades · Ocupação e fluxo de ordens de serviço
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
          <span className="size-2 rounded-full bg-accent-green animate-pulse" />
          <span>Monitoramento em tempo real</span>
        </div>
      </div>

      {/* Grid das Filiais */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {BASE_FILIAIS.map((filial) => {
          const filialKpis = kpis?.[filial.nome];
          const isCritical = filial.ocupacao > 90;

          return (
            <div
              key={filial.id}
              onClick={() => selectFilial(filial.nome)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-surface/90 p-5 shadow-mac-1 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-mac-2 cursor-pointer"
            >
              {/* Top info */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {filial.nome}
                      </h3>
                      <p className="font-mono text-[11px] text-muted-foreground">Filial {filial.cod}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                      isCritical
                        ? "border-accent-rose/30 bg-accent-rose/15 text-accent-rose"
                        : "border-accent-green/30 bg-accent-green/15 text-accent-green"
                    }`}
                  >
                    Ocupação: {filial.ocupacao}%
                  </span>
                </div>

                {/* Occupancy bar */}
                <div className="mt-2 mb-4 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isCritical ? "bg-accent-rose" : "bg-primary"
                    }`}
                    style={{ width: `${filial.ocupacao}%` }}
                  />
                </div>

                {/* Operational Status */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Activity className={`size-3.5 ${isCritical ? "text-accent-rose" : "text-primary"}`} />
                  <span className={isCritical ? "font-medium text-accent-rose" : ""}>{filial.status}</span>
                </div>
              </div>

              {/* OS Indicators row */}
              <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* OS na filial */}
                  <div className="flex flex-col rounded-lg border border-border/70 bg-surface-2/60 px-2.5 py-1 text-center">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">Na Filial</span>
                    <span className="text-sm font-bold text-foreground">
                      {loading ? "..." : filialKpis?.os_na_filial ?? "—"}
                    </span>
                  </div>

                  {/* OS Aprovadas */}
                  <div className="flex flex-col rounded-lg border border-border/70 bg-surface-2/60 px-2.5 py-1 text-center">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">Aprovadas</span>
                    <span className="text-sm font-bold text-accent-indigo">
                      {loading ? "..." : filialKpis?.os_aprovadas ?? "—"}
                    </span>
                  </div>

                  {/* Prazos */}
                  <div className="flex flex-col rounded-lg border border-border/70 bg-surface-2/60 px-2.5 py-1">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">Prazos</span>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="flex items-center gap-1 text-accent-green" title="No Prazo">
                        <span className="size-1.5 rounded-full bg-accent-green" />
                        {loading ? "..." : filialKpis?.os_dentro_prazo ?? 0}
                      </span>
                      <span className="text-muted-foreground/40">|</span>
                      <span className="flex items-center gap-1 text-accent-rose" title="Fora do Prazo">
                        <span className="size-1.5 rounded-full bg-accent-rose" />
                        {loading ? "..." : filialKpis?.os_fora_prazo ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="size-3.5" />
                    <span className="font-mono">
                      <span className="font-semibold text-foreground">{filial.colaboradoresAtivos}</span>/
                      <span>{filial.colaboradoresTotal}</span>
                    </span>
                  </div>
                  <div className="flex size-7 items-center justify-center rounded-lg bg-surface-2 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary">
                    <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
