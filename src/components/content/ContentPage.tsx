import type { Metadata } from "next";
import { MotionScope } from "@/components/motion/MotionScope";
import type { Page } from "@/content/pages";
import { ROBOTS, canonicalFor } from "@/lib/site";
import { designFor } from "@/content/pageDesign";
import { ContentBody } from "./ContentBodies";
import { FinalCta } from "./FinalCta";
import { JsonLd } from "./JsonLd";
import { PageFaq } from "./PageFaq";
import { PageHero } from "./PageHero";
import { RelatedPages } from "./RelatedPages";

export function pageMetadata(page: Page): Metadata {
  const canonical = canonicalFor(page.route);
  return {
    title: { absolute: page.seo.title },
    description: page.seo.description,
    robots: ROBOTS,
    alternates: canonical ? { canonical } : undefined,
    openGraph: { title: page.seo.title, description: page.seo.description, type: "website", ...(canonical ? { url: canonical } : {}) },
  };
}

/** One SEO-package page: hero, body, related links, FAQ, closing actions — laid out per pageDesign. */
export function ContentPage({ page }: { page: Page }) {
  const design = designFor(page);
  return (
    <>
      <JsonLd schema={page.schema} />
      <MotionScope>
        <PageHero page={page} design={design} />
        <ContentBody page={page} design={design} />
        {!page.form && design.related !== false && <RelatedPages page={page} dark={design.dark} />}
        {page.faq && <PageFaq faq={page.faq} variant={design.faq} dark={design.dark} />}
        {page.finalCta && <FinalCta cta={page.finalCta} variant={design.cta} dark={design.dark} />}
      </MotionScope>
    </>
  );
}
