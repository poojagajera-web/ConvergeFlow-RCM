"use client";

import { useEffect, useLayoutEffect, type DependencyList, type RefObject } from "react";
import { gsap, MOTION_QUERIES, type MotionConditions } from "@/lib/gsap";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Scoped GSAP setup. Everything created inside `setup` is recorded by a
 * matchMedia context and reverted on unmount, dependency change, or when a
 * media condition flips (e.g. the user toggles reduced motion).
 */
export function useMotion(
  scope: RefObject<HTMLElement | null>,
  setup: (conditions: MotionConditions) => void | (() => void),
  deps: DependencyList = [],
) {
  useIsomorphicLayoutEffect(() => {
    if (!scope.current) return;
    const mm = gsap.matchMedia(scope.current);
    mm.add(MOTION_QUERIES, (ctx) => setup(ctx.conditions as MotionConditions));
    return () => mm.revert();
  }, deps);
}
