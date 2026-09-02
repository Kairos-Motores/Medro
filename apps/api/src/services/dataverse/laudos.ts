import { dataverse } from "./client.js";

/** Repositório da tabela Laudos (cr4a1_laudoses) — usada pelo Departamento Técnico. */

export const LAUDO_SET = "cr4a1_laudoses";

/** map API ⟷ colunas lógicas Dataverse */
export const F = {
  id: "cr4a1_laudosid",
  os: "cr4a1_os",
  osSemSigla: "cr4a1_os_semsigla",
  cliente: "cr4a1_cliente",
  filial: "cr4a1_filial",
  emissor: "cr4a1_emissor",
  dataLaudo: "cr4a1_datalaudo",
  tipoLaudo: "cr4a1_tipolaudo",
  classeLaudo: "cr4a1_classelaudo",
  tipoPatch: "cr4a1_tipopatch",
  xStatus: "cr4a1_xstatus",
  xId: "cr4a1_xid",
  qrValid: "cr4a1_xvalidlaudoqrccode",
  sintomas: "cr4a1_sintomasevidenciados",
  falhaPrincipal: "cr4a1_falhaprincipal",
  parecerTecnico: "cr4a1_parecertecnico",
  conclusao: "cr4a1_conclusao",
  observacao: "cr4a1_observacao",
  ensaioEletrico: "cr4a1_ensaioeletrico",
  ensaioTemperatura: "cr4a1_ensaiotemperatura",
  ensaioVibracao: "cr4a1_ensaiovibracao",
  dataMotorPeritado: "cr4a1_datamotorperitado",
  dataMotorPronto: "cr4a1_datamotorpronto",
  createdon: "createdon",
  modifiedon: "modifiedon",
} as const;

export type LaudoDTO = {
  id: string;
  os: string | null;
  osSemSigla: string | null;
  cliente: string | null;
  filial: string | null;
  emissor: string | null;
  dataLaudo: string | null;
  tipoLaudo: string | null;
  classeLaudo: string | null;
  tipoPatch: string | null;
  xStatus: string | null;
  xId: string | null;
  qrValid: string | null;
  sintomas: string | null;
  falhaPrincipal: string | null;
  parecerTecnico: string | null;
  conclusao: string | null;
  observacao: string | null;
  ensaioEletrico: string | null;
  ensaioTemperatura: string | null;
  ensaioVibracao: string | null;
  dataMotorPeritado: string | null;
  dataMotorPronto: string | null;
  createdon: string | null;
  modifiedon: string | null;
};

const SELECT = Object.values(F);

function toDTO(r: Record<string, unknown>): LaudoDTO {
  const o = {} as LaudoDTO;
  for (const [k, col] of Object.entries(F)) {
    (o as Record<string, unknown>)[k] = (r[col] ?? null) as unknown;
  }
  return o;
}

const esc = (s: string) => s.replace(/'/g, "''");

export type ListLaudosParams = {
  search?: string;
  filial?: string;
  tipo?: "todos" | "dpt" | "tec";
  top?: number;
  skiptoken?: string;
};

export async function listLaudos(p: ListLaudosParams): Promise<{ items: LaudoDTO[]; nextLink?: string }> {
  const clauses: string[] = [
    `(${F.tipoPatch} eq null or ${F.tipoPatch} ne 'PCP')`,
    `(${F.xStatus} eq null or ${F.xStatus} ne 'Inativo')`,
  ];
  if (p.filial) clauses.push(`${F.filial} eq '${esc(p.filial)}'`);
  if (p.tipo === "dpt") clauses.push(`${F.tipoLaudo} eq 'DPT'`);
  if (p.tipo === "tec") clauses.push(`${F.tipoLaudo} eq 'TEC'`);
  if (p.search) {
    const s = esc(p.search);
    clauses.push(
      `(contains(${F.os},'${s}') or contains(${F.emissor},'${s}') or contains(${F.tipoLaudo},'${s}') or contains(${F.classeLaudo},'${s}') or contains(${F.cliente},'${s}') or contains(${F.parecerTecnico},'${s}'))`,
    );
  }

  const { value, nextLink } = await dataverse.list<Record<string, unknown>>(LAUDO_SET, {
    select: SELECT,
    filter: clauses.join(" and "),
    orderby: `${F.createdon} desc`,
    top: p.top ?? 50,
    maxPageSize: p.top ?? 50,
  });
  return { items: value.map(toDTO), nextLink };
}

export async function getLaudo(id: string): Promise<LaudoDTO> {
  const r = await dataverse.get<Record<string, unknown>>(LAUDO_SET, id, { select: SELECT });
  return toDTO(r);
}

/** aceita chaves do DTO e traduz para colunas lógicas */
function toRow(input: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    const col = (F as Record<string, string>)[k];
    if (col && k !== "id") row[col] = v;
  }
  return row;
}

export async function createLaudo(input: Record<string, unknown>): Promise<LaudoDTO> {
  const r = await dataverse.create<Record<string, unknown>>(LAUDO_SET, toRow(input));
  return toDTO(r);
}

export async function updateLaudo(id: string, input: Record<string, unknown>): Promise<LaudoDTO> {
  const r = await dataverse.update<Record<string, unknown>>(LAUDO_SET, id, toRow(input));
  return toDTO(r);
}

/** soft delete — réplica do PowerApps: Patch xStatus = "Inativo" */
export async function archiveLaudo(id: string): Promise<void> {
  await dataverse.update(LAUDO_SET, id, { [F.xStatus]: "Inativo" });
}
