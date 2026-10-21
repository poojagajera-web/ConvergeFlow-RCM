import { HOME_TICKER } from "@/content/site/home";
import styles from "./Ticker.module.css";

/** Two rows of illustrative claim statuses drifting in opposite directions. */
export function Ticker() {
  return (
    <section className={styles.section} aria-label="Illustrative claim statuses">
      {HOME_TICKER.map((row, r) => (
        <div key={r} className={styles.track} data-dir={r % 2 ? "rev" : undefined}>
          <div className={styles.belt}>
            {[0, 1].map((copy) => (
              <ul key={copy} className={styles.row} aria-hidden={copy === 1 || undefined}>
                {row.map((c) => (
                  <li key={c.label} className={styles.chip}>
                    <span className={styles.dot} data-tone={c.tone} />
                    <span className={styles.label}>{c.label}</span>
                    <span className={styles.status} data-tone={c.tone}>
                      {c.status}
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
