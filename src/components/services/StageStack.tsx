"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { SmartLink } from "@/components/ui/SmartLink";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import { liveHref } from "@/content/navigation";
import type { JourneyGroup, Section } from "@/content/site/types";
import { HUB_STACK_PHOTOS } from "@/content/site/stagePhotos";
import { FloodLayer } from "@/components/fx/FloodLayer";
import { setFloodOrigin } from "@/components/fx/flood";
import { Icon } from "@/components/site/Icon";
import { SectionHead } from "@/components/site/Title";
import { STAGE_ICONS, pad } from "./stageMeta";
import styles from "./StageStack.module.css";

type Journey = Extract<Section, { kind: "journey" }>;

/** Stacking needs room: wide screens, tall enough for a card plus the header. */
const STACK_QUERY = "(min-width: 992px) and (min-height: 720px)";

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9.5M8.5 4l4 4-4 4" />
    </svg>
  );
}

/**
 * One phase: its number (as a watermark), title and summary; its stages as a
 * connected list where the selected stage opens to show what it covers; and
 * their photos. Hovering or focusing a stage selects it.
 */
function PhaseCard({ group, gi, total, start }: { group: JourneyGroup; gi: number; total: number; start: number }) {
  const [shown, setShown] = useState(0);
  const enter = (si: number) => (e: PointerEvent<HTMLLIElement>) => {
    setFloodOrigin(e);
    setShown(si);
  };

  return (
    <article className={styles.card} data-stack-card>
      <span className={styles.shade} data-shade aria-hidden="true" />
      <span className={styles.cardGlow} aria-hidden="true" />

      <div className={styles.info}>
        {/* the phase number as a large outlined watermark */}
        <span className={styles.watermark} aria-hidden="true">
          {pad(gi + 1)}
        </span>

        <div className={styles.infoTop}>
          <span className={styles.phase}>
            Phase {pad(gi + 1)} <i>/ {pad(total)}</i>
          </span>
          <span className={styles.count}>
            {group.stages.length} {group.stages.length === 1 ? "stage" : "stages"}
          </span>
        </div>

        <div className={styles.infoMain}>
          <h3 className={styles.title}>{group.title}</h3>
          <p className={styles.summary}>{group.summary}</p>
        </div>

        <ul className={styles.rows}>
          {group.stages.map((s, si) => {
            const i = start + si;
            const href = liveHref(s.href);
            return (
              <li
                key={s.href}
                className={styles.row}
                data-on={shown === si || undefined}
                data-flood
                data-glow
                onPointerEnter={enter(si)}
                onPointerLeave={setFloodOrigin}
              >
                <FloodLayer />
                <span className={styles.rowIcon} aria-hidden="true">
                  <Icon name={STAGE_ICONS[i]} />
                </span>
                <span className={styles.rowText}>
                  <span className={styles.rowNum}>Stage {pad(i + 1)}</span>
                  {href ? (
                    <SmartLink href={href} className={styles.rowLink} onFocus={() => setShown(si)}>
                      {s.label}
                    </SmartLink>
                  ) : (
                    <span>{s.label}</span>
                  )}
                  {/* the selected stage opens to show what it covers */}
                  <span className={styles.rowMore}>
                    <span>{s.body}</span>
                  </span>
                </span>
                <span className={styles.rowGo} aria-hidden="true">
                  <Arrow />
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.media} aria-hidden="true">
        {group.stages.map((s, si) => {
          const photo = HUB_STACK_PHOTOS[start + si];
          return (
            <span key={s.href} className={styles.photo} data-on={shown === si || undefined}>
              <Image src={photo.src} alt="" fill quality={85} sizes="(min-width: 992px) 46vw, 92vw" style={{ objectPosition: photo.pos }} />
            </span>
          );
        })}
        <span className={styles.mediaShade} />
        <span className={styles.mediaTag} key={shown}>
          <b>{pad(start + shown + 1)}</b>
          {group.stages[shown].label}
        </span>
        <span className={styles.mediaDots}>
          {group.stages.map((s, si) => (
            <i key={s.href} data-on={shown === si || undefined} />
          ))}
        </span>
      </div>
    </article>
  );
}

/**
 * "The patient-to-payment journey": the three phases as large cards that pin
 * and stack as you scroll; each card shrinks and dims a little as the next
 * one slides over it. Hovering a stage row turns it light and brings up that
 * stage's photo. Small or short screens get the cards in a simple column.
 */
export function StageStack({ section }: { section: Journey }) {
  const ref = useRef<HTMLElement>(null);
  const groups = section.groups;
  // Index of each phase's first stage, so stages are numbered 01–08 across the phases.
  const starts = groups.map((_, gi) => groups.slice(0, gi).reduce((sum, g) => sum + g.stages.length, 0));

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    const items = gsap.utils.toArray<HTMLElement>("[data-stack-item]", root);

    if (!window.matchMedia(STACK_QUERY).matches) {
      items.forEach((item) =>
        gsap.from(item, { opacity: 0, y: 60, duration: 1.2, ease: "expo.out", clearProps: "opacity,transform", scrollTrigger: { trigger: item, start: "top 88%", once: true } }),
      );
      return;
    }

    items.forEach((item, i) => {
      const next = items[i + 1];
      const card = item.querySelector("[data-stack-card]");
      const shade = item.querySelector("[data-shade]");
      if (!next || !card || !shade) return;
      // From when the next card enters the screen until it lands on its pinned spot.
      const scrollTrigger = {
        trigger: next,
        start: "top bottom",
        end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
        scrub: true,
        invalidateOnRefresh: true,
      };
      gsap.to(card, { scale: 0.9 + i * 0.02, ease: "none", scrollTrigger });
      gsap.to(shade, { opacity: 0.6, ease: "none", scrollTrigger: { ...scrollTrigger } });
    });
  });

  return (
    <section ref={ref} id={section.id} className={`section ${styles.section}`} aria-labelledby="journey-title">
      <div className="container">
        <SectionHead id="journey-title" eyebrow={section.eyebrow} title={section.title} accent={section.accent} intro={section.intro} align="split" />
        <div className={styles.stack}>
          {groups.map((g, gi) => (
            <div key={g.title} className={styles.item} style={{ "--i": gi } as CSSProperties} data-stack-item>
              <PhaseCard group={g} gi={gi} total={groups.length} start={starts[gi]} />
            </div>
          ))}
          <span className={styles.hold} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
