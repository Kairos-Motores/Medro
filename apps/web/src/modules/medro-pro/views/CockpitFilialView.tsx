import { useState, useEffect } from "react";
import { ArrowLeft, Clock, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import { useMedroProStore } from "../store";
import { Button } from "@/components/ui/button";
import { DEFAULT_SETORES } from "../components/SetoresModal";
import type { SetorItem } from "../types";

export function CockpitFilialView() {
  const { selectedFilial, goToLayer, selectSetor } = useMedroProStore();
  const [setores, setSetores] = useState<SetorItem[]>([]);

  const loadSetores = () => {
    let rawList = DEFAULT_SETORES;
    const stored = localStorage.getItem("medro_setores");
    if (stored) {
      try {
        rawList = JSON.parse(stored);
      } catch {
        rawList = DEFAULT_SETORES;
      }
    }

    const enhanced: SetorItem[] = rawList.map((s) => {
      const isMontagem = s.nome.toLowerCase().includes("montagem");
      const isRebob = s.nome.toLowerCase().includes("rebobin");
      const isUsinagem = s.nome.toLowerCase().includes("usinag");

      const disp = isMontagem ? 88.0 : isRebob ? 120.0 : isUsinagem ? 44.0 : 60.0;
      const alocada = isMontagem ? 75.5 : isRebob ? 140.0 : isUsinagem ? 30.0 : 45.0;

      return {
        id: s.id,
        nome: s.nome,
        disp,
        alocada,
        cr_vermelho: isMontagem ? 3 : isRebob ? 12 : isUsinagem ? 0 : 2,
        cr_amarelo: isMontagem ? 5 : isRebob ? 4 : isUsinagem ? 1 : 3,
        os_no_prazo: isRebob ? 8 : 18,
        os_fora_prazo: isRebob ? 6 : 2,
        os_criticos: isRebob ? 4 : 1,
        os_sem_aprovacao: 3,
      };
    });

    setSetores(enhanced);
  };

  useEffect(() => {
    loadSetores();
    window.addEventListener("setores_updated", loadSetores);
    return () => window.removeEventListener("setores_updated", loadSetores);
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-200">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToLayer(1)}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1 -ml-2"
            >
              <ArrowLeft className="size-3.5" /> Voltar para Torre Macro
            </Button>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Cockpit Operacional · <span className="text-primary">{selectedFilial}</span>
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Visão de gargalos, capacidade produtiva (H.H) e status de ordens de serviço por setor
          </p>
        </div>

        {/* Mini status indicators */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 shadow-sm">
            <Clock className="size-4 text-accent-indigo" />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Ag. Aprovação</div>
              <div className="text-sm font-bold text-accent-indigo">12 OS</div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 shadow-sm">
            <AlertTriangle className="size-4 text-accent-amber" />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Pendentes</div>
              <div className="text-sm font-bold text-accent-amber">5 OS</div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 shadow-sm">
            <CheckCircle2 className="size-4 text-accent-green" />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Prontos</div>
              <div className="text-sm font-bold text-accent-green">8 Motores</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid dos Setores Industriais */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {setores.map((setor) => {
          const ocupacaoPct = Math.round((setor.alocada / setor.disp) * 100);
          const isOverloaded = ocupacaoPct > 100;

          return (
            <div
              key={setor.id}
              onClick={() => selectSetor(setor.nome)}
              className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-surface/90 p-4 shadow-mac-1 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-mac-2 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {setor.nome}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                      isOverloaded
                        ? "border-accent-rose/30 bg-accent-rose/15 text-accent-rose"
                        : "border-border/60 bg-surface-2 text-muted-foreground"
                    }`}
                  >
                    {ocupacaoPct}% Ocupação
                  </span>
                </div>

                {/* Barra de ocupação */}
                <div className="mb-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverloaded ? "bg-accent-rose" : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(ocupacaoPct, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Farol de OS Grid */}
                <div className="grid grid-cols-4 gap-1.5 mb-3 text-center">
                  <div className="rounded-lg border border-accent-green/20 bg-accent-green/10 p-1.5">
                    <span className="block text-xs font-bold text-accent-green">{setor.os_no_prazo}</span>
                    <span className="text-[9px] text-accent-green/80 leading-none">No prazo</span>
                  </div>
                  <div className="rounded-lg border border-accent-rose/20 bg-accent-rose/10 p-1.5">
                    <span className="block text-xs font-bold text-accent-rose">{setor.os_fora_prazo}</span>
                    <span className="text-[9px] text-accent-rose/80 leading-none">Fora prazo</span>
                  </div>
                  <div className="rounded-lg border border-accent-amber/20 bg-accent-amber/10 p-1.5">
                    <span className="block text-xs font-bold text-accent-amber">{setor.os_criticos}</span>
                    <span className="text-[9px] text-accent-amber/80 leading-none">Críticos</span>
                  </div>
                  <div className="rounded-lg border border-border/80 bg-surface-2 p-1.5">
                    <span className="block text-xs font-bold text-muted-foreground">{setor.os_sem_aprovacao}</span>
                    <span className="text-[9px] text-muted-foreground leading-none">S/ Aprov</span>
                  </div>
                </div>
              </div>

              {/* Capacidade H.H row */}
              <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                <div className="flex gap-3">
                  <div>
                    <span className="text-[9px] uppercase text-muted-foreground block">Disponível</span>
                    <span className="font-mono font-medium text-foreground">{setor.disp} HH</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-muted-foreground block">Projetado</span>
                    <span className={`font-mono font-bold ${isOverloaded ? "text-accent-rose" : "text-primary"}`}>
                      {setor.alocada} HH
                    </span>
                  </div>
                </div>

                <div className="flex size-6 items-center justify-center rounded text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-all">
                  <ChevronRight className="size-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
