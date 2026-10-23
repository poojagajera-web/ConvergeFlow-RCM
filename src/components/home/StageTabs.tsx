"use client";

import Image from "next/image";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { liveHref } from "@/content/navigation";
import { STAGES } from "@/content/site/services";
import { HOME_STAGE_PHOTOS } from "@/content/site/stagePhotos";
import styles from "./StageTabs.module.css";

const PHOTOS = HOME_STAGE_PHOTOS;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Choose the stages in your scope": a pinned horizontal gallery. Scrolling
 * glides eight tall photo cards sideways with a live counter and progress
 * bar. Small screens and reduced motion get a native swipe row.
 */
export function StageTabs() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ motion, desktop }) => {
    if (!motion || !desktop) return;
    const root = ref.current!;
    const track = root.querySelector<HTMLElement>("[data-track]")!;
    const bar = root.querySelector<HTMLElement>("[data-bar]")!;
    const count = root.querySelector<HTMLElement>("[data-count]")!;
    const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root);
    // Scroll until the last card's right edge sits one side-gutter inside the viewport
    // (scrollWidth drops a flex row's trailing padding, so measure the card itself).
    const distance = () => {
      const last = cards[cards.length - 1];
      const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      return Math.max(0, last.offsetLeft + last.offsetWidth + pad - track.clientWidth);
    };
    root.setAttribute("data-live", "");
    const pinEl = root.querySelector("[data-pin]");
    // Once the eighth card has arrived the section stays pinned a little longer, so it rests in place before moving on.
    const hold = () => window.innerHeight * 0.55;
    ScrollTrigger.create({ trigger: pinEl, start: "top top", end: () => `+=${distance() + hold()}`, pin: true, invalidateOnRefresh: true });
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: pinEl,
        start: "top top",
        end: () => `+=${distance()}`,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          bar.style.transform = `scaleX(${self.progress})`;
          count.textContent = pad(Math.min(cards.length, 1 + Math.round(self.progress * (cards.length - 1))));
        },
      },
    });
    // Cards rise into line as they enter and their photos drift for depth. The rise
    // finishes by the time a card's left edge reaches 75% of the screen, so even the
    // last card (which stops around 60-62%) settles fully.
    cards.forEach((card, i) => {
      const img = card.querySelector("[data-img]");
      if (img) gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      gsap.from(card, { y: 40 + (i % 2) * 30, opacity: 0.4, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "left 75%", scrub: true } });
    });
    return () => root.removeAttribute("data-live");
  });

  return (
    <section ref={ref} className={styles.section} aria-labelledby="stages-title">
      <div className={styles.pin} data-pin>
        <div className={`container ${styles.head}`}>
          <div>
            <p className="eyebrow" data-anim="fade">
            Services
            </p>
            <h2 id="stages-title" className={styles.title} data-anim="words">
              Choose the stages <span className="accent-text">in your scope.</span>
            </h2>
          </div>
          <div className={styles.side} data-anim="fade">
            <p>Eight stages, one accountable team. Scope is agreed before we start and recorded so ownership is clear.</p>
            <div className={styles.progress} aria-hidden="true">
              <span className={styles.count}>
                <b data-count>01</b> / {pad(STAGES.length)}
              </span>
              <span className={styles.bar}>
                <i data-bar />
              </span>
            </div>
            <ButtonLink href="/services/" variant="secondary">
              All services
            </ButtonLink>
          </div>
        </div>

        <div className={styles.viewport}>
          <ul className={styles.track} data-track>
            {STAGES.map((s, i) => {
              const href = liveHref(s.href);
              const photo = PHOTOS[i];
              const inner = (
                <>
                  <span className={styles.media} aria-hidden="true">
                    <span className={styles.img} data-img>
                      <Image src={photo.src} alt={photo.alt} fill quality={85} sizes="(min-width: 992px) 30rem, 85vw" style={{ objectPosition: photo.pos }} />
                    </span>
                  </span>
                  <span className={styles.top}>
                    <span className={styles.group}>{s.group}</span>
                    <span className={styles.num}>{pad(i + 1)}</span>
                  </span>
                  <span className={styles.bottom}>
                    <b className={styles.cardTitle}>{s.label}</b>
                    <span className={styles.cardBody}>{s.body}</span>
                    <span className={styles.go} aria-hidden="true">
                      <svg viewBox="0 0 20 20">
                        <path d="M5 15 15 5m0 0H7m8 0v8" />
                      </svg>
                    </span>
                  </span>
                </>
              );
              return (
                <li key={s.href} className={styles.item} data-card>
                  {href ? (
                    <SmartLink href={href} className={styles.card}>
                      {inner}
                    </SmartLink>
                  ) : (
                    <span className={styles.card}>{inner}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
