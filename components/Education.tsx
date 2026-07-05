"use client";
import { GraduationCap } from "lucide-react";
import { THEME, GRAD } from "@/config/theme.config";
import { Section, Eyebrow, Heading } from "./ui";

const items = [
  {
    t: "BSc in Computer Science & Engineering",
    s: "American International University-Bangladesh (AIUB)",
    d: "Expected 2026",
    note: "Coursework: DSA, DBMS, OOP, Web Engineering, Software Engineering.",
  },
  {
    t: "Complete Web Development Course",
    s: "Programming Hero",
    d: "Jun 2025 – Feb 2026",
    note: "Full-stack: HTML, CSS, JS, React, Node, MongoDB. 10+ projects.",
  },
];

export default function Education() {
  return (
    <Section id="education" variant="flip">
      <Eyebrow icon={GraduationCap}>Background</Eyebrow>
      <Heading>Education &amp; Learning</Heading>
      <div style={{ position: "relative", paddingLeft: 28 }}>
        <div style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 2, background: GRAD, opacity: 0.4 }} />
        {items.map((it, i) => (
          <div key={i} style={{ position: "relative", marginBottom: 30 }}>
            <div
              style={{
                position: "absolute",
                left: -28,
                top: 4,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: GRAD,
                boxShadow: `0 0 12px ${THEME.cyan}88`,
              }}
            />
            <div style={{ fontFamily: THEME.fontMono, fontSize: 12, color: THEME.cyan }}>{it.d}</div>
            <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 600, color: THEME.heading, fontSize: 17, marginTop: 4 }}>
              {it.t}
            </div>
            <div style={{ fontSize: 14, color: THEME.text, marginTop: 2 }}>{it.s}</div>
            <div style={{ fontSize: 13, color: THEME.muted, marginTop: 6, lineHeight: 1.5 }}>{it.note}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
