"use client";

import { useRef, type ReactNode } from "react";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import { Starfield } from "./Starfield";
import styles from "./Planet.module.css";

/**
 * A statement over an eclipse: a dark disc with a slowly turning corona and a
 * "diamond ring" flare. The eclipse grows as the section scrolls by while the
 * statement's words light up. Optional children render beneath (e.g. a flow).
 */
export function Planet({ text, accent, sub, id, children }: { text: string; accent?: string; sub?: string; id?: string; children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    gsap.fromTo(
      root.querySelector("[data-eclipse]"),
      { scale: 0.78, opacity: 0.4 },
      { scale: 1.06, opacity: 1, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "center center", scrub: 0.6 } },
    );
  });

  return (
    <section ref={ref} id={id} className={styles.section}>
      <div className={styles.sky} aria-hidden="true">
        <Starfield density={0.9} />
      </div>
      <div className={styles.stage}>
        <div className={styles.eclipse} data-eclipse aria-hidden="true">
          <span className={styles.corona} />
          <span className={styles.corona} data-c="2" />
          <span className={styles.disc} />
          <span className={styles.flare} />
        </div>
        <div className={`container ${styles.copy}`}>
          <p className={styles.text} data-anim="scrub">
            {text}
            {accent && (
              <>
                {" "}
                <span className={styles.accent}>{accent}</span>
              </>
            )}
          </p>
          {sub && (
            <p className={styles.sub} data-anim="fade">
              {sub}
            </p>
          )}
        </div>
      </div>
      {children && <div className={`container ${styles.below}`}>{children}</div>}
    </section>
  );
}
