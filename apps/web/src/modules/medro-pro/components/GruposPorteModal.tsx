import { useState, useEffect } from "react";
import { X, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GrupoPorte } from "../types";

const DEFAULT_GRUPOS: GrupoPorte[] = [
  { id: "1", nome: "BT Pequeno", tensao: "BT", faixaCarcaca: "63 - 112", potenciaMin: 0.5, potenciaMax: 7.5, tempoPadraoHH: 8.0 },
  { id: "2", nome: "BT Médio Pequeno", tensao: "BT", faixaCarcaca: "132 - 180", potenciaMin: 10, potenciaMax: 40, tempoPadraoHH: 16.0 },
  { id: "3", nome: "BT Médio", tensao: "BT", faixaCarcaca: "200 - 250", potenciaMin: 50, potenciaMax: 125, tempoPadraoHH: 24.0 },
  { id: "4", nome: "BT Grande", tensao: "BT", faixaCarcaca: "280 - 355", potenciaMin: 150, potenciaMax: 450, tempoPadraoHH: 48.0 },
  { id: "5", nome: "BT Extra Grande", tensao: "BT", faixaCarcaca: "400 - 450", potenciaMin: 500, potenciaMax: 1200, tempoPadraoHH: 72.0 },
  { id: "6", nome: "AT Média/Alta", tensao: "AT", faixaCarcaca: "315 - 450", potenciaMin: 200, potenciaMax: 1500, tempoPadraoHH: 80.0 },
  { id: "7", nome: "AT Pesada", tensao: "AT", faixaCarcaca: "500 - 710", potenciaMin: 1600, potenciaMax: 6000, tempoPadraoHH: 120.0 },
];

interface GruposPorteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GruposPorteModal({ isOpen, onClose }: GruposPorteModalProps) {
  const [grupos, setGrupos] = useState<GrupoPorte[]>(DEFAULT_GRUPOS);
  const [savedAlert, setSavedAlert] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const stored = localStorage.getItem("medro_grupos_porte");
    if (stored) {
      try {
        setGrupos(JSON.parse(stored));
      } catch {
        setGrupos(DEFAULT_GRUPOS);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (id: string, field: keyof GrupoPorte, value: any) => {
    setGrupos((prev) => prev.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
  };

  const handleSave = () => {
    localStorage.setItem("medro_grupos_porte", JSON.stringify(grupos));
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-border bg-surface shadow-mac-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Grupos e Porte de Motores</h3>
            <p className="text-[12px] text-muted-foreground">
              Parametrização de classes industriais, faixas de carcaça e tempo padrão de H.H
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
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Edite as faixas nominais e tempos padrão aplicados pelo APS Engine:
            </p>
            <Button variant="primary" size="sm" onClick={handleSave} className="gap-1.5">
              {savedAlert ? <Check className="size-3.5" /> : <Save className="size-3.5" />}
              {savedAlert ? "Salvo!" : "Salvar Alterações"}
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-[11px] font-semibold text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Porte</th>
                  <th className="px-3 py-2">Tensão</th>
                  <th className="px-3 py-2">Faixa Carcaça</th>
                  <th className="px-3 py-2">Potência Min (cv)</th>
                  <th className="px-3 py-2">Potência Max (cv)</th>
                  <th className="px-3 py-2">Tempo Padrão (HH)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 bg-surface">
                {grupos.map((g) => (
                  <tr key={g.id} className="hover:bg-surface-2/40">
                    <td className="px-3 py-2 font-medium text-foreground">{g.nome}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          g.tensao === "AT" ? "bg-accent-amber/15 text-accent-amber" : "bg-accent-blue/15 text-accent-blue"
                        }`}
                      >
                        {g.tensao}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        value={g.faixaCarcaca}
                        onChange={(e) => handleChange(g.id, "faixaCarcaca", e.target.value)}
                        className="h-7 text-xs font-mono"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        value={g.potenciaMin}
                        onChange={(e) => handleChange(g.id, "potenciaMin", parseFloat(e.target.value) || 0)}
                        className="h-7 text-xs font-mono"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        value={g.potenciaMax}
                        onChange={(e) => handleChange(g.id, "potenciaMax", parseFloat(e.target.value) || 0)}
                        className="h-7 text-xs font-mono"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        value={g.tempoPadraoHH}
                        onChange={(e) => handleChange(g.id, "tempoPadraoHH", parseFloat(e.target.value) || 0)}
                        className="h-7 text-xs font-mono font-bold text-accent-indigo"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border px-5 py-3">
          <Button variant="neutral" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
