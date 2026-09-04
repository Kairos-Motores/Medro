import { cn } from "@/lib/cn";
import { useMenuBarPrefs } from "@/lib/useMenuBarPrefs";
import { FilialCard, NetworkCard, BatteryCard, LocationCard } from "./MenuBarCards";

/**
 * Cluster de status do dispositivo na barra do sistema — filial · rede · bateria
 * · localização. Cada item abre um cartão detalhado e interativo no hover
 * (`MenuBarCards`). Visibilidade por item vem de `useMenuBarPrefs`.
 */
export function DeviceStatus({ vertical = false }: { vertical?: boolean }) {
  const isVisible = useMenuBarPrefs((s) => s.isVisible);

  return (
    <div
      className={cn(
        "flex items-center text-foreground-secondary",
        vertical ? "flex-col gap-1.5" : "gap-2 md:gap-2.5",
      )}
    >
      {isVisible("filial") && <FilialCard />}
      {isVisible("network") && <NetworkCard />}
      {isVisible("battery") && <BatteryCard />}
      {isVisible("location") && <LocationCard />}
    </div>
  );
}
