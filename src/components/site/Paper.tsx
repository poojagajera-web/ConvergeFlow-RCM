import Image from "next/image";
import type { DocSpec, Photo } from "@/content/site/types";
import styles from "./Paper.module.css";

const KIND_LABEL: Record<DocSpec["kind"], string> = {
  registration: "Registration",
  insurance: "Eligibility & benefits",
  auth: "Prior authorization",
  claim: "Claim preparation",
  transmission: "Claim submission",
  remittance: "Payment posting",
  denial: "Denial management",
  aging: "A/R follow-up",
};

const AMBER = new Set(["Tracked", "Owned"]);

/** Small kind-specific detail drawn at the top of a document. */
function Detail({ kind }: { kind: DocSpec["kind"] }) {
  if (kind === "claim")
    return (
      <div className={styles.teeth} aria-hidden="true">
        {[28, 29, 30, 31, 32].map((n) => (
          <span key={n} data-on={n === 30 || undefined}>
            <i />
            {n}
          </span>
        ))}
      </div>
    );
  if (kind === "remittance")
    return (
      <div className={styles.split} aria-hidden="true">
        <span style={{ flex: 4 }} data-tone="plan" />
        <span style={{ flex: 4 }} data-tone="patient" />
        <span style={{ flex: 2 }} data-tone="adj" />
      </div>
    );
  if (kind === "aging")
    return (
      <div className={styles.aging} aria-hidden="true">
        {[["0–30", 80], ["31–60", 58], ["61–90", 40], ["90+", 26]].map(([l, h], i) => (
          <span key={l as string} data-on={i === 2 || undefined}>
            <i style={{ height: `${h}%` }} />
            <b>{l}</b>
          </span>
        ))}
      </div>
    );
  if (kind === "insurance")
    return (
      <div className={styles.card} aria-hidden="true">
        <span className={styles.cardChip} />
        <span className={styles.cardLines}>
          <i />
          <i />
        </span>
        <span className={styles.cardMark}>PPO</span>
      </div>
    );
  return null;
}

/**
 * A stylised, illustrative paper document with a rubber stamp. The stamp lands
 * on scroll by default; "manual" leaves it to a parent timeline ([data-doc-stamp]).
 */
export function PaperDoc({
  doc,
  className = "",
  stampDelay = 0.6,
  caption = true,
  stampMode = "scroll",
}: {
  doc: DocSpec;
  className?: string;
  stampDelay?: number;
  caption?: boolean;
  stampMode?: "scroll" | "manual";
}) {
  return (
    <figure className={`${styles.doc} ${className}`} data-kind={doc.kind}>
      <div className={styles.sheet}>
        <div className={styles.top}>
          <span className={styles.kind}>{KIND_LABEL[doc.kind]}</span>
          <span className={styles.ref}>{doc.ref}</span>
        </div>
        <p className={styles.title}>{doc.title}</p>
        <Detail kind={doc.kind} />
        <dl className={styles.rows}>
          {doc.rows.map(([k, v]) => (
            <div key={k} className={styles.row}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {doc.note && <p className={styles.note}>{doc.note}</p>}
        <span
          className={styles.stamp}
          data-tone={AMBER.has(doc.stamp) ? "amber" : undefined}
          data-anim={stampMode === "scroll" ? "stamp" : undefined}
          data-doc-stamp={stampMode === "manual" || undefined}
          data-delay={stampDelay}
          aria-hidden="true"
        >
          {doc.stamp}
        </span>
      </div>
      {caption && <figcaption className={styles.caption}>Illustrative document · synthetic data</figcaption>}
    </figure>
  );
}

/** Photo in a glass frame with a teal wash and a caption chip. */
export function Polaroid({ photo, tilt = -3, className = "", priority = false, sizes = "(min-width: 1100px) 520px, 90vw" }: { photo: Photo; tilt?: number; className?: string; priority?: boolean; sizes?: string }) {
  return (
    <figure className={`${styles.polaroid} ${className}`} style={{ ["--tilt" as string]: `${tilt * 0.4}deg` }} data-glow>
      <span className={styles.photo}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} />
      </span>
      <span className={styles.sheen} aria-hidden="true" />
      {photo.caption && <figcaption className={styles.polaroidCaption}>{photo.caption}</figcaption>}
    </figure>
  );
}
