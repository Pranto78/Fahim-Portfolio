"use client";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { THEME } from "@/config/theme.config";
import { PERSON } from "@/data/person";

export default function Footer() {
  const links = [
    { icon: <Github size={20} />, href: PERSON.github },
    { icon: <Linkedin size={20} />, href: PERSON.linkedin },
    { icon: <Mail size={20} />, href: `mailto:${PERSON.email}` },
    { icon: <Phone size={20} />, href: `tel:${PERSON.phone}` },
  ];
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
        <div>
          <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 20, color: THEME.heading }}>
            Let&apos;s build something.
          </div>
          <div style={{ fontSize: 14, color: THEME.muted, marginTop: 6 }}>
            {PERSON.email} · {PERSON.location}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {links.map((l, i) => (
            <a
              key={i}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                display: "grid",
                placeItems: "center",
                background: THEME.bgSoft,
                border: `1px solid ${THEME.border}`,
                color: THEME.text,
              }}
            >
              {l.icon}
            </a>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "30px auto 0", fontSize: 12.5, color: THEME.muted, fontFamily: THEME.fontMono }}>
        © {new Date().getFullYear()} {PERSON.name}. Built with Next.js.
      </div>
    </footer>
  );
}
