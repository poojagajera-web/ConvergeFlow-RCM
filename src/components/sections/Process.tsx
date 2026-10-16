"use client";

import { useEffect, useRef, useState } from "react";
import { STEPS } from "@/content/home";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ProcessFrame } from "./ProcessVisuals";
import styles from "./Process.module.css";

const LIST = STEPS.steps ?? [];
const pad = (n: number) => String(n).padStart(2, "0");

/** Brings one illustrative frame in: items rise, check boxes pop. */
function animateFrame(frame: HTMLElement) {
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  const items = frame.querySelectorAll("[data-item]");
  const pops = frame.querySelectorAll("[data-pop]");
  if (items.length) tl.from(items, { opacity: 0, y: 16, duration: 0.8, stagger: 0.08 }, 0.1);
  if (pops.length) tl.from(pops, { scale: 0.4, opacity: 0, duration: 0.5, stagger: 0.07, ease: "back.out(2.4)" }, 0.4);
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
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.querySelector("[data-steps]"), start: "top 55%", end: "bottom 55%", scrub: true } },
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

  // Desktop stage: the newly active frame performs.
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
        <header className="section-head is-split is-top">
          <div className={styles.headMain}>
            <p className="eyebrow" data-anim="fade">
              {STEPS.eyebrow}
            </p>
            <h2 id="process-title" className="title-xl" data-anim="lines">
              {STEPS.heading}
            </h2>
          </div>
          <div className="section-head-aside" data-anim="fade">
            <p className="lede">{STEPS.intro}</p>
          </div>
        </header>

        <div className={styles.layout}>
          <div className={styles.steps} data-steps>
            <span className={styles.rule} aria-hidden="true">
              <span data-progress />
            </span>
            <ol className={styles.stepList}>
              {LIST.map((step, i) => (
                <li key={step.title} className={styles.step} data-step data-active={i === active || undefined} data-done={i < active || undefined}>
                  <p className={styles.when}>
                    <span className={styles.node} aria-hidden="true">
                      <span className="num">{pad(i + 1)}</span>
                    </span>
                    <span className={`${styles.whenIndex} num`}>{pad(i + 1)}</span>
                    <span>Step {pad(i + 1)}</span>
                  </p>
                  <h3 className={styles.title}>{step.title}</h3>
                  <p className={styles.body}>{step.body}</p>
                  <div className={styles.inlineFrame} data-inline-frame>
                    <ProcessFrame index={i} title={step.title} />
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className={styles.stage} aria-label="Evaluation step illustration" data-stage>
            <div className={styles.stageInner}>
              <div className={styles.stageMeta}>
                <span className={styles.counter} aria-hidden="true">
                  <span key={active} className={`${styles.counterNow} num`}>
                    {pad(active + 1)}
                  </span>
                  <span className={styles.counterTotal}>/ {pad(LIST.length)}</span>
                </span>
              </div>
              <div className={styles.dots} aria-hidden="true">
                {LIST.map((s, i) => (
                  <span key={s.title} data-on={i <= active || undefined} />
                ))}
              </div>
              <div className={styles.frames}>
                {LIST.map((step, i) => (
                  <div key={step.title} className={styles.frameSlot} data-slot={i} data-on={i === active || undefined} aria-hidden={i !== active}>
                    <ProcessFrame index={i} title={step.title} />
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
