"use client";
import { useEffect, useRef } from "react";
import { THEME } from "@/config/theme.config";

type Particle = {
  bx: number; // drifting base position
  by: number;
  x: number; // eased render position
  y: number;
  vx: number; // drift velocity
  vy: number;
  size: number;
  alpha: number;
  tw: number; // twinkle phase
  tws: number; // twinkle speed
};

/**
 * Fixed full-viewport dust / star field. Particles drift on their own; the
 * cursor carves a smooth empty void (repel) that particles flow back into when
 * it leaves. A very faint cyan/violet glow sits deep in the background.
 * Static sprinkle under prefers-reduced-motion.
 */
export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const cv: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D = context;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const R = 130; // cursor void radius
    const R2 = R * R;
    const PUSH = 26; // max outward displacement at cursor center

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let particles: Particle[] = [];
    let t = 0;
    let raf = 0;

    const mouse = { x: -9999, y: -9999, active: false };

    function make(): Particle {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const ang = Math.random() * Math.PI * 2;
      const spd = 0.02 + Math.random() * 0.13;
      return {
        bx: x,
        by: y,
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 0.4 + Math.random() * 1.4,
        alpha: 0.15 + Math.random() * 0.75,
        tw: Math.random() * Math.PI * 2,
        tws: 0.005 + Math.random() * 0.02,
      };
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = w + "px";
      cv.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(4200, Math.floor((w * h) / 600));
      particles = Array.from({ length: count }, make);
    }

    // Faint brand ambience — large low-alpha radial glow.
    function blob(cx: number, cy: number, r: number, color: string, alpha: number) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, color + Math.round(alpha * 255).toString(16).padStart(2, "0"));
      g.addColorStop(1, color + "00");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    function paintBackdrop() {
      ctx.fillStyle = THEME.bg;
      ctx.fillRect(0, 0, w, h);
      blob(w * 0.24 + Math.sin(t) * 40, h * 0.2 + Math.cos(t) * 30, Math.max(w, h) * 0.55, THEME.cyan, 0.03);
      blob(w * 0.8 + Math.cos(t * 0.8) * 40, h * 0.82 + Math.sin(t) * 30, Math.max(w, h) * 0.55, THEME.violet, 0.035);
    }

    function draw() {
      t += 0.004;
      paintBackdrop();

      for (const p of particles) {
        // drift on its own
        p.bx += p.vx;
        p.by += p.vy;
        if (p.bx < 0) p.bx = w;
        else if (p.bx > w) p.bx = 0;
        if (p.by < 0) p.by = h;
        else if (p.by > h) p.by = 0;

        // cursor void: push outward from the pointer
        let tx = p.bx;
        let ty = p.by;
        if (mouse.active) {
          const dx = p.bx - mouse.x;
          const dy = p.by - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.0001) {
            const d = Math.sqrt(d2);
            const f = 1 - d / R; // 0..1 falloff
            const push = f * f * PUSH; // eased so the void edge is soft
            tx = p.bx + (dx / d) * push;
            ty = p.by + (dy / d) * push;
          }
        }

        // ease render position toward target (flow back when void leaves)
        p.x += (tx - p.x) * 0.12;
        p.y += (ty - p.y) * 0.12;

        // twinkle
        p.tw += p.tws;
        const a = p.alpha * (0.65 + 0.35 * Math.sin(p.tw));

        ctx.fillStyle = `rgba(232,234,237,${a})`;
        const s = p.size;
        ctx.fillRect(p.x, p.y, s, s);
      }

      raf = requestAnimationFrame(draw);
    }

    function drawStatic() {
      paintBackdrop();
      for (const p of particles) {
        ctx.fillStyle = `rgba(232,234,237,${p.alpha})`;
        ctx.fillRect(p.bx, p.by, p.size, p.size);
      }
    }

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      drawStatic();
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerout", onLeave);
      window.addEventListener("blur", onLeave);
      draw();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
