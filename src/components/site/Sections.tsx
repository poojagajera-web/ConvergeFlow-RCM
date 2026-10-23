import { SmartLink } from "@/components/ui/SmartLink";
import { ButtonLink } from "@/components/ui/Button";
import { Rich } from "@/components/content/Rich";
import { liveHref } from "@/content/navigation";
import { pageByRoute } from "@/content/site";
import type { Section } from "@/content/site/types";
import { Icon } from "./Icon";
import { Polaroid, StickyNote } from "./Paper";
import { Planet } from "@/components/fx/Planet";
import { SectionHead } from "./Title";
import { BalanceBar, ScrollLine, ToothChart } from "./Interactive";
import styles from "./Sections.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

type Of<K extends Section["kind"]> = Extract<Section, { kind: K }>;

function Cards({ s }: { s: Of<"cards"> }) {
  return (
    <section id={s.id} className={`section ${styles.section}`} data-tone={s.tone}>
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} align={s.intro ? "split" : "left"} />
        <ul className={styles.cards} data-cols={s.cols ?? 3} data-anim="stagger">
          {s.items.map((it, i) => (
            <li key={it.title} className={styles.card} data-glow>
              <span className={styles.spot} aria-hidden="true" />
              <span className={styles.cardTop}>
                {it.icon && (
                  <span className={styles.iconTile}>
                    <Icon name={it.icon} />
                  </span>
                )}
                <span className={`${styles.cardIndex} num`}>{pad(i + 1)}</span>
              </span>
              <h3 className={styles.cardTitle}>{it.title}</h3>
              <p className={styles.cardBody}>
                <Rich text={it.body} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Steps({ s }: { s: Of<"steps"> }) {
  return (
    <section id={s.id} className={`section ${styles.section} ${styles.stepsSection}`}>
      <div className={`container ${styles.stepsLayout}`}>
        <div className={styles.stepsHead}>
          <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} />
        </div>
        <ScrollLine className={styles.stepsTrack}>
          <ol className={styles.steps}>
            {s.items.map((it, i) => (
              <li key={it.title} className={styles.step} data-anim="fade">
                <span className={`${styles.stepNum} num`}>{pad(i + 1)}</span>
                <div className={styles.stepBody}>
                  <h3 className={styles.stepTitle}>{it.title}</h3>
                  <p>
                    <Rich text={it.body} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </ScrollLine>
      </div>
    </section>
  );
}

function Split({ s }: { s: Of<"split"> }) {
  return (
    <section id={s.id} className={`section ${styles.section}`}>
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} align="split" />
        <div className={styles.split}>
          <article className={styles.splitPaper} data-anim="fade">
            <p className={styles.splitLabel}>{s.practice.title}</p>
            <ul className={styles.checks}>
              {s.practice.items.map((t) => (
                <li key={t}>
                  <Icon name="check" />
                  {t}
                </li>
              ))}
            </ul>
          </article>
          <span className={styles.handoff} aria-hidden="true">
            <svg viewBox="0 0 120 40">
              <path d="M4 20h104m-12-10 12 10-12 10" data-draw />
            </svg>
            <span className={styles.handoffLabel}>handoff</span>
          </span>
          <article className={`${styles.splitInk} on-dark`} data-anim="fade">
            <p className={styles.splitLabel}>{s.team.title}</p>
            <ul className={styles.checks}>
              {s.team.items.map((t) => (
                <li key={t}>
                  <Icon name="check" />
                  {t}
                </li>
              ))}
            </ul>
          </article>
        </div>
        {s.note && <StickyNote text={s.note} className={styles.splitNote} tilt={-2} />}
      </div>
    </section>
  );
}

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

function Statement({ s }: { s: Of<"statement"> }) {
  return <Planet id={s.id} text={s.text} accent={s.accent} sub={s.sub} />;
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

function Cadence({ s }: { s: Of<"cadence"> }) {
  return (
    <section id={s.id} className={`section ${styles.cadence} on-dark`}>
      <span className={styles.statementGlow} aria-hidden="true" />
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} align="center" />
        <ol className={styles.cadenceList} data-anim="stagger">
          {s.items.map((it) => (
            <li key={it.title} className={styles.cadenceItem} data-glow>
              <span className={styles.cadenceIcon}>{it.icon && <Icon name={it.icon} />}</span>
              <p className={styles.cadenceLabel}>{it.title}</p>
              <p className={styles.cadenceBody}>{it.body}</p>
            </li>
          ))}
        </ol>
        {s.note && (
          <p className={styles.cadenceNote} data-anim="fade">
            {s.note}
          </p>
        )}
      </div>
    </section>
  );
}

function Balance({ s }: { s: Of<"balance"> }) {
  return (
    <section id={s.id} className={`section ${styles.section}`}>
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} />
        <BalanceBar note={s.note} />
      </div>
    </section>
  );
}

function Anatomy({ s }: { s: Of<"anatomy"> }) {
  return (
    <section id={s.id} className={`section ${styles.section} ${styles.anatomySection}`}>
      <div className={`container ${styles.anatomy}`}>
        <div>
          <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} />
          {s.body && (
            <p className={styles.lede} data-anim="fade">
              {s.body}
            </p>
          )}
          <ul className={styles.legend} data-anim="stagger">
            <li>
              <b>1–32 · A–T</b> ADA Universal tooth numbers
            </li>
            <li>
              <b>M D O I B L</b> Treated surfaces
            </li>
            <li>
              <b>Quadrant · arch</b> When the code requires it
            </li>
          </ul>
        </div>
        <ToothChart />
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

export function JourneyGrid({ groups }: { groups: Of<"journey">["groups"] }) {
  const offsets = groups.map((_, i) => groups.slice(0, i).reduce((sum, g) => sum + g.stages.length, 0));
  return (
    <ol className={styles.journey} data-anim="stagger">
      {groups.map((g, gi) => (
        <li key={g.title} className={styles.journeyGroup}>
          <p className={styles.journeyKicker}>
            <span className="num">{pad(gi + 1)}</span>
            {g.title}
          </p>
          <p className={styles.journeySummary}>{g.summary}</p>
          <ul className={styles.journeyStages}>
            {g.stages.map((st, si) => {
              const n = offsets[gi] + si + 1;
              const href = liveHref(st.href);
              const inner = (
                <>
                  <span className={`${styles.journeyNum} num`}>{pad(n)}</span>
                  <span className={styles.journeyText}>
                    <b>{st.label}</b>
                    <span>{st.body}</span>
                  </span>
                  <Icon name="send" className={styles.journeyArrow} />
                </>
              );
              return (
                <li key={st.href}>
                  {href ? (
                    <SmartLink href={href} className={styles.journeyLink}>
                      {inner}
                    </SmartLink>
                  ) : (
                    <span className={styles.journeyLink}>{inner}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ol>
  );
}

function Journey({ s }: { s: Of<"journey"> }) {
  return (
    <section id={s.id} className={`section ${styles.section}`}>
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} align="split" />
        <JourneyGrid groups={s.groups} />
      </div>
    </section>
  );
}

function Stages({ s }: { s: Of<"stages"> }) {
  return (
    <section id={s.id} className={`section ${styles.section}`}>
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} />
        <ol className={styles.stages} data-cols={s.items.length} data-anim="stagger">
          {s.items.map((it, i) => {
            const href = it.href ? liveHref(it.href) : null;
            return (
              <li key={it.title} className={styles.stageItem} data-glow>
                <span className={styles.stageBar} aria-hidden="true" />
                <span className={`${styles.stageNum} num`}>{pad(i + 1)}</span>
                <h3 className={styles.stageTitle}>{it.title}</h3>
                <p className={styles.stageBody}>{it.body}</p>
                {href && (
                  <SmartLink href={href} className={styles.stageLink}>
                    Explore <span aria-hidden="true">→</span>
                  </SmartLink>
                )}
              </li>
            );
          })}
        </ol>
        {s.note && (
          <p className={`${styles.note} ${styles.stagesNote}`} data-anim="fade">
            {s.note}
          </p>
        )}
      </div>
    </section>
  );
}

function Downloads({ s }: { s: Of<"downloads"> }) {
  return (
    <section id={s.id} className={`section ${styles.section}`}>
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} />
        <ul className={styles.downloads} data-anim="stagger">
          {s.items.map((d, i) => (
            <li key={d.href}>
              <a href={d.href} className={styles.download} download>
                <span className={styles.cover} data-variant={i % 2} aria-hidden="true">
                  <span className={styles.coverKicker}>ConvergeFlow</span>
                  <span className={styles.coverTitle}>{d.title.replace(" brochure", "")}</span>
                  <span className={styles.coverLines}>
                    <i />
                    <i />
                    <i />
                  </span>
                </span>
                <span className={styles.downloadText}>
                  <span className={styles.downloadMeta}>{d.meta}</span>
                  <b>{d.title}</b>
                  <span>{d.body}</span>
                  <span className={styles.downloadGo}>
                    <Icon name="download" /> Download PDF
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Related({ s }: { s: Of<"related"> }) {
  const pages = s.routes.map((r) => pageByRoute(r)).filter(Boolean);
  if (!pages.length) return null;
  return (
    <section id={s.id} className={`section ${styles.section} ${styles.related}`}>
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} />
        <ul className={styles.relatedGrid} data-anim="stagger">
          {pages.map((p) => (
            <li key={p!.route}>
              <SmartLink href={p!.route} className={styles.relatedCard}>
                <span className={styles.relatedKicker}>{p!.stage ? `${p!.stage.group} · ${pad(p!.stage.index)}` : p!.hero.eyebrow}</span>
                <b className={styles.relatedTitle}>{p!.label}</b>
                <span className={styles.relatedBody}>{p!.seo.description}</span>
                <span className={styles.relatedGo} aria-hidden="true">
                  <svg viewBox="0 0 20 20">
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

/** One content section, rendered by its kind. */
export function SiteSection({ s }: { s: Section }) {
  switch (s.kind) {
    case "cards":
      return <Cards s={s} />;
    case "steps":
      return <Steps s={s} />;
    case "split":
      return <Split s={s} />;
    case "chips":
      return <Chips s={s} />;
    case "feature":
      return <Feature s={s} />;
    case "statement":
      return <Statement s={s} />;
    case "table":
      return <Table s={s} />;
    case "cadence":
      return <Cadence s={s} />;
    case "balance":
      return <Balance s={s} />;
    case "anatomy":
      return <Anatomy s={s} />;
    case "evidence":
      return <Evidence s={s} />;
    case "journey":
      return <Journey s={s} />;
    case "stages":
      return <Stages s={s} />;
    case "downloads":
      return <Downloads s={s} />;
    case "related":
      return <Related s={s} />;
    default:
      return null;
  }
}

export function SiteSections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((s, i) => (
        <SiteSection key={i} s={s} />
      ))}
    </>
  );
}
