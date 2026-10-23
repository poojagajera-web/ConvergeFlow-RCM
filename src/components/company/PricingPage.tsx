"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import { onSiteReady } from "@/lib/siteReady";
import { JOURNEY, STAGES } from "@/content/site/services";
import type { IconName, Section, SitePage } from "@/content/site/types";
import { Aurora } from "@/components/fx/Aurora";
import { Icon } from "@/components/site/Icon";
import { SiteSection } from "@/components/site/Sections";
import { SectionHead } from "@/components/site/Title";
import { HeroCopy, useHeroIntro } from "@/components/services/InnerPage";
import { pad } from "@/components/services/stageMeta";
import inner from "@/components/services/InnerPage.module.css";
import styles from "./PricingPage.module.css";

type Of<K extends Section["kind"]> = Extract<Section, { kind: K }>;

const vars = (v: Record<string, string | number>) => v as CSSProperties;

/** One icon per proposal step: the conversation, the scope, the proposal, the terms. */
const STEP_ICONS: IconName[] = ["chat", "layers", "file", "fileCheck"];

/* ------------------------------------------------------------------ hero */

type Factor = { title: string; icon?: IconName };

/**
 * Pricing hero: the copy beside a price tag hanging on its string, reading
 * "your scope" where a price would be, ringed by the six things that shape a
 * proposal turning slowly around it. The tag sways and leans with the pointer.
 */
function PricingHero({ page, factors }: { page: SitePage; factors: Factor[] }) {
  const ref = useRef<HTMLElement>(null);
  useHeroIntro(ref);

  useMotion(ref, ({ motion, desktop }) => {
    if (!motion) return;
    const root = ref.current!;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
    tl.from(
      root.querySelector("[data-ringline]"),
      {
        scale: 0.6,
        opacity: 0,
        duration: 1.8,
        clearProps: "transform,opacity",
      },
      0.5,
    )
      .from(
        root.querySelector("[data-hang]"),
        {
          yPercent: -70,
          opacity: 0,
          duration: 1.8,
          ease: "elastic.out(1, 0.5)",
          clearProps: "transform,opacity",
        },
        0.7,
      )
      .from(
        root.querySelectorAll("[data-factor]"),
        {
          opacity: 0,
          scale: 0.6,
          duration: 0.9,
          stagger: 0.1,
          clearProps: "opacity,scale",
        },
        1.1,
      );
    let onMove: ((e: PointerEvent) => void) | null = null;
    const lean = root.querySelector<HTMLElement>("[data-lean]");
    if (desktop && lean) {
      const r = gsap.quickTo(lean, "rotation", {
        duration: 1.4,
        ease: "elastic.out(1, 0.45)",
      });
      onMove = (e: PointerEvent) => {
        const b = root.getBoundingClientRect();
        r(((e.clientX - b.left) / b.width - 0.5) * -14);
      };
      root.addEventListener("pointermove", onMove);
    }
    const cancel = onSiteReady(() => tl.play());
    return () => {
      cancel();
      if (onMove) root.removeEventListener("pointermove", onMove);
    };
  });

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="page-title">
      <div className={inner.heroBg} aria-hidden="true">
        <span className={inner.heroAurora} data-aurora>
          <Aurora green={0.5} />
        </span>
        <span className={inner.heroGrid} />
      </div>

      <div className={`container ${styles.heroLayout}`}>
        <div className={styles.heroCopy}>
          <HeroCopy page={page} actions={false} />
        </div>

        <div className={styles.orbitStage} data-intro data-photo>
          <span className={styles.orbitGlow} aria-hidden="true" />
          <span className={styles.ringLine} data-ringline aria-hidden="true" />
          <span className={styles.ringTicks} aria-hidden="true" />
          <span className={styles.spokes} aria-hidden="true" style={vars({ "--n": factors.length })}>
            {factors.map((fac, k) => (
              <i key={fac.title} style={vars({ "--i": k })} />
            ))}
          </span>
          <span className={styles.pulse} aria-hidden="true" />
          <ul className={styles.ring} aria-label="What shapes a proposal" style={vars({ "--n": factors.length })}>
            {factors.map((fac, k) => (
              <li key={fac.title} className={styles.factor} style={vars({ "--i": k })} data-factor>
                <span className={styles.factorInner}>
                  <span className={styles.factorIcon} aria-hidden="true">
                    {fac.icon && <Icon name={fac.icon} />}
                  </span>
                  {fac.title}
                </span>
              </li>
            ))}
          </ul>
          <div className={styles.hang} data-hang aria-hidden="true">
            <div className={styles.lean} data-lean>
              <span className={styles.string} />
              <div className={styles.tag}>
                <span className={styles.tagShine} />
                <span className={styles.eyelet} />
                <p className={styles.tagKicker}>Price</p>
                <p className={styles.tagBig}>
                  Your
                  <br />
                  scope.
                </p>
                <p className={styles.tagSmall}>Set in a written proposal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- scope builder */

/**
 * "What we'll ask about", as a scope builder: pick the stages our team would
 * own (grouped as in the services), see the rest of what the conversation
 * covers, and watch a summary of the request build beside it. A planning aid:
 * nothing is priced and nothing is sent.
 */
function ScopeBuilder({ s }: { s: Of<"cards"> }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [first, ...rest] = s.items;
  const toggle = (href: string) => setPicked((p) => (p.includes(href) ? p.filter((h) => h !== href) : [...p, href]));
  const chosen = STAGES.filter((st) => picked.includes(st.href));

  return (
    <section id={s.id} className={`section ${styles.scope}`}>
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} />
        <div className={styles.builder}>
          <div className={styles.builderMain}>
            <div className={styles.stepHead}>
              <span aria-hidden="true">1</span>
              <div>
                <h3>{first.title}</h3>
                <p>{first.body}</p>
              </div>
            </div>

            <div className={styles.groups}>
              {JOURNEY.map((g, gi) => (
                <div key={g.title} className={styles.group} role="group" aria-labelledby={`scope-group-${gi}`}>
                  <p id={`scope-group-${gi}`} className={styles.groupTitle}>
                    {g.title}
                  </p>
                  <div className={styles.toggles}>
                    {g.stages.map((st) => (
                      <button key={st.href} type="button" className={styles.toggle} aria-pressed={picked.includes(st.href)} onClick={() => toggle(st.href)}>
                        <span className={styles.box} aria-hidden="true">
                          <Icon name="check" />
                        </span>
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.quickPick}>
              <button type="button" onClick={() => setPicked(STAGES.map((st) => st.href))} disabled={picked.length === STAGES.length}>
                Select all {STAGES.length}
              </button>
              <button type="button" onClick={() => setPicked([])} disabled={picked.length === 0}>
                Clear
              </button>
            </div>

            <div className={styles.stepHead}>
              <span aria-hidden="true">2</span>
              <div>
                <h3>Everything else we&rsquo;ll ask about</h3>
              </div>
            </div>
            <ul className={styles.ask}>
              {rest.map((item) => (
                <li key={item.title} className={styles.askItem}>
                  <span className={styles.askIcon} aria-hidden="true">
                    {item.icon && <Icon name={item.icon} />}
                  </span>
                  <span>
                    <b>{item.title}</b>
                    <span>{item.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <aside className={styles.summary} aria-labelledby="scope-summary">
            <p id="scope-summary" className={styles.sumKicker}>
              Your proposal request
            </p>
            <p className={styles.sumCount} aria-live="polite">
              <b>{chosen.length}</b>
              <span>
                of {STAGES.length} stages
                <br />
                in scope
              </span>
            </p>
            <span className={styles.meter} aria-hidden="true">
              <span style={vars({ "--f": chosen.length / STAGES.length })} />
            </span>
            {chosen.length ? (
              <ul className={styles.sumList}>
                {chosen.map((st) => (
                  <li key={st.href}>
                    <Icon name="check" />
                    <span>
                      {st.label}
                      <small>{st.group}</small>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.sumEmpty}>Choose the stages you&rsquo;d like our team to own.</p>
            )}
            <p className={styles.sumFee}>
              <span>Fee</span>
              <b>Set from this scope in a written proposal</b>
            </p>
            <ButtonLink href="/demo/" variant="primary">
              Request a proposal
            </ButtonLink>
            <p className={styles.sumNote}>A planning aid, not a quote. Nothing is sent from this page.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- proposal steps */

/** "From conversation to proposal": four cards on a light sheet, joined by a line that draws as they arrive. */
function ProposalSteps({ s }: { s: Of<"steps"> }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.querySelector("[data-sheet]"),
        start: "top 75%",
        once: true,
      },
      defaults: { ease: "expo.out" },
    });
    tl.from(root.querySelector("[data-sheet]"), {
      opacity: 0,
      y: 60,
      duration: 1.2,
      clearProps: "opacity,transform",
    })
      .from(
        root.querySelector("[data-line]"),
        {
          scaleX: 0,
          duration: 1.6,
          ease: "power2.inOut",
          clearProps: "transform",
        },
        0.4,
      )
      .from(
        root.querySelectorAll("[data-step]"),
        {
          opacity: 0,
          y: 30,
          duration: 1,
          stagger: 0.18,
          clearProps: "opacity,transform",
        },
        0.5,
      );
  });

  return (
    <section ref={ref} id={s.id} className={`section ${styles.steps}`}>
      <div className="container">
        <div className={styles.sheet} data-sheet>
          <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} />
          <div className={styles.flow}>
            <span className={styles.flowLine} data-line aria-hidden="true" />
            <ol className={styles.flowList}>
              {s.items.map((item, k) => (
                <li key={item.title} className={styles.flowStep} data-step>
                  <span className={styles.flowIcon} aria-hidden="true">
                    <Icon name={STEP_ICONS[k] ?? "check"} />
                    <span>{pad(k + 1)}</span>
                  </span>
                  <h3 className={styles.flowTitle}>{item.title}</h3>
                  <p className={styles.flowBody}>{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- sign checklist */

/**
 * "Questions to settle in every proposal", as an agreement read clause by
 * clause: scrolling through it ticks each clause in turn, then a signature
 * draws itself on the line and a stamp lands. The signature is a flourish,
 * not a name.
 */
function SignChecklist({ s }: { s: Of<"table"> }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, ({ motion }) => {
    const root = ref.current!;
    const sig = root.querySelector<SVGPathElement>("[data-sig]");
    if (!motion) {
      root.setAttribute("data-done", "");
      return;
    }
    const clauses = gsap.utils.toArray<HTMLElement>("[data-clause]", root);
    const tl = gsap.timeline({
      // a clause reads as settled once its tick has landed (checked as the scrub plays, not only on scroll)
      onUpdate: () => clauses.forEach((c, k) => c.toggleAttribute("data-on", tl.time() >= k + 0.6)),
      scrollTrigger: {
        trigger: root.querySelector("[data-doc]"),
        start: "top 70%",
        end: "bottom 75%",
        scrub: 0.6,
      },
    });
    tl.fromTo(root.querySelector("[data-progress]"), { scaleY: 0 }, { scaleY: 1, ease: "none", duration: clauses.length }, 0);
    clauses.forEach((c, k) => {
      tl.fromTo(c.querySelector("[data-tick]"), { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(2.5)" }, k + 0.5);
    });
    if (sig) tl.fromTo(sig, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: "none" }, clauses.length);
    tl.fromTo(
      root.querySelector("[data-stamp]"),
      { opacity: 0, scale: 2.2, rotate: -11 },
      {
        opacity: 0.9,
        scale: 1,
        rotate: 0,
        duration: 0.5,
        ease: "back.out(1.6)",
      },
      clauses.length + 1.2,
    );
  });

  return (
    <section ref={ref} id={s.id} className={`section ${styles.sign}`}>
      <div className={`container ${styles.signLayout}`}>
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} />
        <div className={styles.agreement} data-doc>
          <header className={styles.agreeHead}>
            <Image src="/assets/logos/convergeflow-mark-onlight.png" alt="" width={180} height={180} className={styles.agreeMark} />
            <span className={styles.agreeTitle}>Proposal checklist</span>
            <span className={styles.agreeTag}>{s.head[1]}</span>
          </header>
          <div className={styles.clauseWrap}>
            <span className={styles.progress} aria-hidden="true">
              <i data-progress />
            </span>
            <ol className={styles.clauses}>
              {s.rows.map((r, k) => (
                <li key={r[0]} className={styles.clause} data-clause>
                  <span className={styles.clauseNum} aria-hidden="true">
                    §{k + 1}
                  </span>
                  <div className={styles.clauseText}>
                    <h3>{r[0]}</h3>
                    <p>{r[1]}</p>
                  </div>
                  <span className={styles.check} aria-hidden="true">
                    <span data-tick>
                      <Icon name="check" />
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          {s.note && <p className={styles.listNote}>{s.note}</p>}
          <footer className={styles.signRow}>
            <div className={styles.signLine}>
              <svg viewBox="0 0 240 60" aria-hidden="true">
                <path data-sig pathLength={1} d="M6 42c14-2 22-30 34-30 9 0-4 34 6 34 8 0 14-22 22-22 6 0 2 18 9 18 9 0 13-16 22-16 7 0 3 14 10 14 12 0 20-24 32-24 10 0 4 22 16 22 14 0 30-10 48-12 12-1 22 2 30 6" />
              </svg>
              <span>Signed once every clause is settled</span>
            </div>
            <span className={styles.signStamp} data-stamp aria-hidden="true">
              Settle before
              <br />
              you sign
            </span>
          </footer>
        </div>
      </div>
    </section>
  );
}

/** Pricing: the price-tag hero, the scope builder, the steps to a proposal and the checklist to settle. */
export function PricingPage({ page }: { page: SitePage }) {
  const shapes = page.sections.find((x): x is Of<"cards"> => x.kind === "cards");
  // the stages in scope are the builder's first question; the ring shows the rest
  const factors = (shapes?.items ?? []).map((it) => ({
    title: it.title,
    icon: it.icon,
  }));
  return (
    <>
      <PricingHero page={page} factors={factors} />
      {page.sections.map((s, k) => {
        if (s.kind === "cards") return <ScopeBuilder key={k} s={s} />;
        if (s.kind === "steps") return <ProposalSteps key={k} s={s} />;
        if (s.kind === "table") return <SignChecklist key={k} s={s} />;
        return <SiteSection key={k} s={s} />;
      })}
    </>
  );
}
