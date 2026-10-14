import { INDUSTRIES } from "@/content/home";
import { SmartLink } from "@/components/ui/SmartLink";
import { PartnerBanner } from "./PartnerBanner";
import styles from "./Industries.module.css";

export function Industries() {
  return (
    <section id="industries" className={`section ${styles.section}`} aria-labelledby="industries-title">
      <div className="container">
        <header className="section-head is-split">
          <div className={styles.headMain}>
            <p className="eyebrow" data-anim="fade">
              <span className="eyebrow-index">03</span>
              {INDUSTRIES.eyebrow}
            </p>
            <h2 id="industries-title" className="title-xl" data-anim="lines">
              Engineered for <span className="accent">every type</span> of healthcare practice
            </h2>
          </div>
          <p className="lede section-head-aside" data-anim="fade">
            {INDUSTRIES.body}
          </p>
        </header>

        <ol className={styles.list}>
          {INDUSTRIES.items.map((item, i) => (
            <li key={item.id} id={item.id} className={styles.row} data-anim="fade">
              <span className={`${styles.index} num`} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={styles.nameCell}>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.systems}>{item.systems}</p>
              </div>
              <p className={styles.body}>{item.body}</p>
              <div className={styles.metricCell}>
                <p className={styles.metric}>{item.metric}</p>
                <SmartLink href="/#demo" className={styles.link} aria-label={`See the ${item.name} workflow`}>
                  See workflow <span aria-hidden="true">→</span>
                </SmartLink>
              </div>
            </li>
          ))}
        </ol>

        <PartnerBanner />
      </div>
    </section>
  );
}
