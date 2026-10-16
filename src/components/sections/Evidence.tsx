"use client";

import { useRef, useState } from "react";
import { EVIDENCE } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import styles from "./Evidence.module.css";

const CARDS = EVIDENCE.cards ?? [];
const pad = (n: number) => String(n).padStart(2, "0");

type Tone = "open" | "review";
/** One synthetic product row per scenario — labels only, no data or outcomes. */
const SAMPLES: { label: string; meta: string; chip: string; tone: Tone }[] = [
  { label: "10:15 · Patient C", meta: "Appointment queue", chip: "Open question", tone: "open" },
  { label: "Claim 0002", meta: "Claims", chip: "Needs correction", tone: "review" },
  { label: "Activity record", meta: "Reports", chip: "To review", tone: "review" },
];

/**
 * Walkthrough board: the three approved scenario questions along one
 * timeline. A marker travels the track as the board scrolls through view and
 * lights each scenario in turn.
 */
export function Evidence() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useMotion(ref, ({ motion }) => {
    const root = ref.current!;
    const board = root.querySelector<HTMLElement>("[data-board]")!;
    if (!motion) return;

    gsap
      .timeline({ scrollTrigger: { trigger: board, start: "top 80%", once: true }, defaults: { ease: "expo.out" } })
      .fromTo(board, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.3, clearProps: "opacity,transform" })
      .fromTo(root.querySelector("[data-track]"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power3.inOut" }, 0.3)
      .from(root.querySelectorAll("[data-node]"), { scale: 0, duration: 0.6, stagger: 0.2, ease: "back.out(2.2)", clearProps: "transform" }, 0.5)
      .from(root.querySelectorAll("[data-col]"), { opacity: 0, y: 24, duration: 1, stagger: 0.15, clearProps: "opacity,transform" }, 0.6);

    // The marker follows scroll progress through the board.
    gsap.fromTo(
      root.querySelector("[data-marker]"),
      { left: "0%" },
      {
        left: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: board,
          start: "top 65%",
          end: "bottom 45%",
          scrub: 0.6,
          onUpdate: (self) => setActive(Math.min(CARDS.length - 1, Math.floor(self.progress * CARDS.length))),
        },
      },
    );
  });

  return (
    <section ref={ref} id="evidence" className={`section section-dark on-dark ${styles.section}`} aria-labelledby="evidence-title">
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        <header className={styles.head}>
          <p className="eyebrow" data-anim="fade">
            {EVIDENCE.eyebrow}
          </p>
          <h2 id="evidence-title" className={styles.title} data-anim="lines">
            {EVIDENCE.heading}
          </h2>
          <p className={styles.intro} data-anim="fade">
            {EVIDENCE.intro}
          </p>
        </header>

        <div className={styles.board} data-board>
          <ol className={styles.cols}>
            {CARDS.map((card, i) => {
              const sample = SAMPLES[i % SAMPLES.length];
              return (
                <li key={card.title} className={styles.col} data-col data-on={i === active || undefined}>
                  <span className={`${styles.node} num`} data-node aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <p className={styles.stage}>{card.title}</p>
                  <h3 className={styles.question}>{card.body}</h3>
                  <div className={styles.sample} aria-hidden="true">
                    <span className={styles.sampleMeta}>{sample.meta}</span>
                    <span className={styles.sampleRow}>
                      <span className={styles.sampleLabel}>{sample.label}</span>
                      <span className={styles.chip} data-tone={sample.tone}>
                        {sample.chip}
                      </span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className={styles.timeline} aria-hidden="true">
            <span className={styles.track} data-track />
            <span className={styles.marker} data-marker />
          </div>

          <div className={styles.foot}>
            <p className={styles.caption}>Illustrative scenarios · synthetic data, not live results</p>
            <ButtonLink href="/demo/">Schedule a Demo</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
