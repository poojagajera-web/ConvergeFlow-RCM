"use client";

import { useEffect, useRef, useState } from "react";
import { REVENUE_CYCLE } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";
import { useMotion } from "@/components/motion/useMotion";
import { getLenis } from "@/components/motion/SmoothScroll";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./RevenueCycle.module.css";

const money = (v: number, decimals = 0) =>
  `$${v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;

function BenefitArtifact() {
  const checks = ["Coverage active", "Deductible met", "Prior auth approved"];
  return (
    <div className={styles.artifact} data-artifact="0">
      <div className={styles.artifactHead}>
        <span className={styles.artifactTag}>EDI 271</span>
        <span>Eligibility response</span>
      </div>
      <div className={styles.artifactRow}>
        <span>Annual benefit remaining</span>
        <span className="num">
          <span data-count="1850" data-format="money">
            $1,850
          </span>{" "}
          / $2,000
        </span>
      </div>
      <div className={styles.meter} aria-hidden="true">
        <span data-meter style={{ width: "92.5%" }} />
      </div>
      <ul className={styles.checks}>
        {checks.map((c) => (
          <li key={c} data-check>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m3.5 8.5 3 3 6-7" data-tick />
            </svg>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClaimMixArtifact() {
  const mix = [
    { label: "Clean", value: 65 },
    { label: "Scrubbed", value: 25 },
    { label: "Queue", value: 10 },
  ];
  return (
    <div className={styles.artifact} data-artifact="1">
      <div className={styles.artifactHead}>
        <span className={styles.artifactTag}>CDT / CPT</span>
        <span>Charge capture</span>
      </div>
      <div className={styles.artifactRow}>
        <span>Clean claim velocity</span>
        <span className="num" data-count="18450" data-format="money2">
          $18,450.00
        </span>
      </div>
      <div className={styles.stack} role="img" aria-label="Claim mix: 65% clean, 25% scrubbed, 10% in queue">
        {mix.map((m) => (
          <span key={m.label} style={{ flexGrow: m.value }} data-tone={m.label.toLowerCase()} data-bar />
        ))}
      </div>
      <ul className={styles.legend}>
        {mix.map((m) => (
          <li key={m.label} data-tone={m.label.toLowerCase()}>
            {m.label}{" "}
            <span className="num" data-count={m.value} data-format="pct">
              {m.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SettlementArtifact() {
  return (
    <div className={styles.artifact} data-artifact="2">
      <div className={styles.artifactHead}>
        <span className={styles.artifactTag}>ERA 835</span>
        <span>Settlement</span>
      </div>
      <div className={styles.artifactRow}>
        <span>First-pass settlement</span>
        <span className="num">
          <span data-count="1420" data-format="money2">
            $1,420.00
          </span>{" "}
          <em className={styles.delta} data-pop>
            +14.2%
          </em>
        </span>
      </div>
      <svg className={styles.spark} viewBox="0 0 240 64" preserveAspectRatio="none" role="img" aria-label="Settlement trend rising over the month">
        <defs>
          <linearGradient id="rcm-spark" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#028579" stopOpacity="0.22" />
            <stop offset="1" stopColor="#028579" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 52 C 30 50, 40 40, 70 42 S 110 30, 140 32 S 190 14, 240 10 L 240 64 L 0 64 Z" fill="url(#rcm-spark)" data-area />
        <path d="M0 52 C 30 50, 40 40, 70 42 S 110 30, 140 32 S 190 14, 240 10" className={styles.sparkLine} data-line />
        <circle cx="240" cy="10" r="3.5" className={styles.sparkDot} data-pop />
      </svg>
    </div>
  );
}

const ARTIFACTS = [BenefitArtifact, ClaimMixArtifact, SettlementArtifact];

function formatCount(format: string | undefined, v: number) {
  if (format === "money") return money(v);
  if (format === "money2") return money(v, 2);
  if (format === "pct") return `${Math.round(v)}%`;
  return Math.round(v).toLocaleString("en-US");
}

/** Builds the paused "data comes alive" timeline for one phase artifact. */
function artifactTimeline(el: HTMLElement) {
  const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
  tl.from(el, { y: 24, opacity: 0, scale: 0.97, duration: 0.9 });

  el.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
    const target = Number(node.dataset.count);
    const state = { v: 0 };
    node.textContent = formatCount(node.dataset.format, 0);
    tl.to(state, { v: target, duration: 1.6, ease: "power3.out", onUpdate: () => (node.textContent = formatCount(node.dataset.format, state.v)) }, 0.2);
  });
  const meter = el.querySelector("[data-meter]");
  if (meter) tl.from(meter, { scaleX: 0, transformOrigin: "left center", duration: 1.6, ease: "power3.inOut" }, 0.2);
  const checks = el.querySelectorAll("[data-check]");
  if (checks.length) {
    tl.from(checks, { opacity: 0, x: -8, duration: 0.6, stagger: 0.22 }, 0.5);
    tl.from(el.querySelectorAll("[data-tick]"), { drawSVG: "0%", duration: 0.5, stagger: 0.22, ease: "power2.out" }, 0.6);
  }
  const bars = el.querySelectorAll("[data-bar]");
  if (bars.length) tl.from(bars, { scaleX: 0, transformOrigin: "left center", duration: 1.1, stagger: 0.18, ease: "power3.inOut" }, 0.25);
  const line = el.querySelector("[data-line]");
  if (line) tl.from(line, { drawSVG: "0%", duration: 1.6, ease: "power2.inOut" }, 0.2);
  const area = el.querySelector("[data-area]");
  if (area) tl.from(area, { opacity: 0, duration: 1 }, 0.9);
  const pops = el.querySelectorAll("[data-pop]");
  if (pops.length) tl.from(pops, { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 0.7, ease: "back.out(2.2)", stagger: 0.1 }, 1.4);
  return tl;
}

const C = 300;
const R = 222;
const GAP_DEG = 7;
const PHASE_SEC = 4.6;
const MILESTONES = [
  ["Scheduling", "Eligibility", "Prior auth"],
  ["Check-in", "Charge capture", "Coding"],
  ["Claim submission", "Denials", "Payment posting"],
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
        <header className="section-head is-split">
          <div className={styles.headMain}>
            <p className="eyebrow" data-anim="fade">
              <span className="eyebrow-index">01</span>
              {REVENUE_CYCLE.eyebrow}
            </p>
            <h2 id="rcm-title" className="title-xl" data-anim="lines">
              {REVENUE_CYCLE.title}
            </h2>
          </div>
          <div className="section-head-aside" data-anim="fade">
            <p className="lede">{REVENUE_CYCLE.body}</p>
            <div className={styles.cta}>
              <ButtonLink href="/#demo" variant="secondary">
                {REVENUE_CYCLE.cta}
              </ButtonLink>
            </div>
          </div>
        </header>
      </div>

      <div className={styles.scroller} data-scroller>
        <div className={styles.sticky}>
        <div className={`container ${styles.layout}`}>
          <ol className={styles.phases} data-anim="stagger">
            {REVENUE_CYCLE.phases.map((phase, i) => (
              <li key={phase.title} className={styles.phase} data-on={i === active || undefined}>
                <button type="button" className={styles.phaseBtn} onClick={() => jump(i)} aria-pressed={i === active}>
                  <span className={`${styles.phaseIndex} num`}>0{i + 1}</span>
                  <span className={styles.phaseText}>
                    <span className={styles.when}>{phase.when}</span>
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
