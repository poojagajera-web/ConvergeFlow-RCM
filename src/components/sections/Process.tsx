"use client";

import { useEffect, useRef, useState } from "react";
import { PROCESS } from "@/content/home";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ProcessFrame } from "./ProcessVisuals";
import styles from "./Process.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** Counts the first number inside an element's text, keeping prefix/suffix. */
function countUp(tl: gsap.core.Timeline, el: HTMLElement, at: number) {
  const text = el.dataset.final ?? el.textContent ?? "";
  el.dataset.final = text;
  const m = /[\d,]+(\.\d+)?/.exec(text);
  if (!m) return;
  const target = parseFloat(m[0].replace(/,/g, ""));
  const decimals = m[1] ? m[1].length - 1 : 0;
  const before = text.slice(0, m.index);
  const after = text.slice(m.index + m[0].length);
  const state = { v: 0 };
  const render = () =>
    (el.textContent = `${before}${state.v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${after}`);
  render();
  tl.to(state, { v: target, duration: 1.4, ease: "power3.out", onUpdate: render, onComplete: () => void (el.textContent = text) }, at);
}

/** Brings one implementation frame to life: items, meters, counters, chips, logs. */
function animateFrame(frame: HTMLElement) {
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.from(frame.querySelectorAll("[data-item]"), { opacity: 0, y: 18, duration: 0.8, stagger: 0.08 }, 0.1);
  frame.querySelectorAll<HTMLElement>("[data-meter]").forEach((m) => tl.from(m, { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "power3.inOut" }, 0.3));
  frame.querySelectorAll<HTMLElement>("[data-count]").forEach((c) => countUp(tl, c, 0.3));
  tl.from(frame.querySelectorAll("[data-pop]"), { scale: 0.4, opacity: 0, duration: 0.6, stagger: 0.07, ease: "back.out(2.4)" }, 0.55);
  frame.querySelectorAll<HTMLElement>("[data-log]").forEach((log, i) => {
    const text = log.dataset.log!;
    log.textContent = "";
    tl.to(log, { duration: Math.min(1.4, text.length * 0.02), text: { value: text }, ease: "none" }, 0.7 + i * 0.9);
  });
  return tl;
}

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const motionOn = useRef(false);
  const stageSeen = useRef(false);
  const activeRef = useRef(0);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useMotion(ref, ({ desktop, motion }) => {
    const root = ref.current!;
    motionOn.current = motion;
    const steps = gsap.utils.toArray<HTMLElement>("[data-step]", root);

    if (!desktop) {
      // Stacked layout: each inline frame performs as it scrolls into view.
      if (!motion) return;
      gsap.utils.toArray<HTMLElement>("[data-inline-frame]", root).forEach((frame) => {
        ScrollTrigger.create({ trigger: frame, start: "top 80%", once: true, onEnter: () => void animateFrame(frame) });
      });
      return;
    }

    steps.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(i),
      });
    });

    if (motion) {
      gsap.fromTo(
        root.querySelector("[data-progress]"),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: root.querySelector("[data-steps]"), start: "top 55%", end: "bottom 55%", scrub: true },
        },
      );
      gsap.from(root.querySelector("[data-stage]"), {
        opacity: 0,
        y: 50,
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: {
          trigger: root.querySelector("[data-steps]"),
          start: "top 75%",
          once: true,
          onEnter: () => {
            stageSeen.current = true;
            const frame = root.querySelector<HTMLElement>(`[data-slot="${activeRef.current}"]`);
            if (frame) animateFrame(frame);
          },
        },
      });
    }
  });

  // Desktop stage: the newly active frame performs its data.
  useEffect(() => {
    if (!motionOn.current || !stageSeen.current || !window.matchMedia("(min-width: 1100px)").matches) return;
    const frame = ref.current?.querySelector<HTMLElement>(`[data-slot="${active}"]`);
    if (!frame) return;
    const tl = animateFrame(frame);
    return () => {
      tl.progress(1).kill();
    };
  }, [active]);

  return (
    <section ref={ref} id="how-it-works" className={`section ${styles.section}`} aria-labelledby="process-title">
      <div className="container">
        <header className="section-head is-split">
          <div className={styles.headMain}>
            <p className="eyebrow" data-anim="fade">
              <span className="eyebrow-index">04</span>
              {PROCESS.eyebrow}
            </p>
            <h2 id="process-title" className="title-xl" data-anim="lines">
              Live <span className="accent">automation</span> in weeks, not months
            </h2>
          </div>
          <div className="section-head-aside" data-anim="fade">
            <p className="lede">{PROCESS.body}</p>
          </div>
        </header>

        <div className={styles.layout}>
          <div className={styles.steps} data-steps>
            <span className={styles.rule} aria-hidden="true">
              <span data-progress />
            </span>
            <ol className={styles.stepList}>
              {PROCESS.steps.map((step, i) => (
                <li key={step.tab} className={styles.step} data-step data-active={i === active || undefined} data-done={i < active || undefined}>
                  <p className={styles.when}>
                    <span className={styles.node} aria-hidden="true">
                      <span className="num">{pad(i + 1)}</span>
                    </span>
                    <span className={`${styles.whenIndex} num`}>{pad(i + 1)}</span>
                    <span>{step.tab}</span>
                    <span className={styles.timeline}>{step.timeline}</span>
                  </p>
                  <h3 className={styles.title}>{step.title}</h3>
                  <p className={styles.body}>{step.body}</p>
                  <ul className={styles.features}>
                    {step.features.map((f, fi) => (
                      <li key={f.title}>
                        <span className={`${styles.featureIndex} num`} aria-hidden="true">
                          {pad(fi + 1)}
                        </span>
                        <span className={styles.featureTitle}>{f.title}</span>
                        <span className={styles.featureBody}>{f.body}</span>
                      </li>
                    ))}
                  </ul>
                  <p className={styles.stat}>
                    <span>{step.stat.label}</span>
                    <strong className="num">{step.stat.value}</strong>
                  </p>
                  <div className={styles.inlineFrame} data-inline-frame>
                    <ProcessFrame index={i} system={step.system} badge={step.badge} logs={step.logs} />
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className={styles.stage} aria-label="Implementation preview" data-stage>
            <div className={styles.stageInner}>
              <div className={styles.stageMeta}>
                <span className={styles.counter} aria-hidden="true">
                  <span key={active} className={`${styles.counterNow} num`}>
                    {pad(active + 1)}
                  </span>
                  <span className={styles.counterTotal}>/ {pad(PROCESS.steps.length)}</span>
                </span>
                <span key={`t-${active}`} className={styles.stageTimeline}>
                  {PROCESS.steps[active].timeline}
                </span>
              </div>
              <div className={styles.dots} aria-hidden="true">
                {PROCESS.steps.map((s, i) => (
                  <span key={s.tab} data-on={i <= active || undefined} />
                ))}
              </div>
              <div className={styles.frames}>
                {PROCESS.steps.map((step, i) => (
                  <div key={step.tab} className={styles.frameSlot} data-slot={i} data-on={i === active || undefined} aria-hidden={i !== active}>
                    <ProcessFrame index={i} system={step.system} badge={step.badge} logs={step.logs} />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
