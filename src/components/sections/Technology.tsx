"use client";

import { useEffect, useRef, useState } from "react";
import { TECHNOLOGY } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";
import { useMotion } from "@/components/motion/useMotion";
import { getLenis } from "@/components/motion/SmoothScroll";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./Technology.module.css";

/** Top → bottom of the platform stack. */
const ITEMS = [TECHNOLOGY.core, ...TECHNOLOGY.modules];
const N = ITEMS.length;
const SHORT = ["QDL orchestration", "Portal RPA", "EDI & clearinghouse bus", "Credential vault", "Exception AI", "Audit ledger"];
const ICONS = [
  "M12 3v3 M12 18v3 M3 12h3 M18 12h3 M7 7l2 2 M15 15l2 2 M17 7l-2 2 M9 15l-2 2 M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  "M3 5h18v14H3z M3 9h18 M6 7h.01 M8.5 7h.01 M11 7h.01 M8 13l3 3 5-5",
  "M4 8h14l-3-3 M20 16H6l3 3",
  "M6 11h12v9H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3 M12 14.5v2.5",
  "M12 4 21 20H3z M12 10v4.5 M12 17h.01",
  "M4 5h16v4H4z M4 10h16v4H4z M4 15h16v4H4z",
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

  // Detail card performs on every change of layer.
  useEffect(() => {
    const card = ref.current?.querySelector<HTMLElement>("[data-detail]");
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(card.querySelectorAll("[data-swap]"), { opacity: 0, y: 16, duration: 0.7, stagger: 0.06 });
    const badge = card.querySelector<HTMLElement>("[data-badge]");
    if (badge) tl.to(badge, { duration: 0.7, scrambleText: { text: badge.dataset.badge!, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", speed: 0.6 } }, 0);
    return () => {
      tl.progress(1).kill();
    };
  }, [active]);

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

  const item = ITEMS[active];

  return (
    <section ref={ref} id="technology" className={`section section-dark on-dark ${styles.section}`} aria-labelledby="tech-title">
      <div className="container">
        <header className="section-head is-split">
          <div className={styles.headMain}>
            <p className="eyebrow" data-anim="fade">
              <span className="eyebrow-index">05</span>
              {TECHNOLOGY.eyebrow}
            </p>
            <h2 id="tech-title" className="title-xl" data-anim="lines">
              Built on <span className="accent">AI and robotics</span> — not offshore manual headcount
            </h2>
          </div>
          <p className="lede section-head-aside" data-anim="fade">
            {TECHNOLOGY.body}
          </p>
        </header>
      </div>

      <div className={styles.scroller} data-scroller>
        <div className={styles.sticky}>
          <div className={`container ${styles.stage}`}>
            <div className={styles.copy}>
              <div className={styles.meter} aria-hidden="true">
                <span className={styles.meterCount}>
                  <span key={active} className={`${styles.meterNow} num`}>
                    {pad(active + 1)}
                  </span>
                  <span className={styles.meterTotal}>/ {pad(N)}</span>
                </span>
                <span className={styles.meterSide}>
                  <span className={styles.meterLabel}>Platform layer</span>
                  <span className={styles.segments}>
                    {ITEMS.map((m, i) => (
                      <span key={m.name} data-on={i <= active || undefined} />
                    ))}
                  </span>
                </span>
              </div>

              <div id="tech-panel" role="tabpanel" aria-labelledby={`tech-tab-${active}`} className={styles.detail} data-detail>
                <span className={`${styles.badge} mono`} data-swap data-badge={item.badge}>
                  {item.badge}
                </span>
                <h3 className={styles.detailName} data-swap>
                  {item.name}
                </h3>
                <p className={styles.detailBody} data-swap>
                  {item.body}
                </p>
                <p className={styles.status} data-swap>
                  <span className={styles.statusDot} aria-hidden="true" />
                  {item.status}
                </p>
              </div>

              <div className={styles.layerList} role="tablist" aria-label="Platform layers">
                {ITEMS.map((m, i) => (
                  <button
                    key={m.name}
                    type="button"
                    role="tab"
                    id={`tech-tab-${i}`}
                    aria-selected={i === active}
                    aria-controls="tech-panel"
                    className={styles.layerTab}
                    data-done={i < active || undefined}
                    onClick={() => choose(i)}
                  >
                    <span className={`${styles.layerTabIndex} num`}>{pad(i + 1)}</span>
                    <span>{SHORT[i]}</span>
                  </button>
                ))}
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
                      <span className={styles.slabChip}>{m.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <section id="security" className={styles.security} data-anim="fade" aria-labelledby="security-title">
          <svg className={styles.shield} viewBox="0 0 48 56" aria-hidden="true" data-anim="draw">
            <path d="M24 2 4 9.5v14C4 37 12.6 48.6 24 53c11.4-4.4 20-16 20-29.5v-14L24 2Z" data-draw />
            <path d="m15.5 28 6 6 11-12" data-draw />
          </svg>
          <div className={styles.securityCopy}>
            <h3 id="security-title" className={styles.securityTitle}>
              {TECHNOLOGY.security.title}
            </h3>
            <p>{TECHNOLOGY.security.body}</p>
            <ul className={styles.points}>
              {TECHNOLOGY.security.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <ButtonLink href="/#demo" variant="secondary">
            {TECHNOLOGY.security.cta}
          </ButtonLink>
        </section>
      </div>
    </section>
  );
}
