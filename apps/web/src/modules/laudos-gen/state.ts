/**
 * Estado completo do rascunho do laudo — espelha 1:1 o objeto `state` que o
 * bundle de impressão (`apps/report-print/src/App.jsx`) lê e escreve em
 * `cr4a1_rascunhorelatorios.cr4a1_conteudojson`.
 *
 * Os editores do módulo (identidade Medro) manipulam este objeto; o
 * `report-print` — em `?print=true` — reidrata cada `setX(state.x)` a partir
 * das MESMAS chaves. Portanto: nome de chave aqui = contrato com o PDF.
 */
import { DEFAULT_LAYOUT, type LaudoPage } from "./layout";
import type { OsDados } from "./api";

export interface MotorBlock {
  evidences: string[];
  services: string[];
  photoNames?: string[];
  /** fotos já resolvidas (upload é fase posterior) — mantidas como estão */
  photos?: unknown[];
  title?: string;
}

export interface MechCell {
  phi: string;
  interf: string;
  toler: string;
  exced: string;
  /** "X" = SIM, "N" = NÃO, "" = não avaliado */
  approvedX: string;
  /** ref da foto no SharePoint — `<img src>` é montado a partir do id */
  photo: { id?: string; nome?: string; url?: string } | null;
}

export interface P11Instrument {
  name: string;
  nr: string;
  date: string;
}

export interface P11Data {
  instruments: P11Instrument[];
  rolamentos: { desc: string; qty: string; replace: string };
  vedacao: { desc: string; replace: string };
  auxiliar: { desc: string; qty: string; replace: string };
}

export interface ResistanceData {
  medicao30s: string;
  medicao1m: string;
  medicao10m: string;
  ia: string;
  ip: string;
  statusIsolacao: string;
  qtdCabos: string;
  faseRS: string;
  faseRT: string;
  faseST: string;
  variacaoDelta: string;
  statusOhmica: string;
}

export interface NormativeData {
  ia_30s: string;
  ia_60s: string;
  ip_1m: string;
  ip_10m: string;
  res_30s: string;
  res_1m: string;
  res_10m: string;
}

export interface ModelConfig {
  capaAtiva: string;
  customCoverUrl: string | null;
  layout: LaudoPage[];
}

export type BalanceData = Record<string, Record<string, string>> | null;

export interface LaudoState {
  /** dados achatados da OS — o PDF em print mode NÃO refaz o fetch, lê daqui */
  osData: OsDados | Record<string, unknown> | null;
  historyData: { ano: number; REBOBINAMENTO: number; REJUVENESCIMENTO: number; OUTROS: number }[];
  photos: Record<string, unknown>;
  balanceData: BalanceData;

  modelConfig: ModelConfig;
  customTableRows: Record<string, { title?: string; rows: string[][] }>;
  tableHeaders: Record<string, string[]>;
  tableColumns: Record<string, unknown>;
  tableSubColumns: Record<string, boolean>;
  textBlocks: Record<string, { title: string; content: string }>;
  imageBlocks: Record<string, string>;
  freePageBlocks: Record<string, { id: number | string; type: string; data: Record<string, unknown> }[]>;

  diagValues: Record<DiagKey, string>;
  motorSections: Record<string, MotorBlock>;
  mechData: Record<MechKey, MechCell>;
  p11Data: P11Data;
  resistanceData: ResistanceData;
  normativeData: NormativeData;

  diagVisibility: Record<DiagKey, boolean>;
  peritagemAutoImported: boolean;
  activeTemplateId: string | null;

  /** marca d'água: rascunho tocado pelo editor Medro */
  _via?: string;
}

export type DiagKey = "f1" | "f2" | "f3" | "f4" | "f5" | "f6" | "f7" | "f8";
export type MechKey =
  | "batimento_la"
  | "batimento_loa"
  | "ponta_la"
  | "ponta_loa"
  | "assento_la"
  | "assento_loa"
  | "cubo_la"
  | "cubo_loa";

export const DIAG_ITEMS: { id: string; label: string; key: DiagKey }[] = [
  { id: "1.1", label: "Histórico de falha", key: "f1" },
  { id: "1.2", label: "Principal falha apresentada", key: "f2" },
  { id: "1.3", label: "Causa provável da falha", key: "f3" },
  { id: "1.4", label: "Sintomas apresentados", key: "f4" },
  { id: "1.5", label: "Parecer Técnico", key: "f5" },
  { id: "1.6", label: "Conclusão", key: "f6" },
  { id: "1.7", label: "Recomendações", key: "f7" },
  { id: "1.8", label: "Observações", key: "f8" },
];

const emptyMechCell = (): MechCell => ({
  phi: "",
  interf: "",
  toler: "",
  exced: "",
  approvedX: "",
  photo: null,
});

const emptyMotorBlock = (): MotorBlock => ({
  evidences: ["", "", ""],
  services: ["", "", ""],
  photoNames: ["", "", ""],
});

/** Defaults idênticos aos `useState(...)` do App.jsx do report-print. */
export function emptyLaudoState(): LaudoState {
  return {
    osData: null,
    historyData: [],
    photos: {},
    balanceData: null,
    modelConfig: {
      capaAtiva: "padrao",
      customCoverUrl: null,
      layout: DEFAULT_LAYOUT.map((p) => ({ ...p })),
    },
    customTableRows: {},
    tableHeaders: {},
    tableColumns: {},
    tableSubColumns: {},
    textBlocks: {},
    imageBlocks: {},
    freePageBlocks: {},
    diagValues: { f1: "", f2: "", f3: "", f4: "", f5: "", f6: "", f7: "", f8: "" },
    motorSections: {
      p7_block1: emptyMotorBlock(),
      p7_block2: emptyMotorBlock(),
      p8_block1: emptyMotorBlock(),
      p8_block2: emptyMotorBlock(),
    },
    mechData: {
      batimento_la: emptyMechCell(),
      batimento_loa: emptyMechCell(),
      ponta_la: emptyMechCell(),
      ponta_loa: emptyMechCell(),
      assento_la: emptyMechCell(),
      assento_loa: emptyMechCell(),
      cubo_la: emptyMechCell(),
      cubo_loa: emptyMechCell(),
    },
    p11Data: {
      instruments: [
        { name: "Relógio comparador (batimento)", nr: "", date: "" },
        { name: "Relógio comparador de diâmetro", nr: "", date: "" },
        { name: "Micrômetro externo", nr: "", date: "" },
        { name: "", nr: "", date: "" },
        { name: "", nr: "", date: "" },
        { name: "", nr: "", date: "" },
      ],
      rolamentos: { desc: "Refer.", qty: "1", replace: "X" },
      vedacao: {
        desc: "Realizamos a substituição de todas as vedações de forma preventiva.",
        replace: "X",
      },
      auxiliar: { desc: "Refer.", qty: "1", replace: "X" },
    },
    resistanceData: {
      medicao30s: "",
      medicao1m: "",
      medicao10m: "",
      ia: "",
      ip: "",
      statusIsolacao: "Aprovado",
      qtdCabos: "3",
      faseRS: "",
      faseRT: "",
      faseST: "",
      variacaoDelta: "",
      statusOhmica: "Aprovado",
    },
    normativeData: {
      ia_30s: "",
      ia_60s: "",
      ip_1m: "",
      ip_10m: "",
      res_30s: "",
      res_1m: "",
      res_10m: "",
    },
    diagVisibility: { f1: true, f2: true, f3: true, f4: true, f5: true, f6: true, f7: true, f8: true },
    peritagemAutoImported: false,
    activeTemplateId: null,
  };
}

/**
 * Aplica um modelo do álbum sobre o documento (mesma lógica do
 * `handleSelectTemplate` do app original): troca `modelConfig` + tabelas/textos/
 * blocos/visibilidade e marca `activeTemplateId`. NÃO mexe em `osData` nem nos
 * dados já preenchidos do laudo (diagValues, mechData, …).
 */
export function applyModelo(draft: LaudoState, configuracaoJson: string, modeloId: string): void {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(configuracaoJson);
  } catch {
    return;
  }
  const mc = parsed.modelConfig as ModelConfig | undefined;
  if (mc?.layout?.length) {
    const seen = new Set<string>();
    draft.modelConfig = {
      ...draft.modelConfig,
      ...mc,
      layout: mc.layout.map((p, i) => {
        let id = p.id;
        if (seen.has(id)) id = `${p.id}_${i}`;
        seen.add(id);
        return { ...p, id };
      }),
    };
  }
  const copyIf = <K extends keyof LaudoState>(k: K) => {
    if (parsed[k as string] != null) draft[k] = parsed[k as string] as LaudoState[K];
  };
  copyIf("customTableRows");
  copyIf("tableHeaders");
  copyIf("tableColumns");
  copyIf("tableSubColumns");
  copyIf("textBlocks");
  copyIf("imageBlocks");
  copyIf("freePageBlocks");
  copyIf("diagVisibility");
  draft.activeTemplateId = modeloId;
}

type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

/** Merge raso-profundo do rascunho salvo sobre os defaults (arrays substituem). */
export function mergeRascunho(raw: unknown): LaudoState {
  const base = emptyLaudoState();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as DeepPartial<LaudoState> & Record<string, unknown>;

  const merged: LaudoState = {
    ...base,
    ...(r as Partial<LaudoState>),
    modelConfig: {
      ...base.modelConfig,
      ...(r.modelConfig as Partial<ModelConfig> | undefined),
      layout:
        (r.modelConfig?.layout as LaudoPage[] | undefined)?.length
          ? (r.modelConfig!.layout as LaudoPage[])
          : base.modelConfig.layout,
    },
    diagValues: { ...base.diagValues, ...(r.diagValues as object) },
    diagVisibility: { ...base.diagVisibility, ...(r.diagVisibility as object) },
    motorSections: { ...base.motorSections, ...(r.motorSections as object) },
    mechData: { ...base.mechData, ...(r.mechData as object) },
    p11Data: { ...base.p11Data, ...(r.p11Data as Partial<P11Data>) },
    resistanceData: { ...base.resistanceData, ...(r.resistanceData as object) },
    normativeData: { ...base.normativeData, ...(r.normativeData as object) },
  };
  return merged;
}
