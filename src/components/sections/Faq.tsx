"use client";

import { useState } from "react";
import { FAQ } from "@/content/home";
import { SmartLink } from "@/components/ui/SmartLink";
import styles from "./Faq.module.css";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className={`section ${styles.section}`} aria-labelledby="faq-title">
      <div className={`container ${styles.layout}`}>
        <header className={styles.head}>
          <p className="eyebrow" data-anim="fade">
            <span className="eyebrow-index">08</span>
            {FAQ.eyebrow}
          </p>
          <h2 id="faq-title" className="title-xl" data-anim="lines">
            {FAQ.title}
          </h2>
          <p className={styles.more} data-anim="fade">
            Something else on your mind?{" "}
            <SmartLink href="/#demo" className="link-arrow">
              Ask an RCM engineer
            </SmartLink>
          </p>
        </header>

        <div className={styles.list} data-anim="stagger">
          {FAQ.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={styles.item} data-open={isOpen || undefined}>
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    className={styles.question}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className={styles.icon} aria-hidden="true" />
                  </button>
                </h3>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className={styles.answer} inert={!isOpen}>
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
