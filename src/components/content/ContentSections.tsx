import type { ReactNode } from "react";
import { SmartLink } from "@/components/ui/SmartLink";
import { PAGES, type Block, type Page, type PageSection } from "@/content/pages";
import type { Design } from "@/content/pageDesign";
import { HorizontalSteps } from "./BodyMotion";
import { Rich } from "./Rich";
import styles from "./Content.module.css";
import bodies from "./Bodies.module.css";

/** In-page anchors the package's buttons point at, keyed by generated section id. */
export const SECTION_ALIAS: Record<string, string> = {
  "explore-the-priority-workflow-areas": "workflow-areas",
};
export const sectionAnchor = (s: PageSection) => SECTION_ALIAS[s.id] ?? s.id;

const pad = (n: number) => String(n).padStart(2, "0");

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => {
                const Cell = j === 0 ? "th" : "td";
                return (
                  <Cell key={j} scope={j === 0 ? "row" : undefined} data-label={head[j]}>
                    <Rich text={c} />
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type Sub = Extract<Block, { type: "sub" }>;
export type BlockOpts = { table?: Design["table"]; subs?: Design["subs"] };

/** Table rows as "bring this → ask this" pairs joined by a drawn connector. */
function Pairs({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className={bodies.pairs}>
      <div className={bodies.pairsHead} aria-hidden="true">
        <span>{head[0]}</span>
        <span>{head[1]}</span>
      </div>
      <ol className={bodies.pairList} data-anim="stagger">
        {rows.map((r, i) => (
          <li key={i} className={bodies.pair}>
            <span className={bodies.pairFrom}>
              <span className={`${bodies.pairIndex} num`}>{pad(i + 1)}</span>
              <span>
                <span className="visually-hidden">{head[0]}: </span>
                <Rich text={r[0]} />
              </span>
            </span>
            <span className={bodies.pairLink} aria-hidden="true">
              <svg viewBox="0 0 40 12" preserveAspectRatio="none">
                <path d="M0 6h36m-5-5 5 5-5 5" />
              </svg>
            </span>
            <span className={bodies.pairTo}>
              <span className="visually-hidden">{head[1]}: </span>
              <Rich text={r[1] ?? ""} />
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function LibraryCards({ subs }: { subs: Sub[] }) {
  return (
    <ul className={bodies.libraryCards} data-anim="stagger">
      {subs.map((s, i) => (
        <li key={s.title} className={bodies.libraryCard}>
          <span className={`${bodies.libraryIndex} num`}>Guide {pad(i + 1)}</span>
          <h3 className={bodies.libraryTitle}>{s.title}</h3>
          <div className={bodies.libraryBody}>
            <Blocks blocks={s.blocks} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Steps({ subs }: { subs: Sub[] }) {
  return (
    <ol className={styles.steps} data-anim="stagger">
      {subs.map((s, i) => (
        <li key={s.title} className={styles.step}>
          <span className={`${styles.stepNode} num`} aria-hidden="true">
            {pad(i + 1)}
          </span>
          <div className={styles.stepBody}>
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <Blocks blocks={s.blocks} />
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Blocks({ blocks, table = "table", subs = "steps" }: { blocks: Block[] } & BlockOpts) {
  const out: ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "sub") {
      // Consecutive subsections read as one numbered sequence.
      const run: Sub[] = [];
      while (i < blocks.length && blocks[i].type === "sub") run.push(blocks[i++] as Sub);
      i--;
      if (subs === "horizontal") {
        out.push(
          <HorizontalSteps key={`steps-${i}`} count={run.length}>
            {run.map((s, k) => (
              <li key={s.title} className={bodies.hStep} data-hstep>
                <span className={`${bodies.hStepNum} num`} aria-hidden="true">
                  {pad(k + 1)}
                </span>
                <h3 className={bodies.hStepTitle}>{s.title}</h3>
                <div className={bodies.hStepBody}>
                  <Blocks blocks={s.blocks} />
                </div>
              </li>
            ))}
          </HorizontalSteps>,
        );
      } else if (subs === "library") out.push(<LibraryCards key={`lib-${i}`} subs={run} />);
      else out.push(<Steps key={`steps-${i}`} subs={run} />);
    } else if (b.type === "p") {
      out.push(
        <p key={i} className={styles.p}>
          <Rich text={b.text} />
        </p>,
      );
    } else if (b.type === "list") {
      const List = b.ordered ? "ol" : "ul";
      out.push(
        <List key={i} className={styles.list}>
          {b.items.map((it, j) => (
            <li key={j}>
              <Rich text={it} />
            </li>
          ))}
        </List>,
      );
    } else if (b.type === "table") {
      out.push(table === "pairs" ? <Pairs key={i} head={b.head} rows={b.rows} /> : <Table key={i} head={b.head} rows={b.rows} />);
    }
  }
  return <>{out}</>;
}

/** Link cards to the built service pages, shown under the services hub's workflow-areas section. */
export function WorkflowAreas() {
  const services = PAGES.filter((p) => p.category === "services" && p.segments.length > 1);
  return (
    <ul className={styles.areas} data-anim="stagger">
      {services.map((p, i) => (
        <li key={p.route}>
          <SmartLink href={p.route} className={styles.area}>
            <span className={`${styles.areaIndex} num`}>{pad(i + 1)}</span>
            <span className={styles.areaTitle}>{p.label}</span>
            <span className={styles.areaBody}>{p.seo.description}</span>
            <span className={styles.areaArrow} aria-hidden="true">
              <svg viewBox="0 0 20 20">
                <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" />
              </svg>
            </span>
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}

export function SectionRow({ section, index }: { section: PageSection; index: number }) {
  const anchor = sectionAnchor(section);
  return (
    <article id={anchor} className={styles.row} aria-labelledby={`${anchor}-title`}>
      <header className={styles.rowHead}>
        <span className={`${styles.rowIndex} num`} aria-hidden="true" data-anim="fade">
          {pad(index + 1)}
        </span>
        <h2 id={`${anchor}-title`} className={styles.rowTitle} data-anim="lines">
          {section.title}
        </h2>
      </header>
      <div className={styles.rowBody} data-anim="fade">
        <Blocks blocks={section.blocks} />
        {anchor === "workflow-areas" && <WorkflowAreas />}
      </div>
    </article>
  );
}

export function ContentSections({ page }: { page: Page }) {
  if (!page.sections.length) return null;
  return (
    <section className={`section ${styles.section}`} aria-label="Page content">
      <div className="container">
        {page.sections.map((s, i) => (
          <SectionRow key={s.id} section={s} index={i} />
        ))}
      </div>
    </section>
  );
}
