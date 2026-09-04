import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Folder, FileText, Trash2, FolderOpen } from "lucide-react";
import { SPRING_SNAPPY } from "@/lib/motion";
import { useWM } from "@/lib/wm";
import { useAuth } from "@/lib/auth";
import { useDesktopShortcuts, type DesktopShortcut } from "@/lib/desktopShortcuts";
import { moduleById } from "@/modules/registry";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

/** Ícones/atalhos na área de trabalho (estilo macOS/Windows). */
export function DesktopIcons() {
  const { shortcuts, remove, seedRascunhos } = useDesktopShortcuts();
  const can = useAuth((s) => s.can);
  const authed = useAuth((s) => !!s.user);
  const canDpt = authed && can("DPT");
  const open = useWM((s) => s.open);

  // semeia a "pasta" de rascunhos uma vez para quem é do DPT
  useEffect(() => {
    if (canDpt) seedRascunhos();
  }, [canDpt, seedRascunhos]);

  // só mostra atalhos de módulos aos quais o usuário tem acesso
  const visiveis = shortcuts.filter((sc) => {
    const acc = moduleById(sc.moduleId).access;
    return !acc?.length || (authed && can(...acc));
  });
  if (visiveis.length === 0) return null;

  function abrir(sc: DesktopShortcut) {
    if (sc.kind === "laudo" && sc.osId) {
      open("laudos-gen", `Laudo ${sc.osId}`, { osId: sc.osId });
    } else if (sc.kind === "rascunhos") {
      open("rascunhos-folder", "Laudos em andamento");
    } else {
      open(sc.moduleId, moduleById(sc.moduleId).label);
    }
  }

  return (
    <div className="pointer-events-none absolute left-3 top-3 z-[1] flex flex-col flex-wrap gap-1 content-start max-h-[calc(100%-1.5rem)]">
      <AnimatePresence initial={false}>
      {visiveis.map((sc, i) => {
        const Icon =
          sc.kind === "rascunhos" ? Folder : sc.kind === "laudo" ? FileText : moduleById(sc.moduleId).icon;
        return (
          <motion.div
            key={sc.id}
            layout
            initial={{ opacity: 0, scale: 0.5, x: -12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.14 } }}
            transition={{ ...SPRING_SNAPPY, delay: i * 0.04 }}
          >
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onDoubleClick={() => abrir(sc)}
                  className="pointer-events-auto flex w-[86px] flex-col items-center gap-1 rounded-lg px-1.5 py-2 text-center outline-none transition-colors hover:bg-white/40 focus-visible:bg-white/40 dark:hover:bg-white/10 dark:focus-visible:bg-white/10"
                  title={`${sc.label} — dois cliques para abrir`}
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-surface/80 text-primary shadow-ios-1 backdrop-blur">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </span>
                  <span className="line-clamp-2 text-[11px] font-medium leading-tight text-foreground drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                    {sc.label}
                  </span>
                </motion.button>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onSelect={() => abrir(sc)}>
                  <FolderOpen className="size-3.5" /> Abrir
                </ContextMenuItem>
                {sc.kind !== "rascunhos" && (
                  <>
                    <ContextMenuSeparator />
                    <ContextMenuItem destructive onSelect={() => remove(sc.id)}>
                      <Trash2 className="size-3.5" /> Remover atalho
                    </ContextMenuItem>
                  </>
                )}
              </ContextMenuContent>
            </ContextMenu>
          </motion.div>
        );
      })}
      </AnimatePresence>
    </div>
  );
}
