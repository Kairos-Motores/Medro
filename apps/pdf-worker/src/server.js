import "dotenv/config";
import express from "express";

/**
 * pdf-worker — serviço isolado de geração de PDF.
 *
 * POST /render   { reportUrl }        (Authorization: Bearer PDF_WORKER_TOKEN)
 *   → abre reportUrl num Chromium headless, espera `window.reportIsReady`,
 *     devolve o PDF A4 (application/pdf).
 *
 * Em produção usa @sparticuz/chromium (Chromium slim). Em dev, se
 * PUPPETEER_LOCAL=true, usa o Chrome do pacote `puppeteer` (devDependency).
 */

const PORT = process.env.PORT || 8100;
const TOKEN = process.env.PDF_WORKER_TOKEN || "";
const NAV_TIMEOUT = Number(process.env.PDF_NAV_TIMEOUT_MS || 60000);
const READY_TIMEOUT = Number(process.env.PDF_READY_TIMEOUT_MS || 45000);

let browserPromise = null;

async function getBrowser() {
  if (browserPromise) return browserPromise;
  browserPromise = (async () => {
    if (process.env.PUPPETEER_LOCAL === "true") {
      const puppeteer = (await import("puppeteer")).default;
      return puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = (await import("puppeteer-core")).default;
    return puppeteer.launch({
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
    });
  })().catch((err) => {
    browserPromise = null;
    throw err;
  });
  return browserPromise;
}

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok", ts: new Date().toISOString() }));

app.post("/render", async (req, res) => {
  if (TOKEN) {
    const auth = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (auth !== TOKEN) return res.status(401).json({ error: "unauthorized" });
  }

  const { reportUrl } = req.body || {};
  if (!reportUrl || !/^https?:\/\//.test(reportUrl)) {
    return res.status(400).json({ error: "reportUrl inválida" });
  }

  const t0 = Date.now();
  let page;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    page.on("pageerror", (e) => console.error("[page error]", e.message));

    await page.goto(reportUrl, { waitUntil: "networkidle0", timeout: NAV_TIMEOUT });
    await page.waitForFunction(() => window.reportIsReady === true, { timeout: READY_TIMEOUT });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("X-Render-Ms", String(Date.now() - t0));
    res.end(Buffer.from(pdf));
    console.log(`[render] ok em ${Date.now() - t0}ms — ${reportUrl}`);
  } catch (err) {
    console.error("[render] falha:", err.message);
    res.status(502).json({ error: "render_failed", message: err.message });
  } finally {
    if (page) await page.close().catch(() => {});
  }
});

app.listen(PORT, () => console.log(`pdf-worker ouvindo em :${PORT}`));
