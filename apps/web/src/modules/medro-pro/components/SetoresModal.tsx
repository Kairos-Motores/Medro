import React, { useState, useEffect } from "react";
import { X, Search, Plus, Trash2, ArrowUp, ArrowDown, Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface SetorDef {
  id: string;
  nome: string;
}

export const DEFAULT_SETORES: SetorDef[] = [
  { id: "1", nome: "Peritagem" },
  { id: "2", nome: "Teste" },
  { id: "3", nome: "Lavagem" },
  { id: "4", nome: "Montagem" },
  { id: "5", nome: "Rebobinamento" },
  { id: "6", nome: "Corte" },
  { id: "7", nome: "Inspeção de Qualidade" },
  { id: "8", nome: "Caldeiraria" },
  { id: "9", nome: "Pintura" },
  { id: "10", nome: "Usinagem" },
  { id: "11", nome: "Balanceamento" },
];

interface SetoresModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SetoresModal({ isOpen, onClose }: SetoresModalProps) {
  const [setores, setSetores] = useState<SetorDef[]>(DEFAULT_SETORES);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSetorNome, setNewSetorNome] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [savedAlert, setSavedAlert] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const stored = localStorage.getItem("medro_setores");
    if (stored) {
      try {
        setSetores(JSON.parse(stored));
      } catch {
        setSetores(DEFAULT_SETORES);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem("medro_setores", JSON.stringify(setores));
    window.dispatchEvent(new Event("setores_updated"));
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSetorNome.trim()) return;
    const item: SetorDef = {
      id: String(Date.now()),
      nome: newSetorNome.trim(),
    };
    const updated = [...setores, item];
    setSetores(updated);
    setNewSetorNome("");
    localStorage.setItem("medro_setores", JSON.stringify(updated));
    window.dispatchEvent(new Event("setores_updated"));
  };

  const handleDelete = (id: string) => {
    const updated = setores.filter((s) => s.id !== id);
    setSetores(updated);
    localStorage.setItem("medro_setores", JSON.stringify(updated));
    window.dispatchEvent(new Event("setores_updated"));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= setores.length) return;
    const copy = [...setores];
    const [moved] = copy.splice(index, 1);
    if (moved) {
      copy.splice(targetIndex, 0, moved);
      setSetores(copy);
      localStorage.setItem("medro_setores", JSON.stringify(copy));
      window.dispatchEvent(new Event("setores_updated"));
    }
  };

  const handleStartEdit = (s: SetorDef) => {
    setEditingId(s.id);
    setEditingValue(s.nome);
  };

  const handleConfirmEdit = () => {
    if (!editingId) return;
    const updated = setores.map((s) => (s.id === editingId ? { ...s, nome: editingValue.trim() || s.nome } : s));
    setSetores(updated);
    setEditingId(null);
    localStorage.setItem("medro_setores", JSON.stringify(updated));
    window.dispatchEvent(new Event("setores_updated"));
  };

  const filtered = setores.filter((s) => s.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex max-h-[85vh] w-full max-w-xl flex-col rounded-2xl border border-border bg-surface shadow-mac-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Gerenciamento de Setores</h3>
            <p className="text-[12px] text-muted-foreground">Configuração e ordem de etapas dos setores industriais</p>
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
          {/* Top Actions: Search + Add */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar setor..."
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

          <form onSubmit={handleAdd} className="flex gap-2">
            <Input
              placeholder="Nome do novo setor..."
              value={newSetorNome}
              onChange={(e) => setNewSetorNome(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="neutral" size="sm" className="gap-1">
              <Plus className="size-3.5" /> Adicionar
            </Button>
          </form>

          {/* List */}
          <div className="divide-y divide-border/60 rounded-xl border border-border bg-surface-2/30">
            {filtered.map((s, idx) => {
              const realIndex = setores.findIndex((item) => item.id === s.id);
              const isEditing = editingId === s.id;
              return (
                <div key={s.id} className="flex items-center justify-between px-3 py-2 text-sm hover:bg-surface-2/50">
                  <div className="flex flex-1 items-center gap-2">
                    <span className="w-6 text-center text-xs font-mono text-muted-foreground">
                      {realIndex + 1}
                    </span>
                    {isEditing ? (
                      <div className="flex flex-1 items-center gap-2">
                        <Input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="h-7 text-xs"
                          autoFocus
                          onKeyDown={(e) => e.key === "Enter" && handleConfirmEdit()}
                        />
                        <Button size="sm" variant="primary" onClick={handleConfirmEdit} className="h-7 px-2 text-xs">
                          OK
                        </Button>
                      </div>
                    ) : (
                      <span
                        onClick={() => handleStartEdit(s)}
                        className="cursor-pointer font-medium text-foreground hover:underline"
                        title="Clique para renomear"
                      >
                        {s.nome}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={realIndex === 0}
                      onClick={() => handleMove(realIndex, "up")}
                      className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-surface-2 hover:text-foreground disabled:opacity-30"
                      title="Mover para cima"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={realIndex === setores.length - 1}
                      onClick={() => handleMove(realIndex, "down")}
                      className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-surface-2 hover:text-foreground disabled:opacity-30"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      className="flex size-7 items-center justify-center rounded text-accent-rose/70 hover:bg-accent-rose/10 hover:text-accent-rose"
                      title="Excluir setor"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
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
