"use client";
import { useEffect, useRef } from "react";
import { THEME } from "@/config/theme.config";

type Node = { x: number; y: number; vx: number; vy: number };

/**
 * Fixed full-viewport animated background: two drifting gradient blobs + a
 * constellation grid of nodes with connecting lines. Everything parallaxes
 * with scroll. Renders a plain static gradient when reduced motion is set.
 */
export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const cv: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D = context;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let nodes: Node[] = [];
    let t = 0;
    let raf = 0;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = w + "px";
      cv.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(46, Math.floor((w * h) / 44000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function blob(cx: number, cy: number, r: number, color: string, alpha: number) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, color + Math.round(alpha * 255).toString(16).padStart(2, "0"));
      g.addColorStop(1, color + "00");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    function draw() {
      t += 0.004;
      const par = scrollY.current;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = THEME.bg;
      ctx.fillRect(0, 0, w, h);

      // drifting gradient blobs (parallax with scroll)
      blob(w * 0.2 + Math.sin(t) * 60, h * 0.15 - par * 0.15 + Math.cos(t) * 40, Math.max(w, h) * 0.5, THEME.cyan, 0.05);
      blob(w * 0.85 + Math.cos(t * 0.8) * 60, h * 0.8 - par * 0.08 + Math.sin(t) * 40, Math.max(w, h) * 0.5, THEME.violet, 0.06);

      // constellation
      const off = (par * 0.05) % h;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) n.x = w;
        if (n.x > w) n.x = 0;
        if (n.y < 0) n.y = h;
        if (n.y > h) n.y = 0;
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const ay = (a.y - off + h) % h;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const by = (b.y - off + h) % h;
          const dx = a.x - b.x;
          const dy = ay - by;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(0,240,255,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, ay);
            ctx.lineTo(b.x, by);
            ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(232,234,237,0.35)";
        ctx.beginPath();
        ctx.arc(a.x, ay, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    function drawStatic() {
      ctx.fillStyle = THEME.bg;
      ctx.fillRect(0, 0, w, h);
      blob(w * 0.2, h * 0.15, Math.max(w, h) * 0.5, THEME.cyan, 0.05);
      blob(w * 0.85, h * 0.8, Math.max(w, h) * 0.5, THEME.violet, 0.06);
    }

    const onScroll = () => {
      scrollY.current = window.scrollY;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reduced) {
      drawStatic();
    } else {
      draw();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
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
