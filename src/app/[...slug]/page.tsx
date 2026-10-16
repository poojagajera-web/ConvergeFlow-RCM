import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage, pageMetadata } from "@/components/content/ContentPage";
import { PAGES, getPage, routeFromSlug } from "@/content/pages";

/** Every priority page from the SEO package except /demo/, which has its own route. */
export function generateStaticParams() {
  return PAGES.filter((p) => p.route !== "/demo/").map((p) => ({ slug: p.segments }));
}

export async function generateMetadata({ params }: PageProps<"/[...slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(routeFromSlug(slug));
  return page ? pageMetadata(page) : {};
}

/*
 * Listed paths are fully prerendered. With Partial Prefetching on, params are
 * awaited inside <Suspense> so navigation stays instant; unlisted paths are
 * rendered on request and rejected with notFound().
 */
export default function SeoPage({ params }: PageProps<"/[...slug]">) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--navy-900)" }} />}>
      <ResolvedPage params={params} />
    </Suspense>
  );
}

async function ResolvedPage({ params }: Pick<PageProps<"/[...slug]">, "params">) {
  const { slug } = await params;
  const page = getPage(routeFromSlug(slug));
  if (!page || page.route === "/demo/") notFound();
  return <ContentPage page={page} />;
}
