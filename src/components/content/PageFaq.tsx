import type { Page } from "@/content/pages";
import { ButtonLink } from "@/components/ui/Button";
import { Rich } from "./Rich";
import styles from "./PageFaq.module.css";

/**
 * Visible FAQ — every answer is in the initial HTML so it matches the schema.
 * "accordion" uses native <details>; "grid" shows all answers as cards.
 */
export function PageFaq({ faq, variant = "accordion", dark = false }: { faq: NonNullable<Page["faq"]>; variant?: "accordion" | "grid" | "lines"; dark?: boolean }) {
  return (
    <section
      id="faq"
      className={`section ${styles.section} ${dark ? "on-dark" : ""}`}
      data-variant={variant}
      data-dark={dark || undefined}
      aria-labelledby="faq-title"
    >
      <div className={`container ${styles.layout}`}>
        <header className={styles.head}>
          <p className="eyebrow" data-anim="fade">
            FAQ
          </p>
          <h2 id="faq-title" className={styles.title} data-anim="lines">
            {faq.title}
          </h2>
          {faq.intro.map((p, i) => (
            <p key={i} className="lede" data-anim="fade">
              <Rich text={p} />
            </p>
          ))}
          {variant === "lines" && (
            <div className={styles.headMeta} data-anim="fade">
              <span className={styles.headCount}>
                <span className="num">{String(faq.items.length).padStart(2, "0")}</span> questions
              </span>
              <ButtonLink href="/demo/">Schedule a Demo</ButtonLink>
            </div>
          )}
        </header>
        {variant === "lines" ? (
          <div className={styles.lines} data-anim="stagger">
            {faq.items.map((item, i) => (
              <details key={item.q} className={styles.line} open={i === 0}>
                <summary className={styles.lineSummary}>
                  <span className={`${styles.lineIndex} num`} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={styles.lineQ}>{item.q}</h3>
                  <span className={styles.lineIcon} aria-hidden="true" />
                </summary>
                <div className={styles.lineAnswer}>
                  {item.a.map((p, j) => (
                    <p key={j}>
                      <Rich text={p} />
                    </p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        ) : variant === "grid" ? (
          <dl className={styles.grid} data-anim="stagger">
            {faq.items.map((item, i) => (
              <div key={item.q} className={styles.card}>
                <dt className={styles.cardQ}>
                  <span className={`${styles.cardIndex} num`} aria-hidden="true">
                    Q{i + 1}
                  </span>
                  {item.q}
                </dt>
                <dd className={styles.cardA}>
                  {item.a.map((p, j) => (
                    <p key={j}>
                      <Rich text={p} />
                    </p>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className={styles.list} data-anim="stagger">
            {faq.items.map((item, i) => (
              <details key={item.q} className={styles.item} open={i === 0}>
                <summary className={styles.summary}>
                  <span className={`${styles.index} num`} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={styles.q}>{item.q}</h3>
                  <span className={styles.icon} aria-hidden="true" />
                </summary>
                <div className={styles.answer}>
                  {item.a.map((p, j) => (
                    <p key={j}>
                      <Rich text={p} />
                    </p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
