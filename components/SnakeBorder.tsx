"use client";
import { useEffect, useId, useRef, useState } from "react";
import { THEME } from "@/config/theme.config";

/**
 * Animated "snake" border: a gradient stroke that draws itself around the
 * rounded rectangle of the parent on hover (and retracts on leave). Drop it
 * inside a `position: relative` element; it fills it via `inset: 0`.
 */
export default function SnakeBorder({
  active,
  radius = 16,
  duration = 0.85,
}: {
  active: boolean;
  radius?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const gid = useId().replace(/:/g, "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none", borderRadius: radius }}
    >
      {w > 0 && h > 0 && (
        <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <linearGradient id={`snake-${gid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={THEME.cyan} />
              <stop offset="0.5" stopColor={THEME.violet} />
              <stop offset="1" stopColor={THEME.cyan} />
            </linearGradient>
          </defs>
          <rect
            x="1.5"
            y="1.5"
            width={w - 3}
            height={h - 3}
            rx={radius}
            ry={radius}
            fill="none"
            stroke={`url(#snake-${gid})`}
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={100}
            style={{
              strokeDasharray: 100,
              strokeDashoffset: active ? 0 : 100,
              transition: `stroke-dashoffset ${duration}s cubic-bezier(0.16,1,0.3,1)`,
              filter: `drop-shadow(0 0 5px ${THEME.cyan}66)`,
            }}
          />
        </svg>
      )}
    </div>
  );
}
