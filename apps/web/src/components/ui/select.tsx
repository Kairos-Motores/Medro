import * as React from "react";
import * as Sel from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Lista suspensa com a identidade do Medro (Radix Select + tokens do app).
 * Substitui o `<select>` nativo — o painel de opções é renderizado pelo app,
 * não pelo SO.
 *
 *   <Select value={v} onValueChange={setV} placeholder="Escolha…">
 *     <SelectItem value="a">Opção A</SelectItem>
 *   </Select>
 */
export interface SelectProps {
  value?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** "sm" alinha com botões pequenos (26px); default 32px como o Input */
  size?: "sm" | "md";
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}

export function Select({
  value,
  onValueChange,
  placeholder,
  disabled,
  size = "md",
  className,
  contentClassName,
  children,
  "aria-label": ariaLabel,
}: SelectProps) {
  return (
    <Sel.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <Sel.Trigger
        aria-label={ariaLabel}
        className={cn(
          "inline-flex w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-2.5 text-[13px] text-foreground",
          "transition-[color,background-color,border-color,box-shadow] duration-150 ease-mac hover:border-border-strong",
          "focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/25",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border data-[placeholder]:text-muted-foreground",
          size === "sm" ? "h-[26px] text-[12px]" : "h-8",
          className,
        )}
      >
        <Sel.Value placeholder={placeholder} />
        <Sel.Icon asChild>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        </Sel.Icon>
      </Sel.Trigger>
      <Sel.Portal>
        <Sel.Content
          position="popper"
          sideOffset={6}
          className={cn(
            "material-menu z-50 max-h-[min(24rem,var(--radix-select-content-available-height))] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-border shadow-popover",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=open]:zoom-in-95",
            contentClassName,
          )}
        >
          <Sel.Viewport className="p-1">{children}</Sel.Viewport>
        </Sel.Content>
      </Sel.Portal>
    </Sel.Root>
  );
}

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof Sel.Item>,
  React.ComponentPropsWithoutRef<typeof Sel.Item>
>(({ className, children, ...props }, ref) => (
  <Sel.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-md py-1.5 pl-2.5 pr-7 text-[13px] outline-none",
      "focus:bg-primary/10 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <Sel.ItemText>{children}</Sel.ItemText>
    <Sel.ItemIndicator className="absolute right-2 inline-flex items-center">
      <Check className="size-3.5" />
    </Sel.ItemIndicator>
  </Sel.Item>
));
SelectItem.displayName = "SelectItem";

export const SelectSeparator = ({ className }: { className?: string }) => (
  <Sel.Separator className={cn("my-1 h-px bg-border", className)} />
);

export const SelectLabel = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Sel.Label>) => (
  <Sel.Label
    className={cn("px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", className)}
    {...props}
  />
);
