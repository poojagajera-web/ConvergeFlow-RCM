import type { ReactNode } from "react";
import { SmartLink } from "@/components/ui/SmartLink";

type Variant = "primary" | "secondary";
type Size = "md" | "sm";

/**
 * Button content: a glowing disc with an arrow on the left, then the label.
 * On hover the disc shrinks to a dot and the label rolls down, a copy
 * dropping in from above (the copy is hidden from assistive tech).
 */
function Inner({ arrow, children }: { arrow: boolean; children: ReactNode }) {
  return (
    <>
      {arrow && (
        <>
          <span className="btn-glow" aria-hidden="true" />
          <span className="btn-icon" aria-hidden="true">
            <svg viewBox="0 0 20 20">
              <path d="M3.5 10h12.5m-4.5-4.5L16 10l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </>
      )}
      <span className="btn-label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </>
  );
}

type Common = { variant?: Variant; size?: Size; arrow?: boolean; className?: string; children: ReactNode };

const classes = (variant: Variant, size: Size, arrow: boolean, className: string) =>
  `btn btn-${variant}${size === "sm" ? " btn-sm" : ""}${arrow ? "" : " btn-plain"} ${className}`.trim();

export function ButtonLink({ href, variant = "primary", size = "md", arrow = true, className = "", onClick, children }: Common & { href: string; onClick?: () => void }) {
  return (
    <SmartLink href={href} className={classes(variant, size, arrow, className)} onClick={onClick}>
      <Inner arrow={arrow}>{children}</Inner>
    </SmartLink>
  );
}
