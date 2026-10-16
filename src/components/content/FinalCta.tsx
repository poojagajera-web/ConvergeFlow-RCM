import { ButtonLink } from "@/components/ui/Button";
import { liveHref } from "@/content/navigation";
import type { Page } from "@/content/pages";
import { Rich } from "./Rich";
import styles from "./FinalCta.module.css";

/** Closing call to action with the page's approved copy and actions. */
export function FinalCta({ cta, variant = "panel", dark = false }: { cta: NonNullable<Page["finalCta"]>; variant?: "panel" | "fullbleed" | "split"; dark?: boolean }) {
  const buttons = cta.buttons.filter((b) => liveHref(b.href));
  return (
    <section
      className={`section ${styles.section}`}
      data-variant={variant}
      data-dark={dark || undefined}
      data-cta-overlap={variant === "fullbleed" || undefined}
      aria-labelledby="final-cta-title"
    >
      <div className="container">
        <div className={`${styles.panel} on-dark`} data-anim="clip">
          <span className={styles.rings} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <svg className={styles.lines} viewBox="0 0 600 300" preserveAspectRatio="none" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <path key={i} d={`M0 ${18 + i * 33} C 260 ${18 + i * 33}, 300 150, 600 150`} style={{ animationDelay: `${i * -0.6}s` }} />
            ))}
          </svg>
          <div className={styles.copy}>
            <h2 id="final-cta-title" className={styles.title} data-anim="lines">
              {cta.title}
            </h2>
          </div>
          <div className={styles.side}>
            {cta.blocks.map((b, i) =>
              b.type === "p" ? (
                <p key={i} className={styles.text}>
                  <Rich text={b.text} />
                </p>
              ) : null,
            )}
            {buttons.length > 0 && (
              <div className={styles.buttons}>
                {buttons.map((b, i) => (
                  <ButtonLink key={b.href} href={b.href} variant={i === 0 ? "primary" : "secondary"}>
                    {b.label}
                  </ButtonLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
