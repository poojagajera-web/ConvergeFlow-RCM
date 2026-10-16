import { ButtonLink } from "@/components/ui/Button";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={`${styles.section} on-dark`} aria-labelledby="nf-title">
      <div className={`container ${styles.inner}`}>
        <p className="eyebrow">404</p>
        <h1 id="nf-title" className={styles.title}>
          This page isn’t available.
        </h1>
        <p className="lede">The link may be outdated, or the page has not been published yet. Start from the home page or the services overview.</p>
        <div className={styles.actions}>
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/services/" variant="secondary">
            Explore the Services
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
