import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "reshaped";
import { ChevronLeft, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useClock, initials } from "@/lib/useClock";
import { useProfilePhoto } from "@/lib/useProfilePhoto";
import { ModuleSwitcher } from "./ModuleSwitcher";
import { NotificationsButton } from "./NotificationsButton";

function greeting(h: number) {
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

/** Header do app — mobile (< lg). */
export function AppHeader({ title, showBack }: { title?: string; showBack?: boolean }) {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { time, dateShort, weekday, now } = useClock();
  const photo = useProfilePhoto();
  const atHub = pathname === "/";

  return (
    <header
      className="ios-bar sticky top-0 z-30 border-b border-white/5 lg:hidden"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-2.5">
        {showBack && !atHub ? (
          <button
            onClick={() => navigate(-1)}
            className="-ml-1.5 flex size-9 items-center justify-center rounded-md text-primary-foreground/90 transition active:scale-90 active:bg-white/10"
            aria-label="Voltar"
          >
            <ChevronLeft className="size-6" />
          </button>
        ) : (
          <Link to="/" aria-label="Início">
            <Avatar size={9} src={photo.data ?? undefined} initials={initials(user?.nome)} color="primary" />
          </Link>
        )}

        <div className="min-w-0 flex-1">
          {title && !atHub ? (
            <p className="truncate text-[16px] font-semibold leading-tight">{title}</p>
          ) : (
            <p className="truncate text-[15px] font-semibold leading-tight">
              {greeting(now.getHours())}, {(user?.nome ?? user?.login ?? "").split(" ")[0]}
            </p>
          )}
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-[12px] text-primary-foreground/70">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">{user?.filial || "—"}</span>
            <span className="opacity-40">·</span>
            <span className="capitalize">{weekday}</span>
            <span className="opacity-40">·</span>
            <span>{dateShort}</span>
          </p>
        </div>

        <div className="flex items-center gap-0.5">
          <span className="mr-1 hidden text-[18px] font-semibold tabular-nums xs:block">{time}</span>
          <ModuleSwitcher dark />
          <NotificationsButton dark />
        </div>
      </div>
    </header>
  );
}
