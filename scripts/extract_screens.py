# -*- coding: utf-8 -*-
"""Catálogo de telas do PowerApps Medro.
Gera: docs/_data/screens.json e docs/02-catalogo-de-telas.md
"""
import json, os, re, io, glob, collections

BASE = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(BASE, "extracted", "Microsoft.PowerApps", "apps",
                   "4226216083896037548", "msapp", "Src")
OUT_DIR = os.path.join(BASE, "docs")
DATA_DIR = os.path.join(OUT_DIR, "_data")
os.makedirs(DATA_DIR, exist_ok=True)

import yaml


# Power Fx YAML usa `Prop: =Expr`; o `=` sozinho colide com a tag obscura
# "tag:yaml.org,2002:value" do YAML. Registramos um construtor que devolve string.
def _construct_value(loader, node):
    try:
        return "=" + loader.construct_scalar(node)
    except Exception:
        return "="


yaml.SafeLoader.add_constructor("tag:yaml.org,2002:value", _construct_value)

model = json.load(io.open(os.path.join(DATA_DIR, "data-model.json"), encoding="utf-8"))
DS_NAMES = set()
for grp in ("dataverse", "sharepoint", "sql"):
    for e in model[grp]:
        DS_NAMES.add(e["name"])
FLOWS = {s["name"] for s in model["services"]}
DS_SORTED = sorted(DS_NAMES, key=len, reverse=True)

SKIP = {"App", "_EditorState"}


def collect_strings(node, out):
    if isinstance(node, str):
        out.append(node)
    elif isinstance(node, dict):
        for v in node.values():
            collect_strings(v, out)
    elif isinstance(node, list):
        for v in node:
            collect_strings(v, out)


def walk_controls(children, acc):
    """children: list of {name: {Control:, Properties:, Children:}}"""
    if not isinstance(children, list):
        return
    for item in children:
        if not isinstance(item, dict):
            continue
        for cname, cbody in item.items():
            if not isinstance(cbody, dict):
                continue
            ctrl = cbody.get("Control", "?")
            base = re.sub(r"[@/].*$", "", str(ctrl))
            acc["controls"][base] += 1
            props = cbody.get("Properties", {}) or {}
            # form / gallery specifics
            if base in ("Form",):
                acc["forms"].append({
                    "name": cname,
                    "dataSource": strip_eq(props.get("DataSource")),
                    "item": strip_eq(props.get("Item")),
                    "default": strip_eq(props.get("DefaultMode")),
                })
            if base in ("Gallery",):
                acc["galleries"].append({
                    "name": cname,
                    "items": strip_eq(props.get("Items")),
                })
            # event props of interest
            for pk, pv in props.items():
                if not isinstance(pv, str):
                    continue
                if pk in ("OnSelect", "OnChange", "OnCheck", "OnUncheck",
                          "OnAddFile", "OnSuccess", "OnFailure", "OnTimerEnd",
                          "OnTimerStart", "OnVisible", "OnHidden"):
                    txt = strip_eq(pv)
                    if any(t in txt for t in ("Navigate(", ".Run(", "Patch(", "SubmitForm(",
                                              "Collect(", "Remove(", "Notify(", "Set(",
                                              "ResetForm(", "NewForm(", "EditForm(", "ViewForm(",
                                              "RemoveIf(", "UpdateIf(")):
                        label = strip_eq(props.get("Text")) or cname
                        label = re.sub(r"\s+", " ", label)[:60]
                        acc["actions"].append({"control": cname, "type": base,
                                               "label": label, "prop": pk,
                                               "code": re.sub(r"\s+", " ", txt).strip()[:400]})
            walk_controls(cbody.get("Children"), acc)


def strip_eq(v):
    if v is None:
        return ""
    v = str(v)
    return v[1:] if v.startswith("=") else v


def analyze(path):
    raw = io.open(path, encoding="utf-8").read()
    try:
        doc = yaml.safe_load(raw)
    except Exception as e:
        return {"error": str(e), "file": os.path.basename(path)}
    screens = doc.get("Screens", {}) if isinstance(doc, dict) else {}
    results = []
    for sname, sbody in screens.items():
        props = (sbody.get("Properties", {}) or {}) if isinstance(sbody, dict) else {}
        acc = {
            "controls": collections.Counter(),
            "forms": [], "galleries": [], "actions": [],
        }
        walk_controls(sbody.get("Children") if isinstance(sbody, dict) else None, acc)

        allstr = []
        collect_strings(sbody, allstr)
        blob = "\n".join(allstr)

        nav = sorted(set(
            re.findall(r"Navigate\(\s*'([^']+)'", blob) +
            re.findall(r"Navigate\(\s*([^\s,'\"()]+)", blob, re.UNICODE)
        ))
        nav = sorted({n for n in nav if n and n[0].isalpha() or n and n[0] == "_"})
        flows_used = sorted(set(re.findall(r"'?([A-Za-z_][A-Za-z0-9_]*)'?\.Run\(", blob))
                            & set(x.replace(" ", "") for x in FLOWS)
                            | (set(re.findall(r"'?([A-Za-z_][A-Za-z0-9_]*)'?\.Run\(", blob)) & FLOWS))
        set_vars = sorted(set(re.findall(r"\bSet\(\s*([A-Za-z_][A-Za-z0-9_]*)", blob)))
        ctx_vars = sorted(set(re.findall(r"UpdateContext\(\s*\{\s*([A-Za-z_][A-Za-z0-9_]*)", blob)))
        patch_tgt = sorted(set(re.findall(r"Patch\(\s*'?([^,'\)]+?)'?\s*,", blob)))
        collect_tgt = sorted(set(re.findall(r"Clear?Collect\(\s*([A-Za-z_][A-Za-z0-9_]*)", blob)))

        ds_used = []
        for d in DS_SORTED:
            if re.search(r"(?<![A-Za-z0-9_])'?" + re.escape(d) + r"'?(?![A-Za-z0-9_])", blob):
                ds_used.append(d)
        ds_used = sorted(set(ds_used))

        results.append({
            "screen": sname,
            "file": os.path.basename(path),
            "lines": raw.count("\n") + 1,
            "background": strip_eq(props.get("BackgroundImage") or props.get("Fill")),
            "onVisible": re.sub(r"\s+", " ", strip_eq(props.get("OnVisible"))).strip()[:600],
            "onHidden": re.sub(r"\s+", " ", strip_eq(props.get("OnHidden"))).strip()[:400],
            "controls": dict(acc["controls"].most_common()),
            "controlTotal": sum(acc["controls"].values()),
            "dataSources": ds_used,
            "flows": flows_used,
            "navTargets": nav,
            "globalVars": set_vars,
            "contextVars": ctx_vars,
            "patchTargets": [p for p in patch_tgt if p in DS_NAMES],
            "collections": collect_tgt,
            "forms": acc["forms"],
            "galleries": acc["galleries"],
            "actions": acc["actions"][:40],
        })
    return results


def main():
    allscreens = []
    for path in sorted(glob.glob(os.path.join(SRC, "*.pa.yaml"))):
        stem = os.path.basename(path)[:-8]
        if stem in SKIP:
            continue
        r = analyze(path)
        if isinstance(r, dict) and r.get("error"):
            print("PARSE ERROR", r["file"], r["error"])
            allscreens.append(r)
        else:
            allscreens.extend(r)

    json.dump(allscreens, io.open(os.path.join(DATA_DIR, "screens.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)

    # -------- module grouping (by screen name heuristics) --------
    MODULES = [
        ("Login & Menu", r"^(Login|Login_1|1_Menu|Menu_RDS|SELEC_COD|Atendimento|Screen1|Screen2)$"),
        ("OS Medro", r"(Medro_Nova|EdicaoOS_Medro|Gestao_Pendencias_Medro|Entrada_Medro)"),
        ("Pendentes / Atualização", r"(AtualizacaoPendentes|HistoricoPendentes|PendentesdeRetorno|EntradaTarefa|HistoricoTarefa)"),
        ("PCP / Gerenciamento", r"(PCP|COD_GERENCIAMENTO|Requisi.*PCP)"),
        ("Peritagem / Avaliação / Inspeção", r"(Peritagem|Peritagem|GaleriaPeritagem|AvaliacaoFinal|HistoricoAvalFinais|FormInspec|InspecQuali)"),
        ("Ensaio", r"(Ensaio|LiberarEnsaio)"),
        ("Caldeiraria", r"(Caldeiraria)"),
        ("Balanceamento", r"(Balanceamento|Rel_Balanceamento)"),
        ("Departamento Técnico / Laudos", r"(DepTecnico|GerarLink_DPT|QRCodeLaudos)"),
        ("Trajetos / SSMA", r"(Trajeto|SSMA|ImprimirSSMA)"),
        ("Checklist Veicular", r"(Checklist_veicular|CheckList_Veicular|check_SLZ|Exportar_CheckList)"),
        ("Ferramentaria", r"(Ferramentaria)"),
        ("Serviços Externos / Terceirizados", r"(ServicosExternos|Servi.osExternos|Terceir|ServAVR|ControleTerceirizado)"),
        ("RDS", r"(RDS)"),
        ("Relatório Fotográfico", r"(Relatorio$|Rel_Foto)"),
        ("Escopo de Manutenção", r"(EscopoDeManuten)"),
        ("CIPA", r"(CIPA)"),
        ("Documentos", r"(Documentos_trajeto)"),
    ]

    def module_of(name):
        for m, rx in MODULES:
            if re.search(rx, name):
                return m
        return "Outros"

    by_mod = collections.OrderedDict((m, []) for m, _ in MODULES)
    by_mod["Outros"] = []
    for s in allscreens:
        if "screen" not in s:
            continue
        by_mod.setdefault(module_of(s["screen"]), []).append(s)

    out = io.open(os.path.join(OUT_DIR, "02-catalogo-de-telas.md"), "w", encoding="utf-8")
    w = out.write
    total = len([s for s in allscreens if "screen" in s])
    w("# Medro — Catálogo de Telas\n\n")
    w("> Extraído de `Src/*.pa.yaml` do pacote PowerApps. **%d telas.**\n\n" % total)
    w("Cada ficha lista: fonte(s) de dados lidas/escritas, Flows chamados, navegação de saída, "
      "variáveis globais/locais, formulários e galerias, e as principais ações de botões.\n\n")

    # summary table
    w("## Resumo por módulo\n\n")
    for m, items in by_mod.items():
        if not items:
            continue
        w("### %s\n\n" % m)
        w("| Tela | Linhas | Fontes de dados | Flows | Navega para |\n|---|--:|---|---|---|\n")
        for s in sorted(items, key=lambda x: -x["lines"]):
            w("| [%s](#%s) | %d | %s | %s | %s |\n" % (
                s["screen"], anchor(s["screen"]), s["lines"],
                ", ".join("`%s`" % d for d in s["dataSources"][:8]) or "—",
                ", ".join("`%s`" % f for f in s["flows"]) or "—",
                ", ".join(s["navTargets"][:8]) or "—",
            ))
        w("\n")

    w("\n---\n\n## Fichas detalhadas\n\n")
    for m, items in by_mod.items():
        if not items:
            continue
        w("\n# Módulo: %s\n\n" % m)
        for s in sorted(items, key=lambda x: -x["lines"]):
            w('\n<a id="%s"></a>\n' % anchor(s["screen"]))
            w("## %s\n\n" % s["screen"])
            w("- **Arquivo:** `Src/%s` — %d linhas — %d controles\n" %
              (s["file"], s["lines"], s["controlTotal"]))
            w("- **Fundo:** `%s`\n" % (s["background"] or "—"))
            if s["dataSources"]:
                w("- **Fontes de dados:** %s\n" % ", ".join("`%s`" % d for d in s["dataSources"]))
            if s["patchTargets"]:
                w("- **Escreve (Patch) em:** %s\n" % ", ".join("`%s`" % d for d in s["patchTargets"]))
            if s["forms"]:
                w("- **Formulários:**\n")
                for f in s["forms"]:
                    w("  - `%s` → fonte `%s`%s\n" % (
                        f["name"], f["dataSource"] or "?",
                        (" — item: `%s`" % f["item"][:120]) if f["item"] else ""))
            if s["galleries"]:
                w("- **Galerias:**\n")
                for g in s["galleries"]:
                    w("  - `%s` → itens: `%s`\n" % (g["name"], (g["items"] or "?")[:180]))
            if s["flows"]:
                w("- **Flows chamados:** %s\n" % ", ".join("`%s`" % f for f in s["flows"]))
            if s["navTargets"]:
                w("- **Navega para:** %s\n" % ", ".join("`%s`" % n for n in s["navTargets"]))
            if s["globalVars"]:
                w("- **Set() variáveis globais:** %s\n" % ", ".join("`%s`" % v for v in s["globalVars"]))
            if s["contextVars"]:
                w("- **Variáveis de contexto (locais):** %s\n" %
                  ", ".join("`%s`" % v for v in s["contextVars"][:40]))
            if s["collections"]:
                w("- **Coleções (Collect/ClearCollect):** %s\n" %
                  ", ".join("`%s`" % v for v in s["collections"]))
            if s["onVisible"]:
                w("\n**OnVisible:**\n\n```\n%s\n```\n" % s["onVisible"])
            if s["onHidden"]:
                w("\n**OnHidden:** `%s`\n" % s["onHidden"])
            if s["actions"]:
                w("\n**Ações principais:**\n\n")
                w("| Controle | Rótulo | Evento | Código (resumo) |\n|---|---|---|---|\n")
                for a in s["actions"]:
                    code = a["code"].replace("|", "\\|")
                    w("| `%s` (%s) | %s | %s | `%s` |\n" %
                      (a["control"], a["type"], (a["label"] or "").replace("|", "\\|"),
                       a["prop"], code))
            w("\n**Controles:** %s\n\n" %
              ", ".join("%s×%d" % (k, v) for k, v in s["controls"].items()))
    out.close()
    print("OK ->", os.path.join(OUT_DIR, "02-catalogo-de-telas.md"))
    print("telas:", total)


def anchor(s):
    return "tela-" + re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


if __name__ == "__main__":
    main()
