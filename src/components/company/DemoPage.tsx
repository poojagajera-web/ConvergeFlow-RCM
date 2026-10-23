"use client";

import { useId, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { useMotion } from "@/components/motion/useMotion";
import { gsap } from "@/lib/gsap";
import { onSiteReady } from "@/lib/siteReady";
import { CONTACT } from "@/content/site/company";
import { DEMO_FORM, FORM_NOTICE, PRACTICE_TYPES } from "@/content/site/forms";
import type { IconName, Section, SitePage } from "@/content/site/types";
import { Aurora } from "@/components/fx/Aurora";
import { Icon } from "@/components/site/Icon";
import { SiteSection } from "@/components/site/Sections";
import { SectionHead } from "@/components/site/Title";
import { HeroCopy, useHeroIntro } from "@/components/services/InnerPage";
import { pad } from "@/components/services/stageMeta";
import inner from "@/components/services/InnerPage.module.css";
import styles from "./DemoPage.module.css";

type Of<K extends Section["kind"]> = Extract<Section, { kind: K }>;
type Field = { label: string; required: boolean };

const vars = (v: Record<string, string | number>) => v as CSSProperties;

/** How each approved field is rendered. */
const CONTROLS: Record<string, { name: string; type?: string; autoComplete?: string; kind?: "select" | "textarea"; options?: string[] }> = {
  "First name": { name: "firstName", autoComplete: "given-name" },
  "Last name": { name: "lastName", autoComplete: "family-name" },
  "Work email": { name: "email", type: "email", autoComplete: "email" },
  "Practice or organization": { name: "organization", autoComplete: "organization" },
  "Practice type": { name: "practiceType", kind: "select", options: PRACTICE_TYPES },
  "Primary PMS or EHR": { name: "pmsEhr" },
  "What would you like to discuss?": { name: "discuss", kind: "textarea" },
};

/** The form in three short steps: about you, your practice, what to discuss. */
const STEPS: { title: string; icon: IconName; fields: string[] }[] = [
  { title: "About you", icon: "user", fields: ["First name", "Last name", "Work email"] },
  { title: "Your practice", icon: "building", fields: ["Practice or organization", "Practice type", "Primary PMS or EHR"] },
  { title: "Your workflow", icon: "route", fields: ["What would you like to discuss?"] },
];

const STEP_ICONS: IconName[] = ["inbox", "chat", "route", "file"];

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" style={back ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M3 8h9.5M8.5 4l4 4-4 4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ form */

/**
 * The request form as a wide three-step card: a stepper across the top (the
 * line fills as you go), one short group of fields at a time in a row, Back
 * and Next below. The last step adds
 * the topics to cover as chips. Request delivery isn't configured, so the
 * submit button stays disabled with the notice explaining why; nothing is
 * sent and no success state is shown.
 */
function DemoWizard({ topics }: { topics: string[] }) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [picked, setPicked] = useState<string[]>([]);
  const fields = DEMO_FORM.fields as Field[];
  const last = STEPS.length - 1;

  const fieldsOf = (k: number) => STEPS[k].fields.map((label) => fields.find((f) => f.label === label)).filter((f): f is Field => Boolean(f));

  /** Checks the step's required fields before moving on. */
  const validate = (k: number) => {
    const form = formRef.current;
    if (!form) return true;
    const next: Record<string, string> = {};
    for (const f of fieldsOf(k)) {
      const spec = CONTROLS[f.label];
      const el = form.elements.namedItem(spec?.name ?? "") as HTMLInputElement | null;
      if (!el) continue;
      const v = el.value.trim();
      if (f.required && !v) next[f.label] = `Please enter your ${f.label.toLowerCase()}.`;
      else if (spec?.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) next[f.label] = "Please enter a valid email address.";
    }
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) (form.elements.namedItem(CONTROLS[first]?.name ?? "") as HTMLElement | null)?.focus();
    return !first;
  };

  const go = (k: number) => {
    if (k > step && !validate(step)) return;
    setErrors({});
    setStep(k);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault();

  return (
    <form ref={formRef} className={styles.wizard} onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`}>
      <div className={styles.wizHead}>
        <p id={`${id}-title`} className={styles.wizTitle}>
          {DEMO_FORM.title}
        </p>
        <p className={styles.wizStep} aria-live="polite">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>
      <ol className={styles.stepper} style={vars({ "--p": step / (STEPS.length - 1) })}>
        <span className={styles.stepLine} aria-hidden="true">
          <i />
        </span>
        {STEPS.map((st, k) => (
          <li key={st.title}>
            <button type="button" className={styles.stepNode} aria-current={k === step ? "step" : undefined} data-done={k < step || undefined} onClick={() => go(k)} disabled={k > step + 1}>
              <span className={styles.stepDot} aria-hidden="true">
                <Icon name={k < step ? "check" : st.icon} />
              </span>
              <span className={styles.stepName}>
                <small>Step {k + 1}</small>
                {st.title}
              </span>
            </button>
          </li>
        ))}
      </ol>

      {STEPS.map((st, k) => (
        <fieldset key={st.title} className={styles.panel} hidden={k !== step}>
          <legend className="visually-hidden">{st.title}</legend>
          {fieldsOf(k).map((f) => {
            const spec = CONTROLS[f.label] ?? { name: f.label.toLowerCase().replace(/\W+/g, "-") };
            const fid = `${id}-${spec.name}`;
            const err = errors[f.label];
            const common = { id: fid, name: spec.name, required: f.required, "aria-required": f.required || undefined, "aria-invalid": err ? true : undefined, "aria-describedby": err ? `${fid}-err` : undefined };
            return (
              <div key={spec.name} className={styles.field} data-invalid={err ? "" : undefined} data-wide={spec.kind === "textarea" || spec.name === "organization" || undefined}>
                <label htmlFor={fid}>
                  {f.label}
                  {f.required ? <span aria-hidden="true"> *</span> : <span className={styles.optional}> (optional)</span>}
                </label>
                {spec.kind === "select" ? (
                  <div className={styles.selectWrap}>
                    <select {...common} defaultValue="">
                      <option value="" disabled>
                        Select…
                      </option>
                      {spec.options?.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : spec.kind === "textarea" ? (
                  <textarea {...common} rows={4} maxLength={600} />
                ) : (
                  <input {...common} type={spec.type ?? "text"} autoComplete={spec.autoComplete} />
                )}
                {err && (
                  <p id={`${fid}-err`} className={styles.error}>
                    {err}
                  </p>
                )}
              </div>
            );
          })}
          {k === last && topics.length > 0 && (
            <div className={styles.topics} role="group" aria-labelledby={`${id}-topics`}>
              <p id={`${id}-topics`} className={styles.topicsLabel}>
                Topics to cover <span className={styles.optional}>(optional)</span>
              </p>
              <div className={styles.topicChips}>
                {topics.map((t) => (
                  <label key={t} className={styles.topic}>
                    <input type="checkbox" name="topics" value={t} checked={picked.includes(t)} onChange={() => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))} />
                    <Icon name="check" />
                    {t}
                  </label>
                ))}
              </div>
            </div>
          )}
        </fieldset>
      ))}

      <p className={styles.required}>
        <span aria-hidden="true">*</span> Required · business details only
      </p>

      {step === last && (
        <p id={`${id}-notice`} className={styles.notice} role="note">
          <Icon name="alert" />
          {FORM_NOTICE}
        </p>
      )}

      <div className={styles.wizNav}>
        {step > 0 ? (
          <button type="button" className={styles.back} onClick={() => go(step - 1)}>
            <Arrow back />
            Back
          </button>
        ) : (
          <span />
        )}
        {step < last ? (
          <button type="button" className={styles.next} onClick={() => go(step + 1)}>
            Next: {STEPS[step + 1].title}
            <Arrow />
          </button>
        ) : (
          <button type="submit" className={styles.next} disabled aria-describedby={`${id}-notice`}>
            {DEMO_FORM.submit}
            <Arrow />
          </button>
        )}
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ hero */

/**
 * Demo hero: the promise centred, then the three-step request form as a wide
 * card below it, lit from above, with a direct line to the team underneath.
 */
function DemoHero({ page, topics }: { page: SitePage; topics: string[] }) {
  const ref = useRef<HTMLElement>(null);
  useHeroIntro(ref);

  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
    tl.from(root.querySelector("[data-wizard]"), { opacity: 0, y: 80, rotateX: 12, duration: 1.7, clearProps: "opacity,transform" }, 0.7);
    return onSiteReady(() => tl.play());
  });

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="page-title">
      <div className={inner.heroBg} aria-hidden="true">
        <span className={inner.heroAurora} data-aurora>
          <Aurora green={0.5} />
        </span>
        <span className={inner.heroGrid} />
        <span className={styles.beam} />
      </div>

      <div className="container">
        <div className={styles.heroCopy}>
          <HeroCopy page={page} center actions={false} />
        </div>

        <div className={styles.formCol} data-wizard>
          <span className={styles.formGlow} aria-hidden="true" />
          <DemoWizard topics={topics} />
          <p className={styles.direct}>
            Prefer to talk first? <a href={`mailto:${CONTACT.email}`}>Email {CONTACT.name.split(" ")[0]}</a> or call <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>
          </p>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- after a request */

/** "What happens after a request": the four steps along a track a light runs down, each a lit node with its note. */
function AfterRequest({ s }: { s: Of<"steps"> }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.querySelector("[data-track]"), start: "top 80%", once: true }, defaults: { ease: "expo.out" } });
    tl.from(root.querySelector("[data-tline]"), { scaleX: 0, duration: 1.6, ease: "power2.inOut", clearProps: "transform" }).from(
      root.querySelectorAll("[data-tstep]"),
      { opacity: 0, y: 40, duration: 1.1, stagger: 0.14, clearProps: "opacity,transform" },
      0.3,
    );
  });

  return (
    <section ref={ref} id={s.id} className={`section ${styles.after}`}>
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} align="center" />
        <ol className={styles.track} data-track style={vars({ "--n": s.items.length })}>
          <span className={styles.tline} data-tline aria-hidden="true">
            <i />
          </span>
          {s.items.map((it, k) => (
            <li key={it.title} className={styles.tstep} data-tstep>
              <span className={styles.tdot} aria-hidden="true">
                <Icon name={STEP_ICONS[k] ?? "check"} />
              </span>
              <span className={styles.tnum} aria-hidden="true">
                {pad(k + 1)}
              </span>
              <h3 className={styles.ttitle}>{it.title}</h3>
              <p className={styles.tbody}>{it.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- agenda */

/** "What the conversation covers", as an agenda: three numbered items on a light sheet, joined by a margin line. */
function Agenda({ s }: { s: Of<"cards"> }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, ({ motion }) => {
    if (!motion) return;
    const root = ref.current!;
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.querySelector("[data-sheet]"), start: "top 78%", once: true }, defaults: { ease: "expo.out" } });
    tl.from(root.querySelector("[data-sheet]"), { opacity: 0, y: 60, duration: 1.3, clearProps: "opacity,transform" }).from(
      root.querySelectorAll("[data-item]"),
      { opacity: 0, x: 40, duration: 1, stagger: 0.14, clearProps: "opacity,transform" },
      0.3,
    );
  });

  return (
    <section ref={ref} id={s.id} className={`section ${styles.agenda}`}>
      <div className={`container ${styles.agendaLayout}`}>
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro} />
        <div className={styles.sheet} data-sheet>
          <header className={styles.sheetHead}>
            <span className={styles.sheetIcon} aria-hidden="true">
              <Icon name="calendar" />
            </span>
            <span>
              <b>Demo agenda</b>
              <small>Your workflow, the stages in question, owners and reporting</small>
            </span>
          </header>
          <ol className={styles.items}>
            {s.items.map((it, k) => (
              <li key={it.title} className={styles.item} data-item>
                <span className={styles.itemNum} aria-hidden="true">
                  {pad(k + 1)}
                </span>
                <span className={styles.itemIcon} aria-hidden="true">
                  {it.icon && <Icon name={it.icon} />}
                </span>
                <span className={styles.itemText}>
                  <b>{it.title}</b>
                  <span>{it.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** Request a Demo: the centred hero with the wide form, then the agenda and what happens after a request. */
export function DemoPage({ page }: { page: SitePage }) {
  const covers = page.sections.find((x): x is Of<"cards"> => x.kind === "cards");
  const topics = (covers?.items ?? []).map((it) => it.title);
  return (
    <>
      <DemoHero page={page} topics={topics} />
      {page.sections.map((s, k) => {
        if (s.kind === "cards") return <Agenda key={k} s={s} />;
        if (s.kind === "steps") return <AfterRequest key={k} s={s} />;
        return <SiteSection key={k} s={s} />;
      })}
    </>
  );
}
