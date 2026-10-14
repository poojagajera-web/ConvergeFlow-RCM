"use client";

import { useRef } from "react";
import { TESTIMONIALS } from "@/content/home";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./Testimonials.module.css";

const ITEMS = TESTIMONIALS.items;
/** Copies of the set per track so the loop never shows a gap, even at 2560px. */
const COPIES = 3;

function StoryCard({ t }: { t: (typeof ITEMS)[number] }) {
  return (
    <figure className={styles.card} data-card>
      <p className={styles.outcome}>{t.outcome}</p>
      <blockquote className={styles.quote}>
        <p>“{t.quote}”</p>
      </blockquote>
      <figcaption className={styles.person}>
        <span className={styles.avatar} aria-hidden="true">
          {t.initials}
        </span>
        <span>
          <span className={styles.personName}>{t.name}</span>
          <span className={styles.personRole}>
            {t.role} • {t.practice}
          </span>
        </span>
      </figcaption>
      <p className={styles.meta}>
        <span>PMS: {t.pms}</span>
        <span>Verified client • {t.tenure}</span>
      </p>
    </figure>
  );
}

/**
 * Client feedback as two endless counter-moving tracks: full stories above,
 * outcome chips below. Tracks ease to a stop while hovered or focused, react
 * to scroll speed, and sit still for reduced-motion visitors.
 */
export function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    const loops = gsap.utils.toArray<HTMLElement>("[data-track]", root).map((track) => {
      const reverse = track.dataset.direction === "reverse";
      const speed = Number(track.dataset.speed ?? 40);
      // One copy's width = the distance to travel before the loop repeats seamlessly.
      const distance = () => track.scrollWidth / Number(track.dataset.copies);
      const tween = gsap.fromTo(
        track,
        { x: () => (reverse ? -distance() : 0) },
        { x: () => (reverse ? 0 : -distance()), duration: () => distance() / speed, ease: "none", repeat: -1, invalidateOnRefresh: true },
      );
      return tween;
    });

    let hovering = false;
    const setRate = (rate: number, duration = 0.8) => loops.forEach((l) => gsap.to(l, { timeScale: rate, duration, ease: "power2.out", overwrite: true }));
    const rows = root.querySelector<HTMLElement>("[data-rows]")!;
    const hold = () => {
      hovering = true;
      setRate(0);
    };
    const release = () => {
      hovering = false;
      setRate(1);
    };
    // Cursor-following spotlight on the hovered story card.
    const spot = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>("[data-card]");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    rows.addEventListener("pointermove", spot);
    rows.addEventListener("pointerenter", hold);
    rows.addEventListener("pointerleave", release);
    rows.addEventListener("focusin", hold);
    rows.addEventListener("focusout", release);

    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => loops.forEach((l) => (self.isActive ? l.play() : l.pause())),
      // Scrolling briefly speeds the tracks up, then they settle back.
      onUpdate: (self) => {
        if (hovering) return;
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 900, 3);
        loops.forEach((l) => {
          l.timeScale(boost);
          gsap.to(l, { timeScale: 1, duration: 1.2, ease: "power2.out", overwrite: true });
        });
      },
    });

    return () => {
      rows.removeEventListener("pointermove", spot);
      rows.removeEventListener("pointerenter", hold);
      rows.removeEventListener("pointerleave", release);
      rows.removeEventListener("focusin", hold);
      rows.removeEventListener("focusout", release);
    };
  });

  return (
    <section ref={ref} id="testimonials" className={`section section-dark on-dark ${styles.section}`} aria-labelledby="testimonials-title">
      <div className="container">
        <header className="section-head is-split">
          <div className={styles.headMain}>
            <p className="eyebrow" data-anim="fade">
              <span className="eyebrow-index">07</span>
              {TESTIMONIALS.eyebrow}
            </p>
            <h2 id="testimonials-title" className="title-xl" data-anim="lines">
              Trusted by <span className="accent">100+ clinical</span> and financial leaders
            </h2>
          </div>
          <p className="lede section-head-aside" data-anim="fade">
            {TESTIMONIALS.body}
          </p>
        </header>
      </div>

      <div className={styles.rows} data-rows data-anim="fade" tabIndex={0} role="region" aria-label="Client stories (pause by hovering or focusing)">
        <div className={styles.viewport}>
          <div className={styles.track} data-track data-copies={COPIES} data-speed="38">
            {Array.from({ length: COPIES }, (_, copy) => (
              <ul key={copy} className={styles.set} aria-hidden={copy > 0 || undefined}>
                {ITEMS.map((t) => (
                  <li key={t.name}>
                    <StoryCard t={t} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div className={styles.viewport} aria-hidden="true">
          <div className={`${styles.track} ${styles.chipTrack}`} data-track data-copies={COPIES * 2} data-direction="reverse" data-speed="26">
            {Array.from({ length: COPIES * 2 }, (_, copy) => (
              <ul key={copy} className={styles.set}>
                {ITEMS.map((t) => (
                  <li key={t.name} className={styles.chip}>
                    <strong>{t.outcome}</strong>
                    <span>{t.practice}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
