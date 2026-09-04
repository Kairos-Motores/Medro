import type { Transition, Variants } from "framer-motion";

/**
 * Vocabulário de movimento do Medro — um "SO" tem física consistente.
 * Calibrado para ser DISCRETO: molas quase criticamente amortecidas (sem
 * "quique" visível), escalas de hover pequenas. Use estes presets em vez de
 * números soltos. `MotionConfig reducedMotion="user"` (em app/App.tsx) já
 * neutraliza tudo isto quando o usuário pede menos animação.
 */

/** mola padrão — assenta rápido, praticamente sem overshoot. Janelas, dock, tiles. */
export const SPRING: Transition = { type: "spring", stiffness: 340, damping: 36, mass: 0.9 };

/** mola curta — microinterações (ícones que entram/saem de listas). */
export const SPRING_SNAPPY: Transition = { type: "spring", stiffness: 460, damping: 36, mass: 0.7 };

/** mola macia — overlays grandes, launchpad, gaveta de widgets. */
export const SPRING_SOFT: Transition = { type: "spring", stiffness: 240, damping: 32, mass: 1 };

/** tween curto p/ opacidade/cor quando mola não faz sentido. */
export const EASE_OUT: Transition = { duration: 0.16, ease: [0.25, 0.1, 0.25, 1] };

/** abertura/fecho de janela (transform + opacity, nunca layout). */
export const windowPop: Variants = {
  initial: { opacity: 0, scale: 0.975, y: 6 },
  animate: { opacity: 1, scale: 1, y: 0, transition: SPRING },
  exit: { opacity: 0, scale: 0.975, y: 6, transition: EASE_OUT },
};

/** minimizar — desce de leve na direção do dock. */
export const windowMinimize: Variants = {
  initial: { opacity: 0, scale: 0.97, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: SPRING },
  exit: { opacity: 0, scale: 0.85, y: 64, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
};

/** overlay full-screen (launchpad, task view, gaveta). */
export const overlayFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: EASE_OUT },
  exit: { opacity: 0, transition: { duration: 0.14 } },
};

/** painel dentro de um overlay — surge do centro, discreto. */
export const overlayPanel: Variants = {
  initial: { opacity: 0, scale: 0.975, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: SPRING_SOFT },
  exit: { opacity: 0, scale: 0.98, y: 6, transition: { duration: 0.12 } },
};

/** grade com entrada escalonada (tiles do launchpad, cards do task view). */
export const gridContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.02, delayChildren: 0.03 } },
  exit: {},
};

export const gridItem: Variants = {
  initial: { opacity: 0, scale: 0.97, y: 6 },
  animate: { opacity: 1, scale: 1, y: 0, transition: SPRING },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.1 } },
};

/** pop de um item (widget novo, atalho novo, ícone que entra numa lista). */
export const itemPop: Variants = {
  initial: { opacity: 0, scale: 0.86 },
  animate: { opacity: 1, scale: 1, transition: SPRING_SNAPPY },
  exit: { opacity: 0, scale: 0.86, transition: { duration: 0.12 } },
};

/** hover/press padrão de um alvo clicável do shell — quase imperceptível. */
export const tapScale = { whileHover: { scale: 1.025 }, whileTap: { scale: 0.975 } } as const;
export const tapScaleSubtle = { whileHover: { scale: 1.012 }, whileTap: { scale: 0.985 } } as const;
