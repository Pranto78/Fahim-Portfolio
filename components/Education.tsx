"use client";
import { GraduationCap } from "lucide-react";
import { THEME, GRAD } from "@/config/theme.config";
import { Section, Eyebrow, Heading } from "./ui";
import { useContent } from "./ContentProvider";

// Only entries marked "show on site" in remoteControl reach the browser. School-level
// background (HSC, SSC, JSC, PSC) is AI-only by default — the assistant can still answer about it.
export default function Education() {
  const c = useContent();
  const items = c.education.map((e) => ({ t: e.title, s: e.institution, d: e.date, note: e.note, id: e.id }));
  return (
    <Section id="education" variant="flip">
      <Eyebrow icon={GraduationCap}>{c.text.education.eyebrow}</Eyebrow>
      <Heading>{c.text.education.heading}</Heading>
      <div style={{ position: "relative", paddingLeft: 28 }}>
        <div style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 2, background: GRAD, opacity: 0.4 }} />
        {items.map((it) => (
          <div key={it.id} style={{ position: "relative", marginBottom: 30 }}>
            <div
              style={{
                position: "absolute",
                left: -28,
                top: 4,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: GRAD,
                boxShadow: `0 0 0 3px ${THEME.bg}, 0 0 0 4px ${THEME.steel}55`,
              }}
            />
            <div style={{ fontFamily: THEME.fontMono, fontSize: 12, color: THEME.ice }}>{it.d}</div>
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
