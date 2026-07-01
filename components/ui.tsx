"use client";
import { useRef, useState, useEffect, ReactNode, CSSProperties } from "react";
import { THEME, GRAD } from "@/config/theme.config";

export function Section({
  id,
  children,
  style,
}: {
  id: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVis(true),
      { threshold: 0.12 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  return (
    <section
      id={id}
      ref={ref}
      style={{
        padding: "110px 5vw",
        maxWidth: 1200,
        margin: "0 auto",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(36px)",
        transition: "opacity .7s ease, transform .7s ease",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: THEME.fontMono,
        fontSize: 12,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: THEME.cyan,
        marginBottom: 14,
      }}
    >
      <span style={{ opacity: 0.6 }}>{"// "}</span>
      {children}
    </div>
  );
}

export function Heading({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: THEME.fontDisplay,
        fontSize: "clamp(28px,4vw,44px)",
        fontWeight: 700,
        color: THEME.heading,
        margin: "0 0 28px",
        letterSpacing: -0.5,
      }}
    >
      {children}
    </h2>
  );
}

export { GRAD };
