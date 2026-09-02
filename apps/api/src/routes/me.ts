import type { FastifyInstance } from "fastify";
import { getFotoPerfil } from "../auth/credenciais.js";

export async function meRoutes(app: FastifyInstance) {
  /** Foto de perfil do usuário logado (cr4a1_imgperfil). */
  app.get("/me/photo", { preHandler: [app.authenticate] }, async (req, reply) => {
    if (!req.user.temFoto) return reply.code(404).send({ error: "no_photo" });
    try {
      const buf = await getFotoPerfil(req.user.credencialId);
      if (!buf || buf.byteLength === 0) return reply.code(404).send({ error: "no_photo" });
      reply.header("Content-Type", "image/jpeg");
      reply.header("Cache-Control", "private, max-age=3600");
      return reply.send(Buffer.from(buf));
    } catch (err) {
      req.log.warn({ err }, "falha ao obter foto de perfil");
      return reply.code(404).send({ error: "no_photo" });
    }
  });
}
