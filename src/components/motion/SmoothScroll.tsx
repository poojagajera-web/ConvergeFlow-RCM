"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let lenisInstance: Lenis | null = null;

/** The active Lenis instance, or null when smooth scroll is disabled. */
export function getLenis() {
  return lenisInstance;
}

function headerOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
  return -(parseFloat(raw) || 76) - 8;
}

/** Scrolls to an element id with Lenis when available, natively otherwise. */
export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return false;
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: headerOffset(), duration: 1.4 });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = target.getBoundingClientRect().top + window.scrollY + headerOffset();
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }
  history.replaceState(null, "", `#${id}`);
  // Move focus for keyboard and screen-reader users without a second jump.
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  return true;
}

/**
 * Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger and Lenis
 * share a single animation frame loop. Disabled for reduced-motion users;
 * touch devices keep native scrolling (Lenis' syncTouch stays off).
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let tick: ((time: number) => void) | null = null;

    const start = () => {
      if (lenisInstance || reduceQuery.matches) return;
      const lenis = new Lenis({
        autoRaf: false,
        // Slightly heavier glide for a premium, weighted feel.
        lerp: 0.08,
        wheelMultiplier: 0.95,
        smoothWheel: true,
        anchors: { offset: headerOffset() },
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenisInstance = lenis;
    };

    const stop = () => {
      if (tick) gsap.ticker.remove(tick);
      tick = null;
      lenisInstance?.destroy();
      lenisInstance = null;
      gsap.ticker.lagSmoothing(500, 33);
    };

    const onPreferenceChange = () => (reduceQuery.matches ? stop() : start());

    start();
    reduceQuery.addEventListener("change", onPreferenceChange);

    // Measurements depend on webfonts and media; refresh once they settle.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });

    // Tell the pre-paint failsafe that the motion layer booted.
    (window as Window & { __cfMotion?: boolean }).__cfMotion = true;

    return () => {
      reduceQuery.removeEventListener("change", onPreferenceChange);
      window.removeEventListener("load", refresh);
      stop();
    };
  }, []);

  return null;
}
