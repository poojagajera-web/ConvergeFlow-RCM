import type { Metadata } from "next";
import { MotionScope } from "@/components/motion/MotionScope";
import { JsonLd } from "@/components/content/JsonLd";
import { plain } from "@/components/content/Rich";
import type { Faq, SitePage as Page } from "@/content/site/types";
import { ROBOTS, SITE_URL, canonicalFor } from "@/lib/site";
import { Footer } from "@/components/layout/Footer";
import { SiteFaq } from "./SiteFaq";
import { SiteHero } from "./SiteHero";
import { SiteSections } from "./Sections";

export function metadataFor(seo: { title: string; description: string }, route: string): Metadata {
  const canonical = canonicalFor(route);
  return {
    title: { absolute: seo.title },
    description: seo.description,
    robots: ROBOTS,
    alternates: canonical ? { canonical } : undefined,
    openGraph: { title: seo.title, description: seo.description, type: "website", ...(canonical ? { url: canonical } : {}) },
  };
}

export const faqSchema = (items: Faq[]) => ({
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })),
});

/** Structured data built from the visible page content; null until the site origin is confirmed. */
function schemaFor(page: Page) {
  if (!SITE_URL) return null;
  const url = `${SITE_URL}${page.route}`;
  const graph: object[] = [
    { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "ConvergeFlow", url: `${SITE_URL}/` },
    { "@type": "WebPage", "@id": `${url}#webpage`, url, name: page.seo.title, description: page.seo.description },
  ];
  if (page.group === "services" && page.route !== "/services/")
    graph.push({ "@type": "Service", name: page.label, description: page.seo.description, provider: { "@id": `${SITE_URL}/#organization` }, url });
  if (page.faq.length) graph.push(faqSchema(page.faq));
  return { "@context": "https://schema.org", "@graph": graph };
}

/** One page: hero, content sections and FAQ, then the footer carrying the page's call to action. */
export function SitePage({ page }: { page: Page }) {
  return (
    <>
      <JsonLd schema={schemaFor(page)} />
      <MotionScope>
        <main id="main" tabIndex={-1}>
          <SiteHero hero={page.hero} />
          <SiteSections sections={page.sections} />
          <SiteFaq items={page.faq} />
        </main>
        <Footer cta={page.cta} />
      </MotionScope>
    </>
  );
}
