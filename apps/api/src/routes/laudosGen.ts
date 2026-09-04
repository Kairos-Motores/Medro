import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { config } from "../config.js";
import {
  buscarOs,
  getRascunho,
  salvarRascunho,
  excluirRascunho,
  listarRascunhos,
  listarModelos,
  criarModelo,
  getModelo,
  atualizarModelo,
  excluirModelo,
  salvarCapa,
  lerCapa,
  getModeloIa,
  getModeloIaConfig,
  setModeloIaConfig,
  registrarHistoricoPdf,
  listarHistoricoPdf,
  getBalanceamento,
  getPeritagemPorOs,
  getHistoricoServicos,
} from "../services/laudosGen/dataverse.js";
import { listFotos, fotoDownloadUrl, uploadReportPdf } from "../services/laudosGen/sharepoint.js";
import {
  gerarTextoIA,
  gerarDiagnosticoLoteIA,
  iaProviderConfigurado,
} from "../services/laudosGen/ia.js";

/**
 * Gerador de Laudos — rotas (porte de Gerador_relatorios/backend/server.js).
 * Todo o módulo é restrito ao Departamento Técnico (token DPT).
 *
 * Nesta fase (leitura + rascunho + modelos + histórico):
 *  - fotos (SharePoint), IA e geração de PDF entram na próxima fase.
 */
export async function laudosGenRoutes(app: FastifyInstance) {
  // `<img src>` e o bundle de impressão não mandam header — aceitam o JWT em `?t=`.
  app.addHook("onRequest", async (req) => {
    const t = (req.query as { t?: string })?.t;
    if (!req.headers.authorization && typeof t === "string" && t) {
      req.headers.authorization = `Bearer ${t}`;
    }
  });
  const requireDpt = app.requireAccess("DPT");
  app.addHook("preHandler", async (req, reply) => {
    // GET da capa customizada é usado como `<img src>` (sem header Authorization)
    // pela prévia e pelo worker de PDF — leitura pública.
    if (req.method === "GET" && req.routeOptions.url?.endsWith("/laudos-gen/capas/:id")) return;
    return requireDpt(req, reply);
  });

  // ── foto da OS: redireciona para uma URL de download fresca do SharePoint ──
  app.get("/laudos-gen/foto/:itemId", async (req, reply) => {
    const { itemId } = req.params as { itemId: string };
    const url = await fotoDownloadUrl(itemId);
    if (!url) return reply.code(404).send({ error: "foto_nao_encontrada" });
    reply.header("Cache-Control", "private, max-age=1500");
    return reply.redirect(url);
  });

  // ── capa customizada (arquivo no Dataverse cr4a1_caparelatorios) ───────────
  const CapaBody = z.object({
    nome: z.string().min(1).max(200),
    /** data URL ou base64 puro do arquivo */
    dataBase64: z.string().min(1),
  });
  app.post("/laudos-gen/capas", { bodyLimit: 14 * 1024 * 1024 }, async (req, reply) => {
    const parsed = CapaBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "bad_request" });
    const raw = parsed.data.dataBase64.replace(/^data:[^;]*;base64,/, "");
    const buffer = Buffer.from(raw, "base64");
    if (buffer.length === 0) return reply.code(400).send({ error: "arquivo_vazio" });
    if (buffer.length > 8 * 1024 * 1024)
      return reply.code(413).send({ error: "arquivo_grande", message: "A capa deve ter até 8 MB." });
    const ext = (parsed.data.nome.match(/\.[a-z0-9]+$/i)?.[0] ?? ".png").toLowerCase();
    const { id } = await salvarCapa(buffer, `capa-${Date.now()}${ext}`);
    // URL absoluta (o `<img>` da capa é carregado pela prévia/worker, não só pelo front)
    const base =
      config.PUBLIC_API_URL ||
      process.env.RENDER_EXTERNAL_URL ||
      `${req.protocol}://${req.headers.host}`;
    return { success: true, id, url: `${base}/api/laudos-gen/capas/${id}` };
  });

  app.get("/laudos-gen/capas/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const capa = await lerCapa(id);
    if (!capa) return reply.code(404).send({ error: "capa_nao_encontrada" });
    reply.header("Content-Type", capa.contentType);
    reply.header("Cache-Control", "public, max-age=31536000, immutable");
    return reply.send(Buffer.from(capa.body));
  });

  // ── OS ────────────────────────────────────────────────────────────────────
  app.get("/laudos-gen/os/:osId", async (req, reply) => {
    const { osId } = req.params as { osId: string };
    try {
      return await buscarOs(osId);
    } catch (err) {
      const e = err as Error & { status?: number };
      return reply.code(e.status ?? 500).send({ error: true, message: e.message });
    }
  });

  // ── rascunho ──────────────────────────────────────────────────────────────
  app.get("/laudos-gen/rascunhos", async () => listarRascunhos());

  app.get("/laudos-gen/rascunho/:osId", async (req) => {
    const { osId } = req.params as { osId: string };
    const tipo = (req.query as { tipo?: string }).tipo || "padrao";
    return (await getRascunho(osId, tipo)) ?? {};
  });

  const RascunhoBody = z.object({
    osId: z.string().min(1),
    state: z.unknown(),
    tipo: z.string().optional(),
  });
  app.post("/laudos-gen/rascunho", async (req, reply) => {
    const parsed = RascunhoBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "bad_request", issues: parsed.error.issues });
    await salvarRascunho(parsed.data.osId, parsed.data.state, parsed.data.tipo || "padrao");
    return { success: true };
  });

  app.delete("/laudos-gen/rascunho/:osId", async (req) => {
    const { osId } = req.params as { osId: string };
    const tipo = (req.query as { tipo?: string }).tipo || "padrao";
    await excluirRascunho(osId, tipo);
    return { success: true };
  });

  // ── modelos / álbum ───────────────────────────────────────────────────────
  app.get("/laudos-gen/modelos", async () => listarModelos());

  const ModeloBody = z.object({
    cr4a1_nome_modelo: z.string().min(1),
    cr4a1_configuracao_json: z.string().min(1),
  });
  app.post("/laudos-gen/modelos", async (req, reply) => {
    const parsed = ModeloBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "bad_request", issues: parsed.error.issues });
    const novo = await criarModelo(parsed.data.cr4a1_nome_modelo, parsed.data.cr4a1_configuracao_json);
    return { success: true, id: novo.id };
  });

  app.get("/laudos-gen/modelos/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      return await getModelo(id);
    } catch (err) {
      const e = err as Error & { status?: number };
      return reply.code(e.status ?? 500).send({ error: true, message: e.message });
    }
  });

  const ModeloPatch = z.object({
    nome: z.string().min(1).optional(),
    configuracaoJson: z.string().min(1).optional(),
  });
  app.put("/laudos-gen/modelos/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = ModeloPatch.safeParse(req.body);
    if (!parsed.success)
      return reply.code(400).send({ error: "bad_request", issues: parsed.error.issues });
    await atualizarModelo(id, parsed.data);
    return { success: true };
  });

  app.delete("/laudos-gen/modelos/:id", async (req) => {
    const { id } = req.params as { id: string };
    await excluirModelo(id);
    return { success: true };
  });

  /** duplica um modelo (estrutura + config de IA) com sufixo "(cópia)". */
  app.post("/laudos-gen/modelos/:id/duplicar", async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const src = await getModelo(id);
      const nome = `${src.cr4a1_nome_modelo || "Modelo"} (cópia)`;
      const novo = await criarModelo(nome, src.cr4a1_configuracao_json || "{}");
      if (src.cr4a1_ia_prompt || src.cr4a1_ia_provider) {
        await setModeloIaConfig(novo.id, {
          prompt: src.cr4a1_ia_prompt ?? undefined,
          provider: src.cr4a1_ia_provider ?? undefined,
        });
      }
      return { success: true, id: novo.id };
    } catch (err) {
      const e = err as Error & { status?: number };
      return reply.code(e.status ?? 500).send({ error: true, message: e.message });
    }
  });

  app.get("/laudos-gen/modelos/:id/ia-config", async (req) => {
    const { id } = req.params as { id: string };
    return getModeloIaConfig(id);
  });
  app.put("/laudos-gen/modelos/:id/ia-config", async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = z
      .object({ prompt: z.string().optional(), provider: z.string().optional(), apiKey: z.string().optional() })
      .safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: "bad_request" });
    await setModeloIaConfig(id, body.data);
    return { success: true };
  });

  // ── IA do diagnóstico (não persiste nada — só sugere para o técnico revisar) ─
  async function resolverModeloIa(id: string, reply: import("fastify").FastifyReply) {
    const { prompt, provider } = await getModeloIa(id);
    if (!iaProviderConfigurado(provider)) {
      reply
        .code(400)
        .send({ error: "ia_nao_configurada", message: `Provedor de IA "${provider}" sem chave no servidor.` });
      return null;
    }
    return { prompt, provider };
  }

  app.post("/laudos-gen/modelos/:id/ia-gerar", async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = z
      .object({ resumo: z.string().min(1), campoLabel: z.string().optional() })
      .safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: "bad_request", message: "Informe um resumo." });
    const m = await resolverModeloIa(id, reply);
    if (!m) return;
    try {
      const texto = await gerarTextoIA({
        provider: m.provider,
        systemPrompt: m.prompt,
        resumo: body.data.resumo,
        campoLabel: body.data.campoLabel || "",
      });
      return { texto };
    } catch (err) {
      return reply.code(502).send({ error: "ia_erro", message: (err as Error).message });
    }
  });

  app.post("/laudos-gen/modelos/:id/ia-gerar-lote", async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = z
      .object({
        resumo: z.string().min(1),
        campos: z.array(z.object({ key: z.string().min(1), label: z.string().min(1) })).min(1),
      })
      .safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: "bad_request" });
    const m = await resolverModeloIa(id, reply);
    if (!m) return;
    try {
      const campos = await gerarDiagnosticoLoteIA({
        provider: m.provider,
        systemPrompt: m.prompt,
        resumo: body.data.resumo,
        campos: body.data.campos,
      });
      return { campos };
    } catch (err) {
      return reply.code(502).send({ error: "ia_erro", message: (err as Error).message });
    }
  });

  // ── histórico de PDFs ─────────────────────────────────────────────────────
  app.get("/laudos-gen/historico-pdf", async () => listarHistoricoPdf());
  app.post("/laudos-gen/historico-pdf", async (req, reply) => {
    const body = z
      .object({ usuario: z.string().optional(), os: z.string().min(1), cliente: z.string().min(1) })
      .safeParse(req.body);
    if (!body.success) return reply.code(400).send({ error: "bad_request" });
    await registrarHistoricoPdf({
      usuario: body.data.usuario || req.user.nome,
      os: body.data.os,
      cliente: body.data.cliente,
    });
    return { success: true };
  });

  // ── auxiliares do laudo ───────────────────────────────────────────────────
  app.get("/laudos-gen/balanceamento/:osId", async (req) => {
    const { osId } = req.params as { osId: string };
    return getBalanceamento(osId);
  });

  app.get("/laudos-gen/peritagem/:osId", async (req) => {
    const { osId } = req.params as { osId: string };
    return getPeritagemPorOs(osId);
  });

  app.get("/laudos-gen/historico-servicos/:tag", async (req) => {
    const { tag } = req.params as { tag: string };
    return getHistoricoServicos(tag);
  });

  // ── fotos da OS (SharePoint via Graph) ────────────────────────────────────
  app.get("/laudos-gen/os/:osId/fotos", async (req, reply) => {
    const { osId } = req.params as { osId: string };
    const q = req.query as { unidade?: string; cliente?: string };
    let unidade = q.unidade;
    let cliente = q.cliente;
    if (!unidade || !cliente) {
      try {
        const os = await buscarOs(osId);
        unidade = unidade || os.unidade_nome;
        cliente = cliente || (os.cr4a1_cliente_nome as string) || "";
      } catch {
        return reply.code(400).send({ error: "unidade e cliente são obrigatórios" });
      }
    }
    return listFotos(osId, unidade!, cliente!);
  });

  // ── geração de PDF (via pdf-worker) ───────────────────────────────────────
  const RenderBody = z.object({
    osId: z.string().min(1),
    tipo: z.string().optional(),
    /** default true: arquiva o PDF no SharePoint e registra histórico */
    arquivar: z.boolean().optional(),
  });
  app.post("/laudos-gen/render", async (req, reply) => {
    const parsed = RenderBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "bad_request" });
    const { osId, tipo = "padrao", arquivar = true } = parsed.data;

    // repassa o JWT do próprio usuário para o bundle de impressão (que refaz
    // as chamadas /api/laudos-gen/* já autenticado como DPT)
    const jwt = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    const reportUrl =
      `${config.REPORT_PRINT_URL}/admin?os=${encodeURIComponent(osId)}` +
      `&tipo=${encodeURIComponent(tipo)}&print=true&t=${encodeURIComponent(jwt)}`;

    let buf: Buffer;
    try {
      const wres = await fetch(`${config.PDF_WORKER_URL}/render`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(config.PDF_WORKER_TOKEN ? { Authorization: `Bearer ${config.PDF_WORKER_TOKEN}` } : {}),
        },
        body: JSON.stringify({ reportUrl }),
      });
      if (!wres.ok) {
        const text = await wres.text();
        return reply
          .code(502)
          .send({ error: "pdf_worker_error", status: wres.status, message: text.slice(0, 500) });
      }
      buf = Buffer.from(await wres.arrayBuffer());
    } catch (err) {
      return reply.code(502).send({ error: "pdf_worker_unreachable", message: (err as Error).message });
    }

    // Devolve o PDF já. Arquivamento no SharePoint + histórico rodam em segundo
    // plano (não seguram a resposta) — o front acompanha via /render/status.
    reply.header("Content-Type", "application/pdf");
    reply.header("Content-Disposition", `inline; filename="Laudo_${osId}.pdf"`);
    reply.header("X-Arquivado", arquivar ? "pending" : "false");
    reply.send(buf);

    if (arquivar) {
      arquivoStatus.set(osId, { estado: "arquivando", em: Date.now() });
      void (async () => {
        try {
          const os = await buscarOs(osId);
          const cliente = (os.cr4a1_cliente_nome as string) || "";
          const up = await uploadReportPdf(buf, { unidade: os.unidade_nome, cliente, osId });
          await registrarHistoricoPdf({ usuario: req.user.nome, os: osId, cliente }).catch(() => {});
          arquivoStatus.set(osId, { estado: "ok", em: Date.now(), url: up.webUrl });
          app.log.info({ osId, url: up.path }, "laudos-gen: PDF arquivado no SharePoint");
        } catch (err) {
          arquivoStatus.set(osId, { estado: "erro", em: Date.now(), erro: (err as Error).message });
          app.log.warn({ osId, err: (err as Error).message }, "laudos-gen: falha ao arquivar PDF");
        }
      })();
    }
  });

  app.get("/laudos-gen/render/status/:osId", async (req) => {
    const { osId } = req.params as { osId: string };
    return arquivoStatus.get(osId) ?? { estado: "nenhum" };
  });
}

type ArquivoStatus = {
  estado: "arquivando" | "ok" | "erro" | "nenhum";
  em?: number;
  url?: string | null;
  erro?: string;
};
const arquivoStatus = new Map<string, ArquivoStatus>();
