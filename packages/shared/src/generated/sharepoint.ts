// ⚠️  ARQUIVO GERADO por tooling/codegen — não editar à mão.
// Fonte: docs/_data/data-model.json  ·  regenerar: pnpm codegen
// listas SharePoint — tipos e metadados

import { z } from "zod";

/** SAC - Kairós · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface SACKairSRow {
  ID?: number | null;
  Title?: string | null;
  Senha?: string | null;
  Informa_x00e7__x00e3_o?: string | null;
  Resposta?: string | null;
  Data_in?: string | null;
  Data_fin?: string | null;
  App?: string | null;
  Responsavel?: string | null;
  Modified?: string | null;
  Created?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
  ComplianceAssetId?: string | null;
}

export const SACKairSWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string(),
  Senha: z.string().nullish(),
  Informa_x00e7__x00e3_o: z.string().nullish(),
  Resposta: z.string().nullish(),
  Data_in: z.string().nullish(),
  Data_fin: z.string().nullish(),
  App: z.string().nullish(),
  Responsavel: z.string().nullish(),
  Modified: z.string().nullish(),
  Created: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
  ComplianceAssetId: z.string().nullish(),
}).partial();
export type SACKairSWrite = z.infer<typeof SACKairSWrite>;

export const SACKairSMeta = {
  name: "SAC - Kairós",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "a9b6a146-31c8-478c-a5b7-cc8af2aac64b",
  permission: "read-write",
} as const;

/** PF e IQ · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface PFEIQRow {
  ID?: number | null;
  Title?: string | null;
  Created?: string | null;
  Data?: string | null;
  "Check_acoplamento#Id"?: number | null;
  Check_acoplamento?: Record<string, unknown> | null;
  "Check_Eixolivre#Id"?: number | null;
  Check_Eixolivre?: Record<string, unknown> | null;
  "Check_Rolamentos#Id"?: number | null;
  Check_Rolamentos?: Record<string, unknown> | null;
  "Check_Chaveta#Id"?: number | null;
  Check_Chaveta?: Record<string, unknown> | null;
  "Check_AneisFixinternos#Id"?: number | null;
  Check_AneisFixinternos?: Record<string, unknown> | null;
  "Check_Olhal#Id"?: number | null;
  Check_Olhal?: Record<string, unknown> | null;
  "Check_Tampadefletora#Id"?: number | null;
  Check_Tampadefletora?: Record<string, unknown> | null;
  "Check_Ventilador#Id"?: number | null;
  Check_Ventilador?: Record<string, unknown> | null;
  "Check_Prolongador#Id"?: number | null;
  Check_Prolongador?: Record<string, unknown> | null;
  "Check_Pino#Id"?: number | null;
  Check_Pino?: Record<string, unknown> | null;
  "Check_Protetor#Id"?: number | null;
  Check_Protetor?: Record<string, unknown> | null;
  "Check_PinturaExterna#Id"?: number | null;
  Check_PinturaExterna?: Record<string, unknown> | null;
  "Check_parafusos#Id"?: number | null;
  Check_parafusos?: Record<string, unknown> | null;
  "Check_Veda_x00e7__x00f5_es#Id"?: number | null;
  Check_Veda_x00e7__x00f5_es?: Record<string, unknown> | null;
  "Check_Kitfreio#Id"?: number | null;
  Check_Kitfreio?: Record<string, unknown> | null;
  "Check_PlacaOS#Id"?: number | null;
  Check_PlacaOS?: Record<string, unknown> | null;
  "Check_PlacaTAG#Id"?: number | null;
  Check_PlacaTAG?: Record<string, unknown> | null;
  "Check_SeloQuali#Id"?: number | null;
  Check_SeloQuali?: Record<string, unknown> | null;
  "Check_Resina#Id"?: number | null;
  Check_Resina?: Record<string, unknown> | null;
  "Check_Caixa#Id"?: number | null;
  Check_Caixa?: Record<string, unknown> | null;
  "Check_Cabosdefor_x00e7_a#Id"?: number | null;
  Check_Cabosdefor_x00e7_a?: Record<string, unknown> | null;
  "Check_terminais#Id"?: number | null;
  Check_terminais?: Record<string, unknown> | null;
  "Check_ponteret#Id"?: number | null;
  Check_ponteret?: Record<string, unknown> | null;
  Check_isola_x00e7__x00e3_osaida?: string | null;
  Check_resistenciasaida?: string | null;
  "Check_EScaixametalica#Id"?: number | null;
  Check_EScaixametalica?: Record<string, unknown> | null;
  "Check_ESprensacabo#Id"?: number | null;
  Check_ESprensacabo?: Record<string, unknown> | null;
  "Check_EScaboPP#Id"?: number | null;
  Check_EScaboPP?: Record<string, unknown> | null;
  "Check_ESroscasaux#Id"?: number | null;
  Check_ESroscasaux?: Record<string, unknown> | null;
  "Check_Prato#Id"?: number | null;
  Check_Prato?: Record<string, unknown> | null;
  "Check_ESporcacast#Id"?: number | null;
  Check_ESporcacast?: Record<string, unknown> | null;
  "Check_ESkitfixprato#Id"?: number | null;
  Check_ESkitfixprato?: Record<string, unknown> | null;
  "Check_ESroscapontadoeixo#Id"?: number | null;
  Check_ESroscapontadoeixo?: Record<string, unknown> | null;
  "Check_ESparafusofixsiroco#Id"?: number | null;
  Check_ESparafusofixsiroco?: Record<string, unknown> | null;
  "Check_ESflangesiroco#Id"?: number | null;
  Check_ESflangesiroco?: Record<string, unknown> | null;
  "Check_EScubofixdsiroco#Id"?: number | null;
  Check_EScubofixdsiroco?: Record<string, unknown> | null;
  OBS_qualidade?: string | null;
  OBS_teste?: string | null;
  Test_Isol1?: string | null;
  Test_Isol2?: string | null;
  Test_Isol3?: string | null;
  Test_resR?: string | null;
  Test_resS?: string | null;
  Test_resT?: string | null;
  Test_res1_x002d_4?: string | null;
  Test_res2_x002d_5?: string | null;
  Test_res3_x002d_6?: string | null;
  Test_res7_x002d_10?: string | null;
  Test_res8_x002d_11?: string | null;
  Test_res9_x002d_12?: string | null;
  Test_Tens_x00e3_o?: string | null;
  Test_Rota_x00e7__x00e3_o0?: string | null;
  Test_CorrenteR?: string | null;
  Test_CorrenteS?: string | null;
  Test_CorrenteT?: string | null;
  Test_tempC?: string | null;
  Test_TempMancalLA?: string | null;
  Test_TempMancalLOA?: string | null;
  TestTempEsta?: string | null;
  Test_TempAmbi?: string | null;
  Test_VibMLA?: string | null;
  Test_VibMLOA?: string | null;
  Filial?: string | null;
  Test_VibALA?: string | null;
  Test_VibVLOA?: string | null;
  Test_VibHLOA?: string | null;
  "TestAPROVADO#Id"?: number | null;
  TestAPROVADO?: Record<string, unknown> | null;
  DataInspe_x00e7__x00e3_o?: string | null;
  Test_Rotacao?: string | null;
  Nome?: string | null;
  Nome_inspetor?: string | null;
  ID_ESPELHO?: number | null;
  Unidade?: string | null;
  Modified?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
  ComplianceAssetId?: string | null;
  Test_VibALOA?: string | null;
  "Check_aprovado#Id"?: number | null;
  Check_aprovado?: Record<string, unknown> | null;
}

export const PFEIQWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string(),
  Created: z.string().nullish(),
  Data: z.string().nullish(),
  "Check_acoplamento#Id": z.number().int().nullish(),
  Check_acoplamento: z.record(z.unknown()).nullish(),
  "Check_Eixolivre#Id": z.number().int().nullish(),
  Check_Eixolivre: z.record(z.unknown()).nullish(),
  "Check_Rolamentos#Id": z.number().int().nullish(),
  Check_Rolamentos: z.record(z.unknown()).nullish(),
  "Check_Chaveta#Id": z.number().int().nullish(),
  Check_Chaveta: z.record(z.unknown()).nullish(),
  "Check_AneisFixinternos#Id": z.number().int().nullish(),
  Check_AneisFixinternos: z.record(z.unknown()).nullish(),
  "Check_Olhal#Id": z.number().int().nullish(),
  Check_Olhal: z.record(z.unknown()).nullish(),
  "Check_Tampadefletora#Id": z.number().int().nullish(),
  Check_Tampadefletora: z.record(z.unknown()).nullish(),
  "Check_Ventilador#Id": z.number().int().nullish(),
  Check_Ventilador: z.record(z.unknown()).nullish(),
  "Check_Prolongador#Id": z.number().int().nullish(),
  Check_Prolongador: z.record(z.unknown()).nullish(),
  "Check_Pino#Id": z.number().int().nullish(),
  Check_Pino: z.record(z.unknown()).nullish(),
  "Check_Protetor#Id": z.number().int().nullish(),
  Check_Protetor: z.record(z.unknown()).nullish(),
  "Check_PinturaExterna#Id": z.number().int().nullish(),
  Check_PinturaExterna: z.record(z.unknown()).nullish(),
  "Check_parafusos#Id": z.number().int().nullish(),
  Check_parafusos: z.record(z.unknown()).nullish(),
  "Check_Veda_x00e7__x00f5_es#Id": z.number().int().nullish(),
  Check_Veda_x00e7__x00f5_es: z.record(z.unknown()).nullish(),
  "Check_Kitfreio#Id": z.number().int().nullish(),
  Check_Kitfreio: z.record(z.unknown()).nullish(),
  "Check_PlacaOS#Id": z.number().int().nullish(),
  Check_PlacaOS: z.record(z.unknown()).nullish(),
  "Check_PlacaTAG#Id": z.number().int().nullish(),
  Check_PlacaTAG: z.record(z.unknown()).nullish(),
  "Check_SeloQuali#Id": z.number().int().nullish(),
  Check_SeloQuali: z.record(z.unknown()).nullish(),
  "Check_Resina#Id": z.number().int().nullish(),
  Check_Resina: z.record(z.unknown()).nullish(),
  "Check_Caixa#Id": z.number().int().nullish(),
  Check_Caixa: z.record(z.unknown()).nullish(),
  "Check_Cabosdefor_x00e7_a#Id": z.number().int().nullish(),
  Check_Cabosdefor_x00e7_a: z.record(z.unknown()).nullish(),
  "Check_terminais#Id": z.number().int().nullish(),
  Check_terminais: z.record(z.unknown()).nullish(),
  "Check_ponteret#Id": z.number().int().nullish(),
  Check_ponteret: z.record(z.unknown()).nullish(),
  Check_isola_x00e7__x00e3_osaida: z.string().nullish(),
  Check_resistenciasaida: z.string().nullish(),
  "Check_EScaixametalica#Id": z.number().int().nullish(),
  Check_EScaixametalica: z.record(z.unknown()).nullish(),
  "Check_ESprensacabo#Id": z.number().int().nullish(),
  Check_ESprensacabo: z.record(z.unknown()).nullish(),
  "Check_EScaboPP#Id": z.number().int().nullish(),
  Check_EScaboPP: z.record(z.unknown()).nullish(),
  "Check_ESroscasaux#Id": z.number().int().nullish(),
  Check_ESroscasaux: z.record(z.unknown()).nullish(),
  "Check_Prato#Id": z.number().int().nullish(),
  Check_Prato: z.record(z.unknown()).nullish(),
  "Check_ESporcacast#Id": z.number().int().nullish(),
  Check_ESporcacast: z.record(z.unknown()).nullish(),
  "Check_ESkitfixprato#Id": z.number().int().nullish(),
  Check_ESkitfixprato: z.record(z.unknown()).nullish(),
  "Check_ESroscapontadoeixo#Id": z.number().int().nullish(),
  Check_ESroscapontadoeixo: z.record(z.unknown()).nullish(),
  "Check_ESparafusofixsiroco#Id": z.number().int().nullish(),
  Check_ESparafusofixsiroco: z.record(z.unknown()).nullish(),
  "Check_ESflangesiroco#Id": z.number().int().nullish(),
  Check_ESflangesiroco: z.record(z.unknown()).nullish(),
  "Check_EScubofixdsiroco#Id": z.number().int().nullish(),
  Check_EScubofixdsiroco: z.record(z.unknown()).nullish(),
  OBS_qualidade: z.string().nullish(),
  OBS_teste: z.string().nullish(),
  Test_Isol1: z.string().nullish(),
  Test_Isol2: z.string().nullish(),
  Test_Isol3: z.string().nullish(),
  Test_resR: z.string().nullish(),
  Test_resS: z.string().nullish(),
  Test_resT: z.string().nullish(),
  Test_res1_x002d_4: z.string().nullish(),
  Test_res2_x002d_5: z.string().nullish(),
  Test_res3_x002d_6: z.string().nullish(),
  Test_res7_x002d_10: z.string().nullish(),
  Test_res8_x002d_11: z.string().nullish(),
  Test_res9_x002d_12: z.string().nullish(),
  Test_Tens_x00e3_o: z.string().nullish(),
  Test_Rota_x00e7__x00e3_o0: z.string().nullish(),
  Test_CorrenteR: z.string().nullish(),
  Test_CorrenteS: z.string().nullish(),
  Test_CorrenteT: z.string().nullish(),
  Test_tempC: z.string().nullish(),
  Test_TempMancalLA: z.string().nullish(),
  Test_TempMancalLOA: z.string().nullish(),
  TestTempEsta: z.string().nullish(),
  Test_TempAmbi: z.string().nullish(),
  Test_VibMLA: z.string().nullish(),
  Test_VibMLOA: z.string().nullish(),
  Filial: z.string().nullish(),
  Test_VibALA: z.string().nullish(),
  Test_VibVLOA: z.string().nullish(),
  Test_VibHLOA: z.string().nullish(),
  "TestAPROVADO#Id": z.number().int().nullish(),
  TestAPROVADO: z.record(z.unknown()).nullish(),
  DataInspe_x00e7__x00e3_o: z.string().nullish(),
  Test_Rotacao: z.string().nullish(),
  Nome: z.string().nullish(),
  Nome_inspetor: z.string().nullish(),
  ID_ESPELHO: z.number().nullish(),
  Unidade: z.string().nullish(),
  Modified: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
  ComplianceAssetId: z.string().nullish(),
  Test_VibALOA: z.string().nullish(),
  "Check_aprovado#Id": z.number().int().nullish(),
  Check_aprovado: z.record(z.unknown()).nullish(),
}).partial();
export type PFEIQWrite = z.infer<typeof PFEIQWrite>;

export const PFEIQMeta = {
  name: "PF e IQ",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "04e9e0fe-4151-49aa-a9eb-cf06655ea1d1",
  permission: "read-write",
} as const;

/** Tarefas Operacionais · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface TarefasOperacionaisRow {
  ID?: number | null;
  Title?: string | null;
  Matr_x00ed_cula?: string | null;
  Informa_x00e7__x00e3_o?: string | null;
  Data?: string | null;
  Previs_x00e3_o?: string | null;
  "Aprovado#Id"?: number | null;
  Aprovado?: Record<string, unknown> | null;
  Unidade?: string | null;
  Solicitante?: string | null;
  Comentario?: string | null;
  ComplianceAssetId?: string | null;
  Created?: string | null;
  Aprovadora?: string | null;
  Modified?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
}

export const TarefasOperacionaisWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string(),
  Matr_x00ed_cula: z.string().nullish(),
  Informa_x00e7__x00e3_o: z.string(),
  Data: z.string().nullish(),
  Previs_x00e3_o: z.string().nullish(),
  "Aprovado#Id": z.number().int().nullish(),
  Aprovado: z.record(z.unknown()).nullish(),
  Unidade: z.string().nullish(),
  Solicitante: z.string().nullish(),
  Comentario: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  Created: z.string().nullish(),
  Aprovadora: z.string().nullish(),
  Modified: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
}).partial();
export type TarefasOperacionaisWrite = z.infer<typeof TarefasOperacionaisWrite>;

export const TarefasOperacionaisMeta = {
  name: "Tarefas Operacionais",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "1510f797-f931-4031-bc78-3093a89b6f14",
  permission: "read-write",
} as const;

/** Trajetos · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface TrajetosRow {
  ID?: number | null;
  Title?: string | null;
  DataInicio?: string | null;
  Datafim?: string | null;
  "Almo_x00e7_o#Id"?: number | null;
  Almo_x00e7_o?: Record<string, unknown> | null;
  Cliente?: string | null;
  Observacao?: string | null;
  Qtd_de_Equip?: string | null;
  Matr_x00ed_cula?: string | null;
  Unidade?: string | null;
  "Tipodecoleta#Id"?: number | null;
  Tipodecoleta?: Record<string, unknown> | null;
  NotaFiscal?: string | null;
  NotaFical2?: string | null;
  NotaFical3?: string | null;
  NotaFical4?: string | null;
  NotaFical5?: string | null;
  NotaFical6?: string | null;
  NotaFical7?: string | null;
  NotaFical8?: string | null;
  NotaFical9?: string | null;
  NotaFical10?: string | null;
  NotaFical11?: string | null;
  NotaFical12?: string | null;
  NotaFical13?: string | null;
  NotaFical14?: string | null;
  NotaFical15?: string | null;
  NotaFical16?: string | null;
  Nome?: string | null;
  "Tipodesaida#Id"?: number | null;
  Tipodesaida?: Record<string, unknown> | null;
  Autorizador?: string | null;
  Created?: string | null;
  "Buzina#Id"?: number | null;
  Buzina?: Record<string, unknown> | null;
  ComplianceAssetId?: string | null;
  Modified?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
}

export const TrajetosWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string(),
  DataInicio: z.string().nullish(),
  Datafim: z.string().nullish(),
  "Almo_x00e7_o#Id": z.number().int().nullish(),
  Almo_x00e7_o: z.record(z.unknown()).nullish(),
  Cliente: z.string().nullish(),
  Observacao: z.string().nullish(),
  Qtd_de_Equip: z.string().nullish(),
  Matr_x00ed_cula: z.string().nullish(),
  Unidade: z.string().nullish(),
  "Tipodecoleta#Id": z.number().int().nullish(),
  Tipodecoleta: z.record(z.unknown()).nullish(),
  NotaFiscal: z.string().nullish(),
  NotaFical2: z.string().nullish(),
  NotaFical3: z.string().nullish(),
  NotaFical4: z.string().nullish(),
  NotaFical5: z.string().nullish(),
  NotaFical6: z.string().nullish(),
  NotaFical7: z.string().nullish(),
  NotaFical8: z.string().nullish(),
  NotaFical9: z.string().nullish(),
  NotaFical10: z.string().nullish(),
  NotaFical11: z.string().nullish(),
  NotaFical12: z.string().nullish(),
  NotaFical13: z.string().nullish(),
  NotaFical14: z.string().nullish(),
  NotaFical15: z.string().nullish(),
  NotaFical16: z.string().nullish(),
  Nome: z.string().nullish(),
  "Tipodesaida#Id": z.number().int().nullish(),
  Tipodesaida: z.record(z.unknown()).nullish(),
  Autorizador: z.string().nullish(),
  Created: z.string().nullish(),
  "Buzina#Id": z.number().int().nullish(),
  Buzina: z.record(z.unknown()).nullish(),
  ComplianceAssetId: z.string().nullish(),
  Modified: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
}).partial();
export type TrajetosWrite = z.infer<typeof TrajetosWrite>;

export const TrajetosMeta = {
  name: "Trajetos",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "955f595e-ffe9-4af1-8f5b-14cddc36a9bb",
  permission: "read-write",
} as const;

/** CheckList_Veicular · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface CheckListVeicularRow {
  ID?: number | null;
  Title?: string | null;
  "Porte_x0020_do_x0020_Ve_x00ed_cu#Id"?: number | null;
  Porte_x0020_do_x0020_Ve_x00ed_cu?: Record<string, unknown> | null;
  veiculo?: string | null;
  Observation?: string | null;
  field_1?: string | null;
  field_2?: string | null;
  field_3?: string | null;
  field_4?: string | null;
  field_5?: string | null;
  "field_6#Id"?: number | null;
  field_6?: Record<string, unknown> | null;
  "field_7#Id"?: number | null;
  field_7?: Record<string, unknown> | null;
  "field_8#Id"?: number | null;
  field_8?: Record<string, unknown> | null;
  "field_9#Id"?: number | null;
  field_9?: Record<string, unknown> | null;
  "field_10#Id"?: number | null;
  field_10?: Record<string, unknown> | null;
  "field_11#Id"?: number | null;
  field_11?: Record<string, unknown> | null;
  "field_12#Id"?: number | null;
  field_12?: Record<string, unknown> | null;
  "field_13#Id"?: number | null;
  field_13?: Record<string, unknown> | null;
  "field_14#Id"?: number | null;
  field_14?: Record<string, unknown> | null;
  "field_15#Id"?: number | null;
  field_15?: Record<string, unknown> | null;
  "field_16#Id"?: number | null;
  field_16?: Record<string, unknown> | null;
  "field_17#Id"?: number | null;
  field_17?: Record<string, unknown> | null;
  "field_18#Id"?: number | null;
  field_18?: Record<string, unknown> | null;
  "field_19#Id"?: number | null;
  field_19?: Record<string, unknown> | null;
  "field_20#Id"?: number | null;
  field_20?: Record<string, unknown> | null;
  "field_21#Id"?: number | null;
  field_21?: Record<string, unknown> | null;
  "field_22#Id"?: number | null;
  field_22?: Record<string, unknown> | null;
  "field_23#Id"?: number | null;
  field_23?: Record<string, unknown> | null;
  "field_24#Id"?: number | null;
  field_24?: Record<string, unknown> | null;
  "field_25#Id"?: number | null;
  field_25?: Record<string, unknown> | null;
  "field_26#Id"?: number | null;
  field_26?: Record<string, unknown> | null;
  "field_27#Id"?: number | null;
  field_27?: Record<string, unknown> | null;
  "field_28#Id"?: number | null;
  field_28?: Record<string, unknown> | null;
  "field_29#Id"?: number | null;
  field_29?: Record<string, unknown> | null;
  "field_30#Id"?: number | null;
  field_30?: Record<string, unknown> | null;
  "field_31#Id"?: number | null;
  field_31?: Record<string, unknown> | null;
  "field_32#Id"?: number | null;
  field_32?: Record<string, unknown> | null;
  "field_33#Id"?: number | null;
  field_33?: Record<string, unknown> | null;
  "field_34#Id"?: number | null;
  field_34?: Record<string, unknown> | null;
  "field_35#Id"?: number | null;
  field_35?: Record<string, unknown> | null;
  "field_36#Id"?: number | null;
  field_36?: Record<string, unknown> | null;
  "field_37#Id"?: number | null;
  field_37?: Record<string, unknown> | null;
  "field_38#Id"?: number | null;
  field_38?: Record<string, unknown> | null;
  "field_39#Id"?: number | null;
  field_39?: Record<string, unknown> | null;
  "field_40#Id"?: number | null;
  field_40?: Record<string, unknown> | null;
  "field_41#Id"?: number | null;
  field_41?: Record<string, unknown> | null;
  "field_42#Id"?: number | null;
  field_42?: Record<string, unknown> | null;
  "field_43#Id"?: number | null;
  field_43?: Record<string, unknown> | null;
  "field_44#Id"?: number | null;
  field_44?: Record<string, unknown> | null;
  "field_45#Id"?: number | null;
  field_45?: Record<string, unknown> | null;
  "field_46#Id"?: number | null;
  field_46?: Record<string, unknown> | null;
  "field_47#Id"?: number | null;
  field_47?: Record<string, unknown> | null;
  "field_48#Id"?: number | null;
  field_48?: Record<string, unknown> | null;
  "field_49#Id"?: number | null;
  field_49?: Record<string, unknown> | null;
  "field_50#Id"?: number | null;
  field_50?: Record<string, unknown> | null;
  "field_51#Id"?: number | null;
  field_51?: Record<string, unknown> | null;
  "field_52#Id"?: number | null;
  field_52?: Record<string, unknown> | null;
  "field_53#Id"?: number | null;
  field_53?: Record<string, unknown> | null;
  "field_54#Id"?: number | null;
  field_54?: Record<string, unknown> | null;
  "field_55#Id"?: number | null;
  field_55?: Record<string, unknown> | null;
  "field_56#Id"?: number | null;
  field_56?: Record<string, unknown> | null;
  "field_57#Id"?: number | null;
  field_57?: Record<string, unknown> | null;
  "field_58#Id"?: number | null;
  field_58?: Record<string, unknown> | null;
  "field_59#Id"?: number | null;
  field_59?: Record<string, unknown> | null;
  "field_60#Id"?: number | null;
  field_60?: Record<string, unknown> | null;
  "field_61#Id"?: number | null;
  field_61?: Record<string, unknown> | null;
  "field_62#Id"?: number | null;
  field_62?: Record<string, unknown> | null;
  "field_63#Id"?: number | null;
  field_63?: Record<string, unknown> | null;
  DataSSMA?: string | null;
  ObsSSMA?: string | null;
  Created?: string | null;
  "Trava_Roda#Id"?: number | null;
  Trava_Roda?: Record<string, unknown> | null;
  ComplianceAssetId?: string | null;
  Modified?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
}

export const CheckListVeicularWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string().nullish(),
  "Porte_x0020_do_x0020_Ve_x00ed_cu#Id": z.number().int().nullish(),
  Porte_x0020_do_x0020_Ve_x00ed_cu: z.record(z.unknown()).nullish(),
  veiculo: z.string().nullish(),
  Observation: z.string().nullish(),
  field_1: z.string().nullish(),
  field_2: z.string().nullish(),
  field_3: z.string().nullish(),
  field_4: z.string().nullish(),
  field_5: z.string().nullish(),
  "field_6#Id": z.number().int().nullish(),
  field_6: z.record(z.unknown()).nullish(),
  "field_7#Id": z.number().int().nullish(),
  field_7: z.record(z.unknown()).nullish(),
  "field_8#Id": z.number().int().nullish(),
  field_8: z.record(z.unknown()).nullish(),
  "field_9#Id": z.number().int().nullish(),
  field_9: z.record(z.unknown()).nullish(),
  "field_10#Id": z.number().int().nullish(),
  field_10: z.record(z.unknown()).nullish(),
  "field_11#Id": z.number().int().nullish(),
  field_11: z.record(z.unknown()).nullish(),
  "field_12#Id": z.number().int().nullish(),
  field_12: z.record(z.unknown()).nullish(),
  "field_13#Id": z.number().int().nullish(),
  field_13: z.record(z.unknown()).nullish(),
  "field_14#Id": z.number().int().nullish(),
  field_14: z.record(z.unknown()).nullish(),
  "field_15#Id": z.number().int().nullish(),
  field_15: z.record(z.unknown()).nullish(),
  "field_16#Id": z.number().int().nullish(),
  field_16: z.record(z.unknown()).nullish(),
  "field_17#Id": z.number().int().nullish(),
  field_17: z.record(z.unknown()).nullish(),
  "field_18#Id": z.number().int().nullish(),
  field_18: z.record(z.unknown()).nullish(),
  "field_19#Id": z.number().int().nullish(),
  field_19: z.record(z.unknown()).nullish(),
  "field_20#Id": z.number().int().nullish(),
  field_20: z.record(z.unknown()).nullish(),
  "field_21#Id": z.number().int().nullish(),
  field_21: z.record(z.unknown()).nullish(),
  "field_22#Id": z.number().int().nullish(),
  field_22: z.record(z.unknown()).nullish(),
  "field_23#Id": z.number().int().nullish(),
  field_23: z.record(z.unknown()).nullish(),
  "field_24#Id": z.number().int().nullish(),
  field_24: z.record(z.unknown()).nullish(),
  "field_25#Id": z.number().int().nullish(),
  field_25: z.record(z.unknown()).nullish(),
  "field_26#Id": z.number().int().nullish(),
  field_26: z.record(z.unknown()).nullish(),
  "field_27#Id": z.number().int().nullish(),
  field_27: z.record(z.unknown()).nullish(),
  "field_28#Id": z.number().int().nullish(),
  field_28: z.record(z.unknown()).nullish(),
  "field_29#Id": z.number().int().nullish(),
  field_29: z.record(z.unknown()).nullish(),
  "field_30#Id": z.number().int().nullish(),
  field_30: z.record(z.unknown()).nullish(),
  "field_31#Id": z.number().int().nullish(),
  field_31: z.record(z.unknown()).nullish(),
  "field_32#Id": z.number().int().nullish(),
  field_32: z.record(z.unknown()).nullish(),
  "field_33#Id": z.number().int().nullish(),
  field_33: z.record(z.unknown()).nullish(),
  "field_34#Id": z.number().int().nullish(),
  field_34: z.record(z.unknown()).nullish(),
  "field_35#Id": z.number().int().nullish(),
  field_35: z.record(z.unknown()).nullish(),
  "field_36#Id": z.number().int().nullish(),
  field_36: z.record(z.unknown()).nullish(),
  "field_37#Id": z.number().int().nullish(),
  field_37: z.record(z.unknown()).nullish(),
  "field_38#Id": z.number().int().nullish(),
  field_38: z.record(z.unknown()).nullish(),
  "field_39#Id": z.number().int().nullish(),
  field_39: z.record(z.unknown()).nullish(),
  "field_40#Id": z.number().int().nullish(),
  field_40: z.record(z.unknown()).nullish(),
  "field_41#Id": z.number().int().nullish(),
  field_41: z.record(z.unknown()).nullish(),
  "field_42#Id": z.number().int().nullish(),
  field_42: z.record(z.unknown()).nullish(),
  "field_43#Id": z.number().int().nullish(),
  field_43: z.record(z.unknown()).nullish(),
  "field_44#Id": z.number().int().nullish(),
  field_44: z.record(z.unknown()).nullish(),
  "field_45#Id": z.number().int().nullish(),
  field_45: z.record(z.unknown()).nullish(),
  "field_46#Id": z.number().int().nullish(),
  field_46: z.record(z.unknown()).nullish(),
  "field_47#Id": z.number().int().nullish(),
  field_47: z.record(z.unknown()).nullish(),
  "field_48#Id": z.number().int().nullish(),
  field_48: z.record(z.unknown()).nullish(),
  "field_49#Id": z.number().int().nullish(),
  field_49: z.record(z.unknown()).nullish(),
  "field_50#Id": z.number().int().nullish(),
  field_50: z.record(z.unknown()).nullish(),
  "field_51#Id": z.number().int().nullish(),
  field_51: z.record(z.unknown()).nullish(),
  "field_52#Id": z.number().int().nullish(),
  field_52: z.record(z.unknown()).nullish(),
  "field_53#Id": z.number().int().nullish(),
  field_53: z.record(z.unknown()).nullish(),
  "field_54#Id": z.number().int().nullish(),
  field_54: z.record(z.unknown()).nullish(),
  "field_55#Id": z.number().int().nullish(),
  field_55: z.record(z.unknown()).nullish(),
  "field_56#Id": z.number().int().nullish(),
  field_56: z.record(z.unknown()).nullish(),
  "field_57#Id": z.number().int().nullish(),
  field_57: z.record(z.unknown()).nullish(),
  "field_58#Id": z.number().int().nullish(),
  field_58: z.record(z.unknown()).nullish(),
  "field_59#Id": z.number().int().nullish(),
  field_59: z.record(z.unknown()).nullish(),
  "field_60#Id": z.number().int().nullish(),
  field_60: z.record(z.unknown()).nullish(),
  "field_61#Id": z.number().int().nullish(),
  field_61: z.record(z.unknown()).nullish(),
  "field_62#Id": z.number().int().nullish(),
  field_62: z.record(z.unknown()).nullish(),
  "field_63#Id": z.number().int().nullish(),
  field_63: z.record(z.unknown()).nullish(),
  DataSSMA: z.string().nullish(),
  ObsSSMA: z.string().nullish(),
  Created: z.string().nullish(),
  "Trava_Roda#Id": z.number().int().nullish(),
  Trava_Roda: z.record(z.unknown()).nullish(),
  ComplianceAssetId: z.string().nullish(),
  Modified: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
}).partial();
export type CheckListVeicularWrite = z.infer<typeof CheckListVeicularWrite>;

export const CheckListVeicularMeta = {
  name: "CheckList_Veicular",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "931cb5f5-e4da-401b-a4b4-5fa25a807919",
  permission: "read-write",
} as const;

/** ServiExternosAveiro — NotasProvas · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface ServiExternosAveiroRow {
  ID?: number | null;
  Title?: string | null;
  matricula?: string | null;
  datae0?: string | null;
  tipoprovae?: string | null;
  notae0?: number | null;
  ComplianceAssetId?: string | null;
  Modified?: string | null;
  Created?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
}

export const ServiExternosAveiroWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string().nullish(),
  matricula: z.string().nullish(),
  datae0: z.string().nullish(),
  tipoprovae: z.string().nullish(),
  notae0: z.number().nullish(),
  ComplianceAssetId: z.string().nullish(),
  Modified: z.string().nullish(),
  Created: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
}).partial();
export type ServiExternosAveiroWrite = z.infer<typeof ServiExternosAveiroWrite>;

export const ServiExternosAveiroMeta = {
  name: "ServiExternosAveiro",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "360f8088-ce6e-437e-ac7c-55acb0820326",
  permission: "read-write",
} as const;

/** ServiçosExternosPortugal · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface ServiOsExternosPortugalRow {
  ID?: number | null;
  Title?: string | null;
  kminicial?: number | null;
  kmfinal?: number | null;
  kmtotal?: number | null;
  cliente?: string | null;
  morada?: string | null;
  tiposervi_x00e7_o?: string | null;
  hplanejada?: string | null;
  hrinicial?: string | null;
  hrfinal?: string | null;
  equipamentosintervencionados?: string | null;
  materialusado?: string | null;
  Nor_x00e7_amento?: string | null;
  Notaencomenda?: string | null;
  faturado?: boolean | null;
  "status#Id"?: number | null;
  status?: Record<string, unknown> | null;
  ComplianceAssetId?: string | null;
  Modified?: string | null;
  Created?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
}

export const ServiOsExternosPortugalWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string(),
  kminicial: z.number().nullish(),
  kmfinal: z.number().nullish(),
  kmtotal: z.number().nullish(),
  cliente: z.string().nullish(),
  morada: z.string().nullish(),
  tiposervi_x00e7_o: z.string().nullish(),
  hplanejada: z.string().nullish(),
  hrinicial: z.string().nullish(),
  hrfinal: z.string().nullish(),
  equipamentosintervencionados: z.string().nullish(),
  materialusado: z.string().nullish(),
  Nor_x00e7_amento: z.string().nullish(),
  Notaencomenda: z.string().nullish(),
  faturado: z.boolean().nullish(),
  "status#Id": z.number().int().nullish(),
  status: z.record(z.unknown()).nullish(),
  ComplianceAssetId: z.string().nullish(),
  Modified: z.string().nullish(),
  Created: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
}).partial();
export type ServiOsExternosPortugalWrite = z.infer<typeof ServiOsExternosPortugalWrite>;

export const ServiOsExternosPortugalMeta = {
  name: "ServiçosExternosPortugal",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "6cea8a86-0109-4e58-8f57-27d1e184ff93",
  permission: "read-write",
} as const;

/** Lista QR Code · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface ListaQRCodeRow {
  ID?: number | null;
  Title?: string | null;
  Cliente?: string | null;
  Respons_x00e1_vel?: string | null;
  Setor?: string | null;
  Minuto_inicial?: string | null;
  Minuto_final?: string | null;
  Observa_x00e7__x00e3_o?: string | null;
  Unidade?: string | null;
  Matr_x00ed_cula?: string | null;
  fCadastro?: string | null;
  "Cx_selec#Id"?: unknown[] | null;
  "Cx_selec@odata.type"?: string | null;
  Cx_selec?: unknown[] | null;
  Cx_selec_outros?: string | null;
  Erro_Corrigido?: string | null;
  "Check_aprov#Id"?: number | null;
  Check_aprov?: Record<string, unknown> | null;
  Numero_Adv?: number | null;
  Numero_NC?: number | null;
  Parecer_NCAD?: string | null;
  Parecerlider?: string | null;
  DestinacaoNC?: string | null;
  "Erro_Preenchimento_Medro#Id"?: number | null;
  Erro_Preenchimento_Medro?: Record<string, unknown> | null;
  "Reincidente#Id"?: number | null;
  Reincidente?: Record<string, unknown> | null;
  N_tratada?: string | null;
  Isola_x00e7__x00e3_o_pos_estufa?: string | null;
  "Retifica#Id"?: unknown[] | null;
  "Retifica@odata.type"?: string | null;
  Retifica?: unknown[] | null;
  "Peritagem_Inicial#Id"?: number | null;
  Peritagem_Inicial?: Record<string, unknown> | null;
  "Laudo_Inicial#Id"?: number | null;
  Laudo_Inicial?: Record<string, unknown> | null;
  "Proposta#Id"?: number | null;
  Proposta?: Record<string, unknown> | null;
  Modified?: string | null;
  Created?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
  ComplianceAssetId?: string | null;
}

export const ListaQRCodeWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string(),
  Cliente: z.string(),
  Respons_x00e1_vel: z.string().nullish(),
  Setor: z.string().nullish(),
  Minuto_inicial: z.string(),
  Minuto_final: z.string().nullish(),
  Observa_x00e7__x00e3_o: z.string().nullish(),
  Unidade: z.string().nullish(),
  Matr_x00ed_cula: z.string().nullish(),
  fCadastro: z.string().nullish(),
  "Cx_selec#Id": z.array(z.unknown()).nullish(),
  "Cx_selec@odata.type": z.string().nullish(),
  Cx_selec: z.array(z.unknown()).nullish(),
  Cx_selec_outros: z.string().nullish(),
  Erro_Corrigido: z.string().nullish(),
  "Check_aprov#Id": z.number().int().nullish(),
  Check_aprov: z.record(z.unknown()).nullish(),
  Numero_Adv: z.number().nullish(),
  Numero_NC: z.number().nullish(),
  Parecer_NCAD: z.string().nullish(),
  Parecerlider: z.string().nullish(),
  DestinacaoNC: z.string().nullish(),
  "Erro_Preenchimento_Medro#Id": z.number().int().nullish(),
  Erro_Preenchimento_Medro: z.record(z.unknown()).nullish(),
  "Reincidente#Id": z.number().int().nullish(),
  Reincidente: z.record(z.unknown()).nullish(),
  N_tratada: z.string().nullish(),
  Isola_x00e7__x00e3_o_pos_estufa: z.string().nullish(),
  "Retifica#Id": z.array(z.unknown()).nullish(),
  "Retifica@odata.type": z.string().nullish(),
  Retifica: z.array(z.unknown()).nullish(),
  "Peritagem_Inicial#Id": z.number().int().nullish(),
  Peritagem_Inicial: z.record(z.unknown()).nullish(),
  "Laudo_Inicial#Id": z.number().int().nullish(),
  Laudo_Inicial: z.record(z.unknown()).nullish(),
  "Proposta#Id": z.number().int().nullish(),
  Proposta: z.record(z.unknown()).nullish(),
  Modified: z.string().nullish(),
  Created: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
  ComplianceAssetId: z.string().nullish(),
}).partial();
export type ListaQRCodeWrite = z.infer<typeof ListaQRCodeWrite>;

export const ListaQRCodeMeta = {
  name: "Lista QR Code",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "91aa6348-0641-4165-8693-00b701ad7085",
  permission: "read-write",
} as const;

/** Doc.Medro.SLZ · dataset `https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores` */
export interface DocMedroSLZRow {
  ID?: number | null;
  Title?: string | null;
  Modified?: string | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
  Nome_exibicao?: string | null;
  xViabi?: string | null;
  ComplianceAssetId?: string | null;
  Created?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "CheckoutUser#Claims"?: string | null;
  CheckoutUser?: Record<string, unknown> | null;
}

export const DocMedroSLZWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string().nullish(),
  Modified: z.string().nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
  Nome_exibicao: z.string().nullish(),
  xViabi: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  Created: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "CheckoutUser#Claims": z.string().nullish(),
  CheckoutUser: z.record(z.unknown()).nullish(),
}).partial();
export type DocMedroSLZWrite = z.infer<typeof DocMedroSLZWrite>;

export const DocMedroSLZMeta = {
  name: "Doc.Medro.SLZ",
  dataset: "https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores",
  table: "90c9257e-83e9-4c5a-9bab-e5ddcbccc527",
  permission: "read-write",
} as const;

/** Lista Auxiliar - Clientes Medro · dataset `https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores` */
export interface ListaAuxiliarClientesMedroRow {
  ID?: number | null;
  Title?: string | null;
  V_x00ed_deos?: string | null;
  Informa_x00e7__x00f5_es?: string | null;
  "Unidade#Id"?: number | null;
  Unidade?: Record<string, unknown> | null;
  Nome_completo?: string | null;
  Created?: string | null;
  Contribuinte?: string | null;
  Morada?: string | null;
  email?: string | null;
  Prazo?: string | null;
  xStatus?: string | null;
  Modified?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
  ComplianceAssetId?: string | null;
}

export const ListaAuxiliarClientesMedroWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string(),
  V_x00ed_deos: z.string().nullish(),
  Informa_x00e7__x00f5_es: z.string().nullish(),
  "Unidade#Id": z.number().int().nullish(),
  Unidade: z.record(z.unknown()).nullish(),
  Nome_completo: z.string().nullish(),
  Created: z.string().nullish(),
  Contribuinte: z.string().nullish(),
  Morada: z.string().nullish(),
  email: z.string().nullish(),
  Prazo: z.string().nullish(),
  xStatus: z.string().nullish(),
  Modified: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
  ComplianceAssetId: z.string().nullish(),
}).partial();
export type ListaAuxiliarClientesMedroWrite = z.infer<typeof ListaAuxiliarClientesMedroWrite>;

export const ListaAuxiliarClientesMedroMeta = {
  name: "Lista Auxiliar - Clientes Medro",
  dataset: "https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores",
  table: "781a8888-1db9-49ba-a946-ddd704e4a8c1",
  permission: "read-write",
} as const;

/** Serviços Terceirizados · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface ServiOsTerceirizadosRow {
  ID?: number | null;
  Title?: string | null;
  "Empresa#Id"?: number | null;
  Empresa?: Record<string, unknown> | null;
  Orc_Fornecedor?: string | null;
  Data_registro?: string | null;
  Data_aprovacao_valor?: string | null;
  Data_retorno?: string | null;
  "Pe_x00e7_a#Id"?: number | null;
  Pe_x00e7_a?: Record<string, unknown> | null;
  Servi_x00e7_o1?: string | null;
  ValorServ1?: string | null;
  Servi_x00e7_o2?: string | null;
  ValorServ2?: string | null;
  Servi_x00e7_o3?: string | null;
  ValorServ3?: string | null;
  Servi_x00e7_o4?: string | null;
  ValorServ4?: string | null;
  Servi_x00e7_o5?: string | null;
  ValorServ5?: string | null;
  TotalValor?: string | null;
  Observa_x00e7__x00e3_o?: string | null;
  Fabricante?: string | null;
  Carca_x00e7_a?: string | null;
  "Situa_x00e7__x00e3_o#Id"?: number | null;
  Situa_x00e7__x00e3_o?: Record<string, unknown> | null;
  Data_envio?: string | null;
  N_OR?: string | null;
  Unidade?: string | null;
  Previs_x00e3_oRetorno?: string | null;
  Created?: string | null;
  AvaliacaoRetorno?: string | null;
  AvaliacaoDescricao?: string | null;
  AvaliacaoMedida?: string | null;
  ComplianceAssetId?: string | null;
  Modified?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
}

export const ServiOsTerceirizadosWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string(),
  "Empresa#Id": z.number().int().nullish(),
  Empresa: z.record(z.unknown()).nullish(),
  Orc_Fornecedor: z.string().nullish(),
  Data_registro: z.string().nullish(),
  Data_aprovacao_valor: z.string().nullish(),
  Data_retorno: z.string().nullish(),
  "Pe_x00e7_a#Id": z.number().int().nullish(),
  Pe_x00e7_a: z.record(z.unknown()).nullish(),
  Servi_x00e7_o1: z.string().nullish(),
  ValorServ1: z.string().nullish(),
  Servi_x00e7_o2: z.string().nullish(),
  ValorServ2: z.string().nullish(),
  Servi_x00e7_o3: z.string().nullish(),
  ValorServ3: z.string().nullish(),
  Servi_x00e7_o4: z.string().nullish(),
  ValorServ4: z.string().nullish(),
  Servi_x00e7_o5: z.string().nullish(),
  ValorServ5: z.string().nullish(),
  TotalValor: z.string().nullish(),
  Observa_x00e7__x00e3_o: z.string().nullish(),
  Fabricante: z.string().nullish(),
  Carca_x00e7_a: z.string().nullish(),
  "Situa_x00e7__x00e3_o#Id": z.number().int().nullish(),
  Situa_x00e7__x00e3_o: z.record(z.unknown()).nullish(),
  Data_envio: z.string().nullish(),
  N_OR: z.string().nullish(),
  Unidade: z.string().nullish(),
  Previs_x00e3_oRetorno: z.string().nullish(),
  Created: z.string().nullish(),
  AvaliacaoRetorno: z.string().nullish(),
  AvaliacaoDescricao: z.string().nullish(),
  AvaliacaoMedida: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  Modified: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
}).partial();
export type ServiOsTerceirizadosWrite = z.infer<typeof ServiOsTerceirizadosWrite>;

export const ServiOsTerceirizadosMeta = {
  name: "Serviços Terceirizados",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "ddad97c9-dbb2-4a77-8796-e4c8dc9681d6",
  permission: "read-write",
} as const;

/** Lista Auxiliar - Ferramentas por Setor · dataset `https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores` */
export interface ListaAuxiliarFerramentasPorSetorRow {
  ID?: number | null;
  Title?: string | null;
  Quantidade?: string | null;
  Vida_x00da_til?: string | null;
  ValordeAquisi_x00e7__x00e3_o?: string | null;
  Informa_x00e7__x00f5_esAdicionai?: string | null;
  Datadevincula_x00e7__x00e3_o?: string | null;
  xTipo?: string | null;
  Vinculador?: string | null;
  Setor?: string | null;
  xicone?: string | null;
  xUnidade?: string | null;
  NF_aquisi_x00e7__x00e3_o?: string | null;
  xObservacao?: string | null;
  yValorTotal?: string | null;
  Data_vidautil?: string | null;
  xID?: string | null;
  ComplianceAssetId?: string | null;
  ValorTotal?: string | null;
  xValorTotal?: string | null;
  Modified?: string | null;
  Created?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
}

export const ListaAuxiliarFerramentasPorSetorWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string(),
  Quantidade: z.string().nullish(),
  Vida_x00da_til: z.string().nullish(),
  ValordeAquisi_x00e7__x00e3_o: z.string().nullish(),
  Informa_x00e7__x00f5_esAdicionai: z.string().nullish(),
  Datadevincula_x00e7__x00e3_o: z.string().nullish(),
  xTipo: z.string().nullish(),
  Vinculador: z.string().nullish(),
  Setor: z.string(),
  xicone: z.string().nullish(),
  xUnidade: z.string().nullish(),
  NF_aquisi_x00e7__x00e3_o: z.string().nullish(),
  xObservacao: z.string().nullish(),
  yValorTotal: z.string().nullish(),
  Data_vidautil: z.string().nullish(),
  xID: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  ValorTotal: z.string().nullish(),
  xValorTotal: z.string().nullish(),
  Modified: z.string().nullish(),
  Created: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
}).partial();
export type ListaAuxiliarFerramentasPorSetorWrite = z.infer<typeof ListaAuxiliarFerramentasPorSetorWrite>;

export const ListaAuxiliarFerramentasPorSetorMeta = {
  name: "Lista Auxiliar - Ferramentas por Setor",
  dataset: "https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores",
  table: "bfa5d3bc-9821-47ae-a06a-a1676e7721fd",
  permission: "read-write",
} as const;

/** Lista Auxiliar - Ferramentas · dataset `https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores` */
export interface ListaAuxiliarFerramentasRow {
  ID?: number | null;
  Title?: string | null;
  Vida_x00da_til?: string | null;
  Valordeaquisi_x00e7__x00e3_o?: string | null;
  "xTipo#Id"?: number | null;
  xTipo?: Record<string, unknown> | null;
  Informa_x00e7__x00f5_esadicionai?: string | null;
  Xicone?: string | null;
  NomeTipo?: string | null;
  ComplianceAssetId?: string | null;
  Modified?: string | null;
  Created?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
}

export const ListaAuxiliarFerramentasWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string(),
  Vida_x00da_til: z.string().nullish(),
  Valordeaquisi_x00e7__x00e3_o: z.string().nullish(),
  "xTipo#Id": z.number().int().nullish(),
  xTipo: z.record(z.unknown()),
  Informa_x00e7__x00f5_esadicionai: z.string().nullish(),
  Xicone: z.string().nullish(),
  NomeTipo: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  Modified: z.string().nullish(),
  Created: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
}).partial();
export type ListaAuxiliarFerramentasWrite = z.infer<typeof ListaAuxiliarFerramentasWrite>;

export const ListaAuxiliarFerramentasMeta = {
  name: "Lista Auxiliar - Ferramentas",
  dataset: "https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores",
  table: "0789ecbf-03e2-40c8-a9ab-6a220d3e9719",
  permission: "read-write",
} as const;

/** RDS · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface RDSRow {
  ID?: number | null;
  Title?: string | null;
  TipoSaida?: string | null;
  NomeReq?: string | null;
  SetorRequisitante?: string | null;
  DataReq?: string | null;
  DataNecess?: string | null;
  Descri_x00e7__x00e3_o?: string | null;
  Cliente?: string | null;
  Ve_x00ed_culo?: string | null;
  QtdEquip?: string | null;
  Atendimento?: string | null;
  NF?: string | null;
  Motorista?: string | null;
  Auxiliar?: string | null;
  Status?: string | null;
  DescLOG?: string | null;
  matricula?: string | null;
  Unidade?: string | null;
  DataAtendim?: string | null;
  DataProg?: string | null;
  ComplianceAssetId?: string | null;
  Modified?: string | null;
  Created?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
}

export const RDSWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string(),
  TipoSaida: z.string().nullish(),
  NomeReq: z.string().nullish(),
  SetorRequisitante: z.string().nullish(),
  DataReq: z.string().nullish(),
  DataNecess: z.string().nullish(),
  Descri_x00e7__x00e3_o: z.string().nullish(),
  Cliente: z.string().nullish(),
  Ve_x00ed_culo: z.string().nullish(),
  QtdEquip: z.string().nullish(),
  Atendimento: z.string().nullish(),
  NF: z.string().nullish(),
  Motorista: z.string().nullish(),
  Auxiliar: z.string().nullish(),
  Status: z.string().nullish(),
  DescLOG: z.string().nullish(),
  matricula: z.string().nullish(),
  Unidade: z.string().nullish(),
  DataAtendim: z.string().nullish(),
  DataProg: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  Modified: z.string().nullish(),
  Created: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
}).partial();
export type RDSWrite = z.infer<typeof RDSWrite>;

export const RDSMeta = {
  name: "RDS",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "01e52a3f-a115-4dc9-836c-2383db8fe566",
  permission: "read-write",
} as const;

/** OS 45-65k · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface OS4565kRow {
  ID?: number | null;
  Title?: string | null;
  Cliente?: string | null;
  Respons_x00e1_vel?: string | null;
  Setor?: string | null;
  Minuto_inicial?: string | null;
  Minuto_final?: string | null;
  Observa_x00e7__x00e3_o?: string | null;
  Unidade?: string | null;
  Matr_x00ed_cula?: string | null;
  fCadastro?: string | null;
  "Cx_selec#Id"?: unknown[] | null;
  "Cx_selec@odata.type"?: string | null;
  Cx_selec?: unknown[] | null;
  "Check_aprov#Id"?: number | null;
  Check_aprov?: Record<string, unknown> | null;
  "Erro_Preenchimento_Medro#Id"?: number | null;
  Erro_Preenchimento_Medro?: Record<string, unknown> | null;
  Cx_selec_outros?: string | null;
  Erro_Corrigido?: string | null;
  Numero_Adv?: number | null;
  Numero_NC?: number | null;
  Parecer_NCAD?: string | null;
  Parecerlider?: string | null;
  DestinacaoNC?: string | null;
  "Reincidente#Id"?: number | null;
  Reincidente?: Record<string, unknown> | null;
  N_tratada?: string | null;
  Isola_x00e7__x00e3_o_pos_estufa?: string | null;
  "Retifica#Id"?: unknown[] | null;
  "Retifica@odata.type"?: string | null;
  Retifica?: unknown[] | null;
  "Peritagem_Inicial#Id"?: number | null;
  Peritagem_Inicial?: Record<string, unknown> | null;
  "Laudo_Inicial#Id"?: number | null;
  Laudo_Inicial?: Record<string, unknown> | null;
  "Proposta#Id"?: number | null;
  Proposta?: Record<string, unknown> | null;
  Created?: string | null;
  "TipodePintura#Id"?: number | null;
  TipodePintura?: Record<string, unknown> | null;
  Status_Montagem?: string | null;
  Modified?: string | null;
  ComplianceAssetId?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
}

export const OS4565kWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string(),
  Cliente: z.string(),
  Respons_x00e1_vel: z.string().nullish(),
  Setor: z.string().nullish(),
  Minuto_inicial: z.string(),
  Minuto_final: z.string().nullish(),
  Observa_x00e7__x00e3_o: z.string().nullish(),
  Unidade: z.string().nullish(),
  Matr_x00ed_cula: z.string().nullish(),
  fCadastro: z.string().nullish(),
  "Cx_selec#Id": z.array(z.unknown()).nullish(),
  "Cx_selec@odata.type": z.string().nullish(),
  Cx_selec: z.array(z.unknown()).nullish(),
  "Check_aprov#Id": z.number().int().nullish(),
  Check_aprov: z.record(z.unknown()).nullish(),
  "Erro_Preenchimento_Medro#Id": z.number().int().nullish(),
  Erro_Preenchimento_Medro: z.record(z.unknown()).nullish(),
  Cx_selec_outros: z.string().nullish(),
  Erro_Corrigido: z.string().nullish(),
  Numero_Adv: z.number().nullish(),
  Numero_NC: z.number().nullish(),
  Parecer_NCAD: z.string().nullish(),
  Parecerlider: z.string().nullish(),
  DestinacaoNC: z.string().nullish(),
  "Reincidente#Id": z.number().int().nullish(),
  Reincidente: z.record(z.unknown()).nullish(),
  N_tratada: z.string().nullish(),
  Isola_x00e7__x00e3_o_pos_estufa: z.string().nullish(),
  "Retifica#Id": z.array(z.unknown()).nullish(),
  "Retifica@odata.type": z.string().nullish(),
  Retifica: z.array(z.unknown()).nullish(),
  "Peritagem_Inicial#Id": z.number().int().nullish(),
  Peritagem_Inicial: z.record(z.unknown()).nullish(),
  "Laudo_Inicial#Id": z.number().int().nullish(),
  Laudo_Inicial: z.record(z.unknown()).nullish(),
  "Proposta#Id": z.number().int().nullish(),
  Proposta: z.record(z.unknown()).nullish(),
  Created: z.string().nullish(),
  "TipodePintura#Id": z.number().int().nullish(),
  TipodePintura: z.record(z.unknown()).nullish(),
  Status_Montagem: z.string().nullish(),
  Modified: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
}).partial();
export type OS4565kWrite = z.infer<typeof OS4565kWrite>;

export const OS4565kMeta = {
  name: "OS 45-65k",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "a00f847b-dedf-4eda-b276-063571039c59",
  permission: "read-write",
} as const;

/** PF e IQ - 2024 · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface PFEIQ2024Row {
  ID?: number | null;
  Title?: string | null;
  Data?: string | null;
  "Check_acoplamento#Id"?: number | null;
  Check_acoplamento?: Record<string, unknown> | null;
  "Check_Eixolivre#Id"?: number | null;
  Check_Eixolivre?: Record<string, unknown> | null;
  "Check_Rolamentos#Id"?: number | null;
  Check_Rolamentos?: Record<string, unknown> | null;
  "Check_Chaveta#Id"?: number | null;
  Check_Chaveta?: Record<string, unknown> | null;
  "Check_AneisFixinternos#Id"?: number | null;
  Check_AneisFixinternos?: Record<string, unknown> | null;
  "Check_Olhal#Id"?: number | null;
  Check_Olhal?: Record<string, unknown> | null;
  "Check_Tampadefletora#Id"?: number | null;
  Check_Tampadefletora?: Record<string, unknown> | null;
  "Check_Ventilador#Id"?: number | null;
  Check_Ventilador?: Record<string, unknown> | null;
  "Check_Prolongador#Id"?: number | null;
  Check_Prolongador?: Record<string, unknown> | null;
  "Check_Pino#Id"?: number | null;
  Check_Pino?: Record<string, unknown> | null;
  "Check_Protetor#Id"?: number | null;
  Check_Protetor?: Record<string, unknown> | null;
  "Check_PinturaExterna#Id"?: number | null;
  Check_PinturaExterna?: Record<string, unknown> | null;
  "Check_parafusos#Id"?: number | null;
  Check_parafusos?: Record<string, unknown> | null;
  "Check_Veda_x00e7__x00f5_es#Id"?: number | null;
  Check_Veda_x00e7__x00f5_es?: Record<string, unknown> | null;
  "Check_Kitfreio#Id"?: number | null;
  Check_Kitfreio?: Record<string, unknown> | null;
  "Check_PlacaOS#Id"?: number | null;
  Check_PlacaOS?: Record<string, unknown> | null;
  "Check_PlacaTAG#Id"?: number | null;
  Check_PlacaTAG?: Record<string, unknown> | null;
  "Check_SeloQuali#Id"?: number | null;
  Check_SeloQuali?: Record<string, unknown> | null;
  "Check_Resina#Id"?: number | null;
  Check_Resina?: Record<string, unknown> | null;
  "Check_Caixa#Id"?: number | null;
  Check_Caixa?: Record<string, unknown> | null;
  "Check_Cabosdefor_x00e7_a#Id"?: number | null;
  Check_Cabosdefor_x00e7_a?: Record<string, unknown> | null;
  "Check_terminais#Id"?: number | null;
  Check_terminais?: Record<string, unknown> | null;
  "Check_ponteret#Id"?: number | null;
  Check_ponteret?: Record<string, unknown> | null;
  Check_isola_x00e7__x00e3_osaida?: string | null;
  Check_resistenciasaida?: string | null;
  "Check_EScaixametalica#Id"?: number | null;
  Check_EScaixametalica?: Record<string, unknown> | null;
  "Check_ESprensacabo#Id"?: number | null;
  Check_ESprensacabo?: Record<string, unknown> | null;
  "Check_EScaboPP#Id"?: number | null;
  Check_EScaboPP?: Record<string, unknown> | null;
  "Check_ESroscasaux#Id"?: number | null;
  Check_ESroscasaux?: Record<string, unknown> | null;
  "Check_Prato#Id"?: number | null;
  Check_Prato?: Record<string, unknown> | null;
  "Check_ESporcacast#Id"?: number | null;
  Check_ESporcacast?: Record<string, unknown> | null;
  "Check_ESkitfixprato#Id"?: number | null;
  Check_ESkitfixprato?: Record<string, unknown> | null;
  "Check_ESroscapontadoeixo#Id"?: number | null;
  Check_ESroscapontadoeixo?: Record<string, unknown> | null;
  "Check_ESparafusofixsiroco#Id"?: number | null;
  Check_ESparafusofixsiroco?: Record<string, unknown> | null;
  "Check_ESflangesiroco#Id"?: number | null;
  Check_ESflangesiroco?: Record<string, unknown> | null;
  "Check_EScubofixdsiroco#Id"?: number | null;
  Check_EScubofixdsiroco?: Record<string, unknown> | null;
  OBS_qualidade?: string | null;
  OBS_teste?: string | null;
  Test_Isol1?: string | null;
  Test_Isol2?: string | null;
  Test_Isol3?: string | null;
  Test_resR?: string | null;
  Test_resS?: string | null;
  Test_resT?: string | null;
  Test_res1_x002d_4?: string | null;
  Test_res2_x002d_5?: string | null;
  Test_res3_x002d_6?: string | null;
  Test_res7_x002d_10?: string | null;
  Test_res8_x002d_11?: string | null;
  Test_res9_x002d_12?: string | null;
  Test_Tens_x00e3_o?: string | null;
  Test_Rota_x00e7__x00e3_o0?: string | null;
  Test_CorrenteR?: string | null;
  Test_CorrenteS?: string | null;
  Test_CorrenteT?: string | null;
  Test_tempC?: string | null;
  Test_TempMancalLA?: string | null;
  Test_TempMancalLOA?: string | null;
  TestTempEsta?: string | null;
  Test_TempAmbi?: string | null;
  Test_VibMLA?: string | null;
  Test_VibMLOA?: string | null;
  Filial?: string | null;
  Test_VibALA?: string | null;
  Test_VibVLOA?: string | null;
  Test_VibHLOA?: string | null;
  "TestAPROVADO#Id"?: number | null;
  TestAPROVADO?: Record<string, unknown> | null;
  DataInspe_x00e7__x00e3_o?: string | null;
  Test_Rotacao?: string | null;
  Nome?: string | null;
  Nome_inspetor?: string | null;
  ID_ESPELHO?: number | null;
  Unidade?: string | null;
  Created?: string | null;
  Modified?: string | null;
  ComplianceAssetId?: string | null;
  Test_VibALOA?: string | null;
  "Check_aprovado#Id"?: number | null;
  Check_aprovado?: Record<string, unknown> | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
}

export const PFEIQ2024Write = z.object({
  ID: z.number().int().nullish(),
  Title: z.string(),
  Data: z.string().nullish(),
  "Check_acoplamento#Id": z.number().int().nullish(),
  Check_acoplamento: z.record(z.unknown()).nullish(),
  "Check_Eixolivre#Id": z.number().int().nullish(),
  Check_Eixolivre: z.record(z.unknown()).nullish(),
  "Check_Rolamentos#Id": z.number().int().nullish(),
  Check_Rolamentos: z.record(z.unknown()).nullish(),
  "Check_Chaveta#Id": z.number().int().nullish(),
  Check_Chaveta: z.record(z.unknown()).nullish(),
  "Check_AneisFixinternos#Id": z.number().int().nullish(),
  Check_AneisFixinternos: z.record(z.unknown()).nullish(),
  "Check_Olhal#Id": z.number().int().nullish(),
  Check_Olhal: z.record(z.unknown()).nullish(),
  "Check_Tampadefletora#Id": z.number().int().nullish(),
  Check_Tampadefletora: z.record(z.unknown()).nullish(),
  "Check_Ventilador#Id": z.number().int().nullish(),
  Check_Ventilador: z.record(z.unknown()).nullish(),
  "Check_Prolongador#Id": z.number().int().nullish(),
  Check_Prolongador: z.record(z.unknown()).nullish(),
  "Check_Pino#Id": z.number().int().nullish(),
  Check_Pino: z.record(z.unknown()).nullish(),
  "Check_Protetor#Id": z.number().int().nullish(),
  Check_Protetor: z.record(z.unknown()).nullish(),
  "Check_PinturaExterna#Id": z.number().int().nullish(),
  Check_PinturaExterna: z.record(z.unknown()).nullish(),
  "Check_parafusos#Id": z.number().int().nullish(),
  Check_parafusos: z.record(z.unknown()).nullish(),
  "Check_Veda_x00e7__x00f5_es#Id": z.number().int().nullish(),
  Check_Veda_x00e7__x00f5_es: z.record(z.unknown()).nullish(),
  "Check_Kitfreio#Id": z.number().int().nullish(),
  Check_Kitfreio: z.record(z.unknown()).nullish(),
  "Check_PlacaOS#Id": z.number().int().nullish(),
  Check_PlacaOS: z.record(z.unknown()).nullish(),
  "Check_PlacaTAG#Id": z.number().int().nullish(),
  Check_PlacaTAG: z.record(z.unknown()).nullish(),
  "Check_SeloQuali#Id": z.number().int().nullish(),
  Check_SeloQuali: z.record(z.unknown()).nullish(),
  "Check_Resina#Id": z.number().int().nullish(),
  Check_Resina: z.record(z.unknown()).nullish(),
  "Check_Caixa#Id": z.number().int().nullish(),
  Check_Caixa: z.record(z.unknown()).nullish(),
  "Check_Cabosdefor_x00e7_a#Id": z.number().int().nullish(),
  Check_Cabosdefor_x00e7_a: z.record(z.unknown()).nullish(),
  "Check_terminais#Id": z.number().int().nullish(),
  Check_terminais: z.record(z.unknown()).nullish(),
  "Check_ponteret#Id": z.number().int().nullish(),
  Check_ponteret: z.record(z.unknown()).nullish(),
  Check_isola_x00e7__x00e3_osaida: z.string().nullish(),
  Check_resistenciasaida: z.string().nullish(),
  "Check_EScaixametalica#Id": z.number().int().nullish(),
  Check_EScaixametalica: z.record(z.unknown()).nullish(),
  "Check_ESprensacabo#Id": z.number().int().nullish(),
  Check_ESprensacabo: z.record(z.unknown()).nullish(),
  "Check_EScaboPP#Id": z.number().int().nullish(),
  Check_EScaboPP: z.record(z.unknown()).nullish(),
  "Check_ESroscasaux#Id": z.number().int().nullish(),
  Check_ESroscasaux: z.record(z.unknown()).nullish(),
  "Check_Prato#Id": z.number().int().nullish(),
  Check_Prato: z.record(z.unknown()).nullish(),
  "Check_ESporcacast#Id": z.number().int().nullish(),
  Check_ESporcacast: z.record(z.unknown()).nullish(),
  "Check_ESkitfixprato#Id": z.number().int().nullish(),
  Check_ESkitfixprato: z.record(z.unknown()).nullish(),
  "Check_ESroscapontadoeixo#Id": z.number().int().nullish(),
  Check_ESroscapontadoeixo: z.record(z.unknown()).nullish(),
  "Check_ESparafusofixsiroco#Id": z.number().int().nullish(),
  Check_ESparafusofixsiroco: z.record(z.unknown()).nullish(),
  "Check_ESflangesiroco#Id": z.number().int().nullish(),
  Check_ESflangesiroco: z.record(z.unknown()).nullish(),
  "Check_EScubofixdsiroco#Id": z.number().int().nullish(),
  Check_EScubofixdsiroco: z.record(z.unknown()).nullish(),
  OBS_qualidade: z.string().nullish(),
  OBS_teste: z.string().nullish(),
  Test_Isol1: z.string().nullish(),
  Test_Isol2: z.string().nullish(),
  Test_Isol3: z.string().nullish(),
  Test_resR: z.string().nullish(),
  Test_resS: z.string().nullish(),
  Test_resT: z.string().nullish(),
  Test_res1_x002d_4: z.string().nullish(),
  Test_res2_x002d_5: z.string().nullish(),
  Test_res3_x002d_6: z.string().nullish(),
  Test_res7_x002d_10: z.string().nullish(),
  Test_res8_x002d_11: z.string().nullish(),
  Test_res9_x002d_12: z.string().nullish(),
  Test_Tens_x00e3_o: z.string().nullish(),
  Test_Rota_x00e7__x00e3_o0: z.string().nullish(),
  Test_CorrenteR: z.string().nullish(),
  Test_CorrenteS: z.string().nullish(),
  Test_CorrenteT: z.string().nullish(),
  Test_tempC: z.string().nullish(),
  Test_TempMancalLA: z.string().nullish(),
  Test_TempMancalLOA: z.string().nullish(),
  TestTempEsta: z.string().nullish(),
  Test_TempAmbi: z.string().nullish(),
  Test_VibMLA: z.string().nullish(),
  Test_VibMLOA: z.string().nullish(),
  Filial: z.string().nullish(),
  Test_VibALA: z.string().nullish(),
  Test_VibVLOA: z.string().nullish(),
  Test_VibHLOA: z.string().nullish(),
  "TestAPROVADO#Id": z.number().int().nullish(),
  TestAPROVADO: z.record(z.unknown()).nullish(),
  DataInspe_x00e7__x00e3_o: z.string().nullish(),
  Test_Rotacao: z.string().nullish(),
  Nome: z.string().nullish(),
  Nome_inspetor: z.string().nullish(),
  ID_ESPELHO: z.number().nullish(),
  Unidade: z.string().nullish(),
  Created: z.string().nullish(),
  Modified: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  Test_VibALOA: z.string().nullish(),
  "Check_aprovado#Id": z.number().int().nullish(),
  Check_aprovado: z.record(z.unknown()).nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
}).partial();
export type PFEIQ2024Write = z.infer<typeof PFEIQ2024Write>;

export const PFEIQ2024Meta = {
  name: "PF e IQ - 2024",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "38ac7700-ff59-4a4c-b3de-93e7a0667b78",
  permission: "read-write",
} as const;

/** Relatório · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface RelatRioRow {
  ID?: number | null;
  Title?: string | null;
  Detalhe?: string | null;
  Unidade?: string | null;
  DestinAprova?: string | null;
  xTitulo?: string | null;
  Data_Execucao?: string | null;
  Data_final?: string | null;
  Data_Aprovacao?: string | null;
  Aprovador?: string | null;
  Nota?: number | null;
  ComentarioX?: string | null;
  xMatricula?: string | null;
  ComplianceAssetId?: string | null;
  Modified?: string | null;
  Created?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
}

export const RelatRioWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string().nullish(),
  Detalhe: z.string().nullish(),
  Unidade: z.string().nullish(),
  DestinAprova: z.string().nullish(),
  xTitulo: z.string().nullish(),
  Data_Execucao: z.string().nullish(),
  Data_final: z.string().nullish(),
  Data_Aprovacao: z.string().nullish(),
  Aprovador: z.string().nullish(),
  Nota: z.number().nullish(),
  ComentarioX: z.string().nullish(),
  xMatricula: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  Modified: z.string().nullish(),
  Created: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
}).partial();
export type RelatRioWrite = z.infer<typeof RelatRioWrite>;

export const RelatRioMeta = {
  name: "Relatório",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "88d599be-251f-4289-ac11-c519df0144f9",
  permission: "read-write",
} as const;

/** Serviços Terceirizados - PT · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface ServiOsTerceirizadosPTRow {
  ID?: number | null;
  Title?: string | null;
  "Empresa#Id"?: number | null;
  Empresa?: Record<string, unknown> | null;
  Orc_Fornecedor?: string | null;
  Data_registro?: string | null;
  Data_aprovacao_valor?: string | null;
  Data_retorno?: string | null;
  "Pe_x00e7_a#Id"?: number | null;
  Pe_x00e7_a?: Record<string, unknown> | null;
  Servi_x00e7_o1?: string | null;
  ValorServ1?: string | null;
  Servi_x00e7_o2?: string | null;
  ValorServ2?: string | null;
  Servi_x00e7_o3?: string | null;
  ValorServ3?: string | null;
  Servi_x00e7_o4?: string | null;
  ValorServ4?: string | null;
  Servi_x00e7_o5?: string | null;
  ValorServ5?: string | null;
  TotalValor?: string | null;
  Observa_x00e7__x00e3_o?: string | null;
  Fabricante?: string | null;
  Carca_x00e7_a?: string | null;
  "Situa_x00e7__x00e3_o#Id"?: number | null;
  Situa_x00e7__x00e3_o?: Record<string, unknown> | null;
  Data_envio?: string | null;
  N_OR?: string | null;
  Unidade?: string | null;
  Previs_x00e3_oRetorno?: string | null;
  Created?: string | null;
  xUsuario?: string | null;
  ComplianceAssetId?: string | null;
  Modified?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
}

export const ServiOsTerceirizadosPTWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string(),
  "Empresa#Id": z.number().int().nullish(),
  Empresa: z.record(z.unknown()).nullish(),
  Orc_Fornecedor: z.string().nullish(),
  Data_registro: z.string().nullish(),
  Data_aprovacao_valor: z.string().nullish(),
  Data_retorno: z.string().nullish(),
  "Pe_x00e7_a#Id": z.number().int().nullish(),
  Pe_x00e7_a: z.record(z.unknown()).nullish(),
  Servi_x00e7_o1: z.string().nullish(),
  ValorServ1: z.string().nullish(),
  Servi_x00e7_o2: z.string().nullish(),
  ValorServ2: z.string().nullish(),
  Servi_x00e7_o3: z.string().nullish(),
  ValorServ3: z.string().nullish(),
  Servi_x00e7_o4: z.string().nullish(),
  ValorServ4: z.string().nullish(),
  Servi_x00e7_o5: z.string().nullish(),
  ValorServ5: z.string().nullish(),
  TotalValor: z.string().nullish(),
  Observa_x00e7__x00e3_o: z.string().nullish(),
  Fabricante: z.string().nullish(),
  Carca_x00e7_a: z.string().nullish(),
  "Situa_x00e7__x00e3_o#Id": z.number().int().nullish(),
  Situa_x00e7__x00e3_o: z.record(z.unknown()).nullish(),
  Data_envio: z.string().nullish(),
  N_OR: z.string().nullish(),
  Unidade: z.string().nullish(),
  Previs_x00e3_oRetorno: z.string().nullish(),
  Created: z.string().nullish(),
  xUsuario: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  Modified: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
}).partial();
export type ServiOsTerceirizadosPTWrite = z.infer<typeof ServiOsTerceirizadosPTWrite>;

export const ServiOsTerceirizadosPTMeta = {
  name: "Serviços Terceirizados - PT",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "073eb7c3-4414-427c-af91-44f312eb20f6",
  permission: "read-write",
} as const;

/** Lista Auxiliar - Inspeção de Qualidade · dataset `https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores` */
export interface ListaAuxiliarInspeODeQualidadeRow {
  ID?: number | null;
  Title?: string | null;
  field_1?: string | null;
  ComplianceAssetId?: string | null;
  Modified?: string | null;
  Created?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
}

export const ListaAuxiliarInspeODeQualidadeWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string().nullish(),
  field_1: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  Modified: z.string().nullish(),
  Created: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
}).partial();
export type ListaAuxiliarInspeODeQualidadeWrite = z.infer<typeof ListaAuxiliarInspeODeQualidadeWrite>;

export const ListaAuxiliarInspeODeQualidadeMeta = {
  name: "Lista Auxiliar - Inspeção de Qualidade",
  dataset: "https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores",
  table: "d0960fef-9308-4da5-acd7-c49264b98a40",
  permission: "read-write",
} as const;

/** Lista Auxiliar - Setores Medro · dataset `https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores` */
export interface ListaAuxiliarSetoresMedroRow {
  ID?: number | null;
  Title?: string | null;
  Pa_x00ed_s?: string | null;
  ComplianceAssetId?: string | null;
  Modified?: string | null;
  Created?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
}

export const ListaAuxiliarSetoresMedroWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string().nullish(),
  Pa_x00ed_s: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  Modified: z.string().nullish(),
  Created: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
}).partial();
export type ListaAuxiliarSetoresMedroWrite = z.infer<typeof ListaAuxiliarSetoresMedroWrite>;

export const ListaAuxiliarSetoresMedroMeta = {
  name: "Lista Auxiliar - Setores Medro",
  dataset: "https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores",
  table: "bed0cbbc-f926-4a95-b64c-cb3f8c290f83",
  permission: "read-write",
} as const;

/** Doc Técnicos · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface DocTCnicosRow {
  ID?: number | null;
  Title?: string | null;
  Modified?: string | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
  MediaServiceOCR?: string | null;
  ComplianceAssetId?: string | null;
  "MediaServiceImageTags#WssId"?: unknown[] | null;
  "MediaServiceImageTags@odata.type"?: string | null;
  MediaServiceImageTags?: unknown[] | null;
  MediaServiceLocation?: string | null;
  Created?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "CheckoutUser#Claims"?: string | null;
  CheckoutUser?: Record<string, unknown> | null;
}

export const DocTCnicosWrite = z.object({
  ID: z.number().int().nullish(),
  Title: z.string().nullish(),
  Modified: z.string().nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
  MediaServiceOCR: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  "MediaServiceImageTags#WssId": z.array(z.unknown()).nullish(),
  "MediaServiceImageTags@odata.type": z.string().nullish(),
  MediaServiceImageTags: z.array(z.unknown()).nullish(),
  MediaServiceLocation: z.string().nullish(),
  Created: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "CheckoutUser#Claims": z.string().nullish(),
  CheckoutUser: z.record(z.unknown()).nullish(),
}).partial();
export type DocTCnicosWrite = z.infer<typeof DocTCnicosWrite>;

export const DocTCnicosMeta = {
  name: "Doc Técnicos",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "73cb1ed5-29d9-471d-a207-e09399de426b",
  permission: "read-write",
} as const;

/** Doc Técnicos_1 — Doc Técnicos · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface DocTCnicos1Row {
  ID?: number | null;
  Title?: string | null;
  Modified?: string | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
  MediaServiceOCR?: string | null;
  ComplianceAssetId?: string | null;
  "MediaServiceImageTags#WssId"?: unknown[] | null;
  "MediaServiceImageTags@odata.type"?: string | null;
  MediaServiceImageTags?: unknown[] | null;
  MediaServiceLocation?: string | null;
  Created?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "CheckoutUser#Claims"?: string | null;
  CheckoutUser?: Record<string, unknown> | null;
}

export const DocTCnicos1Write = z.object({
  ID: z.number().int().nullish(),
  Title: z.string().nullish(),
  Modified: z.string().nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
  MediaServiceOCR: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  "MediaServiceImageTags#WssId": z.array(z.unknown()).nullish(),
  "MediaServiceImageTags@odata.type": z.string().nullish(),
  MediaServiceImageTags: z.array(z.unknown()).nullish(),
  MediaServiceLocation: z.string().nullish(),
  Created: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "CheckoutUser#Claims": z.string().nullish(),
  CheckoutUser: z.record(z.unknown()).nullish(),
}).partial();
export type DocTCnicos1Write = z.infer<typeof DocTCnicos1Write>;

export const DocTCnicos1Meta = {
  name: "Doc Técnicos_1",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "73cb1ed5-29d9-471d-a207-e09399de426b",
  permission: "read-write",
} as const;

/** Doc Técnicos_2 — Doc Técnicos · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface DocTCnicos2Row {
  ID?: number | null;
  Title?: string | null;
  Modified?: string | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
  MediaServiceOCR?: string | null;
  ComplianceAssetId?: string | null;
  "MediaServiceImageTags#WssId"?: unknown[] | null;
  "MediaServiceImageTags@odata.type"?: string | null;
  MediaServiceImageTags?: unknown[] | null;
  MediaServiceLocation?: string | null;
  Created?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "CheckoutUser#Claims"?: string | null;
  CheckoutUser?: Record<string, unknown> | null;
}

export const DocTCnicos2Write = z.object({
  ID: z.number().int().nullish(),
  Title: z.string().nullish(),
  Modified: z.string().nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
  MediaServiceOCR: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  "MediaServiceImageTags#WssId": z.array(z.unknown()).nullish(),
  "MediaServiceImageTags@odata.type": z.string().nullish(),
  MediaServiceImageTags: z.array(z.unknown()).nullish(),
  MediaServiceLocation: z.string().nullish(),
  Created: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "CheckoutUser#Claims": z.string().nullish(),
  CheckoutUser: z.record(z.unknown()).nullish(),
}).partial();
export type DocTCnicos2Write = z.infer<typeof DocTCnicos2Write>;

export const DocTCnicos2Meta = {
  name: "Doc Técnicos_2",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "73cb1ed5-29d9-471d-a207-e09399de426b",
  permission: "read-write",
} as const;

/** Doc Técnicos_3 — Doc Técnicos · dataset `https://aplicativokm.sharepoint.com/sites/KairosMotores` */
export interface DocTCnicos3Row {
  ID?: number | null;
  Title?: string | null;
  Modified?: string | null;
  "Editor#Claims"?: string | null;
  Editor?: Record<string, unknown> | null;
  MediaServiceOCR?: string | null;
  ComplianceAssetId?: string | null;
  "MediaServiceImageTags#WssId"?: unknown[] | null;
  "MediaServiceImageTags@odata.type"?: string | null;
  MediaServiceImageTags?: unknown[] | null;
  MediaServiceLocation?: string | null;
  Created?: string | null;
  "Author#Claims"?: string | null;
  Author?: Record<string, unknown> | null;
  "CheckoutUser#Claims"?: string | null;
  CheckoutUser?: Record<string, unknown> | null;
}

export const DocTCnicos3Write = z.object({
  ID: z.number().int().nullish(),
  Title: z.string().nullish(),
  Modified: z.string().nullish(),
  "Editor#Claims": z.string().nullish(),
  Editor: z.record(z.unknown()).nullish(),
  MediaServiceOCR: z.string().nullish(),
  ComplianceAssetId: z.string().nullish(),
  "MediaServiceImageTags#WssId": z.array(z.unknown()).nullish(),
  "MediaServiceImageTags@odata.type": z.string().nullish(),
  MediaServiceImageTags: z.array(z.unknown()).nullish(),
  MediaServiceLocation: z.string().nullish(),
  Created: z.string().nullish(),
  "Author#Claims": z.string().nullish(),
  Author: z.record(z.unknown()).nullish(),
  "CheckoutUser#Claims": z.string().nullish(),
  CheckoutUser: z.record(z.unknown()).nullish(),
}).partial();
export type DocTCnicos3Write = z.infer<typeof DocTCnicos3Write>;

export const DocTCnicos3Meta = {
  name: "Doc Técnicos_3",
  dataset: "https://aplicativokm.sharepoint.com/sites/KairosMotores",
  table: "73cb1ed5-29d9-471d-a207-e09399de426b",
  permission: "read-write",
} as const;

export const SHAREPOINT_LISTS = {
  "SAC - Kairós": SACKairSMeta,
  "PF e IQ": PFEIQMeta,
  "Tarefas Operacionais": TarefasOperacionaisMeta,
  "Trajetos": TrajetosMeta,
  "CheckList_Veicular": CheckListVeicularMeta,
  "ServiExternosAveiro": ServiExternosAveiroMeta,
  "ServiçosExternosPortugal": ServiOsExternosPortugalMeta,
  "Lista QR Code": ListaQRCodeMeta,
  "Doc.Medro.SLZ": DocMedroSLZMeta,
  "Lista Auxiliar - Clientes Medro": ListaAuxiliarClientesMedroMeta,
  "Serviços Terceirizados": ServiOsTerceirizadosMeta,
  "Lista Auxiliar - Ferramentas por Setor": ListaAuxiliarFerramentasPorSetorMeta,
  "Lista Auxiliar - Ferramentas": ListaAuxiliarFerramentasMeta,
  "RDS": RDSMeta,
  "OS 45-65k": OS4565kMeta,
  "PF e IQ - 2024": PFEIQ2024Meta,
  "Relatório": RelatRioMeta,
  "Serviços Terceirizados - PT": ServiOsTerceirizadosPTMeta,
  "Lista Auxiliar - Inspeção de Qualidade": ListaAuxiliarInspeODeQualidadeMeta,
  "Lista Auxiliar - Setores Medro": ListaAuxiliarSetoresMedroMeta,
  "Doc Técnicos": DocTCnicosMeta,
  "Doc Técnicos_1": DocTCnicos1Meta,
  "Doc Técnicos_2": DocTCnicos2Meta,
  "Doc Técnicos_3": DocTCnicos3Meta,
} as const;
