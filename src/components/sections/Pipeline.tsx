"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { PIPELINE } from "@/content/home";
import { liveHref } from "@/content/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, SplitText } from "@/lib/gsap";
import styles from "./Pipeline.module.css";

const STAGES = PIPELINE.pipeline ?? [];
const GROUP_CARDS = PIPELINE.cards ?? [];
/** Which stages each approved group card covers, in pipeline order. */
const GROUP_RANGES: [number, number][] = [
  [0, 2],
  [3, 4],
  [5, 5],
  [6, 7],
];
const SHORT = ["Registration", "Eligibility", "Prior Auth", "Coding", "Claims", "Denials", "Posting", "AR"];

const groupOf = (i: number) => GROUP_RANGES.findIndex(([a, b]) => i >= a && i <= b);
const keyOf = (url?: string) => (url ?? "").split("/").filter(Boolean).pop() ?? "";
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pad = (i: number) => String(i + 1).padStart(2, "0");

/** Choreographs a freshly mounted stage panel. */
function playPanel(panel: HTMLElement) {
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  const title = panel.querySelector<HTMLElement>("[data-title]");
  let split: SplitText | null = null;
  if (title) {
    split = SplitText.create(title, { type: "words", mask: "words" });
    tl.from(split.words, { yPercent: 110, duration: 0.9, stagger: 0.035 }, 0.05);
  }
  tl.from(panel.querySelectorAll("[data-fade]"), { opacity: 0, y: 16, duration: 0.8, stagger: 0.06 }, 0)
    .from(panel.querySelector("[data-ghost]"), { opacity: 0, x: 40, duration: 1.4 }, 0)
    .from(panel.querySelectorAll("[data-chip]"), { opacity: 0, y: 8, duration: 0.5, stagger: 0.05 }, 0.3);
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
  const seen = useRef(false);
  const previous = useRef(1);

  const select = useCallback((index: number) => setActive(index), []);

  // Deep links such as /#eligibility-verification select the matching stage.
  useEffect(() => {
    const fromHash = () => {
      const index = STAGES.findIndex((s) => keyOf(s.url) === window.location.hash.slice(1));
      if (index >= 0) select(index);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [select]);

  // Keep the active station visible inside the scrollable mobile rail.
  useEffect(() => {
    const tab = tabRefs.current[active];
    const rail = tab?.closest<HTMLElement>("[data-rail]");
    if (!tab || !rail || rail.scrollWidth <= rail.clientWidth) return;
    rail.scrollTo({ left: tab.offsetLeft - rail.clientWidth / 2 + tab.offsetWidth / 2, behavior: "smooth" });
  }, [active]);

  // Each stage change: a light travels the rail, then the panel performs.
  useEffect(() => {
    const from = previous.current;
    previous.current = active;
    if (!panelRef.current || !seen.current || reducedMotion()) return;
    const cleanup = playPanel(panelRef.current);
    const comet = cometRef.current;
    let tween: gsap.core.Tween | null = null;
    if (comet && from !== active) {
      const x = (i: number) => `${(i / (STAGES.length - 1)) * 100}%`;
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
    const groups = root.querySelector("[data-groups]");
    gsap
      .timeline({ scrollTrigger: { trigger: groups, start: "top 85%", once: true }, defaults: { ease: "expo.out" } })
      .fromTo(root.querySelectorAll("[data-group-card]"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, clearProps: "transform,opacity" }, 0)
      .fromTo(root.querySelectorAll("[data-group-line]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, stagger: 0.12, ease: "power3.inOut", clearProps: "transform" }, 0.15);

    gsap.timeline({
      scrollTrigger: {
        trigger: root.querySelector("[data-panel-wrap]"),
        start: "top 75%",
        once: true,
        onEnter: () => {
          seen.current = true;
          if (panelRef.current) playPanel(panelRef.current);
        },
      },
    });
  });

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (e.key in keys) next = (active + keys[e.key] + STAGES.length) % STAGES.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = STAGES.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  const stage = STAGES[active];
  const g = groupOf(active);
  const group = GROUP_CARDS[g];
  const stageHref = liveHref(stage?.url ?? "");
  const progress = active / (STAGES.length - 1);

  return (
    <section ref={sectionRef} id="services" className={`section section-dark on-dark ${styles.section}`} aria-labelledby="pipeline-title">
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        <header className="section-head is-split is-top">
          <div className={styles.headMain}>
            <p className="eyebrow" data-anim="fade">
              {PIPELINE.eyebrow}
            </p>
            <h2 id="pipeline-title" className="title-xl" data-anim="lines">
              {PIPELINE.heading}
            </h2>
          </div>
          <div className="section-head-aside" data-anim="fade">
            <p className="lede">{PIPELINE.intro}</p>
            {PIPELINE.primary && (
              <div className={styles.headCta}>
                <ButtonLink href={PIPELINE.primary.url} variant="secondary">
                  {PIPELINE.primary.label}
                </ButtonLink>
              </div>
            )}
          </div>
        </header>

        <div className={styles.rail} data-rail>
          <div className={styles.railInner}>
            <ol className={styles.groups} aria-hidden="true">
              {GROUP_CARDS.map((card, i) => {
                const [a, b] = GROUP_RANGES[i];
                return (
                  <li key={card.title} className={styles.group} data-on={g === i || undefined} style={{ gridColumn: `${a + 1} / ${b + 2}` }}>
                    <button type="button" className={styles.groupBtn} tabIndex={-1} onClick={() => select(a)}>
                      <span className={styles.groupLabel}>{card.title}</span>
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

              <div className={styles.stations} role="tablist" aria-label="Revenue cycle stages">
                {STAGES.map((s, i) => (
                  <button
                    key={s.title}
                    id={keyOf(s.url)}
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
                    <span className={styles.dot} aria-hidden="true" />
                    <span className={`${styles.stationNum} num`}>{pad(i)}</span>
                    <span className={styles.stationName}>{SHORT[i] ?? s.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.panelWrap} data-panel-wrap>
          <div ref={panelRef} id="pipeline-panel" role="tabpanel" aria-labelledby={keyOf(stage?.url)} className={styles.panel}>
            <div key={stage?.title} className={styles.panelInner}>
              <span className={`${styles.ghost} num`} aria-hidden="true" data-ghost>
                {pad(active)}
              </span>
              <div className={styles.detail}>
                <p className={styles.meta} data-fade>
                  <span>Stage {pad(active)} of {String(STAGES.length).padStart(2, "0")}</span>
                  {group && <span className={styles.protocol}>{group.title}</span>}
                </p>
                <h3 className={styles.name} data-title>
                  {stage?.title}
                </h3>
                <p className={styles.body} data-fade>
                  {stage?.body}
                </p>
                <div data-fade>
                  {stageHref ? (
                    <SmartLink href={stageHref} className="link-arrow">
                      Explore {stage?.title.toLowerCase()} <span aria-hidden="true">→</span>
                    </SmartLink>
                  ) : (
                    <SmartLink href="/demo/" className="link-arrow">
                      Discuss this stage in a demo <span aria-hidden="true">→</span>
                    </SmartLink>
                  )}
                </div>
              </div>

              {group && (
                <aside className={styles.groupPanel} data-fade aria-label={`Part of: ${group.title}`}>
                  <p className={styles.groupKicker}>Part of</p>
                  <p className={styles.groupTitle}>{group.title}</p>
                  <p className={styles.groupBody}>{group.body}</p>
                  <ul className={styles.groupStages}>
                    {STAGES.slice(GROUP_RANGES[g][0], GROUP_RANGES[g][1] + 1).map((s, k) => {
                      const idx = GROUP_RANGES[g][0] + k;
                      return (
                        <li key={s.title} data-chip data-on={idx === active || undefined}>
                          <span className="num">{pad(idx)}</span>
                          {s.title}
                        </li>
                      );
                    })}
                  </ul>
                </aside>
              )}
            </div>
          </div>
        </div>

        <ol className={styles.groupCards} data-groups aria-label="Workflow groups">
          {GROUP_CARDS.map((card, i) => {
            const href = liveHref(card.url ?? "");
            const [from, to] = GROUP_RANGES[i];
            return (
              <li key={card.title} className={styles.groupCard} data-group-card data-on={g === i || undefined}>
                <span className={styles.groupLine} aria-hidden="true" data-group-line />
                <span className={`${styles.groupNumeral} num`} aria-hidden="true">
                  {pad(i)}
                </span>
                <h3 className={styles.groupCardTitle}>{card.title}</h3>
                <p className={styles.groupCardBody}>{card.body}</p>
                <ul className={styles.groupList} aria-label="Stages covered">
                  {STAGES.slice(from, to + 1).map((st) => (
                    <li key={st.title}>{st.title}</li>
                  ))}
                </ul>
                {href && (
                  <SmartLink href={href} className={styles.groupLink} aria-label={`Explore: ${card.title}`}>
                    Explore
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" />
                    </svg>
                  </SmartLink>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
