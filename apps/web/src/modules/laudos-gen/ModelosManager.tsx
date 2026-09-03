import { useEffect, useState } from "react";
import {
  FilePlus2,
  FileStack,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Sparkles,
  RefreshCw,
  Loader2,
  Plus,
} from "lucide-react";
import { useWM } from "@/lib/wm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { AreaField, SelectField } from "./fields";
import {
  useModelos,
  useAtualizarModelo,
  useExcluirModelo,
  useDuplicarModelo,
  useIaConfig,
  useSetIaConfig,
  type ModeloRow,
} from "./api";

/** nº de páginas de um modelo, lido do JSON de configuração. */
function contarPaginas(cfg: string): number | null {
  try {
    const p = JSON.parse(cfg);
    return Array.isArray(p?.modelConfig?.layout) ? p.modelConfig.layout.length : null;
  } catch {
    return null;
  }
}

function fmtData(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

/** App de gerência dos modelos de laudo (pseudo-módulo `modelos-folder`, DPT). */
export function ModelosManager() {
  const modelos = useModelos();
  const open = useWM((s) => s.open);
  const duplicar = useDuplicarModelo();

  const [renomear, setRenomear] = useState<ModeloRow | null>(null);
  const [excluir, setExcluir] = useState<ModeloRow | null>(null);
  const [configIa, setConfigIa] = useState<ModeloRow | null>(null);

  const editar = (m: ModeloRow) =>
    open("modelo-builder", `Modelo: ${m.cr4a1_nome_modelo}`, {
      modeloId: m.cr4a1_modelos_relatoriosid,
    });

  const novo = () => open("modelo-builder", "Novo modelo", { modeloId: "" });

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <div>
          <p className="text-[13px] font-semibold text-foreground">Modelos de Laudo</p>
          <p className="text-[11.5px] text-muted-foreground">
            {modelos.data?.length ?? 0} modelo(s) — estrutura reaproveitável entre OS
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => modelos.refetch()}
            className="rounded p-1.5 text-muted-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
            title="Atualizar"
          >
            <RefreshCw className={modelos.isFetching ? "size-3.5 animate-spin" : "size-3.5"} />
          </button>
          <Button size="sm" onClick={novo}>
            <Plus className="size-4" /> Novo modelo
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {modelos.isLoading ? (
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Carregando…
          </div>
        ) : !modelos.data?.length ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
            <FileStack className="size-8 opacity-30" />
            <p className="text-[13px]">Nenhum modelo salvo ainda.</p>
            <p className="text-[12px] opacity-70">
              Crie um modelo do zero ou salve a estrutura de um laudo existente como modelo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
            {modelos.data.map((m) => {
              const paginas = contarPaginas(m.cr4a1_configuracao_json);
              return (
                <div
                  key={m.cr4a1_modelos_relatoriosid}
                  className="group flex flex-col gap-2 rounded-lg border border-border bg-surface p-3 shadow-ios-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FilePlus2 className="size-4.5" strokeWidth={1.75} />
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="rounded-md p-1 text-muted-foreground opacity-0 hover:bg-surface-2 focus-visible:opacity-100 group-hover:opacity-100"
                          title="Ações"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => editar(m)}>
                          <Pencil className="size-3.5" /> Editar estrutura
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setConfigIa(m)}>
                          <Sparkles className="size-3.5" /> Configurar IA
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setRenomear(m)}>
                          <Pencil className="size-3.5" /> Renomear
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => duplicar.mutate(m.cr4a1_modelos_relatoriosid)}
                        >
                          <Copy className="size-3.5" /> Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-danger focus:bg-danger/10 focus:text-danger"
                          onSelect={() => setExcluir(m)}
                        >
                          <Trash2 className="size-3.5" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <button onClick={() => editar(m)} className="min-w-0 text-left">
                    <p className="truncate text-[13px] font-semibold text-foreground">
                      {m.cr4a1_nome_modelo || "(sem nome)"}
                    </p>
                  </button>

                  <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                    <span>{paginas == null ? "estrutura inválida" : `${paginas} página(s)`}</span>
                    <span aria-hidden>·</span>
                    <span
                      className={
                        m.cr4a1_ia_provider
                          ? "inline-flex items-center gap-1 text-primary"
                          : ""
                      }
                    >
                      {m.cr4a1_ia_provider ? (
                        <>
                          <Sparkles className="size-3" /> IA: {m.cr4a1_ia_provider}
                        </>
                      ) : (
                        "sem IA"
                      )}
                    </span>
                    {m.modifiedon && (
                      <>
                        <span aria-hidden>·</span>
                        <span>{fmtData(m.modifiedon)}</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <RenomearDialog modelo={renomear} onClose={() => setRenomear(null)} />
      <ExcluirDialog modelo={excluir} onClose={() => setExcluir(null)} />
      <ConfigIaDialog modelo={configIa} onClose={() => setConfigIa(null)} />
    </div>
  );
}

/* ── renomear ─────────────────────────────────────────────────────────────── */

function RenomearDialog({ modelo, onClose }: { modelo: ModeloRow | null; onClose: () => void }) {
  const atualizar = useAtualizarModelo();
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  // sincroniza o campo quando um modelo diferente é aberto
  const key = modelo?.cr4a1_modelos_relatoriosid ?? "";
  useEffect(() => {
    setNome(modelo?.cr4a1_nome_modelo ?? "");
    setErro(null);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  async function salvar() {
    if (!modelo || !nome.trim()) return;
    setErro(null);
    try {
      await atualizar.mutateAsync({ id: modelo.cr4a1_modelos_relatoriosid, nome: nome.trim() });
      onClose();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao renomear.");
    }
  }

  return (
    <Sheet open={!!modelo} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="center" className="max-w-sm gap-3">
        <SheetTitle>Renomear modelo</SheetTitle>
        <Input
          autoFocus
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && salvar()}
          placeholder="Nome do modelo"
        />
        {erro && <p className="text-[12px] text-danger">{erro}</p>}
        <div className="mt-1 flex justify-end gap-2">
          <Button variant="neutral" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button size="sm" onClick={salvar} disabled={!nome.trim() || atualizar.isPending}>
            {atualizar.isPending ? <Loader2 className="size-4 animate-spin" /> : "Salvar"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ── excluir ──────────────────────────────────────────────────────────────── */

function ExcluirDialog({ modelo, onClose }: { modelo: ModeloRow | null; onClose: () => void }) {
  const excluir = useExcluirModelo();
  return (
    <Sheet open={!!modelo} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="center" className="max-w-sm gap-3">
        <SheetTitle>Excluir modelo</SheetTitle>
        <SheetDescription>
          Excluir <strong>{modelo?.cr4a1_nome_modelo}</strong>? Laudos já emitidos não são
          afetados; laudos em andamento vinculados a este modelo continuam com a estrutura que já
          têm.
        </SheetDescription>
        <div className="mt-1 flex justify-end gap-2">
          <Button variant="neutral" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={excluir.isPending}
            onClick={() =>
              modelo &&
              excluir.mutate(modelo.cr4a1_modelos_relatoriosid, { onSettled: onClose })
            }
          >
            {excluir.isPending ? <Loader2 className="size-4 animate-spin" /> : "Excluir"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ── config de IA ─────────────────────────────────────────────────────────── */

const PROVIDERS = [
  { value: "gemini", label: "Google Gemini" },
  { value: "groq", label: "Groq" },
  { value: "openrouter", label: "OpenRouter" },
];

function ConfigIaDialog({ modelo, onClose }: { modelo: ModeloRow | null; onClose: () => void }) {
  const id = modelo?.cr4a1_modelos_relatoriosid ?? null;
  const cfg = useIaConfig(id);
  const salvar = useSetIaConfig();
  const [provider, setProvider] = useState("gemini");
  const [prompt, setPrompt] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  // recarrega o form quando o dialog abre com a resposta da API
  useEffect(() => {
    if (cfg.data) {
      setProvider(cfg.data.provider || "gemini");
      setPrompt(cfg.data.prompt || "");
    }
    setErro(null);
  }, [cfg.data]); // eslint-disable-line react-hooks/exhaustive-deps

  async function persistir() {
    if (!id) return;
    setErro(null);
    try {
      await salvar.mutateAsync({ id, provider, prompt });
      onClose();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao salvar a configuração.");
    }
  }

  return (
    <Sheet open={!!modelo} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="center" className="max-w-lg gap-3">
        <SheetTitle>Configurar IA — {modelo?.cr4a1_nome_modelo}</SheetTitle>
        <SheetDescription>
          O provedor e o prompt ficam no modelo; a chave de API fica no servidor (<code>.env</code>).
        </SheetDescription>
        {cfg.isLoading ? (
          <div className="flex items-center gap-2 py-4 text-[12px] text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Carregando…
          </div>
        ) : (
          <>
            <SelectField
              label="Provedor"
              value={provider}
              onChange={setProvider}
              options={PROVIDERS}
            />
            <AreaField
              label="Prompt do sistema"
              rows={8}
              value={prompt}
              onChange={setPrompt}
              placeholder="Instruções fixas para a IA ao gerar os textos do diagnóstico…"
            />
            {cfg.data?.apiKeyPreview ? (
              <p className="text-[11.5px] text-muted-foreground">
                Chave no servidor: {cfg.data.apiKeyPreview}
              </p>
            ) : (
              <p className="text-[11.5px] text-muted-foreground">
                Sem chave dedicada — usa a chave global do provedor no servidor.
              </p>
            )}
            {erro && <p className="text-[12px] text-danger">{erro}</p>}
            <div className="mt-1 flex justify-end gap-2">
              <Button variant="neutral" size="sm" onClick={onClose}>
                Cancelar
              </Button>
              <Button size="sm" onClick={persistir} disabled={salvar.isPending}>
                {salvar.isPending ? <Loader2 className="size-4 animate-spin" /> : "Salvar"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
