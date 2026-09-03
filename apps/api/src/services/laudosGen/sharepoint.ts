import { request } from "undici";
import { graph, graphEnabled } from "../graph/client.js";

/**
 * SharePoint do Gerador de Laudos — arquivar o PDF gerado e listar fotos da OS.
 * Mesmo drive já usado pelo Medro ("Doc Técnicos").
 *
 * PDF do laudo:  /Fotos Peritagens/{unidade}/{cliente}/{osId}/Relatorio Inicial/Relatorio_{osId}.pdf
 * Fotos da OS:   nesta tenant elas ficam em  /Peritagens/…/{osId}/  (às vezes
 *   nivelado por OS, às vezes /Peritagens/{unidade}/{cliente}/{osId}/), com o
 *   nome no padrão  {osId}_{item}_{hash}.jpg . O nome da pasta de cliente NEM
 *   sempre bate com cr4a1_cliente_nome (ex.: "PORTO" vs "VALE PORTO"), então a
 *   busca principal é por NOME de arquivo/pasta via Graph search — path fixo é
 *   só fallback.
 *
 * O upload usa `undici.request` (não o global `fetch` do Node 24, que trava
 * com corpos grandes de PUT para o SharePoint).
 */

const DRIVE_ID = "b!FtUeR6-xYEutseM1MLQP0luN9WQa7dVAm7IrWRchyFnVHstz2SkdR6IH4JOZ3kJr";
const IMG_RE = /\.(jpe?g|png|webp|gif|bmp)$/i;

function enc(rel: string): string {
  return rel
    .replace(/^\/+/, "")
    .split("/")
    .filter(Boolean)
    .map((s) => encodeURIComponent(s))
    .join("/");
}

/**
 * Item de foto. NÃO devolve URL: o `@microsoft.graph.downloadUrl` é pré-assinado
 * e expira em ~1 h — se fosse gravado no rascunho, a imagem quebrava depois
 * (foi o bug). O front monta `<img src="/api/laudos-gen/foto/{id}?t=<jwt>">` e o
 * backend redireciona (302) para uma URL fresca a cada carga.
 */
export type FotoItem = { id: string; nome: string };

type GItem = {
  id: string;
  name: string;
  file?: unknown;
  folder?: unknown;
  "@microsoft.graph.downloadUrl"?: string;
};

// cache curto da downloadUrl por itemId (reduz chamadas ao Graph nos <img>)
const urlCache = new Map<string, { url: string; exp: number }>();

/** URL de download fresca para um driveItem (para o redirect de /foto/:id). */
export async function fotoDownloadUrl(itemId: string): Promise<string | null> {
  if (!graphEnabled()) return null;
  const hit = urlCache.get(itemId);
  if (hit && hit.exp > Date.now()) return hit.url;
  try {
    const item = await graph<GItem>(`/drives/${DRIVE_ID}/items/${encodeURIComponent(itemId)}`, {
      signal: AbortSignal.timeout(15_000),
    });
    const url = item["@microsoft.graph.downloadUrl"];
    if (!url) return null;
    urlCache.set(itemId, { url, exp: Date.now() + 25 * 60_000 });
    return url;
  } catch {
    return null;
  }
}

/** {osId}_{item}_{hash}.jpg → "item" (categoria de exibição); senão "Peritagem". */
function categoriaDoNome(nome: string, osId: string): string {
  const semExt = nome.replace(IMG_RE, "");
  const semOs = semExt.replace(new RegExp(`^${osId}[\\s_-]+`, "i"), "");
  const partes = semOs.split("_");
  const meio = partes.length > 1 ? partes.slice(0, -1).join("_") : partes[0];
  const t = (meio || "").trim();
  return t && !/^\d+$/.test(t) ? t : "Peritagem";
}

function toFoto(f: GItem): FotoItem {
  return { id: f.id, nome: f.name };
}

async function children(idOrPath: { id?: string; path?: string }): Promise<GItem[]> {
  // sem $select → o Graph devolve @microsoft.graph.downloadUrl para arquivos
  const url = idOrPath.id
    ? `/drives/${DRIVE_ID}/items/${idOrPath.id}/children?$top=999`
    : `/drives/${DRIVE_ID}/root:/${enc(idOrPath.path!)}:/children?$top=999`;
  const { value } = await graph<{ value: GItem[] }>(url, { signal: AbortSignal.timeout(15_000) });
  return value;
}

/**
 * Fotos da OS agrupadas por "categoria" (o item extraído do nome do arquivo).
 * 1) Graph search por `{osId}`: pega imagens cujo nome começa com o osId e,
 *    para pastas com o nome do osId, lista os filhos.
 * 2) Fallback: caminhos fixos conhecidos.
 */
export async function listFotos(
  osId: string,
  unidade: string,
  cliente: string,
): Promise<Record<string, FotoItem[]>> {
  if (!graphEnabled()) return {};

  const byId = new Map<string, FotoItem>();
  const add = (f: GItem) => {
    if (f.file && IMG_RE.test(f.name) && !byId.has(f.id)) byId.set(f.id, toFoto(f));
  };

  // 1) busca por nome
  try {
    const { value } = await graph<{ value: GItem[] }>(
      `/drives/${DRIVE_ID}/root/search(q='${osId.replace(/'/g, "''")}')?$top=200`,
      { signal: AbortSignal.timeout(15_000) },
    );
    const osLc = osId.toLowerCase();
    for (const it of value) {
      if (it.file && it.name.toLowerCase().startsWith(osLc)) add(it);
      if (it.folder && it.name.toLowerCase() === osLc) {
        try {
          for (const c of await children({ id: it.id })) add(c);
        } catch {
          /* ignora pasta inacessível */
        }
      }
    }
  } catch (err) {
    console.warn(`[laudos-gen] listFotos search ${osId}: ${(err as Error).message?.slice(0, 200)}`);
  }

  // 2) fallback: caminhos fixos (a 1ª que existir já resolve)
  if (byId.size === 0) {
    const paths = [
      `Peritagens/${osId}`,
      `Peritagens/${unidade}/${cliente}/${osId}`,
      `Fotos Peritagens/${unidade}/${cliente}/${osId}`,
      `Fotos Peritagens/${unidade}/${cliente}/${osId}/Peritagem`,
    ];
    for (const p of paths) {
      try {
        for (const c of await children({ path: p })) add(c);
        if (byId.size) break;
      } catch (err) {
        if (!/\b404\b/.test((err as Error).message ?? "")) {
          console.warn(`[laudos-gen] listFotos path "${p}": ${(err as Error).message?.slice(0, 160)}`);
        }
      }
    }
  }

  // agrupa por categoria derivada do nome do arquivo
  const out: Record<string, FotoItem[]> = {};
  for (const foto of byId.values()) {
    const cat = categoriaDoNome(foto.nome, osId);
    (out[cat] ??= []).push(foto);
  }
  for (const k of Object.keys(out)) out[k]!.sort((a, b) => a.nome.localeCompare(b.nome));
  return out;
}

type DriveItem = { id: string; name: string; webUrl?: string };

export async function uploadReportPdf(
  buffer: Buffer,
  meta: { unidade: string; cliente: string; osId: string },
): Promise<{ path: string; webUrl: string | null }> {
  if (!graphEnabled()) {
    const e = new Error("SharePoint/Graph desabilitado (GRAPH_ENABLED=false).") as Error & { code: string };
    e.code = "SHAREPOINT_NOT_CONFIGURED";
    throw e;
  }
  const nome = `Relatorio_${meta.osId}.pdf`;
  const rel = `Fotos Peritagens/${meta.unidade}/${meta.cliente}/${meta.osId}/Relatorio Inicial/${nome}`;

  const session = await graph<{ uploadUrl: string }>(
    `/drives/${DRIVE_ID}/root:/${enc(rel)}:/createUploadSession`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: { "@microsoft.graph.conflictBehavior": "replace", name: nome } }),
      signal: AbortSignal.timeout(15_000),
    },
  );

  const CHUNK = 5 * 320 * 1024; // 1.6 MiB (múltiplo de 320 KiB exigido pelo Graph)
  const total = buffer.length;
  let item: DriveItem | null = null;

  for (let start = 0; start < total; start += CHUNK) {
    const end = Math.min(start + CHUNK, total) - 1;
    const slice = buffer.subarray(start, end + 1);
    let lastErr: unknown;
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
      try {
        const res = await request(session.uploadUrl, {
          method: "PUT",
          headers: {
            "content-length": String(slice.length),
            "content-range": `bytes ${start}-${end}/${total}`,
          },
          body: slice,
          headersTimeout: 25_000,
          bodyTimeout: 25_000,
        });
        const text = await res.body.text();
        if (res.statusCode === 200 || res.statusCode === 201) item = JSON.parse(text) as DriveItem;
        else if (res.statusCode !== 202)
          throw new Error(`upload chunk ${start}-${end} → ${res.statusCode}: ${text.slice(0, 300)}`);
        ok = true;
      } catch (err) {
        lastErr = err;
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
    if (!ok) throw lastErr instanceof Error ? lastErr : new Error("falha no upload do chunk");
  }
  if (!item) throw new Error("upload session terminou sem devolver o item");

  let webUrl: string | null = item.webUrl ?? null;
  try {
    const link = await graph<{ link: { webUrl: string } }>(
      `/drives/${DRIVE_ID}/items/${item.id}/createLink`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "view", scope: "organization" }),
        signal: AbortSignal.timeout(15_000),
      },
    );
    webUrl = link.link.webUrl ?? webUrl;
  } catch {
    /* mantém o webUrl do item */
  }
  return { path: `/${rel}`, webUrl };
}
