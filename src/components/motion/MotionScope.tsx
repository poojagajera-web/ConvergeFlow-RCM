"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText, MOTION_QUERIES } from "@/lib/gsap";

/**
 * Declarative scroll reveals. Server-rendered markup opts in with
 * `data-anim`; content is fully visible until this runs, so nothing is lost
 * if JavaScript fails.
 *
 *  data-anim="fade"     rise + fade
 *  data-anim="stagger"  rise + fade each direct child in sequence
 *  data-anim="lines"    masked line-by-line heading reveal (SplitText)
 *  data-anim="clip"     wipe in from the bottom edge
 *  data-anim="draw"     draw SVG strokes ([data-draw] paths inside)
 *  data-anim="count"    count up to the rendered number
 *  data-parallax="0.12" scrubbed vertical drift (desktop only)
 *
 * Wrap each page body in <MotionScope>: its effect runs only after the whole
 * subtree has hydrated, so GSAP never touches markup React has not adopted.
 */
export function MotionScope({ children }: { children: ReactNode }) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    const mm = gsap.matchMedia(scope);

    mm.add(MOTION_QUERIES, (ctx) => {
      const { motion, desktop } = ctx.conditions as Record<string, boolean>;
      if (!motion) return;

      const q = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, scope);
      const start = "top 86%";

      q("[data-anim='fade']").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 32,
          duration: 1.2,
          delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: { trigger: el, start, once: true },
        });
      });

      q("[data-anim='stagger']").forEach((el) => {
        gsap.from(el.children, {
          opacity: 0,
          y: 28,
          duration: 1.1,
          stagger: 0.08,
          scrollTrigger: { trigger: el, start, once: true },
        });
      });

      q("[data-anim='lines']").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            self.masks.forEach((m) => m.classList.add("split-line-mask"));
            return gsap.from(self.lines, {
              yPercent: 108,
              duration: 1.25,
              stagger: 0.09,
              scrollTrigger: { trigger: el, start, once: true },
            });
          },
        });
      });

      q("[data-anim='clip']").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(18% 6% 18% 6% round 18px)", opacity: 0.4 },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            opacity: 1,
            duration: 1.5,
            ease: "expo.inOut",
            clearProps: "clipPath",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });

      q("[data-anim='draw']").forEach((el) => {
        const paths = el.querySelectorAll<SVGGeometryElement>("[data-draw]");
        paths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.inOut",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        });
      });

      q("[data-anim='count']").forEach((el) => {
        const target = Number(el.dataset.to ?? el.textContent);
        const decimals = Number(el.dataset.decimals ?? 0);
        const fmt = (v: number) =>
          v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        const state = { v: 0 };
        el.textContent = fmt(0);
        gsap.to(state, {
          v: target,
          duration: 2,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = fmt(state.v);
          },
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });

      if (desktop) {
        q("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax ?? 0.1);
          gsap.fromTo(
            el,
            { yPercent: amount * 100 },
            {
              yPercent: -amount * 100,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      }

      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={scopeRef} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
