import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Campos base do Medro — mesma linguagem do `components/ui/select.tsx`
 * (Radix). Transição suave de borda/anel, hover discreto, foco com anel
 * do acento (3px, coerente com `--ring` em tokens.css).
 */
const fieldBase =
  "w-full rounded-md border border-border bg-surface text-[13px] text-foreground " +
  "placeholder:text-muted-foreground " +
  "transition-[color,background-color,border-color,box-shadow] duration-150 ease-mac " +
  "hover:border-border-strong " +
  "focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/25 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(fieldBase, "h-8 px-2.5", "read-only:bg-surface-2 read-only:hover:border-border", className)}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 3, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={cn(fieldBase, "resize-y px-2.5 py-2 leading-snug", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

/** chevron do `<select>` nativo (o `appearance-none` esconde o do SO).
 *  Cinza médio (`#8b909a`) — legível o suficiente em claro e escuro. */
const SELECT_CHEVRON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238b909a' stroke-width='2.25' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, style, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(fieldBase, "h-8 cursor-pointer appearance-none bg-no-repeat py-0 pl-2.5 pr-8", className)}
    style={{
      backgroundImage: `url("${SELECT_CHEVRON}")`,
      backgroundPosition: "right 0.5rem center",
      ...style,
    }}
    {...props}
  />
));
Select.displayName = "Select";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[12px] font-medium text-foreground-secondary">{label}</span>
      {children}
      {error ? (
        <span className="block text-[12px] text-danger">{error}</span>
      ) : hint ? (
        <span className="block text-[12px] text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}
