import { config } from "../../config.js";

/**
 * Cliente Dataverse Web API v9.x — autenticação client-credentials (app registration),
 * com cache de token em memória. Só leitura/escrita via OData.
 */

type TokenCache = { token: string; expiresAt: number };
let cache: TokenCache | null = null;

const TOKEN_URL = `https://login.microsoftonline.com/${config.DATAVERSE_TENANT_ID}/oauth2/v2.0/token`;
const SCOPE = `${config.DATAVERSE_RESOURCE}/.default`;
const API_BASE = `${config.DATAVERSE_ENV_URL}/api/data/v${config.DATAVERSE_API_VERSION}`;

export async function getToken(): Promise<string> {
  const now = Date.now();
  if (cache && cache.expiresAt - 60_000 > now) return cache.token;

  const body = new URLSearchParams({
    client_id: config.DATAVERSE_CLIENT_ID,
    client_secret: config.DATAVERSE_CLIENT_SECRET,
    grant_type: "client_credentials",
    scope: SCOPE,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dataverse token falhou (${res.status}): ${text}`);
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cache = { token: json.access_token, expiresAt: now + json.expires_in * 1000 };
  return cache.token;
}

export type DataverseQuery = {
  select?: string[];
  filter?: string;
  orderby?: string;
  top?: number;
  expand?: string;
  count?: boolean;
  /** valor do header Prefer: odata.maxpagesize */
  maxPageSize?: number;
};

function qs(q: DataverseQuery): string {
  const p = new URLSearchParams();
  if (q.select?.length) p.set("$select", q.select.join(","));
  if (q.filter) p.set("$filter", q.filter);
  if (q.orderby) p.set("$orderby", q.orderby);
  if (typeof q.top === "number") p.set("$top", String(q.top));
  if (q.expand) p.set("$expand", q.expand);
  if (q.count) p.set("$count", "true");
  const s = p.toString();
  return s ? `?${s}` : "";
}

async function request<T>(
  method: string,
  path: string,
  opts: { body?: unknown; prefer?: string[]; headers?: Record<string, string> } = {},
): Promise<{ status: number; headers: Headers; data: T }> {
  const token = await getToken();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    "Content-Type": "application/json; charset=utf-8",
    ...opts.headers,
  };
  if (opts.prefer?.length) headers["Prefer"] = opts.prefer.join(",");

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;
  if (!res.ok) {
    const msg = data?.error?.message ?? text ?? res.statusText;
    const err = new Error(`Dataverse ${method} ${path} → ${res.status}: ${msg}`) as Error & {
      status?: number;
    };
    err.status = res.status;
    throw err;
  }
  return { status: res.status, headers: res.headers, data: data as T };
}

export const dataverse = {
  API_BASE,

  /** GET coleção. `entitySet` ex.: "cr4a1_base_medros". */
  async list<T = Record<string, unknown>>(
    entitySet: string,
    query: DataverseQuery = {},
  ): Promise<{ value: T[]; nextLink?: string; count?: number }> {
    const prefer: string[] = [];
    if (query.maxPageSize) prefer.push(`odata.maxpagesize=${query.maxPageSize}`);
    const { data } = await request<{
      value: T[];
      "@odata.nextLink"?: string;
      "@odata.count"?: number;
    }>("GET", `/${entitySet}${qs(query)}`, { prefer });
    return {
      value: data.value ?? [],
      nextLink: data["@odata.nextLink"],
      count: data["@odata.count"],
    };
  },

  /**
   * GET coleção completa percorrendo todas as páginas via @odata.nextLink.
   * Utiliza maxPageSize=5000 por padrão para acelerar o carregamento.
   */
  async listAll<T = Record<string, unknown>>(
    entitySet: string,
    query: DataverseQuery = {},
    maxRecords?: number,
  ): Promise<T[]> {
    let results: T[] = [];
    const maxPageSize = query.maxPageSize || 5000;
    const prefer: string[] = [`odata.maxpagesize=${maxPageSize}`];

    let currentPath = `/${entitySet}${qs(query)}`;

    while (currentPath) {
      if (currentPath.startsWith("http")) {
        const url = new URL(currentPath);
        currentPath =
          url.pathname.replace(new RegExp(`^/api/data/v${config.DATAVERSE_API_VERSION}`), "") + url.search;
      }

      const { data } = await request<{
        value: T[];
        "@odata.nextLink"?: string;
      }>("GET", currentPath, { prefer });

      if (data.value && data.value.length > 0) {
        results = results.concat(data.value);
      }

      if (maxRecords && results.length >= maxRecords) {
        return results.slice(0, maxRecords);
      }

      currentPath = data["@odata.nextLink"] || "";
    }

    return results;
  },

  /** GET por id. */
  async get<T = Record<string, unknown>>(
    entitySet: string,
    id: string,
    query: Pick<DataverseQuery, "select" | "expand"> = {},
  ): Promise<T> {
    const { data } = await request<T>("GET", `/${entitySet}(${id})${qs(query)}`);
    return data;
  },

  /** POST (create). Retorna a linha criada (Prefer: return=representation). */
  async create<T = Record<string, unknown>>(entitySet: string, body: unknown): Promise<T> {
    const { data } = await request<T>("POST", `/${entitySet}`, {
      body,
      prefer: ["return=representation"],
    });
    return data;
  },

  /** PATCH (update). Retorna a linha atualizada. */
  async update<T = Record<string, unknown>>(
    entitySet: string,
    id: string,
    body: unknown,
  ): Promise<T> {
    const { data } = await request<T>("PATCH", `/${entitySet}(${id})`, {
      body,
      prefer: ["return=representation"],
    });
    return data;
  },

  /** DELETE. */
  async remove(entitySet: string, id: string): Promise<void> {
    await request("DELETE", `/${entitySet}(${id})`);
  },

  /** GET binário de um endpoint `$value` (ex.: colunas de imagem/arquivo). null se 404. */
  async getFileValue(path: string): Promise<ArrayBuffer | null> {
    const token = await getToken();
    const res = await fetch(`${API_BASE}/${path.replace(/^\//, "")}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Dataverse GET ${path} → ${res.status}`);
    return res.arrayBuffer();
  },

  /** Ping barato para healthcheck: WhoAmI. */
  async whoAmI(): Promise<{ UserId: string; BusinessUnitId: string; OrganizationId: string }> {
    const { data } = await request<{
      UserId: string;
      BusinessUnitId: string;
      OrganizationId: string;
    }>("GET", `/WhoAmI`);
    return data;
  },
};
