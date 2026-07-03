"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { THEME, GRAD } from "@/config/theme.config";
import { NAV } from "@/data/skills";
import { scrollToSection } from "@/lib/scrollToSection";
import Spaceship from "./Spaceship";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Navbar({ active }: { active: string }) {
  const [ship, setShip] = useState(false); // true → spaceship mode
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => setMounted(true), []);
  const lastY = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clusterRef = useRef<HTMLDivElement>(null);

  // Scroll direction feeds the ship's vertical lean + tilt (springy = "flying").
  const leanMV = useMotionValue(0);
  const tiltMV = useMotionValue(0);
  const lean = useSpring(leanMV, { stiffness: 120, damping: 18 });
  const tilt = useSpring(tiltMV, { stiffness: 120, damping: 18 });

  useEffect(() => {
    let ticking = false;
    lastY.current = window.scrollY;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        lastY.current = y;
        setShip(y > 90);
        if (!reduced) {
          const d = Math.max(-1, Math.min(1, delta / 10));
          leanMV.set(d * 14); // down when scrolling down, up when scrolling up
          tiltMV.set(d * 8);
          // ease back toward rest shortly after scrolling stops
          if (resetTimer.current) clearTimeout(resetTimer.current);
          resetTimer.current = setTimeout(() => {
            leanMV.set(0);
            tiltMV.set(0);
          }, 140);
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced, leanMV, tiltMV]);

  // Close menu on Escape / outside click.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (clusterRef.current && !clusterRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  // Collapse the menu whenever we morph back to the full navbar.
  useEffect(() => {
    if (!ship) setOpen(false);
  }, [ship]);

  const go = (id: string) => {
    scrollToSection(id);
    setOpen(false);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {!ship ? (
        /* ---------- NAVBAR MODE (hero / top) ---------- */
        <motion.nav
          key="bar"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 5vw",
          }}
        >
          <div
            onClick={() => go("hero")}
            style={{
              cursor: "pointer",
              fontFamily: THEME.fontDisplay,
              fontWeight: 700,
              fontSize: 18,
              color: THEME.heading,
              letterSpacing: 0.5,
            }}
          >
            FSP<span style={{ color: THEME.cyan }}>.</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                style={{
                  position: "relative",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 14px",
                  fontSize: 14,
                  fontFamily: THEME.fontBody,
                  color: active === n.id ? THEME.heading : THEME.muted,
                  transition: "color .2s",
                }}
              >
                {n.label}
                {active === n.id && (
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      right: 12,
                      bottom: 2,
                      height: 2,
                      background: GRAD,
                      borderRadius: 2,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.nav>
      ) : (
        /* ---------- SPACESHIP MODE (scrolled) — fixed top-right ---------- */
        <motion.div
          key="ship"
          ref={clusterRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.45, ease: EASE }}
          style={{
            position: "fixed",
            top: 18,
            right: "3vw",
            zIndex: 90,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 12,
          }}
        >
          <motion.div style={{ y: lean, rotate: tilt }}>
            <Spaceship open={open} onClick={() => setOpen((o) => !o)} />
          </motion.div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ duration: 0.28, ease: EASE }}
                style={{
                  transformOrigin: "top right",
                  minWidth: 180,
                  padding: 10,
                  borderRadius: 16,
                  background: THEME.glass,
                  backdropFilter: "blur(16px)",
                  border: `1px solid ${THEME.cyan}44`,
                  boxShadow: `0 12px 40px rgba(0,0,0,.5), 0 0 30px ${THEME.cyan}22`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {NAV.map((n, i) => (
                  <motion.button
                    key={n.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.28, ease: EASE }}
                    onClick={() => go(n.id)}
                    style={{
                      position: "relative",
                      textAlign: "left",
                      background: active === n.id ? `${THEME.cyan}14` : "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "10px 14px",
                      borderRadius: 10,
                      fontSize: 14,
                      fontFamily: THEME.fontBody,
                      color: active === n.id ? THEME.heading : THEME.muted,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: active === n.id ? GRAD : THEME.border,
                        boxShadow: active === n.id ? `0 0 8px ${THEME.cyan}` : "none",
                      }}
                    />
                    {n.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
