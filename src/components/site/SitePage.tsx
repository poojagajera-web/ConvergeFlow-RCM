import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MotionScope } from "@/components/motion/MotionScope";
import { JsonLd } from "@/components/content/JsonLd";
import { plain } from "@/components/content/Rich";
import type { Faq, SitePage as Page } from "@/content/site/types";
import { ROBOTS, SITE_URL, canonicalFor } from "@/lib/site";
import { Footer } from "@/components/layout/Footer";
import { ServicesHub } from "@/components/services/ServicesHub";
import { StagePage } from "@/components/services/StagePage";
import { InnerPage } from "@/components/services/InnerPage";
import { ResourcesPage } from "@/components/services/ResourcesPage";
import { AboutPage } from "@/components/company/AboutPage";
import { ContactPage } from "@/components/company/ContactPage";
import { DemoPage } from "@/components/company/DemoPage";
import { PricingPage } from "@/components/company/PricingPage";
import { WhyPage } from "@/components/company/WhyPage";
import { navGroupFor } from "@/content/navigation";
import { SiteFaq } from "./SiteFaq";

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

/** The Company pages, each with its own design. */
const COMPANY_PAGES: Record<string, (props: { page: Page }) => React.JSX.Element> = {
  "/about/": AboutPage,
  "/why-convergeflow/": WhyPage,
  "/pricing/": PricingPage,
  "/contact/": ContactPage,
  "/demo/": DemoPage,
  "/resources/": ResourcesPage,
};

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

/**
 * One page in its own layout (the Services hub, the eight stage pages, the Who
 * We Help and How It Works pages, or a Company page), then the FAQ and the
 * footer carrying the page's call to action.
 */
export function SitePage({ page }: { page: Page }) {
  const Company = COMPANY_PAGES[page.route];
  // every built route has a layout above; a page without one isn't published
  if (page.route !== "/services/" && !page.stage && !navGroupFor(page.route) && !Company) notFound();
  return (
    <>
      <JsonLd schema={schemaFor(page)} />
      <MotionScope>
        <main id="main" tabIndex={-1}>
          {page.route === "/services/" ? (
            <ServicesHub page={page} />
          ) : page.stage ? (
            <StagePage page={page} />
          ) : navGroupFor(page.route) ? (
            <InnerPage page={page} />
          ) : (
            Company && <Company page={page} />
          )}
          <SiteFaq items={page.faq} />
        </main>
        <Footer cta={page.cta} />
      </MotionScope>
    </>
  );
}
