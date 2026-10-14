import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { DEMO, FOOTER, HERO } from "@/content/home";
import { COMPANY_LINKS, INDUSTRY_LINKS, PRIMARY_NAV, SERVICES_OVERVIEW, SERVICE_LINKS, resolveHref, type NavLink } from "@/content/navigation";
import { CopyrightYear } from "./CopyrightYear";
import styles from "./Footer.module.css";

function Column({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <nav className={styles.column} aria-label={title}>
      <h2 className={styles.columnTitle}>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <SmartLink href={resolveHref(link) ?? "/"} className={styles.link}>
              <span>{link.label}</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" />
              </svg>
            </SmartLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Shield() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1.5 2.5 3.8v3.7c0 3.2 2.3 5.9 5.5 7 3.2-1.1 5.5-3.8 5.5-7V3.8L8 1.5Z" />
      <path d="m5.6 8 1.7 1.7 3.2-3.4" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className={`${styles.footer} on-dark`}>
      <div className="container">
        {/* Closing call to action */}
        <section className={styles.cta} aria-labelledby="footer-cta-title">
          <svg className={styles.ctaLines} viewBox="0 0 600 300" preserveAspectRatio="none" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <path key={i} d={`M0 ${18 + i * 33} C 260 ${18 + i * 33}, 300 150, 600 150`} style={{ animationDelay: `${i * -0.6}s` }} />
            ))}
          </svg>
          <div className={styles.ctaCopy}>
            <p className="eyebrow">{DEMO.eyebrow}</p>
            <h2 id="footer-cta-title" className={styles.ctaTitle}>
              {HERO.titleLead} <span className="accent">{HERO.titleAccent}</span>
            </h2>
          </div>
          <div className={styles.ctaSide}>
            <p className={styles.ctaText}>{DEMO.checklist[1]}. Live go-live in 2 to 4 weeks with zero clinical downtime.</p>
            <div className={styles.ctaButtons}>
              <ButtonLink href={resolveHref(PRIMARY_NAV.demo) ?? "/demo"}>{FOOTER.cta}</ButtonLink>
              <ButtonLink href={resolveHref(SERVICES_OVERVIEW) ?? "/#pipeline"} variant="secondary">
                Explore services
              </ButtonLink>
            </div>
          </div>
        </section>

        <div className={styles.main}>
          <div className={styles.brand}>
            <Logo tone="light" width={190} />
            <p className={styles.tagline}>{FOOTER.tagline}</p>
            <ul className={styles.trust}>
              {FOOTER.trust.map((t) => (
                <li key={t}>
                  <Shield />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <Column title="Services" links={SERVICE_LINKS} />
          <Column title="Industries" links={INDUSTRY_LINKS} />
          <Column title="Company" links={COMPANY_LINKS} />
        </div>

        <div className={styles.bottom}>
          <p>
            © <CopyrightYear /> ConvergeFlow Inc. All rights reserved. {FOOTER.legal}
          </p>
          <p className={styles.credit}>
            {FOOTER.credit.lead}{" "}
            <a href={FOOTER.credit.href} target="_blank" rel="noopener">
              {FOOTER.credit.name}
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </p>
          <SmartLink href="#main" className={styles.top}>
            Back to top
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 13V3.5M4 7l4-4 4 4" />
            </svg>
          </SmartLink>
        </div>
      </div>
    </footer>
  );
}
