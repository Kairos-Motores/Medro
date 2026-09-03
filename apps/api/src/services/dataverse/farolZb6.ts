import { dataverse } from "./client.js";

export interface RawOSRow {
  "OS Kairos": string;
  Filial: string;
  "Nome Cliente": string;
  Equipamento: string;
  Carcaca: string;
  Tensao: string;
  CV: string;
  KW: string;
  "Dt Recebimento": string;
  "DT Autoriza": string;
  "Prazo Contra": string;
  "Dt Entreg Eq": string;
  "Desc Servico": string;
  "TAG Kairos": string;
}

// Cache em memória para evitar requisições redundantes ao Dataverse
let cachedFarolData: { data: RawOSRow[]; ts: number } | null = null;
const CACHE_TTL_MS = 60_000; // 1 minuto

/**
 * Normaliza o código ou texto da Filial para o nome padrão utilizado no Medro Pro
 */
export function mapFilial(val: unknown): string {
  if (!val) return "São Luís";
  const s = String(val).trim();
  const lower = s.toLowerCase();

  if (s === "0101" || s === "01" || lower.includes("barcarena")) return "Barcarena";
  if (s === "0102" || s === "02" || lower.includes("luis") || lower.includes("luís")) return "São Luís";
  if (s === "0103" || s === "03" || lower.includes("parauapebas")) return "Parauapebas";
  if (s === "0104" || s === "04" || lower.includes("jose") || lower.includes("josé")) return "São José dos Campos";
  if (s === "0105" || s === "05" || lower.includes("aveiro")) return "Aveiro";

  return s;
}

/**
 * Converte datas do padrão Protheus (YYYYMMDD) ou ISO para DD/MM/AAAA
 */
export function formatDataProtheus(val: unknown): string {
  if (!val) return "";
  const s = String(val).trim();
  if (!s || s === "null" || s === "undefined") return "";

  // Formato YYYYMMDD (8 dígitos puros)
  if (/^\d{8}$/.test(s)) {
    const y = s.substring(0, 4);
    const m = s.substring(4, 6);
    const d = s.substring(6, 8);
    return `${d}/${m}/${y}`;
  }

  // Formato ISO ou YYYY-MM-DD
  if (s.includes("-")) {
    const parts = s.split("T")[0]?.split("-");
    if (parts && parts.length === 3 && parts[0]?.length === 4) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  // Já formatado DD/MM/AAAA
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    return s;
  }

  return s;
}

/**
 * Consulta a tabela oficial cr4a1_zb6_relatorios no Dataverse e enriquece os dados para o Farol de OS.
 */
export async function fetchFarolOSFromDataverse(options?: {
  forceRefresh?: boolean;
  top?: number;
}): Promise<RawOSRow[]> {
  const now = Date.now();
  if (!options?.forceRefresh && cachedFarolData && now - cachedFarolData.ts < CACHE_TTL_MS) {
    return cachedFarolData.data;
  }

  const limit = options?.top || 1000;

  const res = await dataverse.list<Record<string, unknown>>("cr4a1_zb6_relatorios", {
    select: [
      "cr4a1_novacoluna",
      "cr4a1_zb6_filial",
      "cr4a1_cliente_nome",
      "cr4a1_eq_descricao",
      "cr4a1_zb6_equipa",
      "cr4a1_eq_carcaca",
      "cr4a1_eq_potencia_cv",
      "cr4a1_eq_tensao",
      "cr4a1_zb6_kw",
      "cr4a1_data_rec",
      "cr4a1_zb6_dtauto",
      "cr4a1_zb6_prazc",
      "cr4a1_zb6_prazo",
      "cr4a1_zb6_dtentr",
      "cr4a1_zb6_servico",
      "cr4a1_tag_kairos",
      "cr4a1_zb6_dtpven",
      "cr4a1_r_e_c_d_e_l_",
      "modifiedon",
    ],
    orderby: "modifiedon desc",
    top: limit,
  });

  const rawRows: RawOSRow[] = [];

  for (const item of res.value) {
    // Ignora registros marcados como deletados no Protheus / Dataverse
    const recdel = String(item.cr4a1_r_e_c_d_e_l_ ?? "").trim();
    if (recdel === "1" || recdel === "*") continue;

    const os = String(item.cr4a1_novacoluna ?? item.cr4a1_zb6_oskair ?? "").trim();
    if (!os) continue;

    const descServico = String(item.cr4a1_zb6_servico ?? "").trim();
    const tagKairos = String(item.cr4a1_tag_kairos ?? "").trim();

    // Filtros de exclusão para Venda Direta / Balcão
    const osUpper = os.toUpperCase();
    const servUpper = descServico.toUpperCase();
    const tagUpper = tagKairos.toUpperCase();
    if (
      osUpper.startsWith("VD") ||
      servUpper.includes("VENDA DIRETA") ||
      servUpper.startsWith("VD ") ||
      tagUpper.includes("VD")
    ) {
      continue;
    }

    const filial = mapFilial(item.cr4a1_zb6_filial);
    const cliente = String(item.cr4a1_cliente_nome ?? "").trim();
    const equipamento = String(item.cr4a1_eq_descricao ?? item.cr4a1_zb6_equipa ?? "").trim();
    const carcaca = String(item.cr4a1_eq_carcaca ?? "").trim();
    const tensao = String(item.cr4a1_eq_tensao ?? "").trim();

    // Potência
    const cvRaw = String(item.cr4a1_eq_potencia_cv ?? "").trim();
    const cv = cvRaw ? cvRaw.replace(/cv/gi, "").trim() : "";

    const kwRaw = String(item.cr4a1_zb6_kw ?? "").trim();
    const kw = kwRaw ? kwRaw.replace(/kw/gi, "").trim() : "";

    // Datas
    const dtRecebimento = formatDataProtheus(item.cr4a1_data_rec);
    const dtAutoriza = formatDataProtheus(item.cr4a1_zb6_dtauto);
    const dtEntregEq = formatDataProtheus(item.cr4a1_zb6_dtentr);

    // Prazo
    const prazo = String(item.cr4a1_zb6_prazc ?? item.cr4a1_zb6_prazo ?? "").trim();

    rawRows.push({
      "OS Kairos": os,
      Filial: filial,
      "Nome Cliente": cliente,
      Equipamento: equipamento,
      Carcaca: carcaca,
      Tensao: tensao,
      CV: cv,
      KW: kw,
      "Dt Recebimento": dtRecebimento,
      "DT Autoriza": dtAutoriza,
      "Prazo Contra": prazo,
      "Dt Entreg Eq": dtEntregEq,
      "Desc Servico": descServico,
      "TAG Kairos": tagKairos,
    });
  }

  cachedFarolData = { data: rawRows, ts: now };
  return rawRows;
}
