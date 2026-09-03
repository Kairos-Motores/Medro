import * as React from "react";
import * as Chk from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/cn";

/** Caixa de seleção com a identidade do Medro (Radix Checkbox). */
export const Checkbox = React.forwardRef<
  React.ElementRef<typeof Chk.Root>,
  React.ComponentPropsWithoutRef<typeof Chk.Root>
>(({ className, ...props }, ref) => (
  <Chk.Root
    ref={ref}
    className={cn(
      "peer flex size-4 shrink-0 items-center justify-center rounded border border-border bg-surface text-primary-foreground",
      "transition-colors duration-150 ease-mac",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
      "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
      className,
    )}
    {...props}
  >
    <Chk.Indicator className="flex items-center justify-center text-current">
      {props.checked === "indeterminate" ? (
        <Minus className="size-3" strokeWidth={3} />
      ) : (
        <Check className="size-3" strokeWidth={3} />
      )}
    </Chk.Indicator>
  </Chk.Root>
));
Checkbox.displayName = "Checkbox";

/** Checkbox + rótulo clicável, alinhado com o `Field` do input.tsx. */
export function CheckboxField({
  label,
  checked,
  onCheckedChange,
  hint,
  disabled,
}: {
  label: React.ReactNode;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-start gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        disabled={disabled}
        className="mt-0.5"
      />
      <span className="select-none">
        <span className="text-[12.5px] text-foreground">{label}</span>
        {hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}
