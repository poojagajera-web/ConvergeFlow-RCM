"use client";

import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import { onSiteReady } from "@/lib/siteReady";
import { HOME_HERO, HOME_HERO_POINTS } from "@/content/site/home";
import { Icon } from "@/components/site/Icon";
import styles from "./Hero.module.css";

/**
 * Homepage hero: a drifting green and blue aurora that leans toward the
 * pointer, a dot-grid spotlight under the pointer and film grain over
 * everything; the headline tracks in from blur and a band of light sweeps
 * across it.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Pointer spotlight position, and a normalised offset (-0.5…0.5) that pulls the aurora toward the pointer.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  useMotion(ref, ({ motion }) => {
    const root = ref.current!;
    gsap.set(root.querySelectorAll("[data-intro]"), { opacity: 1 });
    if (!motion) return;
    // Paused until the loading screen lifts.
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: true });
    tl.from(root.querySelector("[data-aurora]"), { opacity: 0, scale: 1.15, duration: 2.6 }, 0)
      .from(root.querySelector("[data-pill]"), { opacity: 0, y: -14, filter: "blur(8px)", duration: 1.1, clearProps: "filter,transform" }, 0.15)
      .from(
        root.querySelectorAll("[data-line]"),
        { opacity: 0, yPercent: 35, filter: "blur(18px)", letterSpacing: "0.04em", duration: 1.7, stagger: 0.16, ease: "expo.out", clearProps: "filter,letterSpacing,transform" },
        0.3,
      )
      .from(root.querySelectorAll("[data-rise]"), { opacity: 0, y: 26, filter: "blur(10px)", duration: 1.2, stagger: 0.1, clearProps: "filter,transform" }, 1.0)
      // Keep inline opacity on intro targets: clearing it would let `.js [data-intro]` hide them again.
      .from(root.querySelector("[data-rail]"), { opacity: 0, y: 30, duration: 1.3, clearProps: "transform" }, 1.3);

    gsap.to(root.querySelector("[data-copy]"), {
      yPercent: -12,
      opacity: 0.1,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 },
    });
    return onSiteReady(() => tl.play());
  });

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="home-title">
      <div className={styles.bg} aria-hidden="true">
        <span className={styles.aurora} data-aurora>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.grid} />
        <span className={styles.spot} />
        <span className={styles.vignette} />
      </div>
      <span className={styles.grain} aria-hidden="true" />

      <div className={`container ${styles.copy}`} data-copy>
        <SmartLink href="/services/" className={styles.pill} data-intro data-pill>
          <span className={styles.pillMark} aria-hidden="true" />
          <span>{HOME_HERO.eyebrow}</span>
          <span className={styles.pillSep} aria-hidden="true" />
          <span className={styles.pillDim}>Dental &amp; medical</span>
          <span className={styles.pillGo} aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" />
            </svg>
          </span>
        </SmartLink>

        <h1 id="home-title" className={styles.title} data-intro>
          <span className={styles.line} data-line>
            {HOME_HERO.title}
          </span>
          <span className={`${styles.line} ${styles.lineAccent}`} data-line>
            {HOME_HERO.accent}
          </span>
        </h1>

        <p className={styles.lead} data-intro data-rise>
          {HOME_HERO.lead}
        </p>

        <div className={styles.actions} data-intro data-rise>
          {HOME_HERO.actions.map((a, i) => (
            <ButtonLink key={a.href} href={a.href} variant={i === 0 ? "primary" : "secondary"}>
              {a.label}
            </ButtonLink>
          ))}
        </div>

        <ul className={styles.points} data-intro data-rise>
          {HOME_HERO_POINTS.map((p) => (
            <li key={p}>
              <span className={styles.pointIcon}>
                <Icon name="check" />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className={`container ${styles.bar}`} data-intro data-rail>
        <p className={styles.metaLeft}>
          <span className={styles.liveDot} aria-hidden="true" />
          Starting with OpenDental
        </p>
        <p className={styles.metaRight} aria-hidden="true">
          Scroll <span>to explore</span>
          <svg viewBox="0 0 16 16">
            <path d="M8 3v9.5M4 9l4 4 4-4" />
          </svg>
        </p>
      </div>
    </section>
  );
}
