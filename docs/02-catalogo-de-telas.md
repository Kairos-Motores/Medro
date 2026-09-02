# Medro — Catálogo de Telas

> Extraído de `Src/*.pa.yaml` do pacote PowerApps. **78 telas.**

Cada ficha lista: fonte(s) de dados lidas/escritas, Flows chamados, navegação de saída, variáveis globais/locais, formulários e galerias, e as principais ações de botões.

## Resumo por módulo

### Login & Menu

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [1_Menu](#tela-1-menu) | 581 | `CIPA_2026`, `Credenciaiss`, `RDS`, `RDS-Managements`, `Relatório` | — | Login, Login_1, Menu_RDS, Relatorio, SELEC_COD, Seleção_trajeto_SSMA, VotaçãoCIPA |
| [SELEC_COD](#tela-selec-cod) | 468 | `Balanceamento`, `Credenciaiss`, `Relatório` | — | AvaliacaoFinal, COD_GERENCIAMENTO, ControleTerceirizado, Controle_Caldeiraria, DepTecnico, EntradaTarefa, EscopoDeManuten, GerarLink_DPT |
| [Screen2](#tela-screen2) | 324 | `Credenciaiss`, `Relatorio_Fotografico`, `Relatório` | `Imagens_JSON`, `salvarfotosperitagem` | — |
| [Login](#tela-login) | 196 | `Credenciaiss` | — | AvaliacaoFinal |
| [Login_1](#tela-login-1) | 196 | `Credenciaiss` | — | AvaliacaoFinal |
| [Menu_RDS](#tela-menu-rds) | 75 | `RDS` | — | Historico_RDS, Req_RDS |
| [Atendimento](#tela-atendimento) | 40 | — | — | — |
| [Screen1](#tela-screen1) | 29 | `ZB6_Relatorio` | — | — |

### OS Medro

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [TelaInicial_Medro_Nova](#tela-telainicial-medro-nova) | 2400 | `Base_Medro`, `Caldeiraria_Controle`, `Credenciaiss`, `ZB6010` | — | EdicaoOS_Medro, Entrada_Medro_Nova, Finalizar_Medro_Nova, Gestao_Pendencias_Medro, SELEC_COD |
| [Finalizar_Medro_Nova](#tela-finalizar-medro-nova) | 2099 | `Balanceamento`, `Base_Medro`, `CK_Farol`, `Credenciaiss`, `Lista Auxiliar - Setores Medro` | — | — |
| [Entrada_Medro_Nova](#tela-entrada-medro-nova) | 1643 | `Balanceamento`, `Base_Medro`, `Caldeiraria_Controle`, `Credenciaiss`, `Laudos`, `Lista Auxiliar - Clientes Medro`, `Lista Auxiliar - Setores Medro` | `CopiarLaudo`, `gerarlinkLaudo` | — |
| [EdicaoOS_Medro](#tela-edicaoos-medro) | 1139 | `Balanceamento`, `Base_Medro`, `Caldeiraria_Controle`, `Lista Auxiliar - Clientes Medro`, `Lista Auxiliar - Setores Medro` | — | — |
| [Gestao_Pendencias_Medro](#tela-gestao-pendencias-medro) | 945 | `Base_Medro`, `Credenciaiss` | — | — |

### Pendentes / Atualização

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [AtualizacaoPendentes](#tela-atualizacaopendentes) | 2392 | `Serviços Terceirizados`, `servicosterceirizados` | — | — |
| [HistoricoPendentes](#tela-historicopendentes) | 1778 | `Serviços Terceirizados`, `servicosterceirizados` | — | — |
| [EntradaTarefa](#tela-entradatarefa) | 790 | `Credenciaiss`, `Lista QR Code`, `Tarefas Operacionais` | — | — |
| [PendentesdeRetorno](#tela-pendentesderetorno) | 282 | `servicosterceirizados` | — | AtualizacaoPendentes, ControleTerceirizado |
| [HistoricoTarefa_PRP](#tela-historicotarefa-prp) | 142 | `Lista QR Code`, `Tarefas Operacionais` | — | — |

### PCP / Gerenciamento

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [COD_GERENCIAMENTO](#tela-cod-gerenciamento) | 12947 | `Balanceamento`, `Credenciaiss`, `Lista Auxiliar - Clientes Medro`, `Lista Auxiliar - Setores Medro`, `RDS`, `RDS-Managements`, `Serviços Terceirizados`, `Usuários` | — | Exportar_CheckList, Seleção_trajeto_SSMA, TelaPCP_SLZ |
| [TelaPCP_SLZ](#tela-telapcp-slz) | 7882 | `CheckList_Veicular`, `Credenciaiss`, `Lista Auxiliar - Clientes Medro`, `PF e IQ`, `RDS`, `RDS-Managements`, `Serviços Terceirizados`, `Trajetos` | — | — |
| [PCP_ANTIGO](#tela-pcp-antigo) | 7206 | `PF e IQ`, `PF e IQ - 2024`, `Prod_Avaliacao_Final` | — | — |
| [TelaPCP_SLZ_1](#tela-telapcp-slz-1) | 6268 | `CheckList_Veicular`, `Lista Auxiliar - Clientes Medro`, `PF e IQ`, `RDS`, `Serviços Terceirizados`, `Trajetos` | — | — |
| [Requisição_PCP](#tela-requisi-o-pcp) | 416 | `Base_Medro`, `Requisicao` | — | SELEC_COD |

### Peritagem / Avaliação / Inspeção

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [GaleriaPeritagem](#tela-galeriaperitagem) | 6089 | `Credenciaiss`, `Lista Auxiliar - Clientes Medro`, `Prod_Avaliacao_Final`, `Prod_LiberarEnsaio` | — | AvaliacaoFinal, EnsaioTemporizado, PeritagemFin_opicional |
| [FormInspec](#tela-forminspec) | 3801 | `Credenciaiss`, `Lista Auxiliar - Inspeção de Qualidade`, `Prod_Avaliacao_Final`, `Prod_Inspecao` | — | — |
| [HistoricoAvalFinais](#tela-historicoavalfinais) | 3786 | `Lista Auxiliar - Inspeção de Qualidade`, `Prod_Avaliacao_Final`, `Prod_Avaliacao_Final_Opc`, `Prod_Inspecao`, `ensaio_temporizado` | — | PCP_ANTIGO |
| [PeritagemFin_opicional](#tela-peritagemfin-opicional) | 3540 | `Prod_Avaliacao_Final_Opc` | — | — |
| [InspecQuali](#tela-inspecquali) | 168 | `Prod_Avaliacao_Final`, `Prod_Inspecao` | — | FormInspec |
| [AvaliacaoFinal](#tela-avaliacaofinal) | 138 | `Credenciaiss` | — | GaleriaPeritagem, HistoricoAvalFinais, InspecQuali, LiberarEnsaio, SELEC_COD |
| [PeritagemFin_Temporizado](#tela-peritagemfin-temporizado) | 41 | — | — | — |

### Ensaio

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [EnsaioTemporizado](#tela-ensaiotemporizado) | 1803 | `ensaio_temporizado` | — | — |
| [LiberarEnsaio](#tela-liberarensaio) | 296 | `Prod_LiberarEnsaio` | — | — |

### Caldeiraria

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [Caldeiraria_Novo](#tela-caldeiraria-novo) | 3006 | `Balanceamento`, `Base_Medro`, `Caldeiraria_Controle`, `Caldeiraria_Lista`, `Credenciaiss` | — | — |
| [Caldeiraria_Pendentes_Servicos](#tela-caldeiraria-pendentes-servicos) | 1615 | `Balanceamento`, `Caldeiraria_Controle`, `Credenciaiss` | — | — |
| [Caldeiraria_Histórico](#tela-caldeiraria-hist-rico) | 1495 | `Caldeiraria_Controle` | — | Caldeiraria_Pendentes_Servicos |
| [Controle_Caldeiraria](#tela-controle-caldeiraria) | 326 | `Balanceamento`, `Caldeiraria_Controle`, `Caldeiraria_Lista`, `Credenciaiss` | — | Caldeiraria_Botao_Pendente, Caldeiraria_Histórico, Caldeiraria_ListadePecas, Caldeiraria_Novo, SELEC_COD |
| [Caldeiraria_Pendentes_OS](#tela-caldeiraria-pendentes-os) | 310 | `Balanceamento`, `Caldeiraria_Controle` | — | Caldeiraria_Pendentes_Servicos |
| [Caldeiraria_ListadePecas](#tela-caldeiraria-listadepecas) | 200 | `Caldeiraria_Controle`, `Caldeiraria_Lista` | — | Caldeiraria_Pendentes_Servicos |
| [Caldeiraria_Pendentes_Peças](#tela-caldeiraria-pendentes-pe-as) | 165 | `Balanceamento`, `Caldeiraria_Controle` | — | Caldeiraria_Pendentes_Servicos |
| [Caldeiraria_Botao_Pendente](#tela-caldeiraria-botao-pendente) | 143 | `Balanceamento`, `Caldeiraria_Controle`, `Credenciaiss` | — | Balanceamento_Pendentes, Caldeiraria_Pendentes_OS, Caldeiraria_Pendentes_Peças, Controle_Caldeiraria |

### Balanceamento

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [Rel_Balanceamento](#tela-rel-balanceamento) | 280 | `Balanceamento`, `Relatório` | — | SELEC_COD |
| [Balanceamento_Pendentes](#tela-balanceamento-pendentes) | 146 | `Balanceamento`, `Caldeiraria_Controle` | — | Caldeiraria_Pendentes_Servicos |

### Departamento Técnico / Laudos

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [DepTecnico](#tela-deptecnico) | 4636 | `Base_Medro`, `Credenciaiss`, `Laudos`, `Prod_Avaliacao_Final`, `Prod_Avaliacao_Final_Opc`, `Prod_Inspecao` | `gerarlinkLaudo`, `obterLaudo` | QRCodeLaudos, SELEC_COD |
| [QRCodeLaudos](#tela-qrcodelaudos) | 660 | `Credenciaiss`, `Laudos`, `Lista Auxiliar - Clientes Medro`, `Relatório` | `gerarlinkLaudo` | SELEC_COD |
| [GerarLink_DPT](#tela-gerarlink-dpt) | 458 | `Laudos`, `Lista Auxiliar - Clientes Medro`, `Requisicao` | `CopiarLaudo`, `gerarlinkLaudo` | SELEC_COD |

### Trajetos / SSMA

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [Seleção_trajeto_SSMA](#tela-sele-o-trajeto-ssma) | 8305 | `CheckList_Veicular`, `Credenciaiss`, `Trajetos` | — | ImprimirSSMA |
| [ImprimirSSMA](#tela-imprimirssma) | 6175 | `CheckList_Veicular` | — | — |
| [TelaTrajetos](#tela-telatrajetos) | 2733 | `Credenciaiss`, `Lista Auxiliar - Clientes Medro`, `Trajetos` | — | — |
| [TrajetoFinal](#tela-trajetofinal) | 2529 | `Credenciaiss`, `Trajetos` | — | — |
| [SelecaoTrajeto](#tela-selecaotrajeto) | 291 | `Credenciaiss`, `Trajetos` | — | Checklist_veicular_slz, Controle_Caldeiraria, HistóricoTrajeto, Histórico_check_SLZ, SELEC_COD, TelaTrajetos, TrajetoFinal |
| [HistóricoTrajeto](#tela-hist-ricotrajeto) | 204 | `Trajetos` | — | — |

### Checklist Veicular

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [Checklist_veicular_slz](#tela-checklist-veicular-slz) | 6273 | `CheckList_Veicular`, `controle_veiculo` | — | — |
| [Checklist_veicular_slz_View](#tela-checklist-veicular-slz-view) | 6131 | `CheckList_Veicular`, `Credenciaiss` | — | — |
| [Novo_CheckList_Veicular](#tela-novo-checklist-veicular) | 1523 | `CheckList_Veicular`, `controle_veiculo` | — | — |
| [Exportar_CheckList](#tela-exportar-checklist) | 312 | `CheckList_Veicular` | `gerar_planilha_checkList_veicular` | COD_GERENCIAMENTO |
| [Histórico_check_SLZ](#tela-hist-rico-check-slz) | 182 | `CheckList_Veicular`, `Credenciaiss`, `Trajetos` | — | Checklist_veicular_slz_View, Exportar_CheckList, SelecaoTrajeto |

### Ferramentaria

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [T_Ferramentaria_Checklist](#tela-t-ferramentaria-checklist) | 3741 | `Balanceamento`, `Controle Ferramentas`, `Credenciaiss`, `Lista Auxiliar - Ferramentas`, `Lista Auxiliar - Ferramentas por Setor` | — | — |
| [T_Ferramentaria_FerrPorSetor](#tela-t-ferramentaria-ferrporsetor) | 2490 | `Balanceamento`, `Credenciaiss`, `Lista Auxiliar - Ferramentas`, `Lista Auxiliar - Ferramentas por Setor` | — | — |
| [T_Ferramentaria_Banco](#tela-t-ferramentaria-banco) | 1599 | `Lista Auxiliar - Ferramentas`, `Lista Auxiliar - Ferramentas por Setor` | — | — |
| [T_Ferramentaria_historic](#tela-t-ferramentaria-historic) | 277 | `Controle Ferramentas`, `Lista Auxiliar - Ferramentas`, `Lista Auxiliar - Ferramentas por Setor` | — | — |
| [T_Ferramentaria](#tela-t-ferramentaria) | 135 | — | — | T_Ferramentaria_Banco, T_Ferramentaria_Checklist, T_Ferramentaria_FerrPorSetor, T_Ferramentaria_historic |

### Serviços Externos / Terceirizados

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [ServiçosExternos](#tela-servi-osexternos) | 1597 | `ServiçosExternosPortugal` | — | — |
| [NovoRegistroTerceir](#tela-novoregistroterceir) | 1582 | `servicosterceirizados`, `servicosterceirizados_for` | — | — |
| [HIstóricoServAVR](#tela-hist-ricoservavr) | 332 | `ServiExternosAveiro`, `ServiçosExternosPortugal` | — | ServiçosExternos |
| [HistoricoTerceir](#tela-historicoterceir) | 280 | `Serviços Terceirizados`, `servicosterceirizados` | — | ControleTerceirizado, HistoricoPendentes |
| [ControleTerceirizado](#tela-controleterceirizado) | 106 | `Serviços Terceirizados` | — | HistoricoTerceir, NovoRegistroTerceir, PendentesdeRetorno, SELEC_COD |

### RDS

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [Req_RDS](#tela-req-rds) | 1437 | `Credenciaiss`, `Lista Auxiliar - Clientes Medro`, `RDS`, `RDS-Managements`, `controle_veiculo` | — | — |
| [Historico_RDS](#tela-historico-rds) | 182 | `Credenciaiss`, `RDS`, `RDS-Managements` | — | — |
| [Requisição RDS](#tela-requisi-o-rds) | 87 | `RDS` | — | T_Ferramentaria |

### Relatório Fotográfico

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [Relatorio](#tela-relatorio) | 1039 | `Credenciaiss`, `Relatório` | — | — |
| [Rel_Foto_parametro](#tela-rel-foto-parametro) | 736 | `Credenciaiss`, `Lista Auxiliar - Clientes Medro`, `Relatorio_Fotografico`, `Relatório` | `exibir_imagens_sharepoint` | Login, Login_1, Rel_Foto_Escolha, Rel_Foto_Per |
| [Rel_Foto_Lista](#tela-rel-foto-lista) | 447 | — | `Exibir_Imagem`, `exibir_imagens_sharepoint` | Rel_Foto_Escolha |
| [Rel_Foto_Lista_PC](#tela-rel-foto-lista-pc) | 417 | — | `Exibir_Imagem`, `Imagens_JSON`, `exibir_imagens_sharepoint` | Rel_Foto_Escolha |
| [Rel_Foto_Per](#tela-rel-foto-per) | 344 | `CIPA_2026`, `Credenciaiss`, `Relatorio_Fotografico`, `Relatório` | `Imagens_JSON`, `salvarfotosperitagem` | Login_1, Rel_Foto_parametro |
| [Rel_Foto_Escolha](#tela-rel-foto-escolha) | 65 | `CIPA_2026`, `Relatório` | — | Rel_Foto_Lista, Rel_Foto_Lista_PC, Rel_Foto_parametro, SELEC_COD |

### Escopo de Manutenção

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [EscopoDeManuten](#tela-escopodemanuten) | 303 | `ABF010`, `Laudos`, `SCP010` | — | SELEC_COD |

### CIPA

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [VotaçãoCIPA](#tela-vota-ocipa) | 391 | `CIPA_2026` | — | — |

### Documentos

| Tela | Linhas | Fontes de dados | Flows | Navega para |
|---|--:|---|---|---|
| [Documentos_trajeto SLZ](#tela-documentos-trajeto-slz) | 101 | `Doc.Medro.SLZ` | — | — |


---

## Fichas detalhadas


# Módulo: Login & Menu


<a id="tela-1-menu"></a>
## 1_Menu

- **Arquivo:** `Src/1_Menu.pa.yaml` — 581 linhas — 31 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `CIPA_2026`, `Credenciaiss`, `RDS`, `RDS-Managements`, `Relatório`
- **Galerias:**
  - `Gallery4` → itens: `Filter('RDS-Managements', Motorista = LookUp(Credenciaiss,varlogin = Usuário,Título),Atendimento <> "Concluído",Atendimento <> "Cancelado")`
  - `Gallery4_1` → itens: `Filter('RDS-Managements', Auxiliar = LookUp(Credenciaiss,varlogin = Usuário,Título),Atendimento <> "Concluído",Atendimento <> "Cancelado")`
- **Navega para:** `Login`, `Login_1`, `Menu_RDS`, `Relatorio`, `SELEC_COD`, `Seleção_trajeto_SSMA`, `VotaçãoCIPA`
- **Variáveis de contexto (locais):** `rdsmot`

**OnVisible:**

```
Refresh(CIPA_2026)
```

**OnHidden:** `UpdateContext({rdsmot:false,rdsaux:false})`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Button1_72` (Classic) | "Medro" | OnSelect | `If( "SELEC_COD" in LookUp( Credenciaiss, Usuário = caixausuario1.Text And Matrícula = caixasenha1.Text, acesso_mod ), Navigate( SELEC_COD, ScreenTransition.CoverRight ), !IsBlank( LookUp( Credenciaiss, Usuário = caixausuario1.Text And Matrícula = caixasenha1.Text And '1_Nivel' = "PRODUÇÃO PADRÃO" And '2_Nivel' = "TESTE" ) ), Navigate( SELEC_COD, ScreenTransition.CoverRight ), //___________________` |
| `Button1_73` (Classic) | "RDS" | OnSelect | `Navigate(Menu_RDS);Refresh(RDS)` |
| `Image1_8` (Image) | Image1_8 | OnSelect | `Navigate(Login) //Navigate(Login_1)` |
| `Button1_80` (Classic) | "Relatório" | OnSelect | `Navigate(Relatorio);NewForm(Form_Relatorio)` |
| `ButtonCanvas23` (Button) | "Votar agora!!" | OnSelect | `Navigate(VotaçãoCIPA)` |

**Controles:** Label×16, Classic×6, Rectangle×4, Gallery×2, Image×2, Button×1


<a id="tela-selec-cod"></a>
## SELEC_COD

- **Arquivo:** `Src/SELEC_COD.pa.yaml` — 468 linhas — 18 controles
- **Fundo:** `t`
- **Fontes de dados:** `Balanceamento`, `Credenciaiss`, `Relatório`
- **Navega para:** `AvaliacaoFinal`, `COD_GERENCIAMENTO`, `ControleTerceirizado`, `Controle_Caldeiraria`, `DepTecnico`, `EntradaTarefa`, `EscopoDeManuten`, `GerarLink_DPT`, `QRCodeLaudos`, `Rel_Balanceamento`, `Rel_Foto_Escolha`, `Requisição_PCP`, `SelecaoTrajeto`, `T_Ferramentaria`, `TelaInicial_Medro_Nova`
- **Set() variáveis globais:** `Log`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Image1_21` (Image) | Image1_21 | OnSelect | `Navigate('1_Menu')` |
| `button_OS__1` (Classic) | "Ordem de Serviço" | OnSelect | `Navigate(TelaInicial_Medro_Nova,ScreenTransition.Cover,{os:true});Set(Log,"OS");` |
| `button_avaliacao` (Classic) | "Avaliação de Equipamentos" | OnSelect | `Navigate(AvaliacaoFinal,ScreenTransition.Cover)` |
| `button_tarefas` (Classic) | "Tarefa" | OnSelect | `Navigate(EntradaTarefa,ScreenTransition.Cover);NewForm(TarefaBRC)` |
| `button_gerenciamento` (Classic) | "Gerenciamento" | OnSelect | `Navigate(COD_GERENCIAMENTO,ScreenTransition.Cover)` |
| `button_ferramenta` (Classic) | "Ferramentaria" | OnSelect | `Navigate(T_Ferramentaria,ScreenTransition.Cover)` |
| `button_ferramenta_1` (Classic) | "Serviços Internos" | OnSelect | `Navigate(Controle_Caldeiraria,ScreenTransition.Cover)` |
| `button_ferramenta_2` (Classic) | "Rotas" | OnSelect | `Navigate(SelecaoTrajeto,ScreenTransition.Cover)` |
| `button_ferramenta_3` (Classic) | "Controle Terceirizado" | OnSelect | `Navigate(ControleTerceirizado,ScreenTransition.Cover)` |
| `button_ferramenta_11` (Classic) | "Registro de requisição" | OnSelect | `Navigate(Requisição_PCP,ScreenTransition.Cover);NewForm(FormRequisicao)` |
| `button_ferramenta_12` (Classic) | "Departamento Técnico" | OnSelect | `Navigate(DepTecnico,ScreenTransition.Cover)` |
| `button_ferramenta_14` (Classic) | "Controle de QRCodes" | OnSelect | `Navigate(QRCodeLaudos,ScreenTransition.Cover)` |
| `button_ferramenta_15` (Classic) | "Escopo de Manutenção" | OnSelect | `Navigate(EscopoDeManuten,ScreenTransition.Cover)` |
| `button_ferramenta_16` (Classic) | "Gerar link relatórios" | OnSelect | `Navigate(GerarLink_DPT,ScreenTransition.Cover)` |
| `button_peritagem` (Classic) | "Relatório Fotográfico" | OnSelect | `Navigate(Rel_Foto_Escolha,ScreenTransition.Cover)` |
| `button_balanceamento` (Classic) | "Relatório Balanceamento" | OnSelect | `Navigate(Rel_Balanceamento,ScreenTransition.Cover)` |

**Controles:** Classic×15, Label×1, Image×1, GroupContainer×1


<a id="tela-screen2"></a>
## Screen2

- **Arquivo:** `Src/Screen2.pa.yaml` — 324 linhas — 12 controles
- **Fundo:** `RGBA(255, 255, 255, 1)`
- **Fontes de dados:** `Credenciaiss`, `Relatorio_Fotografico`, `Relatório`
- **Escreve (Patch) em:** `Relatorio_Fotografico`
- **Galerias:**
  - `Gallery20` → itens: `Sort(colFilaFotos,Data,SortOrder.Descending)`
- **Flows chamados:** `Imagens_JSON`, `salvarfotosperitagem`
- **Coleções (Collect/ClearCollect):** `colAllFotos`, `colLote`, `colRelatorioLinha`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `AddMediaButton1_1` (AddMedia) | "Adicionar" | OnChange | `With( { j: JSON(UploadedImage1_1.Image, JSONFormat.IncludeBinaryData) }, Collect( colFilaFotos, { Id: GUID(), Cliente: varCliente, OS: varOS, Progresso: 0, Data: Now(), Filial: varfilial, Tipo: DropdownCanvas3.Selected.Value, DataUri: Mid(j, 2, Len(j) - 2), // remove as aspas do JSON "..." Status: "Pendente", MsgErro: "" } ) ); Notify("Foto adicionada na fila.", NotificationType.Success)` |
| `ButtonCanvas35_2` (Button) | "Subir Imagens" | OnSelect | `// 1) Pega até 10 fotos pendentes ClearCollect( colLote, FirstN( Filter(colFilaFotos, Status = "Pendente"), 10 ) ); If( CountRows(colLote) = 0, Notify("Não há fotos pendentes.", NotificationType.Information), false ); // 2) Marca como Enviando ForAll( colLote, UpdateIf( colFilaFotos, Id = ThisRecord.Id, { Status: "Enviando", MsgErro: "" } ) ); // 3) Envia 1 por 1 chamando o Flow (DATA URI) /* ForA` |

**Controles:** ModernText×3, Rectangle×2, Image×2, AddMedia×1, GroupContainer×1, Gallery×1, ModernDropdown×1, Button×1


<a id="tela-login"></a>
## Login

- **Arquivo:** `Src/Login.pa.yaml` — 196 linhas — 8 controles
- **Fundo:** `LoginMedro`
- **Fontes de dados:** `Credenciaiss`
- **Navega para:** `AvaliacaoFinal`
- **Set() variáveis globais:** `varfilial`, `varlogin`, `varnome`, `varsenha`
- **Variáveis de contexto (locais):** `show`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Label9` (Label) | "Update 106" | OnSelect | `Navigate(AvaliacaoFinal)` |
| `Botão_de_login_2` (Classic) | "" | OnSelect | `If("AVA" in LookUp(Credenciaiss,varlogin=Usuário,acesso_mod),Navigate(AvaliacaoFinal), false )` |
| `Botão_de_login_1` (Classic) | "Login" | OnSelect | `If( !IsBlank( LookUp( Credenciaiss, Usuário = caixausuario1.Text And Matrícula = caixasenha1.Text And xstatus = "Ativo" ) ), Navigate( '1_Menu', ScreenTransition.CoverRight ); Set( varlogin, caixausuario1.Text ); Set( varsenha, caixasenha1.Text ); Set( varnome, LookUp( Credenciaiss, Usuário = caixausuario1.Text And Matrícula = caixasenha1.Text, Título ) ) ; Set( varfilial, LookUp( Credenciaiss, Us` |

**Controles:** Classic×4, Label×2, Image×1, Timer×1


<a id="tela-login-1"></a>
## Login_1

- **Arquivo:** `Src/Login_1.pa.yaml` — 196 linhas — 8 controles
- **Fundo:** `'LoginMedro-2'`
- **Fontes de dados:** `Credenciaiss`
- **Navega para:** `AvaliacaoFinal`
- **Set() variáveis globais:** `varfilial`, `varlogin`, `varnome`, `varsenha`
- **Variáveis de contexto (locais):** `show`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Label9_1` (Label) | "Update 84" | OnSelect | `Navigate(AvaliacaoFinal)` |
| `Botão_de_login_3` (Classic) | "" | OnSelect | `If("AVA" in LookUp(Credenciaiss,varlogin=Usuário,acesso_mod),Navigate(AvaliacaoFinal), false )` |
| `Botão_de_login_4` (Classic) | "Login" | OnSelect | `If( !IsBlank( LookUp( Credenciaiss, Usuário = caixausuario.Text And Matrícula = caixasenha.Text And xstatus = "Ativo" ) ), Navigate( '1_Menu', ScreenTransition.CoverRight ); Set( varlogin, caixausuario.Text ); Set( varsenha, caixasenha.Text ); Set( varnome, LookUp( Credenciaiss, Usuário = caixausuario.Text And Matrícula = caixasenha.Text, Título ) ) ; Set( varfilial, LookUp( Credenciaiss, Usuário ` |

**Controles:** Classic×4, Label×2, Image×1, Timer×1


<a id="tela-menu-rds"></a>
## Menu_RDS

- **Arquivo:** `Src/Menu_RDS.pa.yaml` — 75 linhas — 3 controles
- **Fundo:** `t`
- **Fontes de dados:** `RDS`
- **Navega para:** `Historico_RDS`, `Req_RDS`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Button1_77` (Classic) | "Requisição RDS" | OnSelect | `Navigate(Req_RDS);NewForm(formRDS)` |
| `Button1_78` (Classic) | "Histórico RDS" | OnSelect | `Navigate(Historico_RDS)` |

**Controles:** Classic×2, Image×1


<a id="tela-atendimento"></a>
## Atendimento

- **Arquivo:** `Src/Atendimento.pa.yaml` — 40 linhas — 2 controles
- **Fundo:** `t`

**Controles:** Label×1, Image×1


<a id="tela-screen1"></a>
## Screen1

- **Arquivo:** `Src/Screen1.pa.yaml` — 29 linhas — 1 controles
- **Fundo:** `RGBA(234, 234, 234, 1)`
- **Fontes de dados:** `ZB6_Relatorio`

**Controles:** ModernText×1


# Módulo: OS Medro


<a id="tela-telainicial-medro-nova"></a>
## TelaInicial_Medro_Nova

- **Arquivo:** `Src/TelaInicial_Medro_Nova.pa.yaml` — 2400 linhas — 160 controles
- **Fundo:** `Fundo_Input_Medro_2`
- **Fontes de dados:** `Base_Medro`, `Caldeiraria_Controle`, `Credenciaiss`, `ZB6010`
- **Formulários:**
  - `OS_Info` → fonte `Base_Medro` — item: `EmAberto_Medro_Novo_1.Selected`
- **Galerias:**
  - `EmAberto_Medro_Novo_3` → itens: `If(
    "_OS_PESQ" in LookUp(
        Credenciaiss,
        varlogin = Usuário,
        acesso_mod
    ),
    Sort(
        Search(
            Base_Medro,
            TextInputCan`
  - `EmAberto_Medro_Novo` → itens: `Filter(Base_Medro,fCadastro = "Pendente" , Unidade = varfilial
)`
  - `EmAberto_Medro_Novo_1` → itens: `If(
    "_OS_PESQ" in LookUp(
        Credenciaiss,
        varlogin = Usuário,
        acesso_mod
    ),
    Sort(
        Search(
            Base_Medro,
            TextInputCan`
  - `EmAberto_Medro_Novo_2` → itens: `Sort(
    Search(
        Filter(
            Base_Medro,
            Responsavel = LookUp(Credenciaiss, Usuário = varlogin,Título)
        ),
        TextInputCanvas3_1.Value,
   `
  - `Gallery8` → itens: `Distinct( Filter(Base_Medro, Responsavel = LookUp(
        Credenciaiss,
        Usuário = varlogin,
        Título



    ), Setor<> "AGUARDANDO PROCESSO"    )   ,Setor)`
  - `Pendencias_Medro` → itens: `Filter(Base_Medro,Check_aprov = 1,Status_Reprov = "Pendente" || Status_Reprov = "Em tratamento", Unidade = varfilial)`
- **Navega para:** `EdicaoOS_Medro`, `Entrada_Medro_Nova`, `Finalizar_Medro_Nova`, `Gestao_Pendencias_Medro`, `SELEC_COD`
- **Variáveis de contexto (locais):** `contagem`, `edicao`, `hist`, `histp`, `openOS`, `os`

**OnHidden:** `UpdateContext({os:true,conf:false,hist:false,histp:false,contagem:false,pend:false,edicao:false})`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `EmAberto_Medro_Novo_3` (Gallery) | EmAberto_Medro_Novo_3 | OnSelect | `Navigate(EdicaoOS_Medro)` |
| `EmAberto_Medro_Novo` (Gallery) | EmAberto_Medro_Novo | OnSelect | `Navigate(Finalizar_Medro_Nova)` |
| `EmAberto_Medro_Novo_1` (Gallery) | EmAberto_Medro_Novo_1 | OnSelect | `Navigate(Finalizar_Medro_Nova,ScreenTransition.Cover)` |
| `Image24` (Image) | Image24 | OnSelect | `Remove(Base_Medro,EmAberto_Medro_Novo_1.Selected)` |
| `ButtonCanvas43` (Button) | "Salvar" | OnSelect | `SubmitForm(OS_Info)` |
| `Image57` (Image) | Image57 | OnSelect | `Navigate(SELEC_COD)` |
| `Image50` (Image) | Image50 | OnSelect | `Navigate(Entrada_Medro_Nova);NewForm(FormEntradaMedro)` |
| `EmAberto_Medro_Novo_2` (Gallery) | EmAberto_Medro_Novo_2 | OnSelect | `Navigate(Finalizar_Medro_Nova,ScreenTransition.Cover)` |
| `Pendencias_Medro` (Gallery) | Pendencias_Medro | OnSelect | `Navigate(Gestao_Pendencias_Medro)` |

**Controles:** Text×43, Image×27, Label×27, GroupContainer×15, TypedDataCard×12, TextInput×10, Gallery×6, Classic×5, Rectangle×4, Button×3, ComboBox×3, Star×2, ModernTextInput×2, Form×1


<a id="tela-finalizar-medro-nova"></a>
## Finalizar_Medro_Nova

- **Arquivo:** `Src/Finalizar_Medro_Nova.pa.yaml` — 2099 linhas — 159 controles
- **Fundo:** `Fundo_Input_Medro_2`
- **Fontes de dados:** `Balanceamento`, `Base_Medro`, `CK_Farol`, `Credenciaiss`, `Lista Auxiliar - Setores Medro`
- **Escreve (Patch) em:** `Base_Medro`, `CK_Farol`
- **Formulários:**
  - `FormDestinacao` → fonte `Base_Medro`
  - `FormSaidaMedro` → fonte `Base_Medro` — item: `EmAberto_Medro_Novo.Selected`
- **Variáveis de contexto (locais):** `avisofechar`, `dest`

**OnVisible:**

```
UpdateContext({avisofechar:false,dest:false})
```

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Image39_3` (Image) | Image39_3 | OnSelect | `Back();ResetForm(FormSaidaMedro);` |
| `Image82` (Image) | Image82 | OnSelect | `SubmitForm(FormSaidaMedro); If( Caixadestinacao.Selected.Nome = "Aguardando Processo", Patch( CK_Farol, LookUp( CK_Farol, OS = Trim(DataCardValue58.Value) ), {StatusComercial: "AGUARDANDO COTACAO"} ), false )` |
| `FormSaidaMedro` (Form) | FormSaidaMedro | OnFailure | `Notify("Erro",NotificationType.Error,2000)` |
| `FormSaidaMedro` (Form) | FormSaidaMedro | OnSuccess | `Notify("✅",NotificationType.Success,2000);If(dest = true,UpdateContext({avisofechar:true,dest:false}),Back()) ; Patch( Base_Medro, LookUp( Base_Medro, OS = DataCardValue58.Value And Setor = "Pintura" And Responsavel = "Destinado" ), {'Tipo de Pintura': DataCardValue21.Selected.Value} )` |
| `button_OS__2` (Classic) | "Destinação" | OnSelect | `UpdateContext({dest:true});NewForm(FormDestinacao)` |
| `ButtonCanvas8` (Button) | "Confirmar" | OnSelect | `SubmitForm(FormDestinacao) ; Patch( Base_Medro, LookUp( Base_Medro, OS = DataCardValue58.Value And Setor = "Pintura" And Responsavel = "Destinado" ), {'Tipo de Pintura': DataCardValue21.Selected.Value} )` |

**Controles:** Text×79, TypedDataCard×25, TextInput×19, DropDown×8, ComboBoxDataField×7, ComboBox×5, DatePicker×4, Image×3, Form×2, Label×2, Classic×2, GroupContainer×1, Rectangle×1, Button×1


<a id="tela-entrada-medro-nova"></a>
## Entrada_Medro_Nova

- **Arquivo:** `Src/Entrada_Medro_Nova.pa.yaml` — 1643 linhas — 116 controles
- **Fundo:** `Fundo_Input_Medro_2`
- **Fontes de dados:** `Balanceamento`, `Base_Medro`, `Caldeiraria_Controle`, `Credenciaiss`, `Laudos`, `Lista Auxiliar - Clientes Medro`, `Lista Auxiliar - Setores Medro`
- **Escreve (Patch) em:** `Laudos`
- **Formulários:**
  - `FormEntradaMedro` → fonte `Base_Medro`
- **Galerias:**
  - `Gallery5` → itens: `Filter(Caldeiraria_Controle, OS = DataCardValue58_2.Value,xStatus = "Pendente")`
- **Flows chamados:** `CopiarLaudo`, `gerarlinkLaudo`
- **Set() variáveis globais:** `ValPCP`, `linkFinalPCP`, `linkInicialPCP`
- **Variáveis de contexto (locais):** `confirmar`, `serv`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `FormEntradaMedro` (Form) | FormEntradaMedro | OnSuccess | `Back(); Notify("✅ Entrada",NotificationType.Success,2000); UpdateContext({confirmar:false})` |
| `Image39_5` (Image) | Image39_5 | OnSelect | `Back();ResetForm(FormEntradaMedro)` |
| `Image82_1` (Image) | Image82_1 | OnSelect | `//SubmitForm(FormEntradaMedro) UpdateContext({confirmar:true})` |
| `Button1` (Classic) | "Salvar" | OnSelect | `If( DataCardValue62_3.Selected.Nome = "PCP" And (DataCardValue62_2.Selected.Unidade.Value = "Barcarena" Or DataCardValue62_2.Selected.Unidade.Value = "São José dos Campos" Or DataCardValue62_2.Selected.Unidade.Value = "Aveiro") And IsBlank(LookUp(Base_Medro,OS_Comp = DataCardValue31.Value && Unidade = varfilial && Setor = "PCP")), //Sucesso //1- CopiarLaudo.Run( "Doc Tcnicos/Laudos/" & DataCardVal` |

**Controles:** Text×44, TypedDataCard×14, ComboBoxDataField×14, TextInput×11, Label×6, Image×6, ComboBox×4, DropDown×4, Classic×3, Rectangle×3, DatePicker×2, Form×1, Button×1, CheckBox×1, GroupContainer×1, Gallery×1


<a id="tela-edicaoos-medro"></a>
## EdicaoOS_Medro

- **Arquivo:** `Src/EdicaoOS_Medro.pa.yaml` — 1139 linhas — 86 controles
- **Fundo:** `Fundo_Input_Medro_2`
- **Fontes de dados:** `Balanceamento`, `Base_Medro`, `Caldeiraria_Controle`, `Lista Auxiliar - Clientes Medro`, `Lista Auxiliar - Setores Medro`
- **Formulários:**
  - `FormEntradaMedro_2` → fonte `Base_Medro` — item: `EmAberto_Medro_Novo_3.Selected`
- **Variáveis de contexto (locais):** `confirmar`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `FormEntradaMedro_2` (Form) | FormEntradaMedro_2 | OnSuccess | `Back();Notify("✅ Entrada",NotificationType.Success,2000);UpdateContext({confirmar:false})` |
| `Image39_7` (Image) | Image39_7 | OnSelect | `Back();ResetForm(FormEntradaMedro_2)` |
| `Image82_3` (Image) | Image82_3 | OnSelect | `//SubmitForm(FormEntradaMedro) UpdateContext({confirmar:true})` |
| `Button1_1` (Classic) | "Salvar" | OnSelect | `SubmitForm(FormEntradaMedro_2)` |

**Controles:** Text×33, ComboBoxDataField×14, TypedDataCard×10, TextInput×8, DropDown×4, Image×4, Classic×3, ComboBox×3, DatePicker×2, Label×2, Form×1, GroupContainer×1, Rectangle×1


<a id="tela-gestao-pendencias-medro"></a>
## Gestao_Pendencias_Medro

- **Arquivo:** `Src/Gestao_Pendencias_Medro.pa.yaml` — 945 linhas — 72 controles
- **Fundo:** `Fundo_Input_Medro_2`
- **Fontes de dados:** `Base_Medro`, `Credenciaiss`
- **Formulários:**
  - `FormEntradaMedro_1` → fonte `Base_Medro` — item: `Pendencias_Medro.Selected`
- **Variáveis de contexto (locais):** `statuspendencia`

**OnHidden:** `UpdateContext({statuspendencia:""})`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `FormEntradaMedro_1` (Form) | FormEntradaMedro_1 | OnSuccess | `Back();Notify("✅ Entrada",NotificationType.Success,2000)` |
| `Image82_2` (Image) | Image82_2 | OnSelect | `SubmitForm(FormEntradaMedro_1)` |

**Controles:** Text×37, TypedDataCard×12, TextInput×10, Classic×3, Image×3, DropDown×2, Label×1, Form×1, DatePicker×1, ComboBox×1, GroupContainer×1


# Módulo: Pendentes / Atualização


<a id="tela-atualizacaopendentes"></a>
## AtualizacaoPendentes

- **Arquivo:** `Src/AtualizacaoPendentes.pa.yaml` — 2392 linhas — 138 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Serviços Terceirizados`, `servicosterceirizados`
- **Formulários:**
  - `FormAtualizacaoPendet` → fonte `servicosterceirizados` — item: `gal_pendentes.Selected`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Button7_1` (Classic) | "Concluir" | OnSelect | `SubmitForm(FormAtualizacaoPendet)` |
| `Button7_2` (Classic) | "Excluir" | OnSelect | `Remove(servicosterceirizados,gal_pendentes.Selected);Back()` |

**Controles:** Label×78, Classic×33, TypedDataCard×25, Form×1, Image×1


<a id="tela-historicopendentes"></a>
## HistoricoPendentes

- **Arquivo:** `Src/HistoricoPendentes.pa.yaml` — 1778 linhas — 106 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Serviços Terceirizados`, `servicosterceirizados`
- **Formulários:**
  - `FormAtualizacaoPendet_1` → fonte `servicosterceirizados` — item: `gal_historico.Selected`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Button7_4` (Classic) | "Concluir" | OnSelect | `SubmitForm(FormAtualizacaoPendet_1)` |
| `Button7_3` (Classic) | "Excluir" | OnSelect | `Remove(servicosterceirizados,gal_historico.Selected);Back()` |

**Controles:** Label×61, Classic×23, TypedDataCard×20, Form×1, Image×1


<a id="tela-entradatarefa"></a>
## EntradaTarefa

- **Arquivo:** `Src/EntradaTarefa.pa.yaml` — 790 linhas — 46 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Credenciaiss`, `Lista QR Code`, `Tarefas Operacionais`
- **Formulários:**
  - `TarefaBRC` → fonte `'Tarefas Operacionais'`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Button1_30` (Classic) | "Enviar" | OnSelect | `SubmitForm(TarefaBRC)` |

**Controles:** Label×26, Classic×9, TypedDataCard×8, Image×1, Form×1, Attachments×1


<a id="tela-pendentesderetorno"></a>
## PendentesdeRetorno

- **Arquivo:** `Src/PendentesdeRetorno.pa.yaml` — 282 linhas — 16 controles
- **Fundo:** `t`
- **Fontes de dados:** `servicosterceirizados`
- **Galerias:**
  - `gal_pendentes` → itens: `If(
    class = true,
    Sort(
        Search(
            Filter(
                servicosterceirizados,
                IsBlank(Data_retorno) And IsBlank(xdataretorno),Unidade =`
- **Navega para:** `AtualizacaoPendentes`, `ControleTerceirizado`
- **Variáveis de contexto (locais):** `class`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `gal_pendentes` (Gallery) | gal_pendentes | OnSelect | `Navigate(AtualizacaoPendentes);EditForm(FormAtualizacaoPendet)` |
| `Image1_49` (Image) | Image1_49 | OnSelect | `Navigate(ControleTerceirizado)` |

**Controles:** Label×7, Image×4, Rectangle×2, Classic×2, Gallery×1


<a id="tela-historicotarefa-prp"></a>
## HistoricoTarefa_PRP

- **Arquivo:** `Src/HistoricoTarefa_PRP.pa.yaml` — 142 linhas — 9 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Lista QR Code`, `Tarefas Operacionais`
- **Galerias:**
  - `historicodetarefaPRP` → itens: `SortByColumns(Filter('Tarefas Operacionais',Unidade ="Parauapebas"),"Data",SortOrder.Descending)`

**Controles:** Label×5, Image×2, Gallery×1, Rectangle×1


# Módulo: PCP / Gerenciamento


<a id="tela-cod-gerenciamento"></a>
## COD_GERENCIAMENTO

- **Arquivo:** `Src/COD_GERENCIAMENTO.pa.yaml` — 12947 linhas — 764 controles
- **Fundo:** `'Firefly Universo escuro, sem estrelas e algumas nebulosas 27848 (1)'`
- **Fontes de dados:** `Balanceamento`, `Credenciaiss`, `Lista Auxiliar - Clientes Medro`, `Lista Auxiliar - Setores Medro`, `RDS`, `RDS-Managements`, `Serviços Terceirizados`, `Usuários`, `controle_man_veicul`, `controle_veiculo`
- **Formulários:**
  - `Form_inclusaocliente_6` → fonte `'Lista Auxiliar - Clientes Medro'` — item: `galeriaclientesmedro_6.Selected`
  - `Form_edit_alterarsetor` → fonte `Credenciaiss` — item: `galeriagestaousesetor.Selected`
  - `Form_novocolab_8` → fonte `Credenciaiss`
  - `FormRDS_2` → fonte `'RDS-Managements'` — item: `galeriaRDS_2.Selected`
  - `Form_nova_manu_1` → fonte `controle_man_veicul` — item: `galeriamanutencao.Selected`
  - `Form_manuRDS_1` → fonte `'RDS-Managements'`
  - `Form_edicao_veic` → fonte `controle_veiculo` — item: `Gallery6.Selected`
  - `Form3` → fonte `controle_veiculo`
  - `Form_edit_gestaouser` → fonte `Credenciaiss` — item: `galeriagestaouserlog.Selected`
  - `Form_edit_gestaouser_1` → fonte `Credenciaiss` — item: `galeriagestaouserlog_1.Selected`
- **Galerias:**
  - `galeriaclientesmedro_6` → itens: `Sort(Filter('Lista Auxiliar - Clientes Medro', Unidade.Value = varfilial,Title <> " -", xStatus <> "Inativo"),Nome_completo,SortOrder.Ascending)`
  - `galeriagestaousesetor` → itens: `Search(Sort(Filter(Credenciaiss, Filial = varfilial, '1_Nivel' = "PRODUÇÃO PADRÃO" ),Título, SortOrder.Ascending),pesquisaloggestaouser_2.Value,Título,Filial)`
  - `galeriaRDS_2` → itens: `If(
    RDS_radio_2.Selected.Value = "Em andamento",
    Sort(
        Search(
            Filter(
                'RDS-Managements',
                (Atendimento = "Pendente" Or A`
  - `Gallery3_2` → itens: `Sort(Filter('RDS-Managements', Atendimento = "Programado"),DataNecess,SortOrder.Ascending)`
  - `Gallery6` → itens: `Sort( Filter( controle_veiculo,xstatus <> "Branco" ),filial,SortOrder.Ascending)`
  - `galeriaveiculosativosman` → itens: `Sort(Search(Filter(controle_veiculo,xstatus = "Ativo"),textcontrolveiculo.Value,veiculo,filial,tipoveicul),filial,SortOrder.Ascending)`
  - `galeriamanutencao` → itens: `Sort( Search(controle_man_veicul,pesquisamanutencao.Value,IDman,ID_veiculo,veiculo,filial,tipodemanutencao,responsavel,statusman,local,descricao) ,'Data de Criação',SortOrder.Desce`
  - `galeriagestaouserlog` → itens: `Search(Sort(Filter(Credenciaiss, "_ROTA_MOT" in acesso_mod Or "_ROTA_AUX" in acesso_mod),Título, SortOrder.Ascending),pesquisaloggestaouser.Value,Título,Filial)`
  - `galeriagestaouserlog_1` → itens: `Search(Sort(Filter(Credenciaiss,Not("_ROTA_MOT" in acesso_mod) And Not("_ROTA_AUX" in acesso_mod)),Título,SortOrder.Ascending),pesquisaloggestaouser_1.Value,Título,Filial)`
- **Navega para:** `Exportar_CheckList`, `Seleção_trajeto_SSMA`, `TelaPCP_SLZ`
- **Set() variáveis globais:** `varfilial`
- **Variáveis de contexto (locais):** `RDS1`, `cad_cliente`, `cad_fun`, `con_vel`, `conf_alterarsetor`, `cont_log`, `contagemrds`, `create_control_vel`, `editman`, `edituser`, `editvei`, `esc_aux`, `esc_mot`, `filtrords`, `gestao_userlog`, `inclu_cliente`, `incluc_colab`, `lista_control_vel`, `log`, `manurds`, `newuser`, `novoman`, `progrds`, `rds`, `resetdaterds`, `resumords`

**OnHidden:** `UpdateContext({log:false,pcp:false,cad:false,resetdaterds:false})`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `logokairos` (Image) | logokairos | OnSelect | `Refresh('RDS-Managements');Refresh(controle_veiculo);Refresh(controle_man_veicul);Refresh(Credenciaiss);Refresh('Lista Auxiliar - Setores Medro'); Set( varfilial, LookUp( Credenciaiss, varnome = Título , Filial ) )` |
| `BT_CAD_3` (Button) | "Serviços Terceirizados" | OnSelect | `Navigate(TelaPCP_SLZ)` |
| `BT_CAD_27` (Button) | "Tela PCP" | OnSelect | `Navigate(TelaPCP_SLZ)` |
| `Button5_26` (Classic) | "Novo Cliente" | OnSelect | `NewForm(Form_inclusaocliente_6);UpdateContext({inclu_cliente:true})` |
| `Button5_24` (Classic) | "Editar Cliente" | OnSelect | `EditForm(Form_inclusaocliente_6);UpdateContext({inclu_cliente:true})` |
| `Button3` (Classic) | "Excluir Cliente" | OnSelect | `UpdateIf( 'Lista Auxiliar - Clientes Medro', ID = galeriaclientesmedro_6.Selected.ID, { xStatus: "Inativo" } )` |
| `Button5_25` (Classic) | "Submeter" | OnSelect | `SubmitForm(Form_inclusaocliente_6)` |
| `ButtonCanvas6` (Button) | "Incluir Colaborador" | OnSelect | `NewForm(Form_novocolab_8);UpdateContext({incluc_colab:true,alterarsetor:false})` |
| `Form_edit_alterarsetor` (Form) | Form_edit_alterarsetor | OnSuccess | `UpdateContext({conf_alterarsetor:false});Notify("Setor do usuário alterado com sucesso!",NotificationType.Success,2000)` |
| `BT_CAD_29` (Button) | "Salvar" | OnSelect | `SubmitForm(Form_edit_alterarsetor)` |
| `Form_novocolab_8` (Form) | Form_novocolab_8 | OnSuccess | `NewForm(Form_novocolab_8);Notify("Colaborador cadastrado com sucesso",NotificationType.Success)` |
| `Button5_31` (Classic) | "Concluir" | OnSelect | `SubmitForm(Form_novocolab_8);UpdateContext({inclu_cliente:true})` |
| `BT_CAD_7` (Button) | "Check List" | OnSelect | `Navigate(Seleção_trajeto_SSMA)` |
| `BT_CAD_17` (Button) | "Tela PCP" | OnSelect | `Navigate(TelaPCP_SLZ)` |
| `ButtonCanvas44_1` (Button) | "Exportar Check List" | OnSelect | `Navigate(Exportar_CheckList)` |
| `FormRDS_2` (Form) | FormRDS_2 | OnSuccess | `Notify("RDS Atualizado!",NotificationType.Success,1500);UpdateContext({RDS1:false})` |
| `Button13_2` (Classic) | "Atualizar" | OnSelect | `SubmitForm(FormRDS_2)` |
| `BT_CAD_14` (Button) | "Novo Registro" | OnSelect | `UpdateContext({novoman:true,titmanuten:"Novo Registro"});NewForm(Form_nova_manu_1)` |
| `BT_CAD_15` (Button) | "Editar Registro" | OnSelect | `UpdateContext({novoman:true,editman:true,titmanuten:"Edição de Registro"});EditForm(Form_nova_manu_1) //UpdateContext({novoman:true;editman:true;listaman_veicul:true;titmanuten:"Edição de Registro"});;EditForm(Form_nova_manu_1)` |
| `BT_CAD_18` (Button) | "Agendar" | OnSelect | `SubmitForm(Form_manuRDS_1)` |
| `ButtonCanvas5_2` (Button) | "Agendar RDS" | OnSelect | `NewForm(Form_manuRDS_1);UpdateContext({manurds:true})` |
| `ButtonCanvas5_3` (Button) | "Salvar" | OnSelect | `SubmitForm(Form_nova_manu_1)` |
| `Form_manuRDS_1` (Form) | Form_manuRDS_1 | OnSuccess | `UpdateContext({editman:false,manurds:false});Notify("Agendamento RDS realizado!",NotificationType.Success,2000)` |
| `BT_CAD_19` (Button) | "Novo Veículo" | OnSelect | `NewForm(Form3);UpdateContext({create_control_vel:true,listaman_veicul:false,abasteciment:false})` |
| `BT_CAD_20` (Button) | "Editar Veículo" | OnSelect | `//UpdateContext({novoman:true;editman:true;listaman_veicul:true;titmanuten:"Edição de Registro"});;EditForm(Form_nova_manu_1) UpdateContext({novoman:true,editvei:true,listaman_veicul:false,titmanuten:"Edição de Veículo"});EditForm(Form_edicao_veic)` |
| `Form_edicao_veic` (Form) | Form_edicao_veic | OnSuccess | `Notify("Veículo Registrado!",NotificationType.Success,2000);UpdateContext({create_control_vel:false})` |
| `BT_CAD_28` (Button) | "Salvar" | OnSelect | `SubmitForm(Form_edicao_veic)` |
| `Form3` (Form) | Form3 | OnSuccess | `Notify("Veículo Registrado!",NotificationType.Success,2000);UpdateContext({create_control_vel:false})` |
| `BT_CAD_12` (Button) | "Salvar" | OnSelect | `SubmitForm(Form3)` |
| `BT_CAD_23` (Button) | "Editar Usuário" | OnSelect | `UpdateContext({edituser:true,newuser:false,cont_log:false});EditForm(Form_edit_gestaouser)` |
| `BT_CAD_24` (Button) | "Salvar" | OnSelect | `SubmitForm(Form_edit_gestaouser)` |
| `Form_edit_gestaouser_1` (Form) | Form_edit_gestaouser_1 | OnSuccess | `UpdateContext({newuser:false});Notify("Novo usuário adicionado",NotificationType.Success,2000)` |
| `BT_CAD_25` (Button) | "Salvar" | OnSelect | `SubmitForm(Form_edit_gestaouser_1)` |
| `BT_CAD_26` (Button) | "Contagem" | OnSelect | `UpdateContext({cont_log:true,edituser:false,newuser:false});EditForm(Form_edit_gestaouser)` |
| `BT_CAD_30` (Button) | "Salvar" | OnSelect | `SubmitForm(Form_edicao_veic) ; UpdateContext({editvei:false})` |

**Controles:** Label×393, Classic×144, TypedDataCard×95, Button×36, Rectangle×34, Image×19, Form×10, GroupContainer×9, Gallery×9, TextInput×7, Attachments×4, Radio×2, CheckBox×1, Text×1


<a id="tela-telapcp-slz"></a>
## TelaPCP_SLZ

- **Arquivo:** `Src/TelaPCP_SLZ.pa.yaml` — 7882 linhas — 460 controles
- **Fundo:** `telaSSMA`
- **Fontes de dados:** `CheckList_Veicular`, `Credenciaiss`, `Lista Auxiliar - Clientes Medro`, `PF e IQ`, `RDS`, `RDS-Managements`, `Serviços Terceirizados`, `Trajetos`, `servicosterceirizados`
- **Formulários:**
  - `Form_vere_2` → fonte `Trajetos` — item: `Galeriatrajetoslz_4.Selected`
  - `Form_ComercialSLZ_4` → fonte `'PF e IQ'` — item: `GaleriaComercialSLZ_5.Selected`
  - `Form_inclusaocliente_1` → fonte `'Lista Auxiliar - Clientes Medro'` — item: `galeriaclientesmedro_1.Selected`
  - `formatualretifica` → fonte `servicosterceirizados` — item: `galeriatornei.Selected`
- **Galerias:**
  - `galeriatornei` → itens: `If(IsBlank(empresatornei.Selected.Value) And  IsBlank(retornotornei.Selected.Value) ,
Sort(Search(Filter(servicosterceirizados,Data_retorno = Blank()),pesquisatornei.Text,Título,Da`
  - `Galeriatrajetoslz_4` → itens: `Filter(Trajetos,Datafim = Blank(), Unidade = varfilial )`
  - `Gallery8_3` → itens: `Galeriatrajetoslz_4.Selected.Anexos`
  - `GaleriaComercialSLZ_5` → itens: `If(
    checkpcp_5.Value = false,
    Sort(
        Search(
            Filter(
                'PF e IQ',
                Filial = FilialMEDRO_1.SelectedText.Value
            ),
`
  - `Gallery6_5` → itens: `GaleriaComercialSLZ_5.Selected.Anexos`
  - `galeriaclientesmedro_1` → itens: `Sort(Filter('Lista Auxiliar - Clientes Medro', Unidade.Value = varfilial,Title <> " -"),Nome_completo,SortOrder.Ascending)`
  - `Galfotosretifica` → itens: `galeriatornei.Selected.xImagem`
  - `galeriaRDS` → itens: `If(
    RDS_radio.Selected.Value = "Em andamento",
    Sort(
        Search(
            Filter(
                'RDS-Managements',
                Atendimento = "Pendente" Or Aten`
  - `Gallery3` → itens: `Sort(Filter('RDS-Managements', Atendimento = "Programado"),DataNecess,SortOrder.Ascending)`
- **Variáveis de contexto (locais):** `RDS1`, `allcheck`, `allviagens`, `check`, `clientes`, `config`, `contagemrds`, `esc_aux`, `esc_mot`, `filtrords`, `inclu_cliente`, `menutercei`, `pcp`, `progrds`, `rds`, `resumords`, `rh`, `terce`, `viagens`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `galeriatornei` (Gallery) | galeriatornei | OnSelect | `UpdateContext({menutercei: true});EditForm(formatualretifica)` |
| `Galeriatrajetoslz_4` (Gallery) | Galeriatrajetoslz_4 | OnSelect | `UpdateContext({viagens:true});ViewForm(Form_vere_2);UpdateContext({check:false})` |
| `GaleriaComercialSLZ_5` (Gallery) | GaleriaComercialSLZ_5 | OnSelect | `EditForm(Form_ComercialSLZ_4)` |
| `Button5_6` (Classic) | "Novo Cliente" | OnSelect | `NewForm(Form_inclusaocliente_1);UpdateContext({inclu_cliente:true})` |
| `Button5_7` (Classic) | "Editar Cliente" | OnSelect | `EditForm(Form_inclusaocliente_1);UpdateContext({inclu_cliente:true})` |
| `Button5_4` (Classic) | "Submeter" | OnSelect | `SubmitForm(Form_inclusaocliente_1)` |
| `formatualretifica` (Form) | formatualretifica | OnSuccess | `UpdateContext({menutercei: false});Notify("Atualização deita com sucesso")` |
| `Button4_2` (Classic) | "Concluído" | OnSelect | `SubmitForm(formatualretifica)` |

**Controles:** Label×247, Classic×79, TypedDataCard×51, Image×36, Rectangle×32, Gallery×9, Form×4, Attachments×2


<a id="tela-pcp-antigo"></a>
## PCP_ANTIGO

- **Arquivo:** `Src/PCP_ANTIGO.pa.yaml` — 7206 linhas — 417 controles
- **Fundo:** `telaSSMA`
- **Fontes de dados:** `PF e IQ`, `PF e IQ - 2024`, `Prod_Avaliacao_Final`
- **Formulários:**
  - `Form_ComercialSLZ_1` → fonte `'PF e IQ'` — item: `GaleriaComercialSLZ_1.Selected`
  - `Form_ComercialSLZ_14` → fonte `'PF e IQ - 2024'` — item: `GaleriaComercialSLZ_15.Selected`
- **Galerias:**
  - `GaleriaComercialSLZ_1` → itens: `If(
    checkpcp_1.Value = false,
    Sort(
        Search(
            'PF e IQ',
            pesquisaos_1.Text,
            Title,
            Filial,
            Data,
         `
  - `Gallery6_1` → itens: `GaleriaComercialSLZ_1.Selected.Anexos`
  - `GaleriaComercialSLZ_15` → itens: `If(
    checkpcp_15.Value = false,
    Sort(
        Search(
            Filter(
                'PF e IQ - 2024',Filial = varfilial
            ),
            pesquisaos_15.Text,
`
  - `Gallery6_15` → itens: `GaleriaComercialSLZ_15.Selected.Anexos`
- **Variáveis de contexto (locais):** `a2023`, `a2024`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `GaleriaComercialSLZ_1` (Gallery) | GaleriaComercialSLZ_1 | OnSelect | `EditForm(Form_ComercialSLZ_1)` |
| `GaleriaComercialSLZ_15` (Gallery) | GaleriaComercialSLZ_15 | OnSelect | `EditForm(Form_ComercialSLZ_14)` |

**Controles:** Label×241, Classic×76, TypedDataCard×70, Image×18, Gallery×4, Rectangle×4, Form×2, Attachments×2


<a id="tela-telapcp-slz-1"></a>
## TelaPCP_SLZ_1

- **Arquivo:** `Src/TelaPCP_SLZ_1.pa.yaml` — 6268 linhas — 375 controles
- **Fundo:** `telaSSMA`
- **Fontes de dados:** `CheckList_Veicular`, `Lista Auxiliar - Clientes Medro`, `PF e IQ`, `RDS`, `Serviços Terceirizados`, `Trajetos`
- **Formulários:**
  - `Form_vere_6` → fonte `Trajetos` — item: `Galeriatrajetoslz_8.Selected`
  - `Form_ComercialSLZ_8` → fonte `'PF e IQ'` — item: `GaleriaComercialSLZ_9.Selected`
  - `formatualretifica_1` → fonte `'Serviços Terceirizados'` — item: `galeriatornei_1.Selected`
- **Galerias:**
  - `galeriatornei_1` → itens: `If(IsBlank(empresatornei_1.Selected.Value) And  IsBlank(retornotornei_1.Selected.Value) ,
Sort(Search(Filter('Serviços Terceirizados',Data_retorno = Blank()),pesquisatornei_1.Text,`
  - `Galeriatrajetoslz_8` → itens: `Filter(Trajetos,Datafim = Blank(), Unidade = FilialMEDRO_5.SelectedText.Value )`
  - `Gallery8_8` → itens: `Galeriatrajetoslz_8.Selected.Anexos`
  - `GaleriaComercialSLZ_9` → itens: `If(
    checkpcp_9.Value = false,
    Sort(
        Search(
            Filter(
                'PF e IQ',
                Filial = FilialMEDRO_5.SelectedText.Value
            ),
`
  - `Gallery6_9` → itens: `GaleriaComercialSLZ_9.Selected.Anexos`
  - `Galfotosretifica_1` → itens: `galeriatornei_1.Selected.Anexos`
  - `Gallery3_1` → itens: `Sort(Filter(RDS, Atendimento = "Programado"),DataNecess,SortOrder.Ascending)`
- **Variáveis de contexto (locais):** `RDS1`, `allcheck`, `allviagens`, `check`, `clientes`, `config`, `contagemrds`, `filtrords`, `menutercei`, `pcp`, `progrds`, `rds`, `resumords`, `rh`, `terce`, `viagens`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `galeriatornei_1` (Gallery) | galeriatornei_1 | OnSelect | `UpdateContext({menutercei: true});EditForm(formatualretifica_1)` |
| `Galeriatrajetoslz_8` (Gallery) | Galeriatrajetoslz_8 | OnSelect | `UpdateContext({viagens:true});ViewForm(Form_vere_6);UpdateContext({check:false})` |
| `GaleriaComercialSLZ_9` (Gallery) | GaleriaComercialSLZ_9 | OnSelect | `EditForm(Form_ComercialSLZ_8)` |
| `formatualretifica_1` (Form) | formatualretifica_1 | OnSuccess | `UpdateContext({menutercei: false});Notify("Atualização deita com sucesso")` |
| `Button4_1` (Classic) | "Concluído" | OnSelect | `SubmitForm(formatualretifica_1)` |

**Controles:** Label×201, Classic×63, TypedDataCard×46, Image×32, Rectangle×21, Gallery×7, Form×3, Attachments×2


<a id="tela-requisi-o-pcp"></a>
## Requisição_PCP

- **Arquivo:** `Src/Requisi+º+úo_PCP.pa.yaml` — 416 linhas — 32 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Base_Medro`, `Requisicao`
- **Formulários:**
  - `FormRequisicao` → fonte `Requisicao`
- **Galerias:**
  - `GaleriaRequisição` → itens: `Sort(Search(Filter(Requisicao,xStatus = "Sim",xFilial = varfilial),DataCardValue79_2.Value,OS),'Data de Criação',SortOrder.Descending)`
- **Navega para:** `SELEC_COD`

**OnHidden:** `NewForm(FormRequisicao)`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Image1_93` (Image) | Image1_93 | OnSelect | `Navigate(SELEC_COD)` |
| `FormRequisicao` (Form) | FormRequisicao | OnSuccess | `NewForm(FormRequisicao)` |
| `ButtonCanvas12` (Button) | "Confirmar" | OnSelect | `SubmitForm(FormRequisicao)` |
| `ButtonCanvas15` (Button) | "Excluir" | OnSelect | `Remove(Requisicao,GaleriaRequisição.Selected)` |

**Controles:** Text×12, TextInput×5, TypedDataCard×4, Label×2, Rectangle×2, Button×2, GroupContainer×1, Gallery×1, Image×1, Form×1, Toggle×1


# Módulo: Peritagem / Avaliação / Inspeção


<a id="tela-galeriaperitagem"></a>
## GaleriaPeritagem

- **Arquivo:** `Src/GaleriaPeritagem.pa.yaml` — 6089 linhas — 338 controles
- **Fundo:** `t`
- **Fontes de dados:** `Credenciaiss`, `Lista Auxiliar - Clientes Medro`, `Prod_Avaliacao_Final`, `Prod_LiberarEnsaio`
- **Formulários:**
  - `F_AF` → fonte `Prod_Avaliacao_Final`
- **Navega para:** `AvaliacaoFinal`, `EnsaioTemporizado`, `PeritagemFin_opicional`
- **Set() variáveis globais:** `os_aval`
- **Variáveis de contexto (locais):** `botoes`, `num_cabos`, `os`, `rb_isol`, `rb_res`, `resis`, `rpm`, `sir_corrente`, `sir_vib`

**OnVisible:**

```
UpdateContext({botoes:true});NewForm(F_AF)
```

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Image74` (Image) | Image74 | OnSelect | `Navigate(AvaliacaoFinal);Set(os_aval, "")` |
| `Button23_22` (Classic) | "Sensores" | OnSelect | `Navigate(PeritagemFin_opicional)` |
| `Button23_23` (Classic) | "Ensaio Temporizado" | OnSelect | `Navigate(EnsaioTemporizado,ScreenTransition.CoverRight); Set(os_aval, DataCardValue237.Text)` |
| `F_AF` (Form) | F_AF | OnSuccess | `Navigate(AvaliacaoFinal); Notify( "Avaliação salva com sucesso!!!", NotificationType.Success, 3000 ); ResetForm(F_AF); ResetForm(FormSensorOpc); UpdateContext( { rb_isol: false, rb_res: false, sir_vib: false, sir_corrente: false, rpm: false, vib: false, temp: false, corrent: false, isol: false, botoes: true, form: false, fundo: false, Ant_resis: false, resis: false, final:false } ); Reset(Dropdown` |
| `ButtonCanvas1_1` (Button) | "Salvar" | OnSelect | `SubmitForm(F_AF);If(IsBlank(TextCanvas2.Text),false,SubmitForm(FormSensorOpc))` |

**Controles:** Label×176, Classic×81, TypedDataCard×55, Image×17, GroupContainer×3, Button×2, Rectangle×1, Form×1, AddMedia×1, TextInput×1


<a id="tela-forminspec"></a>
## FormInspec

- **Arquivo:** `Src/FormInspec.pa.yaml` — 3801 linhas — 219 controles
- **Fundo:** `t`
- **Fontes de dados:** `Credenciaiss`, `Lista Auxiliar - Inspeção de Qualidade`, `Prod_Avaliacao_Final`, `Prod_Inspecao`
- **Formulários:**
  - `FormAtualizarInspec` → fonte `Prod_Avaliacao_Final` — item: `GaleriaEscolhaInspec.Selected`
  - `FormNewInspec` → fonte `Prod_Inspecao`
- **Variáveis de contexto (locais):** `fundo`, `rep1`, `rep10`, `rep11`, `rep12`, `rep13`, `rep14`, `rep15`, `rep16`, `rep17`, `rep18`, `rep19`, `rep2`, `rep20`, `rep21`, `rep22`, `rep23`, `rep24`, `rep25`, `rep26`, `rep27`, `rep28`, `rep3`, `rep4`, `rep5`, `rep6`, `rep7`, `rep8`, `rep9`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Button23` (Classic) | "Salvar" | OnSelect | `SubmitForm(FormAtualizarInspec);SubmitForm(FormNewInspec)` |

**Controles:** Label×126, Classic×42, TypedDataCard×41, Image×4, Form×2, AddMedia×2, InfoButton×1, Rectangle×1


<a id="tela-historicoavalfinais"></a>
## HistoricoAvalFinais

- **Arquivo:** `Src/HistoricoAvalFinais.pa.yaml` — 3786 linhas — 277 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Lista Auxiliar - Inspeção de Qualidade`, `Prod_Avaliacao_Final`, `Prod_Avaliacao_Final_Opc`, `Prod_Inspecao`, `ensaio_temporizado`
- **Formulários:**
  - `Form_View_Quali` → fonte `Prod_Inspecao` — item: `Gallery8_11.Selected`
- **Galerias:**
  - `Gallery8_11` → itens: `Filter(Prod_Inspecao, Gallery8_9.Selected.'Ordem de Serviço' = Ordem_Servico)`
  - `Gallery8_9` → itens: `Sort(Search(Prod_Avaliacao_Final,TextInputCanvas1.Value,'Ordem de Serviço',Data_Ref,TipoMotor),'Data de Criação',SortOrder.Descending)`
  - `Gallery8_10` → itens: `Gallery8_9.Selected`
  - `galeriaensaiotemporizado_1` → itens: `Filter( ensaio_temporizado, xFilial =  Gallery8_9.Selected.Filial,OS = Gallery8_9.Selected.'Ordem de Serviço')`
- **Navega para:** `PCP_ANTIGO`
- **Variáveis de contexto (locais):** `ensaiotemp`, `img`, `inspec`

**OnVisible:**

```
UpdateContext({img: false,ensaiotemp:false})
```

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `ButtonCanvas2_1` (Button) | "Inspeção" | OnSelect | `UpdateContext({inspec:true});EditForm(Form_View_Quali)` |
| `ButtonCanvas3` (Button) | "Versão Antiga" | OnSelect | `Navigate(PCP_ANTIGO)` |

**Controles:** Text×104, Label×72, TextInput×36, TypedDataCard×35, Rectangle×11, Image×6, Gallery×4, Button×4, GroupContainer×3, Classic×1, Form×1


<a id="tela-peritagemfin-opicional"></a>
## PeritagemFin_opicional

- **Arquivo:** `Src/PeritagemFin_opicional.pa.yaml` — 3540 linhas — 204 controles
- **Fundo:** `t`
- **Fontes de dados:** `Prod_Avaliacao_Final_Opc`
- **Formulários:**
  - `FormSensorOpc` → fonte `Prod_Avaliacao_Final_Opc`
- **Variáveis de contexto (locais):** `form`, `pt100e`, `pt100t`

**OnVisible:**

```
NewForm(FormSensorOpc)
```

**Controles:** Label×111, TypedDataCard×37, Classic×37, Button×6, DropDown×5, Text×5, Image×2, Form×1


<a id="tela-inspecquali"></a>
## InspecQuali

- **Arquivo:** `Src/InspecQuali.pa.yaml` — 168 linhas — 11 controles
- **Fundo:** `t`
- **Fontes de dados:** `Prod_Avaliacao_Final`, `Prod_Inspecao`
- **Galerias:**
  - `GaleriaEscolhaInspec` → itens: `Filter(Prod_Avaliacao_Final,InspecQuali = "Pendente",Filial = varfilial)`
- **Navega para:** `FormInspec`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `GaleriaEscolhaInspec` (Gallery) | GaleriaEscolhaInspec | OnSelect | `NewForm(FormNewInspec);Navigate(FormInspec)` |

**Controles:** Label×5, Image×2, Rectangle×2, GroupContainer×1, Gallery×1


<a id="tela-avaliacaofinal"></a>
## AvaliacaoFinal

- **Arquivo:** `Src/AvaliacaoFinal.pa.yaml` — 138 linhas — 7 controles
- **Fundo:** `t`
- **Fontes de dados:** `Credenciaiss`
- **Navega para:** `GaleriaPeritagem`, `HistoricoAvalFinais`, `InspecQuali`, `LiberarEnsaio`, `SELEC_COD`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Button23_2` (Classic) | "Nova Avaliação" | OnSelect | `Navigate(GaleriaPeritagem)` |
| `Button23_3` (Classic) | "Nova Inspeção" | OnSelect | `Navigate(InspecQuali)` |
| `Button23_4` (Classic) | "Buscar Avaliações" | OnSelect | `Navigate(HistoricoAvalFinais)` |
| `Button23_5` (Classic) | "Liberar ensaio" | OnSelect | `Navigate(LiberarEnsaio,ScreenTransition.CoverRight);NewForm(FormLiberarEnsaio)` |
| `Image74_1` (Image) | Image74_1 | OnSelect | `Navigate(SELEC_COD)` |

**Controles:** Classic×4, Label×1, GroupContainer×1, Image×1


<a id="tela-peritagemfin-temporizado"></a>
## PeritagemFin_Temporizado

- **Arquivo:** `Src/PeritagemFin_Temporizado.pa.yaml` — 41 linhas — 2 controles
- **Fundo:** `t`

**Controles:** Image×1, Label×1


# Módulo: Ensaio


<a id="tela-ensaiotemporizado"></a>
## EnsaioTemporizado

- **Arquivo:** `Src/EnsaioTemporizado.pa.yaml` — 1803 linhas — 115 controles
- **Fundo:** `t`
- **Fontes de dados:** `ensaio_temporizado`
- **Formulários:**
  - `FormEnsaioTemporizado` → fonte `ensaio_temporizado`
- **Galerias:**
  - `galeriaensaiotemporizado` → itens: `Filter( ensaio_temporizado, xFilial = varfilial,OS = os_aval)`
- **Variáveis de contexto (locais):** `novo`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `ButtonCanvas17` (Button) | "Novo Registro" | OnSelect | `NewForm(FormEnsaioTemporizado);UpdateContext({novo:true})` |
| `Image29` (Image) | Image29 | OnSelect | `UpdateContext({novo:false});ResetForm(FormEnsaioTemporizado)` |
| `ButtonCanvas18` (Button) | "Salvar" | OnSelect | `SubmitForm(FormEnsaioTemporizado)` |

**Controles:** Text×47, TypedDataCard×13, Label×12, Image×12, TextInput×12, Classic×8, Rectangle×3, Button×2, DropDown×2, Gallery×1, GroupContainer×1, Form×1, DatePicker×1


<a id="tela-liberarensaio"></a>
## LiberarEnsaio

- **Arquivo:** `Src/LiberarEnsaio.pa.yaml` — 296 linhas — 23 controles
- **Fundo:** `t`
- **Fontes de dados:** `Prod_LiberarEnsaio`
- **Formulários:**
  - `FormLiberarEnsaio` → fonte `Prod_LiberarEnsaio`
- **Galerias:**
  - `Gallery9` → itens: `Sort( Filter( Prod_LiberarEnsaio, Filial = varfilial),'Data de Criação', SortOrder.Descending)`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `FormLiberarEnsaio` (Form) | FormLiberarEnsaio | OnSuccess | `Notify("OS liberada dos ensaios de vibração!",NotificationType.Success,3000);NewForm(FormLiberarEnsaio)` |
| `ButtonCanvas4` (Button) | "Liberar" | OnSelect | `SubmitForm(FormLiberarEnsaio)` |

**Controles:** Text×9, TypedDataCard×3, TextInput×3, Label×2, Rectangle×2, Gallery×1, Image×1, Form×1, Button×1


# Módulo: Caldeiraria


<a id="tela-caldeiraria-novo"></a>
## Caldeiraria_Novo

- **Arquivo:** `Src/Caldeiraria_Novo.pa.yaml` — 3006 linhas — 172 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Balanceamento`, `Base_Medro`, `Caldeiraria_Controle`, `Caldeiraria_Lista`, `Credenciaiss`
- **Escreve (Patch) em:** `Caldeiraria_Controle`
- **Formulários:**
  - `FormCaldeiraria` → fonte `Caldeiraria_Controle`
  - `FormCaldeiraria_1` → fonte `Caldeiraria_Controle`
  - `FormCaldeiraria_2` → fonte `Caldeiraria_Controle`
- **Variáveis de contexto (locais):** `bal`, `perg`
- **Coleções (Collect/ClearCollect):** `colServico`

**OnHidden:** `UpdateContext({perg:true,tab0:false,tabmais:false,bal:false})`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `ButtonCanvas7` (Button) | "Avançar" | OnSelect | `If( DropdownCanvas5.Selected.Value = 1, UpdateContext( { perg: false, tab0: true } ), DropdownCanvas5.Selected.Value <> 1 , UpdateContext( { perg: false, //tabmais: true tab0: true } )/*;; NewForm(FormCaldeiraria_1)*/ //NewForm(FormCaldeiraria) )` |
| `Button18` (Classic) | "Enviar" | OnSelect | `If( DropdownCanvas5.Selected.Value > 1, ForAll( colServico, Patch( Caldeiraria_Controle, Defaults(Caldeiraria_Controle), { Pecas: colServico[@cr4a1_pecas], Serviços: colServico[@cr4a1_servicos], OS: colServico[@cr4a1_os], Unidade: colServico[@cr4a1_unidade], Prazo: colServico[@cr4a1_prazo], InseridoPor: colServico[@cr4a1_inseridopor], Regime: colServico[@cr4a1_regime], ImagemReferencia: colServico` |
| `Counter_BTN` (Button) | "Guardar: " & CountRows(colServico) | OnSelect | `Collect( colServico, { cr4a1_pecas: If(bal = true, "Balanceamento", ComboBox1.Selected.Peças), cr4a1_servicos: DataCardValue220.Text, cr4a1_os: DataCardValue219.Text, cr4a1_unidade: LookUp(Credenciaiss, Usuário = varlogin, Filial), cr4a1_prazo: Value(DataCardValue216.Text), cr4a1_inseridopor: LookUp(Credenciaiss, Usuário = varlogin, Título), cr4a1_regime: DataCardValue221.Selected.Value, cr4a1_ima` |

**Controles:** Label×93, Classic×38, TypedDataCard×28, Button×3, Form×3, TextInput×3, Image×2, DropDown×1, AddMedia×1


<a id="tela-caldeiraria-pendentes-servicos"></a>
## Caldeiraria_Pendentes_Servicos

- **Arquivo:** `Src/Caldeiraria_Pendentes_Servicos.pa.yaml` — 1615 linhas — 96 controles
- **Fundo:** `t`
- **Fontes de dados:** `Balanceamento`, `Caldeiraria_Controle`, `Credenciaiss`
- **Formulários:**
  - `FormCaldeirResp` → fonte `Caldeiraria_Controle` — item: `Gal_Caldeiraria_Serviço.Selected`
- **Galerias:**
  - `Gal_Caldeiraria_Serviço` → itens: `If( tipo = 1,

Sort(Filter(Caldeiraria_Controle,OS = Gal_Caldeiraria_OS.Selected.Value,xStatus <> "Concluído",Pecas <> "Balanceamento"),Regime,SortOrder.Descending),

tipo = 2,

So`
- **Variáveis de contexto (locais):** `alterar`, `form`, `foto`

**OnHidden:** `UpdateContext({alterar:false})`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Image66` (Image) | Image66 | OnSelect | `UpdateContext({form:false});ResetForm(FormCaldeirResp)` |
| `FormCaldeirResp` (Form) | FormCaldeirResp | OnSuccess | `UpdateContext({form:false});Notify("Salvo!",NotificationType.Success)` |
| `Button21` (Classic) | "Salvar" | OnSelect | `SubmitForm(FormCaldeirResp)` |

**Controles:** Label×48, Classic×18, TypedDataCard×13, Image×8, Rectangle×4, Gallery×1, GroupContainer×1, Form×1, Button×1, AddMedia×1


<a id="tela-caldeiraria-hist-rico"></a>
## Caldeiraria_Histórico

- **Arquivo:** `Src/Caldeiraria_Hist+¦rico.pa.yaml` — 1495 linhas — 91 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Caldeiraria_Controle`
- **Formulários:**
  - `FormCaldeirHist` → fonte `Caldeiraria_Controle` — item: `Gal_Caldeiraria_Histor.Selected`
- **Galerias:**
  - `Gal_Caldeiraria_Histor` → itens: `Sort(Search(Filter(Caldeiraria_Controle,Unidade = varfilial, xxStatus <> "Inativo"),PesquisaHistCalde.Text,OS,Pecas),'Data de Criação',SortOrder.Descending)`
- **Navega para:** `Caldeiraria_Pendentes_Servicos`
- **Variáveis de contexto (locais):** `form`, `foto`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Gal_Caldeiraria_Histor` (Gallery) | Gal_Caldeiraria_Histor | OnSelect | `Navigate(Caldeiraria_Pendentes_Servicos,ScreenTransition.Cover)` |
| `Image66_1` (Image) | Image66_1 | OnSelect | `UpdateContext({form:false});ResetForm(FormCaldeirHist)` |
| `FormCaldeirHist` (Form) | FormCaldeirHist | OnSuccess | `UpdateContext({form:false});Notify("Salvo!",NotificationType.Success)` |

**Controles:** Label×47, Classic×17, TypedDataCard×12, Rectangle×8, Image×5, Gallery×1, Form×1


<a id="tela-controle-caldeiraria"></a>
## Controle_Caldeiraria

- **Arquivo:** `Src/Controle_Caldeiraria.pa.yaml` — 326 linhas — 19 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Balanceamento`, `Caldeiraria_Controle`, `Caldeiraria_Lista`, `Credenciaiss`
- **Galerias:**
  - `GaleriaMenuCaldeiraria` → itens: `Sort(Filter(Caldeiraria_Controle,xStatus = "Concluído",Unidade = varfilial,Pecas <> "Balanceamento", xxStatus <> "Inativo"),DataConclusao,SortOrder.Descending)`
- **Navega para:** `Caldeiraria_Botao_Pendente`, `Caldeiraria_Histórico`, `Caldeiraria_ListadePecas`, `Caldeiraria_Novo`, `SELEC_COD`
- **Variáveis de contexto (locais):** `foto`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Image1_84` (Image) | Image1_84 | OnSelect | `Navigate(SELEC_COD)` |
| `Button1_96` (Classic) | "Novo Serviço" | OnSelect | `Navigate(Caldeiraria_Novo,ScreenTransition.Cover,{perg:true});NewForm(FormCaldeiraria)` |
| `Button1_97` (Classic) | "Serviços Pendentes - " & CountIf(Caldeiraria_Controle,xStat | OnSelect | `Navigate(Caldeiraria_Botao_Pendente,ScreenTransition.Cover,{normal:true,prior:true,susp:false})` |
| `Button1_98` (Classic) | "Histórico" | OnSelect | `Navigate(Caldeiraria_Histórico)` |
| `Button1_99` (Classic) | "Controle de Lista" | OnSelect | `Navigate(Caldeiraria_ListadePecas)` |

**Controles:** Image×4, Label×4, Classic×4, Rectangle×3, GroupContainer×2, Gallery×1, Circle×1


<a id="tela-caldeiraria-pendentes-os"></a>
## Caldeiraria_Pendentes_OS

- **Arquivo:** `Src/Caldeiraria_Pendentes_OS.pa.yaml` — 310 linhas — 20 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Balanceamento`, `Caldeiraria_Controle`
- **Galerias:**
  - `Gal_Caldeiraria_OS` → itens: `If( normal = true And prior = true And susp = true,


Distinct(Sort(Search( Filter(Caldeiraria_Controle,xStatus <> "Concluído",Unidade = varfilial,Pecas <> "Balanceamento"),Pesquis`
- **Navega para:** `Caldeiraria_Pendentes_Servicos`
- **Variáveis de contexto (locais):** `normal`, `prior`, `susp`

**OnHidden:** `UpdateContext({normal:true,prior:true,susp:false})`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Gal_Caldeiraria_OS` (Gallery) | Gal_Caldeiraria_OS | OnSelect | `Navigate(Caldeiraria_Pendentes_Servicos,ScreenTransition.Cover,{tipo:1})` |

**Controles:** Rectangle×7, Label×6, CheckBox×3, Gallery×1, GroupContainer×1, Image×1, Classic×1


<a id="tela-caldeiraria-listadepecas"></a>
## Caldeiraria_ListadePecas

- **Arquivo:** `Src/Caldeiraria_ListadePecas.pa.yaml` — 200 linhas — 12 controles
- **Fundo:** `t`
- **Fontes de dados:** `Caldeiraria_Controle`, `Caldeiraria_Lista`
- **Formulários:**
  - `Form_Lista_Calde` → fonte `Caldeiraria_Lista`
- **Galerias:**
  - `Gal_Caldeiraria_OS_1` → itens: `Caldeiraria_Lista`
- **Navega para:** `Caldeiraria_Pendentes_Servicos`

**OnVisible:**

```
NewForm(Form_Lista_Calde)
```

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Gal_Caldeiraria_OS_1` (Gallery) | Gal_Caldeiraria_OS_1 | OnSelect | `Navigate(Caldeiraria_Pendentes_Servicos,ScreenTransition.Cover)` |
| `Form_Lista_Calde` (Form) | Form_Lista_Calde | OnSuccess | `NewForm(Form_Lista_Calde)` |
| `Button22` (Classic) | "Adicionar" | OnSelect | `SubmitForm(Form_Lista_Calde)` |

**Controles:** Label×5, Classic×2, Gallery×1, Rectangle×1, Image×1, Form×1, TypedDataCard×1


<a id="tela-caldeiraria-pendentes-pe-as"></a>
## Caldeiraria_Pendentes_Peças

- **Arquivo:** `Src/Caldeiraria_Pendentes_Pe+ºas.pa.yaml` — 165 linhas — 10 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Balanceamento`, `Caldeiraria_Controle`
- **Galerias:**
  - `Gal_Caldeiraria_OS_2` → itens: `Sort(Search( Filter(Caldeiraria_Controle,xStatus <> "Concluído",Unidade = varfilial,Pecas <> "Balanceamento"),PesquisaHistCalde_2.Text,OS,Pecas),DataPrazo,SortOrder.Ascending)`
- **Navega para:** `Caldeiraria_Pendentes_Servicos`
- **Variáveis de contexto (locais):** `normal`

**OnHidden:** `UpdateContext({normal:true,prior:true,susp:false})`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Gal_Caldeiraria_OS_2` (Gallery) | Gal_Caldeiraria_OS_2 | OnSelect | `Navigate(Caldeiraria_Pendentes_Servicos,ScreenTransition.Cover,{tipo:2})` |

**Controles:** Label×5, Rectangle×2, Classic×1, Gallery×1, Image×1


<a id="tela-caldeiraria-botao-pendente"></a>
## Caldeiraria_Botao_Pendente

- **Arquivo:** `Src/Caldeiraria_Botao_Pendente.pa.yaml` — 143 linhas — 6 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Balanceamento`, `Caldeiraria_Controle`, `Credenciaiss`
- **Navega para:** `Balanceamento_Pendentes`, `Caldeiraria_Pendentes_OS`, `Caldeiraria_Pendentes_Peças`, `Controle_Caldeiraria`
- **Variáveis de contexto (locais):** `normal`

**OnHidden:** `UpdateContext({normal:true,prior:true,susp:false})`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Image1_90` (Image) | Image1_90 | OnSelect | `Navigate(Controle_Caldeiraria);Refresh(Caldeiraria_Controle)` |
| `Button1_104` (Classic) | "Por OS" | OnSelect | `Navigate(Caldeiraria_Pendentes_OS,ScreenTransition.Cover,{perg:true,normal:true,prior:true,susp:false});NewForm(FormCaldeiraria)` |
| `Button1_105` (Classic) | "Por Prazo e Peças" | OnSelect | `Navigate(Caldeiraria_Pendentes_Peças,ScreenTransition.Cover,{perg:true});NewForm(FormCaldeiraria)` |
| `Button1_106` (Classic) | "Balanceamento" | OnSelect | `Navigate(Balanceamento_Pendentes,ScreenTransition.Cover)` |
| `Button1_113` (Classic) | "Gestão" | OnSelect | `Navigate(Caldeiraria_Pendentes_Peças,ScreenTransition.Cover,{perg:true});NewForm(FormCaldeiraria)` |

**Controles:** Classic×4, Label×1, Image×1


# Módulo: Balanceamento


<a id="tela-rel-balanceamento"></a>
## Rel_Balanceamento

- **Arquivo:** `Src/Rel_Balanceamento.pa.yaml` — 280 linhas — 21 controles
- **Fundo:** `RGBA(234, 234, 234, 1)`
- **Fontes de dados:** `Balanceamento`, `Relatório`
- **Formulários:**
  - `Form_Balanc` → fonte `Balanceamento`
- **Navega para:** `SELEC_COD`

**OnVisible:**

```
NewForm(Form_Balanc)
```

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Form_Balanc` (Form) | Form_Balanc | OnSuccess | `Notify("Dados enviados com sucesso!", NotificationType.Success) ; ResetForm(Form_Balanc)` |
| `ButtonCanvas35` (Button) | "Enviar" | OnSelect | `SubmitForm(Form_Balanc)` |
| `ButtonCanvas37` (Button) | "Voltar" | OnSelect | `Navigate(SELEC_COD)` |

**Controles:** Text×8, GroupContainer×3, TypedDataCard×3, Button×2, Form×1, TextInput×1, Image×1, AddMedia×1, Attachments×1


<a id="tela-balanceamento-pendentes"></a>
## Balanceamento_Pendentes

- **Arquivo:** `Src/Balanceamento_Pendentes.pa.yaml` — 146 linhas — 9 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Balanceamento`, `Caldeiraria_Controle`
- **Galerias:**
  - `Gal_Balanc_OS` → itens: `Sort(Search( Filter(Caldeiraria_Controle,xStatus <> "Concluído",Unidade = varfilial,Pecas = "Balanceamento"),PesquisaHistCalde_3.Text,OS),DataPrazo,SortOrder.Ascending)`
- **Navega para:** `Caldeiraria_Pendentes_Servicos`
- **Variáveis de contexto (locais):** `normal`

**OnHidden:** `UpdateContext({normal:true,prior:true,susp:false})`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Gal_Balanc_OS` (Gallery) | Gal_Balanc_OS | OnSelect | `Navigate(Caldeiraria_Pendentes_Servicos,ScreenTransition.Cover,{tipo:3})` |

**Controles:** Label×4, Rectangle×2, Classic×1, Gallery×1, Image×1


# Módulo: Departamento Técnico / Laudos


<a id="tela-deptecnico"></a>
## DepTecnico

- **Arquivo:** `Src/DepTecnico.pa.yaml` — 4636 linhas — 314 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Base_Medro`, `Credenciaiss`, `Laudos`, `Prod_Avaliacao_Final`, `Prod_Avaliacao_Final_Opc`, `Prod_Inspecao`
- **Escreve (Patch) em:** `Laudos`
- **Formulários:**
  - `FormLaudo` → fonte `Laudos`
  - `FormLaudo_1` → fonte `Laudos` — item: `galeriahistoricolaudo.Selected`
- **Galerias:**
  - `galeriahistoricolaudo` → itens: `If( ListaDPTTEC.Selected.Value = "Todos",


Sort(Search(Filter(Laudos,TipoPatch<>"PCP" && xStatus <> "Inativo"),PesquisaLaudo.Value,OS,Emissor,'Tipo Laudo','Classe Laudo','Parecer `
  - `Gallery8_12` → itens: `//Gallery8_9.Selected

Filter(Prod_Avaliacao_Final,'Ordem de Serviço' = DataCardValue100.Value)`
  - `Gallery9_2` → itens: `Sort( Search( Filter(Base_Medro,Setor = "Aguardando processo"), TextInputCanvas5_1.Value , OS, Unidade ),'Data de Criação',SortOrder.Descending)`
  - `Gallery9_3` → itens: `Sort( Search(  Filter(Base_Medro,Setor = "Motor pronto"),TextInputCanvas5.Value,OS_Comp,Unidade),'Data de Criação',SortOrder.Descending)`
- **Flows chamados:** `gerarlinkLaudo`, `obterLaudo`
- **Navega para:** `QRCodeLaudos`, `SELEC_COD`
- **Set() variáveis globais:** `LaudoFinalPDF`, `linkFinal`, `pdfFile`
- **Variáveis de contexto (locais):** `carrlaudo`, `cleanlaudo`, `editlaudo`, `exclus`, `img`, `inspec`, `novolaudo`, `verlaudo`, `verqrcode`

**OnVisible:**

```
UpdateContext({img: false})
```

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Title18_23` (Label) | If(IsBlank(ThisItem.xValidLaudoQRCcode),"","Laudo Arquivado" | OnSelect | `UpdateContext({cleanlaudo:true,carrlaudo:false}) //Patch( // Laudos; // galeriahistoricolaudo.Selected; // {xArquiv: ""} //)` |
| `ButtonCanvas13` (Button) | "Novo Laudo" | OnSelect | `UpdateContext({novolaudo:true,histo:false,at:false,verlaudo:false});NewForm(FormLaudo)` |
| `FormLaudo` (Form) | FormLaudo | OnSuccess | `Notify("Laudo registrado",NotificationType.Success,3000); NewForm(FormLaudo)` |
| `ButtonCanvas13_3` (Button) | "Salvar" | OnSelect | `SubmitForm(FormLaudo)` |
| `ButtonCanvas16_1` (Button) | "Carregar Laudo" | OnSelect | `If( galeriahistoricolaudo.Selected.Filial = "Barcarena" Or galeriahistoricolaudo.Selected.Filial = "São José dos Campos" Or galeriahistoricolaudo.Selected.Filial = "Aveiro", ForAll( cardlaudoatt.Attachments, GruposdoOffice365.HttpRequest( "https://graph.microsoft.com/v1.0/sites/471ed516-b1af-4b60-adb1-e33530b40fd2/drives/b!FtUeR6-xYEutseM1MLQP0luN9WQa7dVAm7IrWRchyFnVHstz2SkdR6IH4JOZ3kJr/root:" & E` |
| `Icon1_1` (Classic) | Icon1_1 | OnSelect | `Set( pdfFile, PDF( Container13, { DPI: 200, Size: PaperSize.A5, Orientation: "Portrait" } ) ); Download(pdfFile)` |
| `ButtonCanvas2_3` (Button) | "Inspeção" | OnSelect | `UpdateContext({inspec:true});EditForm(Form_View_Quali)` |
| `ButtonCanvas13_4` (Button) | "Voltar" | OnSelect | `Navigate(SELEC_COD)` |
| `FormLaudo_1` (Form) | FormLaudo_1 | OnSuccess | `Notify("Laudo registrado",NotificationType.Success,3000); NewForm(FormLaudo_1)` |
| `ButtonCanvas14` (Button) | "Salvar" | OnSelect | `SubmitForm(FormLaudo_1)` |
| `ButtonCanvas13_9` (Button) | "Imprimir QR Codes" | OnSelect | `Navigate(QRCodeLaudos)` |
| `ButtonCanvas13_14` (Button) | "Ver Laudo" | OnSelect | `UpdateContext( { verqrcode: false, verlaudo: true } ); If( galeriahistoricolaudo.Selected.Filial = "Barcarena" Or galeriahistoricolaudo.Selected.Filial = "São José dos Campos" Or galeriahistoricolaudo.Selected.Filial = "Aveiro", Set( LaudoFinalPDF, obterLaudo.Run( "Laudo " & galeriahistoricolaudo.Selected.'Classe Laudo' & " " & If( IsBlank(galeriahistoricolaudo.Selected.OS_semSigla), First( Split(` |
| `ButtonCanvas21` (Button) | "Excluir" | OnSelect | `//Remove(Laudos; Filter(Laudos; xID = Title18_25.Text)) ;; UpdateContext({exclusão: false}) Patch( Laudos, First( Filter(Laudos, xID = Title18_25.Text And (xStatus = "Ativo" Or IsBlank(xStatus))) ), { xStatus: "Inativo" } ) ; UpdateContext({exclusão: false})` |

**Controles:** Text×98, Label×88, TextInput×29, TypedDataCard×28, Button×19, Rectangle×14, Image×8, Classic×6, Gallery×4, GroupContainer×4, DropDown×4, Radio×3, Form×2, DatePicker×2, TabList×1, Timer×1, Attachments×1, HtmlViewer×1, PDFViewer×1


<a id="tela-qrcodelaudos"></a>
## QRCodeLaudos

- **Arquivo:** `Src/QRCodeLaudos.pa.yaml` — 660 linhas — 35 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Credenciaiss`, `Laudos`, `Lista Auxiliar - Clientes Medro`, `Relatório`
- **Galerias:**
  - `Gallery12` → itens: `If(
    //São Luís ---------------------------------------------------------------
    IsBlank(Dropdown6.Selected) And xfilial = "slz",
    If(
    // Se ambos nmrinicial e nmrfina`
- **Flows chamados:** `gerarlinkLaudo`
- **Navega para:** `SELEC_COD`
- **Set() variáveis globais:** `linkFinalQR`, `varPDF`
- **Variáveis de contexto (locais):** `acess_pdf`, `carr_pdf`, `gerar`, `img`, `reset`, `visu`, `xfilial`

**OnVisible:**

```
UpdateContext({img: false})
```

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `ButtonCanvas13_11` (Button) | "Voltar" | OnSelect | `Navigate(SELEC_COD)` |
| `ButtonCanvas13_15` (Button) | "Gerar PDF" | OnSelect | `UpdateContext({carr_pdf:true}); Set( varPDF, PDF( Gallery12, { Orientation: PaperOrientation.Portrait, Size: PaperSize.A4, DPI: 150, Margin: "10pt 10pt 10pt 10pt", ExpandContainers: true } ) ) ; Notify("PDF Gerado com sucesso!",NotificationType.Success,2000) ; UpdateContext({carr_pdf:false})` |
| `ButtonCanvas13_16` (Button) | "Gerar PDF Cloud" | OnSelect | `GruposdoOffice365.HttpRequest( "https://graph.microsoft.com/v1.0/sites/471ed516-b1af-4b60-adb1-e33530b40fd2/drives/b!FtUeR6-xYEutseM1MLQP0luN9WQa7dVAm7IrWRchyFnVHstz2SkdR6IH4JOZ3kJr/root:" & EncodeUrl( "/QRCODE/QRCODE_" & xfilial & "_" & Substitute(varnome & "_" & TextInputCanvas6_1.Value," ","") & ".pdf" ) & ":/content", "PUT", varPDF ) ; Set( linkFinalQR, gerarlinkLaudo.Run( "/Doc Tcnicos/QRCODE` |

**Controles:** Button×13, Text×7, Rectangle×2, GroupContainer×2, TextInput×2, NumberInput×2, Gallery×1, Image×1, Label×1, HtmlViewer×1, Classic×1, PDFViewer×1, Progress×1


<a id="tela-gerarlink-dpt"></a>
## GerarLink_DPT

- **Arquivo:** `Src/GerarLink_DPT.pa.yaml` — 458 linhas — 24 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Laudos`, `Lista Auxiliar - Clientes Medro`, `Requisicao`
- **Escreve (Patch) em:** `Laudos`
- **Galerias:**
  - `GaleriaRequisição_1` → itens: `Filter(Laudos, OS = DataCardValue79_5.Value & "-" & DataCardValue62_7.Selected.Sigla)`
- **Flows chamados:** `CopiarLaudo`, `gerarlinkLaudo`
- **Navega para:** `SELEC_COD`
- **Set() variáveis globais:** `ValPCP`, `linkFinalPCP`, `linkInicialPCP`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Image1_94` (Image) | Image1_94 | OnSelect | `Navigate(SELEC_COD)` |
| `ButtonCanvas24` (Button) | "Gerar Inicial" | OnSelect | `If( DataCardValue62_8.Selected.Value = "Barcarena" Or DataCardValue62_8.Selected.Value = "São José dos Campos" Or DataCardValue62_8.Selected.Value = "Aveiro", //Sucesso //1- CopiarLaudo.Run( "Doc Tcnicos/Laudos/" & DataCardValue62_8.Selected.Value, "Laudo Inicial " & DataCardValue79_5.Value & ".pdf" ); //2- Set( linkInicialPCP, gerarlinkLaudo.Run("Doc Tcnicos/Laudos/" & DataCardValue62_8.Selected.` |
| `ButtonCanvas24_1` (Button) | "Gerar Final" | OnSelect | `If( DataCardValue62_8.Selected.Value = "Barcarena" Or DataCardValue62_8.Selected.Value = "São José dos Campos" Or DataCardValue62_8.Selected.Value = "Aveiro", //Sucesso //1- CopiarLaudo.Run( "Doc Tcnicos/Laudos/" & DataCardValue62_8.Selected.Value, "Laudo Final " & DataCardValue79_5.Value & ".pdf" ); //2- Set( linkFinalPCP, gerarlinkLaudo.Run("Doc Tcnicos/Laudos/" & DataCardValue62_8.Selected.Valu` |

**Controles:** Label×7, ComboBoxDataField×7, Rectangle×2, ComboBox×2, Button×2, GroupContainer×1, Gallery×1, Image×1, TextInput×1


# Módulo: Trajetos / SSMA


<a id="tela-sele-o-trajeto-ssma"></a>
## Seleção_trajeto_SSMA

- **Arquivo:** `Src/Sele+º+úo_trajeto_SSMA.pa.yaml` — 8305 linhas — 462 controles
- **Fundo:** `telaSSMA`
- **Fontes de dados:** `CheckList_Veicular`, `Credenciaiss`, `Trajetos`
- **Formulários:**
  - `FormChecklist_View_1` → fonte `CheckList_Veicular` — item: `Galeriachecklist.Selected`
  - `Form_vere` → fonte `Trajetos` — item: `Galeriatrajetoslz_1.Selected`
- **Galerias:**
  - `Galeriatrajetoslz_1` → itens: `Filter(Trajetos,Datafim = Blank(), Unidade = "São Luís" )`
  - `Galeriachecklist` → itens: `Sort(Filter(CheckList_Veicular,Unidade = "São Luís"),ID,SortOrder.Descending)`
  - `Gallery1_1` → itens: `Galeriachecklist.Selected.Anexos`
  - `Gallery8_1` → itens: `Galeriatrajetoslz_1.Selected.Anexos`
- **Navega para:** `ImprimirSSMA`
- **Variáveis de contexto (locais):** `allcheck`, `allviagens`, `check`, `viagens`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Galeriatrajetoslz_1` (Gallery) | Galeriatrajetoslz_1 | OnSelect | `UpdateContext({viagens:true});ViewForm(Form_vere);UpdateContext({check:false})` |
| `Galeriachecklist` (Gallery) | Galeriachecklist | OnSelect | `UpdateContext({check:true});EditForm(FormChecklist_View);UpdateContext({viagens:false})` |
| `FormChecklist_View_1` (Form) | FormChecklist_View_1 | OnSuccess | `Notify("Check-List submetido com sucesso");UpdateContext({check:false})` |
| `Label8` (Label) | "Imprimir" | OnSelect | `Navigate(ImprimirSSMA)` |
| `Botaocadastro_28` (Classic) | "Concluir" | OnSelect | `SubmitForm(FormChecklist_View_1)` |

**Controles:** Label×266, TypedDataCard×85, Classic×84, Image×13, Rectangle×5, Gallery×4, Form×2, Attachments×2, PartialCircle×1


<a id="tela-imprimirssma"></a>
## ImprimirSSMA

- **Arquivo:** `Src/ImprimirSSMA.pa.yaml` — 6175 linhas — 346 controles
- **Fundo:** `RGBA(255, 255, 255, 1)`
- **Fontes de dados:** `CheckList_Veicular`
- **Galerias:**
  - `Gallery2` → itens: `Galeriachecklist.Selected.Anexos`

**Controles:** Label×194, TypedDataCard×67, Classic×58, Rectangle×23, FormViewer×1, Gallery×1, Image×1, Arrow×1


<a id="tela-telatrajetos"></a>
## TelaTrajetos

- **Arquivo:** `Src/TelaTrajetos.pa.yaml` — 2733 linhas — 159 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Credenciaiss`, `Lista Auxiliar - Clientes Medro`, `Trajetos`
- **Formulários:**
  - `Trajetoform` → fonte `Trajetos`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Botaocadastro_18` (Classic) | "Concluir" | OnSelect | `If( DropColeta.Selected.Value = "Recebimento/ Entrega do Cliente" And confunção.Text = "MOTORISTA", SubmitForm(Trajetoform); Office365Outlook.SendEmailV2( "aplicativo@kairosmotores.com", "SLZ " & concliente.Text & " - REMESSA", "Recebimento de Equipamentos em São Luís.<br>Cliente: " & concliente.Text & "<br>Quantidade: " & conequip.Text & ".<br>Responsável pela entrega: " & connome.Text & "<br><br` |
| `Image1_26` (Image) | Image1_26 | OnSelect | `Back();ResetForm(Trajetoform)` |

**Controles:** Label×95, TypedDataCard×30, Classic×30, Form×1, ComboBox×1, Attachments×1, Image×1


<a id="tela-trajetofinal"></a>
## TrajetoFinal

- **Arquivo:** `Src/TrajetoFinal.pa.yaml` — 2529 linhas — 148 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Credenciaiss`, `Trajetos`
- **Formulários:**
  - `Trajetoformfinal` → fonte `Trajetos` — item: `Galeriatrajetoslz.Selected`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Botaocadastro_24` (Classic) | "Concluir" | OnSelect | `If( DropColeta_5.Selected.Value = "Coleta no Cliente" And DataCardKey122_11.Text = "MOTORISTA", SubmitForm(Trajetoformfinal); Office365Outlook.SendEmailV2( "rodrigo.nascimento@kairosmotores.com", "SLZ " & concliente_5.Text & " - COLETA", "Coleta de Equipamentos em São Luís.<br>Cliente: " & concliente_5.Text & "<br>Quantidade: " & conequip_5.Text & ".<br>Responsável pela coleta: " & connome_5.Text ` |
| `Image1_33` (Image) | Image1_33 | OnSelect | `Back();ResetForm(Trajetoform)` |

**Controles:** Label×89, TypedDataCard×28, Classic×28, Form×1, Attachments×1, Image×1


<a id="tela-selecaotrajeto"></a>
## SelecaoTrajeto

- **Arquivo:** `Src/SelecaoTrajeto.pa.yaml` — 291 linhas — 15 controles
- **Fundo:** `t`
- **Fontes de dados:** `Credenciaiss`, `Trajetos`
- **Galerias:**
  - `Galeriatrajetoslz` → itens: `Filter(Trajetos,Datafim = Blank(), Unidade = varfilial )`
- **Navega para:** `Checklist_veicular_slz`, `Controle_Caldeiraria`, `HistóricoTrajeto`, `Histórico_check_SLZ`, `SELEC_COD`, `TelaTrajetos`, `TrajetoFinal`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Image1_25` (Image) | Image1_25 | OnSelect | `Navigate(SELEC_COD)` |
| `Button1_100` (Classic) | "Caldeiraria" | OnSelect | `Navigate(Controle_Caldeiraria)` |
| `botaotrajetosaoluis_12` (Classic) | "Rotas" | OnSelect | `Navigate(TelaTrajetos,ScreenTransition.Cover);NewForm(Trajetoform);Refresh(Trajetos)` |
| `botaotrajetosaoluis_13` (Classic) | "Histórico Rotas" | OnSelect | `Navigate(HistóricoTrajeto,ScreenTransition.Cover);Refresh(Trajetos)` |
| `botaotrajetosaoluis_14` (Classic) | "Check List de Verificação" | OnSelect | `Navigate(Checklist_veicular_slz,ScreenTransition.Cover);NewForm(FormChecklist_1)` |
| `botaotrajetosaoluis_16` (Classic) | "Histórico Check List" | OnSelect | `Navigate(Histórico_check_SLZ,ScreenTransition.Cover);NewForm(Trajetoform)` |
| `Galeriatrajetoslz` (Gallery) | Galeriatrajetoslz | OnSelect | `Navigate(TrajetoFinal,ScreenTransition.Cover);EditForm(Trajetoformfinal)` |

**Controles:** Classic×5, Label×4, Image×3, GroupContainer×1, Gallery×1, Rectangle×1


<a id="tela-hist-ricotrajeto"></a>
## HistóricoTrajeto

- **Arquivo:** `Src/Hist+¦ricoTrajeto.pa.yaml` — 204 linhas — 12 controles
- **Fundo:** `t`
- **Fontes de dados:** `Trajetos`
- **Galerias:**
  - `Galeriatrajetoslz_3` → itens: `Sort(Filter(Trajetos,Unidade = varfilial),Criado,SortOrder.Descending)`

**Controles:** Label×8, Rectangle×2, Gallery×1, Image×1


# Módulo: Checklist Veicular


<a id="tela-checklist-veicular-slz"></a>
## Checklist_veicular_slz

- **Arquivo:** `Src/Checklist_veicular_slz.pa.yaml` — 6273 linhas — 349 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `CheckList_Veicular`, `controle_veiculo`
- **Formulários:**
  - `FormChecklist_1` → fonte `CheckList_Veicular` — item: `'gal.historicocheck_slz'.Selected`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `FormChecklist_1` (Form) | FormChecklist_1 | OnSuccess | `Back();Notify("Check-List submetido com sucesso")` |
| `Button15` (Classic) | "Enviar" | OnSelect | `SubmitForm([@FormChecklist_1])` |

**Controles:** Label×207, TypedDataCard×69, Classic×69, Image×1, Form×1, ComboBox×1, Attachments×1


<a id="tela-checklist-veicular-slz-view"></a>
## Checklist_veicular_slz_View

- **Arquivo:** `Src/Checklist_veicular_slz_View.pa.yaml` — 6131 linhas — 341 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `CheckList_Veicular`, `Credenciaiss`
- **Formulários:**
  - `FormChecklist_View` → fonte `CheckList_Veicular` — item: `Galeriachecklist.Selected`
- **Galerias:**
  - `Gallery1` → itens: `Galeriachecklist.Selected.Anexos`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Botaocadastro_26` (Classic) | "Concluir" | OnSelect | `SubmitForm(FormChecklist_View)` |
| `FormChecklist_View` (Form) | FormChecklist_View | OnSuccess | `Back();Notify("Check-List submetido com sucesso")` |

**Controles:** Label×202, Classic×67, TypedDataCard×67, Image×2, Form×1, Attachments×1, Gallery×1


<a id="tela-novo-checklist-veicular"></a>
## Novo_CheckList_Veicular

- **Arquivo:** `Src/Novo_CheckList_Veicular.pa.yaml` — 1523 linhas — 120 controles
- **Fundo:** `RGBA(234, 234, 234, 1)`
- **Fontes de dados:** `CheckList_Veicular`, `controle_veiculo`
- **Formulários:**
  - `Form4` → fonte `CheckList_Veicular`
  - `Form5` → fonte `controle_veiculo`
- **Galerias:**
  - `Gallery13` → itens: `Sort(Filter(controle_veiculo, xstatus <> "Inativo", filial = varfilial), 'Data de Criação', SortOrder.Descending)`
  - `Gallery14` → itens: `Sort(Filter(CheckList_Veicular, nome_check = varnome), data_check, SortOrder.Descending)`
- **Variáveis de contexto (locais):** `openAddCar`, `openCheckList`, `openHistorico`, `openVehicles`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `ButtonCanvas26_2` (Button) | "Checklist" | OnSelect | `UpdateContext({openCheckList: true}) ; NewForm(Form4)` |
| `ButtonCanvas26_3` (Button) | "Cadastro de Veículos" | OnSelect | `UpdateContext({openAddCar: true}) ; NewForm(Form5)` |
| `ButtonCanvas31` (Button) | "Salvar" | OnSelect | `SubmitForm(Form5) ; UpdateContext({openAddCar:false})` |

**Controles:** Text×52, TypedDataCard×16, TextInput×12, Button×10, Label×9, GroupContainer×7, Rectangle×4, Form×2, Gallery×2, DropDown×2, Radio×1, ComboBox×1, DatePicker×1, Attachments×1


<a id="tela-exportar-checklist"></a>
## Exportar_CheckList

- **Arquivo:** `Src/Exportar_CheckList.pa.yaml` — 312 linhas — 17 controles
- **Fundo:** `RGBA(234, 234, 234, 1)`
- **Fontes de dados:** `CheckList_Veicular`
- **Galerias:**
  - `Gallery19` → itens: `Sort(
    Filter(
        CheckList_Veicular,
        Unidade = "São Luís",
        (IsBlank(De.SelectedDate) And IsBlank(Ate.SelectedDate) Or DateValue(data_check) >= De.SelectedD`
- **Flows chamados:** `gerar_planilha_checkList_veicular`
- **Navega para:** `COD_GERENCIAMENTO`
- **Set() variáveis globais:** `checkListJSON`, `executarFluxo`
- **Variáveis de contexto (locais):** `atehoje`, `hoje`
- **Coleções (Collect/ClearCollect):** `colList`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `ButtonCanvas45` (Button) | "Gerar planilha 📄" | OnSelect | `ClearCollect( colList, ShowColumns( Gallery19.AllItems, Title, autorizado, Observation, data_check, nome_check, matricula, quilometragem, Unidade, '1.Documento Do Veículo (IPVA/RT''S/TACÓGRAFO)', '2.Alarme', '3.Bateria (Luzes no painel)', '4.Buzina (Sonoridade)', '5.Chave De Roda (Condição das bocas da chave e presença)', '6.Macaco (lubrificação, mecanismos de bombeamento, preservação das roscas e` |
| `ButtonCanvas47` (Button) | = | OnSelect | `Navigate(COD_GERENCIAMENTO)` |

**Controles:** ModernText×4, Button×3, GroupContainer×2, Label×2, ModernDatePicker×2, CheckBox×2, Gallery×1, Image×1


<a id="tela-hist-rico-check-slz"></a>
## Histórico_check_SLZ

- **Arquivo:** `Src/Hist+¦rico_check_SLZ.pa.yaml` — 182 linhas — 12 controles
- **Fundo:** `t`
- **Fontes de dados:** `CheckList_Veicular`, `Credenciaiss`, `Trajetos`
- **Galerias:**
  - `gal.historicocheck_slz` → itens: `Sort(Filter(CheckList_Veicular,Unidade = "São Luís"),Criado,SortOrder.Descending)`
- **Navega para:** `Checklist_veicular_slz_View`, `Exportar_CheckList`, `SelecaoTrajeto`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `gal.historicocheck_slz` (Gallery) | gal.historicocheck_slz | OnSelect | `Navigate(Checklist_veicular_slz_View,ScreenTransition.Cover);Refresh(Trajetos)` |
| `Image1_43` (Image) | Image1_43 | OnSelect | `Navigate(SelecaoTrajeto,ScreenTransition.Cover);ResetForm(Trajetoform)` |
| `ButtonCanvas44` (Button) | "Exportar" | OnSelect | `Navigate(Exportar_CheckList)` |

**Controles:** Label×5, Rectangle×3, Gallery×1, Classic×1, Image×1, Button×1


# Módulo: Ferramentaria


<a id="tela-t-ferramentaria-checklist"></a>
## T_Ferramentaria_Checklist

- **Arquivo:** `Src/T_Ferramentaria_Checklist.pa.yaml` — 3741 linhas — 219 controles
- **Fundo:** `t`
- **Fontes de dados:** `Balanceamento`, `Controle Ferramentas`, `Credenciaiss`, `Lista Auxiliar - Ferramentas`, `Lista Auxiliar - Ferramentas por Setor`
- **Formulários:**
  - `Form1` → fonte `'Controle Ferramentas'`
  - `Form_tratativa` → fonte `'Controle Ferramentas'` — item: `GaleriaFerramentascompendencia.Selected`
- **Galerias:**
  - `GaleriaFerramentascompendencia` → itens: `Sort(
    Filter(
        'Controle Ferramentas',
        xUnidade = LookUp(
            Credenciaiss,
            varlogin = Usuário,
            Filial
        ),
        xSetor `
  - `GaleriaFerramentascheck` → itens: `Sort(
       Filter(
            'Lista Auxiliar - Ferramentas por Setor',
            LookUp(
                Credenciaiss,
                varlogin = Usuário,
                Fil`
  - `GaleriaFerramentasporsetor_3` → itens: `Sort(


    Filter(
        'Controle Ferramentas',
        xUnidade = LookUp(
            Credenciaiss,
            varlogin = Usuário,
            Filial
        ),
        xSeto`
  - `GaleriaFerramentascheck_1` → itens: `GaleriaFerramentascheck.Selected.Anexos`
  - `Gallery9_1` → itens: `DataCardValue373.Attachments`
  - `Gallery8_7` → itens: `DataCardValue383.Attachments`
  - `Gallery10` → itens: `Filter('Lista Auxiliar - Ferramentas por Setor', ID = GaleriaFerramentascompendencia.Selected.'ID xBase')`
- **Variáveis de contexto (locais):** `atribferr`, `check`, `confirsetor`, `fotogrande`, `fotoparecer`, `parecer`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `GaleriaFerramentascompendencia` (Gallery) | GaleriaFerramentascompendencia | OnSelect | `UpdateContext({parecer:true});EditForm(Form_tratativa)` |
| `Button8_2` (Classic) | "Novo Check-List" | OnSelect | `NewForm(Form1);UpdateContext({check:true})` |
| `Form1` (Form) | Form1 | OnSuccess | `NewForm(Form1);UpdateContext({fotogrande:false})` |
| `Button8_3` (Classic) | "Submeter" | OnSelect | `SubmitForm(Form1)` |
| `Form_tratativa` (Form) | Form_tratativa | OnSuccess | `Notify("Parecer atualizado com sucesso!",NotificationType.Success,1000);UpdateContext({parecer:false});UpdateContext({fotoparecer:false})` |
| `Button19` (Classic) | "Atualizar" | OnSelect | `SubmitForm(Form_tratativa)` |

**Controles:** Label×111, Classic×38, TypedDataCard×29, Rectangle×15, Image×14, Gallery×7, Form×2, Attachments×2, AddMedia×1


<a id="tela-t-ferramentaria-ferrporsetor"></a>
## T_Ferramentaria_FerrPorSetor

- **Arquivo:** `Src/T_Ferramentaria_FerrPorSetor.pa.yaml` — 2490 linhas — 151 controles
- **Fundo:** `t`
- **Fontes de dados:** `Balanceamento`, `Credenciaiss`, `Lista Auxiliar - Ferramentas`, `Lista Auxiliar - Ferramentas por Setor`
- **Formulários:**
  - `form_ferram_setor` → fonte `'Lista Auxiliar - Ferramentas por Setor'`
  - `FormAtualizarFerrPorSetor` → fonte `'Lista Auxiliar - Ferramentas por Setor'` — item: `GaleriaFerramentasporsetor.Selected`
- **Galerias:**
  - `GaleriaFerramentasporsetor` → itens: `Sort(Search(Filter('Lista Auxiliar - Ferramentas por Setor',LookUp(Credenciaiss,varlogin = Usuário,Filial) = xUnidade,drop_ferramenta_por_setor.Selected.Value = Setor),pesquisa_atr`
  - `galeriaferr_setor` → itens: `Sort(Search('Lista Auxiliar - Ferramentas',pesquisaferr.Text,Título),Título,SortOrder.Ascending)`
  - `Gallery7` → itens: `imagens_ferr_setor.Attachments`
  - `Gallery12_1` → itens: `DataCardValue367.Attachments`
- **Variáveis de contexto (locais):** `atribferr`, `atualizar`, `confirsetor`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Button8` (Classic) | "Atribuir Ferramenta" | OnSelect | `UpdateContext({atribferr:true});NewForm(form_ferram_setor)` |
| `Image37` (Image) | Image37 | OnSelect | `If(IsBlank(drop_ferramenta_por_setor.Selected.Value),Notify("Selecione o setor.",NotificationType.Warning,1500),UpdateContext({confirsetor:true}))` |
| `form_ferram_setor` (Form) | form_ferram_setor | OnSuccess | `UpdateContext({atribferr:false});UpdateContext({confirsetor:false});Notify("Ferramente atribuída com sucesso!",NotificationType.Success,1500)` |
| `Button9` (Classic) | "Confirmar" | OnSelect | `SubmitForm(form_ferram_setor)` |
| `FormAtualizarFerrPorSetor` (Form) | FormAtualizarFerrPorSetor | OnSuccess | `UpdateContext({atualizar:false});Notify("Atualizado com sucesso!",NotificationType.Success,1000)` |
| `Button17` (Classic) | "Atualizar" | OnSelect | `SubmitForm(FormAtualizarFerrPorSetor)` |

**Controles:** Label×78, Classic×24, TypedDataCard×20, Image×11, Rectangle×10, Gallery×4, Form×2, Attachments×2


<a id="tela-t-ferramentaria-banco"></a>
## T_Ferramentaria_Banco

- **Arquivo:** `Src/T_Ferramentaria_Banco.pa.yaml` — 1599 linhas — 96 controles
- **Fundo:** `t`
- **Fontes de dados:** `Lista Auxiliar - Ferramentas`, `Lista Auxiliar - Ferramentas por Setor`
- **Formulários:**
  - `form_ferram_nova` → fonte `'Lista Auxiliar - Ferramentas'`
  - `Form_atualizar_bancoferramentas` → fonte `'Lista Auxiliar - Ferramentas'` — item: `GaleriaFerramentasBanco.Selected`
- **Galerias:**
  - `GaleriaFerramentasBanco` → itens: `Sort(

Search(

    'Lista Auxiliar - Ferramentas',pesquisa_banco.Text,Título,NomeTipo
    
)    
    ,
    Título,
    SortOrder.Ascending
)`
- **Variáveis de contexto (locais):** `atribferr`, `atualizar`, `confirsetor`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Button8_1` (Classic) | "Adicionar Ferramenta" | OnSelect | `UpdateContext({atribferr:true});NewForm(form_ferram_nova)` |
| `form_ferram_nova` (Form) | form_ferram_nova | OnSuccess | `UpdateContext({atribferr:false});Notify("Ferramente incluída com sucesso!",NotificationType.Success,1500)` |
| `Button10` (Classic) | "Incluir" | OnSelect | `SubmitForm(form_ferram_nova)` |
| `Form_atualizar_bancoferramentas` (Form) | Form_atualizar_bancoferramentas | OnSuccess | `Notify("OK",NotificationType.Success,1000);UpdateContext({atualizar:false})` |
| `Button11` (Classic) | "Atualizar" | OnSelect | `SubmitForm(Form_atualizar_bancoferramentas)` |

**Controles:** Label×49, Classic×14, TypedDataCard×14, Rectangle×7, Image×6, Form×2, Attachments×2, Gallery×1, AddMedia×1


<a id="tela-t-ferramentaria-historic"></a>
## T_Ferramentaria_historic

- **Arquivo:** `Src/T_Ferramentaria_historic.pa.yaml` — 277 linhas — 18 controles
- **Fundo:** `t`
- **Fontes de dados:** `Controle Ferramentas`, `Lista Auxiliar - Ferramentas`, `Lista Auxiliar - Ferramentas por Setor`
- **Galerias:**
  - `GaleriaFerramentascompendencia_1` → itens: ` Sort(Filter('Controle Ferramentas','ID xBase' = pesquisa_atrib_2.Text),DataVer,SortOrder.Descending)`
  - `Gallery10_1` → itens: `Filter('Lista Auxiliar - Ferramentas por Setor', ID = GaleriaFerramentascompendencia_1.Selected.'ID xBase')`
- **Variáveis de contexto (locais):** `confirsetor`, `fotoparecer`, `parecer`

**Controles:** Label×7, Image×5, Rectangle×3, Gallery×2, Classic×1


<a id="tela-t-ferramentaria"></a>
## T_Ferramentaria

- **Arquivo:** `Src/T_Ferramentaria.pa.yaml` — 135 linhas — 6 controles
- **Fundo:** `t`
- **Navega para:** `T_Ferramentaria_Banco`, `T_Ferramentaria_Checklist`, `T_Ferramentaria_FerrPorSetor`, `T_Ferramentaria_historic`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Button1_67` (Classic) | "Banco de Ferramentas" | OnSelect | `Navigate(T_Ferramentaria_Banco)` |
| `Button1_68` (Classic) | "Quadro de Ferramentas" | OnSelect | `Navigate(T_Ferramentaria_FerrPorSetor)` |
| `Button1_70` (Classic) | "Histórico de Checagens" | OnSelect | `Navigate(T_Ferramentaria_historic)` |
| `Button1_71` (Classic) | "Checagem" | OnSelect | `Navigate(T_Ferramentaria_Checklist)` |

**Controles:** Classic×4, Label×1, Image×1


# Módulo: Serviços Externos / Terceirizados


<a id="tela-servi-osexternos"></a>
## ServiçosExternos

- **Arquivo:** `Src/Servi+ºosExternos.pa.yaml` — 1597 linhas — 93 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `ServiçosExternosPortugal`
- **Formulários:**
  - `ServExternosform` → fonte `ServiçosExternosPortugal` — item: `historicoavr.Selected`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Button2` (Classic) | "Concluir" | OnSelect | `SubmitForm(ServExternosform)` |

**Controles:** Label×53, Classic×20, TypedDataCard×17, Image×1, Form×1, Attachments×1


<a id="tela-novoregistroterceir"></a>
## NovoRegistroTerceir

- **Arquivo:** `Src/NovoRegistroTerceir.pa.yaml` — 1582 linhas — 91 controles
- **Fundo:** `t`
- **Fontes de dados:** `servicosterceirizados`, `servicosterceirizados_for`
- **Formulários:**
  - `FormNovoTercei` → fonte `servicosterceirizados`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `FormNovoTercei` (Form) | FormNovoTercei | OnSuccess | `Back();Notify("Registro inserido com sucesso",NotificationType.Success)` |
| `Button7` (Classic) | "Concluir" | OnSelect | `SubmitForm(FormNovoTercei)` |

**Controles:** Label×51, Classic×20, TypedDataCard×16, Image×2, Form×1, AddMedia×1


<a id="tela-hist-ricoservavr"></a>
## HIstóricoServAVR

- **Arquivo:** `Src/HIst+¦ricoServAVR.pa.yaml` — 332 linhas — 18 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `ServiExternosAveiro`, `ServiçosExternosPortugal`
- **Galerias:**
  - `historicoavr` → itens: `Sort(
    Search(
        If(
            checkfinalizado.Value = true,
            Filter(
                ServiçosExternosPortugal,
                status.Value = checkfinalizado`
- **Navega para:** `ServiçosExternos`
- **Variáveis de contexto (locais):** `check1`, `check2`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `historicoavr` (Gallery) | historicoavr | OnSelect | `Navigate(ServiçosExternos);EditForm(ServExternosform)` |

**Controles:** Label×10, Classic×5, Gallery×1, Rectangle×1, Image×1


<a id="tela-historicoterceir"></a>
## HistoricoTerceir

- **Arquivo:** `Src/HistoricoTerceir.pa.yaml` — 280 linhas — 16 controles
- **Fundo:** `t`
- **Fontes de dados:** `Serviços Terceirizados`, `servicosterceirizados`
- **Galerias:**
  - `gal_historico` → itens: `If(
    class = true,
    Sort(
        Search(
            Filter(
                servicosterceirizados,
                ID <> "",Unidade = varfilial
            ),
            p`
- **Navega para:** `ControleTerceirizado`, `HistoricoPendentes`
- **Variáveis de contexto (locais):** `class`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `gal_historico` (Gallery) | gal_historico | OnSelect | `Navigate(HistoricoPendentes);EditForm(FormAtualizacaoPendet_1)` |
| `Image1_51` (Image) | Image1_51 | OnSelect | `Navigate(ControleTerceirizado);Refresh('Serviços Terceirizados')` |

**Controles:** Label×7, Image×4, Rectangle×2, Classic×2, Gallery×1


<a id="tela-controleterceirizado"></a>
## ControleTerceirizado

- **Arquivo:** `Src/ControleTerceirizado.pa.yaml` — 106 linhas — 5 controles
- **Fundo:** `t`
- **Fontes de dados:** `Serviços Terceirizados`
- **Navega para:** `HistoricoTerceir`, `NovoRegistroTerceir`, `PendentesdeRetorno`, `SELEC_COD`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Button1_26` (Classic) | "Novo Registro" | OnSelect | `Navigate(NovoRegistroTerceir);NewForm(FormNovoTercei)` |
| `Button1_27` (Classic) | "Pendentes de Retorno" | OnSelect | `Navigate(PendentesdeRetorno);Refresh('Serviços Terceirizados')` |
| `Button1_69` (Classic) | "Histórico" | OnSelect | `Navigate(HistoricoTerceir)` |
| `Image1_48` (Image) | Image1_48 | OnSelect | `Navigate(SELEC_COD)` |

**Controles:** Classic×3, Label×1, Image×1


# Módulo: RDS


<a id="tela-req-rds"></a>
## Req_RDS

- **Arquivo:** `Src/Req_RDS.pa.yaml` — 1437 linhas — 80 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Credenciaiss`, `Lista Auxiliar - Clientes Medro`, `RDS`, `RDS-Managements`, `controle_veiculo`
- **Formulários:**
  - `formRDS` → fonte `'RDS-Managements'`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Image1_55` (Image) | Image1_55 | OnSelect | `Back();ResetForm(formRDS)` |
| `formRDS` (Form) | formRDS | OnSuccess | `Notify("RDS enviada com sucesso",NotificationType.Success,2000);Back()` |
| `Button12` (Classic) | "Enviar RDS" | OnSelect | `SubmitForm(formRDS)` |

**Controles:** Label×45, Classic×18, TypedDataCard×14, Image×1, Form×1, Attachments×1


<a id="tela-historico-rds"></a>
## Historico_RDS

- **Arquivo:** `Src/Historico_RDS.pa.yaml` — 182 linhas — 11 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Credenciaiss`, `RDS`, `RDS-Managements`
- **Galerias:**
  - `Gallery4_2` → itens: `Sort( Filter('RDS-Managements', LookUp(Credenciaiss,TextInput2.Text = Matrícula,Título) = NomeReq),'Data de Criação',SortOrder.Descending)`

**Controles:** Label×5, Rectangle×3, Gallery×1, Image×1, Classic×1


<a id="tela-requisi-o-rds"></a>
## Requisição RDS

- **Arquivo:** `Src/Requisi+º+úo RDS.pa.yaml` — 87 linhas — 4 controles
- **Fundo:** `t`
- **Fontes de dados:** `RDS`
- **Navega para:** `T_Ferramentaria`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Button1_74` (Classic) | "Ordens de Serviços" | OnSelect | `Navigate(T_Ferramentaria)` |
| `Button1_75` (Classic) | "Requisição RDS" | OnSelect | `Navigate(T_Ferramentaria)` |

**Controles:** Classic×2, Label×1, Image×1


# Módulo: Relatório Fotográfico


<a id="tela-relatorio"></a>
## Relatorio

- **Arquivo:** `Src/Relatorio.pa.yaml` — 1039 linhas — 59 controles
- **Fundo:** `t`
- **Fontes de dados:** `Credenciaiss`, `Relatório`
- **Formulários:**
  - `Form_Relatorio` → fonte `Relatório`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Image1_63` (Image) | Image1_63 | OnSelect | `Back();ResetForm(Form_Relatorio)` |
| `Form_Relatorio` (Form) | Form_Relatorio | OnSuccess | `Back();Notify("Relatório enviado com sucesso!",NotificationType.Success,2000)` |
| `Button14` (Classic) | "Concluir" | OnSelect | `SubmitForm(Form_Relatorio)` |

**Controles:** Label×32, Classic×17, TypedDataCard×7, Image×1, Form×1, Attachments×1


<a id="tela-rel-foto-parametro"></a>
## Rel_Foto_parametro

- **Arquivo:** `Src/Rel_Foto_parametro.pa.yaml` — 736 linhas — 49 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `Credenciaiss`, `Lista Auxiliar - Clientes Medro`, `Relatorio_Fotografico`, `Relatório`
- **Escreve (Patch) em:** `Relatorio_Fotografico`
- **Flows chamados:** `exibir_imagens_sharepoint`
- **Navega para:** `Login`, `Login_1`, `Rel_Foto_Escolha`, `Rel_Foto_Per`
- **Set() variáveis globais:** `NomeCliente`, `NomeTipo`, `NumeroOS`, `varCliente`, `varClienteRaw`, `varFluxo`, `varOS`, `varOSRaw`, `varSessaoId`, `varcliente2`, `varos2`, `vartipo`
- **Variáveis de contexto (locais):** `rdsmot`, `varFluxo`
- **Coleções (Collect/ClearCollect):** `colFilaFotosFlow`, `colRelatorioLinha`

**OnHidden:** `UpdateContext({rdsmot:false,rdsaux:false})`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `DataCardValue62_10` (ComboBox) | DataCardValue62_10 | OnChange | `Set(NomeCliente, DataCardValue62_10.Selected.Title)` |
| `ButtonCanvas34` (Button) | "Iniciar" | OnSelect | `Set(varClienteRaw, Trim(DataCardValue62_10.Selected.Nome)); Set(varOSRaw, Trim(TextCanvas18.Text)); Set( varCliente, Substitute( Substitute( Substitute( Substitute( Substitute( Substitute(varClienteRaw, "/", "-"), "\", "-" ), ":", "-" ), "*", "" ), "?", "" ), "\|", "" ) ); // Sanitiza nome da OS Set( varOS, Substitute( Substitute( Substitute( Substitute( Substitute( Substitute(varOSRaw, "/", "-"), ` |
| `Image1_9` (Image) | Image1_9 | OnSelect | `//Navigate(Login) //Navigate(Login_1) Navigate(Rel_Foto_Escolha)` |
| `DropdownCanvas3` (DropDown) | DropdownCanvas3 | OnChange | `Set(NomeTipo, DropdownCanvas3.Selected.Value)` |
| `ButtonCanvas42` (Button) | "Adicionar" | OnSelect | `Set(varcliente2, DataCardValue62_10.Selected.Title) ; Set(varos2, TextCanvas18.Text) ; Set(vartipo, DropdownCanvas3.Selected.Value) ; exibir_imagens_sharepoint.Run(varfilial, varcliente2, varos2, vartipo) ; UpdateContext({varFluxo:true}) ; ClearCollect( colFilaFotosFlow, Table(ParseJSON('exibir_imagens_sharepoint'.Run(varfilial, varcliente2,varos2, vartipo).fotosjson)) ) ; ClearCollect( colRelator` |
| `ButtonCanvas42_1` (Button) | "Adicionar" | OnSelect | `Set(varcliente2, DataCardValue62_10.Selected.Title) ; Set(varos2, TextCanvas18.Text) ; Set(vartipo, DropdownCanvas3.Selected.Value) ; exibir_imagens_sharepoint.Run(varfilial, varcliente2, varos2, vartipo) ; Set(varFluxo, true) ; ClearCollect( colFilaFotosFlow, Table(ParseJSON('exibir_imagens_sharepoint'.Run(varfilial, varcliente2,varos2, vartipo).fotosjson)) ) ; ClearCollect( colRelatorioLinha, Pa` |
| `ButtonCanvas42_2` (Button) | "Adicionar" | OnSelect | `Set(varcliente2, DataCardValue62_10.Selected.Title) ; Set(varos2, TextCanvas18.Text) ; Set(vartipo, DropdownCanvas3.Selected.Value) ; exibir_imagens_sharepoint.Run(varfilial, varcliente2, varos2, vartipo) ; Set(varFluxo, true) ; ClearCollect( colFilaFotosFlow, Table(ParseJSON('exibir_imagens_sharepoint'.Run(varfilial, varcliente2,varos2, vartipo).fotosjson)) ) ; ClearCollect( colRelatorioLinha, Pa` |
| `ButtonCanvas42_3` (Button) | "Adicionar" | OnSelect | `Set(varcliente2, DataCardValue62_10.Selected.Title) ; Set(varos2, TextCanvas18.Text) ; Set(vartipo, DropdownCanvas3.Selected.Value) ; exibir_imagens_sharepoint.Run(varfilial, varcliente2, varos2, vartipo) ; Set(varFluxo, true) ; ClearCollect( colFilaFotosFlow, Table(ParseJSON('exibir_imagens_sharepoint'.Run(varfilial, varcliente2,varos2, vartipo).fotosjson)) ) ; ClearCollect( colRelatorioLinha, Pa` |
| `TextInputCanvas11` (TextInput) | TextInputCanvas11 | OnChange | `Set(NumeroOS, TextInputCanvas11.Value)` |

**Controles:** Text×24, ComboBoxDataField×7, Button×5, GroupContainer×5, TextInput×3, ComboBox×1, Image×1, Classic×1, DropDown×1, Label×1


<a id="tela-rel-foto-lista"></a>
## Rel_Foto_Lista

- **Arquivo:** `Src/Rel_Foto_Lista.pa.yaml` — 447 linhas — 27 controles
- **Fundo:** `//Fundo`
- **Galerias:**
  - `GalleryClientes` → itens: `//ColFotosPeritagemClientes
Sort(Filter(ColFotosPeritagemClientes, TextInputCanvas9.Value in Value.Nome), SortOrder.Ascending)`
  - `GalleryPeritagem` → itens: `Sort(Filter(ColFotosPeritagem, TextInputCanvas10.Value in Value.Nome), SortOrder.Ascending)`
  - `GalleryOSFiles` → itens: `ColArquivos`
  - `Gallery16` → itens: `ColFotos2`
- **Flows chamados:** `Exibir_Imagem`, `exibir_imagens_sharepoint`
- **Navega para:** `Rel_Foto_Escolha`
- **Set() variáveis globais:** `varcliente3`, `varos3`, `vartipo2`, `vartipo3`
- **Variáveis de contexto (locais):** `rdsmot`, `showImage`, `showImages`, `varFotoBase64`, `viewImage`, `viewImages`
- **Coleções (Collect/ClearCollect):** `ColArquivos`, `ColFotos2`, `ColFotosPeritagem`, `ColFotosPeritagemClientes`

**OnVisible:**

```
exibir_imagens_sharepoint.Run(varfilial, "", "", "") ; ClearCollect( ColFotosPeritagemClientes, Table(ParseJSON('exibir_imagens_sharepoint'.Run(varfilial, "","", "").fotosjson)) )
```

**OnHidden:** `UpdateContext({rdsmot:false,rdsaux:false})`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Image1_12` (Image) | Image1_12 | OnSelect | `Navigate(Rel_Foto_Escolha,ScreenTransition.Cover)` |
| `GalleryClientes` (Gallery) | GalleryClientes | OnSelect | `Set(varcliente3, ThisItem.Value.Nome) ; exibir_imagens_sharepoint.Run(varfilial, varcliente3, "", "") ; ClearCollect( ColFotosPeritagem, Table(ParseJSON('exibir_imagens_sharepoint'.Run(varfilial, varcliente3,"", "").fotosjson)) )` |
| `GalleryPeritagem` (Gallery) | GalleryPeritagem | OnSelect | `UpdateContext({showImage: true}) ; Set(varos3, ThisItem.Value.Nome) ; Set(vartipo2, "") ; exibir_imagens_sharepoint.Run(varfilial, varcliente3, varos3, vartipo2) ; ClearCollect( ColArquivos, Table(ParseJSON('exibir_imagens_sharepoint'.Run(varfilial, varcliente3,varos3, vartipo2).fotosjson)) ) ; UpdateContext({viewImages:false})` |
| `ButtonCanvas39` (Button) | "Fechar" | OnSelect | `UpdateContext({showImage: false}) ; UpdateContext({showImages: true}) ; UpdateContext({viewImage:false}) ; ClearCollect(ColFotos2, [])` |
| `GalleryOSFiles` (Gallery) | GalleryOSFiles | OnSelect | `Set(vartipo3, ThisItem.Value.Nome) ; exibir_imagens_sharepoint.Run(varfilial, varcliente3, varos3, vartipo3) ; ClearCollect( ColFotos2, Table(ParseJSON('exibir_imagens_sharepoint'.Run(varfilial, varcliente3,varos3, vartipo3).fotosjson)) ) ; UpdateContext({viewImages: true}) ; Clear(colImagens) ; ForAll( ColFotos2, Collect( colImagens, { ID: Value.Id, Imagem: "data:image/jpeg;base64," & Exibir_Imag` |
| `Gallery16` (Gallery) | Gallery16 | OnSelect | `UpdateContext({viewImage:true}) ; UpdateContext({varFotoBase64: Exibir_Imagem.Run(ThisItem.Value.Id).imgbase64})` |

**Controles:** Image×6, Gallery×4, Rectangle×4, GroupContainer×3, Label×3, Button×3, Text×2, TextInput×2


<a id="tela-rel-foto-lista-pc"></a>
## Rel_Foto_Lista_PC

- **Arquivo:** `Src/Rel_Foto_Lista_PC.pa.yaml` — 417 linhas — 26 controles
- **Fundo:** `'Logo Kairós azul em '`
- **Galerias:**
  - `Gallery15` → itens: `Sort(Filter(ColFotosPeritagemClientesPC, TextInput7.Text in Value.Nome), SortOrder.Ascending)`
  - `Gallery17` → itens: `Sort(Filter(ColFotosPeritagemPC, TextInput7_1.Text in Value.Nome), SortOrder.Ascending)`
  - `Gallery18` → itens: `ColFotosPC`
- **Flows chamados:** `Exibir_Imagem`, `Imagens_JSON`, `exibir_imagens_sharepoint`
- **Navega para:** `Rel_Foto_Escolha`
- **Set() variáveis globais:** `varcliente3`, `varos3`, `vartipo2`, `vartipo3`
- **Variáveis de contexto (locais):** `getFile`, `showImagePC`, `viewImagePC`, `viewImages`, `viewImagesPC`
- **Coleções (Collect/ClearCollect):** `ColArquivosPC`, `ColFotosPC`, `ColFotosPeritagemClientesPC`, `ColFotosPeritagemPC`

**OnVisible:**

```
exibir_imagens_sharepoint.Run(varfilial, "", "", "") ; ClearCollect( ColFotosPeritagemClientesPC, Table(ParseJSON('exibir_imagens_sharepoint'.Run(varfilial, "","", "").fotosjson)) )
```

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Gallery15` (Gallery) | Gallery15 | OnSelect | `Set(varcliente3, ThisItem.Value.Nome) ; exibir_imagens_sharepoint.Run(varfilial, varcliente3, "", "") ; ClearCollect( ColFotosPeritagemPC, Table(ParseJSON('exibir_imagens_sharepoint'.Run(varfilial, varcliente3,"", "").fotosjson)) )` |
| `ButtonCanvas38` (Button) | "Voltar" | OnSelect | `Navigate(Rel_Foto_Escolha,ScreenTransition.Cover)` |
| `Gallery17` (Gallery) | Gallery17 | OnSelect | `UpdateContext({showImagePC: true}) ; Set(varos3, ThisItem.Value.Nome) ; Set(vartipo2, "") ; exibir_imagens_sharepoint.Run(varfilial, varcliente3, varos3, vartipo2) ; ClearCollect( ColArquivosPC, Table(ParseJSON('exibir_imagens_sharepoint'.Run(varfilial, varcliente3,varos3, vartipo2).fotosjson)) ) ; UpdateContext({viewImagesPC:false})` |
| `Radio1` (ModernRadio) | Radio1 | OnChange | `Set(vartipo3, Radio1.Selected.Value.Nome) ; exibir_imagens_sharepoint.Run(varfilial, varcliente3, varos3, vartipo3) ; //UpdateContext({getFile: Imagens_JSON.Run(varfilial; varcliente3; varos3; vartipo3).foto_json}) //;; ClearCollect( ColFotosPC, Table(ParseJSON('exibir_imagens_sharepoint'.Run(varfilial, varcliente3,varos3, vartipo3).fotosjson)) ) ; Clear(colImagens) ; ForAll( ColFotosPC, Collect( ` |

**Controles:** GroupContainer×7, ModernText×5, Image×5, Gallery×3, Label×2, ModernTextInput×2, Button×1, ModernRadio×1


<a id="tela-rel-foto-per"></a>
## Rel_Foto_Per

- **Arquivo:** `Src/Rel_Foto_Per.pa.yaml` — 344 linhas — 13 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `CIPA_2026`, `Credenciaiss`, `Relatorio_Fotografico`, `Relatório`
- **Escreve (Patch) em:** `Relatorio_Fotografico`
- **Galerias:**
  - `Gallery16_1` → itens: `Sort(colFilaFotos,Data,SortOrder.Descending)`
- **Flows chamados:** `Imagens_JSON`, `salvarfotosperitagem`
- **Navega para:** `Login_1`, `Rel_Foto_parametro`
- **Set() variáveis globais:** `varFluxo`
- **Variáveis de contexto (locais):** `rdsmot`
- **Coleções (Collect/ClearCollect):** `colAllFotos`, `colLote`, `colRelatorioLinha`

**OnVisible:**

```
Refresh(CIPA_2026)
```

**OnHidden:** `UpdateContext({rdsmot:false,rdsaux:false})`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Image1_10` (Image) | Image1_10 | OnSelect | `Clear(colFilaFotos) ; Clear(colFilaFotosFlow) ; Set(varFluxo, false) ; Navigate(Rel_Foto_parametro) //Navigate(Login_1)` |
| `AddMediaButton1` (AddMedia) | AddMediaButton1 | OnChange | `With( { j: JSON(UploadedImage1.Image, JSONFormat.IncludeBinaryData) }, Collect( colFilaFotos, { Id: GUID(), Cliente: varCliente, OS: varOS, Progresso: 0, Data: Now(), Filial: varfilial, Tipo: DropdownCanvas3.Selected.Value, DataUri: Mid(j, 2, Len(j) - 2), // remove as aspas do JSON "..." Status: "Pendente", MsgErro: "" } ) ); Notify("Foto adicionada na fila.", NotificationType.Success)` |
| `Image97_1` (Image) | Image97_1 | OnSelect | `Remove(colFilaFotos, ThisItem)` |
| `ButtonCanvas35_1` (Button) | "Subir Imagens" | OnSelect | `// 1) Pega até 10 fotos pendentes ClearCollect( colLote, FirstN( Filter(colFilaFotos, Status = "Pendente"), 10 ) ); If( CountRows(colLote) = 0, Notify("Não há fotos pendentes.", NotificationType.Information), false ); // 2) Marca como Enviando ForAll( colLote, UpdateIf( colFilaFotos, Id = ThisRecord.Id, { Status: "Enviando", MsgErro: "" } ) ); // 3) Envia 1 por 1 chamando o Flow (DATA URI) /* ForA` |

**Controles:** Image×5, Text×2, Label×2, AddMedia×1, GroupContainer×1, Gallery×1, Button×1


<a id="tela-rel-foto-escolha"></a>
## Rel_Foto_Escolha

- **Arquivo:** `Src/Rel_Foto_Escolha.pa.yaml` — 65 linhas — 4 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `CIPA_2026`, `Relatório`
- **Navega para:** `Rel_Foto_Lista`, `Rel_Foto_Lista_PC`, `Rel_Foto_parametro`, `SELEC_COD`
- **Variáveis de contexto (locais):** `rdsmot`

**OnVisible:**

```
Refresh(CIPA_2026)
```

**OnHidden:** `UpdateContext({rdsmot:false,rdsaux:false})`

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `Image1_11` (Image) | Image1_11 | OnSelect | `Navigate(SELEC_COD)` |
| `ButtonCanvas36` (Button) | "Galeria de Fotos" | OnSelect | `If(Host.OSType = "Android" Or "IOS", Navigate(Rel_Foto_Lista,ScreenTransition.Cover), Navigate(Rel_Foto_Lista_PC,ScreenTransition.Cover))` |
| `ButtonCanvas36_1` (Button) | "Novo Relatório" | OnSelect | `Navigate(Rel_Foto_parametro,ScreenTransition.Cover)` |

**Controles:** Button×2, Image×1, Text×1


# Módulo: Escopo de Manutenção


<a id="tela-escopodemanuten"></a>
## EscopoDeManuten

- **Arquivo:** `Src/EscopoDeManuten.pa.yaml` — 303 linhas — 23 controles
- **Fundo:** `Fundo`
- **Fontes de dados:** `ABF010`, `Laudos`, `SCP010`
- **Galerias:**
  - `Gallery11` → itens: `Sort( Search(SCP010,TextInputCanvas7.Value,CP_NUMOS) ,CP_DATPRF,SortOrder.Descending)`
  - `Gallery11_1` → itens: `Sort( Search(ABF010,TextInputCanvas7_1.Value,ABF_NUMOS) ,ABF_EMISSA,SortOrder.Descending)`
- **Navega para:** `SELEC_COD`
- **Variáveis de contexto (locais):** `img`

**OnVisible:**

```
UpdateContext({img: false})
```

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `ButtonCanvas13_19` (Button) | "Voltar" | OnSelect | `Navigate(SELEC_COD)` |

**Controles:** Label×6, Text×5, Rectangle×4, Button×2, Gallery×2, Classic×2, TextInput×2


# Módulo: CIPA


<a id="tela-vota-ocipa"></a>
## VotaçãoCIPA

- **Arquivo:** `Src/Vota+º+úoCIPA.pa.yaml` — 391 linhas — 34 controles
- **Fundo:** `RGBA(234, 234, 234, 1)`
- **Fontes de dados:** `CIPA_2026`
- **Formulários:**
  - `Form2` → fonte `CIPA_2026`
- **Variáveis de contexto (locais):** `ch`, `co`, `mar`, `nulo`, `rv`, `sm`

**OnVisible:**

```
UpdateContext({ch:false,an:false,rod:false,mar:false,co:false,nulo:false});NewForm(Form2)
```

**Ações principais:**

| Controle | Rótulo | Evento | Código (resumo) |
|---|---|---|---|
| `ButtonCanvas23_1` (Button) | "Votar" | OnSelect | `SubmitForm(Form2)` |
| `Form2` (Form) | Form2 | OnSuccess | `Notify("Voto Enviado!!!",NotificationType.Success,3000);Back();UpdateContext({ch:false,an:false,rod:false,mar:false,co:false,nulo:false})` |

**Controles:** Text×13, Image×6, Octagon×5, TypedDataCard×4, TextInput×4, Button×1, Form×1


# Módulo: Documentos


<a id="tela-documentos-trajeto-slz"></a>
## Documentos_trajeto SLZ

- **Arquivo:** `Src/Documentos_trajeto SLZ.pa.yaml` — 101 linhas — 7 controles
- **Fundo:** `RGBA(8, 5, 31, 1)`
- **Fontes de dados:** `Doc.Medro.SLZ`
- **Galerias:**
  - `galeriadocumentoslz` → itens: `'Doc.Medro.SLZ'`

**Controles:** Label×2, Rectangle×2, Gallery×1, PDFViewer×1, Image×1

