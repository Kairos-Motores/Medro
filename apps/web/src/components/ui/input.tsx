import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "min-h-tap w-full rounded-md border border-border bg-surface px-3.5 text-[15px] text-foreground",
        "placeholder:text-muted-foreground",
        "transition-shadow duration-200 ease-ios",
        "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
        "disabled:opacity-50",
        className,
      )}
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
    className={cn(
      "w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-[15px] leading-snug text-foreground",
      "placeholder:text-muted-foreground",
      "transition-shadow duration-200 ease-ios",
      "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
      "disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "min-h-tap w-full appearance-none rounded-md border border-border bg-surface px-3.5 text-[15px] text-foreground",
      "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
      "disabled:opacity-50",
      className,
    )}
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
    <label className="block space-y-1.5">
      <span className="text-[13px] font-semibold text-muted-foreground">{label}</span>
      {children}
      {error ? (
        <span className="block text-[13px] text-danger">{error}</span>
      ) : hint ? (
        <span className="block text-[13px] text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}
