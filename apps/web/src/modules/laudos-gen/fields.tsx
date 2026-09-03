import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Input, Textarea, Select } from "@/components/ui/input";

/** Cabeçalho de uma seção do editor. */
export function EditorSection({
  title,
  subtitle,
  children,
  right,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <section className="mb-6">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-[12px] text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

/** Grade de 2 colunas para pares label/campo curtos. */
export function FieldGrid({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 | 3 }) {
  return (
    <div
      className={cn(
        "grid gap-x-4 gap-y-3",
        cols === 1 && "grid-cols-1",
        cols === 2 && "grid-cols-1 sm:grid-cols-2",
        cols === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {children}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[12px] font-medium text-foreground-secondary">{label}</span>
      <Input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function AreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[12px] font-medium text-foreground-secondary">{label}</span>
      <Textarea
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[12px] font-medium text-foreground-secondary">{label}</span>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </label>
  );
}

/** Alternador de 3 estados usado nas tabelas: SIM (X) / NÃO (N) / —. */
export function TriToggle({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const opts: { v: string; t: string; cls: string }[] = [
    { v: "X", t: "SIM", cls: "data-[on=true]:bg-success/15 data-[on=true]:text-success data-[on=true]:border-success/40" },
    { v: "N", t: "NÃO", cls: "data-[on=true]:bg-danger/15 data-[on=true]:text-danger data-[on=true]:border-danger/40" },
    { v: "", t: "—", cls: "data-[on=true]:bg-muted data-[on=true]:text-foreground" },
  ];
  return (
    <div className="space-y-1">
      {label && <span className="block text-[12px] font-medium text-foreground-secondary">{label}</span>}
      <div className="inline-flex overflow-hidden rounded-md border border-border">
        {opts.map((o, i) => (
          <button
            key={o.v || "none"}
            type="button"
            data-on={value === o.v}
            onClick={() => onChange(o.v)}
            className={cn(
              "px-3 py-1 text-[12px] font-medium text-muted-foreground transition-colors",
              i > 0 && "border-l border-border",
              "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
              o.cls,
            )}
          >
            {o.t}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Alternador Aprovado / Reprovado. */
export function StatusToggle({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const opts = [
    { v: "Aprovado", cls: "data-[on=true]:bg-success/15 data-[on=true]:text-success data-[on=true]:border-success/40" },
    { v: "Reprovado", cls: "data-[on=true]:bg-danger/15 data-[on=true]:text-danger data-[on=true]:border-danger/40" },
  ];
  return (
    <div className="space-y-1">
      {label && <span className="block text-[12px] font-medium text-foreground-secondary">{label}</span>}
      <div className="inline-flex overflow-hidden rounded-md border border-border">
        {opts.map((o, i) => (
          <button
            key={o.v}
            type="button"
            data-on={value === o.v}
            onClick={() => onChange(o.v)}
            className={cn(
              "px-3 py-1 text-[12px] font-medium text-muted-foreground transition-colors",
              i > 0 && "border-l border-border",
              "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
              o.cls,
            )}
          >
            {o.v}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Aviso de recurso ainda não portado (upload de foto, IA…). */
export function DeferredNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-border bg-surface-2 px-3 py-2 text-[11.5px] text-muted-foreground">
      {children}
    </p>
  );
}
