import { graph, graphBinary, graphEnabled } from "../graph/client.js";
import { config } from "../../config.js";

/**
 * Biblioteca "Doc Tcnicos" no SharePoint — armazena os laudos PDF.
 * Réplica dos Flows: obterLaudo (GET file content), gerarlinkLaudo (createLink view/anonymous),
 * CopiarLaudo (copia template p/ destino).
 *
 * Sites usados pelo app original:
 *  - São Luís / default: https://aplicativokm.sharepoint.com/sites/KairosMotores
 *  - Barcarena / SJC / Aveiro: site 471ed516-b1af-4b60-adb1-e33530b40fd2
 */

const HOST = "aplicativokm.sharepoint.com";
const SITE_PATH_KAIROS = "/sites/KairosMotores";
const SITE_ID_BR = "471ed516-b1af-4b60-adb1-e33530b40fd2";
const DRIVE_ID_BR = "b!FtUeR6-xYEutseM1MLQP0luN9WQa7dVAm7IrWRchyFnVHstz2SkdR6IH4JOZ3kJr";
const LIBRARY = "Doc Tcnicos";
const BR_FILIAIS = new Set(["Barcarena", "São José dos Campos", "Aveiro"]);

class NotConfigured extends Error {
  code = "SHAREPOINT_NOT_CONFIGURED" as const;
}

const cache = new Map<string, string>();

async function siteId(): Promise<string> {
  const k = "site:kairos";
  if (cache.has(k)) return cache.get(k)!;
  const s = await graph<{ id: string }>(`/sites/${HOST}:${SITE_PATH_KAIROS}`);
  cache.set(k, s.id);
  return s.id;
}

/** driveId da biblioteca "Doc Tcnicos" na filial dada. */
export async function resolveDrive(filial: string | null | undefined): Promise<string> {
  if (filial && BR_FILIAIS.has(filial)) return DRIVE_ID_BR;
  const k = "drive:kairos:doctec";
  if (cache.has(k)) return cache.get(k)!;
  const sid = await siteId();
  const { value } = await graph<{ value: { id: string; name: string }[] }>(`/sites/${sid}/drives?$select=id,name`);
  const drive =
    value.find((d) => d.name === LIBRARY) ??
    value.find((d) => d.name.replace(/\s+/g, "").toLowerCase().includes("doctcnicos")) ??
    value.find((d) => d.name.toLowerCase().includes("doc"));
  if (!drive) throw new Error(`Biblioteca "${LIBRARY}" não encontrada no site.`);
  cache.set(k, drive.id);
  return drive.id;
}

function ensure() {
  if (!graphEnabled()) throw new NotConfigured("Graph/SharePoint desabilitado (GRAPH_ENABLED=false).");
}

/** candidatos de caminho (dentro do drive) para o PDF de um laudo. */
export function laudoPathCandidates(l: {
  os: string | null;
  osSemSigla: string | null;
  classeLaudo: string | null;
  cliente: string | null;
  filial: string | null;
  tipoLaudo: string | null;
}): string[] {
  const osFull = (l.os || "").trim();
  // PowerApps: OS_semSigla ou First(Split(OS,"-")) — número puro
  const osNum = (l.osSemSigla || osFull.split("-")[0] || osFull).trim();
  const classe = (l.classeLaudo || "").trim();
  const isBR = !!l.filial && BR_FILIAIS.has(l.filial);

  // convenção exata do DepTecnico.pa.yaml:
  //  BR   → Laudos/{Filial}/Laudo {classe} {osNum}.pdf
  //  else → Laudos/{Cliente}/Laudo {classe} {OS-completo}.pdf
  const primary = isBR
    ? l.filial && `Laudos/${l.filial}/Laudo ${classe} ${osNum}.pdf`
    : l.cliente && `Laudos/${l.cliente}/Laudo ${classe} ${osFull}.pdf`;

  const folders = [...new Set([l.filial, l.cliente].filter(Boolean) as string[])];
  const osVariants = [...new Set([osNum, osFull].filter(Boolean))];
  const names: string[] = [];
  for (const os of osVariants) {
    if (classe) names.push(`Laudo ${classe} ${os}`);
    names.push(`Laudo ${os}`, `Laudo Inicial ${os}`, `Laudo Final ${os}`, os);
  }

  const paths: string[] = [];
  if (primary) paths.push(primary);
  for (const f of folders) for (const n of names) paths.push(`Laudos/${f}/${n}.pdf`);
  for (const n of names) paths.push(`Laudos/${n}.pdf`);
  return [...new Set(paths)];
}

async function findItem(driveId: string, candidates: string[]) {
  for (const rel of candidates) {
    try {
      const item = await graph<{ id: string; name: string; webUrl: string }>(
        `/drives/${driveId}/root:/${encodeURI(rel)}`,
      );
      return { ...item, rel };
    } catch (e) {
      if ((e as { status?: number }).status === 404) continue;
      throw e;
    }
  }
  return null;
}

export type LaudoRef = Parameters<typeof laudoPathCandidates>[0];

/** obterLaudo — devolve o PDF (bytes) do laudo, ou null se não achou. */
export async function getLaudoPdf(l: LaudoRef): Promise<{ buffer: Buffer; name: string } | null> {
  ensure();
  const driveId = await resolveDrive(l.filial);
  const found = await findItem(driveId, laudoPathCandidates(l));
  if (!found) return null;
  const ab = await graphBinary(`/drives/${driveId}/items/${found.id}/content`);
  return { buffer: Buffer.from(ab), name: found.name };
}

/** gerarlinkLaudo — link de visualização anônimo. */
export async function getLaudoShareLink(l: LaudoRef): Promise<{ webUrl: string } | null> {
  ensure();
  const driveId = await resolveDrive(l.filial);
  const found = await findItem(driveId, laudoPathCandidates(l));
  if (!found) return null;
  const link = await graph<{ link: { webUrl: string } }>(
    `/drives/${driveId}/items/${found.id}/createLink`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "view", scope: "anonymous" }) },
  );
  return { webUrl: link.link.webUrl };
}

// ── verificação em lote (indicador "tem PDF") ────────────────────────────────
type PdfStatus = { available: boolean; checkedAt: number };
const statusCache = new Map<string, PdfStatus>();
const STATUS_TTL = 5 * 60_000;

/** melhor caminho candidato (só 1, para $batch barato). */
function bestCandidate(l: LaudoRef): string | null {
  const list = laudoPathCandidates(l);
  return list[0] ?? null;
}

/** Verifica em lote se há PDF para cada laudo (Graph $batch, 20 por vez). */
export async function checkLaudoPdfBatch(
  laudos: (LaudoRef & { id: string })[],
): Promise<Record<string, boolean>> {
  const out: Record<string, boolean> = {};
  if (!graphEnabled()) return out;

  const now = Date.now();
  const pending: (LaudoRef & { id: string })[] = [];
  for (const l of laudos) {
    const c = statusCache.get(l.id);
    if (c && now - c.checkedAt < STATUS_TTL) out[l.id] = c.available;
    else pending.push(l);
  }
  if (pending.length === 0) return out;

  // agrupa por drive
  const byDrive = new Map<string, (LaudoRef & { id: string })[]>();
  for (const l of pending) {
    const d = await resolveDrive(l.filial);
    if (!byDrive.has(d)) byDrive.set(d, []);
    byDrive.get(d)!.push(l);
  }

  for (const [driveId, group] of byDrive) {
    for (let i = 0; i < group.length; i += 20) {
      const chunk = group.slice(i, i + 20);
      const requests = chunk
        .map((l, idx) => {
          const rel = bestCandidate(l);
          return rel
            ? { id: String(idx), method: "GET", url: `/drives/${driveId}/root:/${encodeURI(rel)}?$select=id` }
            : null;
        })
        .filter(Boolean);
      if (requests.length === 0) continue;
      try {
        const res = await graph<{ responses: { id: string; status: number }[] }>(`/$batch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requests }),
        });
        const map = new Map(res.responses.map((r) => [r.id, r.status]));
        chunk.forEach((l, idx) => {
          const ok = (map.get(String(idx)) ?? 404) === 200;
          out[l.id] = ok;
          statusCache.set(l.id, { available: ok, checkedAt: now });
        });
      } catch {
        // silencioso — sem indicador nesse lote
      }
    }
  }
  return out;
}

export { NotConfigured };
export const sharepointDiag = { HOST, SITE_PATH_KAIROS, LIBRARY, graphEnabled, siteOverride: config.SHAREPOINT_SITE_KAIROS };
