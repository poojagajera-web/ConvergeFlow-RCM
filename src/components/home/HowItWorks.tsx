"use client";

import { useEffect, useRef, useState } from "react";
import { HOME_STEPS } from "@/content/site/home";
import { Icon } from "@/components/site/Icon";
import styles from "./HowItWorks.module.css";

const ICONS = ["clipboard", "lock", "route", "flag"] as const;

/** Role cursors drifting over each step's card (who is involved at that step). */
const CURSORS: { label: string; tone: "mint" | "amber" | "blue" | "rose"; x: number; y: number }[][] = [
  [
    { label: "Your practice", tone: "amber", x: 14, y: 18 },
    { label: "ConvergeFlow team", tone: "mint", x: 58, y: 70 },
  ],
  [
    { label: "Verification specialist", tone: "mint", x: 52, y: 14 },
    { label: "Your practice", tone: "amber", x: 10, y: 72 },
  ],
  [
    { label: "Coding specialist", tone: "blue", x: 50, y: 20 },
    { label: "A/R specialist", tone: "rose", x: 14, y: 76 },
    { label: "Verification specialist", tone: "mint", x: 62, y: 58 },
  ],
  [
    { label: "ConvergeFlow team", tone: "mint", x: 12, y: 16 },
    { label: "Your practice", tone: "amber", x: 56, y: 74 },
  ],
];

const STEP_MS = 6000;

/**
 * "How does it work?": title and the active step's description on the left;
 * on the right, tabs whose underlines fill as a progress bar, over a large
 * glass card (aurora panel + an illustrative checklist with role cursors).
 * Steps advance automatically while in view, pausing on hover.
 */
export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const steps = HOME_STEPS.steps;

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const step = steps[active];
  const live = running && !paused;

  return (
    <section ref={ref} className={`section ${styles.section}`} aria-labelledby="how-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <p className="eyebrow" data-anim="fade">
            Onboarding
          </p>
          <h2 id="how-title" className={styles.title} data-anim="words">
            {HOME_STEPS.title} <span className="accent-text">{HOME_STEPS.accent}</span>
          </h2>
          <p className={styles.intro} data-anim="fade">
            {HOME_STEPS.intro} Every step, agreed before anything moves.
          </p>
          <div className={styles.now} data-anim="fade" aria-live="polite">
            <p className={styles.nowCount}>
              <span>0{active + 1}</span> / 0{steps.length}
            </p>
            <div className={styles.nowText} key={active}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </div>
        </div>

        <div className={styles.stage} data-anim="fade" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className={styles.tabs} role="tablist" aria-label="Onboarding steps">
            {steps.map((s, i) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={active === i}
                className={styles.tab}
                onClick={() => setActive(i)}
              >
                {s.title}
                <span className={styles.tabBar} aria-hidden="true">
                  <i
                    key={active === i ? `run-${active}` : `idle-${i}`}
                    data-run={active === i || undefined}
                    data-paused={(active === i && !live) || undefined}
                    data-done={i < active || undefined}
                    style={{ animationDuration: `${STEP_MS}ms` }}
                    onAnimationEnd={() => active === i && live && setActive((active + 1) % steps.length)}
                  />
                </span>
              </button>
            ))}
          </div>

          <div className={styles.card} role="tabpanel" aria-label={step.title}>
            <div className={styles.panel} key={`p-${active}`}>
              <span className={styles.aurora} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className={styles.panelGrid} aria-hidden="true" />
              <span className={styles.panelIcon}>
                <Icon name={ICONS[active]} />
              </span>
              <div className={styles.panelText}>
                <p className={styles.panelKicker}>Step {active + 1}</p>
                <p className={styles.panelTitle}>{step.title}</p>
                <p className={styles.panelBody}>{step.card.kicker} confirmed with your practice before work begins.</p>
              </div>
            </div>

            <div className={styles.ui} key={`u-${active}`}>
              <header className={styles.uiHead}>
                <span className={styles.uiMark} aria-hidden="true" />
                <span className={styles.uiTitle}>{step.card.kicker} checklist</span>
                <span className={styles.uiTag}>Illustrative</span>
              </header>
              <ul className={styles.rows}>
                {step.card.rows.map((r, j) => (
                  <li key={r} style={{ ["--j" as string]: j }}>
                    <span className={styles.tick} aria-hidden="true">
                      <Icon name="check" />
                    </span>
                    {r}
                    <span className={styles.rowState}>Agreed</span>
                  </li>
                ))}
              </ul>
              <div className={styles.cursors} aria-hidden="true">
                {CURSORS[active].map((c, k) => (
                  <span key={c.label + k} className={styles.cursor} data-tone={c.tone} style={{ left: `${c.x}%`, top: `${c.y}%`, ["--k" as string]: k }}>
                    <svg viewBox="0 0 16 16">
                      <path d="M2 1.5 13.5 7 8 8.4 5.6 14z" />
                    </svg>
                    <b>{c.label}</b>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
