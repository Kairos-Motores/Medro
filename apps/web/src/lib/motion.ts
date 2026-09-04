import type { Transition, Variants } from "framer-motion";

/**
 * Vocabulário de movimento do Medro — um "SO" tem física consistente.
 * Use estes presets em vez de números soltos para o shell inteiro parecer
 * a mesma máquina. `MotionConfig reducedMotion="user"` (em app/App.tsx) já
 * neutraliza tudo isto quando o usuário pede menos animação.
 */

/** mola padrão — resposta rápida, quica de leve. Janelas, dock, tiles. */
export const SPRING: Transition = { type: "spring", stiffness: 420, damping: 32, mass: 0.9 };

/** mola curta e seca — botões, ícones, microinterações. */
export const SPRING_SNAPPY: Transition = { type: "spring", stiffness: 620, damping: 30, mass: 0.6 };

/** mola macia — overlays grandes, launchpad, gaveta de widgets. */
export const SPRING_SOFT: Transition = { type: "spring", stiffness: 260, damping: 30, mass: 1 };

/** tween curto p/ opacidade/cor quando mola não faz sentido. */
export const EASE_OUT: Transition = { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] };

/** abertura/fecho de janela (transform + opacity, nunca layout). */
export const windowPop: Variants = {
  initial: { opacity: 0, scale: 0.92, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: SPRING },
  exit: { opacity: 0, scale: 0.94, y: 8, transition: EASE_OUT },
};

/** minimizar — "suga" para baixo, na direção do dock. */
export const windowMinimize: Variants = {
  initial: { opacity: 0, scale: 0.9, y: 14 },
  animate: { opacity: 1, scale: 1, y: 0, transition: SPRING },
  exit: { opacity: 0, scale: 0.6, y: 120, transition: { duration: 0.26, ease: [0.4, 0, 1, 1] } },
};

/** overlay full-screen (launchpad, task view, gaveta). */
export const overlayFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: EASE_OUT },
  exit: { opacity: 0, transition: { duration: 0.16 } },
};

/** painel dentro de um overlay — cresce do centro. */
export const overlayPanel: Variants = {
  initial: { opacity: 0, scale: 0.92, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0, transition: SPRING_SOFT },
  exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.14 } },
};

/** grade com entrada escalonada (tiles do launchpad, cards do task view). */
export const gridContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.028, delayChildren: 0.04 } },
  exit: {},
};

export const gridItem: Variants = {
  initial: { opacity: 0, scale: 0.8, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0, transition: SPRING },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.12 } },
};

/** pop de um item (widget novo, atalho novo, ícone que entra numa lista). */
export const itemPop: Variants = {
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1, transition: SPRING_SNAPPY },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.14 } },
};

/** hover/press padrão de qualquer alvo clicável do shell. */
export const tapScale = { whileHover: { scale: 1.06 }, whileTap: { scale: 0.94 } } as const;
export const tapScaleSubtle = { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 } } as const;
