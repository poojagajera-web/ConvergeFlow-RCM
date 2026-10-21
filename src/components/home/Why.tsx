"use client";

import { useRef } from "react";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import { HOME_WHY } from "@/content/site/home";
import type { IconName } from "@/content/site/types";
import { Icon } from "@/components/site/Icon";
import styles from "./Why.module.css";

const ICONS: Record<(typeof HOME_WHY.items)[number]["art"], IconName> = {
  orbit: "users",
  window: "layers",
  tooth: "tooth",
  chain: "link",
  stack: "fileCheck",
  bars: "chart",
};

/**
 * "Why practices choose ConvergeFlow": a sticky panel with a floating glass
 * orb (the mark inside rotating light rings, tilting toward the pointer) and
 * the six reasons as a numbered editorial list whose hairlines draw in.
 */
export function Why() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ motion, desktop }) => {
    if (!motion) return;
    const root = ref.current!;
    gsap.utils.toArray<HTMLElement>("[data-row]", root).forEach((row) => {
      gsap.from(row.querySelector("[data-rule]"), { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: row, start: "top 88%", once: true } });
      gsap.from(row.querySelectorAll("[data-cell]"), { opacity: 0, y: 22, filter: "blur(8px)", duration: 1.1, stagger: 0.08, ease: "power3.out", clearProps: "opacity,transform,filter", scrollTrigger: { trigger: row, start: "top 88%", once: true } });
    });
    if (!desktop) return;
    const orb = root.querySelector<HTMLElement>("[data-orb]")!;
    const rx = gsap.quickTo(orb, "rotationX", { duration: 1, ease: "power3.out" });
    const ry = gsap.quickTo(orb, "rotationY", { duration: 1, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const r = orb.getBoundingClientRect();
      rx(((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * -24);
      ry(((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 30);
    };
    root.addEventListener("pointermove", onMove);
    gsap.fromTo(orb, { y: 60 }, { y: -60, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    return () => root.removeEventListener("pointermove", onMove);
  });

  return (
    <section ref={ref} className={`section ${styles.section}`} aria-labelledby="why-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.sticky}>
          <p className="eyebrow" data-anim="fade">
            Why ConvergeFlow
          </p>
          <h2 id="why-title" className={styles.title} data-anim="words">
            {HOME_WHY.title} <span className="accent-text">{HOME_WHY.accent}</span>
          </h2>
          <p className={styles.intro} data-anim="fade">
            {HOME_WHY.intro}
          </p>
          <div className={styles.orbStage} aria-hidden="true">
            <div className={styles.orb} data-orb>
              <span className={styles.halo} />
              <span className={styles.ring} data-r="1" />
              <span className={styles.ring} data-r="2" />
              <span className={styles.ring} data-r="3" />
              <span className={styles.sphere}>
                <span className={styles.mark} />
                <span className={styles.gloss} />
              </span>
            </div>
            <span className={styles.shadow} />
          </div>
        </div>

        <ol className={styles.list}>
          {HOME_WHY.items.map((it, i) => (
            <li key={it.title} className={styles.row} data-row>
              <span className={styles.rule} data-rule aria-hidden="true" />
              <span className={styles.num} data-cell>
                0{i + 1}
              </span>
              <h3 className={styles.rowTitle} data-cell>
                <span className={styles.rowIcon} aria-hidden="true">
                  <Icon name={ICONS[it.art]} />
                </span>
                {it.title}
              </h3>
              <p className={styles.rowBody} data-cell>
                {it.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
