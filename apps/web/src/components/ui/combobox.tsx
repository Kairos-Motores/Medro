import { useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  label: string;
  hint?: string;
}

/**
 * Caixa de combinação: lista suspensa com busca, na identidade do Medro.
 * Para quando há muitas opções (modelos, TAGs, clientes…).
 */
export function Combobox({
  value,
  onChange,
  options,
  placeholder = "Selecione…",
  emptyText = "Nada encontrado.",
  disabled,
  size = "md",
  className,
  allowClear,
}: {
  value: string | null;
  onChange: (v: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  allowClear?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(t) || o.hint?.toLowerCase().includes(t),
    );
  }, [q, options]);

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) setTimeout(() => inputRef.current?.focus(), 0);
        else setQ("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "inline-flex w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-2.5 text-left text-[13px] text-foreground",
            "transition-shadow duration-150 ease-mac",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/35 disabled:opacity-50",
            size === "sm" ? "h-[26px] text-[12px]" : "h-8",
            className,
          )}
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-52 p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex items-center gap-2 border-b border-border px-2.5">
          <Search className="size-3.5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar…"
            className="h-8 w-full bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <ul className="max-h-64 overflow-y-auto p-1">
          {allowClear && (
            <Row
              active={!value}
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              <span className="text-muted-foreground">{placeholder}</span>
            </Row>
          )}
          {filtered.length === 0 ? (
            <li className="px-2.5 py-3 text-center text-[12px] text-muted-foreground">{emptyText}</li>
          ) : (
            filtered.map((o) => (
              <Row
                key={o.value}
                active={o.value === value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{o.label}</span>
                  {o.hint && (
                    <span className="block truncate text-[11px] text-muted-foreground">{o.hint}</span>
                  )}
                </span>
                {o.value === value && <Check className="size-3.5 shrink-0 text-primary" />}
              </Row>
            ))
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function Row({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] outline-none",
          active ? "bg-primary/10 text-primary" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
        )}
      >
        {children}
      </button>
    </li>
  );
}
