import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../config.js";
import { hasAccess, type AccessToken, type UserSession } from "@medro/shared";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireAccess: (
      ...tokens: AccessToken[]
    ) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user: UserSession;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: UserSession;
    user: UserSession;
  }
}

export const authPlugin = fp(async (app) => {
  app.register(fastifyJwt, {
    secret: config.JWT_SECRET,
    sign: { expiresIn: config.JWT_EXPIRES_IN },
  });

  app.decorate("authenticate", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.code(401).send({ error: "unauthorized", message: "Token ausente ou inválido." });
    }
  });

  app.decorate("requireAccess", (...tokens: AccessToken[]) => {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await req.jwtVerify();
      } catch {
        return reply.code(401).send({ error: "unauthorized" });
      }
      const ok = tokens.every((t) => hasAccess(req.user.acessoMod, t));
      if (!ok) {
        return reply.code(403).send({
          error: "forbidden",
          message: `Acesso negado. Requer: ${tokens.join(", ")}.`,
        });
      }
    };
  });
});
