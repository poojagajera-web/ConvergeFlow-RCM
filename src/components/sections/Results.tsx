"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { RESULTS } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./Results.module.css";

const CARDS = RESULTS.cards ?? [];
const DEFS = ["Baseline period", "Reporting scope", "Review dates", "Measure definition"];
const CYCLE_MS = 5200;
const pad = (n: number) => String(n).padStart(2, "0");

/* Chart outlines for each measure — shapes only, never values. */
function Chart({ kind }: { kind: number }) {
  if (kind === 0)
    return (
      <div className={styles.chart}>
        <div className={styles.legend}>
          <span data-key="a">Entering the queue</span>
          <span data-key="b">Waiting for attention</span>
        </div>
        <div className={styles.groups}>
          {[
            [62, 40],
            [74, 46],
            [58, 52],
            [80, 44],
            [66, 38],
            [72, 50],
          ].map(([a, b], i) => (
            <span key={i} className={styles.group}>
              <i data-key="a" style={{ height: `${a}%` }} data-grow />
              <i data-key="b" style={{ height: `${b}%` }} data-grow />
            </span>
          ))}
        </div>
      </div>
    );
  if (kind === 1)
    return (
      <div className={styles.chart}>
        <ul className={styles.items}>
          {[
            { id: "Claim 0002", tag: "Correction", tone: "review", owner: "Billing" },
            { id: "Claim 0005", tag: "Denial", tone: "alert", owner: "Billing" },
            { id: "Claim 0007", tag: "Correction", tone: "review", owner: "Front desk" },
          ].map((r) => (
            <li key={r.id} data-grow>
              <span className={styles.itemId}>{r.id}</span>
              <span className={styles.itemTag} data-tone={r.tone}>
                {r.tag}
              </span>
              <span className={styles.itemOwner}>{r.owner}</span>
              <span className={styles.itemNext}>Next step</span>
            </li>
          ))}
        </ul>
      </div>
    );
  if (kind === 2)
    return (
      <div className={styles.chart}>
        <svg className={styles.line} viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="mp-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#0ca394" stopOpacity="0.22" />
              <stop offset="1" stopColor="#0ca394" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className={styles.lineFill} d="M0 120 C 60 112, 90 70, 140 78 S 230 110, 280 72 S 360 44, 400 50 V160 H0z" />
          <path className={styles.lineStroke} data-draw d="M0 120 C 60 112, 90 70, 140 78 S 230 110, 280 72 S 360 44, 400 50" />
        </svg>
      </div>
    );
  return (
    <div className={styles.chart}>
      <div className={styles.aging}>
        {["0–30", "31–60", "61–90", "90+"].map((l, i) => (
          <span key={l} className={styles.bucket}>
            <i style={{ height: `${[78, 58, 38, 26][i]}%` }} data-older={i > 1 || undefined} data-grow />
            <b>{l}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * "Measure the work": a light measurement viewer. The four approved measures
 * are tabs; each shows a chart outline and the definitions still to agree.
 */
export function Results() {
  const ref = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const paused = useRef(false);

  useMotion(ref, ({ motion }) => {
    const root = ref.current!;
    const board = root.querySelector<HTMLElement>("[data-board]")!;
    if (!motion) return;
    gsap.fromTo(board, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.3, ease: "expo.out", clearProps: "opacity,transform", scrollTrigger: { trigger: board, start: "top 82%", once: true } });
    ScrollTrigger.create({ trigger: board, start: "top 75%", end: "bottom 25%", onToggle: (self) => setPlaying(self.isActive) });
  });

  // Auto-advance through the measures while the board is in view.
  useEffect(() => {
    if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % CARDS.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [playing]);

  // Chart entrance on every change of measure.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const paths = panel.querySelectorAll<SVGPathElement>("[data-draw]");
    paths.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(panel.querySelectorAll("[data-swap]"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 })
      .fromTo(panel.querySelectorAll("[data-grow]"), { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out", clearProps: "transform,opacity" }, 0.1)
      .to(paths, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 0.1)
      .fromTo(panel.querySelectorAll("[data-def]"), { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, clearProps: "opacity,transform" }, 0.2);
    return () => {
      tl.progress(1).kill();
    };
  }, [active]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (active + step + CARDS.length) % CARDS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const card = CARDS[active];

  return (
    <section ref={ref} id="results" className={`section ${styles.section}`} aria-labelledby="results-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.left}>
          <p className="eyebrow" data-anim="fade">
            {RESULTS.eyebrow}
          </p>
          <h2 id="results-title" className={styles.title} data-anim="lines">
            {RESULTS.heading}
          </h2>
          <p className={styles.lede} data-anim="fade">
            {RESULTS.intro}
          </p>
          {RESULTS.primary && (
            <div data-anim="fade">
              <ButtonLink href={RESULTS.primary.url}>{RESULTS.primary.label}</ButtonLink>
            </div>
          )}
        </div>

        <figure
          className={styles.board}
          data-board
          aria-label="Illustrative measurement plan"
          onPointerEnter={() => (paused.current = true)}
          onPointerLeave={() => (paused.current = false)}
          onFocus={() => (paused.current = true)}
          onBlur={() => (paused.current = false)}
        >
          <div className={styles.boardHead}>
            <span className={styles.boardTitle}>
              <Image src="/assets/logos/convergeflow-mark-onlight.png" alt="" width={180} height={180} />
              Measurement plan
            </span>
            <span className={styles.boardTag}>Draft</span>
          </div>

          <div className={styles.tabs} role="tablist" aria-label="Measures">
            {CARDS.map((c, i) => (
              <button
                key={c.title}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`measure-tab-${i}`}
                aria-selected={i === active}
                aria-controls="measure-panel"
                tabIndex={i === active ? 0 : -1}
                className={styles.tab}
                onClick={() => setActive(i)}
                onKeyDown={onKeyDown}
              >
                <span className={`${styles.tabIndex} num`}>{pad(i + 1)}</span>
                <span className={styles.tabLabel}>{c.title}</span>
                <span className={styles.tabBar} aria-hidden="true">
                  <span key={i === active ? `on-${active}` : "off"} data-run={(i === active && playing) || undefined} />
                </span>
              </button>
            ))}
          </div>

          <div ref={panelRef} id="measure-panel" role="tabpanel" aria-labelledby={`measure-tab-${active}`} className={styles.panel}>
            <div className={styles.main}>
              <div className={styles.mainHead} data-swap>
                <h3 className={styles.measureTitle}>{card?.title}</h3>
                <p className={styles.measureBody}>{card?.body}</p>
              </div>
              <div className={styles.chartWrap} data-swap>
                <span className={styles.baselineTag}>Baseline — to be agreed</span>
                <Chart kind={active} />
              </div>
            </div>
            <aside className={styles.defs} aria-label="Definitions to agree">
              <p className={styles.defsTitle}>Definitions to agree</p>
              <ul>
                {DEFS.map((d) => (
                  <li key={d} data-def>
                    <span className={styles.defBox} aria-hidden="true" />
                    <span className={styles.defName}>{d}</span>
                    <span className={styles.defState}>To agree</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <figcaption className={styles.boardFoot}>Illustrative · chart outlines only, not results</figcaption>
        </figure>
      </div>
    </section>
  );
}
