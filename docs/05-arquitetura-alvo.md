# Medro — Arquitetura Alvo (React + Node)

## 1. Princípios

- **Os dados permanecem** onde estão: Dataverse, SharePoint e SQL/Protheus continuam sendo
  as fontes. Não há migração de base. O backend Node é uma **camada de API** (BFF) sobre elas.
- **Paridade funcional primeiro**, refino depois. Cada tela PowerApps tem uma tela React
  equivalente (doc 02 é o checklist).
- **Regra de negócio sai do cliente.** Toda a lógica hoje embutida em `OnSelect`/`OnVisible`
  (2.924 `If()`) migra para serviços no backend ou hooks/validações no front, testável.
- **Mobile-first.** O app original é formato telefone e usado em chão de fábrica / campo.
  PWA instalável, offline-tolerante nas telas de captura.

## 2. Stack

### Frontend (deploy: **Vercel**)
| Camada | Escolha |
|---|---|
| Build | Vite + React 18 + TypeScript |
| Roteamento | React Router v6 (rotas por módulo, lazy) |
| Dados/servidor | TanStack Query (cache, retry, optimistic) + `fetch` tipado |
| Formulários | react-hook-form + zod (schemas gerados de `docs/_data/data-model.json`) |
| UI | **shadcn/ui** (Radix + Tailwind) como base de componentes + **Reshaped** para layout/primitives de produto |
| Estilo | Tailwind com **design tokens** (seção 5) — estética **iOS 15** |
| Ícones | lucide-react |
| Estado global leve | Zustand (sessão/usuário, filial, permissões) |
| Tabelas/listas | TanStack Table (virtualização nas galerias grandes) |
| Gráficos | Recharts (telas de PCP/Balanceamento) |
| Datas | date-fns + tz `America/Sao_Luis` / `Europe/Lisbon` por filial |
| PWA | vite-plugin-pwa (service worker, install prompt) |

> **shadcn + Reshaped juntos:** Reshaped fornece o sistema de layout (View, stack, grid,
> responsividade, tokens) e componentes "de produto"; shadcn fornece componentes headless
> altamente customizáveis (Dialog, Command, Combobox, Form). Padronizar: **um** dos dois por
> tipo de componente para evitar duplicação — proposta na seção 6.

### Backend (deploy: **Render**)
| Camada | Escolha |
|---|---|
| Runtime | Node 20 + TypeScript |
| HTTP | Fastify (schema/validação nativa com zod via `fastify-type-provider-zod`) |
| Auth | JWT próprio (login valida contra `Credenciaiss` no Dataverse) + refresh; RBAC por tokens `acesso_mod` |
| Dataverse | cliente Web API v9.2 (client credentials, cache de token, `$select/$filter/$expand`, `Prefer: return=representation`) |
| SharePoint | Microsoft Graph (`/sites/{id}/lists/{id}/items`, `/drives` para Doc Técnicos) — mesma app registration |
| SQL/Protheus | `mssql` (tedious) — **somente leitura**, pool, consultas parametrizadas |
| Jobs | worker Render (cron) para os flows assíncronos (planilha, empacotar fotos) |
| Arquivos | streaming direto do SharePoint/Drive; sem storage próprio de início |
| Observability | pino (logs), Sentry (erros), healthcheck |
| Cache | in-memory + (opcional) Redis Render para metadados de opção/listas auxiliares |

### Credenciais (`.env` do backend)
```
DATAVERSE_TENANT_ID=fca950cc-da1f-4b7f-bc99-2a028473cb1a
DATAVERSE_CLIENT_ID=c640f62a-59be-4c9e-9c14-ec431c7a8aee
DATAVERSE_CLIENT_SECRET=***            # NÃO COMMITAR — ver nota de segurança
DATAVERSE_ENV_URL=https://org3c66e333.api.crm2.dynamics.com
DATAVERSE_RESOURCE=https://org3c66e333.crm2.dynamics.com
DATAVERSE_API_VERSION=9.2
# a definir:
SHAREPOINT_SITE_KAIROS=https://aplicativokm.sharepoint.com/sites/KairosMotores
SHAREPOINT_SITE_LISTAS=https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores
GRAPH_SCOPE=https://graph.microsoft.com/.default
PROTHEUS_SQL_HOST=45.6.153.1
PROTHEUS_SQL_PORT=37000
PROTHEUS_SQL_DB=CZLS4F_136240_PR_PD
PROTHEUS_SQL_USER=***
PROTHEUS_SQL_PASSWORD=***
JWT_SECRET=***
WEB_ORIGIN=https://<app>.vercel.app
```

> **Nota de segurança:** o `DATAVERSE_CLIENT_SECRET` foi compartilhado em texto no chat.
> Recomendo **rotacionar** esse secret no Entra ID antes do go-live e mantê-lo só nas
> *Environment Variables* do Render / `.env` local (com `.env` no `.gitignore`).
> Confirmar também se a app registration tem permissão de **Graph (Sites.ReadWrite.All)** e
> um **Application User** no Dataverse com as roles necessárias.

## 3. Estrutura do monorepo

```
medro/
├─ apps/
│  ├─ web/                 # React (Vercel)
│  │  ├─ src/
│  │  │  ├─ app/           # router, providers, layout base
│  │  │  ├─ modules/       # 1 pasta por módulo funcional (doc 00)
│  │  │  │  ├─ os-medro/
│  │  │  │  ├─ pcp/
│  │  │  │  ├─ peritagem/
│  │  │  │  ├─ caldeiraria/
│  │  │  │  ├─ trajetos-ssma/
│  │  │  │  ├─ checklist-veicular/
│  │  │  │  ├─ ferramentaria/
│  │  │  │  ├─ terceirizados/
│  │  │  │  ├─ rds/
│  │  │  │  ├─ relatorio-fotografico/
│  │  │  │  └─ ...
│  │  │  ├─ components/    # design system (shadcn + wrappers Reshaped)
│  │  │  ├─ lib/           # api client, auth, query keys, formatters
│  │  │  └─ styles/        # tokens.css, tailwind
│  └─ api/                 # Fastify (Render)
│     ├─ src/
│     │  ├─ routes/        # 1 arquivo por recurso (espelha modules/)
│     │  ├─ services/
│     │  │  ├─ dataverse/  # client + repos por entidade
│     │  │  ├─ sharepoint/ # graph client + repos por lista
│     │  │  ├─ protheus/   # queries ZB6010/SCP010/ABF010
│     │  │  └─ flows/      # port dos 10 Power Automate flows
│     │  ├─ auth/          # login Credenciaiss, jwt, rbac
│     │  ├─ domain/        # regras de negócio (máquinas de estado da OS etc.)
│     │  └─ plugins/       # fastify plugins (config, error, cors)
│     └─ workers/          # cron jobs
├─ packages/
│  └─ shared/              # tipos + schemas zod gerados do data-model.json
│     ├─ src/entities/     # 1 arquivo por tabela Dataverse/lista SP
│     └─ src/enums/        # conjuntos de opção (option sets)
└─ tooling/
   └─ codegen/             # gera packages/shared a partir de docs/_data/*.json
```

## 4. Mapeamento de conceitos PowerApps → alvo

| PowerApps | Alvo |
|---|---|
| Tela (`Screen`) | rota + componente de página em `modules/<mod>/pages/` |
| `Navigate(X)` | `navigate('/rota-de-X')` (grafo no doc 04) |
| `Set(var)` global | Zustand store ou React Query cache |
| `UpdateContext({v})` | `useState`/`useReducer` local da página |
| `Gallery` + `Items` | `useQuery` → TanStack Table/virtual list; o `Filter/Search/Sort` do Power Fx vira query param `$filter/$orderby` no backend |
| `Form` + `SubmitForm`/`Patch` | react-hook-form + `useMutation` → `POST/PATCH /api/<recurso>` |
| `LookUp(DS, ...)` | endpoint `GET /api/<recurso>?...&$top=1` |
| Conjunto de opções (Picklist) | enum em `packages/shared`; `<Select>` com labels PT |
| `<Flow>.Run(...)` | `POST /api/flows/<nome>` (doc 03 traz entradas/saídas) |
| `Credenciaiss` + tokens | tabela de sessão + middleware `requireAccess('OS','_OS_EDOS')` |
| Anexos (`Attachments`) | Dataverse annotations (`/annotations`) via API |
| `AddMedia` / câmera | `<input capture>` → upload multipart → SharePoint Drive (flow `salvarfotosperitagem`) |
| `PDFViewer` | `<embed>`/pdf.js apontando para stream do backend |

## 5. Design tokens (paleta + estética iOS 15)

Paleta fornecida:

| Token | Hex | Uso |
|---|---|---|
| `--surface` | `#FFFFFF` | fundo de cartões, campos, folhas |
| `--bg` / `--surface-muted` | `#E9EEF3` | fundo da aplicação, linhas zebradas, chips |
| `--border` / `--muted` | `#B7C6D6` | bordas, divisores, ícones inativos, placeholder |
| `--primary` | `#4A7FB0` | ações primárias, links, seleção, foco |
| `--foreground` / `--elevated-dark` | `#2B3642` | texto principal, cabeçalho/tab bar, ícones |

Derivadas (gerar por `color-mix`): `--primary-hover` (~#3E6E9C), `--primary-press` (~#345E86),
`--primary-soft` (#4A7FB0 @ 12% sobre surface), `--danger` (#B4453F, alinhado ao vermelho
histórico do app), `--success` (#3B9A63), `--warning` (#C9922E).

**Estética iOS 15 — parâmetros:**

```css
:root{
  /* raio: quadrado, mas não muito — iOS 15 */
  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 10px;   /* botões, inputs */
  --radius-lg: 14px;   /* cartões, listas agrupadas */
  --radius-xl: 20px;   /* folhas/modais (sheet) */

  --shadow-1: 0 1px 2px rgba(43,54,66,.06), 0 1px 3px rgba(43,54,66,.10);
  --shadow-2: 0 4px 16px rgba(43,54,66,.10);
  --sheet-shadow: 0 -8px 30px rgba(43,54,66,.18);

  --font-sans: -apple-system, "SF Pro Text", "SF Pro Display",
               "Inter", "Segoe UI", Roboto, system-ui, sans-serif;
  --tap-target: 44px;               /* mínimo de área tocável iOS */
  --hairline: 1px;                  /* divisores "hairline" */
  --blur: saturate(180%) blur(20px);/* usar com parcimônia: headers/tab bar */
}
```

Diretrizes:
- **Listas agrupadas** ("inset grouped table view"): cartão `--radius-lg`, itens com divisor
  hairline `--border`, primeiro/último item com cantos arredondados. É o padrão para as
  galerias do Medro.
- **Sheets** (modais subindo de baixo) para formulários de criação/edição, com "grabber".
- **Navigation bar** fixa no topo (título + voltar) e, onde fizer sentido, **tab bar**
  inferior por módulo. Fundo com `backdrop-filter: var(--blur)` sobre `--elevated-dark` a ~92%.
- **Botões**: preenchido `--primary` para ação primária; "tinted" (`--primary-soft` + texto
  `--primary`) para secundária; texto puro para terciária. `--radius-md`, altura ≥ 44px.
- **Campos**: fundo `--surface`, borda `--border` 1px, foco = anel `--primary` 2px + leve
  brilho; label acima, helper/erro abaixo (`--danger`).
- **Movimento**: transições 200–300ms `cubic-bezier(.32,.72,0,1)` (curva "iOS spring-like");
  push/pop de telas deslizando na horizontal; sheets deslizando na vertical.
- **Tipografia**: escala compacta — Title 20/28 semibold, Headline 17 semibold, Body 15,
  Footnote 13, Caption 12; peso semibold para ênfase (evitar bold pesado).
- **Modo escuro**: inverter papéis — `--bg` → `#1C2530`, `--surface` → `#243040`,
  `--foreground` → `#E9EEF3`, `--primary` clareado (~#6FA0CB). Tokens já preparados para o swap.

## 6. Convenção shadcn × Reshaped (evitar sobreposição)

| Necessidade | Biblioteca |
|---|---|
| Layout (View, grid, stack, container, responsividade) | **Reshaped** |
| Tipografia / Text | Reshaped |
| Botão, Badge, Card, Avatar, Skeleton, Toast | Reshaped |
| Dialog, Sheet, Popover, Dropdown, Command/Combobox, Tooltip | **shadcn** (Radix) |
| Formulário (Form, Field, controle validado) | **shadcn** + react-hook-form/zod |
| Tabela de dados | TanStack Table + estilo shadcn |
| Tema/tokens | um único `ThemeProvider` (Reshaped) alimentado pelos tokens da seção 5; shadcn lê as mesmas CSS vars |

## 7. Roadmap de migração

**Escopo: 70 telas** (8 descartadas — ver `docs/06-revisao.md`).
Decisão: depois do shell, entregar **o menu completo de opções de tela** com todos os
destinos como *stub* navegável, e só então preencher módulo a módulo.

| Fase | Entrega | Telas | Depende de |
|---|---|---|---|
| **0 — Fundação** | monorepo, CI, deploy vazio Vercel+Render, `packages/shared` gerado (codegen do `data-model.json`), design system base (tokens iOS 15 + ~15 componentes), clients Dataverse/Graph/SQL com healthcheck | — | credenciais confirmadas |
| **1 — Login & Shell** | login `Credenciaiss` + JWT + RBAC por `acesso_mod`, layout (nav bar, tab bar, sheets), seletor de filial, sessão (`varlogin/varnome/varfilial`) | `Login`, `1_Menu` | Fase 0 |
| **2 — Menu de opções de tela** | `SELEC_COD` (hub, 15 destinos) + `1_Menu` + `Menu_RDS` completos, com **roteamento por permissão/nível/filial** e **todas as ~68 telas de destino como stub** (rota + placeholder + guard de acesso) | ~70 (stub) | Fase 1 |
| **3 — OS Medro** + Escopo | `TelaInicial_Medro_Nova`, `Entrada_Medro_Nova`, `Finalizar_Medro_Nova`, `EdicaoOS_Medro`, `Gestao_Pendencias_Medro`, `EscopoDeManuten` + leitura `ZB6010` + flows de laudo + máquina de estados da OV | 6 | Fase 2 |
| **4 — Peritagem / Inspeção / Ensaio** | `GaleriaPeritagem`, `FormInspec`, `HistoricoAvalFinais`, `PeritagemFin_opicional`, `AvaliacaoFinal`, `InspecQuali`, `EnsaioTemporizado`, `LiberarEnsaio` + upload de fotos (flows de imagem) | 8 | Fase 3 |
| **5 — PCP / Gerenciamento** | `COD_GERENCIAMENTO` (decompor), `TelaPCP_SLZ`, `Requisição_PCP` | 3 | Fase 3 |
| **6 — Caldeiraria + Balanceamento** | `Caldeiraria_*` (10), `Rel_Balanceamento`, `Balanceamento_Pendentes` | 11 | Fase 3 |
| **7 — Trajetos / SSMA** | `Seleção_trajeto_SSMA` (decompor), `TelaTrajetos`, `TrajetoFinal`, `SelecaoTrajeto`, `ImprimirSSMA`, `HistóricoTrajeto` | 6 | Fase 2 |
| **8 — Checklist Veicular + Ferramentaria** | `Checklist_veicular_slz(_View)`, `Novo_CheckList_Veicular`, `Exportar_CheckList`, `Histórico_check_SLZ`, `T_Ferramentaria_*` (5) + planilha Excel | 9 | Fase 2 |
| **9 — Terceirizados (+ Pendentes) + RDS** | `ServiçosExternos`, `NovoRegistroTerceir`, `HistoricoTerceir`, `HistóricoServAVR`, `ControleTerceirizado`, `AtualizacaoPendentes`, `HistoricoPendentes`, `PendentesdeRetorno`, `Req_RDS`, `Historico_RDS` | ~13 | Fase 2 |
| **10 — Relatório Fotográfico + CIPA** | `Relatorio`, `Rel_Foto_*` (5), `VotaçãoCIPA` | 7 | Fase 2 |
| **11 — PWA / offline / dark mode / polish** | service worker, captura offline, acessibilidade, performance | — | todas |

`Rel_Foto_Lista` e `Rel_Foto_Lista_PC` → **uma** tela responsiva.
Ordem de preenchimento dos módulos (Fases 3–10) pode ser reordenada conforme prioridade do negócio.

## 8. Riscos e pontos de atenção

- **`COD_GERENCIAMENTO` (12,9k linhas)** e `Seleção_trajeto_SSMA` (8,3k) — precisam de
  decomposição funcional dedicada antes de estimar.
- **Regras de status da OS** estão espalhadas em `If()` aninhados; é preciso extrair a
  máquina de estados (`cr4a1_check_aprov`, `statuscode`, campos `Status_*`) para `domain/`.
- **Delegation limits** do PowerApps (2000 linhas) hoje mascaram consultas; no backend dá
  para paginar de verdade — validar volumes reais por tabela.
- **SharePoint como storage de PDF/fotos**: caminhos montados por string
  (`/Doc Tcnicos/Fotos Peritagens/{filial}/{cliente}/{os}/{tipo}`); replicar exatamente.
- **Multi-tenant de fuso/idioma** por filial (BR × PT).
- **Protheus**: acesso SQL direto a IP público — confirmar VPN/allowlist do Render e que é
  realmente só leitura.
- **`Credenciaiss` guarda senha em texto** (`Matrícula`); no novo login, tratar com cuidado
  (hash na comparação server-side, rate-limit, futuramente migrar para senha com hash).
