import type { FastifyInstance } from "fastify";
import { dataverse } from "../services/dataverse/client.js";
import { graph, graphEnabled } from "../services/graph/client.js";
import { config } from "../config.js";

export async function healthRoutes(app: FastifyInstance) {
  /** Liveness — não toca serviços externos. */
  app.get("/health", async () => ({ status: "ok", ts: new Date().toISOString() }));

  /** Readiness — verifica Dataverse (WhoAmI) e reporta os conectores opcionais. */
  app.get("/health/ready", async (_req, reply) => {
    const checks: Record<string, { ok: boolean; detail?: string; ms?: number }> = {};

    const t0 = Date.now();
    try {
      const who = await dataverse.whoAmI();
      checks.dataverse = { ok: true, detail: `org ${who.OrganizationId}`, ms: Date.now() - t0 };
    } catch (err) {
      checks.dataverse = { ok: false, detail: (err as Error).message, ms: Date.now() - t0 };
    }

    if (!graphEnabled()) {
      checks.graph = { ok: true, detail: "desabilitado" };
    } else {
      const g0 = Date.now();
      try {
        const site = await graph<{ displayName?: string; id: string }>(
          `/sites/aplicativokm.sharepoint.com:/sites/KairosMotores`,
        );
        checks.graph = { ok: true, detail: `site ${site.displayName ?? site.id}`, ms: Date.now() - g0 };
      } catch (err) {
        checks.graph = { ok: false, detail: (err as Error).message.slice(0, 200), ms: Date.now() - g0 };
      }
    }
    checks.protheus = { ok: !config.PROTHEUS_ENABLED, detail: config.PROTHEUS_ENABLED ? "TODO" : "desabilitado" };

    const ok = checks.dataverse!.ok; // Graph/Protheus não bloqueiam readiness
    return reply.code(ok ? 200 : 503).send({ status: ok ? "ready" : "degraded", checks });
  });
}
