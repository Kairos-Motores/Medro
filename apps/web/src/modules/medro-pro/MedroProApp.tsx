import { useState } from "react";
import { ChevronDown, Settings, Database, Activity } from "lucide-react";
import { useMedroProStore } from "./store";
import { TorreMacroView } from "./views/TorreMacroView";
import { CockpitFilialView } from "./views/CockpitFilialView";
import { KanbanTaticoView } from "./views/KanbanTaticoView";
import { SetoresModal } from "./components/SetoresModal";
import { CarcacasModal } from "./components/CarcacasModal";
import { GruposPorteModal } from "./components/GruposPorteModal";
import { FarolOSModal } from "./components/FarolOSModal";
import { FarolConfigModal } from "./components/FarolConfigModal";
import { SyncStatusWidget } from "./components/SyncStatusWidget";

export function MedroProApp() {
  const {
    currentLayer,
    selectedFilial,
    selectedSetor,
    goToLayer,
    isSetoresOpen,
    isCarcacasOpen,
    isGruposPorteOpen,
    isFarolOSOpen,
    isFarolConfigOpen,
    setSetoresOpen,
    setCarcacasOpen,
    setGruposPorteOpen,
    setFarolOSOpen,
    setFarolConfigOpen,
  } = useMedroProStore();

  const [menuGerenciamento, setMenuGerenciamento] = useState(false);
  const [menuBases, setMenuBases] = useState(false);

  return (
    <div className="relative flex h-full w-full flex-col bg-bg text-foreground overflow-hidden">
      {/* Top Header Toolbar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur-md">
        {/* Left: Breadcrumbs & Menus */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-tr from-accent-indigo to-primary text-white shadow-sm">
              <Activity className="size-4" />
            </div>
            <button
              onClick={() => goToLayer(1)}
              className="text-sm font-bold tracking-tight text-foreground transition-colors hover:text-primary"
            >
              MEDRO PRO
            </button>

            {currentLayer >= 2 && selectedFilial && (
              <>
                <span className="text-xs text-muted-foreground">/</span>
                <button
                  onClick={() => goToLayer(2)}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  {selectedFilial}
                </button>
              </>
            )}

            {currentLayer === 3 && selectedSetor && (
              <>
                <span className="text-xs text-muted-foreground">/</span>
                <span className="text-xs font-semibold text-primary">{selectedSetor}</span>
              </>
            )}
          </div>

          <div className="h-4 w-px bg-border/60" />

          {/* Menu Gerenciamento */}
          <div className="relative">
            <button
              onClick={() => {
                setMenuGerenciamento(!menuGerenciamento);
                setMenuBases(false);
              }}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
            >
              <Settings className="size-3.5 text-primary" />
              <span>Gerenciamento</span>
              <ChevronDown className={`size-3 transition-transform ${menuGerenciamento ? "rotate-180" : ""}`} />
            </button>

            {menuGerenciamento && (
              <div
                className="absolute left-0 top-full mt-1.5 w-48 rounded-xl border border-border bg-surface p-1.5 shadow-mac-3 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setMenuGerenciamento(false)}
              >
                <button
                  onClick={() => setGruposPorteOpen(true)}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-surface-2 transition-colors"
                >
                  Grupos e Porte
                </button>
                <button
                  onClick={() => setSetoresOpen(true)}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-surface-2 transition-colors"
                >
                  Setores Industriais
                </button>
                <button
                  onClick={() => setCarcacasOpen(true)}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-surface-2 transition-colors"
                >
                  Carcaça Equivalente
                </button>
                <button
                  onClick={() => setFarolConfigOpen(true)}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-surface-2 transition-colors border-t border-border/50 mt-1 pt-1.5"
                >
                  Configuração do Farol
                </button>
              </div>
            )}
          </div>

          {/* Menu Bases */}
          <div className="relative">
            <button
              onClick={() => {
                setMenuBases(!menuBases);
                setMenuGerenciamento(false);
              }}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
            >
              <Database className="size-3.5 text-primary" />
              <span>Bases</span>
              <ChevronDown className={`size-3 transition-transform ${menuBases ? "rotate-180" : ""}`} />
            </button>

            {menuBases && (
              <div
                className="absolute left-0 top-full mt-1.5 w-44 rounded-xl border border-border bg-surface p-1.5 shadow-mac-3 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setMenuBases(false)}
              >
                <button
                  onClick={() => setFarolOSOpen(true)}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-surface-2 transition-colors"
                >
                  Farol de OS
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Sync Status Widget */}
        <div className="flex items-center gap-3">
          <SyncStatusWidget />
        </div>
      </header>

      {/* Main Layer Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-[1400px] w-full mx-auto">
        {currentLayer === 1 && <TorreMacroView />}
        {currentLayer === 2 && <CockpitFilialView />}
        {currentLayer === 3 && <KanbanTaticoView />}
      </main>

      {/* Modais Globais */}
      <SetoresModal isOpen={isSetoresOpen} onClose={() => setSetoresOpen(false)} />
      <CarcacasModal isOpen={isCarcacasOpen} onClose={() => setCarcacasOpen(false)} />
      <GruposPorteModal isOpen={isGruposPorteOpen} onClose={() => setGruposPorteOpen(false)} />
      <FarolConfigModal isOpen={isFarolConfigOpen} onClose={() => setFarolConfigOpen(false)} />
      <FarolOSModal isOpen={isFarolOSOpen} onClose={() => setFarolOSOpen(false)} />
    </div>
  );
}
