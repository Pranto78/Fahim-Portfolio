"use client";
import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import { THEME, GRAD } from "@/config/theme.config";
import { Orb } from "./Orb";
import ChatPanel from "./ChatPanel";

export default function FloatingBot() {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTeaser(true), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {teaser && !open && (
        <div
          onClick={() => {
            setOpen(true);
            setTeaser(false);
          }}
          style={{
            position: "fixed",
            bottom: 92,
            right: 24,
            zIndex: 60,
            cursor: "pointer",
            maxWidth: 230,
            padding: "12px 16px",
            borderRadius: 16,
            background: THEME.glass,
            backdropFilter: "blur(14px)",
            border: `1px solid ${THEME.cyan}44`,
            color: THEME.text,
            fontSize: 13.5,
            lineHeight: 1.5,
            boxShadow: `0 0 30px ${THEME.cyan}22`,
            animation: "floatIn .4s ease",
          }}
        >
          Want to know about this person? Tap me — I&apos;ll answer.
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 61,
          width: 58,
          height: 58,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: GRAD,
          display: "grid",
          placeItems: "center",
          boxShadow: `0 0 30px ${THEME.cyan}55`,
        }}
      >
        {open ? <X size={24} color="#06080C" /> : <Sparkles size={24} color="#06080C" />}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 92,
            right: 24,
            zIndex: 60,
            width: "min(380px, 92vw)",
            height: "min(540px, 72vh)",
            borderRadius: 20,
            background: THEME.glass,
            backdropFilter: "blur(18px)",
            border: `1px solid ${THEME.border}`,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 60px rgba(0,0,0,.5)",
            animation: "floatIn .25s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingBottom: 12,
              borderBottom: `1px solid ${THEME.border}`,
              marginBottom: 10,
            }}
          >
            <div style={{ width: 30, height: 30 }}>
              <Orb size={30} />
            </div>
            <div>
              <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 600, color: THEME.heading, fontSize: 14 }}>
                Fahim&apos;s Assistant
              </div>
              <div style={{ fontSize: 11, color: THEME.green, fontFamily: THEME.fontMono }}>● online</div>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ChatPanel
              mode="general"
              intro="Hi! I'm Fahim's portfolio assistant. Ask me about his work, skills, projects or background."
              suggestions={[
                { label: "Where does he work?", q: "Where does Fahim currently work and what's his role?" },
                { label: "His skills?", q: "What are his main technical skills?" },
                { label: "Education", q: "What is his educational background?" },
              ]}
            />
          </div>
        </div>
      )}
    </>
  );
}
