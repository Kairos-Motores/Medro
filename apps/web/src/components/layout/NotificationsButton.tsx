import { useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/cn";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const MOCK = [
  { t: "Laudo pendente de assinatura", s: "OS 45231 · há 2h", c: "bg-warning" },
  { t: "Ensaio liberado", s: "OS 44980 · hoje 08:14", c: "bg-success" },
  { t: "Nova pendência de terceirizado", s: "ontem", c: "bg-primary" },
];

export function NotificationsButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-black/[0.05] dark:hover:bg-white/[0.06]"
        aria-label="Notificações"
      >
        <Bell className="size-[17px]" />
        <span className="absolute right-1 top-1 size-[7px] rounded-full bg-warning ring-2 ring-[rgb(var(--material-toolbar))]" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="center" className="gap-2">
          <SheetTitle>Notificações</SheetTitle>
          <p className="text-[12px] text-muted-foreground">
            Central de avisos — integração com os Flows na Fase 2.
          </p>
          <div className="mac-list mt-1">
            {MOCK.map((n, i) => (
              <div key={i} className="mac-row">
                <span className={cn("size-2 shrink-0 rounded-full", n.c)} />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-foreground">{n.t}</p>
                  <p className="truncate text-[11.5px] text-muted-foreground">{n.s}</p>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
