import { dataverse } from "./client.js";
import { fetchFarolOSFromDataverse } from "./farolZb6.js";

export interface CarcacaDepara {
  cr4a1_depara_carcacasid: string;
  cr4a1_name: string;
  cr4a1_carcaca_equivalente: string;
}

const ENTITY_SET = "cr4a1_depara_carcacases";

/**
 * Busca os dados da tabela cr4a1_depara_carcacases no Dataverse
 * e mescla com os valores únicos de carcaças existentes na base ZB6 do Farol de OS.
 */
export async function buscarCarcacasDepara(): Promise<CarcacaDepara[]> {
  // 1. Busca todos os registros mapeados no Dataverse
  let dvRecords: CarcacaDepara[] = [];
  try {
    const raw = await dataverse.listAll<Record<string, unknown>>(ENTITY_SET, {
      select: ["cr4a1_depara_carcacasid", "cr4a1_name", "cr4a1_carcaca_equivalente"],
      maxPageSize: 5000,
    });
    dvRecords = raw.map((r) => ({
      cr4a1_depara_carcacasid: String(r.cr4a1_depara_carcacasid ?? "").trim(),
      cr4a1_name: String(r.cr4a1_name ?? "").trim(),
      cr4a1_carcaca_equivalente: String(r.cr4a1_carcaca_equivalente ?? "").trim(),
    }));
  } catch (err: any) {
    console.error("Erro ao consultar cr4a1_depara_carcacases no Dataverse:", err.message);
  }

  const dvMap = new Map<string, CarcacaDepara>();
  for (const r of dvRecords) {
    if (r.cr4a1_name) {
      dvMap.set(r.cr4a1_name.toUpperCase(), r);
    }
  }

  // 2. Extrai carcaças únicas da base ZB6
  const zb6Carcacas = new Set<string>();
  try {
    const zb6Rows = await fetchFarolOSFromDataverse();
    for (const r of zb6Rows) {
      const c = (r.Carcaca || "").trim();
      if (c && c !== "-") {
        zb6Carcacas.add(c);
      }
    }
  } catch (err: any) {
    console.error("Erro ao extrair carcaças da base ZB6:", err.message);
  }

  // 3. Mescla mantendo prioridade das mapeadas e adicionando as não mapeadas de ZB6
  const resultados: CarcacaDepara[] = [];
  const processados = new Set<string>();

  for (const carc of Array.from(zb6Carcacas).sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }))) {
    const upper = carc.toUpperCase();
    processados.add(upper);
    if (dvMap.has(upper)) {
      resultados.push(dvMap.get(upper)!);
    } else {
      resultados.push({
        cr4a1_depara_carcacasid: "",
        cr4a1_name: carc,
        cr4a1_carcaca_equivalente: "",
      });
    }
  }

  // Adiciona carcaças do Dataverse que não apareceram nas OSs ativas de ZB6
  for (const [key, record] of dvMap.entries()) {
    if (!processados.has(key)) {
      resultados.push(record);
    }
  }

  return resultados;
}

export async function atualizarCarcacasDepara(
  updates: Array<{
    cr4a1_depara_carcacasid?: string;
    cr4a1_name: string;
    cr4a1_carcaca_equivalente: string;
  }>,
): Promise<void> {
  for (const item of updates) {
    const id = (item.cr4a1_depara_carcacasid || "").trim();
    const nome = (item.cr4a1_name || "").trim();
    const equiv = (item.cr4a1_carcaca_equivalente || "").trim();

    if (id) {
      await dataverse.update(ENTITY_SET, id, {
        cr4a1_carcaca_equivalente: equiv,
      });
    } else if (nome) {
      await dataverse.create(ENTITY_SET, {
        cr4a1_name: nome,
        cr4a1_carcaca_equivalente: equiv,
      });
    }
  }
}

export async function criarCarcacaDepara(
  original: string,
  equivalente: string,
): Promise<CarcacaDepara> {
  const created = await dataverse.create<Record<string, unknown>>(ENTITY_SET, {
    cr4a1_name: original.trim(),
    cr4a1_carcaca_equivalente: equivalente.trim(),
  });
  return {
    cr4a1_depara_carcacasid: String(created.cr4a1_depara_carcacasid ?? ""),
    cr4a1_name: String(created.cr4a1_name ?? original),
    cr4a1_carcaca_equivalente: String(created.cr4a1_carcaca_equivalente ?? equivalente),
  };
}
