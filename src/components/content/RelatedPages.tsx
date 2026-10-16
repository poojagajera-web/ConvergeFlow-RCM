import { SmartLink } from "@/components/ui/SmartLink";
import { CATEGORY_LABEL, relatedPages, type Page } from "@/content/pages";
import styles from "./Content.module.css";

/** Built pages that continue the reader's evaluation. */
export function RelatedPages({ page, dark = false }: { page: Page; dark?: boolean }) {
  const items = relatedPages(page);
  if (!items.length) return null;
  return (
    <section className={`section ${styles.related} ${dark ? "on-dark" : ""}`} data-dark={dark || undefined} aria-labelledby="related-title">
      <div className="container">
        <h2 id="related-title" className={`eyebrow ${styles.relatedHead}`} data-anim="fade">
          Related pages
        </h2>
        <ul className={styles.relatedGrid} data-anim="stagger">
          {items.map((p) => (
            <li key={p.route}>
              <SmartLink href={p.route} className={styles.relatedCard}>
                <span className={styles.relatedKicker}>{CATEGORY_LABEL[p.category]}</span>
                <span className={styles.relatedTitle}>{p.label}</span>
                <span className={styles.relatedBody}>{p.seo.description}</span>
                <span className={styles.relatedMore}>
                  Read the page
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" />
                  </svg>
                </span>
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
