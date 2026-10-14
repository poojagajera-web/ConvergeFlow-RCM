"use client";

import Image from "next/image";
import { useRef } from "react";
import { RESULTS } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import styles from "./Results.module.css";

/** Statement line items, all drawn from RESULTS copy. */
const LINES = [
  { label: "Manual eligibility verification time", note: RESULTS.items[0].body, sign: "−", value: 94, unit: "%" },
  { label: "Initial denial rate", note: RESULTS.items[1].body, sign: "−", value: 31, unit: "%" },
  { label: "Payment turnaround", note: RESULTS.items[2].body, sign: "", value: 14, unit: " days faster" },
];
const SPARK = [8, 12, 15, 19, 22, 26, 29, 32, 35, 38, 40, 42];

/**
 * Outcomes on one screen: the $42K headline card on the left, a board-ready
 * statement on the right whose lines print in, tally up, and get stamped.
 */
export function Results() {
  const ref = useRef<HTMLElement>(null);
  const { hero } = RESULTS;

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;

    // Feature card: number counts, sparkline bars rise.
    const card = gsap.timeline({ scrollTrigger: { trigger: root.querySelector("[data-feature]"), start: "top 82%", once: true }, defaults: { ease: "expo.out" } });
    card.from(root.querySelector("[data-feature]"), { opacity: 0, y: 40, duration: 1.2 });
    card.from(root.querySelectorAll("[data-spark]"), { scaleY: 0, transformOrigin: "bottom", duration: 0.8, stagger: 0.05 }, 0.3);
    const hv = root.querySelector<HTMLElement>("[data-hero-count]");
    if (hv) {
      const s = { v: 0 };
      hv.textContent = "0";
      card.to(s, { v: hero.value, duration: 1.8, ease: "power3.out", onUpdate: () => (hv.textContent = String(Math.round(s.v))) }, 0.2);
    }

    // Statement: rise, print each line, tally, total, stamp.
    const doc = root.querySelector<HTMLElement>("[data-statement]")!;
    const tl = gsap.timeline({ scrollTrigger: { trigger: doc, start: "top 80%", once: true }, defaults: { ease: "expo.out" } });
    tl.from(doc, { y: 70, rotation: -2, opacity: 0, duration: 1.3, transformOrigin: "50% 100%" }).from(
      doc.querySelectorAll("[data-head]"),
      { opacity: 0, y: 10, duration: 0.7, stagger: 0.08 },
      0.35,
    );
    doc.querySelectorAll<HTMLElement>("[data-line]").forEach((line, i) => {
      const at = 0.6 + i * 0.32;
      tl.fromTo(line, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.out", clearProps: "clipPath" }, at);
      const v = line.querySelector<HTMLElement>("[data-tally]");
      if (v) {
        const target = Number(v.dataset.tally);
        const s = { v: 0 };
        v.textContent = "0";
        tl.to(s, { v: target, duration: 1.1, ease: "power2.out", onUpdate: () => (v.textContent = String(Math.round(s.v))) }, at + 0.15);
      }
    });
    tl.from(doc.querySelector("[data-total]"), { opacity: 0, y: 12, duration: 0.7 }, 1.7)
      .fromTo(doc.querySelector("[data-total-bar]"), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power3.inOut" }, 1.8)
      .fromTo(doc.querySelector("[data-stamp]"), { scale: 1.9, rotation: -28, opacity: 0 }, { scale: 1, rotation: -12, opacity: 1, duration: 0.45, ease: "power4.in" }, 2.3)
      .fromTo(doc, { x: 0 }, { x: 3, duration: 0.05, yoyo: true, repeat: 3, ease: "none", clearProps: "x" }, 2.75);
  });

  return (
    <section ref={ref} id="results" className={`section ${styles.section}`} aria-labelledby="results-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.left}>
          <p className="eyebrow" data-anim="fade">
            <span className="eyebrow-index">06</span>
            {RESULTS.eyebrow}
          </p>
          <h2 id="results-title" className={styles.title} data-anim="lines">
            The numbers your <span className="accent">CFO and board</span> want to see
          </h2>
          <p className={styles.lede} data-anim="fade">
            {RESULTS.body}
          </p>

          <div className={`${styles.feature} on-dark`} data-feature>
            <div className={styles.featureTop}>
              <p className={styles.featureLabel}>{hero.label}</p>
              <div className={styles.spark} aria-hidden="true">
                {SPARK.map((v, i) => (
                  <span key={i} style={{ height: `${(v / 42) * 100}%` }} data-spark data-last={i === SPARK.length - 1 || undefined} />
                ))}
              </div>
            </div>
            <p className={`${styles.featureValue} num`}>
              <span className="visually-hidden">{`${hero.prefix}${hero.value}${hero.suffix}`}</span>
              <span aria-hidden="true">
                <span className={styles.unit}>{hero.prefix}</span>
                <span data-hero-count>{hero.value}</span>
                <span className={styles.unit}>{hero.suffix}</span>
              </span>
            </p>
            <h3 className={styles.featureTitle}>{hero.title}</h3>
            <p className={styles.featureBody}>{hero.body}</p>
          </div>

          <div className={styles.actions} data-anim="fade">
            <ul className={styles.badges}>
              {hero.footer.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <ButtonLink href="/#demo">{RESULTS.cta}</ButtonLink>
          </div>
        </div>

        <div className={styles.paperWrap}>
          <article className={styles.statement} data-statement aria-label="Outcome statement">
            <header className={styles.docHead}>
              <div className={styles.docTop} data-head>
                <span className={styles.docTitle}>Outcome statement</span>
                <Image src="/assets/logos/convergeflow-light.png" alt="ConvergeFlow" width={1024} height={177} style={{ width: 118, height: "auto" }} />
              </div>
              <span className={styles.docMeta} data-head>
                Audited practice ROI · {hero.footer[0]}
              </span>
            </header>

            <div className={styles.docCols} aria-hidden="true">
              <span>Line item</span>
              <span>Result</span>
            </div>

            <dl className={styles.lines}>
              {LINES.map((l, i) => (
                <div key={l.label} className={styles.line} data-line>
                  <dt>
                    <span className={`${styles.lineIndex} num`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.lineText}>
                      <span className={styles.lineLabel}>{l.label}</span>
                      <span className={styles.lineNote}>{l.note}</span>
                    </span>
                  </dt>
                  <span className={styles.leader} aria-hidden="true" />
                  <dd className="num">
                    <span className="visually-hidden">{`${l.sign}${l.value}${l.unit}`}</span>
                    <span aria-hidden="true">
                      {l.sign}
                      <span data-tally={l.value}>{l.value}</span>
                      <span className={styles.lineUnit}>{l.unit}</span>
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className={styles.total} data-total>
              <span className={styles.totalLabel}>Time to measurable ROI</span>
              <span className={`${styles.totalValue} num`}>60–90 days</span>
              <span className={styles.totalBar} data-total-bar aria-hidden="true" />
            </div>

            <footer className={styles.docFoot}>
              <span className={styles.sign}>
                <span className={styles.signLine} />
                ConvergeFlow revenue operations
              </span>
              <span className={styles.stamp} data-stamp>
                <span>90-Day</span>
                <strong>ROI</strong>
                <span>Guarantee</span>
              </span>
            </footer>
          </article>
        </div>
      </div>
    </section>
  );
}
