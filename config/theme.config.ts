// =========================================================================
// THEME — defaults below. remoteControl can override every accent/text color
// at runtime (applyTheme). The SPACE background colors are fixed on purpose.
// =========================================================================
import type { ThemeColors } from "@/lib/content/types";

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
};

// Hardcoded space theme (starfield, nebula, page backdrop) — NOT editable from remoteControl.
export const SPACE = {
  bg: "#0A0E14",
  cyan: "#00F0FF",
  violet: "#B14EFF",
} as const;

let gradMid = "#7FA8C9";
let fillMid = "#2F5F88";

const buildGrad = () => `linear-gradient(135deg, ${THEME.ice} 0%, ${gradMid} 50%, ${THEME.steel} 100%)`;
const buildFill = () => `linear-gradient(135deg, ${THEME.steel} 0%, ${fillMid} 45%, ${THEME.deep} 100%)`;

// Accent gradient (text, lines, indicators): ice → steel. Matte — never pair with glow.
// `let` exports are live bindings: importers see the new value after applyTheme().
export let GRAD = buildGrad();

// Filled surfaces with light text (chat bubbles etc.) — same as the primary button.
export let GRAD_FILL = buildFill();

const HEX = /^#[0-9a-fA-F]{6}$/;
const EDITABLE = [
  "cyan", "violet", "green", "text", "muted", "heading", "bgSoft",
  "navy", "deep", "steel", "ice", "snow",
] as const;

let lastApplied = "";

/** Applies theme colors from the database. Idempotent and safe to call during render. */
export function applyTheme(colors: Partial<ThemeColors> | undefined) {
  if (!colors) return;
  const key = JSON.stringify(colors);
  if (key === lastApplied) return;
  lastApplied = key;
  for (const k of EDITABLE) {
    const v = colors[k];
    if (typeof v === "string" && HEX.test(v)) THEME[k] = v;
  }
  THEME.glass = `${THEME.bgSoft}8C`; // bgSoft at 55% opacity
  if (colors.gradMid && HEX.test(colors.gradMid)) gradMid = colors.gradMid;
  if (colors.fillMid && HEX.test(colors.fillMid)) fillMid = colors.fillMid;
  GRAD = buildGrad();
  GRAD_FILL = buildFill();
}

/** Resolves a hobby/accent color: a theme key ("cyan") or a literal hex. */
export function themeColor(value: string, fallback = THEME.cyan): string {
  if (value in THEME) return (THEME as Record<string, string>)[value];
  return HEX.test(value) ? value : fallback;
}
