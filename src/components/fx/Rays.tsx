import styles from "./Rays.module.css";

/**
 * Soft "god rays" fanning down from a glowing source above the section.
 * Three blurred conic layers drift against each other so the light shimmers.
 * Purely decorative; fills its positioned parent.
 */
export function Rays({ className = "", intensity = 1, origin = "50%", opacity = 0.5 }: { className?: string; intensity?: number; origin?: string; opacity?: number }) {
  return (
    <div className={`${styles.rays} ${className}`} style={{ ["--k" as string]: intensity, ["--ox" as string]: origin, opacity }} aria-hidden="true" data-rays>
      <span className={styles.haze} />
      <span className={styles.layer} data-l="1" />
      <span className={styles.layer} data-l="2" />
      <span className={styles.layer} data-l="3" />
      <span className={styles.source} />
      <span className={styles.dust} />
    </div>
  );
}
