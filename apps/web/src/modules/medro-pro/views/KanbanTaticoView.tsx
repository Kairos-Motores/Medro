import { ArrowLeft, Clock, Zap, AlertCircle } from "lucide-react";
import { useMedroProStore } from "../store";
import { Button } from "@/components/ui/button";

export function KanbanTaticoView() {
  const { selectedFilial, selectedSetor, goToLayer, horaExtra, toggleHoraExtra } = useMedroProStore();

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToLayer(2)}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1 -ml-2"
            >
              <ArrowLeft className="size-3.5" /> Voltar para Cockpit ({selectedFilial})
            </Button>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Kanban Tático · <span className="text-primary">{selectedSetor}</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Filial {selectedFilial} · Sequenciamento de ordens de serviço, fila imediata e projeção fantasma
          </p>
        </div>

        {/* Action button to simulate/trigger Hora Extra (H.E.) */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={horaExtra ? "danger" : "neutral"}
            onClick={toggleHoraExtra}
            className="gap-1.5 text-xs shadow-sm"
          >
            <Zap className={`size-3.5 ${horaExtra ? "fill-white" : "text-accent-amber"}`} />
            {horaExtra ? "Simulação H.E. Ativa" : "Disparar Alerta H.E."}
          </Button>
        </div>
      </div>

      {/* 4-Column Industrial Kanban */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Coluna 1: Em Execução */}
        <div className="flex flex-col rounded-2xl border border-border/80 bg-surface/70 p-4 shadow-mac-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Em Execução</h3>
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
              2 Ativos
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Card 1 */}
            <div
              className={`relative rounded-xl border p-3.5 transition-all shadow-sm ${
                horaExtra
                  ? "border-accent-amber bg-accent-amber/10 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                  : "border-border bg-surface hover:border-primary/40"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-xs font-semibold text-foreground">OS: 145920</span>
                {horaExtra && (
                  <span className="flex items-center gap-1 rounded-full bg-accent-amber px-2 py-0.5 text-[10px] font-bold text-black animate-pulse">
                    <Zap className="size-2.5 fill-black" /> H.E. ATIVA
                  </span>
                )}
              </div>

              <h4 className="text-sm font-semibold text-foreground">Motor BT Grande 250cv</h4>
              <p className="text-xs text-muted-foreground">Cliente: Vale S.A. · Mina de Carajás</p>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium text-foreground">45%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-2 overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: "45%" }} />
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
                <div className="flex -space-x-1.5">
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary border border-surface">
                    JO
                  </div>
                  <div className="flex size-6 items-center justify-center rounded-full bg-accent-indigo/20 text-[10px] font-bold text-accent-indigo border border-surface">
                    MA
                  </div>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">Início: 08:30</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-border bg-surface p-3.5 shadow-sm hover:border-primary/40 transition-all">
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-xs font-semibold text-foreground">OS: 145928</span>
                <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  Normal
                </span>
              </div>
              <h4 className="text-sm font-semibold text-foreground">Motor BT Médio 75cv</h4>
              <p className="text-xs text-muted-foreground">Cliente: Alunorte · Área 02</p>

              <div className="mt-3">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium text-foreground">70%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-2 overflow-hidden">
                  <div className="h-full rounded-full bg-accent-green" style={{ width: "70%" }} />
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
                <div className="flex size-6 items-center justify-center rounded-full bg-accent-teal/20 text-[10px] font-bold text-accent-teal border border-surface">
                  RC
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">Início: 10:15</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2: Fila Imediata */}
        <div className="flex flex-col rounded-2xl border border-border/80 bg-surface/70 p-4 shadow-mac-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fila Imediata</h3>
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
              1 Aguardando
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-accent-rose/40 bg-surface p-3.5 shadow-sm hover:border-accent-rose transition-all">
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-xs font-semibold text-foreground">OS: 145933</span>
                <span className="flex items-center gap-1 rounded-full border border-accent-rose/30 bg-accent-rose/15 px-2 py-0.5 text-[10px] font-bold text-accent-rose">
                  <AlertCircle className="size-2.5" /> CR: 0.85
                </span>
              </div>
              <h4 className="text-sm font-semibold text-foreground">Motor AT Média 315cv</h4>
              <p className="text-xs text-muted-foreground">Cliente: Hydro Albras</p>

              <div className="mt-3 rounded-lg bg-surface-2 p-2 text-xs text-muted-foreground">
                <span className="block font-medium text-foreground">Status:</span>
                Peça liberada da Usinagem · Aguardando Operador
              </div>

              <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" /> Carga: 6.0 HH
                </span>
                <span className="font-semibold text-accent-rose">Prioritária</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 3: Projeção (Fila Fantasma) */}
        <div className="flex flex-col rounded-2xl border border-border/80 bg-surface/70 p-4 shadow-mac-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Projeção (Fantasma)
            </h3>
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
              Chegando
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-dashed border-border/90 bg-surface/40 p-3.5 opacity-85 hover:opacity-100 transition-all">
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-xs font-semibold text-muted-foreground">OS: 145980</span>
                <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  Amanhã, 14h
                </span>
              </div>
              <h4 className="text-sm font-semibold text-foreground/90">Motor BT Médio 125cv</h4>
              <p className="text-xs text-muted-foreground">Cliente: VLI Logística</p>

              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                <span className="rounded bg-accent-green/15 px-2 py-0.5 font-semibold text-accent-green">
                  Estator: OK
                </span>
                <span className="rounded bg-accent-amber/15 px-2 py-0.5 font-semibold text-accent-amber">
                  Rotor: Em Balanceamento
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 4: Carga Prevista */}
        <div className="flex flex-col rounded-2xl border border-border/80 bg-surface/70 p-4 shadow-mac-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Carga Prevista</h3>
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
              Programadas
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-border/60 bg-surface/40 p-3.5">
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-xs font-semibold text-muted-foreground">OS: 146002</span>
                <span className="text-[11px] font-mono text-muted-foreground">Previsão: 3 dias</span>
              </div>
              <h4 className="text-sm font-semibold text-foreground/80">Motor BT Pequeno 15cv</h4>
              <p className="text-xs text-muted-foreground">Cliente: Suzano Papel e Celulose</p>
              <div className="mt-2 text-xs font-mono text-muted-foreground">Estimativa: 4.5 HH</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
