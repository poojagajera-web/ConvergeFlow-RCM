import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SitePage, metadataFor } from "@/components/site/SitePage";
import { SITE_PAGES, getSitePage, routeFromSlug } from "@/content/site";

/** Every built page except /demo/, which has its own route. */
export function generateStaticParams() {
  return SITE_PAGES.filter((p) => p.route !== "/demo/").map((p) => ({ slug: p.route.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: PageProps<"/[...slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getSitePage(routeFromSlug(slug));
  return page ? metadataFor(page.seo, page.route) : {};
}

/*
 * Listed paths are fully prerendered. With Partial Prefetching on, params are
 * awaited inside <Suspense> so navigation stays instant; unlisted paths are
 * rendered on request and rejected with notFound().
 */
export default function Page({ params }: PageProps<"/[...slug]">) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--navy-900)" }} />}>
      <ResolvedPage params={params} />
    </Suspense>
  );
}

async function ResolvedPage({ params }: Pick<PageProps<"/[...slug]">, "params">) {
  const { slug } = await params;
  const page = getSitePage(routeFromSlug(slug));
  if (!page || page.route === "/demo/") notFound();
  return <SitePage page={page} />;
}
