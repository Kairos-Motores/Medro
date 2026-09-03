import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  Upload,
  AlertCircle,
  Flame,
  Calendar,
  Clock,
  Building2,
  User,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useCaldeirariaPecas, useCreateCaldeirariaLote } from "../api";
import { FILIAIS, type Filial } from "@medro/shared";

interface NovoServicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFilial?: string;
}

interface ItemLote {
  tempId: string;
  os: string;
  pecas: string;
  servicos: string;
  prazo: number;
  regime: "Normal" | "Prioridade";
  imagemReferencia: string | null;
}

export function NovoServicoModal({ isOpen, onClose, defaultFilial }: NovoServicoModalProps) {
  const { user } = useAuth();
  const { data: pecasData } = useCaldeirariaPecas();
  const createLote = useCreateCaldeirariaLote();

  const [filial, setFilial] = useState<string>(
    defaultFilial && defaultFilial !== "Todas" ? defaultFilial : user?.filial || "São Luís",
  );
  const [os, setOs] = useState("");
  const [usarSi, setUsarSi] = useState(false);
  const [pecaSelecionada, setPecaSelecionada] = useState("");
  const [servicos, setServicos] = useState("");
  const [prazo, setPrazo] = useState<number>(3);
  const [regime, setRegime] = useState<"Normal" | "Prioridade">("Normal");
  const [imagemReferencia, setImagemReferencia] = useState<string | null>(null);

  // Lote de itens (como o Power Apps com colServico)
  const [lote, setLote] = useState<ItemLote[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  if (!isOpen) return null;

  const pecasLista = pecasData?.items || [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagemReferencia(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleToggleSi = () => {
    if (!usarSi) {
      setUsarSi(true);
      setOs("SI-");
    } else {
      setUsarSi(false);
      setOs("");
    }
  };

  const pecaFinal = pecaSelecionada;

  const handleAdicionarAoLote = () => {
    setErro(null);
    if (!os.trim()) {
      setErro("Informe o número da Ordem de Serviço (ou SI).");
      return;
    }
    if (!pecaFinal) {
      setErro("Selecione a peça mecânica a ser trabalhada.");
      return;
    }
    if (!servicos.trim()) {
      setErro("Descreva os serviços / retrabalho a ser executado.");
      return;
    }

    const novoItem: ItemLote = {
      tempId: `item-${Date.now()}-${Math.random()}`,
      os: os.trim().toUpperCase(),
      pecas: pecaFinal,
      servicos: servicos.trim(),
      prazo: Math.max(1, Number(prazo) || 1),
      regime,
      imagemReferencia,
    };

    setLote((prev) => [...prev, novoItem]);

    setPecaSelecionada("");
    setServicos("");
    setImagemReferencia(null);
  };

  const handleRemoverDoLote = (tempId: string) => {
    setLote((prev) => prev.filter((i) => i.tempId !== tempId));
  };

  const handleSalvarTudo = async () => {
    setErro(null);

    let itensParaSalvar = [...lote];
    if (itensParaSalvar.length === 0) {
      if (!os.trim()) {
        setErro("Informe o número da Ordem de Serviço (ou SI).");
        return;
      }
      if (!pecaFinal) {
        setErro("Selecione a peça mecânica a ser trabalhada.");
        return;
      }
      if (!servicos.trim()) {
        setErro("Descreva os serviços / retrabalho a ser executado.");
        return;
      }

      itensParaSalvar.push({
        tempId: `direct-${Date.now()}`,
        os: os.trim().toUpperCase(),
        pecas: pecaFinal,
        servicos: servicos.trim(),
        prazo: Math.max(1, Number(prazo) || 1),
        regime,
        imagemReferencia,
      });
    }

    try {
      const payload = itensParaSalvar.map((it) => ({
        os: it.os,
        pecas: it.pecas,
        servicos: it.servicos,
        prazo: it.prazo,
        regime: it.regime,
        unidade: filial,
        inseridoPor: user?.nome || "Operador",
        dataEnvio: new Date().toISOString(),
        imagemReferencia: it.imagemReferencia || undefined,
      }));

      await createLote.mutateAsync(payload);
      onClose();
    } catch (err) {
      setErro((err as Error).message || "Erro ao salvar demanda de Usinagem e Caldeiraria.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-2/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-amber/15 border border-accent-amber/30 text-accent-amber">
              <Flame className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Cadastrar Nova Demanda</h2>
              <p className="text-xs text-muted-foreground">
                Usinagem e Caldeiraria · Mapeado para <span className="font-mono text-accent-amber">cr4a1_caldeiraria_controle</span>
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        {/* Form Body */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
          {erro && (
            <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
              <AlertCircle className="size-4 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {/* Dados Gerais: Filial e OS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1.5">
                <Building2 className="size-3.5 text-accent-amber" />
                Unidade / Filial
              </label>
              <select
                value={filial}
                onChange={(e) => setFilial(e.target.value)}
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent-amber"
              >
                {FILIAIS.map((f) => (
                  <option key={f} value={f} className="bg-surface text-foreground">
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-foreground">Ordem de Serviço (OS)</label>
                <button
                  type="button"
                  onClick={handleToggleSi}
                  className={`text-[11px] font-semibold transition-colors ${
                    usarSi ? "text-accent-amber underline" : "text-muted-foreground hover:text-accent-amber"
                  }`}
                >
                  {usarSi ? "Sem OS (Modo SI)" : "Usar SI (Sem OS)"}
                </button>
              </div>
              <Input
                value={os}
                onChange={(e) => setOs(e.target.value)}
                placeholder={usarSi ? "Ex: SI-4512" : "Ex: 2026-4821 ou 105820"}
                className="bg-surface-2 border-border text-foreground placeholder:text-muted-foreground uppercase h-9"
              />
            </div>
          </div>

          {/* Seletor de Peça Mecânica */}
          <div className="rounded-lg border border-border bg-surface-2/40 p-4">
            <label className="text-xs font-medium text-foreground mb-2 block">
              Peça Mecânica a Trabalhar <span className="text-danger">*</span>
            </label>
            <select
              value={pecaSelecionada}
              onChange={(e) => setPecaSelecionada(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent-amber"
            >
              <option value="">Selecione uma peça do catálogo padronizado...</option>
              {pecasLista
                .filter((p) => p.pecas.trim().toLowerCase() !== "balanceamento")
                .map((p) => (
                  <option key={p.id} value={p.pecas} className="bg-surface text-foreground">
                    {p.pecas}
                  </option>
                ))}
            </select>
          </div>

          {/* Descrição dos Serviços */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              Descrição dos Serviços e Retrabalhos <span className="text-danger">*</span>
            </label>
            <textarea
              rows={3}
              value={servicos}
              onChange={(e) => setServicos(e.target.value)}
              placeholder="Descreva detalhadamente o que deve ser feito: torneamento, encasquetamento, recuperação por solda TIG/MIG, retífica de sede, etc."
              className="w-full rounded-md border border-border bg-surface-2 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent-amber resize-none"
            />
          </div>

          {/* Prazo e Regime */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1.5">
                <Clock className="size-3.5 text-accent-amber" />
                Prazo Estimado (em dias úteis)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={prazo}
                  onChange={(e) => setPrazo(Number(e.target.value))}
                  className="bg-surface-2 border-border text-foreground w-28 h-9"
                />
                <span className="text-xs text-muted-foreground">
                  Previsão:{" "}
                  <strong className="text-foreground">
                    {new Date(Date.now() + (prazo || 1) * 24 * 3600 * 1000).toLocaleDateString("pt-BR")}
                  </strong>
                </span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1.5">
                <Flame className="size-3.5 text-accent-amber" />
                Regime Operacional
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegime("Normal")}
                  className={`flex items-center justify-center gap-1.5 rounded-md border py-2 text-xs font-semibold transition-all ${
                    regime === "Normal"
                      ? "border-primary/50 bg-primary/15 text-primary shadow-sm"
                      : "border-border bg-surface-2 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setRegime("Prioridade")}
                  className={`flex items-center justify-center gap-1.5 rounded-md border py-2 text-xs font-semibold transition-all ${
                    regime === "Prioridade"
                      ? "border-danger bg-danger/15 text-danger shadow-sm ring-1 ring-danger/30"
                      : "border-border bg-surface-2 text-muted-foreground hover:text-danger"
                  }`}
                >
                  <Flame className="size-3 text-danger" />
                  Prioridade
                </button>
              </div>
            </div>
          </div>

          {/* Anexo de Imagem de Referência */}
          <div className="rounded-lg border border-border bg-surface-2/40 p-4">
            <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-2">
              <ImageIcon className="size-3.5 text-accent-amber" />
              Foto / Imagem de Referência (Avaria ou Desenho da Peça)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface px-4 py-3 text-xs font-medium text-foreground hover:border-accent-amber hover:text-accent-amber transition-colors w-full sm:w-auto">
                <Upload className="size-4 text-accent-amber" />
                <span>Selecionar Foto ou Arquivo</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {imagemReferencia ? (
                <div className="flex items-center gap-3">
                  <img
                    src={imagemReferencia}
                    alt="Preview"
                    className="h-12 w-12 rounded object-cover border border-accent-amber/50"
                  />
                  <span className="text-xs text-success font-medium">Imagem anexada!</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setImagemReferencia(null)}
                    className="h-7 text-xs text-danger hover:text-danger p-1"
                  >
                    Remover
                  </Button>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">Nenhuma imagem anexada (opcional)</span>
              )}
            </div>
          </div>

          {/* Ação de Adicionar ao Lote (Multi-item para a mesma OS) */}
          <div className="flex justify-end pt-1">
            <Button
              type="button"
              variant="neutral"
              onClick={handleAdicionarAoLote}
              className="gap-2 border-accent-amber/40 bg-accent-amber/10 text-accent-amber hover:bg-accent-amber/20 text-xs h-9"
            >
              <Plus className="size-4" />
              Adicionar Outro Item para esta OS ({lote.length} no lote)
            </Button>
          </div>

          {/* Visualização dos Itens do Lote */}
          {lote.length > 0 && (
            <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface-2/60 p-3.5">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5">
                  <Layers className="size-3.5 text-accent-amber" />
                  Itens na Fila de Envio em Lote ({lote.length})
                </span>
                <span className="text-muted-foreground">OS: {lote[0]?.os}</span>
              </div>
              <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                {lote.map((item, idx) => (
                  <div
                    key={item.tempId}
                    className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-2 font-mono text-[10px] text-muted-foreground border border-border">
                        {idx + 1}
                      </span>
                      <div>
                        <strong className="text-foreground">{item.pecas}</strong>
                        <span className="text-muted-foreground ml-2">({item.prazo} dias)</span>
                        <p className="text-muted-foreground line-clamp-1">{item.servicos}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                          item.regime === "Prioridade"
                            ? "bg-danger/15 text-danger border border-danger/30"
                            : "bg-surface-2 text-muted-foreground border border-border"
                        }`}
                      >
                        {item.regime}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoverDoLote(item.tempId)}
                        className="h-6 w-6 p-0 text-danger hover:brightness-90"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-surface-2/40">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <User className="size-3.5 text-muted-foreground" />
            Cadastrado por: <span className="font-semibold text-foreground">{user?.nome || "Operador"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="neutral" size="sm" onClick={onClose} className="text-xs">
              Cancelar
            </Button>
            <Button
              size="sm"
              disabled={createLote.isPending}
              onClick={handleSalvarTudo}
              className="gap-2 bg-accent-amber hover:brightness-95 text-white font-medium px-4 text-xs"
            >
              <Flame className="size-4" />
              {createLote.isPending
                ? "Enviando ao Dataverse..."
                : lote.length > 0
                ? `Salvar Todos (${lote.length} Itens)`
                : "Salvar Demanda"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
