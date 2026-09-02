// ⚠️  ARQUIVO GERADO por tooling/codegen — não editar à mão.
// Fonte: docs/_data/data-model.json  ·  regenerar: pnpm codegen
// Tabelas Dataverse — tipos, schemas de escrita e metadados

import { z } from "zod";
import type * as E from "./enums.js";

export type DataverseEntityMeta = {
  name: string;
  logicalName: string;
  entitySet: string;
  primaryId: string;
  primaryName: string | null;
  writable: boolean;
};

/** Controle Ferramentas — `cr4a1_controleferramentas` */
export interface Cr4a1ControleferramentasRow {
  cr4a1_concat_ver?: string | null;
  cr4a1_controleferramentasid?: string | null;
  cr4a1_data_substituicao?: string | null;
  cr4a1_data_vidautil?: string | null;
  cr4a1_dataver?: string | null;
  cr4a1_evid_adicionais_name?: string | null;
  cr4a1_eviden_aquisi_name?: string | null;
  cr4a1_evidencia_timestamp?: number | null;
  cr4a1_evidencia_url?: string | null;
  cr4a1_evidenciaid?: string | null;
  cr4a1_fechado?: string | null;
  cr4a1_idxbase?: string | null;
  cr4a1_n_patrimonio?: string | null;
  cr4a1_nf_aquisicao?: string | null;
  cr4a1_obs_check_1?: string | null;
  cr4a1_obs_resol?: string | null;
  cr4a1_quantidade?: string | null;
  cr4a1_responsavel_setor?: string | null;
  cr4a1_responsavel_verificacao?: string | null;
  cr4a1_setor?: string | null;
  cr4a1_tratativa?: string | null;
  cr4a1_verificador?: string | null;
  cr4a1_vida_util?: string | null;
  cr4a1_xdata?: string | null;
  cr4a1_xestado?: string | null;
  cr4a1_xnome?: string | null;
  cr4a1_xnxcheck?: string | null;
  cr4a1_xobservacao?: string | null;
  cr4a1_xresponsavelsetor?: string | null;
  cr4a1_xsetor?: string | null;
  cr4a1_yvalortotal?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1Controleferramentas_StatecodeValue | null;
  statuscode?: E.Cr4a1Controleferramentas_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1ControleferramentasWrite = z.object({
  cr4a1_data_substituicao: z.string().max(100).nullish(),
  cr4a1_data_vidautil: z.string().max(100).nullish(),
  cr4a1_dataver: z.string().max(100).nullish(),
  cr4a1_fechado: z.string().max(100).nullish(),
  cr4a1_idxbase: z.string().max(100),
  cr4a1_n_patrimonio: z.string().max(100).nullish(),
  cr4a1_nf_aquisicao: z.string().max(100).nullish(),
  cr4a1_obs_check_1: z.string().max(2000).nullish(),
  cr4a1_obs_resol: z.string().max(100).nullish(),
  cr4a1_quantidade: z.string().max(100).nullish(),
  cr4a1_responsavel_setor: z.string().max(100).nullish(),
  cr4a1_responsavel_verificacao: z.string().max(100).nullish(),
  cr4a1_setor: z.string().max(100).nullish(),
  cr4a1_tratativa: z.string().max(100).nullish(),
  cr4a1_verificador: z.string().max(100).nullish(),
  cr4a1_vida_util: z.string().max(100).nullish(),
  cr4a1_xdata: z.string().max(100).nullish(),
  cr4a1_xestado: z.string().max(100).nullish(),
  cr4a1_xnome: z.string().max(100).nullish(),
  cr4a1_xnxcheck: z.string().max(100).nullish(),
  cr4a1_xobservacao: z.string().max(100).nullish(),
  cr4a1_xresponsavelsetor: z.string().max(100).nullish(),
  cr4a1_xsetor: z.string().max(100).nullish(),
  cr4a1_yvalortotal: z.string().max(100).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1ControleferramentasWrite = z.infer<typeof Cr4a1ControleferramentasWrite>;

export const Cr4a1ControleferramentasMeta = {
  name: "Controle Ferramentas",
  logicalName: "cr4a1_controleferramentas",
  entitySet: "cr4a1_controleferramentases",
  primaryId: "cr4a1_controleferramentasid",
  primaryName: "cr4a1_idxbase",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** RDS-Managements — `cr4a1_rdsmanagement` */
export interface Cr4a1RdsmanagementRow {
  cr4a1_atendimento?: string | null;
  cr4a1_auxiliar?: string | null;
  cr4a1_cliente?: string | null;
  cr4a1_dataatendim?: string | null;
  cr4a1_dataconc?: string | null;
  cr4a1_datanecess?: string | null;
  cr4a1_datareq?: string | null;
  cr4a1_desclog?: string | null;
  cr4a1_descricao?: string | null;
  cr4a1_idbase?: string | null;
  cr4a1_idveiculo?: string | null;
  cr4a1_matricula?: string | null;
  cr4a1_motorista?: string | null;
  cr4a1_nf?: string | null;
  cr4a1_nomereq?: string | null;
  cr4a1_numero_soma_bi?: string | null;
  cr4a1_qtdequip?: string | null;
  cr4a1_rdsmanagementid?: string | null;
  cr4a1_reqexterno?: string | null;
  cr4a1_setorreq?: string | null;
  cr4a1_tiposaida?: string | null;
  cr4a1_titulo?: string | null;
  cr4a1_unidade?: string | null;
  cr4a1_veiculo?: string | null;
  cr4a1_xanexos_name?: string | null;
  cr4a1_xdataatendim?: string | null;
  cr4a1_xdataconc?: string | null;
  cr4a1_xdatanecess?: string | null;
  cr4a1_xdatareq?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1Rdsmanagement_StatecodeValue | null;
  statuscode?: E.Cr4a1Rdsmanagement_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1RdsmanagementWrite = z.object({
  cr4a1_atendimento: z.string().max(100).nullish(),
  cr4a1_auxiliar: z.string().max(100).nullish(),
  cr4a1_cliente: z.string().max(100).nullish(),
  cr4a1_dataatendim: z.string().max(100).nullish(),
  cr4a1_dataconc: z.string().max(100).nullish(),
  cr4a1_datanecess: z.string().max(100).nullish(),
  cr4a1_datareq: z.string().max(100).nullish(),
  cr4a1_desclog: z.string().max(100).nullish(),
  cr4a1_descricao: z.string().max(4000).nullish(),
  cr4a1_idbase: z.string().max(100),
  cr4a1_idveiculo: z.string().max(100).nullish(),
  cr4a1_matricula: z.string().max(100).nullish(),
  cr4a1_motorista: z.string().max(100).nullish(),
  cr4a1_nf: z.string().max(100).nullish(),
  cr4a1_nomereq: z.string().max(100).nullish(),
  cr4a1_numero_soma_bi: z.string().max(100).nullish(),
  cr4a1_qtdequip: z.string().max(100).nullish(),
  cr4a1_reqexterno: z.string().max(100).nullish(),
  cr4a1_setorreq: z.string().max(100).nullish(),
  cr4a1_tiposaida: z.string().max(100).nullish(),
  cr4a1_titulo: z.string().max(100),
  cr4a1_unidade: z.string().max(100).nullish(),
  cr4a1_veiculo: z.string().max(100).nullish(),
  cr4a1_xdataatendim: z.string().datetime({ offset: true }).nullish(),
  cr4a1_xdataconc: z.string().datetime({ offset: true }).nullish(),
  cr4a1_xdatanecess: z.string().datetime({ offset: true }).nullish(),
  cr4a1_xdatareq: z.string().datetime({ offset: true }).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1RdsmanagementWrite = z.infer<typeof Cr4a1RdsmanagementWrite>;

export const Cr4a1RdsmanagementMeta = {
  name: "RDS-Managements",
  logicalName: "cr4a1_rdsmanagement",
  entitySet: "cr4a1_rdsmanagements",
  primaryId: "cr4a1_rdsmanagementid",
  primaryName: "cr4a1_titulo",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** Caldeiraria_Controle — `cr4a1_caldeiraria_controle` */
export interface Cr4a1CaldeirariaControleRow {
  cr4a1_caldeiraria_controleid?: string | null;
  cr4a1_comentario?: string | null;
  cr4a1_concluidopor?: string | null;
  cr4a1_dataconclusao?: string | null;
  cr4a1_dataenvio?: string | null;
  cr4a1_datamodificacao?: string | null;
  cr4a1_dataprazo?: string | null;
  cr4a1_evidencia_timestamp?: number | null;
  cr4a1_evidencia_url?: string | null;
  cr4a1_evidenciaid?: string | null;
  cr4a1_imagemreferencia_timestamp?: number | null;
  cr4a1_imagemreferencia_url?: string | null;
  cr4a1_imagemreferenciaid?: string | null;
  cr4a1_inseridopor?: string | null;
  cr4a1_os?: string | null;
  cr4a1_pecas?: string | null;
  cr4a1_prazo?: number | null;
  cr4a1_regime?: string | null;
  cr4a1_servicos?: string | null;
  cr4a1_status?: string | null;
  cr4a1_unidade?: string | null;
  cr4a1_xxstatus?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1CaldeirariaControle_StatecodeValue | null;
  statuscode?: E.Cr4a1CaldeirariaControle_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1CaldeirariaControleWrite = z.object({
  cr4a1_comentario: z.string().max(4000).nullish(),
  cr4a1_concluidopor: z.string().max(100).nullish(),
  cr4a1_dataconclusao: z.string().datetime({ offset: true }).nullish(),
  cr4a1_dataenvio: z.string().datetime({ offset: true }).nullish(),
  cr4a1_datamodificacao: z.string().datetime({ offset: true }).nullish(),
  cr4a1_inseridopor: z.string().max(100).nullish(),
  cr4a1_os: z.string().max(100).nullish(),
  cr4a1_pecas: z.string().max(100),
  cr4a1_prazo: z.number().int().nullish(),
  cr4a1_regime: z.string().max(100).nullish(),
  cr4a1_servicos: z.string().max(4000).nullish(),
  cr4a1_status: z.string().max(100).nullish(),
  cr4a1_unidade: z.string().max(100).nullish(),
  cr4a1_xxstatus: z.string().max(100).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1CaldeirariaControleWrite = z.infer<typeof Cr4a1CaldeirariaControleWrite>;

export const Cr4a1CaldeirariaControleMeta = {
  name: "Caldeiraria_Controle",
  logicalName: "cr4a1_caldeiraria_controle",
  entitySet: "cr4a1_caldeiraria_controles",
  primaryId: "cr4a1_caldeiraria_controleid",
  primaryName: "cr4a1_pecas",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** Caldeiraria_Lista — `cr4a1_caldeiraria_lista` */
export interface Cr4a1CaldeirariaListaRow {
  cr4a1_caldeiraria_listaid?: string | null;
  cr4a1_pecas?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1CaldeirariaLista_StatecodeValue | null;
  statuscode?: E.Cr4a1CaldeirariaLista_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1CaldeirariaListaWrite = z.object({
  cr4a1_pecas: z.string().max(100),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1CaldeirariaListaWrite = z.infer<typeof Cr4a1CaldeirariaListaWrite>;

export const Cr4a1CaldeirariaListaMeta = {
  name: "Caldeiraria_Lista",
  logicalName: "cr4a1_caldeiraria_lista",
  entitySet: "cr4a1_caldeiraria_listas",
  primaryId: "cr4a1_caldeiraria_listaid",
  primaryName: "cr4a1_pecas",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** Prod_Avaliacao_Final — `cr4a1_peritagem_final` */
export interface Cr4a1PeritagemFinalRow {
  cr4a1_c_corrente_r?: number | null;
  cr4a1_c_corrente_s?: number | null;
  cr4a1_c_corrente_t?: number | null;
  cr4a1_c_deseq_ohm?: number | null;
  cr4a1_c_ia?: number | null;
  cr4a1_c_ip?: number | null;
  cr4a1_c_isol_1?: string | null;
  cr4a1_c_isol_2?: string | null;
  cr4a1_c_isol_3?: string | null;
  cr4a1_c_temp_ambiente?: number | null;
  cr4a1_c_temp_carc?: number | null;
  cr4a1_c_temp_estator?: number | null;
  cr4a1_c_temp_mla?: number | null;
  cr4a1_c_temp_mloa?: number | null;
  cr4a1_c_tensao?: number | null;
  cr4a1_c_test_r_14?: number | null;
  cr4a1_c_test_r_25?: number | null;
  cr4a1_c_test_r_36?: number | null;
  cr4a1_c_test_r_710?: number | null;
  cr4a1_c_test_r_811?: number | null;
  cr4a1_c_test_r_912?: number | null;
  cr4a1_c_test_r_r?: number | null;
  cr4a1_c_test_r_s?: number | null;
  cr4a1_c_test_r_t?: number | null;
  cr4a1_c_test_rpm?: number | null;
  cr4a1_c_vib_ala?: number | null;
  cr4a1_c_vib_aloa?: number | null;
  cr4a1_c_vib_hla?: number | null;
  cr4a1_c_vib_hloa?: number | null;
  cr4a1_c_vib_vla?: number | null;
  cr4a1_c_vib_vloa?: number | null;
  cr4a1_data_ref?: string | null;
  cr4a1_deseq_ohmi2?: number | null;
  cr4a1_filial?: string | null;
  cr4a1_inseridopor?: string | null;
  cr4a1_inspecquali?: string | null;
  cr4a1_observ?: string | null;
  cr4a1_ordemdeservico?: string | null;
  cr4a1_peritagem_finalid?: string | null;
  cr4a1_rb_isol_1?: number | null;
  cr4a1_rb_isol_2?: number | null;
  cr4a1_rb_isol_3?: number | null;
  cr4a1_rb_res1?: number | null;
  cr4a1_rb_res2?: number | null;
  cr4a1_rb_res3?: number | null;
  cr4a1_sir_corrente_r?: number | null;
  cr4a1_sir_corrente_s?: number | null;
  cr4a1_sir_corrente_t?: number | null;
  cr4a1_sir_vib_hla?: number | null;
  cr4a1_sir_vib_hloa?: number | null;
  cr4a1_sir_vib_vla?: number | null;
  cr4a1_sir_vib_vloa?: number | null;
  cr4a1_tipomotor?: string | null;
  cr4a1_xaprovado?: string | null;
  cr4a1_ximagem_timestamp?: number | null;
  cr4a1_ximagem_url?: string | null;
  cr4a1_ximagemid?: string | null;
  cr4a1_xstatus?: string | null;
  cr4a1_yimagem_timestamp?: number | null;
  cr4a1_yimagem_url?: string | null;
  cr4a1_yimagemid?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1PeritagemFinal_StatecodeValue | null;
  statuscode?: E.Cr4a1PeritagemFinal_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1PeritagemFinalWrite = z.object({
  cr4a1_c_corrente_r: z.number().nullish(),
  cr4a1_c_corrente_s: z.number().nullish(),
  cr4a1_c_corrente_t: z.number().nullish(),
  cr4a1_c_deseq_ohm: z.number().nullish(),
  cr4a1_c_ia: z.number().nullish(),
  cr4a1_c_ip: z.number().nullish(),
  cr4a1_c_isol_1: z.string().max(100).nullish(),
  cr4a1_c_isol_2: z.string().max(100).nullish(),
  cr4a1_c_isol_3: z.string().max(100).nullish(),
  cr4a1_c_temp_ambiente: z.number().nullish(),
  cr4a1_c_temp_carc: z.number().nullish(),
  cr4a1_c_temp_estator: z.number().nullish(),
  cr4a1_c_temp_mla: z.number().nullish(),
  cr4a1_c_temp_mloa: z.number().nullish(),
  cr4a1_c_tensao: z.number().nullish(),
  cr4a1_c_test_r_14: z.number().nullish(),
  cr4a1_c_test_r_25: z.number().nullish(),
  cr4a1_c_test_r_36: z.number().nullish(),
  cr4a1_c_test_r_710: z.number().nullish(),
  cr4a1_c_test_r_811: z.number().nullish(),
  cr4a1_c_test_r_912: z.number().nullish(),
  cr4a1_c_test_r_r: z.number().nullish(),
  cr4a1_c_test_r_s: z.number().nullish(),
  cr4a1_c_test_r_t: z.number().nullish(),
  cr4a1_c_test_rpm: z.number().nullish(),
  cr4a1_c_vib_ala: z.number().nullish(),
  cr4a1_c_vib_aloa: z.number().nullish(),
  cr4a1_c_vib_hla: z.number().nullish(),
  cr4a1_c_vib_hloa: z.number().nullish(),
  cr4a1_c_vib_vla: z.number().nullish(),
  cr4a1_c_vib_vloa: z.number().nullish(),
  cr4a1_data_ref: z.string().max(100).nullish(),
  cr4a1_deseq_ohmi2: z.number().nullish(),
  cr4a1_filial: z.string().max(100).nullish(),
  cr4a1_inseridopor: z.string().max(100).nullish(),
  cr4a1_inspecquali: z.string().max(100).nullish(),
  cr4a1_observ: z.string().max(4000).nullish(),
  cr4a1_ordemdeservico: z.string().max(100),
  cr4a1_rb_isol_1: z.number().nullish(),
  cr4a1_rb_isol_2: z.number().nullish(),
  cr4a1_rb_isol_3: z.number().nullish(),
  cr4a1_rb_res1: z.number().nullish(),
  cr4a1_rb_res2: z.number().nullish(),
  cr4a1_rb_res3: z.number().nullish(),
  cr4a1_sir_corrente_r: z.number().nullish(),
  cr4a1_sir_corrente_s: z.number().nullish(),
  cr4a1_sir_corrente_t: z.number().nullish(),
  cr4a1_sir_vib_hla: z.number().nullish(),
  cr4a1_sir_vib_hloa: z.number().nullish(),
  cr4a1_sir_vib_vla: z.number().nullish(),
  cr4a1_sir_vib_vloa: z.number().nullish(),
  cr4a1_tipomotor: z.string().max(100).nullish(),
  cr4a1_xaprovado: z.string().max(100).nullish(),
  cr4a1_xstatus: z.string().max(100).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1PeritagemFinalWrite = z.infer<typeof Cr4a1PeritagemFinalWrite>;

export const Cr4a1PeritagemFinalMeta = {
  name: "Prod_Avaliacao_Final",
  logicalName: "cr4a1_peritagem_final",
  entitySet: "cr4a1_peritagem_finals",
  primaryId: "cr4a1_peritagem_finalid",
  primaryName: "cr4a1_ordemdeservico",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** Prod_Avaliacao_Final_Opc — `cr4a1_prod_avaliacao_final_opc` */
export interface Cr4a1ProdAvaliacaoFinalOpcRow {
  cr4a1_ept100_s1_l1?: number | null;
  cr4a1_ept100_s1_l2?: number | null;
  cr4a1_ept100_s1_res?: string | null;
  cr4a1_ept100_s2_l1?: number | null;
  cr4a1_ept100_s2_l2?: number | null;
  cr4a1_ept100_s2_res?: string | null;
  cr4a1_ept100_s3_l1?: number | null;
  cr4a1_ept100_s3_l2?: number | null;
  cr4a1_ept100_s3_res?: string | null;
  cr4a1_ept100_s4_l1?: number | null;
  cr4a1_ept100_s4_l2?: number | null;
  cr4a1_ept100_s4_res?: string | null;
  cr4a1_ept100_s5_l1?: number | null;
  cr4a1_ept100_s5_l2?: number | null;
  cr4a1_ept100_s5_res?: string | null;
  cr4a1_ept100_s6_l1?: number | null;
  cr4a1_ept100_s6_l2?: number | null;
  cr4a1_ept100_s6_res?: string | null;
  cr4a1_ordem_servico?: string | null;
  cr4a1_prod_avaliacao_final_opcid?: string | null;
  cr4a1_res_resultado_status?: string | null;
  cr4a1_res_resultados_pmed?: number | null;
  cr4a1_res_resultados_pnom?: number | null;
  cr4a1_res_testeafrio_isol?: number | null;
  cr4a1_res_testeafrio_rohm?: number | null;
  cr4a1_res_testeafrio_status?: string | null;
  cr4a1_res_testeaquente_corrente?: number | null;
  cr4a1_res_testeaquente_status?: string | null;
  cr4a1_res_testeaquente_tensao?: number | null;
  cr4a1_tpt100_s1_l1?: number | null;
  cr4a1_tpt100_s1_l2?: number | null;
  cr4a1_tpt100_s1_res?: string | null;
  cr4a1_tpt100_s2_l1?: number | null;
  cr4a1_tpt100_s2_l2?: number | null;
  cr4a1_tpt100_s2_res?: string | null;
  cr4a1_tpt100_s3_l1?: number | null;
  cr4a1_tpt100_s3_l2?: number | null;
  cr4a1_tpt100_s3_res?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1ProdAvaliacaoFinalOpc_StatecodeValue | null;
  statuscode?: E.Cr4a1ProdAvaliacaoFinalOpc_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1ProdAvaliacaoFinalOpcWrite = z.object({
  cr4a1_ept100_s1_l1: z.number().nullish(),
  cr4a1_ept100_s1_l2: z.number().nullish(),
  cr4a1_ept100_s1_res: z.string().max(100).nullish(),
  cr4a1_ept100_s2_l1: z.number().nullish(),
  cr4a1_ept100_s2_l2: z.number().nullish(),
  cr4a1_ept100_s2_res: z.string().max(100).nullish(),
  cr4a1_ept100_s3_l1: z.number().nullish(),
  cr4a1_ept100_s3_l2: z.number().nullish(),
  cr4a1_ept100_s3_res: z.string().max(100).nullish(),
  cr4a1_ept100_s4_l1: z.number().nullish(),
  cr4a1_ept100_s4_l2: z.number().nullish(),
  cr4a1_ept100_s4_res: z.string().max(100).nullish(),
  cr4a1_ept100_s5_l1: z.number().nullish(),
  cr4a1_ept100_s5_l2: z.number().nullish(),
  cr4a1_ept100_s5_res: z.string().max(100).nullish(),
  cr4a1_ept100_s6_l1: z.number().nullish(),
  cr4a1_ept100_s6_l2: z.number().nullish(),
  cr4a1_ept100_s6_res: z.string().max(100).nullish(),
  cr4a1_ordem_servico: z.string().max(100),
  cr4a1_res_resultado_status: z.string().max(100).nullish(),
  cr4a1_res_resultados_pmed: z.number().nullish(),
  cr4a1_res_resultados_pnom: z.number().nullish(),
  cr4a1_res_testeafrio_isol: z.number().nullish(),
  cr4a1_res_testeafrio_rohm: z.number().nullish(),
  cr4a1_res_testeafrio_status: z.string().max(100).nullish(),
  cr4a1_res_testeaquente_corrente: z.number().nullish(),
  cr4a1_res_testeaquente_status: z.string().max(100).nullish(),
  cr4a1_res_testeaquente_tensao: z.number().nullish(),
  cr4a1_tpt100_s1_l1: z.number().nullish(),
  cr4a1_tpt100_s1_l2: z.number().nullish(),
  cr4a1_tpt100_s1_res: z.string().max(100).nullish(),
  cr4a1_tpt100_s2_l1: z.number().nullish(),
  cr4a1_tpt100_s2_l2: z.number().nullish(),
  cr4a1_tpt100_s2_res: z.string().max(100).nullish(),
  cr4a1_tpt100_s3_l1: z.number().nullish(),
  cr4a1_tpt100_s3_l2: z.number().nullish(),
  cr4a1_tpt100_s3_res: z.string().max(100).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1ProdAvaliacaoFinalOpcWrite = z.infer<typeof Cr4a1ProdAvaliacaoFinalOpcWrite>;

export const Cr4a1ProdAvaliacaoFinalOpcMeta = {
  name: "Prod_Avaliacao_Final_Opc",
  logicalName: "cr4a1_prod_avaliacao_final_opc",
  entitySet: "cr4a1_prod_avaliacao_final_opcs",
  primaryId: "cr4a1_prod_avaliacao_final_opcid",
  primaryName: "cr4a1_ordem_servico",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** Prod_Inspecao — `cr4a1_prod_inspecao` */
export interface Cr4a1ProdInspecaoRow {
  cr4a1_acp?: string | null;
  cr4a1_anfe?: string | null;
  cr4a1_cabf?: string | null;
  cr4a1_cliente?: string | null;
  cr4a1_cnch?: string | null;
  cr4a1_cxla?: string | null;
  cr4a1_cxlp?: string | null;
  cr4a1_data_teste?: string | null;
  cr4a1_freio?: string | null;
  cr4a1_grax?: string | null;
  cr4a1_grlv?: string | null;
  cr4a1_inserido_por?: string | null;
  cr4a1_isol?: string | null;
  cr4a1_obs?: string | null;
  cr4a1_olhal?: string | null;
  cr4a1_ordem_servico?: string | null;
  cr4a1_pclp?: string | null;
  cr4a1_pgra?: string | null;
  cr4a1_piex?: string | null;
  cr4a1_plgr?: string | null;
  cr4a1_plos?: string | null;
  cr4a1_port?: string | null;
  cr4a1_prel?: string | null;
  cr4a1_prod_inspecaoid?: string | null;
  cr4a1_ptag?: string | null;
  cr4a1_ptam?: string | null;
  cr4a1_resi?: string | null;
  cr4a1_resp_teste?: string | null;
  cr4a1_resumo_reprov?: string | null;
  cr4a1_rolh?: string | null;
  cr4a1_selo?: string | null;
  cr4a1_tacp?: string | null;
  cr4a1_temf?: string | null;
  cr4a1_tipoespmotor?: string | null;
  cr4a1_tipomotor?: string | null;
  cr4a1_tpdf?: string | null;
  cr4a1_veda?: string | null;
  cr4a1_vent?: string | null;
  cr4a1_xaprovado?: string | null;
  cr4a1_yimagem_timestamp?: number | null;
  cr4a1_yimagem_url?: string | null;
  cr4a1_yimagemid?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1ProdInspecao_StatecodeValue | null;
  statuscode?: E.Cr4a1ProdInspecao_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1ProdInspecaoWrite = z.object({
  cr4a1_acp: z.string().max(100).nullish(),
  cr4a1_anfe: z.string().max(100).nullish(),
  cr4a1_cabf: z.string().max(100).nullish(),
  cr4a1_cliente: z.string().max(100).nullish(),
  cr4a1_cnch: z.string().max(100).nullish(),
  cr4a1_cxla: z.string().max(100).nullish(),
  cr4a1_cxlp: z.string().max(100).nullish(),
  cr4a1_data_teste: z.string().max(100).nullish(),
  cr4a1_freio: z.string().max(100).nullish(),
  cr4a1_grax: z.string().max(100).nullish(),
  cr4a1_grlv: z.string().max(100).nullish(),
  cr4a1_inserido_por: z.string().max(100).nullish(),
  cr4a1_isol: z.string().max(100).nullish(),
  cr4a1_obs: z.string().max(4000).nullish(),
  cr4a1_olhal: z.string().max(100).nullish(),
  cr4a1_ordem_servico: z.string().max(100),
  cr4a1_pclp: z.string().max(100).nullish(),
  cr4a1_pgra: z.string().max(100).nullish(),
  cr4a1_piex: z.string().max(100).nullish(),
  cr4a1_plgr: z.string().max(100).nullish(),
  cr4a1_plos: z.string().max(100).nullish(),
  cr4a1_port: z.string().max(100).nullish(),
  cr4a1_prel: z.string().max(100).nullish(),
  cr4a1_ptag: z.string().max(100).nullish(),
  cr4a1_ptam: z.string().max(100).nullish(),
  cr4a1_resi: z.string().max(100).nullish(),
  cr4a1_resp_teste: z.string().max(100).nullish(),
  cr4a1_resumo_reprov: z.string().max(4000).nullish(),
  cr4a1_rolh: z.string().max(100).nullish(),
  cr4a1_selo: z.string().max(100).nullish(),
  cr4a1_tacp: z.string().max(100).nullish(),
  cr4a1_temf: z.string().max(100).nullish(),
  cr4a1_tipoespmotor: z.string().max(100).nullish(),
  cr4a1_tipomotor: z.string().max(100).nullish(),
  cr4a1_tpdf: z.string().max(100).nullish(),
  cr4a1_veda: z.string().max(100).nullish(),
  cr4a1_vent: z.string().max(100).nullish(),
  cr4a1_xaprovado: z.string().max(100).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1ProdInspecaoWrite = z.infer<typeof Cr4a1ProdInspecaoWrite>;

export const Cr4a1ProdInspecaoMeta = {
  name: "Prod_Inspecao",
  logicalName: "cr4a1_prod_inspecao",
  entitySet: "cr4a1_prod_inspecaos",
  primaryId: "cr4a1_prod_inspecaoid",
  primaryName: "cr4a1_ordem_servico",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** CIPA_Vot — `cr4a1_cipa_vot` */
export interface Cr4a1CipaVotRow {
  cr4a1_candidato?: string | null;
  cr4a1_cipa_votid?: string | null;
  cr4a1_nome?: string | null;
  cr4a1_senha?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1CipaVot_StatecodeValue | null;
  statuscode?: E.Cr4a1CipaVot_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1CipaVotWrite = z.object({
  cr4a1_candidato: z.string().max(100).nullish(),
  cr4a1_nome: z.string().max(850),
  cr4a1_senha: z.string().max(100).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1CipaVotWrite = z.infer<typeof Cr4a1CipaVotWrite>;

export const Cr4a1CipaVotMeta = {
  name: "CIPA_Vot",
  logicalName: "cr4a1_cipa_vot",
  entitySet: "cr4a1_cipa_vots",
  primaryId: "cr4a1_cipa_votid",
  primaryName: "cr4a1_nome",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** controle_veiculo — `cr4a1_controle_veiculo` */
export interface Cr4a1ControleVeiculoRow {
  cr4a1_alteradopor?: string | null;
  cr4a1_controle_veiculoid?: string | null;
  cr4a1_criadopor?: string | null;
  cr4a1_dataaquisi?: string | null;
  cr4a1_documentoveicul_name?: string | null;
  cr4a1_filial?: string | null;
  cr4a1_id?: string | null;
  cr4a1_modeloveiculo?: string | null;
  cr4a1_placa?: string | null;
  cr4a1_tipodeaquisi?: string | null;
  cr4a1_tipoveicul?: string | null;
  cr4a1_valorcusto?: number | null;
  cr4a1_valorcusto_base?: number | null;
  cr4a1_veiculo?: string | null;
  cr4a1_vencimento?: string | null;
  cr4a1_xstatus?: string | null;
  cr4a1_xvencimento?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  exchangerate?: number | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1ControleVeiculo_StatecodeValue | null;
  statuscode?: E.Cr4a1ControleVeiculo_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  transactioncurrencyid?: string | null;
  "_transactioncurrencyid_value"?: string | null;
  transactioncurrencyidname?: string | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1ControleVeiculoWrite = z.object({
  cr4a1_alteradopor: z.string().max(100).nullish(),
  cr4a1_criadopor: z.string().max(100).nullish(),
  cr4a1_dataaquisi: z.string().datetime({ offset: true }).nullish(),
  cr4a1_filial: z.string().max(100).nullish(),
  cr4a1_id: z.string().max(100).nullish(),
  cr4a1_modeloveiculo: z.string().max(100).nullish(),
  cr4a1_placa: z.string().max(100).nullish(),
  cr4a1_tipodeaquisi: z.string().max(100).nullish(),
  cr4a1_tipoveicul: z.string().max(100).nullish(),
  cr4a1_valorcusto: z.number().nullish(),
  cr4a1_veiculo: z.string().max(850),
  cr4a1_vencimento: z.string().max(100).nullish(),
  cr4a1_xstatus: z.string().max(100).nullish(),
  cr4a1_xvencimento: z.string().datetime({ offset: true }).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
  transactioncurrencyid: z.string().uuid().nullish(),
}).partial();
export type Cr4a1ControleVeiculoWrite = z.infer<typeof Cr4a1ControleVeiculoWrite>;

export const Cr4a1ControleVeiculoMeta = {
  name: "controle_veiculo",
  logicalName: "cr4a1_controle_veiculo",
  entitySet: "cr4a1_controle_veiculos",
  primaryId: "cr4a1_controle_veiculoid",
  primaryName: "cr4a1_veiculo",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** controle_man_veicul — `cr4a1_controle_man_veicul` */
export interface Cr4a1ControleManVeiculRow {
  cr4a1_controle_man_veiculid?: string | null;
  cr4a1_criadopor?: string | null;
  cr4a1_custototal?: number | null;
  cr4a1_custototal_base?: number | null;
  cr4a1_dataagenda?: string | null;
  cr4a1_descricao?: string | null;
  cr4a1_filial?: string | null;
  cr4a1_id_veiculo?: string | null;
  cr4a1_idman?: string | null;
  cr4a1_local?: string | null;
  cr4a1_responsavel?: string | null;
  cr4a1_statusman?: string | null;
  cr4a1_tipodemanutencao?: string | null;
  cr4a1_veiculo?: string | null;
  cr4a1_xanexo_name?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  exchangerate?: number | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1ControleManVeicul_StatecodeValue | null;
  statuscode?: E.Cr4a1ControleManVeicul_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  transactioncurrencyid?: string | null;
  "_transactioncurrencyid_value"?: string | null;
  transactioncurrencyidname?: string | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1ControleManVeiculWrite = z.object({
  cr4a1_criadopor: z.string().max(100).nullish(),
  cr4a1_custototal: z.number().nullish(),
  cr4a1_dataagenda: z.string().datetime({ offset: true }).nullish(),
  cr4a1_descricao: z.string().max(4000).nullish(),
  cr4a1_filial: z.string().max(100).nullish(),
  cr4a1_id_veiculo: z.string().max(100).nullish(),
  cr4a1_idman: z.string().max(100).nullish(),
  cr4a1_local: z.string().max(100).nullish(),
  cr4a1_responsavel: z.string().max(100).nullish(),
  cr4a1_statusman: z.string().max(100).nullish(),
  cr4a1_tipodemanutencao: z.string().max(100).nullish(),
  cr4a1_veiculo: z.string().max(850),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
  transactioncurrencyid: z.string().uuid().nullish(),
}).partial();
export type Cr4a1ControleManVeiculWrite = z.infer<typeof Cr4a1ControleManVeiculWrite>;

export const Cr4a1ControleManVeiculMeta = {
  name: "controle_man_veicul",
  logicalName: "cr4a1_controle_man_veicul",
  entitySet: "cr4a1_controle_man_veiculs",
  primaryId: "cr4a1_controle_man_veiculid",
  primaryName: "cr4a1_veiculo",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** Credenciaiss — `cr4a1_credenciais` · Data originated from https://aplicativokm.sharepoint.com/sites/KairosMotores/Lists/Credenciais/AllItems.aspx */
export interface Cr4a1CredenciaisRow {
  cr4a1__x0031__nivel?: string | null;
  cr4a1__x0032__nivel?: string | null;
  cr4a1__x0033__nivel?: string | null;
  cr4a1_acesso?: string | null;
  cr4a1_acesso_mod?: string | null;
  cr4a1_cardbi?: string | null;
  cr4a1_credenciaisid?: string | null;
  cr4a1_destino_chamado?: string | null;
  cr4a1_destinrelatorio?: string | null;
  cr4a1_echoe_mod?: string | null;
  cr4a1_filial?: string | null;
  cr4a1_fun_x00e7__x00e3_o?: string | null;
  cr4a1_hbkairos?: string | null;
  cr4a1_imagem_perfil_timestamp?: number | null;
  cr4a1_imagem_perfil_url?: string | null;
  cr4a1_imagem_perfilid?: string | null;
  cr4a1_imgperfil_timestamp?: number | null;
  cr4a1_imgperfil_url?: string | null;
  cr4a1_imgperfilid?: string | null;
  cr4a1_mat_protheus?: string | null;
  cr4a1_matr_x00ed_cula?: string | null;
  cr4a1_mensagemavante?: string | null;
  cr4a1_mensagemavante_1?: string | null;
  cr4a1_menumedro?: string | null;
  cr4a1_nivel_acesso?: string | null;
  cr4a1_nivel_kanri?: string | null;
  cr4a1_relatorio?: string | null;
  cr4a1_setor_bob?: string | null;
  cr4a1_title?: string | null;
  cr4a1_usu_x00e1_rio?: string | null;
  cr4a1_xsetor?: string | null;
  cr4a1_xstatus?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1Credenciais_StatecodeValue | null;
  statuscode?: E.Cr4a1Credenciais_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1CredenciaisWrite = z.object({
  cr4a1__x0031__nivel: z.string().max(300).nullish(),
  cr4a1__x0032__nivel: z.string().max(300).nullish(),
  cr4a1__x0033__nivel: z.string().max(300).nullish(),
  cr4a1_acesso: z.string().max(300).nullish(),
  cr4a1_acesso_mod: z.string().max(4000).nullish(),
  cr4a1_cardbi: z.string().max(900).nullish(),
  cr4a1_destino_chamado: z.string().max(300).nullish(),
  cr4a1_destinrelatorio: z.string().max(300).nullish(),
  cr4a1_echoe_mod: z.string().max(4000).nullish(),
  cr4a1_filial: z.string().max(300).nullish(),
  cr4a1_fun_x00e7__x00e3_o: z.string().max(300).nullish(),
  cr4a1_hbkairos: z.string().max(4000).nullish(),
  cr4a1_mat_protheus: z.string().max(100).nullish(),
  cr4a1_matr_x00ed_cula: z.string().max(300).nullish(),
  cr4a1_mensagemavante: z.string().max(300).nullish(),
  cr4a1_mensagemavante_1: z.string().max(300).nullish(),
  cr4a1_menumedro: z.string().max(300).nullish(),
  cr4a1_nivel_acesso: z.string().max(100).nullish(),
  cr4a1_nivel_kanri: z.string().max(100).nullish(),
  cr4a1_relatorio: z.string().max(300).nullish(),
  cr4a1_setor_bob: z.string().max(300).nullish(),
  cr4a1_title: z.string().max(300).nullish(),
  cr4a1_usu_x00e1_rio: z.string().max(300).nullish(),
  cr4a1_xsetor: z.string().max(100).nullish(),
  cr4a1_xstatus: z.string().max(100).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1CredenciaisWrite = z.infer<typeof Cr4a1CredenciaisWrite>;

export const Cr4a1CredenciaisMeta = {
  name: "Credenciaiss",
  logicalName: "cr4a1_credenciais",
  entitySet: "cr4a1_credenciaises",
  primaryId: "cr4a1_credenciaisid",
  primaryName: "cr4a1_title",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** Base_Medro — `cr4a1_base_medro` · Data originated from https://aplicativokm.sharepoint.com/sites/KairosMotores/Lists/OS 4565k/AllItems.aspx */
export interface Cr4a1BaseMedroRow {
  cr4a1_autorizador_reprov?: string | null;
  cr4a1_base_medroid?: string | null;
  cr4a1_check_aprov?: E.Cr4a1BaseMedro_Cr4a1CheckAprovValue | null;
  cr4a1_cliente?: string | null;
  cr4a1_col?: string | null;
  cr4a1_cx_selec?: E.Cr4a1BaseMedro_Cr4a1CxSelecValue[] | null;
  cr4a1_cx_selec_outros?: string | null;
  cr4a1_data_final?: string | null;
  cr4a1_data_inicial?: string | null;
  cr4a1_erro_preenchimento_medro?: E.Cr4a1BaseMedro_Cr4a1ErroPreenchimentoMedroValue | null;
  cr4a1_express?: string | null;
  cr4a1_fcadastro?: string | null;
  cr4a1_matricula?: string | null;
  cr4a1_obs_check?: string | null;
  cr4a1_observacao?: string | null;
  cr4a1_os?: string | null;
  cr4a1_os_comp?: string | null;
  cr4a1_parecerliderreprov?: string | null;
  cr4a1_responsavel?: string | null;
  cr4a1_setor?: string | null;
  cr4a1_status_montagem?: string | null;
  cr4a1_status_reprov?: string | null;
  cr4a1_tipodepintura?: E.Cr4a1BaseMedro_Cr4a1TipodepinturaValue | null;
  cr4a1_unidade?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  msft_datastate?: E.Cr4a1BaseMedro_MsftDatastateValue | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1BaseMedro_StatecodeValue | null;
  statuscode?: E.Cr4a1BaseMedro_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1BaseMedroWrite = z.object({
  cr4a1_autorizador_reprov: z.string().max(100).nullish(),
  cr4a1_check_aprov: z.union([z.literal(0), z.literal(1), z.literal(1000)]).nullish(),
  cr4a1_cliente: z.string().max(300),
  cr4a1_col: z.string().max(100).nullish(),
  cr4a1_cx_selec_outros: z.string().max(100).nullish(),
  cr4a1_data_final: z.string().datetime({ offset: true }).nullish(),
  cr4a1_data_inicial: z.string().datetime({ offset: true }),
  cr4a1_erro_preenchimento_medro: z.literal(0).nullish(),
  cr4a1_express: z.string().max(100).nullish(),
  cr4a1_fcadastro: z.string().max(300).nullish(),
  cr4a1_matricula: z.string().max(300).nullish(),
  cr4a1_obs_check: z.string().max(4000).nullish(),
  cr4a1_observacao: z.string().max(900).nullish(),
  cr4a1_os: z.string().max(850).nullish(),
  cr4a1_os_comp: z.string().max(100).nullish(),
  cr4a1_parecerliderreprov: z.string().max(4000).nullish(),
  cr4a1_responsavel: z.string().max(300).nullish(),
  cr4a1_setor: z.string().max(300).nullish(),
  cr4a1_status_montagem: z.string().max(100).nullish(),
  cr4a1_status_reprov: z.string().max(100).nullish(),
  cr4a1_tipodepintura: z.union([z.literal(0), z.literal(1), z.literal(1000)]).nullish(),
  cr4a1_unidade: z.string().max(300).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1BaseMedroWrite = z.infer<typeof Cr4a1BaseMedroWrite>;

export const Cr4a1BaseMedroMeta = {
  name: "Base_Medro",
  logicalName: "cr4a1_base_medro",
  entitySet: "cr4a1_base_medros",
  primaryId: "cr4a1_base_medroid",
  primaryName: "cr4a1_os",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** Requisicao — `cr4a1_requisicao` */
export interface Cr4a1RequisicaoRow {
  cr4a1_inseridopor?: string | null;
  cr4a1_os?: string | null;
  cr4a1_requisicaoid?: string | null;
  cr4a1_status?: string | null;
  cr4a1_xfilial?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1Requisicao_StatecodeValue | null;
  statuscode?: E.Cr4a1Requisicao_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1RequisicaoWrite = z.object({
  cr4a1_inseridopor: z.string().max(100).nullish(),
  cr4a1_os: z.string().max(850),
  cr4a1_status: z.string().max(100).nullish(),
  cr4a1_xfilial: z.string().max(100).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1RequisicaoWrite = z.infer<typeof Cr4a1RequisicaoWrite>;

export const Cr4a1RequisicaoMeta = {
  name: "Requisicao",
  logicalName: "cr4a1_requisicao",
  entitySet: "cr4a1_requisicaos",
  primaryId: "cr4a1_requisicaoid",
  primaryName: "cr4a1_os",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** Laudos — `cr4a1_laudos` */
export interface Cr4a1LaudosRow {
  cr4a1_classelaudo?: string | null;
  cr4a1_cliente?: string | null;
  cr4a1_conclusao?: string | null;
  cr4a1_datalaudo?: string | null;
  cr4a1_datamotorperitado?: string | null;
  cr4a1_datamotorpronto?: string | null;
  cr4a1_emissor?: string | null;
  cr4a1_ensaioeletrico?: string | null;
  cr4a1_ensaiotemperatura?: string | null;
  cr4a1_ensaiovibracao?: string | null;
  cr4a1_falhaprincipal?: string | null;
  cr4a1_filial?: string | null;
  cr4a1_laudosid?: string | null;
  cr4a1_observacao?: string | null;
  cr4a1_os?: string | null;
  cr4a1_os_semsigla?: string | null;
  cr4a1_os_semsigla_numero?: number | null;
  cr4a1_parecertecnico?: string | null;
  cr4a1_sintomasevidenciados?: string | null;
  cr4a1_tipolaudo?: string | null;
  cr4a1_tipopatch?: string | null;
  cr4a1_xarquiv?: string | null;
  cr4a1_xid?: string | null;
  cr4a1_xstatus?: string | null;
  cr4a1_xvalidlaudoqrccode?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1Laudos_StatecodeValue | null;
  statuscode?: E.Cr4a1Laudos_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1LaudosWrite = z.object({
  cr4a1_classelaudo: z.string().max(100).nullish(),
  cr4a1_cliente: z.string().max(100).nullish(),
  cr4a1_conclusao: z.string().max(4000).nullish(),
  cr4a1_datalaudo: z.string().datetime({ offset: true }).nullish(),
  cr4a1_datamotorperitado: z.string().max(100).nullish(),
  cr4a1_datamotorpronto: z.string().max(100).nullish(),
  cr4a1_emissor: z.string().max(100).nullish(),
  cr4a1_ensaioeletrico: z.string().max(100).nullish(),
  cr4a1_ensaiotemperatura: z.string().max(100).nullish(),
  cr4a1_ensaiovibracao: z.string().max(100).nullish(),
  cr4a1_falhaprincipal: z.string().max(4000).nullish(),
  cr4a1_filial: z.string().max(100).nullish(),
  cr4a1_observacao: z.string().max(4000).nullish(),
  cr4a1_os: z.string().max(850),
  cr4a1_os_semsigla: z.string().max(100).nullish(),
  cr4a1_parecertecnico: z.string().max(4000).nullish(),
  cr4a1_sintomasevidenciados: z.string().max(4000).nullish(),
  cr4a1_tipolaudo: z.string().max(100).nullish(),
  cr4a1_tipopatch: z.string().max(100).nullish(),
  cr4a1_xarquiv: z.string().max(4000).nullish(),
  cr4a1_xid: z.string().max(100),
  cr4a1_xstatus: z.string().max(100).nullish(),
  cr4a1_xvalidlaudoqrccode: z.string().max(100).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1LaudosWrite = z.infer<typeof Cr4a1LaudosWrite>;

export const Cr4a1LaudosMeta = {
  name: "Laudos",
  logicalName: "cr4a1_laudos",
  entitySet: "cr4a1_laudoses",
  primaryId: "cr4a1_laudosid",
  primaryName: "cr4a1_os",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** Prod_LiberarEnsaio — `cr4a1_prod_liberarensaio` */
export interface Cr4a1ProdLiberarensaioRow {
  cr4a1_filial?: string | null;
  cr4a1_inserido_por?: string | null;
  cr4a1_os?: string | null;
  cr4a1_prod_liberarensaioid?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1ProdLiberarensaio_StatecodeValue | null;
  statuscode?: E.Cr4a1ProdLiberarensaio_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1ProdLiberarensaioWrite = z.object({
  cr4a1_filial: z.string().max(100).nullish(),
  cr4a1_inserido_por: z.string().max(100).nullish(),
  cr4a1_os: z.string().max(850),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1ProdLiberarensaioWrite = z.infer<typeof Cr4a1ProdLiberarensaioWrite>;

export const Cr4a1ProdLiberarensaioMeta = {
  name: "Prod_LiberarEnsaio",
  logicalName: "cr4a1_prod_liberarensaio",
  entitySet: "cr4a1_prod_liberarensaios",
  primaryId: "cr4a1_prod_liberarensaioid",
  primaryName: "cr4a1_os",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** servicosterceirizados — `cr4a1_servicosterceirizados` · Data originated from https://aplicativokm.sharepoint.com/sites/KairosMotores/Lists/Servios Terceirizados/AllItems.aspx */
export interface Cr4a1ServicosterceirizadosRow {
  cr4a1_avaliacaodescricao?: string | null;
  cr4a1_avaliacaomedida?: string | null;
  cr4a1_avaliacaoretorno?: string | null;
  cr4a1_carca_x00e7_a?: string | null;
  cr4a1_data_aprovacao_valor?: string | null;
  cr4a1_data_envio?: string | null;
  cr4a1_data_registro?: string | null;
  cr4a1_data_retorno?: string | null;
  cr4a1_empresa?: E.Cr4a1Servicosterceirizados_Cr4a1EmpresaValue | null;
  cr4a1_fabricante?: string | null;
  cr4a1_id?: string | null;
  cr4a1_n_or?: string | null;
  cr4a1_observa_x00e7__x00e3_o?: string | null;
  cr4a1_orc_fornecedor?: string | null;
  cr4a1_pe_x00e7_a?: E.Cr4a1Servicosterceirizados_Cr4a1PeX00e7AValue | null;
  cr4a1_previs_x00e3_oretorno?: string | null;
  cr4a1_servi_x00e7_o1?: string | null;
  cr4a1_servi_x00e7_o2?: string | null;
  cr4a1_servi_x00e7_o3?: string | null;
  cr4a1_servi_x00e7_o4?: string | null;
  cr4a1_servi_x00e7_o5?: string | null;
  cr4a1_servicosterceirizadosid?: string | null;
  cr4a1_situa_x00e7__x00e3_o?: E.Cr4a1Servicosterceirizados_Cr4a1SituaX00e7X00e3OValue | null;
  cr4a1_title?: string | null;
  cr4a1_totalvalor?: string | null;
  cr4a1_unidade?: string | null;
  cr4a1_valorserv1?: string | null;
  cr4a1_valorserv2?: string | null;
  cr4a1_valorserv3?: string | null;
  cr4a1_valorserv4?: string | null;
  cr4a1_valorserv5?: string | null;
  cr4a1_xdataenvio?: string | null;
  cr4a1_xdataregistro?: string | null;
  cr4a1_xdataretorno?: string | null;
  cr4a1_xempresa?: string | null;
  cr4a1_ximagem_timestamp?: number | null;
  cr4a1_ximagem_url?: string | null;
  cr4a1_ximagemid?: string | null;
  cr4a1_xprevisaoretorno?: string | null;
  cr4a1_xstatus?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1Servicosterceirizados_StatecodeValue | null;
  statuscode?: E.Cr4a1Servicosterceirizados_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1ServicosterceirizadosWrite = z.object({
  cr4a1_avaliacaodescricao: z.string().max(100).nullish(),
  cr4a1_avaliacaomedida: z.string().max(100).nullish(),
  cr4a1_avaliacaoretorno: z.string().max(100).nullish(),
  cr4a1_carca_x00e7_a: z.string().max(300).nullish(),
  cr4a1_data_aprovacao_valor: z.string().max(100).nullish(),
  cr4a1_data_envio: z.string().max(300).nullish(),
  cr4a1_data_registro: z.string().max(300).nullish(),
  cr4a1_data_retorno: z.string().max(300).nullish(),
  cr4a1_empresa: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).nullish(),
  cr4a1_fabricante: z.string().max(300).nullish(),
  cr4a1_id: z.string().max(100),
  cr4a1_n_or: z.string().max(300).nullish(),
  cr4a1_observa_x00e7__x00e3_o: z.string().max(900).nullish(),
  cr4a1_orc_fornecedor: z.string().max(300).nullish(),
  cr4a1_pe_x00e7_a: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7), z.literal(8), z.literal(9), z.literal(10), z.literal(11), z.literal(12), z.literal(13), z.literal(14), z.literal(15), z.literal(16), z.literal(17), z.literal(18), z.literal(19), z.literal(20)]).nullish(),
  cr4a1_previs_x00e3_oretorno: z.string().max(100).nullish(),
  cr4a1_servi_x00e7_o1: z.string().max(300).nullish(),
  cr4a1_servi_x00e7_o2: z.string().max(300).nullish(),
  cr4a1_servi_x00e7_o3: z.string().max(300).nullish(),
  cr4a1_servi_x00e7_o4: z.string().max(300).nullish(),
  cr4a1_servi_x00e7_o5: z.string().max(300).nullish(),
  cr4a1_situa_x00e7__x00e3_o: z.union([z.literal(0), z.literal(1)]).nullish(),
  cr4a1_title: z.string().max(850).nullish(),
  cr4a1_totalvalor: z.string().max(300).nullish(),
  cr4a1_unidade: z.string().max(300).nullish(),
  cr4a1_valorserv1: z.string().max(300).nullish(),
  cr4a1_valorserv2: z.string().max(300).nullish(),
  cr4a1_valorserv3: z.string().max(300).nullish(),
  cr4a1_valorserv4: z.string().max(300).nullish(),
  cr4a1_valorserv5: z.string().max(300).nullish(),
  cr4a1_xdataenvio: z.string().datetime({ offset: true }).nullish(),
  cr4a1_xdataregistro: z.string().datetime({ offset: true }).nullish(),
  cr4a1_xdataretorno: z.string().datetime({ offset: true }).nullish(),
  cr4a1_xempresa: z.string().max(100).nullish(),
  cr4a1_xprevisaoretorno: z.string().datetime({ offset: true }).nullish(),
  cr4a1_xstatus: z.string().max(100).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1ServicosterceirizadosWrite = z.infer<typeof Cr4a1ServicosterceirizadosWrite>;

export const Cr4a1ServicosterceirizadosMeta = {
  name: "servicosterceirizados",
  logicalName: "cr4a1_servicosterceirizados",
  entitySet: "cr4a1_servicosterceirizadoses",
  primaryId: "cr4a1_servicosterceirizadosid",
  primaryName: "cr4a1_title",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** servicosterceirizados_for — `cr4a1_servicosterceirizados_for` */
export interface Cr4a1ServicosterceirizadosForRow {
  cr4a1_filial?: string | null;
  cr4a1_nome?: string | null;
  cr4a1_servicosterceirizados_forid?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1ServicosterceirizadosFor_StatecodeValue | null;
  statuscode?: E.Cr4a1ServicosterceirizadosFor_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1ServicosterceirizadosForWrite = z.object({
  cr4a1_filial: z.string().max(100).nullish(),
  cr4a1_nome: z.string().max(850),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1ServicosterceirizadosForWrite = z.infer<typeof Cr4a1ServicosterceirizadosForWrite>;

export const Cr4a1ServicosterceirizadosForMeta = {
  name: "servicosterceirizados_for",
  logicalName: "cr4a1_servicosterceirizados_for",
  entitySet: "cr4a1_servicosterceirizados_fors",
  primaryId: "cr4a1_servicosterceirizados_forid",
  primaryName: "cr4a1_nome",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** ensaio_temporizado — `cr4a1_ensaio_temporizado` */
export interface Cr4a1EnsaioTemporizadoRow {
  cr4a1_corr_s?: number | null;
  cr4a1_corr_t?: number | null;
  cr4a1_corre_r?: string | null;
  cr4a1_corre_s?: string | null;
  cr4a1_corre_t?: string | null;
  cr4a1_datahora?: string | null;
  cr4a1_ensaio_temporizadoid?: string | null;
  cr4a1_os?: string | null;
  cr4a1_t_a?: string | null;
  cr4a1_t_c?: string | null;
  cr4a1_t_e?: string | null;
  cr4a1_t_m_la?: string | null;
  cr4a1_t_m_loa?: string | null;
  cr4a1_temp_ambiente?: number | null;
  cr4a1_temp_carc?: number | null;
  cr4a1_temp_estator?: number | null;
  cr4a1_temp_mancal_la?: number | null;
  cr4a1_temp_mancal_loa?: number | null;
  cr4a1_xfilial?: string | null;
  cr4a1_xleitura?: string | null;
  cr4a1_xusuario?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1EnsaioTemporizado_StatecodeValue | null;
  statuscode?: E.Cr4a1EnsaioTemporizado_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1EnsaioTemporizadoWrite = z.object({
  cr4a1_corr_s: z.number().nullish(),
  cr4a1_corr_t: z.number().nullish(),
  cr4a1_corre_r: z.string().max(100).nullish(),
  cr4a1_corre_s: z.string().max(100).nullish(),
  cr4a1_corre_t: z.string().max(100).nullish(),
  cr4a1_datahora: z.string().datetime({ offset: true }).nullish(),
  cr4a1_os: z.string().max(850),
  cr4a1_t_a: z.string().max(100).nullish(),
  cr4a1_t_c: z.string().max(100).nullish(),
  cr4a1_t_e: z.string().max(100).nullish(),
  cr4a1_t_m_la: z.string().max(100).nullish(),
  cr4a1_t_m_loa: z.string().max(100).nullish(),
  cr4a1_temp_ambiente: z.number().nullish(),
  cr4a1_temp_carc: z.number().nullish(),
  cr4a1_temp_estator: z.number().nullish(),
  cr4a1_temp_mancal_la: z.number().nullish(),
  cr4a1_temp_mancal_loa: z.number().nullish(),
  cr4a1_xfilial: z.string().max(100).nullish(),
  cr4a1_xleitura: z.string().max(100).nullish(),
  cr4a1_xusuario: z.string().max(100).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1EnsaioTemporizadoWrite = z.infer<typeof Cr4a1EnsaioTemporizadoWrite>;

export const Cr4a1EnsaioTemporizadoMeta = {
  name: "ensaio_temporizado",
  logicalName: "cr4a1_ensaio_temporizado",
  entitySet: "cr4a1_ensaio_temporizados",
  primaryId: "cr4a1_ensaio_temporizadoid",
  primaryName: "cr4a1_os",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** CIPA_2026 — `cr4a1_cipa_2026` */
export interface Cr4a1Cipa2026Row {
  cr4a1_cipa_2026id?: string | null;
  cr4a1_filial?: string | null;
  cr4a1_senha?: string | null;
  cr4a1_usuario?: string | null;
  cr4a1_voto?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1Cipa2026_StatecodeValue | null;
  statuscode?: E.Cr4a1Cipa2026_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1Cipa2026Write = z.object({
  cr4a1_filial: z.string().max(100).nullish(),
  cr4a1_senha: z.string().max(100).nullish(),
  cr4a1_usuario: z.string().max(850),
  cr4a1_voto: z.string().max(100).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1Cipa2026Write = z.infer<typeof Cr4a1Cipa2026Write>;

export const Cr4a1Cipa2026Meta = {
  name: "CIPA_2026",
  logicalName: "cr4a1_cipa_2026",
  entitySet: "cr4a1_cipa_2026s",
  primaryId: "cr4a1_cipa_2026id",
  primaryName: "cr4a1_usuario",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** CK_Farol — `cr4a1_ck_farol` */
export interface Cr4a1CkFarolRow {
  cr4a1_alteradopor?: string | null;
  cr4a1_carcaca?: string | null;
  cr4a1_ck_farolid?: string | null;
  cr4a1_contribuinte?: string | null;
  cr4a1_dataalteracao?: string | null;
  cr4a1_dataautorizacao?: string | null;
  cr4a1_dataconclusaomanutencao?: string | null;
  cr4a1_dataentrega?: string | null;
  cr4a1_dataenvionf?: string | null;
  cr4a1_dataenvioproposta?: string | null;
  cr4a1_dataprevfaturamento?: string | null;
  cr4a1_dataprevientrega?: string | null;
  cr4a1_datarecebiment?: string | null;
  cr4a1_equipamento?: string | null;
  cr4a1_fabricante?: string | null;
  cr4a1_fc?: string | null;
  cr4a1_grauprioridade?: string | null;
  cr4a1_idcliente?: string | null;
  cr4a1_km_final?: string | null;
  cr4a1_km_inicial?: string | null;
  cr4a1_laudofinal?: string | null;
  cr4a1_laudoinicial?: string | null;
  cr4a1_metodoenviofatura?: string | null;
  cr4a1_morada?: string | null;
  cr4a1_n_gt?: string | null;
  cr4a1_n_gt_recebimentp?: string | null;
  cr4a1_nffatura?: string | null;
  cr4a1_nne?: string | null;
  cr4a1_nomecliente?: string | null;
  cr4a1_nomecontato?: string | null;
  cr4a1_nproposta?: string | null;
  cr4a1_nserie?: string | null;
  cr4a1_observacao?: string | null;
  cr4a1_os?: string | null;
  cr4a1_polaridade?: string | null;
  cr4a1_potenciacv?: string | null;
  cr4a1_potenciakw?: string | null;
  cr4a1_prazo?: string | null;
  cr4a1_prevfaturamento?: string | null;
  cr4a1_recebidopor?: string | null;
  cr4a1_respentrega?: string | null;
  cr4a1_rpm?: string | null;
  cr4a1_statuscomercial?: string | null;
  cr4a1_tagcliente?: string | null;
  cr4a1_tagkairos?: string | null;
  cr4a1_telefone?: string | null;
  cr4a1_tensao?: string | null;
  cr4a1_tiposervico?: string | null;
  cr4a1_userinclusao?: string | null;
  cr4a1_valorc_iva?: string | null;
  cr4a1_valorcomiva?: number | null;
  cr4a1_valorsemiva?: number | null;
  cr4a1_valorsiva?: string | null;
  cr4a1_veiculo?: string | null;
  cr4a1_xstatus?: string | null;
  cr4a1_xstatusresponsavel?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1CkFarol_StatecodeValue | null;
  statuscode?: E.Cr4a1CkFarol_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1CkFarolWrite = z.object({
  cr4a1_alteradopor: z.string().max(100).nullish(),
  cr4a1_carcaca: z.string().max(100).nullish(),
  cr4a1_contribuinte: z.string().max(100).nullish(),
  cr4a1_dataalteracao: z.string().datetime({ offset: true }).nullish(),
  cr4a1_dataautorizacao: z.string().datetime({ offset: true }).nullish(),
  cr4a1_dataconclusaomanutencao: z.string().max(100).nullish(),
  cr4a1_dataentrega: z.string().datetime({ offset: true }).nullish(),
  cr4a1_dataenvionf: z.string().datetime({ offset: true }).nullish(),
  cr4a1_dataenvioproposta: z.string().datetime({ offset: true }).nullish(),
  cr4a1_dataprevfaturamento: z.string().datetime({ offset: true }).nullish(),
  cr4a1_dataprevientrega: z.string().datetime({ offset: true }).nullish(),
  cr4a1_datarecebiment: z.string().datetime({ offset: true }).nullish(),
  cr4a1_equipamento: z.string().max(100).nullish(),
  cr4a1_fabricante: z.string().max(100).nullish(),
  cr4a1_fc: z.string().max(100).nullish(),
  cr4a1_grauprioridade: z.string().max(100).nullish(),
  cr4a1_idcliente: z.string().max(100).nullish(),
  cr4a1_km_final: z.string().max(100).nullish(),
  cr4a1_km_inicial: z.string().max(100).nullish(),
  cr4a1_laudofinal: z.string().max(100).nullish(),
  cr4a1_laudoinicial: z.string().max(100).nullish(),
  cr4a1_metodoenviofatura: z.string().max(100).nullish(),
  cr4a1_morada: z.string().max(400).nullish(),
  cr4a1_n_gt: z.string().max(100).nullish(),
  cr4a1_n_gt_recebimentp: z.string().max(100).nullish(),
  cr4a1_nffatura: z.string().max(100).nullish(),
  cr4a1_nne: z.string().max(100).nullish(),
  cr4a1_nomecliente: z.string().max(100).nullish(),
  cr4a1_nomecontato: z.string().max(100).nullish(),
  cr4a1_nproposta: z.string().max(100).nullish(),
  cr4a1_nserie: z.string().max(100).nullish(),
  cr4a1_observacao: z.string().max(4000).nullish(),
  cr4a1_os: z.string().max(850),
  cr4a1_polaridade: z.string().max(100).nullish(),
  cr4a1_potenciacv: z.string().max(100).nullish(),
  cr4a1_potenciakw: z.string().max(100).nullish(),
  cr4a1_prazo: z.string().max(100).nullish(),
  cr4a1_prevfaturamento: z.string().max(100).nullish(),
  cr4a1_recebidopor: z.string().max(100).nullish(),
  cr4a1_respentrega: z.string().max(100).nullish(),
  cr4a1_rpm: z.string().max(100).nullish(),
  cr4a1_statuscomercial: z.string().max(100).nullish(),
  cr4a1_tagcliente: z.string().max(100).nullish(),
  cr4a1_tagkairos: z.string().max(100).nullish(),
  cr4a1_telefone: z.string().max(100).nullish(),
  cr4a1_tensao: z.string().max(100).nullish(),
  cr4a1_tiposervico: z.string().max(100).nullish(),
  cr4a1_userinclusao: z.string().max(100).nullish(),
  cr4a1_valorc_iva: z.string().max(100).nullish(),
  cr4a1_valorcomiva: z.number().nullish(),
  cr4a1_valorsemiva: z.number().nullish(),
  cr4a1_valorsiva: z.string().max(100).nullish(),
  cr4a1_veiculo: z.string().max(100).nullish(),
  cr4a1_xstatus: z.string().max(100).nullish(),
  cr4a1_xstatusresponsavel: z.string().max(100).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1CkFarolWrite = z.infer<typeof Cr4a1CkFarolWrite>;

export const Cr4a1CkFarolMeta = {
  name: "CK_Farol",
  logicalName: "cr4a1_ck_farol",
  entitySet: "cr4a1_ck_farols",
  primaryId: "cr4a1_ck_farolid",
  primaryName: "cr4a1_os",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** Compartilhamento de Campo — `principalobjectattributeaccess` · Define direitos de acesso de entidades de segurança de CRM (usuários e equipes) para uma instância de entidade. */
export interface PrincipalobjectattributeaccessRow {
  attributeid?: string | null;
  msft_datastate?: E.Principalobjectattributeaccess_MsftDatastateValue | null;
  objectid?: string | null;
  "_objectid_value"?: string | null;
  objecttypecode?: string | null;
  organizationid?: string | null;
  "_organizationid_value"?: string | null;
  organizationidname?: string | null;
  principalid?: string | null;
  "_principalid_value"?: string | null;
  principalidname?: string | null;
  principalidtype?: string | null;
  principalobjectattributeaccessid?: string | null;
  readaccess?: boolean | null;
  updateaccess?: boolean | null;
  versionnumber?: number | null;
}

export const PrincipalobjectattributeaccessWrite = z.object({
  attributeid: z.string().uuid(),
  objectid: z.string().uuid(),
  objecttypecode: z.unknown(),
  principalid: z.string().uuid(),
  principalidtype: z.unknown(),
  readaccess: z.boolean(),
  updateaccess: z.boolean(),
}).partial();
export type PrincipalobjectattributeaccessWrite = z.infer<typeof PrincipalobjectattributeaccessWrite>;

export const PrincipalobjectattributeaccessMeta = {
  name: "Compartilhamento de Campo",
  logicalName: "principalobjectattributeaccess",
  entitySet: "principalobjectattributeaccessset",
  primaryId: "principalobjectattributeaccessid",
  primaryName: null,
  writable: true,
} as const satisfies DataverseEntityMeta;

/** Usuários — `systemuser` · Pessoa com acesso ao sistema Microsoft CRM e proprietária de objetos no banco de dados do Microsoft CRM. */
export interface SystemuserRow {
  accessmode?: E.Systemuser_AccessmodeValue | null;
  activedirectoryguid?: string | null;
  address1_addressid?: string | null;
  address1_addresstypecode?: E.Systemuser_Address1AddresstypecodeValue | null;
  address1_city?: string | null;
  address1_composite?: string | null;
  address1_country?: string | null;
  address1_county?: string | null;
  address1_fax?: string | null;
  address1_latitude?: number | null;
  address1_line1?: string | null;
  address1_line2?: string | null;
  address1_line3?: string | null;
  address1_longitude?: number | null;
  address1_name?: string | null;
  address1_postalcode?: string | null;
  address1_postofficebox?: string | null;
  address1_shippingmethodcode?: E.Systemuser_Address1ShippingmethodcodeValue | null;
  address1_stateorprovince?: string | null;
  address1_telephone1?: string | null;
  address1_telephone2?: string | null;
  address1_telephone3?: string | null;
  address1_upszone?: string | null;
  address1_utcoffset?: number | null;
  address2_addressid?: string | null;
  address2_addresstypecode?: E.Systemuser_Address2AddresstypecodeValue | null;
  address2_city?: string | null;
  address2_composite?: string | null;
  address2_country?: string | null;
  address2_county?: string | null;
  address2_fax?: string | null;
  address2_latitude?: number | null;
  address2_line1?: string | null;
  address2_line2?: string | null;
  address2_line3?: string | null;
  address2_longitude?: number | null;
  address2_name?: string | null;
  address2_postalcode?: string | null;
  address2_postofficebox?: string | null;
  address2_shippingmethodcode?: E.Systemuser_Address2ShippingmethodcodeValue | null;
  address2_stateorprovince?: string | null;
  address2_telephone1?: string | null;
  address2_telephone2?: string | null;
  address2_telephone3?: string | null;
  address2_upszone?: string | null;
  address2_utcoffset?: number | null;
  applicationid?: string | null;
  applicationiduri?: string | null;
  azureactivedirectoryobjectid?: string | null;
  azuredeletedon?: string | null;
  azurestate?: E.Systemuser_AzurestateValue | null;
  businessunitid?: string | null;
  "_businessunitid_value"?: string | null;
  businessunitidname?: string | null;
  calendarid?: string | null;
  "_calendarid_value"?: string | null;
  caltype?: E.Systemuser_CaltypeValue | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  defaultfilterspopulated?: boolean | null;
  defaultmailbox?: string | null;
  "_defaultmailbox_value"?: string | null;
  defaultmailboxname?: string | null;
  defaultodbfoldername?: string | null;
  deletedstate?: E.Systemuser_DeletedstateValue | null;
  disabledreason?: string | null;
  displayinserviceviews?: boolean | null;
  domainname?: string | null;
  emailrouteraccessapproval?: E.Systemuser_EmailrouteraccessapprovalValue | null;
  employeeid?: string | null;
  entityimage_timestamp?: number | null;
  entityimage_url?: string | null;
  entityimageid?: string | null;
  exchangerate?: number | null;
  firstname?: string | null;
  fullname?: string | null;
  governmentid?: string | null;
  homephone?: string | null;
  identityid?: number | null;
  importsequencenumber?: number | null;
  incomingemaildeliverymethod?: E.Systemuser_IncomingemaildeliverymethodValue | null;
  internalemailaddress?: string | null;
  invitestatuscode?: E.Systemuser_InvitestatuscodeValue | null;
  isactivedirectoryuser?: boolean | null;
  isallowedbyipfirewall?: boolean | null;
  isdisabled?: boolean | null;
  isemailaddressapprovedbyo365admin?: boolean | null;
  isintegrationuser?: boolean | null;
  islicensed?: boolean | null;
  issyncwithdirectory?: boolean | null;
  jobtitle?: string | null;
  lastname?: string | null;
  latestupdatetime?: string | null;
  middlename?: string | null;
  mobilealertemail?: string | null;
  mobileofflineprofileid?: string | null;
  "_mobileofflineprofileid_value"?: string | null;
  mobileofflineprofileidname?: string | null;
  mobilephone?: string | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  nickname?: string | null;
  organizationid?: string | null;
  organizationidname?: string | null;
  outgoingemaildeliverymethod?: E.Systemuser_OutgoingemaildeliverymethodValue | null;
  overriddencreatedon?: string | null;
  parentsystemuserid?: string | null;
  "_parentsystemuserid_value"?: string | null;
  parentsystemuseridname?: string | null;
  passporthi?: number | null;
  passportlo?: number | null;
  personalemailaddress?: string | null;
  photourl?: string | null;
  positionid?: string | null;
  "_positionid_value"?: string | null;
  positionidname?: string | null;
  preferredaddresscode?: E.Systemuser_PreferredaddresscodeValue | null;
  preferredemailcode?: E.Systemuser_PreferredemailcodeValue | null;
  preferredphonecode?: E.Systemuser_PreferredphonecodeValue | null;
  processid?: string | null;
  queueid?: string | null;
  "_queueid_value"?: string | null;
  queueidname?: string | null;
  salutation?: string | null;
  setupuser?: boolean | null;
  sharepointemailaddress?: string | null;
  skills?: string | null;
  stageid?: string | null;
  systemmanagedusertype?: E.Systemuser_SystemmanagedusertypeValue | null;
  systemuserid?: string | null;
  territoryid?: string | null;
  "_territoryid_value"?: string | null;
  territoryidname?: string | null;
  timezoneruleversionnumber?: number | null;
  title?: string | null;
  transactioncurrencyid?: string | null;
  "_transactioncurrencyid_value"?: string | null;
  transactioncurrencyidname?: string | null;
  traversedpath?: string | null;
  userlicensetype?: number | null;
  userpuid?: string | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
  windowsliveid?: string | null;
  yammeremailaddress?: string | null;
  yammeruserid?: string | null;
  yomifirstname?: string | null;
  yomifullname?: string | null;
  yomilastname?: string | null;
  yomimiddlename?: string | null;
}

export const SystemuserWrite = z.object({
  accessmode: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  address1_addresstypecode: z.literal(1).nullish(),
  address1_city: z.string().max(128).nullish(),
  address1_country: z.string().max(128).nullish(),
  address1_county: z.string().max(128).nullish(),
  address1_fax: z.string().max(64).nullish(),
  address1_latitude: z.number().nullish(),
  address1_line1: z.string().max(1024).nullish(),
  address1_line2: z.string().max(1024).nullish(),
  address1_line3: z.string().max(1024).nullish(),
  address1_longitude: z.number().nullish(),
  address1_postalcode: z.string().max(40).nullish(),
  address1_postofficebox: z.string().max(40).nullish(),
  address1_shippingmethodcode: z.literal(1).nullish(),
  address1_stateorprovince: z.string().max(128).nullish(),
  address1_telephone1: z.string().max(64).nullish(),
  address1_telephone2: z.string().max(50).nullish(),
  address1_telephone3: z.string().max(50).nullish(),
  address1_upszone: z.string().max(4).nullish(),
  address1_utcoffset: z.number().int().nullish(),
  address2_addresstypecode: z.literal(1).nullish(),
  address2_city: z.string().max(128).nullish(),
  address2_country: z.string().max(128).nullish(),
  address2_county: z.string().max(128).nullish(),
  address2_fax: z.string().max(50).nullish(),
  address2_latitude: z.number().nullish(),
  address2_line1: z.string().max(1024).nullish(),
  address2_line2: z.string().max(1024).nullish(),
  address2_line3: z.string().max(1024).nullish(),
  address2_longitude: z.number().nullish(),
  address2_postalcode: z.string().max(40).nullish(),
  address2_postofficebox: z.string().max(40).nullish(),
  address2_shippingmethodcode: z.literal(1).nullish(),
  address2_stateorprovince: z.string().max(128).nullish(),
  address2_telephone1: z.string().max(50).nullish(),
  address2_telephone2: z.string().max(50).nullish(),
  address2_telephone3: z.string().max(50).nullish(),
  address2_upszone: z.string().max(4).nullish(),
  address2_utcoffset: z.number().int().nullish(),
  applicationid: z.string().uuid().nullish(),
  azurestate: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  businessunitid: z.string().uuid(),
  calendarid: z.string().uuid().nullish(),
  caltype: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7), z.literal(8), z.literal(9), z.literal(10), z.literal(11), z.literal(12)]),
  displayinserviceviews: z.boolean().nullish(),
  emailrouteraccessapproval: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  employeeid: z.string().max(100).nullish(),
  governmentid: z.string().max(100).nullish(),
  homephone: z.string().max(50).nullish(),
  incomingemaildeliverymethod: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  internalemailaddress: z.string().max(100),
  invitestatuscode: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
  isallowedbyipfirewall: z.boolean().nullish(),
  isdisabled: z.boolean().nullish(),
  isintegrationuser: z.boolean(),
  islicensed: z.boolean(),
  issyncwithdirectory: z.boolean(),
  jobtitle: z.string().max(100).nullish(),
  mobilealertemail: z.string().max(100).nullish(),
  mobileofflineprofileid: z.string().uuid().nullish(),
  mobilephone: z.string().max(64).nullish(),
  outgoingemaildeliverymethod: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  parentsystemuserid: z.string().uuid().nullish(),
  passporthi: z.number().int().nullish(),
  passportlo: z.number().int().nullish(),
  personalemailaddress: z.string().max(100).nullish(),
  photourl: z.string().max(200).nullish(),
  positionid: z.string().uuid().nullish(),
  preferredaddresscode: z.union([z.literal(1), z.literal(2)]).nullish(),
  preferredemailcode: z.literal(1).nullish(),
  preferredphonecode: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).nullish(),
  processid: z.string().uuid().nullish(),
  queueid: z.string().uuid().nullish(),
  salutation: z.string().max(20).nullish(),
  setupuser: z.boolean(),
  sharepointemailaddress: z.string().max(1024).nullish(),
  skills: z.string().max(100).nullish(),
  stageid: z.string().uuid().nullish(),
  systemmanagedusertype: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  territoryid: z.string().uuid().nullish(),
  title: z.string().max(128).nullish(),
  transactioncurrencyid: z.string().uuid().nullish(),
  traversedpath: z.string().max(1250).nullish(),
  userlicensetype: z.number().int(),
  windowsliveid: z.string().max(1024).nullish(),
  yammeremailaddress: z.string().max(200).nullish(),
  yammeruserid: z.string().max(128).nullish(),
}).partial();
export type SystemuserWrite = z.infer<typeof SystemuserWrite>;

export const SystemuserMeta = {
  name: "Usuários",
  logicalName: "systemuser",
  entitySet: "systemusers",
  primaryId: "systemuserid",
  primaryName: "fullname",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** Balanceamento — `cr4a1_balanceamento` */
export interface Cr4a1BalanceamentoRow {
  cr4a1_arquivo_balanceamento_name?: string | null;
  cr4a1_balanceamentoid?: string | null;
  cr4a1_classeisog?: string | null;
  cr4a1_conteudo_baldados?: string | null;
  cr4a1_fase_final1?: string | null;
  cr4a1_fase_final2?: string | null;
  cr4a1_fase_inicial1?: string | null;
  cr4a1_fase_inicial2?: string | null;
  cr4a1_foto_balanceamento_timestamp?: number | null;
  cr4a1_foto_balanceamento_url?: string | null;
  cr4a1_foto_balanceamentoid?: string | null;
  cr4a1_gmm_final1?: string | null;
  cr4a1_gmm_final2?: string | null;
  cr4a1_gmm_ideal1?: string | null;
  cr4a1_gmm_ideal2?: string | null;
  cr4a1_gmm_inicial1?: string | null;
  cr4a1_gmm_inicial2?: string | null;
  cr4a1_gramas_final1?: string | null;
  cr4a1_gramas_final2?: string | null;
  cr4a1_gramas_ideal1?: string | null;
  cr4a1_gramas_ideal2?: string | null;
  cr4a1_gramas_inicial1?: string | null;
  cr4a1_gramas_inicial2?: string | null;
  cr4a1_isog_final1?: string | null;
  cr4a1_isog_final2?: string | null;
  cr4a1_isog_ideal1?: string | null;
  cr4a1_isog_ideal2?: string | null;
  cr4a1_isog_inicial1?: string | null;
  cr4a1_isog_inicial2?: string | null;
  cr4a1_miligramas?: string | null;
  cr4a1_os?: string | null;
  cr4a1_peso_rotor?: string | null;
  cr4a1_planousado?: string | null;
  cr4a1_raio1?: string | null;
  cr4a1_raio2?: string | null;
  cr4a1_residualplano?: string | null;
  cr4a1_residualrotorkg?: string | null;
  cr4a1_rpmbalanceamento?: string | null;
  cr4a1_rpmtrabalho?: string | null;
  cr4a1_umplano?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1Balanceamento_StatecodeValue | null;
  statuscode?: E.Cr4a1Balanceamento_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1BalanceamentoWrite = z.object({
  cr4a1_classeisog: z.string().max(100).nullish(),
  cr4a1_conteudo_baldados: z.string().max(4000).nullish(),
  cr4a1_fase_final1: z.string().max(100).nullish(),
  cr4a1_fase_final2: z.string().max(100).nullish(),
  cr4a1_fase_inicial1: z.string().max(100).nullish(),
  cr4a1_fase_inicial2: z.string().max(100).nullish(),
  cr4a1_gmm_final1: z.string().max(100).nullish(),
  cr4a1_gmm_final2: z.string().max(100).nullish(),
  cr4a1_gmm_ideal1: z.string().max(100).nullish(),
  cr4a1_gmm_ideal2: z.string().max(100).nullish(),
  cr4a1_gmm_inicial1: z.string().max(100).nullish(),
  cr4a1_gmm_inicial2: z.string().max(100).nullish(),
  cr4a1_gramas_final1: z.string().max(100).nullish(),
  cr4a1_gramas_final2: z.string().max(100).nullish(),
  cr4a1_gramas_ideal1: z.string().max(100).nullish(),
  cr4a1_gramas_ideal2: z.string().max(100).nullish(),
  cr4a1_gramas_inicial1: z.string().max(100).nullish(),
  cr4a1_gramas_inicial2: z.string().max(100).nullish(),
  cr4a1_isog_final1: z.string().max(100).nullish(),
  cr4a1_isog_final2: z.string().max(100).nullish(),
  cr4a1_isog_ideal1: z.string().max(100).nullish(),
  cr4a1_isog_ideal2: z.string().max(100).nullish(),
  cr4a1_isog_inicial1: z.string().max(100).nullish(),
  cr4a1_isog_inicial2: z.string().max(100).nullish(),
  cr4a1_miligramas: z.string().max(100).nullish(),
  cr4a1_os: z.string().max(850),
  cr4a1_peso_rotor: z.string().max(100).nullish(),
  cr4a1_planousado: z.string().max(100).nullish(),
  cr4a1_raio1: z.string().max(100).nullish(),
  cr4a1_raio2: z.string().max(100).nullish(),
  cr4a1_residualplano: z.string().max(100).nullish(),
  cr4a1_residualrotorkg: z.string().max(100).nullish(),
  cr4a1_rpmbalanceamento: z.string().max(100).nullish(),
  cr4a1_rpmtrabalho: z.string().max(100).nullish(),
  cr4a1_umplano: z.string().max(100).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1BalanceamentoWrite = z.infer<typeof Cr4a1BalanceamentoWrite>;

export const Cr4a1BalanceamentoMeta = {
  name: "Balanceamento",
  logicalName: "cr4a1_balanceamento",
  entitySet: "cr4a1_balanceamentos",
  primaryId: "cr4a1_balanceamentoid",
  primaryName: "cr4a1_os",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** Relatorio_Fotografico — `cr4a1_relatorio_fotografico` */
export interface Cr4a1RelatorioFotograficoRow {
  cr4a1_filial?: string | null;
  cr4a1_nome?: string | null;
  cr4a1_os?: string | null;
  cr4a1_primeira_foto?: string | null;
  cr4a1_qtde_fotos?: string | null;
  cr4a1_relatorio_fotograficoid?: string | null;
  cr4a1_setor?: string | null;
  cr4a1_status?: string | null;
  cr4a1_tipo?: string | null;
  cr4a1_xstatus?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1RelatorioFotografico_StatecodeValue | null;
  statuscode?: E.Cr4a1RelatorioFotografico_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1RelatorioFotograficoWrite = z.object({
  cr4a1_filial: z.string().max(100).nullish(),
  cr4a1_nome: z.string().max(100).nullish(),
  cr4a1_os: z.string().max(850),
  cr4a1_primeira_foto: z.string().max(4000).nullish(),
  cr4a1_qtde_fotos: z.string().max(100).nullish(),
  cr4a1_setor: z.string().max(100).nullish(),
  cr4a1_status: z.string().max(100).nullish(),
  cr4a1_tipo: z.string().max(100).nullish(),
  cr4a1_xstatus: z.string().max(100).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1RelatorioFotograficoWrite = z.infer<typeof Cr4a1RelatorioFotograficoWrite>;

export const Cr4a1RelatorioFotograficoMeta = {
  name: "Relatorio_Fotografico",
  logicalName: "cr4a1_relatorio_fotografico",
  entitySet: "cr4a1_relatorio_fotograficos",
  primaryId: "cr4a1_relatorio_fotograficoid",
  primaryName: "cr4a1_os",
  writable: true,
} as const satisfies DataverseEntityMeta;

/** ZB6_Relatorio — `cr4a1_zb6_relatorio` */
export interface Cr4a1Zb6RelatorioRow {
  cr4a1_cliente_area?: string | null;
  cr4a1_cliente_me?: string | null;
  cr4a1_cliente_mo?: string | null;
  cr4a1_cliente_ni?: string | null;
  cr4a1_cliente_nome?: string | null;
  cr4a1_cliente_om?: string | null;
  cr4a1_cliente_pedido?: string | null;
  cr4a1_contato_cli?: string | null;
  cr4a1_data_rec?: string | null;
  cr4a1_data_relat?: string | null;
  cr4a1_elab_relat?: string | null;
  cr4a1_eq_carcaca?: string | null;
  cr4a1_eq_categoria?: string | null;
  cr4a1_eq_corrente?: string | null;
  cr4a1_eq_descricao?: string | null;
  cr4a1_eq_fabricante?: string | null;
  cr4a1_eq_fc?: string | null;
  cr4a1_eq_freq?: string | null;
  cr4a1_eq_ip?: string | null;
  cr4a1_eq_isol?: string | null;
  cr4a1_eq_modelo?: string | null;
  cr4a1_eq_peso?: string | null;
  cr4a1_eq_polaridade?: string | null;
  cr4a1_eq_potencia_cv?: string | null;
  cr4a1_eq_regime?: string | null;
  cr4a1_eq_rpm?: string | null;
  cr4a1_eq_serie?: string | null;
  cr4a1_eq_tensao?: string | null;
  cr4a1_nf_remessa?: string | null;
  cr4a1_novacoluna?: string | null;
  cr4a1_r_e_c_d_e_l_?: string | null;
  cr4a1_r_e_c_n_o_?: string | null;
  cr4a1_resp_tecnico?: string | null;
  cr4a1_rpm?: string | null;
  cr4a1_servico_historico?: string | null;
  cr4a1_tag_cliente?: string | null;
  cr4a1_tag_kairos?: string | null;
  cr4a1_zb6_apacor?: string | null;
  cr4a1_zb6_client?: string | null;
  cr4a1_zb6_codeq?: string | null;
  cr4a1_zb6_contra?: string | null;
  cr4a1_zb6_datenv?: string | null;
  cr4a1_zb6_dessta?: string | null;
  cr4a1_zb6_dirapr?: string | null;
  cr4a1_zb6_dpeca?: string | null;
  cr4a1_zb6_dtauto?: string | null;
  cr4a1_zb6_dtcada?: string | null;
  cr4a1_zb6_dtentr?: string | null;
  cr4a1_zb6_dtenvi?: string | null;
  cr4a1_zb6_dtltf?: string | null;
  cr4a1_zb6_dtnfdv?: string | null;
  cr4a1_zb6_dtnfp2?: string | null;
  cr4a1_zb6_dtnfp3?: string | null;
  cr4a1_zb6_dtnfp4?: string | null;
  cr4a1_zb6_dtnfp5?: string | null;
  cr4a1_zb6_dtnfp6?: string | null;
  cr4a1_zb6_dtnfpr?: string | null;
  cr4a1_zb6_dtnfs2?: string | null;
  cr4a1_zb6_dtnfs3?: string | null;
  cr4a1_zb6_dtnfs4?: string | null;
  cr4a1_zb6_dtnfs5?: string | null;
  cr4a1_zb6_dtnfs6?: string | null;
  cr4a1_zb6_dtnfsv?: string | null;
  cr4a1_zb6_dtpven?: string | null;
  cr4a1_zb6_dtrecp?: string | null;
  cr4a1_zb6_emissa?: string | null;
  cr4a1_zb6_entrdt?: string | null;
  cr4a1_zb6_envio?: string | null;
  cr4a1_zb6_envmed?: string | null;
  cr4a1_zb6_envp?: string | null;
  cr4a1_zb6_equipa?: string | null;
  cr4a1_zb6_filial?: string | null;
  cr4a1_zb6_fora?: string | null;
  cr4a1_zb6_kw?: string | null;
  cr4a1_zb6_loja?: string | null;
  cr4a1_zb6_nfdevo?: string | null;
  cr4a1_zb6_nfpro2?: string | null;
  cr4a1_zb6_nfpro3?: string | null;
  cr4a1_zb6_nfpro4?: string | null;
  cr4a1_zb6_nfpro5?: string | null;
  cr4a1_zb6_nfpro6?: string | null;
  cr4a1_zb6_nfprod?: string | null;
  cr4a1_zb6_nfser2?: string | null;
  cr4a1_zb6_nfser3?: string | null;
  cr4a1_zb6_nfser4?: string | null;
  cr4a1_zb6_nfser5?: string | null;
  cr4a1_zb6_nfser6?: string | null;
  cr4a1_zb6_nfserv?: string | null;
  cr4a1_zb6_ngt?: string | null;
  cr4a1_zb6_nne?: string | null;
  cr4a1_zb6_nummed?: string | null;
  cr4a1_zb6_obstec?: string | null;
  cr4a1_zb6_ordem?: string | null;
  cr4a1_zb6_oskair?: string | null;
  cr4a1_zb6_pcserv?: string | null;
  cr4a1_zb6_pdnfre?: string | null;
  cr4a1_zb6_peri10?: string | null;
  cr4a1_zb6_peri11?: string | null;
  cr4a1_zb6_peri12?: string | null;
  cr4a1_zb6_peri13?: string | null;
  cr4a1_zb6_peri14?: string | null;
  cr4a1_zb6_peri15?: string | null;
  cr4a1_zb6_peri16?: string | null;
  cr4a1_zb6_peri17?: string | null;
  cr4a1_zb6_peri18?: string | null;
  cr4a1_zb6_perit1?: string | null;
  cr4a1_zb6_perit2?: string | null;
  cr4a1_zb6_perit3?: string | null;
  cr4a1_zb6_perit4?: string | null;
  cr4a1_zb6_perit5?: string | null;
  cr4a1_zb6_perit6?: string | null;
  cr4a1_zb6_perit7?: string | null;
  cr4a1_zb6_perit8?: string | null;
  cr4a1_zb6_perit9?: string | null;
  cr4a1_zb6_prazc?: string | null;
  cr4a1_zb6_prazo?: string | null;
  cr4a1_zb6_priori?: string | null;
  cr4a1_zb6_proble?: string | null;
  cr4a1_zb6_propos?: string | null;
  cr4a1_zb6_relatorioid?: string | null;
  cr4a1_zb6_respen?: string | null;
  cr4a1_zb6_rpm?: string | null;
  cr4a1_zb6_servico?: string | null;
  cr4a1_zb6_tipose?: string | null;
  cr4a1_zb6_totpro?: string | null;
  cr4a1_zb6_vlmatc?: string | null;
  cr4a1_zb6_vlnfm?: string | null;
  cr4a1_zb6_vlnfm1?: string | null;
  cr4a1_zb6_vlnfm2?: string | null;
  cr4a1_zb6_vlnfm4?: string | null;
  cr4a1_zb6_vlnfm5?: string | null;
  cr4a1_zb6_vlnfm6?: string | null;
  cr4a1_zb6_vlnfs?: string | null;
  cr4a1_zb6_vlnfs1?: string | null;
  cr4a1_zb6_vlnfs2?: string | null;
  cr4a1_zb6_vlnfs3?: string | null;
  cr4a1_zb6_vlnfs4?: string | null;
  cr4a1_zb6_vlnfs5?: string | null;
  cr4a1_zb6_vlriva?: string | null;
  cr4a1_zb6_vlrser?: string | null;
  cr4a1_zb6_vlserc?: string | null;
  cr4a1_zb6_xacomp?: string | null;
  cr4a1_zb6_xapspc?: string | null;
  cr4a1_zb6_xbmc?: string | null;
  cr4a1_zb6_xchama?: string | null;
  cr4a1_zb6_xclint?: string | null;
  cr4a1_zb6_xdesig?: string | null;
  cr4a1_zb6_xdfrs1?: string | null;
  cr4a1_zb6_xdfrs2?: string | null;
  cr4a1_zb6_xdfrs3?: string | null;
  cr4a1_zb6_xdfrs4?: string | null;
  cr4a1_zb6_xdfrs5?: string | null;
  cr4a1_zb6_xdtatu?: string | null;
  cr4a1_zb6_xdtcor?: string | null;
  cr4a1_zb6_xdtenv?: string | null;
  cr4a1_zb6_xdtini?: string | null;
  cr4a1_zb6_xdtope?: string | null;
  cr4a1_zb6_xdtpds?: string | null;
  cr4a1_zb6_xdtpma?: string | null;
  cr4a1_zb6_xdtpre?: string | null;
  cr4a1_zb6_xdtprf?: string | null;
  cr4a1_zb6_xdtprm?: string | null;
  cr4a1_zb6_xdtprs?: string | null;
  cr4a1_zb6_xdtpse?: string | null;
  cr4a1_zb6_xdtrec?: string | null;
  cr4a1_zb6_xdtven?: string | null;
  cr4a1_zb6_xfrs1?: string | null;
  cr4a1_zb6_xfrs2?: string | null;
  cr4a1_zb6_xfrs3?: string | null;
  cr4a1_zb6_xfrs4?: string | null;
  cr4a1_zb6_xfrs5?: string | null;
  cr4a1_zb6_xhisto?: string | null;
  cr4a1_zb6_xinter?: string | null;
  cr4a1_zb6_xkanpc?: string | null;
  cr4a1_zb6_xkva?: string | null;
  cr4a1_zb6_xnfenc?: string | null;
  cr4a1_zb6_xnpdcm?: string | null;
  cr4a1_zb6_xnpdcs?: string | null;
  cr4a1_zb6_xnumch?: string | null;
  cr4a1_zb6_xnumre?: string | null;
  cr4a1_zb6_xopec?: string | null;
  cr4a1_zb6_xoppec?: string | null;
  cr4a1_zb6_xorca?: string | null;
  cr4a1_zb6_xorcst?: string | null;
  cr4a1_zb6_xorcto?: string | null;
  cr4a1_zb6_xprevf?: string | null;
  cr4a1_zb6_xprevs?: string | null;
  cr4a1_zb6_xprmpc?: string | null;
  cr4a1_zb6_xpropc?: string | null;
  cr4a1_zb6_xprspc?: string | null;
  cr4a1_zb6_xrejei?: string | null;
  cr4a1_zb6_xtempo?: string | null;
  cr4a1_zb6_xtotf?: string | null;
  cr4a1_zb6_xvalid?: string | null;
  cr4a1_zb6_xvlriv?: string | null;
  createdby?: string | null;
  "_createdby_value"?: string | null;
  createdbyname?: string | null;
  createdon?: string | null;
  createdonbehalfby?: string | null;
  "_createdonbehalfby_value"?: string | null;
  createdonbehalfbyname?: string | null;
  importsequencenumber?: number | null;
  modifiedby?: string | null;
  "_modifiedby_value"?: string | null;
  modifiedbyname?: string | null;
  modifiedon?: string | null;
  modifiedonbehalfby?: string | null;
  "_modifiedonbehalfby_value"?: string | null;
  modifiedonbehalfbyname?: string | null;
  overriddencreatedon?: string | null;
  ownerid?: string | null;
  "_ownerid_value"?: string | null;
  owneridname?: string | null;
  owneridtype?: string | null;
  owningbusinessunit?: string | null;
  "_owningbusinessunit_value"?: string | null;
  owningbusinessunitname?: string | null;
  owningteam?: string | null;
  "_owningteam_value"?: string | null;
  owninguser?: string | null;
  "_owninguser_value"?: string | null;
  statecode?: E.Cr4a1Zb6Relatorio_StatecodeValue | null;
  statuscode?: E.Cr4a1Zb6Relatorio_StatuscodeValue | null;
  timezoneruleversionnumber?: number | null;
  utcconversiontimezonecode?: number | null;
  versionnumber?: number | null;
}

export const Cr4a1Zb6RelatorioWrite = z.object({
  cr4a1_cliente_area: z.string().max(500).nullish(),
  cr4a1_cliente_me: z.string().max(500).nullish(),
  cr4a1_cliente_mo: z.string().max(500).nullish(),
  cr4a1_cliente_ni: z.string().max(500).nullish(),
  cr4a1_cliente_nome: z.string().max(500).nullish(),
  cr4a1_cliente_om: z.string().max(500).nullish(),
  cr4a1_cliente_pedido: z.string().max(500).nullish(),
  cr4a1_contato_cli: z.string().max(500).nullish(),
  cr4a1_data_rec: z.string().max(500).nullish(),
  cr4a1_data_relat: z.string().max(500).nullish(),
  cr4a1_elab_relat: z.string().max(500).nullish(),
  cr4a1_eq_carcaca: z.string().max(500).nullish(),
  cr4a1_eq_categoria: z.string().max(500).nullish(),
  cr4a1_eq_corrente: z.string().max(500).nullish(),
  cr4a1_eq_descricao: z.string().max(500).nullish(),
  cr4a1_eq_fabricante: z.string().max(500).nullish(),
  cr4a1_eq_fc: z.string().max(500).nullish(),
  cr4a1_eq_freq: z.string().max(500).nullish(),
  cr4a1_eq_ip: z.string().max(500).nullish(),
  cr4a1_eq_isol: z.string().max(500).nullish(),
  cr4a1_eq_modelo: z.string().max(500).nullish(),
  cr4a1_eq_peso: z.string().max(500).nullish(),
  cr4a1_eq_polaridade: z.string().max(500).nullish(),
  cr4a1_eq_potencia_cv: z.string().max(500).nullish(),
  cr4a1_eq_regime: z.string().max(500).nullish(),
  cr4a1_eq_rpm: z.string().max(500).nullish(),
  cr4a1_eq_serie: z.string().max(500).nullish(),
  cr4a1_eq_tensao: z.string().max(500).nullish(),
  cr4a1_nf_remessa: z.string().max(500).nullish(),
  cr4a1_novacoluna: z.string().max(850),
  cr4a1_r_e_c_d_e_l_: z.string().max(500).nullish(),
  cr4a1_r_e_c_n_o_: z.string().max(500).nullish(),
  cr4a1_resp_tecnico: z.string().max(500).nullish(),
  cr4a1_rpm: z.string().max(100).nullish(),
  cr4a1_servico_historico: z.string().max(100).nullish(),
  cr4a1_tag_cliente: z.string().max(500).nullish(),
  cr4a1_tag_kairos: z.string().max(500).nullish(),
  cr4a1_zb6_apacor: z.string().max(500).nullish(),
  cr4a1_zb6_client: z.string().max(500).nullish(),
  cr4a1_zb6_codeq: z.string().max(500).nullish(),
  cr4a1_zb6_contra: z.string().max(500).nullish(),
  cr4a1_zb6_datenv: z.string().max(500).nullish(),
  cr4a1_zb6_dessta: z.string().max(500).nullish(),
  cr4a1_zb6_dirapr: z.string().max(500).nullish(),
  cr4a1_zb6_dpeca: z.string().max(500).nullish(),
  cr4a1_zb6_dtauto: z.string().max(500).nullish(),
  cr4a1_zb6_dtcada: z.string().max(500).nullish(),
  cr4a1_zb6_dtentr: z.string().max(500).nullish(),
  cr4a1_zb6_dtenvi: z.string().max(500).nullish(),
  cr4a1_zb6_dtltf: z.string().max(500).nullish(),
  cr4a1_zb6_dtnfdv: z.string().max(500).nullish(),
  cr4a1_zb6_dtnfp2: z.string().max(500).nullish(),
  cr4a1_zb6_dtnfp3: z.string().max(500).nullish(),
  cr4a1_zb6_dtnfp4: z.string().max(500).nullish(),
  cr4a1_zb6_dtnfp5: z.string().max(500).nullish(),
  cr4a1_zb6_dtnfp6: z.string().max(500).nullish(),
  cr4a1_zb6_dtnfpr: z.string().max(500).nullish(),
  cr4a1_zb6_dtnfs2: z.string().max(500).nullish(),
  cr4a1_zb6_dtnfs3: z.string().max(500).nullish(),
  cr4a1_zb6_dtnfs4: z.string().max(500).nullish(),
  cr4a1_zb6_dtnfs5: z.string().max(500).nullish(),
  cr4a1_zb6_dtnfs6: z.string().max(500).nullish(),
  cr4a1_zb6_dtnfsv: z.string().max(500).nullish(),
  cr4a1_zb6_dtpven: z.string().max(500).nullish(),
  cr4a1_zb6_dtrecp: z.string().max(500).nullish(),
  cr4a1_zb6_emissa: z.string().max(500).nullish(),
  cr4a1_zb6_entrdt: z.string().max(500).nullish(),
  cr4a1_zb6_envio: z.string().max(500).nullish(),
  cr4a1_zb6_envmed: z.string().max(500).nullish(),
  cr4a1_zb6_envp: z.string().max(500).nullish(),
  cr4a1_zb6_equipa: z.string().max(500).nullish(),
  cr4a1_zb6_filial: z.string().max(500).nullish(),
  cr4a1_zb6_fora: z.string().max(500).nullish(),
  cr4a1_zb6_kw: z.string().max(500).nullish(),
  cr4a1_zb6_loja: z.string().max(500).nullish(),
  cr4a1_zb6_nfdevo: z.string().max(500).nullish(),
  cr4a1_zb6_nfpro2: z.string().max(500).nullish(),
  cr4a1_zb6_nfpro3: z.string().max(500).nullish(),
  cr4a1_zb6_nfpro4: z.string().max(500).nullish(),
  cr4a1_zb6_nfpro5: z.string().max(500).nullish(),
  cr4a1_zb6_nfpro6: z.string().max(500).nullish(),
  cr4a1_zb6_nfprod: z.string().max(500).nullish(),
  cr4a1_zb6_nfser2: z.string().max(500).nullish(),
  cr4a1_zb6_nfser3: z.string().max(500).nullish(),
  cr4a1_zb6_nfser4: z.string().max(500).nullish(),
  cr4a1_zb6_nfser5: z.string().max(500).nullish(),
  cr4a1_zb6_nfser6: z.string().max(500).nullish(),
  cr4a1_zb6_nfserv: z.string().max(500).nullish(),
  cr4a1_zb6_ngt: z.string().max(500).nullish(),
  cr4a1_zb6_nne: z.string().max(500).nullish(),
  cr4a1_zb6_nummed: z.string().max(500).nullish(),
  cr4a1_zb6_obstec: z.string().max(500).nullish(),
  cr4a1_zb6_ordem: z.string().max(500).nullish(),
  cr4a1_zb6_oskair: z.string().max(500).nullish(),
  cr4a1_zb6_pcserv: z.string().max(500).nullish(),
  cr4a1_zb6_pdnfre: z.string().max(500).nullish(),
  cr4a1_zb6_peri10: z.string().max(500).nullish(),
  cr4a1_zb6_peri11: z.string().max(500).nullish(),
  cr4a1_zb6_peri12: z.string().max(500).nullish(),
  cr4a1_zb6_peri13: z.string().max(500).nullish(),
  cr4a1_zb6_peri14: z.string().max(500).nullish(),
  cr4a1_zb6_peri15: z.string().max(500).nullish(),
  cr4a1_zb6_peri16: z.string().max(500).nullish(),
  cr4a1_zb6_peri17: z.string().max(500).nullish(),
  cr4a1_zb6_peri18: z.string().max(500).nullish(),
  cr4a1_zb6_perit1: z.string().max(500).nullish(),
  cr4a1_zb6_perit2: z.string().max(500).nullish(),
  cr4a1_zb6_perit3: z.string().max(500).nullish(),
  cr4a1_zb6_perit4: z.string().max(500).nullish(),
  cr4a1_zb6_perit5: z.string().max(500).nullish(),
  cr4a1_zb6_perit6: z.string().max(500).nullish(),
  cr4a1_zb6_perit7: z.string().max(500).nullish(),
  cr4a1_zb6_perit8: z.string().max(500).nullish(),
  cr4a1_zb6_perit9: z.string().max(500).nullish(),
  cr4a1_zb6_prazc: z.string().max(500).nullish(),
  cr4a1_zb6_prazo: z.string().max(500).nullish(),
  cr4a1_zb6_priori: z.string().max(500).nullish(),
  cr4a1_zb6_proble: z.string().max(500).nullish(),
  cr4a1_zb6_propos: z.string().max(500).nullish(),
  cr4a1_zb6_respen: z.string().max(500).nullish(),
  cr4a1_zb6_rpm: z.string().max(100).nullish(),
  cr4a1_zb6_servico: z.string().max(100).nullish(),
  cr4a1_zb6_tipose: z.string().max(500).nullish(),
  cr4a1_zb6_totpro: z.string().max(500).nullish(),
  cr4a1_zb6_vlmatc: z.string().max(500).nullish(),
  cr4a1_zb6_vlnfm: z.string().max(500).nullish(),
  cr4a1_zb6_vlnfm1: z.string().max(500).nullish(),
  cr4a1_zb6_vlnfm2: z.string().max(500).nullish(),
  cr4a1_zb6_vlnfm4: z.string().max(500).nullish(),
  cr4a1_zb6_vlnfm5: z.string().max(500).nullish(),
  cr4a1_zb6_vlnfm6: z.string().max(500).nullish(),
  cr4a1_zb6_vlnfs: z.string().max(500).nullish(),
  cr4a1_zb6_vlnfs1: z.string().max(500).nullish(),
  cr4a1_zb6_vlnfs2: z.string().max(500).nullish(),
  cr4a1_zb6_vlnfs3: z.string().max(500).nullish(),
  cr4a1_zb6_vlnfs4: z.string().max(500).nullish(),
  cr4a1_zb6_vlnfs5: z.string().max(500).nullish(),
  cr4a1_zb6_vlriva: z.string().max(500).nullish(),
  cr4a1_zb6_vlrser: z.string().max(500).nullish(),
  cr4a1_zb6_vlserc: z.string().max(500).nullish(),
  cr4a1_zb6_xacomp: z.string().max(500).nullish(),
  cr4a1_zb6_xapspc: z.string().max(500).nullish(),
  cr4a1_zb6_xbmc: z.string().max(500).nullish(),
  cr4a1_zb6_xchama: z.string().max(500).nullish(),
  cr4a1_zb6_xclint: z.string().max(500).nullish(),
  cr4a1_zb6_xdesig: z.string().max(500).nullish(),
  cr4a1_zb6_xdfrs1: z.string().max(500).nullish(),
  cr4a1_zb6_xdfrs2: z.string().max(500).nullish(),
  cr4a1_zb6_xdfrs3: z.string().max(500).nullish(),
  cr4a1_zb6_xdfrs4: z.string().max(500).nullish(),
  cr4a1_zb6_xdfrs5: z.string().max(500).nullish(),
  cr4a1_zb6_xdtatu: z.string().max(500).nullish(),
  cr4a1_zb6_xdtcor: z.string().max(500).nullish(),
  cr4a1_zb6_xdtenv: z.string().max(500).nullish(),
  cr4a1_zb6_xdtini: z.string().max(500).nullish(),
  cr4a1_zb6_xdtope: z.string().max(500).nullish(),
  cr4a1_zb6_xdtpds: z.string().max(500).nullish(),
  cr4a1_zb6_xdtpma: z.string().max(500).nullish(),
  cr4a1_zb6_xdtpre: z.string().max(500).nullish(),
  cr4a1_zb6_xdtprf: z.string().max(500).nullish(),
  cr4a1_zb6_xdtprm: z.string().max(500).nullish(),
  cr4a1_zb6_xdtprs: z.string().max(500).nullish(),
  cr4a1_zb6_xdtpse: z.string().max(500).nullish(),
  cr4a1_zb6_xdtrec: z.string().max(500).nullish(),
  cr4a1_zb6_xdtven: z.string().max(500).nullish(),
  cr4a1_zb6_xfrs1: z.string().max(500).nullish(),
  cr4a1_zb6_xfrs2: z.string().max(500).nullish(),
  cr4a1_zb6_xfrs3: z.string().max(500).nullish(),
  cr4a1_zb6_xfrs4: z.string().max(500).nullish(),
  cr4a1_zb6_xfrs5: z.string().max(500).nullish(),
  cr4a1_zb6_xhisto: z.string().max(500).nullish(),
  cr4a1_zb6_xinter: z.string().max(500).nullish(),
  cr4a1_zb6_xkanpc: z.string().max(500).nullish(),
  cr4a1_zb6_xkva: z.string().max(500).nullish(),
  cr4a1_zb6_xnfenc: z.string().max(500).nullish(),
  cr4a1_zb6_xnpdcm: z.string().max(500).nullish(),
  cr4a1_zb6_xnpdcs: z.string().max(500).nullish(),
  cr4a1_zb6_xnumch: z.string().max(500).nullish(),
  cr4a1_zb6_xnumre: z.string().max(500).nullish(),
  cr4a1_zb6_xopec: z.string().max(500).nullish(),
  cr4a1_zb6_xoppec: z.string().max(500).nullish(),
  cr4a1_zb6_xorca: z.string().max(500).nullish(),
  cr4a1_zb6_xorcst: z.string().max(500).nullish(),
  cr4a1_zb6_xorcto: z.string().max(500).nullish(),
  cr4a1_zb6_xprevf: z.string().max(500).nullish(),
  cr4a1_zb6_xprevs: z.string().max(500).nullish(),
  cr4a1_zb6_xprmpc: z.string().max(500).nullish(),
  cr4a1_zb6_xpropc: z.string().max(500).nullish(),
  cr4a1_zb6_xprspc: z.string().max(500).nullish(),
  cr4a1_zb6_xrejei: z.string().max(500).nullish(),
  cr4a1_zb6_xtempo: z.string().max(500).nullish(),
  cr4a1_zb6_xtotf: z.string().max(500).nullish(),
  cr4a1_zb6_xvalid: z.string().max(500).nullish(),
  cr4a1_zb6_xvlriv: z.string().max(500).nullish(),
  statecode: z.union([z.literal(0), z.literal(1)]),
  statuscode: z.union([z.literal(1), z.literal(2)]).nullish(),
}).partial();
export type Cr4a1Zb6RelatorioWrite = z.infer<typeof Cr4a1Zb6RelatorioWrite>;

export const Cr4a1Zb6RelatorioMeta = {
  name: "ZB6_Relatorio",
  logicalName: "cr4a1_zb6_relatorio",
  entitySet: "cr4a1_zb6_relatorios",
  primaryId: "cr4a1_zb6_relatorioid",
  primaryName: "cr4a1_novacoluna",
  writable: true,
} as const satisfies DataverseEntityMeta;

export const DATAVERSE_ENTITIES = {
  "cr4a1_controleferramentas": Cr4a1ControleferramentasMeta,
  "cr4a1_rdsmanagement": Cr4a1RdsmanagementMeta,
  "cr4a1_caldeiraria_controle": Cr4a1CaldeirariaControleMeta,
  "cr4a1_caldeiraria_lista": Cr4a1CaldeirariaListaMeta,
  "cr4a1_peritagem_final": Cr4a1PeritagemFinalMeta,
  "cr4a1_prod_avaliacao_final_opc": Cr4a1ProdAvaliacaoFinalOpcMeta,
  "cr4a1_prod_inspecao": Cr4a1ProdInspecaoMeta,
  "cr4a1_cipa_vot": Cr4a1CipaVotMeta,
  "cr4a1_controle_veiculo": Cr4a1ControleVeiculoMeta,
  "cr4a1_controle_man_veicul": Cr4a1ControleManVeiculMeta,
  "cr4a1_credenciais": Cr4a1CredenciaisMeta,
  "cr4a1_base_medro": Cr4a1BaseMedroMeta,
  "cr4a1_requisicao": Cr4a1RequisicaoMeta,
  "cr4a1_laudos": Cr4a1LaudosMeta,
  "cr4a1_prod_liberarensaio": Cr4a1ProdLiberarensaioMeta,
  "cr4a1_servicosterceirizados": Cr4a1ServicosterceirizadosMeta,
  "cr4a1_servicosterceirizados_for": Cr4a1ServicosterceirizadosForMeta,
  "cr4a1_ensaio_temporizado": Cr4a1EnsaioTemporizadoMeta,
  "cr4a1_cipa_2026": Cr4a1Cipa2026Meta,
  "cr4a1_ck_farol": Cr4a1CkFarolMeta,
  "principalobjectattributeaccess": PrincipalobjectattributeaccessMeta,
  "systemuser": SystemuserMeta,
  "cr4a1_balanceamento": Cr4a1BalanceamentoMeta,
  "cr4a1_relatorio_fotografico": Cr4a1RelatorioFotograficoMeta,
  "cr4a1_zb6_relatorio": Cr4a1Zb6RelatorioMeta,
} as const;
export type DataverseEntityKey = keyof typeof DATAVERSE_ENTITIES;
