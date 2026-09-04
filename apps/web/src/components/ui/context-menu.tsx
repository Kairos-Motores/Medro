import * as React from "react";
import * as CM from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Menu de contexto (botão direito) com a identidade do Medro — mesmo visual do
 * `dropdown-menu.tsx` (`material-menu`, `shadow-popover`, foco em `primary/10`).
 *
 *   <ContextMenu>
 *     <ContextMenuTrigger asChild><div>…</div></ContextMenuTrigger>
 *     <ContextMenuContent>
 *       <ContextMenuItem onSelect={…}>Abrir</ContextMenuItem>
 *       <ContextMenuSeparator />
 *       <ContextMenuItem destructive onSelect={…}>Remover</ContextMenuItem>
 *     </ContextMenuContent>
 *   </ContextMenu>
 */
export const ContextMenu = CM.Root;
export const ContextMenuTrigger = CM.Trigger;
export const ContextMenuGroup = CM.Group;
export const ContextMenuSub = CM.Sub;
export const ContextMenuRadioGroup = CM.RadioGroup;

export const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof CM.Content>,
  React.ComponentPropsWithoutRef<typeof CM.Content>
>(({ className, ...props }, ref) => (
  <CM.Portal>
    <CM.Content
      ref={ref}
      className={cn(
        "material-menu z-[60] min-w-[11rem] overflow-hidden rounded-lg border border-border p-1 text-foreground shadow-popover",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=open]:zoom-in-95",
        className,
      )}
      {...props}
    />
  </CM.Portal>
));
ContextMenuContent.displayName = "ContextMenuContent";

export const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof CM.Item>,
  React.ComponentPropsWithoutRef<typeof CM.Item> & { inset?: boolean; destructive?: boolean }
>(({ className, inset, destructive, ...props }, ref) => (
  <CM.Item
    ref={ref}
    className={cn(
      "flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] outline-none",
      "focus:bg-primary/10 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      destructive && "text-danger focus:bg-danger/10 focus:text-danger",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
ContextMenuItem.displayName = "ContextMenuItem";

export const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof CM.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof CM.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <CM.CheckboxItem
    ref={ref}
    checked={checked}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2.5 rounded-md py-1.5 pl-8 pr-2.5 text-[13px] outline-none",
      "focus:bg-primary/10 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2.5 inline-flex items-center">
      <CM.ItemIndicator>
        <Check className="size-3.5" />
      </CM.ItemIndicator>
    </span>
    {children}
  </CM.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

export const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof CM.RadioItem>,
  React.ComponentPropsWithoutRef<typeof CM.RadioItem>
>(({ className, children, ...props }, ref) => (
  <CM.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2.5 rounded-md py-1.5 pl-8 pr-2.5 text-[13px] outline-none",
      "focus:bg-primary/10 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2.5 inline-flex items-center">
      <CM.ItemIndicator>
        <Circle className="size-2 fill-current" />
      </CM.ItemIndicator>
    </span>
    {children}
  </CM.RadioItem>
));
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

export const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof CM.Label>,
  React.ComponentPropsWithoutRef<typeof CM.Label>
>(({ className, ...props }, ref) => (
  <CM.Label
    ref={ref}
    className={cn("px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", className)}
    {...props}
  />
));
ContextMenuLabel.displayName = "ContextMenuLabel";

export const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof CM.Separator>,
  React.ComponentPropsWithoutRef<typeof CM.Separator>
>(({ className, ...props }, ref) => (
  <CM.Separator ref={ref} className={cn("my-1 h-px bg-border", className)} {...props} />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";

export const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-auto text-[11px] tracking-wide text-muted-foreground", className)} {...props} />
);

export const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof CM.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof CM.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <CM.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] outline-none",
      "focus:bg-primary/10 focus:text-primary data-[state=open]:bg-primary/10 data-[state=open]:text-primary",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto size-3.5" />
  </CM.SubTrigger>
));
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

export const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof CM.SubContent>,
  React.ComponentPropsWithoutRef<typeof CM.SubContent>
>(({ className, ...props }, ref) => (
  <CM.Portal>
    <CM.SubContent
      ref={ref}
      className={cn(
        "material-menu z-[60] min-w-[10rem] overflow-hidden rounded-lg border border-border p-1 text-foreground shadow-popover",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=open]:zoom-in-95",
        className,
      )}
      {...props}
    />
  </CM.Portal>
));
ContextMenuSubContent.displayName = "ContextMenuSubContent";
