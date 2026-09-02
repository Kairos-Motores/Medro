# -*- coding: utf-8 -*-
"""Grafo de navegação + mapa de permissões. Gera docs/04-navegacao-e-permissoes.md"""
import json, os, io, re, glob, collections

BASE = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(BASE, "extracted", "Microsoft.PowerApps", "apps",
                   "4226216083896037548", "msapp", "Src")
OUT = os.path.join(BASE, "docs", "04-navegacao-e-permissoes.md")
screens = json.load(io.open(os.path.join(BASE, "docs", "_data", "screens.json"), encoding="utf-8"))
names = {x["screen"] for x in screens if "screen" in x}

edges = []
for x in screens:
    if "screen" not in x:
        continue
    for t in x["navTargets"]:
        if t in names and t != x["screen"]:
            edges.append((x["screen"], t))
edges = sorted(set(edges))

# permission tokens across all source
perm_tokens = collections.Counter()
tok_screens = collections.defaultdict(set)
for path in glob.glob(os.path.join(SRC, "*.pa.yaml")):
    txt = io.open(path, encoding="utf-8").read()
    stem = os.path.basename(path)[:-8]
    # token literal imediatamente antes de `in` (operador de substring do Power Fx)
    for m in re.finditer(r'"(_?[A-Z][A-Z0-9_]{1,22})"\s*in\b', txt):
        tok = m.group(1)
        ctx = txt[m.start(): m.start() + 400]
        if "acesso_mod" in ctx or "acesso" in ctx.lower() or tok.startswith("_"):
            perm_tokens[tok] += 1
            tok_screens[tok].add(stem)

out = io.open(OUT, "w", encoding="utf-8")
w = out.write
w("# Medro — Navegação e Permissões\n\n")

w("## 1. Modelo de autenticação\n\n")
w("Login próprio na tabela Dataverse **`Credenciaiss`** (`cr4a1_credenciais`). "
  "Não usa Azure AD para o usuário final.\n\n")
w("Regra observada em `Login.OnSelect`:\n\n")
w("```\nLookUp(Credenciaiss, Usuário = caixausuario1.Text And Matrícula = caixasenha1.Text And xstatus = \"Ativo\")\n```\n\n")
w("Variáveis globais definidas no login: `varlogin` (usuário), `varsenha`, `varnome` (Título), `varfilial` (Filial).\n\n")
w("### Campos de `Credenciaiss` usados como autorização\n\n")
w("| Campo | Uso |\n|---|---|\n")
w("| `Usuário` / `varlogin` | identificador de login |\n")
w("| `Matrícula` | senha |\n")
w("| `xstatus` | `\"Ativo\"` habilita o acesso |\n")
w("| `Título` | nome do colaborador (exibição, filtros de galeria) |\n")
w("| `Filial` | São Luís, Aveiro, Barcarena, Parauapebas, São José dos Campos |\n")
w("| `acesso_mod` | string com **tokens de módulo/ação** concatenados; testado com `\"TOKEN\" in acesso_mod` |\n")
w("| `Acesso` | perfil textual (ex.: `\"SSMA\"`) |\n")
w("| `1_Nivel`, `2_Nivel` | nível de produção (ex.: `\"PRODUÇÃO PADRÃO\"`, `\"TESTE\"`) |\n\n")

w("### Tokens de `acesso_mod` encontrados no código\n\n")
w("> `\"TOKEN\" in LookUp(Credenciaiss, varlogin = Usuário, acesso_mod)` — habilita telas/botões.\n\n")
w("| Token | Ocorrências | Telas |\n|---|--:|---|\n")
KNOWN = {
    "OS": "módulo OS Medro", "GER": "Gerenciamento/PCP", "AVA": "Avaliação Final",
    "CAL": "Caldeiraria", "DPT": "Departamento Técnico", "ESCOPO": "Escopo de Manutenção",
    "FER": "Ferramentaria", "INS": "Inspeção de Qualidade", "QRL": "QR Code / Laudos",
    "ROT": "Rotas/Trajetos", "SPO": "Serviços Externos Portugal", "TER": "Terceirizados",
    "TES": "Testes/Ensaio",
    "_AVA_LIB": "Avaliação: liberar", "_CAL_CAD": "Caldeiraria: cadastrar",
    "_DPT_REMOVE": "DPT: remover", "_DTI_LINK": "DPT: gerar link",
    "_G_CAD": "Gerência: cadastro", "_G_LOG": "Gerência: log", "_G_PCP": "Gerência: PCP",
    "_LOG_CHE": "Login checklist", "_OS_EDOS": "OS: editar OS", "_OS_HG": "OS: histórico",
    "_OS_REP": "OS: reprovar", "_OS_SENHA": "OS: senha", "_OS_EDIT_HIST": "OS: editar histórico",
    "_PCP_RQ": "PCP: requisição", "_TER_CAD": "Terceirizados: cadastrar",
    "_ROTA_MOT": "Rota: motorista", "_ROTA_AUX": "Rota: auxiliar",
}
for tok, cnt in sorted(perm_tokens.items(), key=lambda kv: (-kv[1], kv[0])):
    w("| `%s` | %d | %s |\n" % (tok, cnt, ", ".join(sorted(tok_screens[tok])[:6])))
w("\n**Legenda provável dos tokens:** " +
  "; ".join("`%s` = %s" % (k, v) for k, v in KNOWN.items()) + "\n\n")

w("## 2. Roteamento pós-login\n\n")
w("`Login` → `1_Menu`. A partir do menu, o botão **Medro** roteia por `acesso_mod` / nível / filial:\n\n")
w("- token `SELEC_COD` em `acesso_mod` **ou** nível `PRODUÇÃO PADRÃO`+`TESTE` → `SELEC_COD` (hub principal)\n")
w("- `Filial = \"São Luís\"` e `Acesso = \"SSMA\"` → `Seleção_trajeto_SSMA`\n")
w("- botão **RDS** → `Menu_RDS`; botão **Relatório** → `Relatorio`\n")
w("- `SELEC_COD` é o hub que abre os módulos (%d destinos)\n\n" %
  len([e for e in edges if e[0] == "SELEC_COD"]))

w("## 3. Grafo de navegação (Navigate)\n\n")
w("```mermaid\ngraph LR\n")
def nid(s):
    return re.sub(r"[^A-Za-z0-9]", "_", s)
for a, b in edges:
    w("  %s[%s] --> %s[%s]\n" % (nid(a), a, nid(b), b))
w("```\n\n")

w("## 4. Telas sem entrada por Navigate (entrada por menu, deep-link ou órfãs)\n\n")
ind = collections.Counter(b for _, b in edges)
for n in sorted(names):
    if ind[n] == 0:
        w("- `%s`\n" % n)
out.close()
print("OK ->", OUT, "| edges:", len(edges))
