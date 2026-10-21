"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText, MOTION_QUERIES } from "@/lib/gsap";

/**
 * Declarative scroll reveals. Server-rendered markup opts in with
 * `data-anim`; content is fully visible until this runs, so nothing is lost
 * if JavaScript fails.
 *
 *  data-anim="fade"     blur + rise + fade
 *  data-anim="stagger"  blur + rise + fade each direct child in sequence
 *  data-anim="words"    word-by-word blur reveal for headings (SplitText)
 *  data-anim="chars"    character blur-in with a glow flash (display lines)
 *  data-anim="lines"    masked line-by-line reveal (SplitText)
 *  data-anim="scrub"    words light up from dim as the element scrolls by
 *  data-anim="clip"     wipe in from the edges
 *  data-anim="draw"     draw SVG strokes ([data-draw] paths inside)
 *  data-anim="count"    count up to the rendered number
 *  data-anim="scale"    grow in from 0.9 with a blur
 *  data-parallax="0.12" scrubbed vertical drift (desktop only)
 *  data-glow            pointer-follow light: sets --mx / --my on the element
 *
 * Wrap each page body in <MotionScope>: its effect runs only after the whole
 * subtree has hydrated, so GSAP never touches markup React has not adopted.
 */
export function MotionScope({ children }: { children: ReactNode }) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    // Pointer-follow light for glow cards (works with or without motion).
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>("[data-glow]");
      if (!el || !scope.contains(el)) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    scope.addEventListener("pointermove", onMove, { passive: true });

    const mm = gsap.matchMedia(scope);

    mm.add(MOTION_QUERIES, (ctx) => {
      const { motion, desktop } = ctx.conditions as Record<string, boolean>;
      if (!motion) return;

      const q = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, scope);
      const start = "top 88%";

      q("[data-anim='fade']").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          filter: "blur(10px)",
          duration: 1.3,
          delay: Number(el.dataset.delay ?? 0),
          clearProps: "opacity,transform,filter",
          scrollTrigger: { trigger: el, start, once: true },
        });
      });

      q("[data-anim='stagger']").forEach((el) => {
        gsap.from(el.children, {
          opacity: 0,
          y: 40,
          filter: "blur(10px)",
          duration: 1.2,
          stagger: 0.09,
          clearProps: "opacity,transform,filter",
          scrollTrigger: { trigger: el, start, once: true },
        });
      });

      q("[data-anim='scale']").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          scale: 0.9,
          y: 40,
          filter: "blur(14px)",
          duration: 1.6,
          clearProps: "opacity,transform,filter",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      // Status badges pop in with a glow once their document is in view.
      q("[data-anim='stamp']").forEach((el) => {
        gsap.from(el, {
          scale: 0.4,
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.7,
          ease: "back.out(2)",
          delay: Number(el.dataset.delay ?? 0.35),
          clearProps: "transform,opacity,filter",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
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

      // Word-by-word blur reveal for headings (keeps nested accents intact).
      q("[data-anim='words']").forEach((el) => {
        SplitText.create(el, {
          type: "words",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.words, {
              opacity: 0,
              y: 18,
              filter: "blur(12px)",
              duration: 1.1,
              stagger: 0.06,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start, once: true },
            });
          },
        });
      });

      // Character blur-in with a brief glow flash (big display lines).
      q("[data-anim='chars']").forEach((el) => {
        SplitText.create(el, {
          type: "chars,words",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.chars, {
              opacity: 0,
              filter: "blur(16px)",
              textShadow: "0 0 30px rgba(143,240,226,0.9)",
              duration: 1,
              stagger: { each: 0.025, from: "random" },
              ease: "power2.out",
              scrollTrigger: { trigger: el, start, once: true },
            });
          },
        });
      });

      // Editorial statements: each word lights up from dim as the line scrolls through the viewport.
      q("[data-anim='scrub']").forEach((el) => {
        SplitText.create(el, {
          type: "words",
          autoSplit: true,
          onSplit(self) {
            return gsap.fromTo(
              self.words,
              { opacity: 0.16 },
              { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 62%", scrub: true } },
            );
          },
        });
      });

      q("[data-anim='clip']").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(14% 8% 14% 8% round 32px)", opacity: 0.3 },
          {
            clipPath: "inset(0% 0% 0% 0% round 32px)",
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
        const pad = Number(el.dataset.pad ?? 0);
        const fmt = (v: number) => String(Math.round(v)).padStart(pad, "0");
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

    return () => {
      scope.removeEventListener("pointermove", onMove);
      mm.revert();
    };
  }, []);

  return (
    <div ref={scopeRef} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
