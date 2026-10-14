"use client";

import { useRef } from "react";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./Hero.module.css";

const CELL = 72;
const COUNT = 22;
const STATIC = [
  [9, 1],
  [12, 2],
  [15, 1],
  [17, 4],
  [11, 5],
  [19, 2],
];

/**
 * Measurement grid behind the hero with cells that light up and fade at
 * random, snapped to the 72px grid. Cycles pause while the hero is offscreen;
 * reduced-motion users get a fixed constellation instead.
 */
export function HeroGridCells() {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ motion }) => {
    const root = ref.current!;
    const cells = gsap.utils.toArray<HTMLElement>("[data-cell]", root);
    let cols = 1;
    let rows = 1;
    const measure = () => {
      cols = Math.max(1, Math.floor(root.clientWidth / CELL));
      rows = Math.max(1, Math.floor(root.clientHeight / CELL));
    };
    measure();

    if (!motion) {
      cells.forEach((cell, i) => {
        const spot = STATIC[i];
        if (!spot) return gsap.set(cell, { opacity: 0 });
        gsap.set(cell, { x: Math.min(spot[0], cols - 1) * CELL, y: spot[1] * CELL, opacity: 0.12 });
      });
      return;
    }

    const occupied = new Set<string>();
    // Bias toward the upper right, where the grid's mask is most visible.
    const pick = () => {
      for (let tries = 0; tries < 12; tries++) {
        const c = Math.floor(cols * (0.25 + 0.75 * Math.pow(Math.random(), 0.7)));
        const r = Math.floor(rows * Math.pow(Math.random(), 1.6));
        const key = `${c}:${r}`;
        if (!occupied.has(key)) return { c: Math.min(c, cols - 1), r, key };
      }
      return { c: 0, r: 0, key: "0:0" };
    };

    const timelines = cells.map((cell, i) => {
      let current = "";
      const tl = gsap.timeline({ repeat: -1, repeatRefresh: true, delay: Math.random() * 4 + i * 0.12, paused: true });
      tl.call(() => {
        occupied.delete(current);
        const spot = pick();
        current = spot.key;
        occupied.add(current);
        gsap.set(cell, { x: spot.c * CELL, y: spot.r * CELL });
        cell.dataset.variant = Math.random() < 0.28 ? "outline" : Math.random() < 0.15 ? "ping" : "fill";
      })
        .fromTo(cell, { opacity: 0 }, { opacity: () => gsap.utils.random(0.35, 1), duration: () => gsap.utils.random(0.6, 1.4), ease: "sine.inOut" })
        .to(cell, { opacity: 0, duration: () => gsap.utils.random(0.8, 1.8), ease: "sine.inOut" }, `+=${gsap.utils.random(0.6, 2.8)}`)
        .to({}, { duration: () => gsap.utils.random(0.2, 2.2) });
      return tl;
    });

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => timelines.forEach((tl) => (self.isActive ? tl.play() : tl.pause())),
    });
    if (st.isActive) timelines.forEach((tl) => tl.play());

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  });

  return (
    <div ref={ref} className={styles.grid} aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => (
        <span key={i} className={styles.cell} data-cell />
      ))}
    </div>
  );
}
