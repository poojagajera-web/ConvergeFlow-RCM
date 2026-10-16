"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { TECHNOLOGY } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { useMotion } from "@/components/motion/useMotion";
import { getLenis } from "@/components/motion/SmoothScroll";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./Technology.module.css";

/** The six approved technology topics, top → bottom of the stack. */
const ITEMS = (TECHNOLOGY.cards ?? []).map((c) => ({ name: c.title, body: c.body }));
const N = ITEMS.length;
const SHORT = ITEMS.map((i) => i.name);
/* Portal workflows, API/clearinghouse, credentials, orchestration, exceptions, reporting */
const ICONS = [
  "M3 4.5h18v12H3z M3 8h18 M5.5 6.25h.01 M8 6.25h.01 M13 11.5l7 2.6-3 1.2-1.2 3z",
  "M9 3v5 M15 3v5 M7 8h10v3a5 5 0 0 1-10 0z M12 16v5",
  "M8 4a4 4 0 1 0 0 8 4 4 0 1 0 0-8z M11 11l9 9 M17 17l-2 2 M19.5 19.5l-1.5 1.5",
  "M3 10h5v4H3z M16 4h5v4h-5z M16 16h5v4h-5z M8 12h4 M12 6v12 M12 6h4 M12 18h4",
  "M12 3 21 12 12 21 3 12z M12 8v5 M12 16h.01",
  "M3 20h18 M5 20v-8 M10 20V6 M15 20v-6 M20 20v-11",
];
const GAP_MIN = 14;
const GAP_MAX = 70;
const EXPLODE_END = 0.16;
const MOBILE_GAP = 30;
const CYCLE_MS = 3600;

const pad = (n: number) => String(n).padStart(2, "0");

export function Technology() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [inView, setInView] = useState(false);
  const [cycling, setCycling] = useState(true);
  const activeRef = useRef(0);
  const renderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    activeRef.current = active;
    renderRef.current?.();
  }, [active]);

  // Mobile: no scroll-scrub, the stack cycles through its layers on its own.
  useEffect(() => {
    if (isDesktop || !cycling || !inView) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % N), CYCLE_MS);
    return () => window.clearTimeout(t);
  }, [isDesktop, cycling, inView, active]);

  useMotion(ref, ({ desktop, motion }) => {
    const root = ref.current!;
    const stack = root.querySelector<HTMLElement>("[data-stack]")!;
    const layers = gsap.utils.toArray<HTMLElement>("[data-layer]", root);
    setIsDesktop(desktop);
    let gap = desktop ? GAP_MIN : MOBILE_GAP;

    const render = () => {
      const k = activeRef.current;
      // The active layer slides out like a drawer, proportional to the slab size.
      const w = stack.offsetWidth;
      layers.forEach((layer, i) => {
        const on = i === k;
        const vars = { z: (N - 1 - i) * gap + (on ? 10 : 0), x: on ? w * (desktop ? 0.5 : 0.24) : 0, y: on ? w * (desktop ? 0.14 : 0.06) : 0 };
        if (motion) gsap.to(layer, { ...vars, duration: 0.7, ease: "power3.out", overwrite: true });
        else gsap.set(layer, vars);
      });
      stack.dataset.exploded = String(gap > GAP_MAX * 0.9 || !desktop);
    };
    renderRef.current = render;
    render();

    const inViewTrigger = ScrollTrigger.create({ trigger: stack, start: "top bottom", end: "bottom top", onToggle: (s) => setInView(s.isActive) });


    if (desktop) {
      ScrollTrigger.create({
        trigger: root.querySelector("[data-scroller]"),
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          gap = GAP_MIN + (GAP_MAX - GAP_MIN) * Math.min(1, p / EXPLODE_END);
          const q = Math.max(0, (p - EXPLODE_END) / (1 - EXPLODE_END));
          const k = Math.min(N - 1, Math.floor(q * N));
          root.style.setProperty("--tq", String(Math.min(1, Math.max(0, q))));
          if (k !== activeRef.current) {
            activeRef.current = k;
            setActive(k);
          }
          render();
        },
      });
    } else if (motion) {
      // Fade the scene wrapper (layers are owned by render(), which overwrites their tweens).
      gsap.from(root.querySelector("[data-scene]"), { opacity: 0, y: 40, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: stack, start: "top 85%", once: true } });
    }

    return () => {
      inViewTrigger.kill();
      renderRef.current = null;
    };
  });

  // Desktop: choosing a layer scrolls to its point in the story; mobile: selects it.
  const choose = (k: number) => {
    setCycling(false);
    const scroller = ref.current?.querySelector<HTMLElement>("[data-scroller]");
    if (!isDesktop || !scroller) {
      setActive(k);
      return;
    }
    const range = scroller.offsetHeight - window.innerHeight;
    const start = scroller.getBoundingClientRect().top + window.scrollY;
    const y = start + range * (EXPLODE_END + ((k + 0.5) / N) * (1 - EXPLODE_END));
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };


  return (
    <section ref={ref} id="technology" className={`section section-dark on-dark ${styles.section}`} aria-labelledby="tech-title">
      <div className="container">
        <header className="section-head is-split is-top">
          <div className={styles.headMain}>
            <p className="eyebrow" data-anim="fade">
              {TECHNOLOGY.eyebrow}
            </p>
            <h2 id="tech-title" className="title-xl" data-anim="lines">
              {TECHNOLOGY.heading}
            </h2>
          </div>
          <div className="section-head-aside" data-anim="fade">
            <p className="lede">{TECHNOLOGY.intro}</p>
            {TECHNOLOGY.primary && (
              <div className={styles.headCta}>
                <ButtonLink href={TECHNOLOGY.primary.url} variant="secondary">
                  {TECHNOLOGY.primary.label}
                </ButtonLink>
              </div>
            )}
          </div>
        </header>
      </div>

      <div className={styles.scroller} data-scroller>
        <div className={styles.sticky}>
          <div className={`container ${styles.stage}`}>
            <div className={styles.copy}>
              <p className={styles.topicHead} aria-hidden="true">
                <span>Topic</span>
                <span className={styles.topicCount}>
                  <span key={active} className={`${styles.topicNow} num`}>
                    {pad(active + 1)}
                  </span>
                  <span className="num"> / {pad(N)}</span>
                </span>
              </p>
              <div
                className={styles.topicsWrap}
                style={isDesktop ? undefined : ({ ["--tq" as string]: String((active + 1) / N) } as CSSProperties)}
              >
                <span className={styles.rail} aria-hidden="true">
                  <span className={styles.railFill} />
                  <span className={styles.railDot} />
                </span>
              <ol className={styles.topics} data-mode={isDesktop ? "scroll" : "auto"}>
                {ITEMS.map((m, i) => {
                  const on = i === active;
                  return (
                    <li key={m.name} className={styles.topic} data-on={on || undefined} data-done={i < active || undefined}>
                      <button
                        type="button"
                        id={`tech-tab-${i}`}
                        className={styles.topicBtn}
                        aria-expanded={on}
                        aria-controls={`tech-topic-${i}`}
                        onClick={() => choose(i)}
                      >
                        <span className={styles.topicIcon} aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path d={ICONS[i]} />
                          </svg>
                        </span>
                        <span className={styles.topicName}>{m.name}</span>
                        <span className={`${styles.topicIndex} num`}>{pad(i + 1)}</span>
                      </button>
                      <div id={`tech-topic-${i}`} className={styles.topicPanel} role="region" aria-labelledby={`tech-tab-${i}`}>
                        <div className={styles.topicInner}>
                          <p className={styles.topicBody}>{m.body}</p>
                          <SmartLink href="/demo/" className={styles.topicLink}>
                            Discuss this in a demo
                            <svg viewBox="0 0 20 20" aria-hidden="true">
                              <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" />
                            </svg>
                          </SmartLink>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
              </div>
            </div>

            <div className={styles.scene} aria-hidden="true" data-scene>
              <div className={styles.stack} data-stack>
                <div className={styles.floor} />
                {ITEMS.map((m, i) => (
                  <div key={m.name} className={styles.layer} data-layer data-on={i === active || undefined} onClick={() => choose(i)}>
                    <div className={styles.slabBase} />
                    <div className={styles.slab}>
                      <span className={styles.slabGrid} />
                      <svg className={styles.slabIcon} viewBox="0 0 24 24">
                        <path d={ICONS[i]} />
                      </svg>
                      <span className={styles.slabName}>{SHORT[i]}</span>
                      <span className={`${styles.slabIndex} num`}>{pad(i + 1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
