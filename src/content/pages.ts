/**
 * Priority pages from the SEO revision package
 * (content/rcm-revision-2026-10-15 → src/content/generated/pages.json).
 * Copy is rendered as supplied; this module only types and indexes it.
 */
import data from "./generated/pages.json";

export type Inline = string;
export type Block =
  | { type: "p"; text: Inline }
  | { type: "list"; ordered?: boolean; items: Inline[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "sub"; title: string; blocks: Block[] };

export type PageButton = { label: string; href: string };
export type PageSection = { id: string; title: string; blocks: Block[] };
export type Category = "company" | "industries" | "resources" | "services" | "technology";

export type Page = {
  route: string;
  segments: string[];
  category: Category;
  label: string;
  seo: { title: string; description: string };
  breadcrumb: string[] | null;
  hero: { title: string; blocks: Block[]; buttons: PageButton[] };
  sections: PageSection[];
  faq: { title: string; intro: string[]; items: { q: string; a: string[] }[] } | null;
  form: { title: string; blocks: Block[]; fields: { label: string; required: boolean }[]; submit: string; id: string } | null;
  finalCta: { title: string; blocks: Block[]; buttons: PageButton[] } | null;
  schema: Record<string, unknown> | null;
};

export const PAGES = data as unknown as Page[];

export const CATEGORY_LABEL: Record<Category, string> = {
  company: "Company",
  industries: "Industries",
  resources: "Resources",
  services: "Services",
  technology: "Technology",
};

export function getPage(route: string): Page | undefined {
  return PAGES.find((p) => p.route === route);
}

export const routeFromSlug = (slug: string[]) => `/${slug.join("/")}/`;

type Crumb = { name: string; href: string };

/** Breadcrumb trail exactly as the page's BreadcrumbList schema names it. */
export function breadcrumbOf(page: Page): Crumb[] {
  const graph = (page.schema?.["@graph"] as Record<string, unknown>[] | undefined) ?? [];
  const list = graph.find((n) => n["@type"] === "BreadcrumbList") as { itemListElement?: { name: string; item: string }[] } | undefined;
  if (list?.itemListElement?.length) {
    return list.itemListElement.map((i) => ({ name: i.name, href: new URL(i.item).pathname }));
  }
  return [
    { name: "Home", href: "/" },
    { name: page.label, href: page.route },
  ];
}

/** Other built pages a reader of `page` is most likely to need next. */
export function relatedPages(page: Page, limit = 3): Page[] {
  const others = PAGES.filter((p) => p.route !== page.route && p.route !== "/demo/");
  const same = others.filter((p) => p.category === page.category);
  const parentRoute = page.segments.length > 1 ? `/${page.segments[0]}/` : null;
  const parent = parentRoute ? others.filter((p) => p.route === parentRoute) : [];
  const children = page.segments.length === 1 ? others.filter((p) => p.segments[0] === page.segments[0] && p.segments.length > 1) : [];
  const fallback = others.filter((p) => ["/how-it-works/", "/services/", "/technology/"].includes(p.route));
  const seen = new Set<string>();
  return [...children, ...same.filter((p) => p.segments.length > 1), ...parent, ...same, ...fallback]
    .filter((p) => (seen.has(p.route) ? false : (seen.add(p.route), true)))
    .slice(0, limit);
}
