"use client";
import { THEME } from "@/config/theme.config";
import { SKILLS_ROW_1, SKILLS_ROW_2 } from "@/data/skills";
import { Section, Eyebrow, Heading } from "./ui";

function Marquee({ items, reverse }: { items: string[]; reverse?: boolean }) {
  return (
    <div
      style={{
        overflow: "hidden",
        maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 14,
          width: "max-content",
          animation: `${reverse ? "scrollR" : "scrollL"} 32s linear infinite`,
        }}
      >
        {[...items, ...items].map((s, i) => (
          <div
            key={i}
            className="skillpill"
            style={{
              padding: "12px 22px",
              borderRadius: 12,
              background: THEME.bgSoft,
              border: `1px solid ${THEME.border}`,
              color: THEME.text,
              fontSize: 15,
              fontFamily: THEME.fontMono,
              whiteSpace: "nowrap",
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <Section id="skills">
      <Eyebrow>Stack</Eyebrow>
      <Heading>Skills &amp; Tools</Heading>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Marquee items={SKILLS_ROW_1} />
        <Marquee items={SKILLS_ROW_2} reverse />
      </div>
    </Section>
  );
}
