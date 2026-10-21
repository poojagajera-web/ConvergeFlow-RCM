import type { ElementType } from "react";

/** Heading text with an optional italic-serif accent phrase. */
export function TitleText({ title, accent }: { title: string; accent?: string }) {
  return (
    <>
      {title}
      {accent && (
        <>
          {" "}
          <em className="serif-accent">{accent}</em>
        </>
      )}
    </>
  );
}

/** Section heading block: eyebrow, title (+accent) and intro. */
export function SectionHead({
  eyebrow,
  title,
  accent,
  intro,
  as: Tag = "h2",
  align = "left",
  className = "",
  titleClass = "",
  id,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  intro?: string;
  as?: ElementType;
  align?: "left" | "center" | "split";
  className?: string;
  titleClass?: string;
  id?: string;
}) {
  return (
    <header className={`site-head ${className}`} data-align={align}>
      <div className="site-head-main">
        {eyebrow && (
          <p className="eyebrow" data-anim="fade">
            {eyebrow}
          </p>
        )}
        <Tag id={id} className={`site-title ${titleClass}`} data-anim="words">
          <TitleText title={title} accent={accent} />
        </Tag>
      </div>
      {intro && (
        <p className="site-intro" data-anim="fade">
          {intro}
        </p>
      )}
    </header>
  );
}
