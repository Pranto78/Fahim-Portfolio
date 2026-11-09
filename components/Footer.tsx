"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { THEME } from "@/config/theme.config";
import { PERSON } from "@/data/person";
import logo from "@/asset/logo-f-sky-silver.png";

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
              background: THEME.bgSoft,
              border: `1px solid ${THEME.steel}66`,
              boxShadow: `0 2px 8px ${THEME.navy}99`,
            }}
          >
            <Image
              src={logo}
              alt="Fahim logo"
              fill
              sizes="48px"
              quality={90}
              style={{ objectFit: "contain", padding: 4 }}
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
