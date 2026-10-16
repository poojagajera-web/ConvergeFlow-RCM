import styles from "./ProcessVisuals.module.css";

/*
 * Illustrative frames for the five evaluation steps. Each shows the idea of
 * its step with synthetic labels — no data, counts, timings or outcomes.
 */

/* 01 — Map the practice systems: three sources around the workspace */
function SystemsMap() {
  const sources = [
    { name: "Practice management system", holds: "Appointments", icon: "M4 5h16v15H4z M4 9h16 M8 3v4 M16 3v4" },
    { name: "Insurance information", holds: "Coverage details", icon: "M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z" },
    { name: "Billing records", holds: "Claims and balances", icon: "M7 3h8l4 4v14H7z M15 3v4h4 M10 12h6 M10 16h6" },
  ];
  return (
    <div className={styles.map}>
      <ul className={styles.sources}>
        {sources.map((s) => (
          <li key={s.name} className={styles.source} data-item>
            <span className={styles.sourceIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d={s.icon} />
              </svg>
            </span>
            <span className={styles.sourceText}>
              <span className={styles.strong}>{s.name}</span>
              <span className={styles.muted}>{s.holds}</span>
            </span>
            <span className={styles.ask}>Where is it held?</span>
          </li>
        ))}
      </ul>
      <svg className={styles.wires} viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true">
        <path d="M50 0 C 50 40, 150 30, 150 70" />
        <path d="M150 0 L 150 70" />
        <path d="M250 0 C 250 40, 150 30, 150 70" />
      </svg>
      <div className={styles.hub} data-item>
        <span className={styles.hubDot} aria-hidden="true" />
        <span className={styles.strong}>ConvergeFlow workspace</span>
        <span className={styles.chipTodo}>Data flows to confirm</span>
      </div>
      <ul className={styles.qrow} data-item>
        <li>Which systems and versions?</li>
        <li>What is read or written?</li>
        <li>Who owns corrections?</li>
      </ul>
    </div>
  );
}

/* 02 — Define the payer workflow: a playbook per payer */
function PayerPlaybook() {
  const carriers = ["Carrier 1", "Carrier 2", "Carrier 3"];
  const lanes = [
    { title: "Coverage", owner: "Front desk", icon: "M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z M9 12l2 2 4-4", qs: ["Is the plan active for the visit?", "Which benefits need review?"] },
    { title: "Authorization", owner: "Clinical team", icon: "M7 3h8l4 4v14H7z M15 3v4h4 M10 13l2 2 4-4", qs: ["Is approval needed first?", "What supports the request?"] },
    { title: "Follow-up", owner: "Billing", icon: "M4 12a8 8 0 0 1 14-5.3 M20 12a8 8 0 0 1-14 5.3 M18 3v4h-4 M6 21v-4h4", qs: ["Who acts on an open item?", "How is the next step shared?"] },
  ];
  const fields = ["Member ID", "Plan name", "Procedure", "Visit date"];
  return (
    <div className={styles.playbook}>
      <div className={styles.carriers} data-item>
        {carriers.map((c, i) => (
          <span key={c} className={styles.carrier} data-on={i === 0 || undefined}>
            {c}
          </span>
        ))}
      </div>
      <ol className={styles.lanes}>
        {lanes.map((l, i) => (
          <li key={l.title} className={styles.lane} data-item>
            <span className={styles.laneTop}>
              <span className={styles.laneIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d={l.icon} />
                </svg>
              </span>
              <span className={styles.laneStep}>{String(i + 1).padStart(2, "0")}</span>
            </span>
            <span className={styles.strong}>{l.title}</span>
            <ul className={styles.laneQs}>
              {l.qs.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
            <span className={styles.owner}>{l.owner}</span>
          </li>
        ))}
      </ol>
      <div className={styles.required} data-item>
        <span className={styles.requiredLabel}>Required information</span>
        <span className={styles.requiredChips}>
          {fields.map((f) => (
            <span key={f} data-pop>
              {f}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

/* 03 — Review the available product views: a mini workspace */
function ProductViews() {
  const nav = ["Verification", "Eligibility", "Claims", "Receivables"];
  const rows = [
    { a: "09:00 · Patient A", chip: "Reviewed", tone: "ok" },
    { a: "10:15 · Patient C", chip: "Open question", tone: "open" },
    { a: "11:00 · Patient D", chip: "Needs review", tone: "review" },
  ];
  return (
    <div className={styles.app} data-item>
      <aside className={styles.appNav}>
        {nav.map((n, i) => (
          <span key={n} className={styles.appNavItem} data-on={i === 0 || undefined}>
            {n}
          </span>
        ))}
      </aside>
      <div className={styles.appMain}>
        <span className={styles.strong}>Verification queue</span>
        <ul className={styles.appRows}>
          {rows.map((r) => (
            <li key={r.a} className={styles.appRow} data-item>
              <span>{r.a}</span>
              <span className={styles.chip} data-tone={r.tone}>
                {r.chip}
              </span>
            </li>
          ))}
        </ul>
        <div className={styles.askPair}>
          <span className={styles.askCard} data-item>
            <span className={styles.muted}>Ask</span>
            What can be configured?
          </span>
          <span className={styles.askCard} data-item>
            <span className={styles.muted}>Ask</span>
            What needs confirmation?
          </span>
        </div>
      </div>
    </div>
  );
}

/* 04 — Agree how exceptions are handled: the hand-off path of one item */
function ExceptionPath() {
  const steps = [
    { who: "FD", role: "Front desk", what: "Item flagged", note: "Incomplete information", tone: "review" },
    { who: "BL", role: "Billing reviewer", what: "Reviewer assigned", note: "Owner recorded", tone: "open" },
    { who: "FD", role: "Front desk", what: "Next step communicated", note: "Follow-up agreed", tone: "ok" },
  ];
  return (
    <div className={styles.path}>
      <div className={styles.item} data-item>
        <span className={styles.muted}>Exception</span>
        <span className={styles.strong}>11:00 · Patient D</span>
        <span className={styles.chip} data-tone="review">
          Needs review
        </span>
      </div>
      <ol className={styles.handoffs}>
        {steps.map((s, i) => (
          <li key={s.what} className={styles.handoff} data-item>
            <span className={styles.avatar} data-pop aria-hidden="true">
              {s.who}
            </span>
            <span className={styles.handoffText}>
              <span className={styles.strong}>
                {i + 1}. {s.what}
              </span>
              <span className={styles.muted}>
                {s.role} · {s.note}
              </span>
            </span>
            <span className={styles.dot} data-tone={s.tone} aria-hidden="true" />
          </li>
        ))}
      </ol>
    </div>
  );
}

/* 05 — Set the measures for follow-up: one scope, two periods, same definitions */
function MeasurePlan() {
  const settings = [
    { label: "Scope", value: "Practice A · All locations", icon: "M4 21V8l8-5 8 5v13 M9 21v-6h6v6" },
    { label: "Definitions", value: "Shared by both periods", icon: "M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 1-4-4z M9 9h6 M9 13h6" },
    { label: "Review dates", value: "To agree", icon: "M4 5h16v15H4z M4 9h16 M8 3v4 M16 3v4" },
  ];
  const metrics = ["Review workload", "Claim follow-up", "Outstanding receivables"];
  return (
    <div className={styles.plan}>
      <ul className={styles.settings}>
        {settings.map((st) => (
          <li key={st.label} className={styles.setting} data-item>
            <span className={styles.settingIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d={st.icon} />
              </svg>
            </span>
            <span className={styles.settingText}>
              <span className={styles.muted}>{st.label}</span>
              <span className={styles.settingValue}>{st.value}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className={styles.table} role="table" aria-label="Measures compared across two periods" data-item>
        <div className={styles.tr} role="row" data-head>
          <span role="columnheader">Measure</span>
          <span role="columnheader">
            <i className={styles.key} data-tone="base" aria-hidden="true" />
            Baseline
          </span>
          <span role="columnheader">
            <i className={styles.key} data-tone="review" aria-hidden="true" />
            Follow-up review
          </span>
        </div>
        {metrics.map((m) => (
          <div key={m} className={styles.tr} role="row">
            <span role="cell" className={styles.metricName}>
              {m}
            </span>
            <span role="cell">
              <span className={styles.pending} data-tone="base" data-pop>
                <span className="visually-hidden">Not yet measured</span>
              </span>
            </span>
            <span role="cell">
              <span className={styles.pending} data-tone="review" data-pop>
                <span className="visually-hidden">Not yet measured</span>
              </span>
            </span>
          </div>
        ))}
      </div>

      <ol className={styles.milestones} data-item>
        {["Baseline set", "Implementation decision", "Follow-up review"].map((t, i) => (
          <li key={t}>
            <span className={styles.milestoneNode} aria-hidden="true">
              {i + 1}
            </span>
            <span className={styles.milestoneLabel}>{t}</span>
            <span className={styles.milestoneDate}>Date to agree</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export const PROCESS_VISUALS = [SystemsMap, PayerPlaybook, ProductViews, ExceptionPath, MeasurePlan];

export function ProcessFrame({ index, title }: { index: number; title: string }) {
  const Visual = PROCESS_VISUALS[index % PROCESS_VISUALS.length];
  return (
    <figure className={styles.frame}>
      <div className={styles.frameHead}>
        <span className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className={styles.frameTitle}>{title}</span>
        <span className={styles.badge}>Step {String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className={styles.frameBody}>
        <Visual />
      </div>
      <figcaption className={styles.caption}>Illustrative · questions to resolve during the evaluation</figcaption>
    </figure>
  );
}
