# 07 — Gerador de Laudos (módulo `laudos-gen`)

> **Handoff para o próximo chat.** Documento vivo. Última atualização: 2026-09-03.
> Contexto: incorporar o app **standalone `Gerador_relatorios`** (gerador de laudo técnico
> de OS, saída PDF A4 padrão Kairós) ao Medro como **módulo próprio `laudos-gen`,
> acessível SOMENTE ao Departamento Técnico** (`access: ["DPT"]`).

---

## 1. Objetivo e escopo

- Trazer o gerador de laudos para dentro do Medro como **módulo standalone** no Dock
  (NÃO é aba do módulo "Dep. Técnico"). Confirmado pelo usuário: *"ele deve ser um standalone, com certeza"*.
- **Páginas do relatório / PDF continuam idênticas** ao original (layout A4 Kairós, ~50 componentes de página).
- **Interface de criação/edição deve seguir à risca a identidade visual do Medro**
  (tokens, componentes, window-manager). Confirmado: *"a interface de criação e edição deve seguir o Medro"*.
- Dados continuam no **Dataverse / SharePoint** (mesma tenant e mesmo site já usados pelo Medro).
  O backend do Medro (`apps/api`) é BFF — nada de acesso direto do front.
- **Portal do cliente** (`/cliente/*` do app original) → **NÃO** é portado aqui; vai para outro app.
- Quando o módulo estiver 100% implementado, o usuário vai **apagar a pasta `Gerador_relatorios/`**
  (já está no `.gitignore`).

---

## 2. Decisões tomadas (com o porquê)

| # | Decisão | Porquê |
|---|---------|--------|
| 1 | **PDF worker = serviço Render separado** (`medro-pdf-worker`, private service, Chromium slim). | Puppeteer/Chromium é pesado e tem ciclo de vida próprio; não deve inchar a API. |
| 2 | **NÃO criar 2ª app registration do SharePoint.** Consolidar no Graph client do Medro. | Mesmo site / mesmo drive ("Doc Técnicos") que o Medro já acessa. Reaproveita `apps/api/src/services/graph/client.ts`. |
| 3 | **Chaves de IA (Gemini/Groq/OpenRouter) no `.env` do Medro** (`apps/api`). | Usuário autorizou; a pasta do relatório será apagada depois. O model do Dataverse guarda só o *provider*, não a chave. |
| 4 | **Rascunhos/laudos continuam no Dataverse** (`cr4a1_rascunhorelatorios`), nada de storage novo. | Já funciona assim no app original; é a opção "profissional" sem reinventar. |
| 5 | **Bundle de impressão isolado** (`apps/report-print`, React 19 + Vite 7) em vez de renderizar as páginas dentro do `apps/web`. | As ~50 páginas do relatório têm stack/deps próprios (recharts 3, react-router 7, SCSS). Isolar evita conflito com o `apps/web` (React 18) e mantém as páginas **intocadas**. |
| 6 | **Módulo gated por `DPT`** no registry + `app.requireAccess("DPT")` no backend. | Acesso restrito ao Departamento Técnico. |

---

## 3. Arquitetura da solução

```
┌─────────────┐   POST /api/laudos-gen/render          ┌──────────────────┐
│  apps/web   │  ───────────────────────────────────▶  │    apps/api      │  (Fastify, DPT-gated)
│ módulo      │   {osId, tipo, arquivar}               │  routes/         │
│ laudos-gen  │  ◀───────────────────────────────────  │  laudosGen.ts    │
└─────────────┘         PDF (application/pdf)           └────────┬─────────┘
                        X-Arquivado: pending                     │ POST /render {reportUrl}
                                                                 ▼
                                                        ┌──────────────────┐
                                                        │  apps/pdf-worker │  (Express + puppeteer-core
                                                        │  Puppeteer A4    │   + @sparticuz/chromium)
                                                        └────────┬─────────┘
                                                    page.goto(reportUrl)
                                                    waitForFunction(window.reportIsReady)
                                                    page.pdf()
                                                                 ▼
                                    reportUrl = REPORT_PRINT_URL/admin?os=X&tipo=Y&print=true&t=<jwt>
                                                        ┌──────────────────┐
                                                        │ apps/report-print│  (React 19 / Vite 7, estático)
                                                        │  ~50 páginas do  │  refaz fetch de
                                                        │  laudo (originais)│  /api/laudos-gen/* com Bearer t
                                                        └──────────────────┘

Arquivamento (fire-and-forget, NÃO segura a resposta):
  apps/api  ──uploadReportPdf()──▶  Graph / SharePoint  (drive "Doc Técnicos")
            ──registrarHistoricoPdf()──▶ Dataverse
  front acompanha via GET /api/laudos-gen/render/status/:osId  (poll 2s)
```

**Fluxo de auth do bundle de impressão:** a API repassa o **próprio JWT do usuário** na URL
(`&t=<jwt>`). O `apps/report-print` lê `t` da query e um shim global de `window.fetch`
(em `src/main.jsx`) injeta `Authorization: Bearer <t>` em toda chamada para `API_BASE_URL`.
Assim o bundle refaz as leituras já autenticado como DPT.

---

## 4. O que já está PRONTO

### 4.1 Backend (`apps/api`) — camada de leitura + rascunho + render

- **`src/services/laudosGen/dataverse.ts`** — porte das queries do Gerador reusando o
  `dataverse` client do Medro. Exports:
  - `buscarOs(osId)` — raw fetch com `Prefer: odata.include-annotations="*"` + `flattenFormatted`;
    devolve `{...dados, unidade_nome}` via `MAPPING_FILIAIS` (`0101→Barcarena`, `0102→São Luís`,
    `0103→Parauapebas`, `0104→São José dos Campos`).
  - `getRascunho` / `salvarRascunho` — upsert em `cr4a1_rascunhorelatorios` por `cr4a1_osid` + `cr4a1_tipo`.
  - `listarModelos` / `criarModelo` / `getModeloIaConfig` / `setModeloIaConfig`.
  - `registrarHistoricoPdf` / `listarHistoricoPdf` — `cr4a1_historico_gerador_relatorioses`.
  - `getBalanceamento(osId)` — parser de INI (`cr4a1_conteudo_baldados`).
  - `getPeritagemPorOs(osId)` — `cr4a1_peritagem_b04s`.
  - `getHistoricoServicos(tag)` — filtro `contains`, agrupa por ano em REBOBINAMENTO / REJUVENESCIMENTO / OUTROS.

- **`src/services/laudosGen/sharepoint.ts`** — `uploadReportPdf(buffer, {unidade, cliente, osId})`
  (createUploadSession + chunks de 1.6 MiB via `undici.request` + 3 tentativas) e
  `listFotos(osId, unidade, cliente)` (4 categorias: Peritagem/Teste/Montagem/Qualidade).
  Drive fixo `b!FtUeR6-xYEutseM1MLQP0luN9WQa7dVAm7IrWRchyFnVHstz2SkdR6IH4JOZ3kJr`.
  ⚠️ Ver §7.1 — o upload grande **trava nesta máquina de dev** (restrição de rede local).

- **`src/routes/laudosGen.ts`** — `laudosGenRoutes(app)`, todo o router com
  `app.addHook("preHandler", app.requireAccess("DPT"))`. Rotas:
  | Método | Rota | O quê |
  |---|---|---|
  | GET | `/laudos-gen/os/:osId` | dados achatados da OS |
  | GET/POST | `/laudos-gen/rascunho[/:osId]` | ler / salvar rascunho |
  | GET/POST | `/laudos-gen/modelos` | listar / criar modelo |
  | GET/PUT | `/laudos-gen/modelos/:id/ia-config` | prompt/provider/apiKey do modelo |
  | GET/POST | `/laudos-gen/historico-pdf` | histórico de PDFs emitidos |
  | GET | `/laudos-gen/balanceamento/:osId` | INI de balanceamento parseado |
  | GET | `/laudos-gen/peritagem/:osId` | peritagem B04 da OS |
  | GET | `/laudos-gen/historico-servicos/:tag` | histórico por TAG (gráfico) |
  | GET | `/laudos-gen/os/:osId/fotos` | fotos da OS (Graph) |
  | POST | `/laudos-gen/render` | gera o PDF (via pdf-worker); devolve na hora; arquiva em 2º plano |
  | GET | `/laudos-gen/render/status/:osId` | `arquivando \| ok \| erro \| nenhum` |

  `POST /render`: devolve o PDF imediatamente com header `X-Arquivado: pending|false`.
  Se `arquivar` (default true): `arquivoStatus.set(osId, "arquivando")` e roda em
  `void (async () => …)` → `uploadReportPdf` + `registrarHistoricoPdf`, terminando em `ok`/`erro`.
  `arquivoStatus` é um `Map` em memória do processo (suficiente; não persiste entre restarts).

- **`src/config.ts`** — novas envs (zod): `REPORT_PRINT_URL` (default `http://localhost:5180`),
  `PDF_WORKER_URL` (default `http://localhost:8100`), `PDF_WORKER_TOKEN` (default `""`),
  `GEMINI_API_KEY` / `GROQ_API_KEY` / `OPENROUTER_API_KEY` (optional).

- **`src/server.ts`** — `import { laudosGenRoutes }` + `app.register(laudosGenRoutes, { prefix: "/api" })`.

### 4.2 `apps/report-print` — bundle de impressão (cópia print-only do frontend do Gerador)

- `src/config.js` reescrito: `API_BASE_URL = ${VITE_API_URL || http://localhost:3333}/api/laudos-gen`,
  `AUTH_TOKEN` = query param `t`, helper `apiFetch` adiciona `Bearer AUTH_TOKEN`.
- `src/main.jsx` reescrito: shim global de `window.fetch` — se a URL começa com `API_BASE_URL`
  e não tem `Authorization`, injeta `Bearer AUTH_TOKEN`.
- `src/App.jsx` — **única** mudança de lógica: a condição do `window.reportIsReady` passou de
  `isPrintMode && osData && osData.cr4a1_novacoluna && historyData.length > 0` para
  `isPrintMode && osData && osData.cr4a1_novacoluna` (timeout 300→600ms). As ~50 páginas: **intocadas**.
- Caminhos de API reescritos por sed em `App.jsx` + 7 arquivos:
  `.../api/relatorio/snapshot`→`/rascunho`, `.../api/historico/`→`/historico-servicos/`, `.../api/`→`/`.
- `package.json` → `@medro/report-print` (react ^19.2, vite ^7.1.9, react-router-dom ^7.9.4,
  recharts ^3.2.1). Scripts `dev`/`build`/`preview` na porta **5180**.
- Assets full-bleed convertidos de PNG→JPEG q82 (sharp, flatten branco):
  `capa_padrao.jpg` (59 KB), `contracapa_padrao.jpg` (151 KB), `nossos_servicos.jpg` (85 KB),
  `final.jpg` (180 KB). Imports atualizados em `blocks/Capa.jsx`, `pages/PageBackCover.jsx`,
  `pages/PageFinal.jsx`, `pages/PageOurServices.jsx`, `utils/cover.js`.
  **Resultado: PDF de 8,7 MB → 3,1 MB.**
- `.env` = `VITE_API_URL=http://localhost:3333`.

### 4.3 `apps/pdf-worker` — worker Puppeteer

- `package.json` → `@medro/pdf-worker` (express ^4.21, puppeteer-core ^23.10, @sparticuz/chromium ^131,
  dotenv; puppeteer ^23.10 em devDep para dev local). Scripts `dev` (`node --watch`), `start`.
- `src/server.js`: `POST /render {reportUrl}` com check `Authorization: Bearer PDF_WORKER_TOKEN`.
  `getBrowser()` reusa 1 browser — `PUPPETEER_LOCAL==="true"` usa o Chrome do pacote `puppeteer`;
  senão `@sparticuz/chromium` + `puppeteer-core`. `page.goto(reportUrl, {waitUntil:"networkidle0"})`
  → `page.waitForFunction(() => window.reportIsReady === true)` → `page.pdf({format:"A4",
  printBackground:true, preferCSSPageSize:true, margin: 10mm})`. `GET /health`.
  Defaults: `PORT` 8100, `NAV_TIMEOUT` 60000, `READY_TIMEOUT` 45000.
- `.env` = `PORT=8100`, `PDF_WORKER_TOKEN=dev-worker-token`, `PUPPETEER_LOCAL=true`.

### 4.4 Frontend Medro (`apps/web`)

- **`src/modules/registry.ts`** — `"laudos-gen"` no union `ModuleId`; entrada em `MODULES`:
  `{ id:"laudos-gen", label:"Gerador de Laudos", short:"Laudos",
  desc:"Montagem e emissão do laudo técnico da OS (PDF)", icon: FilePlus2, path:"/laudos-gen",
  access:["DPT"], accent:"teal", ready:true }`.
- **`src/modules/ModuleHost.tsx`** — `if (moduleId === "laudos-gen") return <LaudosGenApp />`.
- **`src/modules/laudos-gen/api.ts`** — hooks React Query: `useOs`, `useRascunho`, `useSalvarRascunho`,
  `useModelos`, `useCriarModelo`, `useBalanceamento`, `useHistoricoServicos`, `useHistoricoPdf`,
  `useGerarPdf` (fetch raw → `PdfResult { url: objectURL, arquivado, sharepointUrl }`),
  `useArquivoStatus(osId, ativo)` (poll 2s enquanto `estado === "arquivando"`), `useFotosOs`.
- **`src/modules/laudos-gen/layout.ts`** — `DEFAULT_LAYOUT: LaudoPage[]` (17 páginas: cover, back_cover,
  our_services, summary, process_data, diagnosis, motor_p7, motor_p8, mechanical, bearing, components,
  resistance, normative, static_desc, custom_table_default, balanceamento, final).
- **`src/modules/laudos-gen/LaudosGenApp.tsx`** — shell do módulo com identidade Medro:
  toolbar (busca de OS, "Carregar", chips OS/cliente/unidade, "Salvar rascunho", "Gerar PDF"),
  banner de status do PDF, e corpo `grid lg:grid-cols-[260px_minmax(0,1fr)]` =
  **navegador de páginas (esquerda, pronto)** + **editor (direita, PLACEHOLDER)**.
  O editor por enquanto só mostra contagem de campos + uma mini-tabela na página `summary`.

### 4.5 Infra / deploy

- **`render.yaml`** — 3 serviços:
  - `medro-api` (web, starter) — `GRAPH_ENABLED "true"`; `REPORT_PRINT_URL`/`PDF_WORKER_URL`
    `fromService`; `PDF_WORKER_TOKEN` `generateValue`; `GEMINI/GROQ/OPENROUTER_API_KEY` `sync:false`.
  - `medro-pdf-worker` (`type: pserv`, plan standard) — `startCommand: node apps/pdf-worker/src/server.js`;
    `PDF_WORKER_TOKEN` `fromService medro-api`; `PUPPETEER_LOCAL "false"`.
  - `medro-report-print` (`type: static`, rootDir `apps/report-print`) —
    `buildCommand: cd ../.. && pnpm install --frozen-lockfile && pnpm --filter @medro/report-print build`;
    `staticPublishPath apps/report-print/dist`; rewrite `/*` → `/index.html`;
    `VITE_API_URL` `fromService medro-api` (hostport).
- **`pnpm-workspace.yaml`** — `allowBuilds`: `@parcel/watcher`, `esbuild`, `puppeteer` = `true`.
- **`.gitignore`** — `Gerador_relatorios/` e `*.pdf` adicionados. `apps/*/.env`, `apps/*/node_modules`,
  `apps/report-print/dist` ignorados. **Código de `apps/report-print` e `apps/pdf-worker` É versionado.**
- **`.env.example`** (raiz) — bloco `# ── Gerador de Laudos ──` com as 6 envs novas.
- **`apps/api/.env`** (local, gitignored) — `REPORT_PRINT_URL=http://localhost:5180`,
  `PDF_WORKER_URL=http://localhost:8100`, `PDF_WORKER_TOKEN=dev-worker-token`, `GRAPH_ENABLED=true`.

---

## 5. Estado do repositório (nada commitado ainda)

Branch `main`. Último commit: `9c4f11e`. **Toda a implementação abaixo está sem commit:**

**Novos (untracked):**
- `apps/api/src/routes/laudosGen.ts`
- `apps/api/src/services/laudosGen/` (`dataverse.ts`, `sharepoint.ts`)
- `apps/pdf-worker/` (código; `node_modules` ignorado)
- `apps/report-print/` (código; `node_modules` e `dist` ignorados)
- `apps/web/src/modules/laudos-gen/` (`LaudosGenApp.tsx`, `api.ts`, `layout.ts`)
- `apps/web/src/components/desktop/TaskView.tsx` ← **não é do laudos-gen**, ver abaixo

**Modificados:**
- `apps/api/src/config.ts`, `apps/api/src/server.ts`
- `apps/web/src/modules/registry.ts`, `apps/web/src/modules/ModuleHost.tsx`
- `.env.example`, `.gitignore`, `render.yaml`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`
- **`apps/web/src/components/desktop/{Desktop,Dock,MenuBar,WindowFrame}.tsx` + `apps/web/src/lib/wm.ts`**
  → trabalho do **window manager** ainda **não commitado**: controles de janela estilo
  **Windows/Linux à direita** (minimizar/maximizar/fechar com ícones lucide, não os "traffic lights"),
  botão **"Organizar janelas na tela"** (`tile()` em `wm.ts` — grade proporcional para 2/3/4/5+ janelas),
  **TaskView** (multitarefa, botão `AppWindow` com badge de contagem na MenuBar), `bounds` no store.
  ⚠️ O resumo anterior dizia que isso estava em `447c758`, mas **está pendente de commit**.

**Sugestão de commits** (separar os dois assuntos):
1. `feat(desktop): controles de janela à direita, organizar janelas (tile) e TaskView`
   → `Desktop/Dock/MenuBar/WindowFrame.tsx`, `wm.ts`, `TaskView.tsx`.
2. `feat(laudos-gen): módulo Gerador de Laudos (DPT) — leitura, rascunho e emissão de PDF`
   → tudo de `laudos-gen`, `apps/pdf-worker`, `apps/report-print`, config/server/registry/ModuleHost,
   `render.yaml`, `.env.example`, `.gitignore`, `pnpm-workspace.yaml`.

---

## 6. Como rodar em dev

```bash
# 1. API Medro (porta 3333) — precisa de apps/api/.env com Dataverse + Graph + as 3 envs novas
pnpm --filter @medro/api dev

# 2. pdf-worker (porta 8100)
pnpm --filter @medro/pdf-worker dev

# 3. bundle de impressão (porta 5180) — use preview (build servido), não o dev server
pnpm --filter @medro/report-print build && pnpm --filter @medro/report-print preview

# 4. web Medro
pnpm --filter @medro/web dev
```

- Login dev: `POST /api/auth/dev-login {usuario:"douglasnou"}` (só `NODE_ENV != production`).
  `douglasnou` tem `DPT` e filial "São Luís".
- OS de teste que funciona ponta a ponta: **`11539-AL`** (cliente HYDRO ALUNORTE, unidade Barcarena).
- Teste rápido do pipeline:
  `POST /api/laudos-gen/render {osId:"11539-AL", arquivar:false}` → 200, ~3,1 MB, ~6 s.

**Builds que devem passar:** `pnpm --filter @medro/api build`, `pnpm --filter @medro/web build`
(ambos passavam na última execução).

---

## 7. Riscos / pontos de atenção

### 7.1 Upload do PDF para o SharePoint trava em dev  ⚠️ VERIFICAR NO RENDER
- Sintoma: PUT com corpo > ~1 MB para `*.sharepoint.com` → "Headers Timeout" / abort, com `fetch` **e** `undici`.
- Já confirmado por probes isolados: a pasta destino **existe**, a app registration **tem permissão de
  escrita** (PUT de 100 bytes → 201), `createUploadSession` responde ~3,5 s, `graph.microsoft.com` OK.
- Conclusão: **restrição de egress da rede local** desta máquina. O `Gerador_relatorios` original
  fazia esse mesmo upload em produção no Render (com axios) sem problema.
- Mitigação já aplicada: upload session + chunks de 1.6 MiB + 3 retries + timeouts de 25 s;
  arquivamento **fire-and-forget** (nunca segura o PDF); `GET /render/status/:osId` + poll no front +
  mensagens honestas ("Não foi possível arquivar no SharePoint").
- **Ação para o próximo chat:** validar `uploadReportPdf` num deploy Render (ou outra rede) antes de
  considerar o arquivamento "pronto". `listFotos` retornou listas vazias — confirmar se é convenção
  de caminho ou pasta sem arquivos.

### 7.2 Segurança / go-live (constraints do usuário, ainda válidas)
- `DATAVERSE_CLIENT_SECRET` foi colado no chat uma vez → **rotacionar antes do go-live**.
- Nenhum `.env` pode ser commitado (todos gitignored). Conferir antes de cada commit.
- `POST /api/auth/dev-login` é **dev-only** — remover ou manter atrás de guard antes de produção.
- Chaves de IA vão no `.env` do Medro (autorizado). O model no Dataverse guarda só o *provider*.

---

## 8. Pendências

### Fase 1 (o que falta para o módulo funcionar de ponta a ponta)
1. **Portar os ~50 editores** de `Gerador_relatorios/frontend/src/features/report-builder/pages`
   e `.../blocks` para `apps/web/src/modules/laudos-gen/` **com identidade visual Medro**
   (o output/print das páginas continua como está). É o grosso do trabalho.
   Substituir o placeholder do painel direito em `LaudosGenApp.tsx`, ligado aos hooks
   `useRascunho`/`useSalvarRascunho` já existentes.
   Sugestão de fatia vertical inicial: capa, sumário, dados de processo, diagnóstico,
   relatório fotográfico, ensaios de resistência, encerramento.
   **Confirmar com o usuário** se porta todas as páginas ou começa por um subconjunto.
2. **Endpoints de IA de diagnóstico** — portar `gerarTextoIA` e `gerarDiagnosticoLoteIA` de
   `Gerador_relatorios/backend/.../ia.js` (rotas `/modelos/:id/ia-gerar` e `/ia-gerar-lote`),
   usando as chaves do `.env` do Medro (o model só tem o provider).
3. **Upload de capa** — portar `/api/upload-capa` + `/api/capas/:id`.
4. **Confirmar upload SharePoint no Render** (§7.1).

### Depois
5. **Commitar** os dois blocos (§5).
6. **Apagar `Gerador_relatorios/`** quando o módulo estiver completo (plano do usuário).

---

## 9. Tabelas de referência

### Dataverse (gerador de laudos)
| Tabela | Uso | Campos-chave |
|---|---|---|
| `cr4a1_zb6_relatorios` | OS / cabeçalho do laudo | `cr4a1_novacoluna` (nº OS), `cr4a1_cliente_nome`, `cr4a1_tag_kairos`, `cr4a1_zb6_filial` (0101–0104) |
| `cr4a1_rascunhorelatorios` | rascunhos (estado do editor) | `cr4a1_osid`, `cr4a1_tipo`, `cr4a1_conteudojson`, `cr4a1_chave`, `cr4a1_rascunhorelatorioid` |
| `cr4a1_modelos_relatorioses` | modelos de laudo | `cr4a1_nome_modelo`, `cr4a1_configuracao_json`, `cr4a1_ia_prompt/provider/api_key` |
| `cr4a1_historico_gerador_relatorioses` | histórico de PDFs emitidos | `cr4a1_usuario`, `cr4a1_os`, `cr4a1_cliente`, `cr4a1_adicionado_em` |
| `cr4a1_peritagem_b04s` | peritagem | por OS |
| `cr4a1_balanceamentos` | balanceamento | `cr4a1_conteudo_baldados` (texto INI) |

### SharePoint
- Drive `b!FtUeR6-xYEutseM1MLQP0luN9WQa7dVAm7IrWRchyFnVHstz2SkdR6IH4JOZ3kJr` =
  biblioteca **"Doc Técnicos"** no site KairosMotores (mesma já usada pelo Medro).
- PDF do laudo: `/Fotos Peritagens/{unidade}/{cliente}/{osId}/Relatorio Inicial/Relatorio_{osId}.pdf`
- Fotos: `/Fotos Peritagens/{unidade}/{cliente}/{osId}/{Peritagem|Teste|Montagem|Qualidade}/`
- Upload grande = `createUploadSession` + PUT em chunks múltiplos de 320 KiB.

---

## 10. Mapa de arquivos (laudos-gen)

```
apps/api/src/
  routes/laudosGen.ts                     rotas DPT-gated + POST /render + status
  services/laudosGen/
    dataverse.ts                          queries (OS, rascunho, modelos, histórico, balanceamento…)
    sharepoint.ts                         uploadReportPdf() + listFotos()
  config.ts  (mod)                        REPORT_PRINT_URL, PDF_WORKER_URL, PDF_WORKER_TOKEN, *_API_KEY
  server.ts  (mod)                        register(laudosGenRoutes, { prefix: "/api" })

apps/pdf-worker/                          Express + Puppeteer → PDF A4
  src/server.js

apps/report-print/                       React 19 / Vite 7 — cópia print-only do frontend do Gerador
  src/config.js  (reescrito)             API_BASE_URL, AUTH_TOKEN, apiFetch
  src/main.jsx   (reescrito)             shim window.fetch → Bearer t
  src/App.jsx    (1 mudança)             condição do window.reportIsReady
  src/features/report-builder/pages|blocks   ~50 páginas do laudo (INTOCADAS)

apps/web/src/modules/
  registry.ts   (mod)                    MODULES["laudos-gen"], access ["DPT"]
  ModuleHost.tsx (mod)                   render <LaudosGenApp />
  laudos-gen/
    LaudosGenApp.tsx                     shell Medro (toolbar + navegador + editor PLACEHOLDER)
    api.ts                               hooks React Query
    layout.ts                            DEFAULT_LAYOUT (17 páginas)

render.yaml (mod)                        medro-api + medro-pdf-worker + medro-report-print
```
