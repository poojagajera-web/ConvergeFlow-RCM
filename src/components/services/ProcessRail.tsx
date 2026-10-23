"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SmartLink } from "@/components/ui/SmartLink";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { liveHref } from "@/content/navigation";
import type { JourneyGroup } from "@/content/site/types";
import { HOME_FACTS } from "@/content/site/home";
import { HUB_RAIL_PHOTOS } from "@/content/site/stagePhotos";
import { Icon } from "@/components/site/Icon";
import { STAGE_ICONS, pad } from "./stageMeta";
import styles from "./ProcessRail.module.css";

const CYCLE_MS = 4200;
const R = 34;
const RING = 2 * Math.PI * R;
const vars = (v: Record<string, string | number>) => v as CSSProperties;

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" style={back ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M3 8h9.5M8.5 4l4 4-4 4" />
    </svg>
  );
}

/**
 * The eight stages on a white panel rising out of the dark hero.
 *
 * Wide screens: a line runs through the eight stages under their phase
 * brackets and fills up to the lit stage, a light riding its end. The lit
 * stage advances on its own while the panel is on screen (a ring around it
 * counts down), and a showcase below pairs what the stage covers with its
 * photo. Hovering or focusing a stage takes over; previous / pause / next
 * controls step through by hand. Each stage links to its page.
 * Smaller screens: a vertical timeline that lights stage by stage as you scroll.
 */
export function ProcessRail({ groups }: { groups: JourneyGroup[] }) {
  const ref = useRef<HTMLElement>(null);
  const stages = groups.flatMap((g, gi) => g.stages.map((s) => ({ ...s, group: g.title, gi })));
  const last = stages.length - 1;
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const [hold, setHold] = useState(false);
  const [paused, setPaused] = useState(false);
  const stage = stages[active];
  const stageHref = liveHref(stage.href);
  const live = running && !hold && !paused;

  // Advance only while the panel is on screen (and never for reduced motion).
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // One full countdown per stage: restarts whenever the stage changes or playback resumes.
  useEffect(() => {
    if (!live) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % stages.length), CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [live, active, stages.length]);

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    gsap.from(root.querySelector("[data-panel]"), {
      y: 90,
      opacity: 0,
      scale: 0.96,
      duration: 1.5,
      ease: "expo.out",
      clearProps: "opacity,transform",
      // as soon as it enters, so the panel already peeks above the fold under the hero
      scrollTrigger: { trigger: root, start: "top bottom", once: true },
    });
    gsap.from(root.querySelectorAll("[data-node]"), {
      opacity: 0,
      y: 24,
      scale: 0.7,
      duration: 0.9,
      stagger: 0.07,
      ease: "back.out(1.8)",
      clearProps: "opacity,transform",
      scrollTrigger: { trigger: root, start: "top 75%", once: true },
    });
    gsap.from(root.querySelector("[data-showcase]"), {
      opacity: 0,
      y: 50,
      duration: 1.3,
      ease: "expo.out",
      clearProps: "opacity,transform",
      scrollTrigger: { trigger: root, start: "top 60%", once: true },
    });

    // Vertical timeline: the line fills as you scroll and each stage lights as it is reached.
    // (Created at every width: ScrollTrigger re-measures on resize, and the list is simply hidden on wide screens.)
    const list = root.querySelector<HTMLElement>("[data-vlist]");
    const fill = root.querySelector<HTMLElement>("[data-vfill]");
    if (list && fill) {
      gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 62%", end: "bottom 62%", scrub: 0.4 } });
      root.querySelectorAll<HTMLElement>("[data-vrow]").forEach((row) =>
        ScrollTrigger.create({
          trigger: row,
          start: "top 62%",
          onEnter: () => row.setAttribute("data-lit", ""),
          onLeaveBack: () => row.removeAttribute("data-lit"),
        }),
      );
    }
  });

  const take = (i: number) => () => {
    setActive(i);
    setHold(true);
  };
  const release = () => setHold(false);
  const step = (d: number) => () => setActive((a) => (a + d + stages.length) % stages.length);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="process-title">
      <div className="container">
        <div className={styles.panel} data-panel>
          <span className={styles.panelGlow} aria-hidden="true" />
          <span className={styles.panelGrid} aria-hidden="true" />

          <header className={styles.head}>
            <div className={styles.headMain}>
              <p className={styles.kicker}>
                <span className={styles.kickerMark} aria-hidden="true" />
                {stages.length} stages · {groups.length} phases
              </p>
              <h2 id="process-title" className={styles.title}>
                {HOME_FACTS.title} <span className={styles.accent}>{HOME_FACTS.accent}</span>
              </h2>
            </div>
            <p className={styles.counter} aria-hidden="true">
              <b key={active}>{pad(active + 1)}</b>
              <span>/ {pad(stages.length)}</span>
              <em>{stage.group}</em>
            </p>
          </header>

          {/* ---------- Wide screens: horizontal line + showcase ---------- */}
          <div className={styles.rail} style={vars({ "--p": active / last })}>
            <div className={styles.phases} aria-hidden="true">
              {groups.map((g, gi) => (
                <span key={g.title} style={vars({ "--span": g.stages.length })} data-on={stage.gi === gi || undefined}>
                  {g.title}
                </span>
              ))}
            </div>

            <div className={styles.track}>
              <span className={styles.line} aria-hidden="true">
                <i />
                <b />
              </span>
              <ol className={styles.nodes}>
                {stages.map((s, i) => {
                  const href = liveHref(s.href);
                  const state = i < active ? "done" : i === active ? "on" : undefined;
                  const inner = (
                    <>
                      <span className={styles.dot}>
                        {i === active && (
                          <svg className={styles.countdown} viewBox="0 0 76 76" aria-hidden="true">
                            <circle
                              key={`${active}-${live}`}
                              cx="38"
                              cy="38"
                              r={R}
                              className={styles.countFill}
                              data-run={live || undefined}
                              style={{ strokeDasharray: RING, animationDuration: `${CYCLE_MS}ms` }}
                            />
                          </svg>
                        )}
                        <Icon name={STAGE_ICONS[i]} />
                      </span>
                      <span className={styles.num}>{pad(i + 1)}</span>
                      <span className={styles.label}>{s.label}</span>
                    </>
                  );
                  return (
                    <li key={s.href} data-state={state} data-node>
                      {href ? (
                        <SmartLink href={href} className={styles.node} onPointerEnter={take(i)} onPointerLeave={release} onFocus={take(i)} onBlur={release}>
                          {inner}
                        </SmartLink>
                      ) : (
                        <span className={styles.node} onPointerEnter={take(i)} onPointerLeave={release}>
                          {inner}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>

            <article className={styles.showcase} data-showcase>
              <div className={styles.showText}>
                <div className={styles.showTop} key={`t-${active}`}>
                  <span className={styles.showNum}>{pad(active + 1)}</span>
                  <span className={styles.showIcon} aria-hidden="true">
                    <Icon name={STAGE_ICONS[active]} />
                  </span>
                </div>
                <div className={styles.showCopy} key={`c-${active}`}>
                  <p className={styles.showGroup}>{stage.group}</p>
                  <h3 className={styles.showTitle}>{stage.label}</h3>
                  <p className={styles.showBody}>{stage.body}</p>
                </div>
                <div className={styles.showActions}>
                  {stageHref && (
                    <SmartLink href={stageHref} className={styles.go}>
                      Explore stage
                      <span className={styles.goIcon}>
                        <Arrow />
                      </span>
                    </SmartLink>
                  )}
                  <div className={styles.controls}>
                    <button type="button" className={styles.ctrl} onClick={step(-1)} aria-label="Previous stage">
                      <Arrow back />
                    </button>
                    <button
                      type="button"
                      className={styles.ctrl}
                      onClick={() => setPaused((p) => !p)}
                      aria-label={paused ? "Play the stages" : "Pause the stages"}
                      aria-pressed={paused}
                    >
                      {paused ? (
                        <svg viewBox="0 0 16 16" aria-hidden="true" data-fill>
                          <path d="M5 3.5v9l7.5-4.5z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M5.5 3.5v9M10.5 3.5v9" />
                        </svg>
                      )}
                    </button>
                    <button type="button" className={styles.ctrl} onClick={step(1)} aria-label="Next stage">
                      <Arrow />
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.showMedia} aria-hidden="true">
                {stages.map((s, i) => {
                  const photo = HUB_RAIL_PHOTOS[i];
                  return (
                    <span key={s.href} className={styles.showPhoto} data-on={i === active || undefined}>
                      <Image src={photo.src} alt="" fill quality={85} sizes="(min-width: 1100px) 44vw, 1px" style={{ objectPosition: photo.pos }} />
                    </span>
                  );
                })}
                <span className={styles.showShade} />
                <span className={styles.showTag} key={`g-${active}`}>
                  Stage <b>{pad(active + 1)}</b> of {pad(stages.length)}
                </span>
                <span className={styles.showBar}>
                  {stages.map((s, i) => (
                    <i key={s.href} data-on={i === active || undefined} data-done={i < active || undefined} />
                  ))}
                </span>
              </div>
            </article>
          </div>

          {/* ---------- Smaller screens: vertical timeline ---------- */}
          <div className={styles.vwrap} data-vlist>
            <span className={styles.vline} aria-hidden="true">
              <i data-vfill />
            </span>
            {groups.map((g, gi) => (
              <div key={g.title} className={styles.vgroup}>
                <p className={styles.vgroupTitle}>
                  <span>{pad(gi + 1)}</span>
                  {g.title}
                </p>
                <ol className={styles.vlist}>
                  {g.stages.map((s) => {
                    const i = stages.findIndex((x) => x.href === s.href);
                    const href = liveHref(s.href);
                    return (
                      <li key={s.href} className={styles.vrow} data-vrow>
                        <span className={styles.vdot} aria-hidden="true">
                          <Icon name={STAGE_ICONS[i]} />
                        </span>
                        <div className={styles.vtext}>
                          <span className={styles.vnum}>{pad(i + 1)}</span>
                          <h3 className={styles.vtitle}>
                            {href ? (
                              <SmartLink href={href} className={styles.vlink}>
                                {s.label}
                                <Arrow />
                              </SmartLink>
                            ) : (
                              s.label
                            )}
                          </h3>
                          <p className={styles.vcopy}>{s.body}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
