# 07 — Gerador de Laudos (módulo `laudos-gen`)

> **Handoff para o próximo chat.** Documento vivo. Última atualização: 2026-09-04
> (17 editores + prévia tempo real + IA FUNCIONANDO + fotos SharePoint corrigidas §7.1
> + primitivos de UI Medro + shell — §5 **+ §11 Fases A, B e C do construtor de
> modelos PRONTAS**: gerenciador `ModelosManager` (§11.7), construtor `ModeloBuilder`
> (§11.7), bloco `ai-text` por IA + upload de capa própria (§11.8)
> **+ §12: shell do sistema — MenuBar customizável, transição de boas-vindas + som,
> o sistema de Widgets (Fases 1 e 2 + widgets de mais módulos), e §12.9 passe de
> animação "feel de SO" (framer-motion no shell: pop de janela, lupa do dock, stagger
> do launchpad/taskview, widgets)
> + §13: módulo Terceirizados portado do PowerApps (serviços externos por OS —
> pendentes de retorno / histórico / registrar retorno + KPIs + widget)**).
> **➡️ Existe agora um `README.md` técnico na raiz descrevendo o app inteiro — ler primeiro.**
> **➡️ PRÓXIMOS PASSOS abertos:** (laudos) validar num deploy Render — upload SharePoint §7.1
> + `PUBLIC_API_URL` da capa §11.8; designer de tabela avançado §11.4-3 (se pedirem).
> (widgets/shell) ver "Próximos passos" no fim do §12.
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

Branch `main`. Tudo commitado e enviado (`origin/main`):
- `e3fb06a` — desktop: controles à direita, tile, TaskView
- `0d3848f` — laudos-gen: módulo base
- `083981b` — laudos-gen: 17 editores, prévia tempo real, IA e fotos (1ª versão)
- `d3e2ea4` — ui: primitivos Medro (select/combobox/date-picker/checkbox/popover) + IA ligada
- `98035a4` — fix: `listFotos` por Graph search (ver §7.1)
- `e1e9326` — desktop: menu de contexto (botão direito)
- `52ac9b4` — desktop: status do dispositivo na barra do topo
- `e8b249c` — desktop: atalhos na área de trabalho + pasta de rascunhos (DPT)
- `2f0c2b5` — fix: fotos quebravam (não gravar a downloadUrl expirável no rascunho —
  agora `{id,nome}` + `GET /laudos-gen/foto/:id` redireciona p/ URL fresca)
- `a818dec` — desktop: menu de contexto no Dock + trava de acesso por módulo (`ModuleHost`
  respeita `MODULES[].access`; laudo = DPT-only em qualquer via de abertura)
- `088b618` — laudos-gen: janela "Laudos em andamento" (`RascunhosFolder`, pseudo-módulo
  `rascunhos-folder`, DPT) + `DELETE /laudos-gen/rascunho/:osId` + menu "Salvar como modelo"
  (só nome — `SaveModeloDialog` no `LaudosGenApp`, grava `modeloConfigFromDoc` inline)
- `d01bb3f` — desktop: pastas de apps no Launchpad (`lib/launchpadLayout.ts`), por navegador
- `bfeba72` — docs
- `f636d62` — **commit de outro dev** (medro-pro farol + módulo Usinagem/Caldeiraria +
  gestão de usuários). Fast-forward limpo (ele puxou meu trabalho antes). Tocou
  `ModuleHost.tsx` (branch `caldeiraria`) e `registry.ts` (token `SSMA`, label Caldeiraria)
  **sem conflito** com o meu `rascunhos-folder`.

⚠️ **Gotcha de build:** `pnpm --filter @medro/web build` acusa `"SSMA" not assignable to
AccessToken` se o `packages/shared/dist` estiver velho. Rodar `pnpm --filter @medro/shared
build` primeiro (o `pnpm dev` já faz). Depois disso web + api compilam limpos.

Local (gitignored): `apps/api/.env` — `GEMINI_API_KEY` / `GROQ_API_KEY` / `OPENROUTER_API_KEY`
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
  considerar o arquivamento "pronto".
- ✅ **`listFotos` resolvido** (commit `98035a4`): não era env nem permissão. As fotos de peritagem
  desta tenant ficam em **`/Peritagens/…/{osId}/`** (não em `/Fotos Peritagens/…/{categoria}/` —
  esse ramo só tem o PDF, em `Relatorio Inicial/`), com o nome no padrão `{osId}_{item}_{hash}.jpg`,
  e a pasta de cliente nem sempre bate com `cr4a1_cliente_nome` ("PORTO" vs "VALE PORTO"). `listFotos`
  agora usa **Graph drive search `q='{osId}'`** (path fixo é só fallback) e agrupa por item.
  OS com fotos p/ testar: **`1515-PO`** (15 fotos) / `1516-PO`. `11539-AL` não tem fotos.
- ✅ **Foto quebrada na prévia com rascunho antigo** (rodada 2026-09-04): rascunhos
  salvos antes do commit `2f0c2b5` guardaram a `@microsoft.graph.downloadUrl` (expira
  ~1 h) junto do `{id,nome}`. O lado Medro já ignora esse `url` e monta a `<img>` pelo
  `id`; o `report-print` (`App.jsx` `fotoObj`) só regenerava quando **não** havia `url`,
  então renderizava a URL morta. Agora `fotoObj` **sempre** reidrata pelo `id` (o `url`
  salvo só serve de fallback quando não há `id`). ⚠️ a prévia serve o **build** do
  `report-print` — rodar `pnpm --filter @medro/report-print build` para pegar o fix.

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
3. ✅ **Fotos** — `PhotoField` religado; `listFotos` corrigido (§7.1); rascunho grava só
   `{id,nome}` e `GET /laudos-gen/foto/:itemId` (aceita `?t=`) redireciona p/ URL fresca
   (commit `2f0c2b5`). Falta: **upload local** (`/api/upload-temp/:categoria`) e **auto-import
   da peritagem** (`/api/os/:id/peritagem-fotos` + `aplicarFotosAutomaticas`).
4. **Confirmar upload SharePoint no Render** (§7.1).
5. ✅ **Construtor + gerenciador de modelos de laudo — ver §11.** Fases **A, B e C
   PRONTAS**: `ModelosManager` + `ModeloBuilder` (§11.7); bloco `ai-text` por IA em
   página livre + upload de capa própria (§11.8). Falta só o designer de tabela
   avançado (§11.4 item 3 — "se pedirem") e validar a capa/upload num deploy real.

### Depois
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
  context-menu.tsx (novo)               Radix ContextMenu (botão direito)

apps/web/src/components/desktop/ + lib/  (shell — não é do laudos-gen, mas o toca)
  DesktopIcons.tsx / lib/desktopShortcuts.ts   atalhos na área de trabalho +
      pasta "Rascunhos DPT" (abre o laudos-gen); botão direito num rascunho →
      "Fixar na área de trabalho"
  DeviceStatus.tsx / lib/useDeviceInfo.ts       filial · rede · bateria · cidade na MenuBar
  Desktop.tsx / WindowFrame.tsx (mod)           menu de contexto (área de trabalho + janela)
  lib/wm.ts (mod)                               open(moduleId, title, params?) → params na janela;
      ModuleHost repassa; LaudosGenApp aceita initialOsId/openNonce e auto-carrega

apps/web/.env.example (mod)             VITE_REPORT_PRINT_URL
render.yaml                             medro-api + medro-pdf-worker + medro-report-print

apps/web/src/modules/laudos-gen/  (rodadas seguintes)
  RascunhosFolder.tsx (novo)            janela "Laudos em andamento" (pseudo-módulo rascunhos-folder)
apps/web/src/components/desktop/
  DesktopIcons.tsx / Dock.tsx (mod)     menu de contexto no Dock + ícone → open("rascunhos-folder")
  Launchpad.tsx (mod) / lib/launchpadLayout.ts (novo)   pastas de apps no Launchpad
apps/web/src/modules/ModuleHost.tsx (mod)   trava por MODULES[].access + branch rascunhos-folder
```

---

## 11. PRÓXIMA GRANDE ENTREGA — Construtor visual + gerenciador de modelos de laudo

**Combinado com o usuário.** Montar/editar modelos de laudo de forma visual (**sem escrever
código por modelo**) e um app próprio para gerenciá-los. Faseamento: **A → B → C**.

### 11.1 O que é um modelo (formato — recap)

Linha em `cr4a1_modelos_relatorioses`:
- `cr4a1_nome_modelo` — nome
- `cr4a1_configuracao_json` — a **estrutura do laudo**:
  ```
  { modelConfig: { capaAtiva, customCoverUrl, layout: [ {id, type, title, keys?} ] },
    textBlocks, imageBlocks,
    customTableRows, tableHeaders, tableColumns, tableSubColumns,
    freePageBlocks, diagVisibility }
  ```
- `cr4a1_ia_prompt` / `cr4a1_ia_provider` — IA do modelo (chave no `.env`; ver `getModeloIa`/`setModeloIaConfig`).

**`layout[].type` = qualquer um dos ~20 tipos já renderizados** pelo `apps/report-print` (lista
canônica = `state.ts` DEFAULT_LAYOUT + `editors.tsx` const `EDITORS` + o `switch` do
`report-print/src/App.jsx`): `PageCover`, `PageBackCover`, `PageOurServices`, `PageSummary`,
`PageProcessData`, `PageDiagnosisAndHistory` (IA), `PageMotorElectric` (relatório fotográfico,
usa `keys: [b1,b2]` → `motorSections`), `PageMechanicalEvaluation`, `PageBearingEvaluation`,
`PageComponentsEvaluation`, `PageResistanceTests`, `PageNormativeReferences`,
`PageStaticTestsDescription`, `PageCustomTable`, `PageBalanceamento`, `PageFinal`, e as
**customizadas**: `PageEditableText` (texto fixo → `textBlocks[id]`), `PageImageBlock` (imagem
fixa → `imageBlocks[id]`), `PageCustomTable` (tabela livre → `customTableRows[id]`+headers),
`PageBuilder` (página livre com blocos texto/imagem/tabela → `freePageBlocks[id]`).

Adicionar página = `push`/`splice` em `layout` + inicializar a chave de conteúdo do `id`.
O **sumário é auto-gerado do `layout`** (filtra `cover`/`back_cover`); título de cada entrada
editável no `SummaryEditor` — já pronto. Só criar um `page.type` **inédito** (fora dos ~20)
exigiria um renderer novo no report-print + editor novo — não é o caso aqui.

### 11.2 FASE A — Backend + hooks + app "Modelos de Laudo" (gerência)

**Backend** `apps/api/src/services/laudosGen/dataverse.ts` (MODELOS_SET = `cr4a1_modelos_relatorioses`):
- `getModelo(id)` → `dataverse.get(MODELOS_SET, id, {select:["cr4a1_nome_modelo","cr4a1_configuracao_json","cr4a1_ia_prompt","cr4a1_ia_provider"]})`
- `atualizarModelo(id, {nome?, configJson?})` → `dataverse.update(MODELOS_SET, id, {cr4a1_nome_modelo?, cr4a1_configuracao_json?})`
- `excluirModelo(id)` → `dataverse.remove(MODELOS_SET, id)` *(igual ao `excluirRascunho`)*
- `criarModelo` já existe (retorna void; se quiser o id novo p/ chamar ia-config na sequência,
  trocar p/ `Prefer: return=representation` ou ler o header `OData-EntityId` no `dataverse.create`)

`apps/api/src/routes/laudosGen.ts` (o `onRequest` que promove `?t=` e o `requireAccess("DPT")` já cobrem):
- `GET /laudos-gen/modelos/:id` → `getModelo`
- `PUT /laudos-gen/modelos/:id` — body zod `{ nome?: string, configuracaoJson?: string }` → `atualizarModelo`
- `DELETE /laudos-gen/modelos/:id` → `excluirModelo`
- *(opcional)* `POST /laudos-gen/modelos/:id/duplicar` — lê + cria cópia; ou o front faz GET+POST.
- `GET/PUT /laudos-gen/modelos/:id/ia-config` — **já existem** (`getModeloIaConfig` devolve
  `{prompt, provider, apiKeyPreview}`; `setModeloIaConfig` grava prompt/provider — a chave
  vem do `.env`, então o campo apiKey pode sumir da UI).

**Hooks** `apps/web/src/modules/laudos-gen/api.ts` (padrão dos existentes):
`useModelo(id)`, `useAtualizarModelo()`, `useExcluirModelo()`, `useDuplicarModelo()`,
`useIaConfig(id)`, `useSetIaConfig()`. Invalidar `keys.modelos` + `["laudos-gen","modelo",id]`.

**`state.ts`** — extrair de `SaveModeloDialog` (hoje inline no `LaudosGenApp.tsx`) a função
`modeloConfigFromDoc(doc): string` (`JSON.stringify` de `{modelConfig, customTableRows,
tableHeaders, tableColumns, tableSubColumns, textBlocks, imageBlocks, freePageBlocks,
diagVisibility}`). O inverso `applyModelo(draft, json, id)` **já existe**.

**App** — pseudo-módulo `"modelos-folder"` (igual `rascunhos-folder`):
- `registry.ts` — `"modelos-folder"` no union `ModuleId` (⚠️ o outro dev já mexeu nesse union — rebase cuidadoso).
- `ModuleHost.tsx` — `if (moduleId === "modelos-folder") return gate("DPT") ?? <ModelosManager/>;`
- `modules/laudos-gen/ModelosManager.tsx` (novo):
  - Lista `useModelos()` — card: nome · nº de páginas (`JSON.parse(cfg).modelConfig.layout.length`) ·
    "IA: {provider}" ou "sem IA" · atualizado em.
  - Ações por card: **Editar** → `open("modelo-builder", `Modelo: ${nome}`, { modeloId })`;
    **Duplicar** (`useDuplicarModelo`); **Renomear** (dialog `Sheet side=center`);
    **Excluir** (confirm, `useExcluirModelo`); **Config IA** (dialog: `SelectField` provider
    [gemini/groq/openrouter] + `AreaField` prompt → `useSetIaConfig`).
  - Botão **"+ Novo modelo"** → `open("modelo-builder", "Novo modelo", { modeloId: null })`.
- Ponto de entrada: um item no menu "⋯" ao lado do seletor de Modelo no `LaudosGenApp`
  ("Gerenciar modelos…") + opcionalmente um atalho na área de trabalho (`desktopShortcuts`
  kind novo) / entrada no `registry` MODULES com `access:["DPT"]`.

### 11.3 FASE B — Construtor de modelo (`ModeloBuilder.tsx`)

Pseudo-módulo `"modelo-builder"` (`ModuleHost` branch + id no union). Componente dedicado que
**reutiliza `editors.tsx` / `renderEditor` / `fields.tsx` / a prévia** do módulo.

- **`useModeloDoc(modeloId | null)`** — análogo a `useLaudoDoc` mas SEM OS:
  - `modeloId` → `useModelo(id)` → `mergeRascunho({})` + `applyModelo(draft, cfg, id)`;
  - `modeloId === null` → `emptyLaudoState()` com `osData: null`;
  - expõe `doc`, `patch`, `dirty`, `nome`/`setNome`, `save()` (POST se novo / PUT se editando,
    body `{ nome, configuracaoJson: modeloConfigFromDoc(doc) }`).
- **3 colunas:**
  - **Esquerda — páginas** (`doc.modelConfig.layout`):
    - reordenar: ↑/↓ simples (sem dep) **ou** `@hello-pangea/dnd` (adicionar no `apps/web`;
      já está no `report-print`).
    - remover página (decidir se `cover`/`final` são fixos — perguntar ao usuário).
    - **"+ Adicionar página"** — `DropdownMenu`/`ContextMenu` com `PAGE_TYPES` agrupados
      (Estruturais / De dados / Customizadas). Ao escolher:
      ```
      patch(d => {
        const id = `p_${Date.now().toString(36)}_${rand}`;
        const page = { id, type, title: LABEL[type] };
        if (type === "PageMotorElectric") page.keys = [`${id}_b1`, `${id}_b2`];
        d.modelConfig.layout.splice(posDepoisDaSelecionada, 0, page);
        if (type === "PageEditableText") d.textBlocks[id] = { title: "", content: "" };
        if (type === "PageImageBlock")   d.imageBlocks[id] = "";
        if (type === "PageCustomTable")  { d.customTableRows[id] = {title:"",rows:[["",""]]}; d.tableHeaders[id] = ["Coluna 1","Coluna 2"]; }
        if (type === "PageBuilder")      d.freePageBlocks[id] = [];
      })
      ```
  - **Centro — editor da página**: `renderEditor({ page, doc, patch })` — o MESMO. Capa =
    `SelectField` capaAtiva + campo `customCoverUrl` (upload = Fase C). Diagnóstico = campos +
    (opcional) painel "IA deste modelo" que grava via `useSetIaConfig` (ou deixar só no
    gerenciador).
  - **Direita — prévia**: iframe `report-print` `?print=true&embed=1`. Como não há OS, empurrar
    por `postMessage` um `state` com `osData` fake mínimo
    (`{cr4a1_novacoluna:"MODELO", cr4a1_cliente_nome:"—", unidade_nome:"—", cr4a1_zb6_filial:"0102"}`)
    + o resto do `doc`. O embed já hidrata de `postMessage` (§7.3) — não precisa de OS real.
- **Salvar**: botão "Salvar" (dirty) → `save()`.

### 11.4 FASE C — Extras

- **Bloco "texto com IA" em página livre** (`PageBuilder`/`freePageBlocks`):
  - shape: `freePageBlocks[pageId].push({ id, type: "ai-text", data: { titulo, prompt, texto } })`
  - `FreePageEditor` (`editors.tsx`): renderizar `type === "ai-text"` com campo `prompt` +
    botão "Gerar" (`useIaGerar` — passa `data.prompt` como `resumo` e `data.titulo` como
    `campoLabel`; precisa de um `modeloId` com IA — o do modelo sendo montado) + textarea do
    `texto`.
  - `report-print` — **único toque em página**: `PageBuilder.jsx` / `BuilderContent.jsx` →
    `block.type === 'ai-text'` renderiza `block.data.texto` como parágrafo (ou título + parágrafo).
- **Upload de capa própria**: portar `POST /api/upload-capa` (+ `/capas/:id`) de
  `Gerador_relatorios/backend/server.js`. Onde gravar a imagem: SharePoint numa pasta "Capas"
  (reusar Graph) ou anexo no Dataverse. `modelConfig.customCoverUrl` recebe a URL final.
  `CoverEditor` ganha um `<input type=file>`.
- **Tabela livre "avançada"**: o `CustomTableEditor` portado só cobre 2 colunas + toggle de
  subcolunas. O `report-print/PageCustomTable.jsx` já suporta colunas/subcolunas arbitrárias
  (`tableColumns[id]`). Se o usuário quiser um designer de tabela completo, é estender esse
  editor (não o report-print).

### 11.5 Ordem de execução sugerida

1. **Fase A** — backend `GET/PUT/DELETE /modelos/:id` + hooks + `state.modeloConfigFromDoc` +
   `ModelosManager` (listar/duplicar/renomear/excluir/config-IA). Já entrega "gerenciar modelos".
2. **Fase B** — `ModeloBuilder` + `useModeloDoc` + menu "+ Adicionar página" + reorder/remover +
   prévia com OS fake. Já entrega "montar modelo de forma detalhada".
3. **Fase C** — bloco `ai-text` + upload de capa + (se pedirem) designer de tabela.

### 11.6 Arquivos a criar / tocar

| Onde | O quê |
|---|---|
| `apps/api/src/services/laudosGen/dataverse.ts` | `getModelo`, `atualizarModelo`, `excluirModelo` |
| `apps/api/src/routes/laudosGen.ts` | `GET/PUT/DELETE /laudos-gen/modelos/:id` (+ `/duplicar` opc.) |
| `apps/web/src/modules/laudos-gen/api.ts` | `useModelo`, `useAtualizarModelo`, `useExcluirModelo`, `useDuplicarModelo`, `useIaConfig`, `useSetIaConfig` |
| `apps/web/src/modules/laudos-gen/state.ts` | `modeloConfigFromDoc(doc)` (extrair do `SaveModeloDialog`) |
| `apps/web/src/modules/laudos-gen/ModelosManager.tsx` | **novo** — app de gerência (Fase A) |
| `apps/web/src/modules/laudos-gen/ModeloBuilder.tsx` + `useModeloDoc.ts` | **novos** — construtor (Fase B) |
| `apps/web/src/modules/ModuleHost.tsx` | branches `modelos-folder` e `modelo-builder` |
| `apps/web/src/modules/registry.ts` | 2 ids no union `ModuleId` (⚠️ rebase — o outro dev mexeu aqui) |
| `apps/web/src/modules/laudos-gen/editors.tsx` | bloco `ai-text` no `FreePageEditor` (Fase C) |
| `apps/report-print/src/features/report-builder/pages/PageBuilder.jsx` (+ `BuilderContent.jsx`) | render `ai-text` (Fase C) |
| deps | `@hello-pangea/dnd` no `apps/web` **se** for usar drag pra reordenar (senão ↑/↓ sem dep) |

### 11.7 Fases A e B — o que foi feito (rodada 2026-09-03)

**Backend** (`apps/api`):
- `services/laudosGen/dataverse.ts` — `getModelo(id)` (inclui `cr4a1_ia_prompt`),
  `atualizarModelo(id,{nome?,configuracaoJson?})`, `excluirModelo(id)`. `criarModelo`
  agora **devolve `{ id }`** (lê o id do `return=representation`). `listarModelos` passou a
  pedir `cr4a1_ia_provider` + `modifiedon` e `orderby: modifiedon desc` — **funcionam**
  (o card mostra a data e o selo "IA: {provider}"). *(A rodada anterior achou que a tenant
  ignorava esses campos; era só a API de dev rodando código velho — resolvido ao reiniciar.)*
- `routes/laudosGen.ts` — `GET /laudos-gen/modelos/:id`, `PUT /laudos-gen/modelos/:id`
  (zod `{nome?,configuracaoJson?}`), `DELETE /laudos-gen/modelos/:id`,
  `POST /laudos-gen/modelos/:id/duplicar` (copia estrutura + prompt/provider de IA, sufixo
  " (cópia)"). `POST /modelos` agora retorna `{ success, id }`.

**Frontend** (`apps/web/src/modules/laudos-gen`):
- `api.ts` — `ModeloDetalhe`, `useModelo`, `useAtualizarModelo`, `useExcluirModelo`,
  `useDuplicarModelo`, `useIaConfig`, `useSetIaConfig`; `useCriarModelo` agora tipa `{id}`.
  `keys.modelo(id)` / `keys.iaConfig(id)`.
- `state.ts` — **`modeloConfigFromDoc(doc)`** (inverso do `applyModelo`); `SaveModeloDialog`
  do `LaudosGenApp` passou a usá-la.
- `previewFrame.tsx` (**novo**) — `LaudoPreviewFrame` extraído do `LaudosGenApp` (era
  `PreviewFrame` local). Prop `osParam` + `overrideOsData` (o construtor manda uma OS
  fictícia `{cr4a1_novacoluna:"MODELO", …}` por postMessage — sem OS real, sem chamada à API).
  `LaudosGenApp` agora importa daqui.
- `useModeloDoc.ts` (**novo**) — análogo ao `useLaudoDoc` sem OS. `modeloId` → `useModelo`
  + `mergeRascunho({})` + `applyModelo`; `modeloId` null → `emptyLaudoState()`. `patch`,
  `dirty`, `nome/setNome`, `save()` (POST se novo / PUT se existente, corpo
  `{nome, configuracaoJson: modeloConfigFromDoc(doc)}`). Após criar, passa a editar o id
  devolvido (se a API não devolver id, segue como "novo" **sem** zerar o doc).
- `ModelosManager.tsx` (**novo**) — pseudo-módulo `modelos-folder`. Grid de cards
  (nome · nº de páginas · IA/sem IA · data). Ações no `⋯`: Editar estrutura →
  `open("modelo-builder",…,{modeloId})`; Configurar IA (`Sheet` center: `SelectField`
  provider + `AreaField` prompt → `useSetIaConfig`); Renomear; Duplicar; Excluir
  (`Sheet` center de confirmação). Botão **"+ Novo modelo"** → `open("modelo-builder",
  "Novo modelo", { modeloId: "" })`.
- `ModeloBuilder.tsx` (**novo**) — pseudo-módulo `modelo-builder`, 3 colunas:
  esquerda = páginas (`↑/↓` sem dep, remover exceto `cover/back_cover/final`, **"+ Adicionar"**
  = `DropdownMenu` com os ~20 `page.type` agrupados em Estruturais / De dados / Customizadas;
  ao escolher, gera `id` `p_<ts>_<rand>`, inicializa a chave de conteúdo e `splice` depois da
  selecionada); centro = `renderEditor({page,doc,patch})` + `Input` do título da página;
  direita = `LaudoPreviewFrame` com `osParam="MODELO"` + `overrideOsData` fake.
- `ModuleHost.tsx` — branches `modelos-folder` → `<ModelosManager/>` e `modelo-builder` →
  `<ModeloBuilder modeloId={params.modeloId||null} openNonce={paramsNonce}/>`, ambos `gate("DPT")`.
- `registry.ts` — `"modelos-folder"` e `"modelo-builder"` no union `ModuleId`. **`modelos-folder`
  virou entrada em `MODULES`** (label "Modelos de Laudo", `short "Modelos"`, `icon LayoutTemplate`,
  `access:["DPT"]`, `accent teal`, `ready`) → aparece no **Dock / Launchpad / busca do Dock**.
  `modelo-builder` continua fora de `MODULES` (aberto com params).
- **Entradas**: (a) app **"Modelos de Laudo"** no Dock/Launchpad; (b) item **"Gerenciar
  modelos…"** no menu `⋯` ao lado do seletor de Modelo no `LaudosGenApp` (só com OS carregada).

**Verificado no browser** (api+web+report-print rodando): gerenciador lista os 8 modelos com
contagem de páginas; construtor abre "Novo modelo" com o layout padrão (17), "+ Adicionar"
insere (ex.: Relatório Fotográfico → vira 18, com `keys`), prévia renderiza a folha A4 com a
OS fictícia; **Salvar cria o modelo no Dataverse com 18 páginas** (`modeloConfigFromDoc` ok).

Depois de reiniciar a API, revalidado no browser: gerenciador lista os modelos **com data
e selo "IA: {provider}"**; abrir modelo no construtor, `↑/↓`, remover, "+ Adicionar" ok.

### 11.8 Fase C — bloco de texto por IA + upload de capa (rodada 2026-09-03)

**C1 — bloco `ai-text` em página livre** (`PageBuilder` / `freePageBlocks`):
- shape: `{ id, type: "ai-text", data: { titulo, prompt, texto } }`.
- `editors.tsx` `FreePageEditor` — botão **"+ Texto IA"** (além do "+ Texto"); componente
  `AiTextBlock`: campo Título, "Instrução para a IA" (`AreaField`), botão **"Gerar texto"**
  (`useIaGerar` → `resumo = data.prompt`, `campoLabel = data.titulo`; habilita só com
  `doc.activeTemplateId` — o modelo em edição —, senão mostra o aviso), textarea do `texto`
  para o técnico revisar. Helper `addFreeBlock(patch, pageId, type, data)`.
- `apps/report-print` — **único toque em página desta fase**: `PageBuilder.jsx` **e**
  `BuilderContent.jsx` renderizam `block.type === 'ai-text'` como `<h3>` (título) + `<p>`
  justificado (`whiteSpace: pre-wrap`). `pagination.js` conta blocos por `.length` (3/página)
  — `ai-text` entra na paginação sem mudança.

**C2 — upload de capa própria** (arquivo no Dataverse `cr4a1_caparelatorios`, como no app antigo):
- `services/laudosGen/dataverse.ts` — `salvarCapa(buffer, nome)` (cria a linha `cr4a1_chave`
  + PATCH binário em `cr4a1_arquivo`; apaga a linha órfã se o PATCH falhar) e `lerCapa(id)`
  (proxy do `$value`; MIME inferido do `Content-Disposition`, default `image/png`).
- `routes/laudosGen.ts` — `POST /laudos-gen/capas` (corpo **JSON** `{ nome, dataBase64 }` —
  **sem multipart/nova dep**; `bodyLimit` 14 MiB, imagem até 8 MiB; devolve
  `{ id, url }` **absoluta**) e `GET /laudos-gen/capas/:id` (**pública** — o `preHandler`
  do router agora libera esse GET, porque é `<img src>` sem header; `Cache-Control:
  immutable`). URL absoluta = `config.PUBLIC_API_URL || \`${req.protocol}://${req.headers.host}\``.
- `config.ts` — nova env **`PUBLIC_API_URL`** (opcional; em dev cai no host da requisição;
  **em produção no Render defina** — o `req.protocol` atrás do proxy não é https).
- `api.ts` — `useUploadCapa()` (lê o `File` como data URL → `POST /capas`).
- `editors.tsx` `CoverEditor` — componente `CoverUpload` (`<input type=file accept=image/*>`
  escondido num `<label>`, thumbnail, "remover") grava a URL devolvida em
  `modelConfig.customCoverUrl`; o `TextField` de URL manual virou "ou cole a URL…".
- **report-print não muda para a capa**: `resolveCoverImage` já usa `customCoverUrl` cru no
  `<img>`; como a URL é absoluta e o GET é público, funciona na prévia e no worker de PDF.

**Verificado no browser** (api reiniciada + web + report-print :5180):
- `POST /laudos-gen/capas` (base64 de um PNG) → 200 `{id,url}`; `GET url` público → 200,
  `Cache-Control: immutable`. Colando essa URL no `CoverEditor`, a **prévia do report-print
  renderiza a capa** (folha A4 vira a imagem).
- Página Livre → "+ Texto IA" → instrução → **"Gerar texto" retornou parágrafo do Gemini**
  (modelo "Modelo de capa alternativa", provider gemini) no textarea.

⚠️ **Pendências / notas:**
1. **Nada commitado ainda** ao escrever isto *(ver commits reais no §5)*.
2. Ficaram no Dataverse: modelo de teste **"Teste Fase B (Claude)"** (18 pág.) e **1 linha
   de capa** de teste (`cr4a1_caparelatorios`, PNG 1×1). Sem endpoint de delete de capa —
   apagar manualmente se incomodar; o modelo dá pra apagar pelo gerenciador.
3. **Capa em produção**: a URL absoluta usa `PUBLIC_API_URL` → `RENDER_EXTERNAL_URL`
   (auto no Render) → host da requisição. Já tem linha no `.env.example` da raiz; setar
   `PUBLIC_API_URL` explícito no Render só se o `RENDER_EXTERNAL_URL` não bastar.
4. Upload SharePoint do PDF (§7.1) continua pendente de validação no Render.
5. Designer de tabela avançado (§11.4 item 3) não feito — era "se pedirem".

---

## 12. Shell do sistema + Widgets (fora do Gerador de Laudos)

Rodada 2026-09-03/04. Tudo em `apps/web` (front). Commits: `a737dbf` (welcome só "Medro"),
`9f25242` (gestão de janelas), `a981816` (widgets Fase 1), `a9b800f` (widgets Fase 2),
`404554c` (widgets de mais módulos + `/laudos-gen/resumo`), `00f8fee` (widgets roláveis +
transparentes), `f1d942b` (fundo translúcido + loja rolável + seed), `8322b72` (README).
Builds `pnpm --filter @medro/web build` (e `@medro/api` quando tocou back) passando.

### 12.1 MenuBar customizável + cartões no hover

- **`lib/useMenuBarPrefs.ts`** (zustand+persist `medro.menubar`): `surface`
  (`solid`/`glass`/`transparent`), `position` (`top`/`left`/`right`), `autohide`,
  `hidden` (visibilidade por item). `BAR_ITEM_LABELS`, `isVerticalBar(p)`.
- **`components/desktop/MenuBar.tsx`** — reescrita: menu de contexto (botão direito na barra)
  com Aparência / Posição / Ocultar automaticamente / Mostrar itens / Restaurar padrão.
  Layout horizontal (topo) ou **trilho vertical** (`w-10`) nas bordas; modo transparente = só
  as informações com `text-shadow`; auto-ocultar com zona de revelação na borda. Mobile força
  topo+glass.
- **`components/desktop/Desktop.tsx`** — a área útil (`surfaceInset`) recua conforme a posição
  da barra (`left-10`/`right-10`/`top-7`) ou ocupa tudo no auto-ocultar; re-sincroniza os
  bounds das janelas.
- **`components/desktop/DeviceStatus.tsx`** + **`MenuBarCards.tsx`** (novo) — cada item
  (filial/rede/bateria/localização/relógio) abre um **cartão detalhado e interativo** no hover
  via **`components/ui/hover-card.tsx`** (novo — Popover + intenção de hover + "fixa no
  clique"). O de **Data e hora** tem relógio ao vivo + `react-day-picker` navegável.
- **`lib/useDeviceInfo.ts`** — passou a expor `battery.chargingTime/dischargingTime`, Network
  Information API (`connection`) e `coords`.
- **`components/ui/context-menu.tsx`** — novo `ContextMenuRadioItem`.

### 12.2 Transição de boas-vindas + som

- **`components/desktop/WelcomeOverlay.tsx`** — máquina de estados em 2 fases:
  1. assinatura **"Medro"** (~3 s: wordmark + régua que cresce + "Kairós Motores", dissolve);
  2. **saudação por horário + primeiro nome** (a linha extra mostra só "Medro", sem a filial).
  `prefers-reduced-motion` colapsa p/ ~1,5 s. Clique/tecla pula. Montada no `App` só quando
  `token && welcome`.
- **`lib/auth.ts`** — flag `welcome` (**não persistida**, `partialize` só `token`+`user`);
  `setSession` liga; `refreshUser` (usado pelo sync do `/auth/me`) **não** reanima;
  `dismissWelcome`.
- **`lib/startupChime.ts`** (novo) — som sintetizado via **Web Audio** (acorde de Lá maior
  arpejado + brilho agudo + filtro que abre). Toca no mount do overlay (após o gesto de
  login → autoplay liberado); falha em silêncio. Desligável:
  `localStorage['medro.mute-startup'] = '1'`.
- **`styles/index.css`** — keyframes `brand-in/out/rule`, `welcome-*`.

### 12.3 Gestão de janelas (`lib/wm.ts`) — commit `9f25242`

`tile()`/layout: 1 janela = semi-fullsize; 2 = split; 3+ = grade flutuante. Contexto — não foi
tocado nas rodadas de widget, mas o próximo chat deve saber que existe.

### 12.4 Widgets — visão geral

Tela inicial de widgets sobre a área de trabalho, com **dados reais** dos módulos.
Persistência **por navegador** (`localStorage`, decisão do usuário — vira PWA). Dois modos de
arranjo à escolha: **grade** (snap) e **livre** (px).

**Arquivos** (`apps/web/src/modules/widgets/` salvo indicado):

| Arquivo | Papel |
|---|---|
| `types.ts` | `WidgetId` (union), `WidgetSize` `sm/md/lg/wide` + `SIZE_CELLS`/`SIZE_LABEL`, `WidgetDef` (`id,title,desc,icon,module,accent?,sizes,defaultSize,access?,Component,ConfigForm?`), `WidgetProps` (`size,config,setConfig`), `WidgetConfigProps`, `PlacedWidget` (`instanceId,widgetId,size,gx,gy,fx,fy,config`). |
| `registry.tsx` | `WIDGETS: WidgetDef[]` + `widgetById(id)`. |
| `WidgetShell.tsx` | casca do widget: **fundo sempre translúcido** (`material-menu`); **sem seleção** → sem borda; **selecionado** → `bg-surface` sólido + `border-border` + `shadow-ios-2`. Menu de contexto: Tamanho (radio) · Atualizar · Configurar… (`Sheet` com `def.ConfigForm`) · Abrir {módulo} · Remover. `onContextMenu` faz `stopPropagation` (não abre o menu do desktop junto). `useWidgetRefetch(fn)` registra o refetch p/ o "Atualizar" (`fn` estável — `useCallback`). Exporta `WidgetLoading/WidgetError/WidgetEmpty`. |
| `WidgetLayer.tsx` | canvas. Renderiza **dentro** do `ContextMenuTrigger` de fundo do `Desktop` (que virou `overflow-y-auto` → rola). `contentH = max(bounds.h, widget mais baixo + 32)`. Drag (header) e resize (alça no canto inf-dir, aparece no hover) à mão, padrão do `WindowFrame` (`setPointerCapture`+deltas). `pickSize()` encaixa no tamanho permitido mais próximo. **Seleção**: clicar seleciona (um só); clicar a mesa vazia / `Esc` deseleciona; arrastar também seleciona. Clamp horizontal no render. `MobileWidgetStack` = pilha vertical (mobile, sempre `selected`). |
| `WidgetStore.tsx` | a "loja" (pane `z-[55]` estilo Launchpad). Agrupada por módulo, filtrada por acesso (`can(...)`), busca, toggle **Grade/Livre**. Estrutura de rolagem: overlay com `px-6 py-10 items-center`, painel `flex min-h-0 flex-1 flex-col`, lista `min-h-0 flex-1 overflow-y-auto`. |
| `lib/useWidgets.ts` | store zustand+persist `medro.widgets` (**version 1**, com `migrate`). `mode`, `items`, `storeOpen`, `seeded`. `add(id,size)` (acha célula livre via `freeGridSpot`), `remove`, `resize`, `moveGrid`/`moveFree` (**mantêm gx/gy E fx/fy em sync**), `setMode` (converte as posições), `setConfig`, `seedDefaults(picks)` (semeia 1×/navegador só se vazio), `reset`. Constantes `CELL=84 GAP=10 PITCH ORIGIN_X=16 ORIGIN_Y=12` + `gridToPx/pxToGrid/cellsToPx`. |
| `widgets/*.tsx` | um componente por widget. Chamam os hooks React Query **do próprio módulo** (cache compartilhado com a janela). |

**Entradas:** `Desktop.tsx` — menu de contexto da área de trabalho: "Adicionar widget…"
(`setStoreOpen(true)`) + "Organização dos widgets → Grade/Livre". `<WidgetStore/>` montado no
desktop e no mobile. Seed chamado num `useEffect` (gated por `hasUser` + `canDpt`/`canCal`).

### 12.5 Widgets existentes

| id | módulo (accent) | dados | config |
|---|---|---|---|
| `relogio` | Sistema (blue) | relógio ao vivo + `Calendar` (`components/ui/calendar.tsx`, novo) | — |
| `notas` | Sistema (amber) | texto no `config` da instância | — |
| `clima` | Sistema (cyan) | **open-meteo** keyless via `useDeviceInfo.coords`; temp/condição(WMO)/máx-mín/vento; fallback "Permitir localização" | — |
| `farol-os` | Medro Pro | `GET /medro-pro/kpis/torre-macro` → no prazo / aguardando / fora do prazo | **filial** (auto/todas/específica) |
| `laudos-andamento` | Gerador de Laudos (DPT) | `useRascunhos` — nº + lista; clique abre a OS | — |
| `ultimos-pdfs` | Gerador de Laudos (DPT) | `useHistoricoPdf` | — |
| `laudos-resumo` | Gerador de Laudos (DPT) | **`GET /laudos-gen/resumo`** (novo — `resumoLaudos()` em `services/laudosGen/dataverse.ts`): `{rascunhos, pdfsHoje, pdfs7d}` | — |
| `laudos-dpt` | Dep. Técnico (DPT) | `useLaudos({tipo:"todos"})` (`modules/dpt/api`) — laudos técnicos recentes | — |
| `caldeiraria-kpis` | Usinagem e Caldeiraria (CAL) | `useCaldeirariaKpis(filial)` (`modules/caldeiraria/api`) — pendentes/prioridade/suspensos/% no prazo | **filial** |

**Seed padrão** (1ª vez, se a tela estiver vazia): `relogio` + `farol-os` (+ `laudos-andamento`
se DPT, + `caldeiraria-kpis` se CAL), todos `md`.

### 12.6 Adicionar um widget novo

1. `widgets/MeuWidget.tsx` — `export function MeuWidget({ size, config, setConfig }: WidgetProps)`.
   Dados: reusar/inline `useQuery` com a chave do módulo;
   `useWidgetRefetch(useCallback(() => q.refetch(), [q]))`.
   Estados: `WidgetLoading` / `WidgetError` / `WidgetEmpty`.
2. (opcional) `export function MeuWidgetConfig({ config, setConfig }: WidgetConfigProps)` — form
   num `<label>` + `Select` do `components/ui/select`.
3. Registrar em `registry.tsx`: `{ id, title, desc, icon, module, access?, sizes, defaultSize,
   Component: MeuWidget, ConfigForm?: MeuWidgetConfig }` + o `id` no union `WidgetId` (`types.ts`).
4. Se depender de endpoint novo: rota em `apps/api` + hook no `api.ts` do módulo.

### 12.7 Verificado no browser (rodadas de widget)

Loja lista/filtra/agrupa por acesso; adicionar coloca com dados reais (Farol `/kpis`,
Caldeiraria `/kpis`, `/laudos-gen/resumo` = `12 rascunhos · 2 PDFs hoje`, 50 laudos DPT);
drag+snap na grade; modo livre; resize pelo menu; `Configurar…` troca a filial do Farol
(São Luís 340 → Todas 941) e persiste; layout persiste após reload; **seed** monta 4 widgets
ao limpar o `localStorage`; widgets translúcidos, clique enquadra, `Esc`/clique-fora
deseleciona; loja rola até o último grupo; menu de contexto do desktop e dos widgets ok.

### 12.8 Pendências / próximos passos (shell + widgets)

- **Endpoints `/resumo` leves** para os widgets que ainda baixam listas (opcional — já
  funcionam). Padrão: `GET /api/<modulo>/resumo` com contadores agregados, cache curto no BFF.
- **Widgets de Ensaios / Qualidade / Ferramentaria** — hoje esses módulos são **stub sem
  backend real**; fazer os widgets junto com os dados desses módulos.
- **Widget de Migração** — existe `GET /migracao/status`, mas os dados são **mock em memória**
  (`routes/migracao.ts`); não fazer até virar real.
- **Resize por arrasto**: a alça funciona mas é pequena (16→24 px); avaliar um handle mais
  visível / snap com preview de contorno.
- **Config por instância**: só Farol e Caldeiraria têm `ConfigForm` (filial). Estender a
  widgets que dependem de TAG/OS (ex.: um "Histórico de serviços" com TAG no config, reusando
  `useHistoricoServicos`).
- **Sync do layout de widgets entre dispositivos** — hoje `localStorage`. Se pedirem:
  `GET/PUT /api/me/widgets` (JSON num campo de preferências do usuário no Dataverse).
- **Mobile** — `MobileWidgetStack` é só uma pilha vertical básica; o remodel do mobile foi
  adiado pelo usuário ("futuramente remodelaremos").
- **MenuBar vertical + janelas** — testado, mas revisar `tile()` / bounds quando a barra está
  numa borda lateral com janelas abertas.

### 12.9 Passe de animação — "feel de SO" (rodada 2026-09-04)

Objetivo do usuário: *"quero que tudo no Medro seja fluido, como um SO mesmo"* — aberturas,
fechamentos, drag & drop, hover. Abordagem **híbrida** (escolha do usuário): `framer-motion`
(`^12`, já usado no `report-print`) só na **orquestração do shell**; o resto segue
CSS/Tailwind + `tailwindcss-animate` (Radix já anima menus/sheets/popovers).

- **`lib/motion.ts`** (novo) — vocabulário de movimento compartilhado: molas `SPRING` /
  `SPRING_SNAPPY` / `SPRING_SOFT`, `EASE_OUT`, e `variants` prontos (`overlayFade`,
  `overlayPanel`, `gridContainer`/`gridItem` p/ stagger, `itemPop`, `tapScale`). Use estes
  em vez de números soltos — o shell inteiro precisa ter a mesma física.
- **`app/App.tsx`** — árvore embrulhada em `<MotionConfig reducedMotion="user">`: respeita
  `prefers-reduced-motion` globalmente (os keyframes CSS já respeitavam).
- **`WindowFrame.tsx`** — raiz virou `motion.div`. Abre com "pop" (mola, `scale/opacity/y`,
  `transformOrigin: 50% 0`); sai por fade+encolhe (fechar) **ou** "suga" pra baixo na direção
  do dock (minimizar) — variante `exit` funcional via `custom={win.minimized}`.
  `left/top/width/height` continuam em `style` + transição CSS (re-tiling) — framer só cuida
  do enter/exit (transform+opacity), sem animar layout. Botões de título com `whileHover`/
  `whileTap`.
- **`Desktop.tsx`** — lista de janelas dentro de `<AnimatePresence>` (dispara o `exit`).
  No mobile, o módulo ativo entra deslizando (`spring`).
- **`Dock.tsx`** — **lupa estilo macOS**: `DockMagnet` (forwardRef, p/ o `ContextMenuTrigger
  asChild`) mede o próprio centro e usa `useTransform`/`useSpring` sobre um `mouseX`
  compartilhado → ícones crescem/sobem conforme o cursor se aproxima (`MAG_RANGE` 110px,
  `MAG_SCALE` 1.42). ⚠️ gotcha: `getBoundingClientRect` mede o elemento **já transformado**,
  então o pico da onda pode "escorregar" ~1 ícone — visualmente ok num dock. Barra de recentes
  em `<AnimatePresence mode="popLayout">` + `layout` → ícones deslizam ao alternar 3↔6.
  ⚠️ 2º gotcha: o `motion.button` do `DockMagnet` deve espalhar `{...rest}` **antes** de
  `style` (o `Slot` do Radix injeta `style` e sobrescrevia o `scale`/`y`).
  Esconder/mostrar o dock virou mola. Spotlight com stagger nos resultados.
- **`Launchpad.tsx` / `TaskView.tsx`** — `if (!x) return null` → `<AnimatePresence>` +
  `motion.div` (overlay faz fade/blur, some com `exit`). Grade com `gridContainer`/`gridItem`
  (stagger na entrada). Tiles com `whileHover`/`whileTap` (removido o `group-hover:scale` CSS).
  Pasta aberta do Launchpad cresce do centro (`overlayPanel`). Cards do TaskView com `layout`
  (reflui no `tile()`/fechar) + `AnimatePresence mode="popLayout"`.
- **`WidgetLayer.tsx`** — cada widget num `motion.div`: entra com "pop" (`SPRING_SNAPPY`),
  sai encolhendo (`<AnimatePresence>`), `scale 1.03` enquanto arrastado. A grade pontilhada
  do modo grade faz fade in/out. Lógica de pointer-drag **intacta** (só o wrapper mudou).
  `MobileWidgetStack` idem, com `layout` + stagger.
- **`DesktopIcons.tsx`** — atalhos entram escalonados (`motion.div` como filho direto do
  `<AnimatePresence>`; o `motion.button` interno só faz hover/tap), `whileHover`/`whileTap`.
- **`components/ui/button.tsx`** — `active:scale-[0.97]` no primitivo compartilhado (feedback
  tátil global; `disabled:active:scale-100`).
- **Bundle**: `pnpm --filter @medro/web build` de ~1,16 MB → ~1,44 MB (framer-motion, ~80 KB
  gzip). Typecheck + build limpos. Verificado no browser: pop de janela, minimizar/restaurar,
  fechar (exit), lupa do dock (medida via JS: 1.0 → 1.41 no centro, falloff nos vizinhos),
  launchpad, drag de widget com snap.
- **Ainda não animado** (de propósito, p/ conter risco): `WelcomeOverlay` (já é todo
  keyframes CSS caprichados — deixado como está), `MenuBar` show/hide lateral, transições de
  conteúdo **dentro** dos módulos (cada app cuida do seu; o shell não impõe).

---

## 13. Módulo Terceirizados (`terceirizados`) — porte do PowerApps (rodada 2026-09-04)

Porte do módulo **Serviços Externos / Terceirizados** do app original. Análise em
`docs/00 §Serviços Externos`, `docs/01 §servicosterceirizados`, `docs/02 §ControleTerceirizado
/ NovoRegistroTerceir / PendentesdeRetorno / AtualizacaoPendentes / HistoricoPendentes /
HistoricoTerceir`, fonte `.pa.yaml` em `extracted/.../Src/`. Segue **o mesmo padrão da
Caldeiraria** (service Dataverse + rota Fastify + hooks RQ + App + modais + fallback mock).

### 13.1 Regra de negócio (do app original)
- Um registro em `cr4a1_servicosterceirizados` = **uma peça enviada para serviço externo**
  numa OS (usinagem, solda, jateamento, torneamento, retífica…).
- **PENDENTE de retorno** = `IsBlank(Data_retorno) And IsBlank(xdataretorno)` — ainda não
  voltou do fornecedor.
- **HISTÓRICO** = já tem data de retorno.
- Tudo filtrado por **`Unidade` = filial do usuário** (no PowerApps, `varfilial`); busca por
  `N_OR` + `Título`; ordenação asc/desc por data de criação (o toggle `class`).
- `NovoRegistroTerceir` cria; `AtualizacaoPendentes` edita e **registra o retorno** (data +
  `ValorServ1..5` + `Total Valor` + `AvaliacaoRetorno/Descricao/Medida`); `Excluir` remove.

### 13.2 Backend
- **`services/dataverse/terceirizados.ts`** — `F_TERC` (map camelCase ⟷ coluna lógica),
  `TerceirizadoDTO`, `listTerceirizados({filial,status,situacao,os,search,order,top})`,
  `getTerceirizado`, `createTerceirizado`, `updateTerceirizado`, `removeTerceirizado`,
  `getTerceirizadosKpis`. Option sets `Peça` (21) e `Situação` (Emergencial/Normal) mapeados
  label↔int; `Empresa` é **texto** (`cr4a1_xempresa`, como o form original). Datas: lê a
  coluna datetime `x…` com fallback pra coluna texto (`firstDate`). Fallback mock (offline).
- **`routes/terceirizados.ts`** — `app.requireAccess("TER")` no router; `GET /terceirizados`,
  `GET /terceirizados/kpis`, `GET /terceirizados/:id`, `POST /terceirizados`
  (**gate extra `_TER_CAD`** só nessa rota), `PATCH /terceirizados/:id`, `DELETE …/:id`.
- `server.ts` — `register(terceirizadosRoutes, { prefix: "/api" })`.

### 13.3 Frontend (`apps/web/src/modules/terceirizados/`)
- **`api.ts`** — tipos + hooks RQ (`useTerceirizados`, `useTerceirizadosKpis`,
  `useCreateTerceirizado`, `useUpdateTerceirizado`, `useDeleteTerceirizado`) com fallback
  local. Exporta `PECA_OPCOES` / `EMPRESA_SUGESTOES`.
- **`TerceirizadosApp.tsx`** — cabeçalho (KPIs: pendentes / emergenciais / prazo vencido /
  retornaram 7d + valor pendente), seletor de filial (auto = filial do usuário / Todas /
  específica), abas **Pendentes de retorno** | **Histórico**, busca, toggle de ordem, lista de
  cards animada (`AnimatePresence` + `SPRING_SNAPPY`). Card → `DetalheModal`.
- **`components/NovoRegistroModal.tsx`** — form de criação (OS, N° OR, Peça, Situação,
  Fornecedor c/ `datalist`, Unidade, Carcaça, Fabricante, Previsão de retorno, até 5 serviços,
  Observação). Só aparece o botão "Novo registro" com `_TER_CAD`.
- **`components/DetalheModal.tsx`** — edição + **"Registrar retorno"** (grava `dataRetorno =
  agora` → sai de pendentes), valores por serviço + total (com "usar soma"), avaliação do
  retorno, "Reabrir" (volta pra pendentes), "Excluir" (confirmação inline).
- **`ModuleHost.tsx`** — `if (moduleId === "terceirizados") return <TerceirizadosApp />`
  (a trava de `MODULES[].access` = `["TER"]` já é aplicada antes).
- **`registry.ts`** — a entrada já existia; ganhou `ready: true` → aparece no Dock/Launchpad.
- **Widget** `terceirizados-pendentes` (`widgets/widgets/TerceirizadosWidget.tsx` + id no
  `types.ts` + `registry.tsx`): pendentes / emergenciais / prazo vencido / retorno-7d, com
  `ConfigForm` de filial. `access: ["TER"]`.

### 13.4 Verificado no browser (api + web rodando, Dataverse real)
- `GET /api/terceirizados?status=pendentes&filial=Todas` → 200, **348 registros reais**
  (Aveiro/PT incluído com `filial=Todas`; a filial do usuário filtra corretamente).
- Módulo abre pelo Launchpad, filtra por "São Luís" (343 pendentes), abas Pendentes/Histórico
  trocam a query (`not (semRetorno)`), cards mostram OS/OR/peça/serviço/fornecedor/datas
  (previsão vencida em cor de alerta). `DetalheModal` abre com os dados reais pré-preenchidos.
  Botão "Novo registro" oculto p/ `douglasnou` (tem `TER`, não tem `_TER_CAD`) — RBAC ok.
- `pnpm --filter @medro/api build` e `@medro/web build` limpos.

### 13.5 Pendências / notas
1. **`AtualizacaoPendentes` do original tem `cr4a1_empresa` (choice)** além do `xempresa`
   (texto); portei só o texto (é o que o `NovoRegistroTerceir` grava). Se precisarem do
   choice, o `toDTO` já lê o `FormattedValue` de `cr4a1_empresa` como fallback.
2. **Serviços Externos PT / Aveiro** (`ServiçosExternos`, `HIstóricoServAVR`,
   `ServiçosExternosPortugal`, `ServiExternosAveiro`) **não** portados — é o fluxo AVR à parte
   (o registry original só ligava `ControleTerceirizado` + `NovoRegistroTerceir`).
3. KPI "prazo vencido" ≈ "pendentes" nos dados reais (backlog grande de serviços externos
   antigos com previsão no passado) — é a realidade, não bug.
4. Criar/editar não testado no browser (usuário dev sem `_TER_CAD`); lógica espelha a
   Caldeiraria (testada) + fallback local exercitado.
