"use client";
import { ReactNode, CSSProperties } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { THEME, GRAD } from "@/config/theme.config";

export type RevealVariant = "fade" | "left" | "right" | "zoom" | "flip";

// Smooth easeOut curve; reveals ride the GPU compositor (transform + opacity
// only — no filter/blur, which repaints every frame and causes jank).
const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = 1.05;

// Distinct entrance per section so the page reads as a sequence of motions,
// not one repeated lift. `show` is shared; `hidden` differs per variant.
const HIDDEN: Record<RevealVariant, Record<string, number>> = {
  fade: { opacity: 0, y: 40 },
  left: { opacity: 0, x: -70, rotateY: 12 },
  right: { opacity: 0, x: 70, rotateY: -12 },
  zoom: { opacity: 0, scale: 0.9 },
  flip: { opacity: 0, y: 48, rotateX: 26 },
};

const SHOW = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  rotateX: 0,
  rotateY: 0,
};

export function Section({
  id,
  children,
  style,
  variant = "fade",
}: {
  id: string;
  children: ReactNode;
  style?: CSSProperties;
  variant?: RevealVariant;
}) {
  const reduced = useReducedMotion();

  const variants: Variants = {
    hidden: reduced ? { opacity: 0 } : HIDDEN[variant],
    show: reduced
      ? { opacity: 1, transition: { duration: 0.3 } }
      : { ...SHOW, transition: { duration: DURATION, ease: EASE } },
  };

  return (
    <div style={{ perspective: 1200 }}>
      <motion.section
        id={id}
        variants={variants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
        style={{
          padding: "80px 5vw",
          maxWidth: 1200,
          margin: "0 auto",
          transformStyle: "preserve-3d",
          transformOrigin: "center bottom",
          ...style,
        }}
      >
        {children}
      </motion.section>
    </div>
  );
}

export function Eyebrow({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.6 }}
      transition={{ duration: 0.5 }}
      style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 18 }}
    >
      {/* animated icon chip */}
      <div
        style={{
          position: "relative",
          width: 34,
          height: 34,
          flexShrink: 0,
          animation: reduced ? undefined : "badgeFloat 3.6s ease-in-out infinite",
        }}
      >
        {/* matte icon chip — tonal fill, no glow */}
        <div
          style={{
            position: "relative",
            width: 34,
            height: 34,
            borderRadius: 10,
            display: "grid",
            placeItems: "center",
            background: `linear-gradient(135deg, ${THEME.deep}66, ${THEME.navy}cc)`,
            border: `1px solid ${THEME.steel}66`,
            boxShadow: `inset 0 1px 0 ${THEME.snow}14, 0 2px 6px ${THEME.navy}88`,
          }}
        >
          <Icon size={17} color={THEME.ice} />
        </div>
      </div>

      {/* refined label */}
      <span
        style={{
          fontFamily: THEME.fontMono,
          fontSize: 13,
          letterSpacing: 3,
          textTransform: "uppercase",
          background: GRAD,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {children}
      </span>
    </motion.div>
  );
}

export function Heading({ children }: { children: ReactNode }) {
  const words = typeof children === "string" ? children.split(" ") : null;
  return (
    <h2
      style={{
        fontFamily: THEME.fontDisplay,
        fontSize: "clamp(28px,4vw,44px)",
        fontWeight: 700,
        color: THEME.heading,
        margin: "0 0 28px",
        letterSpacing: -0.5,
        display: "flex",
        flexWrap: "wrap",
        gap: "0 0.28em",
      }}
    >
      {words
        ? words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 18, rotateX: 40 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              style={{ display: "inline-block" }}
            >
              {word}
            </motion.span>
          ))
        : children}
    </h2>
  );
}

export { GRAD };
