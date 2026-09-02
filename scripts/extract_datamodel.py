# -*- coding: utf-8 -*-
"""Extrai o modelo de dados completo do export PowerApps (Medro).
Gera: docs/_data/data-model.json  e  docs/01-modelo-de-dados.md
"""
import json, os, sys, io

BASE = os.path.join(os.path.dirname(__file__), "..")
MSAPP = os.path.join(BASE, "extracted", "Microsoft.PowerApps", "apps",
                     "4226216083896037548", "msapp")
DS_PATH = os.path.join(MSAPP, "References", "DataSources.json")
OUT_DIR = os.path.join(BASE, "docs")
DATA_DIR = os.path.join(OUT_DIR, "_data")
os.makedirs(DATA_DIR, exist_ok=True)


def lbl(o):
    if not isinstance(o, dict):
        return None
    u = o.get("UserLocalizedLabel") or {}
    if u.get("Label"):
        return u["Label"]
    ll = o.get("LocalizedLabels") or []
    return ll[0]["Label"] if ll else None


def parse_cds(entry):
    td = json.loads(entry["TableDefinition"])
    em = json.loads(td["EntityMetadata"])
    # option sets: map logicalName -> [ {value,label} ]
    opts = {}
    for key in ("PicklistOptionSetAttribute", "MultiSelectPicklistOptionSetAttribute",
                "StateOptionSetAttribute", "StatusOptionSetAttribute",
                "BooleanOptionSetAttribute"):
        raw = td.get(key)
        if not raw:
            continue
        try:
            j = json.loads(raw) if isinstance(raw, str) else raw
        except Exception:
            continue
        for it in j.get("value", []):
            os_ = it.get("OptionSet") or {}
            if key == "BooleanOptionSetAttribute":
                choices = []
                for k in ("TrueOption", "FalseOption"):
                    c = os_.get(k) or {}
                    choices.append({"value": c.get("Value"), "label": lbl(c.get("Label") or {})})
            else:
                choices = [{"value": o.get("Value"), "label": lbl(o.get("Label") or {})}
                           for o in (os_.get("Options") or [])]
            opts[it.get("LogicalName")] = choices

    attrs = []
    for a in em.get("Attributes", []):
        at = a.get("AttributeType")
        if at in ("Virtual",) and not a.get("LogicalName", "").endswith("name"):
            pass
        ln = a.get("LogicalName")
        if ln and ln.endswith("yominame"):
            continue
        entry_a = {
            "logical": ln,
            "display": lbl(a.get("DisplayName") or {}),
            "type": at,
            "typeName": (a.get("AttributeTypeName") or {}).get("Value"),
            "maxLength": a.get("MaxLength"),
            "required": (a.get("RequiredLevel") or {}).get("Value"),
            "validForCreate": a.get("IsValidForCreate"),
            "validForUpdate": a.get("IsValidForUpdate"),
            "isPrimaryId": a.get("IsPrimaryId"),
            "isPrimaryName": a.get("IsPrimaryName"),
            "formula": a.get("FormulaDefinition"),
            "targets": a.get("Targets"),
        }
        if ln in opts:
            entry_a["options"] = opts[ln]
        attrs.append(entry_a)

    # relationships
    m2o = []
    for r in em.get("ManyToOneRelationships", []) or []:
        m2o.append({
            "name": r.get("SchemaName"),
            "attribute": r.get("ReferencingAttribute"),
            "referencedEntity": r.get("ReferencedEntity"),
        })
    o2m = []
    for r in em.get("OneToManyRelationships", []) or []:
        o2m.append({
            "name": r.get("SchemaName"),
            "referencingEntity": r.get("ReferencingEntity"),
            "referencingAttribute": r.get("ReferencingAttribute"),
        })

    return {
        "kind": "dataverse",
        "name": entry["Name"],
        "logicalName": entry.get("LogicalName"),
        "entitySet": entry.get("EntitySetName"),
        "displayCollection": lbl(em.get("DisplayCollectionName") or {}),
        "description": lbl(em.get("Description") or {}),
        "primaryId": em.get("PrimaryIdAttribute"),
        "primaryName": em.get("PrimaryNameAttribute"),
        "writable": entry.get("IsWritable"),
        "attributes": attrs,
        "manyToOne": m2o,
        "oneToMany": o2m,
    }


def parse_connected(entry):
    dem = entry.get("DataEntityMetadataJson") or {}
    key = next(iter(dem), None)
    raw = dem.get(key) if key else None
    schema_props = {}
    required = []
    title = entry["Name"]
    perm = None
    dataset = entry.get("DatasetName")
    if raw:
        try:
            j = json.loads(raw) if isinstance(raw, str) else raw
            title = j.get("title", title)
            perm = j.get("x-ms-permission")
            sch = j.get("schema", {})
            items = sch.get("items", sch)
            schema_props = items.get("properties", {}) or {}
            required = items.get("required", []) or []
        except Exception as e:
            schema_props = {"_parse_error": str(e)}
    cols = []
    for cn, cd in schema_props.items():
        if cn.startswith("{") or cn.startswith("@") or cn.lower().startswith("odata"):
            continue
        cd = cd if isinstance(cd, dict) else {}
        cols.append({
            "name": cn,
            "title": cd.get("x-ms-displayName") or cd.get("title") or cn,
            "type": cd.get("type"),
            "format": cd.get("format"),
            "enum": cd.get("enum"),
            "readOnly": cd.get("readOnly"),
            "required": cn in required,
        })
    kind = "sql" if (dataset and dataset[0].isdigit()) else "sharepoint"
    if dataset and dataset.startswith("http") and "sharepoint" in dataset:
        kind = "sharepoint"
    return {
        "kind": kind,
        "name": entry["Name"],
        "title": title,
        "dataset": dataset,
        "table": entry.get("TableName"),
        "permission": perm,
        "writable": entry.get("IsWritable"),
        "columns": cols,
    }


def main():
    ds = json.load(io.open(DS_PATH, encoding="utf-8"))["DataSources"]
    model = {"dataverse": [], "sharepoint": [], "sql": [], "services": [], "static": []}
    for e in ds:
        t = e.get("Type")
        try:
            if t == "NativeCDSDataSourceInfo":
                model["dataverse"].append(parse_cds(e))
            elif t == "ConnectedDataSourceInfo":
                p = parse_connected(e)
                model[p["kind"]].append(p)
            elif t == "ServiceInfo":
                model["services"].append({"name": e.get("Name"), "kind": e.get("ServiceKind")})
            elif t == "StaticDataSourceInfo":
                model["static"].append({"name": e.get("Name")})
        except Exception as ex:
            print("ERRO em", e.get("Name"), ex, file=sys.stderr)
    json.dump(model, io.open(os.path.join(DATA_DIR, "data-model.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)

    # ---------- Markdown ----------
    TYPE_MAP = {
        "String": "texto", "Memo": "texto longo", "Integer": "inteiro",
        "BigInt": "inteiro (64)", "Decimal": "decimal", "Double": "decimal",
        "Money": "monetário", "Boolean": "sim/não", "DateTime": "data/hora",
        "Picklist": "escolha", "MultiSelectPicklist": "escolha múltipla",
        "State": "estado (state)", "Status": "status (razão)",
        "Uniqueidentifier": "GUID", "Lookup": "referência (lookup)",
        "Owner": "proprietário", "Customer": "cliente", "Virtual": "virtual",
        "Image": "imagem", "File": "arquivo",
    }

    def md_type(a):
        base = TYPE_MAP.get(a["type"], a["type"] or "?")
        if a.get("targets"):
            base += " → " + ", ".join(a["targets"])
        if a.get("maxLength") and a["type"] in ("String", "Memo"):
            base += " (max %s)" % a["maxLength"]
        if a.get("formula"):
            base = "calculado"
        return base

    out = io.open(os.path.join(OUT_DIR, "01-modelo-de-dados.md"), "w", encoding="utf-8")
    w = out.write
    w("# Medro — Modelo de Dados\n\n")
    w("> Extraído de `References/DataSources.json` do pacote PowerApps.\n")
    w("> Fontes: **Dataverse** (%d tabelas), **SharePoint** (%d listas), **SQL Server / Protheus** (%d tabelas).\n\n"
      % (len(model["dataverse"]), len(model["sharepoint"]), len(model["sql"])))

    w("## Índice\n\n")
    w("### Dataverse\n")
    for e in sorted(model["dataverse"], key=lambda x: x["name"].lower()):
        w("- [%s](#dv-%s) — `%s` — %d campos\n" %
          (e["name"], e["logicalName"], e["logicalName"], len(e["attributes"])))
    w("\n### SharePoint\n")
    for e in sorted(model["sharepoint"], key=lambda x: x["name"].lower()):
        w("- [%s](#sp-%s) — %d colunas\n" % (e["name"], slug(e["name"]), len(e["columns"])))
    w("\n### SQL Server (Protheus)\n")
    for e in sorted(model["sql"], key=lambda x: x["name"].lower()):
        w("- [%s](#sql-%s) — %d colunas\n" % (e["name"], slug(e["name"]), len(e["columns"])))

    w("\n---\n\n# Dataverse\n\n")
    for e in sorted(model["dataverse"], key=lambda x: x["name"].lower()):
        w('\n<a id="dv-%s"></a>\n' % e["logicalName"])
        w("## %s\n\n" % e["name"])
        w("| | |\n|---|---|\n")
        w("| Nome lógico | `%s` |\n" % e["logicalName"])
        w("| EntitySet (Web API) | `%s` |\n" % e["entitySet"])
        w("| Chave primária | `%s` |\n" % e["primaryId"])
        w("| Campo nome primário | `%s` |\n" % e["primaryName"])
        if e.get("description"):
            w("| Descrição | %s |\n" % e["description"].replace("\n", " "))
        w("\n### Campos\n\n")
        w("| Campo lógico | Rótulo | Tipo | Obrigatório | C/U |\n|---|---|---|---|---|\n")
        for a in e["attributes"]:
            if a["type"] == "Virtual" and not a.get("options"):
                continue
            req = {"ApplicationRequired": "sim", "SystemRequired": "sistema",
                   "Recommended": "recomendado", "None": ""}.get(a.get("required"), a.get("required") or "")
            cu = ("C" if a.get("validForCreate") else "-") + ("U" if a.get("validForUpdate") else "-")
            w("| `%s` | %s | %s | %s | %s |\n" %
              (a["logical"], a["display"] or "", md_type(a), req, cu))
        # option sets
        picks = [a for a in e["attributes"] if a.get("options")]
        if picks:
            w("\n### Conjuntos de opções\n\n")
            for a in picks:
                vals = "; ".join("%s=%s" % (o["value"], o["label"]) for o in a["options"] if o.get("label") is not None)
                w("- **`%s`** (%s): %s\n" % (a["logical"], a["display"] or "", vals))
        if e.get("manyToOne"):
            w("\n### Relações N:1\n\n")
            for r in e["manyToOne"]:
                if r["attribute"] in ("ownerid", "createdby", "modifiedby", "owningbusinessunit",
                                      "owningteam", "owninguser", "modifiedonbehalfby", "createdonbehalfby"):
                    continue
                w("- `%s` → **%s**\n" % (r["attribute"], r["referencedEntity"]))
        w("\n")

    for kind, head in (("sharepoint", "SharePoint"), ("sql", "SQL Server (Protheus)")):
        w("\n---\n\n# %s\n\n" % head)
        for e in sorted(model[kind], key=lambda x: x["name"].lower()):
            w('\n<a id="%s-%s"></a>\n' % ("sp" if kind == "sharepoint" else "sql", slug(e["name"])))
            w("## %s\n\n" % e["name"])
            w("| | |\n|---|---|\n")
            w("| Dataset | `%s` |\n" % e["dataset"])
            w("| Tabela / Id | `%s` |\n" % e["table"])
            w("| Permissão | %s |\n" % (e["permission"] or "?"))
            w("\n| Coluna | Rótulo | Tipo | Obrig. |\n|---|---|---|---|\n")
            for c in e["columns"]:
                t = c["type"] or "?"
                if c.get("format"):
                    t += "/" + c["format"]
                if c.get("enum"):
                    t += " enum[" + ", ".join(str(x) for x in c["enum"][:12]) + "]"
                w("| `%s` | %s | %s | %s |\n" %
                  (c["name"], (c["title"] or "").replace("\n", " "), t, "sim" if c["required"] else ""))
            w("\n")
    out.close()
    print("OK ->", os.path.join(OUT_DIR, "01-modelo-de-dados.md"))
    print("dataverse=%d sharepoint=%d sql=%d" %
          (len(model["dataverse"]), len(model["sharepoint"]), len(model["sql"])))


def slug(s):
    return "".join(c.lower() if c.isalnum() else "-" for c in s).strip("-")


if __name__ == "__main__":
    main()
