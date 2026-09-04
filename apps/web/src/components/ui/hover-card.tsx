import * as React from "react";
import * as Pop from "@radix-ui/react-popover";
import { cn } from "@/lib/cn";

/**
 * Cartão que abre no hover (com intenção) e também "fixa" no clique — pra dar pra
 * interagir com o conteúdo (calendário, botões) sem ele fugir. Visual e material
 * iguais aos do `popover.tsx`/`dropdown-menu.tsx` (identidade Medro).
 */
export function HoverCard({
  children,
  card,
  side = "bottom",
  align = "center",
  sideOffset = 8,
  openDelay = 130,
  closeDelay = 200,
  disabled = false,
  className,
  cardClassName,
}: {
  children: React.ReactNode;
  card: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  openDelay?: number;
  closeDelay?: number;
  disabled?: boolean;
  className?: string;
  cardClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const pinned = React.useRef(false);
  const openT = React.useRef<ReturnType<typeof setTimeout>>();
  const closeT = React.useRef<ReturnType<typeof setTimeout>>();

  const clearTimers = () => {
    clearTimeout(openT.current);
    clearTimeout(closeT.current);
  };
  React.useEffect(() => clearTimers, []);

  const scheduleOpen = () => {
    if (disabled) return;
    clearTimeout(closeT.current);
    openT.current = setTimeout(() => setOpen(true), openDelay);
  };
  const scheduleClose = () => {
    if (pinned.current) return;
    clearTimeout(openT.current);
    closeT.current = setTimeout(() => setOpen(false), closeDelay);
  };

  const togglePin = () => {
    if (disabled) return;
    clearTimers();
    pinned.current = !pinned.current;
    if (pinned.current) setOpen(true);
    else scheduleClose();
  };

  return (
    <Pop.Root
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) pinned.current = false;
      }}
    >
      <Pop.Trigger asChild>
        <span
          className={cn("inline-flex", className)}
          data-pinned={pinned.current || undefined}
          onPointerEnter={scheduleOpen}
          onPointerLeave={scheduleClose}
          onClick={togglePin}
        >
          {children}
        </span>
      </Pop.Trigger>
      <Pop.Portal>
        <Pop.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={10}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerEnter={() => clearTimeout(closeT.current)}
          onPointerLeave={scheduleClose}
          className={cn(
            "material-menu z-[70] w-72 rounded-xl border border-border p-3 text-foreground shadow-popover outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1",
            cardClassName,
          )}
        >
          {card}
        </Pop.Content>
      </Pop.Portal>
    </Pop.Root>
  );
}

/* helpers de layout dos cartões — mantêm o mesmo ritmo visual */

export function CardHeader({
  icon,
  title,
  hint,
}: {
  icon?: React.ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-2 flex items-start gap-2">
      {icon && <span className="mt-0.5 text-muted-foreground">{icon}</span>}
      <div className="min-w-0">
        <p className="text-[12.5px] font-semibold text-foreground">{title}</p>
        {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

export function CardRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1 text-[12px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate font-medium text-foreground">{value}</span>
    </div>
  );
}
