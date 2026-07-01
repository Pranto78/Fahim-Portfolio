"use client";
import { useReducedMotion } from "framer-motion";
import { THEME } from "@/config/theme.config";

/**
 * Sleek alien craft used as the collapsed nav trigger. Angular metallic body,
 * cyan edge-light, glowing cockpit and twin thrusters. Idle-bobs and the
 * engines flare on hover / when the menu is open. Static under reduced motion.
 */
export default function Spaceship({
  open,
  onClick,
  pinned = false,
}: {
  open: boolean;
  onClick: () => void;
  pinned?: boolean;
}) {
  const reduced = useReducedMotion();
  const still = reduced || pinned; // frozen: no bob (thrusters keep glowing softly)

  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close navigation" : "Open navigation"}
      aria-expanded={open}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        lineHeight: 0,
        filter: `drop-shadow(0 0 12px ${THEME.cyan}${open ? "88" : "55"})`,
        transition: "filter .3s",
      }}
    >
      <div
        style={{
          animation: still ? undefined : "shipBob 3.4s ease-in-out infinite",
          transformOrigin: "center",
        }}
      >
        <svg width="66" height="72" viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ship-body" x1="12" y1="6" x2="52" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#232B3A" />
              <stop offset="0.5" stopColor="#141A24" />
              <stop offset="1" stopColor="#0B0F16" />
            </linearGradient>
            <linearGradient id="ship-wing" x1="6" y1="30" x2="58" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A2230" />
              <stop offset="1" stopColor="#0A0E14" />
            </linearGradient>
            <radialGradient id="ship-cockpit" cx="0.5" cy="0.4" r="0.6">
              <stop stopColor="#BFFBFF" />
              <stop offset="0.5" stopColor={THEME.cyan} />
              <stop offset="1" stopColor="#0B7C86" />
            </radialGradient>
            <radialGradient id="ship-engine" cx="0.5" cy="0.3" r="0.7">
              <stop stopColor="#EAFBFF" />
              <stop offset="0.4" stopColor={THEME.cyan} />
              <stop offset="1" stopColor={THEME.violet} />
            </radialGradient>
          </defs>

          {/* wings */}
          <path d="M23 30 L4 50 L15 52 L25 45 Z" fill="url(#ship-wing)" stroke={THEME.cyan} strokeOpacity="0.5" strokeWidth="1" />
          <path d="M41 30 L60 50 L49 52 L39 45 Z" fill="url(#ship-wing)" stroke={THEME.cyan} strokeOpacity="0.5" strokeWidth="1" />

          {/* engine glow */}
          <g
            style={{
              transformOrigin: "32px 60px",
              animation: reduced ? undefined : "thruster 1.1s ease-in-out infinite",
              opacity: open ? 1 : 0.85,
            }}
          >
            <ellipse cx="27" cy="60" rx="3.4" ry="7" fill="url(#ship-engine)" />
            <ellipse cx="37" cy="60" rx="3.4" ry="7" fill="url(#ship-engine)" />
            <ellipse cx="32" cy="63" rx="9" ry="4" fill={THEME.cyan} opacity="0.18" />
          </g>

          {/* fuselage */}
          <path
            d="M32 3 L43 30 L39 54 L25 54 L21 30 Z"
            fill="url(#ship-body)"
            stroke={THEME.cyan}
            strokeOpacity="0.7"
            strokeWidth="1.2"
          />
          {/* spine highlight */}
          <path d="M32 6 L32 50" stroke={THEME.cyan} strokeOpacity="0.35" strokeWidth="1" />

          {/* cockpit */}
          <ellipse cx="32" cy="26" rx="4.6" ry="8" fill="url(#ship-cockpit)" />
          <ellipse cx="32" cy="23" rx="2" ry="3.4" fill="#EAFEFF" opacity="0.85" />
        </svg>
      </div>
    </button>
  );
}
