import { useCallback, useEffect, useState } from "react";

/**
 * Informações do dispositivo para a barra do topo.
 *  - online/offline: `navigator.onLine` (confiável em todo browser)
 *  - bateria: `navigator.getBattery()` — só Chrome/Android (iOS Safari e Firefox
 *    não expõem; nesse caso `battery` fica null)
 *  - localização (cidade): geolocalização do browser + reverse-geocoding keyless
 *    (BigDataCloud). Só dispara se a permissão já estiver concedida ou se o
 *    usuário clicar em "usar localização" (`requestLocation`).
 *
 * Não existe API web para temperatura de dispositivo/CPU — por isso não há.
 */

export interface BatteryInfo {
  level: number; // 0..1
  charging: boolean;
}

export interface DeviceInfo {
  online: boolean;
  battery: BatteryInfo | null;
  city: string | null;
  /** "granted" | "prompt" | "denied" | "unsupported" */
  geoState: PermissionState | "unsupported";
  requestLocation: () => void;
}

type NavigatorWithBattery = Navigator & {
  getBattery?: () => Promise<{
    level: number;
    charging: boolean;
    addEventListener: (t: string, fn: () => void) => void;
    removeEventListener: (t: string, fn: () => void) => void;
  }>;
};

async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const r = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!r.ok) return null;
    const j = (await r.json()) as {
      city?: string;
      locality?: string;
      principalSubdivisionCode?: string;
    };
    const cidade = j.city || j.locality;
    const uf = (j.principalSubdivisionCode || "").split("-").pop();
    return cidade ? (uf ? `${cidade} – ${uf}` : cidade) : null;
  } catch {
    return null;
  }
}

export function useDeviceInfo(): DeviceInfo {
  const [online, setOnline] = useState(() => (typeof navigator !== "undefined" ? navigator.onLine : true));
  const [battery, setBattery] = useState<BatteryInfo | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [geoState, setGeoState] = useState<PermissionState | "unsupported">(
    typeof navigator !== "undefined" && "geolocation" in navigator ? "prompt" : "unsupported",
  );

  // online / offline
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  // bateria (best-effort)
  useEffect(() => {
    const nav = navigator as NavigatorWithBattery;
    if (!nav.getBattery) return;
    let bat: Awaited<ReturnType<NonNullable<NavigatorWithBattery["getBattery"]>>> | null = null;
    let alive = true;
    const sync = () => bat && setBattery({ level: bat.level, charging: bat.charging });
    nav
      .getBattery()
      .then((b) => {
        if (!alive) return;
        bat = b;
        sync();
        b.addEventListener("levelchange", sync);
        b.addEventListener("chargingchange", sync);
      })
      .catch(() => {});
    return () => {
      alive = false;
      if (bat) {
        bat.removeEventListener("levelchange", sync);
        bat.removeEventListener("chargingchange", sync);
      }
    };
  }, []);

  const fetchLocation = useCallback(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setGeoState("granted");
        const cached = sessionStorage.getItem("medro.city");
        if (cached) {
          setCity(cached);
          return;
        }
        const c = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        if (c) {
          setCity(c);
          try {
            sessionStorage.setItem("medro.city", c);
          } catch {
            /* ignore */
          }
        }
      },
      (err) => {
        setGeoState(err.code === err.PERMISSION_DENIED ? "denied" : "prompt");
      },
      { maximumAge: 10 * 60_000, timeout: 10_000 },
    );
  }, []);

  // se a permissão já foi concedida, busca sem pedir nada
  useEffect(() => {
    const cached = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("medro.city") : null;
    if (cached) {
      setCity(cached);
      setGeoState("granted");
      return;
    }
    if (!("permissions" in navigator)) return;
    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((p) => {
        setGeoState(p.state);
        if (p.state === "granted") fetchLocation();
        p.onchange = () => setGeoState(p.state);
      })
      .catch(() => {});
  }, [fetchLocation]);

  return { online, battery, city, geoState, requestLocation: fetchLocation };
}
