import { dataverse } from "./client.js";

export const CALDEIRARIA_CONTROLE_SET = "cr4a1_caldeiraria_controles";
export const CALDEIRARIA_LISTA_SET = "cr4a1_caldeiraria_listas";

/** Map API ⟷ colunas lógicas Dataverse para Caldeiraria_Controle */
export const F_CONTROLE = {
  id: "cr4a1_caldeiraria_controleid",
  os: "cr4a1_os",
  pecas: "cr4a1_pecas",
  servicos: "cr4a1_servicos",
  prazo: "cr4a1_prazo",
  regime: "cr4a1_regime",
  status: "cr4a1_status",
  xxStatus: "cr4a1_xxstatus",
  unidade: "cr4a1_unidade",
  inseridoPor: "cr4a1_inseridopor",
  concluidoPor: "cr4a1_concluidopor",
  dataEnvio: "cr4a1_dataenvio",
  dataPrazo: "cr4a1_dataprazo",
  dataConclusao: "cr4a1_dataconclusao",
  dataModificacao: "cr4a1_datamodificacao",
  comentario: "cr4a1_comentario",
  imagemReferencia: "cr4a1_imagemreferencia",
  evidencia: "cr4a1_evidencia",
  createdon: "createdon",
  modifiedon: "modifiedon",
} as const;

export const F_LISTA = {
  id: "cr4a1_caldeiraria_listaid",
  pecas: "cr4a1_pecas",
  createdon: "createdon",
  modifiedon: "modifiedon",
} as const;

export type CaldeirariaItemDTO = {
  id: string;
  os: string;
  pecas: string;
  servicos: string | null;
  prazo: number | null;
  regime: "Normal" | "Prioridade" | string;
  status: "Pendente" | "Concluído" | "Suspenso" | string;
  xxStatus: string | null;
  unidade: string;
  inseridoPor: string | null;
  concluidoPor: string | null;
  dataEnvio: string | null;
  dataPrazo: string | null;
  dataConclusao: string | null;
  dataModificacao: string | null;
  comentario: string | null;
  imagemReferencia: string | null;
  evidencia: string | null;
  createdon: string | null;
  modifiedon: string | null;
};

export type CaldeirariaPecaDTO = {
  id: string;
  pecas: string;
};

const SELECT_CONTROLE = Object.values(F_CONTROLE);
const SELECT_LISTA = Object.values(F_LISTA);

function toItemDTO(r: Record<string, unknown>): CaldeirariaItemDTO {
  const o = {} as CaldeirariaItemDTO;
  for (const [k, col] of Object.entries(F_CONTROLE)) {
    (o as Record<string, unknown>)[k] = (r[col] ?? null) as unknown;
  }
  return o;
}

function toPecaDTO(r: Record<string, unknown>): CaldeirariaPecaDTO {
  return {
    id: String(r[F_LISTA.id] ?? ""),
    pecas: String(r[F_LISTA.pecas] ?? ""),
  };
}

const esc = (s: string) => s.replace(/'/g, "''");

// -------------------------------------------------------------
// Banco de dados em memória para fallback/desenvolvimento local
// -------------------------------------------------------------
const INITIAL_PECAS_MOCK: CaldeirariaPecaDTO[] = [
  { id: "peca-1", pecas: "Eixo Rotor Principal" },
  { id: "peca-2", pecas: "Tampa Dianteira (DE)" },
  { id: "peca-3", pecas: "Tampa Traseira (NDE)" },
  { id: "peca-4", pecas: "Carcaça Estator" },
  { id: "peca-5", pecas: "Caixa de Ligação Principal" },
  { id: "peca-6", pecas: "Defletor de Ar Externo" },
  { id: "peca-7", pecas: "Alojamento de Mancal DE" },
  { id: "peca-8", pecas: "Alojamento de Mancal NDE" },
  { id: "peca-9", pecas: "Ventilador Metálico" },
  { id: "peca-10", pecas: "Flange de Fixação" },
  { id: "peca-11", pecas: "Base de Suporte Metálica" },
];

const INITIAL_ITENS_MOCK: CaldeirariaItemDTO[] = [
  {
    id: "cald-101",
    os: "2026-4821",
    pecas: "Tampa Dianteira (DE)",
    servicos: "Recuperação por solda e usinagem de precisão do alojamento de rolamento 6318. Tolerância H7.",
    prazo: 3,
    regime: "Prioridade",
    status: "Pendente",
    xxStatus: "Ativo",
    unidade: "São Luís",
    inseridoPor: "Carlos Eduardo Silva",
    concluidoPor: null,
    dataEnvio: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    dataPrazo: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    dataConclusao: null,
    dataModificacao: null,
    comentario: "Cliente solicitou urgência devido a parada de fábrica no sábado.",
    imagemReferencia: null,
    evidencia: null,
    createdon: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    modifiedon: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "cald-102",
    os: "2026-4821",
    pecas: "Eixo Rotor Principal",
    servicos: "Cromagem dura e retífica da ponta de eixo para acoplamento rígido.",
    prazo: 4,
    regime: "Prioridade",
    status: "Pendente",
    xxStatus: "Ativo",
    unidade: "São Luís",
    inseridoPor: "Carlos Eduardo Silva",
    concluidoPor: null,
    dataEnvio: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    dataPrazo: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    dataConclusao: null,
    dataModificacao: null,
    comentario: null,
    imagemReferencia: null,
    evidencia: null,
    createdon: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    modifiedon: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
  },
  {
    id: "cald-103",
    os: "2026-4790",
    pecas: "Carcaça Estator",
    servicos: "Reconstrução dos furos de fixação das sapatas com insertos roscados M24 e caldeiraria no defletor.",
    prazo: 5,
    regime: "Normal",
    status: "Pendente",
    xxStatus: "Ativo",
    unidade: "São Luís",
    inseridoPor: "Rodrigo de Paula Nascimento",
    concluidoPor: null,
    dataEnvio: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    dataPrazo: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    dataConclusao: null,
    dataModificacao: null,
    comentario: null,
    imagemReferencia: null,
    evidencia: null,
    createdon: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    modifiedon: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
  {
    id: "cald-104",
    os: "2026-4755",
    pecas: "Alojamento de Mancal NDE",
    servicos: "Metalização e torneamento interno do mancal bipartido.",
    prazo: 2,
    regime: "Normal",
    status: "Suspenso",
    xxStatus: "Ativo",
    unidade: "São Luís",
    inseridoPor: "Carlos Eduardo Silva",
    concluidoPor: null,
    dataEnvio: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    dataPrazo: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    dataConclusao: null,
    dataModificacao: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    comentario: "Aguardando definição do cliente sobre folga radial do rolamento autocompensador.",
    imagemReferencia: null,
    evidencia: null,
    createdon: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    modifiedon: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: "cald-105",
    os: "2026-4712",
    pecas: "Ventilador Metálico",
    servicos: "Recuperação de aletas de ventilação trincadas e usinagem de cubo.",
    prazo: 2,
    regime: "Normal",
    status: "Concluído",
    xxStatus: "Ativo",
    unidade: "São Luís",
    inseridoPor: "Carlos Eduardo Silva",
    concluidoPor: "José Raimundo Caldeireiro",
    dataEnvio: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    dataPrazo: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    dataConclusao: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    dataModificacao: null,
    comentario: "Executado teste de líquido penetrante após solda. Aprovado.",
    imagemReferencia: null,
    evidencia: null,
    createdon: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    modifiedon: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
  {
    id: "cald-106",
    os: "2026-5100",
    pecas: "Tampa Traseira (NDE)",
    servicos: "Usinagem da face de assentamento e embuchamento do alojamento de vedação labirinto.",
    prazo: 3,
    regime: "Prioridade",
    status: "Pendente",
    xxStatus: "Ativo",
    unidade: "Parauapebas",
    inseridoPor: "Marcos Antônio Ferreira",
    concluidoPor: null,
    dataEnvio: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    dataPrazo: new Date(Date.now() + 60 * 3600 * 1000).toISOString(),
    dataConclusao: null,
    dataModificacao: null,
    comentario: null,
    imagemReferencia: null,
    evidencia: null,
    createdon: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    modifiedon: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
  },
];

let localMockItens = [...INITIAL_ITENS_MOCK];
let localMockPecas = [...INITIAL_PECAS_MOCK];

// -------------------------------------------------------------
// Operações de Negócio
// -------------------------------------------------------------

export type ListCaldeirariaParams = {
  filial?: string;
  status?: "todos" | "pendentes" | "concluidos" | "suspensos";
  regime?: "Normal" | "Prioridade";
  os?: string;
  search?: string;
  top?: number;
};

export async function listCaldeirariaItens(
  p: ListCaldeirariaParams,
): Promise<{ items: CaldeirariaItemDTO[]; nextLink?: string; fromDataverse: boolean }> {
  try {
    const clauses: string[] = [
      `(${F_CONTROLE.xxStatus} eq null or ${F_CONTROLE.xxStatus} ne 'Inativo')`,
      `(${F_CONTROLE.pecas} ne 'Balanceamento')`,
    ];

    if (p.filial && p.filial !== "Todas") {
      clauses.push(`${F_CONTROLE.unidade} eq '${esc(p.filial)}'`);
    }

    if (p.status === "pendentes") {
      clauses.push(`(${F_CONTROLE.status} ne 'Concluído' and ${F_CONTROLE.status} ne 'Suspenso')`);
    } else if (p.status === "concluidos") {
      clauses.push(`${F_CONTROLE.status} eq 'Concluído'`);
    } else if (p.status === "suspensos") {
      clauses.push(`${F_CONTROLE.status} eq 'Suspenso'`);
    }

    if (p.regime) {
      clauses.push(`${F_CONTROLE.regime} eq '${esc(p.regime)}'`);
    }

    if (p.os) {
      clauses.push(`contains(${F_CONTROLE.os},'${esc(p.os)}')`);
    }

    if (p.search) {
      const s = esc(p.search);
      clauses.push(
        `(contains(${F_CONTROLE.os},'${s}') or contains(${F_CONTROLE.pecas},'${s}') or contains(${F_CONTROLE.servicos},'${s}') or contains(${F_CONTROLE.inseridoPor},'${s}') or contains(${F_CONTROLE.concluidoPor},'${s}'))`,
      );
    }

    const { value, nextLink } = await dataverse.list<Record<string, unknown>>(
      CALDEIRARIA_CONTROLE_SET,
      {
        select: SELECT_CONTROLE,
        filter: clauses.join(" and "),
        orderby: `${F_CONTROLE.dataEnvio} desc, createdon desc`,
        top: p.top ?? 150,
      },
    );

    return {
      items: value
        .map(toItemDTO)
        .filter((i) => i.pecas?.trim().toLowerCase() !== "balanceamento"),
      nextLink,
      fromDataverse: true,
    };
  } catch {
    // Fallback gracioso para desenvolvimento local / offline
    let items = localMockItens.filter(
      (i) => i.pecas?.trim().toLowerCase() !== "balanceamento",
    );

    if (p.filial && p.filial !== "Todas") {
      items = items.filter((i) => i.unidade?.toLowerCase() === p.filial?.toLowerCase());
    }

    if (p.status === "pendentes") {
      items = items.filter((i) => i.status !== "Concluído" && i.status !== "Suspenso");
    } else if (p.status === "concluidos") {
      items = items.filter((i) => i.status === "Concluído");
    } else if (p.status === "suspensos") {
      items = items.filter((i) => i.status === "Suspenso");
    }

    if (p.regime) {
      items = items.filter((i) => i.regime === p.regime);
    }

    if (p.os) {
      items = items.filter((i) => i.os.toLowerCase().includes(p.os!.toLowerCase()));
    }

    if (p.search) {
      const s = p.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.os.toLowerCase().includes(s) ||
          i.pecas.toLowerCase().includes(s) ||
          (i.servicos && i.servicos.toLowerCase().includes(s)) ||
          (i.inseridoPor && i.inseridoPor.toLowerCase().includes(s)) ||
          (i.concluidoPor && i.concluidoPor.toLowerCase().includes(s)),
      );
    }

    items.sort((a, b) => new Date(b.dataEnvio ?? 0).getTime() - new Date(a.dataEnvio ?? 0).getTime());

    return {
      items,
      fromDataverse: false,
    };
  }
}

export async function getCaldeirariaItem(id: string): Promise<CaldeirariaItemDTO | null> {
  try {
    const raw = await dataverse.get<Record<string, unknown>>(CALDEIRARIA_CONTROLE_SET, id, {
      select: SELECT_CONTROLE,
    });
    return raw ? toItemDTO(raw) : null;
  } catch {
    const found = localMockItens.find((i) => i.id === id);
    return found ?? null;
  }
}

export type CreateCaldeirariaItemInput = {
  os: string;
  pecas: string;
  servicos?: string;
  prazo?: number;
  regime?: "Normal" | "Prioridade";
  unidade?: string;
  inseridoPor?: string;
  dataEnvio?: string;
  imagemReferencia?: string;
};

export async function createCaldeirariaItem(
  input: CreateCaldeirariaItemInput,
): Promise<CaldeirariaItemDTO> {
  const now = new Date();
  const dataEnvioIso = input.dataEnvio || now.toISOString();
  
  const prazoDias = input.prazo ?? 3;
  const dataPrazo = new Date(new Date(dataEnvioIso).getTime() + prazoDias * 24 * 3600 * 1000);

  const payload: Record<string, unknown> = {
    [F_CONTROLE.os]: input.os.trim(),
    [F_CONTROLE.pecas]: input.pecas.trim(),
    [F_CONTROLE.servicos]: input.servicos?.trim() || null,
    [F_CONTROLE.prazo]: prazoDias,
    [F_CONTROLE.regime]: input.regime || "Normal",
    [F_CONTROLE.status]: "Pendente",
    [F_CONTROLE.xxStatus]: "Ativo",
    [F_CONTROLE.unidade]: input.unidade || "São Luís",
    [F_CONTROLE.inseridoPor]: input.inseridoPor || null,
    [F_CONTROLE.dataEnvio]: dataEnvioIso,
    [F_CONTROLE.dataPrazo]: dataPrazo.toISOString(),
  };

  if (input.imagemReferencia) {
    payload[F_CONTROLE.imagemReferencia] = input.imagemReferencia;
  }

  try {
    const created = await dataverse.create<Record<string, unknown>>(
      CALDEIRARIA_CONTROLE_SET,
      payload,
    );
    return toItemDTO(created);
  } catch {
    const newItem: CaldeirariaItemDTO = {
      id: `cald-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      os: input.os.trim(),
      pecas: input.pecas.trim(),
      servicos: input.servicos?.trim() || null,
      prazo: prazoDias,
      regime: input.regime || "Normal",
      status: "Pendente",
      xxStatus: "Ativo",
      unidade: input.unidade || "São Luís",
      inseridoPor: input.inseridoPor || "Operador",
      concluidoPor: null,
      dataEnvio: dataEnvioIso,
      dataPrazo: dataPrazo.toISOString(),
      dataConclusao: null,
      dataModificacao: null,
      comentario: null,
      imagemReferencia: input.imagemReferencia || null,
      evidencia: null,
      createdon: now.toISOString(),
      modifiedon: now.toISOString(),
    };
    localMockItens.unshift(newItem);
    return newItem;
  }
}

export type UpdateCaldeirariaItemInput = {
  status?: "Pendente" | "Concluído" | "Suspenso";
  concluidoPor?: string;
  dataConclusao?: string;
  evidencia?: string;
  comentario?: string;
  dataModificacao?: string;
  prazo?: number;
  regime?: "Normal" | "Prioridade";
  servicos?: string;
  pecas?: string;
  os?: string;
};

export async function updateCaldeirariaItem(
  id: string,
  input: UpdateCaldeirariaItemInput,
): Promise<CaldeirariaItemDTO> {
  const payload: Record<string, unknown> = {};

  if (input.status !== undefined) payload[F_CONTROLE.status] = input.status;
  if (input.concluidoPor !== undefined) payload[F_CONTROLE.concluidoPor] = input.concluidoPor;
  if (input.dataConclusao !== undefined) payload[F_CONTROLE.dataConclusao] = input.dataConclusao;
  if (input.evidencia !== undefined) payload[F_CONTROLE.evidencia] = input.evidencia;
  if (input.comentario !== undefined) payload[F_CONTROLE.comentario] = input.comentario;
  if (input.dataModificacao !== undefined) payload[F_CONTROLE.dataModificacao] = input.dataModificacao;
  if (input.prazo !== undefined) payload[F_CONTROLE.prazo] = input.prazo;
  if (input.regime !== undefined) payload[F_CONTROLE.regime] = input.regime;
  if (input.servicos !== undefined) payload[F_CONTROLE.servicos] = input.servicos;
  if (input.pecas !== undefined) payload[F_CONTROLE.pecas] = input.pecas;
  if (input.os !== undefined) payload[F_CONTROLE.os] = input.os;

  try {
    const updated = await dataverse.update<Record<string, unknown>>(
      CALDEIRARIA_CONTROLE_SET,
      id,
      payload,
    );
    return toItemDTO(updated);
  } catch {
    const idx = localMockItens.findIndex((i) => i.id === id);
    if (idx === -1) {
      throw new Error(`Item ${id} não encontrado`);
    }
    const current = localMockItens[idx]!;
    const updated: CaldeirariaItemDTO = {
      ...current,
      ...input,
      modifiedon: new Date().toISOString(),
    };
    localMockItens[idx] = updated;
    return updated;
  }
}

// -------------------------------------------------------------
// Catálogo Padronizado de Peças (cr4a1_caldeiraria_lista)
// -------------------------------------------------------------

export async function listCaldeirariaPecas(): Promise<CaldeirariaPecaDTO[]> {
  try {
    const { value } = await dataverse.list<Record<string, unknown>>(CALDEIRARIA_LISTA_SET, {
      select: SELECT_LISTA,
      filter: `(${F_LISTA.pecas} ne 'Balanceamento')`,
      orderby: `${F_LISTA.pecas} asc`,
      top: 500,
    });
    return value
      .map(toPecaDTO)
      .filter((p) => p.pecas.trim().toLowerCase() !== "balanceamento");
  } catch {
    return localMockPecas
      .filter((p) => p.pecas.trim().toLowerCase() !== "balanceamento")
      .sort((a, b) => a.pecas.localeCompare(b.pecas));
  }
}

export async function createCaldeirariaPeca(nomePeca: string): Promise<CaldeirariaPecaDTO> {
  const nome = nomePeca.trim();
  if (!nome) throw new Error("Nome da peça é obrigatório");

  try {
    const created = await dataverse.create<Record<string, unknown>>(CALDEIRARIA_LISTA_SET, {
      [F_LISTA.pecas]: nome,
    });
    return toPecaDTO(created);
  } catch {
    const newPeca: CaldeirariaPecaDTO = {
      id: `peca-${Date.now()}`,
      pecas: nome,
    };
    localMockPecas.push(newPeca);
    return newPeca;
  }
}

export async function removeCaldeirariaPeca(id: string): Promise<void> {
  try {
    await dataverse.remove(CALDEIRARIA_LISTA_SET, id);
  } catch {
    localMockPecas = localMockPecas.filter((p) => p.id !== id);
  }
}

// -------------------------------------------------------------
// KPIs e Contagens Agregadas
// -------------------------------------------------------------

export type CaldeirariaKpis = {
  totalPendentes: number;
  totalPrioridade: number;
  totalSuspensos: number;
  totalConcluidos: number;
  totalOSComPendencia: number;
  concluidosNoPrazoPercent: number;
};

export async function getCaldeirariaKpis(filial?: string): Promise<CaldeirariaKpis> {
  const res = await listCaldeirariaItens({ filial, top: 1000 });
  const all = res.items;

  const pendentes = all.filter((i) => i.status !== "Concluído" && i.status !== "Suspenso");
  const prioritarios = pendentes.filter((i) => i.regime === "Prioridade");
  const suspensos = all.filter((i) => i.status === "Suspenso");
  const concluidos = all.filter((i) => i.status === "Concluído");

  const osComPendencia = new Set(pendentes.map((i) => i.os)).size;

  let noPrazo = 0;
  for (const c of concluidos) {
    if (c.dataConclusao && c.dataPrazo) {
      if (new Date(c.dataConclusao).getTime() <= new Date(c.dataPrazo).getTime()) {
        noPrazo++;
      }
    } else {
      noPrazo++;
    }
  }

  const concluidosNoPrazoPercent =
    concluidos.length > 0 ? Math.round((noPrazo / concluidos.length) * 100) : 100;

  return {
    totalPendentes: pendentes.length,
    totalPrioridade: prioritarios.length,
    totalSuspensos: suspensos.length,
    totalConcluidos: concluidos.length,
    totalOSComPendencia: osComPendencia,
    concluidosNoPrazoPercent,
  };
}
