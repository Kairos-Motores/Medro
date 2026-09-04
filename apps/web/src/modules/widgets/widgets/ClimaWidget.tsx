import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  MapPin,
} from "lucide-react";
import { useDeviceInfo } from "@/lib/useDeviceInfo";
import { useWidgetRefetch, WidgetLoading, WidgetError, WidgetEmpty } from "../WidgetShell";
import type { WidgetProps } from "../types";

/** código WMO → ícone + rótulo. */
function wmo(code: number): { Icon: typeof Sun; label: string } {
  if (code === 0) return { Icon: Sun, label: "Céu limpo" };
  if (code <= 2) return { Icon: CloudSun, label: "Parcialmente nublado" };
  if (code === 3) return { Icon: Cloud, label: "Nublado" };
  if (code === 45 || code === 48) return { Icon: CloudFog, label: "Névoa" };
  if (code >= 51 && code <= 67) return { Icon: CloudRain, label: "Chuva" };
  if (code >= 71 && code <= 77) return { Icon: CloudSnow, label: "Neve" };
  if (code >= 80 && code <= 82) return { Icon: CloudRain, label: "Pancadas de chuva" };
  if (code >= 95) return { Icon: CloudLightning, label: "Trovoadas" };
  return { Icon: Cloud, label: "—" };
}

interface Forecast {
  current: { temperature_2m: number; weather_code: number; wind_speed_10m: number };
  daily: { temperature_2m_max: number[]; temperature_2m_min: number[] };
}

export function ClimaWidget({ size }: WidgetProps) {
  const { coords, city, geoState, requestLocation } = useDeviceInfo();

  const q = useQuery({
    queryKey: ["clima", coords?.lat, coords?.lon],
    enabled: !!coords,
    refetchInterval: 30 * 60_000,
    refetchIntervalInBackground: false,
    queryFn: async (): Promise<Forecast> => {
      const u = new URL("https://api.open-meteo.com/v1/forecast");
      u.searchParams.set("latitude", String(coords!.lat));
      u.searchParams.set("longitude", String(coords!.lon));
      u.searchParams.set("current", "temperature_2m,weather_code,wind_speed_10m");
      u.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
      u.searchParams.set("timezone", "auto");
      const r = await fetch(u, { signal: AbortSignal.timeout(8000) });
      if (!r.ok) throw new Error("clima");
      return r.json();
    },
  });
  useWidgetRefetch(useCallback(() => q.refetch(), [q]));

  if (!coords) {
    return (
      <WidgetEmpty>
        {geoState === "denied" ? (
          "Libere a localização para ver o clima."
        ) : (
          <button
            onClick={requestLocation}
            className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 font-medium text-foreground hover:bg-surface-2"
          >
            <MapPin className="size-3.5" /> Permitir localização
          </button>
        )}
      </WidgetEmpty>
    );
  }
  if (q.isLoading) return <WidgetLoading />;
  if (q.isError || !q.data) return <WidgetError onRetry={() => q.refetch()} />;

  const { current, daily } = q.data;
  const { Icon, label } = wmo(current.weather_code);
  const hi = Math.round(daily.temperature_2m_max[0] ?? 0);
  const lo = Math.round(daily.temperature_2m_min[0] ?? 0);

  return (
    <div className="flex h-full flex-col">
      <p className="truncate text-[10.5px] text-muted-foreground">{city || "Localização atual"}</p>
      <div className="mt-0.5 flex items-center gap-2">
        <Icon className="size-7 text-primary" strokeWidth={1.6} />
        <span className="text-[26px] font-semibold leading-none text-foreground tabular-nums">
          {Math.round(current.temperature_2m)}°
        </span>
      </div>
      <p className="mt-1 text-[11.5px] text-foreground">{label}</p>
      {size !== "sm" && (
        <div className="mt-auto flex items-center gap-3 pt-2 text-[11px] text-muted-foreground">
          <span className="tabular-nums">
            máx {hi}° · mín {lo}°
          </span>
          <span className="flex items-center gap-1 tabular-nums">
            <Wind className="size-3" /> {Math.round(current.wind_speed_10m)} km/h
          </span>
        </div>
      )}
    </div>
  );
}
