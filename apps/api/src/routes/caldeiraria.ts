import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  listCaldeirariaItens,
  getCaldeirariaItem,
  createCaldeirariaItem,
  updateCaldeirariaItem,
  listCaldeirariaPecas,
  createCaldeirariaPeca,
  removeCaldeirariaPeca,
  getCaldeirariaKpis,
} from "../services/dataverse/caldeiraria.js";

const CreateItemSchema = z.object({
  os: z.string().min(1, "OS é obrigatória"),
  pecas: z.string().min(1, "Peça é obrigatória"),
  servicos: z.string().nullish(),
  prazo: z.number().int().positive().nullish(),
  regime: z.enum(["Normal", "Prioridade"]).optional(),
  unidade: z.string().nullish(),
  inseridoPor: z.string().nullish(),
  dataEnvio: z.string().nullish(),
  imagemReferencia: z.string().nullish(),
});

const BatchCreateSchema = z.object({
  itens: z.array(CreateItemSchema).min(1),
});

const UpdateItemSchema = z.object({
  status: z.enum(["Pendente", "Concluído", "Suspenso"]).optional(),
  concluidoPor: z.string().nullish(),
  dataConclusao: z.string().nullish(),
  evidencia: z.string().nullish(),
  comentario: z.string().nullish(),
  dataModificacao: z.string().nullish(),
  prazo: z.number().int().positive().optional(),
  regime: z.enum(["Normal", "Prioridade"]).optional(),
  servicos: z.string().optional(),
  pecas: z.string().optional(),
  os: z.string().optional(),
});

export async function caldeirariaRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.requireAccess("CAL"));

  // Listar itens
  app.get("/caldeiraria/itens", async (req) => {
    const q = req.query as Record<string, string | undefined>;
    return listCaldeirariaItens({
      filial: q.filial?.trim() || undefined,
      status: (q.status as "todos" | "pendentes" | "concluidos" | "suspensos") || "todos",
      regime: (q.regime as "Normal" | "Prioridade") || undefined,
      os: q.os?.trim() || undefined,
      search: q.search?.trim() || undefined,
      top: q.top ? Math.min(Number(q.top) || 100, 500) : 100,
    });
  });

  // Obter item específico
  app.get("/caldeiraria/itens/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const item = await getCaldeirariaItem(id);
    if (!item) {
      return reply.notFound("Item de caldeiraria não encontrado");
    }
    return item;
  });

  // Criar 1 item ou lote de itens
  app.post("/caldeiraria/itens", async (req, reply) => {
    const body = req.body as unknown;

    // Checagem se é criação em lote
    const batchResult = BatchCreateSchema.safeParse(body);
    if (batchResult.success) {
      const createdList = [];
      for (const item of batchResult.data.itens) {
        const created = await createCaldeirariaItem({
          ...item,
          servicos: item.servicos ?? undefined,
          prazo: item.prazo ?? undefined,
          unidade: item.unidade ?? undefined,
          inseridoPor: item.inseridoPor ?? undefined,
          dataEnvio: item.dataEnvio ?? undefined,
          imagemReferencia: item.imagemReferencia ?? undefined,
        });
        createdList.push(created);
      }
      return reply.code(201).send({ items: createdList });
    }

    // Criação unitária
    const singleResult = CreateItemSchema.safeParse(body);
    if (!singleResult.success) {
      return reply.badRequest(singleResult.error.message);
    }

    const created = await createCaldeirariaItem({
      ...singleResult.data,
      servicos: singleResult.data.servicos ?? undefined,
      prazo: singleResult.data.prazo ?? undefined,
      unidade: singleResult.data.unidade ?? undefined,
      inseridoPor: singleResult.data.inseridoPor ?? undefined,
      dataEnvio: singleResult.data.dataEnvio ?? undefined,
      imagemReferencia: singleResult.data.imagemReferencia ?? undefined,
    });
    return reply.code(201).send(created);
  });

  // Atualizar item (concluir, suspender, reativar, editar)
  app.patch("/caldeiraria/itens/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = UpdateItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.badRequest(parsed.error.message);
    }

    try {
      const updated = await updateCaldeirariaItem(id, {
        ...parsed.data,
        concluidoPor: parsed.data.concluidoPor ?? undefined,
        dataConclusao: parsed.data.dataConclusao ?? undefined,
        evidencia: parsed.data.evidencia ?? undefined,
        comentario: parsed.data.comentario ?? undefined,
        dataModificacao: parsed.data.dataModificacao ?? undefined,
      });
      return updated;
    } catch (err) {
      return reply.notFound((err as Error).message);
    }
  });

  // Listar catálogo de peças padronizadas
  app.get("/caldeiraria/pecas", async () => {
    const pecas = await listCaldeirariaPecas();
    return { items: pecas };
  });

  // Cadastrar peça padronizada
  app.post("/caldeiraria/pecas", async (req, reply) => {
    const body = req.body as { pecas?: string };
    if (!body?.pecas || !body.pecas.trim()) {
      return reply.badRequest("Nome da peça é obrigatório");
    }
    const created = await createCaldeirariaPeca(body.pecas);
    return reply.code(201).send(created);
  });

  // Remover peça padronizada
  app.delete("/caldeiraria/pecas/:id", async (req) => {
    const { id } = req.params as { id: string };
    await removeCaldeirariaPeca(id);
    return { success: true };
  });

  // KPIs agregados
  app.get("/caldeiraria/kpis", async (req) => {
    const q = req.query as { filial?: string };
    return getCaldeirariaKpis(q.filial);
  });
}
