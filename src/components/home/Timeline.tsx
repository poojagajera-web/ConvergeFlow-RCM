"use client";

import { useRef } from "react";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import { HOME_TIMELINE } from "@/content/site/home";
import type { IconName } from "@/content/site/types";
import { Icon } from "@/components/site/Icon";
import styles from "./Timeline.module.css";

/** Pillar heights (% of the scene) and matching tops for the light path. */
const HEIGHTS = [16, 26, 36, 46];
const BASE = 88;
const ICONS: IconName[] = ["calendar", "tooth", "send", "check"];
const X = [12.5, 37.5, 62.5, 87.5];
const tops = HEIGHTS.map((h, i) => [X[i] * 10, (BASE - h) * 10]);
const PATH = `M ${tops[0][0]} ${tops[0][1]} C ${tops[0][0] + 120} ${tops[0][1]}, ${tops[1][0] - 120} ${tops[1][1]}, ${tops[1][0]} ${tops[1][1]} S ${tops[2][0] - 120} ${tops[2][1]}, ${tops[2][0]} ${tops[2][1]} S ${tops[3][0] - 120} ${tops[3][1]}, ${tops[3][0]} ${tops[3][1]}`;

/**
 * The dental cycle as light pillars rising from a glowing floor. While pinned
 * on desktop, pillars rise one by one, a light path draws across their tops
 * and each stage's glass card lands on its pillar.
 */
export function Timeline() {
  const ref = useRef<HTMLElement>(null);
  const stages = HOME_TIMELINE.stages;

  useMotion(ref, ({ motion, desktop }) => {
    if (!motion) return;
    const root = ref.current!;
    const pillars = gsap.utils.toArray<HTMLElement>("[data-pillar]", root);
    const cards = gsap.utils.toArray<HTMLElement>("[data-tcard]", root);
    const paths = gsap.utils.toArray<SVGPathElement>("[data-path]", root);

    if (!desktop) {
      gsap.from(cards, { opacity: 0, x: 30, filter: "blur(8px)", duration: 1, stagger: 0.15, ease: "power3.out", clearProps: "all", scrollTrigger: { trigger: root.querySelector("[data-scene]"), start: "top 80%", once: true } });
      return;
    }

    root.setAttribute("data-live", "");
    // The path keeps a constant stroke width while the SVG stretches, so dashes are
    // measured in screen pixels: walk the path to get its on-screen length, and the
    // length up to each pillar top.
    const first = paths[0];
    let total = 0;
    const upTo: number[] = [];
    if (first) {
      const svg = first.ownerSVGElement!;
      const sx = svg.clientWidth / 1000;
      const sy = svg.clientHeight / 1000;
      const L = first.getTotalLength();
      let prev = first.getPointAtLength(0);
      let next = 1;
      for (let k = 1; k <= 240; k++) {
        const pt = first.getPointAtLength((L * k) / 240);
        total += Math.hypot((pt.x - prev.x) * sx, (pt.y - prev.y) * sy);
        while (next < tops.length && pt.x >= tops[next][0] - 0.5) upTo[next++] = total;
        prev = pt;
      }
      gsap.set(paths, { strokeDasharray: total, strokeDashoffset: total });
    }
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root.querySelector("[data-pin]"), start: "top top", end: "+=200%", pin: true, scrub: 0.7 },
    });
    pillars.forEach((pillar, i) => {
      tl.fromTo(pillar, { scaleY: 0 }, { scaleY: 1, ease: "power2.out", duration: 1 }, i * 1.1);
      tl.fromTo(cards[i], { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7 }, i * 1.1 + 0.55);
      if (first && i > 0) tl.to(paths, { strokeDashoffset: total - (upTo[i] ?? total), ease: "none", duration: 1 }, (i - 1) * 1.1 + 0.6);
    });
    tl.to({}, { duration: 0.6 });
    return () => root.removeAttribute("data-live");
  });

  return (
    <section ref={ref} className={styles.section} aria-labelledby="timeline-title">
      <div className={`container ${styles.pin}`} data-pin>
        <header className={styles.head}>
          <p className="eyebrow" data-anim="fade">
            The dental revenue cycle
          </p>
          <h2 id="timeline-title" className={styles.heading} data-anim="words">
            {HOME_TIMELINE.title} <span className="accent-text">{HOME_TIMELINE.accent}</span>
          </h2>
          <p className={styles.body} data-anim="fade">
            {HOME_TIMELINE.body}
          </p>
        </header>

        <div className={styles.scene} data-scene>
          <span className={styles.horizonGlow} aria-hidden="true" />
          <div className={styles.floor} aria-hidden="true">
            <span className={styles.scan} />
          </div>
          <svg className={styles.path} viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
            <path d={PATH} className={styles.pathGlow} data-path />
            <path d={PATH} className={styles.pathLine} data-path />
          </svg>
          <ol className={styles.cols}>
            {stages.map((s, i) => (
              <li key={s.label} className={styles.col} style={{ ["--h" as string]: `${HEIGHTS[i]}%`, ["--x" as string]: `${X[i]}%` }}>
                <span className={styles.pillar} data-pillar aria-hidden="true">
                  <span className={styles.beam} />
                  <span className={styles.dot} />
                  <span className={styles.base} />
                </span>
                <div className={styles.card} data-tcard>
                  <span className={styles.cardIcon}>
                    <Icon name={ICONS[i]} />
                  </span>
                  <span className={styles.cardNum}>0{i + 1}</span>
                  <b className={styles.cardTitle}>{s.label}</b>
                  <span className={styles.cardBody}>{s.body}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
