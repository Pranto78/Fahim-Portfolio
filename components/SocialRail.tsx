"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Facebook, Github, type LucideIcon } from "lucide-react";
import { THEME } from "@/config/theme.config";
import { PERSON } from "@/data/person";

type Social = { label: string; href: string; icon: LucideIcon; accent: string };

const SOCIALS: Social[] = [
  { label: "Instagram", href: PERSON.instagram, icon: Instagram, accent: "#E1306C" },
  { label: "LinkedIn", href: PERSON.linkedin, icon: Linkedin, accent: "#0A94E0" },
  { label: "Facebook", href: PERSON.facebook, icon: Facebook, accent: "#1877F2" },
  { label: "GitHub", href: PERSON.github, icon: Github, accent: THEME.text },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function SocialButton({ s }: { s: Social }) {
  const [hover, setHover] = useState(false);
  const Icon = s.icon;
  return (
    <motion.a
      href={s.href}
      target="_blank"
      rel="noreferrer"
      aria-label={s.label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      variants={{
        hidden: { opacity: 0, y: 14, scale: 0.8 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: EASE } },
      }}
      style={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: THEME.glass,
        backdropFilter: "blur(12px)",
        border: `1px solid ${hover ? s.accent : THEME.border}`,
        color: hover ? s.accent : THEME.muted,
        boxShadow: hover ? `0 0 18px ${s.accent}55` : "none",
        transform: hover ? "translateY(-3px)" : "translateY(0)",
        transition: "color .25s, border-color .25s, box-shadow .25s, transform .25s",
      }}
    >
      <Icon size={19} />
    </motion.a>
  );
}

export default function SocialRail() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {/* top connector line */}
      <div style={{ width: 2, height: 44, background: `linear-gradient(${THEME.cyan}, transparent)`, opacity: 0.5 }} />
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        {SOCIALS.map((s) => (
          <SocialButton key={s.label} s={s} />
        ))}
      </motion.div>
      {/* bottom connector line */}
      <div style={{ width: 2, height: 44, background: `linear-gradient(transparent, ${THEME.violet})`, opacity: 0.5 }} />
    </div>
  );
}
