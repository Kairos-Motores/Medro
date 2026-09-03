import { request } from "undici";
import { graph, graphEnabled } from "../graph/client.js";

/**
 * SharePoint do Gerador de Laudos — arquivar o PDF gerado e listar fotos da OS.
 * Mesmo drive já usado pelo Medro ("Doc Técnicos"): guarda laudos e a pasta
 * "Fotos Peritagens".
 *
 * PDF em  /Fotos Peritagens/{unidade}/{cliente}/{osId}/Relatorio Inicial/Relatorio_{osId}.pdf
 * fotos em /Fotos Peritagens/{unidade}/{cliente}/{osId}/{servico}/
 *
 * O upload usa `undici.request` (não o global `fetch` do Node 24, que trava
 * com corpos grandes de PUT para o SharePoint).
 */

const DRIVE_ID = "b!FtUeR6-xYEutseM1MLQP0luN9WQa7dVAm7IrWRchyFnVHstz2SkdR6IH4JOZ3kJr";
const FOTOS_CATEGORIAS = ["Peritagem", "Teste", "Montagem", "Qualidade"] as const;

function enc(rel: string): string {
  return rel
    .replace(/^\/+/, "")
    .split("/")
    .filter(Boolean)
    .map((s) => encodeURIComponent(s))
    .join("/");
}

export type FotoItem = { id: string; nome: string; url: string };

export async function listFotos(
  osId: string,
  unidade: string,
  cliente: string,
): Promise<Record<string, FotoItem[]>> {
  if (!graphEnabled()) return {};
  const out: Record<string, FotoItem[]> = {};
  for (const servico of FOTOS_CATEGORIAS) {
    try {
      const rel = `Fotos Peritagens/${unidade}/${cliente}/${osId}/${servico}`;
      const { value } = await graph<{
        value: {
          id: string;
          name: string;
          file?: unknown;
          "@microsoft.graph.downloadUrl"?: string;
        }[];
      }>(
        `/drives/${DRIVE_ID}/root:/${enc(rel)}:/children?$select=id,name,file,@microsoft.graph.downloadUrl&$top=200`,
        { signal: AbortSignal.timeout(15_000) },
      );
      out[servico] = value
        .filter((f) => f.file)
        .map((f) => ({ id: f.id, nome: f.name, url: f["@microsoft.graph.downloadUrl"] ?? "" }));
    } catch (err) {
      // 404 = pasta sem fotos (normal); outros erros são de path/permissão.
      const msg = (err as Error).message ?? String(err);
      if (!/\b404\b/.test(msg)) {
        console.warn(
          `[laudos-gen] listFotos ${osId}/${servico}: ${msg.slice(0, 200)} ` +
            `(path: Fotos Peritagens/${unidade}/${cliente}/${osId}/${servico})`,
        );
      }
      out[servico] = [];
    }
  }
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
