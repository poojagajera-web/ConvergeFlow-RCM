import { SmartLink } from "@/components/ui/SmartLink";
import { PAGES, type Page, type PageSection } from "@/content/pages";
import type { Design } from "@/content/pageDesign";
import { Blocks, SectionRow, WorkflowAreas, sectionAnchor } from "./ContentSections";
import { LayersMotion, ScrollyNav } from "./BodyMotion";
import styles from "./Bodies.module.css";
import content from "./Content.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

function Body({ section, design }: { section: PageSection; design: Design }) {
  return (
    <>
      <Blocks blocks={section.blocks} table={design.table} subs={design.subs} />
      {sectionAnchor(section) === "workflow-areas" && <WorkflowAreas />}
    </>
  );
}

/* Abstract line art for the zigzag panels (decorative). */
const ART = [
  // Concentric start point
  <g key="a">
    <circle data-draw cx="160" cy="120" r="78" />
    <circle data-draw cx="160" cy="120" r="50" />
    <circle data-draw cx="160" cy="120" r="22" />
    <path data-draw d="M20 120h60M240 120h60" />
  </g>,
  // Week grid with highlighted slots
  <g key="b">
    <path data-draw d="M60 50h200v140H60z M60 85h200 M110 50v140 M160 50v140 M210 50v140 M60 120h200 M60 155h200" />
    <rect className={styles.artFill} x="113" y="88" width="44" height="29" rx="4" />
    <rect className={styles.artFillSoft} x="213" y="123" width="44" height="29" rx="4" />
  </g>,
  // Handoff flow
  <g key="c">
    <rect data-draw x="30" y="95" width="70" height="50" rx="10" />
    <rect data-draw x="125" y="95" width="70" height="50" rx="10" />
    <rect data-draw x="220" y="95" width="70" height="50" rx="10" />
    <path data-draw d="M100 120h25M195 120h25 M160 60v35 M160 145v35" />
  </g>,
  // Checklist
  <g key="d">
    <rect data-draw x="85" y="35" width="150" height="170" rx="14" />
    <path data-draw d="M110 80l10 10 18-20 M150 82h60 M110 125l10 10 18-20 M150 127h60 M110 170h28 M150 172h60" />
  </g>,
  // Network
  <g key="e">
    <path data-draw d="M160 120 70 60M160 120 250 60M160 120 70 180M160 120 250 180M70 60h180M70 180h180" />
    <circle className={styles.artFill} cx="160" cy="120" r="14" />
    <circle data-draw cx="70" cy="60" r="10" />
    <circle data-draw cx="250" cy="60" r="10" />
    <circle data-draw cx="70" cy="180" r="10" />
    <circle data-draw cx="250" cy="180" r="10" />
  </g>,
];

function Zigzag({ page, design }: { page: Page; design: Design }) {
  return (
    <section className={`section ${styles.zigzag}`} aria-label="Page content">
      <div className="container">
        {page.sections.map((s, i) => {
          const id = sectionAnchor(s);
          return (
            <article key={s.id} id={id} className={styles.zig} data-flip={i % 2 === 1 || undefined} aria-labelledby={`${id}-title`}>
              <div className={styles.zigArt} data-anim="draw" aria-hidden="true">
                <span className={`${styles.zigNumeral} num`}>{pad(i + 1)}</span>
                <svg viewBox="0 0 320 240">{ART[i % ART.length]}</svg>
              </div>
              <div className={styles.zigCopy}>
                <p className={styles.kicker} data-anim="fade">
                  Question {pad(i + 1)}
                </p>
                <h2 id={`${id}-title`} className={styles.zigTitle} data-anim="lines">
                  {s.title}
                </h2>
                <div className={styles.prose} data-anim="fade">
                  <Body section={s} design={design} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Bento({ page, design }: { page: Page; design: Design }) {
  return (
    <section className={`section ${styles.bentoSection}`} aria-label="Page content">
      <div className={`container ${styles.bento}`} data-anim="stagger">
        {page.sections.map((s, i) => {
          const id = sectionAnchor(s);
          return (
            <article key={s.id} id={id} className={styles.tile} data-tone={["dark", "teal", "light", "light"][i % 4]} aria-labelledby={`${id}-title`}>
              <span className={`${styles.tileNumeral} num`} aria-hidden="true">
                {pad(i + 1)}
              </span>
              <h2 id={`${id}-title`} className={styles.tileTitle}>
                {s.title}
              </h2>
              <div className={styles.prose}>
                <Body section={s} design={design} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Layers({ page, design }: { page: Page; design: Design }) {
  return (
    <section className={`section ${styles.layersSection} on-dark`} aria-label="Page content">
      <div className="container">
        <LayersMotion>
          {page.sections.map((s, i) => {
            const id = sectionAnchor(s);
            return (
              <article key={s.id} id={id} className={styles.layer} data-layer style={{ ["--i" as string]: i }} aria-labelledby={`${id}-title`}>
                <div className={styles.layerInner} data-layer-inner>
                  <div className={styles.layerHead}>
                    <span className={styles.layerTag}>
                      <span className="num">{pad(i + 1)}</span> / {pad(page.sections.length)}
                    </span>
                    <h2 id={`${id}-title`} className={styles.layerTitle}>
                      {s.title}
                    </h2>
                  </div>
                  <div className={styles.prose}>
                    <Body section={s} design={design} />
                  </div>
                  <span className={styles.layerBars} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </article>
            );
          })}
        </LayersMotion>
      </div>
    </section>
  );
}

function Scrolly({ page, design }: { page: Page; design: Design }) {
  const items = page.sections.map((s) => ({ id: sectionAnchor(s), title: s.title }));
  return (
    <section className={`section ${styles.scrollySection}`} aria-label="Page content">
      <div className={`container ${styles.scrolly}`} data-scrolly>
        <ScrollyNav items={items} />
        <div className={styles.scrollyBody}>
          {page.sections.map((s, i) => {
            const id = sectionAnchor(s);
            return (
              <article key={s.id} id={id} className={styles.chapter} aria-labelledby={`${id}-title`}>
                <span className={`${styles.chapterNumeral} num`} aria-hidden="true" data-anim="fade">
                  {pad(i + 1)}
                </span>
                <h2 id={`${id}-title`} className={styles.chapterTitle} data-anim="lines">
                  {s.title}
                </h2>
                <div className={styles.prose} data-anim="fade">
                  <Body section={s} design={design} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Article({ page, design }: { page: Page; design: Design }) {
  return (
    <section className={`section ${styles.articleSection}`} aria-label="Page content">
      <div className="container">
        {page.sections.map((s, i) => {
          const id = sectionAnchor(s);
          return (
            <article key={s.id} id={id} className={styles.articleBlock} aria-labelledby={`${id}-title`}>
              <header className={styles.articleHead}>
                <span className={`${styles.articleIndex} num`} data-anim="fade">
                  {pad(i + 1)}
                </span>
                <h2 id={`${id}-title`} className={styles.articleTitle} data-anim="lines">
                  {s.title}
                </h2>
              </header>
              <div className={styles.articleBody} data-anim="fade">
                <Body section={s} design={design} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* Icons for the built service pages (eligibility, prior auth, claims, denials, AR). */
const SERVICE_ICONS: Record<string, string> = {
  "eligibility-verification": "M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z M9 12l2 2 4-4",
  "prior-authorization": "M7 3h8l4 4v14H7z M15 3v4h4 M10 13l2 2 4-4",
  "claims-submission": "M21 3 3 10.5l7 2.5 2.5 7z M10 13l11-10",
  "denial-management": "M12 4 21 20H3z M12 10v4.5 M12 17h.01",
  "ar-management": "M3 20h18 M5 20v-8 M10 20V6 M15 20v-6 M20 20v-11",
};

/** The five built service pages as a highlighted band of cards. */
function ServiceBand() {
  const services = PAGES.filter((p) => p.category === "services" && p.segments.length > 1);
  return (
    <ul className={styles.serviceBand} data-anim="stagger">
      {services.map((p, i) => (
        <li key={p.route}>
          <SmartLink href={p.route} className={styles.serviceCard}>
            <span className={styles.serviceTop}>
              <span className={styles.serviceIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d={SERVICE_ICONS[p.segments[1]] ?? SERVICE_ICONS["claims-submission"]} />
                </svg>
              </span>
              <span className={`${styles.serviceIndex} num`}>{pad(i + 1)}</span>
            </span>
            <span className={styles.serviceTitle}>{p.label}</span>
            <span className={styles.serviceBody}>{p.seo.description}</span>
            <span className={styles.serviceGo}>
              Explore
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" />
              </svg>
            </span>
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}

/** Full-container rows: numeral, title and copy side by side (services hub). */
function Process({ page, design }: { page: Page; design: Design }) {
  return (
    <section className={`section ${styles.processSection}`} aria-label="Page content">
      <div className="container">
        {page.sections.map((s, i) => {
          const id = sectionAnchor(s);
          const highlight = id === "workflow-areas";
          return (
            <article key={s.id} id={id} className={styles.proc} data-highlight={highlight || undefined} aria-labelledby={`${id}-title`}>
              <span className={`${styles.procNum} num`} aria-hidden="true" data-anim="fade">
                {pad(i + 1)}
              </span>
              <h2 id={`${id}-title`} className={styles.procTitle} data-anim="lines">
                {s.title}
              </h2>
              <div className={styles.procBody} data-anim="fade">
                <Blocks blocks={s.blocks} table={design.table} subs={design.subs} />
              </div>
              {highlight && (
                <div className={styles.procWide}>
                  <ServiceBand />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Rows({ page }: { page: Page }) {
  return (
    <section className={`section ${content.section}`} aria-label="Page content">
      <div className="container">
        {page.sections.map((s, i) => (
          <SectionRow key={s.id} section={s} index={i} />
        ))}
      </div>
    </section>
  );
}

export function ContentBody({ page, design }: { page: Page; design: Design }) {
  if (!page.sections.length) return null;
  switch (design.body) {
    case "zigzag":
      return <Zigzag page={page} design={design} />;
    case "bento":
      return <Bento page={page} design={design} />;
    case "layers":
      return <Layers page={page} design={design} />;
    case "scrolly":
      return <Scrolly page={page} design={design} />;
    case "article":
      return <Article page={page} design={design} />;
    case "process":
      return <Process page={page} design={design} />;
    default:
      return <Rows page={page} />;
  }
}
