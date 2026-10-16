import { INDUSTRIES } from "@/content/home";
import { liveHref } from "@/content/navigation";
import { SmartLink } from "@/components/ui/SmartLink";
import styles from "./Industries.module.css";

/**
 * Seven intended evaluation audiences (source lists seven despite a six-card
 * label). Only built pages are linked; the rest route to a fit discussion.
 */
export function Industries() {
  return (
    <section id="industries" className={`section ${styles.section}`} aria-labelledby="industries-title">
      <div className="container">
        <header className="section-head is-split is-top">
          <div className={styles.headMain}>
            <p className="eyebrow" data-anim="fade">
              {INDUSTRIES.eyebrow}
            </p>
            <h2 id="industries-title" className="title-xl" data-anim="lines">
              {INDUSTRIES.heading}
            </h2>
          </div>
          <p className="lede section-head-aside" data-anim="fade">
            {INDUSTRIES.intro}
          </p>
        </header>

        <ol className={styles.list}>
          {(INDUSTRIES.cards ?? []).map((item, i) => {
            const href = liveHref(item.url ?? "");
            const id = (item.url ?? "").split("/").filter(Boolean).pop();
            return (
              <li key={item.title} id={id ? `industry-${id}` : undefined} className={styles.row} data-anim="fade">
                <span className={`${styles.index} num`} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className={styles.nameCell}>
                  <h3 className={styles.name}>{item.title}</h3>
                </div>
                <p className={styles.body}>{item.body}</p>
                <div className={styles.metricCell}>
                  {href ? (
                    <SmartLink href={href} className={styles.link} aria-label={`Explore ${item.title}`}>
                      Explore <span aria-hidden="true">→</span>
                    </SmartLink>
                  ) : (
                    <SmartLink href="/demo/" className={`${styles.link} ${styles.linkMuted}`} aria-label={`Discuss ${item.title} in a demo`}>
                      Discuss fit <span aria-hidden="true">→</span>
                    </SmartLink>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
