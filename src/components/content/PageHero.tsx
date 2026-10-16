"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, SplitText } from "@/lib/gsap";
import { CATEGORY_LABEL, type Page } from "@/content/pages";
import type { Design } from "@/content/pageDesign";
import { liveHref } from "@/content/navigation";
import { AudienceStrip, HeroVisual } from "./HeroVisual";
import { Rich } from "./Rich";
import styles from "./PageHero.module.css";

/** Visual-specific entrance choreography, added to the hero timeline. */
function animateVisual(tl: gsap.core.Timeline, visual: HTMLElement, at: number) {
  const q = (s: string) => visual.querySelectorAll<HTMLElement>(s);
  const one = (s: string) => visual.querySelector<HTMLElement>(s);

  if (q("[data-slab]").length) {
    tl.from(q("[data-slab]"), { opacity: 0, y: -80, duration: 1.2, stagger: { each: 0.09, from: "end" }, clearProps: "opacity,transform" }, at);
  } else if (q("[data-fan]").length) {
    tl.from(q("[data-fan]"), { opacity: 0, x: 80, duration: 1.1, stagger: 0.1, clearProps: "opacity,transform" }, at);
  } else {
    tl.from(visual, { opacity: 0, y: 60, rotationX: 12, transformPerspective: 1400, transformOrigin: "50% 0%", duration: 1.4 }, at);
    tl.from(q("[data-item]"), { opacity: 0, y: 16, duration: 0.8, stagger: 0.06, clearProps: "opacity,transform" }, at + 0.3);
  }
  const rail = one("[data-rail]");
  if (rail) tl.fromTo(rail, { scaleY: 0 }, { scaleY: 1, duration: 1.4, ease: "power3.inOut" }, at + 0.2);
  const railX = one("[data-rail-x]");
  if (railX) tl.fromTo(railX, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power3.inOut" }, at + 0.2);
  const rings = q("[data-ring]");
  if (rings.length) tl.from(rings, { scale: 0.4, opacity: 0, duration: 1.4, stagger: 0.15 }, at).from(one("[data-core]"), { scale: 0, duration: 1, ease: "back.out(1.8)" }, at + 0.3);
  const ticks = q("[data-tick]");
  if (ticks.length) tl.from(ticks, { drawSVG: "0%", duration: 0.5, stagger: 0.18, ease: "power2.out" }, at + 0.8);
  const typing = q("[data-type]");
  if (typing.length) tl.from(typing, { scaleX: 0, duration: 0.8, stagger: 0.25, ease: "power2.inOut" }, at + 0.9);
  const current = one("[data-current]");
  if (current) tl.fromTo(current, { "--sweep": "0%" }, { "--sweep": "100%", duration: 0.9, ease: "power3.out" }, at + 1);
}

/**
 * Content-page hero. Three layouts (split, centered, editorial) on the dark
 * measurement grid, each with the page's own visual.
 */
export function PageHero({ page, design }: { page: Page; design: Design }) {
  const ref = useRef<HTMLElement>(null);
  const buttons = page.hero.buttons.filter((b) => liveHref(b.href));
  const layout = design.hero;

  useMotion(ref, ({ motion, desktop }) => {
    const root = ref.current!;
    gsap.set(root.querySelectorAll("[data-intro]"), { opacity: 1 });
    if (!motion) return;

    const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 });
    tl.from(root.querySelectorAll("[data-intro-fade]"), { opacity: 0, y: 14, duration: 0.9, stagger: 0.08 }, 0);

    const title = root.querySelector<HTMLElement>("h1")!;
    let added = false;
    SplitText.create(title, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        self.masks.forEach((m) => m.classList.add("split-line-mask"));
        const t = gsap.from(self.lines, { yPercent: 110, duration: 1.3, stagger: 0.1, paused: added });
        if (!added) tl.add(t, 0.15);
        added = true;
        return t;
      },
    });

    tl.from(root.querySelectorAll("[data-intro-rise]"), { opacity: 0, y: 24, duration: 1.1, stagger: 0.1 }, 0.55);
    const visual = root.querySelector<HTMLElement>("[data-visual]");
    if (visual) animateVisual(tl, visual, layout === "center" ? 0.75 : 0.5);

    if (desktop && design.visual !== "form") {
      gsap.to(root.querySelector("[data-hero-copy]"), {
        yPercent: -10,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(root.querySelector("[data-hero-glow]"), {
        yPercent: 30,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    }
  });

  const visual =
    design.visual === "none" ? null : (
      <div className={styles.visual} data-intro>
        <HeroVisual page={page} kind={design.visual} />
      </div>
    );

  return (
    <section
      ref={ref}
      className={`${styles.hero} on-dark`}
      data-layout={layout}
      data-visual-kind={design.visual}
      data-dark-body={design.dark || undefined}
      aria-labelledby="page-title"
    >
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" data-hero-glow />
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy} data-hero-copy>
          <p className="eyebrow" data-intro data-intro-fade>
            {CATEGORY_LABEL[page.category]}
          </p>
          <h1 id="page-title" className={styles.title} data-intro>
            {page.hero.title}
          </h1>
          <div className={styles.under}>
            <div className={styles.underMain}>
            <div className={styles.lead} data-intro data-intro-rise>
              {page.hero.blocks.map((b, i) =>
                b.type === "p" ? (
                  <p key={i}>
                    <Rich text={b.text} linkClass={styles.leadLink} />
                  </p>
                ) : null,
              )}
            </div>
            {buttons.length > 0 && (
              <div className={styles.actions} data-intro data-intro-rise>
                {buttons.map((b, i) => (
                  <ButtonLink key={b.href} href={b.href} variant={i === 0 ? "primary" : "secondary"}>
                    {b.label}
                  </ButtonLink>
                ))}
              </div>
            )}
            {page.category === "industries" && (
              <div data-intro data-intro-rise>
                <AudienceStrip route={page.route} />
              </div>
            )}
            </div>
            {layout === "editorial" && visual}
          </div>
        </div>
        {layout !== "editorial" && visual}
      </div>
    </section>
  );
}
