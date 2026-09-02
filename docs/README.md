# Catálogo Medro — análise para migração PowerApps → React/Node

Gerado a partir de `Medro_20260902111719.zip` (export da solução Power Platform da Kairós Motores).

| Documento | O que contém |
|---|---|
| [00 — Visão geral](00-visao-geral.md) | inventário, 17 módulos funcionais, fluxo macro da OS, glossário |
| [01 — Modelo de dados](01-modelo-de-dados.md) | 25 tabelas Dataverse + 24 listas SharePoint + 3 tabelas Protheus, campo a campo, com option sets e relações |
| [02 — Catálogo de telas](02-catalogo-de-telas.md) | 78 telas: dados lidos/escritos, flows, navegação, variáveis, forms, galerias, ações |
| [03 — Flows](03-flows.md) | 10 Power Automate flows: entradas, conectores, ações, saídas |
| [04 — Navegação e permissões](04-navegacao-e-permissoes.md) | grafo de navegação (mermaid) + login `Credenciaiss` + tokens `acesso_mod` |
| [05 — Arquitetura alvo](05-arquitetura-alvo.md) | stack React (shadcn + Reshaped, estética iOS 15) + Node/Fastify, deploy Vercel/Render, design tokens da paleta, roadmap em 9 fases |

## Dados estruturados

- `_data/data-model.json` — modelo de dados completo (entrada para o codegen de tipos/schemas zod)
- `_data/screens.json` — metadados das 78 telas

## Reproduzir a extração

```bash
python scripts/extract_datamodel.py
python scripts/extract_screens.py
python scripts/extract_flows.py
python scripts/extract_nav.py
```

Fonte descompactada do app em `extracted/Microsoft.PowerApps/apps/4226216083896037548/msapp/`.
