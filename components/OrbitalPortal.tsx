"use client";

import Image, { type StaticImageData } from "next/image";
import { CSSProperties, ReactNode, useEffect, useId, useRef, useState } from "react";
import { THEME } from "@/config/theme.config";

type OrbitalPortalProps = {
  photoSrc?: StaticImageData | string;
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
  opacity: number;
  group: number;
};

/* ---------- Stage geometry (design units; the stage is laid out at real pixels via --s) ---------- */

const STAGE_W = 900;
const STAGE_H = 720;
const CX = STAGE_W / 2;
const CY = STAGE_H / 2;

// Photo frame — bigger than before (was 390 x 460).
const CARD_W = 430;
const CARD_H = 560;
const CARD_X = (STAGE_W - CARD_W) / 2;
const CARD_Y = (STAGE_H - CARD_H) / 2;

const pct = (value: number, total: number) => `${((value / total) * 100).toFixed(4)}%`;

// Outer orbit + planet radius must stay inside the stage (root uses paint containment).
const ORBITS: Orbit[] = [
  { rx: 266, ry: 128 },
  { rx: 340, ry: 166 },
  { rx: 410, ry: 202 },
];

// Degrees per second for each orbit (inner orbits move a little faster).
const SPEED = [7.2, 5.6, 4.4];

// Planets are rasterised at their largest on-screen size and only ever scaled DOWN,
// so the GPU never upscales a bitmap (which is what makes things look soft).
const DEPTH_MAX = 1.12;
const DEPTH_MIN = 0.74;

// Parallax strength in design units.
const PARALLAX_STARS = 18;
const PARALLAX_ORBITS = 7;
const PARALLAX_AURA = 10;

const STAR_GROUPS = 3;

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

function TextLogo({ text, size, fill, y = 54 }: { text: string; size: number; fill: string; y?: number }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <text
        x="51"
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize={size}
        fill={fill}
      >
        {text}
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
  { key: "ts", name: "TypeScript", orbit: 1, angle: 132, size: 58, base: "#5aa2f2", dark: "#1c4c86", glow: "#3178c6", icon: <TextLogo text="TS" size={46} fill="#ffffff" /> },
  { key: "js", name: "JavaScript", orbit: 1, angle: 322, size: 56, base: "#ffe14d", dark: "#a08a00", glow: "#f7df1e", icon: <TextLogo text="JS" size={46} fill="#111111" y={56} /> },
  { key: "next", name: "Next.js", orbit: 2, angle: 60, size: 60, base: "#3a3f4c", dark: "#05070c", glow: "#8892a6", icon: <TextLogo text="N" size={62} fill="#ffffff" y={50} /> },
  { key: "mongo", name: "MongoDB", orbit: 2, angle: 248, size: 58, base: "#5fd98a", dark: "#0d4a24", glow: "#00ed64", icon: <MongoLogo /> },
];

function halfPath(rx: number, ry: number, from: number, to: number) {
  const steps = 96;
  let path = "";

  for (let i = 0; i <= steps; i += 1) {
    const t = ((from + ((to - from) * i) / steps) * Math.PI) / 180;
    const x = CX + rx * Math.cos(t);
    const y = CY + ry * Math.sin(t);
    path += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }

  return path;
}

function makeStars(count: number): Star[] {
  let seed = 19373;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  return Array.from({ length: count }, (_, id) => ({
    id,
    x: next() * 100,
    y: next() * 100,
    size: 0.6 + next() * 1.7,
    opacity: 0.35 + next() * 0.55,
    group: id % STAR_GROUPS,
  }));
}

const STARS = makeStars(72);

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

function planetFrame(planet: Planet, phaseDeg: number) {
  const orbit = ORBITS[planet.orbit];
  const t = ((planet.angle + phaseDeg) * Math.PI) / 180;
  const sin = Math.sin(t);
  // Smoothstep the depth so planets glide through the front/back transition.
  const d = (sin + 1) / 2;
  const depth = d * d * (3 - 2 * d);

  return {
    x: CX + orbit.rx * Math.cos(t),
    y: CY + orbit.ry * sin,
    scale: (DEPTH_MIN + depth * (DEPTH_MAX - DEPTH_MIN)) / DEPTH_MAX,
    opacity: 0.5 + depth * 0.5,
    zIndex: sin >= 0 ? 7 : 3,
  };
}

// Server/first-paint position, expressed with the --s variable so it is correct before JS measures.
function initialPlanetStyle(planet: Planet): CSSProperties {
  const frame = planetFrame(planet, 0);
  return {
    zIndex: frame.zIndex,
    opacity: frame.opacity,
    transform: `translate3d(calc(var(--s) * ${frame.x.toFixed(2)}px), calc(var(--s) * ${frame.y.toFixed(2)}px), 0) translate(-50%, -50%) scale(${frame.scale.toFixed(4)})`,
  };
}

export default function OrbitalPortal({
  photoSrc,
  photoAlt = "Portfolio owner photo",
  className,
}: OrbitalPortalProps) {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const orbitBackRef = useRef<SVGSVGElement>(null);
  const orbitFrontRef = useRef<SVGSVGElement>(null);
  const planetRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const planetLayers = useRef<Record<string, number>>({});

  const scaleRef = useRef(0.8);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const hoverRef = useRef(false);
  const reduced = useReducedMotion();

  // Measure once per resize and expose the scale as a CSS variable (no React re-render).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const update = () => {
      const rect = root.getBoundingClientRect();
      const s = Math.min(rect.width / STAGE_W, rect.height / STAGE_H) || 0.8;
      scaleRef.current = s;
      root.style.setProperty("--s", s.toFixed(5));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Single rAF loop drives planets + parallax. Only transform/opacity are written (compositor-only).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const phase = ORBITS.map(() => 0);
    const pointer = { x: 0, y: 0 };
    let speedMul = 0; // eased spin-up from rest
    let raf: number | null = null;
    let last = 0;
    let onScreen = true;

    const render = () => {
      const s = scaleRef.current;
      const ox = pointer.x * PARALLAX_ORBITS * s;
      const oy = pointer.y * PARALLAX_ORBITS * s;

      for (const planet of PLANETS) {
        const el = planetRefs.current[planet.key];
        if (!el) continue;
        const f = planetFrame(planet, phase[planet.orbit]);
        el.style.transform = `translate3d(${(f.x * s + ox).toFixed(2)}px, ${(f.y * s + oy).toFixed(2)}px, 0) translate(-50%, -50%) scale(${f.scale.toFixed(4)})`;
        el.style.opacity = f.opacity.toFixed(3);
        if (planetLayers.current[planet.key] !== f.zIndex) {
          planetLayers.current[planet.key] = f.zIndex;
          el.style.zIndex = String(f.zIndex);
        }
      }

      const orbitTransform = `translate3d(${ox.toFixed(2)}px, ${oy.toFixed(2)}px, 0)`;
      if (orbitBackRef.current) orbitBackRef.current.style.transform = orbitTransform;
      if (orbitFrontRef.current) orbitFrontRef.current.style.transform = orbitTransform;
      if (starsRef.current) {
        starsRef.current.style.transform = `translate3d(${(-pointer.x * PARALLAX_STARS * s).toFixed(2)}px, ${(-pointer.y * PARALLAX_STARS * s).toFixed(2)}px, 0)`;
      }
      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${(-pointer.x * PARALLAX_AURA * s).toFixed(2)}px, ${(-pointer.y * PARALLAX_AURA * s).toFixed(2)}px, 0)`;
      }
    };

    if (reduced) {
      render();
      return;
    }

    const tick = (now: number) => {
      // Frame-rate independent: works identically at 60, 120 or 144 Hz.
      const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
      last = now;

      // Exponential easing toward targets — smooth spin-up and a gentle slow-down on hover.
      const speedTarget = hoverRef.current ? 0.35 : 1;
      speedMul += (speedTarget - speedMul) * (1 - Math.exp(-dt * 2.4));

      const follow = 1 - Math.exp(-dt * 5);
      pointer.x += (pointerTarget.current.x - pointer.x) * follow;
      pointer.y += (pointerTarget.current.y - pointer.y) * follow;

      for (let i = 0; i < phase.length; i += 1) {
        phase[i] = (phase[i] + SPEED[i] * speedMul * dt) % 360;
      }

      render();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf !== null || !onScreen || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };

    // Pause the loop when the hero is scrolled away or the tab is hidden.
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    io.observe(root);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    render();
    start();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  const isStatic = typeof photoSrc === "object";

  return (
    <div
      ref={rootRef}
      className={`orbital-portal ${className ?? ""}`}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerTarget.current.x = (event.clientX - rect.left) / rect.width - 0.5;
        pointerTarget.current.y = (event.clientY - rect.top) / rect.height - 0.5;
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
        pointerTarget.current.x = 0;
        pointerTarget.current.y = 0;
      }}
    >
      <div className="portal-scene">
        <div ref={auraRef} className="portal-aura-wrap" aria-hidden>
          <div className="portal-aura" />
        </div>

        <div ref={starsRef} className="portal-stars" aria-hidden>
          {Array.from({ length: STAR_GROUPS }, (_, group) => (
            <div key={group} className={`portal-star-group portal-star-group-${group}`}>
              {STARS.filter((star) => star.group === group).map((star) => (
                <span
                  key={star.id}
                  className="portal-star"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: star.size,
                    height: star.size,
                    opacity: star.opacity,
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        <svg
          ref={orbitBackRef}
          className="portal-orbits portal-orbits-back"
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <linearGradient id={`${uid}-back`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7cc8ff" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#a6b4ff" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#b48cff" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {ORBITS.map((orbit) => (
            <path
              key={`${orbit.rx}-back`}
              d={halfPath(orbit.rx, orbit.ry, 180, 360)}
              stroke={`url(#${uid}-back)`}
              strokeWidth="1.3"
            />
          ))}
        </svg>

        <div className="portal-card">
          <div className="portal-card-frame" />
          <div className="portal-card-inner">
            <div className="portal-card-grid" aria-hidden />
            {photoSrc ? (
              <Image
                className="portal-photo"
                src={photoSrc}
                alt={photoAlt}
                fill
                quality={90}
                sizes="(max-width: 680px) 50vw, 440px"
                loading="eager"
                fetchPriority="high"
                placeholder={isStatic ? "blur" : "empty"}
                draggable={false}
              />
            ) : (
              <div className="portal-placeholder">your photo here</div>
            )}
            <div className="portal-card-sheen" aria-hidden />
            <span className="portal-corner portal-corner-tl" />
            <span className="portal-corner portal-corner-tr" />
            <span className="portal-corner portal-corner-bl" />
            <span className="portal-corner portal-corner-br" />
          </div>
        </div>

        <svg
          ref={orbitFrontRef}
          className="portal-orbits portal-orbits-front"
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <linearGradient id={`${uid}-front`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5fe3ff" stopOpacity="0.15" />
              <stop offset="30%" stopColor="#7cc8ff" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#b48cff" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#c47bff" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {ORBITS.map((orbit) => (
            <path
              key={`${orbit.rx}-front`}
              d={halfPath(orbit.rx, orbit.ry, 0, 180)}
              stroke={`url(#${uid}-front)`}
              strokeWidth="1.6"
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
            style={initialPlanetStyle(planet)}
          >
            <div
              className="portal-ball"
              style={
                {
                  width: `calc(var(--s) * ${planet.size * DEPTH_MAX}px)`,
                  height: `calc(var(--s) * ${planet.size * DEPTH_MAX}px)`,
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

      <style jsx>{`
        .orbital-portal {
          --s: 0.8;
          width: clamp(540px, 48vw, 880px);
          max-width: 96vw;
          aspect-ratio: ${STAGE_W} / ${STAGE_H};
          position: relative;
          isolation: isolate;
          contain: layout paint;
          overflow: visible;
        }

        .portal-scene {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        /* ---------- Ambient aura behind the card ---------- */
        .portal-aura-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          will-change: transform;
        }

        .portal-aura {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 82%;
          height: 82%;
          margin: -41% 0 0 -41%;
          border-radius: 50%;
          background:
            radial-gradient(closest-side at 38% 42%, rgba(0, 220, 255, 0.2), transparent 70%),
            radial-gradient(closest-side at 64% 60%, rgba(150, 90, 255, 0.2), transparent 72%);
          animation: portalBreathe 7s ease-in-out infinite alternate;
          will-change: transform, opacity;
        }

        /* ---------- Stars ---------- */
        .portal-stars {
          position: absolute;
          inset: -8%;
          z-index: 1;
          pointer-events: none;
          will-change: transform;
        }

        .portal-star-group {
          position: absolute;
          inset: 0;
          animation: portalTwinkle 4s ease-in-out infinite alternate;
          will-change: opacity;
        }

        .portal-star-group-1 {
          animation-duration: 5.6s;
          animation-delay: -2.1s;
        }

        .portal-star-group-2 {
          animation-duration: 3.4s;
          animation-delay: -1.3s;
        }

        .portal-star {
          position: absolute;
          border-radius: 50%;
          background: #e4edff;
          box-shadow: 0 0 4px rgba(170, 200, 255, 0.6);
        }

        /* ---------- Orbits ---------- */
        .portal-orbits {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          pointer-events: none;
          will-change: transform;
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

        /* ---------- Photo card (laid out at real pixels — no scaled bitmap) ---------- */
        .portal-card {
          position: absolute;
          z-index: 5;
          left: ${pct(CARD_X, STAGE_W)};
          top: ${pct(CARD_Y, STAGE_H)};
          width: ${pct(CARD_W, STAGE_W)};
          height: ${pct(CARD_H, STAGE_H)};
          border-radius: calc(var(--s) * 34px);
          box-shadow:
            0 calc(var(--s) * 30px) calc(var(--s) * 80px) rgba(0, 0, 0, 0.5),
            0 0 calc(var(--s) * 46px) rgba(70, 140, 255, 0.18);
        }

        .portal-card-frame {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(150deg, ${THEME.cyan}, #4b7bf0 40%, ${THEME.violet} 70%, #a855f7);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }

        .portal-card-inner {
          position: absolute;
          inset: 2px;
          border-radius: calc(var(--s) * 34px - 2px);
          overflow: hidden;
          display: grid;
          place-items: center;
          background:
            radial-gradient(120% 90% at 50% 18%, #171e3e 0%, #0b1022 55%, #080b18 100%),
            ${THEME.bgSoft};
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

        .portal-card-inner :global(.portal-photo) {
          z-index: 2;
          object-fit: cover;
          object-position: 50% 28%;
          user-select: none;
        }

        .portal-card-sheen {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 22%),
            linear-gradient(0deg, rgba(6, 8, 20, 0.35), transparent 26%);
          box-shadow: inset 0 0 calc(var(--s) * 60px) rgba(80, 120, 255, 0.12);
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
          width: calc(var(--s) * 20px);
          height: calc(var(--s) * 20px);
          border: 2px solid rgba(120, 180, 255, 0.6);
          z-index: 4;
          pointer-events: none;
        }

        .portal-corner-tl {
          top: calc(var(--s) * 14px);
          left: calc(var(--s) * 14px);
          border-right: 0;
          border-bottom: 0;
          border-radius: 6px 0 0;
        }

        .portal-corner-tr {
          top: calc(var(--s) * 14px);
          right: calc(var(--s) * 14px);
          border-left: 0;
          border-bottom: 0;
          border-radius: 0 6px 0 0;
        }

        .portal-corner-bl {
          bottom: calc(var(--s) * 14px);
          left: calc(var(--s) * 14px);
          border-right: 0;
          border-top: 0;
          border-radius: 0 0 0 6px;
        }

        .portal-corner-br {
          right: calc(var(--s) * 14px);
          bottom: calc(var(--s) * 14px);
          border-left: 0;
          border-top: 0;
          border-radius: 0 0 6px;
        }

        /* ---------- Planets ---------- */
        .portal-planet {
          position: absolute;
          left: 0;
          top: 0;
          will-change: transform, opacity;
          backface-visibility: hidden;
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
            inset calc(var(--s) * -6px) calc(var(--s) * -8px) calc(var(--s) * 16px) rgba(0, 0, 0, 0.55),
            inset calc(var(--s) * 5px) calc(var(--s) * 6px) calc(var(--s) * 12px) rgba(255, 255, 255, 0.28),
            0 0 calc(var(--s) * 20px) color-mix(in srgb, var(--planet-glow) 40%, transparent),
            0 0 calc(var(--s) * 40px) color-mix(in srgb, var(--planet-glow) 18%, transparent);
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
          opacity: 0.8;
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
          font-size: 11px;
          letter-spacing: 0.12em;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.25s ease;
          text-shadow: 0 1px 6px #000;
          pointer-events: none;
        }

        .portal-planet:hover .portal-label {
          opacity: 1;
        }

        @keyframes portalBreathe {
          from {
            opacity: 0.6;
            transform: scale(0.94);
          }
          to {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        @keyframes portalTwinkle {
          from {
            opacity: 0.35;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 680px) {
          .orbital-portal {
            width: min(96vw, 480px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .portal-aura,
          .portal-star-group {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
