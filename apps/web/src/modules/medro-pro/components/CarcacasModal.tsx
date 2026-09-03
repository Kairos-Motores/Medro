import React, { useState, useEffect } from "react";
import { X, Search, Plus, Trash2, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CarcacaEquiv } from "../types";

const DEFAULT_CARCACAS: CarcacaEquiv[] = [
  { id: "1", original: "132M", equivalente: "132S", tipo: "BT", observacao: "Mesma fixação de pés" },
  { id: "2", original: "160L", equivalente: "160M", tipo: "BT", observacao: "Comprimento reduzido" },
  { id: "3", original: "200L", equivalente: "200M", tipo: "BT", observacao: "Ajuste na base" },
  { id: "4", original: "250S/M", equivalente: "250M", tipo: "BT", observacao: "Potência até 150cv" },
  { id: "5", original: "315S/M", equivalente: "315M", tipo: "AT", observacao: "Linha HGF Média" },
  { id: "6", original: "355M/L", equivalente: "355L", tipo: "AT", observacao: "Linha HGF Alta" },
  { id: "7", original: "400L", equivalente: "400LK", tipo: "AT", observacao: "Carcaça especial" },
];

interface CarcacasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CarcacasModal({ isOpen, onClose }: CarcacasModalProps) {
  const [items, setItems] = useState<CarcacaEquiv[]>(DEFAULT_CARCACAS);
  const [searchTerm, setSearchTerm] = useState("");
  const [orig, setOrig] = useState("");
  const [equiv, setEquiv] = useState("");
  const [tipo, setTipo] = useState<"BT" | "AT">("BT");
  const [obs, setObs] = useState("");
  const [savedAlert, setSavedAlert] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const stored = localStorage.getItem("medro_carcacas");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems(DEFAULT_CARCACAS);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem("medro_carcacas", JSON.stringify(items));
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orig.trim() || !equiv.trim()) return;
    const newItem: CarcacaEquiv = {
      id: String(Date.now()),
      original: orig.trim().toUpperCase(),
      equivalente: equiv.trim().toUpperCase(),
      tipo,
      observacao: obs.trim(),
    };
    const updated = [newItem, ...items];
    setItems(updated);
    setOrig("");
    setEquiv("");
    setObs("");
    localStorage.setItem("medro_carcacas", JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    localStorage.setItem("medro_carcacas", JSON.stringify(updated));
  };

  const filtered = items.filter(
    (i) =>
      i.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.equivalente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.observacao && i.observacao.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-surface shadow-mac-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Carcaças Equivalentes</h3>
            <p className="text-[12px] text-muted-foreground">
              Mapeamento de carcaças originais e compatíveis de motores (W22, HGF, etc.)
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
          {/* Search + Save */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar carcaça original, equivalente ou obs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="primary" size="sm" onClick={handleSave} className="gap-1.5">
              {savedAlert ? <Check className="size-3.5" /> : <Save className="size-3.5" />}
              {savedAlert ? "Salvo!" : "Salvar"}
            </Button>
          </div>

          {/* New Item Form */}
          <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-2 rounded-xl border border-border/70 bg-surface-2/40 p-3">
            <div className="flex flex-1 gap-2">
              <div className="flex-1">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Original</label>
                <Input
                  placeholder="Ex: 180M"
                  value={orig}
                  onChange={(e) => setOrig(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Equivalente</label>
                <Input
                  placeholder="Ex: 180L"
                  value={equiv}
                  onChange={(e) => setEquiv(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="w-20">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as "BT" | "AT")}
                  className="h-8 w-full rounded-md border border-input bg-surface px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="BT">BT</option>
                  <option value="AT">AT</option>
                </select>
              </div>
            </div>
            <div className="flex w-full items-center gap-2">
              <Input
                placeholder="Observação (opcional)..."
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                className="h-8 flex-1 text-xs"
              />
              <Button type="submit" variant="neutral" size="sm" className="h-8 gap-1 text-xs">
                <Plus className="size-3.5" /> Adicionar
              </Button>
            </div>
          </form>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-[11px] font-semibold text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Original</th>
                  <th className="px-3 py-2">Equivalente</th>
                  <th className="px-3 py-2">Tipo</th>
                  <th className="px-3 py-2">Observação</th>
                  <th className="w-10 px-3 py-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 bg-surface">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-2/40">
                    <td className="px-3 py-2 font-mono font-medium text-foreground">{item.original}</td>
                    <td className="px-3 py-2 font-mono font-medium text-accent-indigo">{item.equivalente}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          item.tipo === "AT"
                            ? "bg-accent-amber/15 text-accent-amber"
                            : "bg-accent-blue/15 text-accent-blue"
                        }`}
                      >
                        {item.tipo}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{item.observacao || "—"}</td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded p-1 text-accent-rose/70 hover:bg-accent-rose/10 hover:text-accent-rose"
                        title="Remover"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
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
