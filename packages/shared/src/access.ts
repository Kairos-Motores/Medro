/**
 * Modelo de acesso do Medro (login próprio via tabela `Credenciaiss`).
 * Os tokens abaixo são os encontrados no código PowerApps (ver docs/04-navegacao-e-permissoes.md).
 * A legenda é inferência — confirmar a lista oficial com a equipe Kairós.
 */

export const FILIAIS = [
  "São Luís",
  "Aveiro",
  "Barcarena",
  "Parauapebas",
  "São José dos Campos",
] as const;
export type Filial = (typeof FILIAIS)[number];

/** Tokens de módulo (macro-acesso) presentes em `Credenciaiss.acesso_mod`. */
export const MODULE_TOKENS = {
  OS: "Módulo OS Medro",
  GER: "Gerenciamento / PCP",
  AVA: "Avaliação Final",
  CAL: "Caldeiraria",
  DPT: "Departamento Técnico",
  ESCOPO: "Escopo de Manutenção",
  FER: "Ferramentaria",
  INS: "Inspeção de Qualidade",
  QRL: "QR Code / Laudos",
  ROT: "Rotas / Trajetos",
  SPO: "Serviços Externos Portugal",
  TER: "Terceirizados",
  TES: "Testes / Ensaio",
} as const;
export type ModuleToken = keyof typeof MODULE_TOKENS;

/** Tokens de ação fina (sub-permissões). */
export const ACTION_TOKENS = {
  _AVA_LIB: "Avaliação: liberar",
  _CAL_CAD: "Caldeiraria: cadastrar",
  _DPT_REMOVE: "DPT: remover",
  _DTI_LINK: "DPT: gerar link",
  _G_CAD: "Gerência: cadastro",
  _G_LOG: "Gerência: log",
  _G_PCP: "Gerência: PCP",
  _LOG_CHE: "Login checklist",
  _OS_EDOS: "OS: editar OS",
  _OS_EDIT_HIST: "OS: editar histórico",
  _OS_HG: "OS: histórico",
  _OS_PESQ: "OS: pesquisar",
  _OS_REP: "OS: reprovar",
  _OS_REMOVE: "OS: remover",
  _OS_SENHA: "OS: senha",
  _PCP_RQ: "PCP: requisição",
  _QRL_ALL: "QR/Laudos: acesso total",
  _TER_CAD: "Terceirizados: cadastrar",
  _ROTA_MOT: "Rota: motorista",
  _ROTA_AUX: "Rota: auxiliar",
} as const;
export type ActionToken = keyof typeof ACTION_TOKENS;

export type AccessToken = ModuleToken | ActionToken;

/** Réplica de `"TOKEN" in acesso_mod` do Power Fx (substring, case-sensitive). */
export function hasAccess(acessoMod: string | null | undefined, token: AccessToken): boolean {
  return !!acessoMod && acessoMod.includes(token);
}

/** Sessão do usuário autenticado (deriva de `Credenciaiss`). */
export interface UserSession {
  login: string; // Credenciaiss.Usuário  (varlogin)
  nome: string; // Credenciaiss.Título    (varnome)
  filial: Filial | string; // Credenciaiss.Filial (varfilial)
  funcao: string | null; // Credenciaiss.Função
  setor: string | null; // Credenciaiss.xSetor
  matProtheus: string | null; // Credenciaiss.Mat_Protheus
  acessoMod: string; // Credenciaiss.acesso_mod (bruto — RBAC dos módulos)
  echoeMod: string | null; // Credenciaiss.echoe_mod (RBAC estendido)
  menuMedro: string | null; // Credenciaiss.MenuMedro
  acesso: string | null; // Credenciaiss.Acesso  (ex.: "SSMA")
  nivel1: string | null; // Credenciaiss.1_Nivel
  nivel2: string | null; // Credenciaiss.2_Nivel
  nivel3: string | null; // Credenciaiss.3_Nivel
  nivelAcesso: string | null; // Credenciaiss.nivel_acesso
  temFoto: boolean; // há imagem em cr4a1_imgperfil
  credencialId: string; // GUID da linha em Credenciaiss
}
