import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FileText, QrCode } from "lucide-react";
import { cn } from "@/lib/cn";

const tabs = [
  { to: "/dpt", label: "Laudos", icon: FileText, end: true },
  { to: "/dpt/qrcodes", label: "QR Codes", icon: QrCode, end: false },
];

/** Módulo Departamento Técnico — segmented control macOS. */
export function DptModule() {
  const { pathname } = useLocation();
  const onLaudos = !pathname.startsWith("/dpt/qrcodes");

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-0.5 rounded-md border border-border bg-surface-2 p-0.5">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = t.end ? onLaudos : pathname.startsWith(t.to);
          return (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={cn(
                "flex items-center gap-1.5 rounded-[4px] px-3 py-1 text-[12.5px] font-medium transition-colors duration-150",
                active ? "bg-surface text-foreground shadow-mac-1" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-[14px]" />
              {t.label}
            </NavLink>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
}
