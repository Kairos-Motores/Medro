# Medro

Migração do app **Medro** (PowerApps Canvas, Kairós Motores) para **React + Node**.
Os dados permanecem no **Dataverse**, **SharePoint** e **SQL/Protheus** — o backend é uma
camada de API (BFF), sem migração de base.

- Front: React + Vite + Tailwind + shadcn/ui + Reshaped — estética iOS 15 → **Vercel**
- Back: Node + Fastify — **Render**
- Análise do app original: [`docs/`](docs/README.md)

## Estrutura

```
apps/web        front React (Vercel)
apps/api        API Fastify (Render)  — Dataverse Web API, Graph (SharePoint), SQL (Protheus)
packages/shared tipos + schemas zod + enums  (GERADOS de docs/_data/data-model.json)
tooling/codegen gerador de packages/shared
docs/           catálogo da migração (modelo de dados, telas, flows, arquitetura)
scripts/        extração do pacote PowerApps (Python)
extracted/      dump do .msapp (referência local, não versionado)
```

## Pré-requisitos

- Node ≥ 20, pnpm 11 (`corepack enable`)
- Python 3 (só para reexecutar `scripts/extract_*.py`)

## Setup

```bash
pnpm install
pnpm codegen                     # gera packages/shared/src/generated/*
cp .env.example apps/api/.env    # preencha DATAVERSE_CLIENT_SECRET
cp apps/web/.env.example apps/web/.env
```

> ⚠️ **Segurança:** rotacione o `DATAVERSE_CLIENT_SECRET` no Entra ID antes do go-live.
> `apps/api/.env` está no `.gitignore` — nunca commitar.

## Rodar em desenvolvimento

```bash
pnpm dev            # shared (build) + api (:3333) + web (:5173) em paralelo
# ou separado:
pnpm dev:api
pnpm dev:web
```

- Front: http://localhost:5173  (proxy `/api` → `:3333`)
- API health: http://localhost:3333/health · readiness (testa Dataverse): `/health/ready`

## Scripts

| Comando | O quê |
|---|---|
| `pnpm codegen` | regenera `packages/shared` do `docs/_data/data-model.json` |
| `pnpm build` | shared → api → web |
| `pnpm typecheck` | `tsc --noEmit` em todos |
| `pnpm dev` | tudo em paralelo |
| `pnpm format` | prettier |

## Estado (Fase 0 — Fundação) ✅

- [x] Monorepo pnpm (`apps/*`, `packages/*`, `tooling/*`)
- [x] Codegen: 25 entidades Dataverse + 24 listas SharePoint + 3 tabelas Protheus + 83 option sets → tipos/zod
- [x] API Fastify: config validada (zod), CORS, JWT, RBAC por `acesso_mod`, healthcheck
- [x] Cliente Dataverse Web API (client-credentials + cache de token) — **conectividade verificada**
- [x] Stubs Graph (SharePoint) e SQL (Protheus)
- [x] `POST /api/auth/login` contra `Credenciaiss` · `GET /api/auth/me`
- [x] Front: design tokens (paleta + iOS 15), Tailwind, componentes base (Button, Input, Card, NavBar)
- [x] Login funcional, `1_Menu`, `SELEC_COD` (hub com RBAC), StubScreen para o resto
- [x] Deploy: `apps/web/vercel.json`, `render.yaml`

### Próximo — Fase 1 / 2

- Fase 1: refinar shell (tab bar, sheets, seletor de filial, `/auth/refresh`), pt-BR/pt-PT por filial
- Fase 2: menu completo de opções de tela — rotas + guards para as ~70 telas (registry em `apps/web/src/modules/registry.ts`)
