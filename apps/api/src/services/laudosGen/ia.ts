import { config } from "../../config.js";

/**
 * Geração de texto do Diagnóstico por IA (porte de Gerador_relatorios/backend/services/ia.js).
 *
 * O modelo do Dataverse guarda só o *provider* + o *prompt fixo*; a chave de
 * API vem do `.env` do Medro (decisão §2.3 do handoff). Provedores suportados:
 *  - gemini      → generativelanguage.googleapis.com (com fallback de modelo em 429)
 *  - groq        → api.groq.com (OpenAI-compatible)
 *  - openrouter  → openrouter.ai (OpenAI-compatible)
 */

export type IaProvider = "gemini" | "groq" | "openrouter";

export function iaProviderConfigurado(provider: string): provider is IaProvider {
  return keyFor(provider as IaProvider) != null;
}

function keyFor(provider: IaProvider): string | undefined {
  return {
    gemini: config.GEMINI_API_KEY,
    groq: config.GROQ_API_KEY,
    openrouter: config.OPENROUTER_API_KEY,
  }[provider];
}

// Fallback de modelo do Gemini: um 429 (cota) OU 404 (modelo aposentado) num
// modelo tenta o próximo. Ordem: recomendado atual primeiro, depois alternativas.
const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-2.5-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
];
const GROQ_MODEL = "llama-3.3-70b-versatile";
const OPENROUTER_MODEL = "google/gemini-2.0-flash-exp:free";

const COOLDOWN_MS = 2 * 60 * 1000;
const geminiCooldown: Record<string, number> = {};

type ChatArgs = {
  provider: IaProvider;
  systemPrompt: string;
  userInput: string;
  /** quando presente, força resposta JSON com estas chaves */
  jsonKeys?: string[];
};

async function chat({ provider, systemPrompt, userInput, jsonKeys }: ChatArgs): Promise<string> {
  const apiKey = keyFor(provider);
  if (!apiKey) throw new Error(`Provedor "${provider}" sem chave de API configurada no servidor.`);
  const sys = systemPrompt || "Você é um engenheiro redigindo laudos técnicos de motores elétricos.";
  if (provider === "gemini") return chatGemini(apiKey, sys, userInput, jsonKeys);
  return chatOpenAiCompat(
    provider === "groq" ? "https://api.groq.com/openai/v1/chat/completions" : "https://openrouter.ai/api/v1/chat/completions",
    provider === "groq" ? GROQ_MODEL : OPENROUTER_MODEL,
    apiKey,
    sys,
    userInput,
    jsonKeys,
  );
}

async function chatGemini(
  apiKey: string,
  systemPrompt: string,
  userInput: string,
  jsonKeys?: string[],
): Promise<string> {
  const body: Record<string, unknown> = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userInput }] }],
  };
  if (jsonKeys) {
    body.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: Object.fromEntries(jsonKeys.map((k) => [k, { type: "STRING" }])),
        required: jsonKeys,
      },
    };
  }
  const now = Date.now();
  let lastErr: Error | null = null;
  let tried = false;
  for (const model of GEMINI_MODELS) {
    if ((geminiCooldown[model] ?? 0) > now) continue;
    tried = true;
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(45_000),
      },
    );
    if (res.ok) {
      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const texto = (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("");
      if (!texto.trim()) throw new Error("A IA (Gemini) não retornou nenhum texto.");
      delete geminiCooldown[model];
      return texto.trim();
    }
    const txt = await res.text();
    // 429 = cota esgotada; 404 = modelo aposentado/indisponível — nos dois casos
    // o próximo modelo da lista pode funcionar. Outros erros (chave inválida,
    // prompt bloqueado) não melhoram trocando de modelo → propaga na hora.
    if (res.status === 429 || res.status === 404) {
      if (res.status === 429) geminiCooldown[model] = Date.now() + COOLDOWN_MS;
      lastErr = new Error(`Gemini (${model}) → ${res.status}: ${txt.slice(0, 160)}`);
      continue;
    }
    throw new Error(`Gemini (${model}) → ${res.status}: ${txt.slice(0, 300)}`);
  }
  if (!tried) throw new Error("Todos os modelos do Gemini estão em cooldown — tente em alguns minutos.");
  throw lastErr ?? new Error("Falha ao gerar texto com o Gemini.");
}

async function chatOpenAiCompat(
  url: string,
  model: string,
  apiKey: string,
  systemPrompt: string,
  userInput: string,
  jsonKeys?: string[],
): Promise<string> {
  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userInput },
    ],
  };
  if (jsonKeys) body.response_format = { type: "json_object" };
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(45_000),
  });
  if (!res.ok) throw new Error(`IA → ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const texto = data.choices?.[0]?.message?.content ?? "";
  if (!texto.trim()) throw new Error("A IA não retornou nenhum texto.");
  return texto.trim();
}

/** Um campo do Diagnóstico. */
export async function gerarTextoIA(args: {
  provider: string;
  systemPrompt: string;
  resumo: string;
  campoLabel: string;
}): Promise<string> {
  const provider = normalizeProvider(args.provider);
  return chat({
    provider,
    systemPrompt: args.systemPrompt,
    userInput: `Campo do laudo: ${args.campoLabel}\n\nResumo do técnico sobre o problema:\n${args.resumo}\n\nEscreva apenas o texto do campo, em português técnico, sem título e sem marcadores.`,
  });
}

/** Vários campos do Diagnóstico numa chamada só → { [key]: texto }. */
export async function gerarDiagnosticoLoteIA(args: {
  provider: string;
  systemPrompt: string;
  resumo: string;
  campos: { key: string; label: string }[];
}): Promise<Record<string, string>> {
  const provider = normalizeProvider(args.provider);
  const lista = args.campos.map((c) => `- "${c.key}": ${c.label}`).join("\n");
  const instrucao =
    `Resumo do técnico sobre o problema:\n${args.resumo}\n\n` +
    `Gere um objeto JSON com exatamente estas chaves, cada uma com o texto do respectivo campo do laudo técnico (português técnico, sem markdown):\n${lista}\n\n` +
    `Responda apenas com o JSON.`;
  const raw = await chat({
    provider,
    systemPrompt: args.systemPrompt,
    userInput: instrucao,
    jsonKeys: args.campos.map((c) => c.key),
  });
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/, ""));
  } catch {
    throw new Error("A IA não retornou um JSON válido.");
  }
  const out: Record<string, string> = {};
  for (const c of args.campos) {
    const v = obj[c.key];
    if (typeof v !== "string" || !v.trim()) throw new Error(`A IA não preencheu "${c.label}".`);
    out[c.key] = v.trim();
  }
  return out;
}

function normalizeProvider(p: string): IaProvider {
  const v = (p || "gemini").toLowerCase();
  if (v === "groq" || v === "openrouter") return v;
  return "gemini";
}
