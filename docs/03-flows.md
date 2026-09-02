# Medro — Power Automate Flows

> 10 flows chamados pelo app via `<Flow>.Run(...)`. Cada um é acionado por um trigger **PowerApps V2** (HTTP Request) e normalmente devolve um `Response` com o resultado.
> No backend Node, cada flow vira um **endpoint** (ou job).


---

## exibir_imagens_sharepoint

**Conectores:** shared_sharepointonline

**Entradas (`manual`):**

| Parâmetro | Título | Tipo |
|---|---|---|
| `text` | Filial | string |
| `text_1` | Cliente | string |
| `text_2` | OS | string |
| `text_3` | Tipo | string |

**Ações:**

- **Listar_pasta** — `shared_sharepointonline :: ListFolder`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `id`: `@outputs('Obter_metadados_de_pasta_usando_caminho')?['body/Id']`
- **Inicializar_variável** (`InitializeVariable`): `{"variables": [{"name": "varfilial", "type": "string", "value": "@triggerBody()['text']"}]}`
- **Obter_metadados_de_pasta_usando_caminho** — `shared_sharepointonline :: GetFolderMetadataByPath`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `path`: `/Doc Tcnicos/Fotos Peritagens/@{variables('varfilial')}/@{variables('varcliente')}/@{variables('varos')}/@{variables('va`
- **Selecionar** (`Select`): `{"from": "@body('Listar_pasta')", "select": {"Nome": "@item()?['DisplayName']", "Link": "@item()?['Path']", "Id": "@item()?['Id']"}}`
- **Respond_to_a_Power_App_or_flow** (`Response`): `{"schema": {"type": "object", "properties": {"fotosjson": {"title": "FotosJSON", "x-ms-dynamically-added": true, "type": "string"}}, "additionalProperties": {}}, "statusCode": 200, "body": {"fotosjson": "@{string(body('S`
- **Inicializar_variável_2** (`InitializeVariable`): `{"variables": [{"name": "varcliente", "type": "string", "value": "@triggerBody()['text_1']"}]}`
- **Inicializar_variável_3** (`InitializeVariable`): `{"variables": [{"name": "varos", "type": "string", "value": "@triggerBody()['text_2']"}]}`
- **Inicializar_variável_4** (`InitializeVariable`): `{"variables": [{"name": "vartipo", "type": "string", "value": "@triggerBody()['text_3']"}]}`

---

## Imagens_JSON

**Conectores:** shared_sharepointonline

**Entradas (`manual`):**

| Parâmetro | Título | Tipo |
|---|---|---|
| `text` | Filial | string |
| `text_1` | Cliente | string |
| `text_2` | OS | string |
| `text_3` | Tipo | string |

**Ações:**

- **Delay** (`Wait`): `{"interval": {"count": 10, "unit": "Second"}}`
- **Initialize_variable** (`InitializeVariable`): `{"variables": [{"name": "ArrayImagens", "type": "array"}]}`
- **List_folder** — `shared_sharepointonline :: ListFolder`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `id`: `@outputs('Get_folder_metadata_using_path')?['body/Id']`
- **Apply_to_each** (`Foreach`)
  - **Condition** (`If`)
    - **Get_file_content** — `shared_sharepointonline :: GetFileContent`
      - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
      - `id`: `@items('Apply_to_each')?['Id']`
      - `inferContentType`: `True`
    - **Append_to_array_variable** (`AppendToArrayVariable`): `{"name": "ArrayImagens", "value": {"Nome": "@{items('Apply_to_each')?['DisplayName']}", "Conteudo": "data:image/jpeg;base64,@{base64(body('Get_file_content'))}"}}`
- **Create_file** — `shared_sharepointonline :: CreateFile`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `folderPath`: `/Doc Tcnicos/Fotos Peritagens/@{variables('varfilial')}/@{variables('varcliente')}/@{variables('varos')}/@{variables('va`
  - `name`: `Imagens_Base64.json`
  - `body`: `@variables('ArrayImagens')`
- **Initialize_variable_1** (`InitializeVariable`): `{"variables": [{"name": "varfilial", "type": "string", "value": "@triggerBody()?['text']"}]}`
- **Initialize_variable_2** (`InitializeVariable`): `{"variables": [{"name": "varcliente", "type": "string", "value": "@triggerBody()?['text_1']"}]}`
- **Initialize_variable_3** (`InitializeVariable`): `{"variables": [{"name": "varos", "type": "string", "value": "@triggerBody()?['text_2']"}]}`
- **Initialize_variable_4** (`InitializeVariable`): `{"variables": [{"name": "vartipo", "type": "string", "value": "@triggerBody()?['text_3']"}]}`
- **Get_folder_metadata_using_path** — `shared_sharepointonline :: GetFolderMetadataByPath`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `path`: `/Doc Tcnicos/Fotos Peritagens/@{variables('varfilial')}/@{variables('varcliente')}/@{variables('varos')}/@{variables('va`
- **Delete_file** — `shared_sharepointonline :: DeleteFile`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `id`: `/Doc Tcnicos/Fotos Peritagens/@{variables('varfilial')}/@{variables('varcliente')}/@{variables('varos')}/@{variables('va`
- **Get_file_content_1** — `shared_sharepointonline :: GetFileContent`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `id`: `@outputs('Create_file')?['body/Id']`
  - `inferContentType`: `True`
- **Respond_to_a_Power_App_or_flow** (`Response`): `{"schema": {"type": "object", "properties": {"foto_json": {"title": "Foto_JSON", "type": "string", "x-ms-content-hint": "TEXT", "x-ms-dynamically-added": true}}, "additionalProperties": {}}, "statusCode": 200, "body": {"`

---

## gerararquivolaudo

**Conectores:** shared_sharepointonline

**Entradas (`manual`):**

| Parâmetro | Título | Tipo |
|---|---|---|
| `text` | text | string |

**Ações:**

- **Respond_to_a_Power_App_or_flow** (`Response`): `{"schema": {"type": "object", "properties": {"binario": {"title": "binario", "type": "string", "x-ms-content-hint": "TEXT", "x-ms-dynamically-added": true}}, "additionalProperties": {}}, "statusCode": 200, "body": {"bina`
- **Get_file_content** — `shared_sharepointonline :: GetFileContent`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `id`: `@triggerBody()?['text']`
  - `inferContentType`: `True`

---

## Exibir_Imagem

**Conectores:** shared_sharepointonline

**Entradas (`manual`):**

| Parâmetro | Título | Tipo |
|---|---|---|
| `text` | ImagemId | string |

**Ações:**

- **Obter_conteúdo_de_arquivo** — `shared_sharepointonline :: GetFileContent`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `id`: `@triggerBody()['text']`
  - `inferContentType`: `True`
- **Respond_to_a_Power_App_or_flow** (`Response`): `{"statusCode": 200, "body": {"imgbase64": "@{base64(outputs('Obter_conteúdo_de_arquivo')?['body'])}"}, "schema": {"type": "object", "properties": {"imgbase64": {"title": "IMGBase64", "x-ms-dynamically-added": true, "type`

---

## gerarlinkLaudo

**Conectores:** shared_sharepointonline

**Entradas (`manual`):**

| Parâmetro | Título | Tipo |
|---|---|---|
| `text` | text | string |

**Ações:**

- **Respond_to_a_Power_App_or_flow** (`Response`): `{"schema": {"type": "object", "properties": {"weburl": {"title": "webUrl", "type": "string", "x-ms-content-hint": "TEXT", "x-ms-dynamically-added": true}, "aink": {"title": "aink", "type": "string", "x-ms-content-hint": `
- **Create_sharing_link_for_a_file_or_folder** — `shared_sharepointonline :: CreateSharingLink`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `table`: `73cb1ed5-29d9-471d-a207-e09399de426b`
  - `id`: `@outputs('Get_file_metadata_using_path')?['body/ItemId']`
  - `permission/type`: `view`
  - `permission/scope`: `anonymous`
- **Get_file_metadata_using_path** — `shared_sharepointonline :: GetFileMetadataByPath`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `path`: `@triggerBody()?['text']`

---

## CopiarLaudo

**Conectores:** shared_sharepointonline

**Entradas (`manual`):**

| Parâmetro | Título | Tipo |
|---|---|---|
| `text` | FolderPath | string |
| `text_1` | FileName | string |

**Ações:**

- **Respond_to_a_Power_App_or_flow** (`Response`): `{"schema": {"type": "object", "properties": {}, "additionalProperties": {}}, "statusCode": 200, "body": {}}`
- **Get_file_content** — `shared_sharepointonline :: GetFileContent`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `id`: `%252fDoc%2bTcnicos%252fLaudo%2bem%2bElabora%25c3%25a7%25c3%25a3o%252flt.pdf`
  - `inferContentType`: `True`
- **Create_file** — `shared_sharepointonline :: CreateFile`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `folderPath`: `@triggerBody()?['text']`
  - `name`: `@triggerBody()?['text_1']`
  - `body`: `@body('Get_file_content')`

---

## salvarfotosperitagem

**Conectores:** shared_sharepointonline

**Entradas (`manual`):**

| Parâmetro | Título | Tipo |
|---|---|---|
| `text` | Cliente | string |
| `text_1` | OS | string |
| `text_2` | Filial | string |
| `text_3` | TipoFoto | string |
| `text_4` | dataUri | string |

**Ações:**

- **Initialize_variable** (`InitializeVariable`): `{"variables": [{"name": "Varcliente", "type": "string", "value": "@triggerBody()?['text']"}]}`
- **Initialize_variable_1** (`InitializeVariable`): `{"variables": [{"name": "OS", "type": "string", "value": "@triggerBody()?['text_1']"}]}`
- **Criar_pasta_cliente** — `shared_sharepointonline :: CreateNewFolder`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `table`: `73cb1ed5-29d9-471d-a207-e09399de426b`
  - `parameters/path`: `Fotos Peritagens/@{triggerBody()?['text_2']}/@{variables('Varcliente')}`
- **Create_file** — `shared_sharepointonline :: CreateFile`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `folderPath`: `/Doc Tcnicos/Fotos Peritagens/@{triggerBody()?['text_2']}/@{variables('Varcliente')}/@{variables('OS')}/@{triggerBody()?`
  - `name`: `@concat('OS_', variables('OS'), '_', formatDateTime(utcNow(),'yyyy-MM-dd_HHmmss'), '_', guid(), '.jpg')`
  - `body`: `@outputs('Base64')`
- **Criar_pasta_do_tipo** — `shared_sharepointonline :: CreateNewFolder`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `table`: `73cb1ed5-29d9-471d-a207-e09399de426b`
  - `parameters/path`: `Fotos Peritagens/@{triggerBody()?['text_2']}/@{variables('Varcliente')}/@{variables('OS')}/@{triggerBody()?['text_3']}`
- **Criar_pasta_OS** — `shared_sharepointonline :: CreateNewFolder`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `table`: `73cb1ed5-29d9-471d-a207-e09399de426b`
  - `parameters/path`: `Fotos Peritagens/@{triggerBody()?['text_2']}/@{variables('Varcliente')}/@{variables('OS')}`
- **Base64** (`Compose`): `"@dataUriToBinary(triggerBody()['text_4'])"`
- **DebugBody** (`Compose`): `"@string(triggerBody())"`

---

## gerar_planilha_checkList_veicular

**Conectores:** shared_sharepointonline

**Entradas (`manual`):**

| Parâmetro | Título | Tipo |
|---|---|---|
| `text` | checkList_JSON | string |

**Ações:**

- **Analisar_JSON** (`ParseJson`): `{"content": "@triggerBody()['text']", "schema": {"type": "array", "items": {"type": "object", "properties": {"Title": {"type": ["string", "null"]}, "Observation": {"type": ["string", "null"]}, "field_1": {"type": ["strin`
- **Selecionar** (`Select`): `{"from": "@body('Analisar_JSON')", "select": {"Veículo e placa": "@if(empty(item()?['Title']), '', item()?['Title'])", "Data do checkup": "@if(empty(item()?['field_1']), '', item()?['field_1'])", "Motorista": "@if(empty(`
- **Criar_Tabela_HTML** (`Table`): `{"from": "@body('Selecionar')", "format": "HTML"}`
- **Criar_arquivo** — `shared_sharepointonline :: CreateFile`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `folderPath`: `/Doc Tcnicos/CheckList_Veicular`
  - `name`: `Checklist_@{utcNow()}.xls`
  - `body`: `@body('Criar_Tabela_HTML')`
- **Criar_link_de_compartilhamento_para_um_arquivo_ou_uma_pasta** — `shared_sharepointonline :: CreateSharingLink`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `table`: `73cb1ed5-29d9-471d-a207-e09399de426b`
  - `id`: `@outputs('Criar_arquivo')?['body/ItemId']`
  - `permission/type`: `view`
  - `permission/scope`: `anonymous`
- **Respond_to_a_Power_App_or_flow** (`Response`): `{"statusCode": 200, "body": {"link_checklist": "@outputs('Criar_link_de_compartilhamento_para_um_arquivo_ou_uma_pasta')?['body/link/webUrl']"}, "schema": {"type": "object", "properties": {"link_checklist": {"title": "lin`

---

## obterLaudo

**Conectores:** shared_sharepointonline

**Entradas (`manual`):**

| Parâmetro | Título | Tipo |
|---|---|---|
| `text` | Nome | string |
| `text_1` | Cliente | string |

**Ações:**

- **Send_an_HTTP_request_to_SharePoint** — `shared_sharepointonline :: HttpRequest`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `parameters/method`: `GET`
  - `parameters/uri`: `/_api/web/GetFileByServerRelativeUrl('/sites/KairosMotores/Doc Tcnicos/Laudos/@{triggerBody()?['text_1']}/@{triggerBody(`
- **Respond_to_a_Power_App_or_flow** (`Response`): `{"statusCode": 200, "body": {"pdfuri": "@{dataUri(base64ToBinary(body('Send_an_HTTP_request_to_SharePoint')?['$content']))}"}, "schema": {"type": "object", "properties": {"pdfuri": {"title": "PDFuri", "x-ms-dynamically-a`

---

## GetLaudoPDF

**Conectores:** shared_sharepointonline

**Ações:**

- **Respond_to_a_Power_App_or_flow** (`Response`): `{"schema": {"type": "object", "properties": {"file": {"title": "file", "type": "string", "format": "byte", "x-ms-content-hint": "FILE", "x-ms-dynamically-added": true}, "bin": {"title": "bin", "type": "string", "x-ms-con`
- **Get_file_content** — `shared_sharepointonline :: GetFileContent`
  - `dataset`: `https://aplicativokm.sharepoint.com/sites/KairosMotores`
  - `id`: `%252fDoc%2bTcnicos%252fLaudo%2bem%2bElabora%25c3%25a7%25c3%25a3o%252flt.pdf`
  - `inferContentType`: `True`
