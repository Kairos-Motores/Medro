import { Construction } from "lucide-react";
import { moduleById, type ModuleId } from "./registry";
import { DptApp } from "./dpt/DptApp";
import { MedroProApp } from "./medro-pro/MedroProApp";
import { CentralBobinagemApp } from "./bobinagem/CentralBobinagemApp";
import { InspecaoQualidadeApp } from "./qualidade/InspecaoQualidadeApp";
import { EnsaiosApp } from "./ensaios/EnsaiosApp";
import { ConfiguracoesApp } from "./configuracoes/ConfiguracoesApp";
import { PlanejamentoApp } from "./planejamento/PlanejamentoApp";
import { AlmoxarifadoApp } from "./almoxarifado/AlmoxarifadoApp";
import { FerramentariaApp } from "./ferramentaria/FerramentariaApp";

/** Roteia o conteúdo de uma janela para o app do módulo. */
export function ModuleHost({ moduleId }: { moduleId: ModuleId }) {
  if (moduleId === "configuracoes" || moduleId === "pcp") return <ConfiguracoesApp />;
  if (moduleId === "dpt-laudos") return <DptApp />;
  if (moduleId === "medro-pro") return <MedroProApp />;
  if (moduleId === "central-bobinagem") return <CentralBobinagemApp />;
  if (moduleId === "inspecao-qualidade") return <InspecaoQualidadeApp />;
  if (moduleId === "peritagem") return <EnsaiosApp />;
  if (moduleId === "planejamento") return <PlanejamentoApp />;
  if (moduleId === "almoxarifado") return <AlmoxarifadoApp />;
  if (moduleId === "ferramentaria") return <FerramentariaApp />;
  return <StubWindow moduleId={moduleId} />;
}

function StubWindow({ moduleId }: { moduleId: ModuleId }) {
  const m = moduleById(moduleId);
  const Icon = m.icon;
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 p-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-xl bg-surface-2 text-muted-foreground">
        <Icon className="size-7" />
      </span>
      <div>
        <p className="text-[14px] font-semibold text-foreground">{m.label}</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground">
          <Construction className="size-3.5" /> módulo em migração
        </p>
        <p className="mt-2 text-[12px] text-muted-foreground">{m.desc}</p>
      </div>
    </div>
  );
}
