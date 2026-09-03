import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Clock,
  Calendar,
  Building2,
  User,
  Flame,
  FileText,
  Upload,
  Image as ImageIcon,
  Edit2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import type { CaldeirariaItem } from "../api";
import { useUpdateCaldeirariaItem } from "../api";
import { FotoModal } from "./FotoModal";

interface DetalhesServicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CaldeirariaItem | null;
}

export function DetalhesServicoModal({ isOpen, onClose, item }: DetalhesServicoModalProps) {
  const { user, can } = useAuth();
  const canEditFields = can("_CAL_CAD");
  const updateItem = useUpdateCaldeirariaItem();

  const [modoAcao, setModoAcao] = useState<"visualizar" | "concluir" | "suspender" | "editar">("visualizar");
  const [motivoSuspensao, setMotivoSuspensao] = useState("");
  const [evidenciaFoto, setEvidenciaFoto] = useState<string | null>(null);

  const [editServicos, setEditServicos] = useState("");
  const [editPrazo, setEditPrazo] = useState(3);
  const [editRegime, setEditRegime] = useState<"Normal" | "Prioridade">("Normal");

  const [fotoVisualizando, setFotoVisualizando] = useState<{ url: string; title: string } | null>(null);

  React.useEffect(() => {
    if (item) {
      setModoAcao("visualizar");
      setMotivoSuspensao(item.comentario || "");
      setEvidenciaFoto(item.evidencia || null);
      setEditServicos(item.servicos || "");
      setEditPrazo(item.prazo || 3);
      setEditRegime((item.regime as "Normal" | "Prioridade") || "Normal");
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleEvidenciaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEvidenciaFoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleExecutarConclusao = async () => {
    try {
      await updateItem.mutateAsync({
        id: item.id,
        data: {
          status: "Concluído",
          concluidoPor: user?.nome || "Operador Responsável",
          dataConclusao: new Date().toISOString(),
          evidencia: evidenciaFoto || undefined,
        },
      });
      onClose();
    } catch {
      alert("Erro ao concluir serviço no Dataverse.");
    }
  };

  const handleExecutarSuspensao = async () => {
    if (!motivoSuspensao.trim()) {
      alert("Por favor, descreva a justificativa da suspensão.");
      return;
    }

    try {
      await updateItem.mutateAsync({
        id: item.id,
        data: {
          status: "Suspenso",
          comentario: motivoSuspensao.trim(),
          dataModificacao: new Date().toISOString(),
        },
      });
      onClose();
    } catch {
      alert("Erro ao suspender serviço no Dataverse.");
    }
  };

  const handleReativar = async () => {
    if (!confirm("Deseja reativar este serviço e colocá-lo de volta na fila de pendentes?")) return;

    try {
      await updateItem.mutateAsync({
        id: item.id,
        data: {
          status: "Pendente",
          dataModificacao: new Date().toISOString(),
        },
      });
      onClose();
    } catch {
      alert("Erro ao reativar serviço.");
    }
  };

  const handleSalvarEdicao = async () => {
    try {
      await updateItem.mutateAsync({
        id: item.id,
        data: {
          servicos: editServicos,
          prazo: editPrazo,
          regime: editRegime,
          dataModificacao: new Date().toISOString(),
        },
      });
      setModoAcao("visualizar");
    } catch {
      alert("Erro ao salvar alterações no Dataverse.");
    }
  };

  const isPendente = item.status !== "Concluído" && item.status !== "Suspenso";
  const isSuspenso = item.status === "Suspenso";
  const isConcluido = item.status === "Concluído";

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-2/50">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isConcluido
                    ? "bg-success/15 text-success border border-success/30"
                    : isSuspenso
                    ? "bg-warning/15 text-warning border border-warning/30"
                    : item.regime === "Prioridade"
                    ? "bg-danger/15 text-danger border border-danger/30"
                    : "bg-primary/15 text-primary border border-primary/30"
                }`}
              >
                {isConcluido ? (
                  <CheckCircle2 className="size-5" />
                ) : isSuspenso ? (
                  <AlertTriangle className="size-5" />
                ) : (
                  <Flame className="size-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-foreground">{item.pecas}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isConcluido
                        ? "bg-success/15 text-success border border-success/30"
                        : isSuspenso
                        ? "bg-warning/15 text-warning border border-warning/30"
                        : "bg-primary/15 text-primary border border-primary/30"
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.regime === "Prioridade" && (
                    <span className="rounded-full bg-danger/15 border border-danger/30 px-2 py-0.5 text-[10px] font-bold text-danger flex items-center gap-1">
                      <Flame className="size-3" /> Prioridade
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ordem de Serviço: <strong className="text-foreground">{item.os}</strong> · Filial: {item.unidade}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
            {/* Metadados e Prazos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg border border-border bg-surface-2/50 p-3.5 text-xs">
              <div>
                <span className="text-muted-foreground block mb-0.5">Data de Envio</span>
                <span className="font-semibold text-foreground">
                  {item.dataEnvio ? new Date(item.dataEnvio).toLocaleDateString("pt-BR") : "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">Prazo Estimado</span>
                <span className="font-semibold text-foreground">{item.prazo || 0} dias</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">Previsão Entrega</span>
                <span className="font-semibold text-foreground">
                  {item.dataPrazo ? new Date(item.dataPrazo).toLocaleDateString("pt-BR") : "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">Inserido Por</span>
                <span className="font-semibold text-foreground line-clamp-1">{item.inseridoPor || "—"}</span>
              </div>
            </div>

            {/* Descrição dos Serviços */}
            {modoAcao === "editar" ? (
              <div className="flex flex-col gap-3 rounded-lg border border-accent-amber/40 bg-accent-amber/5 p-4">
                <span className="text-xs font-semibold text-accent-amber">Editar Detalhes do Serviço</span>
                <div>
                  <label className="text-xs text-foreground block mb-1">Serviços / Escopo Mecânico</label>
                  <textarea
                    rows={3}
                    value={editServicos}
                    onChange={(e) => setEditServicos(e.target.value)}
                    className="w-full rounded-md border border-border bg-surface p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent-amber resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-foreground block mb-1">Prazo (Dias)</label>
                    <Input
                      type="number"
                      value={editPrazo}
                      onChange={(e) => setEditPrazo(Number(e.target.value))}
                      className="bg-surface border-border text-foreground h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-foreground block mb-1">Regime</label>
                    <select
                      value={editRegime}
                      onChange={(e) => setEditRegime(e.target.value as "Normal" | "Prioridade")}
                      className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent-amber"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Prioridade">Prioridade</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-1">
                  <Button variant="ghost" size="sm" onClick={() => setModoAcao("visualizar")} className="h-8 text-xs">
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSalvarEdicao} className="h-8 text-xs bg-accent-amber hover:brightness-95 text-white gap-1.5">
                    <Save className="size-3.5" /> Salvar Edição
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-surface-2/40 p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <FileText className="size-3.5 text-accent-amber" />
                    Descrição do Serviço Executado
                  </span>
                  {canEditFields && !isConcluido && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setModoAcao("editar")}
                      className="h-6 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="size-3" /> Editar
                    </Button>
                  )}
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {item.servicos || "Sem detalhes informados."}
                </p>
              </div>
            )}

            {/* Justificativa / Observações (Suspensão ou Conclusão) */}
            {item.comentario && (
              <div className="rounded-lg border border-warning/30 bg-warning/10 p-3.5 text-xs">
                <span className="font-semibold text-warning block mb-1">
                  {isSuspenso ? "Motivo da Suspensão:" : "Observações:"}
                </span>
                <p className="text-foreground">{item.comentario}</p>
                {item.dataModificacao && (
                  <span className="text-[10px] text-muted-foreground block mt-1">
                    Registrado em: {new Date(item.dataModificacao).toLocaleString("pt-BR")}
                  </span>
                )}
              </div>
            )}

            {/* Informações de Conclusão se concluído */}
            {isConcluido && (
              <div className="rounded-lg border border-success/30 bg-success/10 p-3.5 text-xs">
                <span className="font-semibold text-success block mb-1">Serviço Concluído</span>
                <p className="text-foreground">
                  Responsável: <strong>{item.concluidoPor || "Operador"}</strong> · Data:{" "}
                  {item.dataConclusao ? new Date(item.dataConclusao).toLocaleString("pt-BR") : "—"}
                </p>
              </div>
            )}

            {/* Fotos: Referência e Evidência */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Foto de Referência */}
              <div className="rounded-lg border border-border bg-surface-2/40 p-3.5">
                <span className="text-xs font-medium text-foreground block mb-2">Foto de Referência (Inicial)</span>
                {item.imagemReferencia ? (
                  <div
                    onClick={() => setFotoVisualizando({ url: item.imagemReferencia!, title: `Referência - ${item.pecas} (OS ${item.os})` })}
                    className="group relative cursor-pointer overflow-hidden rounded-md border border-border aspect-video bg-black/10 dark:bg-black/40 flex items-center justify-center"
                  >
                    <img src={item.imagemReferencia} alt="Referência" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-white">
                      Clique para ampliar
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border py-6 text-xs text-muted-foreground">
                    <ImageIcon className="size-6 text-muted-foreground/60 mb-1" />
                    Sem foto de referência inicial
                  </div>
                )}
              </div>

              {/* Foto de Evidência */}
              <div className="rounded-lg border border-border bg-surface-2/40 p-3.5">
                <span className="text-xs font-medium text-foreground block mb-2">Foto de Evidência (Peça Pronta)</span>
                {item.evidencia ? (
                  <div
                    onClick={() => setFotoVisualizando({ url: item.evidencia!, title: `Evidência de Conclusão - ${item.pecas} (OS ${item.os})` })}
                    className="group relative cursor-pointer overflow-hidden rounded-md border border-success/40 aspect-video bg-black/10 dark:bg-black/40 flex items-center justify-center"
                  >
                    <img src={item.evidencia} alt="Evidência" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-white">
                      Clique para ampliar
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border py-6 text-xs text-muted-foreground">
                    <ImageIcon className="size-6 text-muted-foreground/60 mb-1" />
                    Sem evidência anexada
                  </div>
                )}
              </div>
            </div>

            {/* Painel de Ação: Concluir com Evidência */}
            {modoAcao === "concluir" && (
              <div className="flex flex-col gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
                <h3 className="text-xs font-semibold text-success flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" /> Finalizar e Concluir Serviço
                </h3>
                <p className="text-xs text-foreground">
                  O serviço será marcado como <strong>Concluído</strong> por <strong>{user?.nome || "Operador"}</strong> com o carimbo de data/hora atual.
                </p>
                <div>
                  <label className="text-xs text-foreground block mb-1.5">Foto de Evidência da Peça Finalizada (Opcional)</label>
                  <div className="flex items-center gap-3">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-success/40 bg-surface px-3 py-2 text-xs font-medium text-success hover:bg-success/10 transition-colors">
                      <Upload className="size-4" />
                      <span>Anexar Foto de Evidência</span>
                      <input type="file" accept="image/*" onChange={handleEvidenciaUpload} className="hidden" />
                    </label>
                    {evidenciaFoto && (
                      <img src={evidenciaFoto} alt="Evidência" className="h-10 w-10 rounded object-cover border border-success" />
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="ghost" size="sm" onClick={() => setModoAcao("visualizar")} className="h-8 text-xs">
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    disabled={updateItem.isPending}
                    onClick={handleExecutarConclusao}
                    className="h-8 text-xs bg-success hover:brightness-95 text-white font-semibold"
                  >
                    Confirmar Conclusão
                  </Button>
                </div>
              </div>
            )}

            {/* Painel de Ação: Suspender */}
            {modoAcao === "suspender" && (
              <div className="flex flex-col gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4">
                <h3 className="text-xs font-semibold text-warning flex items-center gap-1.5">
                  <AlertTriangle className="size-4" /> Suspender Serviço
                </h3>
                <p className="text-xs text-foreground">
                  Informe o motivo da suspensão (ex: aguardando material, aguardando aprovação de cliente, interferência mecânica).
                </p>
                <textarea
                  rows={2}
                  value={motivoSuspensao}
                  onChange={(e) => setMotivoSuspensao(e.target.value)}
                  placeholder="Justificativa da suspensão..."
                  className="w-full rounded-md border border-border bg-surface p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent-amber resize-none"
                />
                <div className="flex justify-end gap-2 mt-1">
                  <Button variant="ghost" size="sm" onClick={() => setModoAcao("visualizar")} className="h-8 text-xs">
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    disabled={updateItem.isPending}
                    onClick={handleExecutarSuspensao}
                    className="h-8 text-xs bg-warning hover:brightness-95 text-slate-950 font-semibold"
                  >
                    Confirmar Suspensão
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer com Botões de Ação */}
          <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-surface-2/50">
            <Button variant="neutral" size="sm" onClick={onClose} className="text-xs">
              Fechar
            </Button>

            <div className="flex items-center gap-2">
              {isPendente && modoAcao === "visualizar" && (
                <>
                  <Button
                    variant="neutral"
                    size="sm"
                    onClick={() => setModoAcao("suspender")}
                    className="border-warning/40 text-warning hover:bg-warning/10 text-xs"
                  >
                    Suspender
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setModoAcao("concluir")}
                    className="bg-success hover:brightness-95 text-white font-medium text-xs gap-1.5"
                  >
                    <CheckCircle2 className="size-4" /> Concluir Serviço
                  </Button>
                </>
              )}

              {isSuspenso && modoAcao === "visualizar" && (
                <Button
                  size="sm"
                  onClick={handleReativar}
                  disabled={updateItem.isPending}
                  className="bg-primary hover:brightness-95 text-white font-medium text-xs gap-1.5"
                >
                  <RotateCw className="size-3.5" /> Reativar Serviço
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Foto Ampliada */}
      <FotoModal
        isOpen={Boolean(fotoVisualizando)}
        onClose={() => setFotoVisualizando(null)}
        imageUrl={fotoVisualizando?.url || null}
        title={fotoVisualizando?.title || "Foto da Peça"}
      />
    </>
  );
}
