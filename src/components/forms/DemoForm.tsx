"use client";

import { useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { DEMO } from "@/content/home";
import { Button } from "@/components/ui/Button";
import styles from "./DemoForm.module.css";

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  practiceName: string;
  pmsEhr: string;
  practiceType: string;
  locations: string;
};

const INITIAL: Fields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  practiceName: "",
  pmsEhr: "Dentrix",
  practiceType: "Dental Practice",
  locations: "1 Location",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Fields) {
  const errors: Partial<Record<keyof Fields, string>> = {};
  if (!f.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!f.lastName.trim()) errors.lastName = "Enter your last name.";
  if (!f.email.trim()) errors.email = "Enter your work email.";
  else if (!EMAIL.test(f.email.trim())) errors.email = "Enter a valid email, like name@practice.com.";
  return errors;
}

/**
 * Demo request form. Like the original site it confirms locally; there is no
 * submission endpoint yet (see README / handover notes).
 */
export function DemoForm() {
  const id = useId();
  const [fields, setFields] = useState<Fields>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const update = (key: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate(fields);
    setErrors(next);
    const firstInvalid = Object.keys(next)[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setSubmitted(true);
    requestAnimationFrame(() => successRef.current?.focus());
  };

  const field = (key: keyof Fields, label: string, opts: { type?: string; required?: boolean; placeholder?: string; autoComplete?: string }) => {
    const err = errors[key];
    return (
      <div className={styles.field} data-invalid={err ? true : undefined}>
        <label htmlFor={`${id}-${key}`}>
          {label}
          {opts.required && <span aria-hidden="true"> *</span>}
        </label>
        <input
          id={`${id}-${key}`}
          name={key}
          type={opts.type ?? "text"}
          value={fields[key]}
          onChange={update(key)}
          placeholder={opts.placeholder}
          autoComplete={opts.autoComplete}
          required={opts.required}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${id}-${key}-err` : undefined}
        />
        {err && (
          <p id={`${id}-${key}-err`} className={styles.error}>
            {err}
          </p>
        )}
      </div>
    );
  };

  const select = (key: keyof Fields, label: string, options: { value: string; label: string }[]) => (
    <div className={styles.field}>
      <label htmlFor={`${id}-${key}`}>{label}</label>
      <div className={styles.selectWrap}>
        <select id={`${id}-${key}`} name={key} value={fields[key]} onChange={update(key)}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div ref={successRef} className={styles.success} tabIndex={-1} role="status">
        <span className={styles.successMark} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 className={styles.title}>{DEMO.success.title}</h3>
        <p className={styles.sub}>{DEMO.success.body(fields.firstName.trim())}</p>
        <Button type="button" variant="secondary" arrow={false} onClick={() => setSubmitted(false)}>
          {DEMO.success.again}
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`}>
      <div className={styles.head}>
        <h3 id={`${id}-title`} className={styles.title}>
          {DEMO.form.title}
        </h3>
        <p className={styles.sub}>{DEMO.form.body}</p>
      </div>
      <div className={styles.grid}>
        {field("firstName", "First name", { required: true, placeholder: "Jennifer", autoComplete: "given-name" })}
        {field("lastName", "Last name", { required: true, placeholder: "Adams", autoComplete: "family-name" })}
        {field("email", "Work email", { type: "email", required: true, placeholder: "jadams@practice.com", autoComplete: "email" })}
        {field("phone", "Phone number", { type: "tel", placeholder: "(555) 234-5678", autoComplete: "tel" })}
        <div className={styles.full}>{field("practiceName", "Practice name", { placeholder: "Adams Dental Group", autoComplete: "organization" })}</div>
        {select("pmsEhr", "Primary EHR / PMS", DEMO.form.pms)}
        {select("practiceType", "Practice type", DEMO.form.practiceTypes)}
        <div className={styles.full}>{select("locations", "Number of locations", DEMO.form.locations)}</div>
      </div>
      <Button type="submit" className={styles.submit}>
        {DEMO.form.submit}
      </Button>
      <p className={styles.privacy}>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="3" y="7" width="10" height="7" rx="1.5" />
          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
        </svg>
        {DEMO.form.privacy}
      </p>
    </form>
  );
}
