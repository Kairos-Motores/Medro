import { Outlet, useParams } from "react-router-dom";
import { FileText } from "lucide-react";
import { cn } from "@/lib/cn";
import { LaudosMaster } from "./LaudosMaster";

/** Master-detail dos laudos.
 *  - mobile: mostra a lista OU o detalhe (conforme a rota)
 *  - desktop: lista à esquerda + detalhe à direita */
export function DptLaudosLayout() {
  const { id } = useParams();
  const hasDetail = !!id;

  return (
    <div className="lg:flex lg:gap-5">
      <div
        className={cn(
          "lg:w-[380px] lg:shrink-0",
          hasDetail ? "hidden lg:block" : "block",
        )}
      >
        <LaudosMaster activeId={id} />
      </div>

      <div className={cn("min-w-0 flex-1", hasDetail ? "block" : "hidden lg:block")}>
        {hasDetail ? (
          <Outlet />
        ) : (
          <div className="hidden h-[70vh] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border text-muted-foreground lg:flex">
            <FileText className="size-9" />
            <p className="text-[14px]">Selecione um laudo à esquerda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
