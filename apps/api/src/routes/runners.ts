import type { FastifyInstance } from "fastify";
import { runnersService } from "../services/runnersService.js";

export async function runnersRoutes(app: FastifyInstance) {
  /**
   * Lista todos os runners configurados e seus estados atuais
   */
  app.get("/runners", async () => {
    const items = runnersService.getAllRunners();
    return {
      status: "success",
      isLocalHost: true,
      total: items.length,
      data: items,
    };
  });

  /**
   * Dispara a execução de um script Python específico
   */
  app.post<{ Params: { id: string } }>("/runners/:id/run", async (req, reply) => {
    const { id } = req.params;
    const result = runnersService.runScript(id);
    if (!result.success) {
      return reply.code(400).send({
        status: "error",
        message: result.message,
      });
    }
    return {
      status: "success",
      message: result.message,
      data: result.runner,
    };
  });

  /**
   * Interrompe um script em execução
   */
  app.post<{ Params: { id: string } }>("/runners/:id/stop", async (req, reply) => {
    const { id } = req.params;
    const result = runnersService.stopScript(id);
    if (!result.success) {
      return reply.code(400).send({
        status: "error",
        message: result.message,
      });
    }
    return {
      status: "success",
      message: result.message,
    };
  });

  /**
   * Limpa os logs de um script
   */
  app.post<{ Params: { id: string } }>("/runners/:id/clear", async (req, reply) => {
    const { id } = req.params;
    const ok = runnersService.clearLogs(id);
    if (!ok) {
      return reply.code(404).send({ status: "error", message: "Script não encontrado" });
    }
    return { status: "success", message: "Logs limpos" };
  });

  /**
   * Retorna os logs completos de um runner específico
   */
  app.get<{ Params: { id: string } }>("/runners/:id/logs", async (req, reply) => {
    const { id } = req.params;
    const runner = runnersService.getRunner(id);
    if (!runner) {
      return reply.code(404).send({ status: "error", message: "Script não encontrado" });
    }
    return {
      status: "success",
      id: runner.id,
      name: runner.name,
      logs: runner.logs,
    };
  });
}
