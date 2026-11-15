import type { ThemeColors } from "./types";

const HEX = /^#[0-9a-fA-F]{6}$/;

const channels = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");

// CSS variable name ← theme key. Space background vars (--bg) are intentionally absent.
const MAP: [keyof ThemeColors, string[]][] = [
  ["cyan", ["--cyan"]],
  ["violet", ["--violet"]],
  ["green", ["--green"]],
  ["text", ["--text"]],
  ["muted", ["--muted"]],
  ["heading", ["--heading"]],
  ["bgSoft", ["--bg-soft"]],
  ["navy", ["--btn-navy", "--navy"]],
  ["deep", ["--btn-deep", "--deep"]],
  ["steel", ["--btn-steel", "--steel"]],
  ["ice", ["--btn-ice", "--ice"]],
  ["snow", ["--btn-snow", "--snow"]],
  ["gradMid", ["--grad-mid"]],
  ["fillMid", ["--fill-mid"]],
];

const RGB_NAME: Partial<Record<keyof ThemeColors, string>> = {
  cyan: "cyan", violet: "violet", green: "green", text: "text", muted: "muted",
  bgSoft: "bg-soft", navy: "navy", deep: "deep", steel: "steel", ice: "ice", snow: "snow",
};

/** `:root{...}` overrides for globals.css. Only valid hex values are emitted (no CSS injection). */
export function themeCssVars(theme: ThemeColors): string {
  const decl: string[] = [];
  for (const [key, vars] of MAP) {
    const v = theme[key];
    if (!HEX.test(v)) continue;
    for (const name of vars) decl.push(`${name}:${v}`);
    const rgb = RGB_NAME[key];
    if (rgb) decl.push(`--${rgb}-rgb:${channels(v)}`);
  }
  return `:root{${decl.join(";")}}`;
}
