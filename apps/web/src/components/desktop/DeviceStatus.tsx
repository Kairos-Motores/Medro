import {
  Wifi,
  WifiOff,
  MapPin,
  Building2,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  BatteryCharging,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useDeviceInfo } from "@/lib/useDeviceInfo";
import { cn } from "@/lib/cn";

/** Cluster de status do dispositivo na barra do topo: filial · rede · bateria · cidade. */
export function DeviceStatus() {
  const filial = useAuth((s) => s.user?.filial);
  const { online, battery, city, geoState, requestLocation } = useDeviceInfo();

  const pct = battery ? Math.round(battery.level * 100) : null;
  const BatIcon = battery?.charging
    ? BatteryCharging
    : pct == null
      ? Battery
      : pct <= 15
        ? BatteryLow
        : pct <= 55
          ? BatteryMedium
          : BatteryFull;

  return (
    <div className="hidden items-center gap-2.5 text-foreground-secondary md:flex">
      {filial && (
        <span className="flex items-center gap-1" title={`Filial: ${filial}`}>
          <Building2 className="size-3.5" />
          <span className="hidden lg:inline">{filial}</span>
        </span>
      )}

      <span title={online ? "Conectado" : "Sem conexão"}>
        {online ? (
          <Wifi className="size-3.5" />
        ) : (
          <WifiOff className="size-3.5 text-danger" />
        )}
      </span>

      {battery && (
        <span
          className={cn("flex items-center gap-0.5 tabular-nums", pct! <= 15 && !battery.charging && "text-danger")}
          title={`Bateria ${pct}%${battery.charging ? " (carregando)" : ""}`}
        >
          <BatIcon className="size-3.5" />
          <span className="hidden lg:inline">{pct}%</span>
        </span>
      )}

      {city ? (
        <span className="flex items-center gap-1" title={`Localização aproximada: ${city}`}>
          <MapPin className="size-3.5" />
          <span className="hidden xl:inline">{city}</span>
        </span>
      ) : geoState === "prompt" ? (
        <button
          onClick={requestLocation}
          title="Mostrar localização aproximada"
          aria-label="Usar localização"
          className="flex items-center rounded transition hover:text-foreground"
        >
          <MapPin className="size-3.5 opacity-50" />
        </button>
      ) : null}
    </div>
  );
}
