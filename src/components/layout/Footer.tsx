import Image from "next/image";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { FOOTER } from "@/content/home";
import { COMPANY_LINKS, DEMO_LINK, groupByLabel, type NavLink } from "@/content/navigation";
import { CopyrightYear } from "./CopyrightYear";
import styles from "./Footer.module.css";

const SOFTQUBES = { lead: "Design & Developed by", name: "Softqubes Technologies LLC", href: "https://softqubes.com/" };

/** Lines from both edges converging on the mark at the centre of the band. */
const LEFT = Array.from({ length: 5 }, (_, i) => `M0 ${12 + i * 29} C 300 ${12 + i * 29}, 420 70, 560 70`);
const RIGHT = Array.from({ length: 5 }, (_, i) => `M1200 ${12 + i * 29} C 900 ${12 + i * 29}, 780 70, 640 70`);

function Column({ title, links }: { title: string; links: NavLink[] }) {
  if (!links.length) return null;
  return (
    <nav className={styles.column} aria-label={title}>
      <h2 className={styles.columnTitle}>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <SmartLink href={link.href} className={styles.link}>
              {link.label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** A group's built overview first (when it exists), then its built child pages. */
function groupLinks(label: string, overview: string): NavLink[] {
  const g = groupByLabel(label);
  if (!g) return [];
  return [...(g.href ? [{ label: overview, href: g.href }] : []), ...g.children];
}

export function Footer() {
  return (
    <footer className={`${styles.footer} on-dark`}>
      <div className="container">
        <div className={styles.main}>
          <div className={styles.brand}>
            <Logo tone="light" width={200} />
            <p className={styles.intro}>{FOOTER.intro}</p>
            <div className={styles.actions}>
              <ButtonLink href={DEMO_LINK.href}>{DEMO_LINK.label}</ButtonLink>
            </div>
          </div>
          <div className={styles.columns}>
            <Column title="Services" links={groupLinks("Services", "Services Overview")} />
            <Column title="Industries" links={groupLinks("Industries", "Industries Overview")} />
            <Column title="Company" links={COMPANY_LINKS} />
          </div>
        </div>
      </div>

      {/* Convergence band */}
      <div className={styles.band} aria-hidden="true">
        <svg className={styles.bandLines} viewBox="0 0 1200 140" preserveAspectRatio="none">
          {[...LEFT, ...RIGHT].map((d, i) => (
            <path key={i} d={d} style={{ animationDelay: `${(i % 5) * -0.8}s` }} />
          ))}
        </svg>
        <span className={styles.mark}>
          <span className={styles.markRing} />
          <span className={styles.markLogo}>
            <Image src="/assets/logos/convergeflow-mark.png" alt="" width={180} height={180} />
          </span>
        </span>
      </div>

      <div className="container">
        <div className={styles.bottom}>
          <p>
            © <CopyrightYear /> ConvergeFlow. All rights reserved.
          </p>
          <p className={styles.credit}>
            {SOFTQUBES.lead}{" "}
            <a href={SOFTQUBES.href} target="_blank" rel="noopener">
              {SOFTQUBES.name}
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
