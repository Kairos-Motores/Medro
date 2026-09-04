import { useState } from "react";
import { X, Users, AlertCircle, Building2, Calendar, Wrench, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { FILIAIS } from "@medro/shared";
import { useCreateTerceirizado, PECA_OPCOES, type CreateTerceirizadoInput } from "../api";

/** dd/MM/yyyy → ISO (meia-noite local). vazio → undefined. */
function brToIso(s: string): string | undefined {
  const m = s.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return undefined;
  const [, d, mo, y] = m;
  const dt = new Date(Number(y), Number(mo) - 1, Number(d));
  return Number.isNaN(dt.getTime()) ? undefined : dt.toISOString();
}

export function NovoRegistroModal({
  open,
  onClose,
  filialAtual,
}: {
  open: boolean;
  onClose: () => void;
  filialAtual: string;
}) {
  const { user } = useAuth();
  const criar = useCreateTerceirizado();

  const [titulo, setTitulo] = useState("");
  const [nOr, setNOr] = useState("");
  const [peca, setPeca] = useState("");
  const [situacao, setSituacao] = useState<"Emergencial" | "Normal">("Normal");
  const [empresa, setEmpresa] = useState("");
  const [carcaca, setCarcaca] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [unidade, setUnidade] = useState(
    filialAtual && filialAtual !== "Todas" ? filialAtual : user?.filial || "São Luís",
  );
  const [previsao, setPrevisao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [servicos, setServicos] = useState<string[]>([""]);
  const [erro, setErro] = useState<string | null>(null);

  if (!open) return null;

  const setServico = (i: number, v: string) =>
    setServicos((arr) => arr.map((s, idx) => (idx === i ? v : s)));

  async function salvar() {
    setErro(null);
    if (!titulo.trim()) {
      setErro("Informe o número da OS.");
      return;
    }
    const payload: CreateTerceirizadoInput = {
      titulo: titulo.trim().toUpperCase(),
      nOr: nOr.trim() || undefined,
      peca: peca || undefined,
      situacao,
      empresa: empresa.trim() || undefined,
      carcaca: carcaca.trim() || undefined,
      fabricante: fabricante.trim() || undefined,
      unidade,
      observacao: observacao.trim() || undefined,
      previsaoRetorno: brToIso(previsao),
      dataRegistro: new Date().toISOString(),
      servicos: servicos.map((s) => s.trim() || null).slice(0, 5),
    };
    try {
      await criar.mutateAsync(payload);
      onClose();
      // reset
      setTitulo(""); setNOr(""); setPeca(""); setSituacao("Normal"); setEmpresa("");
      setCarcaca(""); setFabricante(""); setPrevisao(""); setObservacao(""); setServicos([""]);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao salvar o registro.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-border bg-surface-2/50 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg border border-accent-indigo/30 bg-accent-indigo/15 text-accent-indigo">
              <Users className="size-4" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold">Novo registro de terceirizado</h2>
              <p className="text-[11px] text-muted-foreground">Peça enviada para serviço externo</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="size-8 p-0" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
          {erro && (
            <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 p-2.5 text-[12px] text-danger">
              <AlertCircle className="size-4 shrink-0" /> {erro}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Campo label="OS" obrigatorio>
              <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: 4821-AL" className="h-9 uppercase" />
            </Campo>
            <Campo label="Nº OR (fornecedor)">
              <Input value={nOr} onChange={(e) => setNOr(e.target.value)} placeholder="Ex.: OR-10233" className="h-9" />
            </Campo>
            <Campo label="Peça">
              <Select value={peca} onValueChange={setPeca} placeholder="Selecionar…" className="h-9">
                {PECA_OPCOES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </Select>
            </Campo>
            <Campo label="Situação">
              <div className="grid grid-cols-2 gap-2">
                {(["Normal", "Emergencial"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSituacao(s)}
                    className={`rounded-md border py-2 text-[12px] font-semibold transition-colors ${
                      situacao === s
                        ? s === "Emergencial"
                          ? "border-danger bg-danger/15 text-danger"
                          : "border-primary/50 bg-primary/15 text-primary"
                        : "border-border bg-surface-2 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Campo>
            <Campo label="Fornecedor / empresa">
              <Input
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Ex.: Torneadora Ágape"
                className="h-9"
              />
            </Campo>
            <Campo label={<span className="flex items-center gap-1"><Building2 className="size-3" /> Unidade</span>}>
              <Select value={unidade} onValueChange={setUnidade} className="h-9" aria-label="Unidade">
                {FILIAIS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </Select>
            </Campo>
            <Campo label="Carcaça">
              <Input value={carcaca} onChange={(e) => setCarcaca(e.target.value)} placeholder="Ex.: 355 M/L" className="h-9" />
            </Campo>
            <Campo label="Fabricante">
              <Input value={fabricante} onChange={(e) => setFabricante(e.target.value)} placeholder="Ex.: WEG" className="h-9" />
            </Campo>
            <Campo label={<span className="flex items-center gap-1"><Calendar className="size-3" /> Previsão de retorno</span>}>
              <Input value={previsao} onChange={(e) => setPrevisao(e.target.value)} placeholder="dd/mm/aaaa" className="h-9" />
            </Campo>
          </div>

          <Campo label={<span className="flex items-center gap-1"><Wrench className="size-3" /> Serviços a executar</span>}>
            <div className="space-y-2">
              {servicos.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={s}
                    onChange={(e) => setServico(i, e.target.value)}
                    placeholder={`Serviço ${i + 1}`}
                    className="h-9"
                  />
                  {servicos.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-9 shrink-0 p-0 text-danger"
                      onClick={() => setServicos((arr) => arr.filter((_, idx) => idx !== i))}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              ))}
              {servicos.length < 5 && (
                <Button
                  variant="neutral"
                  size="sm"
                  className="gap-1.5 text-[12px]"
                  onClick={() => setServicos((arr) => [...arr, ""])}
                >
                  <Plus className="size-3.5" /> Adicionar serviço
                </Button>
              )}
            </div>
          </Campo>

          <Campo label="Observação">
            <textarea
              rows={2}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full resize-none rounded-md border border-border bg-surface-2 p-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-accent-indigo"
            />
          </Campo>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-surface-2/40 px-5 py-3.5">
          <span className="text-[11px] text-muted-foreground">
            Registrado por <strong className="text-foreground">{user?.nome || "—"}</strong>
          </span>
          <div className="flex gap-2">
            <Button variant="neutral" size="sm" onClick={onClose}>Cancelar</Button>
            <Button
              size="sm"
              disabled={criar.isPending}
              onClick={salvar}
              className="gap-1.5 bg-accent-indigo text-white hover:brightness-95"
            >
              {criar.isPending ? "Salvando…" : "Salvar registro"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Campo({
  label,
  obrigatorio,
  children,
}: {
  label: React.ReactNode;
  obrigatorio?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-medium text-foreground-secondary">
        {label} {obrigatorio && <span className="text-danger">*</span>}
      </span>
      {children}
    </label>
  );
}
