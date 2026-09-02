# Medro — Visão Geral do Aplicativo (PowerApps → React/Node)

> Documento-índice da análise. Gerado a partir do pacote `Medro_20260902111719.zip`
> (export de solução do Power Platform da *Kairós Motores*).

## Documentos desta análise

| # | Documento | Conteúdo |
|---|---|---|
| 00 | **este** | visão geral, inventário, módulos, glossário |
| 01 | [`01-modelo-de-dados.md`](01-modelo-de-dados.md) | 25 tabelas Dataverse + 24 listas SharePoint + 3 tabelas SQL/Protheus, campo a campo, com conjuntos de opções e relações |
| 02 | [`02-catalogo-de-telas.md`](02-catalogo-de-telas.md) | 78 telas — fontes de dados, flows, navegação, variáveis, formulários, galerias, ações de botões |
| 03 | [`03-flows.md`](03-flows.md) | 10 Power Automate flows — entradas, conectores, ações, saídas |
| 04 | [`04-navegacao-e-permissoes.md`](04-navegacao-e-permissoes.md) | grafo de navegação + modelo de login e tokens de `acesso_mod` |
| 05 | [`05-arquitetura-alvo.md`](05-arquitetura-alvo.md) | arquitetura React (shadcn + Reshaped) + Node, deploy Vercel/Render, roadmap de migração |

Dados estruturados (para gerar código/tipos): `docs/_data/data-model.json`, `docs/_data/screens.json`.
Scripts de extração (reexecutáveis): `scripts/extract_*.py`.

## O que é o Medro

App **canvas PowerApps, formato telefone (640×1136)**, para **gestão de oficina de manutenção
de motores elétricos industriais** da Kairós Motores, operando em 5 filiais:
**São Luís (SLZ)**, **Aveiro (PT)**, **Barcarena**, **Parauapebas**, **São José dos Campos**.

Números do pacote:

| Métrica | Valor |
|---|--:|
| Telas | 78 (+ `App`) — **70 no escopo** após revisão (ver `06-revisao.md`) |
| Linhas de Power Fx (YAML) | ~135.700 |
| Controles | ~10.900 |
| `If(` no código | 2.924 |
| `UpdateContext(` | 567 |
| `LookUp(` / `Filter(` | 293 / 181 |
| Formulários (`Form`) | 64 · `SubmitForm` ×58 · `Patch` ×23 |
| Galerias | 102 |
| Tabelas Dataverse | 25 |
| Listas SharePoint | 24 |
| Tabelas SQL Server (Protheus) | 3 (`ZB6010`, `SCP010`, `ABF010`) |
| Power Automate flows | 10 |

## Backend atual (será mantido)

1. **Dataverse** — ambiente `https://org3c66e333.crm2.dynamics.com`, tabelas com prefixo `cr4a1_`.
   Núcleo transacional (`Base_Medro`, `RDS-Managements`, `Prod_*`, `Caldeiraria_*`, `Laudos`,
   `Requisicao`, `Balanceamento`, `Controle Ferramentas`, `controle_veiculo`, `CIPA_*`,
   `Credenciaiss` = usuários/login).
2. **SharePoint Online** — 2 sites (`KairosMotores`, `Listas-Kairsmotores`): listas de
   checklist veicular, PF e IQ, trajetos, serviços terceirizados, RDS, QR Code, e várias
   "Listas Auxiliares" (clientes, ferramentas, setores). Também **bibliotecas de documentos**
   (`Doc Técnicos`) que guardam laudos PDF e fotos de peritagem.
3. **SQL Server (ERP TOTVS Protheus)** — `45.6.153.1,37000`, base `CZLS4F_136240_PR_PD`.
   Tabelas `ZB6010` (dados da OS/equipamento vindos do ERP), `SCP010`, `ABF010`.
4. **10 Flows** — geração de laudo PDF, cópia de laudo, link de compartilhamento, upload e
   exibição de fotos de peritagem, planilha Excel de checklist. Ver doc 03.

## Módulos funcionais (agrupamento das 78 telas)

| Módulo | Telas-chave | Fontes principais |
|---|---|---|
| **Login & Menu** | `Login`, `1_Menu`, `SELEC_COD` (hub), `Menu_RDS` | `Credenciaiss` |
| **OS Medro** (entrada → produção → finalização) | `TelaInicial_Medro_Nova`, `Entrada_Medro_Nova`, `Finalizar_Medro_Nova`, `EdicaoOS_Medro`, `Gestao_Pendencias_Medro` | `Base_Medro`, `ZB6010`, `Laudos`, `Balanceamento` |
| **Pendentes / Tarefas** | `AtualizacaoPendentes`, `HistoricoPendentes`, `EntradaTarefa`, `PendentesdeRetorno` | `servicosterceirizados`, `Tarefas Operacionais`, `Lista QR Code` |
| **PCP / Gerenciamento** | `COD_GERENCIAMENTO` (12,9k linhas), `TelaPCP_SLZ` / `_1`, `PCP_ANTIGO`, `Requisição_PCP` | `RDS-Managements`, `PF e IQ`, `Trajetos`, `CheckList_Veicular` |
| **Peritagem / Avaliação / Inspeção** | `GaleriaPeritagem`, `FormInspec`, `HistoricoAvalFinais`, `PeritagemFin_opicional`, `AvaliacaoFinal`, `InspecQuali` | `Prod_Avaliacao_Final`, `Prod_Inspecao`, `Prod_Avaliacao_Final_Opc` |
| **Ensaio** | `EnsaioTemporizado`, `LiberarEnsaio` | `ensaio_temporizado`, `Prod_LiberarEnsaio` |
| **Caldeiraria** | `Caldeiraria_Novo`, `Caldeiraria_Histórico`, `Caldeiraria_Pendentes_*`, `Controle_Caldeiraria` | `Caldeiraria_Controle`, `Caldeiraria_Lista` |
| **Balanceamento** | `Rel_Balanceamento`, `Balanceamento_Pendentes` | `Balanceamento` |
| **Departamento Técnico / Laudos** | `DepTecnico`, `GerarLink_DPT`, `QRCodeLaudos` | `Laudos`, `Lista QR Code`, `Doc Técnicos`, flows de laudo |
| **Trajetos / SSMA** (deslocamento de campo + segurança) | `Seleção_trajeto_SSMA` (8,3k), `TelaTrajetos`, `TrajetoFinal`, `ImprimirSSMA`, `SelecaoTrajeto` | `Trajetos`, `SAC - Kairós` |
| **Checklist Veicular** | `Checklist_veicular_slz` / `_View`, `Novo_CheckList_Veicular`, `Exportar_CheckList` | `CheckList_Veicular`, flow `gerar_planilha_checkList_veicular` |
| **Ferramentaria** | `T_Ferramentaria_Banco` / `_Checklist` / `_FerrPorSetor` / `_historic` | `Controle Ferramentas`, `Lista Auxiliar - Ferramentas(*)` |
| **Serviços Externos / Terceirizados** | `ServiçosExternos`, `NovoRegistroTerceir`, `HistoricoTerceir`, `HistóricoServAVR` | `servicosterceirizados(_for)`, `ServiçosExternosPortugal`, `ServiExternosAveiro` |
| **RDS** | `Req_RDS`, `Historico_RDS`, `Menu_RDS` | `RDS` |
| **Relatório Fotográfico** | `Relatorio`, `Rel_Foto_Escolha`, `Rel_Foto_Lista(_PC)`, `Rel_Foto_Per`, `Rel_Foto_parametro` | `Relatório`, `Relatorio_Fotografico`, flows de imagem |
| **CIPA** (votação da comissão de segurança) | `VotaçãoCIPA` | `CIPA_2026`, `CIPA_Vot` |
| **Escopo de Manutenção** | `EscopoDeManuten` | `Base_Medro` |

## Fluxo de negócio (visão macro da OS)

```
ERP Protheus (ZB6010)  ──►  Entrada_Medro_Nova  ──►  Base_Medro (status inicial)
        │                          │
        │                          ├─ gera Laudo inicial (flow gerarlinkLaudo / CopiarLaudo)
        ▼                          ▼
   TelaInicial_Medro_Nova ◄─► produção: Peritagem ▸ Inspeção ▸ Ensaio ▸ Caldeiraria ▸ Balanceamento
        │                          │  (Prod_*, Caldeiraria_*, ensaio_temporizado, Balanceamento)
        ▼                          ▼
   Finalizar_Medro_Nova  ──►  Base_Medro (status final, Check_aprov)  ──►  Laudo final + QR Code
```

Paralelamente: **Trajetos/SSMA** (deslocamento das equipes de campo), **RDS** (requisição de
saída/serviço), **Checklist Veicular** e **Ferramentaria** dão suporte operacional.

## Glossário

| Termo | Significado |
|---|---|
| **OS** | Ordem de Serviço |
| **PCP** | Planejamento e Controle da Produção |
| **Peritagem** | inspeção/avaliação técnica do motor recebido |
| **Laudo** | relatório técnico (PDF) da OS, com QR Code |
| **DPT / DTI** | Departamento Técnico |
| **RDS** | Requisição de Saída / Relatório de Serviço |
| **SSMA** | Saúde, Segurança e Meio Ambiente |
| **CIPA** | Comissão Interna de Prevenção de Acidentes |
| **Caldeiraria** | setor de recuperação/fabricação de peças metálicas |
| **Balanceamento** | balanceamento dinâmico de rotores/ventiladores |
| **`cr4a1_`** | prefixo do publisher da solução Dataverse |
| **`acesso_mod`** | campo em `Credenciaiss` com tokens de permissão concatenados |
| **ZB6010** | tabela Protheus com dados da OS/equipamento (CV, KW, tensão, pólos, carcaça…) |
