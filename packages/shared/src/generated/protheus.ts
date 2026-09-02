// ⚠️  ARQUIVO GERADO por tooling/codegen — não editar à mão.
// Fonte: docs/_data/data-model.json  ·  regenerar: pnpm codegen
// tabelas SQL/Protheus — tipos e metadados

import { z } from "zod";

/** ZB6010 · dataset `45.6.153.1%2c37000,CZLS4F_136240_PR_PD` */
export interface ZB6010Row {
  ZB6_FILIAL?: string | null;
  ZB6_ORDEM?: string | null;
  ZB6_OSKAIR?: string | null;
  ZB6_CONTAT?: string | null;
  ZB6_DATARE?: string | null;
  ZB6_NFCLIE?: string | null;
  ZB6_EMISSA?: string | null;
  ZB6_DESCNF?: string | null;
  ZB6_PRODUT?: string | null;
  ZB6_SERIE?: string | null;
  ZB6_EQUIPA?: string | null;
  ZB6_FABRIC?: string | null;
  ZB6_CV?: string | null;
  ZB6_KW?: string | null;
  ZB6_TENSAO?: string | null;
  ZB6_POLOS?: string | null;
  ZB6_CARCAC?: string | null;
  ZB6_FC?: string | null;
  ZB6_OM?: string | null;
  ZB6_PROPOS?: string | null;
  ZB6_FORA?: string | null;
  ZB6_DTENVI?: string | null;
  ZB6_DTAUTO?: string | null;
  ZB6_TIPOSE?: string | null;
  ZB6_PRIORI?: string | null;
  ZB6_NFDEVO?: string | null;
  ZB6_DTNFDV?: string | null;
  ZB6_PRAZO?: string | null;
  ZB6_DTENTR?: string | null;
  ZB6_NFSERV?: string | null;
  ZB6_DTNFSV?: string | null;
  ZB6_NFPROD?: string | null;
  ZB6_DTNFPR?: string | null;
  ZB6_NUMMED?: string | null;
  ZB6_VLRMAT?: number | null;
  ZB6_VLRSER?: number | null;
  ZB6_ENVMED?: string | null;
  ZB6_DTRECP?: string | null;
  ZB6_DTLTF?: string | null;
  ZB6_PEDIDO?: string | null;
  ZB6_TAG?: string | null;
  ZB6_TOTPRO?: number | null;
  ZB6_STACOM?: string | null;
  ZB6_XNISAP?: string | null;
  D_E_L_E_T_?: string | null;
  R_E_C_N_O_?: number | null;
  R_E_C_D_E_L_?: number | null;
  ZB6_OMMMMM?: string | null;
  ZB6_DTPVEN?: string | null;
  ZB6_NOMCLI?: string | null;
  ZB6_DATENV?: string | null;
  ZB6_DPECA?: string | null;
  ZB6_ENVP?: string | null;
  ZB6_AREA?: string | null;
  ZB6_OBSTEC?: string | null;
  ZB6_DTCADA?: string | null;
  ZB6_PROBLE?: string | null;
  ZB6_DESSTA?: string | null;
  ZB6_DTDINF?: string | null;
  ZB6_DIRAPR?: string | null;
  ZB6_PCSERV?: string | null;
  ZB6_CODEQ?: string | null;
  ZB6_PDNFRE?: string | null;
  ZB6_PRAZC?: string | null;
  ZB6_USERGI?: string | null;
  ZB6_USERGA?: string | null;
  ZB6_XHP?: string | null;
  ZB6_XKVA?: string | null;
  ZB6_TAGKAI?: string | null;
  ZB6_NFSER2?: string | null;
  ZB6_DTNFS2?: string | null;
  ZB6_NFPRO2?: string | null;
  ZB6_DTNFP2?: string | null;
  ZB6_NFPRO3?: string | null;
  ZB6_DTNFP3?: string | null;
  ZB6_DESSER?: string | null;
  ZB6_XBMC?: string | null;
  ZB6_XPROPC?: string | null;
  ZB6_XPREVS?: string | null;
  ZB6_XDTPRS?: string | null;
  ZB6_XPREVF?: string | null;
  ZB6_XDTPRE?: string | null;
  ZB6_XDTPSE?: string | null;
  ZB6_XDTPMA?: string | null;
  ZB6_VLMATC?: number | null;
  ZB6_VLSERC?: number | null;
  ZB6_NFSER3?: string | null;
  ZB6_NFSER4?: string | null;
  ZB6_NFSER5?: string | null;
  ZB6_NFSER6?: string | null;
  ZB6_DTNFS3?: string | null;
  ZB6_DTNFS4?: string | null;
  ZB6_DTNFS5?: string | null;
  ZB6_DTNFS6?: string | null;
  ZB6_CONTRA?: string | null;
  ZB6_XTEMPO?: string | null;
  ZB6_CLIENT?: string | null;
  ZB6_LOJA?: string | null;
  ZB6_XNPDCM?: string | null;
  ZB6_XNPDCS?: string | null;
  ZB6_XPRMPC?: string | null;
  ZB6_XDTPRM?: string | null;
  ZB6_XPRSPC?: string | null;
  ZB6_XDTPRF?: string | null;
  ZB6_XCOR?: string | null;
  ZB6_XNUMRE?: string | null;
  ZB6_VLNFS?: number | null;
  ZB6_VLNFM?: number | null;
  ZB6_VLNFS1?: number | null;
  ZB6_VLNFS2?: number | null;
  ZB6_VLNFS3?: number | null;
  ZB6_VLNFS4?: number | null;
  ZB6_VLNFS5?: number | null;
  ZB6_VLNFM1?: number | null;
  ZB6_VLNFM2?: number | null;
  ZB6_XAPSPC?: string | null;
  ZB6_XDTCOR?: string | null;
  ZB6_NFPRO4?: string | null;
  ZB6_DTNFP4?: string | null;
  ZB6_VLNFM4?: number | null;
  ZB6_NFPRO5?: string | null;
  ZB6_DTNFP5?: string | null;
  ZB6_VLNFM5?: number | null;
  ZB6_NFPRO6?: string | null;
  ZB6_DTNFP6?: string | null;
  ZB6_VLNFM6?: number | null;
  ZB6_XHISTO?: string | null;
  ZB6_XDTREC?: string | null;
  ZB6_VLRIVA?: number | null;
  ZB6_NGT?: string | null;
  ZB6_RESPEN?: string | null;
  ZB6_ENTRDT?: string | null;
  ZB6_XVLRIV?: number | null;
  ZB6_NNE?: string | null;
  ZB6_ENVIO?: string | null;
  ZB6_XOPEC?: string | null;
  ZB6_XDTOPE?: string | null;
  ZB6_XINTER?: string | null;
  ZB6_XACOMP?: string | null;
  ZB6_XNFENC?: string | null;
  ZB6_XCLINT?: string | null;
  ZB6_XDTPDS?: string | null;
  ZB6_XFRS1?: string | null;
  ZB6_XDFRS1?: string | null;
  ZB6_XFRS2?: string | null;
  ZB6_XDFRS2?: string | null;
  ZB6_XFRS3?: string | null;
  ZB6_XDFRS3?: string | null;
  ZB6_XFRS4?: string | null;
  ZB6_XDFRS4?: string | null;
  ZB6_XFRS5?: string | null;
  ZB6_XDFRS5?: string | null;
  ZB6_XORCA?: string | null;
  ZB6_XDTENV?: string | null;
  ZB6_XDTVEN?: string | null;
  ZB6_XDESIG?: string | null;
  ZB6_XORCTO?: number | null;
  ZB6_XTOTF?: number | null;
  ZB6_XORCST?: string | null;
  ZB6_PERIT3?: string | null;
  ZB6_PERIT1?: string | null;
  ZB6_PERIT4?: string | null;
  ZB6_PERIT2?: string | null;
  ZB6_PERIT5?: string | null;
  ZB6_PERIT6?: string | null;
  ZB6_PERIT7?: string | null;
  ZB6_PERIT8?: string | null;
  ZB6_PERIT9?: string | null;
  ZB6_PERI10?: string | null;
  ZB6_PERI11?: string | null;
  ZB6_PERI12?: string | null;
  ZB6_PERI13?: string | null;
  ZB6_PERI14?: string | null;
  ZB6_PERI15?: string | null;
  ZB6_XKANPC?: string | null;
  ZB6_APACOR?: string | null;
  ZB6_PERI16?: string | null;
  ZB6_PERI17?: string | null;
  ZB6_PERI18?: string | null;
  ZB6_XOPPEC?: string | null;
  ZB6_XNUMCH?: string | null;
  ZB6_XREJEI?: string | null;
  ZB6_XDTINI?: string | null;
  ZB6_XDTATU?: string | null;
  ZB6_XCHAMA?: string | null;
  ZB6_XVALID?: string | null;
}

export const ZB6010Write = z.object({
  ZB6_FILIAL: z.string(),
  ZB6_ORDEM: z.string(),
  ZB6_OSKAIR: z.string(),
  ZB6_CONTAT: z.string(),
  ZB6_DATARE: z.string(),
  ZB6_NFCLIE: z.string(),
  ZB6_EMISSA: z.string(),
  ZB6_DESCNF: z.string(),
  ZB6_PRODUT: z.string(),
  ZB6_SERIE: z.string(),
  ZB6_EQUIPA: z.string(),
  ZB6_FABRIC: z.string(),
  ZB6_CV: z.string(),
  ZB6_KW: z.string(),
  ZB6_TENSAO: z.string(),
  ZB6_POLOS: z.string(),
  ZB6_CARCAC: z.string(),
  ZB6_FC: z.string(),
  ZB6_OM: z.string(),
  ZB6_PROPOS: z.string(),
  ZB6_FORA: z.string(),
  ZB6_DTENVI: z.string(),
  ZB6_DTAUTO: z.string(),
  ZB6_TIPOSE: z.string(),
  ZB6_PRIORI: z.string(),
  ZB6_NFDEVO: z.string(),
  ZB6_DTNFDV: z.string(),
  ZB6_PRAZO: z.string(),
  ZB6_DTENTR: z.string(),
  ZB6_NFSERV: z.string(),
  ZB6_DTNFSV: z.string(),
  ZB6_NFPROD: z.string(),
  ZB6_DTNFPR: z.string(),
  ZB6_NUMMED: z.string(),
  ZB6_VLRMAT: z.number(),
  ZB6_VLRSER: z.number(),
  ZB6_ENVMED: z.string(),
  ZB6_DTRECP: z.string(),
  ZB6_DTLTF: z.string(),
  ZB6_PEDIDO: z.string(),
  ZB6_TAG: z.string(),
  ZB6_TOTPRO: z.number(),
  ZB6_STACOM: z.string(),
  ZB6_XNISAP: z.string(),
  D_E_L_E_T_: z.string(),
  R_E_C_N_O_: z.number().int(),
  R_E_C_D_E_L_: z.number().int(),
  ZB6_OMMMMM: z.string(),
  ZB6_DTPVEN: z.string(),
  ZB6_NOMCLI: z.string(),
  ZB6_DATENV: z.string(),
  ZB6_DPECA: z.string(),
  ZB6_ENVP: z.string(),
  ZB6_AREA: z.string(),
  ZB6_OBSTEC: z.string().nullish(),
  ZB6_DTCADA: z.string(),
  ZB6_PROBLE: z.string(),
  ZB6_DESSTA: z.string(),
  ZB6_DTDINF: z.string(),
  ZB6_DIRAPR: z.string(),
  ZB6_PCSERV: z.string(),
  ZB6_CODEQ: z.string(),
  ZB6_PDNFRE: z.string(),
  ZB6_PRAZC: z.string(),
  ZB6_USERGI: z.string(),
  ZB6_USERGA: z.string(),
  ZB6_XHP: z.string(),
  ZB6_XKVA: z.string(),
  ZB6_TAGKAI: z.string(),
  ZB6_NFSER2: z.string(),
  ZB6_DTNFS2: z.string(),
  ZB6_NFPRO2: z.string(),
  ZB6_DTNFP2: z.string(),
  ZB6_NFPRO3: z.string(),
  ZB6_DTNFP3: z.string(),
  ZB6_DESSER: z.string(),
  ZB6_XBMC: z.string(),
  ZB6_XPROPC: z.string(),
  ZB6_XPREVS: z.string(),
  ZB6_XDTPRS: z.string(),
  ZB6_XPREVF: z.string(),
  ZB6_XDTPRE: z.string(),
  ZB6_XDTPSE: z.string(),
  ZB6_XDTPMA: z.string(),
  ZB6_VLMATC: z.number(),
  ZB6_VLSERC: z.number(),
  ZB6_NFSER3: z.string(),
  ZB6_NFSER4: z.string(),
  ZB6_NFSER5: z.string(),
  ZB6_NFSER6: z.string(),
  ZB6_DTNFS3: z.string(),
  ZB6_DTNFS4: z.string(),
  ZB6_DTNFS5: z.string(),
  ZB6_DTNFS6: z.string(),
  ZB6_CONTRA: z.string(),
  ZB6_XTEMPO: z.string(),
  ZB6_CLIENT: z.string(),
  ZB6_LOJA: z.string(),
  ZB6_XNPDCM: z.string(),
  ZB6_XNPDCS: z.string(),
  ZB6_XPRMPC: z.string(),
  ZB6_XDTPRM: z.string(),
  ZB6_XPRSPC: z.string(),
  ZB6_XDTPRF: z.string(),
  ZB6_XCOR: z.string(),
  ZB6_XNUMRE: z.string(),
  ZB6_VLNFS: z.number(),
  ZB6_VLNFM: z.number(),
  ZB6_VLNFS1: z.number(),
  ZB6_VLNFS2: z.number(),
  ZB6_VLNFS3: z.number(),
  ZB6_VLNFS4: z.number(),
  ZB6_VLNFS5: z.number(),
  ZB6_VLNFM1: z.number(),
  ZB6_VLNFM2: z.number(),
  ZB6_XAPSPC: z.string(),
  ZB6_XDTCOR: z.string(),
  ZB6_NFPRO4: z.string(),
  ZB6_DTNFP4: z.string(),
  ZB6_VLNFM4: z.number(),
  ZB6_NFPRO5: z.string(),
  ZB6_DTNFP5: z.string(),
  ZB6_VLNFM5: z.number(),
  ZB6_NFPRO6: z.string(),
  ZB6_DTNFP6: z.string(),
  ZB6_VLNFM6: z.number(),
  ZB6_XHISTO: z.string(),
  ZB6_XDTREC: z.string(),
  ZB6_VLRIVA: z.number(),
  ZB6_NGT: z.string(),
  ZB6_RESPEN: z.string(),
  ZB6_ENTRDT: z.string(),
  ZB6_XVLRIV: z.number(),
  ZB6_NNE: z.string(),
  ZB6_ENVIO: z.string(),
  ZB6_XOPEC: z.string(),
  ZB6_XDTOPE: z.string(),
  ZB6_XINTER: z.string(),
  ZB6_XACOMP: z.string(),
  ZB6_XNFENC: z.string(),
  ZB6_XCLINT: z.string(),
  ZB6_XDTPDS: z.string(),
  ZB6_XFRS1: z.string(),
  ZB6_XDFRS1: z.string(),
  ZB6_XFRS2: z.string(),
  ZB6_XDFRS2: z.string(),
  ZB6_XFRS3: z.string(),
  ZB6_XDFRS3: z.string(),
  ZB6_XFRS4: z.string(),
  ZB6_XDFRS4: z.string(),
  ZB6_XFRS5: z.string(),
  ZB6_XDFRS5: z.string(),
  ZB6_XORCA: z.string(),
  ZB6_XDTENV: z.string(),
  ZB6_XDTVEN: z.string(),
  ZB6_XDESIG: z.string().nullish(),
  ZB6_XORCTO: z.number(),
  ZB6_XTOTF: z.number(),
  ZB6_XORCST: z.string(),
  ZB6_PERIT3: z.string(),
  ZB6_PERIT1: z.string(),
  ZB6_PERIT4: z.string(),
  ZB6_PERIT2: z.string(),
  ZB6_PERIT5: z.string(),
  ZB6_PERIT6: z.string(),
  ZB6_PERIT7: z.string(),
  ZB6_PERIT8: z.string(),
  ZB6_PERIT9: z.string(),
  ZB6_PERI10: z.string(),
  ZB6_PERI11: z.string(),
  ZB6_PERI12: z.string(),
  ZB6_PERI13: z.string(),
  ZB6_PERI14: z.string(),
  ZB6_PERI15: z.string(),
  ZB6_XKANPC: z.string(),
  ZB6_APACOR: z.string(),
  ZB6_PERI16: z.string(),
  ZB6_PERI17: z.string(),
  ZB6_PERI18: z.string(),
  ZB6_XOPPEC: z.string(),
  ZB6_XNUMCH: z.string(),
  ZB6_XREJEI: z.string(),
  ZB6_XDTINI: z.string(),
  ZB6_XDTATU: z.string(),
  ZB6_XCHAMA: z.string(),
  ZB6_XVALID: z.string(),
}).partial();
export type ZB6010Write = z.infer<typeof ZB6010Write>;

export const ZB6010Meta = {
  name: "ZB6010",
  dataset: "45.6.153.1%2c37000,CZLS4F_136240_PR_PD",
  table: "ZB6010",
  permission: "read-write",
} as const;

/** SCP010 · dataset `45.6.153.1%2c37000,CZLS4F_136240_PR_PD` */
export interface SCP010Row {
  CP_FILIAL?: string | null;
  CP_NUM?: string | null;
  CP_ITEM?: string | null;
  CP_PRODUTO?: string | null;
  CP_DESCRI?: string | null;
  CP_UM?: string | null;
  CP_QUANT?: number | null;
  CP_SEGUM?: string | null;
  CP_QTSEGUM?: number | null;
  CP_DATPRF?: string | null;
  CP_LOCAL?: string | null;
  CP_XOSKAIR?: string | null;
  CP_OBS?: string | null;
  CP_EMISSAO?: string | null;
  CP_OP?: string | null;
  CP_CODSOLI?: string | null;
  CP_CC?: string | null;
  CP_CONTA?: string | null;
  CP_OK?: string | null;
  CP_PREREQU?: string | null;
  CP_SOLICIT?: string | null;
  CP_QUJE?: number | null;
  CP_SEQRC?: string | null;
  CP_STATUS?: string | null;
  CP_NUMOS?: string | null;
  CP_ITEMCTA?: string | null;
  CP_CLVL?: string | null;
  CP_ITSC?: string | null;
  CP_USER?: string | null;
  CP_STATSA?: string | null;
  CP_PROJETO?: string | null;
  CP_NUMSC?: string | null;
  CP_SALBLQ?: number | null;
  CP_MEDIDA?: string | null;
  CP_SULCMI?: number | null;
  CP_SULCMA?: number | null;
  CP_RATEIO?: string | null;
  CP_TIPMOD?: string | null;
  CP_LOTE?: string | null;
  CP_NRBPIMS?: string | null;
  CP_CONSEST?: string | null;
  CP_VUNIT?: number | null;
  D_E_L_E_T_?: string | null;
  R_E_C_N_O_?: number | null;
  R_E_C_D_E_L_?: number | null;
  CP_TRT?: string | null;
  CP_XEMPRES?: string | null;
  CP_XCU?: number | null;
  CP_ORDSEP?: string | null;
  CP_XPERDA?: string | null;
}

export const SCP010Write = z.object({
  CP_FILIAL: z.string(),
  CP_NUM: z.string(),
  CP_ITEM: z.string(),
  CP_PRODUTO: z.string(),
  CP_DESCRI: z.string(),
  CP_UM: z.string(),
  CP_QUANT: z.number(),
  CP_SEGUM: z.string(),
  CP_QTSEGUM: z.number(),
  CP_DATPRF: z.string(),
  CP_LOCAL: z.string(),
  CP_XOSKAIR: z.string(),
  CP_OBS: z.string(),
  CP_EMISSAO: z.string(),
  CP_OP: z.string(),
  CP_CODSOLI: z.string(),
  CP_CC: z.string(),
  CP_CONTA: z.string(),
  CP_OK: z.string(),
  CP_PREREQU: z.string(),
  CP_SOLICIT: z.string(),
  CP_QUJE: z.number(),
  CP_SEQRC: z.string(),
  CP_STATUS: z.string(),
  CP_NUMOS: z.string(),
  CP_ITEMCTA: z.string(),
  CP_CLVL: z.string(),
  CP_ITSC: z.string(),
  CP_USER: z.string(),
  CP_STATSA: z.string(),
  CP_PROJETO: z.string(),
  CP_NUMSC: z.string(),
  CP_SALBLQ: z.number(),
  CP_MEDIDA: z.string(),
  CP_SULCMI: z.number(),
  CP_SULCMA: z.number(),
  CP_RATEIO: z.string(),
  CP_TIPMOD: z.string(),
  CP_LOTE: z.string(),
  CP_NRBPIMS: z.string(),
  CP_CONSEST: z.string(),
  CP_VUNIT: z.number(),
  D_E_L_E_T_: z.string(),
  R_E_C_N_O_: z.number().int(),
  R_E_C_D_E_L_: z.number().int(),
  CP_TRT: z.string(),
  CP_XEMPRES: z.string(),
  CP_XCU: z.number(),
  CP_ORDSEP: z.string(),
  CP_XPERDA: z.string(),
}).partial();
export type SCP010Write = z.infer<typeof SCP010Write>;

export const SCP010Meta = {
  name: "SCP010",
  dataset: "45.6.153.1%2c37000,CZLS4F_136240_PR_PD",
  table: "SCP010",
  permission: "read-write",
} as const;

/** ABF010 — [dbo].[ABF010] · dataset `45.6.153.1%2c37000,CZLS4F_136240_PR_PD` */
export interface ABF010Row {
  ABF_FILIAL?: string | null;
  ABF_EMISSA?: string | null;
  ABF_NUMOS?: string | null;
  ABF_ITEMOS?: string | null;
  ABF_SEQRC?: string | null;
  ABF_CODTEC?: string | null;
  ABF_SOLIC?: string | null;
  D_E_L_E_T_?: string | null;
  R_E_C_N_O_?: number | null;
  R_E_C_D_E_L_?: number | null;
  ABF_XNUMOS?: string | null;
  ABF_DESCR?: string | null;
  ABF_OBSERV?: string | null;
  ABF_XTIPO?: string | null;
  ABF_USERGI?: string | null;
}

export const ABF010Write = z.object({
  ABF_FILIAL: z.string(),
  ABF_EMISSA: z.string(),
  ABF_NUMOS: z.string(),
  ABF_ITEMOS: z.string(),
  ABF_SEQRC: z.string(),
  ABF_CODTEC: z.string(),
  ABF_SOLIC: z.string(),
  D_E_L_E_T_: z.string(),
  R_E_C_N_O_: z.number().int(),
  R_E_C_D_E_L_: z.number().int(),
  ABF_XNUMOS: z.string(),
  ABF_DESCR: z.string(),
  ABF_OBSERV: z.string(),
  ABF_XTIPO: z.string(),
  ABF_USERGI: z.string(),
}).partial();
export type ABF010Write = z.infer<typeof ABF010Write>;

export const ABF010Meta = {
  name: "ABF010",
  dataset: "45.6.153.1%2c37000,CZLS4F_136240_PR_PD",
  table: "[dbo].[ABF010]",
  permission: "read-write",
} as const;

export const PROTHEUS_TABLES = {
  "ZB6010": ZB6010Meta,
  "SCP010": SCP010Meta,
  "ABF010": ABF010Meta,
} as const;
