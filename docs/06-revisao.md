# Medro — Revisão do Catálogo (para travar o escopo)

Ordem oficial das telas: `Src/_EditorState.pa.yaml` → `ScreensOrder` (78 telas).

---

## ✅ Decisões travadas (2026-09-02)

**Fora do escopo (8 telas)** — descartadas do MVP:
`Login_1`, `Screen1`, `Screen2`, `Atendimento`, `PeritagemFin_Temporizado`,
`Requisição RDS`, **`PCP_ANTIGO`** (substituída por `TelaPCP_SLZ`),
**`TelaPCP_SLZ_1`** (rascunho antigo).

→ **70 telas no escopo.**

**Prioridade após Login & Shell:** construir primeiro o **menu de opções de tela**
(`SELEC_COD` + `1_Menu` + `Menu_RDS`) — todos os pontos de entrada dos módulos visíveis,
com as telas de destino como *stub*. Só depois preencher cada módulo. Ordem de
preenchimento sugerida: OS Medro → Peritagem/Ensaio → PCP → Caldeiraria/Balanceamento →
Trajetos/SSMA → Checklist/Ferramentaria → Terceirizados/RDS → Relatório/CIPA
(confirmar quando chegarmos lá).

**Ainda a confirmar com a equipe** (não bloqueiam a Fase 0):
`HistoricoTarefa_PRP`, `Documentos_trajeto SLZ` — mantidos no escopo por ora; seção E (dados).

## A. Telas candidatas a **legado / scratch** (proposta: fora do MVP)

| Tela | Linhas | Evidência | Proposta |
|---|--:|---|---|
| `Login_1` | 196 | cópia de `Login` com outro layout; só `1_Menu` aponta pra ela num branch comentado | **descartar**, manter só `Login` |
| `Screen1` | 29 | nome padrão; um único `ModernText` com `Concat(GroupBy(ZB6_Relatorio…))` — rascunho de depuração | **descartar** |
| `Screen2` | 324 | nome padrão; teste de upload de foto (`salvarfotosperitagem`, `Imagens_JSON`) | **descartar** (lógica já coberta pelos flows) |
| `Atendimento` | 40 | só um label "Atendimento" + botão voltar; sem dados | **descartar** |
| `PeritagemFin_Temporizado` | 41 | stub: label + voltar; sem dados | **descartar** (função vive em `EnsaioTemporizado`) |
| `Requisição RDS` | 87 | tela "Comercial" com botões; `Req_RDS` (1.436 linhas) é a versão real | **descartar** |
| `PCP_ANTIGO` | 7.206 | nome "ANTIGO"; usa `PF e IQ - 2024` | **confirmar**: substituída por `TelaPCP_SLZ`? |
| `HistoricoTarefa_PRP` | 142 | histórico pequeno de `Tarefas Operacionais`; não referenciada | **confirmar** se ainda usada |
| `Documentos_trajeto SLZ` | 101 | lista `Doc.Medro.SLZ`; não referenciada no grafo | **confirmar** |

## B. Duplicatas / variantes — qual é a versão viva?

| Par | Diferença aparente | Pergunta |
|---|---|---|
| `TelaPCP_SLZ` × `TelaPCP_SLZ_1` | `_1` (6.268 linhas) não é alvo de `Navigate` no grafo; `TelaPCP_SLZ` (7.882) é aberta por `COD_GERENCIAMENTO` | `_1` é rascunho, versão nova ou tela de outra filial? |
| `Checklist_veicular_slz` × `_View` | uma edita, outra é leitura (`_View`) | manter as duas como *form* + *detalhe*? |
| `Rel_Foto_Lista` × `Rel_Foto_Lista_PC` | provável celular × desktop | no React será **uma** tela responsiva — ok? |
| `Novo_CheckList_Veicular` × `Novo_CheckList_Veicular`? | 1.523 linhas, não referenciada no grafo | é a tela de criação atual do checklist veicular? |
| `SelecaoTrajeto` (290) × `Seleção_trajeto_SSMA` (8.304) × `TelaTrajetos` (2.732) | fluxo de trajeto em 3 telas | qual é o ponto de entrada por perfil (motorista/aux/SSMA)? |
| `Req_RDS` × `Requisição_PCP` | RDS ≠ requisição PCP (tabelas `RDS` vs `Requisicao`) | confirmar que são fluxos distintos |

## C. Ajustes de agrupamento de módulos (proposta)

Sem mudanças estruturais; só refinamentos:

1. **`EntradaTarefa` + `HistoricoTarefa_PRP`** → hoje em "Pendentes/Tarefas". Usam `Tarefas Operacionais` + `Lista QR Code`. Manter como submódulo **"Tarefas Operacionais / QR"** dentro de OS? 
2. **`AtualizacaoPendentes` + `HistoricoPendentes`** (2.392 + 1.778 linhas) → apesar do nome "Pendentes", operam sobre `servicosterceirizados`. Mover para o módulo **Terceirizados**.
3. **`EscopoDeManuten`** → lê `Base_Medro`; encaixa melhor dentro de **OS Medro** do que como módulo próprio.
4. **`Rel_Balanceamento`** (escreve `Balanceamento`) e `Balanceamento_Pendentes` → módulo **Balanceamento** confirmado; `Balanceamento` também é lido em Entrada/Finalizar da OS.
5. **CIPA** e **Relatório Fotográfico** → módulos independentes, baixa prioridade.

Resultado: **13 módulos** (de 17), com Escopo dentro de OS e Pendentes dentro de Terceirizados.

## D. Roadmap — ordem proposta (confirmar)

| Fase | Módulo | Telas (após cortes) |
|---|---|--:|
| 0 | Fundação (monorepo, codegen, design system, clients) | — |
| 1 | Login & Shell (`Login`, `1_Menu`, `SELEC_COD`, `Menu_RDS`) | 4 |
| 2 | **OS Medro** + Escopo (`TelaInicial/Entrada/Finalizar/EdicaoOS/Gestao_Pendencias` + `EscopoDeManuten`) | 6 |
| 3 | **Peritagem / Inspeção / Ensaio** | 8 |
| 4 | **PCP / Gerenciamento** (`COD_GERENCIAMENTO`, `TelaPCP_SLZ`, `Requisição_PCP`) | 3 |
| 5 | **Caldeiraria + Balanceamento** | 11 |
| 6 | **Trajetos / SSMA** | 6 |
| 7 | **Checklist Veicular + Ferramentaria** | 9 |
| 8 | **Terceirizados** (+ Pendentes) **+ RDS** | ~14 |
| 9 | **Relatório Fotográfico + CIPA** | 7 |
| 10 | PWA / offline / dark mode / polish | — |

Aberto: **trocar Fase 3 ↔ Fase 4?** PCP é a dor de gestão; Peritagem é a dor de chão de fábrica.

## E. Perguntas de dados (para o codegen e as regras)

1. **Máquina de estados da OS** — quais os valores válidos e transições de `cr4a1_base_medro.statuscode`, `cr4a1_check_aprov` (0=Aprovado/1=Reprovado/1000=-) e dos campos texto `Status_Montagem` / `Status_Reprov`? Há documento de processo?
2. **`acesso_mod`** — existe a lista oficial dos tokens e o que cada um libera? (o doc 04 traz a inferência)
3. **`Doc Técnicos` / `Doc Técnicos_1..3`** — no `data-model` apontam para o **mesmo** `tableName`. É uma biblioteca só, com 4 conexões? Confirmar.
4. **Volumes** por tabela (nº de linhas hoje em `Base_Medro`, `RDS-Managements`, `Prod_Avaliacao_Final`, `CheckList_Veicular`, `PF e IQ`) — para dimensionar paginação/índices.
5. **Protheus** — usuário/senha SQL de leitura + confirmação de allowlist de IP para o Render; `SCP010` e `ABF010` são usadas em algum lugar (não achei referência nas telas)?
6. **SharePoint** — a app registration atual (`c640f62a…`) tem permissão de **Microsoft Graph Sites.ReadWrite.All**? Ou usamos outra identidade para SharePoint?
7. **Filiais** — cada filial tem seu fuso e idioma (BR pt-BR / Aveiro pt-PT). Datas hoje são texto em vários campos (`xDataNecess`, `xDataNecess`) — padronizar para ISO no back?
8. **Anexos** — fotos de peritagem: hoje vão para `/Doc Tcnicos/Fotos Peritagens/{filial}/{cliente}/{os}/{tipo}` via flow. Mantemos esse caminho exato?

## F. O que já está confirmado (não precisa revisar)

- Dados permanecem em Dataverse + SharePoint + Protheus; back Node é BFF.
- Front: React + Vite + shadcn/ui + Reshaped, estética iOS 15, paleta fornecida.
- Deploy: Vercel (web) + Render (api + workers).
- Login próprio via `Credenciaiss`; RBAC por `acesso_mod`.
- 10 flows viram endpoints/jobs no back (doc 03).
- 25 tabelas Dataverse + ~20 listas SharePoint reais + 1–3 tabelas Protheus.
