"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { PIPELINE } from "@/content/home";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import styles from "./Pipeline.module.css";

const STEPS = PIPELINE.steps;
const AUTOPLAY_MS = 6500;

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Choreographs a freshly mounted step panel: words, list, metric, telemetry, log. */
function playPanel(panel: HTMLElement) {
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  const title = panel.querySelector<HTMLElement>("[data-title]");
  let split: SplitText | null = null;
  if (title) {
    split = SplitText.create(title, { type: "words", mask: "words" });
    tl.from(split.words, { yPercent: 110, duration: 0.9, stagger: 0.035 }, 0.05);
  }
  tl.from(panel.querySelectorAll("[data-fade]"), { opacity: 0, y: 16, duration: 0.8, stagger: 0.06 }, 0)
    .from(panel.querySelectorAll("[data-bullet]"), { opacity: 0, x: -10, duration: 0.6, stagger: 0.05 }, 0.25)
    .from(panel.querySelector("[data-ghost]"), { opacity: 0, x: 40, duration: 1.4 }, 0);

  const metric = panel.querySelector<HTMLElement>("[data-metric]");
  if (metric) tl.to(metric, { duration: 1, scrambleText: { text: metric.dataset.metric!, chars: "0123456789.%$K", speed: 0.7 } }, 0.3);

  const term = panel.querySelector<HTMLElement>("[data-terminal]");
  if (term) {
    tl.fromTo(term.querySelector("[data-scan]"), { yPercent: -100, opacity: 1 }, { yPercent: 2400, opacity: 0, duration: 1.4, ease: "power2.in" }, 0.1);
    tl.from(term.querySelectorAll("[data-row]"), { opacity: 0, duration: 0.3, stagger: 0.16 }, 0.2);
    term.querySelectorAll<HTMLElement>("[data-value]").forEach((v, i) => {
      tl.to(v, { duration: 0.9, scrambleText: { text: v.dataset.value!, chars: "0123456789/-.", speed: 0.8, revealDelay: 0.2 } }, 0.25 + i * 0.16);
    });
    const log = term.querySelector<HTMLElement>("[data-log]");
    if (log) {
      const text = log.dataset.log!;
      log.textContent = "";
      tl.to(log, { duration: Math.min(2.2, text.length * 0.022), text: { value: text }, ease: "none" }, 1.0);
    }
    tl.fromTo(term.querySelector("[data-done]"), { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 0.2);
  }
  return () => {
    tl.kill();
    split?.revert();
  };
}

export function Pipeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cometRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(false);
  const interacted = useRef(false);
  const seen = useRef(false);
  const previous = useRef(1);

  const select = useCallback((index: number) => {
    interacted.current = true;
    setPlaying(false);
    setActive(index);
  }, []);

  // Deep links from the Services menu: /#eligibility-verification etc.
  useEffect(() => {
    const fromHash = () => {
      const index = STEPS.findIndex((s) => s.key === window.location.hash.slice(1));
      if (index >= 0) select(index);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [select]);

  useEffect(() => {
    if (!playing || !inView) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % STEPS.length), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [playing, inView, active]);

  // Keep the active station visible inside the scrollable mobile rail.
  useEffect(() => {
    const tab = tabRefs.current[active];
    const rail = tab?.closest<HTMLElement>("[data-rail]");
    if (!tab || !rail || rail.scrollWidth <= rail.clientWidth) return;
    rail.scrollTo({ left: tab.offsetLeft - rail.clientWidth / 2 + tab.offsetWidth / 2, behavior: "smooth" });
  }, [active]);

  // Each step change: comet travels the rail, then the new panel performs.
  useEffect(() => {
    const from = previous.current;
    previous.current = active;
    if (!panelRef.current || !seen.current || reducedMotion()) return;
    const cleanup = playPanel(panelRef.current);
    const comet = cometRef.current;
    let tween: gsap.core.Tween | null = null;
    if (comet && from !== active) {
      const x = (i: number) => `${(i / (STEPS.length - 1)) * 100}%`;
      tween = gsap.fromTo(comet, { left: x(from), opacity: 1 }, { left: x(active), duration: 0.9, ease: "power3.inOut", onComplete: () => void gsap.to(comet, { opacity: 0, duration: 0.4 }) });
    }
    return () => {
      cleanup();
      tween?.kill();
    };
  }, [active]);

  useMotion(sectionRef, ({ motion }) => {
    const root = sectionRef.current!;
    const rail = root.querySelector("[data-rail]");
    if (!motion) {
      seen.current = true;
      return;
    }
    gsap.from(root.querySelectorAll("[data-station]"), { opacity: 0, y: 20, duration: 1, stagger: 0.05, scrollTrigger: { trigger: rail, start: "top 85%", once: true } });
    gsap.from(root.querySelector("[data-track]"), {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.6,
      ease: "power3.inOut",
      scrollTrigger: { trigger: rail, start: "top 85%", once: true },
    });

    // First time the panel is on screen: perform it and start the guided tour.
    ScrollTrigger.create({
      trigger: root.querySelector("[data-panel-wrap]"),
      start: "top 75%",
      end: "bottom 25%",
      onToggle: (self) => {
        setInView(self.isActive);
        if (self.isActive && !seen.current) {
          seen.current = true;
          if (panelRef.current) playPanel(panelRef.current);
          if (!interacted.current) setPlaying(true);
        }
      },
    });
  });

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (e.key in keys) next = (active + keys[e.key] + STEPS.length) % STEPS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = STEPS.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  const step = STEPS[active];
  const progress = active / (STEPS.length - 1);
  const num = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <section ref={sectionRef} id="pipeline" className={`section section-dark on-dark ${styles.section}`} aria-labelledby="pipeline-title">
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        <header className="section-head is-split">
          <div className={styles.headMain}>
            <p className="eyebrow" data-anim="fade">
              <span className="eyebrow-index">02</span>
              {PIPELINE.eyebrow}
            </p>
            <h2 id="pipeline-title" className="title-xl" data-anim="lines">
              {PIPELINE.title}
            </h2>
          </div>
          <div className="section-head-aside" data-anim="fade">
            <p className="lede">{PIPELINE.body}</p>
            <div className={styles.status}>
              <p className={styles.statusValue}>
                <span className="num">{PIPELINE.status.value}</span>
                <span>
                  {PIPELINE.status.label}
                  <small>{PIPELINE.status.sub}</small>
                </span>
              </p>
              <button
                type="button"
                className={styles.tour}
                onClick={() => {
                  interacted.current = true;
                  setPlaying((p) => !p);
                }}
                aria-pressed={playing}
              >
                <span aria-hidden="true" className={styles.tourIcon} data-playing={playing || undefined} />
                {playing ? "Pause tour" : "Play tour"}
              </button>
            </div>
          </div>
        </header>

        <div className={styles.rail} data-rail>
          <div className={styles.railInner}>
            <ol className={styles.groups}>
              {PIPELINE.groups.map((g) => {
                const on = active >= g.range[0] && active <= g.range[1];
                return (
                  <li key={g.label} className={styles.group} data-on={on || undefined} style={{ gridColumn: `${g.range[0] + 1} / ${g.range[1] + 2}` }}>
                    <button type="button" className={styles.groupBtn} onClick={() => select(g.range[0])}>
                      <span className={styles.groupLabel}>{g.label}</span>
                      <span className={styles.groupStat}>{g.stat}</span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className={styles.stationsWrap}>
              <div className={styles.track} aria-hidden="true" data-track>
                <span className={styles.trackFill} style={{ transform: `scaleX(${progress})` }} />
                <span ref={cometRef} className={styles.comet} />
              </div>

              <div className={styles.stations} role="tablist" aria-label="Revenue cycle services">
                {STEPS.map((s, i) => (
                  <button
                    key={s.key}
                    id={s.key}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    aria-controls="pipeline-panel"
                    tabIndex={i === active ? 0 : -1}
                    className={styles.station}
                    data-done={i < active || undefined}
                    data-station
                    onClick={() => select(i)}
                    onKeyDown={onKeyDown}
                  >
                    <span className={styles.dot} aria-hidden="true">
                      {playing && inView && i === active && <span key={active} className={styles.timer} style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />}
                    </span>
                    <span className={`${styles.stationNum} num`}>{num(i)}</span>
                    <span className={styles.stationName}>{s.short}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.panelWrap} data-panel-wrap>
          <div ref={panelRef} id="pipeline-panel" role="tabpanel" aria-labelledby={step.key} className={styles.panel}>
            <div key={step.key} className={styles.panelInner}>
              <span className={`${styles.ghost} num`} aria-hidden="true" data-ghost>
                {num(active)}
              </span>
              <div className={styles.detail}>
                <p className={styles.meta} data-fade>
                  <span>
                    Phase {num(active)} • {step.phase}
                  </span>
                  <span className={styles.protocol}>{step.protocol}</span>
                </p>
                <p className={styles.nameKicker} data-fade>
                  {step.name}
                </p>
                <h3 className={styles.name} data-title>
                  {step.headline}
                </h3>
                <p className={styles.body} data-fade>
                  {step.body}
                </p>
                <ul className={styles.bullets}>
                  {step.bullets.map((b) => (
                    <li key={b} data-bullet>
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path d="m3.5 8.5 3 3 6-7" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className={styles.metric} data-fade>
                  <p className={`${styles.metricValue} num`} data-metric={step.metric.value}>
                    {step.metric.value}
                  </p>
                  <p className={styles.metricLabel}>
                    {step.metric.label}
                    <span>{step.metric.change}</span>
                  </p>
                </div>
              </div>

              <div className={styles.terminal} data-terminal role="group" aria-label={`${step.telemetry.title} sample output`}>
                <span className={styles.scan} aria-hidden="true" data-scan />
                <div className={styles.termHead}>
                  <span className={styles.leds} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className="mono">{step.telemetry.title}</span>
                </div>
                <div className={styles.termStatusRow}>
                  <span className={styles.termStep}>
                    Step {num(active)} / {num(STEPS.length - 1)}
                  </span>
                  <span className={styles.termStatus}>{step.telemetry.status}</span>
                </div>
                <dl className={styles.termRows}>
                  {step.telemetry.rows.map((r) => (
                    <div key={r.label} className={styles.termRow} data-tone={r.tone} data-row>
                      <dt>{r.label}</dt>
                      <dd data-value={r.value}>{r.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className={`${styles.termLog} mono`}>
                  <span aria-hidden="true">&gt;&gt; </span>
                  <span data-log={step.telemetry.log}>{step.telemetry.log}</span>
                  <span className={styles.caret} aria-hidden="true" />
                </p>
                <div className={styles.termFoot} aria-hidden="true">
                  <span className={styles.doneBar}>
                    <span data-done />
                  </span>
                  <span className="mono">200 OK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
