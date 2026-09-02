import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Tema Medro — linguagem macOS (paleta fornecida como acento).
 * Cores referenciam CSS vars de src/styles/tokens.css (dark mode + ajuste sem rebuild).
 */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    screens: { xs: "400px", sm: "640px", md: "768px", lg: "1024px", xl: "1280px" },
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        "surface-muted": "rgb(var(--surface-2) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        "border-strong": "rgb(var(--border-strong) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        "foreground-secondary": "rgb(var(--foreground-secondary) / <alpha-value>)",
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
          slate: "rgb(var(--accent-slate) / <alpha-value>)",
          green: "rgb(var(--accent-green) / <alpha-value>)",
          amber: "rgb(var(--accent-amber) / <alpha-value>)",
          violet: "rgb(var(--accent-violet) / <alpha-value>)",
          rose: "rgb(var(--accent-rose) / <alpha-value>)",
        },
      },
      borderRadius: {
        xs: "3px",
        sm: "4px",
        md: "5px",
        lg: "7px",
        xl: "10px",
        window: "10px",
      },
      boxShadow: {
        "ios-1": "0 0 0 0.5px rgba(0,0,0,.04), 0 1px 2px rgba(0,0,0,.05)",
        "ios-2": "0 8px 28px rgba(0,0,0,.16), 0 0 0 0.5px rgba(0,0,0,.06)",
        "mac-1": "0 0 0 0.5px rgba(0,0,0,.04), 0 1px 2px rgba(0,0,0,.05)",
        "mac-2": "0 8px 28px rgba(0,0,0,.16), 0 0 0 0.5px rgba(0,0,0,.06)",
        sheet: "0 10px 40px rgba(0,0,0,.18), 0 0 0 0.5px rgba(0,0,0,.08)",
        popover: "0 10px 40px rgba(0,0,0,.18), 0 0 0 0.5px rgba(0,0,0,.08)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "Inter",
          "Segoe UI",
          "Roboto",
          "system-ui",
          "sans-serif",
        ],
      },
      transitionTimingFunction: { ios: "cubic-bezier(.25,.1,.25,1)", mac: "cubic-bezier(.25,.1,.25,1)" },
      minHeight: { tap: "36px" },
    },
  },
  plugins: [animate],
} satisfies Config;
