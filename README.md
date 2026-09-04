# Medro

Reescrita do app **Medro** (PowerApps Canvas da **Kairós Motores** — oficina de manutenção de
motores elétricos industriais, 5 filiais) em **React + Node**.

**Os dados não migram.** Continuam no **Dataverse**, **SharePoint** e **SQL Server / TOTVS
Protheus**. O backend (`apps/api`) é uma **camada de API / BFF** que fala com essas fontes e
entrega JSON pronto para o front — nada de acesso direto do navegador ao Dataverse.

O front (`apps/web`) não é um site com páginas: é um **shell de "sistema operacional"** (área
de trabalho com janelas, dock, launchpad, widgets). Cada módulo do Medro abre como uma janela.

- **Front:** React 18 + Vite + Tailwind + Reshaped — estética macOS/iOS → deploy **Vercel**
- **Back:** Node + Fastify 5 (BFF) → deploy **Render**
- **Laudo em PDF:** dois serviços extras isolados (`apps/report-print` + `apps/pdf-worker`)

> Análise do app PowerApps original (modelo de dados, telas, flows): [`docs/`](docs/README.md).
> Estado atual e próximos passos, por área: [`docs/07-gerador-de-laudos.md`](docs/07-gerador-de-laudos.md).

---

## Monorepo (pnpm workspaces)

```
apps/
  web             Front React (Vercel). O "SO" — shell + módulos + widgets.
  api             API Fastify (Render). BFF: Dataverse Web API, Graph (SharePoint), SQL (Protheus).
  report-print    Bundle de impressão do laudo — React 19/Vite 7, ~50 páginas A4. Stack PRÓPRIA,
                  não compartilha runtime com o web. Serve a prévia (iframe) e o PDF.
  pdf-worker      Express + puppeteer-core + @sparticuz/chromium. Renderiza report-print → PDF.
packages/
  shared          @medro/shared — tipos + zod + enums + helpers. Parte GERADA de docs/_data.
tooling/codegen   gera packages/shared a partir de docs/_data/data-model.json
docs/             catálogo da migração + handoffs por área
scripts/          extração do .msapp original (Python) + utilitários
```

Regras de import: `apps/web` e `apps/api` importam de `@medro/shared`. **`apps/report-print`
NÃO** — ele tem `react@19`, `vite@7`, `recharts@3`, `react-router@7` próprios para manter as
páginas do laudo intocadas.

## Stack por app

| App | Runtime | Principais libs |
|---|---|---|
| `apps/web` | React 18.3 · Vite 5 · TS | Tailwind 3 (tokens CSS), Reshaped 3, `@tanstack/react-query` 5, **zustand 5** (todo o estado de UI), Radix (context-menu/popover/select/dialog/checkbox), `framer-motion` 12 (animação do shell — ver `lib/motion.ts`), `react-day-picker` 10, `lucide-react`, `react-router-dom` 6 (só **MemoryRouter por janela**), `date-fns` 4 |
| `apps/api` | Node ≥20 · Fastify 5 · TS ESM | `@fastify/jwt` (RBAC), `@fastify/cors`, `@fastify/sensible`, `zod` (config + bodies), `undici` (upload grande p/ SharePoint), `pino` |
| `apps/report-print` | React 19 · Vite 7 | `recharts` 3, `@hello-pangea/dnd`, `framer-motion`, `sass`, `axios` |
| `apps/pdf-worker` | Node · Express 4 | `puppeteer-core` + `@sparticuz/chromium` (prod) / `puppeteer` (dev) |
| `packages/shared` | TS → dist | só `zod` |

---

## Arquitetura

### Fluxo de dados

```
navegador (apps/web)
   │  fetch /api/*  (Bearer JWT)         Vite dev: proxy /api → :3333
   ▼
apps/api  (Fastify BFF, RBAC por token de acesso)
   ├── Dataverse Web API   (OAuth client-credentials + cache de token)   ← fonte primária
   ├── Microsoft Graph     (SharePoint "Doc Técnicos": fotos, PDFs do laudo)
   ├── SQL Server / Protheus  (somente leitura — ZB6010, SCP010, ABF010)
   └── IA (Gemini / Groq / OpenRouter)  — só o Gerador de Laudos
```

- **Autenticação:** `POST /api/auth/login` valida contra a tabela `Credenciaiss` do Dataverse e
  devolve um JWT que carrega `acessoMod` (string de tokens de acesso, ex.: `DPT, CAL, AVA, …`).
  `POST /api/auth/dev-login` (só `NODE_ENV != production`) entra sem senha.
- **RBAC:** `app.requireAccess("DPT")` como `preHandler` (por rota ou por router inteiro).
  No front, `useAuth((s) => s.can("DPT"))`. O `<img>`/bundle de impressão manda o JWT em `?t=`.
- **Cliente Dataverse:** `apps/api/src/services/dataverse/client.ts` — `dataverse.list/get/create/
  update/remove`, monta `$select/$filter/$orderby/$count`, cache de token em memória.

### O shell (`apps/web`)

`main.tsx` → `App` → (`token` ? `<Desktop/>` : `<LoginPage/>`) + `<WelcomeOverlay/>`.

| Peça | Arquivo | O quê |
|---|---|---|
| **Window manager** | `lib/wm.ts` (zustand) | `open(moduleId, title, params?)`, foco/z-index, mover/redimensionar, `tile()` (organizar), minimizar, launchpad/taskview. Sem roteador no topo — **cada janela tem seu MemoryRouter** (routers irmãos, nunca aninhados). |
| **Janela** | `components/desktop/WindowFrame.tsx` | arrasto/resize por pointer events; renderiza `<ModuleHost>`. |
| **Roteamento p/ módulo** | `modules/ModuleHost.tsx` | `switch(moduleId)` → app do módulo; aplica `gate(...tokens)` de acesso. |
| **Registro de módulos** | `modules/registry.ts` | `MODULES: ModuleDef[]` (id, label, icon, `path`, `access?`, `accent`, `ready?`). `ModuleId` é um union de strings. |
| **MenuBar** | `components/desktop/MenuBar.tsx` + `MenuBarCards.tsx` | barra do sistema **customizável** (`lib/useMenuBarPrefs.ts`): posição topo/esquerda/direita, aparência sólida/translúcida/transparente, auto-ocultar, visibilidade por item. Hover nos itens (filial/rede/bateria/localização/relógio) abre **cartões interativos** (o de data tem calendário). |
| **Dock / Launchpad / TaskView** | `components/desktop/*` | dock dinâmico com auto-hide, launchpad com pastas (`lib/launchpadLayout.ts`), multitarefa. |
| **Área de trabalho** | `components/desktop/DesktopIcons.tsx` + `lib/desktopShortcuts.ts` | atalhos fixáveis (persistidos no navegador). |
| **Boas-vindas** | `components/desktop/WelcomeOverlay.tsx` + `lib/startupChime.ts` | cortina 2 fases (assinatura "Medro" → saudação + nome) + som de abertura sintetizado (Web Audio). Só após login nesta aba (flag `welcome` não persistida). |
| **Tema / wallpaper** | `lib/theme.ts` | claro/escuro (`data-theme` no `<html>` + tokens em `styles/tokens.css`), 2 wallpapers + custom. |
| **Movimento** | `lib/motion.ts` + `framer-motion` | vocabulário de animação do shell (molas, `variants` de overlay/grade). `<MotionConfig reducedMotion="user">` em `app/App.tsx`. Janelas com pop/minimizar, dock com lupa macOS, launchpad/taskview com stagger, widgets/atalhos com enter-exit. Detalhe em `docs/07 §12.9`. |

Estado de UI = **zustand + `persist` (localStorage)** em `lib/*`. React Query só para dados
do servidor (`lib/api.ts` — `api<T>(path, opts)` injeta o Bearer, trata 401).

### Widgets (`apps/web/src/modules/widgets` + `lib/useWidgets.ts`)

Tela inicial de widgets sobre a área de trabalho — dados reais dos módulos que representam.

| Arquivo | Papel |
|---|---|
| `types.ts` | `WidgetId`, `WidgetSize` (`sm/md/lg/wide` → células), `WidgetDef` (`module`, `accent`, `sizes`, `access?`, `Component`, `ConfigForm?`), `PlacedWidget`. |
| `registry.tsx` | `WIDGETS: WidgetDef[]` + `widgetById`. |
| `widgets/*.tsx` | um componente por widget; chamam os hooks React Query do próprio módulo (cache compartilhado com a janela aberta). |
| `WidgetShell.tsx` | casca: fundo translúcido (`material-menu`); borda + fundo sólido só quando **selecionado**; menu de contexto (tamanho / atualizar / configurar / abrir módulo / remover). `useWidgetRefetch(fn)` liga o "Atualizar". |
| `WidgetLayer.tsx` | canvas: modo **grade** (snap ao soltar) ou **livre** (px); arrasto e resize à mão (padrão do `WindowFrame`); container rola na vertical; `MobileWidgetStack` para o mobile. |
| `WidgetStore.tsx` | a "loja" (pane estilo Launchpad): agrupada por módulo, filtrada por acesso, busca, toggle grade/livre. |
| `lib/useWidgets.ts` | store zustand+persist (`medro.widgets`): `items`, `mode`, `add/remove/resize/moveGrid/moveFree/setConfig`, `seedDefaults(picks)` (semeia uma vez por navegador se a tela estiver vazia). |

**Adicionar um widget:** criar `widgets/MeuWidget.tsx` (usa `WidgetProps` + hooks do módulo) →
registrar em `registry.tsx` com `module`/`access`/`sizes` → (opcional) exportar um `ConfigForm`.

---

## Módulos

Registrados em `apps/web/src/modules/registry.ts`, roteados em `ModuleHost.tsx`.

| Módulo | Estado | Backend |
|---|---|---|
| **Medro Pro** (APS) | ✅ Torre Macro / Cockpit / Kanban + **Farol de OS** (`cr4a1_zb6_relatorios`, 15,5k OS) | `routes/medroPro.ts`, `services/dataverse/farolZb6.ts`, `carcacas.ts` |
| **Gerador de Laudos** (`laudos-gen`) | ✅ 17 editores, prévia em tempo real, IA no diagnóstico, fotos SharePoint, PDF A4, **construtor visual de modelos** (§11 do doc 07) | `routes/laudosGen.ts`, `services/laudosGen/*`, + `report-print` + `pdf-worker` |
| **Dep. Técnico** (`dpt-laudos`) | ✅ laudos técnicos, links, QR | `routes/laudos.ts`, `services/dataverse/laudos.ts`, `services/flows/dpt.ts` |
| **Usinagem e Caldeiraria** | ✅ itens, peças, KPIs | `routes/caldeiraria.ts`, `services/dataverse/caldeiraria.ts` |
| **Migração** | ✅ painel de monitoramento (dados mock em memória) | `routes/migracao.ts` |
| Ensaios · Qualidade · Ferramentaria · Almoxarifado · Bobinagem · Planejamento · … | stub / parcial | — |

**Adicionar um módulo:** id no union `ModuleId` + entrada em `MODULES` (`registry.ts`) →
branch em `ModuleHost.tsx` → componente `SeuApp.tsx` em `modules/seu-modulo/`. Rotas de API em
`apps/api/src/routes/seuModulo.ts` + `app.register(seuModuloRoutes, { prefix: "/api" })` no
`server.ts`.

---

## `packages/shared` e o codegen

`@medro/shared` exporta:

- **Gerado** (`pnpm codegen` a partir de `docs/_data/data-model.json`): tipos + schemas zod de
  25 tabelas Dataverse, 24 listas SharePoint, 3 tabelas Protheus, 83 option sets.
- **À mão:** `AccessToken` + `hasAccess()` / `parseAccessTokens()` (RBAC), `UserSession`,
  helpers do Medro Pro (`calculateFiliaisKpis`, critérios ZB6…).

> ⚠️ **Gotcha:** o front/back importam de `packages/shared/dist`. Rode
> `pnpm --filter @medro/shared build` **antes** de `@medro/web` / `@medro/api` (o `pnpm dev` já
> faz). Erro típico quando o `dist` está velho: *"X not assignable to AccessToken"* ou
> *"does not provide an export named 'parseAccessTokens'"*.

---

## Setup

Pré-requisitos: **Node ≥ 20**, **pnpm 11** (`corepack enable`). Python 3 só para reexecutar os
`scripts/extract_*.py`.

```bash
pnpm install
pnpm codegen                          # gera packages/shared/src/generated/*

cp .env.example apps/api/.env         # preencha DATAVERSE_CLIENT_SECRET (e GRAPH_* / IA se for usar)
cp apps/web/.env.example apps/web/.env # em dev pode deixar como está
```

### Variáveis de ambiente (`apps/api/.env`)

| Grupo | Chaves | Notas |
|---|---|---|
| App | `NODE_ENV` `PORT` `WEB_ORIGIN` `JWT_SECRET` `JWT_EXPIRES_IN` | `WEB_ORIGIN` = origem(s) do front (CORS). |
| Dataverse | `DATAVERSE_TENANT_ID` `_CLIENT_ID` `_CLIENT_SECRET` `_ENV_URL` `_RESOURCE` `_API_VERSION` | client-credentials. **Rotacionar o secret antes do go-live.** |
| Graph / SharePoint | `GRAPH_ENABLED` `GRAPH_TENANT_ID` `_CLIENT_ID` `_CLIENT_SECRET` `SHAREPOINT_SITE_*` | mesma app registration se tiver `Sites.ReadWrite.All`. |
| Protheus | `PROTHEUS_ENABLED` `PROTHEUS_SQL_*` | somente leitura. |
| Gerador de Laudos | `REPORT_PRINT_URL` `PDF_WORKER_URL` `PDF_WORKER_TOKEN` `PUBLIC_API_URL` | `PUBLIC_API_URL`: link absoluto da capa; dev usa o host da requisição, **produção no Render precisa setar** (ou cai em `RENDER_EXTERNAL_URL`). |
| IA (opcional) | `GEMINI_API_KEY` `GROQ_API_KEY` `OPENROUTER_API_KEY` | só o diagnóstico do laudo. |

`apps/web/.env`: `VITE_API_URL` (vazio em dev → proxy `/api`; em prod = URL da API no Render) e
`VITE_REPORT_PRINT_URL` (dev `http://localhost:5180`).

`apps/api/.env` e `apps/web/.env` estão no `.gitignore` — **nunca commitar**.

## Rodar em desenvolvimento

```bash
pnpm dev            # shared (build) + TODOS os apps em paralelo
# ou, o essencial (sem laudo em PDF):
pnpm dev:api        # API   :3333   (tsx watch)
pnpm dev:web        # Front :5173   (proxy /api → :3333)
```

Para mexer no **Gerador de Laudos** ponta a ponta, suba também:

```bash
pnpm --filter @medro/pdf-worker dev                                  # :8100
pnpm --filter @medro/report-print build && pnpm --filter @medro/report-print preview   # :5180 (use o preview, não o dev)
```

- Front: <http://localhost:5173> · Login dev: botão "entrar sem senha" (usuário `douglasnou`, tem DPT/CAL/…).
- API: `/health` · readiness (testa Dataverse) `/health/ready`.
- OS de teste que funciona ponta a ponta no laudo: **`11539-AL`**.

## Build, typecheck, deploy

```bash
pnpm build       # shared → api → web  (é o que Vercel/Render rodam)
pnpm typecheck   # tsc --noEmit em todos
pnpm format      # prettier
```

| Serviço | Onde | Config |
|---|---|---|
| `medro-api` | Render (web service) | `render.yaml` — `node apps/api/dist/server.js`, `GRAPH_ENABLED=true`, envs `sync:false`. |
| `medro-pdf-worker` | Render (private service) | `render.yaml` — `PUPPETEER_LOCAL=false`. |
| `medro-report-print` | Render (static) | `render.yaml` — build do bundle, `VITE_API_URL` `fromService medro-api`. |
| `apps/web` | **Vercel** | `apps/web/vercel.json` — build roda o shared antes; rewrite SPA. |

---

## Convenções

- **Estado de UI → zustand em `lib/`** (com `persist` quando faz sentido). **Dados → React Query.**
  Nada de `useState` global espalhado.
- **Primitivos de UI** em `components/ui/` (Radix + tokens Medro). Reutilize antes de criar.
  Datas → `date-picker.tsx` / `calendar.tsx`; selects → `select.tsx` / `combobox.tsx`.
- **Cores** só via tokens (`bg-surface`, `text-foreground`, `border-border`, `accent-*`,
  `material-menu`, `shadow-ios-*`). Nada de hex solto. Tudo responde a claro/escuro.
- **Acesso**: gate no back (`requireAccess`) **e** no front (`registry.access` + `ModuleHost`).
- **`report-print`**: as ~50 páginas do laudo são **intocáveis**. Mudanças ali só nos pontos já
  documentados (embed/postMessage, `window.reportIsReady`, `PageBuilder`/`BuilderContent`).
- Commits: mensagens em pt-BR, escopo por área (`feat(widgets): …`, `feat(laudos-gen): …`).
- Documento de handoff vivo por área — hoje só o do Gerador de Laudos
  ([`docs/07-gerador-de-laudos.md`](docs/07-gerador-de-laudos.md)); a seção **§12** dele resume
  o shell (menubar, welcome, widgets).

## Gotchas rápidos

- `packages/shared/dist` velho → rode o build dele primeiro (ver acima).
- API 500/queda no `tsx watch` → quase sempre é o `dist` do shared; rebuild + reinicie.
- Widgets "não aparecem" para outra pessoa → normal: layout fica no `localStorage` dela.
  O `seedDefaults` monta uma tela inicial no 1º carregamento (Relógio + Farol + por acesso).
- Upload grande p/ SharePoint trava em algumas redes locais (egress) — o arquivamento do PDF é
  fire-and-forget; validar em deploy Render. Ver `docs/07 §7.1`.
