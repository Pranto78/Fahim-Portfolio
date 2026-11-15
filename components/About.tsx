"use client";
import { ReactNode, useState } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Github, ExternalLink, UserRound, Sparkles } from "lucide-react";
import { THEME, themeColor } from "@/config/theme.config";
import { resolveIcon } from "@/lib/icons";
import type { Hobby, PersonalProject } from "@/lib/content/types";
import { useContent, fillTokens } from "./ContentProvider";
import { Section, Eyebrow, Heading } from "./ui";
import SnakeBorder from "./SnakeBorder";
import ABOUT_PHOTO_SRC from "@/asset/pranto2.png";

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

function HobbyChip({ hobby }: { hobby: Hobby }) {
  const reduced = useReducedMotion();
  const label = hobby.label;
  const Icon = resolveIcon(hobby.icon) ?? Sparkles;
  const meta = { icon: <Icon size={15} />, color: themeColor(hobby.color) };

  return (
    <motion.span
      initial="rest"
      whileHover="hover"
      variants={{
        rest: { y: 0, scale: 1 },
        hover: { y: reduced ? 0 : -2, scale: reduced ? 1 : 1.025 },
      }}
      transition={{ duration: reduced ? 0 : 0.38, ease: EASE }}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        padding: "7px 14px",
        borderRadius: 20,
        background: THEME.bgSoft,
        border: `1px solid ${THEME.border}`,
        color: THEME.text,
        cursor: "default",
      }}
    >
      <motion.span
        aria-hidden
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: 20,
          border: `1px solid ${meta.color}88`,
          boxShadow: `0 0 20px ${meta.color}22`,
          pointerEvents: "none",
        }}
      />
      <motion.span
        aria-hidden
        variants={{
          rest: { color: THEME.muted, opacity: 0.75 },
          hover: { color: meta.color, opacity: 1 },
        }}
        transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
        style={{ position: "relative", zIndex: 1, display: "grid", placeItems: "center" }}
      >
        {meta.icon}
      </motion.span>
      <motion.span
        variants={{ rest: { color: THEME.text }, hover: { color: THEME.heading } }}
        transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
        style={{ position: "relative", zIndex: 1 }}
      >
        {label}
      </motion.span>
    </motion.span>
  );
}

function AboutPhotoFrame({ name, url }: { name: string; url: string }) {
  return (
    <div className="about-photo-frame">
      <div className="about-photo-inner">
        {url ? (
          <Image src={url} alt={name} fill unoptimized loading="lazy" />
        ) : (
          <Image src={ABOUT_PHOTO_SRC} alt={name} loading="lazy" />
        )}
        <div className="about-photo-tag">{name}</div>
      </div>
    </div>
  );
}

function PersonalCard({ p }: { p: PersonalProject }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div variants={cardFloat}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "relative",
          minHeight: 104,
          padding: 10,
          borderRadius: 11,
          background: THEME.bgSoft,
          border: `1px solid ${THEME.border}`,
          boxShadow: hover ? `0 0 24px ${THEME.violet}1F` : "none",
          transform: hover ? "translateY(-3px)" : "translateY(0)",
          transition: "transform .45s cubic-bezier(0.16,1,0.3,1), box-shadow .45s ease",
        }}
      >
        <SnakeBorder active={hover} radius={11} duration={1.5} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 600, color: THEME.heading, fontSize: 12.5, lineHeight: 1.25 }}>
            {p.name}
          </div>
          <div style={{ display: "flex", gap: 6, flex: "0 0 auto" }}>
            {p.github && (
              <a href={p.github} target="_blank" rel="noreferrer" style={{ color: THEME.muted }}>
                <Github size={14} />
              </a>
            )}
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer" style={{ color: THEME.ice }}>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
        <p style={{ fontSize: 11.5, color: THEME.muted, marginTop: 5, lineHeight: 1.4 }}>{p.desc}</p>
      </div>
    </motion.div>
  );
}

/** Bio text with {name}/{role}/{location} filled and {company} rendered as the company link. */
function Bio({ text }: { text: string }) {
  const c = useContent();
  const parts = fillTokens(text.replace(/\{company\}/g, "\u0000"), c).split("\u0000");
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <a href={c.profile.companyUrl} target="_blank" rel="noreferrer" className="accent-link">
              {c.profile.company}
            </a>
          )}
        </span>
      ))}
    </>
  );
}

export default function About() {
  const c = useContent();
  const { profile: PERSON, personal, branding } = c;
  const t = c.text.about;
  return (
    <Section id="about" variant="fade">
      <Eyebrow icon={UserRound}>{t.eyebrow}</Eyebrow>
      <Heading>{t.heading}</Heading>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
        <motion.div
          variants={colFrom(-1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          style={{ flex: "1 1 340px" }}
        >
          <p style={{ fontSize: 16.5, color: THEME.text, lineHeight: 1.75 }}>
            <Bio text={t.bio} />
          </p>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 12 }}>
            {t.infoRows.map((row, i) => {
              const Icon = resolveIcon(row.icon) ?? Sparkles;
              return <Row key={i} icon={<Icon size={18} />} label={fillTokens(row.label, c)} />;
            })}
          </div>

          <h3 style={{ fontFamily: THEME.fontDisplay, color: THEME.heading, fontSize: 18, marginTop: 36, marginBottom: 14 }}>
            {t.hobbiesTitle}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {PERSON.hobbies.map((h) => (
              <HobbyChip key={h.label} hobby={h} />
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={colFrom(1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          style={{ flex: "1 1 420px", minWidth: 0 }}
        >
          <AboutPhotoFrame name={PERSON.name} url={branding.aboutImageUrl} />
          <h3 style={{ fontFamily: THEME.fontDisplay, color: THEME.heading, fontSize: 18, marginBottom: 14 }}>
            {t.personalProjectsTitle}
          </h3>
          <motion.div
            className="about-project-grid"
            variants={listStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
          >
            {personal.map((p) => (
              <PersonalCard key={p.id} p={p} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}
