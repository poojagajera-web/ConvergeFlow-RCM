/**
 * Site navigation, generated from the SEO package's Navigation Specification
 * (content/rcm-revision-2026-10-15). Only routes that exist in this build are
 * exposed as links; deferred destinations stay hidden rather than leading to
 * empty pages.
 */
import nav from "./generated/navigation.json";
import pages from "./generated/pages.json";

export type NavLink = { label: string; href: string };
export type NavGroup = {
  label: string;
  /** Overview route when it is built; otherwise the category is a menu only. */
  href?: string;
  children: NavLink[];
};

/** Existing product login — never rebuilt or redirected by the marketing site. */
export const LOGIN_URL = nav.utility.find((u) => u.label === "Login")?.url ?? "/";

export const BUILT_ROUTES = new Set<string>(["/", ...pages.map((p) => p.route)]);

const normalize = (href: string) => {
  const [path] = href.split("#");
  if (!path) return href;
  return path.endsWith("/") ? path : `${path}/`;
};

/** True for hashes, external URLs and internal routes this build serves. */
export function isLive(href: string) {
  if (href.startsWith("#") || /^https?:/.test(href) || href.startsWith("mailto:")) return true;
  return BUILT_ROUTES.has(normalize(href));
}

/** The href to render, or null when the destination is not published yet. */
export function liveHref(href: string): string | null {
  if (!isLive(href)) return null;
  return href;
}

/** Friendlier labels than the long-form spec where the menu needs them short. */
const SHORT: Record<string, string> = {
  "/services/claims-submission/": "Claims Submission",
  "/services/ar-management/": "AR Management and Reporting",
};

export const MAIN_NAV: NavGroup[] = nav.primary.map((item) => ({
  label: item.label,
  href: isLive(item.url) ? item.url : undefined,
  children: (item.children ?? []).filter((c) => isLive(c.url)).map((c) => ({ label: SHORT[c.url] ?? c.label, href: c.url })),
}));

export const DEMO_LINK: NavLink = { label: "Schedule a Demo", href: "/demo/" };

export const COMPANY_LINKS: NavLink[] = [
  { label: "About", href: "/about/" },
  { label: "Why ConvergeFlow", href: "/why-convergeflow/" },
  { label: "How It Works", href: "/how-it-works/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Resources", href: "/resources/" },
  { label: "Contact", href: "/contact/" },
].filter((l) => isLive(l.href));

export const groupByLabel = (label: string) => MAIN_NAV.find((g) => g.label === label);
