"use client";
import { useState, useEffect } from "react";
import { THEME } from "@/config/theme.config";
import { Orb } from "./Orb";

export default function Loader({ onDone }: { onDone: () => void }) {
  const lines = [
    "Initializing assistant…",
    "Loading profile data…",
    "Indexing projects…",
    "System ready.",
  ];
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown < lines.length) {
      const t = setTimeout(() => setShown((s) => s + 1), 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onDone, 600);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: THEME.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
      }}
    >
      <Orb size={120} />
      <div
        style={{
          fontFamily: THEME.fontMono,
          fontSize: 13,
          color: THEME.muted,
          minHeight: 110,
          width: 260,
        }}
      >
        {lines.slice(0, shown).map((l, i) => (
          <div
            key={i}
            style={{ marginBottom: 6, color: i === lines.length - 1 ? THEME.green : THEME.muted }}
          >
            <span style={{ color: THEME.cyan }}>{">"}</span> {l}
          </div>
        ))}
      </div>
    </div>
  );
}
