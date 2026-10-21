"use client";

import { useEffect, useRef } from "react";

/**
 * A rotating globe of glowing particles (Fibonacci sphere) with a band of
 * light scanning over it. Spin follows the pointer, eased by elapsed time so
 * it stays smooth at any refresh rate. Pauses off screen and draws a single
 * still frame for reduced motion.
 */
export function ParticleSphere({ count = 1100, className = "" }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    let angle = 0;
    let tilt = 0.38;
    // Spin in radians per second, so the motion is the same at any refresh rate.
    const BASE_SPEED = 0.21;
    let targetSpeed = BASE_SPEED;
    let speed = targetSpeed;
    let targetTilt = tilt;
    let last = 0;
    const TAU = Math.PI * 2;

    // Fibonacci sphere points
    const pts = Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * Math.PI * (3 - Math.sqrt(5));
      return { x: Math.cos(th) * r, y, z: Math.sin(th) * r };
    });

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
      const R = Math.min(w, h) * 0.42;
      const cx = w / 2;
      const cy = h / 2;
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      const scan = Math.sin(t * 0.0009) * 1.1; // band position in [-1.1, 1.1]
      for (const p of pts) {
        // rotate around Y, then tilt around X
        const x1 = p.x * ca - p.z * sa;
        const z1 = p.x * sa + p.z * ca;
        const y2 = p.y * ct - z1 * st;
        const z2 = p.y * st + z1 * ct;
        const depth = (z2 + 1) / 2; // 0 back → 1 front
        const persp = 1 / (1.9 - z2 * 0.55);
        const sx = cx + x1 * R * persp * 1.6;
        const sy = cy + y2 * R * persp * 1.6;
        // the scan band brightens smoothly instead of switching colour at a threshold
        const band = Math.max(0, 1 - Math.abs(p.y - scan) * 5);
        const glow = band * band * (3 - 2 * band);
        const radius = (0.45 + depth * 0.85 + glow * 0.7) * 0.5 * 1.6;
        ctx.globalAlpha = Math.min(1, 0.08 + depth * 0.7 + glow * 0.4);
        ctx.fillStyle = glow > 0.35 ? "#eafffb" : depth > 0.6 ? "#8ff0e2" : "#11b9a8";
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const tick = (t: number) => {
      // Frame-rate independent easing toward the pointer-driven targets.
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 1 / 60;
      last = t;
      const k = 1 - Math.exp(-dt * 2.2);
      speed += (targetSpeed - speed) * k;
      tilt += (targetTilt - tilt) * k;
      angle += speed * dt;
      draw(t);
      if (visible) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / r.width));
      const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / r.height));
      targetSpeed = BASE_SPEED + nx * 0.6;
      targetTilt = 0.38 + ny * 0.4;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      last = 0;
      if (visible && !reduce) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [count]);

  return <canvas ref={ref} className={className} aria-hidden="true" style={{ width: "100%", height: "100%", pointerEvents: "none" }} />;
}
