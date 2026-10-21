import { ButtonLink } from "@/components/ui/Button";
import { Rich } from "@/components/content/Rich";
import { DEMO_LINK } from "@/content/navigation";
import type { Faq } from "@/content/site/types";
import { TitleText } from "./Title";
import styles from "./SiteFaq.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Visible FAQ (every answer is in the initial HTML so it can match FAQ schema):
 * sticky heading on the left, a borderless numbered accordion on the right.
 */
export function SiteFaq({
  items,
  title = "Good questions,",
  accent = "straight answers.",
  intro,
}: {
  items: Faq[];
  title?: string;
  accent?: string;
  intro?: string;
}) {
  if (!items.length) return null;
  return (
    <section id="faq" className={`section ${styles.section}`} aria-labelledby="faq-title">
      <div className={`container ${styles.layout}`}>
        <header className={styles.head}>
          <p className="eyebrow" data-anim="fade">
            FAQ
          </p>
          <h2 id="faq-title" className={styles.title} data-anim="words">
            <TitleText title={title} accent={accent} />
          </h2>
          {intro && (
            <p className={styles.intro} data-anim="fade">
              {intro}
            </p>
          )}
          <div className={styles.meta} data-anim="fade">
            <span className={styles.count}>
              <span className="num">{pad(items.length)}</span> questions
            </span>
            <p className={styles.ask}>Still unsure? Ask us directly.</p>
            <ButtonLink href={DEMO_LINK.href}>{DEMO_LINK.label}</ButtonLink>
          </div>
        </header>
        <div className={styles.lines} data-anim="stagger">
          {items.map((item, i) => (
            <details key={item.q} className={styles.line} open={i === 0} data-glow>
              <summary className={styles.summary}>
                <span className={`${styles.index} num`} aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <h3 className={styles.q}>{item.q}</h3>
                <span className={styles.icon} aria-hidden="true" />
              </summary>
              <div className={styles.answer}>
                <p>
                  <Rich text={item.a} />
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
