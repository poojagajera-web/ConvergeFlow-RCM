"use client";

import { useEffect, useRef, useState } from "react";
import { RCM } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";
import { useMotion } from "@/components/motion/useMotion";
import { getLenis } from "@/components/motion/SmoothScroll";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./RevenueCycle.module.css";

type Tone = "ok" | "review" | "open";
type Item = { label: string; status: string; tone: Tone };

/** Illustrative checklists per phase — synthetic statuses, no figures. */
const CHECKLISTS: { title: string; items: Item[] }[] = [
  {
    title: "Appointment preparation",
    items: [
      { label: "Patient information", status: "Ready", tone: "ok" },
      { label: "Insurance information", status: "Ready", tone: "ok" },
      { label: "Eligibility question", status: "Needs review", tone: "review" },
      { label: "Authorization question", status: "Open", tone: "open" },
    ],
  },
  {
    title: "Visit and charge review",
    items: [
      { label: "Documented service", status: "Recorded", tone: "ok" },
      { label: "Charge information", status: "Needs review", tone: "review" },
      { label: "Billing requirements", status: "Open", tone: "open" },
    ],
  },
  {
    title: "Billing follow-up",
    items: [
      { label: "Claim status", status: "Follow up", tone: "open" },
      { label: "Unresolved denial", status: "Needs review", tone: "review" },
      { label: "Payment", status: "Recorded", tone: "ok" },
      { label: "Outstanding balance", status: "Open", tone: "open" },
    ],
  },
];

function Checklist({ index }: { index: number }) {
  const list = CHECKLISTS[index];
  return (
    <div className={styles.artifact} data-artifact={index}>
      <div className={styles.artifactHead}>
        <span className={styles.artifactTag}>Illustrative</span>
        <span>{list.title}</span>
      </div>
      <ul className={styles.checks}>
        {list.items.map((item) => (
          <li key={item.label} data-check>
            <span>{item.label}</span>
            <span className={styles.status} data-tone={item.tone}>
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const ARTIFACTS = [0, 1, 2].map((i) => {
  const C = () => <Checklist index={i} />;
  C.displayName = `Checklist${i}`;
  return C;
});

/** Builds the paused entrance timeline for one phase checklist. */
function artifactTimeline(el: HTMLElement) {
  const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
  tl.from(el, { y: 24, opacity: 0, scale: 0.97, duration: 0.9 });
  const checks = el.querySelectorAll("[data-check]");
  if (checks.length) tl.from(checks, { opacity: 0, x: -10, duration: 0.6, stagger: 0.14 }, 0.3);
  return tl;
}

const C = 300;
const R = 222;
const GAP_DEG = 7;
const PHASE_SEC = 4.6;
const MILESTONES = [
  ["Patient information", "Eligibility", "Authorization"],
  ["Documented service", "Charges", "Billing requirements"],
  ["Claim status", "Denials", "Payments and balances"],
];

const polar = (deg: number, r = R) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
};
/** Clockwise arc for phase i (0–2), each 120° minus a small gap. */
const arcPath = (i: number) => {
  const s = polar(i * 120 + GAP_DEG / 2);
  const e = polar((i + 1) * 120 - GAP_DEG / 2);
  return `M ${s.x} ${s.y} A ${R} ${R} 0 0 1 ${e.x} ${e.y}`;
};
const milestoneDeg = (phase: number, k: number) => phase * 120 + GAP_DEG / 2 + ((120 - GAP_DEG) * (k + 0.5)) / 3;

export function RevenueCycle() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const clock = useRef<{ t: number } | null>(null);
  const activeRef = useRef(0);
  const started = useRef(false);
  const desktopRef = useRef(false);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // The centre card performs whenever the cycle enters a new phase.
  useEffect(() => {
    const card = ref.current?.querySelector<HTMLElement>(`[data-center] [data-artifact]`);
    if (!card || !started.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      started.current = true;
      return;
    }
    const tl = artifactTimeline(card);
    tl.play();
    return () => {
      tl.progress(1).kill();
    };
  }, [active]);

  useMotion(ref, ({ motion, desktop }) => {
    const root = ref.current!;
    const svg = root.querySelector<SVGSVGElement>("[data-ring]")!;
    const bars = gsap.utils.toArray<HTMLElement>("[data-phase-progress]", root);
    desktopRef.current = desktop;
    const fills = gsap.utils.toArray<SVGPathElement>("[data-fill]", svg);
    const comet = svg.querySelector<SVGGElement>("[data-comet]")!;
    const dots = gsap.utils.toArray<SVGGElement>("[data-milestone]", svg);

    const paint = (t: number) => {
      const phase = Math.min(2, Math.floor(t));
      fills.forEach((f, i) => {
        const v = i < phase ? 100 : i === phase ? (t - phase) * 100 : 0;
        f.setAttribute("stroke-dasharray", `${v} 100`);
        // A zero-length dash still paints a round cap; hide unstarted arcs.
        f.style.opacity = v > 0.5 ? "1" : "0";
      });
      const deg = phase * 120 + GAP_DEG / 2 + (120 - GAP_DEG) * (t - phase);
      const p = polar(deg);
      comet.setAttribute("transform", `translate(${p.x} ${p.y})`);
      dots.forEach((d) => {
        const passed = Number(d.dataset.deg) <= deg;
        d.toggleAttribute("data-passed", passed);
      });
      bars.forEach((b, i) => {
        b.style.transform = `scaleX(${i < phase ? 1 : i === phase ? t - phase : 0})`;
      });
      if (phase !== activeRef.current) {
        activeRef.current = phase;
        setActive(phase);
      }
    };

    const state = { t: 0 };
    clock.current = state;
    if (!motion) {
      state.t = 0.5;
      paint(0.5);
      return;
    }

    const intro = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 78%", once: true }, defaults: { ease: "expo.out" } });
    intro
      .from(svg.querySelectorAll("[data-track]"), { drawSVG: "0%", duration: 1.4, stagger: 0.15, ease: "power3.inOut" })
      .from(dots, { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 0.6, stagger: 0.05, ease: "back.out(2)" }, 0.5)
      .from(svg.querySelectorAll("[data-mlabel]"), { opacity: 0, duration: 0.6, stagger: 0.04 }, 0.7);

    let seen = false;
    const performFirst = () => {
      if (seen) return;
      seen = true;
      const card = root.querySelector<HTMLElement>("[data-center] [data-artifact]");
      if (card) artifactTimeline(card).play();
    };

    if (desktop) {
      // Scroll drives the cycle: the stage holds while Before → During → After play out.
      paint(0);
      gsap.to(state, {
        t: 2.999,
        ease: "none",
        onUpdate: () => paint(state.t),
        scrollTrigger: { trigger: root.querySelector("[data-scroller]"), start: "top top", end: "bottom bottom", scrub: 0.6, onEnter: performFirst },
      });
      return () => {
        clock.current = null;
      };
    }

    const loop = gsap.to(state, { t: 3, duration: PHASE_SEC * 3, ease: "none", repeat: -1, paused: true, onUpdate: () => paint(state.t % 3) });
    paint(0);
    ScrollTrigger.create({
      trigger: svg,
      start: "top 75%",
      end: "bottom 15%",
      onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      // First arrival: the opening phase card performs on screen, not at page load.
      onEnter: performFirst,
    });
    return () => {
      clock.current = null;
    };
  });

  // Desktop: scroll to the phase's point in the pinned story. Mobile: jump the loop.
  const jump = (i: number) => {
    const scroller = ref.current?.querySelector<HTMLElement>("[data-scroller]");
    if (desktopRef.current && scroller) {
      const range = scroller.offsetHeight - window.innerHeight;
      const y = scroller.getBoundingClientRect().top + window.scrollY + range * ((i + 0.55) / 3);
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { duration: 1.2 });
      else window.scrollTo({ top: y, behavior: "smooth" });
      return;
    }
    const state = clock.current;
    if (state) state.t = i + 0.001;
    const loop = gsap.getTweensOf(state ?? {})[0];
    if (loop) loop.progress(i / 3);
    setActive(i);
  };

  const Artifact = ARTIFACTS[active];

  return (
    <section ref={ref} id="revenue-cycle" className={`section ${styles.section}`} aria-labelledby="rcm-title">
      <div className="container">
        <header className="section-head is-split is-top">
          <div className={styles.headMain}>
            <p className="eyebrow" data-anim="fade">
              {RCM.eyebrow}
            </p>
            <h2 id="rcm-title" className="title-xl" data-anim="lines">
              {RCM.heading}
            </h2>
          </div>
          <div className="section-head-aside" data-anim="fade">
            <p className="lede">{RCM.intro}</p>
            {RCM.body && <p className={styles.more}>{RCM.body}</p>}
            {RCM.primary && (
              <div className={styles.cta}>
                <ButtonLink href={RCM.primary.url} variant="secondary">
                  {RCM.primary.label}
                </ButtonLink>
              </div>
            )}
          </div>
        </header>
      </div>

      <div className={styles.scroller} data-scroller>
        <div className={styles.sticky}>
        <div className={`container ${styles.layout}`}>
          <ol className={styles.phases} data-anim="stagger">
            {(RCM.cards ?? []).map((phase, i) => (
              <li key={phase.title} className={styles.phase} data-on={i === active || undefined}>
                <button type="button" className={styles.phaseBtn} onClick={() => jump(i)} aria-pressed={i === active}>
                  <span className={`${styles.phaseIndex} num`}>0{i + 1}</span>
                  <span className={styles.phaseText}>
                    <span className={styles.when}>Phase {String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.phaseTitle}>{phase.title}</span>
                    <span className={styles.phaseBody}>{phase.body}</span>
                    <span className={styles.phaseTrack} aria-hidden="true">
                      <span data-phase-progress />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className={styles.cycle}>
            <svg className={styles.ring} viewBox="-110 -6 820 612" data-ring aria-hidden="true">
              <defs>
                <linearGradient id="rcm-arc" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#11b9a8" />
                  <stop offset="1" stopColor="#028579" />
                </linearGradient>
              </defs>
              <circle cx={C} cy={C} r={R - 46} className={styles.inner} />
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <path d={arcPath(i)} className={styles.track} data-track />
                  <path d={arcPath(i)} pathLength={100} className={styles.fill} data-fill strokeDasharray="0 100" style={{ opacity: 0 }} />
                </g>
              ))}
              {MILESTONES.map((names, phase) =>
                names.map((name, k) => {
                  const deg = milestoneDeg(phase, k);
                  const p = polar(deg);
                  const l = polar(deg, R + 30);
                  const anchor = l.x > C + 20 ? "start" : l.x < C - 20 ? "end" : "middle";
                  return (
                    <g key={name}>
                      <g data-milestone data-deg={deg} className={styles.milestone} transform={`translate(${p.x} ${p.y})`}>
                        <circle r="7" />
                      </g>
                      <text x={l.x} y={l.y + 5} textAnchor={anchor} className={styles.mlabel} data-mlabel data-phase-on={phase === active || undefined}>
                        {name}
                      </text>
                    </g>
                  );
                }),
              )}
              <g className={styles.ringCenter}>
                <text x={C} y={C + 8} textAnchor="middle" className={styles.ringNum}>
                  0{active + 1}
                </text>
                <text x={C} y={C + 52} textAnchor="middle" className={styles.ringWord}>
                  {["BEFORE", "DURING", "AFTER"][active]} THE VISIT
                </text>
              </g>
              <g data-comet className={styles.comet} transform={`translate(${polar(0).x} ${polar(0).y})`}>
                <circle r="20" className={styles.cometHalo} />
                <circle r="10" className={styles.cometCore} />
              </g>
            </svg>

            <div className={styles.center} data-center>
              <div key={active} className={styles.centerCard}>
                <Artifact />
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
