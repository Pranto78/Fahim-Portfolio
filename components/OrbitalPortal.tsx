"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { THEME } from "@/config/theme.config";

type OrbitalPortalProps = {
  photoSrc?: string;
  photoAlt?: string;
  className?: string;
};

type Orbit = {
  rx: number;
  ry: number;
};

type Planet = {
  key: string;
  name: string;
  orbit: number;
  angle: number;
  size: number;
  base: string;
  dark: string;
  glow: string;
  icon: ReactNode;
};

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacityStart: number;
  opacityEnd: number;
};

const STAGE_W = 900;
const STAGE_H = 720;
const CX = 450;
const CY = 360;

const ORBITS: Orbit[] = [
  { rx: 250, ry: 132 },
  { rx: 330, ry: 168 },
  { rx: 412, ry: 206 },
];

const ORBIT_LINE = "rgba(210, 218, 232, 0.72)";

const SPEED = [6.4, 5.1, 4.1];

function ReactLogo() {
  return (
    <svg viewBox="-11 -11 22 22" aria-hidden>
      <g fill="none" stroke="#0a1a24" strokeWidth="1">
        <circle r="2" fill="#0a1a24" stroke="none" />
        <ellipse rx="10" ry="4.2" />
        <ellipse rx="10" ry="4.2" transform="rotate(60)" />
        <ellipse rx="10" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function NextLogo() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="62"
        fill="#ffffff"
      >
        N
      </text>
    </svg>
  );
}

function TypeScriptLogo() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <text
        x="52"
        y="54"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="46"
        fill="#ffffff"
      >
        TS
      </text>
    </svg>
  );
}

function JavaScriptLogo() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <text
        x="52"
        y="56"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="46"
        fill="#111111"
      >
        JS
      </text>
    </svg>
  );
}

function MongoLogo() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path
        d="M50 8c8 16 20 22 20 42 0 22-13 33-18 38l-2 4-2-4C43 83 30 72 30 50 30 30 42 24 50 8z"
        fill="#0b1d12"
      />
      <path d="M50 12v78" stroke="#7fe0a8" strokeWidth="2.4" fill="none" />
    </svg>
  );
}

function NodeLogo() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path
        d="M50 10 84 30v40L50 90 16 70V30z"
        fill="none"
        stroke="#0e2410"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="24"
        fill="#0e2410"
      >
        JS
      </text>
    </svg>
  );
}

const PLANETS: Planet[] = [
  { key: "react", name: "React", orbit: 0, angle: 18, size: 60, base: "#7fe9ff", dark: "#0f5c78", glow: "#61dafb", icon: <ReactLogo /> },
  { key: "node", name: "Node.js", orbit: 0, angle: 205, size: 56, base: "#a9e46b", dark: "#2f5d18", glow: "#83cd29", icon: <NodeLogo /> },
  { key: "ts", name: "TypeScript", orbit: 1, angle: 132, size: 58, base: "#5aa2f2", dark: "#1c4c86", glow: "#3178c6", icon: <TypeScriptLogo /> },
  { key: "js", name: "JavaScript", orbit: 1, angle: 322, size: 56, base: "#ffe14d", dark: "#a08a00", glow: "#f7df1e", icon: <JavaScriptLogo /> },
  { key: "next", name: "Next.js", orbit: 2, angle: 60, size: 60, base: "#3a3f4c", dark: "#05070c", glow: "#8892a6", icon: <NextLogo /> },
  { key: "mongo", name: "MongoDB", orbit: 2, angle: 248, size: 58, base: "#5fd98a", dark: "#0d4a24", glow: "#00ed64", icon: <MongoLogo /> },
];

function halfPath(rx: number, ry: number, from: number, to: number) {
  const steps = 90;
  let path = "";

  for (let i = 0; i <= steps; i += 1) {
    const t = ((from + ((to - from) * i) / steps) * Math.PI) / 180;
    const x = CX + rx * Math.cos(t);
    const y = CY + ry * Math.sin(t);
    path += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }

  return path;
}

function makeStars(count: number) {
  let seed = 19373;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  return Array.from({ length: count }, (_, id) => ({
    id,
    x: next() * 100,
    y: next() * 100,
    size: 0.4 + next() * 1.8,
    delay: next() * -4,
    duration: 2 + next() * 4,
    opacityStart: next() * 0.2,
    opacityEnd: 0.5 + next() * 0.5,
  }));
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function planetFrame(planet: Planet, seconds: number, freeze: boolean) {
  const orbit = ORBITS[planet.orbit];
  const degree = planet.angle + (freeze ? 0 : seconds * SPEED[planet.orbit]);
  const t = (degree * Math.PI) / 180;
  const depth = (Math.sin(t) + 1) / 2;

  return {
    x: CX + orbit.rx * Math.cos(t),
    y: CY + orbit.ry * Math.sin(t),
    scale: 0.78 + depth * 0.34,
    opacity: 0.55 + depth * 0.45,
    zIndex: Math.sin(t) >= 0 ? 7 : 3,
  };
}

function planetStyle(planet: Planet, seconds: number, freeze: boolean) {
  const frame = planetFrame(planet, seconds, freeze);

  return {
    zIndex: frame.zIndex,
    opacity: frame.opacity,
    transform: `translate3d(${frame.x}px, ${frame.y}px, 0) translate(-50%, -50%) scale(${frame.scale})`,
  };
}

export default function OrbitalPortal({
  photoSrc,
  photoAlt = "Portfolio owner photo",
  className,
}: OrbitalPortalProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const planetRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const planetLayerRefs = useRef<Record<string, number>>({});
  const reduced = useReducedMotion();
  const [scale, setScale] = useState(0.62);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(makeStars(72));
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const update = () => {
      const rect = root.getBoundingClientRect();
      setScale(Math.min(rect.width / STAGE_W, rect.height / STAGE_H));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const renderPlanets = (seconds: number, freeze: boolean) => {
      PLANETS.forEach((planet) => {
        const el = planetRefs.current[planet.key];
        if (!el) return;

        const frame = planetFrame(planet, seconds, freeze);
        el.style.transform = `translate3d(${frame.x}px, ${frame.y}px, 0) translate(-50%, -50%) scale(${frame.scale})`;
        el.style.opacity = String(frame.opacity);

        if (planetLayerRefs.current[planet.key] !== frame.zIndex) {
          planetLayerRefs.current[planet.key] = frame.zIndex;
          el.style.zIndex = String(frame.zIndex);
        }
      });
    };

    if (reduced) {
      renderPlanets(0, true);
      return;
    }

    startRef.current = performance.now();
    const tick = (now: number) => {
      renderPlanets((now - startRef.current) / 1000, false);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={`orbital-portal ${className ?? ""}`}
      onMouseMove={(event) => {
        if (reduced) return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          "--portal-bg-x",
          `${((event.clientX - rect.left) / rect.width - 0.5) * 22}px`
        );
        event.currentTarget.style.setProperty(
          "--portal-bg-y",
          `${((event.clientY - rect.top) / rect.height - 0.5) * 22}px`
        );
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.setProperty("--portal-bg-x", "0px");
        event.currentTarget.style.setProperty("--portal-bg-y", "0px");
      }}
    >
      <div
        className="portal-stage"
        style={
          {
            "--portal-scale": scale,
          } as CSSProperties
        }
      >
        <div className="portal-scene">
          <div className="portal-stars" aria-hidden>
            {stars.map((star) => (
              <span
                key={star.id}
                className="portal-star"
                style={
                  {
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: star.size,
                    height: star.size,
                    opacity: star.opacityEnd * 0.72,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <svg className="portal-orbits portal-orbits-back" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} aria-hidden>
            {ORBITS.map((orbit) => (
              <path
                key={`${orbit.rx}-back`}
                d={halfPath(orbit.rx, orbit.ry, 180, 360)}
                stroke={ORBIT_LINE}
                strokeWidth="1.4"
                opacity="0.22"
              />
            ))}
          </svg>

          <div className="portal-card">
            <div className="portal-card-frame" />
            <div className="portal-card-inner">
              <div className="portal-card-grid" aria-hidden />
              <div className="portal-card-scan" aria-hidden />
              {photoSrc ? (
                <img className="portal-photo" src={photoSrc} alt={photoAlt} loading="eager" />
              ) : (
                <div className="portal-placeholder">your photo here</div>
              )}
              <span className="portal-corner portal-corner-tl" />
              <span className="portal-corner portal-corner-tr" />
              <span className="portal-corner portal-corner-bl" />
              <span className="portal-corner portal-corner-br" />
            </div>
          </div>

          <svg className="portal-orbits portal-orbits-front" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} aria-hidden>
            {ORBITS.map((orbit) => (
              <path
                key={`${orbit.rx}-front`}
                d={halfPath(orbit.rx, orbit.ry, 0, 180)}
                stroke={ORBIT_LINE}
                strokeWidth="1.8"
                opacity="0.62"
              />
            ))}
          </svg>

          {PLANETS.map((planet) => (
            <div
              key={planet.key}
              ref={(node) => {
                planetRefs.current[planet.key] = node;
              }}
              className="portal-planet"
              style={planetStyle(planet, 0, true)}
            >
              <div
                className="portal-ball"
                style={
                  {
                    width: planet.size,
                    height: planet.size,
                    "--planet-base": planet.base,
                    "--planet-dark": planet.dark,
                    "--planet-glow": planet.glow,
                  } as CSSProperties
                }
              >
                {planet.icon}
              </div>
              <div className="portal-label">{planet.name}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .orbital-portal {
          --portal-bg-x: 0px;
          --portal-bg-y: 0px;
          width: clamp(440px, 42vw, 690px);
          max-width: 94vw;
          aspect-ratio: ${STAGE_W} / ${STAGE_H};
          position: relative;
          isolation: isolate;
          contain: layout paint;
          overflow: visible;
        }

        .portal-stage {
          position: absolute;
          left: 50%;
          top: 50%;
          width: ${STAGE_W}px;
          height: ${STAGE_H}px;
          transform: translate(-50%, -50%) scale(var(--portal-scale));
          transform-origin: center;
        }

        .portal-scene,
        .portal-stars,
        .portal-orbits {
          position: absolute;
          inset: 0;
        }

        .portal-scene {
          z-index: 1;
          contain: layout paint;
        }

        .portal-stars {
          z-index: 1;
          inset: -10%;
          transform: translate3d(var(--portal-bg-x, 0px), var(--portal-bg-y, 0px), 0);
          transition: transform 0.18s ease-out;
        }

        .portal-star {
          position: absolute;
          border-radius: 50%;
          background: #dfe9ff;
        }

        .portal-orbits {
          width: ${STAGE_W}px;
          height: ${STAGE_H}px;
          overflow: visible;
          pointer-events: none;
        }

        .portal-orbits path {
          fill: none;
          stroke-linecap: round;
        }

        .portal-orbits-back {
          z-index: 2;
        }

        .portal-orbits-front {
          z-index: 6;
        }

        .portal-card {
          position: absolute;
          z-index: 5;
          left: 300px;
          top: 160px;
          width: 300px;
          height: 400px;
          border-radius: 30px;
        }

        .portal-card-frame {
          position: absolute;
          inset: 0;
          border-radius: 30px;
          padding: 2px;
          background: linear-gradient(150deg, ${THEME.cyan}, #4b7bf0 40%, ${THEME.violet} 70%, #a855f7);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }

        .portal-card-inner {
          position: absolute;
          inset: 2px;
          border-radius: 28px;
          overflow: hidden;
          display: grid;
          place-items: center;
          background:
            radial-gradient(120% 90% at 50% 18%, #171e3e 0%, #0b1022 55%, #080b18 100%),
            ${THEME.bgSoft};
          box-shadow: inset 0 0 60px rgba(80, 120, 255, 0.1), inset 0 0 2px rgba(120, 180, 255, 0.3);
        }

        .portal-card-grid {
          position: absolute;
          inset: 0;
          opacity: 0.14;
          background-image:
            linear-gradient(rgba(120, 170, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120, 170, 255, 0.5) 1px, transparent 1px);
          background-size: 26px 26px;
          -webkit-mask: radial-gradient(70% 60% at 50% 45%, #000, transparent 78%);
          mask: radial-gradient(70% 60% at 50% 45%, #000, transparent 78%);
        }

        .portal-card-scan {
          position: absolute;
          left: 0;
          right: 0;
          height: 38%;
          z-index: 1;
          background: linear-gradient(180deg, transparent, rgba(90, 150, 255, 0.1), transparent);
          opacity: 0.28;
        }

        .portal-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 2;
        }

        .portal-placeholder {
          position: relative;
          z-index: 2;
          color: #7f8bb0;
          letter-spacing: 0.42em;
          font: 500 13px/1 ${THEME.fontMono};
          text-transform: lowercase;
          text-indent: 0.42em;
          text-shadow: 0 0 18px rgba(90, 140, 255, 0.35);
          white-space: nowrap;
        }

        .portal-corner {
          position: absolute;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(120, 180, 255, 0.55);
          z-index: 3;
          pointer-events: none;
        }

        .portal-corner-tl {
          top: 12px;
          left: 12px;
          border-right: 0;
          border-bottom: 0;
          border-radius: 6px 0 0;
        }

        .portal-corner-tr {
          top: 12px;
          right: 12px;
          border-left: 0;
          border-bottom: 0;
          border-radius: 0 6px 0 0;
        }

        .portal-corner-bl {
          bottom: 12px;
          left: 12px;
          border-right: 0;
          border-top: 0;
          border-radius: 0 0 0 6px;
        }

        .portal-corner-br {
          right: 12px;
          bottom: 12px;
          border-left: 0;
          border-top: 0;
          border-radius: 0 0 6px;
        }

        .portal-planet {
          position: absolute;
          left: 0;
          top: 0;
          will-change: transform, opacity;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        .portal-ball {
          position: relative;
          border-radius: 50%;
          display: grid;
          place-items: center;
          isolation: isolate;
          overflow: hidden;
          background: radial-gradient(circle at 34% 30%, var(--planet-base), var(--planet-dark) 78%);
          box-shadow:
            inset -6px -8px 16px rgba(0, 0, 0, 0.55),
            inset 5px 6px 12px rgba(255, 255, 255, 0.28),
            0 0 18px color-mix(in srgb, var(--planet-glow) 34%, transparent),
            0 0 34px color-mix(in srgb, var(--planet-glow) 16%, transparent);
        }

        .portal-ball::after {
          content: "";
          position: absolute;
          top: 14%;
          left: 20%;
          width: 34%;
          height: 26%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), transparent 70%);
          filter: blur(1px);
          opacity: 0.85;
          pointer-events: none;
        }

        .portal-ball :global(svg) {
          position: relative;
          z-index: 2;
          width: 56%;
          height: 56%;
        }

        .portal-label {
          position: absolute;
          left: 50%;
          top: calc(100% + 6px);
          transform: translateX(-50%);
          color: #aeb9dc;
          font-size: 10px;
          letter-spacing: 0.12em;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.25s;
          text-shadow: 0 1px 6px #000;
        }

        .portal-planet:hover .portal-label {
          opacity: 1;
        }

        @keyframes portalSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 680px) {
          .orbital-portal {
            width: min(94vw, 430px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .portal-stars {
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
