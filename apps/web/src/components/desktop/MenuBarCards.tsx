import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import {
  Building2,
  Wifi,
  WifiOff,
  Gauge,
  MapPin,
  CalendarDays,
  Battery,
  BatteryCharging,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  RefreshCw,
  ExternalLink,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";
import { useWM } from "@/lib/wm";
import { useDeviceInfo, type BatteryInfo } from "@/lib/useDeviceInfo";
import { useMenuBarPrefs, isVerticalBar } from "@/lib/useMenuBarPrefs";
import { HoverCard, CardHeader, CardRow } from "@/components/ui/hover-card";

/* ── infra comum ─────────────────────────────────────────────────────────── */

/** lado onde o cartão abre, conforme a posição da barra. */
function useCardSide(): "bottom" | "left" | "right" {
  const position = useMenuBarPrefs((s) => s.position);
  if (position === "left") return "right";
  if (position === "right") return "left";
  return "bottom";
}

function useVertical() {
  return isVerticalBar(useMenuBarPrefs((s) => s.position));
}

/** gatilho de um item da barra (ícone + rótulo opcional; só ícone na vertical). */
function Trigger({
  icon,
  label,
  danger,
}: {
  icon: React.ReactNode;
  label?: string;
  danger?: boolean;
}) {
  const vertical = useVertical();
  return (
    <span
      className={cn(
        "flex cursor-default items-center gap-1 rounded-md text-foreground-secondary transition-colors hover:text-foreground",
        vertical ? "size-6 justify-center" : "px-1",
        danger && "text-danger hover:text-danger",
      )}
    >
      {icon}
      {label && !vertical && <span className="hidden lg:inline">{label}</span>}
    </span>
  );
}

function fmtDuration(sec: number): string | null {
  if (!Number.isFinite(sec) || sec <= 0) return null;
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  if (h && m) return `${h} h ${m} min`;
  if (h) return `${h} h`;
  return `${m} min`;
}

/* ── Filial ──────────────────────────────────────────────────────────────── */

export function FilialCard() {
  const user = useAuth((s) => s.user);
  const open = useWM((s) => s.open);
  const side = useCardSide();
  if (!user?.filial) return null;

  return (
    <HoverCard
      side={side}
      card={
        <div>
          <CardHeader icon={<Building2 className="size-4" />} title={user.filial} hint="Unidade da sessão" />
          <div className="mt-1 divide-y divide-border/70">
            <CardRow label="Usuário" value={user.nome || user.login} />
            {user.funcao && <CardRow label="Função" value={user.funcao} />}
            {user.matProtheus && <CardRow label="Matrícula" value={user.matProtheus} />}
          </div>
          <button
            onClick={() => open("configuracoes", "Configurações")}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-border py-1.5 text-[12px] font-medium text-foreground hover:bg-surface-2"
          >
            <Settings className="size-3.5" /> Abrir Configurações
          </button>
        </div>
      }
    >
      <Trigger icon={<Building2 className="size-3.5" />} label={user.filial} />
    </HoverCard>
  );
}

/* ── Rede ────────────────────────────────────────────────────────────────── */

const ET_LABEL: Record<string, string> = { "slow-2g": "2G lento", "2g": "2G", "3g": "3G", "4g": "4G" };

export function NetworkCard() {
  const { online, connection } = useDeviceInfo();
  const side = useCardSide();
  const [ping, setPing] = useState<number | null>(null);
  const [testing, setTesting] = useState(false);

  async function testar() {
    setTesting(true);
    setPing(null);
    const t0 = performance.now();
    try {
      await fetch(`${window.location.origin}/favicon.ico?_=${Date.now()}`, { cache: "no-store" });
      setPing(Math.round(performance.now() - t0));
    } catch {
      setPing(-1);
    } finally {
      setTesting(false);
    }
  }

  return (
    <HoverCard
      side={side}
      card={
        <div>
          <CardHeader
            icon={online ? <Wifi className="size-4" /> : <WifiOff className="size-4 text-danger" />}
            title={online ? "Conectado" : "Sem conexão"}
            hint={online ? "Navegador on-line" : "Sem acesso à rede"}
          />
          <div className="divide-y divide-border/70">
            {connection?.effectiveType && (
              <CardRow label="Qualidade" value={ET_LABEL[connection.effectiveType] ?? connection.effectiveType} />
            )}
            {connection?.downlink != null && <CardRow label="Velocidade" value={`~${connection.downlink} Mbps`} />}
            {connection?.rtt != null && <CardRow label="Latência (RTT)" value={`~${connection.rtt} ms`} />}
            {connection?.saveData && <CardRow label="Economia de dados" value="ligada" />}
            {ping != null && (
              <CardRow
                label="Ida e volta"
                value={ping < 0 ? <span className="text-danger">falhou</span> : `${ping} ms`}
              />
            )}
            {!connection && (
              <p className="py-1 text-[11px] text-muted-foreground">
                Detalhes de rede indisponíveis neste navegador.
              </p>
            )}
          </div>
          <button
            onClick={testar}
            disabled={testing || !online}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-border py-1.5 text-[12px] font-medium text-foreground hover:bg-surface-2 disabled:opacity-50"
          >
            <Gauge className={cn("size-3.5", testing && "animate-pulse")} /> {testing ? "Testando…" : "Testar conexão"}
          </button>
        </div>
      }
    >
      <Trigger
        icon={online ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
        danger={!online}
      />
    </HoverCard>
  );
}

/* ── Bateria ─────────────────────────────────────────────────────────────── */

function batIcon(b: BatteryInfo) {
  const pct = Math.round(b.level * 100);
  if (b.charging) return BatteryCharging;
  if (pct <= 15) return BatteryLow;
  if (pct <= 55) return BatteryMedium;
  return BatteryFull;
}

export function BatteryCard() {
  const { battery } = useDeviceInfo();
  const side = useCardSide();
  if (!battery) return null;

  const pct = Math.round(battery.level * 100);
  const low = pct <= 15 && !battery.charging;
  const Icon = batIcon(battery);
  const eta = battery.charging
    ? fmtDuration(battery.chargingTime)
    : fmtDuration(battery.dischargingTime);
  const barColor = low ? "bg-danger" : battery.charging ? "bg-success" : "bg-primary";

  return (
    <HoverCard
      side={side}
      card={
        <div>
          <CardHeader
            icon={<Icon className="size-4" />}
            title={`Bateria · ${pct}%`}
            hint={battery.charging ? "Carregando" : low ? "Nível baixo" : "Na bateria"}
          />
          <div className="my-2 h-2 w-full overflow-hidden rounded-full bg-surface-2">
            <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${pct}%` }} />
          </div>
          <div className="divide-y divide-border/70">
            <CardRow label="Estado" value={battery.charging ? "Carregando" : "Descarregando"} />
            {eta && (
              <CardRow label={battery.charging ? "Até 100%" : "Autonomia"} value={`~${eta}`} />
            )}
          </div>
          {low && (
            <p className="mt-2 rounded-md bg-danger/10 px-2 py-1.5 text-[11px] text-danger">
              Conecte o carregador para não perder trabalho não salvo.
            </p>
          )}
        </div>
      }
    >
      <Trigger icon={<Icon className="size-3.5" />} label={`${pct}%`} danger={low} />
    </HoverCard>
  );
}

/* ── Localização ─────────────────────────────────────────────────────────── */

export function LocationCard() {
  const { city, coords, geoState, requestLocation } = useDeviceInfo();
  const side = useCardSide();
  if (geoState === "unsupported") return null;

  const mapHref = coords
    ? `https://www.google.com/maps?q=${coords.lat},${coords.lon}`
    : city
      ? `https://www.google.com/maps?q=${encodeURIComponent(city)}`
      : null;

  return (
    <HoverCard
      side={side}
      card={
        <div>
          <CardHeader
            icon={<MapPin className="size-4" />}
            title={city || "Localização"}
            hint="Aproximada, pelo navegador"
          />
          {geoState === "denied" && (
            <p className="rounded-md bg-surface-2 px-2 py-1.5 text-[11px] text-muted-foreground">
              Permissão negada. Libere a localização nas configurações do navegador para este site.
            </p>
          )}
          {geoState === "prompt" && !city && (
            <button
              onClick={requestLocation}
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border py-1.5 text-[12px] font-medium text-foreground hover:bg-surface-2"
            >
              <MapPin className="size-3.5" /> Permitir localização
            </button>
          )}
          {city && (
            <>
              {coords && (
                <div className="divide-y divide-border/70">
                  <CardRow label="Coordenadas" value={`${coords.lat.toFixed(3)}, ${coords.lon.toFixed(3)}`} />
                </div>
              )}
              <div className="mt-2 flex gap-2">
                <button
                  onClick={requestLocation}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border py-1.5 text-[12px] font-medium text-foreground hover:bg-surface-2"
                >
                  <RefreshCw className="size-3.5" /> Atualizar
                </button>
                {mapHref && (
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border py-1.5 text-[12px] font-medium text-foreground hover:bg-surface-2"
                  >
                    <ExternalLink className="size-3.5" /> Mapa
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      }
    >
      <Trigger icon={<MapPin className={cn("size-3.5", !city && "opacity-50")} />} label={city ?? undefined} />
    </HoverCard>
  );
}

/* ── Data e hora (calendário interativo) ─────────────────────────────────── */

const CAL: Record<string, string> = {
  months: "relative",
  month: "space-y-1.5",
  month_caption: "flex h-7 items-center justify-center px-8",
  caption_label: "text-[12.5px] font-semibold capitalize text-foreground",
  nav: "absolute inset-x-0 top-0 flex items-center justify-between",
  button_previous:
    "inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.06]",
  button_next:
    "inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.06]",
  month_grid: "border-collapse",
  weekdays: "flex",
  weekday: "w-7 text-[10px] font-medium capitalize text-muted-foreground",
  week: "mt-0.5 flex",
  day: "p-0",
  day_button:
    "inline-flex size-7 items-center justify-center rounded-md text-[11.5px] text-foreground hover:bg-primary/10 aria-selected:hover:bg-primary",
  today: "font-semibold text-primary",
  selected: "!bg-primary [&_button]:!text-primary-foreground [&_button]:font-medium",
  outside: "text-muted-foreground/40",
  hidden: "invisible",
};

export function ClockCard({ children }: { children: React.ReactNode }) {
  const side = useCardSide();
  return (
    <HoverCard side={side} cardClassName="w-auto" card={<ClockCardBody />}>
      {children}
    </HoverCard>
  );
}

function ClockCardBody() {
  const [now, setNow] = useState(() => new Date());
  const [picked, setPicked] = useState<Date | undefined>();
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const tz = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return null;
    }
  }, []);

  const dayInfo = picked && format(picked, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="w-[248px]">
      <div className="mb-2 text-center">
        <p className="font-mono text-[26px] font-semibold leading-none tracking-tight text-foreground tabular-nums">
          {format(now, "HH:mm:ss")}
        </p>
        <p className="mt-1 text-[11.5px] capitalize text-muted-foreground">
          {format(now, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>
      <div className="rounded-lg border border-border bg-surface/60 p-2">
        <DayPicker
          mode="single"
          locale={ptBR}
          showOutsideDays
          selected={picked}
          onSelect={setPicked}
          classNames={CAL}
        />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="truncate">{dayInfo || (tz ? tz.replace(/_/g, " ") : "")}</span>
        {picked && (
          <button
            onClick={() => setPicked(undefined)}
            className="shrink-0 rounded px-1.5 py-0.5 font-medium text-primary hover:bg-primary/10"
          >
            Hoje
          </button>
        )}
      </div>
    </div>
  );
}
