import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  RefreshCw,
  Trash2,
  Maximize2,
  ArrowUpRight,
  AlertTriangle,
  Loader2,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useWM } from "@/lib/wm";
import { useWidgets } from "@/lib/useWidgets";
import { ACCENT, moduleById } from "@/modules/registry";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from "@/components/ui/context-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SIZE_LABEL, type PlacedWidget, type WidgetDef, type WidgetSize } from "./types";

/** canal p/ o item "Atualizar" chamar o refetch do widget montado. */
const RefetchCtx = createContext<(fn: () => void) => void>(() => {});

/** o widget registra sua função de refetch (deve ser estável — use useCallback). */
export function useWidgetRefetch(fn: () => void) {
  const reg = useContext(RefetchCtx);
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    reg(() => ref.current());
  }, [reg]);
}

export function WidgetShell({
  def,
  placed,
  dragHandleProps,
  selected = false,
  children,
}: {
  def: WidgetDef;
  placed: PlacedWidget;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  /** enquadra o widget (borda + fundo sólido); fora disso ele é transparente */
  selected?: boolean;
  children: ReactNode;
}) {
  const remove = useWidgets((s) => s.remove);
  const resize = useWidgets((s) => s.resize);
  const setConfig = useWidgets((s) => s.setConfig);
  const open = useWM((s) => s.open);
  const refetchRef = useRef<null | (() => void)>(null);
  const [cfgOpen, setCfgOpen] = useState(false);

  const accent = def.module ? moduleById(def.module).accent : (def.accent ?? "slate");
  const a = ACCENT[accent];
  const Icon = def.icon;
  const modLabel = def.module ? moduleById(def.module).label : null;

  return (
    <RefetchCtx.Provider
      value={(fn) => {
        refetchRef.current = fn;
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            onContextMenu={(e) => e.stopPropagation()}
            className={cn(
              // padrão: fundo translúcido (mesmo material dos menus), não opaco
              "material-menu flex h-full w-full flex-col overflow-hidden rounded-xl border transition-[border-color,box-shadow,background-color] duration-150",
              selected
                ? "border-border bg-surface shadow-ios-2"
                : "border-transparent shadow-none hover:border-border/50",
            )}
          >
            <div
              {...dragHandleProps}
              className={cn(
                "flex shrink-0 touch-none select-none items-center gap-1.5 border-b px-2.5 py-1.5 transition-colors",
                selected ? "border-border/60" : "border-transparent",
                dragHandleProps && "cursor-grab active:cursor-grabbing",
              )}
            >
              <span className={cn("size-1.5 shrink-0 rounded-full", a.dot)} />
              <Icon className={cn("size-3 shrink-0", a.text)} />
              <span className="truncate text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                {def.title}
              </span>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-2.5">{children}</div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {def.sizes.length > 1 && (
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Maximize2 className="size-3.5" /> Tamanho
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuRadioGroup
                  value={placed.size}
                  onValueChange={(v) => resize(placed.instanceId, v as WidgetSize)}
                >
                  {def.sizes.map((s) => (
                    <ContextMenuRadioItem key={s} value={s}>
                      {SIZE_LABEL[s]}
                    </ContextMenuRadioItem>
                  ))}
                </ContextMenuRadioGroup>
              </ContextMenuSubContent>
            </ContextMenuSub>
          )}
          <ContextMenuItem onSelect={() => refetchRef.current?.()}>
            <RefreshCw className="size-3.5" /> Atualizar
          </ContextMenuItem>
          {def.ConfigForm && (
            <ContextMenuItem onSelect={() => setCfgOpen(true)}>
              <Settings2 className="size-3.5" /> Configurar…
            </ContextMenuItem>
          )}
          {def.module && modLabel && (
            <ContextMenuItem onSelect={() => open(def.module!, modLabel)}>
              <ArrowUpRight className="size-3.5" /> Abrir {modLabel}
            </ContextMenuItem>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem destructive onSelect={() => remove(placed.instanceId)}>
            <Trash2 className="size-3.5" /> Remover
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {def.ConfigForm && (
        <Sheet open={cfgOpen} onOpenChange={setCfgOpen}>
          <SheetContent side="center" className="max-w-sm gap-3">
            <SheetTitle>{def.title} — configurar</SheetTitle>
            <def.ConfigForm
              config={placed.config}
              setConfig={(patch) => setConfig(placed.instanceId, patch)}
            />
          </SheetContent>
        </Sheet>
      )}
    </RefetchCtx.Provider>
  );
}

/* estados comuns dos widgets */

export function WidgetLoading() {
  return (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
    </div>
  );
}

export function WidgetError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1.5 text-center text-[11.5px] text-muted-foreground">
      <AlertTriangle className="size-4 text-danger" />
      <span>Não foi possível carregar.</span>
      {onRetry && (
        <button onClick={onRetry} className="font-medium text-primary hover:underline">
          Tentar de novo
        </button>
      )}
    </div>
  );
}

export function WidgetEmpty({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center px-2 text-center text-[11.5px] text-muted-foreground">
      {children}
    </div>
  );
}
