import { dataverse } from "../services/dataverse/client.js";
import type { UserSession } from "@medro/shared";

/**
 * Login próprio contra a tabela Dataverse `Credenciaiss` (cr4a1_credenciais).
 * Réplica de Login.OnSelect do PowerApps:
 *   LookUp(Credenciaiss, Usuário = user And Matrícula = senha And xstatus = "Ativo")
 *
 * ⚠️  `Matrícula` guarda a senha em texto no Dataverse. A comparação é feita
 * server-side; nunca retornar esse campo ao cliente. Rate-limit no route.
 *
 * Os campos de permissão (`acesso_mod`, `echoe_mod`, níveis, filial, setor) são
 * carregados na sessão para que "quem vê o quê" continue valendo no front e na API.
 */

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
  menuMedro: "cr4a1_menumedro",
  acesso: "cr4a1_acesso",
  nivel1: "cr4a1__x0031__nivel",
  nivel2: "cr4a1__x0032__nivel",
  nivel3: "cr4a1__x0033__nivel",
  nivelAcesso: "cr4a1_nivel_acesso",
  fotoUrl: "cr4a1_imgperfil_url",
} as const;

function esc(v: string): string {
  return v.replace(/'/g, "''");
}

const SESSION_SELECT = [
  COL.id, COL.usuario, COL.titulo, COL.filial, COL.funcao, COL.setor, COL.matProtheus,
  COL.acessoMod, COL.echoeMod, COL.menuMedro, COL.acesso,
  COL.nivel1, COL.nivel2, COL.nivel3, COL.nivelAcesso, COL.fotoUrl, "cr4a1_imgperfil",
];

function rowToSession(row: Record<string, string | null>, usuario: string): UserSession {
  return {
    login: row[COL.usuario] ?? usuario,
    nome: row[COL.titulo] ?? "",
    filial: row[COL.filial] ?? "",
    funcao: row[COL.funcao] ?? null,
    setor: row[COL.setor] ?? null,
    matProtheus: row[COL.matProtheus] ?? null,
    acessoMod: row[COL.acessoMod] ?? "",
    echoeMod: row[COL.echoeMod] ?? null,
    menuMedro: row[COL.menuMedro] ?? null,
    acesso: row[COL.acesso] ?? null,
    nivel1: row[COL.nivel1] ?? null,
    nivel2: row[COL.nivel2] ?? null,
    nivel3: row[COL.nivel3] ?? null,
    nivelAcesso: row[COL.nivelAcesso] ?? null,
    temFoto: !!row[COL.fotoUrl] || !!row["cr4a1_imgperfil"],
    credencialId: row[COL.id] ?? "",
  };
}

/** Login: valida usuário + senha (Matrícula) + xstatus Ativo. */
export async function authenticate(usuario: string, senha: string): Promise<UserSession | null> {
  const filter = `${COL.usuario} eq '${esc(usuario)}' and ${COL.matricula} eq '${esc(
    senha,
  )}' and ${COL.xstatus} eq 'Ativo'`;
  const { value } = await dataverse.list<Record<string, string | null>>(ENTITY_SET, {
    filter,
    select: SESSION_SELECT,
    top: 1,
  });
  const row = value[0];
  return row ? rowToSession(row, usuario) : null;
}

/** DEV: sessão só pelo usuário (sem senha). Usado por /api/auth/dev-login. */
export async function sessionByUsuario(usuario: string): Promise<UserSession | null> {
  const { value } = await dataverse.list<Record<string, string | null>>(ENTITY_SET, {
    filter: `${COL.usuario} eq '${esc(usuario)}' and ${COL.xstatus} eq 'Ativo'`,
    select: SESSION_SELECT,
    top: 1,
  });
  const row = value[0];
  return row ? rowToSession(row, usuario) : null;
}

/** stream binário da foto de perfil (cr4a1_imgperfil) da credencial. */
export async function getFotoPerfil(credencialId: string): Promise<ArrayBuffer | null> {
  return dataverse.getFileValue(`${ENTITY_SET}(${credencialId})/cr4a1_imgperfil/$value`);
}
