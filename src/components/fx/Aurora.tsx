"use client";

import { useEffect, useRef } from "react";
import styles from "./Aurora.module.css";

/**
 * Drifting green and blue light for a section background (the same palette as
 * the home hero). Each colour roams its own loop and leans toward the pointer
 * by a different amount. `green` and `blue` scale each colour's strength
 * (1 = the hero's). Static for reduced motion.
 */
export function Aurora({ green = 1, blue = 1, className = "" }: { green?: number; blue?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <span ref={ref} className={`${styles.aurora} ${className}`} style={{ ["--green" as string]: green, ["--blue" as string]: blue }} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}
