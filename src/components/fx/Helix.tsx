"use client";

import { useEffect, useRef } from "react";

/**
 * Two glowing strands twisting around each other and converging into one
 * flow at the bottom: a ConvergeFlow take on the reference's 3D ribbon.
 * Canvas 2D with pre-rendered glow sprites; pauses off screen.
 */
export function Helix({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;

    const sprite = (color: string, size: number) => {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const g = c.getContext("2d")!;
      const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, color);
      grad.addColorStop(0.25, color.replace(/[\d.]+\)$/, "0.55)"));
      grad.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, size, size);
      return c;
    };
    const mint = sprite("rgba(190,255,245,1)", 64);
    const teal = sprite("rgba(17,185,168,1)", 64);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const n = 46;
      const cx = w / 2;
      const top = h * 0.02;
      const step = (h * 0.96) / (n - 1);
      const amp = Math.min(w * 0.36, 190);
      const pts: { x: number; y: number; z: number; s: 0 | 1 }[] = [];
      for (let i = 0; i < n; i++) {
        const k = i / (n - 1);
        // strands converge toward the bottom
        const a = amp * (1 - 0.82 * k * k);
        const ang = t * 0.0011 + i * 0.3;
        const y = top + i * step;
        pts.push({ x: cx + a * Math.sin(ang), y, z: Math.cos(ang), s: 0 });
        pts.push({ x: cx + a * Math.sin(ang + Math.PI), y, z: Math.cos(ang + Math.PI), s: 1 });
      }
      // rungs between the strands
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i += 4) {
        const p = pts[i];
        const q = pts[i + 1];
        const g = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
        g.addColorStop(0, `rgba(143,240,226,${0.08 + 0.14 * (p.z + 1) / 2})`);
        g.addColorStop(1, `rgba(17,185,168,${0.08 + 0.14 * (q.z + 1) / 2})`);
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
      // back points first, then front
      pts.sort((a, b) => a.z - b.z);
      for (const p of pts) {
        const depth = (p.z + 1) / 2;
        const size = 10 + depth * 30;
        ctx.globalAlpha = 0.25 + depth * 0.75;
        ctx.drawImage(p.s ? teal : mint, p.x - size / 2, p.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const tick = (t: number) => {
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
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" style={{ width: "100%", height: "100%", pointerEvents: "none" }} />;
}
