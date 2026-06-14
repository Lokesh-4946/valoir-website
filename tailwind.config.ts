import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Theme-able via CSS variables (dark default + warm light variant ready)
        bg: "var(--bg)",
        "bg-2": "var(--bg-2)",
        "bg-3": "var(--bg-3)",
        fg: "var(--fg)",
        bone: "var(--bone)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        accent: "var(--accent)",
        teal: "var(--teal)",
        rose: "var(--rose)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        eyebrow: "0.22em",
      },
      maxWidth: {
        shell: "1280px",
      },
      keyframes: {
        blink: { "50%": { opacity: "0" } },
      },
      animation: {
        blink: "blink 1.1s steps(1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
