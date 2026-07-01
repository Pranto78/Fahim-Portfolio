"use client";
import { useState, useEffect } from "react";
import { THEME, GRAD } from "@/config/theme.config";
import { NAV } from "@/data/skills";

export default function Navbar({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: scrolled ? "12px 5vw" : "20px 5vw",
        transition: "all .3s",
        background: scrolled ? THEME.glass : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${THEME.border}` : "1px solid transparent",
      }}
    >
      <div
        onClick={() => go("hero")}
        style={{
          cursor: "pointer",
          fontFamily: THEME.fontDisplay,
          fontWeight: 700,
          fontSize: 18,
          color: THEME.heading,
          letterSpacing: 0.5,
        }}
      >
        FSP<span style={{ color: THEME.cyan }}>.</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => go(n.id)}
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px 14px",
              fontSize: 14,
              fontFamily: THEME.fontBody,
              color: active === n.id ? THEME.heading : THEME.muted,
              transition: "color .2s",
            }}
          >
            {n.label}
            {active === n.id && (
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  right: 12,
                  bottom: 2,
                  height: 2,
                  background: GRAD,
                  borderRadius: 2,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
