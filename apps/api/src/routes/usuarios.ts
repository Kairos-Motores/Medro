import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  listUsuarios,
  updateUsuarioPermissoes,
  createUsuario,
  removeUsuario,
} from "../services/dataverse/usuarios.js";

const PermissoesBodySchema = z.object({
  permissoes: z.array(z.string()),
});

const CreateUsuarioBodySchema = z.object({
  nome: z.string().min(2),
  login: z.string().min(2),
  senha: z.string().optional(),
  filial: z.string().min(2),
  cargo: z.string().optional(),
  setor: z.string().optional(),
  matProtheus: z.string().optional(),
  permissoes: z.array(z.string()).default([]),
});

export async function usuariosRoutes(app: FastifyInstance) {
  // Rota de listagem de usuários do Dataverse
  app.get("/usuarios", async (req, reply) => {
    const q = req.query as { filial?: string; search?: string; incluirInativos?: string };
    const res = await listUsuarios({
      filial: q.filial,
      search: q.search,
      incluirInativos: q.incluirInativos === "true",
    });
    return reply.send(res);
  });

  // Atualização de permissões de um usuário no Dataverse (cr4a1_acesso_mod)
  app.patch("/usuarios/:id/permissoes", async (req, reply) => {
    const { id } = req.params as { id: string };
    const parse = PermissoesBodySchema.safeParse(req.body);
    if (!parse.success) {
      return reply.status(400).send({ error: "Permissões inválidas", details: parse.error.format() });
    }

    const updated = await updateUsuarioPermissoes(id, parse.data.permissoes);
    return reply.send(updated);
  });

  // Criação de novo usuário / colaborador no Dataverse
  app.post("/usuarios", async (req, reply) => {
    const parse = CreateUsuarioBodySchema.safeParse(req.body);
    if (!parse.success) {
      return reply.status(400).send({ error: "Dados inválidos", details: parse.error.format() });
    }

    const created = await createUsuario(parse.data);
    return reply.status(201).send(created);
  });

  // Inativação / Remoção de usuário
  app.delete("/usuarios/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    await removeUsuario(id);
    return reply.send({ success: true });
  });
}
