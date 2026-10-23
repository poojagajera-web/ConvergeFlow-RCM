/**
 * Marketing-site origin and indexing switches.
 *
 * The SEO package uses `https://marketing-domain.invalid` as a placeholder that
 * must never ship. Canonicals and JSON-LD are only rendered once
 * NEXT_PUBLIC_SITE_URL holds the confirmed origin, and every page stays
 * noindex until NEXT_PUBLIC_ALLOW_INDEXING is explicitly "true".
 */
const PLACEHOLDER = "https://marketing-domain.invalid";

const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") ?? "";
export const SITE_URL: string | null = raw && !raw.includes("marketing-domain.invalid") ? raw : null;

const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" && SITE_URL !== null;

export const ROBOTS = ALLOW_INDEXING ? { index: true, follow: true } : { index: false, follow: false };

/** Canonical URL for a route, or undefined while the origin is unconfirmed. */
export const canonicalFor = (route: string) => (SITE_URL ? `${SITE_URL}${route}` : undefined);

/** The package schema with the placeholder origin swapped for the confirmed one; null until confirmed. */
export function resolveSchema(schema: unknown): string | null {
  if (!SITE_URL || !schema) return null;
  return JSON.stringify(schema).replaceAll(PLACEHOLDER, SITE_URL).replace(/</g, "\\u003c");
}
