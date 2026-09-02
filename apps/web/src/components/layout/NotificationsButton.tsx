import { useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MOCK = [
  { t: "Laudo pendente de assinatura", s: "OS 45231 · há 2h", c: "bg-warning" },
  { t: "Ensaio liberado", s: "OS 44980 · hoje 08:14", c: "bg-success" },
  { t: "Nova pendência de terceirizado", s: "ontem", c: "bg-primary" },
];

export function NotificationsButton({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className={cn(
            "relative flex size-9 items-center justify-center rounded-full transition active:scale-90",
            dark ? "text-primary-foreground/90 active:bg-white/10" : "text-muted-foreground hover:bg-surface-muted",
          )}
          aria-label="Notificações"
        >
          <Bell className="size-[19px]" />
          <span
            className={cn(
              "absolute right-1.5 top-1.5 size-2 rounded-full bg-warning",
              dark ? "ring-2 ring-elevated-dark" : "ring-2 ring-surface",
            )}
          />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="mx-auto max-w-md">
        <SheetTitle>Notificações</SheetTitle>
        <SheetDescription>Central de avisos — integração com os Flows na Fase 2.</SheetDescription>
        <div className="ios-list mt-1">
          {MOCK.map((n, i) => (
            <div key={i} className="ios-row">
              <span className={cn("size-2 shrink-0 rounded-full", n.c)} />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium text-foreground">{n.t}</p>
                <p className="truncate text-[12px] text-muted-foreground">{n.s}</p>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
