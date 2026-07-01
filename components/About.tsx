"use client";
import { ReactNode } from "react";
import { Github, ExternalLink, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { THEME } from "@/config/theme.config";
import { PERSON, PERSONAL } from "@/data/person";
import { Section, Eyebrow, Heading } from "./ui";

function Row({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, color: THEME.text, fontSize: 15 }}>
      <span style={{ color: THEME.cyan }}>{icon}</span>
      {label}
    </div>
  );
}

export default function About() {
  return (
    <Section id="about">
      <Eyebrow>About</Eyebrow>
      <Heading>Who I am</Heading>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
        <div style={{ flex: "1 1 340px" }}>
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
        </div>

        <div style={{ flex: "1 1 340px" }}>
          <h3 style={{ fontFamily: THEME.fontDisplay, color: THEME.heading, fontSize: 18, marginBottom: 16 }}>
            Personal Projects
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PERSONAL.map((p) => (
              <div
                key={p.name}
                style={{
                  padding: 16,
                  borderRadius: 14,
                  background: THEME.bgSoft,
                  border: `1px solid ${THEME.border}`,
                }}
              >
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
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
