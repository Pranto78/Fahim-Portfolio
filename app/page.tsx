"use client";
import { useState, useEffect } from "react";
import { THEME } from "@/config/theme.config";
import { NAV } from "@/data/skills";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Footer from "@/components/Footer";
import FloatingBot from "@/components/FloatingBot";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    if (loading) return;
    const ob = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) ob.observe(el);
    });
    return () => ob.disconnect();
  }, [loading]);

  return (
    <div
      style={{
        background: THEME.bg,
        color: THEME.text,
        fontFamily: THEME.fontBody,
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* ambient gradient blobs */}
      <div
        style={{
          position: "fixed",
          top: "-10%",
          left: "-5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: THEME.cyan,
          opacity: 0.06,
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-10%",
          right: "-5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: THEME.violet,
          opacity: 0.07,
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      {loading && <Loader onDone={() => setLoading(false)} />}
      {!loading && (
        <>
          <Navbar active={active} />
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Education />
          <Footer />
          <FloatingBot />
        </>
      )}
    </div>
  );
}
