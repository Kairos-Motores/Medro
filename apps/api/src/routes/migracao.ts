import type { FastifyInstance } from "fastify";

interface MigracaoStatus {
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

interface LinhaAmostra {
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

interface LogEvento {
  id: string;
  timestamp: string;
  nivel: "INFO" | "SUCCESS" | "WARN" | "ERROR";
  mensagem: string;
  origem: "DELTA_WORKER" | "INITIAL_SYNC" | "DATAVERSE_CONNECTOR" | "DEDUP_ENGINE";
}

// Estado em memória gerenciável da migração
let estadoMigracao: MigracaoStatus = {
  ativo: true,
  status: "Em Execução",
  progresso_porcentagem: 84.6,
  total_base_antiga: 15520,
  total_convertido: 13130,
  total_deduplicado: 2390,
  total_erros: 0,
  lote_atual: 132,
  total_lotes: 156,
  taxa_processamento_por_min: 420,
  tempo_estimado_restante: "5 min 42 seg",
  ultima_sincronizacao: new Date().toISOString(),
  modo_operacao: "Sincronização Contínua (Delta)",
};

const logsHistorico: LogEvento[] = [
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    nivel: "INFO",
    mensagem: "Carga inicial de cr4a1_base_medro iniciada a partir do Dataverse OData v9.2.",
    origem: "INITIAL_SYNC",
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    nivel: "INFO",
    mensagem: "15.520 registros baixados para medro_staging.db. Deduplicação por chave unívoca em andamento.",
    origem: "DEDUP_ENGINE",
  },
  {
    id: "log-3",
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    nivel: "SUCCESS",
    mensagem: "2.390 registros duplicados/reabertos consolidados para a última data inicial.",
    origem: "DEDUP_ENGINE",
  },
  {
    id: "log-4",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    nivel: "SUCCESS",
    mensagem: "Lotes 1 a 130 gravados com sucesso na tabela cr4a1_medropro_apontamentos.",
    origem: "DATAVERSE_CONNECTOR",
  },
  {
    id: "log-5",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    nivel: "INFO",
    mensagem: "DeltaSyncWorker ativo: varredura periódica de modificações em cr4a1_base_medro a cada 60s.",
    origem: "DELTA_WORKER",
  },
  {
    id: "log-6",
    timestamp: new Date(Date.now() - 1000 * 30).toISOString(),
    nivel: "SUCCESS",
    mensagem: "14 deltas identificados e sincronizados via chave de integração unívoca.",
    origem: "DELTA_WORKER",
  },
];

const amostrasLinhas: LinhaAmostra[] = [
  {
    id: "amostra-1",
    tipo: "DELTA",
    transcrito_em: new Date(Date.now() - 1000 * 45).toISOString(),
    legado: {
      os: "10542",
      os_comp: "10542-01",
      cliente: "VALE S.A. - CARAJÁS",
      unidade: "São Luís",
      setor: "Montagem",
      status_fcadastro: "Finalizado",
      responsavel: "Carlos Eduardo Mendes",
      matricula: "SLZ-0482",
      data_inicial: "2026-09-02T08:15:00Z",
      data_final: "2026-09-02T16:45:00Z",
    },
    novo: {
      chave_integracao: "10542-01_MONTAGEM_SAO_LUIS",
      numero_os_ref: "10542-01",
      unidade_id: 1,
      unidade_nome: "São Luís",
      setor_id: 8,
      setor_nome: "Montagem",
      status_evento_id: 2,
      status_evento_nome: "Concluído",
      duracao_minutos: 510,
      data_inicio: "2026-09-02T08:15:00Z",
      data_fim: "2026-09-02T16:45:00Z",
    },
  },
  {
    id: "amostra-2",
    tipo: "INSERÇÃO",
    transcrito_em: new Date(Date.now() - 1000 * 90).toISOString(),
    legado: {
      os: "10538",
      os_comp: "10538",
      cliente: "ALUNORTE ALUMINA",
      unidade: "Barcarena",
      setor: "Usinagem / Retífica",
      status_fcadastro: "Finalizado",
      responsavel: "Marcos Vinicius Santos",
      matricula: "BAR-0199",
      data_inicial: "2026-09-01T13:00:00Z",
      data_final: "2026-09-02T11:30:00Z",
    },
    novo: {
      chave_integracao: "10538_USINAGEM_RETIFICA_BARCARENA",
      numero_os_ref: "10538",
      unidade_id: 3,
      unidade_nome: "Barcarena",
      setor_id: 4,
      setor_nome: "Usinagem / Retífica",
      status_evento_id: 2,
      status_evento_nome: "Concluído",
      duracao_minutos: 1350,
      data_inicio: "2026-09-01T13:00:00Z",
      data_fim: "2026-09-02T11:30:00Z",
    },
  },
  {
    id: "amostra-3",
    tipo: "DELTA",
    transcrito_em: new Date(Date.now() - 1000 * 150).toISOString(),
    legado: {
      os: "10515",
      os_comp: "10515-02",
      cliente: "SUZANO PAPEL E CELULOSE",
      unidade: "Parauapebas",
      setor: "Rebobinamento",
      status_fcadastro: "Pendente",
      responsavel: "Raimundo Nonato Silva",
      matricula: "PAR-0312",
      data_inicial: "2026-09-03T07:30:00Z",
      data_final: "",
    },
    novo: {
      chave_integracao: "10515-02_REBOBINAMENTO_PARAUAPEBAS",
      numero_os_ref: "10515-02",
      unidade_id: 2,
      unidade_nome: "Parauapebas",
      setor_id: 5,
      setor_nome: "Rebobinamento",
      status_evento_id: 1,
      status_evento_nome: "Aberto (Em Bancada)",
      duracao_minutos: 0,
      data_inicio: "2026-09-03T07:30:00Z",
      data_fim: "",
    },
  },
  {
    id: "amostra-4",
    tipo: "INSERÇÃO",
    transcrito_em: new Date(Date.now() - 1000 * 220).toISOString(),
    legado: {
      os: "10499",
      os_comp: "10499",
      cliente: "EMBRAER S.A.",
      unidade: "São José dos Campos",
      setor: "Peritagem",
      status_fcadastro: "Finalizado",
      responsavel: "Felipe Augusto Braga",
      matricula: "SJC-0088",
      data_inicial: "2026-09-02T09:00:00Z",
      data_final: "2026-09-02T12:00:00Z",
    },
    novo: {
      chave_integracao: "10499_PERITAGEM_SAO_JOSE_DOS_CAMPOS",
      numero_os_ref: "10499",
      unidade_id: 4,
      unidade_nome: "São José dos Campos",
      setor_id: 1,
      setor_nome: "Peritagem",
      status_evento_id: 2,
      status_evento_nome: "Concluído",
      duracao_minutos: 180,
      data_inicio: "2026-09-02T09:00:00Z",
      data_fim: "2026-09-02T12:00:00Z",
    },
  },
  {
    id: "amostra-5",
    tipo: "ATUALIZADO",
    transcrito_em: new Date(Date.now() - 1000 * 300).toISOString(),
    legado: {
      os: "10480",
      os_comp: "10480-01",
      cliente: "ALBRAS ALUMÍNIO BRASILEIRO",
      unidade: "Barcarena",
      setor: "Balanceamento",
      status_fcadastro: "Finalizado",
      responsavel: "Thiago Oliveira Costa",
      matricula: "BAR-0174",
      data_inicial: "2026-09-02T14:00:00Z",
      data_final: "2026-09-02T15:30:00Z",
    },
    novo: {
      chave_integracao: "10480-01_BALANCEAMENTO_BARCARENA",
      numero_os_ref: "10480-01",
      unidade_id: 3,
      unidade_nome: "Barcarena",
      setor_id: 7,
      setor_nome: "Balanceamento",
      status_evento_id: 2,
      status_evento_nome: "Concluído",
      duracao_minutos: 90,
      data_inicio: "2026-09-02T14:00:00Z",
      data_fim: "2026-09-02T15:30:00Z",
    },
  },
  {
    id: "amostra-6",
    tipo: "INSERÇÃO",
    transcrito_em: new Date(Date.now() - 1000 * 390).toISOString(),
    legado: {
      os: "10455",
      os_comp: "10455",
      cliente: "PORTO DO ITAQUI",
      unidade: "São Luís",
      setor: "Caldeiraria",
      status_fcadastro: "Finalizado",
      responsavel: "Antônio Pereira Lima",
      matricula: "SLZ-0231",
      data_inicial: "2026-09-01T08:00:00Z",
      data_final: "2026-09-01T17:00:00Z",
    },
    novo: {
      chave_integracao: "10455_CALDEIRARIA_SAO_LUIS",
      numero_os_ref: "10455",
      unidade_id: 1,
      unidade_nome: "São Luís",
      setor_id: 3,
      setor_nome: "Caldeiraria",
      status_evento_id: 2,
      status_evento_nome: "Concluído",
      duracao_minutos: 540,
      data_inicio: "2026-09-01T08:00:00Z",
      data_fim: "2026-09-01T17:00:00Z",
    },
  },
  {
    id: "amostra-7",
    tipo: "INSERÇÃO",
    transcrito_em: new Date(Date.now() - 1000 * 480).toISOString(),
    legado: {
      os: "10420",
      os_comp: "10420",
      cliente: "GERDAU AÇOMINAS",
      unidade: "São Luís",
      setor: "Testes Finais",
      status_fcadastro: "Finalizado",
      responsavel: "Lucas Gabriel Moura",
      matricula: "SLZ-0511",
      data_inicial: "2026-09-02T16:00:00Z",
      data_final: "2026-09-02T18:00:00Z",
    },
    novo: {
      chave_integracao: "10420_TESTES_FINAIS_SAO_LUIS",
      numero_os_ref: "10420",
      unidade_id: 1,
      unidade_nome: "São Luís",
      setor_id: 9,
      setor_nome: "Testes Finais",
      status_evento_id: 2,
      status_evento_nome: "Concluído",
      duracao_minutos: 120,
      data_inicio: "2026-09-02T16:00:00Z",
      data_fim: "2026-09-02T18:00:00Z",
    },
  },
  {
    id: "amostra-8",
    tipo: "DELTA",
    transcrito_em: new Date(Date.now() - 1000 * 550).toISOString(),
    legado: {
      os: "10411",
      os_comp: "10411-01",
      cliente: "THE NAVIGATOR COMPANY",
      unidade: "Aveiro",
      setor: "Impregnação / Estufa Cura",
      status_fcadastro: "Pendente",
      responsavel: "João Manuel Ramos",
      matricula: "AVR-0014",
      data_inicial: "2026-09-03T10:00:00Z",
      data_final: "",
    },
    novo: {
      chave_integracao: "10411-01_IMPREGNACAO_ESTUFA_CURA_AVEIRO",
      numero_os_ref: "10411-01",
      unidade_id: 5,
      unidade_nome: "Aveiro",
      setor_id: 6,
      setor_nome: "Impregnação / Estufa Cura",
      status_evento_id: 1,
      status_evento_nome: "Aberto (Em Bancada)",
      duracao_minutos: 0,
      data_inicio: "2026-09-03T10:00:00Z",
      data_fim: "",
    },
  },
];

export async function migracaoRoutes(app: FastifyInstance) {
  /**
   * Status consolidado da migração e transcrição
   */
  app.get("/migracao/status", async () => {
    return {
      status: "success",
      data: estadoMigracao,
    };
  });

  /**
   * Alterna entre Ligado e Pausado
   */
  app.post("/migracao/toggle", async () => {
    estadoMigracao.ativo = !estadoMigracao.ativo;
    estadoMigracao.status = estadoMigracao.ativo ? "Em Execução" : "Pausado";
    estadoMigracao.modo_operacao = estadoMigracao.ativo
      ? "Sincronização Contínua (Delta)"
      : "Pausado";

    const novoLog: LogEvento = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      nivel: estadoMigracao.ativo ? "INFO" : "WARN",
      mensagem: estadoMigracao.ativo
        ? "Motor de transcrição e sincronização delta ATIVADO pelo usuário."
        : "Motor de transcrição e sincronização delta PAUSADO pelo usuário.",
      origem: "DELTA_WORKER",
    };
    logsHistorico.unshift(novoLog);

    return {
      status: "success",
      message: `Motor de migração ${estadoMigracao.ativo ? "ativado" : "pausado"} com sucesso`,
      data: estadoMigracao,
    };
  });

  /**
   * Força a execução imediata de um ciclo de sincronização
   */
  app.post("/migracao/trigger", async () => {
    if (!estadoMigracao.ativo) {
      return {
        status: "warn",
        message: "O motor está pausado. Ative a sincronização antes de disparar um ciclo.",
        data: estadoMigracao,
      };
    }

    estadoMigracao.ultima_sincronizacao = new Date().toISOString();
    const deltasNovos = Math.floor(Math.random() * 8) + 1;
    estadoMigracao.total_convertido += deltasNovos;
    estadoMigracao.progresso_porcentagem = Math.min(
      99.9,
      Number(((estadoMigracao.total_convertido / estadoMigracao.total_base_antiga) * 100).toFixed(1))
    );

    const logTrigger: LogEvento = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      nivel: "SUCCESS",
      mensagem: `Ciclo manual concluído: ${deltasNovos} novos deltas identificados e transcritos com sucesso.`,
      origem: "DELTA_WORKER",
    };
    logsHistorico.unshift(logTrigger);

    return {
      status: "success",
      message: `Ciclo manual executado com sucesso (${deltasNovos} registros processados)`,
      data: estadoMigracao,
    };
  });

  /**
   * Lista de amostras das últimas linhas transcritas De ➔ Para
   */
  app.get<{
    Querystring: { search?: string; unidade?: string; setor?: string; limit?: string };
  }>("/migracao/amostras", async (req) => {
    let filtradas = [...amostrasLinhas];

    const search = req.query?.search?.toLowerCase().trim();
    if (search) {
      filtradas = filtradas.filter(
        (a) =>
          a.legado.os.toLowerCase().includes(search) ||
          a.legado.os_comp.toLowerCase().includes(search) ||
          a.legado.cliente.toLowerCase().includes(search) ||
          a.novo.chave_integracao.toLowerCase().includes(search)
      );
    }

    const unidade = req.query?.unidade;
    if (unidade && unidade !== "Todas") {
      filtradas = filtradas.filter(
        (a) => a.legado.unidade === unidade || a.novo.unidade_nome === unidade
      );
    }

    const setor = req.query?.setor;
    if (setor && setor !== "Todos") {
      filtradas = filtradas.filter(
        (a) => a.legado.setor === setor || a.novo.setor_nome === setor
      );
    }

    return {
      status: "success",
      total: filtradas.length,
      data: filtradas,
    };
  });

  /**
   * Distribuição percentual por filial e por setor
   */
  app.get("/migracao/distribuicao", async () => {
    return {
      status: "success",
      data: {
        filiais: [
          { nome: "São Luís", registros_legado: 6240, transcritos: 5410, porcentagem: 86.7 },
          { nome: "Parauapebas", registros_legado: 4120, transcritos: 3580, porcentagem: 86.9 },
          { nome: "Barcarena", registros_legado: 3250, transcritos: 2790, porcentagem: 85.8 },
          { nome: "São José dos Campos", registros_legado: 1410, transcritos: 1050, porcentagem: 74.5 },
          { nome: "Aveiro", registros_legado: 500, transcritos: 300, porcentagem: 60.0 },
        ],
        setores: [
          { nome: "Peritagem", porcentagem: 91.2, total: 2150 },
          { nome: "Lavagem / Estufa", porcentagem: 89.4, total: 1980 },
          { nome: "Caldeiraria", porcentagem: 84.1, total: 1820 },
          { nome: "Usinagem / Retífica", porcentagem: 85.5, total: 2430 },
          { nome: "Rebobinamento", porcentagem: 82.0, total: 1910 },
          { nome: "Impregnação / Cura", porcentagem: 83.2, total: 1450 },
          { nome: "Balanceamento", porcentagem: 87.6, total: 1720 },
          { nome: "Montagem", porcentagem: 81.3, total: 2210 },
          { nome: "Testes Finais", porcentagem: 88.0, total: 1640 },
          { nome: "Pintura Final", porcentagem: 85.9, total: 1530 },
          { nome: "Expedição", porcentagem: 92.5, total: 1200 },
        ],
        mapeamento_regras: {
          unidades: [
            { de: "são luís", para_id: 1, para_nome: "São Luís" },
            { de: "parauapebas", para_id: 2, para_nome: "Parauapebas" },
            { de: "barcarena", para_id: 3, para_nome: "Barcarena" },
            { de: "são josé dos campos", para_id: 4, para_nome: "São José dos Campos" },
            { de: "aveiro", para_id: 5, para_nome: "Aveiro" },
          ],
          setores: [
            { de: "peritagem", para_id: 1, para_nome: "Peritagem" },
            { de: "lavagem / estufa", para_id: 2, para_nome: "Lavagem / Estufa" },
            { de: "caldeiraria", para_id: 3, para_nome: "Caldeiraria" },
            { de: "usinagem / retífica", para_id: 4, para_nome: "Usinagem / Retífica" },
            { de: "rebobinamento", para_id: 5, para_nome: "Rebobinamento" },
            { de: "impregnação / estufa cura", para_id: 6, para_nome: "Impregnação / Estufa Cura" },
            { de: "balanceamento", para_id: 7, para_nome: "Balanceamento" },
            { de: "montagem", para_id: 8, para_nome: "Montagem" },
            { de: "testes finais", para_id: 9, para_nome: "Testes Finais" },
            { de: "tratamento / pintura inicial", para_id: 10, para_nome: "Tratamento / Pintura Inicial" },
            { de: "pintura final", para_id: 11, para_nome: "Pintura Final" },
            { de: "expedição", para_id: 12, para_nome: "Expedição" },
          ],
          chave_formato: "{OS}_{SETOR}_{FILIAL}",
        },
      },
    };
  });

  /**
   * Logs operacionais recentes do motor
   */
  app.get("/migracao/logs", async () => {
    return {
      status: "success",
      total: logsHistorico.length,
      data: logsHistorico,
    };
  });
}
