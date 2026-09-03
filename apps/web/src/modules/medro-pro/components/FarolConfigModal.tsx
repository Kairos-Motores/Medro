import React, { useState, useEffect } from "react";
import { X, Save, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FarolConfig } from "../types";

const DEFAULT_FAROL: FarolConfig = {
  diasNoPrazo: 3,
  diasAtencao: 1,
  crCritico: 0.8,
  crAlerta: 1.0,
};

interface FarolConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FarolConfigModal({ isOpen, onClose }: FarolConfigModalProps) {
  const [config, setConfig] = useState<FarolConfig>(DEFAULT_FAROL);
  const [savedAlert, setSavedAlert] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const stored = localStorage.getItem("medro_farol_config");
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
      } catch {
        setConfig(DEFAULT_FAROL);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem("medro_farol_config", JSON.stringify(config));
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-surface shadow-mac-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Configuração de Farol de OS</h3>
            <p className="text-[12px] text-muted-foreground">
              Limites de prazo e Critical Ratio (CR) para classificação automática
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
          <div className="flex items-start gap-3 rounded-xl border border-accent-amber/30 bg-accent-amber/10 p-3 text-xs text-foreground">
            <AlertTriangle className="size-5 shrink-0 text-accent-amber" />
            <p>
              O Critical Ratio (CR) calcula a razão entre o tempo restante até a entrega e o tempo de trabalho necessário.
              Valores abaixo de 1.0 indicam risco de atraso.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Tolerância No Prazo (dias)</label>
              <Input
                type="number"
                value={config.diasNoPrazo}
                onChange={(e) => setConfig({ ...config, diasNoPrazo: parseInt(e.target.value) || 0 })}
                className="h-8 text-xs font-mono"
              />
              <span className="text-[11px] text-muted-foreground">Margem de segurança padrão</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Atenção Próximo do Prazo (dias)</label>
              <Input
                type="number"
                value={config.diasAtencao}
                onChange={(e) => setConfig({ ...config, diasAtencao: parseInt(e.target.value) || 0 })}
                className="h-8 text-xs font-mono"
              />
              <span className="text-[11px] text-muted-foreground">Dispara farol amarelo</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">CR Crítico (Vermelho)</label>
              <Input
                type="number"
                step="0.05"
                value={config.crCritico}
                onChange={(e) => setConfig({ ...config, crCritico: parseFloat(e.target.value) || 0 })}
                className="h-8 text-xs font-mono font-bold text-accent-rose"
              />
              <span className="text-[11px] text-muted-foreground">Ex: CR &lt; 0.80</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">CR Alerta (Amarelo)</label>
              <Input
                type="number"
                step="0.05"
                value={config.crAlerta}
                onChange={(e) => setConfig({ ...config, crAlerta: parseFloat(e.target.value) || 0 })}
                className="h-8 text-xs font-mono font-bold text-accent-amber"
              />
              <span className="text-[11px] text-muted-foreground">Ex: CR entre 0.80 e 1.00</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between border-t border-border px-5 py-3">
          <Button variant="neutral" size="sm" onClick={onClose}>
            Fechar
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} className="gap-1.5">
            {savedAlert ? <Check className="size-3.5" /> : <Save className="size-3.5" />}
            {savedAlert ? "Salvo com sucesso!" : "Salvar Configurações"}
          </Button>
        </div>
      </div>
    </div>
  );
}
