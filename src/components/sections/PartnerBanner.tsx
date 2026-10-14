"use client";

import Image from "next/image";
import { useRef } from "react";
import { INDUSTRIES } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import styles from "./PartnerBanner.module.css";

const PORTALS = [0, 1, 2, 3];
/** Diagram space (600 × 440): team | engine | four portal rows 108 units apart. */
const MID = 220;
const portalY = (i: number) => 58 + i * 108;

/**
 * White-label story: one billing team → the ConvergeFlow engine → four client
 * portals, each under the partner's brand. Work visibly fans out to every
 * portal, which is where the 4× comes from.
 */
export function PartnerBanner() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ motion }) => {
    const root = ref.current!;
    if (!motion) {
      root.dataset.flowing = "true";
      return;
    }
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 72%", once: true }, defaults: { ease: "expo.out" } });
    tl.from(root.querySelectorAll("[data-rise]"), { opacity: 0, y: 28, duration: 1.1, stagger: 0.08 })
      .from(root.querySelector("[data-team]"), { opacity: 0, x: -30, duration: 1 }, 0.2)
      .from(root.querySelectorAll("[data-wire]"), { drawSVG: "0%", duration: 1, stagger: 0.08, ease: "power2.inOut" }, 0.5)
      .from(root.querySelector("[data-engine]"), { opacity: 0, scale: 0.7, duration: 1, ease: "back.out(1.8)" }, 0.6)
      .from(root.querySelectorAll("[data-portal]"), { opacity: 0, x: 30, duration: 0.9, stagger: 0.1 }, 0.9)
      .add(() => void (root.dataset.flowing = "true"), 1.4);

    const mult = root.querySelector<HTMLElement>("[data-multiplier]");
    if (mult) {
      const s = { v: 1 };
      mult.textContent = "1×";
      tl.to(s, { v: 4, duration: 1.8, ease: "power3.inOut", onUpdate: () => (mult.textContent = `${Math.round(s.v)}×`) }, 0.9);
    }
    tl.from(root.querySelectorAll("[data-bar]"), { scaleX: 0, transformOrigin: "left center", duration: 1.6, stagger: 0.25, ease: "power3.inOut" }, 0.9);
  });

  return (
    <aside ref={ref} id="billing-companies" className={`${styles.partner} on-dark`} aria-labelledby="partner-title">
      <div className={styles.copy}>
        <p className="eyebrow" data-rise>
          White-label
        </p>
        <h3 id="partner-title" className={styles.title} data-rise>
          {INDUSTRIES.partner.title}
        </h3>
        <p className={styles.body} data-rise>
          {INDUSTRIES.partner.body}
        </p>

        <div className={styles.stat} data-rise>
          <p className={`${styles.statValue} num`}>
            <span className="visually-hidden">4×</span>
            <span aria-hidden="true" data-multiplier>
              4×
            </span>
          </p>
          <div className={styles.statCompare} role="img" aria-label="Biller output: manual team 1×, with ConvergeFlow 4×">
            <span className={styles.statLabel}>Biller output</span>
            <span className={styles.compareRow}>
              <span>Manual</span>
              <span className={styles.track}>
                <span className={styles.barManual} data-bar />
              </span>
            </span>
            <span className={styles.compareRow}>
              <span>ConvergeFlow</span>
              <span className={styles.track}>
                <span className={styles.barFlow} data-bar />
              </span>
            </span>
          </div>
        </div>

        <div data-rise>
          <ButtonLink href="/#demo">{INDUSTRIES.partner.cta}</ButtonLink>
        </div>
      </div>

      <div className={styles.stage} aria-hidden="true">
      <div className={styles.captions}>
        <span>
          <b className="num">01</b> Your team
        </span>
        <span>
          <b className="num">02</b> Automation engine
        </span>
        <span>
          <b className="num">03</b> Client portals
        </span>
      </div>
      <div className={styles.diagram}>
        <svg className={styles.wires} viewBox="0 0 600 440" preserveAspectRatio="none">
          <path d={`M 122 ${MID} L 214 ${MID}`} className={styles.wire} data-wire />
          <path d={`M 122 ${MID} L 214 ${MID}`} className={styles.flow} pathLength={100} />
          {PORTALS.map((i) => {
            const d = `M 326 ${MID} C 372 ${MID}, 368 ${portalY(i)}, 414 ${portalY(i)}`;
            return (
              <g key={i}>
                <path d={d} className={styles.wire} data-wire />
                <path d={d} className={styles.flow} pathLength={100} style={{ animationDelay: `${0.6 + i * 0.5}s` }} />
              </g>
            );
          })}
        </svg>

        <div className={styles.team} data-team>
          <span className={styles.avatars}>
            <span />
            <span />
            <span />
          </span>
          <strong>Your billing team</strong>
          <small>Same headcount</small>
        </div>

        <div className={styles.engine} data-engine>
          <span className={styles.engineRing} />
          <span className={styles.engineMark}>
            <Image src="/assets/logos/convergeflow-dark.png" alt="" width={1024} height={177} />
          </span>
          <small>ConvergeFlow engine</small>
        </div>

        <ul className={styles.portals}>
          {PORTALS.map((i) => (
            <li key={i} className={styles.portal} data-portal style={{ animationDelay: `${1.1 + i * 0.5}s` }}>
              <span className={styles.portalBar}>
                <span className={styles.portalLogo}>YB</span>
                Your Brand
              </span>
              <span className={styles.portalBody}>
                <span className={styles.portalName}>Practice 0{i + 1}</span>
                <span className={styles.portalStatus}>
                  <span className={styles.portalDot} />
                  <span className={styles.statusText}>Claims flowing</span>
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </aside>
  );
}
