"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { THEME, GRAD } from "@/config/theme.config";

/**
 * Thin gradient bar pinned to the top of the viewport that fills as the page
 * scrolls — a read-progress indicator in the site's cyan → violet palette.
 */
export default function ScrollProgress() {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  useEffect(() => setMounted(true), []);

  // Spring-smoothed so the fill glides instead of snapping frame-to-frame.
  // Reduced motion collapses the spring to a near-instant follow.
  const progress = useSpring(
    scrollYProgress,
    reduced
      ? { stiffness: 1000, damping: 100, restDelta: 0.0001 }
      : { stiffness: 140, damping: 26, restDelta: 0.001 }
  );

  // Fade the whole bar in once the page leaves the hero, so the top of the
  // site stays clean.
  const opacity = useTransform(progress, [0, 0.012], [0, 1]);
  const headLeft = useTransform(progress, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      aria-hidden
      style={{
        opacity,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 100,
        pointerEvents: "none",
        background: "rgba(255,255,255,0.05)",
      }}
    >
      <motion.div
        style={{
          scaleX: progress,
          transformOrigin: "0% 50%",
          height: "100%",
          width: "100%",
          background: GRAD,
          boxShadow: `0 0 12px ${THEME.cyan}88, 0 0 26px ${THEME.violet}55`,
        }}
      />
      {/* glowing head that rides the leading edge */}
      <motion.span
        style={{
          left: headLeft,
          position: "absolute",
          top: "50%",
          translateX: "-50%",
          translateY: "-50%",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: THEME.cyan,
          boxShadow: `0 0 10px ${THEME.cyan}, 0 0 22px ${THEME.violet}`,
        }}
      />
    </motion.div>,
    document.body
  );
}
