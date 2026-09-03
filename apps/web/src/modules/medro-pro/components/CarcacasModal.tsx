import React, { useState, useEffect, useMemo } from "react";
import { X, Search, Save, Plus, ArrowUpDown, ArrowUp, ArrowDown, Check, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Carcaca {
  cr4a1_depara_carcacasid: string;
  cr4a1_name: string;
  cr4a1_carcaca_equivalente: string;
}

interface CarcacasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CarcacasModal({ isOpen, onClose }: CarcacasModalProps) {
  const [carcacas, setCarcacas] = useState<Carcaca[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editedRows, setEditedRows] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Carcaca;
    direction: "asc" | "desc";
  } | null>({ key: "cr4a1_name", direction: "asc" });

  // Nova Carcaça (Inline)
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newOriginal, setNewOriginal] = useState("");
  const [newEquivalente, setNewEquivalente] = useState("");
  const [savingNew, setSavingNew] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCarcacas();
    }
  }, [isOpen]);

  const fetchCarcacas = async () => {
    setLoading(true);
    try {
      const res = await api<{ status: string; data: Carcaca[] }>("/medro-pro/carcacas");
      if (res && res.status === "success") {
        setCarcacas(res.data);
      }
    } catch (error) {
      console.error("Erro ao carregar as carcaças do Dataverse:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (name: string, value: string) => {
    setEditedRows((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAll = async () => {
    if (Object.keys(editedRows).length === 0) return;

    setSaving(true);
    const updates = Object.entries(editedRows).map(([name, val]) => {
      const carcaca = carcacas.find((c) => c.cr4a1_name === name);
      return {
        cr4a1_depara_carcacasid: carcaca?.cr4a1_depara_carcacasid || "",
        cr4a1_name: name,
        cr4a1_carcaca_equivalente: val,
      };
    });

    try {
      await api("/medro-pro/carcacas", {
        method: "PATCH",
        body: updates,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
      setEditedRows({});
      await fetchCarcacas();
    } catch (error) {
      console.error("Erro ao salvar carcaças no Dataverse:", error);
      alert("Erro ao salvar alterações no Dataverse.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddNew = async () => {
    if (!newOriginal.trim() || !newEquivalente.trim()) {
      alert("Preencha ambos os campos para adicionar a carcaça.");
      return;
    }

    setSavingNew(true);
    try {
      await api("/medro-pro/carcacas", {
        method: "POST",
        body: {
          cr4a1_name: newOriginal.trim(),
          cr4a1_carcaca_equivalente: newEquivalente.trim(),
        },
      });
      setIsAddingNew(false);
      setNewOriginal("");
      setNewEquivalente("");
      await fetchCarcacas();
    } catch (error) {
      console.error("Erro ao criar carcaça no Dataverse:", error);
      alert("Erro ao criar carcaça no Dataverse.");
    } finally {
      setSavingNew(false);
    }
  };

  const handleSort = (key: keyof Carcaca) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCarcacas = useMemo(() => {
    const list = [...carcacas];
    if (!sortConfig) return list;

    list.sort((a, b) => {
      const valA = String(a[sortConfig.key] ?? "").toLowerCase();
      const valB = String(b[sortConfig.key] ?? "").toLowerCase();
      const res = valA.localeCompare(valB, "pt-BR", { numeric: true });
      return sortConfig.direction === "asc" ? res : -res;
    });
    return list;
  }, [carcacas, sortConfig]);

  const filteredCarcacas = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return sortedCarcacas;
    return sortedCarcacas.filter(
      (c) =>
        c.cr4a1_name.toLowerCase().includes(term) ||
        c.cr4a1_carcaca_equivalente.toLowerCase().includes(term),
    );
  }, [sortedCarcacas, searchTerm]);

  const hasEdits = Object.keys(editedRows).length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-surface shadow-mac-3 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface-2/70 px-6 py-4 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                Gerenciar Carcaças (De-Para)
              </h2>
              <span className="rounded-full border border-primary/30 bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Dataverse · cr4a1_depara_carcacases
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure o porte base numérico para os cálculos do APS e classificação de motores.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface/50 p-4">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar carcaça original ou equivalente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-surface-2/60 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="neutral"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="h-9 gap-1.5 text-xs font-medium"
            >
              <Plus className="size-3.5" />
              Nova Carcaça
            </Button>

            <Button
              variant="primary"
              onClick={handleSaveAll}
              disabled={!hasEdits || saving}
              className={`h-9 gap-2 text-xs font-medium transition-all ${
                hasEdits ? "shadow-lg shadow-primary/20" : "opacity-50 cursor-not-allowed"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Salvando...
                </>
              ) : savedSuccess ? (
                <>
                  <Check className="size-3.5 text-accent-green" />
                  Salvo no Dataverse!
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  Salvar Alterações {hasEdits ? `(${Object.keys(editedRows).length})` : ""}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Inline Creation Form */}
        {isAddingNew && (
          <div className="flex flex-wrap items-end gap-3 border-b border-border bg-surface-2/40 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Carcaça Original (Protheus)
              </label>
              <Input
                type="text"
                placeholder="Ex: HGF315C"
                value={newOriginal}
                onChange={(e) => setNewOriginal(e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>

            <div className="flex-1 min-w-[180px]">
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Carcaça Equivalente (Base APS)
              </label>
              <Input
                type="text"
                placeholder="Ex: 315"
                value={newEquivalente}
                onChange={(e) => setNewEquivalente(e.target.value)}
                className="h-8 text-xs font-mono font-bold text-primary"
              />
            </div>

            <Button
              variant="primary"
              onClick={handleAddNew}
              disabled={savingNew || !newOriginal.trim() || !newEquivalente.trim()}
              className="h-8 text-xs font-medium"
            >
              {savingNew ? "Criando..." : "Confirmar Criação"}
            </Button>

            <Button
              variant="neutral"
              onClick={() => setIsAddingNew(false)}
              className="h-8 text-xs"
            >
              Cancelar
            </Button>
          </div>
        )}

        {/* Table Content */}
        <div className="flex-1 overflow-auto min-h-0">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="size-7 animate-spin text-primary" />
              <p className="text-xs">Carregando carcaças do Dataverse...</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="sticky top-0 z-10 border-b border-border bg-surface-2/95 backdrop-blur-sm text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th
                    onClick={() => handleSort("cr4a1_name")}
                    className="cursor-pointer px-4 py-3 font-semibold hover:text-foreground transition-colors select-none w-1/2"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Carcaça Original (Protheus)</span>
                      {sortConfig?.key === "cr4a1_name" ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUp className="size-3 text-primary" />
                        ) : (
                          <ArrowDown className="size-3 text-primary" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3 opacity-40" />
                      )}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort("cr4a1_carcaca_equivalente")}
                    className="cursor-pointer px-4 py-3 font-semibold hover:text-foreground transition-colors select-none w-1/2"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Carcaça Equivalente (Base APS)</span>
                      {sortConfig?.key === "cr4a1_carcaca_equivalente" ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUp className="size-3 text-primary" />
                        ) : (
                          <ArrowDown className="size-3 text-primary" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3 opacity-40" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredCarcacas.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-muted-foreground">
                      Nenhuma carcaça corresponde ao filtro de busca.
                    </td>
                  </tr>
                ) : (
                  filteredCarcacas.map((c) => {
                    const name = c.cr4a1_name;
                    const originalValue = c.cr4a1_carcaca_equivalente;
                    const editedValue = editedRows[name];
                    const currentValue = editedValue !== undefined ? editedValue : originalValue;
                    const isEdited = editedValue !== undefined && editedValue !== originalValue;

                    return (
                      <tr
                        key={name}
                        className={`transition-colors hover:bg-surface-2/40 ${
                          isEdited ? "bg-primary/5" : ""
                        }`}
                      >
                        <td className="px-4 py-2 font-mono font-medium text-foreground">
                          {name}
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={currentValue}
                            onChange={(e) => handleEditChange(name, e.target.value)}
                            placeholder="Mapear equivalente (ex: 180, 315)..."
                            className={`h-7 w-full max-w-sm rounded px-2.5 font-mono text-xs transition-all outline-none ${
                              isEdited
                                ? "border border-primary bg-primary/10 text-primary font-bold shadow-sm"
                                : "border border-transparent bg-transparent text-foreground hover:border-border focus:border-primary focus:bg-surface-2"
                            }`}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-surface px-6 py-2.5 text-xs text-muted-foreground">
          <span>
            Mostrando <strong>{filteredCarcacas.length}</strong> de <strong>{carcacas.length}</strong> carcaças
          </span>
          <Button variant="neutral" onClick={onClose} className="h-7 text-xs">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
