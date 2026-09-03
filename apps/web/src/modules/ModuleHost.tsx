import { Construction, Lock } from "lucide-react";
import type { WinParams } from "@/lib/wm";
import { useAuth } from "@/lib/auth";
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
import { LaudosGenApp } from "./laudos-gen/LaudosGenApp";
import { RascunhosFolder } from "./laudos-gen/RascunhosFolder";
import { ModelosManager } from "./laudos-gen/ModelosManager";
import { ModeloBuilder } from "./laudos-gen/ModeloBuilder";
import { UsinagemCaldeirariaApp } from "./caldeiraria/UsinagemCaldeirariaApp";

/** Roteia o conteúdo de uma janela para o app do módulo. */
export function ModuleHost({
  moduleId,
  params,
  paramsNonce,
}: {
  moduleId: ModuleId;
  params?: WinParams;
  paramsNonce?: number;
}) {
  const can = useAuth((s) => s.can);
  const authed = useAuth((s) => !!s.user);
  const gate = (...tokens: Parameters<typeof can>) =>
    !(authed && can(...tokens)) ? <AccessDenied label="Gerador de Laudos" /> : null;

  // "pasta" de rascunhos de laudos — DPT-only, não está em MODULES
  if (moduleId === "rascunhos-folder") return gate("DPT") ?? <RascunhosFolder />;

  // gerenciador de modelos (no Dock/Launchpad via MODULES) + construtor (aberto
  // com params, fora de MODULES) — ambos DPT-only
  if (moduleId === "modelos-folder") return gate("DPT") ?? <ModelosManager />;
  if (moduleId === "modelo-builder")
    return (
      gate("DPT") ?? (
        <ModeloBuilder
          modeloId={
            typeof params?.modeloId === "string" && params.modeloId ? params.modeloId : null
          }
          openNonce={paramsNonce}
        />
      )
    );

  const m = moduleById(moduleId);
  // acesso: respeita MODULES[].access — laudo é DPT-only (o registry já esconde
  // do Dock/Launchpad; isto barra aberturas por atalho/janela persistida).
  if (m.access?.length && !(authed && can(...m.access))) return <AccessDenied label={m.label} />;

  if (moduleId === "configuracoes" || moduleId === "pcp") return <ConfiguracoesApp />;
  if (moduleId === "dpt-laudos") return <DptApp />;
  if (moduleId === "laudos-gen")
    return (
      <LaudosGenApp
        initialOsId={typeof params?.osId === "string" ? params.osId : null}
        openNonce={paramsNonce}
      />
    );
  if (moduleId === "medro-pro") return <MedroProApp />;
  if (moduleId === "central-bobinagem") return <CentralBobinagemApp />;
  if (moduleId === "inspecao-qualidade") return <InspecaoQualidadeApp />;
  if (moduleId === "peritagem") return <EnsaiosApp />;
  if (moduleId === "planejamento") return <PlanejamentoApp />;
  if (moduleId === "almoxarifado") return <AlmoxarifadoApp />;
  if (moduleId === "ferramentaria") return <FerramentariaApp />;
  if (moduleId === "caldeiraria") return <UsinagemCaldeirariaApp />;
  return <StubWindow moduleId={moduleId} />;
}

function AccessDenied({ label }: { label: string }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 p-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-xl bg-surface-2 text-muted-foreground">
        <Lock className="size-7" />
      </span>
      <div>
        <p className="text-[14px] font-semibold text-foreground">{label}</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Você não tem acesso a este módulo. Fale com o administrador se precisar.
        </p>
      </div>
    </div>
  );
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
