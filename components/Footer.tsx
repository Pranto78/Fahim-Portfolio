"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { THEME } from "@/config/theme.config";
import { PERSON } from "@/data/person";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Footer() {
  const reduced = useReducedMotion();
  return (
    <footer style={{ padding: "60px 5vw 40px", borderTop: `1px solid ${THEME.border}`, marginTop: 40 }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <motion.div
            whileHover={reduced ? undefined : { y: -2, scale: 1.035 }}
            transition={{ type: "tween", duration: 0.4, ease: EASE }}
            style={{
              position: "relative",
              width: 48,
              height: 48,
              flexShrink: 0,
              overflow: "hidden",
              borderRadius: 14,
              border: `1px solid ${THEME.cyan}44`,
              boxShadow: `0 0 22px ${THEME.cyan}18`,
            }}
          >
            <Image
              src={PERSON.logo}
              alt="FSP brand logo"
              fill
              sizes="48px"
              style={{ objectFit: "cover" }}
            />
          </motion.div>
          <div>
            <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 20, color: THEME.heading }}>
              Let&apos;s build something.
            </div>
            <div style={{ fontSize: 14, color: THEME.muted, marginTop: 6 }}>
              {PERSON.email} · {PERSON.location}
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "30px auto 0", fontSize: 12.5, color: THEME.muted, fontFamily: THEME.fontMono }}>
        © {new Date().getFullYear()} {PERSON.name}. Built with Next.js.
      </div>
    </footer>
  );
}
