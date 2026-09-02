import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/** Relógio ao vivo (atualiza a cada 30s). Usado no header do app. */
export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return {
    now,
    time: format(now, "HH:mm"),
    weekday: format(now, "EEEE", { locale: ptBR }),
    dateShort: format(now, "d 'de' MMM", { locale: ptBR }),
    dateLong: format(now, "EEEE, d 'de' MMMM", { locale: ptBR }),
  };
}

export function initials(name: string | undefined | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]![0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]![0] ?? "") : "";
  return (first + last).toUpperCase();
}
