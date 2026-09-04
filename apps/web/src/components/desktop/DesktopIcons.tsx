import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Folder, FileText, Trash2, FolderOpen, RotateCcw } from "lucide-react";
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
import { cn } from "@/lib/cn";

function getDefaultPosition(index: number, containerHeight: number) {
  const iconWidth = 92;
  const iconHeight = 98;
  const startX = 14;
  const startY = 14;
  const usableH = Math.max(200, containerHeight - 80);
  const rows = Math.max(1, Math.floor((usableH - startY) / iconHeight));
  const col = Math.floor(index / rows);
  const row = index % rows;
  return {
    x: startX + col * iconWidth,
    y: startY + row * iconHeight,
  };
}

interface DesktopIconItemProps {
  shortcut: DesktopShortcut;
  index: number;
  containerSize: { width: number; height: number };
  onOpen: (sc: DesktopShortcut) => void;
  onRemove: (id: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onResetPosition: (id: string) => void;
}

function DesktopIconItem({
  shortcut: sc,
  index,
  containerSize,
  onOpen,
  onRemove,
  onUpdatePosition,
  onResetPosition,
}: DesktopIconItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    pointerX: number;
    pointerY: number;
    hasMoved: boolean;
  } | null>(null);

  const justDraggedRef = useRef(false);

  const defaultPos = getDefaultPosition(index, containerSize.height);

  const maxX = Math.max(8, containerSize.width - 92);
  const maxY = Math.max(8, containerSize.height - 100);

  const effectiveX =
    sc.x !== undefined ? Math.max(8, Math.min(sc.x, maxX)) : defaultPos.x;
  const effectiveY =
    sc.y !== undefined ? Math.max(8, Math.min(sc.y, maxY)) : defaultPos.y;

  const currentX = dragPos ? dragPos.x : effectiveX;
  const currentY = dragPos ? dragPos.y : effectiveY;

  const Icon =
    sc.kind === "rascunhos"
      ? Folder
      : sc.kind === "laudo"
        ? FileText
        : moduleById(sc.moduleId).icon;

  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return; // apenas botão primário
    e.stopPropagation();

    dragRef.current = {
      pointerId: e.pointerId,
      startX: effectiveX,
      startY: effectiveY,
      pointerX: e.clientX,
      pointerY: e.clientY,
      hasMoved: false,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;

    const dx = e.clientX - d.pointerX;
    const dy = e.clientY - d.pointerY;

    if (!d.hasMoved) {
      if (Math.hypot(dx, dy) > 4) {
        d.hasMoved = true;
        setIsDragging(true);
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {}
      } else {
        return;
      }
    }

    const nx = Math.max(8, Math.min(d.startX + dx, maxX));
    const ny = Math.max(8, Math.min(d.startY + dy, maxY));
    setDragPos({ x: nx, y: ny });
  }

  function onPointerUp(e: React.PointerEvent) {
    const d = dragRef.current;
    if (d && d.pointerId === e.pointerId) {
      if (d.hasMoved && dragPos) {
        justDraggedRef.current = true;
        setTimeout(() => {
          justDraggedRef.current = false;
        }, 150);

        try {
          (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {}

        onUpdatePosition(sc.id, dragPos.x, dragPos.y);
      }
    }
    dragRef.current = null;
    setIsDragging(false);
    setDragPos(null);
  }

  function onPointerCancel(e: React.PointerEvent) {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    dragRef.current = null;
    setIsDragging(false);
    setDragPos(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: isDragging ? 1.05 : 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
      transition={isDragging ? { duration: 0 } : SPRING_SNAPPY}
      style={{
        left: currentX,
        top: currentY,
      }}
      className={cn(
        "absolute pointer-events-auto select-none touch-none",
        isDragging ? "z-40 cursor-grabbing" : "z-[2] cursor-grab",
      )}
    >
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <button
            type="button"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onClick={(e) => {
              if (justDraggedRef.current) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            onDoubleClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpen(sc);
            }}
            className={cn(
              "flex w-[86px] flex-col items-center gap-1.5 rounded-xl px-1.5 py-2 text-center outline-none transition-colors",
              isDragging
                ? "bg-white/50 dark:bg-white/20 shadow-2xl ring-2 ring-primary/40 backdrop-blur-md"
                : "hover:bg-white/40 focus-visible:bg-white/40 dark:hover:bg-white/10 dark:focus-visible:bg-white/10",
            )}
            title={`${sc.label} — arraste para reposicionar, clique duplo para abrir`}
          >
            <span
              className={cn(
                "flex size-12 items-center justify-center rounded-2xl bg-surface/85 text-primary shadow-ios-1 backdrop-blur transition-transform",
                isDragging ? "scale-105 shadow-md" : "hover:scale-105",
              )}
            >
              <Icon className="size-6" strokeWidth={1.75} />
            </span>
            <span className="line-clamp-2 text-[11.5px] font-medium leading-tight text-foreground drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
              {sc.label}
            </span>
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={() => onOpen(sc)}>
            <FolderOpen className="size-3.5" /> Abrir
          </ContextMenuItem>
          {(sc.x !== undefined || sc.y !== undefined) && (
            <ContextMenuItem onSelect={() => onResetPosition(sc.id)}>
              <RotateCcw className="size-3.5" /> Redefinir posição
            </ContextMenuItem>
          )}
          {sc.kind !== "rascunhos" && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem destructive onSelect={() => onRemove(sc.id)}>
                <Trash2 className="size-3.5" /> Remover atalho
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </motion.div>
  );
}

/** Ícones/atalhos na área de trabalho (estilo macOS/Windows) com suporte a arrastar e soltar (drag-and-drop). */
export function DesktopIcons() {
  const { shortcuts, remove, updatePosition, resetPosition, seedRascunhos } = useDesktopShortcuts();
  const can = useAuth((s) => s.can);
  const authed = useAuth((s) => !!s.user);
  const canDpt = authed && can("DPT");
  const open = useWM((s) => s.open);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 800 });

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setContainerSize({ width: rect.width, height: rect.height });
        }
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

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
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
    >
      <AnimatePresence initial={false}>
        {visiveis.map((sc, i) => (
          <DesktopIconItem
            key={sc.id}
            shortcut={sc}
            index={i}
            containerSize={containerSize}
            onOpen={abrir}
            onRemove={remove}
            onUpdatePosition={updatePosition}
            onResetPosition={resetPosition}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
