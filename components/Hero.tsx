"use client";
import { FileText } from "lucide-react";
import { THEME, GRAD } from "@/config/theme.config";
import { PERSON } from "@/data/person";
import { scrollToSection } from "@/lib/scrollToSection";
import { Section } from "./ui";
import SocialRail from "./SocialRail";
import OrbitalPortal from "./OrbitalPortal";

export default function Hero() {
  return (
    <Section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: 140,
        maxWidth: 1560,
        position: "relative",
      }}
    >
      <div className="hero-content">
        <div className="hero-copy">
          <div style={{ fontFamily: THEME.fontMono, fontSize: 13, color: THEME.green, marginBottom: 18 }}>
            ● Available · {PERSON.location}
          </div>
          <h1
            style={{
              fontFamily: THEME.fontDisplay,
              fontSize: "clamp(40px,5.2vw,68px)",
              fontWeight: 700,
              lineHeight: 1.02,
              color: THEME.heading,
              margin: 0,
              letterSpacing: -1.5,
            }}
          >
            MD. Fahim
            <br />
            Shahriyar{" "}
            <span
              style={{
                background: GRAD,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Pranto
            </span>
          </h1>
          <p style={{ fontSize: 19, color: THEME.text, marginTop: 22, fontFamily: THEME.fontBody }}>
            {PERSON.role} <span style={{ color: THEME.muted }}>@</span>{" "}
            <a href={PERSON.companyUrl} target="_blank" rel="noreferrer" style={{ color: THEME.cyan, textDecoration: "none" }}>
              Octopi Digital
            </a>
          </p>
          <p style={{ fontSize: 15.5, color: THEME.muted, marginTop: 12, maxWidth: 480, lineHeight: 1.6 }}>
            I build web &amp; mobile products end-to-end — React, React Native and Node — from CRM
            platforms to telehealth and AI wellness apps.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
            <button
              onClick={() => scrollToSection("projects")}
              style={{
                padding: "13px 24px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: GRAD,
                color: "#06080C",
                fontWeight: 600,
                fontSize: 15,
                fontFamily: THEME.fontBody,
              }}
            >
              View Projects
            </button>
            <a
              href={PERSON.cv}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "13px 24px",
                borderRadius: 12,
                cursor: "pointer",
                textDecoration: "none",
                background: "transparent",
                color: THEME.text,
                fontWeight: 600,
                fontSize: 15,
                border: `1px solid ${THEME.border}`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FileText size={18} /> View CV
            </a>
          </div>
        </div>

        <div className="hero-social social-rail">
          <SocialRail />
        </div>

        <div className="hero-visual">
          <OrbitalPortal photoAlt={PERSON.name} />
        </div>
      </div>
    </Section>
  );
}
