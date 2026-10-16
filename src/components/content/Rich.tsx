import type { ReactNode } from "react";
import { SmartLink } from "@/components/ui/SmartLink";
import { liveHref } from "@/content/navigation";

/**
 * Renders the package's inline markdown: `[label](/route/)` and `**bold**`.
 * Links to routes that are not built yet render as plain text.
 */
export function Rich({ text, linkClass }: { text: string; linkClass?: string }) {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      const href = liveHref(m[2]);
      out.push(
        href ? (
          <SmartLink key={m.index} href={href} className={linkClass ?? "text-link"}>
            {m[1]}
          </SmartLink>
        ) : (
          m[1]
        ),
      );
    } else {
      out.push(<strong key={m.index}>{m[3]}</strong>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/** Plain text of an inline string (for metadata and aria labels). */
export const plain = (text: string) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
