import { dataverse } from "./client.js";

const ENTITY_SET = "cr4a1_credenciaises";

const COL = {
  id: "cr4a1_credenciaisid",
  usuario: "cr4a1_usu_x00e1_rio",
  matricula: "cr4a1_matr_x00ed_cula",
  xstatus: "cr4a1_xstatus",
  titulo: "cr4a1_title",
  filial: "cr4a1_filial",
  funcao: "cr4a1_fun_x00e7__x00e3_o",
  setor: "cr4a1_xsetor",
  matProtheus: "cr4a1_mat_protheus",
  acessoMod: "cr4a1_acesso_mod",
  echoeMod: "cr4a1_echoe_mod",
} as const;

const SELECT_USUARIOS = [
  COL.id,
  COL.usuario,
  COL.titulo,
  COL.filial,
  COL.funcao,
  COL.setor,
  COL.matProtheus,
  COL.acessoMod,
  COL.xstatus,
];

export interface UsuarioDTO {
  id: string;
  nome: string;
  login: string;
  filial: string;
  cargo: string;
  setor: string;
  matProtheus: string;
  acessoMod: string;
  permissoes: string[];
  status: string;
}

import { parseAccessTokens } from "@medro/shared";

export function parsePermissoes(acessoMod: string | null | undefined): string[] {
  return Array.from(parseAccessTokens(acessoMod));
}

export function formatAcessoMod(permissoes: string[]): string {
  return Array.from(new Set(permissoes.filter(Boolean))).join(", ");
}

function toDTO(row: Record<string, unknown>): UsuarioDTO {
  const acessoMod = (row[COL.acessoMod] as string) || "";
  return {
    id: (row[COL.id] as string) || "",
    nome: (row[COL.titulo] as string) || (row[COL.usuario] as string) || "Sem Nome",
    login: (row[COL.usuario] as string) || "",
    filial: (row[COL.filial] as string) || "São Luís",
    cargo: (row[COL.funcao] as string) || "Colaborador",
    setor: (row[COL.setor] as string) || "Geral",
    matProtheus: (row[COL.matProtheus] as string) || "",
    acessoMod,
    permissoes: parsePermissoes(acessoMod),
    status: (row[COL.xstatus] as string) || "Ativo",
  };
}

const esc = (s: string) => s.replace(/'/g, "''");

// Banco em memória para fallback/testes offline
let localMockUsuarios: UsuarioDTO[] = [
  {
    id: "usr-1",
    nome: "Rodrigo de Paula Nascimento",
    login: "rodrigo.paula",
    filial: "São Luís",
    cargo: "Administrador / Sistema",
    setor: "TI / Gestão",
    matProtheus: "010245",
    acessoMod: "OS, DPT, AVA, INS, TES, CAL, FER, SSMA, TER, GER, ESCOPO, _OS_EDOS, _DTI_LINK, _AVA_LIB",
    permissoes: ["OS", "DPT", "AVA", "INS", "TES", "CAL", "FER", "SSMA", "TER", "GER", "ESCOPO", "_OS_EDOS", "_DTI_LINK", "_AVA_LIB"],
    status: "Ativo",
  },
  {
    id: "usr-2",
    nome: "Carlos Eduardo Silva",
    login: "carlos.silva",
    filial: "São Luís",
    cargo: "Mecânico Líder",
    setor: "Oficina Mecânica",
    matProtheus: "010189",
    acessoMod: "OS, CAL, FER, _OS_EDOS, _CAL_CAD",
    permissoes: ["OS", "CAL", "FER", "_OS_EDOS", "_CAL_CAD"],
    status: "Ativo",
  },
  {
    id: "usr-3",
    nome: "António Manuel Ribeiro",
    login: "antonio.ribeiro",
    filial: "Aveiro",
    cargo: "Responsável Oficina PT",
    setor: "Produção",
    matProtheus: "030088",
    acessoMod: "OS, DPT, AVA, INS, TES, FER, _OS_EDOS, _AVA_LIB, _DTI_LINK",
    permissoes: ["OS", "DPT", "AVA", "INS", "TES", "FER", "_OS_EDOS", "_AVA_LIB", "_DTI_LINK"],
    status: "Ativo",
  },
  {
    id: "usr-4",
    nome: "Marcos Antônio Ferreira",
    login: "marcos.ferreira",
    filial: "Parauapebas",
    cargo: "Inspetor de Qualidade",
    setor: "Controle de Qualidade",
    matProtheus: "020412",
    acessoMod: "OS, AVA, INS, TES, _AVA_LIB, _OS_REP",
    permissoes: ["OS", "AVA", "INS", "TES", "_AVA_LIB", "_OS_REP"],
    status: "Ativo",
  },
  {
    id: "usr-5",
    nome: "Fabiana Soares Costa",
    login: "fabiana.costa",
    filial: "Barcarena",
    cargo: "Supervisora Usinagem e Caldeiraria",
    setor: "Usinagem",
    matProtheus: "040115",
    acessoMod: "OS, CAL, FER, TER, _CAL_CAD, _TER_CAD",
    permissoes: ["OS", "CAL", "FER", "TER", "_CAL_CAD", "_TER_CAD"],
    status: "Ativo",
  },
  {
    id: "usr-6",
    nome: "Lucas Gabriel Mendes",
    login: "lucas.mendes",
    filial: "São José dos Campos",
    cargo: "Técnico de Ensaios",
    setor: "Laboratório Elétrico",
    matProtheus: "050230",
    acessoMod: "OS, TES, AVA",
    permissoes: ["OS", "TES", "AVA"],
    status: "Ativo",
  },
  {
    id: "usr-7",
    nome: "Juliana Rocha Martins",
    login: "juliana.martins",
    filial: "São Luís",
    cargo: "Engenheira / Laudos DPT",
    setor: "Departamento Técnico",
    matProtheus: "010372",
    acessoMod: "OS, DPT, INS, _DTI_LINK",
    permissoes: ["OS", "DPT", "INS", "_DTI_LINK"],
    status: "Ativo",
  },
  {
    id: "usr-8",
    nome: "Bruno Henrique Alves",
    login: "bruno.alves",
    filial: "São Luís",
    cargo: "Especialista em Bobinagem",
    setor: "Bobinagem",
    matProtheus: "010411",
    acessoMod: "OS, INS, TES",
    permissoes: ["OS", "INS", "TES"],
    status: "Ativo",
  },
  {
    id: "usr-9",
    nome: "Daniel Oliveira Santos",
    login: "daniel.santos",
    filial: "Aveiro",
    cargo: "Técnico Mecânico PT",
    setor: "Mecânica",
    matProtheus: "030104",
    acessoMod: "OS, CAL, FER",
    permissoes: ["OS", "CAL", "FER"],
    status: "Ativo",
  },
  {
    id: "usr-10",
    nome: "Patrícia Lima Souza",
    login: "patricia.souza",
    filial: "Parauapebas",
    cargo: "Coordenadora SSMA",
    setor: "Segurança e Meio Ambiente",
    matProtheus: "020556",
    acessoMod: "SSMA, TER",
    permissoes: ["SSMA", "TER"],
    status: "Ativo",
  },
  {
    id: "usr-11",
    nome: "Thiago Moreira Silva",
    login: "thiago.moreira",
    filial: "Barcarena",
    cargo: "Caldeireiro Soldador",
    setor: "Caldeiraria",
    matProtheus: "040228",
    acessoMod: "OS, CAL",
    permissoes: ["OS", "CAL"],
    status: "Ativo",
  },
  {
    id: "usr-12",
    nome: "Amanda Cristine Ramos",
    login: "amanda.ramos",
    filial: "São José dos Campos",
    cargo: "Laboratório de Ensaios",
    setor: "Ensaios",
    matProtheus: "050312",
    acessoMod: "TES, AVA, INS, _AVA_LIB",
    permissoes: ["TES", "AVA", "INS", "_AVA_LIB"],
    status: "Ativo",
  },
  {
    id: "usr-13",
    nome: "Rafael Costa Peixoto",
    login: "rafael.peixoto",
    filial: "São Luís",
    cargo: "Almoxarife / Ferramentaria",
    setor: "Almoxarifado",
    matProtheus: "010567",
    acessoMod: "FER",
    permissoes: ["FER"],
    status: "Ativo",
  },
  {
    id: "usr-14",
    nome: "Gabriel Silva Nogueira",
    login: "gabriel.nogueira",
    filial: "Aveiro",
    cargo: "Perito Técnico PT",
    setor: "Peritagem",
    matProtheus: "030219",
    acessoMod: "OS, AVA, DPT, _DTI_LINK",
    permissoes: ["OS", "AVA", "DPT", "_DTI_LINK"],
    status: "Ativo",
  },
  {
    id: "usr-15",
    nome: "Eduardo Farias Ramos",
    login: "eduardo.ramos",
    filial: "São Luís",
    cargo: "Técnico de Campo",
    setor: "Serviços de Campo",
    matProtheus: "010643",
    acessoMod: "SSMA, OS",
    permissoes: ["SSMA", "OS"],
    status: "Ativo",
  },
];

export async function listUsuarios(p?: {
  filial?: string;
  search?: string;
  incluirInativos?: boolean;
}): Promise<{ usuarios: UsuarioDTO[]; fromDataverse: boolean }> {
  try {
    const clauses: string[] = [];

    if (!p?.incluirInativos) {
      clauses.push(`(${COL.xstatus} eq null or ${COL.xstatus} ne 'Inativo')`);
    }

    if (p?.filial && p.filial !== "Todas") {
      clauses.push(`${COL.filial} eq '${esc(p.filial)}'`);
    }

    if (p?.search) {
      const s = esc(p.search);
      clauses.push(
        `(contains(${COL.titulo},'${s}') or contains(${COL.usuario},'${s}') or contains(${COL.funcao},'${s}') or contains(${COL.matProtheus},'${s}'))`,
      );
    }

    const { value } = await dataverse.list<Record<string, unknown>>(ENTITY_SET, {
      select: SELECT_USUARIOS,
      filter: clauses.length ? clauses.join(" and ") : undefined,
      orderby: `${COL.titulo} asc`,
      top: 500,
    });

    return {
      usuarios: value.map(toDTO),
      fromDataverse: true,
    };
  } catch {
    let items = [...localMockUsuarios];
    if (p?.filial && p.filial !== "Todas") {
      items = items.filter((u) => u.filial.toLowerCase() === p.filial?.toLowerCase());
    }
    if (p?.search) {
      const s = p.search.toLowerCase();
      items = items.filter(
        (u) =>
          u.nome.toLowerCase().includes(s) ||
          u.login.toLowerCase().includes(s) ||
          u.cargo.toLowerCase().includes(s) ||
          u.matProtheus.toLowerCase().includes(s),
      );
    }
    return {
      usuarios: items,
      fromDataverse: false,
    };
  }
}

export async function updateUsuarioPermissoes(
  id: string,
  permissoes: string[],
): Promise<{ id: string; permissoes: string[]; acessoMod: string }> {
  const acessoMod = formatAcessoMod(permissoes);

  try {
    await dataverse.update(ENTITY_SET, id, {
      [COL.acessoMod]: acessoMod,
    });
    return { id, permissoes, acessoMod };
  } catch {
    const idx = localMockUsuarios.findIndex((u) => u.id === id);
    if (idx >= 0) {
      localMockUsuarios[idx]!.acessoMod = acessoMod;
      localMockUsuarios[idx]!.permissoes = permissoes;
      return { id, permissoes, acessoMod };
    }
    throw new Error("Usuário não encontrado.");
  }
}

export async function createUsuario(data: {
  nome: string;
  login: string;
  senha?: string;
  filial: string;
  cargo?: string;
  setor?: string;
  matProtheus?: string;
  permissoes: string[];
}): Promise<UsuarioDTO> {
  const acessoMod = formatAcessoMod(data.permissoes);

  const payload: Record<string, unknown> = {
    [COL.titulo]: data.nome.trim(),
    [COL.usuario]: data.login.trim().toLowerCase(),
    [COL.filial]: data.filial,
    [COL.funcao]: data.cargo?.trim() || "Colaborador",
    [COL.setor]: data.setor?.trim() || "Geral",
    [COL.matProtheus]: data.matProtheus?.trim() || "",
    [COL.acessoMod]: acessoMod,
    [COL.xstatus]: "Ativo",
  };

  if (data.senha) {
    payload[COL.matricula] = data.senha;
  }

  try {
    const created = await dataverse.create<Record<string, unknown>>(ENTITY_SET, payload);
    return toDTO(created);
  } catch {
    const newUsr: UsuarioDTO = {
      id: `usr-${Date.now()}`,
      nome: data.nome.trim(),
      login: data.login.trim().toLowerCase(),
      filial: data.filial,
      cargo: data.cargo?.trim() || "Colaborador",
      setor: data.setor?.trim() || "Geral",
      matProtheus: data.matProtheus?.trim() || "",
      acessoMod,
      permissoes: data.permissoes,
      status: "Ativo",
    };
    localMockUsuarios.unshift(newUsr);
    return newUsr;
  }
}

export async function removeUsuario(id: string): Promise<void> {
  try {
    await dataverse.update(ENTITY_SET, id, {
      [COL.xstatus]: "Inativo",
      [COL.acessoMod]: "",
    });
  } catch {
    const idx = localMockUsuarios.findIndex((u) => u.id === id);
    if (idx >= 0) {
      localMockUsuarios[idx]!.status = "Inativo";
      localMockUsuarios[idx]!.permissoes = [];
      localMockUsuarios[idx]!.acessoMod = "";
    }
  }
}
