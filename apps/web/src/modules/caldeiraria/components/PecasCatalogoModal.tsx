import React, { useState } from "react";
import { X, Plus, Trash2, Search, Wrench, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCaldeirariaPecas, useCreatePeca, useDeletePeca } from "../api";
import { useAuth } from "@/lib/auth";

interface PecasCatalogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PecasCatalogoModal({ isOpen, onClose }: PecasCatalogoModalProps) {
  const { can } = useAuth();
  const canEdit = can("_CAL_CAD");
  const { data, isLoading } = useCaldeirariaPecas();
  const createPeca = useCreatePeca();
  const deletePeca = useDeletePeca();

  const [search, setSearch] = useState("");
  const [novaPeca, setNovaPeca] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

  const pecas = (data?.items || []).filter(
    (p) => p.pecas.trim().toLowerCase() !== "balanceamento",
  );
  const filtered = pecas.filter((p) => p.pecas.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaPeca.trim()) return;

    try {
      await createPeca.mutateAsync(novaPeca.trim());
      setNovaPeca("");
      setFeedback({ type: "success", text: "Peça cadastrada com sucesso!" });
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback({ type: "error", text: "Erro ao salvar peça no Dataverse." });
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Deseja realmente remover a peça "${nome}" do catálogo padrão?`)) return;
    try {
      await deletePeca.mutateAsync(id);
    } catch {
      alert("Erro ao excluir peça.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-surface-2/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-amber/15 border border-accent-amber/30 text-accent-amber">
              <Wrench className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Catálogo de Peças Padronizadas</h2>
              <p className="text-xs text-muted-foreground">
                Tabela Dataverse: <span className="font-mono text-accent-amber">cr4a1_caldeiraria_lista</span>
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
          {/* Formulário de cadastro de nova peça */}
          {canEdit && (
            <form onSubmit={handleAdd} className="flex flex-col gap-2 rounded-lg border border-accent-amber/30 bg-accent-amber/5 p-3.5">
              <label className="text-xs font-medium text-accent-amber">Nova Peça Padronizada</label>
              <div className="flex gap-2">
                <Input
                  value={novaPeca}
                  onChange={(e) => setNovaPeca(e.target.value)}
                  placeholder="Ex: Mancal Superior de Apoio, Tampa Defletora..."
                  className="bg-surface-2 border-border text-foreground placeholder:text-muted-foreground text-sm h-9"
                />
                <Button
                  type="submit"
                  disabled={!novaPeca.trim() || createPeca.isPending}
                  className="h-9 gap-1.5 bg-accent-amber hover:brightness-95 text-white font-medium shrink-0 px-3 text-xs"
                >
                  <Plus className="size-4" />
                  {createPeca.isPending ? "Salvando..." : "Adicionar"}
                </Button>
              </div>
              {feedback && (
                <div
                  className={`flex items-center gap-1.5 text-xs ${
                    feedback.type === "success" ? "text-success" : "text-danger"
                  }`}
                >
                  {feedback.type === "success" ? <Check className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                  {feedback.text}
                </div>
              )}
            </form>
          )}

          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar peças cadastradas..."
              className="bg-surface-2 border-border pl-9 text-sm text-foreground placeholder:text-muted-foreground h-9"
            />
          </div>

          {/* Lista de Peças */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-surface-2/40 p-2 max-h-[350px] overflow-y-auto">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-muted-foreground">Carregando catálogo do Dataverse...</div>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                {search ? "Nenhuma peça encontrada com esse filtro." : "Nenhuma peça cadastrada."}
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between rounded-md border border-transparent px-3 py-2 text-sm text-foreground transition-colors hover:border-border hover:bg-surface-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="size-2 rounded-full bg-accent-amber" />
                    <span className="font-medium">{item.pecas}</span>
                  </div>
                  {canEdit && item.pecas !== "Balanceamento" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.pecas)}
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-danger hover:text-danger transition-opacity"
                      title="Excluir peça"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>

          <p className="text-[11px] text-muted-foreground">
            Total de peças no catálogo: <span className="font-semibold text-foreground">{pecas.length}</span>
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border px-5 py-3 bg-surface-2/50">
          <Button variant="neutral" size="sm" onClick={onClose} className="text-xs">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
