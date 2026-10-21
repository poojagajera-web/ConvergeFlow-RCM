"use client";

import { useRef } from "react";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import { HOME_DASH } from "@/content/site/home";
import type { IconName } from "@/content/site/types";
import { Icon } from "@/components/site/Icon";
import styles from "./Dashboard.module.css";

const STATUS: { icon: IconName; label: string; status: string }[] = [
  { icon: "shield", label: "Benefits", status: "Verified" },
  { icon: "send", label: "Claims", status: "Accepted" },
  { icon: "coins", label: "Payments", status: "Posted" },
  { icon: "refresh", label: "A/R", status: "Followed up" },
];

const ROWS: { stage: string; owner: string; status: string }[] = [
  { stage: "Registration", owner: "VS", status: "Complete" },
  { stage: "Eligibility & benefits", owner: "VS", status: "Verified" },
  { stage: "Dental coding", owner: "CS", status: "Matched" },
  { stage: "Payment posting", owner: "PS", status: "Reconciled" },
];

const OWNERS = ["YP", "VS", "CS", "PS", "AR"];
const EVIDENCE: { icon: IconName; label: string }[] = [
  { icon: "eye", label: "Portal capture" },
  { icon: "stamp", label: "Payer reference" },
  { icon: "clock", label: "Timestamp" },
  { icon: "user", label: "Named owner" },
];

const CHART = "M0 120 C 60 110, 90 70, 150 78 S 250 120, 320 86 S 430 40, 500 52 S 610 92, 680 60 S 760 30, 800 34";

/**
 * "Every handoff, visible": a reporting dashboard that rises from a tilted
 * desk angle and flattens as the page scrolls (pinned on desktop), while four
 * live widgets lift off its surface and float out around it, joined back by
 * glowing lines. All content is illustrative.
 */
export function Dashboard() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ motion, desktop }) => {
    if (!motion || !desktop) return;
    const root = ref.current!;
    root.setAttribute("data-live", "");
    const widgets = gsap.utils.toArray<HTMLElement>("[data-widget]", root);
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: root.querySelector("[data-pin]"), start: "top top", end: "+=150%", pin: true, scrub: 0.8 },
    });
    tl.fromTo(root.querySelector("[data-screen]"), { rotateX: 42, scale: 0.86, yPercent: 14, opacity: 0.55 }, { rotateX: 0, scale: 1, yPercent: 0, opacity: 1, duration: 1 }, 0)
      .fromTo(root.querySelector("[data-floor]"), { opacity: 0.2, scaleX: 0.7 }, { opacity: 1, scaleX: 1, duration: 1 }, 0)
      .fromTo(root.querySelector("[data-chart]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8 }, 0.3)
      .fromTo(
        widgets,
        { opacity: 0, scale: 0.7, x: (i) => [160, -160, 160, -160][i], y: (i) => [80, 80, -60, -60][i], filter: "blur(10px)" },
        { opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)", duration: 0.7, stagger: 0.08, ease: "power2.out" },
        0.45,
      )
      .fromTo(root.querySelectorAll("[data-link]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, stagger: 0.06 }, 0.75)
      .to({}, { duration: 0.25 });
    return () => root.removeAttribute("data-live");
  });

  return (
    <section ref={ref} className={styles.section} aria-labelledby="dash-title">
      <div className={styles.pin} data-pin>
        <header className={`container ${styles.head}`}>
          <p className="eyebrow" data-anim="fade">
            {HOME_DASH.chip}
          </p>
          <h2 id="dash-title" className={styles.title} data-anim="words">
            {HOME_DASH.title} <span className="accent-text">{HOME_DASH.accent}</span>
          </h2>
          <p className={styles.body} data-anim="fade">
            {HOME_DASH.body}
          </p>
        </header>

        <div className={`container ${styles.stageWrap}`}>
          <div className={styles.stage} aria-label="Illustrative reporting view: daily queues, weekly trends, evidence for each check and a named owner for every next step" role="img">
            <span className={styles.floor} data-floor aria-hidden="true" />

            {/* Lines from each widget back to the screen */}
            <svg className={styles.links} viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
              <path d="M120 150 C 200 150, 220 210, 300 210" pathLength={1} data-link />
              <path d="M880 120 C 800 120, 780 190, 700 190" pathLength={1} data-link />
              <path d="M130 470 C 210 470, 230 410, 310 410" pathLength={1} data-link />
              <path d="M870 480 C 790 480, 770 420, 690 420" pathLength={1} data-link />
            </svg>

            {/* Main screen */}
            <div className={styles.screenWrap}>
              <div className={styles.screen} data-screen aria-hidden="true">
                <header className={styles.bar}>
                  <span className={styles.dots}>
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className={styles.url}>
                    <span className={styles.urlMark} />
                    Practice report
                  </span>
                  <span className={styles.seg}>
                    <i data-on>Today</i>
                    <i>This week</i>
                  </span>
                </header>
                <div className={styles.app}>
                  <aside className={styles.nav}>
                    {(["layers", "inbox", "chart", "shield", "users"] as const).map((n, i) => (
                      <span key={n} data-on={i === 0 || undefined}>
                        <Icon name={n} />
                      </span>
                    ))}
                  </aside>
                  <div className={styles.main}>
                    <ul className={styles.status}>
                      {STATUS.map((s) => (
                        <li key={s.label}>
                          <span className={styles.statusIcon}>
                            <Icon name={s.icon} />
                          </span>
                          <span className={styles.statusText}>
                            <span>{s.label}</span>
                            <b>
                              <i />
                              {s.status}
                            </b>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className={styles.chartBox}>
                      <p className={styles.chartHead}>
                        <span>Handoffs followed to a decision</span>
                        <span className={styles.tag}>Illustrative</span>
                      </p>
                      <svg className={styles.chart} viewBox="0 0 800 150" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="dash-area" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0" stopColor="#3fd6c3" stopOpacity="0.35" />
                            <stop offset="1" stopColor="#3fd6c3" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d={`${CHART} L800 150 L0 150 Z`} className={styles.area} />
                        <path d={CHART} className={styles.line} pathLength={1} data-chart />
                      </svg>
                    </div>
                    <ul className={styles.table}>
                      {ROWS.map((r) => (
                        <li key={r.stage}>
                          <span>{r.stage}</span>
                          <span className={styles.owner}>{r.owner}</span>
                          <span className={styles.pill}>{r.status}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating widgets */}
            <article className={styles.widget} data-widget data-pos="tl">
              <p className={styles.wHead}>
                <Icon name="inbox" /> Daily queue
              </p>
              <ul className={styles.queue}>
                {HOME_DASH.daily.slice(0, 3).map((d, i) => (
                  <li key={d} data-done={i === 0 || undefined}>
                    <span className={styles.qDot}>
                      <Icon name="check" />
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
            </article>

            <article className={styles.widget} data-widget data-pos="tr">
              <p className={styles.wHead}>
                <Icon name="chart" /> Weekly trends
              </p>
              <svg className={styles.mini} viewBox="0 0 200 60" preserveAspectRatio="none">
                <path d="M0 48 C 30 44, 50 20, 80 26 S 130 50, 160 30 S 190 12, 200 14" />
              </svg>
              <p className={styles.wFoot}>{HOME_DASH.weekly.join(" · ")}</p>
            </article>

            <article className={styles.widget} data-widget data-pos="bl">
              <p className={styles.wHead}>
                <Icon name="shield" /> Evidence for every check
              </p>
              <ul className={styles.checks}>
                {EVIDENCE.map((e) => (
                  <li key={e.label}>
                    <Icon name={e.icon} />
                    {e.label}
                    <span className={styles.tick}>
                      <Icon name="check" />
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            <article className={styles.widget} data-widget data-pos="br">
              <p className={styles.wHead}>
                <Icon name="users" /> A named owner, every step
              </p>
              <ol className={styles.owners}>
                {OWNERS.map((o, i) => (
                  <li key={o} data-on={i === 2 || undefined} data-done={i < 2 || undefined} style={{ ["--i" as string]: i }}>
                    {o}
                  </li>
                ))}
              </ol>
              <p className={styles.wFoot}>
                With <b>Coding &amp; claims</b>, status documented
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
