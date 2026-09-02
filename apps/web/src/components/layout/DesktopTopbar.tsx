import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useClock } from "@/lib/useClock";
import { NotificationsButton } from "./NotificationsButton";
import { ModuleSwitcher } from "./ModuleSwitcher";
import { UserMenu } from "./UserMenu";

/** Barra superior — desktop (lg+). Sem menu lateral: navegação pelo hub + switcher. */
export function DesktopTopbar({ title, showBack }: { title?: string; showBack?: boolean }) {
  const navigate = useNavigate();
  const { time, weekday, dateShort } = useClock();

  return (
    <div className="sticky top-0 z-30 hidden h-14 items-center gap-3 border-b border-border bg-surface/85 px-6 backdrop-blur lg:flex">
      <Link to="/" className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary text-[13px] font-bold text-primary-foreground">
          M
        </span>
        <span className="text-[14px] font-semibold text-foreground">Medro</span>
      </Link>

      {showBack && (
        <>
          <span className="text-border-strong">/</span>
          <button
            onClick={() => navigate(-1)}
            className="-ml-1 flex items-center gap-0.5 rounded-md px-1.5 py-1 text-[13px] font-medium text-muted-foreground transition hover:bg-surface-muted"
          >
            <ChevronLeft className="size-4" /> Voltar
          </button>
        </>
      )}
      {title && (
        <span className="truncate text-[14px] font-semibold text-foreground">{title}</span>
      )}

      <div className="ml-auto flex items-center gap-3">
        <div className="text-right leading-none">
          <p className="text-[14px] font-semibold tabular-nums text-foreground">{time}</p>
          <p className="text-[11px] capitalize text-muted-foreground">
            {weekday} · {dateShort}
          </p>
        </div>
        <ModuleSwitcher />
        <NotificationsButton />
        <UserMenu size={9} />
      </div>
    </div>
  );
}
