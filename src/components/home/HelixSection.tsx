"use client";

import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import { liveHref } from "@/content/navigation";
import { HOME_HELIX } from "@/content/site/home";
import { STAGES } from "@/content/site/services";
import type { IconName } from "@/content/site/types";
import { ParticleSphere } from "@/components/fx/ParticleSphere";
import { Icon } from "@/components/site/Icon";
import { SectionHead } from "@/components/site/Title";
import styles from "./HelixSection.module.css";

const STAGE_ICONS: IconName[] = ["id", "shield", "fileCheck", "tooth", "send", "coins", "refresh", "chart"];
const YS = [70, 210, 350, 490];
/* One stage per comet run (the comet, its tail and the core flash loop every 3s in CSS) */
const CYCLE_MS = 3000;

/** Curves from each stage chip into the core (viewBox 1200 × 560). */
/* chips fill 92% of a third of the width, so their inner edges sit at x = 368 and 832 */
const LEFT_PATHS = YS.map((y) => `M 368 ${y} C 470 ${y}, 500 280, 600 280`);
const RIGHT_PATHS = YS.map((y) => `M 832 ${y} C 730 ${y}, 700 280, 600 280`);
const LINKS = [...LEFT_PATHS.map((d) => ({ d, side: "l" })), ...RIGHT_PATHS.map((d) => ({ d, side: "r" }))];

/**
 * "Our specialists own the work": a rotating particle globe at the centre;
 * the eight stages feed streams of light into the ConvergeFlow core, and the
 * three specialist teams sit beneath. One stage at a time is lit: its chip
 * glows, a comet glides down its stream and the white core flashes as it
 * lands. Hovering or focusing a chip holds it.
 */
export function HelixSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const [hold, setHold] = useState(false);
  const left = STAGES.slice(0, 4);
  const right = STAGES.slice(4);

  // Cycle through the stages only while the scene is on screen.
  useEffect(() => {
    const scene = ref.current?.querySelector("[data-scene]");
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 0.25 });
    io.observe(scene);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running || hold) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % STAGES.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [running, hold]);

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.querySelector("[data-scene]"), start: "top 75%", once: true } });
    tl.from(root.querySelector("[data-globe]"), { opacity: 0, scale: 0.6, filter: "blur(20px)", duration: 1.8, ease: "power3.out", clearProps: "opacity,transform,filter" }, 0)
      .from(root.querySelectorAll("[data-wire]"), { drawSVG: "0%", duration: 1.4, stagger: 0.06, ease: "power2.inOut" }, 0.5)
      .from(root.querySelectorAll("[data-chip-l]"), { opacity: 0, x: -40, filter: "blur(8px)", duration: 1, stagger: 0.1, ease: "power3.out", clearProps: "opacity,transform,filter" }, 0.4)
      .from(root.querySelectorAll("[data-chip-r]"), { opacity: 0, x: 40, filter: "blur(8px)", duration: 1, stagger: 0.1, ease: "power3.out", clearProps: "opacity,transform,filter" }, 0.4);
  });

  const holdOn = (i: number) => () => {
    setActive(i);
    setHold(true);
  };
  const holdOff = () => setHold(false);

  const chip = (s: (typeof STAGES)[number], i: number, side: "l" | "r") => {
    const href = liveHref(s.href);
    const text = (
      <>
        <span className={styles.chipNum}>0{i + 1}</span>
        {s.label}
      </>
    );
    return (
      <li
        key={s.href}
        className={styles.chip}
        data-side={side}
        data-active={active === i || undefined}
        {...{ [`data-chip-${side}`]: "" }}
        onPointerEnter={holdOn(i)}
        onPointerLeave={holdOff}
      >
        <span className={styles.chipIcon}>
          <Icon name={STAGE_ICONS[i]} />
        </span>
        {href ? (
          <SmartLink href={href} className={`${styles.chipText} ${styles.chipLink}`} onFocus={holdOn(i)} onBlur={holdOff}>
            {text}
          </SmartLink>
        ) : (
          <span className={styles.chipText}>{text}</span>
        )}
        <svg className={styles.chipArrow} viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 8h9M8.5 4l4 4-4 4" />
        </svg>
        <span className={styles.chipPort} aria-hidden="true" />
      </li>
    );
  };

  return (
    <section ref={ref} className={`section ${styles.section}`} aria-labelledby="helix-title">
      <span className={styles.glow} aria-hidden="true" />
      <div className="container">
        <SectionHead id="helix-title" eyebrow={HOME_HELIX.eyebrow} title={HOME_HELIX.title} accent={HOME_HELIX.accent} intro={HOME_HELIX.body} align="center" />

        <div className={styles.scene} data-scene>
          <svg className={styles.links} viewBox="0 0 1200 560" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="helix-l" x1="0" x2="1">
                <stop offset="0" stopColor="#8ff0e2" stopOpacity="0.05" />
                <stop offset="1" stopColor="#8ff0e2" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="helix-r" x1="1" x2="0">
                <stop offset="0" stopColor="#8ff0e2" stopOpacity="0.05" />
                <stop offset="1" stopColor="#8ff0e2" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="helix-lh" x1="0" x2="1">
                <stop offset="0" stopColor="#8ff0e2" stopOpacity="0.55" />
                <stop offset="1" stopColor="#eafffb" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="helix-rh" x1="1" x2="0">
                <stop offset="0" stopColor="#8ff0e2" stopOpacity="0.55" />
                <stop offset="1" stopColor="#eafffb" stopOpacity="1" />
              </linearGradient>
            </defs>
            {LINKS.map((p, i) => (
              <g key={i} className={styles.link} data-active={active === i || undefined}>
                <path d={p.d} className={styles.wire} stroke={`url(#helix-${p.side})`} data-wire />
                <path d={p.d} className={styles.wireHot} stroke={`url(#helix-${p.side}h)`} />
                <path d={p.d} className={styles.flow} style={{ animationDelay: `${(i % 4) * -0.7 - (i > 3 ? 0.35 : 0)}s` }} />
                {active === i && (
                  <g key={`c-${active}`}>
                    <path d={p.d} className={styles.cometTail} pathLength={100} />
                    <path d={p.d} className={styles.comet} pathLength={100} />
                  </g>
                )}
              </g>
            ))}
          </svg>

          <ul className={styles.col} data-col="l">
            {left.map((s, i) => chip(s, i, "l"))}
          </ul>

          <div className={styles.globeWrap} data-globe aria-hidden="true">
            <span className={styles.halo} />
            <span className={styles.ticks} />
            <span className={styles.orbit} />
            <span className={styles.orbit} data-o="2" />
            <ParticleSphere className={styles.globe} />
            <span className={styles.core}>
              <span className={styles.corePulse} />
              <span className={styles.corePulse} data-d="2" />
              <span className={styles.coreFlash} key={active} />
              <span className={styles.coreDisc}>
                <span className={styles.coreMark} />
              </span>
            </span>
          </div>

          <ul className={styles.col} data-col="r">
            {right.map((s, i) => chip(s, i + 4, "r"))}
          </ul>
        </div>

        <ul className={styles.roles} data-anim="stagger">
          {HOME_HELIX.roles.map((r, i) => (
            <li key={r.title} className={styles.role} data-glow>
              <span className={styles.roleSpot} aria-hidden="true" />
              <span className={styles.roleEdge} aria-hidden="true" />
              <span className={styles.roleTop}>
                <span className={styles.roleIcon}>
                  <Icon name={r.icon} />
                </span>
                <span className={styles.roleNum} aria-hidden="true">
                  0{i + 1}
                </span>
              </span>
              <b className={styles.roleTitle}>{r.title}</b>
              <span className={styles.roleBody}>{r.body}</span>
            </li>
          ))}
        </ul>

        <div className={styles.actions} data-anim="fade">
          <ButtonLink href="/demo/">Request a Demo</ButtonLink>
          <ButtonLink href="/how-it-works/" variant="secondary">
            How it works
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
