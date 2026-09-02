import { useLocation, useNavigate } from "react-router-dom";
import { Grid2x2, Home } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { MODULES, ACCENT } from "@/modules/registry";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Salto rápido entre módulos (usado no header mobile e na topbar desktop). */
export function ModuleSwitcher({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const can = useAuth((s) => s.can);
  const visible = MODULES.filter((m) => !m.access || can(...m.access));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex size-9 items-center justify-center rounded-md transition active:scale-90",
            dark ? "text-primary-foreground/90 active:bg-white/10" : "text-muted-foreground hover:bg-surface-muted",
          )}
          aria-label="Trocar de módulo"
        >
          <Grid2x2 className="size-[19px]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[70dvh] w-64 overflow-y-auto">
        <DropdownMenuLabel>Ir para</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => navigate("/")}>
          <Home className="size-4 text-primary" /> Início
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {visible.map((m) => {
          const Icon = m.icon;
          const a = ACCENT[m.accent];
          const active = m.path !== "/" && pathname.startsWith(m.path);
          return (
            <DropdownMenuItem
              key={m.id}
              onSelect={() => navigate(m.path)}
              className={cn(active && cn(a.softBg, a.text))}
            >
              <Icon className={cn("size-4", a.text)} />
              <span className="flex-1">{m.label}</span>
              {m.ready && <span className="size-1.5 rounded-full bg-success" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
