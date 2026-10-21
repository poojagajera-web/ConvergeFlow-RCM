"use client";

import { useRef, useState, type ReactNode } from "react";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import styles from "./Interactive.module.css";

/* ------------------------------------------------------------------ */
/* Scroll line: a vertical rail that fills as its content scrolls by. */
/* ------------------------------------------------------------------ */
export function ScrollLine({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useMotion(ref, ({ motion }) => {
    const fill = ref.current!.querySelector("[data-line-fill]");
    if (!motion || !fill) return;
    gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 65%", end: "bottom 65%", scrub: true } });
  });
  return (
    <div ref={ref} className={`${styles.scrollLine} ${className}`}>
      <span className={styles.rail} aria-hidden="true">
        <span data-line-fill />
      </span>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tooth chart: ADA Universal numbering with the brochure example.   */
/* ------------------------------------------------------------------ */
const UPPER = Array.from({ length: 16 }, (_, i) => i + 1);
const LOWER = Array.from({ length: 16 }, (_, i) => 32 - i);
const MOLARS = new Set([1, 2, 3, 14, 15, 16, 17, 18, 19, 30, 31, 32]);
const PREMOLARS = new Set([4, 5, 12, 13, 20, 21, 28, 29]);
const EXAMPLE = 30;

function toothKind(n: number) {
  if (MOLARS.has(n)) return "molar";
  if (PREMOLARS.has(n)) return "premolar";
  return "anterior";
}

export function ToothChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [tooth, setTooth] = useState(EXAMPLE);

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    gsap
      .timeline({ scrollTrigger: { trigger: root, start: "top 78%", once: true }, defaults: { ease: "expo.out" } })
      .from(root.querySelectorAll("[data-tooth]"), { opacity: 0, y: 12, scale: 0.6, duration: 0.6, stagger: { each: 0.025, from: "center" }, clearProps: "all" })
      .from(root.querySelectorAll("[data-surface-on]"), { opacity: 0, duration: 0.6, stagger: 0.2 }, 0.8)
      .from(root.querySelector("[data-check]"), { opacity: 0, y: 20, rotation: 2, duration: 0.9, clearProps: "all" }, 0.9);
  });

  const isExample = tooth === EXAMPLE;
  const quadrant = tooth <= 8 ? "Upper right" : tooth <= 16 ? "Upper left" : tooth <= 24 ? "Lower left" : "Lower right";

  const row = (teeth: number[], arch: "upper" | "lower") => (
    <div className={styles.arch} data-arch={arch}>
      {teeth.map((n) => (
        <button
          key={n}
          type="button"
          className={styles.tooth}
          data-kind={toothKind(n)}
          data-tooth
          aria-pressed={tooth === n}
          aria-label={`Tooth ${n}`}
          onClick={() => setTooth(n)}
        >
          <span className={styles.toothShape} aria-hidden="true" />
          <span className={`${styles.toothNum} num`}>{n}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div ref={ref} className={styles.chartWrap}>
      <div className={styles.chart}>
        <p className={styles.chartHead}>
          <span>ADA Universal numbering</span>
          <span className={styles.chartHint}>tap a tooth</span>
        </p>
        {row(UPPER, "upper")}
        <span className={styles.midline} aria-hidden="true" />
        {row(LOWER, "lower")}
        <div className={styles.readout} aria-live="polite">
          <span className={`${styles.readoutNum} num`}>#{tooth}</span>
          <span>
            {quadrant} · {toothKind(tooth)}
          </span>
        </div>
      </div>

      <figure className={styles.check} data-check>
        <figcaption className={styles.checkKicker}>Example check</figcaption>
        <p className={styles.checkTitle}>A restoration on tooth 30 with mesial and occlusal surfaces must match what the clinical record shows.</p>
        <div className={styles.surfaceRow}>
          <svg className={styles.surfaces} viewBox="0 0 120 120" role="img" aria-label="Tooth surfaces: mesial and occlusal treated">
            <path d="M10 10h100L85 35H35z" className={styles.surface} />
            <path d="M10 110h100L85 85H35z" className={styles.surface} />
            <path d="M10 10v100l25-25V35z" className={styles.surface} data-on data-surface-on />
            <path d="M110 10v100L85 85V35z" className={styles.surface} />
            <rect x="35" y="35" width="50" height="50" className={styles.surface} data-on data-surface-on />
            <text x="60" y="26" textAnchor="middle">B</text>
            <text x="60" y="102" textAnchor="middle">L</text>
            <text x="22" y="64" textAnchor="middle">M</text>
            <text x="98" y="64" textAnchor="middle">D</text>
            <text x="60" y="64" textAnchor="middle">O</text>
          </svg>
          <dl className={styles.checkRows}>
            <div>
              <dt>Tooth</dt>
              <dd>30</dd>
            </div>
            <div>
              <dt>Surfaces</dt>
              <dd>M · O</dd>
            </div>
            <div>
              <dt>Chart</dt>
              <dd className={styles.ok}>{isExample ? "Matches ✓" : "Select #30"}</dd>
            </div>
          </dl>
        </div>
        <p className={styles.checkNote}>Illustrative example from the dental billing brochure.</p>
      </figure>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Balance bar: the brochure's illustrative $1,000 claim.             */
/* ------------------------------------------------------------------ */
const PARTS = [
  { key: "plan", label: "Plan pays", amount: 400 },
  { key: "patient", label: "Patient share", amount: 400 },
  { key: "adj", label: "Contractual adjustment", amount: 200 },
];

export function BalanceBar({ note }: { note?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 78%", once: true }, defaults: { ease: "expo.out" } });
    tl.from(root.querySelectorAll("[data-seg]"), { scaleX: 0, transformOrigin: "left center", duration: 1.1, stagger: 0.25, clearProps: "transform" });
    root.querySelectorAll<HTMLElement>("[data-amount]").forEach((el, i) => {
      const target = Number(el.dataset.amount);
      const state = { v: 0 };
      tl.to(state, { v: target, duration: 1.1, ease: "power3.out", onUpdate: () => (el.textContent = `$${Math.round(state.v)}`) }, i * 0.25);
    });
    tl.from(root.querySelector("[data-equation]"), { opacity: 0, y: 12, duration: 0.8 }, 0.9);
  });

  return (
    <div ref={ref} className={styles.balance}>
      <p className={styles.balanceMeta}>
        <span className={styles.badge}>Illustrative example</span>
        $1,000 charge · $800 contract allowance · deductible met · 50% plan benefit
      </p>
      <div className={styles.bar}>
        {PARTS.map((p) => (
          <div key={p.key} className={styles.seg} data-seg data-tone={p.key} style={{ flex: p.amount }}>
            <span className={`${styles.segAmount} num`} data-amount={p.amount}>
              ${p.amount}
            </span>
            <span className={styles.segLabel}>{p.label}</span>
          </div>
        ))}
      </div>
      <p className={styles.equation} data-equation>
        <span className="num">$400</span> + <span className="num">$400</span> + <span className="num">$200</span> = <b className="num">$1,000</b>
      </p>
      {note && <p className={styles.balanceNote}>{note}</p>}
    </div>
  );
}
