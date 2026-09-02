import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Tema Medro — paleta fornecida + estética iOS 15.
 * As cores referenciam CSS vars definidas em src/styles/tokens.css (permite dark mode
 * e ajuste sem rebuild). Ver docs/05-arquitetura-alvo.md §5.
 */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
    },
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-muted": "rgb(var(--surface-muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        "border-strong": "rgb(var(--border-strong) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          hover: "rgb(var(--primary-hover) / <alpha-value>)",
          press: "rgb(var(--primary-press) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        danger: "rgb(var(--danger) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",
        "elevated-dark": "rgb(var(--elevated-dark) / <alpha-value>)",
        accent: {
          blue: "rgb(var(--accent-blue) / <alpha-value>)",
          indigo: "rgb(var(--accent-indigo) / <alpha-value>)",
          teal: "rgb(var(--accent-teal) / <alpha-value>)",
          cyan: "rgb(var(--accent-cyan) / <alpha-value>)",
          green: "rgb(var(--accent-green) / <alpha-value>)",
          amber: "rgb(var(--accent-amber) / <alpha-value>)",
          rose: "rgb(var(--accent-rose) / <alpha-value>)",
          violet: "rgb(var(--accent-violet) / <alpha-value>)",
          slate: "rgb(var(--accent-slate) / <alpha-value>)",
        },
      },
      borderRadius: {
        xs: "3px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
      boxShadow: {
        "ios-1": "0 1px 2px rgba(39,50,62,.05), 0 1px 1px rgba(39,50,62,.04)",
        "ios-2": "0 6px 20px rgba(39,50,62,.09)",
        sheet: "0 -8px 30px rgba(39,50,62,.16)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "SF Pro Text",
          "SF Pro Display",
          "Inter",
          "Segoe UI",
          "Roboto",
          "system-ui",
          "sans-serif",
        ],
      },
      transitionTimingFunction: {
        ios: "cubic-bezier(.32,.72,0,1)",
      },
      minHeight: {
        tap: "44px",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
