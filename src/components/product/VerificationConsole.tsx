"use client";

import { useEffect, useRef, useState } from "react";
import { CONSOLE_KPIS, STREAM_INITIAL, STREAM_POOL, type StreamRow } from "@/content/home";
import { gsap } from "@/lib/gsap";
import styles from "./VerificationConsole.module.css";

type Row = StreamRow & { id: number; age: number };

const INTERVAL = 3500;
/** Time a request spends travelling payer → engine → console before it resolves. */
export const DISPATCH_MS = 1300;
const ROWS = 4;

function ageLabel(age: number) {
  return age < 2 ? "Just now" : `${Math.round(age)}s ago`;
}

function fmt(value: number, decimals: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/**
 * Live eligibility stream: a new verification lands every 3.5s while the
 * console is on screen. Users can pause it (WCAG 2.2.2).
 */
export function VerificationConsole({ onDispatch }: { onDispatch?: (row: StreamRow) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [rows, setRows] = useState<Row[]>(() => STREAM_INITIAL.map((r, i) => ({ ...r, id: i, age: [0, 4, 11, 18][i] })));
  const [verified, setVerified] = useState(CONSOLE_KPIS[0].value);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState<StreamRow | null>(null);
  const dispatchRef = useRef(onDispatch);
  useEffect(() => {
    dispatchRef.current = onDispatch;
  }, [onDispatch]);
  const cursor = useRef(0);
  const nextId = useRef(ROWS);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible) return;
    let resolveTimer = 0;
    const timer = window.setInterval(() => {
      const incoming = STREAM_POOL[cursor.current % STREAM_POOL.length];
      cursor.current += 1;
      dispatchRef.current?.(incoming);
      setPending(incoming);
      resolveTimer = window.setTimeout(() => {
        setPending(null);
        if (incoming.status === "verified") setVerified((v) => v + 1);
        setRows((prev) => [
          { ...incoming, id: nextId.current++, age: 0 },
          ...prev.slice(0, ROWS - 1).map((r) => ({ ...r, age: r.age + INTERVAL / 1000 })),
        ]);
      }, DISPATCH_MS);
    }, INTERVAL);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(resolveTimer);
      setPending(null);
    };
  }, [paused, visible]);

  // Slide the newest row in; older rows ease down into place.
  useEffect(() => {
    const first = listRef.current?.firstElementChild;
    if (!first || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (rows[0]?.age !== 0 || rows[0].id < ROWS) return;
    const tween = gsap.fromTo(
      first,
      { autoAlpha: 0, y: -14, backgroundColor: "rgba(17,185,168,0.14)" },
      { autoAlpha: 1, y: 0, backgroundColor: "rgba(17,185,168,0)", duration: 1.1, ease: "expo.out", clearProps: "backgroundColor,transform" },
    );
    return () => {
      tween.kill();
    };
  }, [rows]);

  return (
    <div ref={rootRef} className={styles.console} role="region" aria-label="Live verification stream (product preview)">
      <div className={styles.head}>
        <div className={styles.title}>
          <span className={styles.live} data-paused={paused || undefined}>
            <span aria-hidden="true" />
            {paused ? "Paused" : "Live"}
          </span>
          <span>Verification stream</span>
        </div>
        <div className={styles.headMeta}>
          <span className="mono">EDI 270/271</span>
          <button type="button" className={styles.pause} onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
            {paused ? "Resume feed" : "Pause feed"}
          </button>
        </div>
      </div>

      <dl className={styles.kpis}>
        {CONSOLE_KPIS.map((k, i) => (
          <div key={k.label} className={styles.kpi} data-attention={k.attention || undefined}>
            <dt>{k.label}</dt>
            <dd className={`${styles.kpiValue} num`}>
              {fmt(i === 0 ? verified : k.value, k.decimals)}
              {k.suffix}
            </dd>
            <dd className={styles.kpiNote}>{k.note}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.tableHead} aria-hidden="true">
        <span>Patient • Payer</span>
        <span>Result</span>
        <span>Status</span>
      </div>
      <ol ref={listRef} className={styles.rows} aria-live="off">
        {pending && (
          <li key="pending" className={`${styles.row} ${styles.pendingRow}`}>
            <span className={styles.who}>
              <span className={styles.patient}>{pending.patient}</span>
              <span className={styles.payer}>{pending.payer}</span>
            </span>
            <span className={styles.detail}>
              <span className={styles.scan} aria-hidden="true" />
              Querying payer…
            </span>
            <span className={styles.statusCell}>
              <span className={styles.badge} data-status="pending">
                Verifying
              </span>
              <span className={`${styles.age} num`}>EDI 270 sent</span>
            </span>
          </li>
        )}
        {(pending ? rows.slice(0, ROWS - 1) : rows).map((r) => (
          <li key={r.id} className={styles.row}>
            <span className={styles.who}>
              <span className={styles.patient}>{r.patient}</span>
              <span className={styles.payer}>{r.payer}</span>
            </span>
            <span className={styles.detail}>{r.detail}</span>
            <span className={styles.statusCell}>
              <span className={styles.badge} data-status={r.status}>
                {r.status === "verified" ? "Verified" : "Exception"}
              </span>
              <span className={`${styles.age} num`}>{ageLabel(r.age)}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className={styles.foot}>
        <span>Writeback: PMS appointment ledger</span>
        <span>100% HIPAA EDI 271</span>
      </div>
    </div>
  );
}
