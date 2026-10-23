"use client";

import { useRef } from "react";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import { HOME_FACTS } from "@/content/site/home";
import type { IconName } from "@/content/site/types";
import { Icon } from "@/components/site/Icon";
import { Aurora } from "@/components/fx/Aurora";
import { setFloodOrigin } from "@/components/fx/flood";
import styles from "./Facts.module.css";

const ICONS: IconName[] = ["route", "users", "clock", "chart"];
const TAGS = ["Managed", "Accountable", "Documented"];

/**
 * "From the chair to a closed account": over drifting green and blue light,
 * an editorial statement whose words light up as it scrolls through, then
 * four tall numbered glass cards. Hovering a card floods it white from the
 * pointer (dark text, teal accents) and draws a mint line along its top edge.
 */
export function Facts() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    const cards = gsap.utils.toArray<HTMLElement>("[data-fact]", root);
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.querySelector("[data-cards]"), start: "top 82%", once: true } });
    tl.from(cards, { opacity: 0, y: 90, rotateX: 18, filter: "blur(10px)", duration: 1.4, stagger: 0.12, ease: "expo.out", clearProps: "opacity,transform,filter" });
    cards.forEach((card, i) => {
      const el = card.querySelector<HTMLElement>("[data-value]")!;
      const text = el.dataset.value!;
      if (/^\d+$/.test(text)) {
        const state = { v: 0 };
        el.textContent = "0";
        tl.to(state, { v: Number(text), duration: 1.6, ease: "power2.out", onUpdate: () => (el.textContent = String(Math.round(state.v))) }, 0.4 + i * 0.12);
      } else {
        tl.to(el, { duration: 1.4, scrambleText: { text, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", speed: 0.6, revealDelay: 0.2 } }, 0.4 + i * 0.12);
      }
    });
  });

  return (
    <section ref={ref} className={`section ${styles.section}`} aria-labelledby="facts-title">
      {/* Green at half the hero's strength */}
      <Aurora green={0.5} className={styles.aurora} />
      <div className={`container ${styles.head}`}>
        <ul className={styles.tags} data-anim="stagger" aria-hidden="true">
          {TAGS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <h2 id="facts-title" className={styles.statement} data-anim="scrub">
          {HOME_FACTS.title} <span className={styles.accent}>{HOME_FACTS.accent}</span> {HOME_FACTS.intro}
        </h2>
      </div>

      <ul className={`container ${styles.cards}`} data-cards>
        {HOME_FACTS.cells.map((c, i) => (
          <li key={c.label} className={styles.card} data-fact data-glow onPointerEnter={setFloodOrigin} onPointerLeave={setFloodOrigin}>
            <span className={styles.fill} aria-hidden="true" />
            <span className={styles.glow} aria-hidden="true" />
            <span className={styles.edge} aria-hidden="true" />
            <header className={styles.cardTop}>
              <span className={styles.num}>0{i + 1}</span>
              <span className={styles.icon} aria-hidden="true">
                <Icon name={ICONS[i]} />
              </span>
            </header>
            <h3 className={styles.label}>{c.label}</h3>
            <p className={styles.value} data-value={c.value}>
              {c.value}
            </p>
            <p className={styles.detail}>{c.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
