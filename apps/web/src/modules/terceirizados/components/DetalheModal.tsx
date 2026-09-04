import { useEffect, useState } from "react";
import {
  X,
  Trash2,
  PackageCheck,
  RotateCcw,
  AlertCircle,
  CircleDollarSign,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import {
  useUpdateTerceirizado,
  useDeleteTerceirizado,
  type Terceirizado,
  type UpdateTerceirizadoInput,
} from "../api";

const fmtData = (s: string | null) => {
  if (!s) return "—";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toLocaleString("pt-BR", { dateStyle: "short" });
};
const num = (s: string) => Number(String(s).replace(/[^0-9.,-]/g, "").replace(",", ".")) || 0;

export function DetalheModal({
  registro,
  onClose,
}: {
  registro: Terceirizado | null;
  onClose: () => void;
}) {
  const atualizar = useUpdateTerceirizado();
  const excluir = useDeleteTerceirizado();

  const [orc, setOrc] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [servicos, setServicos] = useState<string[]>(["", "", "", "", ""]);
  const [valores, setValores] = useState<string[]>(["", "", "", "", ""]);
  const [total, setTotal] = useState("");
  const [avRetorno, setAvRetorno] = useState("");
  const [avDescricao, setAvDescricao] = useState("");
  const [avMedida, setAvMedida] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [confirmarExcluir, setConfirmarExcluir] = useState(false);

  useEffect(() => {
    if (!registro) return;
    setOrc(registro.orcFornecedor ?? "");
    setEmpresa(registro.empresa ?? "");
    setServicos([0, 1, 2, 3, 4].map((i) => registro.servicos[i] ?? ""));
    setValores([0, 1, 2, 3, 4].map((i) => registro.valores[i] ?? ""));
    setTotal(registro.totalValor ?? "");
    setAvRetorno(registro.avaliacaoRetorno ?? "");
    setAvDescricao(registro.avaliacaoDescricao ?? "");
    setAvMedida(registro.avaliacaoMedida ?? "");
    setErro(null);
    setConfirmarExcluir(false);
  }, [registro]);

  if (!registro) return null;

  const somaValores = valores.reduce((a, v) => a + num(v), 0);

  function montaPayload(extra?: Partial<UpdateTerceirizadoInput>): UpdateTerceirizadoInput {
    return {
      orcFornecedor: orc.trim(),
      empresa: empresa.trim(),
      servicos: servicos.map((s) => s.trim() || null),
      valores: valores.map((v) => v.trim() || null),
      totalValor: total.trim() || (somaValores > 0 ? String(somaValores) : ""),
      avaliacaoRetorno: avRetorno.trim(),
      avaliacaoDescricao: avDescricao.trim(),
      avaliacaoMedida: avMedida.trim(),
      ...extra,
    };
  }

  async function salvar(extra?: Partial<UpdateTerceirizadoInput>) {
    setErro(null);
    try {
      await atualizar.mutateAsync({ id: registro!.id, data: montaPayload(extra) });
      onClose();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao salvar.");
    }
  }

  async function reverterRetorno() {
    setErro(null);
    try {
      await atualizar.mutateAsync({ id: registro!.id, data: { dataRetorno: "" } });
      onClose();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao reverter.");
    }
  }

  async function remover() {
    try {
      await excluir.mutateAsync(registro!.id);
      onClose();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao excluir.");
    }
  }

  const busy = atualizar.isPending || excluir.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-border bg-surface-2/50 px-5 py-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-semibold">{registro.titulo || "(sem OS)"}</h2>
              {registro.nOr && (
                <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10.5px] text-muted-foreground">
                  OR {registro.nOr}
                </span>
              )}
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10.5px] font-semibold",
                  registro.pendente
                    ? "bg-warning/15 text-warning"
                    : "bg-success/15 text-success",
                )}
              >
                {registro.pendente ? "Pendente de retorno" : "Retornou"}
              </span>
            </div>
            <p className="mt-0.5 text-[11.5px] text-muted-foreground">
              {registro.peca} · {registro.situacao} · {registro.unidade} · registro {fmtData(registro.dataRegistro)}
              {registro.previsaoRetorno && ` · previsão ${fmtData(registro.previsaoRetorno)}`}
              {registro.dataRetorno && ` · retorno ${fmtData(registro.dataRetorno)}`}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="size-8 shrink-0 p-0" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
          {erro && (
            <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 p-2.5 text-[12px] text-danger">
              <AlertCircle className="size-4 shrink-0" /> {erro}
            </div>
          )}

          {registro.observacao && (
            <p className="rounded-lg border border-border bg-surface-2/60 p-2.5 text-[12px] text-foreground-secondary">
              {registro.observacao}
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[11.5px] font-medium text-foreground-secondary">Orçamento do fornecedor</span>
              <Input value={orc} onChange={(e) => setOrc(e.target.value)} placeholder="Ex.: R$ 4.800,00" className="h-9" />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11.5px] font-medium text-foreground-secondary">Fornecedor / empresa</span>
              <Input value={empresa} onChange={(e) => setEmpresa(e.target.value)} className="h-9" />
            </label>
          </div>

          {/* Serviços + valores */}
          <div>
            <span className="mb-1.5 block text-[11.5px] font-medium text-foreground-secondary">Serviços e valores</span>
            <div className="space-y-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={servicos[i]}
                    onChange={(e) => setServicos((a) => a.map((s, idx) => (idx === i ? e.target.value : s)))}
                    placeholder={`Serviço ${i + 1}`}
                    className="h-9 flex-1"
                  />
                  <Input
                    value={valores[i]}
                    onChange={(e) => setValores((a) => a.map((v, idx) => (idx === i ? e.target.value : v)))}
                    placeholder="Valor"
                    className="h-9 w-28"
                  />
                </div>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-1 flex items-center gap-1 text-[11.5px] font-medium text-foreground-secondary">
              <CircleDollarSign className="size-3" /> Total do serviço
            </span>
            <div className="flex items-center gap-2">
              <Input value={total} onChange={(e) => setTotal(e.target.value)} placeholder={somaValores > 0 ? String(somaValores) : "0"} className="h-9 w-40" />
              {somaValores > 0 && (
                <button
                  type="button"
                  onClick={() => setTotal(String(somaValores))}
                  className="text-[11.5px] font-medium text-primary hover:underline"
                >
                  usar soma ({somaValores.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })})
                </button>
              )}
            </div>
          </label>

          {/* Avaliação de retorno */}
          <div className="rounded-lg border border-border bg-surface-2/50 p-3">
            <p className="mb-2 flex items-center gap-1.5 text-[11.5px] font-semibold text-foreground">
              <ClipboardCheck className="size-3.5 text-accent-indigo" /> Avaliação do retorno
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <Input value={avRetorno} onChange={(e) => setAvRetorno(e.target.value)} placeholder="Resultado (Aprovado / Reprovado)" className="h-9" />
              <Input value={avMedida} onChange={(e) => setAvMedida(e.target.value)} placeholder="Medida / cota conferida" className="h-9" />
              <textarea
                rows={2}
                value={avDescricao}
                onChange={(e) => setAvDescricao(e.target.value)}
                placeholder="Descrição da avaliação"
                className="w-full resize-none rounded-md border border-border bg-surface-2 p-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-accent-indigo sm:col-span-2"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border bg-surface-2/40 px-5 py-3.5">
          {confirmarExcluir ? (
            <>
              <span className="text-[12px] text-danger">Excluir este registro?</span>
              <Button variant="danger" size="sm" disabled={busy} onClick={remover} className="gap-1.5">
                <Trash2 className="size-3.5" /> Confirmar exclusão
              </Button>
              <Button variant="neutral" size="sm" onClick={() => setConfirmarExcluir(false)}>Cancelar</Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-danger"
                onClick={() => setConfirmarExcluir(true)}
              >
                <Trash2 className="size-3.5" /> Excluir
              </Button>

              <div className="ml-auto flex flex-wrap gap-2">
                <Button variant="neutral" size="sm" onClick={onClose}>Fechar</Button>
                <Button variant="neutral" size="sm" disabled={busy} onClick={() => salvar()}>
                  Salvar alterações
                </Button>
                {registro.pendente ? (
                  <Button
                    size="sm"
                    disabled={busy}
                    onClick={() => salvar({ dataRetorno: new Date().toISOString() })}
                    className="gap-1.5 bg-success text-white hover:brightness-95"
                  >
                    <PackageCheck className="size-3.5" /> Registrar retorno
                  </Button>
                ) : (
                  <Button size="sm" variant="neutral" disabled={busy} onClick={reverterRetorno} className="gap-1.5">
                    <RotateCcw className="size-3.5" /> Reabrir (voltar p/ pendentes)
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
