"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import { onSiteReady } from "@/lib/siteReady";
import type { IconName, Section, SitePage } from "@/content/site/types";
import { Aurora } from "@/components/fx/Aurora";
import { FloodLayer } from "@/components/fx/FloodLayer";
import { setFloodOrigin } from "@/components/fx/flood";
import { Icon } from "@/components/site/Icon";
import { SiteSection } from "@/components/site/Sections";
import { SectionHead } from "@/components/site/Title";
import { HeroCopy, useHeroIntro } from "@/components/services/InnerPage";
import { AnatomyShowcase } from "@/components/services/StageFeatures";
import { pad } from "@/components/services/stageMeta";
import inner from "@/components/services/InnerPage.module.css";
import styles from "./WhyPage.module.css";

type Of<K extends Section["kind"]> = Extract<Section, { kind: K }>;

const flood = {
  "data-flood": "",
  "data-glow": "",
  onPointerEnter: setFloodOrigin,
  onPointerLeave: setFloodOrigin,
};
const vars = (v: Record<string, string | number>) => v as CSSProperties;

/**
 * The same three situations, handled two ways (illustrative). The "with
 * ConvergeFlow" lines restate the stage pages: denials corrected and
 * resubmitted, coverage verified with evidence, aging worked by priority to a
 * documented close.
 */
const COMPARE: {
  icon: IconName;
  item: string;
  before: string;
  after: string;
}[] = [
  {
    icon: "alert",
    item: "A claim is rejected",
    before: "Flagged on a dashboard",
    after: "Corrected and resubmitted by a named owner",
  },
  {
    icon: "shield",
    item: "Coverage needs checking",
    before: "Left for your staff to chase",
    after: "Verified, with the payer reference recorded",
  },
  {
    icon: "clock",
    item: "A balance is aging",
    before: "Listed in a report",
    after: "Worked by priority to a documented close",
  },
];

/** A small picture of each reason, taken from its own card. */
const REASON_TAGS: Partial<Record<IconName, string[]>> = {
  tooth: ["CDT codes", "Tooth & surface", "Narratives", "Attachments"],
  fileCheck: ["Payer references", "Dates", "Submission proof"],
  chart: ["Daily queues", "Weekly trends", "Agreed measures"],
};

/** Photo behind the lead reason. */
const LEAD_PHOTO = "/assets/photos/v2/why-lead.jpg";

/* ------------------------------------------------------------------ hero */

/**
 * Why hero: the statement centred over a split panel. Drag the divider (or
 * use the arrow keys on it) to compare a dashboard alone, which reports the
 * problem, with the team, which fixes it.
 */
function WhyHero({ page }: { page: SitePage }) {
  const ref = useRef<HTMLElement>(null);
  const cmp = useRef<HTMLDivElement>(null);
  const range = useRef<HTMLInputElement>(null);
  useHeroIntro(ref);
  const v = page.hero.visual;
  const photo = v.kind === "photo" ? v.photo : null;
  const note = v.kind === "photo" ? v.note : undefined;

  const setSplit = (n: number) => cmp.current?.style.setProperty("--split", `${n}%`);

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    // the divider sweeps in from the right, uncovering the team's side
    const st = { v: 96 };
    setSplit(96);
    const tl = gsap.timeline({ paused: true });
    tl.to(
      st,
      {
        v: 50,
        duration: 2,
        ease: "expo.inOut",
        onUpdate: () => setSplit(st.v),
        onComplete: () => {
          if (range.current) range.current.value = "50";
        },
      },
      1.1,
    );
    tl.from(
      cmp.current!.querySelectorAll("[data-row]"),
      {
        opacity: 0,
        y: 18,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "opacity,transform",
      },
      1.4,
    );
    return onSiteReady(() => tl.play());
  });

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="page-title">
      <div className={inner.heroBg} aria-hidden="true">
        <span className={inner.heroAurora} data-aurora>
          <Aurora green={0.5} />
        </span>
        <span className={inner.heroGrid} />
      </div>

      <div className="container">
        <div className={styles.heroCopy}>
          <HeroCopy page={page} center />
        </div>

        <div ref={cmp} className={styles.compare} data-intro data-photo style={vars({ "--split": "50%" })}>
          <div className={`${styles.pane} ${styles.before}`}>
            <div className={styles.paneInner}>
              <header className={styles.paneHead}>
                <span className={styles.paneIcon} aria-hidden="true">
                  <Icon name="chart" />
                </span>
                <span>
                  <span className={styles.paneTitle}>A dashboard alone</span>
                  <span className={styles.paneSub}>The problem is reported.</span>
                </span>
              </header>
              <ul className={styles.rows}>
                {COMPARE.map((c) => (
                  <li key={c.item} className={styles.row} data-row>
                    <span className={styles.rowIcon} aria-hidden="true">
                      <Icon name={c.icon} />
                    </span>
                    <span className={styles.rowText}>
                      <span className={styles.rowItem}>{c.item}</span>
                      <span className={styles.rowState}>{c.before}</span>
                    </span>
                    <span className={styles.chip}>Reported</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`${styles.pane} ${styles.after}`}>
            <div className={styles.paneInner}>
              <header className={styles.paneHead}>
                {photo ? (
                  <span className={styles.avatar}>
                    <Image src={photo.src} alt="" fill quality={75} sizes="48px" />
                  </span>
                ) : (
                  <span className={styles.paneIcon} aria-hidden="true">
                    <Icon name="users" />
                  </span>
                )}
                <span>
                  <span className={styles.paneTitle}>With ConvergeFlow</span>
                  <span className={styles.paneSub}>{photo?.caption ?? "The team owns the work"}.</span>
                </span>
                {note && <span className={styles.paneNote}>{note}</span>}
              </header>
              <ul className={styles.rows}>
                {COMPARE.map((c) => (
                  <li key={c.item} className={styles.row} data-row>
                    <span className={styles.rowIcon} aria-hidden="true">
                      <Icon name="check" />
                    </span>
                    <span className={styles.rowText}>
                      <span className={styles.rowItem}>{c.item}</span>
                      <span className={styles.rowState}>{c.after}</span>
                    </span>
                    <span className={styles.chip}>Handled</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <span className={styles.divider} aria-hidden="true">
            <span className={styles.knob}>
              <svg viewBox="0 0 24 24">
                <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
              </svg>
            </span>
          </span>
          <input
            ref={range}
            type="range"
            min={8}
            max={92}
            defaultValue={50}
            className={styles.range}
            aria-label="Compare a dashboard alone with the ConvergeFlow team"
            onInput={(e) => setSplit(Number(e.currentTarget.value))}
          />
        </div>
        <p className={styles.compareNote}>Illustrative example · drag the divider to compare</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ six reasons */

/**
 * "Six reasons practices hand it over": a bento grid. The lead reason carries
 * a photo; the others carry a small picture of themselves (the PMS link, the
 * dental details, a named owner, the evidence kept, the reporting rhythm).
 * Cards turn light on hover.
 */
function Reasons({ s }: { s: Of<"cards"> }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    gsap.from(root.querySelectorAll("[data-card]"), {
      opacity: 0,
      y: 60,
      scale: 0.96,
      duration: 1.2,
      stagger: 0.09,
      ease: "expo.out",
      clearProps: "opacity,transform",
      scrollTrigger: {
        trigger: root.querySelector("[data-grid]"),
        start: "top 80%",
        once: true,
      },
    });
  });

  return (
    <section ref={ref} id={s.id} className={`section ${styles.reasons}`}>
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} />
        <ul className={styles.bento} data-grid>
          {s.items.map((item, k) => {
            const tags = item.icon ? REASON_TAGS[item.icon] : undefined;
            const lead = k === 0;
            return (
              <li key={item.title} className={styles.cell} data-cell={k} data-lead={lead || undefined} data-card {...(lead ? {} : flood)}>
                {lead ? (
                  <>
                    <Image src={LEAD_PHOTO} alt="" fill quality={85} sizes="(min-width: 1100px) 46vw, 92vw" className={styles.cellPhoto} />
                    <span className={styles.cellShade} aria-hidden="true" />
                  </>
                ) : (
                  <FloodLayer />
                )}
                <div className={styles.cellTop}>
                  <span className={styles.cellIcon} aria-hidden="true">
                    {item.icon && <Icon name={item.icon} />}
                  </span>
                  <span className={styles.cellNum} aria-hidden="true">
                    <b>{pad(k + 1)}</b>
                    <i>/ {pad(s.items.length)}</i>
                  </span>
                </div>
                <div className={styles.cellBody}>
                  <h3 className={styles.cellTitle}>{item.title}</h3>
                  <p className={styles.cellText}>{item.body}</p>
                  {item.icon === "link" && (
                    <p className={styles.link} aria-hidden="true">
                      <span>ConvergeFlow</span>
                      <i />
                      <span>OpenDental</span>
                    </p>
                  )}
                  {item.icon === "user" && (
                    <dl className={styles.owner} aria-hidden="true">
                      <div>
                        <dt>Owner</dt>
                        <dd>Named</dd>
                      </div>
                      <div>
                        <dt>Status</dt>
                        <dd>Documented</dd>
                      </div>
                    </dl>
                  )}
                  {tags && (
                    <ul className={styles.tags} aria-hidden="true">
                      {tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- accountability */

/** "Incomplete records, claims on hold, rejections and unposted receipts." -> four short lines. */
const listOf = (body: string) =>
  body
    .replace(/\.$/, "")
    .split(/, | and /)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t[0].toUpperCase() + t.slice(1));

/**
 * "You always know where every claim stands", in the comparison's style: one
 * panel split into a dark daily half and a light weekly half, each listing what
 * it covers, with the defined measures running across the foot.
 */
function Accountability({ s }: { s: Of<"cadence"> }) {
  const ref = useRef<HTMLElement>(null);
  const [daily, weekly, ...rest] = s.items;

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.querySelector("[data-board]"),
        start: "top 78%",
        once: true,
      },
      defaults: { ease: "expo.out" },
    });
    tl.from(root.querySelector("[data-board]"), {
      opacity: 0,
      y: 60,
      duration: 1.3,
      clearProps: "opacity,transform",
    })
      .from(
        root.querySelectorAll("[data-line]"),
        {
          opacity: 0,
          x: -18,
          duration: 0.8,
          stagger: 0.07,
          clearProps: "opacity,transform",
        },
        0.4,
      )
      .from(root.querySelector("[data-foot]"), { opacity: 0, y: 20, duration: 0.9, clearProps: "opacity,transform" }, 0.9);
  });

  const half = (item: typeof daily, tone: "dark" | "light") => (
    <div className={styles.half} data-tone={tone}>
      <header className={styles.halfHead}>
        <span className={styles.halfIcon} aria-hidden="true">
          {item.icon && <Icon name={item.icon} />}
        </span>
        <h3 className={styles.halfTitle}>{item.title}</h3>
        {tone === "dark" && <span className={styles.live} aria-hidden="true" />}
      </header>
      <ul className={styles.lines}>
        {listOf(item.body).map((t, k) => (
          <li key={t} data-line>
            <span className={styles.lineNum} aria-hidden="true">
              {pad(k + 1)}
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section ref={ref} id={s.id} className={`section ${styles.account}`}>
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} align="center" />
        <div className={styles.board} data-board>
          <div className={styles.halves}>
            {daily && half(daily, "dark")}
            {weekly && half(weekly, "light")}
            <span className={styles.seam} aria-hidden="true">
              <Icon name="refresh" />
            </span>
          </div>
          {rest.map((item) => (
            <div key={item.title} className={styles.foot} data-foot>
              <span className={styles.footIcon} aria-hidden="true">
                {item.icon && <Icon name={item.icon} />}
              </span>
              <p>
                <b>{item.title}</b>
                {item.body}
              </p>
            </div>
          ))}
        </div>
        {s.note && <p className={styles.accountNote}>{s.note}</p>}
      </div>
    </section>
  );
}

/** Why ConvergeFlow: the split comparison, the six reasons as a bento grid, then the tooth check and the reporting rhythm. */
export function WhyPage({ page }: { page: SitePage }) {
  return (
    <>
      <WhyHero page={page} />
      {page.sections.map((s, k) => {
        if (s.kind === "cards") return <Reasons key={k} s={s} />;
        if (s.kind === "anatomy") return <AnatomyShowcase key={k} s={s} />;
        if (s.kind === "cadence") return <Accountability key={k} s={s} />;
        return <SiteSection key={k} s={s} />;
      })}
    </>
  );
}
