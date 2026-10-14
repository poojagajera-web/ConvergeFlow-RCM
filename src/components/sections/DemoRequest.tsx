import { DEMO } from "@/content/home";
import { DemoForm } from "@/components/forms/DemoForm";
import styles from "./DemoRequest.module.css";

export function DemoRequest({ headingLevel = 2, index = "09" }: { headingLevel?: 1 | 2; index?: string }) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <section id="demo" className={`section ${styles.section}`} aria-labelledby="demo-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <p className="eyebrow" data-anim="fade">
            {index && <span className="eyebrow-index">{index}</span>}
            {DEMO.eyebrow}
          </p>
          <Heading id="demo-title" className="title-xl" data-anim="lines">
            See what ConvergeFlow can recover <span className="accent">for your practice</span>
          </Heading>
          <p className="lede" data-anim="fade">
            {DEMO.body}
          </p>
          <ul className={styles.checklist} data-anim="stagger">
            {DEMO.checklist.map((c) => (
              <li key={c}>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="m4.5 10.5 3.5 3.5 7.5-8" />
                </svg>
                {c}
              </li>
            ))}
          </ul>
          <div className={styles.security} data-anim="fade">
            <p className={styles.securityTitle}>{DEMO.security.title}</p>
            <p>{DEMO.security.body}</p>
          </div>
        </div>
        <div className={styles.formSlot} data-anim="fade">
          <DemoForm />
        </div>
      </div>
    </section>
  );
}
