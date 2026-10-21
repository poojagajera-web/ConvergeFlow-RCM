"use client";

import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { HOME_STATUS } from "@/content/site/home";
import styles from "./StatusSplit.module.css";

const RING = 2 * Math.PI * 34;
const SPARKS = 14;

/**
 * "Verified … Paid". While pinned on desktop, scroll progress (--p) drives
 * everything: the dim words fill with a mint-to-white gradient behind a glowing edge, a beam between them fills,
 * the claim card flips in 3D through its three states with a spark burst at
 * each change, and its ring fills continuously. Elsewhere the card cycles.
 */
export function StatusSplit() {
  const ref = useRef<HTMLElement>(null);
  const states = HOME_STATUS.states;
  const [idx, setIdx] = useState(0);
  const [burst, setBurst] = useState(0);

  // Small screens and reduced motion: cycle on a timer instead of scroll.
  useEffect(() => {
    if (window.matchMedia("(min-width: 992px) and (prefers-reduced-motion: no-preference)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ref.current?.style.setProperty("--p", "1");
      const raf = requestAnimationFrame(() => setIdx(states.length - 1));
      return () => cancelAnimationFrame(raf);
    }
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % states.length;
      setIdx(i);
      setBurst((b) => b + 1);
      ref.current?.style.setProperty("--p", String((i + 1) / states.length));
    }, 2600);
    ref.current?.style.setProperty("--p", String(1 / states.length));
    return () => window.clearInterval(id);
  }, [states.length]);

  useMotion(ref, ({ motion, desktop }) => {
    if (!motion || !desktop) return;
    const root = ref.current!;
    const card = root.querySelector<HTMLElement>("[data-card]")!;
    let current = 0;
    const st = ScrollTrigger.create({
      trigger: root.querySelector("[data-pin]"),
      start: "top top",
      end: "+=170%",
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        root.style.setProperty("--p", self.progress.toFixed(4));
        const i = Math.min(states.length - 1, Math.floor(self.progress * states.length * 0.9999));
        if (i !== current) {
          current = i;
          setIdx(i);
          setBurst((b) => b + 1);
        }
      },
    });
    // Words slide in from the edges as the section arrives.
    gsap.fromTo(root.querySelector("[data-left]"), { xPercent: -40 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "top top", scrub: 0.6 } });
    gsap.fromTo(root.querySelector("[data-right]"), { xPercent: 40 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "top top", scrub: 0.6 } });
    // The card tilts toward the pointer.
    const rx = gsap.quickTo(card, "rotationX", { duration: 0.8, ease: "power3.out" });
    const ry = gsap.quickTo(card, "rotationY", { duration: 0.8, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      rx(((e.clientY - (r.top + r.height / 2)) / r.height) * -10);
      ry(((e.clientX - (r.left + r.width / 2)) / r.width) * 14);
    };
    root.addEventListener("pointermove", onMove);
    return () => {
      st.kill();
      root.removeEventListener("pointermove", onMove);
    };
  });

  return (
    <section ref={ref} className={styles.section} data-state={idx} aria-labelledby="status-title">
      <div className={styles.pin} data-pin>
        <span className={styles.glow} aria-hidden="true" />
        <span className={styles.grid} aria-hidden="true" />
        <h2 id="status-title" className="visually-hidden">
          From verified to paid
        </h2>

        <div className={styles.words} aria-hidden="true">
          <span className={styles.word} data-side="l" data-left>
            <span className={styles.outline}>{HOME_STATUS.left}</span>
            <span className={styles.fillText}>{HOME_STATUS.left}</span>
          </span>
          <span className={styles.beam}>
            <i />
            <b />
          </span>
          <span className={styles.word} data-side="r" data-right>
            <span className={styles.outline}>{HOME_STATUS.right}</span>
            <span className={styles.fillText}>{HOME_STATUS.right}</span>
          </span>
        </div>

        <div className={styles.cardWrap}>
          <span className={styles.sparks} key={burst} aria-hidden="true">
            {Array.from({ length: SPARKS }, (_, i) => (
              <i key={i} style={{ ["--a" as string]: `${(360 / SPARKS) * i}deg`, ["--d" as string]: `${60 + ((i * 37) % 50)}px` }} />
            ))}
          </span>
          <figure className={styles.card} data-card>
            <span className={styles.sheen} aria-hidden="true" />
            <header className={styles.cardTop}>
              <span className={styles.mark} />
              <span className={styles.cardMeta}>Claim file · illustrative</span>
            </header>
            <div className={styles.panes}>
              {states.map((s, i) => (
                <div key={s.ring} className={styles.pane} data-pos={i < idx ? "past" : i === idx ? "active" : "next"} aria-hidden={i !== idx}>
                  <p className={styles.kicker}>{s.kicker}</p>
                  <p className={styles.title}>{s.title}</p>
                  <dl className={styles.meta}>
                    {s.meta.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            <div className={styles.ringWrap}>
              <svg viewBox="0 0 80 80" className={styles.ring} aria-hidden="true">
                <circle cx="40" cy="40" r="34" className={styles.ringTrack} />
                <circle cx="40" cy="40" r="34" className={styles.ringFill} style={{ strokeDasharray: RING }} />
              </svg>
              <span className={styles.ringLabel} key={idx}>
                {states[idx].ring}
              </span>
            </div>
          </figure>
        </div>

        <ol className={styles.steps} aria-hidden="true">
          {states.map((s, i) => (
            <li key={s.ring} data-on={i <= idx || undefined}>
              <span className={styles.stepDot} />
              {s.ring}
            </li>
          ))}
        </ol>
        <p className={styles.caption}>{HOME_STATUS.caption}</p>
      </div>
    </section>
  );
}
