import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useClock } from "@/lib/useClock";

const HOLD_MS = 1500; // tempo visível antes de começar a sair
const LEAVE_MS = 460; // deve casar com welcome-overlay-out no index.css

/** saudação por faixa do dia */
function greeting(d: Date): string {
  const h = d.getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function firstName(nome: string | undefined | null): string {
  const n = (nome ?? "").trim().split(/\s+/)[0];
  return n || "de volta";
}

/**
 * Cortina de boas-vindas entre o login e a área de trabalho. Aparece só depois
 * de um login nesta aba (flag `welcome` em `useAuth`, não persistida) e se
 * dissolve sozinha. A `Desktop` já monta atrás — a cortina é só visual.
 */
export function WelcomeOverlay() {
  const user = useAuth((s) => s.user);
  const dismiss = useAuth((s) => s.dismissWelcome);
  const { now } = useClock();
  const [leaving, setLeaving] = useState(false);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const hold = reduce ? 500 : HOLD_MS;
    const leave = reduce ? 1 : LEAVE_MS;
    const t1 = setTimeout(() => setLeaving(true), hold);
    const t2 = setTimeout(dismiss, hold + leave);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [dismiss]);

  // fecha na hora se o usuário clicar / apertar tecla
  useEffect(() => {
    const skip = () => {
      if (Date.now() - startRef.current < 220) return; // ignora o clique que veio do login
      setLeaving(true);
      setTimeout(dismiss, LEAVE_MS);
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [dismiss]);

  return (
    <div
      className="welcome-overlay fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-elevated-dark text-white"
      data-leaving={leaving}
      role="status"
      aria-live="polite"
    >
      {/* brilho suave na paleta primária */}
      <div
        className="welcome-glow pointer-events-none absolute size-[52vmax] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgb(var(--primary) / 0.55), rgb(var(--primary) / 0.14) 55%, transparent 72%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-2 px-6 text-center">
        <p className="welcome-title text-[13px] font-medium uppercase tracking-[0.22em] text-white/55">
          {greeting(now)}
        </p>
        <h1 className="welcome-name text-4xl font-semibold tracking-tight sm:text-5xl">
          {firstName(user?.nome)}
        </h1>
        <p className="welcome-title mt-1 text-[12.5px] text-white/45">
          {user?.filial ? `Medro · ${user.filial}` : "Medro"}
        </p>
      </div>
    </div>
  );
}
