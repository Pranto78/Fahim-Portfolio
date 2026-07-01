// =========================================================================
// THEME — change ANY color / font here, it updates across the whole site.
// =========================================================================
export const THEME = {
  bg: "#0A0E14",
  bgSoft: "#10141C",
  glass: "rgba(16,20,28,0.55)",
  cyan: "#00F0FF",
  violet: "#B14EFF",
  green: "#39FF88",
  text: "#E8EAED",
  muted: "#7B8794",
  heading: "#FFFFFF",
  border: "rgba(255,255,255,0.08)",
  fontDisplay: "'Space Grotesk', sans-serif",
  fontBody: "'Inter', sans-serif",
  fontMono: "'JetBrains Mono', monospace",
} as const;

export const GRAD = `linear-gradient(135deg, ${THEME.cyan} 0%, ${THEME.violet} 100%)`;
