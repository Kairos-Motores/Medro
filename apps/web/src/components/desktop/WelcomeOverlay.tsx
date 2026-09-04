import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useClock } from "@/lib/useClock";
import { playStartupChime } from "@/lib/startupChime";

/** duração de cada etapa (ms) */
const T = {
  brandOut: 2500, // a assinatura "Medro" começa a se dissolver
  brandEnd: 3000, // troca para a saudação
  welcomeHold: 2100, // saudação parada antes de sair
};
const LEAVE_MS = 560; // casa com welcome-overlay-out no index.css

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

const GLOW =
  "radial-gradient(closest-side, rgb(var(--primary) / 0.55), rgb(var(--primary) / 0.14) 55%, transparent 72%)";

type Phase = "brand" | "welcome" | "leaving";

/**
 * Cortina entre o login e a área de trabalho, em duas etapas:
 *  1. assinatura "Medro" (~3 s) — com o som de abertura do sistema;
 *  2. saudação + nome do usuário — que então se dissolve.
 * Aparece só após um login nesta aba (flag `welcome` em `useAuth`, não
 * persistida). A `Desktop` já monta atrás; a cortina é só visual.
 */
export function WelcomeOverlay() {
  const user = useAuth((s) => s.user);
  const dismiss = useAuth((s) => s.dismissWelcome);
  const { now } = useClock();
  const [phase, setPhase] = useState<Phase>("brand");
  const [brandOut, setBrandOut] = useState(false);
  const startRef = useRef(Date.now());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    playStartupChime();
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const at = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

    if (reduce) {
      at(() => setPhase("welcome"), 650);
      at(() => setPhase("leaving"), 1450);
      at(dismiss, 1500);
    } else {
      at(() => setBrandOut(true), T.brandOut);
      at(() => setPhase("welcome"), T.brandEnd);
      at(() => setPhase("leaving"), T.brandEnd + T.welcomeHold);
      at(dismiss, T.brandEnd + T.welcomeHold + LEAVE_MS);
    }
    return () => timers.current.forEach(clearTimeout);
  }, [dismiss]);

  // pular tudo no clique / tecla (ignora o clique que veio do próprio login)
  useEffect(() => {
    const skip = () => {
      if (Date.now() - startRef.current < 320) return;
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setPhase("leaving");
      timers.current.push(setTimeout(dismiss, LEAVE_MS));
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
      data-leaving={phase === "leaving"}
      role="status"
      aria-live="polite"
    >
      {phase === "brand" ? (
        <>
          <div
            className="brand-glow pointer-events-none absolute size-[56vmax] rounded-full"
            style={{ background: GLOW }}
          />
          <div className="relative flex flex-col items-center text-center">
            <h1
              className="brand-mark text-5xl font-semibold tracking-tight sm:text-6xl"
              data-out={brandOut}
            >
              Medro
            </h1>
            <span
              className="brand-rule mt-3 block h-px bg-white/30"
              data-out={brandOut}
              aria-hidden
            />
            <p
              className="brand-sub mt-3 text-[11.5px] font-medium uppercase tracking-[0.28em] text-white/45"
              data-out={brandOut}
            >
              Kairós Motores
            </p>
          </div>
        </>
      ) : (
        <>
          <div
            className="welcome-glow pointer-events-none absolute size-[52vmax] rounded-full"
            style={{ background: GLOW }}
          />
          <div className="relative flex flex-col items-center gap-2 px-6 text-center">
            <p className="welcome-title text-[13px] font-medium uppercase tracking-[0.22em] text-white/55">
              {greeting(now)}
            </p>
            <h1 className="welcome-name text-4xl font-semibold tracking-tight sm:text-5xl">
              {firstName(user?.nome)}
            </h1>
            <p className="welcome-title mt-1 text-[12.5px] text-white/45">Medro</p>
          </div>
        </>
      )}
    </div>
  );
}
