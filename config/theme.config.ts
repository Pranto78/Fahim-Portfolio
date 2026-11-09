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
  // Matte ocean palette — accents, active states, buttons, section titles.
  navy: "#0A1931",
  deep: "#1A3D63",
  steel: "#4A7FA7",
  ice: "#B3CFE5",
  snow: "#F6FAFD",
  fontDisplay: "'Space Grotesk', sans-serif",
  fontBody: "'Inter', sans-serif",
  fontMono: "'JetBrains Mono', monospace",
} as const;

// Accent gradient (text, lines, indicators): ice → steel. Matte — never pair with glow.
export const GRAD = `linear-gradient(135deg, ${THEME.ice} 0%, #7FA8C9 50%, ${THEME.steel} 100%)`;

// Filled surfaces with light text (chat bubbles etc.) — same as the primary button.
export const GRAD_FILL = `linear-gradient(135deg, ${THEME.steel} 0%, #2F5F88 45%, ${THEME.deep} 100%)`;
