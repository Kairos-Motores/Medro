import { PanelBottomOpen, PanelBottomClose } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDockPrefs } from "@/lib/useDockPrefs";

interface FloatingDockTriggerProps {
  revealed: boolean;
  onToggle: () => void;
}

export function FloatingDockTrigger({ revealed, onToggle }: FloatingDockTriggerProps) {
  const alignment = useDockPrefs((s) => s.alignment);
  const posClass = alignment === "left" ? "bottom-3 right-3" : "bottom-3 left-3";

  return (
    <button
      onClick={onToggle}
      className={cn(
        "fixed z-50 flex size-10 items-center justify-center rounded-xl border shadow-mac-2 backdrop-blur-md transition-all duration-200 active:scale-95",
        posClass,
        revealed
          ? "border-primary bg-primary/20 text-primary ring-2 ring-primary/30"
          : "border-white/25 bg-surface/85 text-foreground-secondary hover:bg-surface hover:text-foreground hover:scale-105 dark:border-white/10 dark:bg-surface/80",
      )}
      title={revealed ? "Ocultar Barra de Tarefas (Dock)" : "Mostrar Barra de Tarefas (Dock)"}
      aria-label={revealed ? "Ocultar Barra de Tarefas" : "Mostrar Barra de Tarefas"}
    >
      {revealed ? (
        <PanelBottomClose className="size-5" />
      ) : (
        <PanelBottomOpen className="size-5" />
      )}
    </button>
  );
}
