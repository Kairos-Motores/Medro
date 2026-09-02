import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate, sessionByUsuario } from "../auth/credenciais.js";
import { config } from "../config.js";

const LoginBody = z.object({
  usuario: z.string().min(1),
  senha: z.string().min(1),
});

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (req, reply) => {
    const parsed = LoginBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "bad_request", message: "usuario e senha são obrigatórios." });
    }
    const { usuario, senha } = parsed.data;

    let session;
    try {
      session = await authenticate(usuario, senha);
    } catch (err) {
      req.log.error({ err }, "falha ao consultar Credenciaiss");
      return reply.code(502).send({ error: "upstream_error", message: "Não foi possível validar o login agora." });
    }

    if (!session) {
      return reply.code(401).send({ error: "invalid_credentials", message: "Usuário ou senha inválidos, ou acesso inativo." });
    }

    const token = app.jwt.sign(session);
    return { token, user: session };
  });

  app.get("/auth/me", { preHandler: [app.authenticate] }, async (req) => {
    return { user: req.user };
  });

  /** DEV ONLY — login sem senha (para verificação de UI). Desabilitado em produção. */
  if (config.NODE_ENV !== "production") {
    app.post("/auth/dev-login", async (req, reply) => {
      const usuario = (req.body as { usuario?: string })?.usuario?.trim();
      if (!usuario) return reply.code(400).send({ error: "bad_request" });
      const session = await sessionByUsuario(usuario);
      if (!session) return reply.code(404).send({ error: "not_found", message: "Usuário não encontrado ou inativo." });
      return { token: app.jwt.sign(session), user: session };
    });
  }
}
