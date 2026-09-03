# 07 — Gerador de Laudos (módulo `laudos-gen`)

> **Handoff para o próximo chat.** Documento vivo. Última atualização: 2026-09-03
> (17 editores + prévia tempo real só-leitura + navegação + IA do diagnóstico
> FUNCIONANDO + seletor de fotos do SharePoint + primitivos de UI Medro:
> Select/Combobox/DatePicker/Checkbox/Popover — §4.4).
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
  toolbar (busca de OS, "Carregar", chips OS/cliente/unidade, **seletor de Modelo**,
  toggle da prévia, "Salvar"/"Salvo", "Gerar PDF"), banner do PDF com **"Abrir PDF gerado"**
  + link do SharePoint quando arquivado, e corpo em 3 colunas
  `lg:grid-cols-[220px_minmax(340px,440px)_minmax(0,1fr)]` =
  **navegador de páginas** + **editor (forms Medro)** + **prévia do PDF em tempo real**.
  Salva o rascunho ao trocar de página (se sujo). Sem OS carregada, mostra
  **"Rascunhos — continuar de onde parou"** (`GET /laudos-gen/rascunhos`) e
  **"Últimos PDFs emitidos"** (`GET /laudos-gen/historico-pdf`) — clicar carrega a OS.
  Seletor de Modelo usa `useModelos` + `L.applyModelo(row)` (`applyModelo()` em `state.ts`,
  mesma lógica do `handleSelectTemplate` antigo — troca layout/tabelas/blocos, seta
  `activeTemplateId`, não mexe em `osData` nem nos dados já preenchidos).
- **`src/modules/laudos-gen/state.ts`** — tipo `LaudoState` = objeto `state` do rascunho
  1:1 com o que o `apps/report-print/src/App.jsx` lê/escreve (`osData`, `modelConfig`,
  `diagValues`, `motorSections`, `mechData`, `p11Data`, `resistanceData`, `normativeData`,
  `customTableRows`/`tableHeaders`/`tableSubColumns`, `textBlocks`, `imageBlocks`,
  `freePageBlocks`, `balanceData`, `diagVisibility`, …). `emptyLaudoState()` espelha os
  `useState(...)` do App.jsx; `mergeRascunho(raw)` funde o rascunho salvo sobre os defaults.
- **`src/modules/laudos-gen/useLaudoDoc.ts`** — reúne OS + rascunho + auxiliares num único
  documento editável; semeia `osData`/`historyData`/`balanceData` das queries quando o
  rascunho ainda não os tem (o PDF em `?print=true` lê essas chaves do rascunho e NÃO refaz
  o fetch); `patch(recipe)` (structuredClone + mutate), `dirty`, `save()` (persiste o
  documento inteiro, sempre com `osData` embutido).
- **`src/modules/laudos-gen/fields.tsx`** — primitivos de form Medro (`EditorSection`,
  `FieldGrid`, `TextField`, `AreaField`, `SelectField`, `DateField`, `TriToggle` SIM/NÃO/—,
  `StatusToggle` Aprovado/Reprovado, `CheckboxField`, `DeferredNote`).
- **Primitivos de UI Medro** (`apps/web/src/components/ui/`, reutilizáveis fora do módulo) —
  substituem os `<select>`/checkbox/data nativos pela identidade do app:
  `select.tsx` (Radix Select — painel renderizado pelo app), `combobox.tsx` (lista com
  busca), `date-picker.tsx` (`react-day-picker` v10 + `date-fns` pt-BR — input de texto +
  calendário; grava `dd/MM/yyyy`, lê vários formatos), `checkbox.tsx` (Radix Checkbox +
  `CheckboxField`), `popover.tsx` (Radix Popover no estilo do `dropdown-menu.tsx`).
  Deps novas: `@radix-ui/react-select`, `-checkbox`, `-popover`, `react-day-picker`.
  Adotados no módulo: seletor de Modelo → `Combobox`; Capa → `SelectField`; datas de
  Dados de Processo (`cr4a1_data_rec`, `cr4a1_data_relat`) → `DateField`; "usar subcolunas"
  da Tabela Livre → `CheckboxField`. (Outros módulos ainda usam o `<select>` nativo — migrar
  aos poucos.)
- **`src/modules/laudos-gen/editors.tsx`** — **os 17 editores portados** com UI Medro, um
  por `page.type`, + `renderEditor({page, doc, patch})`:
  Capa, Sumário (títulos das páginas), Dados de Processo (campos da `osData`),
  Diagnóstico (f1–f8 + visibilidade + histórico só-leitura), Relatório Fotográfico
  (`motorSections`: título/evidências/serviços/nomes por bloco), Avaliação Mecânica e de
  Mancais (`mechData`: Ø/interf/toler/exced/aprovado), Componentes Auxiliares (`p11Data`:
  instrumentos + rolamentos/vedação/auxiliar), Ensaios de Resistência (`resistanceData`),
  Referências Normativas (`normativeData` + IA/IP calculados), Tabela Livre
  (`customTableRows`/headers/subcolunas), Balanceamento (`balanceData` editável), Texto/
  Imagem/Página Livre, e fallback "sem campos" (contracapa, nossos serviços, descrição dos
  ensaios, encerramento).
  **IA do Diagnóstico** (`DiagnosisEditor`): campo "Resumo do problema" + botão "Gerar
  diagnóstico completo" (lote) + botão "IA" por campo (f2/f4/f5/f6). Habilita só com um
  **Modelo** selecionado. `useIaGerar`/`useIaGerarLote` → rotas abaixo. O resultado preenche
  os campos para o técnico revisar (não salva sozinho).
  **Fotos** (`PhotoField` em `editors.tsx`): seletor "Escolher do SharePoint" por slot no
  Relatório Fotográfico (`motorSections[k].photos[i] = [{id,nome,url}]`) e na Avaliação
  Mecânica/Mancais (`mechData[k].photo = {id,nome,url}`) — galeria de `useFotosOs`
  (`GET /laudos-gen/os/:osId/fotos`, 4 categorias). Upload local ainda não portado.
- **Prévia do PDF**: `iframe` para `${VITE_REPORT_PRINT_URL}/admin?os=…&print=true&embed=1&t=<jwt>`.
  No `embed=1` o `report-print` não chama a API, esconde a interface antiga **e todos os
  inputs/botões de edição** (só leitura) e recebe o `state` por `postMessage` — prévia **em
  tempo real** (~250 ms após cada edição). Ver §7.3.
  Nova env do front **`VITE_REPORT_PRINT_URL`** (default `http://localhost:5180`).
- **`apps/report-print/src/App.jsx`** — 2ª mudança de lógica (além do `window.reportIsReady`):
  const `isEmbed` + `useEffect` que escuta `message` (`laudo:preview`) e reidrata os setters;
  `?os=` effect e `fetchTemplatesAlbum` pulados no embed; `<style>` inline + classe
  `embed-mode` escondem `report-toolbar`/FABs/overlays, `.no-print`, e todo `input/textarea/
  select` (mostra `.print-only`). Caminho do pdf-worker (`?print=true` sem `embed`) **intocado**.
- **Backend novo**:
  - `GET /laudos-gen/rascunhos` — `listarRascunhos()` (`select osid/tipo/modifiedon`).
  - `POST /laudos-gen/modelos/:id/ia-gerar` e `.../ia-gerar-lote` — `services/laudosGen/ia.ts`
    (gemini com fallback de modelo em **429 e 404**, groq e openrouter OpenAI-compatible).
    Lista de modelos Gemini: `gemini-3.6-flash` primeiro (o `2.5-flash` foi aposentado
    p/ contas novas). O modelo dá `cr4a1_ia_provider` + `cr4a1_ia_prompt` (`getModeloIa()`);
    a **chave vem do `.env`** (`GEMINI_API_KEY` / `GROQ_API_KEY` / `OPENROUTER_API_KEY` —
    já copiadas do `Gerador_relatorios/backend/.env` p/ `apps/api/.env`). Sem chave → 400
    `ia_nao_configurada`. ✅ **Testado ponta a ponta** (modelo "Modelo Padrão", provider
    gemini): 200 OK, os 4 campos do diagnóstico preenchidos.
  - `listFotos` agora loga o erro do Graph (path/permissão) em vez de engolir — ver §7.1.

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

## 5. Estado do repositório

Branch `main`. Commitado e enviado (`origin/main`):
- `e3fb06a` — `feat(desktop): controles de janela à direita, tile, TaskView`
- `0d3848f` — `feat(laudos-gen): módulo base (leitura, rascunho, emissão de PDF)`
- `083981b` — `feat(laudos-gen): 17 editores Medro, prévia em tempo real, IA e fotos do SharePoint`

**Sem commit** (config de IA + primitivos de UI Medro):
- Novos: `apps/web/src/components/ui/{select,combobox,date-picker,checkbox,popover}.tsx`
- Modificados:
  - `apps/api/src/services/laudosGen/ia.ts` (modelos Gemini atuais; fallback também em 404)
  - `apps/web/src/modules/laudos-gen/{LaudosGenApp.tsx,editors.tsx,fields.tsx}` (adotam
    Combobox/Select/DatePicker/Checkbox)
  - `apps/web/package.json` + `pnpm-lock.yaml` (`@radix-ui/react-select`, `-checkbox`,
    `-popover`, `react-day-picker`)
  - este doc
- Local (gitignored): `apps/api/.env` — `GEMINI_API_KEY` / `GROQ_API_KEY` / `OPENROUTER_API_KEY`
  copiadas de `Gerador_relatorios/backend/.env`.

---

## 6. Como rodar em dev

```bash
# 1. API Medro (porta 3333) — precisa de apps/api/.env com Dataverse + Graph + as 3 envs novas
pnpm --filter @medro/api dev

# 2. pdf-worker (porta 8100)
pnpm --filter @medro/pdf-worker dev

# 3. bundle de impressão (porta 5180) — use preview (build servido), não o dev server
#    também é a prévia dentro do módulo; precisa de WEB_ORIGIN da API incluindo :5180 (§7.3)
pnpm --filter @medro/report-print build && pnpm --filter @medro/report-print preview

# 4. web Medro — precisa de apps/web/.env (ou default) com VITE_REPORT_PRINT_URL=http://localhost:5180
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

### 7.3 Prévia do PDF no módulo — como funciona
- `iframe` do `apps/report-print` em **`?print=true&embed=1`**. No modo `embed=1` o bundle:
  (a) **não faz nenhuma chamada à API** — não há CORS a resolver; (b) esconde toda a
  interface antiga (toolbar, FABs, overlays) **e todo campo editável** (`.no-print`, mais
  `input`/`textarea`/`select` — alguns campos do report não têm `.no-print`), mostrando
  `.print-only` — a prévia é só leitura, a edição é toda na interface Medro (exceto
  interações "de documento": sumário clicável, gráficos); (c) recebe o `state` inteiro do
  rascunho por **`postMessage`** e reidrata os mesmos setters do `loadFullData`.
- O Medro empurra `{type:'laudo:preview', state: doc}` ~250 ms depois de cada edição →
  **prévia em tempo real**, sem precisar salvar.
- Front: env **`VITE_REPORT_PRINT_URL`** (default `http://localhost:5180`).
- O `POST /render` (pdf-worker) continua usando `?print=true` **sem** `embed=1` — caminho
  intocado; `WEB_ORIGIN` não precisa mais listar :5180.
- A prévia reflete o rascunho em memória (não salvo). "Gerar PDF" salva antes de renderizar.

---

## 8. Pendências

### Fase 1 (o que falta para o módulo funcionar de ponta a ponta)
1. ✅ **Editores portados** (17) + prévia em tempo real + navegação (rascunhos, modelos,
   histórico de PDFs) — ver §4.4.
2. ✅ **IA do diagnóstico FUNCIONANDO** — rotas + `services/laudosGen/ia.ts`, botões no
   `DiagnosisEditor`, chaves no `apps/api/.env`, modelos Gemini atuais. Testado: 200 OK.
   O modelo precisa de `cr4a1_ia_provider` preenchido (UI de config ainda pendente — item 5).
3. **Fotos** — seletor "Escolher do SharePoint" já religado (`PhotoField`). Falta:
   (a) `listFotos` retornou vazio p/ 11539-AL — ver §7.1 (agora loga o erro do Graph);
   (b) portar **upload local** (`/api/upload-temp/:categoria`) e **upload de capa**
   (`/api/upload-capa` + `/api/capas/:id`); (c) auto-import da peritagem
   (`/api/os/:id/peritagem-fotos` + `aplicarFotosAutomaticas`).
4. **Confirmar upload SharePoint no Render** (§7.1).
5. **UI Medro para config de IA do modelo** (prompt + provider) — hoje só via app antigo.

### Depois
6. **Commitar** o porte + esta rodada (§5).
7. **Apagar `Gerador_relatorios/`** quando o módulo estiver completo (plano do usuário).

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
  routes/laudosGen.ts  (mod)             + GET /rascunhos, POST .../ia-gerar[-lote]
  services/laudosGen/
    dataverse.ts  (mod)                   + listarRascunhos(), getModeloIa()
    sharepoint.ts (mod)                   listFotos() loga erro do Graph
    ia.ts         (novo)                  gerarTextoIA / gerarDiagnosticoLoteIA (gemini/groq/openrouter)
  config.ts  (mod)                        REPORT_PRINT_URL, PDF_WORKER_URL, PDF_WORKER_TOKEN, *_API_KEY
  server.ts  (mod)                        register(laudosGenRoutes, { prefix: "/api" })

apps/pdf-worker/                          Express + Puppeteer → PDF A4
  src/server.js

apps/report-print/                       React 19 / Vite 7 — cópia print-only do frontend do Gerador
  src/config.js  (reescrito)             API_BASE_URL, AUTH_TOKEN, apiFetch
  src/main.jsx   (reescrito)             shim window.fetch → Bearer t
  src/App.jsx    (2 mudanças)            window.reportIsReady + modo embed=1 (postMessage)
  src/features/report-builder/pages|blocks   ~50 páginas do laudo (INTOCADAS)

apps/web/src/modules/
  registry.ts   (mod)                    MODULES["laudos-gen"], access ["DPT"]
  ModuleHost.tsx (mod)                   render <LaudosGenApp />
  laudos-gen/
    LaudosGenApp.tsx  (mod)              navegador + editor + prévia tempo real + modelo +
                                        rascunhos/histórico na tela vazia
    api.ts            (mod)              hooks RQ + useRascunhos/useIaGerar/useIaGerarLote
    layout.ts                            DEFAULT_LAYOUT (17 páginas)
    state.ts          (novo)             LaudoState + emptyLaudoState/mergeRascunho/applyModelo
    useLaudoDoc.ts    (novo)             OS+rascunho+auxiliares → doc; patch/save/applyModelo
    fields.tsx        (novo)             primitivos de form Medro (+ DateField, CheckboxField)
    editors.tsx       (novo)             17 editores + renderEditor() + PhotoField + IA

apps/web/src/components/ui/             primitivos reutilizáveis (fora do módulo)
  select.tsx       (novo)               Radix Select — lista suspensa do app
  combobox.tsx     (novo)               lista suspensa com busca
  date-picker.tsx  (novo)               react-day-picker + date-fns pt-BR
  checkbox.tsx     (novo)               Radix Checkbox + CheckboxField
  popover.tsx      (novo)               Radix Popover no estilo do dropdown-menu

apps/web/.env.example (mod)             VITE_REPORT_PRINT_URL
render.yaml                             medro-api + medro-pdf-worker + medro-report-print
```
