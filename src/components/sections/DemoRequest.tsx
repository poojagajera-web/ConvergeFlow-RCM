import { DEMO } from "@/content/home";
import { DemoForm } from "@/components/forms/DemoForm";
import styles from "./DemoRequest.module.css";

/** Homepage demo request: approved copy beside the (not yet enabled) request form. */
export function DemoRequest() {
  return (
    <section id="demo" className={`section ${styles.section}`} aria-labelledby="demo-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <p className="eyebrow" data-anim="fade">
            {DEMO.eyebrow}
          </p>
          <h2 id="demo-title" className="title-xl" data-anim="lines">
            {DEMO.heading}
          </h2>
          <p className="lede" data-anim="fade">
            {DEMO.intro}
          </p>
          <ul className={styles.checklist} data-anim="stagger">
            {(DEMO.bullets ?? []).map((c) => (
              <li key={c}>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="m4.5 10.5 3.5 3.5 7.5-8" />
                </svg>
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.formSlot} data-anim="fade">
          <DemoForm />
        </div>
      </div>
    </section>
  );
}
