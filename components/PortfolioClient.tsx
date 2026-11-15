"use client";
import { useState, useEffect } from "react";
import { THEME, SPACE, applyTheme } from "@/config/theme.config";
import type { PublicContent } from "@/lib/content/types";
import { ContentProvider } from "@/components/ContentProvider";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingBot from "@/components/FloatingBot";
import Background from "@/components/Background";

// The whole page, rendered on the client. Content comes from app/page.tsx (server: DB → fallback).
export default function PortfolioClient({ content }: { content: PublicContent }) {
  applyTheme(content.theme); // before the THEME reads below
  const nav = content.text.nav;
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    if (loading) return;
    const ob = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    nav.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) ob.observe(el);
    });
    return () => ob.disconnect();
  }, [loading, nav]);

  return (
    <ContentProvider content={content}>
    <div
      style={{
        background: SPACE.bg,
        color: THEME.text,
        fontFamily: THEME.fontBody,
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* animated canvas background */}
      <Background />

      {loading && <Loader onDone={() => setLoading(false)} />}
      {!loading && (
        <div style={{ position: "relative", zIndex: 1 }}>
          <ScrollProgress />
          <Navbar active={active} />
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Education />
          <Contact />
          <Footer />
          <FloatingBot />
        </div>
      )}
    </div>
    </ContentProvider>
  );
}
