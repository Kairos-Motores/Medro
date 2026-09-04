import { dataverse, getToken } from "../dataverse/client.js";

const API_BASE = dataverse.API_BASE;

/**
 * Consultas Dataverse do Gerador de Laudos (portado de Gerador_relatorios/backend).
 * Reutiliza o token/OAuth do cliente Dataverse do Medro.
 *
 * Tabelas:
 *  - cr4a1_zb6_relatorios          : dados da OS (vindos do ERP)
 *  - cr4a1_rascunhorelatorios      : rascunho do laudo (JSON) por OS + tipo
 *  - cr4a1_modelos_relatorioses    : álbum de modelos + config de IA
 *  - cr4a1_historico_gerador_relatorioses : histórico de PDFs gerados
 *  - cr4a1_balanceamentos          : dados de balanceamento (formato INI em texto)
 *  - cr4a1_peritagem_b04s          : resultado da peritagem por OS
 *  - cr4a1_peritagem_b01s          : catálogo de itens de peritagem
 */

export const MAPPING_FILIAIS: Record<string, string> = {
  "0101": "Barcarena",
  "0102": "São Luís",
  "0103": "Parauapebas",
  "0104": "São José dos Campos",
};

const esc = (v: string) => v.replace(/'/g, "''");

/** GET raw com annotations formatadas (para a OS, que depende dos FormattedValue). */
async function getWithFormattedValues(pathAndQuery: string): Promise<Record<string, unknown>[]> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}${pathAndQuery}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      Prefer: 'odata.include-annotations="*"',
    },
  });
  if (!res.ok) throw new Error(`Dataverse GET ${pathAndQuery} → ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { value?: Record<string, unknown>[] };
  return json.value ?? [];
}

/** Achata { campo, campo@...FormattedValue } → usa o valor formatado quando existe. */
function flattenFormatted(raw: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(raw)) {
    if (key.includes("@")) continue;
    const fmt = raw[`${key}@OData.Community.Display.V1.FormattedValue`];
    out[key] = fmt ?? raw[key];
  }
  return out;
}

export type OsDados = Record<string, unknown> & { unidade_nome: string };

export async function buscarOs(osId: string): Promise<OsDados> {
  const id = osId.trim();
  const rows = await getWithFormattedValues(
    `/cr4a1_zb6_relatorios?$filter=cr4a1_novacoluna eq '${esc(id)}'`,
  );
  if (rows.length === 0) throw Object.assign(new Error(`A OS ${id} não existe no sistema.`), { status: 404 });
  const dados = flattenFormatted(rows[0]!);
  const codigoFilial = String(dados["cr4a1_zb6_filial"] ?? "");
  return { ...dados, unidade_nome: MAPPING_FILIAIS[codigoFilial] ?? "Unidade Geral" };
}

// ── rascunho ────────────────────────────────────────────────────────────────
const RASCUNHO_SET = "cr4a1_rascunhorelatorios";

export async function getRascunho(osId: string, tipo = "padrao"): Promise<unknown | null> {
  const { value } = await dataverse.list<{ cr4a1_conteudojson: string }>(RASCUNHO_SET, {
    filter: `cr4a1_osid eq '${esc(osId)}' and cr4a1_tipo eq '${esc(tipo)}'`,
    select: ["cr4a1_conteudojson"],
    top: 1,
  });
  if (!value[0]?.cr4a1_conteudojson) return null;
  try {
    return JSON.parse(value[0].cr4a1_conteudojson);
  } catch {
    return null;
  }
}

export type RascunhoResumo = {
  osId: string;
  tipo: string;
  atualizadoEm: string | null;
};

/** Lista os rascunhos existentes (para "continuar de onde parou"). */
export async function listarRascunhos(top = 50): Promise<RascunhoResumo[]> {
  const { value } = await dataverse.list<Record<string, string>>(RASCUNHO_SET, {
    select: ["cr4a1_osid", "cr4a1_tipo", "modifiedon"],
    orderby: "modifiedon desc",
    top,
  });
  return value.map((r) => ({
    osId: r.cr4a1_osid ?? "",
    tipo: r.cr4a1_tipo ?? "padrao",
    atualizadoEm: r.modifiedon ?? null,
  }));
}

/** Remove o rascunho de uma OS (a "pasta" de laudos em andamento). */
export async function excluirRascunho(osId: string, tipo = "padrao"): Promise<void> {
  const { value } = await dataverse.list<{ cr4a1_rascunhorelatorioid: string }>(RASCUNHO_SET, {
    filter: `cr4a1_osid eq '${esc(osId)}' and cr4a1_tipo eq '${esc(tipo)}'`,
    select: ["cr4a1_rascunhorelatorioid"],
    top: 1,
  });
  if (value[0]) await dataverse.remove(RASCUNHO_SET, value[0].cr4a1_rascunhorelatorioid);
}

export async function salvarRascunho(osId: string, state: unknown, tipo = "padrao"): Promise<void> {
  const conteudo = JSON.stringify(state);
  const { value } = await dataverse.list<{ cr4a1_rascunhorelatorioid: string }>(RASCUNHO_SET, {
    filter: `cr4a1_osid eq '${esc(osId)}' and cr4a1_tipo eq '${esc(tipo)}'`,
    select: ["cr4a1_rascunhorelatorioid"],
    top: 1,
  });
  if (value[0]) {
    await dataverse.update(RASCUNHO_SET, value[0].cr4a1_rascunhorelatorioid, {
      cr4a1_conteudojson: conteudo,
    });
  } else {
    await dataverse.create(RASCUNHO_SET, {
      cr4a1_chave: `${osId} - ${tipo}`,
      cr4a1_osid: osId,
      cr4a1_tipo: tipo,
      cr4a1_conteudojson: conteudo,
    });
  }
}

// ── modelos / álbum ─────────────────────────────────────────────────────────
const MODELOS_SET = "cr4a1_modelos_relatorioses";

export type ModeloRow = {
  cr4a1_modelos_relatoriosid: string;
  cr4a1_nome_modelo: string;
  cr4a1_configuracao_json: string;
  cr4a1_ia_provider?: string | null;
  modifiedon?: string;
};

export type ModeloDetalhe = ModeloRow & { cr4a1_ia_prompt: string | null };

const MODELO_SELECT = [
  "cr4a1_modelos_relatoriosid",
  "cr4a1_nome_modelo",
  "cr4a1_configuracao_json",
  "cr4a1_ia_provider",
  "modifiedon",
];

export async function listarModelos(): Promise<ModeloRow[]> {
  const { value } = await dataverse.list<ModeloRow>(MODELOS_SET, {
    select: MODELO_SELECT,
    orderby: "modifiedon desc",
    top: 200,
  });
  return value;
}

/** Um modelo por id — inclui o prompt de IA (o gerenciador/construtor precisa dele). */
export async function getModelo(id: string): Promise<ModeloDetalhe> {
  return dataverse.get<ModeloDetalhe>(MODELOS_SET, id, {
    select: [...MODELO_SELECT, "cr4a1_ia_prompt"],
  });
}

export async function criarModelo(nome: string, configuracaoJson: string): Promise<{ id: string }> {
  const row = await dataverse.create<{ cr4a1_modelos_relatoriosid: string }>(MODELOS_SET, {
    cr4a1_nome_modelo: nome,
    cr4a1_configuracao_json: configuracaoJson,
  });
  return { id: row.cr4a1_modelos_relatoriosid };
}

export async function atualizarModelo(
  id: string,
  patch: { nome?: string; configuracaoJson?: string },
): Promise<void> {
  const body: Record<string, string> = {};
  if (patch.nome !== undefined) body.cr4a1_nome_modelo = patch.nome;
  if (patch.configuracaoJson !== undefined) body.cr4a1_configuracao_json = patch.configuracaoJson;
  if (Object.keys(body).length) await dataverse.update(MODELOS_SET, id, body);
}

export async function excluirModelo(id: string): Promise<void> {
  await dataverse.remove(MODELOS_SET, id);
}

// ── capas customizadas (arquivo no Dataverse: cr4a1_caparelatorios) ──────────
const CAPAS_SET = "cr4a1_caparelatorios";

/** Cria a linha da capa e grava o binário na coluna de arquivo. Devolve o id. */
export async function salvarCapa(buffer: Buffer, nomeArquivo: string): Promise<{ id: string }> {
  const row = await dataverse.create<{ cr4a1_caparelatorioid: string }>(CAPAS_SET, {
    cr4a1_chave: nomeArquivo,
  });
  const id = row.cr4a1_caparelatorioid;
  const token = await getToken();
  const res = await fetch(`${API_BASE}/${CAPAS_SET}(${id})/cr4a1_arquivo`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/octet-stream",
      "x-ms-file-name": nomeArquivo,
    },
    body: buffer,
  });
  if (!res.ok) {
    // limpa a linha órfã se o upload do binário falhar
    await dataverse.remove(CAPAS_SET, id).catch(() => {});
    throw new Error(`Dataverse upload capa → ${res.status}: ${await res.text()}`);
  }
  return { id };
}

/** Lê o binário de uma capa customizada (proxy — o front não tem credenciais). */
export async function lerCapa(
  id: string,
): Promise<{ body: ArrayBuffer; contentType: string } | null> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/${CAPAS_SET}(${id})/cr4a1_arquivo/$value`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
  });
  // id inexistente/malformado → 400/404 no Dataverse; para um `<img>` vale só 404
  if (!res.ok) return null;
  // o $value do Dataverse costuma vir como application/octet-stream — o browser
  // faz sniff no `<img>`, mas mandamos image/* quando dá pra inferir do nome.
  const ct = res.headers.get("content-type") || "";
  const disp = res.headers.get("content-disposition") || "";
  const ext = disp.match(/\.([a-z0-9]+)"?\s*$/i)?.[1]?.toLowerCase();
  const byExt: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };
  return {
    body: await res.arrayBuffer(),
    contentType: ct.startsWith("image/") ? ct : byExt[ext ?? ""] ?? "image/png",
  };
}

/** prompt + provider do modelo (sem máscara) — a chave vem do .env do Medro. */
export async function getModeloIa(id: string): Promise<{ prompt: string; provider: string }> {
  const row = await dataverse.get<Record<string, string | null>>(MODELOS_SET, id, {
    select: ["cr4a1_ia_prompt", "cr4a1_ia_provider"],
  });
  return {
    prompt: row.cr4a1_ia_prompt ?? "",
    provider: row.cr4a1_ia_provider ?? "gemini",
  };
}

export async function getModeloIaConfig(
  id: string,
): Promise<{ prompt: string; provider: string; apiKeyPreview: string | null }> {
  const row = await dataverse.get<Record<string, string | null>>(MODELOS_SET, id, {
    select: ["cr4a1_ia_prompt", "cr4a1_ia_provider", "cr4a1_ia_api_key"],
  });
  const key = row.cr4a1_ia_api_key ?? "";
  return {
    prompt: row.cr4a1_ia_prompt ?? "",
    provider: row.cr4a1_ia_provider ?? "gemini",
    apiKeyPreview: key ? `••••${key.slice(-4)}` : null,
  };
}

export async function setModeloIaConfig(
  id: string,
  patch: { prompt?: string; provider?: string; apiKey?: string },
): Promise<void> {
  const body: Record<string, string> = {};
  if (patch.prompt !== undefined) body.cr4a1_ia_prompt = patch.prompt;
  if (patch.provider !== undefined) body.cr4a1_ia_provider = patch.provider;
  if (patch.apiKey) body.cr4a1_ia_api_key = patch.apiKey; // vazio = manter atual
  if (Object.keys(body).length) await dataverse.update(MODELOS_SET, id, body);
}

// ── histórico de PDFs ───────────────────────────────────────────────────────
const HISTORICO_SET = "cr4a1_historico_gerador_relatorioses";

export async function registrarHistoricoPdf(input: {
  usuario: string;
  os: string;
  cliente: string;
}): Promise<void> {
  await dataverse.create(HISTORICO_SET, {
    cr4a1_usuario: input.usuario || "Usuário não identificado",
    cr4a1_os: input.os,
    cr4a1_cliente: input.cliente,
    cr4a1_adicionado_em: new Date().toISOString(),
  });
}

export async function listarHistoricoPdf(): Promise<Record<string, unknown>[]> {
  const { value } = await dataverse.list(HISTORICO_SET, {
    select: ["cr4a1_usuario", "cr4a1_os", "cr4a1_cliente", "cr4a1_adicionado_em"],
    orderby: "cr4a1_adicionado_em desc",
    top: 50,
  });
  return value;
}

// ── balanceamento (texto INI) ───────────────────────────────────────────────
export async function getBalanceamento(osId: string): Promise<
  { encontrado: false } | { encontrado: true; dados: Record<string, Record<string, string>> }
> {
  const { value } = await dataverse.list<{ cr4a1_conteudo_baldados: string }>("cr4a1_balanceamentos", {
    filter: `cr4a1_os eq '${esc(osId)}'`,
    select: ["cr4a1_os", "cr4a1_conteudo_baldados"],
    top: 1,
  });
  const raw = value[0]?.cr4a1_conteudo_baldados;
  if (!raw) return { encontrado: false };

  const result: Record<string, Record<string, string>> = {};
  let sec: string | null = null;
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    if (t.startsWith("[") && t.endsWith("]")) {
      sec = t.slice(1, -1);
      result[sec] = {};
    } else if (sec) {
      const i = t.indexOf("=");
      if (i !== -1) result[sec]![t.slice(0, i).trim()] = t.slice(i + 1).trim();
    }
  }
  return { encontrado: true, dados: result };
}

// ── peritagem ───────────────────────────────────────────────────────────────
export async function getPeritagemPorOs(osId: string): Promise<
  { descricao: string; observacao: string; varQuant: string }[]
> {
  const { value } = await dataverse.list<Record<string, string>>("cr4a1_peritagem_b04s", {
    filter: `cr4a1_os eq '${esc(osId.trim())}'`,
    select: ["cr4a1_descricao", "cr4a1_observacao", "cr4a1_var_quant"],
    top: 500,
  });
  return value.map((r) => ({
    descricao: r.cr4a1_descricao ?? "",
    observacao: r.cr4a1_observacao ?? "",
    varQuant: r.cr4a1_var_quant ?? "",
  }));
}

// ── histórico de serviços por ano (para o gráfico do laudo) ──────────────────
export async function getHistoricoServicos(tag: string): Promise<
  { ano: number; REBOBINAMENTO: number; REJUVENESCIMENTO: number; OUTROS: number }[]
> {
  const rows = await getWithFormattedValues(
    `/cr4a1_zb6_relatorios?$filter=contains(cr4a1_tag_kairos, '${esc(tag)}')&$select=cr4a1_data_rec,cr4a1_zb6_servico`,
  );
  const porAno: Record<number, { ano: number; REBOBINAMENTO: number; REJUVENESCIMENTO: number; OUTROS: number }> = {};
  for (const reg of rows) {
    const dataRaw = String(reg["cr4a1_data_rec"] ?? "");
    if (!dataRaw || dataRaw === "undefined") continue;
    const ano = parseInt(dataRaw.substring(0, 4), 10);
    if (Number.isNaN(ano)) continue;
    let servico = String(
      reg["cr4a1_zb6_servico@OData.Community.Display.V1.FormattedValue"] ?? reg["cr4a1_zb6_servico"] ?? "",
    )
      .toUpperCase()
      .trim()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
    porAno[ano] ??= { ano, REBOBINAMENTO: 0, REJUVENESCIMENTO: 0, OUTROS: 0 };
    if (servico.includes("REBOBIN") || servico.includes("BOBINAGEM")) porAno[ano]!.REBOBINAMENTO++;
    else if (servico.includes("REJUVEN") || servico.includes("JUVENESC")) porAno[ano]!.REJUVENESCIMENTO++;
    else porAno[ano]!.OUTROS++;
  }
  return Object.values(porAno).sort((a, b) => a.ano - b.ano);
}
