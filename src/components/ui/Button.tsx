import type { ButtonHTMLAttributes, ReactNode } from "react";
import { SmartLink } from "@/components/ui/SmartLink";

type Variant = "primary" | "secondary";

function Arrow() {
  const path = <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />;
  return (
    <span className="btn-arrow" aria-hidden="true">
      <svg viewBox="0 0 20 20">{path}</svg>
      <svg viewBox="0 0 20 20">{path}</svg>
    </span>
  );
}

type Common = { variant?: Variant; bright?: boolean; arrow?: boolean; className?: string; children: ReactNode };

export function ButtonLink({ href, variant = "primary", bright, arrow = true, className = "", children }: Common & { href: string }) {
  return (
    <SmartLink href={href} className={`btn btn-${variant} ${bright ? "is-bright" : ""} ${className}`}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </SmartLink>
  );
}

export function Button({
  variant = "primary",
  bright,
  arrow = true,
  className = "",
  children,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`btn btn-${variant} ${bright ? "is-bright" : ""} ${className}`} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  );
}
