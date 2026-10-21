"use client";

import { useRef } from "react";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, SplitText } from "@/lib/gsap";
import { HOME_INTRO } from "@/content/site/home";
import { ScrollText } from "@/components/fx/ScrollText";
import styles from "./Intro.module.css";

/** Crystal of converging lines: a hexagon wireframe with glowing nodes. */
function Crystal() {
  const nodes: [number, number][] = [
    [100, 10], [178, 55], [178, 145], [100, 190], [22, 145], [22, 55], [100, 100], [100, 55], [139, 122], [61, 122],
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 7], [7, 6], [6, 8], [6, 9], [8, 2], [9, 4], [7, 1], [7, 5], [8, 3], [9, 3], [1, 8], [5, 9],
  ];
  return (
    <svg className={styles.crystal} viewBox="0 0 200 200" aria-hidden="true">
      <g className={styles.crystalSpin}>
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
        ))}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 6 ? 3.2 : 1.8} style={{ animationDelay: `${i * -0.37}s` }} />
        ))}
      </g>
    </svg>
  );
}

/**
 * "What is ConvergeFlow?": a giant line of stages slides past, then the offer.
 * The body copy lights up word by word as it scrolls into place.
 */
export function Intro() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    root.querySelectorAll<HTMLElement>("[data-scrub-text]").forEach((p) => {
      SplitText.create(p, {
        type: "words",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(self.words, { opacity: 0.18 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: p, start: "top 85%", end: "bottom 45%", scrub: true } });
        },
      });
    });
  });

  return (
    <section ref={ref} className={`section ${styles.section}`} aria-labelledby="intro-title">
      <ScrollText text={HOME_INTRO.marquee.repeat(2)} />
      <div className={`container ${styles.layout}`}>
        <div className={styles.visual}>
          <span className={styles.halo} aria-hidden="true" />
          <Crystal />
          <p className={styles.big} data-anim="words">
            {HOME_INTRO.big} <span className="accent-text">{HOME_INTRO.bigAccent}</span>
          </p>
        </div>
        <div className={styles.copy}>
          <p className="eyebrow" data-anim="fade">
            {HOME_INTRO.chip}
          </p>
          <h2 id="intro-title" className={styles.title} data-anim="words">
            {HOME_INTRO.title}
          </h2>
          {HOME_INTRO.body.map((p) => (
            <p key={p} className={styles.body} data-scrub-text>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
