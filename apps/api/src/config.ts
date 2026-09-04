import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv();

const bool = z
  .string()
  .transform((v) => v === "true" || v === "1")
  .pipe(z.boolean());

const Schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3333),
  WEB_ORIGIN: z.string().default("http://localhost:5173,http://localhost:5174"),
  JWT_SECRET: z.string().min(16, "defina JWT_SECRET (>=16 chars) no .env"),
  JWT_EXPIRES_IN: z.string().default("8h"),

  DATAVERSE_TENANT_ID: z.string().uuid(),
  DATAVERSE_CLIENT_ID: z.string().uuid(),
  DATAVERSE_CLIENT_SECRET: z.string().min(1, "defina DATAVERSE_CLIENT_SECRET no .env"),
  DATAVERSE_ENV_URL: z.string().url(),
  DATAVERSE_RESOURCE: z.string().url(),
  DATAVERSE_API_VERSION: z.string().default("9.2"),

  GRAPH_ENABLED: bool.default("false"),
  GRAPH_TENANT_ID: z.string().optional(),
  GRAPH_CLIENT_ID: z.string().optional(),
  GRAPH_CLIENT_SECRET: z.string().optional(),
  SHAREPOINT_SITE_KAIROS: z.string().url().optional(),
  SHAREPOINT_SITE_LISTAS: z.string().url().optional(),

  PROTHEUS_ENABLED: bool.default("false"),
  PROTHEUS_SQL_HOST: z.string().optional(),
  PROTHEUS_SQL_PORT: z.coerce.number().optional(),
  PROTHEUS_SQL_DB: z.string().optional(),
  PROTHEUS_SQL_USER: z.string().optional(),
  PROTHEUS_SQL_PASSWORD: z.string().optional(),
  PROTHEUS_SQL_ENCRYPT: bool.default("false"),

  // ── Gerador de Laudos: bundle de impressão + worker de PDF ──
  REPORT_PRINT_URL: z.string().url().default("http://localhost:5180"),
  PDF_WORKER_URL: z.string().url().default("http://localhost:8100"),
  PDF_WORKER_TOKEN: z.string().default(""),
  /**
   * URL pública desta API (ex.: https://medro-api.onrender.com). Usada para
   * montar o link absoluto da capa customizada (`<img src>` lido pelo
   * report-print). Em dev cai no host da requisição; em produção (atrás do
   * proxy do Render) defina explicitamente.
   */
  PUBLIC_API_URL: z.string().url().optional(),
  // provedores de IA do diagnóstico (opcionais nesta fase)
  GEMINI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
});

const parsed = Schema.safeParse(process.env);
if (!parsed.success) {
  console.error(
    "❌ Configuração inválida (apps/api/.env):\n" +
      parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n"),
  );
  process.exit(1);
}

export const config = parsed.data;
export type Config = typeof config;
export const isProd = config.NODE_ENV === "production";
