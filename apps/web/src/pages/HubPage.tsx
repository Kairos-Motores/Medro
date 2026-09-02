import { Link } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useClock } from "@/lib/useClock";
import { cn } from "@/lib/cn";
import { MODULES, ACCENT } from "@/modules/registry";

function greeting(h: number) {
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function HubPage() {
  const user = useAuth((s) => s.user);
  const can = useAuth((s) => s.can);
  const { dateLong, now } = useClock();

  const mods = MODULES.map((m) => ({ ...m, allowed: !m.access || can(...m.access) }));
  const allowed = mods.filter((m) => m.allowed);
  const locked = mods.filter((m) => !m.allowed);

  return (
    <div className="space-y-6">
      {/* faixa de boas-vindas */}
      <section className="rounded-lg border border-border-strong/40 bg-elevated-dark px-5 py-4 text-primary-foreground lg:px-7 lg:py-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary-foreground/55">
          {dateLong}
        </p>
        <h1 className="mt-1.5 text-[19px] font-semibold lg:text-[22px]">
          {greeting(now.getHours())}, {(user?.nome ?? user?.login ?? "").split(" ")[0]}
        </h1>
        <p className="mt-1 text-[12.5px] text-primary-foreground/65">
          {[user?.funcao, user?.setor, user?.filial].filter(Boolean).join(" · ") || user?.filial || "—"}
          {"  ·  "}
          {allowed.length} {allowed.length === 1 ? "módulo" : "módulos"}
        </p>
      </section>

      {/* grade de módulos */}
      <section>
        <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Módulos
        </h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {allowed.map((m, i) => {
            const Icon = m.icon;
            const a = ACCENT[m.accent];
            return (
              <Link
                key={m.id}
                to={m.path}
                className={cn(
                  "stagger-item group flex min-h-[104px] flex-col gap-3 rounded-lg border border-l-[3px] border-border bg-surface p-3.5 transition-all duration-200 ease-ios lg:min-h-[132px]",
                  a.borderL,
                  a.hoverBorder,
                  "hover:-translate-y-px hover:shadow-ios-1 active:scale-[.98]",
                )}
                style={{ animationDelay: `${i * 35}ms` }}
              >
                <span className={cn("flex size-9 items-center justify-center rounded-md", a.softBg, a.text)}>
                  <Icon className="size-[20px]" strokeWidth={2} />
                </span>
                <div className="mt-auto">
                  <span className="flex items-center gap-1 text-[13.5px] font-semibold leading-tight text-foreground">
                    {m.label}
                    <ArrowRight className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                  </span>
                  <p className="mt-0.5 hidden text-[11.5px] leading-snug text-muted-foreground lg:line-clamp-2">
                    {m.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {locked.length > 0 && (
        <section>
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Sem acesso
          </h2>
          <div className="ios-list opacity-55">
            {locked.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.id} className="ios-row">
                  <Icon className="size-[17px] text-muted-foreground" strokeWidth={2} />
                  <span className="flex-1 text-[13.5px] text-foreground">{m.label}</span>
                  <span className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
                    <Lock className="size-3" />
                    {m.access?.join(" · ")}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
