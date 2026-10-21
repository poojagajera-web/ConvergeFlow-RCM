"use client";

import { useRef } from "react";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import styles from "./FloatTokens.module.css";

export type Token = { text: string; x: number; y: number; depth: number; rotate?: number; boxed?: boolean };

/**
 * Revenue-cycle shorthand drifting around a hero (837D, ERA, CDT…): fades in
 * with a blur, floats gently and parallaxes against the pointer by depth.
 */
export function FloatTokens({ tokens, className = "" }: { tokens: Token[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ motion, desktop }) => {
    if (!motion) return;
    const root = ref.current!;
    const items = gsap.utils.toArray<HTMLElement>("[data-token]", root);
    gsap.from(items, { opacity: 0, filter: "blur(12px)", scale: 0.8, duration: 1.6, stagger: { each: 0.08, from: "random" }, delay: 0.6, ease: "power2.out" });
    items.forEach((el, i) => {
      gsap.to(el.firstElementChild, { y: i % 2 ? 10 : -10, rotation: i % 3 ? 2 : -2, duration: 3 + (i % 4), ease: "sine.inOut", yoyo: true, repeat: -1 });
    });
    if (!desktop) return;
    const movers = items.map((el) => ({
      depth: Number(el.dataset.depth),
      x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
    }));
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      movers.forEach((m) => {
        m.x(dx * 60 * m.depth);
        m.y(dy * 40 * m.depth);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  });

  return (
    <div ref={ref} className={`${styles.layer} ${className}`} aria-hidden="true">
      {tokens.map((t, i) => (
        <span
          key={i}
          className={styles.token}
          data-token
          data-depth={t.depth}
          data-boxed={t.boxed || undefined}
          style={{ left: `${t.x}%`, top: `${t.y}%`, ["--d" as string]: t.depth, ["--r" as string]: `${t.rotate ?? 0}deg` }}
        >
          <span>{t.text}</span>
        </span>
      ))}
    </div>
  );
}
