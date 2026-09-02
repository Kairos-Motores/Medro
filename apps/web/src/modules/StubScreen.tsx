import { Link } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";
import { moduleById, type ScreenDef } from "./registry";

/** Placeholder navegável para telas ainda não migradas. */
export function StubScreen({ def }: { def: ScreenDef }) {
  const mod = moduleById(def.module);
  return (
    <div className="space-y-4">
      <h1 className="px-1 text-[20px] font-semibold tracking-tight text-foreground">{def.title}</h1>
      <div className="flex flex-col items-center gap-3 rounded-lg bg-surface py-12 text-center shadow-ios-1">
        <Construction className="size-8 text-muted-foreground" />
        <div className="px-6">
          <p className="text-[15px] font-semibold text-foreground">{def.title}</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Módulo <strong>{mod.label}</strong> · tela PowerApps{" "}
            <code className="text-foreground">{def.powerApps}</code>
          </p>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Ainda não migrada — entra na fase do módulo.
          </p>
        </div>
      </div>
      <Link
        to="/"
        className="flex items-center justify-center gap-1.5 text-[14px] font-medium text-primary active:opacity-60"
      >
        <ArrowLeft className="size-4" /> Voltar ao início
      </Link>
    </div>
  );
}
