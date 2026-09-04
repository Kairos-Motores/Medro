import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  listTerceirizados,
  getTerceirizado,
  createTerceirizado,
  updateTerceirizado,
  removeTerceirizado,
  getTerceirizadosKpis,
} from "../services/dataverse/terceirizados.js";

const CreateSchema = z.object({
  titulo: z.string().min(1, "OS é obrigatória"),
  nOr: z.string().nullish(),
  peca: z.string().nullish(),
  situacao: z.enum(["Emergencial", "Normal"]).nullish(),
  empresa: z.string().nullish(),
  carcaca: z.string().nullish(),
  fabricante: z.string().nullish(),
  unidade: z.string().nullish(),
  observacao: z.string().nullish(),
  previsaoRetorno: z.string().nullish(),
  dataRegistro: z.string().nullish(),
  servicos: z.array(z.string().nullable()).max(5).nullish(),
});

const UpdateSchema = z.object({
  nOr: z.string().optional(),
  peca: z.string().optional(),
  situacao: z.enum(["Emergencial", "Normal"]).optional(),
  empresa: z.string().optional(),
  carcaca: z.string().optional(),
  fabricante: z.string().optional(),
  observacao: z.string().optional(),
  orcFornecedor: z.string().optional(),
  servicos: z.array(z.string().nullable()).max(5).optional(),
  valores: z.array(z.string().nullable()).max(5).optional(),
  totalValor: z.string().optional(),
  dataRegistro: z.string().optional(),
  dataRetorno: z.string().optional(),
  previsaoRetorno: z.string().optional(),
  dataAprovacaoValor: z.string().optional(),
  avaliacaoRetorno: z.string().optional(),
  avaliacaoDescricao: z.string().optional(),
  avaliacaoMedida: z.string().optional(),
});

const clean = <T extends Record<string, unknown>>(o: T) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v === null ? undefined : v]));

export async function terceirizadosRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.requireAccess("TER"));

  // Lista (pendentes de retorno / histórico), por filial, com busca e ordenação.
  app.get("/terceirizados", async (req) => {
    const q = req.query as Record<string, string | undefined>;
    return listTerceirizados({
      filial: q.filial?.trim() || undefined,
      status: (q.status as "pendentes" | "historico" | "todos") || "pendentes",
      situacao: q.situacao === "Emergencial" || q.situacao === "Normal" ? q.situacao : undefined,
      os: q.os?.trim() || undefined,
      search: q.search?.trim() || undefined,
      order: q.order === "asc" ? "asc" : "desc",
      top: q.top ? Math.min(Number(q.top) || 200, 1000) : 200,
    });
  });

  app.get("/terceirizados/kpis", async (req) => {
    const q = req.query as { filial?: string };
    return getTerceirizadosKpis(q.filial?.trim() || undefined);
  });

  app.get("/terceirizados/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const row = await getTerceirizado(id);
    if (!row) return reply.notFound("Registro de terceirizado não encontrado");
    return row;
  });

  // Novo registro — restrito a quem pode cadastrar.
  app.post("/terceirizados", { preHandler: app.requireAccess("_TER_CAD") }, async (req, reply) => {
    const parsed = CreateSchema.safeParse(req.body);
    if (!parsed.success) return reply.badRequest(parsed.error.message);
    const d = clean(parsed.data);
    const created = await createTerceirizado({
      titulo: d.titulo as string,
      nOr: d.nOr as string | undefined,
      peca: d.peca as string | undefined,
      situacao: d.situacao as string | undefined,
      empresa: d.empresa as string | undefined,
      carcaca: d.carcaca as string | undefined,
      fabricante: d.fabricante as string | undefined,
      unidade: d.unidade as string | undefined,
      observacao: d.observacao as string | undefined,
      previsaoRetorno: d.previsaoRetorno as string | undefined,
      dataRegistro: d.dataRegistro as string | undefined,
      servicos: d.servicos as (string | null)[] | undefined,
    });
    return reply.code(201).send(created);
  });

  // Atualizar (registrar retorno, valores, avaliação, editar).
  app.patch("/terceirizados/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = UpdateSchema.safeParse(req.body);
    if (!parsed.success) return reply.badRequest(parsed.error.message);
    try {
      return await updateTerceirizado(id, parsed.data);
    } catch (err) {
      return reply.notFound((err as Error).message);
    }
  });

  app.delete("/terceirizados/:id", async (req) => {
    const { id } = req.params as { id: string };
    await removeTerceirizado(id);
    return { success: true };
  });
}
