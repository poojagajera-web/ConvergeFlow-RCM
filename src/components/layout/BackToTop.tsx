"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getLenis } from "@/components/motion/SmoothScroll";
import styles from "./BackToTop.module.css";

const R = 22;
const RING = 2 * Math.PI * R;

/**
 * Floating "back to top" button, bottom right on every page. It appears once
 * the first screen has scrolled away, with a ring tracing how far down the
 * page you are, and steps aside while the footer's own "Back to top" link is
 * on screen. Smooth-scrolls to the top and moves focus to the main content.
 */
export function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  // Scroll progress (ring) and visibility, at most once per frame.
  useEffect(() => {
    const btn = ref.current;
    if (!btn) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      btn.style.setProperty("--progress", max > 0 ? Math.min(1, y / max).toFixed(4) : "0");
      setScrolled(y > window.innerHeight * 0.8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Each page renders its own footer, so watch the current one's link.
  useEffect(() => {
    const link = document.querySelector("[data-back-to-top]");
    if (!link) return;
    const io = new IntersectionObserver(([e]) => setFooterInView(e.isIntersecting));
    io.observe(link);
    return () => {
      io.disconnect();
      setFooterInView(false);
    };
  }, [pathname]);

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    // Keyboard users continue from the top of the content.
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  const visible = scrolled && !footerInView;

  return (
    <button
      ref={ref}
      type="button"
      className={styles.button}
      data-visible={visible || undefined}
      aria-label="Back to top"
      onClick={toTop}
    >
      <svg className={styles.ring} viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r={R} className={styles.track} />
        <circle cx="24" cy="24" r={R} className={styles.fill} style={{ strokeDasharray: RING }} />
      </svg>
      <svg className={styles.arrow} viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 13V3.5M4 7l4-4 4 4" />
      </svg>
    </button>
  );
}
