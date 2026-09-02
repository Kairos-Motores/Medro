import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  listLaudos,
  getLaudo,
  createLaudo,
  updateLaudo,
  archiveLaudo,
} from "../services/dataverse/laudos.js";
import { obterLaudoPdf, gerarLinkLaudo } from "../services/flows/dpt.js";
import { checkLaudoPdfBatch } from "../services/sharepoint/docTecnicos.js";

const LaudoInput = z.object({
  os: z.string().min(1),
  osSemSigla: z.string().nullish(),
  cliente: z.string().nullish(),
  filial: z.string().nullish(),
  emissor: z.string().nullish(),
  dataLaudo: z.string().nullish(),
  tipoLaudo: z.string().nullish(),
  classeLaudo: z.string().nullish(),
  tipoPatch: z.string().nullish(),
  sintomas: z.string().nullish(),
  falhaPrincipal: z.string().nullish(),
  parecerTecnico: z.string().nullish(),
  conclusao: z.string().nullish(),
  observacao: z.string().nullish(),
  ensaioEletrico: z.string().nullish(),
  ensaioTemperatura: z.string().nullish(),
  ensaioVibracao: z.string().nullish(),
  dataMotorPeritado: z.string().nullish(),
  dataMotorPronto: z.string().nullish(),
  xId: z.string().nullish(),
});

function flowError(reply: import("fastify").FastifyReply, err: unknown) {
  const e = err as Error & { code?: string; status?: number };
  const notConfigured = e.code === "SHAREPOINT_NOT_CONFIGURED";
  return reply.code(notConfigured ? 503 : 502).send({
    error: e.code ?? "flow_error",
    message: e.message,
  });
}

export async function laudosRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.requireAccess("DPT"));

  app.get("/laudos", async (req) => {
    const q = req.query as Record<string, string | undefined>;
    return listLaudos({
      search: q.search?.trim() || undefined,
      filial: q.filial?.trim() || undefined,
      tipo: (q.tipo as "todos" | "dpt" | "tec") ?? "todos",
      top: q.top ? Math.min(Number(q.top) || 50, 200) : 50,
    });
  });

  /** indicador "tem PDF no SharePoint" para uma lista de laudos (Graph $batch). */
  app.post("/laudos/pdf-status", async (req, reply) => {
    const ids = (req.body as { ids?: string[] })?.ids;
    if (!Array.isArray(ids) || ids.length === 0) return reply.code(400).send({ error: "bad_request" });
    const laudos = await Promise.all(
      ids.slice(0, 100).map((id) => getLaudo(id).catch(() => null)),
    );
    const status = await checkLaudoPdfBatch(
      laudos.filter((l): l is NonNullable<typeof l> => !!l).map((l) => ({
        id: l.id, os: l.os, osSemSigla: l.osSemSigla, classeLaudo: l.classeLaudo,
        cliente: l.cliente, filial: l.filial, tipoLaudo: l.tipoLaudo,
      })),
    );
    return { status };
  });

  app.get("/laudos/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      return await getLaudo(id);
    } catch {
      return reply.code(404).send({ error: "not_found" });
    }
  });

  app.post("/laudos", async (req, reply) => {
    const parsed = LaudoInput.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "bad_request", issues: parsed.error.issues });
    const created = await createLaudo({
      ...parsed.data,
      emissor: parsed.data.emissor ?? req.user.nome,
      filial: parsed.data.filial ?? req.user.filial,
    });
    return reply.code(201).send(created);
  });

  app.patch("/laudos/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = LaudoInput.partial().safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "bad_request", issues: parsed.error.issues });
    return updateLaudo(id, parsed.data);
  });

  app.delete("/laudos/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    await archiveLaudo(id);
    return reply.code(204).send();
  });

  /** PDF do laudo (SharePoint "Doc Tcnicos" via Graph). Faz stream do arquivo. */
  app.get("/laudos/:id/pdf", async (req, reply) => {
    const { id } = req.params as { id: string };
    const laudo = await getLaudo(id).catch(() => null);
    if (!laudo) return reply.code(404).send({ error: "not_found" });
    try {
      const pdf = await obterLaudoPdf(laudo);
      if (!pdf) return reply.code(404).send({ error: "pdf_not_found", message: "PDF do laudo não localizado no SharePoint." });
      reply.header("Content-Type", "application/pdf");
      reply.header("Content-Disposition", `inline; filename="${encodeURIComponent(pdf.name)}"`);
      return reply.send(pdf.buffer);
    } catch (err) {
      return flowError(reply, err);
    }
  });

  /** metadados do PDF: existe? nome do arquivo? (para a UI decidir o botão) */
  app.get("/laudos/:id/pdf/meta", async (req, reply) => {
    const { id } = req.params as { id: string };
    const laudo = await getLaudo(id).catch(() => null);
    if (!laudo) return reply.code(404).send({ error: "not_found" });
    try {
      const link = await gerarLinkLaudo(laudo);
      return { available: !!link, webUrl: link?.webUrl ?? null };
    } catch (err) {
      const e = err as Error & { code?: string };
      return { available: false, reason: e.code ?? "error", message: e.message };
    }
  });

  /** link de compartilhamento (gerarlinkLaudo). */
  app.post("/laudos/:id/link", async (req, reply) => {
    const { id } = req.params as { id: string };
    const laudo = await getLaudo(id).catch(() => null);
    if (!laudo) return reply.code(404).send({ error: "not_found" });
    try {
      const link = await gerarLinkLaudo(laudo);
      if (!link) return reply.code(404).send({ error: "pdf_not_found" });
      return link;
    } catch (err) {
      return flowError(reply, err);
    }
  });
}
