"use client";

import { useId, type FormEvent, type ReactNode } from "react";
import { DEMO, FORM_NOTICE, LOCATION_OPTIONS, PRACTICE_TYPES } from "@/content/home";
import { Button } from "@/components/ui/Button";
import styles from "./DemoForm.module.css";

type FieldSpec = { label: string; required: boolean };

type Props = {
  title?: string;
  intro?: ReactNode;
  fields?: FieldSpec[];
  submit?: string;
  privacy?: string;
};

/** How each approved field label is rendered. Unknown labels fall back to a text input. */
const CONTROLS: Record<string, { name: string; type?: string; autoComplete?: string; kind?: "select" | "textarea"; options?: string[]; full?: boolean }> = {
  "First name": { name: "firstName", autoComplete: "given-name" },
  "Last name": { name: "lastName", autoComplete: "family-name" },
  "Work email": { name: "email", type: "email", autoComplete: "email" },
  Phone: { name: "phone", type: "tel", autoComplete: "tel" },
  "Practice or organization": { name: "organization", autoComplete: "organization", full: true },
  "Practice type": { name: "practiceType", kind: "select", options: PRACTICE_TYPES },
  "Number of locations": { name: "locations", kind: "select", options: LOCATION_OPTIONS },
  "Primary PMS or EHR": { name: "pmsEhr", full: true },
  "Biggest revenue-cycle challenge": { name: "challenge", kind: "textarea", full: true },
};

/**
 * Demo request form. Request delivery is not configured, so the form never
 * submits and never shows a success state; the notice explains why. When an
 * approved endpoint exists, enable submit and confirm only on backend acceptance.
 */
export function DemoForm({ title, intro, fields = DEMO.fields ?? [], submit = DEMO.submit ?? "Schedule My Demo", privacy = DEMO.privacy }: Props) {
  const id = useId();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault();

  const control = (f: FieldSpec) => {
    const spec = CONTROLS[f.label] ?? { name: f.label.toLowerCase().replace(/\W+/g, "-") };
    const fid = `${id}-${spec.name}`;
    const common = { id: fid, name: spec.name, required: f.required, "aria-required": f.required || undefined };
    let input: ReactNode;
    if (spec.kind === "select") {
      input = (
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
      );
    } else if (spec.kind === "textarea") {
      input = <textarea {...common} rows={4} maxLength={600} />;
    } else {
      input = <input {...common} type={spec.type ?? "text"} autoComplete={spec.autoComplete} />;
    }
    return (
      <div key={spec.name} className={`${styles.field} ${spec.full ? styles.full : ""}`}>
        <label htmlFor={fid}>
          {f.label}
          {f.required ? <span aria-hidden="true"> *</span> : <span className={styles.optional}> (optional)</span>}
        </label>
        {input}
      </div>
    );
  };

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate aria-labelledby={title ? `${id}-title` : undefined} aria-label={title ? undefined : "Demo request"}>
      {(title || intro) && (
        <div className={styles.head}>
          {title && (
            <h2 id={`${id}-title`} className={styles.title}>
              {title}
            </h2>
          )}
          {intro && <div className={styles.sub}>{intro}</div>}
        </div>
      )}
      <div className={styles.grid}>{fields.map(control)}</div>
      <p className={styles.required}>
        <span aria-hidden="true">*</span> Required
      </p>
      <p id={`${id}-notice`} className={styles.notice} role="note">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="8" />
          <path d="M10 6v5 M10 14h.01" />
        </svg>
        {FORM_NOTICE}
      </p>
      <Button type="submit" className={styles.submit} disabled aria-describedby={`${id}-notice`}>
        {submit}
      </Button>
      {privacy && (
        <p className={styles.privacy}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <rect x="3" y="7" width="10" height="7" rx="1.5" />
            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
          </svg>
          {privacy}
        </p>
      )}
    </form>
  );
}
