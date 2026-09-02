import type { ReactNode } from "react";
import { Avatar } from "reshaped";
import { LogOut, MapPin, BadgeCheck, IdCard } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useProfilePhoto } from "@/lib/useProfilePhoto";
import { initials } from "@/lib/useClock";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({ size = 8, trigger }: { size?: number; trigger?: ReactNode }) {
  const user = useAuth((s) => s.user);
  const clear = useAuth((s) => s.clear);
  const photo = useProfilePhoto();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <button className="rounded-full transition active:scale-95" aria-label="Perfil">
            <Avatar size={size} src={photo.data ?? undefined} initials={initials(user?.nome)} color="primary" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center gap-3 px-2.5 py-2">
          <Avatar size={11} src={photo.data ?? undefined} initials={initials(user?.nome)} color="primary" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-foreground">{user?.nome || user?.login}</p>
            <p className="truncate text-[11.5px] text-muted-foreground">@{user?.login}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="space-y-1 px-2.5 py-1.5 text-[12px] text-muted-foreground">
          <p className="flex items-center gap-2">
            <MapPin className="size-3.5" /> {user?.filial || "—"}
          </p>
          {user?.funcao && (
            <p className="flex items-center gap-2">
              <BadgeCheck className="size-3.5" /> {user.funcao}
            </p>
          )}
          {user?.matProtheus && (
            <p className="flex items-center gap-2">
              <IdCard className="size-3.5" /> Mat. {user.matProtheus}
            </p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => clear()}
          className="text-danger focus:bg-danger/10 focus:text-danger"
        >
          <LogOut className="size-4" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
