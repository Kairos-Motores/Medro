import { useMemo, useState } from "react";
import { Plus, Trash2, Eye, EyeOff, Sparkles, Loader2, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LaudoPage } from "./layout";
import type { LaudoState, DiagKey, MechKey } from "./state";
import { DIAG_ITEMS } from "./state";
import type { PatchFn } from "./useLaudoDoc";
import { useFotosOs, useIaGerar, useIaGerarLote } from "./api";
import {
  EditorSection,
  FieldGrid,
  TextField,
  AreaField,
  SelectField,
  DateField,
  TriToggle,
  StatusToggle,
  DeferredNote,
  CheckboxField,
} from "./fields";

export interface EditorProps {
  page: LaudoPage;
  doc: LaudoState;
  patch: PatchFn;
}

/** campos do diagnóstico que têm botão de IA (mesmos do app original). */
const CAMPOS_IA = new Set<DiagKey>(["f2", "f4", "f5", "f6"]);

type Foto = { id: string; nome: string; url: string };

/** Seletor de foto do SharePoint (galeria por categoria da OS). */
function PhotoField({
  osData,
  value,
  onPick,
  onClear,
  label,
}: {
  osData: Record<string, unknown> | null;
  value?: { url?: string; nome?: string } | null;
  onPick: (f: Foto) => void;
  onClear: () => void;
  label?: string;
}) {
  const osId = (osData?.cr4a1_novacoluna as string) || null;
  const unidade = osData?.unidade_nome as string | undefined;
  const cliente = osData?.cr4a1_cliente_nome as string | undefined;
  const fotos = useFotosOs(osId, unidade, cliente);
  const [open, setOpen] = useState(false);

  const categorias = useMemo(
    () => Object.entries(fotos.data ?? {}).filter(([, arr]) => arr.length > 0),
    [fotos.data],
  );

  return (
    <div className="space-y-1">
      {label && <span className="block text-[12px] font-medium text-foreground-secondary">{label}</span>}
      <div className="flex items-center gap-2">
        {value?.url ? (
          <div className="relative">
            <img
              src={value.url}
              alt={value.nome ?? ""}
              className="size-14 rounded-md border border-border object-cover"
            />
            <button
              type="button"
              onClick={onClear}
              className="absolute -right-1.5 -top-1.5 rounded-full bg-danger p-0.5 text-white"
              title="Remover foto"
            >
              <X className="size-3" />
            </button>
          </div>
        ) : (
          <div className="flex size-14 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
            <ImagePlus className="size-4" />
          </div>
        )}
        <Button variant="neutral" size="sm" onClick={() => setOpen((o) => !o)} disabled={!osId}>
          {open ? "Fechar" : "Escolher do SharePoint"}
        </Button>
      </div>

      {open && (
        <div className="mt-1 rounded-md border border-border bg-surface-2 p-2">
          {fotos.isLoading ? (
            <p className="text-[12px] text-muted-foreground">Carregando fotos da OS…</p>
          ) : categorias.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">
              Nenhuma foto encontrada no SharePoint para esta OS.
            </p>
          ) : (
            <div className="space-y-2">
              {categorias.map(([cat, arr]) => (
                <div key={cat}>
                  <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {cat} · {arr.length}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {arr.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          onPick(f);
                          setOpen(false);
                        }}
                        className="size-12 overflow-hidden rounded border border-border hover:ring-2 hover:ring-primary/40"
                        title={f.nome}
                      >
                        <img src={f.url} alt={f.nome} className="size-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────── Capa ────────────────────────── */

function CoverEditor({ doc, patch }: EditorProps) {
  const mc = doc.modelConfig;
  return (
    <EditorSection title="Design da capa" subtitle="Aparência da primeira página do laudo.">
      <FieldGrid cols={1}>
        <SelectField
          label="Capa"
          value={mc.capaAtiva || "padrao"}
          onChange={(v) => patch((d) => void (d.modelConfig.capaAtiva = v))}
          options={[
            { value: "padrao", label: "Capa escura padrão" },
            { value: "cliente_azul", label: "Capa alternativa (clara)" },
            { value: "custom", label: "Capa customizada (upload)" },
          ]}
        />
      </FieldGrid>
      {mc.capaAtiva === "custom" && (
        <>
          <TextField
            label="URL da capa customizada"
            value={mc.customCoverUrl ?? ""}
            onChange={(v) => patch((d) => void (d.modelConfig.customCoverUrl = v || null))}
            placeholder="https://…"
          />
          <DeferredNote>
            O upload de capa (<code>/api/upload-capa</code>) entra numa fase posterior. Por ora,
            cole a URL de uma imagem já hospedada.
          </DeferredNote>
        </>
      )}
    </EditorSection>
  );
}

/* ──────────────────────── Sumário ──────────────────────── */

function SummaryEditor({ doc, patch }: EditorProps) {
  const items = doc.modelConfig.layout
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => p.id !== "cover" && p.id !== "back_cover");
  return (
    <EditorSection
      title="Títulos das páginas"
      subtitle="O sumário é gerado automaticamente; ajuste aqui o texto de cada entrada."
    >
      <div className="space-y-2">
        {items.map(({ p, i }) => (
          <div key={p.id} className="flex items-center gap-2">
            <span className="w-6 shrink-0 text-right text-[11px] text-muted-foreground">{i + 1}</span>
            <Input
              value={p.title}
              onChange={(e) => patch((d) => void (d.modelConfig.layout[i]!.title = e.target.value))}
            />
          </div>
        ))}
      </div>
    </EditorSection>
  );
}

/* ─────────────────── Dados do processo (osData) ─────────────────── */

const CLIENTE_FIELDS: [string, string][] = [
  ["cr4a1_cliente_nome", "Cliente"],
  ["cr4a1_cliente_area", "Área"],
  ["cr4a1_cliente_pedido", "Nº pedido"],
  ["cr4a1_cliente_om", "OM cliente"],
  ["cr4a1_cliente_ni", "NI"],
  ["cr4a1_cliente_mo", "ME"],
  ["cr4a1_cliente_mo2", "MO"],
  ["cr4a1_tag_cliente", "TAG cliente"],
  ["cr4a1_nf_remessa", "NF remessa"],
  ["cr4a1_data_rec", "Recebimento"],
  ["cr4a1_contato_cli", "Contato"],
  ["cr4a1_resp_tecnico", "Resp. técnico"],
  ["cr4a1_elab_relat", "Elaborador"],
  ["cr4a1_data_relat", "Data relatório"],
];

const EQUIP_FIELDS: [string, string][] = [
  ["cr4a1_tag_kairos", "TAG Kairós"],
  ["cr4a1_eq_descricao", "Descrição"],
  ["cr4a1_eq_fabricante", "Fabricante"],
  ["cr4a1_eq_modelo", "Modelo"],
  ["cr4a1_eq_carcaca", "Carcaça"],
  ["cr4a1_eq_potencia_cv", "Potência"],
  ["cr4a1_eq_tensao", "Tensão"],
  ["cr4a1_eq_corrente", "Corrente"],
  ["cr4a1_eq_rpm", "RPM"],
  ["cr4a1_eq_serie", "Nº série"],
  ["cr4a1_eq_polaridade", "Polaridade"],
  ["cr4a1_eq_freq", "Frequência"],
  ["cr4a1_eq_fc", "FC"],
  ["cr4a1_eq_isol", "Classe isol."],
  ["cr4a1_eq_regime", "Regime"],
  ["cr4a1_eq_categoria", "Categoria"],
  ["cr4a1_eq_ip", "IP"],
  ["cr4a1_eq_peso", "Peso"],
];

const DATE_FIELDS = new Set(["cr4a1_data_rec", "cr4a1_data_relat"]);

function ProcessDataEditor({ doc, patch }: EditorProps) {
  const os = (doc.osData ?? {}) as Record<string, unknown>;
  const set = (field: string) => (v: string) =>
    patch((d) => {
      d.osData = { ...((d.osData as Record<string, unknown>) ?? {}), [field]: v };
    });
  const val = (field: string) => (os[field] == null ? "" : String(os[field]));
  const renderField = ([f, label]: [string, string]) =>
    DATE_FIELDS.has(f) ? (
      <DateField key={f} label={label} value={val(f)} onChange={set(f)} />
    ) : (
      <TextField key={f} label={label} value={val(f)} onChange={set(f)} />
    );
  return (
    <>
      <EditorSection
        title="Dados do cliente"
        subtitle="Vêm do Dataverse; ajustes aqui valem só para este laudo."
      >
        <FieldGrid>{CLIENTE_FIELDS.map(renderField)}</FieldGrid>
      </EditorSection>
      <EditorSection title="Dados do equipamento">
        <FieldGrid>{EQUIP_FIELDS.map(renderField)}</FieldGrid>
      </EditorSection>
    </>
  );
}

/* ────────────────── Diagnóstico e histórico ────────────────── */

function DiagnosisEditor({ doc, patch }: EditorProps) {
  const modeloId = doc.activeTemplateId;
  const [resumo, setResumo] = useState("");
  const gerar = useIaGerar();
  const gerarLote = useIaGerarLote();
  const [erroIa, setErroIa] = useState<string | null>(null);
  const [campoGerando, setCampoGerando] = useState<DiagKey | null>(null);

  async function gerarLoteIA() {
    if (!modeloId || !resumo.trim()) return;
    setErroIa(null);
    try {
      const r = await gerarLote.mutateAsync({
        modeloId,
        resumo,
        campos: DIAG_ITEMS.filter((i) => CAMPOS_IA.has(i.key)).map((i) => ({
          key: i.key,
          label: i.label,
        })),
      });
      patch((d) => {
        for (const [k, v] of Object.entries(r.campos)) d.diagValues[k as DiagKey] = v;
      });
    } catch (e) {
      setErroIa(e instanceof Error ? e.message : "Falha ao gerar com IA.");
    }
  }

  async function gerarCampoIA(key: DiagKey, label: string) {
    if (!modeloId || !resumo.trim()) return;
    setErroIa(null);
    setCampoGerando(key);
    try {
      const r = await gerar.mutateAsync({ modeloId, resumo, campoLabel: label });
      patch((d) => void (d.diagValues[key] = r.texto));
    } catch (e) {
      setErroIa(e instanceof Error ? e.message : "Falha ao gerar com IA.");
    } finally {
      setCampoGerando(null);
    }
  }

  return (
    <>
      <EditorSection
        title="Diagnóstico técnico"
        subtitle="Textos livres por item. Use o olho para ocultar um item no laudo."
      >
        <div className="rounded-lg border border-border bg-surface-2 p-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-foreground-secondary">
            <Sparkles className="size-3.5" /> Gerar com IA
          </p>
          {!modeloId ? (
            <p className="text-[12px] text-muted-foreground">
              Selecione um <strong>Modelo</strong> (na barra do topo) com IA configurada para habilitar
              a geração.
            </p>
          ) : (
            <>
              <AreaField
                label="Resumo do problema (contexto para a IA)"
                rows={3}
                value={resumo}
                onChange={setResumo}
                placeholder="Ex.: motor parou por sobreaquecimento; enrolamento com cheiro de queimado; medições de isolação baixas…"
              />
              <div className="mt-2">
                <Button
                  size="sm"
                  onClick={gerarLoteIA}
                  disabled={!resumo.trim() || gerarLote.isPending}
                >
                  {gerarLote.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  Gerar diagnóstico completo
                </Button>
              </div>
            </>
          )}
          {erroIa && <p className="mt-2 text-[12px] text-danger">{erroIa}</p>}
        </div>

        <div className="space-y-4">
          {DIAG_ITEMS.map((item) => {
            const visible = doc.diagVisibility[item.key] !== false;
            const podeIa = !!modeloId && CAMPOS_IA.has(item.key);
            return (
              <div key={item.key}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-[12px] font-medium text-foreground-secondary">
                    {item.id} {item.label}
                  </span>
                  <div className="flex items-center gap-1">
                    {podeIa && (
                      <button
                        type="button"
                        onClick={() => gerarCampoIA(item.key, item.label)}
                        disabled={!resumo.trim() || campoGerando === item.key}
                        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-primary hover:bg-primary/10 disabled:opacity-40"
                        title={
                          resumo.trim()
                            ? "Gerar só este campo com IA"
                            : "Preencha o resumo do problema acima"
                        }
                      >
                        {campoGerando === item.key ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Sparkles className="size-3" />
                        )}
                        IA
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => patch((d) => void (d.diagVisibility[item.key] = !visible))}
                      className={cn(
                        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px]",
                        visible
                          ? "text-muted-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                          : "bg-danger/10 text-danger",
                      )}
                      title={visible ? "Ocultar do laudo" : "Mostrar no laudo"}
                    >
                      {visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                      {visible ? "Visível" : "Oculto"}
                    </button>
                  </div>
                </div>
                <AreaField
                  label=""
                  rows={item.key === "f5" || item.key === "f6" ? 5 : 3}
                  value={doc.diagValues[item.key as DiagKey] ?? ""}
                  onChange={(v) => patch((d) => void (d.diagValues[item.key] = v))}
                />
              </div>
            );
          })}
        </div>
      </EditorSection>

      <EditorSection title="Histórico de manutenção" subtitle="Somente leitura — vem da TAG da OS.">
        {doc.historyData.length === 0 ? (
          <p className="text-[12px] text-muted-foreground">Sem histórico para a TAG desta OS.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-surface-2 text-muted-foreground">
                  <th className="px-3 py-1.5 text-left font-medium">Ano</th>
                  <th className="px-3 py-1.5 text-right font-medium">Rebob.</th>
                  <th className="px-3 py-1.5 text-right font-medium">Rejuv.</th>
                  <th className="px-3 py-1.5 text-right font-medium">Outros</th>
                </tr>
              </thead>
              <tbody>
                {doc.historyData.map((h) => (
                  <tr key={h.ano} className="border-t border-border">
                    <td className="px-3 py-1.5">{h.ano}</td>
                    <td className="px-3 py-1.5 text-right">{h.REBOBINAMENTO}</td>
                    <td className="px-3 py-1.5 text-right">{h.REJUVENESCIMENTO}</td>
                    <td className="px-3 py-1.5 text-right">{h.OUTROS}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </EditorSection>
    </>
  );
}

/* ────────────── Relatório fotográfico (motorSections) ────────────── */

function slotFoto(slot: unknown): { url?: string; nome?: string } | null {
  if (!slot) return null;
  const s = Array.isArray(slot) ? slot[0] : slot;
  return s && typeof s === "object" ? (s as { url?: string; nome?: string }) : null;
}

function PhotoReportEditor({ page, doc, patch }: EditorProps) {
  const keys = page.keys?.length ? page.keys : [`${page.id}_b1`, `${page.id}_b2`];
  const osData = (doc.osData ?? null) as Record<string, unknown> | null;
  return (
    <>
      {keys.map((key, bi) => {
        const block = doc.motorSections[key] ?? {
          evidences: ["", "", ""],
          services: ["", "", ""],
          photoNames: ["", "", ""],
        };
        const ensure = (d: LaudoState) => {
          d.motorSections[key] ??= {
            evidences: ["", "", ""],
            services: ["", "", ""],
            photoNames: ["", "", ""],
          };
          const b = d.motorSections[key]!;
          b.evidences ??= ["", "", ""];
          b.services ??= ["", "", ""];
          b.photoNames ??= ["", "", ""];
          b.photos ??= [null, null, null];
          return b;
        };
        return (
          <EditorSection
            key={key}
            title={`Bloco ${bi + 1}`}
            subtitle="Três fotos por bloco, com evidências e serviços."
          >
            <TextField
              label="Título do bloco"
              value={block.title ?? ""}
              onChange={(v) => patch((d) => void (ensure(d).title = v))}
              placeholder="RELATÓRIO FOTOGRÁFICO"
            />
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-lg border border-border p-3">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Foto {i + 1}
                  </p>
                  <FieldGrid cols={1}>
                    <PhotoField
                      osData={osData}
                      value={slotFoto(block.photos?.[i])}
                      onPick={(f) => patch((d) => void (ensure(d).photos![i] = [f]))}
                      onClear={() => patch((d) => void (ensure(d).photos![i] = null))}
                    />
                    <TextField
                      label="Nome da foto"
                      value={block.photoNames?.[i] ?? ""}
                      onChange={(v) => patch((d) => void (ensure(d).photoNames![i] = v))}
                    />
                    <AreaField
                      label="Evidência"
                      rows={2}
                      value={block.evidences?.[i] ?? ""}
                      onChange={(v) => patch((d) => void (ensure(d).evidences[i] = v))}
                    />
                    <AreaField
                      label="Serviço a executar"
                      rows={2}
                      value={block.services?.[i] ?? ""}
                      onChange={(v) => patch((d) => void (ensure(d).services[i] = v))}
                    />
                  </FieldGrid>
                </div>
              ))}
            </div>
          </EditorSection>
        );
      })}
    </>
  );
}

/* ─────────────── Avaliação mecânica / mancais (mechData) ─────────────── */

function MechCellFields({
  doc,
  patch,
  mkey,
  title,
}: {
  doc: LaudoState;
  patch: PatchFn;
  mkey: MechKey;
  title: string;
}) {
  const c = doc.mechData[mkey];
  const osData = (doc.osData ?? null) as Record<string, unknown> | null;
  const set = (f: keyof typeof c) => (v: string) =>
    patch((d) => void ((d.mechData[mkey] as unknown as Record<string, unknown>)[f as string] = v));
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="mb-2 text-[12px] font-semibold text-foreground">{title}</p>
      <FieldGrid cols={2}>
        <TextField label="Ø (mm)" value={c.phi} onChange={set("phi")} />
        <TextField label="Interferência" value={c.interf} onChange={set("interf")} />
        <TextField label="Tolerância" value={c.toler} onChange={set("toler")} />
        <TextField label="Excedente" value={c.exced} onChange={set("exced")} />
      </FieldGrid>
      <div className="mt-3 space-y-3">
        <TriToggle
          label="Aprovado"
          value={c.approvedX}
          onChange={(v) => patch((d) => void (d.mechData[mkey].approvedX = v))}
        />
        <PhotoField
          label="Foto de evidência"
          osData={osData}
          value={c.photo}
          onPick={(f) => patch((d) => void (d.mechData[mkey].photo = f))}
          onClear={() => patch((d) => void (d.mechData[mkey].photo = null))}
        />
      </div>
    </div>
  );
}

function MechanicalEditor({ doc, patch }: EditorProps) {
  return (
    <EditorSection title="Avaliação do eixo" subtitle="NBR-5432/2008.">
      <div className="grid gap-3 sm:grid-cols-2">
        <MechCellFields doc={doc} patch={patch} mkey="batimento_la" title="Batimento ponta do eixo LA" />
        <MechCellFields doc={doc} patch={patch} mkey="batimento_loa" title="Batimento ponta do eixo LOA" />
        <MechCellFields doc={doc} patch={patch} mkey="ponta_la" title="Ponta do eixo LA" />
        <MechCellFields doc={doc} patch={patch} mkey="ponta_loa" title="Ponta do eixo LOA" />
      </div>
    </EditorSection>
  );
}

function BearingEditor({ doc, patch }: EditorProps) {
  return (
    <EditorSection title="Avaliação de mancais">
      <div className="grid gap-3 sm:grid-cols-2">
        <MechCellFields doc={doc} patch={patch} mkey="assento_la" title="Assento do rolamento LA" />
        <MechCellFields doc={doc} patch={patch} mkey="assento_loa" title="Assento do rolamento LOA" />
        <MechCellFields doc={doc} patch={patch} mkey="cubo_la" title="Cubo da tampa LA" />
        <MechCellFields doc={doc} patch={patch} mkey="cubo_loa" title="Cubo da tampa LOA" />
      </div>
    </EditorSection>
  );
}

/* ─────────────── Componentes auxiliares (p11Data) ─────────────── */

function ComponentsEditor({ doc, patch }: EditorProps) {
  const p = doc.p11Data;
  return (
    <>
      <EditorSection
        title="Instrumentos utilizados"
        right={
          <Button
            variant="neutral"
            size="sm"
            onClick={() =>
              patch((d) => void d.p11Data.instruments.push({ name: "", nr: "", date: "" }))
            }
          >
            <Plus className="size-3.5" /> Linha
          </Button>
        }
      >
        <div className="space-y-2">
          {p.instruments.map((inst, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto] items-end gap-2">
              <FieldGrid cols={3}>
                <TextField
                  label="Instrumento"
                  value={inst.name}
                  onChange={(v) => patch((d) => void (d.p11Data.instruments[i]!.name = v))}
                />
                <TextField
                  label="Nº"
                  value={inst.nr}
                  onChange={(v) => patch((d) => void (d.p11Data.instruments[i]!.nr = v))}
                />
                <TextField
                  label="Calibração"
                  value={inst.date}
                  onChange={(v) => patch((d) => void (d.p11Data.instruments[i]!.date = v))}
                />
              </FieldGrid>
              <button
                type="button"
                className="mb-1 rounded p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                onClick={() => patch((d) => void d.p11Data.instruments.splice(i, 1))}
                title="Remover"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </EditorSection>

      <EditorSection title="Rolamentos">
        <AreaField
          label="Descrição"
          rows={2}
          value={p.rolamentos.desc}
          onChange={(v) => patch((d) => void (d.p11Data.rolamentos.desc = v))}
        />
        <FieldGrid>
          <TextField
            label="Quantidade"
            value={p.rolamentos.qty}
            onChange={(v) => patch((d) => void (d.p11Data.rolamentos.qty = v))}
          />
          <TriToggle
            label="Substituir?"
            value={p.rolamentos.replace}
            onChange={(v) => patch((d) => void (d.p11Data.rolamentos.replace = v))}
          />
        </FieldGrid>
      </EditorSection>

      <EditorSection title="Vedação dos mancais e carcaça">
        <AreaField
          label="Descrição"
          rows={2}
          value={p.vedacao.desc}
          onChange={(v) => patch((d) => void (d.p11Data.vedacao.desc = v))}
        />
        <TriToggle
          label="Substituir?"
          value={p.vedacao.replace}
          onChange={(v) => patch((d) => void (d.p11Data.vedacao.replace = v))}
        />
      </EditorSection>

      <EditorSection title="Componentes auxiliares adicionais">
        <AreaField
          label="Descrição"
          rows={2}
          value={p.auxiliar.desc}
          onChange={(v) => patch((d) => void (d.p11Data.auxiliar.desc = v))}
        />
        <FieldGrid>
          <TextField
            label="Quantidade"
            value={p.auxiliar.qty}
            onChange={(v) => patch((d) => void (d.p11Data.auxiliar.qty = v))}
          />
          <TriToggle
            label="Substituir?"
            value={p.auxiliar.replace}
            onChange={(v) => patch((d) => void (d.p11Data.auxiliar.replace = v))}
          />
        </FieldGrid>
      </EditorSection>
    </>
  );
}

/* ─────────────── Ensaios de resistência (resistanceData) ─────────────── */

function ResistanceEditor({ doc, patch }: EditorProps) {
  const r = doc.resistanceData;
  const set = (f: keyof typeof r) => (v: string) =>
    patch((d) => void ((d.resistanceData as unknown as Record<string, string>)[f as string] = v));
  return (
    <>
      <EditorSection title="Resistência de isolação" subtitle="IEEE-43-2013 · 0,5 kV">
        <FieldGrid cols={3}>
          <TextField label="30 s (MΩ)" value={r.medicao30s} onChange={set("medicao30s")} />
          <TextField label="1 min (MΩ)" value={r.medicao1m} onChange={set("medicao1m")} />
          <TextField label="10 min (MΩ)" value={r.medicao10m} onChange={set("medicao10m")} />
          <TextField label="IA" value={r.ia} onChange={set("ia")} />
          <TextField label="IP" value={r.ip} onChange={set("ip")} />
        </FieldGrid>
        <StatusToggle
          label="Status isolação"
          value={r.statusIsolacao}
          onChange={(v) => patch((d) => void (d.resistanceData.statusIsolacao = v))}
        />
      </EditorSection>

      <EditorSection title="Resistência ôhmica do enrolamento" subtitle="NBR 5383 / IEC 60034-1">
        <FieldGrid cols={3}>
          <TextField label="Qtd. de cabos" value={r.qtdCabos} onChange={set("qtdCabos")} />
          <TextField label="Fase R-S (Ω)" value={r.faseRS} onChange={set("faseRS")} />
          <TextField label="Fase R-T (Ω)" value={r.faseRT} onChange={set("faseRT")} />
          <TextField label="Fase S-T (Ω)" value={r.faseST} onChange={set("faseST")} />
          <TextField label="Variação Δ%" value={r.variacaoDelta} onChange={set("variacaoDelta")} />
        </FieldGrid>
        <StatusToggle
          label="Status ôhmica"
          value={r.statusOhmica}
          onChange={(v) => patch((d) => void (d.resistanceData.statusOhmica = v))}
        />
      </EditorSection>
    </>
  );
}

/* ─────────────── Referências normativas (normativeData) ─────────────── */

function NormativeEditor({ doc, patch }: EditorProps) {
  const n = doc.normativeData;
  const set = (f: keyof typeof n) => (v: string) =>
    patch((d) => void ((d.normativeData as unknown as Record<string, string>)[f as string] = v));
  const num = (s: string) => parseFloat(s) || 0;
  const ia = num(n.ia_30s) > 0 ? num(n.ia_60s) / num(n.ia_30s) : 0;
  const ip = num(n.ip_1m) > 0 ? num(n.ip_10m) / num(n.ip_1m) : 0;
  return (
    <>
      <EditorSection
        title="Índice de Absorção (IA)"
        right={ia > 0 ? <Badge>IA = {ia.toFixed(2)}</Badge> : undefined}
      >
        <FieldGrid>
          <TextField label="R30s (MΩ)" type="number" value={n.ia_30s} onChange={set("ia_30s")} />
          <TextField label="R1m / R60s (MΩ)" type="number" value={n.ia_60s} onChange={set("ia_60s")} />
        </FieldGrid>
      </EditorSection>
      <EditorSection
        title="Índice de Polarização (IP)"
        right={ip > 0 ? <Badge>IP = {ip.toFixed(2)}</Badge> : undefined}
      >
        <FieldGrid>
          <TextField label="R1m (MΩ)" type="number" value={n.ip_1m} onChange={set("ip_1m")} />
          <TextField label="R10m (MΩ)" type="number" value={n.ip_10m} onChange={set("ip_10m")} />
        </FieldGrid>
      </EditorSection>
      <EditorSection title="Tendência de isolamento">
        <FieldGrid cols={3}>
          <TextField label="R30s (MΩ)" type="number" value={n.res_30s} onChange={set("res_30s")} />
          <TextField label="R1m (MΩ)" type="number" value={n.res_1m} onChange={set("res_1m")} />
          <TextField label="R10m (MΩ)" type="number" value={n.res_10m} onChange={set("res_10m")} />
        </FieldGrid>
      </EditorSection>
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[12px] font-semibold text-primary">
      {children}
    </span>
  );
}

/* ─────────────── Tabela livre customizada ─────────────── */

function CustomTableEditor({ page, doc, patch }: EditorProps) {
  const id = page.id;
  const pageData = doc.customTableRows[id] ?? { title: "", rows: [["", ""]] };
  const headers = doc.tableHeaders[id] ?? ["Coluna 1", "Coluna 2"];
  const cols = headers.length || 2;
  const hasSub = doc.tableSubColumns[id] !== false;

  const ensure = (d: LaudoState) => {
    d.customTableRows[id] ??= { title: "", rows: [["", ""]] };
    d.customTableRows[id]!.rows ??= [["", ""]];
    d.tableHeaders[id] ??= ["Coluna 1", "Coluna 2"];
    return d;
  };

  return (
    <EditorSection title="Tabela livre" subtitle="Título, cabeçalhos e linhas da tabela personalizada.">
      <TextField
        label="Título da tabela"
        value={pageData.title ?? ""}
        onChange={(v) => patch((d) => void (ensure(d).customTableRows[id]!.title = v))}
      />
      <FieldGrid>
        {headers.map((h, ci) => (
          <TextField
            key={ci}
            label={`Cabeçalho ${ci + 1}`}
            value={h}
            onChange={(v) => patch((d) => void (ensure(d).tableHeaders[id]![ci] = v))}
          />
        ))}
      </FieldGrid>

      <CheckboxField
        label="Usar subcolunas"
        checked={hasSub}
        onCheckedChange={(v) => patch((d) => void (d.tableSubColumns[id] = v))}
      />

      <div className="space-y-2">
        {pageData.rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-[1fr_auto] items-center gap-2">
            <div className={cn("grid gap-2", cols === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3")}>
              {Array.from({ length: cols }).map((_, ci) => (
                <Input
                  key={ci}
                  value={row[ci] ?? ""}
                  placeholder={headers[ci]}
                  onChange={(e) =>
                    patch((d) => {
                      ensure(d);
                      d.customTableRows[id]!.rows[ri] ??= [];
                      d.customTableRows[id]!.rows[ri]![ci] = e.target.value;
                    })
                  }
                />
              ))}
            </div>
            <button
              type="button"
              className="rounded p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger"
              onClick={() => patch((d) => void (ensure(d).customTableRows[id]!.rows.splice(ri, 1)))}
              title="Remover linha"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
      <Button
        variant="neutral"
        size="sm"
        onClick={() =>
          patch((d) => void ensure(d).customTableRows[id]!.rows.push(Array(cols).fill("")))
        }
      >
        <Plus className="size-3.5" /> Linha
      </Button>

      {doc.tableColumns[id] != null && (
        <DeferredNote>
          Esta tabela usa layout avançado de colunas/subcolunas configurado no app antigo. As linhas
          continuam editáveis aqui; a estrutura de colunas é preservada.
        </DeferredNote>
      )}
    </EditorSection>
  );
}

/* ─────────────── Balanceamento dinâmico (balanceData) ─────────────── */

const BAL_GROUPS: { grupo: string; campos: [string, string][] }[] = [
  {
    grupo: "Dados",
    campos: [
      ["Raio1", "Raio 1 (mm)"],
      ["Raio2", "Raio 2 (mm)"],
      ["PesoRotor", "Peso (kg)"],
      ["RPMTrabalho", "RPM trabalho"],
      ["RPMBalanceamento", "RPM balanc."],
    ],
  },
  {
    grupo: "Gramas",
    campos: [
      ["Inicial1", "Inicial P1 (g)"],
      ["Ideal1", "Limite P1 (g)"],
      ["Final1", "Final P1 (g)"],
      ["Inicial2", "Inicial P2 (g)"],
      ["Ideal2", "Limite P2 (g)"],
      ["Final2", "Final P2 (g)"],
    ],
  },
  {
    grupo: "ISOG",
    campos: [
      ["Inicial1", "Inicial P1 (mm/s)"],
      ["Ideal1", "Limite P1 (mm/s)"],
      ["Final1", "Final P1 (mm/s)"],
      ["Inicial2", "Inicial P2 (mm/s)"],
      ["Ideal2", "Limite P2 (mm/s)"],
      ["Final2", "Final P2 (mm/s)"],
    ],
  },
];

function BalanceamentoEditor({ doc, patch }: EditorProps) {
  const bd = doc.balanceData;
  return (
    <EditorSection
      title="Balanceamento dinâmico"
      subtitle="Importado do balanceamento da OS; edite se precisar corrigir."
    >
      {!bd && (
        <DeferredNote>
          Nenhum dado de balanceamento encontrado para esta OS. Se existir, será importado
          automaticamente ao carregar.
        </DeferredNote>
      )}
      {BAL_GROUPS.map(({ grupo, campos }) => (
        <div key={grupo}>
          <p className="mb-2 text-[12px] font-semibold text-foreground">{grupo}</p>
          <FieldGrid cols={3}>
            {campos.map(([f, label]) => (
              <TextField
                key={f}
                label={label}
                value={bd?.[grupo]?.[f] ?? ""}
                onChange={(v) =>
                  patch((d) => {
                    d.balanceData ??= {};
                    d.balanceData[grupo] ??= {};
                    d.balanceData[grupo]![f] = v;
                  })
                }
              />
            ))}
          </FieldGrid>
        </div>
      ))}
    </EditorSection>
  );
}

/* ─────────────── Texto / imagem / página livre ─────────────── */

function TextBlockEditor({ page, doc, patch }: EditorProps) {
  const b = doc.textBlocks[page.id] ?? { title: "", content: "" };
  return (
    <EditorSection title="Texto fixo">
      <TextField
        label="Título"
        value={b.title}
        onChange={(v) =>
          patch((d) => {
            d.textBlocks[page.id] = { ...(d.textBlocks[page.id] ?? { title: "", content: "" }), title: v };
          })
        }
      />
      <AreaField
        label="Conteúdo"
        rows={8}
        value={b.content}
        onChange={(v) =>
          patch((d) => {
            d.textBlocks[page.id] = { ...(d.textBlocks[page.id] ?? { title: "", content: "" }), content: v };
          })
        }
      />
    </EditorSection>
  );
}

function ImageBlockEditor({ page, doc, patch }: EditorProps) {
  return (
    <EditorSection title="Imagem fixa">
      <TextField
        label="URL da imagem"
        value={doc.imageBlocks[page.id] ?? ""}
        onChange={(v) => patch((d) => void (d.imageBlocks[page.id] = v))}
        placeholder="https://…"
      />
      <DeferredNote>Upload direto de imagem entra numa fase posterior — cole a URL por ora.</DeferredNote>
      {doc.imageBlocks[page.id] && (
        <img
          src={doc.imageBlocks[page.id]}
          alt=""
          className="max-h-48 rounded-md border border-border object-contain"
        />
      )}
    </EditorSection>
  );
}

function FreePageEditor({ page, doc, patch }: EditorProps) {
  const blocks = doc.freePageBlocks[page.id] ?? [];
  return (
    <EditorSection
      title="Página livre"
      subtitle="Blocos de texto editáveis aqui; blocos de imagem/tabela no app antigo."
      right={
        <Button
          variant="neutral"
          size="sm"
          onClick={() =>
            patch((d) => {
              d.freePageBlocks[page.id] ??= [];
              d.freePageBlocks[page.id]!.push({ id: Date.now(), type: "text", data: { title: "", content: "" } });
            })
          }
        >
          <Plus className="size-3.5" /> Texto
        </Button>
      }
    >
      {blocks.length === 0 && (
        <p className="text-[12px] text-muted-foreground">Nenhum bloco nesta página.</p>
      )}
      <div className="space-y-3">
        {blocks.map((blk, i) => (
          <div key={String(blk.id)} className="rounded-lg border border-border p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {blk.type}
              </span>
              <button
                type="button"
                className="rounded p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                onClick={() => patch((d) => void d.freePageBlocks[page.id]!.splice(i, 1))}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
            {blk.type === "text" ? (
              <>
                <TextField
                  label="Título"
                  value={String(blk.data.title ?? "")}
                  onChange={(v) => patch((d) => void (d.freePageBlocks[page.id]![i]!.data.title = v))}
                />
                <div className="mt-2">
                  <AreaField
                    label="Conteúdo"
                    rows={5}
                    value={String(blk.data.content ?? "")}
                    onChange={(v) => patch((d) => void (d.freePageBlocks[page.id]![i]!.data.content = v))}
                  />
                </div>
              </>
            ) : (
              <DeferredNote>Bloco “{blk.type}” — edite no app antigo por enquanto.</DeferredNote>
            )}
          </div>
        ))}
      </div>
    </EditorSection>
  );
}

/* ─────────────── Páginas sem campos ─────────────── */

function StaticInfoEditor({ page }: EditorProps) {
  const desc: Record<string, string> = {
    PageBackCover: "Contracapa institucional — imagem fixa.",
    PageOurServices: "Página “Nossos Serviços” — imagem fixa.",
    PageFinal: "Encerramento com endereços das unidades — conteúdo fixo.",
    PageStaticTestsDescription: "Descrição normativa dos ensaios estáticos — texto fixo (IEEE 43-2013).",
  };
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface p-6 text-center text-[13px] text-muted-foreground">
      Esta página não tem campos editáveis.
      <div className="mt-1 text-[12px]">{desc[page.type] ?? "Conteúdo fixo do laudo."}</div>
    </div>
  );
}

/* ─────────────── Dispatcher ─────────────── */

const EDITORS: Record<string, (p: EditorProps) => JSX.Element> = {
  PageCover: CoverEditor,
  PageSummary: SummaryEditor,
  PageProcessData: ProcessDataEditor,
  PageDiagnosisAndHistory: DiagnosisEditor,
  PageMotorElectric: PhotoReportEditor,
  PageMechanicalEvaluation: MechanicalEditor,
  PageBearingEvaluation: BearingEditor,
  PageComponentsEvaluation: ComponentsEditor,
  PageResistanceTests: ResistanceEditor,
  PageNormativeReferences: NormativeEditor,
  PageCustomTable: CustomTableEditor,
  PageBalanceamento: BalanceamentoEditor,
  PageEditableText: TextBlockEditor,
  PageImageBlock: ImageBlockEditor,
  PageBuilder: FreePageEditor,
};

export function renderEditor(props: EditorProps): JSX.Element {
  const Comp = EDITORS[props.page.type] ?? StaticInfoEditor;
  return <Comp {...props} />;
}
