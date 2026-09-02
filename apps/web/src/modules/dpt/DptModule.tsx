import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FileText, QrCode } from "lucide-react";
import { cn } from "@/lib/cn";

const tabs = [
  { to: "/dpt", label: "Laudos", icon: FileText, end: true },
  { to: "/dpt/qrcodes", label: "QR Codes", icon: QrCode, end: false },
];

/** Módulo Departamento Técnico.
 *  Desktop: sub-navegação segmentada no topo.
 *  Mobile: tab bar inferior estilo iOS. */
export function DptModule() {
  const { pathname } = useLocation();
  const onLaudos = !pathname.startsWith("/dpt/qrcodes");

  return (
    <div className="lg:space-y-4">
      {/* segmentado desktop */}
      <div className="hidden lg:flex lg:items-center lg:gap-1 lg:rounded-lg lg:bg-surface-muted lg:p-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = t.end ? onLaudos : pathname.startsWith(t.to);
          return (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-1.5 text-[13px] font-semibold transition-all duration-200 ease-ios",
                active ? "bg-surface text-foreground shadow-ios-1" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {t.label}
            </NavLink>
          );
        })}
      </div>

      <div className="pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0">
        <Outlet />
      </div>

      {/* tab bar mobile */}
      <nav
        className="ios-bar fixed inset-x-0 bottom-0 z-30 border-t border-white/5 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-md">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = t.end ? onLaudos : pathname.startsWith(t.to);
            return (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-primary-foreground" : "text-primary-foreground/50",
                )}
              >
                <Icon className="size-[22px]" strokeWidth={active ? 2.4 : 1.9} />
                {t.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
