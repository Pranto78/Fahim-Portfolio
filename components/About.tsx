"use client";
import { ReactNode, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Github, ExternalLink, MapPin, Briefcase, GraduationCap, UserRound } from "lucide-react";
import { THEME } from "@/config/theme.config";
import { PERSON, PERSONAL } from "@/data/person";
import { Section, Eyebrow, Heading } from "./ui";
import SnakeBorder from "./SnakeBorder";

const EASE = [0.16, 1, 0.3, 1] as const;

// Columns slide in from opposite sides.
const colFrom = (dir: -1 | 1): Variants => ({
  hidden: { opacity: 0, x: 70 * dir },
  show: { opacity: 1, x: 0, transition: { duration: 0.85, ease: EASE } },
});

// Card list: children float up one-by-one (staggered).
const listStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
};
const cardFloat: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

function Row({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, color: THEME.text, fontSize: 15 }}>
      <span style={{ color: THEME.cyan }}>{icon}</span>
      {label}
    </div>
  );
}

function PersonalCard({ p }: { p: (typeof PERSONAL)[number] }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div variants={cardFloat}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "relative",
          padding: 16,
          borderRadius: 14,
          background: THEME.bgSoft,
          border: `1px solid ${THEME.border}`,
          boxShadow: hover ? `0 0 30px ${THEME.violet}22` : "none",
          transform: hover ? "translateY(-4px)" : "translateY(0)",
          transition: "transform .45s cubic-bezier(0.16,1,0.3,1), box-shadow .45s ease",
        }}
      >
        <SnakeBorder active={hover} radius={14} duration={1.5} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 600, color: THEME.heading, fontSize: 15 }}>
            {p.name}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {p.github && (
              <a href={p.github} target="_blank" rel="noreferrer" style={{ color: THEME.muted }}>
                <Github size={17} />
              </a>
            )}
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer" style={{ color: THEME.cyan }}>
                <ExternalLink size={17} />
              </a>
            )}
          </div>
        </div>
        <p style={{ fontSize: 13.5, color: THEME.muted, marginTop: 6, lineHeight: 1.55 }}>{p.desc}</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  return (
    <Section id="about" variant="fade">
      <Eyebrow icon={UserRound}>About</Eyebrow>
      <Heading>Who I am</Heading>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
        <motion.div
          variants={colFrom(-1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          style={{ flex: "1 1 340px" }}
        >
          <p style={{ fontSize: 16.5, color: THEME.text, lineHeight: 1.75 }}>
            I&apos;m a {PERSON.role} on the Technology Team at{" "}
            <a href={PERSON.companyUrl} target="_blank" rel="noreferrer" style={{ color: THEME.cyan, textDecoration: "none" }}>
              Octopi Digital
            </a>
            , building production web and mobile apps. My day-to-day spans React/Next on the web,
            React Native on mobile, and Node/Express APIs — with a current focus on secure,
            role-based backend systems.
          </p>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 12 }}>
            <Row icon={<Briefcase size={18} />} label="Octopi Digital — Junior Software Engineer" />
            <Row icon={<MapPin size={18} />} label={PERSON.location} />
            <Row icon={<GraduationCap size={18} />} label="BSc in CSE, AIUB (expected 2026)" />
          </div>

          <h3 style={{ fontFamily: THEME.fontDisplay, color: THEME.heading, fontSize: 18, marginTop: 36, marginBottom: 14 }}>
            Hobbies
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {PERSON.hobbies.map((h) => (
              <span
                key={h}
                style={{
                  fontSize: 13,
                  padding: "7px 14px",
                  borderRadius: 20,
                  background: THEME.bgSoft,
                  border: `1px solid ${THEME.border}`,
                  color: THEME.text,
                }}
              >
                {h}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={colFrom(1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          style={{ flex: "1 1 340px" }}
        >
          <h3 style={{ fontFamily: THEME.fontDisplay, color: THEME.heading, fontSize: 18, marginBottom: 16 }}>
            Personal Projects
          </h3>
          <motion.div
            variants={listStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {PERSONAL.map((p) => (
              <PersonalCard key={p.name} p={p} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}
