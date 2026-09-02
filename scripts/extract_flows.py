# -*- coding: utf-8 -*-
"""Documenta os 10 Power Automate flows. Gera docs/03-flows.md"""
import json, os, io, glob

BASE = os.path.join(os.path.dirname(__file__), "..")
FLOW_DIR = os.path.join(BASE, "extracted", "Microsoft.Flow", "flows")
OUT = os.path.join(BASE, "docs", "03-flows.md")


def summarize_action(name, a, depth, lines):
    t = a.get("type", "?")
    ind = "  " * depth
    desc = t
    inp = a.get("inputs", {})
    if t == "OpenApiConnection":
        host = (inp.get("host") or {})
        op = host.get("operationId", "?")
        conn = host.get("connectionName") or (host.get("apiId") or "").split("/")[-1]
        desc = "%s :: %s" % (conn, op)
        params = inp.get("parameters", {}) or {}
        pshort = {k: (str(v)[:120]) for k, v in list(params.items())[:8]}
        lines.append("%s- **%s** — `%s`" % (ind, name, desc))
        for k, v in pshort.items():
            lines.append("%s  - `%s`: `%s`" % (ind, k, v))
    elif t in ("Compose", "InitializeVariable", "SetVariable", "Response",
               "ParseJson", "Select", "Table", "Query", "Http"):
        v = json.dumps(inp, ensure_ascii=False)
        lines.append("%s- **%s** (`%s`): `%s`" % (ind, name, t, v[:220]))
    elif t in ("Foreach", "If", "Scope", "Until", "Switch"):
        lines.append("%s- **%s** (`%s`)" % (ind, name, t))
        for sub in ("actions", "else"):
            block = a.get(sub) or (a.get(sub, {}) or {})
            if isinstance(block, dict) and sub == "else":
                block = block.get("actions", {})
            if isinstance(block, dict):
                for sn, sa in block.items():
                    summarize_action(sn, sa, depth + 1, lines)
        cases = a.get("cases") or {}
        for cn, cb in cases.items():
            lines.append("%s  - case %s:" % (ind, cn))
            for sn, sa in (cb.get("actions") or {}).items():
                summarize_action(sn, sa, depth + 2, lines)
    else:
        lines.append("%s- **%s** (`%s`): `%s`" % (ind, name, t, json.dumps(inp, ensure_ascii=False)[:200]))


def main():
    out = io.open(OUT, "w", encoding="utf-8")
    w = out.write
    w("# Medro — Power Automate Flows\n\n")
    w("> 10 flows chamados pelo app via `<Flow>.Run(...)`. "
      "Cada um é acionado por um trigger **PowerApps V2** (HTTP Request) e "
      "normalmente devolve um `Response` com o resultado.\n")
    w("> No backend Node, cada flow vira um **endpoint** (ou job).\n\n")

    metas = []
    for d in sorted(glob.glob(os.path.join(FLOW_DIR, "*", "definition.json"))):
        j = json.load(io.open(d, encoding="utf-8"))
        props = j.get("properties", {})
        defn = props.get("definition", {})
        name = props.get("displayName", os.path.basename(os.path.dirname(d)))
        metas.append(name)
        w("\n---\n\n## %s\n\n" % name)
        # connections
        conns = props.get("connectionReferences", {}) or {}
        if conns:
            w("**Conectores:** %s\n\n" %
              ", ".join(sorted({(v.get("api", {}) or {}).get("name", k) for k, v in conns.items()})))
        # trigger inputs
        trg = defn.get("triggers", {}) or {}
        for tn, tb in trg.items():
            schema = (((tb.get("inputs") or {}).get("schema")) or {})
            props_ = (schema.get("properties") or {})
            if props_:
                w("**Entradas (`%s`):**\n\n" % tn)
                w("| Parâmetro | Título | Tipo |\n|---|---|---|\n")
                for pk, pv in props_.items():
                    w("| `%s` | %s | %s |\n" % (pk, pv.get("title", ""), pv.get("type", "")))
                w("\n")
        # actions
        acts = defn.get("actions", {}) or {}
        lines = []
        for an, ab in acts.items():
            summarize_action(an, ab, 0, lines)
        if lines:
            w("**Ações:**\n\n")
            w("\n".join(lines))
            w("\n")
    out.close()
    print("OK ->", OUT)
    print("flows:", ", ".join(metas))


if __name__ == "__main__":
    main()
