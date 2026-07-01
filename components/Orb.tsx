"use client";
import { THEME, GRAD } from "@/config/theme.config";

export function Orb({ size = 120 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: GRAD,
          filter: "blur(2px)",
          animation: "spin 8s linear infinite",
          boxShadow: `0 0 60px ${THEME.cyan}55, 0 0 90px ${THEME.violet}44`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: size * 0.18,
          borderRadius: "50%",
          background: THEME.bg,
          boxShadow: `inset 0 0 30px ${THEME.violet}66`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: size * 0.34,
          borderRadius: "50%",
          background: GRAD,
          animation: "pulse 2.4s ease-in-out infinite",
        }}
      />
    </div>
  );
}

export function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "10px 4px" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: THEME.cyan,
            animation: `blink 1.2s ${i * 0.2}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}
