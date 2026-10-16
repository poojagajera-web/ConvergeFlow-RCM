"use client";

import { useRef, useState, type ReactNode } from "react";
import { SmartLink } from "@/components/ui/SmartLink";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./Bodies.module.css";

/**
 * Subsection steps that scroll sideways while the block is pinned (wide
 * screens with motion); a plain vertical list everywhere else.
 */
export function HorizontalSteps({ count, children }: { count: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ motion }) => {
    const wrap = ref.current!;
    const track = wrap.querySelector<HTMLElement>("[data-htrack]")!;
    const cards = wrap.querySelectorAll<HTMLElement>("[data-hstep]");
    if (!motion) return;
    const wide = window.matchMedia("(min-width: 1100px)").matches;
    if (!wide) {
      gsap.from(cards, { opacity: 0, y: 30, duration: 1, stagger: 0.1, scrollTrigger: { trigger: wrap, start: "top 80%", once: true } });
      return;
    }
    const distance = () => Math.max(0, track.scrollWidth - wrap.clientWidth);
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: () => `top ${Math.max(80, (window.innerHeight - wrap.offsetHeight) / 2)}px`,
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
    // Light each card as it reaches the centre of the viewport.
    cards.forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        containerAnimation: tween,
        start: "left 70%",
        end: "right 30%",
        toggleClass: { targets: card, className: styles.hStepOn },
      });
    });
    gsap.fromTo(wrap.querySelector("[data-hprogress]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: wrap, start: "top 30%", end: () => `+=${distance() + 200}`, scrub: true } });
  });

  return (
    <div ref={ref} className={styles.hWrap}>
      <ol className={styles.hTrack} data-htrack style={{ ["--n" as string]: count }}>
        {children}
      </ol>
      <span className={styles.hProgress} aria-hidden="true">
        <span data-hprogress />
      </span>
    </div>
  );
}

/** Sticky index for scrollytelling bodies; highlights the section in view. */
export function ScrollyNav({ items }: { items: { id: string; title: string }[] }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useMotion(ref, () => {
    items.forEach((it, i) => {
      const el = document.getElementById(it.id);
      if (!el) return;
      ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 55%", onToggle: (self) => self.isActive && setActive(i) });
    });
    const body = ref.current?.closest("[data-scrolly]");
    if (body)
      gsap.fromTo(ref.current!.querySelector("[data-scrolly-progress]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: body, start: "top 55%", end: "bottom 55%", scrub: true } });
  });

  return (
    <nav ref={ref} className={styles.scrollyNav} aria-label="Sections on this page">
      <span className={styles.scrollyTrack} aria-hidden="true">
        <span data-scrolly-progress />
      </span>
      <ol>
        {items.map((it, i) => (
          <li key={it.id} data-on={i === active || undefined}>
            <SmartLink href={`#${it.id}`} className={styles.scrollyLink}>
              <span className={`${styles.scrollyIndex} num`}>{String(i + 1).padStart(2, "0")}</span>
              <span>{it.title}</span>
            </SmartLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Stacking layers: earlier panels recede as the next one slides over them. */
export function LayersMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useMotion(ref, ({ motion, desktop }) => {
    if (!motion || !desktop) return;
    const layers = gsap.utils.toArray<HTMLElement>("[data-layer]", ref.current!);
    layers.forEach((layer, i) => {
      const next = layers[i + 1];
      if (!next) return;
      gsap.to(layer.querySelector("[data-layer-inner]"), {
        scale: 0.94,
        opacity: 0.45,
        ease: "none",
        scrollTrigger: { trigger: next, start: "top 85%", end: "top 25%", scrub: true },
      });
    });
  });
  return (
    <div ref={ref} className={styles.layers}>
      {children}
    </div>
  );
}
