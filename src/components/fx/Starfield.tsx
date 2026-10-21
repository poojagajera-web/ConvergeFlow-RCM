"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; a: number; s: number; p: number };
type Shot = { x: number; y: number; vx: number; vy: number; life: number; max: number };

/**
 * Twinkling stars with the occasional shooting star. Fills its positioned
 * parent, only animates while on screen, and stays still for reduced motion.
 */
export function Starfield({ density = 1, shooting = true, className = "" }: { density?: number; shooting?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let shots: Shot[] = [];
    let raf = 0;
    let visible = false;
    let nextShot = performance.now() + 1800;

    const seed = () => {
      const count = Math.round(((w * h) / 9000) * density);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.25,
        a: Math.random() * 0.6 + 0.2,
        s: Math.random() * 1.5 + 0.4,
        p: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw(performance.now());
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = reduce ? 1 : 0.55 + 0.45 * Math.sin(t / 1000 * s.s + s.p);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = s.r > 1 ? "#c9fff6" : "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (const sh of shots) {
        const k = 1 - sh.life / sh.max;
        const tail = 140;
        const len = Math.hypot(sh.vx, sh.vy);
        const tx = sh.x - (sh.vx / len) * tail;
        const ty = sh.y - (sh.vy / len) * tail;
        const g = ctx.createLinearGradient(sh.x, sh.y, tx, ty);
        g.addColorStop(0, `rgba(220,255,250,${0.9 * k})`);
        g.addColorStop(1, "rgba(143,240,226,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }
    };

    const tick = (t: number) => {
      if (shooting && t > nextShot) {
        const fromLeft = Math.random() > 0.5;
        const speed = 9 + Math.random() * 5;
        shots.push({
          x: fromLeft ? Math.random() * w * 0.5 : w * 0.5 + Math.random() * w * 0.5,
          y: Math.random() * h * 0.35,
          vx: (fromLeft ? 1 : -1) * speed,
          vy: speed * 0.45,
          life: 0,
          max: 55 + Math.random() * 25,
        });
        nextShot = t + 2600 + Math.random() * 3800;
      }
      shots = shots.filter((sh) => {
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life += 1;
        return sh.life < sh.max;
      });
      draw(t);
      if (visible) raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [density, shooting]);

  return <canvas ref={ref} className={className} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}
