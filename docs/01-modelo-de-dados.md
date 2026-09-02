# Medro — Modelo de Dados

> Extraído de `References/DataSources.json` do pacote PowerApps.
> Fontes: **Dataverse** (25 tabelas), **SharePoint** (24 listas), **SQL Server / Protheus** (3 tabelas).

## Índice

### Dataverse
- [Balanceamento](#dv-cr4a1_balanceamento) — `cr4a1_balanceamento` — 68 campos
- [Base_Medro](#dv-cr4a1_base_medro) — `cr4a1_base_medro` — 56 campos
- [Caldeiraria_Controle](#dv-cr4a1_caldeiraria_controle) — `cr4a1_caldeiraria_controle` — 50 campos
- [Caldeiraria_Lista](#dv-cr4a1_caldeiraria_lista) — `cr4a1_caldeiraria_lista` — 28 campos
- [CIPA_2026](#dv-cr4a1_cipa_2026) — `cr4a1_cipa_2026` — 31 campos
- [CIPA_Vot](#dv-cr4a1_cipa_vot) — `cr4a1_cipa_vot` — 30 campos
- [CK_Farol](#dv-cr4a1_ck_farol) — `cr4a1_ck_farol` — 82 campos
- [Compartilhamento de Campo](#dv-principalobjectattributeaccess) — `principalobjectattributeaccess` — 14 campos
- [Controle Ferramentas](#dv-cr4a1_controleferramentas) — `cr4a1_controleferramentas` — 60 campos
- [controle_man_veicul](#dv-cr4a1_controle_man_veicul) — `cr4a1_controle_man_veicul` — 45 campos
- [controle_veiculo](#dv-cr4a1_controle_veiculo) — `cr4a1_controle_veiculo` — 47 campos
- [Credenciaiss](#dv-cr4a1_credenciais) — `cr4a1_credenciais` — 60 campos
- [ensaio_temporizado](#dv-cr4a1_ensaio_temporizado) — `cr4a1_ensaio_temporizado` — 47 campos
- [Laudos](#dv-cr4a1_laudos) — `cr4a1_laudos` — 51 campos
- [Prod_Avaliacao_Final](#dv-cr4a1_peritagem_final) — `cr4a1_peritagem_final` — 89 campos
- [Prod_Avaliacao_Final_Opc](#dv-cr4a1_prod_avaliacao_final_opc) — `cr4a1_prod_avaliacao_final_opc` — 64 campos
- [Prod_Inspecao](#dv-cr4a1_prod_inspecao) — `cr4a1_prod_inspecao` — 69 campos
- [Prod_LiberarEnsaio](#dv-cr4a1_prod_liberarensaio) — `cr4a1_prod_liberarensaio` — 30 campos
- [RDS-Managements](#dv-cr4a1_rdsmanagement) — `cr4a1_rdsmanagement` — 56 campos
- [Relatorio_Fotografico](#dv-cr4a1_relatorio_fotografico) — `cr4a1_relatorio_fotografico` — 36 campos
- [Requisicao](#dv-cr4a1_requisicao) — `cr4a1_requisicao` — 31 campos
- [servicosterceirizados](#dv-cr4a1_servicosterceirizados) — `cr4a1_servicosterceirizados` — 70 campos
- [servicosterceirizados_for](#dv-cr4a1_servicosterceirizados_for) — `cr4a1_servicosterceirizados_for` — 29 campos
- [Usuários](#dv-systemuser) — `systemuser` — 170 campos
- [ZB6_Relatorio](#dv-cr4a1_zb6_relatorio) — `cr4a1_zb6_relatorio` — 221 campos

### SharePoint
- [CheckList_Veicular](#sp-checklist-veicular) — 138 colunas
- [Doc Técnicos](#sp-doc-técnicos) — 16 colunas
- [Doc Técnicos_1](#sp-doc-técnicos-1) — 16 colunas
- [Doc Técnicos_2](#sp-doc-técnicos-2) — 16 colunas
- [Doc Técnicos_3](#sp-doc-técnicos-3) — 16 colunas
- [Doc.Medro.SLZ](#sp-doc-medro-slz) — 13 colunas
- [Lista Auxiliar - Clientes Medro](#sp-lista-auxiliar---clientes-medro) — 19 colunas
- [Lista Auxiliar - Ferramentas](#sp-lista-auxiliar---ferramentas) — 16 colunas
- [Lista Auxiliar - Ferramentas por Setor](#sp-lista-auxiliar---ferramentas-por-setor) — 26 colunas
- [Lista Auxiliar - Inspeção de Qualidade](#sp-lista-auxiliar---inspeção-de-qualidade) — 10 colunas
- [Lista Auxiliar - Setores Medro](#sp-lista-auxiliar---setores-medro) — 10 colunas
- [Lista QR Code](#sp-lista-qr-code) — 45 colunas
- [OS 45-65k](#sp-os-45-65k) — 48 colunas
- [PF e IQ](#sp-pf-e-iq) — 121 colunas
- [PF e IQ - 2024](#sp-pf-e-iq---2024) — 121 colunas
- [RDS](#sp-rds) — 28 colunas
- [Relatório](#sp-relatório) — 20 colunas
- [SAC - Kairós](#sp-sac---kairós) — 16 colunas
- [ServiExternosAveiro](#sp-serviexternosaveiro) — 13 colunas
- [Serviços Terceirizados](#sp-serviços-terceirizados) — 40 colunas
- [Serviços Terceirizados - PT](#sp-serviços-terceirizados---pt) — 38 colunas
- [ServiçosExternosPortugal](#sp-serviçosexternosportugal) — 25 colunas
- [Tarefas Operacionais](#sp-tarefas-operacionais) — 19 colunas
- [Trajetos](#sp-trajetos) — 42 colunas

### SQL Server (Protheus)
- [ABF010](#sql-abf010) — 15 colunas
- [SCP010](#sql-scp010) — 50 colunas
- [ZB6010](#sql-zb6010) — 186 colunas

---

# Dataverse


<a id="dv-cr4a1_balanceamento"></a>
## Balanceamento

| | |
|---|---|
| Nome lógico | `cr4a1_balanceamento` |
| EntitySet (Web API) | `cr4a1_balanceamentos` |
| Chave primária | `cr4a1_balanceamentoid` |
| Campo nome primário | `cr4a1_os` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_arquivo_balanceamento_name` |  | texto (max 200) |  | -- |
| `cr4a1_balanceamentoid` | Balanceamento | GUID | sistema | C- |
| `cr4a1_classeisog` | ClasseISOG | texto (max 100) |  | CU |
| `cr4a1_conteudo_baldados` | Conteudo_BALDADOS | texto (max 4000) |  | CU |
| `cr4a1_fase_final1` | Fase_Final1 | texto (max 100) |  | CU |
| `cr4a1_fase_final2` | Fase_Final2 | texto (max 100) |  | CU |
| `cr4a1_fase_inicial1` | Fase_Inicial1 | texto (max 100) |  | CU |
| `cr4a1_fase_inicial2` | Fase_Inicial2 | texto (max 100) |  | CU |
| `cr4a1_foto_balanceamento_timestamp` |  | inteiro (64) |  | -- |
| `cr4a1_foto_balanceamento_url` |  | texto (max 200) |  | -- |
| `cr4a1_foto_balanceamentoid` |  | GUID |  | -- |
| `cr4a1_gmm_final1` | gmm_Final1 | texto (max 100) |  | CU |
| `cr4a1_gmm_final2` | gmm_Final2 | texto (max 100) |  | CU |
| `cr4a1_gmm_ideal1` | gmm_Ideal1 | texto (max 100) |  | CU |
| `cr4a1_gmm_ideal2` | gmm_Ideal2 | texto (max 100) |  | CU |
| `cr4a1_gmm_inicial1` | gmm_Inicial1 | texto (max 100) |  | CU |
| `cr4a1_gmm_inicial2` | gmm_Inicial2 | texto (max 100) |  | CU |
| `cr4a1_gramas_final1` | Gramas_Final1 | texto (max 100) |  | CU |
| `cr4a1_gramas_final2` | Gramas_Final2 | texto (max 100) |  | CU |
| `cr4a1_gramas_ideal1` | Gramas_Ideal1 | texto (max 100) |  | CU |
| `cr4a1_gramas_ideal2` | Gramas_Ideal2 | texto (max 100) |  | CU |
| `cr4a1_gramas_inicial1` | Gramas_Inicial1 | texto (max 100) |  | CU |
| `cr4a1_gramas_inicial2` | Gramas_Inicial2 | texto (max 100) |  | CU |
| `cr4a1_isog_final1` | ISOG_Final1 | texto (max 100) |  | CU |
| `cr4a1_isog_final2` | ISOG_Final2 | texto (max 100) |  | CU |
| `cr4a1_isog_ideal1` | ISOG_Ideal1 | texto (max 100) |  | CU |
| `cr4a1_isog_ideal2` | ISOG_Ideal2 | texto (max 100) |  | CU |
| `cr4a1_isog_inicial1` | ISOG_Inicial1 | texto (max 100) |  | CU |
| `cr4a1_isog_inicial2` | ISOG_Inicial2 | texto (max 100) |  | CU |
| `cr4a1_miligramas` | Miligramas | texto (max 100) |  | CU |
| `cr4a1_os` | OS | texto (max 850) | sim | CU |
| `cr4a1_peso_rotor` | Peso_Rotor | texto (max 100) |  | CU |
| `cr4a1_planousado` | PlanoUsado | texto (max 100) |  | CU |
| `cr4a1_raio1` | Raio1 | texto (max 100) |  | CU |
| `cr4a1_raio2` | Raio2 | texto (max 100) |  | CU |
| `cr4a1_residualplano` | ResidualPlano | texto (max 100) |  | CU |
| `cr4a1_residualrotorkg` | ResidualRotorKg | texto (max 100) |  | CU |
| `cr4a1_rpmbalanceamento` | RPMBalanceamento | texto (max 100) |  | CU |
| `cr4a1_rpmtrabalho` | RPMTrabalho | texto (max 100) |  | CU |
| `cr4a1_umplano` | UmPlano | texto (max 100) |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1

- `cr4a1_foto_balanceamentoid` → **imagedescriptor**
- `cr4a1_arquivo_balanceamento` → **fileattachment**


<a id="dv-cr4a1_base_medro"></a>
## Base_Medro

| | |
|---|---|
| Nome lógico | `cr4a1_base_medro` |
| EntitySet (Web API) | `cr4a1_base_medros` |
| Chave primária | `cr4a1_base_medroid` |
| Campo nome primário | `cr4a1_os` |
| Descrição | Data originated from https://aplicativokm.sharepoint.com/sites/KairosMotores/Lists/OS 4565k/AllItems.aspx |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_autorizador_reprov` | Autorizador_reprov | texto (max 100) |  | CU |
| `cr4a1_base_medroid` | Base_Medro | GUID | sistema | C- |
| `cr4a1_check_aprov` | Check_aprov | escolha |  | CU |
| `cr4a1_cliente` | Cliente | texto (max 300) | sim | CU |
| `cr4a1_col` | COL | texto (max 100) |  | CU |
| `cr4a1_cx_selec` | Cx_selec | virtual | recomendado | CU |
| `cr4a1_cx_selec_outros` | Cx_selec_outros | texto (max 100) |  | CU |
| `cr4a1_data_final` | Data_final | data/hora |  | CU |
| `cr4a1_data_inicial` | Data_inicial | data/hora | sim | CU |
| `cr4a1_erro_preenchimento_medro` | Erro_Preenchimento_Medro | escolha |  | CU |
| `cr4a1_express` | Express | texto (max 100) |  | CU |
| `cr4a1_fcadastro` | fCadastro | texto (max 300) |  | CU |
| `cr4a1_matricula` | Matricula | texto (max 300) |  | CU |
| `cr4a1_obs_check` | Obs_Check | texto (max 4000) |  | CU |
| `cr4a1_observacao` | Observacao | texto longo (max 900) |  | CU |
| `cr4a1_os` | OS | texto (max 850) |  | CU |
| `cr4a1_os_comp` | OS_Comp | texto (max 100) |  | CU |
| `cr4a1_parecerliderreprov` | ParecerLiderReprov | texto (max 4000) |  | CU |
| `cr4a1_responsavel` | Responsavel | texto (max 300) |  | CU |
| `cr4a1_setor` | Setor | texto (max 300) |  | CU |
| `cr4a1_status_montagem` | Status_Montagem | texto (max 100) |  | CU |
| `cr4a1_status_reprov` | Status_Reprov | texto (max 100) |  | CU |
| `cr4a1_tipodepintura` | Tipo de Pintura | escolha |  | CU |
| `cr4a1_unidade` | Unidade | texto (max 300) |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `msft_datastate` | msft_DataState | escolha |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`cr4a1_check_aprov`** (Check_aprov): 0=Aprovado; 1=Reprovado; 1000=-
- **`cr4a1_cx_selec`** (Cx_selec): 0=Motor; 1=Carcaça; 2=Eixo; 3=Rotor; 4=Cx de ligação; 5=Tpa traseira; 6=Tpa Dianteira; 7=Tpa Defletora; 8=Olhal; 9=Estator; 10=Cx de acessórios; 11=Suporte da Cx de ligação; 12=Ventilador; 13=Placa de Bornes; 14=Conector de Bornes; 15=Anel de fixação; 16=Base de transporte; 17=Defletor de ar; 18=Acoplamento; 19=Tubo de lubrificação; 20=Bobina de Freio; 21=Exaustor; 22=Estrutura do Exaustor; 23=Teste Motor; 24=Peritagem Inicial; 25=Loop Test; 26=Desmontagem para processo de manutenção; 27=Bobina de freio; 28=Prato; 29=Ensaio Pós-Estufa; 30=Siroco; 1000=-; 101=Teste Motor; 102=Loop Test; 103=Ensaio Pós-Estufa; 201=Rotor; 202=Ventilador; 203=Siroco; 204=Prato; 301=Estator; 302=Rotor; 303=Bobina de freio; 31=Polia
- **`cr4a1_erro_preenchimento_medro`** (Erro_Preenchimento_Medro): 0=Sim
- **`cr4a1_tipodepintura`** (Tipo de Pintura): 0=Pintura inicial; 1=Pintura Final; 1000=-
- **`msft_datastate`** (msft_DataState): 0=Default; 1=Retain
- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1



<a id="dv-cr4a1_caldeiraria_controle"></a>
## Caldeiraria_Controle

| | |
|---|---|
| Nome lógico | `cr4a1_caldeiraria_controle` |
| EntitySet (Web API) | `cr4a1_caldeiraria_controles` |
| Chave primária | `cr4a1_caldeiraria_controleid` |
| Campo nome primário | `cr4a1_pecas` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_caldeiraria_controleid` | Caldeiraria_Controle | GUID | sistema | C- |
| `cr4a1_comentario` | Comentario | texto (max 4000) |  | CU |
| `cr4a1_concluidopor` | ConcluidoPor | texto (max 100) |  | CU |
| `cr4a1_dataconclusao` | DataConclusao | data/hora |  | CU |
| `cr4a1_dataenvio` | DataEnvio | data/hora |  | CU |
| `cr4a1_datamodificacao` | DataModificacao | data/hora |  | CU |
| `cr4a1_dataprazo` | DataPrazo | calculado |  | -- |
| `cr4a1_evidencia_timestamp` |  | inteiro (64) |  | -- |
| `cr4a1_evidencia_url` |  | texto (max 200) |  | -- |
| `cr4a1_evidenciaid` |  | GUID |  | -- |
| `cr4a1_imagemreferencia_timestamp` |  | inteiro (64) |  | -- |
| `cr4a1_imagemreferencia_url` |  | texto (max 200) |  | -- |
| `cr4a1_imagemreferenciaid` |  | GUID |  | -- |
| `cr4a1_inseridopor` | InseridoPor | texto (max 100) |  | CU |
| `cr4a1_os` | OS | texto (max 100) |  | CU |
| `cr4a1_pecas` | Pecas | texto (max 100) | sim | CU |
| `cr4a1_prazo` | Prazo | inteiro |  | CU |
| `cr4a1_regime` | Regime | texto (max 100) |  | CU |
| `cr4a1_servicos` | Serviços | texto (max 4000) |  | CU |
| `cr4a1_status` | xStatus | texto (max 100) |  | CU |
| `cr4a1_unidade` | Unidade | texto (max 100) |  | CU |
| `cr4a1_xxstatus` | xxStatus | texto (max 100) |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1

- `cr4a1_evidenciaid` → **imagedescriptor**
- `cr4a1_imagemreferenciaid` → **imagedescriptor**


<a id="dv-cr4a1_caldeiraria_lista"></a>
## Caldeiraria_Lista

| | |
|---|---|
| Nome lógico | `cr4a1_caldeiraria_lista` |
| EntitySet (Web API) | `cr4a1_caldeiraria_listas` |
| Chave primária | `cr4a1_caldeiraria_listaid` |
| Campo nome primário | `cr4a1_pecas` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_caldeiraria_listaid` | Caldeiraria_Lista | GUID | sistema | C- |
| `cr4a1_pecas` | Peças | texto (max 100) | sim | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1



<a id="dv-cr4a1_cipa_2026"></a>
## CIPA_2026

| | |
|---|---|
| Nome lógico | `cr4a1_cipa_2026` |
| EntitySet (Web API) | `cr4a1_cipa_2026s` |
| Chave primária | `cr4a1_cipa_2026id` |
| Campo nome primário | `cr4a1_usuario` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_cipa_2026id` | CIPA_2026 | GUID | sistema | C- |
| `cr4a1_filial` | Filial | texto (max 100) |  | CU |
| `cr4a1_senha` | Senha | texto (max 100) |  | CU |
| `cr4a1_usuario` | Usuario | texto (max 850) | sim | CU |
| `cr4a1_voto` | Voto | texto (max 100) |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1



<a id="dv-cr4a1_cipa_vot"></a>
## CIPA_Vot

| | |
|---|---|
| Nome lógico | `cr4a1_cipa_vot` |
| EntitySet (Web API) | `cr4a1_cipa_vots` |
| Chave primária | `cr4a1_cipa_votid` |
| Campo nome primário | `cr4a1_nome` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_candidato` | Candidato | texto (max 100) |  | CU |
| `cr4a1_cipa_votid` | CIPA_Vot | GUID | sistema | C- |
| `cr4a1_nome` | Nome | texto (max 850) | sim | CU |
| `cr4a1_senha` | senha | texto (max 100) |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1



<a id="dv-cr4a1_ck_farol"></a>
## CK_Farol

| | |
|---|---|
| Nome lógico | `cr4a1_ck_farol` |
| EntitySet (Web API) | `cr4a1_ck_farols` |
| Chave primária | `cr4a1_ck_farolid` |
| Campo nome primário | `cr4a1_os` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_alteradopor` | AlteradoPor | texto (max 100) |  | CU |
| `cr4a1_carcaca` | Carcaça | texto (max 100) |  | CU |
| `cr4a1_ck_farolid` | CK_Farol | GUID | sistema | C- |
| `cr4a1_contribuinte` | Contribuinte | texto (max 100) |  | CU |
| `cr4a1_dataalteracao` | DataAlteracao | data/hora |  | CU |
| `cr4a1_dataautorizacao` | DataAutorizacao | data/hora |  | CU |
| `cr4a1_dataconclusaomanutencao` | DataConclusãoManutencao | texto (max 100) |  | CU |
| `cr4a1_dataentrega` | DataEntrega | data/hora |  | CU |
| `cr4a1_dataenvionf` | DataEnvioNF | data/hora |  | CU |
| `cr4a1_dataenvioproposta` | DataEnvioProposta | data/hora |  | CU |
| `cr4a1_dataprevfaturamento` | DataPrevFaturamento | data/hora |  | CU |
| `cr4a1_dataprevientrega` | DatapreviEntrega | data/hora |  | CU |
| `cr4a1_datarecebiment` | DataRecebiment | data/hora |  | CU |
| `cr4a1_equipamento` | Equipamento | texto (max 100) |  | CU |
| `cr4a1_fabricante` | Fabricante | texto (max 100) |  | CU |
| `cr4a1_fc` | FC | texto (max 100) |  | CU |
| `cr4a1_grauprioridade` | GrauPrioridade | texto (max 100) |  | CU |
| `cr4a1_idcliente` | IDcliente | texto (max 100) |  | CU |
| `cr4a1_km_final` | KM_Final | texto (max 100) |  | CU |
| `cr4a1_km_inicial` | KM_Inicial | texto (max 100) |  | CU |
| `cr4a1_laudofinal` | LaudoFinal | texto (max 100) |  | CU |
| `cr4a1_laudoinicial` | LaudoInicial | texto (max 100) |  | CU |
| `cr4a1_metodoenviofatura` | MetodoEnvioFatura | texto (max 100) |  | CU |
| `cr4a1_morada` | Morada | texto (max 400) |  | CU |
| `cr4a1_n_gt` | N_GT_Envio | texto (max 100) |  | CU |
| `cr4a1_n_gt_recebimentp` | N_GT_Recebimento | texto (max 100) |  | CU |
| `cr4a1_nffatura` | NFFatura | texto (max 100) |  | CU |
| `cr4a1_nne` | NNE | texto (max 100) |  | CU |
| `cr4a1_nomecliente` | NomeCliente | texto (max 100) |  | CU |
| `cr4a1_nomecontato` | NomeContato | texto (max 100) |  | CU |
| `cr4a1_nproposta` | NProposta | texto (max 100) |  | CU |
| `cr4a1_nserie` | NSerie | texto (max 100) |  | CU |
| `cr4a1_observacao` | Observacao | texto (max 4000) |  | CU |
| `cr4a1_os` | OS | texto (max 850) | sim | CU |
| `cr4a1_polaridade` | Polaridade | texto (max 100) |  | CU |
| `cr4a1_potenciacv` | PotenciaCV | texto (max 100) |  | CU |
| `cr4a1_potenciakw` | PotenciakW | texto (max 100) |  | CU |
| `cr4a1_prazo` | Prazo | texto (max 100) |  | CU |
| `cr4a1_prevfaturamento` | PrevFaturamento | texto (max 100) |  | CU |
| `cr4a1_recebidopor` | RecebidoPor | texto (max 100) |  | CU |
| `cr4a1_respentrega` | RespEntrega | texto (max 100) |  | CU |
| `cr4a1_rpm` | RPM | texto (max 100) |  | CU |
| `cr4a1_statuscomercial` | StatusComercial | texto (max 100) |  | CU |
| `cr4a1_tagcliente` | TAGCliente | texto (max 100) |  | CU |
| `cr4a1_tagkairos` | TAGKairos | texto (max 100) |  | CU |
| `cr4a1_telefone` | Telefone | texto (max 100) |  | CU |
| `cr4a1_tensao` | Tensao | texto (max 100) |  | CU |
| `cr4a1_tiposervico` | TipoServico | texto (max 100) |  | CU |
| `cr4a1_userinclusao` | UserInclusao | texto (max 100) |  | CU |
| `cr4a1_valorc_iva` | ValorC_IVA | texto (max 100) |  | CU |
| `cr4a1_valorcomiva` | ValorComIVA | decimal |  | CU |
| `cr4a1_valorsemiva` | ValorSemIVA | decimal |  | CU |
| `cr4a1_valorsiva` | ValorsIVA | texto (max 100) |  | CU |
| `cr4a1_veiculo` | Veiculo | texto (max 100) |  | CU |
| `cr4a1_xstatus` | xStatus | texto (max 100) |  | CU |
| `cr4a1_xstatusresponsavel` | xStatusResponsavel | texto (max 100) |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1



<a id="dv-principalobjectattributeaccess"></a>
## Compartilhamento de Campo

| | |
|---|---|
| Nome lógico | `principalobjectattributeaccess` |
| EntitySet (Web API) | `principalobjectattributeaccessset` |
| Chave primária | `principalobjectattributeaccessid` |
| Campo nome primário | `None` |
| Descrição | Define direitos de acesso de entidades de segurança de CRM (usuários e equipes) para uma instância de entidade. |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `attributeid` | Campo protegido | GUID | sistema | C- |
| `msft_datastate` | msft_DataState | escolha |  | -- |
| `objectid` | Instância de entidade | referência (lookup) → account, activityfileattachment, adx_ad, adx_adplacement, adx_alertsubscription, adx_botconsumer, adx_bpf_c2857b638fa7473d8e2f112c232cebd8, adx_cloudflowconsumer, adx_columnpermission, adx_columnpermissionprofile, adx_contentsnippet, adx_entityform, adx_entityformmetadata, adx_entitylist, adx_entitypermission, adx_externalidentity, adx_invitation, adx_inviteredemption, adx_pagealert, adx_pagenotification, adx_pagetag, adx_pagetemplate, adx_poll, adx_polloption, adx_pollplacement, adx_pollsubmission, adx_portalcomment, adx_portallanguage, adx_publishingstate, adx_publishingstatetransitionrule, adx_redirect, adx_setting, adx_shortcut, adx_sitemarker, adx_sitemigrationchunk, adx_sitemigrationrun, adx_sitesetting, adx_tag, adx_urlhistory, adx_webfile, adx_webfilelog, adx_webform, adx_webformmetadata, adx_webformsession, adx_webformstep, adx_weblink, adx_weblinkset, adx_webnotificationentity, adx_webnotificationurl, adx_webpage, adx_webpageaccesscontrolrule, adx_webpagehistory, adx_webpagelog, adx_webrole, adx_website, adx_websiteaccess, adx_websitebinding, adx_websitelanguage, adx_websitemigrationtracker, adx_webtemplate, agentconversationmessage, agentconversationmessagefile, agentfeeditem, agenthubgoal, agenthubinsight, agenthubmetric, agentrule, aicopilot, aiinsightcard, aiplugin, aipluginauth, aipluginconversationstarter, aipluginconversationstartermapping, aipluginexternalschema, aipluginexternalschemaproperty, aiplugingovernance, aiplugingovernanceext, aiplugininstance, aipluginoperation, aipluginoperationparameter, aipluginoperationresponsetemplate, aiplugintitle, aipluginusersetting, aiskillconfig, allowedmcpclient, anyprivilegeentity, appaction, appactionmigration, appactionrule, appelement, appentitysearchview, application, applicationuser, appmodulecomponentedge, appmodulecomponentnode, appointment, approvalprocess, approvalstageapproval, approvalstagecondition, approvalstageintelligent, approvalstageorder, appsetting, appusersetting, archivecleanupinfo, archivecleanupoperation, athenareconciliationinfo, attributeclusterconfig, attributeimageconfig, attributemaskingrule, attributepicklistvalue, bot, botcomponent, botcomponentcollection, botcontentpack, bulkarchiveconfig, bulkarchivefailuredetail, bulkarchiveoperation, bulkarchiveoperationdetail, businessprocess, businessprocesslinkedartifact, businessunit, canvasappextendedmetadata, card, cascadegrantrevokeaccessrecordstracker, cascadegrantrevokeaccessversiontracker, catalog, catalogassignment, certificatecredential, channelaccessprofile, chat, comment, computeruseagent, connection, connectioninstance, connectionreference, connector, contact, conversationtranscript, copilotexamplequestion, copilotglossaryterm, copilotsynonyms, cr4a1_a2_checklist, cr4a1_a2_credenciais, cr4a1_a2_equipamentos, cr4a1_a2_planer, cr4a1_a2_produtos, cr4a1_agenda_kairos, cr4a1_atividadesespecificas, cr4a1_ausencias, cr4a1_balanceamento, cr4a1_base_medro, cr4a1_bd_arquivo, cr4a1_caldeiraria_controle, cr4a1_caldeiraria_lista, cr4a1_calendarios_workspaces, cr4a1_capacitacao_basetreinamentos, cr4a1_capacitacao_treinamentos, cr4a1_chamados, cr4a1_chamadoti, cr4a1_cipa_2026, cr4a1_cipa_vot, cr4a1_ck_farol, cr4a1_clientesfarol, cr4a1_clientes_relatorios_acesso, cr4a1_contagemdeacessos, cr4a1_controleferramentas, cr4a1_controle_man_veicul, cr4a1_controle_veiculo, cr4a1_conversa_crm, cr4a1_credenciais, cr4a1_credenciais_sra, cr4a1_dest_kanri, cr4a1_docspessoais, cr4a1_documentos, cr4a1_documentosrh, cr4a1_dvse1, cr4a1_dv_zb6010, cr4a1_echoe_auditoriamargens, cr4a1_echoe_contatos, cr4a1_echoe_contatos_mov, cr4a1_echoe_contratos_clientes, cr4a1_echoe_contratos_processos, cr4a1_echoe_follow_up, cr4a1_echoe_logs, cr4a1_echoe_movimentacoes, cr4a1_echoe_organizacoes, cr4a1_echoe_pedidocompra, cr4a1_echoe_processos_steps, cr4a1_echoe_tarefas, cr4a1_echoe_visitas, cr4a1_ensaio_temporizado, cr4a1_escola, cr4a1_esquema_de_bobinagem, cr4a1_farol, cr4a1_hb_contas_a_receber, cr4a1_hb_ctaorcam, cr4a1_hb_fornecedores, cr4a1_hb_grupo_produtos, cr4a1_hb_itens_movimentacoes, cr4a1_hb_movimentacoes_cabecalho, cr4a1_hb_natureza, cr4a1_hb_produtos, cr4a1_hb_recursos_humanos, cr4a1_hb_recursos_humanos_cabecalho, cr4a1_hb_saldo_estoque, cr4a1_hb_venda_direta, cr4a1_historico_gerador_relatorios, cr4a1_hub_contasapagar, cr4a1_ibe_atendimento, cr4a1_ibe_credenciais, cr4a1_ibe_massoterapia, cr4a1_justificativaponto, cr4a1_kpi_funcionarios, cr4a1_laudos, cr4a1_l_movimentacoes, cr4a1_l_produto, cr4a1_mensagens_crm, cr4a1_modelos_relatorios, cr4a1_moloni_artigos, cr4a1_moloni_propostas, cr4a1_pd_b1_peritagens, cr4a1_pd_b2_clientes, cr4a1_pd_b3_cabecalho, cr4a1_pd_b4_linhaspadroes, cr4a1_pd_b5_base, cr4a1_pd_b6_anexos, cr4a1_peritagem_final, cr4a1_prod_avaliacao_final_opc, cr4a1_prod_avaliacao_temporizado, cr4a1_prod_inspecao, cr4a1_prod_liberarensaio, cr4a1_rdsmanagement, cr4a1_reembolsos_viagens, cr4a1_relatorio_fotografico, cr4a1_relatorio_usuarios, cr4a1_requisicao, cr4a1_rotas, cr4a1_safe_acidentes, cr4a1_sd01, cr4a1_se01_crm, cr4a1_servicosterceirizados, cr4a1_servicosterceirizados_for, cr4a1_sgq_documentos, cr4a1_ssma_informemensal, cr4a1_tabaprendendo, cr4a1_tarefa_atribuicao, cr4a1_tarefa_base, cr4a1_testes_py_3, cr4a1_tipos_eventos, cr4a1_trajetos, cr4a1_usuarios_agenda, cr4a1_usuarios_app, cr4a1_word_testes, cr4a1_zb6_relatorio, credential, customapi, customapirequestparameter, customapiresponseproperty, customeraddress, datalakefolder, datalakefolderpermission, datalakeworkspace, datalakeworkspacepermission, dataprocessingconfiguration, delegatedauthorization, deleteditemreference, deploymentorchestration, desktopflowbinary, desktopflowmodule, dvfilesearch, dvfilesearchattribute, dvfilesearchentity, dvtablesearch, dvtablesearchattribute, dvtablesearchentity, echoe_margens, email, emailaddressconfiguration, enablearchivalrequest, entityanalyticsconfig, entityclusterconfig, entityimageconfig, entityindex, entityrecordfilter, environmentvariabledefinition, environmentvariablevalue, exportedexcel, exportsolutionupload, fabricaiskill, fax, featurecontrolsetting, federatedknowledgecitation, federatedknowledgeconfiguration, federatedknowledgeentityconfiguration, federatedknowledgemetadatarefresh, feedback, flowcapacityassignment, flowcredentialapplication, flowevent, flowgroup, flowmachine, flowmachinegroup, flowmachineimage, flowmachineimageversion, flowmachinenetwork, flowsession, flowsessionbinary, flowtestsession, flowtrigger, flowtriggerinstance, fxexpression, githubappconfig, goal, governanceconfiguration, holidaywrapper, indexattributes, internalcatalogassignment, kbarticle, keyvaultreference, knowledgearticle, knowledgearticleviews, knowledgebaserecord, knowledgefaq, knowledgesourceconsumer, knowledgesourceprofile, letter, mailmergetemplate, mainfewshot, makerfewshot, managedidentity, maskingrule, mcpprompt, mcpresource, mcpresourcecontent, mcpserver, mcptool, metadataforarchival, mobileofflineprofileextension, msdynce_botcontent, msdyn_aibdataset, msdyn_aibdatasetfile, msdyn_aibdatasetrecord, msdyn_aibdatasetscontainer, msdyn_aibfeedbackloop, msdyn_aibfile, msdyn_aibfileattacheddata, msdyn_aiconfiguration, msdyn_aiconfigurationsearch, msdyn_aidataprocessingevent, msdyn_aidocumenttemplate, msdyn_aievaluationconfiguration, msdyn_aievaluationrun, msdyn_aievent, msdyn_aifptrainingdocument, msdyn_aimodel, msdyn_aimodelcatalog, msdyn_aiodimage, msdyn_aiodlabel, msdyn_aiodtrainingboundingbox, msdyn_aiodtrainingimage, msdyn_aioptimization, msdyn_aioptimizationprivatedata, msdyn_aitemplate, msdyn_aitestcase, msdyn_aitestcasedocument, msdyn_aitestcaseinput, msdyn_aitestrun, msdyn_aitestrunbatch, msdyn_analysiscomponent, msdyn_analysisjob, msdyn_analysisoverride, msdyn_analysisresult, msdyn_analysisresultdetail, msdyn_appinsightsmetadata, msdyn_bulkharvestrunlog, msdyn_copilotinteractions, msdyn_customcontrolextendedsettings, msdyn_dataflow, msdyn_dataflowconnectionreference, msdyn_dataflowrefreshhistory, msdyn_dataflowtemplate, msdyn_dataflow_datalakefolder, msdyn_dataworkspace, msdyn_dmsrequest, msdyn_dmsrequeststatus, msdyn_dmssyncrequest, msdyn_dmssyncstatus, msdyn_entitylinkchatconfiguration, msdyn_entityrefreshhistory, msdyn_evalresult, msdyn_favoriteknowledgearticle, msdyn_federatedarticle, msdyn_federatedarticleincident, msdyn_fileupload, msdyn_flow_actionapprovalmodel, msdyn_flow_approval, msdyn_flow_approvalrequest, msdyn_flow_approvalresponse, msdyn_flow_approvalstep, msdyn_flow_awaitallactionapprovalmodel, msdyn_flow_awaitallapprovalmodel, msdyn_flow_basicapprovalmodel, msdyn_flow_flowapproval, msdyn_formmapping, msdyn_function, msdyn_harvesteligibilitycondition, msdyn_harvestworkitem, msdyn_helppage, msdyn_historicalcaseharvestbatch, msdyn_historicalcaseharvestrun, msdyn_historicalcaseharvestrunlog, msdyn_insightsstorevirtualentity, msdyn_integratedsearchprovider, msdyn_interimupdateknowledgearticle, msdyn_kalanguagesetting, msdyn_kbattachment, msdyn_kmfederatedsearchconfig, msdyn_kmpersonalizationsetting, msdyn_knowledgearticlecustomentity, msdyn_knowledgearticleimage, msdyn_knowledgearticletemplate, msdyn_knowledgeassetconfiguration, msdyn_knowledgeconfiguration, msdyn_knowledgeharvestjobrecord, msdyn_knowledgeharvestplan, msdyn_knowledgeinteractioninsight, msdyn_knowledgemanagementsetting, msdyn_knowledgepersonalfilter, msdyn_knowledgesearchfilter, msdyn_knowledgesearchinsight, msdyn_mobileapp, msdyn_modulerundetail, msdyn_plan, msdyn_planartifact, msdyn_planattachment, msdyn_pmanalysishistory, msdyn_pmbusinessruleautomationconfig, msdyn_pmcalendar, msdyn_pmcalendarversion, msdyn_pminferredtask, msdyn_pmprocessextendedmetadataversion, msdyn_pmprocesstemplate, msdyn_pmprocessusersettings, msdyn_pmprocessversion, msdyn_pmrecording, msdyn_pmsimulation, msdyn_pmtab, msdyn_pmtemplate, msdyn_pmview, msdyn_powerappswrapbuild, msdyn_qna, msdyn_richtextfile, msdyn_rtestructuredtemplate, msdyn_rtestructuredtemplateconfig, msdyn_rtetemplatemapping, msdyn_salesforcestructuredobject, msdyn_salesforcestructuredqnaconfig, msdyn_schedule, msdyn_serviceconfiguration, msdyn_slakpi, msdyn_solutionhealthrule, msdyn_solutionhealthruleargument, msdyn_solutionhealthruleset, msdyn_tour, msdyn_virtualtablecolumncandidate, msdyn_workflowactionstatus, msfp_alert, msfp_alertrule, msfp_emailtemplate, msfp_fileresponse, msfp_localizedemailtemplate, msfp_project, msfp_question, msfp_questionresponse, msfp_satisfactionmetric, msfp_survey, msfp_surveyinvite, msfp_surveyreminder, msfp_surveyresponse, msfp_unsubscribedrecipient, msgraphresourcetosubscription, mspcat_catalogsubmissionfiles, mspcat_packagestore, organizationdatasyncfnostate, organizationdatasyncstate, organizationdatasyncsubscription, organizationdatasyncsubscriptionentity, organizationdatasyncsubscriptionfnotable, organizationsetting, package, packagehistory, pdfsetting, phonecall, plannerbusinessscenario, plannersyncaction, plugin, pluginpackage, position, powerbidataset, powerbidatasetapdx, powerbimashupparameter, powerbireport, powerbireportapdx, powerfxrule, powerpagecomponent, powerpagesddosalert, powerpagesite, powerpagesitelanguage, powerpagesitepublished, powerpagesmanagedidentity, powerpagesscanreport, powerpagessourcefile, privilegecheckerlog, privilegecheckerrun, privilegesremovalsetting, processorregistration, processstageparameter, provisionlanguageforuser, purviewlabelinfo, purviewlabelsynccache, queue, queueitem, reconciliationentityinfo, reconciliationentitystepinfo, reconciliationinfo, recordfilter, recurringappointmentmaster, recyclebinconfig, relationshipattribute, reportcategory, reportparameter, retaineddataexcel, retentioncleanupinfo, retentioncleanupoperation, retentionconfig, retentionfailuredetail, retentionoperation, retentionoperationdetail, retentionsuccessdetail, revokeinheritedaccessrecordstracker, roleeditorlayout, savingrule, sa_suggestedaction, sa_suggestedactioncriteria, searchattributesettings, searchcustomanalyzer, searchrelationshipsettings, sensitivitylabelattributemapping, serviceplan, serviceplanmapping, settingdefinition, sharedlinksetting, sharedobject, sharedworkspace, sharedworkspacepool, sharepointdocumentlocation, sharepointmanagedidentity, sharepointsite, sideloadedaiplugin, signalregistration, skill, skillresource, socialactivity, socialprofile, solutioncomponentattributeconfiguration, solutioncomponentbatchconfiguration, solutioncomponentconfiguration, solutioncomponentrelationshipconfiguration, stagedattribute, stagedattributelookupvalue, stagedattributepicklistvalue, stagedentity, stagedentityattribute, stagedentityrelationship, stagedentityrelationshiprelationships, stagedentityrelationshiprole, stagedmetadataasyncoperation, stagedoptionset, stagedrelationship, stagedrelationshipextracondition, stagedviewattribute, stagesolutionupload, supportusertable, synapsedatabase, synapselinkexternaltablestate, synapselinkprofile, synapselinkprofileentity, synapselinkprofileentitystate, synapselinkschedule, systemuser, systemuserauthorizationchangetracker, tag, taggedflowsession, taggedprocess, task, tdsmetadata, team, teammobileofflineprofilemembership, territory, toolinggateway, toolinggatewaymcpserver, traitregistration, unstructuredfilesearchentity, unstructuredfilesearchrecord, unstructuredfilesearchrecordstatus, usermobileofflineprofilemembership, userrating, uxagentcomponent, uxagentcomponentrevision, uxagentproject, uxagentprojectfile, viewasexamplequestion, virtualentitymetadata, workflowbinary, workflowmetadata, workqueue, workqueueitem | sistema | C- |
| `objecttypecode` | Tipo de objeto de entidade | EntityName | sistema | C- |
| `organizationid` | Organização | referência (lookup) → organization | sistema | -- |
| `organizationidname` |  | texto (max 160) | sistema | -- |
| `principalid` | Entidade | referência (lookup) → systemuser, team | sistema | C- |
| `principalidname` |  | texto (max 160) | sistema | -- |
| `principalidtype` | Tipo de entidade | EntityName | sistema | C- |
| `principalobjectattributeaccessid` | Campo protegido compartilhado | GUID | sistema | C- |
| `readaccess` | Permissão de leitura | sim/não | sistema | CU |
| `updateaccess` | Permissão de atualização | sim/não | sistema | CU |
| `versionnumber` |  | inteiro (64) |  | -- |

### Conjuntos de opções

- **`msft_datastate`** (msft_DataState): 0=Default; 1=Retain
- **`readaccess`** (Permissão de leitura): 1=Sim; 0=Não
- **`updateaccess`** (Permissão de atualização): 1=Sim; 0=Não

### Relações N:1

- `objectid` → **cr4a1_peritagem_final**
- `objectid` → **retentioncleanupoperation**
- `objectid` → **retentionconfig**
- `objectid` → **retentionfailuredetail**
- `objectid` → **msdyn_pmview**
- `objectid` → **cr4a1_kpi_funcionarios**
- `objectid` → **searchcustomanalyzer**
- `objectid` → **savingrule**
- `objectid` → **msdyn_dmsrequeststatus**
- `objectid` → **adx_webfile**
- `objectid` → **cr4a1_ibe_massoterapia**
- `objectid` → **copilotsynonyms**
- `objectid` → **searchrelationshipsettings**
- `objectid` → **msdyn_copilotinteractions**
- `objectid` → **msdyn_slakpi**
- `objectid` → **retentionoperation**
- `objectid` → **retentionoperationdetail**
- `objectid` → **flowcredentialapplication**
- `objectid` → **stagedentityrelationship**
- `objectid` → **stagedentityrelationshiprelationships**
- `objectid` → **stagedentityrelationshiprole**
- `objectid` → **tdsmetadata**
- `objectid` → **businessprocesslinkedartifact**
- `objectid` → **desktopflowmodule**
- `objectid` → **msdyn_aimodelcatalog**
- `objectid` → **stagedoptionset**
- `objectid` → **stagedrelationship**
- `objectid` → **cr4a1_echoe_organizacoes**
- `objectid` → **provisionlanguageforuser**
- `objectid` → **stagedattribute**
- `objectid` → **cr4a1_justificativaponto**
- `objectid` → **cr4a1_balanceamento**
- `objectid` → **knowledgesourceconsumer**
- `objectid` → **skill**
- `objectid` → **cr4a1_credenciais_sra**
- `objectid` → **cr4a1_laudos**
- `objectid` → **reconciliationentitystepinfo**
- `objectid` → **privilegecheckerlog**
- `objectid` → **stagedrelationshipextracondition**
- `objectid` → **stagedviewattribute**
- `objectid` → **deploymentorchestration**
- `objectid` → **powerpagesscanreport**
- `objectid` → **cr4a1_relatorio_usuarios**
- `objectid` → **cr4a1_a2_checklist**
- `objectid` → **knowledgesourceprofile**
- `objectid` → **msdyn_aibdataset**
- `objectid` → **msdyn_aibdatasetfile**
- `objectid` → **msdyn_aibdatasetrecord**
- `objectid` → **msdyn_aibdatasetscontainer**
- `objectid` → **msdyn_aibfile**
- `objectid` → **msdyn_dataflowconnectionreference**
- `objectid` → **cr4a1_clientes_relatorios_acesso**
- `objectid` → **powerfxrule**
- `objectid` → **cr4a1_hb_venda_direta**
- `objectid` → **privilegecheckerrun**
- `objectid` → **plugin**
- `objectid` → **adx_contentsnippet**
- `objectid` → **synapselinkexternaltablestate**
- `objectid` → **synapselinkprofile**
- `objectid` → **agentrule**
- `objectid` → **cascadegrantrevokeaccessrecordstracker**
- `objectid` → **cascadegrantrevokeaccessversiontracker**
- `objectid` → **cr4a1_modelos_relatorios**
- `objectid` → **cr4a1_word_testes**
- `objectid` → **cr4a1_hb_natureza**
- `objectid` → **connectioninstance**
- `objectid` → **cr4a1_echoe_contatos_mov**
- `objectid` → **entityclusterconfig**
- `objectid` → **msdyn_aibfileattacheddata**
- `objectid` → **msdyn_kalanguagesetting**
- `objectid` → **msdyn_kbattachment**
- `objectid` → **msdyn_kmpersonalizationsetting**
- `objectid` → **msdyn_knowledgearticletemplate**
- `objectid` → **flowtestsession**
- `objectid` → **cr4a1_capacitacao_basetreinamentos**
- `objectid` → **federatedknowledgeconfiguration**
- `objectid` → **cr4a1_echoe_contratos_clientes**
- `objectid` → **synapselinkprofileentity**
- `objectid` → **synapselinkprofileentitystate**
- `objectid` → **msdyn_aidocumenttemplate**
- `objectid` → **viewasexamplequestion**
- `objectid` → **agentfeeditem**
- `objectid` → **credential**
- `objectid` → **msdyn_entitylinkchatconfiguration**
- `objectid` → **packagehistory**
- `objectid` → **adx_portalcomment**
- `objectid` → **mspcat_catalogsubmissionfiles**
- `objectid` → **mspcat_packagestore**
- `objectid` → **flowtrigger**
- `objectid` → **flowtriggerinstance**
- `objectid` → **msdyn_knowledgepersonalfilter**
- `objectid` → **msdyn_knowledgesearchfilter**
- `objectid` → **supportusertable**
- `objectid` → **uxagentproject**
- `objectid` → **uxagentprojectfile**
- `objectid` → **dvfilesearch**
- `objectid` → **synapselinkschedule**
- `objectid` → **msdyn_pmbusinessruleautomationconfig**
- `objectid` → **cr4a1_ssma_informemensal**
- `objectid` → **deleteditemreference**
- `objectid` → **recyclebinconfig**
- `objectid` → **retaineddataexcel**
- `principalid` → **team**
- `objectid` → **dvfilesearchattribute**
- `objectid` → **dvfilesearchentity**
- `objectid` → **certificatecredential**
- `objectid` → **queue**
- `objectid` → **flowgroup**
- `objectid` → **msdyn_virtualtablecolumncandidate**
- `objectid` → **cr4a1_calendarios_workspaces**
- `objectid` → **attributepicklistvalue**
- `objectid` → **echoe_margens**
- `objectid` → **cr4a1_documentos**
- `objectid` → **knowledgearticle**
- `objectid` → **aiskillconfig**
- `objectid` → **dvtablesearch**
- `objectid` → **dvtablesearchattribute**
- `objectid` → **federatedknowledgeentityconfiguration**
- `objectid` → **aiplugingovernance**
- `objectid` → **msdyn_bulkharvestrunlog**
- `objectid` → **agenthubgoal**
- `objectid` → **organizationdatasyncsubscription**
- `objectid` → **organizationdatasyncsubscriptionentity**
- `objectid` → **msdyn_richtextfile**
- `objectid` → **position**
- `objectid` → **customeraddress**
- `objectid` → **sharedworkspacepool**
- `objectid` → **cr4a1_tipos_eventos**
- `objectid` → **cr4a1_hb_itens_movimentacoes**
- `objectid` → **mailmergetemplate**
- `objectid` → **aiplugingovernanceext**
- `objectid` → **dvtablesearchentity**
- `organizationid` → **organization**
- `objectid` → **territory**
- `objectid` → **agenthubinsight**
- `objectid` → **botcontentpack**
- `objectid` → **keyvaultreference**
- `objectid` → **managedidentity**
- `objectid` → **cr4a1_chamadoti**
- `objectid` → **contact**
- `objectid` → **cr4a1_tarefa_base**
- `objectid` → **mcpprompt**
- `objectid` → **retentionsuccessdetail**
- `objectid` → **msdyn_harvestworkitem**
- `objectid` → **agenthubmetric**
- `objectid` → **adx_sitemarker**
- `objectid` → **cr4a1_echoe_contatos**
- `objectid` → **msdyn_plan**
- `objectid` → **msdyn_aidataprocessingevent**
- `objectid` → **cr4a1_echoe_processos_steps**
- `objectid` → **cr4a1_echoe_auditoriamargens**
- `objectid` → **sharedobject**
- `objectid` → **sharedworkspace**
- `objectid` → **account**
- `objectid` → **mcpresource**
- `objectid` → **adx_botconsumer**
- `objectid` → **msdyn_harvesteligibilitycondition**
- `objectid` → **msdyn_planartifact**
- `objectid` → **cr4a1_caldeiraria_controle**
- `objectid` → **cr4a1_ausencias**
- `objectid` → **mcpresourcecontent**
- `objectid` → **canvasappextendedmetadata**
- `objectid` → **purviewlabelinfo**
- `objectid` → **msdyn_dataworkspace**
- `objectid` → **msdyn_planattachment**
- `objectid` → **cr4a1_agenda_kairos**
- `objectid` → **cr4a1_moloni_propostas**
- `objectid` → **msdyn_analysisoverride**
- `objectid` → **cr4a1_pd_b3_cabecalho**
- `objectid` → **virtualentitymetadata**
- `objectid` → **adx_ad**
- `objectid` → **adx_adplacement**
- `objectid` → **purviewlabelsynccache**
- `objectid` → **adx_webnotificationentity**
- `objectid` → **fabricaiskill**
- `objectid` → **knowledgefaq**
- `objectid` → **unstructuredfilesearchentity**
- `objectid` → **msdyn_formmapping**
- `objectid` → **socialprofile**
- `objectid` → **msdyn_aiconfiguration**
- `objectid` → **msdyn_aimodel**
- `objectid` → **msdyn_aitemplate**
- `objectid` → **stagedmetadataasyncoperation**
- `objectid` → **stagedentity**
- `objectid` → **organizationdatasyncstate**
- `objectid` → **msdyn_workflowactionstatus**
- `objectid` → **sensitivitylabelattributemapping**
- `objectid` → **msdyn_interimupdateknowledgearticle**
- `objectid` → **adx_alertsubscription**
- `objectid` → **adx_columnpermission**
- `objectid` → **phonecall**
- `objectid` → **flowmachine**
- `objectid` → **flowmachinegroup**
- `objectid` → **unstructuredfilesearchrecord**
- `objectid` → **cr4a1_dv_zb6010**
- `objectid` → **sharepointsite**
- `objectid` → **governanceconfiguration**
- `objectid` → **processorregistration**
- `objectid` → **adx_weblink**
- `objectid` → **cr4a1_controle_veiculo**
- `objectid` → **cr4a1_contagemdeacessos**
- `objectid` → **cr4a1_hub_contasapagar**
- `objectid` → **msdyn_pmprocesstemplate**
- `objectid` → **adx_columnpermissionprofile**
- `objectid` → **adx_entitypermission**
- `objectid` → **adx_invitation**
- `objectid` → **adx_inviteredemption**
- `objectid` → **msdyn_historicalcaseharvestbatch**
- `objectid` → **msdyn_knowledgeassetconfiguration**
- `objectid` → **cr4a1_usuarios_agenda**
- `objectid` → **flowmachineimage**
- `objectid` → **flowmachineimageversion**
- `objectid` → **federatedknowledgemetadatarefresh**
- `objectid` → **workqueue**
- `objectid` → **cr4a1_echoe_visitas**
- `objectid` → **cr4a1_zb6_relatorio**
- `objectid` → **signalregistration**
- `objectid` → **traitregistration**
- `objectid` → **msdyn_fileupload**
- `objectid` → **msdyn_historicalcaseharvestrunlog**
- `objectid` → **cr4a1_pd_b6_anexos**
- `objectid` → **cr4a1_dest_kanri**
- `objectid` → **msdyn_salesforcestructuredobject**
- `objectid` → **userrating**
- `objectid` → **processstageparameter**
- `objectid` → **flowsession**
- `objectid` → **adx_pagealert**
- `objectid` → **adx_pagenotification**
- `objectid` → **adx_pagetag**
- `objectid` → **adx_poll**
- `objectid` → **adx_polloption**
- `objectid` → **workqueueitem**
- `objectid` → **msdyn_rtestructuredtemplateconfig**
- `objectid` → **cr4a1_clientesfarol**
- `objectid` → **socialactivity**
- `objectid` → **msdyn_dataflow**
- `objectid` → **msdyn_dataflowrefreshhistory**
- `objectid` → **skillresource**
- `objectid` → **cr4a1_docspessoais**
- `objectid` → **mobileofflineprofileextension**
- `objectid` → **msdyn_knowledgeharvestplan**
- `objectid` → **msdyn_historicalcaseharvestrun**
- `objectid` → **msdyn_knowledgeharvestjobrecord**
- `objectid` → **msdyn_salesforcestructuredqnaconfig**
- `objectid` → **cr4a1_chamados**
- `objectid` → **msgraphresourcetosubscription**
- `objectid` → **workflowbinary**
- `objectid` → **sa_suggestedaction**
- `objectid` → **appointment**
- `objectid` → **adx_pollplacement**
- `objectid` → **adx_pollsubmission**
- `objectid` → **adx_portallanguage**
- `objectid` → **adx_publishingstate**
- `objectid` → **adx_publishingstatetransitionrule**
- `objectid` → **msdyn_entityrefreshhistory**
- `objectid` → **desktopflowbinary**
- `objectid` → **cr4a1_moloni_artigos**
- `objectid` → **msdyn_integratedsearchprovider**
- `objectid` → **anyprivilegeentity**
- `objectid` → **cr4a1_tarefa_atribuicao**
- `objectid` → **aipluginauth**
- `objectid` → **msdyn_aievent**
- `objectid` → **sa_suggestedactioncriteria**
- `objectid` → **emailaddressconfiguration**
- `objectid` → **cr4a1_a2_produtos**
- `objectid` → **adx_redirect**
- `objectid` → **adx_setting**
- `objectid` → **adx_shortcut**
- `objectid` → **adx_tag**
- `objectid` → **adx_urlhistory**
- `objectid` → **cr4a1_requisicao**
- `objectid` → **organizationdatasyncsubscriptionfnotable**
- `objectid` → **cr4a1_dvse1**
- `objectid` → **msdyn_pmanalysishistory**
- `objectid` → **package**
- `objectid` → **reportcategory**
- `objectid` → **msdyn_flow_actionapprovalmodel**
- `objectid` → **adx_webfilelog**
- `objectid` → **adx_webpageaccesscontrolrule**
- `objectid` → **adx_webpagehistory**
- `objectid` → **revokeinheritedaccessrecordstracker**
- `objectid` → **entityanalyticsconfig**
- `objectid` → **adx_bpf_c2857b638fa7473d8e2f112c232cebd8**
- `objectid` → **adx_externalidentity**
- `objectid` → **cr4a1_ibe_credenciais**
- `objectid` → **msdyn_pminferredtask**
- `objectid` → **msdyn_pmprocessusersettings**
- `objectid` → **msdyn_flow_approval**
- `objectid` → **msdyn_flow_approvalrequest**
- `objectid` → **team**
- `objectid` → **workflowmetadata**
- `objectid` → **adx_webpagelog**
- `objectid` → **adx_websiteaccess**
- `objectid` → **adx_websitebinding**
- `objectid` → **adx_websitelanguage**
- `objectid` → **adx_webtemplate**
- `objectid` → **tag**
- `objectid` → **pdfsetting**
- `objectid` → **cr4a1_trajetos**
- `objectid` → **cr4a1_hb_grupo_produtos**
- `objectid` → **msdyn_knowledgearticlecustomentity**
- `objectid` → **activityfileattachment**
- `objectid` → **msdyn_aievaluationconfiguration**
- `objectid` → **msdyn_aievaluationrun**
- `objectid` → **cr4a1_ibe_atendimento**
- `objectid` → **msdyn_flow_approvalresponse**
- `objectid` → **msdyn_flow_approvalstep**
- `objectid` → **msdyn_pmrecording**
- `objectid` → **msdyn_pmtemplate**
- `objectid` → **msdyn_helppage**
- `objectid` → **msdyn_tour**
- `objectid` → **agentconversationmessage**
- `objectid` → **botcomponentcollection**
- `objectid` → **taggedflowsession**
- `objectid` → **cr4a1_historico_gerador_relatorios**
- `objectid` → **adx_sitesetting**
- `objectid` → **cr4a1_sgq_documentos**
- `objectid` → **msdyn_aitestcase**
- `objectid` → **msdyn_aitestcasedocument**
- `objectid` → **exportedexcel**
- `objectid` → **cr4a1_farol**
- `objectid` → **msdyn_flow_awaitallactionapprovalmodel**
- `objectid` → **msdyn_flow_awaitallapprovalmodel**
- `objectid` → **msdyn_flow_basicapprovalmodel**
- `objectid` → **agentconversationmessagefile**
- `objectid` → **cr4a1_pd_b2_clientes**
- `objectid` → **taggedprocess**
- `objectid` → **cr4a1_echoe_tarefas**
- `objectid` → **msdyn_aitestcaseinput**
- `objectid` → **msdyn_aitestrun**
- `objectid` → **comment**
- `objectid` → **msdyn_flow_flowapproval**
- `objectid` → **chat**
- `objectid` → **catalog**
- `objectid` → **catalogassignment**
- `objectid` → **cr4a1_rotas**
- `objectid` → **serviceplan**
- `objectid` → **stagesolutionupload**
- `objectid` → **msdyn_knowledgemanagementsetting**
- `objectid` → **msfp_alert**
- `objectid` → **cr4a1_echoe_follow_up**
- `objectid` → **msdyn_rtestructuredtemplate**
- `objectid` → **cr4a1_cipa_2026**
- `objectid` → **msdyn_aitestrunbatch**
- `objectid` → **task**
- `objectid` → **adx_cloudflowconsumer**
- `objectid` → **internalcatalogassignment**
- `objectid` → **cr4a1_documentosrh**
- `objectid` → **serviceplanmapping**
- `objectid` → **federatedknowledgecitation**
- `objectid` → **cr4a1_echoe_logs**
- `objectid` → **msfp_alertrule**
- `objectid` → **msfp_emailtemplate**
- `objectid` → **cr4a1_prod_inspecao**
- `objectid` → **msdyn_rtetemplatemapping**
- `objectid` → **cr4a1_servicosterceirizados_for**
- `objectid` → **cr4a1_controleferramentas**
- `objectid` → **msdyn_qna**
- `objectid` → **powerbidataset**
- `objectid` → **cr4a1_caldeiraria_lista**
- `objectid` → **knowledgebaserecord**
- `objectid` → **businessprocess**
- `objectid` → **organizationdatasyncfnostate**
- `objectid` → **flowmachinenetwork**
- `objectid` → **datalakefolder**
- `objectid` → **entityrecordfilter**
- `objectid` → **msfp_fileresponse**
- `objectid` → **msfp_localizedemailtemplate**
- `objectid` → **msfp_project**
- `objectid` → **msfp_question**
- `objectid` → **aiplugin**
- `objectid` → **sharepointmanagedidentity**
- `objectid` → **cr4a1_atividadesespecificas**
- `objectid` → **powerbimashupparameter**
- `objectid` → **powerpagesddosalert**
- `objectid` → **recurringappointmentmaster**
- `objectid` → **recordfilter**
- `objectid` → **aipluginexternalschema**
- `objectid` → **aipluginexternalschemaproperty**
- `objectid` → **datalakefolderpermission**
- `objectid` → **msdyn_dmssyncrequest**
- `objectid` → **msfp_questionresponse**
- `objectid` → **msfp_satisfactionmetric**
- `objectid` → **msfp_survey**
- `objectid` → **msfp_surveyinvite**
- `objectid` → **cr4a1_hb_produtos**
- `objectid` → **msdyn_aiconfigurationsearch**
- `objectid` → **cr4a1_echoe_movimentacoes**
- `objectid` → **cr4a1_cipa_vot**
- `objectid` → **powerbireport**
- `objectid` → **powerbidatasetapdx**
- `objectid` → **connector**
- `objectid` → **cr4a1_usuarios_app**
- `objectid` → **exportsolutionupload**
- `objectid` → **aiplugininstance**
- `objectid` → **aipluginoperation**
- `objectid` → **aipluginoperationparameter**
- `objectid` → **datalakeworkspace**
- `objectid` → **datalakeworkspacepermission**
- `objectid` → **msfp_surveyreminder**
- `objectid` → **msfp_surveyresponse**
- `objectid` → **cr4a1_hb_saldo_estoque**
- `principalid` → **systemuser**
- `objectid` → **cr4a1_bd_arquivo**
- `objectid` → **flowevent**
- `objectid` → **mcpserver**
- `objectid` → **powerbireportapdx**
- `objectid` → **cr4a1_rdsmanagement**
- `objectid` → **cr4a1_capacitacao_treinamentos**
- `objectid` → **flowsessionbinary**
- `objectid` → **cr4a1_safe_acidentes**
- `objectid` → **adx_sitemigrationchunk**
- `objectid` → **aipluginusersetting**
- `objectid` → **msdyn_dmssyncstatus**
- `objectid` → **msdyn_modulerundetail**
- `objectid` → **sharedlinksetting**
- `objectid` → **msfp_unsubscribedrecipient**
- `objectid` → **dataprocessingconfiguration**
- `objectid` → **synapsedatabase**
- `objectid` → **cr4a1_l_movimentacoes**
- `objectid` → **adx_entityform**
- `objectid` → **adx_entityformmetadata**
- `objectid` → **cr4a1_hb_recursos_humanos_cabecalho**
- `objectid` → **msdyn_knowledgeconfiguration**
- `objectid` → **cr4a1_l_produto**
- `objectid` → **solutioncomponentattributeconfiguration**
- `objectid` → **mcptool**
- `objectid` → **cr4a1_ensaio_temporizado**
- `objectid` → **msdyn_evalresult**
- `objectid` → **adx_sitemigrationrun**
- `objectid` → **adx_websitemigrationtracker**
- `objectid` → **appaction**
- `objectid` → **appactionmigration**
- `objectid` → **cr4a1_prod_avaliacao_temporizado**
- `objectid` → **aicopilot**
- `objectid` → **adx_entitylist**
- `objectid` → **adx_webform**
- `objectid` → **adx_webformmetadata**
- `objectid` → **toolinggateway**
- `objectid` → **toolinggatewaymcpserver**
- `objectid` → **cr4a1_ck_farol**
- `objectid` → **solutioncomponentbatchconfiguration**
- `objectid` → **solutioncomponentconfiguration**
- `objectid` → **cr4a1_reembolsos_viagens**
- `objectid` → **copilotexamplequestion**
- `objectid` → **cr4a1_escola**
- `objectid` → **customapi**
- `objectid` → **customapirequestparameter**
- `objectid` → **customapiresponseproperty**
- `objectid` → **aipluginconversationstarter**
- `objectid` → **aipluginconversationstartermapping**
- `objectid` → **appactionrule**
- `objectid` → **solutioncomponentrelationshipconfiguration**
- `objectid` → **allowedmcpclient**
- `objectid` → **attributeimageconfig**
- `objectid` → **entityimageconfig**
- `objectid` → **kbarticle**
- `objectid` → **adx_webformsession**
- `objectid` → **adx_webformstep**
- `objectid` → **msdynce_botcontent**
- `objectid` → **featurecontrolsetting**
- `objectid` → **cr4a1_pd_b4_linhaspadroes**
- `objectid` → **aipluginoperationresponsetemplate**
- `objectid` → **appelement**
- `objectid` → **appmodulecomponentedge**
- `objectid` → **powerpagecomponent**
- `objectid` → **msdyn_insightsstorevirtualentity**
- `objectid` → **cr4a1_conversa_crm**
- `objectid` → **channelaccessprofile**
- `objectid` → **queueitem**
- `objectid` → **aiplugintitle**
- `objectid` → **appmodulecomponentnode**
- `objectid` → **appsetting**
- `objectid` → **appusersetting**
- `objectid` → **fax**
- `objectid` → **powerpagesite**
- `objectid` → **powerpagesitelanguage**
- `objectid` → **pluginpackage**
- `objectid` → **card**
- `objectid` → **mainfewshot**
- `objectid` → **unstructuredfilesearchrecordstatus**
- `objectid` → **teammobileofflineprofilemembership**
- `objectid` → **usermobileofflineprofilemembership**
- `objectid` → **delegatedauthorization**
- `objectid` → **cr4a1_base_medro**
- `objectid` → **powerpagesmanagedidentity**
- `objectid` → **msdyn_aioptimization**
- `objectid` → **approvalprocess**
- `objectid` → **msdyn_customcontrolextendedsettings**
- `objectid` → **sideloadedaiplugin**
- `objectid` → **organizationsetting**
- `objectid` → **settingdefinition**
- `objectid` → **businessunit**
- `objectid` → **powerpagesitepublished**
- `objectid` → **msdyn_favoriteknowledgearticle**
- `objectid` → **cr4a1_credenciais**
- `objectid` → **uxagentcomponent**
- `objectid` → **msdyn_aibfeedbackloop**
- `objectid` → **cr4a1_se01_crm**
- `objectid` → **makerfewshot**
- `objectid` → **cr4a1_hb_ctaorcam**
- `objectid` → **privilegesremovalsetting**
- `objectid` → **systemuserauthorizationchangetracker**
- `objectid` → **msdyn_pmsimulation**
- `objectid` → **cr4a1_hb_contas_a_receber**
- `objectid` → **cr4a1_prod_avaliacao_final_opc**
- `objectid` → **msdyn_aioptimizationprivatedata**
- `objectid` → **email**
- `objectid` → **adx_weblinkset**
- `objectid` → **approvalstageapproval**
- `objectid` → **attributemaskingrule**
- `objectid` → **maskingrule**
- `objectid` → **plannerbusinessscenario**
- `objectid` → **cr4a1_testes_py_3**
- `objectid` → **entityindex**
- `objectid` → **indexattributes**
- `objectid` → **adx_webnotificationurl**
- `objectid` → **adx_webpage**
- `objectid` → **adx_webrole**
- `objectid` → **approvalstagecondition**
- `objectid` → **approvalstageorder**
- `objectid` → **cr4a1_pd_b1_peritagens**
- `objectid` → **githubappconfig**
- `objectid` → **cr4a1_a2_equipamentos**
- `objectid` → **aiinsightcard**
- `objectid` → **systemuser**
- `objectid` → **uxagentcomponentrevision**
- `objectid` → **plannersyncaction**
- `objectid` → **cr4a1_hb_recursos_humanos**
- `objectid` → **conversationtranscript**
- `objectid` → **flowcapacityassignment**
- `objectid` → **attributeclusterconfig**
- `objectid` → **relationshipattribute**
- `objectid` → **cr4a1_tabaprendendo**
- `objectid` → **adx_website**
- `objectid` → **applicationuser**
- `objectid` → **environmentvariabledefinition**
- `objectid` → **environmentvariablevalue**
- `objectid` → **computeruseagent**
- `objectid` → **sharepointdocumentlocation**
- `objectid` → **cr4a1_esquema_de_bobinagem**
- `objectid` → **msdyn_dataflowtemplate**
- `objectid` → **msdyn_pmtab**
- `objectid` → **archivecleanupinfo**
- `objectid` → **adx_pagetemplate**
- `objectid` → **fxexpression**
- `objectid` → **knowledgearticleviews**
- `objectid` → **letter**
- `objectid` → **msdyn_powerappswrapbuild**
- `objectid` → **powerpagessourcefile**
- `objectid` → **cr4a1_controle_man_veicul**
- `objectid` → **msdyn_federatedarticle**
- `objectid` → **msdyn_federatedarticleincident**
- `objectid` → **msdyn_kmfederatedsearchconfig**
- `objectid` → **msdyn_knowledgearticleimage**
- `objectid` → **athenareconciliationinfo**
- `objectid` → **msdyn_schedule**
- `objectid` → **cr4a1_hb_fornecedores**
- `objectid` → **cr4a1_mensagens_crm**
- `objectid` → **msdyn_appinsightsmetadata**
- `objectid` → **archivecleanupoperation**
- `objectid` → **bulkarchiveconfig**
- `objectid` → **bulkarchivefailuredetail**
- `objectid` → **stagedentityattribute**
- `objectid` → **msdyn_pmcalendar**
- `objectid` → **msdyn_aifptrainingdocument**
- `objectid` → **msdyn_aiodimage**
- `objectid` → **msdyn_aiodlabel**
- `objectid` → **msdyn_aiodtrainingboundingbox**
- `objectid` → **msdyn_aiodtrainingimage**
- `objectid` → **cr4a1_pd_b5_base**
- `objectid` → **cr4a1_prod_liberarensaio**
- `objectid` → **holidaywrapper**
- `objectid` → **connection**
- `objectid` → **msdyn_mobileapp**
- `objectid` → **msdyn_knowledgeinteractioninsight**
- `objectid` → **msdyn_knowledgesearchinsight**
- `objectid` → **feedback**
- `objectid` → **msdyn_function**
- `objectid` → **bulkarchiveoperation**
- `objectid` → **bulkarchiveoperationdetail**
- `objectid` → **enablearchivalrequest**
- `objectid` → **msdyn_pmcalendarversion**
- `objectid` → **cr4a1_hb_movimentacoes_cabecalho**
- `objectid` → **cr4a1_a2_credenciais**
- `objectid` → **cr4a1_servicosterceirizados**
- `objectid` → **cr4a1_echoe_pedidocompra**
- `objectid` → **approvalstageintelligent**
- `objectid` → **cr4a1_relatorio_fotografico**
- `objectid` → **msdyn_analysiscomponent**
- `objectid` → **msdyn_analysisjob**
- `objectid` → **msdyn_analysisresult**
- `objectid` → **bot**
- `objectid` → **botcomponent**
- `objectid` → **goal**
- `objectid` → **reportparameter**
- `objectid` → **cr4a1_sd01**
- `objectid` → **appentitysearchview**
- `objectid` → **application**
- `objectid` → **metadataforarchival**
- `objectid` → **reconciliationentityinfo**
- `objectid` → **reconciliationinfo**
- `objectid` → **retentioncleanupinfo**
- `objectid` → **searchattributesettings**
- `objectid` → **msdyn_pmprocessextendedmetadataversion**
- `objectid` → **msdyn_pmprocessversion**
- `objectid` → **connectionreference**
- `objectid` → **cr4a1_echoe_contratos_processos**
- `objectid` → **stagedattributelookupvalue**
- `objectid` → **stagedattributepicklistvalue**
- `objectid` → **roleeditorlayout**
- `objectid` → **msdyn_dataflow_datalakefolder**
- `objectid` → **msdyn_dmsrequest**
- `objectid` → **copilotglossaryterm**
- `objectid` → **msdyn_analysisresultdetail**
- `objectid` → **msdyn_solutionhealthrule**
- `objectid` → **msdyn_solutionhealthruleargument**
- `objectid` → **msdyn_solutionhealthruleset**
- `objectid` → **cr4a1_a2_planer**
- `objectid` → **msdyn_serviceconfiguration**


<a id="dv-cr4a1_controleferramentas"></a>
## Controle Ferramentas

| | |
|---|---|
| Nome lógico | `cr4a1_controleferramentas` |
| EntitySet (Web API) | `cr4a1_controleferramentases` |
| Chave primária | `cr4a1_controleferramentasid` |
| Campo nome primário | `cr4a1_idxbase` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_concat_ver` | Concat_Ver | calculado |  | -- |
| `cr4a1_controleferramentasid` | Controle Ferramentas | GUID | sistema | C- |
| `cr4a1_data_substituicao` | Vida_util | texto (max 100) |  | CU |
| `cr4a1_data_vidautil` | Data_vidautil | texto (max 100) |  | CU |
| `cr4a1_dataver` | DataVer | texto (max 100) |  | CU |
| `cr4a1_evid_adicionais_name` |  | texto (max 200) |  | -- |
| `cr4a1_eviden_aquisi_name` |  | texto (max 200) |  | -- |
| `cr4a1_evidencia_timestamp` |  | inteiro (64) |  | -- |
| `cr4a1_evidencia_url` |  | texto (max 200) |  | -- |
| `cr4a1_evidenciaid` |  | GUID |  | -- |
| `cr4a1_fechado` | Fechado | texto (max 100) |  | CU |
| `cr4a1_idxbase` | ID xBase | texto (max 100) | sim | CU |
| `cr4a1_n_patrimonio` | N_Patrimonio | texto (max 100) |  | CU |
| `cr4a1_nf_aquisicao` | NF_aquisição | texto (max 100) |  | CU |
| `cr4a1_obs_check_1` | Obs_check_1 | texto longo (max 2000) |  | CU |
| `cr4a1_obs_resol` | Obs_Resol | texto (max 100) |  | CU |
| `cr4a1_quantidade` | Quantidade | texto (max 100) |  | CU |
| `cr4a1_responsavel_setor` | Valor de Aquisição | texto (max 100) |  | CU |
| `cr4a1_responsavel_verificacao` | Informações Adicionais | texto (max 100) |  | CU |
| `cr4a1_setor` | Data de vinculação | texto (max 100) |  | CU |
| `cr4a1_tratativa` | Tratativa | texto (max 100) |  | CU |
| `cr4a1_verificador` | Verificador | texto (max 100) |  | CU |
| `cr4a1_vida_util` | Nome_ferramenta | texto (max 100) |  | CU |
| `cr4a1_xdata` | xTipo | texto (max 100) |  | CU |
| `cr4a1_xestado` | xEstado | texto (max 100) |  | CU |
| `cr4a1_xnome` | Vinculador | texto (max 100) |  | CU |
| `cr4a1_xnxcheck` | xUnidade | texto (max 100) |  | CU |
| `cr4a1_xobservacao` | xObservacao | texto (max 100) |  | CU |
| `cr4a1_xresponsavelsetor` | xResponsávelSetor | texto (max 100) |  | CU |
| `cr4a1_xsetor` | xSetor | texto (max 100) |  | CU |
| `cr4a1_yvalortotal` | yValorTotal | texto (max 100) |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1

- `cr4a1_evidenciaid` → **imagedescriptor**
- `cr4a1_evid_adicionais` → **fileattachment**
- `cr4a1_eviden_aquisi` → **fileattachment**


<a id="dv-cr4a1_controle_man_veicul"></a>
## controle_man_veicul

| | |
|---|---|
| Nome lógico | `cr4a1_controle_man_veicul` |
| EntitySet (Web API) | `cr4a1_controle_man_veiculs` |
| Chave primária | `cr4a1_controle_man_veiculid` |
| Campo nome primário | `cr4a1_veiculo` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_controle_man_veiculid` | controle_man_veicul | GUID | sistema | C- |
| `cr4a1_criadopor` | criadopor | texto (max 100) |  | CU |
| `cr4a1_custototal` | custototal | monetário |  | CU |
| `cr4a1_custototal_base` | custototal (Base) | monetário |  | -- |
| `cr4a1_dataagenda` | dataagenda | data/hora |  | CU |
| `cr4a1_descricao` | descricao | texto (max 4000) |  | CU |
| `cr4a1_filial` | filial | texto (max 100) |  | CU |
| `cr4a1_id_veiculo` | ID_veiculo | texto (max 100) |  | CU |
| `cr4a1_idman` | IDman | texto (max 100) |  | CU |
| `cr4a1_local` | local | texto (max 100) |  | CU |
| `cr4a1_responsavel` | responsavel | texto (max 100) |  | CU |
| `cr4a1_statusman` | statusman | texto (max 100) |  | CU |
| `cr4a1_tipodemanutencao` | tipodemanutencao | texto (max 100) |  | CU |
| `cr4a1_veiculo` | veiculo | texto (max 850) | sim | CU |
| `cr4a1_xanexo_name` |  | texto (max 200) |  | -- |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `exchangerate` | Taxa de Câmbio | decimal |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `transactioncurrencyid` | Moeda | referência (lookup) → transactioncurrency |  | CU |
| `transactioncurrencyidname` |  | texto (max 100) |  | -- |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1

- `transactioncurrencyid` → **transactioncurrency**
- `cr4a1_xanexo` → **fileattachment**


<a id="dv-cr4a1_controle_veiculo"></a>
## controle_veiculo

| | |
|---|---|
| Nome lógico | `cr4a1_controle_veiculo` |
| EntitySet (Web API) | `cr4a1_controle_veiculos` |
| Chave primária | `cr4a1_controle_veiculoid` |
| Campo nome primário | `cr4a1_veiculo` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_alteradopor` | alteradopor | texto (max 100) |  | CU |
| `cr4a1_controle_veiculoid` | controle_veiculo | GUID | sistema | C- |
| `cr4a1_criadopor` | criadopor | texto (max 100) |  | CU |
| `cr4a1_dataaquisi` | dataaquisi | data/hora |  | CU |
| `cr4a1_documentoveicul_name` |  | texto (max 200) |  | -- |
| `cr4a1_filial` | filial | texto (max 100) |  | CU |
| `cr4a1_id` | ID | texto (max 100) |  | CU |
| `cr4a1_modeloveiculo` | modeloveiculo | texto (max 100) |  | CU |
| `cr4a1_placa` | placa | texto (max 100) |  | CU |
| `cr4a1_tipodeaquisi` | tipodeaquisi | texto (max 100) |  | CU |
| `cr4a1_tipoveicul` | tipoveicul | texto (max 100) |  | CU |
| `cr4a1_valorcusto` | valorcusto | monetário |  | CU |
| `cr4a1_valorcusto_base` | valorcusto (Base) | monetário |  | -- |
| `cr4a1_veiculo` | veiculo | texto (max 850) | sim | CU |
| `cr4a1_vencimento` | vencimento | texto (max 100) |  | CU |
| `cr4a1_xstatus` | xstatus | texto (max 100) |  | CU |
| `cr4a1_xvencimento` | xvencimento | data/hora |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `exchangerate` | Taxa de Câmbio | decimal |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `transactioncurrencyid` | Moeda | referência (lookup) → transactioncurrency |  | CU |
| `transactioncurrencyidname` |  | texto (max 100) |  | -- |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1

- `cr4a1_documentoveicul` → **fileattachment**
- `transactioncurrencyid` → **transactioncurrency**


<a id="dv-cr4a1_credenciais"></a>
## Credenciaiss

| | |
|---|---|
| Nome lógico | `cr4a1_credenciais` |
| EntitySet (Web API) | `cr4a1_credenciaises` |
| Chave primária | `cr4a1_credenciaisid` |
| Campo nome primário | `cr4a1_title` |
| Descrição | Data originated from https://aplicativokm.sharepoint.com/sites/KairosMotores/Lists/Credenciais/AllItems.aspx |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1__x0031__nivel` | 1_Nivel | texto (max 300) |  | CU |
| `cr4a1__x0032__nivel` | 2_Nivel | texto (max 300) |  | CU |
| `cr4a1__x0033__nivel` | 3_Nivel | texto (max 300) |  | CU |
| `cr4a1_acesso` | Acesso | texto (max 300) |  | CU |
| `cr4a1_acesso_mod` | acesso_mod | texto (max 4000) |  | CU |
| `cr4a1_cardbi` | CriterioJust | texto longo (max 900) |  | CU |
| `cr4a1_credenciaisid` | Credenciais | GUID | sistema | C- |
| `cr4a1_destino_chamado` | Destino_Chamado | texto (max 300) |  | CU |
| `cr4a1_destinrelatorio` | DestinRelatorio | texto (max 300) |  | CU |
| `cr4a1_echoe_mod` | echoe_mod | texto (max 4000) |  | CU |
| `cr4a1_filial` | Filial | texto (max 300) |  | CU |
| `cr4a1_fun_x00e7__x00e3_o` | Função | texto (max 300) |  | CU |
| `cr4a1_hbkairos` | HBkairos | texto (max 4000) |  | CU |
| `cr4a1_imagem_perfil_timestamp` |  | inteiro (64) |  | -- |
| `cr4a1_imagem_perfil_url` |  | texto (max 200) |  | -- |
| `cr4a1_imagem_perfilid` |  | GUID |  | -- |
| `cr4a1_imgperfil_timestamp` |  | inteiro (64) |  | -- |
| `cr4a1_imgperfil_url` |  | texto (max 200) |  | -- |
| `cr4a1_imgperfilid` |  | GUID |  | -- |
| `cr4a1_mat_protheus` | Mat_Protheus | texto (max 100) |  | CU |
| `cr4a1_matr_x00ed_cula` | Matrícula | texto (max 300) |  | CU |
| `cr4a1_mensagemavante` | MensagemAvante | texto (max 300) |  | CU |
| `cr4a1_mensagemavante_1` | xArea | texto (max 300) |  | CU |
| `cr4a1_menumedro` | MenuMedro | texto (max 300) |  | CU |
| `cr4a1_nivel_acesso` | nivel_acesso | texto (max 100) |  | CU |
| `cr4a1_nivel_kanri` | nivel_kanri | texto (max 100) |  | CU |
| `cr4a1_relatorio` | Relatorio | texto (max 300) |  | CU |
| `cr4a1_setor_bob` | acesso_ao_app_bob | texto (max 300) |  | CU |
| `cr4a1_title` | Título | texto (max 300) |  | CU |
| `cr4a1_usu_x00e1_rio` | Usuário | texto (max 300) |  | CU |
| `cr4a1_xsetor` | xSetor | texto (max 100) |  | CU |
| `cr4a1_xstatus` | xstatus | texto (max 100) |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1

- `cr4a1_imagem_perfilid` → **imagedescriptor**
- `cr4a1_imgperfilid` → **imagedescriptor**


<a id="dv-cr4a1_ensaio_temporizado"></a>
## ensaio_temporizado

| | |
|---|---|
| Nome lógico | `cr4a1_ensaio_temporizado` |
| EntitySet (Web API) | `cr4a1_ensaio_temporizados` |
| Chave primária | `cr4a1_ensaio_temporizadoid` |
| Campo nome primário | `cr4a1_os` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_corr_s` | Corr_S | decimal |  | CU |
| `cr4a1_corr_t` | Corr_T | decimal |  | CU |
| `cr4a1_corre_r` | Corre_R | texto (max 100) |  | CU |
| `cr4a1_corre_s` | Corre_S | texto (max 100) |  | CU |
| `cr4a1_corre_t` | Corre_T | texto (max 100) |  | CU |
| `cr4a1_datahora` | dataHora | data/hora |  | CU |
| `cr4a1_ensaio_temporizadoid` | ensaio_temporizado | GUID | sistema | C- |
| `cr4a1_os` | OS | texto (max 850) | sim | CU |
| `cr4a1_t_a` | T_A | texto (max 100) |  | CU |
| `cr4a1_t_c` | T_C | texto (max 100) |  | CU |
| `cr4a1_t_e` | T_E | texto (max 100) |  | CU |
| `cr4a1_t_m_la` | T_M_LA | texto (max 100) |  | CU |
| `cr4a1_t_m_loa` | T_M_LOA | texto (max 100) |  | CU |
| `cr4a1_temp_ambiente` | Temp_Ambiente | decimal |  | CU |
| `cr4a1_temp_carc` | Temp_Carc | decimal |  | CU |
| `cr4a1_temp_estator` | Temp_Estator | decimal |  | CU |
| `cr4a1_temp_mancal_la` | Temp_Mancal_LA | decimal |  | CU |
| `cr4a1_temp_mancal_loa` | Temp_Mancal_LOA | decimal |  | CU |
| `cr4a1_xfilial` | xFilial | texto (max 100) |  | CU |
| `cr4a1_xleitura` | xleitura | texto (max 100) |  | CU |
| `cr4a1_xusuario` | xusuario | texto (max 100) |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1



<a id="dv-cr4a1_laudos"></a>
## Laudos

| | |
|---|---|
| Nome lógico | `cr4a1_laudos` |
| EntitySet (Web API) | `cr4a1_laudoses` |
| Chave primária | `cr4a1_laudosid` |
| Campo nome primário | `cr4a1_os` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_classelaudo` | Classe Laudo | texto (max 100) |  | CU |
| `cr4a1_cliente` | Cliente | texto (max 100) |  | CU |
| `cr4a1_conclusao` | Conclusao | texto (max 4000) |  | CU |
| `cr4a1_datalaudo` | Data Laudo | data/hora |  | CU |
| `cr4a1_datamotorperitado` | Data Motor Peritado | texto (max 100) |  | CU |
| `cr4a1_datamotorpronto` | Data Motor Pronto | texto (max 100) |  | CU |
| `cr4a1_emissor` | Emissor | texto (max 100) |  | CU |
| `cr4a1_ensaioeletrico` | Ensaio Eletrico | texto (max 100) |  | CU |
| `cr4a1_ensaiotemperatura` | Ensaio Temperatura | texto (max 100) |  | CU |
| `cr4a1_ensaiovibracao` | Ensaio Vibracao | texto (max 100) |  | CU |
| `cr4a1_falhaprincipal` | Falha Principal | texto (max 4000) |  | CU |
| `cr4a1_filial` | Filial | texto (max 100) |  | CU |
| `cr4a1_laudosid` | Laudos | GUID | sistema | C- |
| `cr4a1_observacao` | Observacao | texto (max 4000) |  | CU |
| `cr4a1_os` | OS | texto (max 850) | sim | CU |
| `cr4a1_os_semsigla` | OS_semSigla | texto (max 100) |  | CU |
| `cr4a1_os_semsigla_numero` | OS_semSigla_numero | calculado |  | -- |
| `cr4a1_parecertecnico` | Parecer Tecnico | texto (max 4000) |  | CU |
| `cr4a1_sintomasevidenciados` | Sintomas Evidenciados | texto (max 4000) |  | CU |
| `cr4a1_tipolaudo` | Tipo Laudo | texto (max 100) |  | CU |
| `cr4a1_tipopatch` | TipoPatch | texto (max 100) |  | CU |
| `cr4a1_xarquiv` | xArquiv | texto (max 4000) |  | CU |
| `cr4a1_xid` | xID | texto (max 100) | sim | CU |
| `cr4a1_xstatus` | xStatus | texto (max 100) |  | CU |
| `cr4a1_xvalidlaudoqrccode` | xValidLaudoQRCcode | texto (max 100) |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1



<a id="dv-cr4a1_peritagem_final"></a>
## Prod_Avaliacao_Final

| | |
|---|---|
| Nome lógico | `cr4a1_peritagem_final` |
| EntitySet (Web API) | `cr4a1_peritagem_finals` |
| Chave primária | `cr4a1_peritagem_finalid` |
| Campo nome primário | `cr4a1_ordemdeservico` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_c_corrente_r` | c_Corrente_R | decimal |  | CU |
| `cr4a1_c_corrente_s` | c_Corrente_S | decimal |  | CU |
| `cr4a1_c_corrente_t` | c_Corrente_T | decimal |  | CU |
| `cr4a1_c_deseq_ohm` | c_Deseq_ohm | decimal |  | CU |
| `cr4a1_c_ia` | c_IA | decimal |  | CU |
| `cr4a1_c_ip` | c_IP | decimal |  | CU |
| `cr4a1_c_isol_1` | C_Isol_1 | texto (max 100) |  | CU |
| `cr4a1_c_isol_2` | C_Isol_2 | texto (max 100) |  | CU |
| `cr4a1_c_isol_3` | C_Isol_3 | texto (max 100) |  | CU |
| `cr4a1_c_temp_ambiente` | c_Temp_Ambiente | decimal |  | CU |
| `cr4a1_c_temp_carc` | c_Temp_Carc | decimal |  | CU |
| `cr4a1_c_temp_estator` | c_Temp_Estator | decimal |  | CU |
| `cr4a1_c_temp_mla` | c_Temp_MLA | decimal |  | CU |
| `cr4a1_c_temp_mloa` | C_Temp_MLOA | decimal |  | CU |
| `cr4a1_c_tensao` | c_Tensão | decimal |  | CU |
| `cr4a1_c_test_r_14` | c_test_R_1-4 | decimal |  | CU |
| `cr4a1_c_test_r_25` | c_test_R_2-5 | decimal |  | CU |
| `cr4a1_c_test_r_36` | c_test_R_3-6 | decimal |  | CU |
| `cr4a1_c_test_r_710` | c_test_R_7-10 | decimal |  | CU |
| `cr4a1_c_test_r_811` | c_test_R_8-11 | decimal |  | CU |
| `cr4a1_c_test_r_912` | c_test_R_9-12 | decimal |  | CU |
| `cr4a1_c_test_r_r` | c_test_R_R | decimal |  | CU |
| `cr4a1_c_test_r_s` | c_test_R_S | decimal |  | CU |
| `cr4a1_c_test_r_t` | c_test_R_T | decimal |  | CU |
| `cr4a1_c_test_rpm` | c_Test_RPM | decimal |  | CU |
| `cr4a1_c_vib_ala` | c_Vib_ALA | decimal |  | CU |
| `cr4a1_c_vib_aloa` | c_Vib_ALOA | decimal |  | CU |
| `cr4a1_c_vib_hla` | c_Vib_HLA | decimal |  | CU |
| `cr4a1_c_vib_hloa` | c_Vib_HLOA | decimal |  | CU |
| `cr4a1_c_vib_vla` | c_Vib_VLA | decimal |  | CU |
| `cr4a1_c_vib_vloa` | c_Vib_VLOA | decimal |  | CU |
| `cr4a1_data_ref` | Data_Ref | texto (max 100) |  | CU |
| `cr4a1_deseq_ohmi2` | Deseq_ohmi2 | decimal |  | CU |
| `cr4a1_filial` | Filial | texto (max 100) |  | CU |
| `cr4a1_inseridopor` | InseridoPor | texto (max 100) |  | CU |
| `cr4a1_inspecquali` | InspecQuali | texto (max 100) |  | CU |
| `cr4a1_observ` | Observ | texto (max 4000) |  | CU |
| `cr4a1_ordemdeservico` | Ordem de Serviço | texto (max 100) | sim | CU |
| `cr4a1_peritagem_finalid` | Peritagem_Final | GUID | sistema | C- |
| `cr4a1_rb_isol_1` | Rb_Isol_1 | decimal |  | CU |
| `cr4a1_rb_isol_2` | Rb_Isol_2 | decimal |  | CU |
| `cr4a1_rb_isol_3` | Rb_Isol_3 | decimal |  | CU |
| `cr4a1_rb_res1` | Rb_Res1 | decimal |  | CU |
| `cr4a1_rb_res2` | Rb_Res2 | decimal |  | CU |
| `cr4a1_rb_res3` | Rb_Res3 | decimal |  | CU |
| `cr4a1_sir_corrente_r` | Sir_Corrente_R | decimal |  | CU |
| `cr4a1_sir_corrente_s` | Sir_Corrente_S | decimal |  | CU |
| `cr4a1_sir_corrente_t` | Sir_Corrente_T | decimal |  | CU |
| `cr4a1_sir_vib_hla` | Sir_VIB_HLA | decimal |  | CU |
| `cr4a1_sir_vib_hloa` | Sir_VIB_HLOA | decimal |  | CU |
| `cr4a1_sir_vib_vla` | Sir_VIB_VLA | decimal |  | CU |
| `cr4a1_sir_vib_vloa` | Sir_VIB_VLOA | decimal |  | CU |
| `cr4a1_tipomotor` | TipoMotor | texto (max 100) |  | CU |
| `cr4a1_xaprovado` | xAprovado | texto (max 100) |  | CU |
| `cr4a1_ximagem_timestamp` |  | inteiro (64) |  | -- |
| `cr4a1_ximagem_url` |  | texto (max 200) |  | -- |
| `cr4a1_ximagemid` |  | GUID |  | -- |
| `cr4a1_xstatus` | xStatus | texto (max 100) |  | CU |
| `cr4a1_yimagem_timestamp` |  | inteiro (64) |  | -- |
| `cr4a1_yimagem_url` |  | texto (max 200) |  | -- |
| `cr4a1_yimagemid` |  | GUID |  | -- |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1

- `cr4a1_ximagemid` → **imagedescriptor**
- `cr4a1_yimagemid` → **imagedescriptor**


<a id="dv-cr4a1_prod_avaliacao_final_opc"></a>
## Prod_Avaliacao_Final_Opc

| | |
|---|---|
| Nome lógico | `cr4a1_prod_avaliacao_final_opc` |
| EntitySet (Web API) | `cr4a1_prod_avaliacao_final_opcs` |
| Chave primária | `cr4a1_prod_avaliacao_final_opcid` |
| Campo nome primário | `cr4a1_ordem_servico` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_ept100_s1_l1` | EPT100_S1_L1 | decimal |  | CU |
| `cr4a1_ept100_s1_l2` | EPT100_S1_L2 | decimal |  | CU |
| `cr4a1_ept100_s1_res` | EPT100_S1_RES | texto (max 100) |  | CU |
| `cr4a1_ept100_s2_l1` | EPT100_S2_L1 | decimal |  | CU |
| `cr4a1_ept100_s2_l2` | EPT100_S2_L2 | decimal |  | CU |
| `cr4a1_ept100_s2_res` | EPT100_S2_RES | texto (max 100) |  | CU |
| `cr4a1_ept100_s3_l1` | EPT100_S3_L1 | decimal |  | CU |
| `cr4a1_ept100_s3_l2` | EPT100_S3_L2 | decimal |  | CU |
| `cr4a1_ept100_s3_res` | EPT100_S3_RES | texto (max 100) |  | CU |
| `cr4a1_ept100_s4_l1` | EPT100_S4_L1 | decimal |  | CU |
| `cr4a1_ept100_s4_l2` | EPT100_S4_L2 | decimal |  | CU |
| `cr4a1_ept100_s4_res` | EPT100_S4_RES | texto (max 100) |  | CU |
| `cr4a1_ept100_s5_l1` | EPT100_S5_L1 | decimal |  | CU |
| `cr4a1_ept100_s5_l2` | EPT100_S5_L2 | decimal |  | CU |
| `cr4a1_ept100_s5_res` | EPT100_S5_RES | texto (max 100) |  | CU |
| `cr4a1_ept100_s6_l1` | EPT100_S6_L1 | decimal |  | CU |
| `cr4a1_ept100_s6_l2` | EPT100_S6_L2 | decimal |  | CU |
| `cr4a1_ept100_s6_res` | EPT100_S6_RES | texto (max 100) |  | CU |
| `cr4a1_ordem_servico` | Ordem_Servico | texto (max 100) | sim | CU |
| `cr4a1_prod_avaliacao_final_opcid` | Prod_Avaliacao_Final_Opc | GUID | sistema | C- |
| `cr4a1_res_resultado_status` | Res_Resultado_Status | texto (max 100) |  | CU |
| `cr4a1_res_resultados_pmed` | Res_Resultados_pMed | decimal |  | CU |
| `cr4a1_res_resultados_pnom` | Res_Resultados_pNom | decimal |  | CU |
| `cr4a1_res_testeafrio_isol` | Res_TesteaFrio_Isol | decimal |  | CU |
| `cr4a1_res_testeafrio_rohm` | Res_TesteaFrio_ROhm | decimal |  | CU |
| `cr4a1_res_testeafrio_status` | Res_TesteaFrio_Status | texto (max 100) |  | CU |
| `cr4a1_res_testeaquente_corrente` | Res_TesteaQuente_corrente | decimal |  | CU |
| `cr4a1_res_testeaquente_status` | Res_TesteaQuente_Status | texto (max 100) |  | CU |
| `cr4a1_res_testeaquente_tensao` | Res_TesteaQuente_tensao | decimal |  | CU |
| `cr4a1_tpt100_s1_l1` | TPT100_S1_L1 | decimal |  | CU |
| `cr4a1_tpt100_s1_l2` | TPT100_S1_L2 | decimal |  | CU |
| `cr4a1_tpt100_s1_res` | TPT100_S1_RES | texto (max 100) |  | CU |
| `cr4a1_tpt100_s2_l1` | TPT100_S2_L1 | decimal |  | CU |
| `cr4a1_tpt100_s2_l2` | TPT100_S2_L2 | decimal |  | CU |
| `cr4a1_tpt100_s2_res` | TPT100_S2_RES | texto (max 100) |  | CU |
| `cr4a1_tpt100_s3_l1` | TPT100_S3_L1 | decimal |  | CU |
| `cr4a1_tpt100_s3_l2` | TPT100_S3_L2 | decimal |  | CU |
| `cr4a1_tpt100_s3_res` | TPT100_S3_RES | texto (max 100) |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1



<a id="dv-cr4a1_prod_inspecao"></a>
## Prod_Inspecao

| | |
|---|---|
| Nome lógico | `cr4a1_prod_inspecao` |
| EntitySet (Web API) | `cr4a1_prod_inspecaos` |
| Chave primária | `cr4a1_prod_inspecaoid` |
| Campo nome primário | `cr4a1_ordem_servico` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_acp` | ACP | texto (max 100) |  | CU |
| `cr4a1_anfe` | ANFE | texto (max 100) |  | CU |
| `cr4a1_cabf` | CABF | texto (max 100) |  | CU |
| `cr4a1_cliente` | Cliente | texto (max 100) |  | CU |
| `cr4a1_cnch` | CNCH | texto (max 100) |  | CU |
| `cr4a1_cxla` | CXLA | texto (max 100) |  | CU |
| `cr4a1_cxlp` | CXLP | texto (max 100) |  | CU |
| `cr4a1_data_teste` | Data_Teste | texto (max 100) |  | CU |
| `cr4a1_freio` | FREIO | texto (max 100) |  | CU |
| `cr4a1_grax` | GRAX | texto (max 100) |  | CU |
| `cr4a1_grlv` | GRLV | texto (max 100) |  | CU |
| `cr4a1_inserido_por` | Inserido_Por | texto (max 100) |  | CU |
| `cr4a1_isol` | ISOL | texto (max 100) |  | CU |
| `cr4a1_obs` | Obs | texto (max 4000) |  | CU |
| `cr4a1_olhal` | OLHAL | texto (max 100) |  | CU |
| `cr4a1_ordem_servico` | Ordem_Servico | texto (max 100) | sim | CU |
| `cr4a1_pclp` | PCLP | texto (max 100) |  | CU |
| `cr4a1_pgra` | PGRA | texto (max 100) |  | CU |
| `cr4a1_piex` | PIEX | texto (max 100) |  | CU |
| `cr4a1_plgr` | PLGR | texto (max 100) |  | CU |
| `cr4a1_plos` | PLOS | texto (max 100) |  | CU |
| `cr4a1_port` | PORT | texto (max 100) |  | CU |
| `cr4a1_prel` | PREL | texto (max 100) |  | CU |
| `cr4a1_prod_inspecaoid` | Prod_Inspecao | GUID | sistema | C- |
| `cr4a1_ptag` | PTAG | texto (max 100) |  | CU |
| `cr4a1_ptam` | PTAM | texto (max 100) |  | CU |
| `cr4a1_resi` | RESI | texto (max 100) |  | CU |
| `cr4a1_resp_teste` | Resp_Teste | texto (max 100) |  | CU |
| `cr4a1_resumo_reprov` | Resumo_reprov | texto (max 4000) |  | CU |
| `cr4a1_rolh` | ROLH | texto (max 100) |  | CU |
| `cr4a1_selo` | SELO | texto (max 100) |  | CU |
| `cr4a1_tacp` | TACP | texto (max 100) |  | CU |
| `cr4a1_temf` | TEMF | texto (max 100) |  | CU |
| `cr4a1_tipoespmotor` | TipoEspMotor | texto (max 100) |  | CU |
| `cr4a1_tipomotor` | TipoMotor | texto (max 100) |  | CU |
| `cr4a1_tpdf` | TPDF | texto (max 100) |  | CU |
| `cr4a1_veda` | VEDA | texto (max 100) |  | CU |
| `cr4a1_vent` | VENT | texto (max 100) |  | CU |
| `cr4a1_xaprovado` | xAprovado | texto (max 100) |  | CU |
| `cr4a1_yimagem_timestamp` |  | inteiro (64) |  | -- |
| `cr4a1_yimagem_url` |  | texto (max 200) |  | -- |
| `cr4a1_yimagemid` |  | GUID |  | -- |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1

- `cr4a1_yimagemid` → **imagedescriptor**


<a id="dv-cr4a1_prod_liberarensaio"></a>
## Prod_LiberarEnsaio

| | |
|---|---|
| Nome lógico | `cr4a1_prod_liberarensaio` |
| EntitySet (Web API) | `cr4a1_prod_liberarensaios` |
| Chave primária | `cr4a1_prod_liberarensaioid` |
| Campo nome primário | `cr4a1_os` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_filial` | Filial | texto (max 100) |  | CU |
| `cr4a1_inserido_por` | Inserido_Por | texto (max 100) |  | CU |
| `cr4a1_os` | OS | texto (max 850) | sim | CU |
| `cr4a1_prod_liberarensaioid` | Prod_LiberarEnsaio | GUID | sistema | C- |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1



<a id="dv-cr4a1_rdsmanagement"></a>
## RDS-Managements

| | |
|---|---|
| Nome lógico | `cr4a1_rdsmanagement` |
| EntitySet (Web API) | `cr4a1_rdsmanagements` |
| Chave primária | `cr4a1_rdsmanagementid` |
| Campo nome primário | `cr4a1_titulo` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_atendimento` | Atendimento | texto (max 100) |  | CU |
| `cr4a1_auxiliar` | Auxiliar | texto (max 100) |  | CU |
| `cr4a1_cliente` | Cliente | texto (max 100) |  | CU |
| `cr4a1_dataatendim` | DataAtendim | texto (max 100) |  | CU |
| `cr4a1_dataconc` | DataConc | texto (max 100) |  | CU |
| `cr4a1_datanecess` | DataNecess | texto (max 100) |  | CU |
| `cr4a1_datareq` | DataReq | texto (max 100) |  | CU |
| `cr4a1_desclog` | DescLOG | texto (max 100) |  | CU |
| `cr4a1_descricao` | Descrição | texto (max 4000) |  | CU |
| `cr4a1_idbase` | IDBASE | texto (max 100) | sim | CU |
| `cr4a1_idveiculo` | IDVeiculo | texto (max 100) |  | CU |
| `cr4a1_matricula` | matricula | texto (max 100) |  | CU |
| `cr4a1_motorista` | Motorista | texto (max 100) |  | CU |
| `cr4a1_nf` | NF | texto (max 100) |  | CU |
| `cr4a1_nomereq` | NomeReq | texto (max 100) |  | CU |
| `cr4a1_numero_soma_bi` | Numero_SOMA_BI | texto (max 100) |  | CU |
| `cr4a1_qtdequip` | QtdEquip | texto (max 100) |  | CU |
| `cr4a1_rdsmanagementid` | RDS-Management | GUID | sistema | C- |
| `cr4a1_reqexterno` | ReqExterno | texto (max 100) |  | CU |
| `cr4a1_setorreq` | SetorReq | texto (max 100) |  | CU |
| `cr4a1_tiposaida` | TipoSaida | texto (max 100) |  | CU |
| `cr4a1_titulo` | Título | texto (max 100) | sim | CU |
| `cr4a1_unidade` | Unidade | texto (max 100) |  | CU |
| `cr4a1_veiculo` | Veículo | texto (max 100) |  | CU |
| `cr4a1_xanexos_name` |  | texto (max 200) |  | -- |
| `cr4a1_xdataatendim` | xDataAtendim | data/hora |  | CU |
| `cr4a1_xdataconc` | xDataConc | data/hora |  | CU |
| `cr4a1_xdatanecess` | xDataNecess | data/hora |  | CU |
| `cr4a1_xdatareq` | xDataReq | data/hora |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1

- `cr4a1_xanexos` → **fileattachment**


<a id="dv-cr4a1_relatorio_fotografico"></a>
## Relatorio_Fotografico

| | |
|---|---|
| Nome lógico | `cr4a1_relatorio_fotografico` |
| EntitySet (Web API) | `cr4a1_relatorio_fotograficos` |
| Chave primária | `cr4a1_relatorio_fotograficoid` |
| Campo nome primário | `cr4a1_os` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_filial` | Filial | texto (max 100) |  | CU |
| `cr4a1_nome` | Nome | texto (max 100) |  | CU |
| `cr4a1_os` | OS | texto (max 850) | sim | CU |
| `cr4a1_primeira_foto` | Primeira_Foto | texto (max 4000) |  | CU |
| `cr4a1_qtde_fotos` | Qtde_Fotos | texto (max 100) |  | CU |
| `cr4a1_relatorio_fotograficoid` | Relatorio_Fotografico | GUID | sistema | C- |
| `cr4a1_setor` | Setor | texto (max 100) |  | CU |
| `cr4a1_status` | Status | texto (max 100) |  | CU |
| `cr4a1_tipo` | Tipo | texto (max 100) |  | CU |
| `cr4a1_xstatus` | xStatus | texto (max 100) |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1



<a id="dv-cr4a1_requisicao"></a>
## Requisicao

| | |
|---|---|
| Nome lógico | `cr4a1_requisicao` |
| EntitySet (Web API) | `cr4a1_requisicaos` |
| Chave primária | `cr4a1_requisicaoid` |
| Campo nome primário | `cr4a1_os` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_inseridopor` | InseridoPor | texto (max 100) |  | CU |
| `cr4a1_os` | OS | texto (max 850) | sim | CU |
| `cr4a1_requisicaoid` | Requisição | GUID | sistema | C- |
| `cr4a1_status` | xStatus | texto (max 100) |  | CU |
| `cr4a1_xfilial` | xFilial | texto (max 100) |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1



<a id="dv-cr4a1_servicosterceirizados"></a>
## servicosterceirizados

| | |
|---|---|
| Nome lógico | `cr4a1_servicosterceirizados` |
| EntitySet (Web API) | `cr4a1_servicosterceirizadoses` |
| Chave primária | `cr4a1_servicosterceirizadosid` |
| Campo nome primário | `cr4a1_title` |
| Descrição | Data originated from https://aplicativokm.sharepoint.com/sites/KairosMotores/Lists/Servios Terceirizados/AllItems.aspx |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_avaliacaodescricao` | AvaliacaoDescricao | texto longo (max 100) |  | CU |
| `cr4a1_avaliacaomedida` | AvaliacaoMedida | texto (max 100) |  | CU |
| `cr4a1_avaliacaoretorno` | AvaliacaoRetorno | texto (max 100) |  | CU |
| `cr4a1_carca_x00e7_a` | Carcaça | texto (max 300) |  | CU |
| `cr4a1_data_aprovacao_valor` | Data_aprovacao_valor | texto (max 100) |  | CU |
| `cr4a1_data_envio` | Data_envio | texto (max 300) |  | CU |
| `cr4a1_data_registro` | Data_registro | texto (max 300) |  | CU |
| `cr4a1_data_retorno` | Data_retorno | texto (max 300) |  | CU |
| `cr4a1_empresa` | Empresa | escolha |  | CU |
| `cr4a1_fabricante` | Fabricante | texto (max 300) |  | CU |
| `cr4a1_id` | ID | texto (max 100) | sim | CU |
| `cr4a1_n_or` | N_OR | texto (max 300) |  | CU |
| `cr4a1_observa_x00e7__x00e3_o` | Observação | texto longo (max 900) |  | CU |
| `cr4a1_orc_fornecedor` | Orc_Fornecedor | texto (max 300) |  | CU |
| `cr4a1_pe_x00e7_a` | Peça | escolha |  | CU |
| `cr4a1_previs_x00e3_oretorno` | PrevisãoRetorno | texto (max 100) |  | CU |
| `cr4a1_servi_x00e7_o1` | Serviço1 | texto (max 300) |  | CU |
| `cr4a1_servi_x00e7_o2` | Serviço2 | texto (max 300) |  | CU |
| `cr4a1_servi_x00e7_o3` | Serviço3 | texto (max 300) |  | CU |
| `cr4a1_servi_x00e7_o4` | Serviço4 | texto (max 300) |  | CU |
| `cr4a1_servi_x00e7_o5` | Serviço5 | texto (max 300) |  | CU |
| `cr4a1_servicosterceirizadosid` | servicosterceirizados | GUID | sistema | C- |
| `cr4a1_situa_x00e7__x00e3_o` | Situação | escolha |  | CU |
| `cr4a1_title` | Título | texto (max 850) |  | CU |
| `cr4a1_totalvalor` | Total Valor | texto (max 300) |  | CU |
| `cr4a1_unidade` | Unidade | texto (max 300) |  | CU |
| `cr4a1_valorserv1` | ValorServ1 | texto (max 300) |  | CU |
| `cr4a1_valorserv2` | ValorServ2 | texto (max 300) |  | CU |
| `cr4a1_valorserv3` | ValorServ3 | texto (max 300) |  | CU |
| `cr4a1_valorserv4` | ValorServ4 | texto (max 300) |  | CU |
| `cr4a1_valorserv5` | ValorServ5 | texto (max 300) |  | CU |
| `cr4a1_xdataenvio` | xdataenvio | data/hora |  | CU |
| `cr4a1_xdataregistro` | xdataregistro | data/hora |  | CU |
| `cr4a1_xdataretorno` | xdataretorno | data/hora |  | CU |
| `cr4a1_xempresa` | xEmpresa | texto (max 100) |  | CU |
| `cr4a1_ximagem_timestamp` |  | inteiro (64) |  | -- |
| `cr4a1_ximagem_url` |  | texto (max 200) |  | -- |
| `cr4a1_ximagemid` |  | GUID |  | -- |
| `cr4a1_xprevisaoretorno` | xprevisaoretorno | data/hora |  | CU |
| `cr4a1_xstatus` | xStatus | texto (max 100) |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit | sistema | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`cr4a1_empresa`** (Empresa): 0=Torneadora Ágape; 1=Santo Antônio; 2=Gefferssom; 3=Antônio Jateamento; 4=Rubenilson; 5=Sítio/ Maracujá
- **`cr4a1_pe_x00e7_a`** (Peça): 0=Tampa LA; 1=Tampa LOA; 2=Eixo; 3=Rosca do olhal; 4=Caixa de Ligação; 5=Anel coletor; 6=Armadura de freio; 7=Estator; 8=Anel de fixação; 9=Defletora; 10=Bobina; 11=Ventilador; 12=Pino; 13=Parafuso; 14=Acoplamento; 15=Anel Labirinto; 16=Caixa Metálica; 17=Porta Escova; 18=Tapes; 19=Rosca; 20=Peça
- **`cr4a1_situa_x00e7__x00e3_o`** (Situação): 0=Emergencial; 1=Normal
- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1

- `cr4a1_ximagemid` → **imagedescriptor**


<a id="dv-cr4a1_servicosterceirizados_for"></a>
## servicosterceirizados_for

| | |
|---|---|
| Nome lógico | `cr4a1_servicosterceirizados_for` |
| EntitySet (Web API) | `cr4a1_servicosterceirizados_fors` |
| Chave primária | `cr4a1_servicosterceirizados_forid` |
| Campo nome primário | `cr4a1_nome` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_filial` | Filial | texto (max 100) |  | CU |
| `cr4a1_nome` | Nome | texto (max 850) | sim | CU |
| `cr4a1_servicosterceirizados_forid` | servicosterceirizados_for | GUID | sistema | C- |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1



<a id="dv-systemuser"></a>
## Usuários

| | |
|---|---|
| Nome lógico | `systemuser` |
| EntitySet (Web API) | `systemusers` |
| Chave primária | `systemuserid` |
| Campo nome primário | `fullname` |
| Descrição | Pessoa com acesso ao sistema Microsoft CRM e proprietária de objetos no banco de dados do Microsoft CRM. |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `accessmode` | Modo de Acesso | escolha | sistema | CU |
| `activedirectoryguid` | Guid do Active Directory | GUID |  | -- |
| `address1_addressid` | Endereço 1: ID | GUID |  | CU |
| `address1_addresstypecode` | Endereço 1: Tipo de Endereço | escolha |  | CU |
| `address1_city` | Cidade | texto (max 128) |  | CU |
| `address1_composite` | Endereço | texto longo (max 1000) |  | -- |
| `address1_country` | País/Região | texto (max 128) |  | CU |
| `address1_county` | Endereço 1: Município | texto (max 128) |  | CU |
| `address1_fax` | Endereço 1: Fax | texto (max 64) |  | CU |
| `address1_latitude` | Endereço 1: Latitude | decimal |  | CU |
| `address1_line1` | Rua 1 | texto (max 1024) |  | CU |
| `address1_line2` | Rua 2 | texto (max 1024) |  | CU |
| `address1_line3` | Rua 3 | texto (max 1024) |  | CU |
| `address1_longitude` | Endereço 1: Longitude | decimal |  | CU |
| `address1_name` | Endereço 1: Nome | texto (max 100) |  | CU |
| `address1_postalcode` | CEP | texto (max 40) |  | CU |
| `address1_postofficebox` | Endereço 1: Caixa Postal | texto (max 40) |  | CU |
| `address1_shippingmethodcode` | Endereço 1: Método de Entrega | escolha |  | CU |
| `address1_stateorprovince` | Estado | texto (max 128) |  | CU |
| `address1_telephone1` | Telefone Principal | texto (max 64) |  | CU |
| `address1_telephone2` | Outro Telefone | texto (max 50) |  | CU |
| `address1_telephone3` | Pager | texto (max 50) |  | CU |
| `address1_upszone` | Endereço 1: Zona UPS | texto (max 4) |  | CU |
| `address1_utcoffset` | Endereço 1: Compensação UTC | inteiro |  | CU |
| `address2_addressid` | Endereço 2: ID | GUID |  | CU |
| `address2_addresstypecode` | Endereço 2: Tipo de Endereço | escolha |  | CU |
| `address2_city` | Outra Cidade | texto (max 128) |  | CU |
| `address2_composite` | Outro Endereço | texto longo (max 1000) |  | -- |
| `address2_country` | Outro País/Região | texto (max 128) |  | CU |
| `address2_county` | Endereço 2: Município | texto (max 128) |  | CU |
| `address2_fax` | Endereço 2: Fax | texto (max 50) |  | CU |
| `address2_latitude` | Endereço 2: Latitude | decimal |  | CU |
| `address2_line1` | Outra Rua 1 | texto (max 1024) |  | CU |
| `address2_line2` | Outra Rua 2 | texto (max 1024) |  | CU |
| `address2_line3` | Outra Rua 3 | texto (max 1024) |  | CU |
| `address2_longitude` | Endereço 2: Longitude | decimal |  | CU |
| `address2_name` | Endereço 2: Nome | texto (max 100) |  | CU |
| `address2_postalcode` | Outro CEP | texto (max 40) |  | CU |
| `address2_postofficebox` | Endereço 2: Caixa Postal | texto (max 40) |  | CU |
| `address2_shippingmethodcode` | Endereço 2: Método de Entrega | escolha |  | CU |
| `address2_stateorprovince` | Outro Estado | texto (max 128) |  | CU |
| `address2_telephone1` | Endereço 2: Telefone 1 | texto (max 50) |  | CU |
| `address2_telephone2` | Endereço 2: Telefone 2 | texto (max 50) |  | CU |
| `address2_telephone3` | Endereço 2: Telefone 3 | texto (max 50) |  | CU |
| `address2_upszone` | Endereço 2: Zona UPS | texto (max 4) |  | CU |
| `address2_utcoffset` | Endereço 2: Compensação UTC | inteiro |  | CU |
| `applicationid` | ID do Aplicativo | GUID |  | CU |
| `applicationiduri` | URI da ID do Aplicativo | texto (max 1024) |  | -- |
| `azureactivedirectoryobjectid` | ID do Objeto do Azure AD | GUID |  | -- |
| `azuredeletedon` | Data de Exclusão no Azure | data/hora |  | -- |
| `azurestate` | Estado no Azure | escolha | sistema | -U |
| `businessunitid` | Unidade de Negócios | referência (lookup) → businessunit | sistema | CU |
| `businessunitidname` |  | texto (max 100) | sistema | -- |
| `calendarid` | Calendário | referência (lookup) → calendar |  | CU |
| `caltype` | Tipo de Licença | escolha | sistema | CU |
| `createdby` | Criada por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `defaultfilterspopulated` | Filtros Padrão Populados | sim/não | sistema | -- |
| `defaultmailbox` | Caixa de Correio | referência (lookup) → mailbox |  | -- |
| `defaultmailboxname` |  | texto (max 100) |  | -- |
| `defaultodbfoldername` | Nome de Pasta do OneDrive for Business Padrão | texto (max 200) | sistema | -- |
| `deletedstate` | Estado Excluído | escolha | sistema | -- |
| `disabledreason` | Motivo da Desabilitação | texto (max 500) |  | -- |
| `displayinserviceviews` | Mostrar em Exibições do Serviço | sim/não |  | CU |
| `domainname` | Nome do usuário | texto (max 1024) | sistema | CU |
| `emailrouteraccessapproval` | Status do Email Principal | escolha | sistema | -U |
| `employeeid` | Funcionário | texto (max 100) |  | CU |
| `entityimage_timestamp` |  | inteiro (64) |  | -- |
| `entityimage_url` |  | texto (max 200) |  | -- |
| `entityimageid` | ID da Imagem da Entidade | GUID |  | -- |
| `exchangerate` | Taxa de Câmbio | decimal |  | -- |
| `firstname` | Nome | texto (max 256) | sim | CU |
| `fullname` | Nome Completo | texto (max 200) |  | -- |
| `governmentid` | Governo | texto (max 100) |  | CU |
| `homephone` | Telefone Residencial | texto (max 50) |  | CU |
| `identityid` | ID de identidade de usuário exclusiva | inteiro | sistema | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `incomingemaildeliverymethod` | Método de Entrega de Email de Entrada | escolha | sistema | CU |
| `internalemailaddress` | Email Primário | texto (max 100) | sistema | CU |
| `invitestatuscode` | Status do Convite | escolha | sim | CU |
| `isactivedirectoryuser` | É um Usuário do Active Directory | sim/não | sistema | -- |
| `isallowedbyipfirewall` | To bypass IP firewall restriction on the user | sim/não |  | CU |
| `isdisabled` | Status | sim/não |  | -U |
| `isemailaddressapprovedbyo365admin` | Status da Aprovação do Endereço de Email pelo Administrador do O365 | sim/não | sistema | -- |
| `isintegrationuser` | Modo de usuário de integração | sim/não | sistema | CU |
| `islicensed` | Usuário Licenciado | sim/não | sistema | CU |
| `issyncwithdirectory` | Usuário Sincronizado | sim/não | sistema | CU |
| `jobtitle` | Cargo | texto (max 100) |  | CU |
| `lastname` | Sobrenome | texto (max 256) | sim | CU |
| `latestupdatetime` | Hora da Última Atualização do Usuário | data/hora |  | -- |
| `middlename` | Segundo Nome | texto (max 50) |  | CU |
| `mobilealertemail` | Email de Alerta Móvel | texto (max 100) |  | CU |
| `mobileofflineprofileid` | Perfil do Mobile Offline | referência (lookup) → mobileofflineprofile |  | CU |
| `mobileofflineprofileidname` |  | texto (max 100) |  | CU |
| `mobilephone` | Telefone Celular | texto (max 64) |  | CU |
| `modifiedby` | Modificado por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `nickname` | Apelido | texto (max 50) |  | CU |
| `organizationid` | Organização  | GUID | sistema | -- |
| `organizationidname` |  | texto (max 100) | sistema | -- |
| `outgoingemaildeliverymethod` | Método de Entrega de Email de Saída | escolha | sistema | CU |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `parentsystemuserid` | Gerente | referência (lookup) → systemuser |  | CU |
| `parentsystemuseridname` |  | texto (max 100) |  | -- |
| `passporthi` | Passaporte Alto | inteiro |  | CU |
| `passportlo` | Passaporte Baixo | inteiro |  | CU |
| `personalemailaddress` | Email 2 | texto (max 100) |  | CU |
| `photourl` | URL de Fotos | texto (max 200) |  | CU |
| `positionid` | Cargo | referência (lookup) → position |  | CU |
| `positionidname` |  | texto (max 100) |  | -- |
| `preferredaddresscode` | Endereço Preferencial | escolha |  | CU |
| `preferredemailcode` | Email Preferencial | escolha |  | CU |
| `preferredphonecode` | Telefone Preferencial | escolha |  | CU |
| `processid` | Processo | GUID |  | CU |
| `queueid` | Fila Padrão | referência (lookup) → queue |  | CU |
| `queueidname` |  | texto (max 400) |  | -- |
| `salutation` | Saudação | texto (max 20) |  | CU |
| `setupuser` | Modo de Acesso Restrito | sim/não | sistema | CU |
| `sharepointemailaddress` | Endereço de Email do SharePoint | texto (max 1024) |  | CU |
| `skills` | Habilidades | texto (max 100) |  | CU |
| `stageid` | (Preterido) Estágio do Processo | GUID |  | CU |
| `systemmanagedusertype` | Tipo de Usuário Gerenciado pelo Sistema | escolha | sim | CU |
| `systemuserid` | Usuário | GUID | sistema | C- |
| `territoryid` | Região | referência (lookup) → territory |  | CU |
| `territoryidname` |  | texto (max 100) | sistema | -- |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `title` | Título | texto (max 128) |  | CU |
| `transactioncurrencyid` | Moeda | referência (lookup) → transactioncurrency |  | CU |
| `transactioncurrencyidname` |  | texto (max 100) |  | -- |
| `traversedpath` | (Preterido) Caminho Percorrido | texto (max 1250) |  | CU |
| `userlicensetype` | Tipo de Licença de Usuário | inteiro | sistema | CU |
| `userpuid` | PUID do Usuário | texto (max 100) |  | -- |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |
| `windowsliveid` | Windows Live ID | texto (max 1024) |  | CU |
| `yammeremailaddress` | Email do Yammer | texto (max 200) |  | CU |
| `yammeruserid` | ID do Usuário do Yammer | texto (max 128) |  | CU |
| `yomifirstname` | Nome Yomi | texto (max 64) |  | CU |
| `yomifullname` | Nome Completo Yomi | texto (max 200) |  | -- |
| `yomilastname` | Sobrenome Yomi | texto (max 64) |  | CU |
| `yomimiddlename` | Segundo Nome Yomi | texto (max 50) |  | CU |

### Conjuntos de opções

- **`accessmode`** (Modo de Acesso): 0=Leitura-Gravação; 1=Administrativo; 2=Leitura; 3=Suporte ao Usuário; 4=Não Interativo; 5=Administrador Delegado
- **`address1_addresstypecode`** (Endereço 1: Tipo de Endereço): 1=Valor Padrão
- **`address1_shippingmethodcode`** (Endereço 1: Método de Entrega): 1=Valor Padrão
- **`address2_addresstypecode`** (Endereço 2: Tipo de Endereço): 1=Valor Padrão
- **`address2_shippingmethodcode`** (Endereço 2: Método de Entrega): 1=Valor Padrão
- **`azurestate`** (Estado no Azure): 0=Existe; 1=Excluído temporariamente; 2=Não encontrado ou excluído permanentemente
- **`caltype`** (Tipo de Licença): 0=Profissional; 1=Administrativo; 2=Básico; 3=Profissional de Dispositivo; 4=Dispositivo Básico; 5=Essencial; 6=Dispositivo Essencial; 7=Empresa; 8=Empresa de Dispositivos; 9=Vendas; 10=Serviço; 11=Field Service; 12=Project Service
- **`defaultfilterspopulated`** (Filtros Padrão Populados): 1=Sim; 0=Não
- **`deletedstate`** (Estado Excluído): 0=Não excluído; 1=Exclusão reversível
- **`displayinserviceviews`** (Mostrar em Exibições do Serviço): 1=Sim; 0=Não
- **`emailrouteraccessapproval`** (Status do Email Principal): 0=Vazio; 1=Aprovado; 2=Aprovação Pendente; 3=Rejeitado
- **`incomingemaildeliverymethod`** (Método de Entrega de Email de Entrada): 0=Nenhum; 1=Microsoft Dynamics 365 para Outlook; 2=Sincronização no Servidor ou E-mail Router; 3=Caixa de Correio para Encaminhamento
- **`invitestatuscode`** (Status do Convite): 0=Convite não Enviado; 1=Convidado; 2=Convite Quase Vencido; 3=Convite Vencido; 4=Convite Aceito; 5=Convite Recusado; 6=Convite Revogado
- **`isactivedirectoryuser`** (É um Usuário do Active Directory): 1=Sim; 0=Não
- **`isallowedbyipfirewall`** (To bypass IP firewall restriction on the user): 1=Yes; 0=No
- **`isdisabled`** (Status): 1=Desabilitado; 0=Habilitado
- **`isemailaddressapprovedbyo365admin`** (Status da Aprovação do Endereço de Email pelo Administrador do O365): 1=Sim; 0=Não
- **`isintegrationuser`** (Modo de usuário de integração): 1=Sim; 0=Não
- **`islicensed`** (Usuário Licenciado): 1=Sim; 0=Não
- **`issyncwithdirectory`** (Usuário Sincronizado): 1=Sim; 0=Não
- **`outgoingemaildeliverymethod`** (Método de Entrega de Email de Saída): 0=Nenhum; 1=Microsoft Dynamics 365 para Outlook; 2=Sincronização no Servidor ou E-mail Router
- **`preferredaddresscode`** (Endereço Preferencial): 1=Endereço para Correspondência; 2=Outro Endereço
- **`preferredemailcode`** (Email Preferencial): 1=Valor Padrão
- **`preferredphonecode`** (Telefone Preferencial): 1=Telefone Principal; 2=Outro Telefone; 3=Telefone Residencial; 4=Telefone Celular
- **`setupuser`** (Modo de Acesso Restrito): 1=Sim; 0=Não
- **`systemmanagedusertype`** (Tipo de Usuário Gerenciado pelo Sistema): 0=Usuário do Entra; 1=Usuário do C2; 2=Usuário de Stub Não Apresentável; 3=Agentic User

### Relações N:1

- `defaultmailbox` → **mailbox**
- `positionid` → **position**
- `calendarid` → **calendar**
- `businessunitid` → **businessunit**
- `mobileofflineprofileid` → **mobileofflineprofile**
- `transactioncurrencyid` → **transactioncurrency**
- `parentsystemuserid` → **systemuser**
- `entityimageid` → **imagedescriptor**
- `organizationid` → **organization**
- `queueid` → **queue**
- `stageid` → **processstage**
- `territoryid` → **territory**


<a id="dv-cr4a1_zb6_relatorio"></a>
## ZB6_Relatorio

| | |
|---|---|
| Nome lógico | `cr4a1_zb6_relatorio` |
| EntitySet (Web API) | `cr4a1_zb6_relatorios` |
| Chave primária | `cr4a1_zb6_relatorioid` |
| Campo nome primário | `cr4a1_novacoluna` |

### Campos

| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |
|---|---|---|---|---|
| `cr4a1_cliente_area` | Área | texto (max 500) |  | CU |
| `cr4a1_cliente_me` | ME | texto (max 500) |  | CU |
| `cr4a1_cliente_mo` | MO | texto (max 500) |  | CU |
| `cr4a1_cliente_ni` | NI | texto (max 500) |  | CU |
| `cr4a1_cliente_nome` | Cliente | texto (max 500) |  | CU |
| `cr4a1_cliente_om` | OM | texto (max 500) |  | CU |
| `cr4a1_cliente_pedido` | Pedido | texto (max 500) |  | CU |
| `cr4a1_contato_cli` | Contato | texto (max 500) |  | CU |
| `cr4a1_data_rec` | Data Rec | texto (max 500) |  | CU |
| `cr4a1_data_relat` | Data Relat | texto (max 500) |  | CU |
| `cr4a1_elab_relat` | Elaborador | texto (max 500) |  | CU |
| `cr4a1_eq_carcaca` | Carcaca | texto (max 500) |  | CU |
| `cr4a1_eq_categoria` | Categoria | texto (max 500) |  | CU |
| `cr4a1_eq_corrente` | Corrente | texto (max 500) |  | CU |
| `cr4a1_eq_descricao` | Descricao | texto (max 500) |  | CU |
| `cr4a1_eq_fabricante` | Fabricante | texto (max 500) |  | CU |
| `cr4a1_eq_fc` | FC | texto (max 500) |  | CU |
| `cr4a1_eq_freq` | Freq | texto (max 500) |  | CU |
| `cr4a1_eq_ip` | IP | texto (max 500) |  | CU |
| `cr4a1_eq_isol` | Isol | texto (max 500) |  | CU |
| `cr4a1_eq_modelo` | Modelo | texto (max 500) |  | CU |
| `cr4a1_eq_peso` | Peso | texto (max 500) |  | CU |
| `cr4a1_eq_polaridade` | Polaridade | texto (max 500) |  | CU |
| `cr4a1_eq_potencia_cv` | Potencia | texto (max 500) |  | CU |
| `cr4a1_eq_regime` | Regime | texto (max 500) |  | CU |
| `cr4a1_eq_rpm` | RPM | texto (max 500) |  | CU |
| `cr4a1_eq_serie` | Serie | texto (max 500) |  | CU |
| `cr4a1_eq_tensao` | Tensao | texto (max 500) |  | CU |
| `cr4a1_nf_remessa` | NF | texto (max 500) |  | CU |
| `cr4a1_novacoluna` | OS | texto (max 850) | sim | CU |
| `cr4a1_r_e_c_d_e_l_` | R_E_C_D_E_L_ | texto (max 500) |  | CU |
| `cr4a1_r_e_c_n_o_` | R_E_C_N_O_ | texto (max 500) |  | CU |
| `cr4a1_resp_tecnico` | Resp Tecnico | texto (max 500) |  | CU |
| `cr4a1_rpm` | RPM | texto (max 100) |  | CU |
| `cr4a1_servico_historico` | Servico_Historico | texto (max 100) |  | CU |
| `cr4a1_tag_cliente` | TAG Cliente | texto (max 500) |  | CU |
| `cr4a1_tag_kairos` | TAG Kairos | texto (max 500) |  | CU |
| `cr4a1_zb6_apacor` | ZB6_APACOR | texto (max 500) |  | CU |
| `cr4a1_zb6_client` | ZB6_CLIENT | texto (max 500) |  | CU |
| `cr4a1_zb6_codeq` | ZB6_CODEQ | texto (max 500) |  | CU |
| `cr4a1_zb6_contra` | ZB6_CONTRA | texto (max 500) |  | CU |
| `cr4a1_zb6_datenv` | ZB6_DATENV | texto (max 500) |  | CU |
| `cr4a1_zb6_dessta` | ZB6_DESSTA | texto (max 500) |  | CU |
| `cr4a1_zb6_dirapr` | ZB6_DIRAPR | texto (max 500) |  | CU |
| `cr4a1_zb6_dpeca` | ZB6_DPECA | texto (max 500) |  | CU |
| `cr4a1_zb6_dtauto` | ZB6_DTAUTO | texto (max 500) |  | CU |
| `cr4a1_zb6_dtcada` | ZB6_DTCADA | texto (max 500) |  | CU |
| `cr4a1_zb6_dtentr` | ZB6_DTENTR | texto (max 500) |  | CU |
| `cr4a1_zb6_dtenvi` | ZB6_DTENVI | texto (max 500) |  | CU |
| `cr4a1_zb6_dtltf` | ZB6_DTLTF | texto (max 500) |  | CU |
| `cr4a1_zb6_dtnfdv` | ZB6_DTNFDV | texto (max 500) |  | CU |
| `cr4a1_zb6_dtnfp2` | ZB6_DTNFP2 | texto (max 500) |  | CU |
| `cr4a1_zb6_dtnfp3` | ZB6_DTNFP3 | texto (max 500) |  | CU |
| `cr4a1_zb6_dtnfp4` | ZB6_DTNFP4 | texto (max 500) |  | CU |
| `cr4a1_zb6_dtnfp5` | ZB6_DTNFP5 | texto (max 500) |  | CU |
| `cr4a1_zb6_dtnfp6` | ZB6_DTNFP6 | texto (max 500) |  | CU |
| `cr4a1_zb6_dtnfpr` | ZB6_DTNFPR | texto (max 500) |  | CU |
| `cr4a1_zb6_dtnfs2` | ZB6_DTNFS2 | texto (max 500) |  | CU |
| `cr4a1_zb6_dtnfs3` | ZB6_DTNFS3 | texto (max 500) |  | CU |
| `cr4a1_zb6_dtnfs4` | ZB6_DTNFS4 | texto (max 500) |  | CU |
| `cr4a1_zb6_dtnfs5` | ZB6_DTNFS5 | texto (max 500) |  | CU |
| `cr4a1_zb6_dtnfs6` | ZB6_DTNFS6 | texto (max 500) |  | CU |
| `cr4a1_zb6_dtnfsv` | ZB6_DTNFSV | texto (max 500) |  | CU |
| `cr4a1_zb6_dtpven` | ZB6_DTPVEN | texto (max 500) |  | CU |
| `cr4a1_zb6_dtrecp` | ZB6_DTRECP | texto (max 500) |  | CU |
| `cr4a1_zb6_emissa` | ZB6_EMISSA | texto (max 500) |  | CU |
| `cr4a1_zb6_entrdt` | ZB6_ENTRDT | texto (max 500) |  | CU |
| `cr4a1_zb6_envio` | ZB6_ENVIO | texto (max 500) |  | CU |
| `cr4a1_zb6_envmed` | ZB6_ENVMED | texto (max 500) |  | CU |
| `cr4a1_zb6_envp` | ZB6_ENVP | texto (max 500) |  | CU |
| `cr4a1_zb6_equipa` | ZB6_EQUIPA | texto (max 500) |  | CU |
| `cr4a1_zb6_filial` | ZB6_FILIAL | texto (max 500) |  | CU |
| `cr4a1_zb6_fora` | ZB6_FORA | texto (max 500) |  | CU |
| `cr4a1_zb6_kw` | ZB6_KW | texto (max 500) |  | CU |
| `cr4a1_zb6_loja` | ZB6_LOJA | texto (max 500) |  | CU |
| `cr4a1_zb6_nfdevo` | ZB6_NFDEVO | texto (max 500) |  | CU |
| `cr4a1_zb6_nfpro2` | ZB6_NFPRO2 | texto (max 500) |  | CU |
| `cr4a1_zb6_nfpro3` | ZB6_NFPRO3 | texto (max 500) |  | CU |
| `cr4a1_zb6_nfpro4` | ZB6_NFPRO4 | texto (max 500) |  | CU |
| `cr4a1_zb6_nfpro5` | ZB6_NFPRO5 | texto (max 500) |  | CU |
| `cr4a1_zb6_nfpro6` | ZB6_NFPRO6 | texto (max 500) |  | CU |
| `cr4a1_zb6_nfprod` | ZB6_NFPROD | texto (max 500) |  | CU |
| `cr4a1_zb6_nfser2` | ZB6_NFSER2 | texto (max 500) |  | CU |
| `cr4a1_zb6_nfser3` | ZB6_NFSER3 | texto (max 500) |  | CU |
| `cr4a1_zb6_nfser4` | ZB6_NFSER4 | texto (max 500) |  | CU |
| `cr4a1_zb6_nfser5` | ZB6_NFSER5 | texto (max 500) |  | CU |
| `cr4a1_zb6_nfser6` | ZB6_NFSER6 | texto (max 500) |  | CU |
| `cr4a1_zb6_nfserv` | ZB6_NFSERV | texto (max 500) |  | CU |
| `cr4a1_zb6_ngt` | ZB6_NGT | texto (max 500) |  | CU |
| `cr4a1_zb6_nne` | ZB6_NNE | texto (max 500) |  | CU |
| `cr4a1_zb6_nummed` | ZB6_NUMMED | texto (max 500) |  | CU |
| `cr4a1_zb6_obstec` | ZB6_OBSTEC | texto (max 500) |  | CU |
| `cr4a1_zb6_ordem` | ZB6_ORDEM | texto (max 500) |  | CU |
| `cr4a1_zb6_oskair` | ZB6_OSKAIR | texto (max 500) |  | CU |
| `cr4a1_zb6_pcserv` | ZB6_PCSERV | texto (max 500) |  | CU |
| `cr4a1_zb6_pdnfre` | ZB6_PDNFRE | texto (max 500) |  | CU |
| `cr4a1_zb6_peri10` | ZB6_PERI10 | texto (max 500) |  | CU |
| `cr4a1_zb6_peri11` | ZB6_PERI11 | texto (max 500) |  | CU |
| `cr4a1_zb6_peri12` | ZB6_PERI12 | texto (max 500) |  | CU |
| `cr4a1_zb6_peri13` | ZB6_PERI13 | texto (max 500) |  | CU |
| `cr4a1_zb6_peri14` | ZB6_PERI14 | texto (max 500) |  | CU |
| `cr4a1_zb6_peri15` | ZB6_PERI15 | texto (max 500) |  | CU |
| `cr4a1_zb6_peri16` | ZB6_PERI16 | texto (max 500) |  | CU |
| `cr4a1_zb6_peri17` | ZB6_PERI17 | texto (max 500) |  | CU |
| `cr4a1_zb6_peri18` | ZB6_PERI18 | texto (max 500) |  | CU |
| `cr4a1_zb6_perit1` | ZB6_PERIT1 | texto (max 500) |  | CU |
| `cr4a1_zb6_perit2` | ZB6_PERIT2 | texto (max 500) |  | CU |
| `cr4a1_zb6_perit3` | ZB6_PERIT3 | texto (max 500) |  | CU |
| `cr4a1_zb6_perit4` | ZB6_PERIT4 | texto (max 500) |  | CU |
| `cr4a1_zb6_perit5` | ZB6_PERIT5 | texto (max 500) |  | CU |
| `cr4a1_zb6_perit6` | ZB6_PERIT6 | texto (max 500) |  | CU |
| `cr4a1_zb6_perit7` | ZB6_PERIT7 | texto (max 500) |  | CU |
| `cr4a1_zb6_perit8` | ZB6_PERIT8 | texto (max 500) |  | CU |
| `cr4a1_zb6_perit9` | ZB6_PERIT9 | texto (max 500) |  | CU |
| `cr4a1_zb6_prazc` | ZB6_PRAZC | texto (max 500) |  | CU |
| `cr4a1_zb6_prazo` | ZB6_PRAZO | texto (max 500) |  | CU |
| `cr4a1_zb6_priori` | ZB6_PRIORI | texto (max 500) |  | CU |
| `cr4a1_zb6_proble` | ZB6_PROBLE | texto (max 500) |  | CU |
| `cr4a1_zb6_propos` | ZB6_PROPOS | texto (max 500) |  | CU |
| `cr4a1_zb6_relatorioid` | ZB6_Relatorio | GUID | sistema | C- |
| `cr4a1_zb6_respen` | ZB6_RESPEN | texto (max 500) |  | CU |
| `cr4a1_zb6_rpm` | ZB6_RPM | texto (max 100) |  | CU |
| `cr4a1_zb6_servico` | ZB6_Servico | texto (max 100) |  | CU |
| `cr4a1_zb6_tipose` | ZB6_TIPOSE | texto (max 500) |  | CU |
| `cr4a1_zb6_totpro` | ZB6_TOTPRO | texto (max 500) |  | CU |
| `cr4a1_zb6_vlmatc` | ZB6_VLMATC | texto (max 500) |  | CU |
| `cr4a1_zb6_vlnfm` | ZB6_VLNFM | texto (max 500) |  | CU |
| `cr4a1_zb6_vlnfm1` | ZB6_VLNFM1 | texto (max 500) |  | CU |
| `cr4a1_zb6_vlnfm2` | ZB6_VLNFM2 | texto (max 500) |  | CU |
| `cr4a1_zb6_vlnfm4` | ZB6_VLNFM4 | texto (max 500) |  | CU |
| `cr4a1_zb6_vlnfm5` | ZB6_VLNFM5 | texto (max 500) |  | CU |
| `cr4a1_zb6_vlnfm6` | ZB6_VLNFM6 | texto (max 500) |  | CU |
| `cr4a1_zb6_vlnfs` | ZB6_VLNFS | texto (max 500) |  | CU |
| `cr4a1_zb6_vlnfs1` | ZB6_VLNFS1 | texto (max 500) |  | CU |
| `cr4a1_zb6_vlnfs2` | ZB6_VLNFS2 | texto (max 500) |  | CU |
| `cr4a1_zb6_vlnfs3` | ZB6_VLNFS3 | texto (max 500) |  | CU |
| `cr4a1_zb6_vlnfs4` | ZB6_VLNFS4 | texto (max 500) |  | CU |
| `cr4a1_zb6_vlnfs5` | ZB6_VLNFS5 | texto (max 500) |  | CU |
| `cr4a1_zb6_vlriva` | ZB6_VLRIVA | texto (max 500) |  | CU |
| `cr4a1_zb6_vlrser` | ZB6_VLRSER | texto (max 500) |  | CU |
| `cr4a1_zb6_vlserc` | ZB6_VLSERC | texto (max 500) |  | CU |
| `cr4a1_zb6_xacomp` | ZB6_XACOMP | texto (max 500) |  | CU |
| `cr4a1_zb6_xapspc` | ZB6_XAPSPC | texto (max 500) |  | CU |
| `cr4a1_zb6_xbmc` | ZB6_XBMC | texto (max 500) |  | CU |
| `cr4a1_zb6_xchama` | ZB6_XCHAMA | texto (max 500) |  | CU |
| `cr4a1_zb6_xclint` | ZB6_XCLINT | texto (max 500) |  | CU |
| `cr4a1_zb6_xdesig` | ZB6_XDESIG | texto (max 500) |  | CU |
| `cr4a1_zb6_xdfrs1` | ZB6_XDFRS1 | texto (max 500) |  | CU |
| `cr4a1_zb6_xdfrs2` | ZB6_XDFRS2 | texto (max 500) |  | CU |
| `cr4a1_zb6_xdfrs3` | ZB6_XDFRS3 | texto (max 500) |  | CU |
| `cr4a1_zb6_xdfrs4` | ZB6_XDFRS4 | texto (max 500) |  | CU |
| `cr4a1_zb6_xdfrs5` | ZB6_XDFRS5 | texto (max 500) |  | CU |
| `cr4a1_zb6_xdtatu` | ZB6_XDTATU | texto (max 500) |  | CU |
| `cr4a1_zb6_xdtcor` | ZB6_XDTCOR | texto (max 500) |  | CU |
| `cr4a1_zb6_xdtenv` | ZB6_XDTENV | texto (max 500) |  | CU |
| `cr4a1_zb6_xdtini` | ZB6_XDTINI | texto (max 500) |  | CU |
| `cr4a1_zb6_xdtope` | ZB6_XDTOPE | texto (max 500) |  | CU |
| `cr4a1_zb6_xdtpds` | ZB6_XDTPDS | texto (max 500) |  | CU |
| `cr4a1_zb6_xdtpma` | ZB6_XDTPMA | texto (max 500) |  | CU |
| `cr4a1_zb6_xdtpre` | ZB6_XDTPRE | texto (max 500) |  | CU |
| `cr4a1_zb6_xdtprf` | ZB6_XDTPRF | texto (max 500) |  | CU |
| `cr4a1_zb6_xdtprm` | ZB6_XDTPRM | texto (max 500) |  | CU |
| `cr4a1_zb6_xdtprs` | ZB6_XDTPRS | texto (max 500) |  | CU |
| `cr4a1_zb6_xdtpse` | ZB6_XDTPSE | texto (max 500) |  | CU |
| `cr4a1_zb6_xdtrec` | ZB6_XDTREC | texto (max 500) |  | CU |
| `cr4a1_zb6_xdtven` | ZB6_XDTVEN | texto (max 500) |  | CU |
| `cr4a1_zb6_xfrs1` | ZB6_XFRS1 | texto (max 500) |  | CU |
| `cr4a1_zb6_xfrs2` | ZB6_XFRS2 | texto (max 500) |  | CU |
| `cr4a1_zb6_xfrs3` | ZB6_XFRS3 | texto (max 500) |  | CU |
| `cr4a1_zb6_xfrs4` | ZB6_XFRS4 | texto (max 500) |  | CU |
| `cr4a1_zb6_xfrs5` | ZB6_XFRS5 | texto (max 500) |  | CU |
| `cr4a1_zb6_xhisto` | ZB6_XHISTO | texto (max 500) |  | CU |
| `cr4a1_zb6_xinter` | ZB6_XINTER | texto (max 500) |  | CU |
| `cr4a1_zb6_xkanpc` | ZB6_XKANPC | texto (max 500) |  | CU |
| `cr4a1_zb6_xkva` | ZB6_XKVA | texto (max 500) |  | CU |
| `cr4a1_zb6_xnfenc` | ZB6_XNFENC | texto (max 500) |  | CU |
| `cr4a1_zb6_xnpdcm` | ZB6_XNPDCM | texto (max 500) |  | CU |
| `cr4a1_zb6_xnpdcs` | ZB6_XNPDCS | texto (max 500) |  | CU |
| `cr4a1_zb6_xnumch` | ZB6_XNUMCH | texto (max 500) |  | CU |
| `cr4a1_zb6_xnumre` | ZB6_XNUMRE | texto (max 500) |  | CU |
| `cr4a1_zb6_xopec` | ZB6_XOPEC | texto (max 500) |  | CU |
| `cr4a1_zb6_xoppec` | ZB6_XOPPEC | texto (max 500) |  | CU |
| `cr4a1_zb6_xorca` | ZB6_XORCA | texto (max 500) |  | CU |
| `cr4a1_zb6_xorcst` | ZB6_XORCST | texto (max 500) |  | CU |
| `cr4a1_zb6_xorcto` | ZB6_XORCTO | texto (max 500) |  | CU |
| `cr4a1_zb6_xprevf` | ZB6_XPREVF | texto (max 500) |  | CU |
| `cr4a1_zb6_xprevs` | ZB6_XPREVS | texto (max 500) |  | CU |
| `cr4a1_zb6_xprmpc` | ZB6_XPRMPC | texto (max 500) |  | CU |
| `cr4a1_zb6_xpropc` | ZB6_XPROPC | texto (max 500) |  | CU |
| `cr4a1_zb6_xprspc` | ZB6_XPRSPC | texto (max 500) |  | CU |
| `cr4a1_zb6_xrejei` | ZB6_XREJEI | texto (max 500) |  | CU |
| `cr4a1_zb6_xtempo` | ZB6_XTEMPO | texto (max 500) |  | CU |
| `cr4a1_zb6_xtotf` | ZB6_XTOTF | texto (max 500) |  | CU |
| `cr4a1_zb6_xvalid` | ZB6_XVALID | texto (max 500) |  | CU |
| `cr4a1_zb6_xvlriv` | ZB6_XVLRIV | texto (max 500) |  | CU |
| `createdby` | Criada Por | referência (lookup) → systemuser |  | -- |
| `createdbyname` |  | texto (max 100) |  | -- |
| `createdon` | Data de Criação | data/hora |  | -- |
| `createdonbehalfby` | Criado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `createdonbehalfbyname` |  | texto (max 100) |  | -- |
| `importsequencenumber` | Número de Sequência de Importação | inteiro |  | C- |
| `modifiedby` | Modificado Por | referência (lookup) → systemuser |  | -- |
| `modifiedbyname` |  | texto (max 100) |  | -- |
| `modifiedon` | Data de Modificação | data/hora |  | -- |
| `modifiedonbehalfby` | Modificado por (Delegado) | referência (lookup) → systemuser |  | -- |
| `modifiedonbehalfbyname` |  | texto (max 100) |  | -- |
| `overriddencreatedon` | Registro Criado em | data/hora |  | C- |
| `ownerid` | Proprietário | proprietário → systemuser, team | sistema | CU |
| `owneridname` |  | texto (max 100) | sistema | -- |
| `owneridtype` |  | EntityName | sistema | CU |
| `owningbusinessunit` | Unidade de Negócios Proprietária | referência (lookup) → businessunit |  | -- |
| `owningbusinessunitname` |  | texto (max 100) | sistema | -- |
| `owningteam` | Equipe Proprietária | referência (lookup) → team |  | -- |
| `owninguser` | Usuário Proprietário | referência (lookup) → systemuser |  | -- |
| `statecode` | Status | estado (state) | sistema | -U |
| `statuscode` | Razão do Status | status (razão) |  | CU |
| `timezoneruleversionnumber` | Número de Versão da Regra de Fuso Horário | inteiro |  | CU |
| `utcconversiontimezonecode` | Código de Fuso Horário de Conversão de UTC | inteiro |  | CU |
| `versionnumber` | Número da Versão | inteiro (64) |  | -- |

### Conjuntos de opções

- **`statecode`** (Status): 0=Ativo(a); 1=Inativo(a)
- **`statuscode`** (Razão do Status): 1=Ativo(a); 2=Inativo(a)

### Relações N:1



---

# SharePoint


<a id="sp-checklist-veicular"></a>
## CheckList_Veicular

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `931cb5f5-e4da-401b-a4b4-5fa25a807919` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | placa | string |  |
| `Porte_x0020_do_x0020_Ve_x00ed_cu#Id` | Porte do Veículo Id | integer/int64 |  |
| `Porte_x0020_do_x0020_Ve_x00ed_cu` | Porte do Veículo | object |  |
| `veiculo` | autorizado | string |  |
| `Observation` | Observation | string |  |
| `field_1` | data_check | string |  |
| `field_2` | nome_check | string |  |
| `field_3` | matricula | string |  |
| `field_4` | quilometragem | string |  |
| `field_5` | Unidade | string |  |
| `field_6#Id` | 1.Documento Do Veículo (IPVA/RT'S/TACÓGRAFO) Id | integer/int64 |  |
| `field_6` | 1.Documento Do Veículo (IPVA/RT'S/TACÓGRAFO) | object |  |
| `field_7#Id` | 2.Alarme Id | integer/int64 |  |
| `field_7` | 2.Alarme | object |  |
| `field_8#Id` | 3.Bateria (Luzes no painel) Id | integer/int64 |  |
| `field_8` | 3.Bateria (Luzes no painel) | object |  |
| `field_9#Id` | 4.Buzina (Sonoridade) Id | integer/int64 |  |
| `field_9` | 4.Buzina (Sonoridade) | object |  |
| `field_10#Id` | 5.Chave De Roda (Condição das bocas da chave e presença) Id | integer/int64 |  |
| `field_10` | 5.Chave De Roda (Condição das bocas da chave e presença) | object |  |
| `field_11#Id` | 6.Macaco (lubrificação, mecanismos de bombeamento, preservação das roscas e presença) Id | integer/int64 |  |
| `field_11` | 6.Macaco (lubrificação, mecanismos de bombeamento, preservação das roscas e presença) | object |  |
| `field_12#Id` | 7.Triângulo (luminosidade, maleabilidade e presença) Id | integer/int64 |  |
| `field_12` | 7.Triângulo (luminosidade, maleabilidade e presença) | object |  |
| `field_13#Id` | 8.Farol Alto (intensidade correspondente) Id | integer/int64 |  |
| `field_13` | 8.Farol Alto (intensidade correspondente) | object |  |
| `field_14#Id` | 9.Farol Baixo (intensidade correspondente) Id | integer/int64 |  |
| `field_14` | 9.Farol Baixo (intensidade correspondente) | object |  |
| `field_15#Id` | 10.Fechamento Das Janelas (botões de acionamento) Id | integer/int64 |  |
| `field_15` | 10.Fechamento Das Janelas (botões de acionamento) | object |  |
| `field_16#Id` | 11.Freios (condições dos pedais) Id | integer/int64 |  |
| `field_16` | 11.Freios (condições dos pedais) | object |  |
| `field_17#Id` | 12.Limpador De Pára-Brisa (flexibilidade, pressão,ruido e eficiencia de limpeza) Id | integer/int64 |  |
| `field_17` | 12.Limpador De Pára-Brisa (flexibilidade, pressão,ruido e eficiencia de limpeza) | object |  |
| `field_18#Id` | 13.Logotipo (legivel, sem rasgo e presença) Id | integer/int64 |  |
| `field_18` | 13.Logotipo (legivel, sem rasgo e presença) | object |  |
| `field_19#Id` | 14.Luz De Freio (Intensidade correspondente) Id | integer/int64 |  |
| `field_19` | 14.Luz De Freio (Intensidade correspondente) | object |  |
| `field_20#Id` | 15.Luz De Ré (Intensidade correspondente) Id | integer/int64 |  |
| `field_20` | 15.Luz De Ré (Intensidade correspondente) | object |  |
| `field_21#Id` | 16.Luzes Do Painel (Intensidade correspondente) Id | integer/int64 |  |
| `field_21` | 16.Luzes Do Painel (Intensidade correspondente) | object |  |
| `field_22#Id` | 17.Farolete (Intensidade correspondente) Id | integer/int64 |  |
| `field_22` | 17.Farolete (Intensidade correspondente) | object |  |
| `field_23#Id` | 18.Pisca Alerta (botões de acionamento) Id | integer/int64 |  |
| `field_23` | 18.Pisca Alerta (botões de acionamento) | object |  |
| `field_24#Id` | 19.Pneu Reserva (preservação, enchimento e presença) Id | integer/int64 |  |
| `field_24` | 19.Pneu Reserva (preservação, enchimento e presença) | object |  |
| `field_25#Id` | 20.Pneus (Estado/Calibragem) Id | integer/int64 |  |
| `field_25` | 20.Pneus (Estado/Calibragem) | object |  |
| `field_26#Id` | 21.Portas (acionamento das travas) Id | integer/int64 |  |
| `field_26` | 21.Portas (acionamento das travas) | object |  |
| `field_27#Id` | 22.Retrovisor - Direito/Esquerdo (condição do regulador, integridade) Id | integer/int64 |  |
| `field_27` | 22.Retrovisor - Direito/Esquerdo (condição do regulador, integridade) | object |  |
| `field_28#Id` | 23.Retrovisor Interno (regulador e integridade) Id | integer/int64 |  |
| `field_28` | 23.Retrovisor Interno (regulador e integridade) | object |  |
| `field_29#Id` | 24.Espelho do retrovisor - Direito/Esquerdo (integridade) Id | integer/int64 |  |
| `field_29` | 24.Espelho do retrovisor - Direito/Esquerdo (integridade) | object |  |
| `field_30#Id` | 25.Revisão/Manutenção (documentação presente) Id | integer/int64 |  |
| `field_30` | 25.Revisão/Manutenção (documentação presente) | object |  |
| `field_31#Id` | 26.Setas (botão de acionamento) Id | integer/int64 |  |
| `field_31` | 26.Setas (botão de acionamento) | object |  |
| `field_32#Id` | 27.Água Do Limpador (volume de agua no reservatorio) Id | integer/int64 |  |
| `field_32` | 27.Água Do Limpador (volume de agua no reservatorio) | object |  |
| `field_33#Id` | 28.Nível Do Óleo Do Motor (volume de oleo) Id | integer/int64 |  |
| `field_33` | 28.Nível Do Óleo Do Motor (volume de oleo) | object |  |
| `field_34#Id` | 29.Óleo Do Freio volume de oleo) Id | integer/int64 |  |
| `field_34` | 29.Óleo Do Freio volume de oleo) | object |  |
| `field_35#Id` | 30.Nível Da Água Do Radiador (volume de agua) Id | integer/int64 |  |
| `field_35` | 30.Nível Da Água Do Radiador (volume de agua) | object |  |
| `field_36#Id` | 31.Limpador De Pára-Brisa/Exguinho (acionamento) Id | integer/int64 |  |
| `field_36` | 31.Limpador De Pára-Brisa/Exguinho (acionamento) | object |  |
| `field_37#Id` | 32.Freio De Estacionamento (engate) Id | integer/int64 |  |
| `field_37` | 32.Freio De Estacionamento (engate) | object |  |
| `field_38#Id` | 33.Tampa Do Radiador (Vedação adequada; integridade física; pressão de abertura) Id | integer/int64 |  |
| `field_38` | 33.Tampa Do Radiador (Vedação adequada; integridade física; pressão de abertura) | object |  |
| `field_39#Id` | 34.Fita Refletiva Lateral (Luminosidade, rasuras, presença) Id | integer/int64 |  |
| `field_39` | 34.Fita Refletiva Lateral (Luminosidade, rasuras, presença) | object |  |
| `field_40#Id` | 35.Adesivo De Identificação Capacidade De Carga (Presença e legibilidade) Id | integer/int64 |  |
| `field_40` | 35.Adesivo De Identificação Capacidade De Carga (Presença e legibilidade) | object |  |
| `field_41#Id` | 36.Adesivo Veículo Rastreado Por Satélite (Presença e legibilidade) Id | integer/int64 |  |
| `field_41` | 36.Adesivo Veículo Rastreado Por Satélite (Presença e legibilidade) | object |  |
| `field_42#Id` | 37.Adesivo Kairós Motores (Presença e legibilidade) Id | integer/int64 |  |
| `field_42` | 37.Adesivo Kairós Motores (Presença e legibilidade) | object |  |
| `field_43#Id` | 38.Joystick (Estado do cabo; controle e bateria) Id | integer/int64 |  |
| `field_43` | 38.Joystick (Estado do cabo; controle e bateria) | object |  |
| `field_44#Id` | 39.Gancho - Integridade do gancho (rachaduras; desgaste excessivo, outros danos) Id | integer/int64 |  |
| `field_44` | 39.Gancho - Integridade do gancho (rachaduras; desgaste excessivo, outros danos) | object |  |
| `field_45#Id` | 40.Trava De Segurança Do Gancho (Mecanismo de acionamento, eficiência da trava) Id | integer/int64 |  |
| `field_45` | 40.Trava De Segurança Do Gancho (Mecanismo de acionamento, eficiência da trava) | object |  |
| `field_46#Id` | 41.Estrôpos, Cabos, Manilhas (desgaste a corrosão, trincas, rasgos e cortes) Id | integer/int64 |  |
| `field_46` | 41.Estrôpos, Cabos, Manilhas (desgaste a corrosão, trincas, rasgos e cortes) | object |  |
| `field_47#Id` | 42.Acionamentos (Integridade dos controles) Id | integer/int64 |  |
| `field_47` | 42.Acionamentos (Integridade dos controles) | object |  |
| `field_48#Id` | 43.Patolas (Lubrificação) Id | integer/int64 |  |
| `field_48` | 43.Patolas (Lubrificação) | object |  |
| `field_49#Id` | 44.Cinta - Não Apresenta Sinais De Perfuração, Abrasão Ou Corte  Id | integer/int64 |  |
| `field_49` | 44.Cinta - Não Apresenta Sinais De Perfuração, Abrasão Ou Corte  | object |  |
| `field_50#Id` | 45.Cinta - Não Apresenta Cortes Nas Laterais Id | integer/int64 |  |
| `field_50` | 45.Cinta - Não Apresenta Cortes Nas Laterais | object |  |
| `field_51#Id` | 46.Cinta - As Costuras Das Cintas não Apresentam Cortes Id | integer/int64 |  |
| `field_51` | 46.Cinta - As Costuras Das Cintas não Apresentam Cortes | object |  |
| `field_52#Id` | 47.Cinta - As Alças Dos Olhais não Apresentam Rupturas Id | integer/int64 |  |
| `field_52` | 47.Cinta - As Alças Dos Olhais não Apresentam Rupturas | object |  |
| `field_53#Id` | 48.Cinta - Não Apresentam Rasgos Id | integer/int64 |  |
| `field_53` | 48.Cinta - Não Apresentam Rasgos | object |  |
| `field_54#Id` | 49.Cinta - Não Apresentam Desgastes Excessivos Id | integer/int64 |  |
| `field_54` | 49.Cinta - Não Apresentam Desgastes Excessivos | object |  |
| `field_55#Id` | 50.Cinta - A Engrenagem Da Catraca está Em Bom Estado? Id | integer/int64 |  |
| `field_55` | 50.Cinta - A Engrenagem Da Catraca está Em Bom Estado? | object |  |
| `field_56#Id` | 51.Cinta - A Engrenagem Da Catraca Não está Travando Id | integer/int64 |  |
| `field_56` | 51.Cinta - A Engrenagem Da Catraca Não está Travando | object |  |
| `field_57#Id` | 52.Cinta -  Armazenamento  (organizado?) Id | integer/int64 |  |
| `field_57` | 52.Cinta -  Armazenamento  (organizado?) | object |  |
| `field_58#Id` | 53.Cinta - Etiquetas de validade (legivel?) Id | integer/int64 |  |
| `field_58` | 53.Cinta - Etiquetas de validade (legivel?) | object |  |
| `field_59#Id` | 54.Cinto De Segurança (fixação da trava,sinais de desgaste iniciais no tecido, fecho e mola de retração) Id | integer/int64 |  |
| `field_59` | 54.Cinto De Segurança (fixação da trava,sinais de desgaste iniciais no tecido, fecho e mola de retração) | object |  |
| `field_60#Id` | 55.Extintor De Incêndio (vencimento, acessibilidade, medidorde pressão e gatilho de acionamento) Id | integer/int64 |  |
| `field_60` | 55.Extintor De Incêndio (vencimento, acessibilidade, medidorde pressão e gatilho de acionamento) | object |  |
| `field_61#Id` | Sem Item (1) Id | integer/int64 |  |
| `field_61` | Sem Item (1) | object |  |
| `field_62#Id` | Sem Item (2) Id | integer/int64 |  |
| `field_62` | Sem Item (2) | object |  |
| `field_63#Id` | Sem Item (3) Id | integer/int64 |  |
| `field_63` | Sem Item (3) | object |  |
| `DataSSMA` | DataSSMA | string |  |
| `ObsSSMA` | ObsSSMA | string |  |
| `Created` | Criado | string/date-time |  |
| `Trava_Roda#Id` | Trava_Roda Id | integer/int64 |  |
| `Trava_Roda` | Trava_Roda | object |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |


<a id="sp-doc-técnicos"></a>
## Doc Técnicos

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `73cb1ed5-29d9-471d-a207-e09399de426b` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Título | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |
| `MediaServiceOCR` | Extracted Text | string |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `MediaServiceImageTags#WssId` | Marcações de imagem WssId | array |  |
| `MediaServiceImageTags@odata.type` | MediaServiceImageTags | string |  |
| `MediaServiceImageTags` | Marcações de imagem | array |  |
| `MediaServiceLocation` | Location | string |  |
| `Created` | Criado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `CheckoutUser#Claims` | Com Check-out para Claims | string |  |
| `CheckoutUser` | Com Check-out para | object |  |


<a id="sp-doc-técnicos-1"></a>
## Doc Técnicos_1

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `73cb1ed5-29d9-471d-a207-e09399de426b` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Título | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |
| `MediaServiceOCR` | Extracted Text | string |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `MediaServiceImageTags#WssId` | Marcações de imagem WssId | array |  |
| `MediaServiceImageTags@odata.type` | MediaServiceImageTags | string |  |
| `MediaServiceImageTags` | Marcações de imagem | array |  |
| `MediaServiceLocation` | Location | string |  |
| `Created` | Criado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `CheckoutUser#Claims` | Com Check-out para Claims | string |  |
| `CheckoutUser` | Com Check-out para | object |  |


<a id="sp-doc-técnicos-2"></a>
## Doc Técnicos_2

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `73cb1ed5-29d9-471d-a207-e09399de426b` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Título | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |
| `MediaServiceOCR` | Extracted Text | string |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `MediaServiceImageTags#WssId` | Marcações de imagem WssId | array |  |
| `MediaServiceImageTags@odata.type` | MediaServiceImageTags | string |  |
| `MediaServiceImageTags` | Marcações de imagem | array |  |
| `MediaServiceLocation` | Location | string |  |
| `Created` | Criado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `CheckoutUser#Claims` | Com Check-out para Claims | string |  |
| `CheckoutUser` | Com Check-out para | object |  |


<a id="sp-doc-técnicos-3"></a>
## Doc Técnicos_3

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `73cb1ed5-29d9-471d-a207-e09399de426b` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Título | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |
| `MediaServiceOCR` | Extracted Text | string |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `MediaServiceImageTags#WssId` | Marcações de imagem WssId | array |  |
| `MediaServiceImageTags@odata.type` | MediaServiceImageTags | string |  |
| `MediaServiceImageTags` | Marcações de imagem | array |  |
| `MediaServiceLocation` | Location | string |  |
| `Created` | Criado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `CheckoutUser#Claims` | Com Check-out para Claims | string |  |
| `CheckoutUser` | Com Check-out para | object |  |


<a id="sp-doc-medro-slz"></a>
## Doc.Medro.SLZ

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores` |
| Tabela / Id | `90c9257e-83e9-4c5a-9bab-e5ddcbccc527` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Título | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |
| `Nome_exibicao` | Nome_exibicao | string |  |
| `xViabi` | xViabi | string |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `Created` | Criado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `CheckoutUser#Claims` | Com Check-out para Claims | string |  |
| `CheckoutUser` | Com Check-out para | object |  |


<a id="sp-lista-auxiliar---clientes-medro"></a>
## Lista Auxiliar - Clientes Medro

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores` |
| Tabela / Id | `781a8888-1db9-49ba-a946-ddd704e4a8c1` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Title | string | sim |
| `V_x00ed_deos` | Sigla | string |  |
| `Informa_x00e7__x00f5_es` | Incluidopor | string |  |
| `Unidade#Id` | Unidade Id | integer/int64 |  |
| `Unidade` | Unidade | object |  |
| `Nome_completo` | Nome_completo | string |  |
| `Created` | Criado | string/date-time |  |
| `Contribuinte` | Contribuinte | string |  |
| `Morada` | Morada | string |  |
| `email` | email | string |  |
| `Prazo` | Prazo | string |  |
| `xStatus` | xStatus | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |
| `ComplianceAssetId` | ID de Recurso de Conformidade | string |  |


<a id="sp-lista-auxiliar---ferramentas"></a>
## Lista Auxiliar - Ferramentas

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores` |
| Tabela / Id | `0789ecbf-03e2-40c8-a9ab-6a220d3e9719` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Título | string | sim |
| `Vida_x00da_til` | Vida Útil | string |  |
| `Valordeaquisi_x00e7__x00e3_o` | Valor de aquisição | string |  |
| `xTipo#Id` | xTipo Id | integer/int64 |  |
| `xTipo` | xTipo | object | sim |
| `Informa_x00e7__x00f5_esadicionai` | Informações adicionais | string |  |
| `Xicone` | Xicone | LargeImage |  |
| `NomeTipo` | NomeTipo | string |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Created` | Criado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |


<a id="sp-lista-auxiliar---ferramentas-por-setor"></a>
## Lista Auxiliar - Ferramentas por Setor

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores` |
| Tabela / Id | `bfa5d3bc-9821-47ae-a06a-a1676e7721fd` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Título | string | sim |
| `Quantidade` | Quantidade | string |  |
| `Vida_x00da_til` | Vida Útil | string |  |
| `ValordeAquisi_x00e7__x00e3_o` | Valor de Aquisição | string |  |
| `Informa_x00e7__x00f5_esAdicionai` | Informações Adicionais | string |  |
| `Datadevincula_x00e7__x00e3_o` | Data de vinculação | string |  |
| `xTipo` | xTipo | string |  |
| `Vinculador` | Vinculador | string |  |
| `Setor` | Setor | string | sim |
| `xicone` | xicone | LargeImage |  |
| `xUnidade` | xUnidade | string |  |
| `NF_aquisi_x00e7__x00e3_o` | NF_aquisição | string |  |
| `xObservacao` | xObservacao | string |  |
| `yValorTotal` | yValorTotal | string |  |
| `Data_vidautil` | Data_vidautil | string |  |
| `xID` | xID | string |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `ValorTotal` | ValorTotal | string |  |
| `xValorTotal` | xValorTotal | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Created` | Criado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |


<a id="sp-lista-auxiliar---inspeção-de-qualidade"></a>
## Lista Auxiliar - Inspeção de Qualidade

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores` |
| Tabela / Id | `d0960fef-9308-4da5-acd7-c49264b98a40` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Cod | string |  |
| `field_1` | Item | string |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Created` | Criado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |


<a id="sp-lista-auxiliar---setores-medro"></a>
## Lista Auxiliar - Setores Medro

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/Listas-Kairsmotores` |
| Tabela / Id | `bed0cbbc-f926-4a95-b64c-cb3f8c290f83` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Título | string |  |
| `Pa_x00ed_s` | País | string |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Created` | Criado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |


<a id="sp-lista-qr-code"></a>
## Lista QR Code

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `91aa6348-0641-4165-8693-00b701ad7085` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Title | string | sim |
| `Cliente` | Cliente | string | sim |
| `Respons_x00e1_vel` | Responsável | string |  |
| `Setor` | Setor | string |  |
| `Minuto_inicial` | Data_inicial | string | sim |
| `Minuto_final` | Data_final | string |  |
| `Observa_x00e7__x00e3_o` | Observação | string |  |
| `Unidade` | Unidade | string |  |
| `Matr_x00ed_cula` | Matrícula | string |  |
| `fCadastro` | fCadastro | string |  |
| `Cx_selec#Id` | Cx_selecao Id | array |  |
| `Cx_selec@odata.type` | Cx_selec | string |  |
| `Cx_selec` | Cx_selecao | array |  |
| `Cx_selec_outros` | Cx_selec_outros | string |  |
| `Erro_Corrigido` | Erro_Corrigido | string |  |
| `Check_aprov#Id` | Check_aprov Id | integer/int64 |  |
| `Check_aprov` | Check_aprov | object |  |
| `Numero_Adv` | Numero_Adv | number/double |  |
| `Numero_NC` | Numero_NC | number/double |  |
| `Parecer_NCAD` | Parecer_NCAD | string |  |
| `Parecerlider` | Parecer lider | string |  |
| `DestinacaoNC` | DestinacaoNC | string |  |
| `Erro_Preenchimento_Medro#Id` | Erro_Preenchimento_Medro Id | integer/int64 |  |
| `Erro_Preenchimento_Medro` | Erro_Preenchimento_Medro | object |  |
| `Reincidente#Id` | Reincidente  Id | integer/int64 |  |
| `Reincidente` | Reincidente  | object |  |
| `N_tratada` | N_tratada | string |  |
| `Isola_x00e7__x00e3_o_pos_estufa` | Isolação_pos_estufa | string |  |
| `Retifica#Id` | Retifica Id | array |  |
| `Retifica@odata.type` | Retifica | string |  |
| `Retifica` | Retifica | array |  |
| `Peritagem_Inicial#Id` | Peritagem_Inicial Id | integer/int64 |  |
| `Peritagem_Inicial` | Peritagem_Inicial | object |  |
| `Laudo_Inicial#Id` | Laudo_Inicial Id | integer/int64 |  |
| `Laudo_Inicial` | Laudo_Inicial | object |  |
| `Proposta#Id` | Proposta Id | integer/int64 |  |
| `Proposta` | Proposta | object |  |
| `Modified` | Modificado | string/date-time |  |
| `Created` | Criado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |
| `ComplianceAssetId` | ID de Recurso de Conformidade | string |  |


<a id="sp-os-45-65k"></a>
## OS 45-65k

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `a00f847b-dedf-4eda-b276-063571039c59` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Title | string | sim |
| `Cliente` | Cliente | string | sim |
| `Respons_x00e1_vel` | Responsável | string |  |
| `Setor` | Setor | string |  |
| `Minuto_inicial` | Minuto_inicial | string | sim |
| `Minuto_final` | Minuto_final | string |  |
| `Observa_x00e7__x00e3_o` | Observação | string |  |
| `Unidade` | Unidade | string |  |
| `Matr_x00ed_cula` | Matrícula | string |  |
| `fCadastro` | fCadastro | string |  |
| `Cx_selec#Id` | Cx_selec Id | array |  |
| `Cx_selec@odata.type` | Cx_selec | string |  |
| `Cx_selec` | Cx_selec | array |  |
| `Check_aprov#Id` | Check_aprov Id | integer/int64 |  |
| `Check_aprov` | Check_aprov | object |  |
| `Erro_Preenchimento_Medro#Id` | Erro_Preenchimento_Medro Id | integer/int64 |  |
| `Erro_Preenchimento_Medro` | Erro_Preenchimento_Medro | object |  |
| `Cx_selec_outros` | Cx_selec_outros | string |  |
| `Erro_Corrigido` | Erro_Corrigido | string |  |
| `Numero_Adv` | Numero_Adv | number/double |  |
| `Numero_NC` | Numero_NC | number/double |  |
| `Parecer_NCAD` | Parecer_NCAD | string |  |
| `Parecerlider` | Parecer lider | string |  |
| `DestinacaoNC` | DestinacaoNC | string |  |
| `Reincidente#Id` | Reincidente  Id | integer/int64 |  |
| `Reincidente` | Reincidente  | object |  |
| `N_tratada` | N_tratada | string |  |
| `Isola_x00e7__x00e3_o_pos_estufa` | Isolação_pos_estufa | string |  |
| `Retifica#Id` | Retifica Id | array |  |
| `Retifica@odata.type` | Retifica | string |  |
| `Retifica` | Retifica | array |  |
| `Peritagem_Inicial#Id` | Peritagem_Inicial Id | integer/int64 |  |
| `Peritagem_Inicial` | Peritagem_Inicial | object |  |
| `Laudo_Inicial#Id` | Laudo_Inicial Id | integer/int64 |  |
| `Laudo_Inicial` | Laudo_Inicial | object |  |
| `Proposta#Id` | Proposta Id | integer/int64 |  |
| `Proposta` | Proposta | object |  |
| `Created` | Criado | string/date-time |  |
| `TipodePintura#Id` | Tipo de Pintura Id | integer/int64 |  |
| `TipodePintura` | Tipo de Pintura | object |  |
| `Status_Montagem` | Status_Montagem | string |  |
| `Modified` | Modificado | string/date-time |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |


<a id="sp-pf-e-iq"></a>
## PF e IQ

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `04e9e0fe-4151-49aa-a9eb-cf06655ea1d1` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Title | string | sim |
| `Created` | Criado | string/date-time |  |
| `Data` | Data | string |  |
| `Check_acoplamento#Id` | Check_acoplamento Id | integer/int64 |  |
| `Check_acoplamento` | Check_acoplamento | object |  |
| `Check_Eixolivre#Id` | Check_Eixolivre Id | integer/int64 |  |
| `Check_Eixolivre` | Check_Eixolivre | object |  |
| `Check_Rolamentos#Id` | Check_Rolamentos Id | integer/int64 |  |
| `Check_Rolamentos` | Check_Rolamentos | object |  |
| `Check_Chaveta#Id` | Check_Chaveta Id | integer/int64 |  |
| `Check_Chaveta` | Check_Chaveta | object |  |
| `Check_AneisFixinternos#Id` | Check_AneisFixinternos Id | integer/int64 |  |
| `Check_AneisFixinternos` | Check_AneisFixinternos | object |  |
| `Check_Olhal#Id` | Check_Olhal Id | integer/int64 |  |
| `Check_Olhal` | Check_Olhal | object |  |
| `Check_Tampadefletora#Id` | Check_Tampadefletora Id | integer/int64 |  |
| `Check_Tampadefletora` | Check_Tampadefletora | object |  |
| `Check_Ventilador#Id` | Check_Ventilador Id | integer/int64 |  |
| `Check_Ventilador` | Check_Ventilador | object |  |
| `Check_Prolongador#Id` | Check_Prolongador Id | integer/int64 |  |
| `Check_Prolongador` | Check_Prolongador | object |  |
| `Check_Pino#Id` | Check_Pino Id | integer/int64 |  |
| `Check_Pino` | Check_Pino | object |  |
| `Check_Protetor#Id` | Check_Protetor Id | integer/int64 |  |
| `Check_Protetor` | Check_Protetor | object |  |
| `Check_PinturaExterna#Id` | Check_PinturaExterna Id | integer/int64 |  |
| `Check_PinturaExterna` | Check_PinturaExterna | object |  |
| `Check_parafusos#Id` | Check_parafusos Id | integer/int64 |  |
| `Check_parafusos` | Check_parafusos | object |  |
| `Check_Veda_x00e7__x00f5_es#Id` | Check_Vedações Id | integer/int64 |  |
| `Check_Veda_x00e7__x00f5_es` | Check_Vedações | object |  |
| `Check_Kitfreio#Id` | Check_Kitfreio Id | integer/int64 |  |
| `Check_Kitfreio` | Check_Kitfreio | object |  |
| `Check_PlacaOS#Id` | Check_PlacaOS Id | integer/int64 |  |
| `Check_PlacaOS` | Check_PlacaOS | object |  |
| `Check_PlacaTAG#Id` | Check_PlacaTAG Id | integer/int64 |  |
| `Check_PlacaTAG` | Check_PlacaTAG | object |  |
| `Check_SeloQuali#Id` | Check_SeloQuali Id | integer/int64 |  |
| `Check_SeloQuali` | Check_SeloQuali | object |  |
| `Check_Resina#Id` | Check_Resina Id | integer/int64 |  |
| `Check_Resina` | Check_Resina | object |  |
| `Check_Caixa#Id` | Check_Caixa Id | integer/int64 |  |
| `Check_Caixa` | Check_Caixa | object |  |
| `Check_Cabosdefor_x00e7_a#Id` | Check_Cabosdeforça Id | integer/int64 |  |
| `Check_Cabosdefor_x00e7_a` | Check_Cabosdeforça | object |  |
| `Check_terminais#Id` | Check_terminais Id | integer/int64 |  |
| `Check_terminais` | Check_terminais | object |  |
| `Check_ponteret#Id` | Check_ponteret Id | integer/int64 |  |
| `Check_ponteret` | Check_ponteret | object |  |
| `Check_isola_x00e7__x00e3_osaida` | Check_isolaçãosaida | string |  |
| `Check_resistenciasaida` | Check_resistenciasaida | string |  |
| `Check_EScaixametalica#Id` | Check_EScaixametalica Id | integer/int64 |  |
| `Check_EScaixametalica` | Check_EScaixametalica | object |  |
| `Check_ESprensacabo#Id` | Check_ESprensacabo Id | integer/int64 |  |
| `Check_ESprensacabo` | Check_ESprensacabo | object |  |
| `Check_EScaboPP#Id` | Check_EScaboPP Id | integer/int64 |  |
| `Check_EScaboPP` | Check_EScaboPP | object |  |
| `Check_ESroscasaux#Id` | Check_ESroscasaux Id | integer/int64 |  |
| `Check_ESroscasaux` | Check_ESroscasaux | object |  |
| `Check_Prato#Id` | Check_ESPrato Id | integer/int64 |  |
| `Check_Prato` | Check_ESPrato | object |  |
| `Check_ESporcacast#Id` | Check_ESporcacast Id | integer/int64 |  |
| `Check_ESporcacast` | Check_ESporcacast | object |  |
| `Check_ESkitfixprato#Id` | Check_ESkitfixprato Id | integer/int64 |  |
| `Check_ESkitfixprato` | Check_ESkitfixprato | object |  |
| `Check_ESroscapontadoeixo#Id` | Check_ESroscapontadoeixo Id | integer/int64 |  |
| `Check_ESroscapontadoeixo` | Check_ESroscapontadoeixo | object |  |
| `Check_ESparafusofixsiroco#Id` | Check_ESparafusofixsiroco Id | integer/int64 |  |
| `Check_ESparafusofixsiroco` | Check_ESparafusofixsiroco | object |  |
| `Check_ESflangesiroco#Id` | Check_ESflangesiroco Id | integer/int64 |  |
| `Check_ESflangesiroco` | Check_ESflangesiroco | object |  |
| `Check_EScubofixdsiroco#Id` | Check_EScubofixdsiroco Id | integer/int64 |  |
| `Check_EScubofixdsiroco` | Check_EScubofixdsiroco | object |  |
| `OBS_qualidade` | OBS_qualidade | string |  |
| `OBS_teste` | OBS_teste | string |  |
| `Test_Isol1` | Test_Isol1 | string |  |
| `Test_Isol2` | Test_Isol2 | string |  |
| `Test_Isol3` | Test_Isol3 | string |  |
| `Test_resR` | Test_resR | string |  |
| `Test_resS` | Test_resS | string |  |
| `Test_resT` | Test_resT | string |  |
| `Test_res1_x002d_4` | Test_res1-4 | string |  |
| `Test_res2_x002d_5` | Test_res2-5 | string |  |
| `Test_res3_x002d_6` | Test_res3-6 | string |  |
| `Test_res7_x002d_10` | Test_res7-10 | string |  |
| `Test_res8_x002d_11` | Test_res8-11 | string |  |
| `Test_res9_x002d_12` | Test_res9-12 | string |  |
| `Test_Tens_x00e3_o` | Test_Tensão | string |  |
| `Test_Rota_x00e7__x00e3_o0` | Test_Rotação | string |  |
| `Test_CorrenteR` | Test_CorrenteR | string |  |
| `Test_CorrenteS` | Test_CorrenteS | string |  |
| `Test_CorrenteT` | Test_CorrenteT | string |  |
| `Test_tempC` | Test_tempC | string |  |
| `Test_TempMancalLA` | Test_TempMancalLA | string |  |
| `Test_TempMancalLOA` | Test_TempMancalLOA | string |  |
| `TestTempEsta` | TestTempEsta | string |  |
| `Test_TempAmbi` | Test_TempAmbi | string |  |
| `Test_VibMLA` | Test_VibHLA | string |  |
| `Test_VibMLOA` | Test_VibVLA | string |  |
| `Filial` | Filial | string |  |
| `Test_VibALA` | Test_VibALA | string |  |
| `Test_VibVLOA` | Test_VibVLOA | string |  |
| `Test_VibHLOA` | Test_VibHLOA | string |  |
| `TestAPROVADO#Id` | TestAPROVADO Id | integer/int64 |  |
| `TestAPROVADO` | TestAPROVADO | object |  |
| `DataInspe_x00e7__x00e3_o` | DataInspeção | string |  |
| `Test_Rotacao` | Test_Rotacao | string |  |
| `Nome` | Nome | string |  |
| `Nome_inspetor` | Nome_inspetor | string |  |
| `ID_ESPELHO` | ID_ESPELHO | number/double |  |
| `Unidade` | Unidade | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |
| `ComplianceAssetId` | ID de Recurso de Conformidade | string |  |
| `Test_VibALOA` | Test_VibALOA | string |  |
| `Check_aprovado#Id` | Check_aprovado Id | integer/int64 |  |
| `Check_aprovado` | Check_aprovado | object |  |


<a id="sp-pf-e-iq---2024"></a>
## PF e IQ - 2024

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `38ac7700-ff59-4a4c-b3de-93e7a0667b78` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Title | string | sim |
| `Data` | Data | string |  |
| `Check_acoplamento#Id` | Check_acoplamento Id | integer/int64 |  |
| `Check_acoplamento` | Check_acoplamento | object |  |
| `Check_Eixolivre#Id` | Check_Eixolivre Id | integer/int64 |  |
| `Check_Eixolivre` | Check_Eixolivre | object |  |
| `Check_Rolamentos#Id` | Check_Rolamentos Id | integer/int64 |  |
| `Check_Rolamentos` | Check_Rolamentos | object |  |
| `Check_Chaveta#Id` | Check_Chaveta Id | integer/int64 |  |
| `Check_Chaveta` | Check_Chaveta | object |  |
| `Check_AneisFixinternos#Id` | Check_AneisFixinternos Id | integer/int64 |  |
| `Check_AneisFixinternos` | Check_AneisFixinternos | object |  |
| `Check_Olhal#Id` | Check_Olhal Id | integer/int64 |  |
| `Check_Olhal` | Check_Olhal | object |  |
| `Check_Tampadefletora#Id` | Check_Tampadefletora Id | integer/int64 |  |
| `Check_Tampadefletora` | Check_Tampadefletora | object |  |
| `Check_Ventilador#Id` | Check_Ventilador Id | integer/int64 |  |
| `Check_Ventilador` | Check_Ventilador | object |  |
| `Check_Prolongador#Id` | Check_Prolongador Id | integer/int64 |  |
| `Check_Prolongador` | Check_Prolongador | object |  |
| `Check_Pino#Id` | Check_Pino Id | integer/int64 |  |
| `Check_Pino` | Check_Pino | object |  |
| `Check_Protetor#Id` | Check_Protetor Id | integer/int64 |  |
| `Check_Protetor` | Check_Protetor | object |  |
| `Check_PinturaExterna#Id` | Check_PinturaExterna Id | integer/int64 |  |
| `Check_PinturaExterna` | Check_PinturaExterna | object |  |
| `Check_parafusos#Id` | Check_parafusos Id | integer/int64 |  |
| `Check_parafusos` | Check_parafusos | object |  |
| `Check_Veda_x00e7__x00f5_es#Id` | Check_Vedações Id | integer/int64 |  |
| `Check_Veda_x00e7__x00f5_es` | Check_Vedações | object |  |
| `Check_Kitfreio#Id` | Check_Kitfreio Id | integer/int64 |  |
| `Check_Kitfreio` | Check_Kitfreio | object |  |
| `Check_PlacaOS#Id` | Check_PlacaOS Id | integer/int64 |  |
| `Check_PlacaOS` | Check_PlacaOS | object |  |
| `Check_PlacaTAG#Id` | Check_PlacaTAG Id | integer/int64 |  |
| `Check_PlacaTAG` | Check_PlacaTAG | object |  |
| `Check_SeloQuali#Id` | Check_SeloQuali Id | integer/int64 |  |
| `Check_SeloQuali` | Check_SeloQuali | object |  |
| `Check_Resina#Id` | Check_Resina Id | integer/int64 |  |
| `Check_Resina` | Check_Resina | object |  |
| `Check_Caixa#Id` | Check_Caixa Id | integer/int64 |  |
| `Check_Caixa` | Check_Caixa | object |  |
| `Check_Cabosdefor_x00e7_a#Id` | Check_Cabosdeforça Id | integer/int64 |  |
| `Check_Cabosdefor_x00e7_a` | Check_Cabosdeforça | object |  |
| `Check_terminais#Id` | Check_terminais Id | integer/int64 |  |
| `Check_terminais` | Check_terminais | object |  |
| `Check_ponteret#Id` | Check_ponteret Id | integer/int64 |  |
| `Check_ponteret` | Check_ponteret | object |  |
| `Check_isola_x00e7__x00e3_osaida` | Check_isolaçãosaida | string |  |
| `Check_resistenciasaida` | Check_resistenciasaida | string |  |
| `Check_EScaixametalica#Id` | Check_EScaixametalica Id | integer/int64 |  |
| `Check_EScaixametalica` | Check_EScaixametalica | object |  |
| `Check_ESprensacabo#Id` | Check_ESprensacabo Id | integer/int64 |  |
| `Check_ESprensacabo` | Check_ESprensacabo | object |  |
| `Check_EScaboPP#Id` | Check_EScaboPP Id | integer/int64 |  |
| `Check_EScaboPP` | Check_EScaboPP | object |  |
| `Check_ESroscasaux#Id` | Check_ESroscasaux Id | integer/int64 |  |
| `Check_ESroscasaux` | Check_ESroscasaux | object |  |
| `Check_Prato#Id` | Check_Prato Id | integer/int64 |  |
| `Check_Prato` | Check_Prato | object |  |
| `Check_ESporcacast#Id` | Check_ESporcacast Id | integer/int64 |  |
| `Check_ESporcacast` | Check_ESporcacast | object |  |
| `Check_ESkitfixprato#Id` | Check_ESkitfixprato Id | integer/int64 |  |
| `Check_ESkitfixprato` | Check_ESkitfixprato | object |  |
| `Check_ESroscapontadoeixo#Id` | Check_ESroscapontadoeixo Id | integer/int64 |  |
| `Check_ESroscapontadoeixo` | Check_ESroscapontadoeixo | object |  |
| `Check_ESparafusofixsiroco#Id` | Check_ESparafusofixsiroco Id | integer/int64 |  |
| `Check_ESparafusofixsiroco` | Check_ESparafusofixsiroco | object |  |
| `Check_ESflangesiroco#Id` | Check_ESflangesiroco Id | integer/int64 |  |
| `Check_ESflangesiroco` | Check_ESflangesiroco | object |  |
| `Check_EScubofixdsiroco#Id` | Check_EScubofixdsiroco Id | integer/int64 |  |
| `Check_EScubofixdsiroco` | Check_EScubofixdsiroco | object |  |
| `OBS_qualidade` | OBS_qualidade | string |  |
| `OBS_teste` | OBS_teste | string |  |
| `Test_Isol1` | Test_Isol1 | string |  |
| `Test_Isol2` | Test_Isol2 | string |  |
| `Test_Isol3` | Test_Isol3 | string |  |
| `Test_resR` | Test_resR | string |  |
| `Test_resS` | Test_resS | string |  |
| `Test_resT` | Test_resT | string |  |
| `Test_res1_x002d_4` | Test_res1-4 | string |  |
| `Test_res2_x002d_5` | Test_res2-5 | string |  |
| `Test_res3_x002d_6` | Test_res3-6 | string |  |
| `Test_res7_x002d_10` | Test_res7-10 | string |  |
| `Test_res8_x002d_11` | Test_res8-11 | string |  |
| `Test_res9_x002d_12` | Test_res9-12 | string |  |
| `Test_Tens_x00e3_o` | Test_Tensão | string |  |
| `Test_Rota_x00e7__x00e3_o0` | Test_Rotação | string |  |
| `Test_CorrenteR` | Test_CorrenteR | string |  |
| `Test_CorrenteS` | Test_CorrenteS | string |  |
| `Test_CorrenteT` | Test_CorrenteT | string |  |
| `Test_tempC` | Test_tempC | string |  |
| `Test_TempMancalLA` | Test_TempMancalLA | string |  |
| `Test_TempMancalLOA` | Test_TempMancalLOA | string |  |
| `TestTempEsta` | TestTempEsta | string |  |
| `Test_TempAmbi` | Test_TempAmbi | string |  |
| `Test_VibMLA` | Test_VibMLA | string |  |
| `Test_VibMLOA` | Test_VibMLOA | string |  |
| `Filial` | Filial | string |  |
| `Test_VibALA` | Test_VibALA | string |  |
| `Test_VibVLOA` | Test_VibVLOA | string |  |
| `Test_VibHLOA` | Test_VibHLOA | string |  |
| `TestAPROVADO#Id` | TestAPROVADO Id | integer/int64 |  |
| `TestAPROVADO` | TestAPROVADO | object |  |
| `DataInspe_x00e7__x00e3_o` | DataInspeção | string |  |
| `Test_Rotacao` | Test_Rotacao | string |  |
| `Nome` | Nome | string |  |
| `Nome_inspetor` | Nome_inspetor | string |  |
| `ID_ESPELHO` | ID_ESPELHO | number/double |  |
| `Unidade` | Unidade | string |  |
| `Created` | Criado | string/date-time |  |
| `Modified` | Modificado | string/date-time |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `Test_VibALOA` | Test_VibALOA | string |  |
| `Check_aprovado#Id` | Check_aprovado Id | integer/int64 |  |
| `Check_aprovado` | Check_aprovado | object |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |


<a id="sp-rds"></a>
## RDS

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `01e52a3f-a115-4dc9-836c-2383db8fe566` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Título | string | sim |
| `TipoSaida` | TipoSaida | string |  |
| `NomeReq` | NomeReq | string |  |
| `SetorRequisitante` | SetorReq | string |  |
| `DataReq` | DataReq | string |  |
| `DataNecess` | DataNecess | string |  |
| `Descri_x00e7__x00e3_o` | Descrição | string |  |
| `Cliente` | Cliente | string |  |
| `Ve_x00ed_culo` | Veículo | string |  |
| `QtdEquip` | QtdEquip | string |  |
| `Atendimento` | Atendimento | string |  |
| `NF` | NF | string |  |
| `Motorista` | Motorista | string |  |
| `Auxiliar` | Auxiliar | string |  |
| `Status` | Status | string |  |
| `DescLOG` | DescLOG | string |  |
| `matricula` | matricula | string |  |
| `Unidade` | Unidade | string |  |
| `DataAtendim` | DataAtendim | string |  |
| `DataProg` | DataConc | string |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Created` | Criado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |


<a id="sp-relatório"></a>
## Relatório

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `88d599be-251f-4289-ac11-c519df0144f9` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Título | string |  |
| `Detalhe` | Detalhe | string |  |
| `Unidade` | Unidade | string |  |
| `DestinAprova` | DestinAprova | string |  |
| `xTitulo` | xTitulo | string |  |
| `Data_Execucao` | Data_Inicial  | string |  |
| `Data_final` | Data_final | string |  |
| `Data_Aprovacao` | Data_Aprovacao | string |  |
| `Aprovador` | Aprovador | string |  |
| `Nota` | Nota | number/double |  |
| `ComentarioX` | ComentarioX | string |  |
| `xMatricula` | xMatricula | string |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Created` | Criado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |


<a id="sp-sac---kairós"></a>
## SAC - Kairós

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `a9b6a146-31c8-478c-a5b7-cc8af2aac64b` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Title | string | sim |
| `Senha` | Senha | string |  |
| `Informa_x00e7__x00e3_o` | Informação | string |  |
| `Resposta` | Resposta | string |  |
| `Data_in` | Data_in | string |  |
| `Data_fin` | Data_fin | string |  |
| `App` | App | string |  |
| `Responsavel` | Responsavel | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Created` | Criado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |
| `ComplianceAssetId` | ID de Recurso de Conformidade | string |  |


<a id="sp-serviexternosaveiro"></a>
## ServiExternosAveiro

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `360f8088-ce6e-437e-ac7c-55acb0820326` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | responsavel | string |  |
| `matricula` | matricula | string |  |
| `datae0` | datae | string/date |  |
| `tipoprovae` | tipoprovae | string |  |
| `notae0` | notae | number/double |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Created` | Criado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |


<a id="sp-serviços-terceirizados"></a>
## Serviços Terceirizados

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `ddad97c9-dbb2-4a77-8796-e4c8dc9681d6` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Título | string | sim |
| `Empresa#Id` | Empresa Id | integer/int64 |  |
| `Empresa` | Empresa | object |  |
| `Orc_Fornecedor` | Orc_Fornecedor | string |  |
| `Data_registro` | Data_registro | string |  |
| `Data_aprovacao_valor` | Data_aprovacao_valor | string |  |
| `Data_retorno` | Data_retorno | string |  |
| `Pe_x00e7_a#Id` | Peça Id | integer/int64 |  |
| `Pe_x00e7_a` | Peça | object |  |
| `Servi_x00e7_o1` | Serviço1 | string |  |
| `ValorServ1` | ValorServ1 | string |  |
| `Servi_x00e7_o2` | Serviço2 | string |  |
| `ValorServ2` | ValorServ2 | string |  |
| `Servi_x00e7_o3` | Serviço3 | string |  |
| `ValorServ3` | ValorServ3 | string |  |
| `Servi_x00e7_o4` | Serviço4 | string |  |
| `ValorServ4` | ValorServ4 | string |  |
| `Servi_x00e7_o5` | Serviço5 | string |  |
| `ValorServ5` | ValorServ5 | string |  |
| `TotalValor` | Total Valor | string |  |
| `Observa_x00e7__x00e3_o` | Observação | string |  |
| `Fabricante` | Fabricante | string |  |
| `Carca_x00e7_a` | Carcaça | string |  |
| `Situa_x00e7__x00e3_o#Id` | Situação Id | integer/int64 |  |
| `Situa_x00e7__x00e3_o` | Situação | object |  |
| `Data_envio` | Data_envio | string |  |
| `N_OR` | N_OR | string |  |
| `Unidade` | Unidade | string |  |
| `Previs_x00e3_oRetorno` | PrevisãoRetorno | string |  |
| `Created` | Criado | string/date-time |  |
| `AvaliacaoRetorno` | AvaliacaoRetorno | string |  |
| `AvaliacaoDescricao` | AvaliacaoDescricao | string |  |
| `AvaliacaoMedida` | AvaliacaoMedida | string |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |


<a id="sp-serviços-terceirizados---pt"></a>
## Serviços Terceirizados - PT

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `073eb7c3-4414-427c-af91-44f312eb20f6` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Título | string | sim |
| `Empresa#Id` | Empresa Id | integer/int64 |  |
| `Empresa` | Empresa | object |  |
| `Orc_Fornecedor` | Orc_Fornecedor | string |  |
| `Data_registro` | Data_registro | string |  |
| `Data_aprovacao_valor` | Data_aprovacao_valor | string |  |
| `Data_retorno` | Data_retorno | string |  |
| `Pe_x00e7_a#Id` | Peça Id | integer/int64 |  |
| `Pe_x00e7_a` | Peça | object |  |
| `Servi_x00e7_o1` | Serviço1 | string |  |
| `ValorServ1` | ValorServ1 | string |  |
| `Servi_x00e7_o2` | Serviço2 | string |  |
| `ValorServ2` | ValorServ2 | string |  |
| `Servi_x00e7_o3` | Serviço3 | string |  |
| `ValorServ3` | ValorServ3 | string |  |
| `Servi_x00e7_o4` | Serviço4 | string |  |
| `ValorServ4` | ValorServ4 | string |  |
| `Servi_x00e7_o5` | Serviço5 | string |  |
| `ValorServ5` | ValorServ5 | string |  |
| `TotalValor` | Total Valor | string |  |
| `Observa_x00e7__x00e3_o` | Observação | string |  |
| `Fabricante` | Fabricante | string |  |
| `Carca_x00e7_a` | Carcaça | string |  |
| `Situa_x00e7__x00e3_o#Id` | Situação Id | integer/int64 |  |
| `Situa_x00e7__x00e3_o` | Situação | object |  |
| `Data_envio` | Data_envio | string |  |
| `N_OR` | N_OR | string |  |
| `Unidade` | Unidade | string |  |
| `Previs_x00e3_oRetorno` | PrevisãoRetorno | string |  |
| `Created` | Criado | string/date-time |  |
| `xUsuario` | xUsuario | string |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |


<a id="sp-serviçosexternosportugal"></a>
## ServiçosExternosPortugal

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `6cea8a86-0109-4e58-8f57-27d1e184ff93` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Título | string | sim |
| `kminicial` | kminicial | number/double |  |
| `kmfinal` | kmfinal | number/double |  |
| `kmtotal` | kmtotal | number/double |  |
| `cliente` | cliente | string |  |
| `morada` | morada | string |  |
| `tiposervi_x00e7_o` | tipo serviço | string |  |
| `hplanejada` | hplanejada | string |  |
| `hrinicial` | hrinicial | string/date-time |  |
| `hrfinal` | hrfinal | string/date-time |  |
| `equipamentosintervencionados` | equipamentosintervencionados | string |  |
| `materialusado` | material usado | string |  |
| `Nor_x00e7_amento` | Norçamento | string |  |
| `Notaencomenda` | Notaencomenda | string |  |
| `faturado` | faturado | boolean |  |
| `status#Id` | status Id | integer/int64 |  |
| `status` | status | object |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Created` | Criado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |


<a id="sp-tarefas-operacionais"></a>
## Tarefas Operacionais

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `1510f797-f931-4031-bc78-3093a89b6f14` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Title | string | sim |
| `Matr_x00ed_cula` | Matrícula | string |  |
| `Informa_x00e7__x00e3_o` | Informacao | string | sim |
| `Data` | Data | string |  |
| `Previs_x00e3_o` | Previsão | string |  |
| `Aprovado#Id` | Aprovado Id | integer/int64 |  |
| `Aprovado` | Aprovado | object |  |
| `Unidade` | Unidade | string |  |
| `Solicitante` | Autorizador | string |  |
| `Comentario` | Comentario | string |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `Created` | Criado | string/date-time |  |
| `Aprovadora` | Aprovadora | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |


<a id="sp-trajetos"></a>
## Trajetos

| | |
|---|---|
| Dataset | `https://aplicativokm.sharepoint.com/sites/KairosMotores` |
| Tabela / Id | `955f595e-ffe9-4af1-8f5b-14cddc36a9bb` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ID` | ID | integer/int64 |  |
| `Title` | Título | string | sim |
| `DataInicio` | DataInicio | string |  |
| `Datafim` | Datafim | string |  |
| `Almo_x00e7_o#Id` | Almoço Id | integer/int64 |  |
| `Almo_x00e7_o` | Almoço | object |  |
| `Cliente` | Cliente | string |  |
| `Observacao` | Observacao | string |  |
| `Qtd_de_Equip` | Qtd_de_Equip | string |  |
| `Matr_x00ed_cula` | Matrícula | string |  |
| `Unidade` | Unidade | string |  |
| `Tipodecoleta#Id` | Tipodecoleta Id | integer/int64 |  |
| `Tipodecoleta` | Tipodecoleta | object |  |
| `NotaFiscal` | NotaFiscal | string |  |
| `NotaFical2` | NotaFical2 | string |  |
| `NotaFical3` | NotaFical3 | string |  |
| `NotaFical4` | NotaFical4 | string |  |
| `NotaFical5` | NotaFical5 | string |  |
| `NotaFical6` | NotaFical6 | string |  |
| `NotaFical7` | NotaFical7 | string |  |
| `NotaFical8` | NotaFical8 | string |  |
| `NotaFical9` | NotaFical9 | string |  |
| `NotaFical10` | NotaFical10 | string |  |
| `NotaFical11` | NotaFical11 | string |  |
| `NotaFical12` | NotaFical12 | string |  |
| `NotaFical13` | NotaFical13 | string |  |
| `NotaFical14` | NotaFical14 | string |  |
| `NotaFical15` | NotaFical15 | string |  |
| `NotaFical16` | NotaFical16 | string |  |
| `Nome` | Nome | string |  |
| `Tipodesaida#Id` | Tipodesaida Id | integer/int64 |  |
| `Tipodesaida` | Tipodesaida | object |  |
| `Autorizador` | Autorizador | string |  |
| `Created` | Criado | string/date-time |  |
| `Buzina#Id` | Buzina Id | integer/int64 |  |
| `Buzina` | Buzina | object |  |
| `ComplianceAssetId` | ID de Ativo de Conformidade | string |  |
| `Modified` | Modificado | string/date-time |  |
| `Author#Claims` | Criado por Claims | string |  |
| `Author` | Criado por | object |  |
| `Editor#Claims` | Modificado por Claims | string |  |
| `Editor` | Modificado por | object |  |


---

# SQL Server (Protheus)


<a id="sql-abf010"></a>
## ABF010

| | |
|---|---|
| Dataset | `45.6.153.1%2c37000,CZLS4F_136240_PR_PD` |
| Tabela / Id | `[dbo].[ABF010]` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ABF_FILIAL` | ABF_FILIAL | string | sim |
| `ABF_EMISSA` | ABF_EMISSA | string | sim |
| `ABF_NUMOS` | ABF_NUMOS | string | sim |
| `ABF_ITEMOS` | ABF_ITEMOS | string | sim |
| `ABF_SEQRC` | ABF_SEQRC | string | sim |
| `ABF_CODTEC` | ABF_CODTEC | string | sim |
| `ABF_SOLIC` | ABF_SOLIC | string | sim |
| `D_E_L_E_T_` | D_E_L_E_T_ | string | sim |
| `R_E_C_N_O_` | R_E_C_N_O_ | integer/int64 | sim |
| `R_E_C_D_E_L_` | R_E_C_D_E_L_ | integer/int64 | sim |
| `ABF_XNUMOS` | ABF_XNUMOS | string | sim |
| `ABF_DESCR` | ABF_DESCR | string | sim |
| `ABF_OBSERV` | ABF_OBSERV | string | sim |
| `ABF_XTIPO` | ABF_XTIPO | string | sim |
| `ABF_USERGI` | ABF_USERGI | string | sim |


<a id="sql-scp010"></a>
## SCP010

| | |
|---|---|
| Dataset | `45.6.153.1%2c37000,CZLS4F_136240_PR_PD` |
| Tabela / Id | `SCP010` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `CP_FILIAL` | CP_FILIAL | string | sim |
| `CP_NUM` | CP_NUM | string | sim |
| `CP_ITEM` | CP_ITEM | string | sim |
| `CP_PRODUTO` | CP_PRODUTO | string | sim |
| `CP_DESCRI` | CP_DESCRI | string | sim |
| `CP_UM` | CP_UM | string | sim |
| `CP_QUANT` | CP_QUANT | number/double | sim |
| `CP_SEGUM` | CP_SEGUM | string | sim |
| `CP_QTSEGUM` | CP_QTSEGUM | number/double | sim |
| `CP_DATPRF` | CP_DATPRF | string | sim |
| `CP_LOCAL` | CP_LOCAL | string | sim |
| `CP_XOSKAIR` | CP_XOSKAIR | string | sim |
| `CP_OBS` | CP_OBS | string | sim |
| `CP_EMISSAO` | CP_EMISSAO | string | sim |
| `CP_OP` | CP_OP | string | sim |
| `CP_CODSOLI` | CP_CODSOLI | string | sim |
| `CP_CC` | CP_CC | string | sim |
| `CP_CONTA` | CP_CONTA | string | sim |
| `CP_OK` | CP_OK | string | sim |
| `CP_PREREQU` | CP_PREREQU | string | sim |
| `CP_SOLICIT` | CP_SOLICIT | string | sim |
| `CP_QUJE` | CP_QUJE | number/double | sim |
| `CP_SEQRC` | CP_SEQRC | string | sim |
| `CP_STATUS` | CP_STATUS | string | sim |
| `CP_NUMOS` | CP_NUMOS | string | sim |
| `CP_ITEMCTA` | CP_ITEMCTA | string | sim |
| `CP_CLVL` | CP_CLVL | string | sim |
| `CP_ITSC` | CP_ITSC | string | sim |
| `CP_USER` | CP_USER | string | sim |
| `CP_STATSA` | CP_STATSA | string | sim |
| `CP_PROJETO` | CP_PROJETO | string | sim |
| `CP_NUMSC` | CP_NUMSC | string | sim |
| `CP_SALBLQ` | CP_SALBLQ | number/double | sim |
| `CP_MEDIDA` | CP_MEDIDA | string | sim |
| `CP_SULCMI` | CP_SULCMI | number/double | sim |
| `CP_SULCMA` | CP_SULCMA | number/double | sim |
| `CP_RATEIO` | CP_RATEIO | string | sim |
| `CP_TIPMOD` | CP_TIPMOD | string | sim |
| `CP_LOTE` | CP_LOTE | string | sim |
| `CP_NRBPIMS` | CP_NRBPIMS | string | sim |
| `CP_CONSEST` | CP_CONSEST | string | sim |
| `CP_VUNIT` | CP_VUNIT | number/double | sim |
| `D_E_L_E_T_` | D_E_L_E_T_ | string | sim |
| `R_E_C_N_O_` | R_E_C_N_O_ | integer/int64 | sim |
| `R_E_C_D_E_L_` | R_E_C_D_E_L_ | integer/int64 | sim |
| `CP_TRT` | CP_TRT | string | sim |
| `CP_XEMPRES` | CP_XEMPRES | string | sim |
| `CP_XCU` | CP_XCU | number/double | sim |
| `CP_ORDSEP` | CP_ORDSEP | string | sim |
| `CP_XPERDA` | CP_XPERDA | string | sim |


<a id="sql-zb6010"></a>
## ZB6010

| | |
|---|---|
| Dataset | `45.6.153.1%2c37000,CZLS4F_136240_PR_PD` |
| Tabela / Id | `ZB6010` |
| Permissão | read-write |

| Coluna | Rótulo | Tipo | Obrig. |
|---|---|---|---|
| `ZB6_FILIAL` | ZB6_FILIAL | string | sim |
| `ZB6_ORDEM` | ZB6_ORDEM | string | sim |
| `ZB6_OSKAIR` | ZB6_OSKAIR | string | sim |
| `ZB6_CONTAT` | ZB6_CONTAT | string | sim |
| `ZB6_DATARE` | ZB6_DATARE | string | sim |
| `ZB6_NFCLIE` | ZB6_NFCLIE | string | sim |
| `ZB6_EMISSA` | ZB6_EMISSA | string | sim |
| `ZB6_DESCNF` | ZB6_DESCNF | string | sim |
| `ZB6_PRODUT` | ZB6_PRODUT | string | sim |
| `ZB6_SERIE` | ZB6_SERIE | string | sim |
| `ZB6_EQUIPA` | ZB6_EQUIPA | string | sim |
| `ZB6_FABRIC` | ZB6_FABRIC | string | sim |
| `ZB6_CV` | ZB6_CV | string | sim |
| `ZB6_KW` | ZB6_KW | string | sim |
| `ZB6_TENSAO` | ZB6_TENSAO | string | sim |
| `ZB6_POLOS` | ZB6_POLOS | string | sim |
| `ZB6_CARCAC` | ZB6_CARCAC | string | sim |
| `ZB6_FC` | ZB6_FC | string | sim |
| `ZB6_OM` | ZB6_OM | string | sim |
| `ZB6_PROPOS` | ZB6_PROPOS | string | sim |
| `ZB6_FORA` | ZB6_FORA | string | sim |
| `ZB6_DTENVI` | ZB6_DTENVI | string | sim |
| `ZB6_DTAUTO` | ZB6_DTAUTO | string | sim |
| `ZB6_TIPOSE` | ZB6_TIPOSE | string | sim |
| `ZB6_PRIORI` | ZB6_PRIORI | string | sim |
| `ZB6_NFDEVO` | ZB6_NFDEVO | string | sim |
| `ZB6_DTNFDV` | ZB6_DTNFDV | string | sim |
| `ZB6_PRAZO` | ZB6_PRAZO | string | sim |
| `ZB6_DTENTR` | ZB6_DTENTR | string | sim |
| `ZB6_NFSERV` | ZB6_NFSERV | string | sim |
| `ZB6_DTNFSV` | ZB6_DTNFSV | string | sim |
| `ZB6_NFPROD` | ZB6_NFPROD | string | sim |
| `ZB6_DTNFPR` | ZB6_DTNFPR | string | sim |
| `ZB6_NUMMED` | ZB6_NUMMED | string | sim |
| `ZB6_VLRMAT` | ZB6_VLRMAT | number/double | sim |
| `ZB6_VLRSER` | ZB6_VLRSER | number/double | sim |
| `ZB6_ENVMED` | ZB6_ENVMED | string | sim |
| `ZB6_DTRECP` | ZB6_DTRECP | string | sim |
| `ZB6_DTLTF` | ZB6_DTLTF | string | sim |
| `ZB6_PEDIDO` | ZB6_PEDIDO | string | sim |
| `ZB6_TAG` | ZB6_TAG | string | sim |
| `ZB6_TOTPRO` | ZB6_TOTPRO | number/double | sim |
| `ZB6_STACOM` | ZB6_STACOM | string | sim |
| `ZB6_XNISAP` | ZB6_XNISAP | string | sim |
| `D_E_L_E_T_` | D_E_L_E_T_ | string | sim |
| `R_E_C_N_O_` | R_E_C_N_O_ | integer/int64 | sim |
| `R_E_C_D_E_L_` | R_E_C_D_E_L_ | integer/int64 | sim |
| `ZB6_OMMMMM` | ZB6_OMMMMM | string | sim |
| `ZB6_DTPVEN` | ZB6_DTPVEN | string | sim |
| `ZB6_NOMCLI` | ZB6_NOMCLI | string | sim |
| `ZB6_DATENV` | ZB6_DATENV | string | sim |
| `ZB6_DPECA` | ZB6_DPECA | string | sim |
| `ZB6_ENVP` | ZB6_ENVP | string | sim |
| `ZB6_AREA` | ZB6_AREA | string | sim |
| `ZB6_OBSTEC` | ZB6_OBSTEC | string/byte |  |
| `ZB6_DTCADA` | ZB6_DTCADA | string | sim |
| `ZB6_PROBLE` | ZB6_PROBLE | string | sim |
| `ZB6_DESSTA` | ZB6_DESSTA | string | sim |
| `ZB6_DTDINF` | ZB6_DTDINF | string | sim |
| `ZB6_DIRAPR` | ZB6_DIRAPR | string | sim |
| `ZB6_PCSERV` | ZB6_PCSERV | string | sim |
| `ZB6_CODEQ` | ZB6_CODEQ | string | sim |
| `ZB6_PDNFRE` | ZB6_PDNFRE | string | sim |
| `ZB6_PRAZC` | ZB6_PRAZC | string | sim |
| `ZB6_USERGI` | ZB6_USERGI | string | sim |
| `ZB6_USERGA` | ZB6_USERGA | string | sim |
| `ZB6_XHP` | ZB6_XHP | string | sim |
| `ZB6_XKVA` | ZB6_XKVA | string | sim |
| `ZB6_TAGKAI` | ZB6_TAGKAI | string | sim |
| `ZB6_NFSER2` | ZB6_NFSER2 | string | sim |
| `ZB6_DTNFS2` | ZB6_DTNFS2 | string | sim |
| `ZB6_NFPRO2` | ZB6_NFPRO2 | string | sim |
| `ZB6_DTNFP2` | ZB6_DTNFP2 | string | sim |
| `ZB6_NFPRO3` | ZB6_NFPRO3 | string | sim |
| `ZB6_DTNFP3` | ZB6_DTNFP3 | string | sim |
| `ZB6_DESSER` | ZB6_DESSER | string | sim |
| `ZB6_XBMC` | ZB6_XBMC | string | sim |
| `ZB6_XPROPC` | ZB6_XPROPC | string | sim |
| `ZB6_XPREVS` | ZB6_XPREVS | string | sim |
| `ZB6_XDTPRS` | ZB6_XDTPRS | string | sim |
| `ZB6_XPREVF` | ZB6_XPREVF | string | sim |
| `ZB6_XDTPRE` | ZB6_XDTPRE | string | sim |
| `ZB6_XDTPSE` | ZB6_XDTPSE | string | sim |
| `ZB6_XDTPMA` | ZB6_XDTPMA | string | sim |
| `ZB6_VLMATC` | ZB6_VLMATC | number/double | sim |
| `ZB6_VLSERC` | ZB6_VLSERC | number/double | sim |
| `ZB6_NFSER3` | ZB6_NFSER3 | string | sim |
| `ZB6_NFSER4` | ZB6_NFSER4 | string | sim |
| `ZB6_NFSER5` | ZB6_NFSER5 | string | sim |
| `ZB6_NFSER6` | ZB6_NFSER6 | string | sim |
| `ZB6_DTNFS3` | ZB6_DTNFS3 | string | sim |
| `ZB6_DTNFS4` | ZB6_DTNFS4 | string | sim |
| `ZB6_DTNFS5` | ZB6_DTNFS5 | string | sim |
| `ZB6_DTNFS6` | ZB6_DTNFS6 | string | sim |
| `ZB6_CONTRA` | ZB6_CONTRA | string | sim |
| `ZB6_XTEMPO` | ZB6_XTEMPO | string | sim |
| `ZB6_CLIENT` | ZB6_CLIENT | string | sim |
| `ZB6_LOJA` | ZB6_LOJA | string | sim |
| `ZB6_XNPDCM` | ZB6_XNPDCM | string | sim |
| `ZB6_XNPDCS` | ZB6_XNPDCS | string | sim |
| `ZB6_XPRMPC` | ZB6_XPRMPC | string | sim |
| `ZB6_XDTPRM` | ZB6_XDTPRM | string | sim |
| `ZB6_XPRSPC` | ZB6_XPRSPC | string | sim |
| `ZB6_XDTPRF` | ZB6_XDTPRF | string | sim |
| `ZB6_XCOR` | ZB6_XCOR | string | sim |
| `ZB6_XNUMRE` | ZB6_XNUMRE | string | sim |
| `ZB6_VLNFS` | ZB6_VLNFS | number/double | sim |
| `ZB6_VLNFM` | ZB6_VLNFM | number/double | sim |
| `ZB6_VLNFS1` | ZB6_VLNFS1 | number/double | sim |
| `ZB6_VLNFS2` | ZB6_VLNFS2 | number/double | sim |
| `ZB6_VLNFS3` | ZB6_VLNFS3 | number/double | sim |
| `ZB6_VLNFS4` | ZB6_VLNFS4 | number/double | sim |
| `ZB6_VLNFS5` | ZB6_VLNFS5 | number/double | sim |
| `ZB6_VLNFM1` | ZB6_VLNFM1 | number/double | sim |
| `ZB6_VLNFM2` | ZB6_VLNFM2 | number/double | sim |
| `ZB6_XAPSPC` | ZB6_XAPSPC | string | sim |
| `ZB6_XDTCOR` | ZB6_XDTCOR | string | sim |
| `ZB6_NFPRO4` | ZB6_NFPRO4 | string | sim |
| `ZB6_DTNFP4` | ZB6_DTNFP4 | string | sim |
| `ZB6_VLNFM4` | ZB6_VLNFM4 | number/double | sim |
| `ZB6_NFPRO5` | ZB6_NFPRO5 | string | sim |
| `ZB6_DTNFP5` | ZB6_DTNFP5 | string | sim |
| `ZB6_VLNFM5` | ZB6_VLNFM5 | number/double | sim |
| `ZB6_NFPRO6` | ZB6_NFPRO6 | string | sim |
| `ZB6_DTNFP6` | ZB6_DTNFP6 | string | sim |
| `ZB6_VLNFM6` | ZB6_VLNFM6 | number/double | sim |
| `ZB6_XHISTO` | ZB6_XHISTO | string | sim |
| `ZB6_XDTREC` | ZB6_XDTREC | string | sim |
| `ZB6_VLRIVA` | ZB6_VLRIVA | number/double | sim |
| `ZB6_NGT` | ZB6_NGT | string | sim |
| `ZB6_RESPEN` | ZB6_RESPEN | string | sim |
| `ZB6_ENTRDT` | ZB6_ENTRDT | string | sim |
| `ZB6_XVLRIV` | ZB6_XVLRIV | number/double | sim |
| `ZB6_NNE` | ZB6_NNE | string | sim |
| `ZB6_ENVIO` | ZB6_ENVIO | string | sim |
| `ZB6_XOPEC` | ZB6_XOPEC | string | sim |
| `ZB6_XDTOPE` | ZB6_XDTOPE | string | sim |
| `ZB6_XINTER` | ZB6_XINTER | string | sim |
| `ZB6_XACOMP` | ZB6_XACOMP | string | sim |
| `ZB6_XNFENC` | ZB6_XNFENC | string | sim |
| `ZB6_XCLINT` | ZB6_XCLINT | string | sim |
| `ZB6_XDTPDS` | ZB6_XDTPDS | string | sim |
| `ZB6_XFRS1` | ZB6_XFRS1 | string | sim |
| `ZB6_XDFRS1` | ZB6_XDFRS1 | string | sim |
| `ZB6_XFRS2` | ZB6_XFRS2 | string | sim |
| `ZB6_XDFRS2` | ZB6_XDFRS2 | string | sim |
| `ZB6_XFRS3` | ZB6_XFRS3 | string | sim |
| `ZB6_XDFRS3` | ZB6_XDFRS3 | string | sim |
| `ZB6_XFRS4` | ZB6_XFRS4 | string | sim |
| `ZB6_XDFRS4` | ZB6_XDFRS4 | string | sim |
| `ZB6_XFRS5` | ZB6_XFRS5 | string | sim |
| `ZB6_XDFRS5` | ZB6_XDFRS5 | string | sim |
| `ZB6_XORCA` | ZB6_XORCA | string | sim |
| `ZB6_XDTENV` | ZB6_XDTENV | string | sim |
| `ZB6_XDTVEN` | ZB6_XDTVEN | string | sim |
| `ZB6_XDESIG` | ZB6_XDESIG | string/byte |  |
| `ZB6_XORCTO` | ZB6_XORCTO | number/double | sim |
| `ZB6_XTOTF` | ZB6_XTOTF | number/double | sim |
| `ZB6_XORCST` | ZB6_XORCST | string | sim |
| `ZB6_PERIT3` | ZB6_PERIT3 | string | sim |
| `ZB6_PERIT1` | ZB6_PERIT1 | string | sim |
| `ZB6_PERIT4` | ZB6_PERIT4 | string | sim |
| `ZB6_PERIT2` | ZB6_PERIT2 | string | sim |
| `ZB6_PERIT5` | ZB6_PERIT5 | string | sim |
| `ZB6_PERIT6` | ZB6_PERIT6 | string | sim |
| `ZB6_PERIT7` | ZB6_PERIT7 | string | sim |
| `ZB6_PERIT8` | ZB6_PERIT8 | string | sim |
| `ZB6_PERIT9` | ZB6_PERIT9 | string | sim |
| `ZB6_PERI10` | ZB6_PERI10 | string | sim |
| `ZB6_PERI11` | ZB6_PERI11 | string | sim |
| `ZB6_PERI12` | ZB6_PERI12 | string | sim |
| `ZB6_PERI13` | ZB6_PERI13 | string | sim |
| `ZB6_PERI14` | ZB6_PERI14 | string | sim |
| `ZB6_PERI15` | ZB6_PERI15 | string | sim |
| `ZB6_XKANPC` | ZB6_XKANPC | string | sim |
| `ZB6_APACOR` | ZB6_APACOR | string | sim |
| `ZB6_PERI16` | ZB6_PERI16 | string | sim |
| `ZB6_PERI17` | ZB6_PERI17 | string | sim |
| `ZB6_PERI18` | ZB6_PERI18 | string | sim |
| `ZB6_XOPPEC` | ZB6_XOPPEC | string | sim |
| `ZB6_XNUMCH` | ZB6_XNUMCH | string | sim |
| `ZB6_XREJEI` | ZB6_XREJEI | string | sim |
| `ZB6_XDTINI` | ZB6_XDTINI | string | sim |
| `ZB6_XDTATU` | ZB6_XDTATU | string | sim |
| `ZB6_XCHAMA` | ZB6_XCHAMA | string | sim |
| `ZB6_XVALID` | ZB6_XVALID | string | sim |

