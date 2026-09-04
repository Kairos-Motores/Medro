import { dataverse } from "./client.js";

/**
 * Terceirizados / Serviços Externos — porte do módulo PowerApps
 * (`ControleTerceirizado`, `NovoRegistroTerceir`, `PendentesdeRetorno`,
 * `AtualizacaoPendentes`, `HistoricoPendentes`, `HistoricoTerceir`).
 *
 * Fonte: Dataverse `cr4a1_servicosterceirizados` (espelho da lista SharePoint
 * "Serviços Terceirizados"). Um registro = uma peça enviada para serviço
 * externo (usinagem, solda, jateamento, torneamento…) numa OS.
 *
 * Regra central do app original:
 *   PENDENTE  = sem data de retorno   → `IsBlank(Data_retorno) And IsBlank(xdataretorno)`
 *   HISTÓRICO = já retornou           → tem data de retorno
 * Tudo filtrado pela `Unidade` (filial) do usuário; busca por N_OR / Título.
 */

export const TERCEIRIZADOS_SET = "cr4a1_servicosterceirizadoses";

/** Map API (camelCase) ⟷ coluna lógica Dataverse. */
export const F_TERC = {
  id: "cr4a1_servicosterceirizadosid",
  titulo: "cr4a1_title", // nº da OS ("XXXX-YY")
  idLegado: "cr4a1_id",
  nOr: "cr4a1_n_or",
  peca: "cr4a1_pe_x00e7_a", // choice
  situacao: "cr4a1_situa_x00e7__x00e3_o", // choice (0=Emergencial, 1=Normal)
  empresa: "cr4a1_xempresa", // texto (o form original grava aqui)
  carcaca: "cr4a1_carca_x00e7_a",
  fabricante: "cr4a1_fabricante",
  unidade: "cr4a1_unidade",
  observacao: "cr4a1_observa_x00e7__x00e3_o",
  orcFornecedor: "cr4a1_orc_fornecedor",
  servico1: "cr4a1_servi_x00e7_o1",
  servico2: "cr4a1_servi_x00e7_o2",
  servico3: "cr4a1_servi_x00e7_o3",
  servico4: "cr4a1_servi_x00e7_o4",
  servico5: "cr4a1_servi_x00e7_o5",
  valorServ1: "cr4a1_valorserv1",
  valorServ2: "cr4a1_valorserv2",
  valorServ3: "cr4a1_valorserv3",
  valorServ4: "cr4a1_valorserv4",
  valorServ5: "cr4a1_valorserv5",
  totalValor: "cr4a1_totalvalor",
  dataRegistro: "cr4a1_data_registro",
  xDataRegistro: "cr4a1_xdataregistro",
  dataRetorno: "cr4a1_data_retorno",
  xDataRetorno: "cr4a1_xdataretorno",
  previsaoRetorno: "cr4a1_previs_x00e3_oretorno",
  xPrevisaoRetorno: "cr4a1_xprevisaoretorno",
  dataAprovacaoValor: "cr4a1_data_aprovacao_valor",
  dataEnvio: "cr4a1_data_envio",
  xDataEnvio: "cr4a1_xdataenvio",
  avaliacaoRetorno: "cr4a1_avaliacaoretorno",
  avaliacaoDescricao: "cr4a1_avaliacaodescricao",
  avaliacaoMedida: "cr4a1_avaliacaomedida",
  xStatus: "cr4a1_xstatus",
  createdon: "createdon",
  modifiedon: "modifiedon",
} as const;

/** Option sets (doc 01 §servicosterceirizados). */
export const PECA_OPCOES = [
  "Tampa LA", "Tampa LOA", "Eixo", "Rosca do olhal", "Caixa de Ligação", "Anel coletor",
  "Armadura de freio", "Estator", "Anel de fixação", "Defletora", "Bobina", "Ventilador",
  "Pino", "Parafuso", "Acoplamento", "Anel Labirinto", "Caixa Metálica", "Porta Escova",
  "Tapes", "Rosca", "Peça",
] as const;
export const SITUACAO_OPCOES = ["Emergencial", "Normal"] as const;
/** Sugestões de fornecedor (o campo é texto livre no app original). */
export const EMPRESA_SUGESTOES = [
  "Torneadora Ágape", "Santo Antônio", "Gefferssom", "Antônio Jateamento", "Rubenilson",
  "Sítio/ Maracujá",
] as const;

const pecaLabel = (v: unknown) =>
  typeof v === "number" && v >= 0 && v < PECA_OPCOES.length ? PECA_OPCOES[v]! : (v == null ? "" : String(v));
const pecaValue = (label: string | null | undefined): number | null => {
  if (!label) return null;
  const i = PECA_OPCOES.indexOf(label.trim() as (typeof PECA_OPCOES)[number]);
  return i >= 0 ? i : null;
};
const situacaoLabel = (v: unknown) =>
  typeof v === "number" && v >= 0 && v < SITUACAO_OPCOES.length ? SITUACAO_OPCOES[v]! : (v == null ? "" : String(v));
const situacaoValue = (label: string | null | undefined): number | null => {
  if (!label) return null;
  const i = SITUACAO_OPCOES.indexOf(label.trim() as (typeof SITUACAO_OPCOES)[number]);
  return i >= 0 ? i : null;
};

export type TerceirizadoDTO = {
  id: string;
  titulo: string;
  nOr: string | null;
  peca: string;
  situacao: string;
  empresa: string | null;
  carcaca: string | null;
  fabricante: string | null;
  unidade: string;
  observacao: string | null;
  orcFornecedor: string | null;
  servicos: (string | null)[]; // [s1..s5]
  valores: (string | null)[]; // [v1..v5]
  totalValor: string | null;
  dataRegistro: string | null; // ISO ou texto
  dataRetorno: string | null;
  previsaoRetorno: string | null;
  dataAprovacaoValor: string | null;
  dataEnvio: string | null;
  avaliacaoRetorno: string | null;
  avaliacaoDescricao: string | null;
  avaliacaoMedida: string | null;
  pendente: boolean;
  createdon: string | null;
  modifiedon: string | null;
};

const SELECT = Object.values(F_TERC);

/** primeira data não-vazia entre a coluna datetime `x…` e a coluna texto. */
function firstDate(x: unknown, txt: unknown): string | null {
  if (x != null && x !== "") return String(x);
  if (txt != null && String(txt).trim() !== "") return String(txt);
  return null;
}

function toDTO(r: Record<string, unknown>): TerceirizadoDTO {
  const g = (col: string) => r[col];
  const gf = (col: string) =>
    (r[`${col}@OData.Community.Display.V1.FormattedValue`] as string | undefined) ?? undefined;
  const retorno = firstDate(g(F_TERC.xDataRetorno), g(F_TERC.dataRetorno));
  return {
    id: String(g(F_TERC.id) ?? ""),
    titulo: String(g(F_TERC.titulo) ?? ""),
    nOr: (g(F_TERC.nOr) as string) ?? null,
    peca: gf(F_TERC.peca) ?? pecaLabel(g(F_TERC.peca)),
    situacao: gf(F_TERC.situacao) ?? situacaoLabel(g(F_TERC.situacao)),
    empresa: (g(F_TERC.empresa) as string) || gf("cr4a1_empresa") || null,
    carcaca: (g(F_TERC.carcaca) as string) ?? null,
    fabricante: (g(F_TERC.fabricante) as string) ?? null,
    unidade: String(g(F_TERC.unidade) ?? ""),
    observacao: (g(F_TERC.observacao) as string) ?? null,
    orcFornecedor: (g(F_TERC.orcFornecedor) as string) ?? null,
    servicos: [F_TERC.servico1, F_TERC.servico2, F_TERC.servico3, F_TERC.servico4, F_TERC.servico5].map(
      (c) => (g(c) as string) ?? null,
    ),
    valores: [F_TERC.valorServ1, F_TERC.valorServ2, F_TERC.valorServ3, F_TERC.valorServ4, F_TERC.valorServ5].map(
      (c) => (g(c) as string) ?? null,
    ),
    totalValor: (g(F_TERC.totalValor) as string) ?? null,
    dataRegistro: firstDate(g(F_TERC.xDataRegistro), g(F_TERC.dataRegistro)),
    dataRetorno: retorno,
    previsaoRetorno: firstDate(g(F_TERC.xPrevisaoRetorno), g(F_TERC.previsaoRetorno)),
    dataAprovacaoValor: (g(F_TERC.dataAprovacaoValor) as string) ?? null,
    dataEnvio: firstDate(g(F_TERC.xDataEnvio), g(F_TERC.dataEnvio)),
    avaliacaoRetorno: (g(F_TERC.avaliacaoRetorno) as string) ?? null,
    avaliacaoDescricao: (g(F_TERC.avaliacaoDescricao) as string) ?? null,
    avaliacaoMedida: (g(F_TERC.avaliacaoMedida) as string) ?? null,
    pendente: !retorno,
    createdon: (g(F_TERC.createdon) as string) ?? null,
    modifiedon: (g(F_TERC.modifiedon) as string) ?? null,
  };
}

const esc = (s: string) => s.replace(/'/g, "''");

// ---------------------------------------------------------------------------
// Fallback local (dev / offline) — mesmo padrão da Caldeiraria
// ---------------------------------------------------------------------------
function mockRow(p: Partial<TerceirizadoDTO> & { id: string; titulo: string }): TerceirizadoDTO {
  return {
    nOr: null, peca: "Eixo", situacao: "Normal", empresa: "Torneadora Ágape", carcaca: null,
    fabricante: null, unidade: "São Luís", observacao: null, orcFornecedor: null,
    servicos: [null, null, null, null, null], valores: [null, null, null, null, null],
    totalValor: null, dataRegistro: null, dataRetorno: null, previsaoRetorno: null,
    dataAprovacaoValor: null, dataEnvio: null, avaliacaoRetorno: null, avaliacaoDescricao: null,
    avaliacaoMedida: null, pendente: true, createdon: new Date().toISOString(),
    modifiedon: new Date().toISOString(), ...p,
  };
}
const h = (n: number) => new Date(Date.now() - n * 3600 * 1000).toISOString();
let MOCK: TerceirizadoDTO[] = [
  mockRow({ id: "terc-1", titulo: "4821-AL", nOr: "OR-10233", peca: "Eixo", situacao: "Emergencial",
    empresa: "Torneadora Ágape", carcaca: "355 M/L", fabricante: "WEG", unidade: "São Luís",
    orcFornecedor: "R$ 4.800,00", servicos: ["Cromagem dura da ponta de eixo", "Retífica de sede de rolamento", null, null, null],
    valores: ["3200", "1600", null, null, null], totalValor: "4800",
    dataRegistro: h(72), previsaoRetorno: h(-96), dataEnvio: h(72), pendente: true, createdon: h(72), modifiedon: h(72) }),
  mockRow({ id: "terc-2", titulo: "4790-PA", nOr: "OR-10240", peca: "Caixa de Ligação", situacao: "Normal",
    empresa: "Antônio Jateamento", carcaca: "250 S/M", fabricante: "Siemens", unidade: "São Luís",
    orcFornecedor: "R$ 950,00", servicos: ["Jateamento e pintura eletrostática", null, null, null, null],
    valores: ["950", null, null, null, null], totalValor: "950",
    dataRegistro: h(120), previsaoRetorno: h(-24), dataEnvio: h(120), pendente: true, createdon: h(120), modifiedon: h(120) }),
  mockRow({ id: "terc-3", titulo: "4712-AL", nOr: "OR-10190", peca: "Ventilador", situacao: "Normal",
    empresa: "Gefferssom", carcaca: "200 L", fabricante: "WEG", unidade: "São Luís",
    orcFornecedor: "R$ 700,00", servicos: ["Balanceamento dinâmico do ventilador metálico", null, null, null, null],
    valores: ["700", null, null, null, null], totalValor: "700",
    dataRegistro: h(240), dataRetorno: h(48), previsaoRetorno: h(96), dataEnvio: h(240),
    avaliacaoRetorno: "Aprovado", avaliacaoDescricao: "Vibração dentro da norma ISO 10816.",
    pendente: false, createdon: h(240), modifiedon: h(48) }),
];

// ---------------------------------------------------------------------------
// Operações
// ---------------------------------------------------------------------------

export type ListTerceirizadosParams = {
  filial?: string;
  status?: "pendentes" | "historico" | "todos";
  situacao?: "Emergencial" | "Normal";
  os?: string;
  search?: string;
  order?: "asc" | "desc";
  top?: number;
};

export async function listTerceirizados(
  p: ListTerceirizadosParams,
): Promise<{ items: TerceirizadoDTO[]; fromDataverse: boolean }> {
  const semRetorno = `((${F_TERC.dataRetorno} eq null or ${F_TERC.dataRetorno} eq '') and ${F_TERC.xDataRetorno} eq null)`;
  try {
    const clauses: string[] = [];
    if (p.filial && p.filial !== "Todas") clauses.push(`${F_TERC.unidade} eq '${esc(p.filial)}'`);
    if (p.status === "pendentes") clauses.push(semRetorno);
    else if (p.status === "historico") clauses.push(`not ${semRetorno}`);
    if (p.situacao) {
      const v = situacaoValue(p.situacao);
      if (v != null) clauses.push(`${F_TERC.situacao} eq ${v}`);
    }
    if (p.os) clauses.push(`contains(${F_TERC.titulo},'${esc(p.os)}')`);
    if (p.search) {
      const s = esc(p.search);
      clauses.push(
        `(contains(${F_TERC.nOr},'${s}') or contains(${F_TERC.titulo},'${s}') or contains(${F_TERC.empresa},'${s}') or contains(${F_TERC.fabricante},'${s}'))`,
      );
    }

    const { value } = await dataverse.list<Record<string, unknown>>(TERCEIRIZADOS_SET, {
      select: SELECT,
      filter: clauses.join(" and ") || undefined,
      orderby: `${F_TERC.createdon} ${p.order === "asc" ? "asc" : "desc"}`,
      top: p.top ?? 200,
      maxPageSize: p.top ?? 200,
    });
    // Prefer com annotations não passa pelo helper `list`; formattedValue vem só se pedido.
    return { items: value.map(toDTO), fromDataverse: true };
  } catch {
    let items = [...MOCK];
    if (p.filial && p.filial !== "Todas")
      items = items.filter((i) => i.unidade.toLowerCase() === p.filial!.toLowerCase());
    if (p.status === "pendentes") items = items.filter((i) => i.pendente);
    else if (p.status === "historico") items = items.filter((i) => !i.pendente);
    if (p.situacao) items = items.filter((i) => i.situacao === p.situacao);
    if (p.os) items = items.filter((i) => i.titulo.toLowerCase().includes(p.os!.toLowerCase()));
    if (p.search) {
      const s = p.search.toLowerCase();
      items = items.filter(
        (i) =>
          (i.nOr ?? "").toLowerCase().includes(s) ||
          i.titulo.toLowerCase().includes(s) ||
          (i.empresa ?? "").toLowerCase().includes(s) ||
          (i.fabricante ?? "").toLowerCase().includes(s),
      );
    }
    items.sort((a, b) => {
      const d = new Date(a.createdon ?? 0).getTime() - new Date(b.createdon ?? 0).getTime();
      return p.order === "asc" ? d : -d;
    });
    return { items, fromDataverse: false };
  }
}

export async function getTerceirizado(id: string): Promise<TerceirizadoDTO | null> {
  try {
    const raw = await dataverse.get<Record<string, unknown>>(TERCEIRIZADOS_SET, id, { select: SELECT });
    return raw ? toDTO(raw) : null;
  } catch {
    return MOCK.find((i) => i.id === id) ?? null;
  }
}

export type CreateTerceirizadoInput = {
  titulo: string; // OS
  nOr?: string;
  peca?: string;
  situacao?: string;
  empresa?: string;
  carcaca?: string;
  fabricante?: string;
  unidade?: string;
  observacao?: string;
  previsaoRetorno?: string; // ISO
  dataRegistro?: string; // ISO
  servicos?: (string | null)[];
};

function payloadFromCreate(input: CreateTerceirizadoInput): Record<string, unknown> {
  const now = new Date().toISOString();
  const servicos = input.servicos ?? [];
  const payload: Record<string, unknown> = {
    [F_TERC.titulo]: input.titulo.trim(),
    [F_TERC.nOr]: input.nOr?.trim() || null,
    [F_TERC.empresa]: input.empresa?.trim() || null,
    [F_TERC.carcaca]: input.carcaca?.trim() || null,
    [F_TERC.fabricante]: input.fabricante?.trim() || null,
    [F_TERC.unidade]: input.unidade || "São Luís",
    [F_TERC.observacao]: input.observacao?.trim() || null,
    [F_TERC.xPrevisaoRetorno]: input.previsaoRetorno || null,
    [F_TERC.xDataRegistro]: input.dataRegistro || now,
    [F_TERC.xDataEnvio]: now,
  };
  const pv = pecaValue(input.peca);
  if (pv != null) payload[F_TERC.peca] = pv;
  const sv = situacaoValue(input.situacao);
  if (sv != null) payload[F_TERC.situacao] = sv;
  [F_TERC.servico1, F_TERC.servico2, F_TERC.servico3, F_TERC.servico4, F_TERC.servico5].forEach((c, i) => {
    if (servicos[i]?.trim()) payload[c] = servicos[i]!.trim();
  });
  return payload;
}

export async function createTerceirizado(input: CreateTerceirizadoInput): Promise<TerceirizadoDTO> {
  try {
    const created = await dataverse.create<Record<string, unknown>>(
      TERCEIRIZADOS_SET,
      payloadFromCreate(input),
    );
    return toDTO(created);
  } catch {
    const row = mockRow({
      id: `terc-${Date.now()}`,
      titulo: input.titulo.trim(),
      nOr: input.nOr?.trim() || null,
      peca: input.peca || "Peça",
      situacao: input.situacao || "Normal",
      empresa: input.empresa?.trim() || null,
      carcaca: input.carcaca?.trim() || null,
      fabricante: input.fabricante?.trim() || null,
      unidade: input.unidade || "São Luís",
      observacao: input.observacao?.trim() || null,
      previsaoRetorno: input.previsaoRetorno || null,
      dataRegistro: input.dataRegistro || new Date().toISOString(),
      servicos: [0, 1, 2, 3, 4].map((i) => input.servicos?.[i]?.trim() || null),
      dataEnvio: new Date().toISOString(),
      pendente: true,
    });
    MOCK.unshift(row);
    return row;
  }
}

export type UpdateTerceirizadoInput = {
  nOr?: string;
  peca?: string;
  situacao?: string;
  empresa?: string;
  carcaca?: string;
  fabricante?: string;
  observacao?: string;
  orcFornecedor?: string;
  servicos?: (string | null)[];
  valores?: (string | null)[];
  totalValor?: string;
  dataRegistro?: string;
  dataRetorno?: string; // ISO — preencher = concluir (sai de pendentes)
  previsaoRetorno?: string;
  dataAprovacaoValor?: string;
  avaliacaoRetorno?: string;
  avaliacaoDescricao?: string;
  avaliacaoMedida?: string;
};

function payloadFromUpdate(input: UpdateTerceirizadoInput): Record<string, unknown> {
  const p: Record<string, unknown> = {};
  const set = (col: string, v: unknown) => {
    if (v !== undefined) p[col] = v === "" ? null : v;
  };
  set(F_TERC.nOr, input.nOr);
  set(F_TERC.empresa, input.empresa);
  set(F_TERC.carcaca, input.carcaca);
  set(F_TERC.fabricante, input.fabricante);
  set(F_TERC.observacao, input.observacao);
  set(F_TERC.orcFornecedor, input.orcFornecedor);
  set(F_TERC.totalValor, input.totalValor);
  set(F_TERC.dataAprovacaoValor, input.dataAprovacaoValor);
  set(F_TERC.avaliacaoRetorno, input.avaliacaoRetorno);
  set(F_TERC.avaliacaoDescricao, input.avaliacaoDescricao);
  set(F_TERC.avaliacaoMedida, input.avaliacaoMedida);
  if (input.dataRegistro !== undefined) set(F_TERC.xDataRegistro, input.dataRegistro || null);
  if (input.dataRetorno !== undefined) set(F_TERC.xDataRetorno, input.dataRetorno || null);
  if (input.previsaoRetorno !== undefined) set(F_TERC.xPrevisaoRetorno, input.previsaoRetorno || null);
  if (input.peca !== undefined) {
    const v = pecaValue(input.peca);
    if (v != null) p[F_TERC.peca] = v;
  }
  if (input.situacao !== undefined) {
    const v = situacaoValue(input.situacao);
    if (v != null) p[F_TERC.situacao] = v;
  }
  if (input.servicos) {
    [F_TERC.servico1, F_TERC.servico2, F_TERC.servico3, F_TERC.servico4, F_TERC.servico5].forEach((c, i) => {
      if (input.servicos![i] !== undefined) p[c] = input.servicos![i]?.trim() || null;
    });
  }
  if (input.valores) {
    [F_TERC.valorServ1, F_TERC.valorServ2, F_TERC.valorServ3, F_TERC.valorServ4, F_TERC.valorServ5].forEach((c, i) => {
      if (input.valores![i] !== undefined) p[c] = input.valores![i]?.trim() || null;
    });
  }
  return p;
}

export async function updateTerceirizado(
  id: string,
  input: UpdateTerceirizadoInput,
): Promise<TerceirizadoDTO> {
  try {
    const updated = await dataverse.update<Record<string, unknown>>(
      TERCEIRIZADOS_SET,
      id,
      payloadFromUpdate(input),
    );
    return toDTO(updated);
  } catch {
    const idx = MOCK.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error(`Registro ${id} não encontrado`);
    const cur = MOCK[idx]!;
    const next: TerceirizadoDTO = {
      ...cur,
      nOr: input.nOr ?? cur.nOr,
      peca: input.peca ?? cur.peca,
      situacao: input.situacao ?? cur.situacao,
      empresa: input.empresa ?? cur.empresa,
      carcaca: input.carcaca ?? cur.carcaca,
      fabricante: input.fabricante ?? cur.fabricante,
      observacao: input.observacao ?? cur.observacao,
      orcFornecedor: input.orcFornecedor ?? cur.orcFornecedor,
      servicos: input.servicos ? cur.servicos.map((s, i) => input.servicos![i] ?? s) : cur.servicos,
      valores: input.valores ? cur.valores.map((v, i) => input.valores![i] ?? v) : cur.valores,
      totalValor: input.totalValor ?? cur.totalValor,
      dataRegistro: input.dataRegistro ?? cur.dataRegistro,
      dataRetorno: input.dataRetorno ?? cur.dataRetorno,
      previsaoRetorno: input.previsaoRetorno ?? cur.previsaoRetorno,
      dataAprovacaoValor: input.dataAprovacaoValor ?? cur.dataAprovacaoValor,
      avaliacaoRetorno: input.avaliacaoRetorno ?? cur.avaliacaoRetorno,
      avaliacaoDescricao: input.avaliacaoDescricao ?? cur.avaliacaoDescricao,
      avaliacaoMedida: input.avaliacaoMedida ?? cur.avaliacaoMedida,
      modifiedon: new Date().toISOString(),
    };
    next.pendente = !next.dataRetorno;
    MOCK[idx] = next;
    return next;
  }
}

export async function removeTerceirizado(id: string): Promise<void> {
  try {
    await dataverse.remove(TERCEIRIZADOS_SET, id);
  } catch {
    MOCK = MOCK.filter((i) => i.id !== id);
  }
}

export type TerceirizadosKpis = {
  totalPendentes: number;
  emergenciais: number;
  atrasados: number; // pendentes com previsão de retorno já vencida
  retornaram7d: number;
  valorPendente: number; // soma de Total Valor dos pendentes (numérico)
};

const parseValor = (s: string | null | undefined): number => {
  if (!s) return 0;
  const n = Number(String(s).replace(/[^0-9,.-]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

export async function getTerceirizadosKpis(filial?: string): Promise<TerceirizadosKpis> {
  const { items } = await listTerceirizados({ filial, status: "todos", top: 1000 });
  const now = Date.now();
  const pendentes = items.filter((i) => i.pendente);
  const emergenciais = pendentes.filter((i) => i.situacao === "Emergencial").length;
  const atrasados = pendentes.filter(
    (i) => i.previsaoRetorno && new Date(i.previsaoRetorno).getTime() < now,
  ).length;
  const seteDias = now - 7 * 24 * 3600 * 1000;
  const retornaram7d = items.filter(
    (i) => i.dataRetorno && new Date(i.dataRetorno).getTime() >= seteDias,
  ).length;
  const valorPendente = pendentes.reduce((acc, i) => acc + parseValor(i.totalValor), 0);
  return { totalPendentes: pendentes.length, emergenciais, atrasados, retornaram7d, valorPendente };
}
