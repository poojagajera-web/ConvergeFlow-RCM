"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HERO, TRUST, INDUSTRIES } from "@/content/home";
import { liveHref } from "@/content/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { WorkspacePreview } from "@/components/product/WorkspacePreview";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { HeroGridCells } from "./HeroGridCells";
import styles from "./Hero.module.css";

/** The four approved review areas feed the workspace. */
const AREA_CARDS = TRUST.cards ?? [];
const AREAS = AREA_CARDS.map((c) => c.title);
/** Which workspace tab each review area opens (queue, eligibility, claims, audit). */
const AREA_TAB = [0, 1, 2, 4];
const TAB_AREA = [0, 1, 2, 2, 3];
const CYCLE_MS = 3600;
const ROW = 300 / Math.max(AREAS.length, 1);
const route = (i: number) => {
  const y = ROW / 2 + i * ROW;
  return `M0 ${y} C 210 ${y}, 190 150, 400 150`;
};

const audienceHref = (label: string) => liveHref((INDUSTRIES.cards ?? []).find((c) => c.title === label)?.url ?? "");

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [tab, setTab] = useState(0);
  const lane = TAB_AREA[tab] ?? 0;
  const [cycling, setCycling] = useState(false);
  const paused = useRef(false);

  // Step through the review areas while the hero is visible (motion allowed, not hovered).
  useEffect(() => {
    if (!cycling) return;
    const id = window.setInterval(() => {
      if (!paused.current) setTab((t) => AREA_TAB[((TAB_AREA[t] ?? 0) + 1) % AREAS.length]);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [cycling]);

  useMotion(ref, ({ motion, desktop }) => {
    const root = ref.current!;
    const intro = root.querySelectorAll<HTMLElement>("[data-intro]");
    if (!motion) {
      gsap.set(intro, { autoAlpha: 1 });
      return;
    }

    ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top", onToggle: (self) => setCycling(self.isActive) });
    const paths = root.querySelectorAll<SVGPathElement>("[data-route]");
    gsap.set(paths, { drawSVG: "0%" });
    // Hand visibility from the pre-paint CSS to GSAP before any .from() reads its end values.
    gsap.set(intro, { autoAlpha: 1 });

    const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
    const title = root.querySelector<HTMLElement>("h1")!;
    tl.from(root.querySelector("[data-eyebrow]"), { autoAlpha: 0, y: 12, duration: 0.9 });

    let titleAdded = false;
    SplitText.create(title, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        self.masks.forEach((m) => m.classList.add("split-line-mask"));
        const t = gsap.from(self.lines, { yPercent: 110, duration: 1.4, stagger: 0.12, ease: "expo.out", paused: titleAdded });
        if (!titleAdded) tl.add(t, 0.2);
        titleAdded = true;
        return t;
      },
    });

    tl.from(root.querySelectorAll("[data-intro-rise]"), { autoAlpha: 0, y: 24, duration: 1.1, stagger: 0.08 }, 0.65)
      .from(
        root.querySelector("[data-tilt]"),
        { autoAlpha: 0, y: 90, rotationX: 24, transformPerspective: 1600, transformOrigin: "50% 0%", duration: 1.8 },
        0.8,
      )
      .from(root.querySelector("[data-flow-title]"), { autoAlpha: 0, y: 12, duration: 1 }, 0.9)
      .from(root.querySelectorAll("[data-area]"), { autoAlpha: 0, x: -24, duration: 0.9, stagger: 0.08, clearProps: "opacity,visibility,transform" }, 1.0)
      .to(paths, { drawSVG: "100%", duration: 1.4, stagger: 0.06, ease: "power2.inOut" }, 1.1)
      .from(root.querySelector("[data-node]"), { scale: 0.6, autoAlpha: 0, duration: 1, ease: "back.out(1.6)" }, 1.6);

    if (desktop) {
      gsap.to(root.querySelector("[data-hero-copy]"), {
        yPercent: -14,
        autoAlpha: 0.35,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "45% top", scrub: true },
      });

      // Pointer-driven depth on the illustrative workspace.
      const card = root.querySelector<HTMLElement>("[data-tilt-inner]")!;
      gsap.set(card, { transformPerspective: 1800 });
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.9, ease: "power3.out" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.9, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 5);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 4);
      };
      const onLeave = () => {
        rx(0);
        ry(0);
      };
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      return () => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
      };
    }
  });

  return (
    <section ref={ref} className={`${styles.hero} on-dark`} aria-labelledby="hero-title">
      <HeroGridCells />
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy} data-hero-copy>
          <p className="eyebrow" data-intro data-eyebrow>
            {HERO.eyebrow}
          </p>
          <h1 id="hero-title" className={styles.title} data-intro>
            {HERO.heading}
          </h1>
          <div className={styles.under}>
            <div className={styles.leadCol} data-intro data-intro-rise>
              <p className={styles.lede}>{HERO.intro}</p>
              {HERO.badges && (
                <ul className={styles.audience} aria-label="Practice types to explore">
                  {HERO.badges.map((b) => {
                    const href = audienceHref(b);
                    return (
                      <li key={b}>
                        {href ? (
                          <SmartLink href={href} className={styles.audienceChip}>
                            {b}
                          </SmartLink>
                        ) : (
                          <span className={styles.audienceChip}>{b}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className={styles.ctas} data-intro data-intro-rise>
              {HERO.primary && <ButtonLink href={HERO.primary.url}>{HERO.primary.label}</ButtonLink>}
              {HERO.secondary && (
                <ButtonLink href={HERO.secondary.url} variant="secondary">
                  {HERO.secondary.label}
                </ButtonLink>
              )}
            </div>
          </div>
        </div>

        <div className={styles.flow}>
          <div
            className={styles.sources}
            data-intro
            onPointerEnter={() => (paused.current = true)}
            onPointerLeave={() => (paused.current = false)}
            onFocus={() => (paused.current = true)}
            onBlur={() => (paused.current = false)}
          >
            <h2 className={styles.sourcesLabel} data-flow-title>
              {TRUST.heading}
            </h2>
            <ul className={styles.payers}>
              {AREA_CARDS.map((area, i) => (
                <li key={area.title} data-area data-active={i === lane || undefined}>
                  <button type="button" className={styles.laneBtn} aria-pressed={i === lane} onClick={() => setTab(AREA_TAB[i])} title={area.body}>
                    <span className={styles.payerName}>{area.title}</span>
                    <span className={styles.payerDot} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <svg className={styles.routes} viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true" data-intro>
            {AREAS.map((area, i) => (
              <g key={area} data-lane-active={i === lane || undefined}>
                <path d={route(i)} className={styles.route} data-route />
                <path d={route(i)} pathLength={100} className={styles.glint} />
              </g>
            ))}
          </svg>

          <div className={styles.node} data-intro data-node aria-hidden="true">
            <span className={styles.nodeMark}>
              <span className={styles.orbit} />
              <span className={styles.nodeLogo}>
                <Image src="/assets/logos/convergeflow-mark.png" alt="" width={180} height={180} priority />
              </span>
            </span>
            <span className={styles.beamTrack} />
          </div>

          <div className={styles.consoleSlot} data-intro data-console>
            <div data-tilt>
              <div data-tilt-inner className={styles.tiltInner}>
                <WorkspacePreview active={tab} onChange={setTab} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
