import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, TextPlugin, DrawSVGPlugin);
  gsap.defaults({ ease: "expo.out", duration: 1.1 });
}

/** Breakpoint conditions shared by every animated component. */
export const MOTION_QUERIES = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 992px)",
  mobile: "(max-width: 991.98px)",
} as const;

export type MotionConditions = Record<keyof typeof MOTION_QUERIES, boolean>;

export { gsap, ScrollTrigger, SplitText };
