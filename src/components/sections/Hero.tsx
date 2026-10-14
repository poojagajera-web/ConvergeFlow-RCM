"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { HERO, PAYERS, type StreamRow } from "@/content/home";
import { PRIMARY_NAV, resolveHref } from "@/content/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { VideoDialog } from "@/components/product/VideoDialog";
import { DISPATCH_MS, VerificationConsole } from "@/components/product/VerificationConsole";
import { useMotion } from "@/components/motion/useMotion";
import { gsap, SplitText } from "@/lib/gsap";
import { HeroGridCells } from "./HeroGridCells";
import styles from "./Hero.module.css";

const LANES = PAYERS.length;
const ROW = 300 / LANES;
const route = (i: number) => {
  const y = ROW / 2 + i * ROW;
  return `M0 ${y} C 210 ${y}, 190 150, 400 150`;
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [lanes, setLanes] = useState<string[]>(PAYERS);
  const [activeLane, setActiveLane] = useState<{ index: number; status: StreamRow["status"] } | null>(null);
  const lanesRef = useRef(lanes);
  const roundRobin = useRef(LANES - 1);
  const flowReady = useRef(false);

  // A request leaves its payer lane, crosses the QDL engine and lands in the console.
  const onDispatch = useCallback((row: StreamRow) => {
    const root = ref.current;
    if (!root) return;
    let index = lanesRef.current.indexOf(row.payer);
    if (index < 0) {
      roundRobin.current = (roundRobin.current + 1) % LANES;
      index = roundRobin.current;
      const next = [...lanesRef.current];
      next[index] = row.payer;
      lanesRef.current = next;
      setLanes(next);
    }
    setActiveLane({ index, status: row.status });
    window.setTimeout(() => setActiveLane((a) => (a?.index === index ? null : a)), DISPATCH_MS + 300);

    if (!flowReady.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const comet = root.querySelector<SVGPathElement>(`[data-comet="${index}"]`);
    const ripple = root.querySelector("[data-ripple]");
    const beam = root.querySelector("[data-beam]");
    const travel = (DISPATCH_MS / 1000) * 0.55;
    const tl = gsap.timeline();
    if (comet) {
      comet.dataset.status = row.status;
      tl.fromTo(comet, { strokeDashoffset: 18, opacity: 1 }, { strokeDashoffset: -100, duration: travel, ease: "power2.in" });
    }
    if (ripple) tl.fromTo(ripple, { scale: 1, opacity: 0.8 }, { scale: 2.4, opacity: 0, duration: 0.9, ease: "expo.out" }, travel - 0.05);
    if (beam)
      tl.fromTo(beam, { xPercent: 0, left: "0%", opacity: 1 }, { left: "100%", xPercent: -100, duration: 0.45, ease: "power2.in" }, travel)
        .to(beam, { opacity: 0, duration: 0.15 });
  }, []);

  useMotion(ref, ({ motion, desktop }) => {
    const root = ref.current!;
    const intro = root.querySelectorAll<HTMLElement>("[data-intro]");
    if (!motion) {
      gsap.set(intro, { autoAlpha: 1 });
      root.dataset.flowing = "true";
      return;
    }

    const paths = root.querySelectorAll<SVGPathElement>("[data-route]");
    gsap.set(paths, { drawSVG: "0%" });
    // Hand visibility from the pre-paint CSS to GSAP before any .from() reads
    // its end values; each .from() then renders its start state immediately.
    gsap.set(intro, { autoAlpha: 1 });

    const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
    const title = root.querySelector<HTMLElement>("h1")!;

    tl.from(root.querySelector("[data-eyebrow]"), { autoAlpha: 0, y: 12, duration: 0.9 });

    let titleAdded = false;
    SplitText.create(title, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        self.masks.forEach((m) => m.classList.add("split-line-mask"));
        const t = gsap.from(self.lines, { yPercent: 110, duration: 1.4, stagger: 0.12, ease: "expo.out", paused: titleAdded });
        // Re-splits after resize/font load reuse the returned tween's progress.
        if (!titleAdded) tl.add(t, 0.2);
        titleAdded = true;
        return t;
      },
    });

    tl.from(root.querySelectorAll("[data-intro-rise]"), { autoAlpha: 0, y: 24, duration: 1.1, stagger: 0.08 }, 0.65)
      .from(
        root.querySelector("[data-tilt]"),
        { autoAlpha: 0, y: 90, rotationX: 24, transformPerspective: 1600, transformOrigin: "50% 0%", duration: 1.8 },
        0.8,
      )
      .from(root.querySelectorAll("[data-payer]"), { autoAlpha: 0, x: -16, duration: 0.9, stagger: 0.06 }, 1.0)
      .to(paths, { drawSVG: "100%", duration: 1.4, stagger: 0.05, ease: "power2.inOut" }, 1.1)
      .from(root.querySelector("[data-node]"), { scale: 0.6, autoAlpha: 0, duration: 1, ease: "back.out(1.6)" }, 1.6)
      .add(() => {
        root.dataset.flowing = "true";
        flowReady.current = true;
      });

    if (desktop) {
      gsap.to(root.querySelector("[data-hero-copy]"), {
        yPercent: -14,
        autoAlpha: 0.35,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "45% top", scrub: true },
      });

      // Pointer-driven depth on the product console.
      const card = root.querySelector<HTMLElement>("[data-tilt-inner]")!;
      gsap.set(card, { transformPerspective: 1800 });
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.9, ease: "power3.out" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.9, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 5);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 4);
      };
      const onLeave = () => {
        rx(0);
        ry(0);
      };
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      return () => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
      };
    }
  });

  return (
    <section ref={ref} className={`${styles.hero} on-dark`} aria-labelledby="hero-title">
      <HeroGridCells />
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy} data-hero-copy>
          <p className="eyebrow" data-intro data-eyebrow>
            {HERO.eyebrow}
          </p>
          <h1 id="hero-title" className={styles.title} data-intro>
            {HERO.titleLead} <span className={styles.titleAccent}>{HERO.titleAccent}</span>
          </h1>
          <div className={styles.under}>
            <p className={styles.lede} data-intro data-intro-rise>
              {HERO.body}
            </p>
            <div className={styles.ctas} data-intro data-intro-rise>
              <ButtonLink href={resolveHref(PRIMARY_NAV.demo) ?? "/demo"}>{HERO.primaryCta}</ButtonLink>
              <VideoDialog label={HERO.secondaryCta} title={HERO.video.title} src={HERO.video.src} />
            </div>
          </div>
        </div>

        <div className={styles.flow}>
          <div className={styles.sources} data-intro>
            <p className={styles.sourcesLabel}>Payer portals & clearinghouses</p>
            <ul className={styles.payers}>
              {lanes.map((payer, i) => (
                <li
                  key={i}
                  data-payer
                  data-active={activeLane?.index === i || undefined}
                  data-status={activeLane?.index === i ? activeLane.status : undefined}
                >
                  <span className={styles.payerDot} aria-hidden="true" />
                  <span key={payer} className={styles.payerName}>
                    {payer}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <svg className={styles.routes} viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true" data-intro>
            {lanes.map((_, i) => (
              <g key={i} data-lane-active={activeLane?.index === i || undefined}>
                <path d={route(i)} className={styles.route} data-route />
                <path d={route(i)} pathLength={100} className={styles.pulse} style={{ animationDelay: `${i * -0.55}s` }} />
                <path d={route(i)} pathLength={100} className={styles.comet} data-comet={i} />
              </g>
            ))}
          </svg>

          <div className={styles.node} data-intro data-node>
            <span className={styles.nodeMark}>
              <span className={styles.ripple} data-ripple aria-hidden="true" />
              <span className={styles.orbit} aria-hidden="true" />
              <span className={styles.nodeLogo}>
                <Image src="/assets/logos/convergeflow-dark.png" alt="" width={1024} height={177} priority />
              </span>
            </span>
            <span className={styles.nodeLabel}>QDL engine</span>
            <span className={styles.beamTrack} aria-hidden="true">
              <span className={styles.beam} data-beam />
            </span>
          </div>

          <div className={styles.consoleSlot} data-intro data-console>
            <div data-tilt>
              <div data-tilt-inner className={styles.tiltInner}>
                <VerificationConsole onDispatch={onDispatch} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
