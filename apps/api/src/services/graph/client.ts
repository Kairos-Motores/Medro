import { config } from "../../config.js";

/**
 * Cliente Microsoft Graph (client-credentials). Usado para acessar o SharePoint
 * (bibliotecas "Doc Tcnicos") — laudos PDF, links de compartilhamento.
 *
 * Reusa a app registration do Dataverse se as vars GRAPH_* não forem definidas.
 * Requer permissão de aplicativo: Sites.Read.All (ou Sites.Selected) + Files.Read.All.
 */

const TENANT = config.GRAPH_TENANT_ID || config.DATAVERSE_TENANT_ID;
const CLIENT_ID = config.GRAPH_CLIENT_ID || config.DATAVERSE_CLIENT_ID;
const CLIENT_SECRET = config.GRAPH_CLIENT_SECRET || config.DATAVERSE_CLIENT_SECRET;
const TOKEN_URL = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`;
const BASE = "https://graph.microsoft.com/v1.0";

let cache: { token: string; exp: number } | null = null;

export function graphEnabled() {
  return config.GRAPH_ENABLED;
}

async function token(): Promise<string> {
  const now = Date.now();
  if (cache && cache.exp - 60_000 > now) return cache.token;
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "client_credentials",
      scope: "https://graph.microsoft.com/.default",
    }),
  });
  if (!res.ok) throw new Error(`Graph token ${res.status}: ${await res.text()}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  cache = { token: j.access_token, exp: now + j.expires_in * 1000 };
  return j.access_token;
}

export async function graph<T = unknown>(
  path: string,
  init: RequestInit & { raw?: boolean } = {},
): Promise<T> {
  const t = await token();
  const res = await fetch(path.startsWith("http") ? path : `${BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${t}`, Accept: "application/json", ...init.headers },
  });
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Graph ${init.method ?? "GET"} ${path} → ${res.status}: ${body}`) as Error & {
      status: number;
    };
    err.status = res.status;
    throw err;
  }
  if (init.raw) return res as unknown as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function graphBinary(path: string): Promise<ArrayBuffer> {
  const res = await graph<Response>(path, { raw: true });
  return res.arrayBuffer();
}
