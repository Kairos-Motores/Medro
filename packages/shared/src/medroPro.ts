/**
 * Definições e tipos do ecossistema Medro Pro (APS Engine / Torre de Controle).
 */

export enum UnidadeOption {
  SaoLuis = 1,
  Parauapebas = 2,
  Barcarena = 3,
  SaoJoseDosCampos = 4,
  Aveiro = 5,
}

export const UNIDADES_NOMES: Record<number, string> = {
  [UnidadeOption.SaoLuis]: "São Luís",
  [UnidadeOption.Parauapebas]: "Parauapebas",
  [UnidadeOption.Barcarena]: "Barcarena",
  [UnidadeOption.SaoJoseDosCampos]: "São José dos Campos",
  [UnidadeOption.Aveiro]: "Aveiro",
};

export enum TipoTensaoOption {
  BT = 1,
  AT = 2,
}

export enum PorteMotorOption {
  BTPequeno = 1, // 63-112
  BTMedioPequeno = 2, // 132-180
  BTMedio = 3, // 200-250
  BTGrande = 4, // 280-355
  BTExtraGrande = 5, // 400-450
  ATMediaAlta = 6, // 315-450
  ATPesada = 7, // 500-710
}

export enum StatusGeralOption {
  AguardandoPeritagem = 1,
  AguardandoAprovacao = 2,
  AprovadoEmProcesso = 3,
  AprovadoAguardandoPecas = 4,
  Finalizado = 5,
  Cancelado = 6,
}

export enum SetorOption {
  Peritagem = 1,
  LavagemEstufa = 2,
  Caldeiraria = 3,
  UsinagemRetifica = 4,
  Rebobinamento = 5,
  ImpregnacaoEstufaCura = 6,
  Balanceamento = 7,
  Montagem = 8,
  TestesFinais = 9,
  TratamentoPinturaInicial = 10,
  PinturaFinal = 11,
  Expedicao = 12,
}

export enum StatusEventoOption {
  Aberto = 1,
  Fechado = 2,
  Pausado = 3,
}

export interface MedroProOS {
  cr4a1_medropro_osid: string;
  cr4a1_numero_os: string;
  cr4a1_cliente?: string | null;
  cr4a1_unidade?: number | null;
  cr4a1_carcaca_orig?: string | null;
  cr4a1_carcaca_equiv?: string | null;
  cr4a1_tipo_tensao?: number | null;
  cr4a1_porte_motor?: number | null;
  cr4a1_prazo_contratual?: string | null;
  cr4a1_status_geral?: number | null;
  cr4a1_is_emergencia?: boolean | null;
  cr4a1_ramos_obrigatorios?: string | null;
}

export interface MedroProApontamento {
  cr4a1_medropro_apontamentoid: string;
  cr4a1_chave_integracao: string;
  _cr4a1_os_id_value?: string | null;
  cr4a1_numero_os?: string | null;
  cr4a1_setor?: number | null;
  cr4a1_status_evento?: number | null;
  cr4a1_data_inicio?: string | null;
  cr4a1_data_fim?: string | null;
  cr4a1_matricula_operador?: string | null;
  cr4a1_nome_operador?: string | null;
  cr4a1_duracao_minutos?: number | null;
  cr4a1_is_hora_extra?: boolean | null;
  cr4a1_observacao?: string | null;
}

export interface FilialKPI {
  os_na_filial: number;
  os_aprovadas: number;
  os_dentro_prazo: number;
  os_fora_prazo: number;
}

export type FiliaisKPIsMap = Record<string, FilialKPI>;

/**
 * Critérios do Protheus (tabela ZB6) extraídos do engine zb6_criteria.py do Medro Pro.
 */
export function critOsNaFilial(row: Record<string, unknown>): boolean {
  const dtEntrega = String(row["Dt Entreg Eq"] ?? row["ZB6_DTENTR"] ?? "").trim();
  return dtEntrega === "";
}

export function critOsAprovadas(row: Record<string, unknown>): boolean {
  const dtEntrega = String(row["Dt Entreg Eq"] ?? row["ZB6_DTENTR"] ?? "").trim();
  const dtAutoriza = String(row["DT Autoriza"] ?? row["ZB6_DTAUTO"] ?? "").trim();
  return dtEntrega === "" && dtAutoriza !== "";
}

export function parseDatePtBr(dateStr: string): Date | null {
  const clean = dateStr.trim();
  if (!clean) return null;
  // Formato DD/MM/YYYY
  const parts = clean.split("/");
  if (parts.length === 3) {
    const d = parseInt(parts[0]!, 10);
    const m = parseInt(parts[1]!, 10) - 1;
    const y = parseInt(parts[2]!, 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
      return new Date(y, m, d);
    }
  }
  // Fallback ISO
  const iso = new Date(clean);
  return isNaN(iso.getTime()) ? null : iso;
}

export function critOsDentroPrazo(row: Record<string, unknown>, referenceDate: Date = new Date()): boolean {
  if (!critOsAprovadas(row)) return false;

  const dtAutorizaStr = String(row["DT Autoriza"] ?? row["ZB6_DTAUTO"] ?? "").trim();
  const prazoContraStr = String(row["Prazo Contra"] ?? row["ZB6_PRAZO"] ?? "").trim();

  if (!dtAutorizaStr || !prazoContraStr) return false;

  const prazoDias = parseFloat(prazoContraStr);
  if (isNaN(prazoDias)) return false;

  const dtAutoriza = parseDatePtBr(dtAutorizaStr);
  if (!dtAutoriza) return false;

  const dtLimite = new Date(dtAutoriza.getTime() + prazoDias * 86400000);
  const hoje = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

  return dtLimite.getTime() >= hoje.getTime();
}

export function critOsForaPrazo(row: Record<string, unknown>, referenceDate: Date = new Date()): boolean {
  if (!critOsAprovadas(row)) return false;

  const dtAutorizaStr = String(row["DT Autoriza"] ?? row["ZB6_DTAUTO"] ?? "").trim();
  const prazoContraStr = String(row["Prazo Contra"] ?? row["ZB6_PRAZO"] ?? "").trim();

  if (!dtAutorizaStr || !prazoContraStr) return false;

  const prazoDias = parseFloat(prazoContraStr);
  if (isNaN(prazoDias)) return false;

  const dtAutoriza = parseDatePtBr(dtAutorizaStr);
  if (!dtAutoriza) return false;

  const dtLimite = new Date(dtAutoriza.getTime() + prazoDias * 86400000);
  const hoje = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

  return dtLimite.getTime() < hoje.getTime();
}

/**
 * Processa registros e agrupa os cálculos por Filial.
 */
export function calculateFiliaisKpis(data: Array<Record<string, unknown>>, referenceDate: Date = new Date()): FiliaisKPIsMap {
  const resultados: FiliaisKPIsMap = {};

  for (const row of data) {
    const osKairos = String(row["OS Kairos"] ?? row["ZB6_OSKAIR"] ?? "").toUpperCase();
    const descServico = String(row["Desc Servico"] ?? row["ZB6_DESCNF"] ?? "").toUpperCase();
    const tagKairos = String(row["TAG Kairos"] ?? row["ZB6_TAG"] ?? "").toUpperCase();

    // Filtros globais para ignorar vendas e semelhantes
    if (osKairos.includes("VENDA") || descServico.includes("VENDA DIRETA") || tagKairos.includes("VD")) {
      continue;
    }

    const filial = String(row["Filial"] ?? row["ZB6_FILIAL"] ?? "Desconhecida").trim();
    if (!resultados[filial]) {
      resultados[filial] = {
        os_na_filial: 0,
        os_aprovadas: 0,
        os_dentro_prazo: 0,
        os_fora_prazo: 0,
      };
    }

    const stats = resultados[filial]!;
    if (critOsNaFilial(row)) stats.os_na_filial++;
    if (critOsAprovadas(row)) stats.os_aprovadas++;
    if (critOsDentroPrazo(row, referenceDate)) stats.os_dentro_prazo++;
    if (critOsForaPrazo(row, referenceDate)) stats.os_fora_prazo++;
  }

  return resultados;
}
