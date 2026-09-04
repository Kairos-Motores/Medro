export interface MigracaoStatus {
  ativo: boolean;
  status: "Em Execução" | "Pausado" | "Ocioso" | "Erro";
  progresso_porcentagem: number;
  total_base_antiga: number;
  total_convertido: number;
  total_deduplicado: number;
  total_erros: number;
  lote_atual: number;
  total_lotes: number;
  taxa_processamento_por_min: number;
  tempo_estimado_restante: string;
  ultima_sincronizacao: string;
  modo_operacao: "Sincronização Contínua (Delta)" | "Carga Inicial" | "Pausado";
}

export interface LinhaAmostra {
  id: string;
  tipo: "INSERÇÃO" | "DELTA" | "ATUALIZADO";
  transcrito_em: string;
  legado: {
    os: string;
    os_comp: string;
    cliente: string;
    unidade: string;
    setor: string;
    status_fcadastro: string;
    responsavel: string;
    matricula: string;
    data_inicial: string;
    data_final: string;
  };
  novo: {
    chave_integracao: string;
    numero_os_ref: string;
    unidade_id: number;
    unidade_nome: string;
    setor_id: number;
    setor_nome: string;
    status_evento_id: number;
    status_evento_nome: string;
    duracao_minutos: number;
    data_inicio: string;
    data_fim: string;
  };
}

export interface LogEvento {
  id: string;
  timestamp: string;
  nivel: "INFO" | "SUCCESS" | "WARN" | "ERROR";
  mensagem: string;
  origem: "DELTA_WORKER" | "INITIAL_SYNC" | "DATAVERSE_CONNECTOR" | "DEDUP_ENGINE";
}

export interface DistribuicaoFilial {
  nome: string;
  registros_legado: number;
  transcritos: number;
  porcentagem: number;
}

export interface DistribuicaoSetor {
  nome: string;
  porcentagem: number;
  total: number;
}

export interface MapeamentoRegraItem {
  de: string;
  para_id: number;
  para_nome: string;
}

export interface DistribuicaoData {
  filiais: DistribuicaoFilial[];
  setores: DistribuicaoSetor[];
  mapeamento_regras: {
    unidades: MapeamentoRegraItem[];
    setores: MapeamentoRegraItem[];
    chave_formato: string;
  };
}
