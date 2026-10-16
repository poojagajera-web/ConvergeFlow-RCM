import { resolveSchema } from "@/lib/site";

/** Structured data from the package; renders nothing until the site origin is confirmed. */
export function JsonLd({ schema }: { schema: unknown }) {
  const json = resolveSchema(schema);
  if (!json) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
