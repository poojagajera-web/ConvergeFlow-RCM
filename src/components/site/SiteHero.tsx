"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { DemoForm } from "@/components/forms/DemoForm";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, SplitText } from "@/lib/gsap";
import { onSiteReady } from "@/lib/siteReady";
import { liveHref } from "@/content/navigation";
import { CONTACT } from "@/content/site/company";
import { DEMO_FORM } from "@/content/site/forms";
import type { Hero } from "@/content/site/types";
import { FloatTokens, type Token } from "@/components/fx/FloatTokens";
import { Starfield } from "@/components/fx/Starfield";
import { Rays } from "@/components/fx/Rays";
import { Icon } from "./Icon";
import { PaperDoc, Polaroid, StickyNote } from "./Paper";
import { TitleText } from "./Title";
import styles from "./SiteHero.module.css";

/** Decorative shorthand drifting behind inner-page heroes. */
const TOKENS: Token[] = [
  { text: "837D", x: 4, y: 18, depth: 0.7, rotate: -6, boxed: true },
  { text: "ERA", x: 46, y: 12, depth: 0.35 },
  { text: "CDT", x: 3, y: 78, depth: 0.5 },
  { text: "COB", x: 52, y: 86, depth: 0.6, rotate: 8, boxed: true },
  { text: "EOB", x: 94, y: 14, depth: 0.4 },
  { text: "NPI", x: 92, y: 88, depth: 0.35 },
];

function Visual({ hero }: { hero: Hero }) {
  const v = hero.visual;
  if (v.kind === "document")
    return (
      <div className={styles.docStage}>
        <span className={styles.orbit} aria-hidden="true" />
        <span className={styles.orbit} data-r="2" aria-hidden="true" />
        <span className={styles.sheetBack} aria-hidden="true" />
        <PaperDoc doc={v.doc} className={styles.doc} stampDelay={1.4} />
      </div>
    );
  if (v.kind === "photo")
    return (
      <div className={styles.photoStage}>
        <Polaroid photo={v.photo} tilt={-4} priority className={styles.polaroid} />
        {v.note && <StickyNote text={v.note} className={styles.sticky} tilt={5} />}
        {v.chips && (
          <ul className={styles.proof}>
            {v.chips.map((c) => (
              <li key={c} data-proof>
                <Icon name="check" />
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  if (v.kind === "form")
    return (
      <div id="demo-request" className={styles.formStage}>
        <DemoForm title={DEMO_FORM.title} intro={DEMO_FORM.intro} fields={DEMO_FORM.fields} submit={DEMO_FORM.submit} privacy="" />
      </div>
    );
  if (v.kind === "contact")
    return (
      <div className={styles.contactStage}>
        <div className={styles.contactCard} data-glow>
          <span className={styles.contactGlow} aria-hidden="true" />
          <span className={styles.contactSeal} aria-hidden="true" />
          <p className={styles.contactKicker}>Let&rsquo;s talk</p>
          <p className={styles.contactName}>{CONTACT.name}</p>
          <a className={styles.contactLine} href={`mailto:${CONTACT.email}`}>
            <Icon name="mail" />
            {CONTACT.email}
          </a>
          <a className={styles.contactLine} href={`tel:${CONTACT.tel}`}>
            <Icon name="phone" />
            {CONTACT.phone}
          </a>
        </div>
        <StickyNote text="Please don't include patient data" tone="mint" className={styles.contactNote} tilt={-2} />
      </div>
    );
  return null;
}

/**
 * Inner-page hero: light shafts, stars and drifting shorthand behind a
 * glowing headline that resolves word by word, plus the page's visual.
 */
export function SiteHero({ hero }: { hero: Hero }) {
  const ref = useRef<HTMLElement>(null);
  const actions = hero.actions.filter((a) => liveHref(a.href));
  const centered = hero.visual.kind === "none";

  useMotion(ref, ({ motion }) => {
    const root = ref.current!;
    gsap.set(root.querySelectorAll("[data-intro]"), { opacity: 1 });
    if (!motion) return;
    // Paused until the loading screen lifts.
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.05, paused: true });
    tl.fromTo(root.querySelector("[data-rays]"), { autoAlpha: 0 }, { autoAlpha: 0.5, duration: 2.4 }, 0);
    tl.fromTo(root.querySelector("[data-horizon]"), { scaleX: 0.3, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 2, ease: "power3.out" }, 0);
    tl.from(root.querySelectorAll("[data-intro-fade]"), { opacity: 0, y: -10, filter: "blur(8px)", duration: 1 }, 0.1);
    const title = root.querySelector<HTMLElement>("h1")!;
    let added = false;
    SplitText.create(title, {
      type: "words",
      autoSplit: true,
      onSplit(self) {
        const t = gsap.from(self.words, { opacity: 0, y: 16, filter: "blur(14px)", duration: 1.2, stagger: 0.06, paused: added });
        if (!added) tl.add(t, 0.2);
        added = true;
        return t;
      },
    });
    tl.from(root.querySelectorAll("[data-intro-rise]"), { opacity: 0, y: 24, filter: "blur(10px)", duration: 1.1, stagger: 0.1 }, 0.6);
    const stage = root.querySelector("[data-visual]");
    if (stage) {
      // Keep the inline opacity: clearing it would let `.js [data-intro]` hide the stage again.
      tl.from(stage, { opacity: 0, y: 60, scale: 0.94, filter: "blur(12px)", duration: 1.6, clearProps: "transform,filter" }, 0.5);
      tl.from(root.querySelectorAll("[data-proof]"), { opacity: 0, x: -14, duration: 0.8, stagger: 0.1, clearProps: "opacity,transform" }, 1.1);
    }
    const float = root.querySelector("[data-float]");
    if (float) gsap.to(float, { y: -10, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });
    return onSiteReady(() => tl.play());
  });

  return (
    <section ref={ref} className={`${styles.hero} on-dark`} data-centered={centered || undefined} data-visual-kind={hero.visual.kind} aria-labelledby="page-title">
      <div className={styles.bg} aria-hidden="true">
        <Rays intensity={0.85} origin="42%" />
        <span className={styles.grid} />
        <Starfield density={0.6} shooting={false} />
        <span className={styles.horizon} data-horizon />
      </div>
      <FloatTokens tokens={TOKENS} className={styles.tokens} />
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <p className="eyebrow" data-intro data-intro-fade>
            {hero.eyebrow}
          </p>
          <h1 id="page-title" className={styles.title} data-intro>
            <TitleText title={hero.title} accent={hero.accent} />
          </h1>
          <p className={styles.lead} data-intro data-intro-rise>
            {hero.lead}
          </p>
          {actions.length > 0 && (
            <div className={styles.actions} data-intro data-intro-rise>
              {actions.map((a, i) => (
                <ButtonLink key={a.href} href={a.href} variant={i === 0 ? "primary" : "secondary"}>
                  {a.label}
                </ButtonLink>
              ))}
            </div>
          )}
          {hero.facts && (
            <ul className={styles.facts} data-intro data-intro-rise>
              {hero.facts.map((f) => (
                <li key={f}>
                  <span className={styles.factIcon}>
                    <Icon name="check" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
        {!centered && (
          <div className={styles.visual} data-intro data-visual>
            <div data-float={hero.visual.kind === "form" ? undefined : true}>
              <Visual hero={hero} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
