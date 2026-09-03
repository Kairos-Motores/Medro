import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import { config, isProd } from "./config.js";
import { authPlugin } from "./auth/plugin.js";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.js";
import { meRoutes } from "./routes/me.js";
import { laudosRoutes } from "./routes/laudos.js";
import { medroProRoutes } from "./routes/medroPro.js";

export function buildServer() {
  const app = Fastify({
    logger: isProd
      ? true
      : { transport: { target: "pino-pretty", options: { translateTime: "HH:MM:ss", ignore: "pid,hostname" } } },
  });

  app.register(sensible);
  app.register(cors, {
    origin: config.WEB_ORIGIN.split(",").map((s) => s.trim()),
    credentials: true,
  });
  app.register(authPlugin);

  app.register(healthRoutes);
  app.register(authRoutes, { prefix: "/api" });
  app.register(meRoutes, { prefix: "/api" });
  app.register(laudosRoutes, { prefix: "/api" });
  app.register(medroProRoutes, { prefix: "/api" });

  app.get("/", async () => ({ name: "medro-api", env: config.NODE_ENV }));

  return app;
}

async function main() {
  const app = buildServer();
  try {
    await app.listen({ port: config.PORT, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
