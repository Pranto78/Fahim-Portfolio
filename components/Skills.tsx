"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Layers } from "lucide-react";
import { THEME } from "@/config/theme.config";
import { Skill, chunkSkills } from "@/data/skills";
import { useTypewriter } from "@/lib/useTypewriter";
import { Section, Eyebrow, Heading } from "./ui";
import TiltCard from "./TiltCard";

const TILE_WIDTH = 150;
const MARQUEE_GAP = 14;
const MARQUEE_SPEED = 10; // pixels per second — intentionally calm and easy to scan

function SkillIcon({ skill, size }: { skill: Skill; size: number }) {
  if (skill.icon) {
    const Icon = skill.icon;
    return <Icon size={size} color={skill.color} />;
  }
  return (
    <span
      style={{
        fontFamily: THEME.fontMono,
        fontWeight: 700,
        fontSize: size * 0.5,
        color: skill.color,
      }}
    >
      {skill.mono}
    </span>
  );
}

function StickyModal({ skill }: { skill: Skill | null }) {
  const active = skill ?? {
    name: "Hover a stack",
    icon: null,
    mono: "?",
    color: THEME.cyan,
    note: "Hover any tile to see what I use it for — typed out live.",
  };
  const { text } = useTypewriter(active.note, 22);

  return (
    <div
      style={{
        position: "sticky",
        top: 90,
        zIndex: 2,
        marginBottom: 22,
        borderRadius: 16,
        padding: 18,
        background: THEME.glass,
        backdropFilter: "blur(14px)",
        border: `1px solid ${skill ? active.color + "66" : THEME.border}`,
        boxShadow: skill ? `0 0 28px ${active.color}22` : "none",
        transition: "border-color .3s, box-shadow .3s",
        minHeight: 96,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active.name}
          initial={{ opacity: 0, rotateX: -30, y: 8 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, rotateX: 30, y: -8 }}
          transition={{ duration: 0.28 }}
          style={{ transformPerspective: 700, display: "flex", gap: 14, alignItems: "flex-start" }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 12,
              background: THEME.bgSoft,
              border: `1px solid ${THEME.border}`,
            }}
          >
            <SkillIcon skill={active} size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: THEME.fontDisplay,
                fontWeight: 700,
                color: THEME.heading,
                fontSize: 16,
                marginBottom: 4,
              }}
            >
              {active.name}
            </div>
            <div
              className="type-caret"
              style={{ fontSize: 13.5, color: THEME.muted, fontFamily: THEME.fontMono, lineHeight: 1.55, minHeight: 20 }}
            >
              {text}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SkillTile({ skill, onHover }: { skill: Skill; onHover: (s: Skill | null) => void }) {
  const [hover, setHover] = useState(false);
  return (
    <TiltCard
      max={14}
      scale={1.05}
      style={{ borderRadius: 14, width: 150, flex: "0 0 auto" }}
    >
      <div
        onMouseEnter={() => {
          setHover(true);
          onHover(skill);
        }}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "20px 12px",
          borderRadius: 14,
          height: 118,
          background: THEME.bgSoft,
          border: `1px solid ${hover ? skill.color + "88" : THEME.border}`,
          boxShadow: hover ? `0 0 26px ${skill.color}33` : "none",
          transition: "border-color .25s, box-shadow .25s",
          cursor: "default",
        }}
      >
        <div style={{ transform: "translateZ(30px)" }}>
          <SkillIcon skill={skill} size={34} />
        </div>
        <AnimatePresence>
          {hover ? (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: THEME.fontMono,
                fontSize: 12.5,
                color: skill.color,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {skill.name}
            </motion.div>
          ) : (
            <div style={{ fontFamily: THEME.fontMono, fontSize: 12.5, color: THEME.muted, whiteSpace: "nowrap" }}>
              {skill.name}
            </div>
          )}
        </AnimatePresence>
      </div>
    </TiltCard>
  );
}

function MarqueeRow({
  row,
  reverse,
  onHover,
}: {
  row: Skill[];
  reverse: boolean;
  onHover: (s: Skill | null) => void;
}) {
  const [paused, setPaused] = useState(false);
  const duration = (row.length * (TILE_WIDTH + MARQUEE_GAP)) / MARQUEE_SPEED;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        onHover(null);
      }}
      style={{
        overflow: "hidden",
        padding: "6px 0",
        maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div
        className="skills-marquee-track"
        style={{
          display: "flex",
          gap: MARQUEE_GAP,
          width: "max-content",
          animation: `${reverse ? "scrollR" : "scrollL"} ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {[false, true].map((duplicate) => (
          <div
            key={duplicate ? "duplicate" : "original"}
            aria-hidden={duplicate || undefined}
            style={{ display: "flex", gap: MARQUEE_GAP }}
          >
            {row.map((s) => (
              <SkillTile key={s.name} skill={s} onHover={onHover} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const [active, setActive] = useState<Skill | null>(null);
  const reduced = useReducedMotion();
  const rows = chunkSkills(3);

  return (
    <Section id="skills" variant="zoom">
      <Eyebrow icon={Layers}>Stack</Eyebrow>
      <Heading>Skills &amp; Tools</Heading>

      <StickyModal skill={active} />

      {reduced ? (
        <div
          onMouseLeave={() => setActive(null)}
          style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}
        >
          {rows.flat().map((s, i) => (
            <SkillTile key={`${s.name}-${i}`} skill={s} onHover={setActive} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map((row, i) => (
            <MarqueeRow
              key={i}
              row={row}
              reverse={i % 2 === 0} /* row 1 → right, row 2 → left, row 3 → right … */
              onHover={setActive}
            />
          ))}
        </div>
      )}
    </Section>
  );
}
