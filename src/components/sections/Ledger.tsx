"use client";

import { useRef } from "react";
import { LEDGER_STATS } from "@/content/home";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import styles from "./Ledger.module.css";

const RECOVERY = [6, 10, 13, 17, 20, 24, 27, 30, 33, 36, 39, 42];

/** 94% — ring gauge of manual verification time removed. */
function RingViz() {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg className={styles.ring} viewBox="0 0 88 88" aria-hidden="true">
      <circle cx="44" cy="44" r={r} className={styles.ringTrack} />
      <circle cx="44" cy="44" r={r} className={styles.ringValue} strokeDasharray={`${c * 0.94} ${c}`} data-ring transform="rotate(-90 44 44)" />
      <text x="44" y="41" textAnchor="middle" className={styles.ringSmall}>
        manual
      </text>
      <text x="44" y="56" textAnchor="middle" className={styles.ringBig}>
        6%
      </text>
    </svg>
  );
}

/** 3× — same claim, a third of the cycle time. */
function SpeedViz() {
  return (
    <div className={styles.speed} aria-hidden="true">
      <div className={styles.lane}>
        <span className={styles.laneLabel}>Manual cycle</span>
        <span className={styles.laneTrack}>
          <span className={styles.laneBarMuted} data-grow />
          <span className={styles.runner} data-runner="slow" />
        </span>
      </div>
      <div className={styles.lane}>
        <span className={styles.laneLabel}>ConvergeFlow</span>
        <span className={styles.laneTrack}>
          <span className={styles.laneBar} data-grow />
          <span className={`${styles.runner} ${styles.runnerFast}`} data-runner="fast" />
        </span>
      </div>
    </div>
  );
}

/** $42K — recovered revenue building through the year. */
function RecoveryViz() {
  return (
    <div className={styles.bars} aria-hidden="true">
      {RECOVERY.map((v, i) => (
        <span key={i} style={{ height: `${(v / 42) * 100}%` }} data-bar data-last={i === RECOVERY.length - 1 || undefined} />
      ))}
    </div>
  );
}

/** 99% — a hundred claims, ninety-nine clean on first pass. */
function GridViz() {
  return (
    <div className={styles.grid} aria-hidden="true">
      {Array.from({ length: 100 }, (_, i) => (
        <span key={i} data-cell data-miss={i === 99 || undefined} />
      ))}
    </div>
  );
}

const VIZ = [RingViz, SpeedViz, RecoveryViz, GridViz];

export function Ledger() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 82%", once: true }, defaults: { ease: "expo.out" } });

    tl.from(root.querySelectorAll("[data-cell-item]"), { opacity: 0, y: 30, duration: 1.1, stagger: 0.1 });

    root.querySelectorAll<HTMLElement>("[data-count]").forEach((el, i) => {
      const target = Number(el.dataset.count);
      const s = { v: 0 };
      el.textContent = "0";
      tl.to(s, { v: target, duration: 1.8, ease: "power3.out", onUpdate: () => (el.textContent = String(Math.round(s.v))) }, 0.2 + i * 0.1);
    });

    tl.from(root.querySelector("[data-ring]"), { drawSVG: "0%", duration: 1.8, ease: "power3.inOut" }, 0.3)
      .from(root.querySelectorAll("[data-grow]"), { scaleX: 0, transformOrigin: "left center", duration: 1.3, stagger: 0.2, ease: "power3.inOut" }, 0.4)
      .from(root.querySelectorAll("[data-bar]"), { scaleY: 0, transformOrigin: "bottom", duration: 0.9, stagger: 0.05 }, 0.5)
      .from(root.querySelectorAll("[data-cell]"), { scale: 0, opacity: 0, duration: 0.4, stagger: { each: 0.008, from: "start" }, ease: "back.out(2)" }, 0.5);

    // Racing dots: the ConvergeFlow claim laps the manual one three times.
    const slow = root.querySelector("[data-runner='slow']");
    const fast = root.querySelector("[data-runner='fast']");
    const race = gsap.timeline({ repeat: -1, paused: true });
    race.fromTo(slow, { left: "0%" }, { left: "100%", duration: 4.2, ease: "none" }, 0);
    race.fromTo(fast, { left: "0%" }, { left: "100%", duration: 1.4, ease: "none", repeat: 2 }, 0);
    tl.add(() => void race.play(), 1.2);
    return () => {
      race.kill();
    };
  });

  return (
    <section ref={ref} className={styles.ledger} aria-label="Key outcomes">
      <div className="container">
        <dl className={styles.panel}>
          {LEDGER_STATS.map((s, i) => {
            const Viz = VIZ[i];
            return (
              <div key={s.label} className={styles.item} data-cell-item>
                <dt className={styles.label}>
                  <span className={`${styles.index} num`}>{String(i + 1).padStart(2, "0")}</span>
                  {s.label}
                </dt>
                <dd className={`${styles.value} num`}>
                  <span className="visually-hidden">{`${s.prefix}${s.value}${s.suffix}`}</span>
                  <span aria-hidden="true">
                    {s.prefix && <span className={styles.unit}>{s.prefix}</span>}
                    <span data-count={s.value}>{s.value}</span>
                    <span className={styles.unit}>{s.suffix}</span>
                  </span>
                </dd>
                <dd className={styles.viz}>
                  <Viz />
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
