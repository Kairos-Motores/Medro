import { useState } from "react";
import { FileText, FolderOpen, MonitorUp, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { useWM } from "@/lib/wm";
import { useDesktopShortcuts } from "@/lib/desktopShortcuts";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { useRascunhos, useExcluirRascunho } from "./api";

/**
 * "Pasta" de laudos em andamento — laudos iniciados e ainda não emitidos.
 * Dois cliques abrem o Gerador de Laudos já carregado naquela OS.
 */
export function RascunhosFolder() {
  const rascunhos = useRascunhos();
  const excluir = useExcluirRascunho();
  const open = useWM((s) => s.open);
  const addShortcut = useDesktopShortcuts((s) => s.add);
  const [confirmar, setConfirmar] = useState<string | null>(null);

  const abrir = (osId: string) => open("laudos-gen", `Laudo ${osId}`, { osId });

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div>
          <p className="text-[13px] font-semibold text-foreground">Laudos em andamento</p>
          <p className="text-[11.5px] text-muted-foreground">
            {rascunhos.data?.length ?? 0} rascunho(s) — dois cliques para continuar
          </p>
        </div>
        <button
          onClick={() => rascunhos.refetch()}
          className="rounded p-1.5 text-muted-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
          title="Atualizar"
        >
          <RefreshCw className={rascunhos.isFetching ? "size-3.5 animate-spin" : "size-3.5"} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {rascunhos.isLoading ? (
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Carregando…
          </div>
        ) : !rascunhos.data?.length ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
            <FileText className="size-8 opacity-30" />
            <p className="text-[13px]">Nenhum laudo em andamento.</p>
            <p className="text-[12px] opacity-70">
              Abra o Gerador de Laudos e carregue uma OS para começar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(108px,1fr))] gap-1">
            {rascunhos.data.map((r) => (
              <ContextMenu key={`${r.osId}:${r.tipo}`}>
                <ContextMenuTrigger asChild>
                  <button
                    onDoubleClick={() => abrir(r.osId)}
                    className="flex flex-col items-center gap-1.5 rounded-lg px-2 py-3 text-center outline-none transition hover:bg-primary/[0.06] focus-visible:bg-primary/[0.06]"
                    title={`${r.osId} — dois cliques para abrir`}
                  >
                    <span className="flex size-12 items-center justify-center rounded-xl bg-surface-2 text-primary">
                      <FileText className="size-6" strokeWidth={1.75} />
                    </span>
                    <span className="w-full truncate text-[12px] font-medium text-foreground">
                      {r.osId}
                    </span>
                    <span className="text-[10.5px] text-muted-foreground">{fmt(r.atualizadoEm)}</span>
                  </button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onSelect={() => abrir(r.osId)}>
                    <FolderOpen className="size-3.5" /> Abrir
                  </ContextMenuItem>
                  <ContextMenuItem
                    onSelect={() =>
                      addShortcut({
                        kind: "laudo",
                        moduleId: "laudos-gen",
                        osId: r.osId,
                        label: `Laudo ${r.osId}`,
                      })
                    }
                  >
                    <MonitorUp className="size-3.5" /> Fixar na área de trabalho
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem destructive onSelect={() => setConfirmar(r.osId)}>
                    <Trash2 className="size-3.5" /> Excluir rascunho
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        )}
      </div>

      {confirmar && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 p-6">
          <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-4 shadow-popover">
            <p className="text-[13px] font-semibold text-foreground">Excluir rascunho da OS {confirmar}?</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              O progresso não salvo/enviado deste laudo será perdido. Laudos já emitidos (PDF) não são afetados.
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => setConfirmar(null)}
                className="rounded-md border border-border px-3 py-1.5 text-[12px] text-foreground hover:bg-surface-2"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  excluir.mutate(confirmar, { onSettled: () => setConfirmar(null) });
                }}
                disabled={excluir.isPending}
                className="rounded-md bg-danger px-3 py-1.5 text-[12px] font-medium text-white hover:brightness-95 disabled:opacity-50"
              >
                {excluir.isPending ? "Excluindo…" : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function fmt(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}
