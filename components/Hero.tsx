"use client";
import { useEffect, useState } from "react";
import { FileText, MapPin } from "lucide-react";
import { BsOpenai } from "react-icons/bs";
import { SiClaude, SiGooglegemini, SiPerplexity } from "react-icons/si";
import { THEME, GRAD } from "@/config/theme.config";
import { PERSON } from "@/data/person";
import { scrollToSection } from "@/lib/scrollToSection";
import { useTypewriterCycle } from "@/lib/useTypewriter";
import { Section } from "./ui";
import SocialRail from "./SocialRail";
import OrbitalPortal from "./OrbitalPortal";

const GREETING_INTRO_PHRASES = ["Hello, I'm Fahim", "Nice to meet you", "Welcome to my web"];
const DIRECT_INTRO_PHRASES = ["I'm Fahim", "Nice to meet you", "Welcome to my web"];

function getLocalGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good morning,";
  if (hour >= 12 && hour < 17) return "Good afternoon,";
  if (hour >= 17 && hour < 21) return "Good evening,";
  return "";
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function renderTypedIntro(text: string) {
  const namePrefix = ["Hello, I'm ", "I'm "].find((prefix) => text.startsWith(prefix));

  if (!namePrefix || text.length <= namePrefix.length) return text;

  return (
    <>
      {text.slice(0, namePrefix.length)}
      <span className="hero-typed-gradient">{text.slice(namePrefix.length)}</span>
    </>
  );
}

function AiLogoSlot({ className = "" }: { className?: string }) {
  return (
    <span className={`hero-ai-logo-slot ${className}`} aria-hidden>
      <span className="hero-ai-logo-mark hero-ai-logo-claude">
        <SiClaude />
      </span>
      <span className="hero-ai-logo-mark hero-ai-logo-gpt">
        <BsOpenai />
      </span>
      <span className="hero-ai-logo-mark hero-ai-logo-gemini">
        <SiGooglegemini />
      </span>
      <span className="hero-ai-logo-mark hero-ai-logo-perplexity">
        <SiPerplexity />
      </span>
    </span>
  );
}

export default function Hero() {
  const [greeting, setGreeting] = useState<string | null>(null);
  const [typedGreeting, setTypedGreeting] = useState("");
  const [greetingDone, setGreetingDone] = useState(false);
  const introPhrases = greeting ? GREETING_INTRO_PHRASES : DIRECT_INTRO_PHRASES;
  const typedIntro = useTypewriterCycle(introPhrases, {
    typeSpeed: 110,
    deleteSpeed: 60,
    hold: 2600,
    enabled: greeting !== null,
  });

  useEffect(() => {
    setGreeting(getLocalGreeting());
  }, []);

  useEffect(() => {
    if (greeting === null) return;

    if (!greeting) {
      setTypedGreeting("");
      setGreetingDone(true);
      return;
    }

    if (prefersReducedMotion()) {
      setTypedGreeting(greeting);
      setGreetingDone(true);
      return;
    }

    setTypedGreeting("");
    setGreetingDone(false);
    let index = 0;
    let timer: ReturnType<typeof setTimeout>;

    const typeNext = () => {
      index += 1;
      setTypedGreeting(greeting.slice(0, index));

      if (index >= greeting.length) {
        timer = setTimeout(() => setGreetingDone(true), 380);
        return;
      }

      const cadence = 82 + (index % 4) * 9;
      timer = setTimeout(typeNext, cadence);
    };

    timer = setTimeout(typeNext, 110);
    return () => clearTimeout(timer);
  }, [greeting]);

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
          <div className="hero-status-card" aria-label={`Available in ${PERSON.location}`}>
            <span className="hero-status-dot" />
            <span>Available</span>
            <span className="hero-status-divider" />
            <MapPin size={14} />
            <span>{PERSON.location}</span>
          </div>
          <div className="hero-intro-wrap">
            <div className="hero-ai-logos" aria-hidden>
              <AiLogoSlot />
              <AiLogoSlot className="is-main" />
            </div>
            <h1 className="hero-title">
              {greeting && (
                <span className="hero-greeting">
                  {typedGreeting}
                  {!greetingDone && <span className="hero-caret hero-caret-small" aria-hidden />}
                </span>
              )}
              <span className="hero-title-line">
                <span className="hero-typed">{renderTypedIntro(typedIntro)}</span>
                {greeting !== null && <span className="hero-caret" aria-hidden />}
              </span>
            </h1>
          </div>
          <p style={{ fontSize: 19, color: THEME.text, marginTop: 10, fontFamily: THEME.fontBody }}>
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
