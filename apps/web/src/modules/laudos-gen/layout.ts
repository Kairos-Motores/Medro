/** Layout padrão do laudo (subset do modelConfig.layout do app original). */
export interface LaudoPage {
  id: string;
  type: string;
  title: string;
  keys?: string[];
}

export const DEFAULT_LAYOUT: LaudoPage[] = [
  { id: "cover", type: "PageCover", title: "Capa" },
  { id: "back_cover", type: "PageBackCover", title: "Contracapa" },
  { id: "our_services", type: "PageOurServices", title: "Nossos Serviços" },
  { id: "summary", type: "PageSummary", title: "Resumo do Equipamento" },
  { id: "process_data", type: "PageProcessData", title: "Dados de Processo" },
  { id: "diagnosis", type: "PageDiagnosisAndHistory", title: "Diagnóstico e Histórico" },
  { id: "motor_p7", type: "PageMotorElectric", title: "Relatório Fotográfico P07", keys: ["p7_block1", "p7_block2"] },
  { id: "motor_p8", type: "PageMotorElectric", title: "Relatório Fotográfico P08", keys: ["p8_block1", "p8_block2"] },
  { id: "mechanical", type: "PageMechanicalEvaluation", title: "Avaliação Mecânica" },
  { id: "bearing", type: "PageBearingEvaluation", title: "Avaliação de Mancais" },
  { id: "components", type: "PageComponentsEvaluation", title: "Componentes Auxiliares" },
  { id: "resistance", type: "PageResistanceTests", title: "Ensaios de Resistência" },
  { id: "normative", type: "PageNormativeReferences", title: "Referências Normativas" },
  { id: "static_desc", type: "PageStaticTestsDescription", title: "Descrição dos Ensaios" },
  { id: "custom_table_default", type: "PageCustomTable", title: "Tabela Livre Customizada" },
  { id: "balanceamento", type: "PageBalanceamento", title: "Balanceamento Dinâmico" },
  { id: "final", type: "PageFinal", title: "Encerramento" },
];
