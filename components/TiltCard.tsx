"use client";
import { CSSProperties, ReactNode, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

/**
 * Reusable 3D tilt wrapper. Maps cursor position over the card to rotateX/rotateY
 * with perspective, driven by springs for a smooth feel. Optional glare highlight.
 * Respects prefers-reduced-motion (renders a plain div, no tilt).
 */
export default function TiltCard({
  children,
  className,
  style,
  max = 10,
  scale = 1.02,
  glare = true,
  motionPreset = "default",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  max?: number;
  scale?: number;
  glare?: boolean;
  motionPreset?: "default" | "calm";
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const calm = motionPreset === "calm";

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const spring = calm
    ? { stiffness: 80, damping: 26, mass: 1.1 }
    : { stiffness: 150, damping: 22, mass: 1 };
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);

  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || reduced) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function reset() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      whileHover={{ scale }}
      transition={
        calm
          ? { type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          : { type: "tween", duration: 0.18, ease: "easeOut" }
      }
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
        position: "relative",
        ...style,
      }}
      className={className}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            opacity: 0,
            background: useTransform(
              [glareX, glareY],
              ([x, y]) =>
                `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.14), transparent 45%)`
            ),
          }}
          whileHover={{ opacity: 1 }}
          transition={
            calm
              ? { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
              : undefined
          }
        />
      )}
    </motion.div>
  );
}
