import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, X, FolderPlus, FolderMinus, Pencil, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useWM } from "@/lib/wm";
import { cn } from "@/lib/cn";
import { gridContainer, gridItem, overlayFade, overlayPanel, tapScale } from "@/lib/motion";
import { useLaunchpadLayout, type LaunchpadFolder } from "@/lib/launchpadLayout";
import { MODULES, ACCENT, moduleById, type ModuleId, type ModuleDef } from "@/modules/registry";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu";

export function Launchpad() {
  const can = useAuth((s) => s.can);
  const { launchpad, setLaunchpad, open } = useWM();
  const { folders, createFolder, addToFolder, removeFromFolder, renameFolder, dissolveFolder } =
    useLaunchpadLayout();

  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);

  useEffect(() => {
    if (!launchpad) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openFolderId) setOpenFolderId(null);
      else setLaunchpad(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [launchpad, setLaunchpad, openFolderId]);

  const allowed = useMemo(
    () => new Set(MODULES.filter((m) => !m.access || can(...m.access)).map((m) => m.id)),
    [can],
  );
  const folderOf = useMemo(() => {
    const map = new Map<ModuleId, LaunchpadFolder>();
    folders.forEach((f) => f.moduleIds.forEach((m) => map.set(m, f)));
    return map;
  }, [folders]);

  const openFolder = folders.find((f) => f.id === openFolderId) ?? null;

  // ordem de topo: percorre MODULES; a pasta aparece na posição do 1º membro
  const topLevel: ({ kind: "mod"; m: ModuleDef } | { kind: "folder"; f: LaunchpadFolder })[] = [];
  for (const m of MODULES) {
    const f = folderOf.get(m.id);
    if (!f) {
      topLevel.push({ kind: "mod", m });
    } else if (f.moduleIds[0] === m.id) {
      topLevel.push({ kind: "folder", f });
    }
  }

  const launch = (id: ModuleId) => {
    if (!allowed.has(id)) return;
    open(id, moduleById(id).label);
  };

  return (
    <AnimatePresence>
      {launchpad && (
        <motion.div
          variants={overlayFade}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-black/40 px-6 pb-16 pt-16 backdrop-blur-xl"
          onClick={() => setLaunchpad(false)}
        >
          <motion.button
            {...tapScale}
            onClick={() => setLaunchpad(false)}
            className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="size-5" />
          </motion.button>

          <motion.div
            variants={gridContainer}
            initial="initial"
            animate="animate"
            className="grid max-w-4xl grid-cols-3 gap-x-8 gap-y-7 sm:grid-cols-4 lg:grid-cols-6"
            onClick={(e) => e.stopPropagation()}
          >
            {topLevel.map((entry) =>
              entry.kind === "folder" ? (
                <FolderTile
                  key={entry.f.id}
                  folder={entry.f}
                  onOpen={() => setOpenFolderId(entry.f.id)}
                  onRename={() => setRenaming(entry.f.id)}
                  onDissolve={() => dissolveFolder(entry.f.id)}
                />
              ) : (
                <ModuleTile
                  key={entry.m.id}
                  m={entry.m}
                  allowed={allowed.has(entry.m.id)}
                  onClick={() => launch(entry.m.id)}
                  menu={
                    <>
                      <ContextMenuSub>
                        <ContextMenuSubTrigger>
                          <FolderPlus className="size-3.5" /> Mover para pasta
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                          {folders.map((f) => (
                            <ContextMenuItem key={f.id} onSelect={() => addToFolder(f.id, entry.m.id)}>
                              {f.name}
                            </ContextMenuItem>
                          ))}
                          {folders.length > 0 && <ContextMenuSeparator />}
                          <ContextMenuItem
                            onSelect={() => {
                              createFolder("Nova pasta", entry.m.id);
                              // abre em modo de renomear logo em seguida
                              setTimeout(() => {
                                const f = useLaunchpadLayout
                                  .getState()
                                  .folders.find((x) => x.moduleIds.includes(entry.m.id));
                                if (f) {
                                  setOpenFolderId(f.id);
                                  setRenaming(f.id);
                                }
                              }, 0);
                            }}
                          >
                            <FolderPlus className="size-3.5" /> Nova pasta…
                          </ContextMenuItem>
                        </ContextMenuSubContent>
                      </ContextMenuSub>
                    </>
                  }
                />
              ),
            )}
          </motion.div>

          {/* pasta aberta */}
          <AnimatePresence>
            {openFolder && (
              <motion.div
                variants={overlayFade}
                initial="initial"
                animate="animate"
                exit="exit"
                className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 p-6 backdrop-blur-sm"
                onClick={() => {
                  setOpenFolderId(null);
                  setRenaming(null);
                }}
              >
                <motion.div
                  variants={overlayPanel}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full max-w-3xl rounded-2xl border border-white/15 bg-black/30 p-6 shadow-mac-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-4 flex items-center gap-2">
                    {renaming === openFolder.id ? (
                      <input
                        autoFocus
                        defaultValue={openFolder.name}
                        onBlur={(e) => {
                          renameFolder(openFolder.id, e.target.value);
                          setRenaming(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                          if (e.key === "Escape") setRenaming(null);
                        }}
                        className="rounded-md bg-white/10 px-2 py-1 text-[15px] font-semibold text-white outline-none ring-1 ring-white/30"
                      />
                    ) : (
                      <button
                        onClick={() => setRenaming(openFolder.id)}
                        className="group flex items-center gap-1.5 text-[15px] font-semibold text-white"
                        title="Renomear pasta"
                      >
                        {openFolder.name}
                        <Pencil className="size-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setOpenFolderId(null);
                        setRenaming(null);
                      }}
                      className="ml-auto flex size-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <motion.div
                    variants={gridContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-3 gap-x-8 gap-y-6 sm:grid-cols-5"
                  >
                    {openFolder.moduleIds.map((id) => {
                      const m = moduleById(id);
                      if (!m) return null;
                      return (
                        <ModuleTile
                          key={id}
                          m={m}
                          allowed={allowed.has(id)}
                          onClick={() => launch(id)}
                          menu={
                            <ContextMenuItem onSelect={() => removeFromFolder(openFolder.id, id)}>
                              <FolderMinus className="size-3.5" /> Tirar da pasta
                            </ContextMenuItem>
                          }
                        />
                      );
                    })}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModuleTile({
  m,
  allowed,
  onClick,
  menu,
}: {
  m: ModuleDef;
  allowed: boolean;
  onClick: () => void;
  menu?: React.ReactNode;
}) {
  const Icon = m.icon;
  const a = ACCENT[m.accent];
  const btn = (
    <motion.button
      variants={gridItem}
      disabled={!allowed}
      onClick={onClick}
      whileHover={allowed ? { scale: 1.07 } : undefined}
      whileTap={allowed ? { scale: 0.9 } : undefined}
      className="group flex w-24 flex-col items-center gap-2 disabled:opacity-40"
    >
      <span
        className={cn(
          "relative flex size-16 items-center justify-center rounded-2xl border border-white/20 bg-surface shadow-mac-2",
          a.text,
        )}
      >
        <Icon className="size-7" strokeWidth={1.9} />
        {!allowed && (
          <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-elevated-dark text-white">
            <Lock className="size-3" />
          </span>
        )}
      </span>
      <span className="text-center text-[12px] font-medium leading-tight text-white">{m.label}</span>
    </motion.button>
  );
  if (!menu) return btn;
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{btn}</ContextMenuTrigger>
      <ContextMenuContent>{menu}</ContextMenuContent>
    </ContextMenu>
  );
}

function FolderTile({
  folder,
  onOpen,
  onRename,
  onDissolve,
}: {
  folder: LaunchpadFolder;
  onOpen: () => void;
  onRename: () => void;
  onDissolve: () => void;
}) {
  const preview = folder.moduleIds.slice(0, 9);
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <motion.button
          variants={gridItem}
          onClick={onOpen}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.9 }}
          className="group flex w-24 flex-col items-center gap-2"
        >
          <span className="grid size-16 grid-cols-3 grid-rows-3 gap-[3px] rounded-2xl border border-white/20 bg-white/10 p-2 shadow-mac-2 backdrop-blur">
            {preview.map((id) => {
              const m = moduleById(id);
              const Icon = m?.icon;
              return (
                <span
                  key={id}
                  className={cn(
                    "flex items-center justify-center rounded-[4px] bg-surface",
                    m && ACCENT[m.accent].text,
                  )}
                >
                  {Icon && <Icon className="size-2.5" strokeWidth={2.2} />}
                </span>
              );
            })}
          </span>
          <span className="text-center text-[12px] font-medium leading-tight text-white">
            {folder.name}
          </span>
        </motion.button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={onOpen}>Abrir pasta</ContextMenuItem>
        <ContextMenuItem onSelect={onRename}>
          <Pencil className="size-3.5" /> Renomear
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem destructive onSelect={onDissolve}>
          <LogOut className="size-3.5" /> Desfazer pasta
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
