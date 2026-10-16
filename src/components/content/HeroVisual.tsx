import Image from "next/image";
import { SmartLink } from "@/components/ui/SmartLink";
import { DemoForm } from "@/components/forms/DemoForm";
import { INDUSTRIES, PIPELINE, TECHNOLOGY, TRUST } from "@/content/home";
import { liveHref } from "@/content/navigation";
import type { Page } from "@/content/pages";
import type { HeroVisualKind } from "@/content/pageDesign";
import { Blocks, sectionAnchor } from "./ContentSections";
import styles from "./Visuals.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
type Item = { label: string; href: string | null; current: boolean };

function ItemLink({ it, className, children }: { it: Item; className: string; children: React.ReactNode }) {
  return it.href && !it.current ? (
    <SmartLink href={it.href} className={className}>
      {children}
    </SmartLink>
  ) : (
    <span className={className} data-static aria-current={it.current ? "page" : undefined}>
      {children}
    </span>
  );
}

/* ---------- Stage focus (service pages) ---------- */
/** Stage ranges for the four workflow groups, matching the homepage pipeline. */
const STAGE_GROUPS: [number, number][] = [
  [0, 2],
  [3, 4],
  [5, 5],
  [6, 7],
];

function StageFocus({ route }: { route: string }) {
  const stages = PIPELINE.pipeline ?? [];
  const k = Math.max(0, stages.findIndex((s) => s.url === route));
  const stage = stages[k];
  const g = STAGE_GROUPS.findIndex(([a, b]) => k >= a && k <= b);
  const group = (PIPELINE.cards ?? [])[g];
  const prev = stages[k - 1];
  const next = stages[k + 1];
  const neighbour = (s: (typeof stages)[number] | undefined, dir: "prev" | "next", n: number) => {
    if (!s) return <span className={styles.focusEdge} />;
    const href = s.url ? liveHref(s.url) : null;
    const inner = (
      <>
        <span className={styles.focusDir}>{dir === "prev" ? "Before" : "Next"}</span>
        <span className={styles.focusNeighbour}>
          <span className={`${styles.focusNum} num`}>{pad(n + 1)}</span>
          {s.title}
        </span>
        {href && (
          <svg className={styles.focusArrow} viewBox="0 0 20 20" aria-hidden="true">
            <path d={dir === "prev" ? "M16 10H5m4.5-4.5L5 10l4.5 4.5" : "M4 10h11m-4.5-4.5L15 10l-4.5 4.5"} />
          </svg>
        )}
      </>
    );
    return href ? (
      <SmartLink href={href} className={styles.focusSide} data-dir={dir} data-item>
        {inner}
      </SmartLink>
    ) : (
      <span className={styles.focusSide} data-dir={dir} data-static data-item>
        {inner}
      </span>
    );
  };

  return (
    <figure className={styles.focus} data-visual>
      <figcaption className={styles.focusHead} data-item>
        <span className={styles.focusGroup}>{group?.title}</span>
        <span className={`${styles.focusCount} num`}>
          Stage {pad(k + 1)} <span>/ {pad(stages.length)}</span>
        </span>
      </figcaption>

      <ol className={styles.focusDots} aria-label="Patient-to-payment stages" data-item>
        {stages.map((s, i) => (
          <li key={s.title} data-on={i === k || undefined} data-done={i < k || undefined} title={s.title}>
            <span className="visually-hidden">
              {pad(i + 1)} {s.title}
              {i === k ? " (this page)" : ""}
            </span>
          </li>
        ))}
      </ol>

      <div className={styles.focusPath}>
        {neighbour(prev, "prev", k - 1)}
        <div className={styles.focusCurrent} data-item data-current>
          <span className={styles.focusBadge}>This page</span>
          <span className={`${styles.focusBig} num`}>{pad(k + 1)}</span>
          <span className={styles.focusTitle}>{stage?.title}</span>
          <span className={styles.focusBody}>{stage?.body}</span>
        </div>
        {neighbour(next, "next", k + 1)}
      </div>
    </figure>
  );
}

/* ---------- 3D topic stack (technology) ---------- */
function Stack({ current }: { current: string | null }) {
  const topics = (TECHNOLOGY.cards ?? []).map((c) => c.title);
  return (
    <figure className={styles.stackScene} data-visual>
      <ol className={styles.stack3d}>
        {topics.map((t, i) => (
          <li key={t} className={styles.slab} data-item data-slab data-current={t === current || undefined} style={{ ["--i" as string]: i }}>
            <span className={`${styles.slabIndex} num`}>{pad(i + 1)}</span>
            <span className={styles.slabLabel}>{t}</span>
            {t === current && <span className={styles.here}>This page</span>}
          </li>
        ))}
      </ol>
      <figcaption className={styles.caption}>Technology evaluation topics, layer by layer</figcaption>
    </figure>
  );
}

/* ---------- Fanned question cards (industries) ---------- */
function Profile({ page }: { page: Page }) {
  const qs = page.sections.slice(0, 4);
  return (
    <nav className={styles.fan} aria-label="Questions on this page" data-visual>
      <p className={styles.fanLabel}>Questions on this page</p>
      <ol className={styles.fanDeck}>
        {qs.map((s, i) => (
          <li key={s.id} className={styles.fanCard} data-item data-fan style={{ ["--i" as string]: i, ["--n" as string]: qs.length }}>
            <SmartLink href={`#${sectionAnchor(s)}`} className={styles.fanLink}>
              <span className={`${styles.fanIndex} num`}>{pad(i + 1)}</span>
              <span className={styles.fanTitle}>{s.title}</span>
              <span className={styles.fanArrow} aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M8 3v9.5M4 9l4 4 4-4" />
                </svg>
              </span>
            </SmartLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Orbit (about) ---------- */
function Orbit() {
  const areas = (TRUST.cards ?? []).map((c) => c.title);
  return (
    <figure className={styles.orbit} data-visual>
      <span className={styles.orbitRing} data-ring aria-hidden="true" />
      <span className={`${styles.orbitRing} ${styles.orbitRingInner}`} data-ring aria-hidden="true" />
      <span className={styles.orbitCore} aria-hidden="true" data-core>
        <Image src="/assets/logos/convergeflow-mark.png" alt="" width={180} height={180} />
      </span>
      <ul className={styles.orbitList}>
        {areas.map((a, i) => (
          <li key={a} className={styles.satellite} data-item style={{ ["--a" as string]: `${i * 90 - 45}deg` }}>
            <span className={styles.satelliteDot} aria-hidden="true" />
            {a}
          </li>
        ))}
      </ul>
      <figcaption className="visually-hidden">The four review areas ConvergeFlow brings together</figcaption>
    </figure>
  );
}

/* ---------- Step ribbon (how it works) ---------- */
function Steps({ page }: { page: Page }) {
  const host = page.sections.find((s) => s.blocks.some((b) => b.type === "sub"));
  const subs = host ? host.blocks.filter((b) => b.type === "sub") : [];
  return (
    <nav className={styles.stepsWrap} aria-label="Evaluation steps" data-visual>
      <ol className={styles.steps}>
        <span className={styles.ribbonLine} aria-hidden="true" data-rail-x />
        {subs.map((s, i) => (
          <li key={s.title} className={styles.stepItem} data-item>
            <SmartLink href={host ? `#${sectionAnchor(host)}` : "#"} className={styles.stepLink}>
              <span className={`${styles.stepNode} num`}>{pad(i + 1)}</span>
              <span className={styles.stepLabel}>{s.title}</span>
            </SmartLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Document with checkable rows (pricing, why) ---------- */
function Doc({ page, title, note, tone }: { page: Page; title: string; note: string; tone: "proposal" | "checklist" }) {
  const table = page.sections.flatMap((s) => s.blocks).find((b) => b.type === "table");
  const rows = table && table.type === "table" ? table.rows : [];
  return (
    <figure className={`${styles.doc} ${tone === "checklist" ? styles.docDark : ""}`} data-visual>
      <div className={styles.docPaper}>
        <div className={styles.docTop}>
          <span className={styles.docTitle}>{title}</span>
          <span className={styles.docTag}>{note}</span>
        </div>
        {table && table.type === "table" && <p className={styles.docCol}>{table.head[0]}</p>}
        <ul className={styles.docRows}>
          {rows.map((r) => (
            <li key={r[0]} className={styles.docRow} data-item>
              <svg className={styles.docCheck} viewBox="0 0 20 20" aria-hidden="true">
                <rect x="1.5" y="1.5" width="17" height="17" rx="5" />
                <path d="m5.5 10.5 3 3 6-7" data-tick />
              </svg>
              <span>{r[0]}</span>
            </li>
          ))}
        </ul>
        <div className={styles.docLines} aria-hidden="true">
          <span />
          <span />
        </div>
      </div>
      <figcaption className={styles.caption}>Illustrative worksheet · questions to resolve, not terms</figcaption>
    </figure>
  );
}

/* ---------- Inquiry composer (contact) ---------- */
function Compose() {
  const include = ["Practice type", "PMS or EHR name", "Workflow question"];
  const leave = ["Patient information", "Account credentials"];
  return (
    <figure className={styles.compose} data-visual>
      <div className={styles.composeBar}>
        <span className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>New product inquiry</span>
      </div>
      <div className={styles.composeBody}>
        <p className={styles.composeLabel}>Include</p>
        <ul className={styles.chips}>
          {include.map((c) => (
            <li key={c} className={styles.chipYes} data-item>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m3.5 8.5 3 3 6-7" />
              </svg>
              {c}
            </li>
          ))}
        </ul>
        <p className={styles.composeLabel}>Leave out</p>
        <ul className={styles.chips}>
          {leave.map((c) => (
            <li key={c} className={styles.chipNo} data-item>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
              {c}
            </li>
          ))}
        </ul>
        <div className={styles.composeLines} aria-hidden="true">
          <span data-type />
          <span data-type />
          <span data-type />
        </div>
      </div>
      <figcaption className={styles.caption}>Illustrative · what a useful inquiry contains</figcaption>
    </figure>
  );
}

/* ---------- Guide library (resources) ---------- */
function Library({ page }: { page: Page }) {
  const host = page.sections.find((s) => s.blocks.some((b) => b.type === "sub"));
  const subs = host ? host.blocks.filter((b) => b.type === "sub") : [];
  return (
    <nav className={styles.library} aria-label="Guides on this page" data-visual>
      {subs.map((s, i) => (
        <SmartLink key={s.title} href={host ? `#${sectionAnchor(host)}` : "#"} className={styles.book} data-item style={{ ["--i" as string]: i }}>
          <span className={`${styles.bookIndex} num`}>Guide {pad(i + 1)}</span>
          <span className={styles.bookTitle}>{s.title}</span>
          <span className={styles.bookLines} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </SmartLink>
      ))}
    </nav>
  );
}

/* ---------- The demo request form itself ---------- */
function FormVisual({ page }: { page: Page }) {
  const form = page.form;
  if (!form) return null;
  return (
    <div id={form.id} className={styles.formCard} data-visual>
      <DemoForm title={form.title} intro={<Blocks blocks={form.blocks} />} fields={form.fields} submit={form.submit} privacy="" />
    </div>
  );
}

export function HeroVisual({ page, kind }: { page: Page; kind: HeroVisualKind }) {
  switch (kind) {
    case "none":
      return null;
    case "locator":
      return <StageFocus route={page.route} />;
    case "stack":
      return <Stack current={page.route === "/technology/security/" ? "Credential Management" : null} />;
    case "profile":
      return <Profile page={page} />;
    case "orbit":
      return <Orbit />;
    case "steps":
      return <Steps page={page} />;
    case "proposal":
      return <Doc page={page} title="Proposal review" note="Pricing discussion" tone="proposal" />;
    case "checklist":
      return <Doc page={page} title="Fit checklist" note="Demo evaluation" tone="checklist" />;
    case "compose":
      return <Compose />;
    case "library":
      return <Library page={page} />;
    case "form":
      return <FormVisual page={page} />;
  }
}

/** Industry audiences, for the industry hero's audience strip. */
export function AudienceStrip({ route }: { route: string }) {
  const items = (INDUSTRIES.cards ?? []).map((c) => ({ label: c.title, href: c.url ? liveHref(c.url) : null, current: c.url === route }));
  return (
    <ul className={styles.audience} aria-label="Practice types">
      {items.map((it) => (
        <li key={it.label} data-current={it.current || undefined}>
          <ItemLink it={it} className={styles.audienceChip}>
            {it.label}
          </ItemLink>
        </li>
      ))}
    </ul>
  );
}
