import styles from "./ProcessVisuals.module.css";

function Connect() {
  const systems = ["Dentrix Gateway", "Epic MyChart", "AthenaHealth", "Eaglesoft PMS"];
  return (
    <>
      <ul className={styles.tiles}>
        {systems.map((s) => (
          <li key={s} className={styles.tile} data-item>
            <span className={styles.tileName}>{s}</span>
            <span className={styles.ok} data-pop>Live socket</span>
          </li>
        ))}
      </ul>
      <p className={styles.note} data-item>256-bit TLS 1.3 handshake • 0.28s sync latency</p>
    </>
  );
}

function Rules() {
  const rows = [
    { payer: "Blue Cross Blue Shield", rule: "Fee schedule compiled", chip: "99.4% pass" },
    { payer: "Aetna Commercial", rule: "Pre-auth automation", chip: "Active" },
    { payer: "Delta Dental Premier", rule: "CDT matrix cleared", chip: "100% pass" },
    { payer: "UnitedHealthcare CMS", rule: "National CCI verified", chip: "0 flags" },
  ];
  return (
    <ul className={styles.list}>
      {rows.map((r) => (
        <li key={r.payer} className={styles.listRow} data-item>
          <span>
            <span className={styles.strong}>{r.payer}</span>
            <span className={styles.muted}>{r.rule}</span>
          </span>
          <span className={styles.ok} data-pop>{r.chip}</span>
        </li>
      ))}
    </ul>
  );
}

function Batch() {
  return (
    <div className={styles.stack}>
      <div className={styles.block} data-item>
        <div className={styles.blockHead}>
          <span>
            <span className={styles.strong}>Nightly batch engine</span>
            <span className={styles.muted}>Scheduled run • 04:00 AM EST</span>
          </span>
          <span className={styles.ok} data-pop>Completed</span>
        </div>
        <div className={styles.split}>
          <span className={styles.muted}>Next-day schedule verified</span>
          <span className={`${styles.big} num`} data-count>100%</span>
        </div>
        <div className={styles.meter} aria-hidden="true">
          <span data-meter />
        </div>
        <div className={styles.split}>
          <span className={styles.muted}>48 of 48 patients cleared</span>
          <span className={styles.muted}>0 manual logins</span>
        </div>
      </div>
      <div className={styles.pair}>
        <div className={styles.block} data-item>
          <span className={styles.muted}>Claims scrubbed</span>
          <span className={`${styles.big} num`} data-count>312 clean</span>
          <span className={styles.muted}>0 CCI edits</span>
        </div>
        <div className={styles.block} data-item>
          <span className={styles.muted}>Batch latency</span>
          <span className={`${styles.big} num`} data-count>0.38s / pt</span>
          <span className={styles.muted}>Direct PMS write</span>
        </div>
      </div>
      <p className={styles.note} data-item>Front desk calendar updated with exact copays & deductibles</p>
    </div>
  );
}

function FrontDesk() {
  return (
    <div className={styles.stack}>
      <div className={styles.block} data-item>
        <div className={styles.blockHead}>
          <span>
            <span className={styles.strong}>Elena Martinez</span>
            <span className={styles.muted}>09:30 AM • Chair 2</span>
          </span>
          <span className={styles.ok} data-pop>100% cleared</span>
        </div>
        <div className={styles.pair}>
          <div>
            <span className={styles.muted}>Copay required</span>
            <span className={`${styles.big} num`} data-count>$25.00</span>
          </div>
          <div>
            <span className={styles.muted}>Deductible remaining</span>
            <span className={`${styles.big} num`} data-count>$0.00 met</span>
          </div>
        </div>
      </div>
      <p className={styles.note} data-item>Primary: Delta Dental PPO • Zero portal lookup required.</p>
    </div>
  );
}

function Reconcile() {
  return (
    <div className={styles.stack}>
      <div className={styles.block} data-item>
        <div className={styles.blockHead}>
          <span className={styles.strong}>ERA 835 remittance #89301</span>
          <span className={styles.ok} data-pop>Auto-posted</span>
        </div>
        <div className={styles.split}>
          <span className={styles.muted}>Bank deposit matched</span>
          <span className={`${styles.big} num`} data-count>$14,820.50</span>
        </div>
      </div>
      <div className={styles.block} data-item>
        <div className={styles.split}>
          <span className={styles.muted}>Days in accounts receivable</span>
          <span className={`${styles.big} num`} data-count>22 days</span>
        </div>
        <span className={styles.delta}>−18 vs. average</span>
      </div>
    </div>
  );
}

export const PROCESS_VISUALS = [Connect, Rules, Batch, FrontDesk, Reconcile];

export function ProcessFrame({
  index,
  system,
  badge,
  logs,
}: {
  index: number;
  system: string;
  badge: string;
  logs: string[];
}) {
  const Visual = PROCESS_VISUALS[index];
  return (
    <div className={styles.frame}>
      <div className={styles.frameHead}>
        <span className={styles.system}>
          <span className={styles.pulse} aria-hidden="true" />
          {system}
        </span>
        <span className={styles.badge}>{badge}</span>
      </div>
      <div className={styles.frameBody}>
        <Visual />
      </div>
      <div className={styles.logs}>
        {logs.map((l) => (
          <p key={l} className="mono">
            <span aria-hidden="true">&gt;&gt; </span>
            <span data-log={l}>{l}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
