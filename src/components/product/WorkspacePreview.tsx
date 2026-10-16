"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { gsap } from "@/lib/gsap";
import styles from "./WorkspacePreview.module.css";

/**
 * Static, illustrative product workspace for the hero. Every record is
 * synthetic; nothing updates on its own, counts up or implies live results.
 */
type Tone = "ok" | "review" | "open" | "muted";

const VIEWS = [
  {
    key: "queue",
    tab: "Appointments",
    title: "Verification queue",
    cols: ["Appointment", "Carrier", "Status"],
    rows: [
      ["09:00 · Patient A", "Carrier 1", { label: "Reviewed", tone: "ok" }],
      ["09:30 · Patient B", "Carrier 2", { label: "Needs review", tone: "review" }],
      ["10:15 · Patient C", "Carrier 1", { label: "Open question", tone: "open" }],
      ["11:00 · Patient D", "Carrier 3", { label: "Not started", tone: "muted" }],
    ],
  },
  {
    key: "eligibility",
    tab: "Eligibility",
    title: "Upcoming appointments",
    cols: ["Appointment", "Flag", "Next step"],
    rows: [
      ["Tomorrow · Patient B", { label: "Coverage question", tone: "review" }, "Confirm with carrier"],
      ["Tomorrow · Patient E", { label: "Authorization question", tone: "open" }, "Assign reviewer"],
      ["Thu · Patient F", { label: "No flag", tone: "ok" }, "—"],
      ["Fri · Patient G", { label: "Coverage question", tone: "review" }, "Request details"],
    ],
  },
  {
    key: "claims",
    tab: "Claims",
    title: "Claims view",
    cols: ["Claim", "Stage", "Owner"],
    rows: [
      ["Claim 0001", { label: "Ready for review", tone: "ok" }, "Billing"],
      ["Claim 0002", { label: "Needs correction", tone: "review" }, "Billing"],
      ["Claim 0003", { label: "Follow-up", tone: "open" }, "Front desk"],
      ["Claim 0004", { label: "Submitted", tone: "muted" }, "Billing"],
    ],
  },
  {
    key: "receivables",
    tab: "Receivables",
    title: "AR aging view",
    aging: [
      { label: "0–30 days", w: 82 },
      { label: "31–60 days", w: 46 },
      { label: "61–90 days", w: 28 },
      { label: "90+ days", w: 16 },
    ],
  },
  {
    key: "audit",
    tab: "Reports",
    title: "Activity record",
    cols: ["Time", "Activity", "By"],
    rows: [
      ["09:12", "Status updated", "Reviewer 1"],
      ["09:20", "Filter applied", "Reviewer 2"],
      ["09:41", "Report prepared", "Manager"],
      ["10:05", "Note added", "Reviewer 1"],
    ],
  },
] as const;

type Cell = string | { label: string; tone: Tone };

function CellView({ cell }: { cell: Cell }) {
  if (typeof cell === "string") return <>{cell}</>;
  return (
    <span className={styles.chip} data-tone={cell.tone}>
      {cell.label}
    </span>
  );
}

/** Optionally controlled: pass `active` and `onChange` to drive the tab from outside. */
export function WorkspacePreview({ active: controlled, onChange }: { active?: number; onChange?: (i: number) => void } = {}) {
  const [own, setOwn] = useState(0);
  const active = controlled ?? own;
  const setActive = (i: number) => {
    setOwn(i);
    onChange?.(i);
  };
  const bodyRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!bodyRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = gsap.fromTo(bodyRef.current.querySelectorAll("[data-row]"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "expo.out" });
    return () => {
      t.kill();
    };
  }, [active]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (active + d + VIEWS.length) % VIEWS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const view = VIEWS[active];

  return (
    <figure className={styles.frame} aria-label="Illustrative ConvergeFlow workspace with synthetic data">
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <div className={styles.tabs} role="tablist" aria-label="Workspace views">
          {VIEWS.map((v, i) => (
            <button
              key={v.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`ws-tab-${v.key}`}
              aria-selected={i === active}
              aria-controls="ws-panel"
              tabIndex={i === active ? 0 : -1}
              className={styles.tab}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
            >
              {v.tab}
            </button>
          ))}
        </div>
      </div>

      <div ref={bodyRef} id="ws-panel" role="tabpanel" aria-labelledby={`ws-tab-${view.key}`} className={styles.body}>
        <p className={styles.viewTitle}>{view.title}</p>
        {"aging" in view ? (
          <ul className={styles.aging}>
            {view.aging.map((a) => (
              <li key={a.label} data-row>
                <span>{a.label}</span>
                <span className={styles.agingTrack} aria-hidden="true">
                  <span style={{ width: `${a.w}%` }} />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                {view.cols.map((c) => (
                  <th key={c} scope="col">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {view.rows.map((row, r) => (
                <tr key={r} data-row>
                  {row.map((cell, c) => (
                    <td key={c}>
                      <CellView cell={cell as Cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <figcaption className={styles.caption}>Illustrative view · synthetic data, not live results</figcaption>
    </figure>
  );
}
