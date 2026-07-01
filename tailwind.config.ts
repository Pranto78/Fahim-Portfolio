import type { Config } from "tailwindcss";

// Mirrors config/theme.config.ts so Tailwind classes match existing inline styles.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0E14",
        bgSoft: "#10141C",
        cyan: "#00F0FF",
        violet: "#B14EFF",
        green: "#39FF88",
        text: "#E8EAED",
        muted: "#7B8794",
        heading: "#FFFFFF",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
