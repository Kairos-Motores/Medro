import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Save,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";
import { useWM } from "@/lib/wm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useModeloDoc } from "./useModeloDoc";
import { renderEditor } from "./editors";
import { LaudoPreviewFrame } from "./previewFrame";
import type { LaudoPage } from "./layout";
import type { LaudoState } from "./state";

/** Capa e Encerramento não podem ser removidos (igual ao report-print). */
const FIXED_PAGE_IDS = new Set(["cover", "back_cover", "final"]);

/** Rótulo pt-BR de cada `page.type` renderizável pelo report-print. */
const PAGE_LABEL: Record<string, string> = {
  PageCover: "Capa",
  PageBackCover: "Contracapa",
  PageOurServices: "Nossos Serviços",
  PageSummary: "Resumo do Equipamento",
  PageStaticTestsDescription: "Descrição dos Ensaios",
  PageFinal: "Encerramento",
  PageProcessData: "Dados de Processo",
  PageDiagnosisAndHistory: "Diagnóstico e Histórico",
  PageMotorElectric: "Relatório Fotográfico",
  PageMechanicalEvaluation: "Avaliação Mecânica",
  PageBearingEvaluation: "Avaliação de Mancais",
  PageComponentsEvaluation: "Componentes Auxiliares",
  PageResistanceTests: "Ensaios de Resistência",
  PageNormativeReferences: "Referências Normativas",
  PageBalanceamento: "Balanceamento Dinâmico",
  PageEditableText: "Texto Fixo",
  PageImageBlock: "Imagem Fixa",
  PageCustomTable: "Tabela Livre",
  PageBuilder: "Página Livre",
};

const PAGE_GROUPS: { grupo: string; tipos: string[] }[] = [
  {
    grupo: "Estruturais",
    tipos: [
      "PageCover",
      "PageBackCover",
      "PageOurServices",
      "PageSummary",
      "PageStaticTestsDescription",
      "PageFinal",
    ],
  },
  {
    grupo: "De dados",
    tipos: [
      "PageProcessData",
      "PageDiagnosisAndHistory",
      "PageMotorElectric",
      "PageMechanicalEvaluation",
      "PageBearingEvaluation",
      "PageComponentsEvaluation",
      "PageResistanceTests",
      "PageNormativeReferences",
      "PageBalanceamento",
    ],
  },
  { grupo: "Customizadas", tipos: ["PageEditableText", "PageImageBlock", "PageCustomTable", "PageBuilder"] },
];

/** OS fictícia para a prévia (o construtor não tem OS carregada). */
const FAKE_OS = {
  cr4a1_novacoluna: "MODELO",
  cr4a1_cliente_nome: "— cliente —",
  unidade_nome: "— unidade —",
  cr4a1_zb6_filial: "0102",
};

function novaPagina(type: string): { page: LaudoPage; init: (d: LaudoState) => void } {
  const id = `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  const page: LaudoPage = { id, type, title: PAGE_LABEL[type] ?? type.replace(/^Page/, "") };
  if (type === "PageMotorElectric") page.keys = [`${id}_b1`, `${id}_b2`];
  const init = (d: LaudoState) => {
    if (type === "PageEditableText") d.textBlocks[id] = { title: "", content: "" };
    if (type === "PageImageBlock") d.imageBlocks[id] = "";
    if (type === "PageCustomTable") {
      d.customTableRows[id] = { title: "", rows: [["", ""]] };
      d.tableHeaders[id] = ["Coluna 1", "Coluna 2"];
    }
    if (type === "PageBuilder") d.freePageBlocks[id] = [];
  };
  return { page, init };
}

export function ModeloBuilder({
  modeloId = null,
  openNonce = 0,
}: {
  modeloId?: string | null;
  openNonce?: number;
}) {
  const token = useAuth((s) => s.token);
  const openWin = useWM((s) => s.open);
  const M = useModeloDoc(modeloId, openNonce);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewReload, setPreviewReload] = useState(0);
  const [erro, setErro] = useState<string | null>(null);

  const layout = M.doc.modelConfig.layout;
  const selected = useMemo(
    () => layout.find((p) => p.id === selectedId) ?? layout[0],
    [layout, selectedId],
  );

  useEffect(() => {
    if (!layout.length) return;
    if (!selectedId || !layout.some((p) => p.id === selectedId)) setSelectedId(layout[0]!.id);
  }, [layout, selectedId]);

  function mover(i: number, dir: -1 | 1) {
    M.patch((d) => {
      const arr = d.modelConfig.layout;
      const j = i + dir;
      if (j < 0 || j >= arr.length) return;
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    });
  }

  function remover(id: string) {
    M.patch((d) => {
      d.modelConfig.layout = d.modelConfig.layout.filter((p) => p.id !== id);
    });
  }

  function adicionar(type: string) {
    const { page, init } = novaPagina(type);
    M.patch((d) => {
      init(d);
      const idx = d.modelConfig.layout.findIndex((p) => p.id === selected?.id);
      const pos = idx >= 0 ? idx + 1 : d.modelConfig.layout.length;
      d.modelConfig.layout.splice(pos, 0, page);
    });
    setSelectedId(page.id);
  }

  async function salvar() {
    setErro(null);
    try {
      await M.save();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao salvar o modelo.");
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <Button variant="ghost" size="sm" onClick={() => openWin("modelos-folder", "Modelos de Laudo")}>
          <ArrowLeft className="size-4" /> Modelos
        </Button>
        <div className="mx-1 hidden h-5 w-px bg-border sm:block" />
        <Input
          value={M.nome}
          onChange={(e) => M.setNome(e.target.value)}
          placeholder="Nome do modelo"
          className="w-64"
        />
        <span className="text-[11.5px] text-muted-foreground">
          {layout.length} página(s){M.modeloId ? "" : " · novo"}
        </span>
        {erro && <span className="text-[12px] text-danger">{erro}</span>}
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" onClick={salvar} disabled={!M.dirty || M.saving}>
            {M.saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {M.dirty ? "Salvar" : "Salvo"}
          </Button>
        </div>
      </div>

      {M.loading ? (
        <div className="p-6 text-[13px] text-muted-foreground">Carregando modelo…</div>
      ) : (
        <div className="grid min-h-0 flex-1 lg:grid-cols-[240px_minmax(340px,440px)_minmax(0,1fr)]">
          {/* páginas */}
          <aside className="min-h-0 overflow-y-auto border-r border-border bg-surface-2 p-3">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Páginas
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-1.5 py-0.5 text-[11px] text-foreground hover:bg-surface-2">
                    <Plus className="size-3" /> Adicionar
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-[70vh] overflow-y-auto">
                  {PAGE_GROUPS.map((g, gi) => (
                    <div key={g.grupo}>
                      {gi > 0 && <DropdownMenuSeparator />}
                      <DropdownMenuLabel>{g.grupo}</DropdownMenuLabel>
                      {g.tipos.map((t) => (
                        <DropdownMenuItem key={t} onSelect={() => adicionar(t)}>
                          {PAGE_LABEL[t] ?? t}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <ol className="space-y-0.5">
              {layout.map((p, i) => {
                const fixa = FIXED_PAGE_IDS.has(p.id);
                const ativo = p.id === selected?.id;
                return (
                  <li
                    key={p.id}
                    className={cn(
                      "group flex items-center gap-0.5 rounded-md pr-1",
                      ativo
                        ? "bg-primary/12"
                        : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                    )}
                  >
                    <button
                      onClick={() => setSelectedId(p.id)}
                      className={cn(
                        "flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-left text-[12.5px]",
                        ativo ? "font-medium text-primary" : "text-foreground",
                      )}
                    >
                      <span className="w-5 shrink-0 text-[11px] text-muted-foreground">{i + 1}</span>
                      <span className="truncate">{p.title}</span>
                    </button>
                    <span className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => mover(i, -1)}
                        disabled={i === 0}
                        className="rounded p-0.5 text-muted-foreground hover:bg-black/[0.06] disabled:opacity-30 dark:hover:bg-white/[0.08]"
                        title="Subir"
                      >
                        <ArrowUp className="size-3" />
                      </button>
                      <button
                        onClick={() => mover(i, 1)}
                        disabled={i === layout.length - 1}
                        className="rounded p-0.5 text-muted-foreground hover:bg-black/[0.06] disabled:opacity-30 dark:hover:bg-white/[0.08]"
                        title="Descer"
                      >
                        <ArrowDown className="size-3" />
                      </button>
                      {!fixa && (
                        <button
                          onClick={() => remover(p.id)}
                          className="rounded p-0.5 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                          title="Remover página"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
          </aside>

          {/* editor da página */}
          <section className="min-h-0 overflow-y-auto border-r border-border p-5">
            {selected && (
              <>
                <header className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Editor · {PAGE_LABEL[selected.type] ?? selected.type}
                  </p>
                  <Input
                    value={selected.title}
                    onChange={(e) =>
                      M.patch((d) => {
                        const pg = d.modelConfig.layout.find((x) => x.id === selected.id);
                        if (pg) pg.title = e.target.value;
                      })
                    }
                    className="mt-1 text-[15px] font-semibold"
                  />
                </header>
                {renderEditor({ page: selected, doc: M.doc, patch: M.patch })}
              </>
            )}
          </section>

          {/* prévia */}
          <section className="min-h-0 flex-col overflow-hidden bg-surface-2 max-lg:hidden lg:flex">
            <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Prévia · dados fictícios
              </span>
              <button
                onClick={() => setPreviewReload((n) => n + 1)}
                className="rounded p-1 text-muted-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                title="Recarregar prévia"
              >
                <RefreshCw className="size-3.5" />
              </button>
            </div>
            <LaudoPreviewFrame
              osParam="MODELO"
              token={token}
              doc={M.doc}
              reloadKey={previewReload}
              overrideOsData={FAKE_OS}
            />
          </section>
        </div>
      )}
    </div>
  );
}
