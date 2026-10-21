"use client";

import { useRef } from "react";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import styles from "./ScrollText.module.css";

/**
 * A giant line of text that slides sideways as the page scrolls (scrubbed),
 * fading from glowing mint to white along its length.
 */
export function ScrollText({ text, direction = 1, className = "" }: { text: string; direction?: 1 | -1; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    const line = root.querySelector("[data-line]");
    gsap.fromTo(
      line,
      { xPercent: direction > 0 ? 8 : -58 },
      { xPercent: direction > 0 ? -58 : 8, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.5 } },
    );
  });

  return (
    <div ref={ref} className={`${styles.wrap} ${className}`} aria-hidden="true">
      <p className={styles.line} data-line>
        {text}
      </p>
    </div>
  );
}
