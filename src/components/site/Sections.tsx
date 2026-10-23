import { ButtonLink } from "@/components/ui/Button";
import { Rich } from "@/components/content/Rich";
import { liveHref } from "@/content/navigation";
import type { Section } from "@/content/site/types";
import { Icon } from "./Icon";
import { Polaroid } from "./Paper";
import { SectionHead } from "./Title";
import styles from "./Sections.module.css";

type Of<K extends Section["kind"]> = Extract<Section, { kind: K }>;

function Chips({ s }: { s: Of<"chips"> }) {
  return (
    <section id={s.id} className={`section ${styles.section} ${styles.chipsSection}`}>
      <div className={`container ${styles.chipsLayout}`}>
        <div>
          <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} />
          {s.body && (
            <p className={styles.lede} data-anim="fade">
              <Rich text={s.body} />
            </p>
          )}
        </div>
        <div>
          <ul className={styles.chips} data-anim="stagger">
            {s.chips.map((c) => (
              <li key={c}>
                <Icon name="check" />
                {c}
              </li>
            ))}
          </ul>
          {s.note && (
            <p className={styles.note} data-anim="fade">
              {s.note}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function Feature({ s }: { s: Of<"feature"> }) {
  return (
    <section id={s.id} className={`section ${styles.section}`}>
      <div className={`container ${styles.feature}`} data-reverse={s.reverse || undefined} data-has-photo={s.photo ? true : undefined}>
        <div className={styles.featureCopy}>
          <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} />
          <div className={styles.featureBody} data-anim="fade">
            {s.body.map((p, i) => (
              <p key={i}>
                <Rich text={p} />
              </p>
            ))}
          </div>
          {s.points && (
            <ul className={styles.points} data-anim="stagger">
              {s.points.map((p) => (
                <li key={p}>
                  <Icon name="check" />
                  {p}
                </li>
              ))}
            </ul>
          )}
          {s.link && liveHref(s.link.href) && (
            <div data-anim="fade">
              <ButtonLink href={s.link.href} variant="secondary">
                {s.link.label}
              </ButtonLink>
            </div>
          )}
        </div>
        {s.photo ? (
          <div className={styles.featureVisual} data-anim="fade">
            <Polaroid photo={s.photo} tilt={s.reverse ? 3 : -3} />
          </div>
        ) : (
          <div className={styles.featureVisual} data-anim="fade">
            <div className={styles.featureMark} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Table({ s }: { s: Of<"table"> }) {
  return (
    <section id={s.id} className={`section ${styles.section}`}>
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} />
        <div className={styles.tableWrap} data-anim="fade">
          <table className={styles.table}>
            <thead>
              <tr>
                {s.head.map((h, i) => (
                  <th key={i} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) =>
                    j === 0 ? (
                      <th key={j} scope="row" data-label={s.head[j]}>
                        {c}
                      </th>
                    ) : (
                      <td key={j} data-label={s.head[j]}>
                        {c}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {s.note && <p className={styles.note}>{s.note}</p>}
      </div>
    </section>
  );
}

function Evidence({ s }: { s: Of<"evidence"> }) {
  return (
    <section id={s.id} className={`section ${styles.section}`}>
      <div className={`container ${styles.evidence}`}>
        <div>
          <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} />
          {s.body && (
            <p className={styles.lede} data-anim="fade">
              {s.body}
            </p>
          )}
        </div>
        <div className={styles.receipt} data-anim="fade">
          <p className={styles.receiptHead}>
            <span>Evidence record</span>
            <span className="num">Illustrative</span>
          </p>
          <ul className={styles.receiptList}>
            {s.items.map((it) => (
              <li key={it.title}>
                <span className={styles.receiptIcon}>{it.icon && <Icon name={it.icon} />}</span>
                <span>
                  <b>{it.title}</b>
                  <span>{it.body}</span>
                </span>
                <span className={styles.receiptTick} aria-hidden="true">
                  <Icon name="check" />
                </span>
              </li>
            ))}
          </ul>
          <span className={styles.receiptStamp} data-anim="stamp" data-rotate="-7" aria-hidden="true">
            On file
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * The plain renderer for a section a page layout doesn't design itself. Every
 * other kind has its own showcase in the page layouts, so it renders nothing here.
 */
export function SiteSection({ s }: { s: Section }) {
  switch (s.kind) {
    case "chips":
      return <Chips s={s} />;
    case "feature":
      return <Feature s={s} />;
    case "table":
      return <Table s={s} />;
    case "evidence":
      return <Evidence s={s} />;
    default:
      return null;
  }
}
