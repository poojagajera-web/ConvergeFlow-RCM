/**
 * Per-page presentation. Copy always comes from the SEO package; this only
 * decides how each page is laid out so page types don't all look the same.
 */
import type { Page } from "./pages";

export type HeroLayout = "split" | "center" | "editorial";
export type HeroVisualKind = "none" | "locator" | "stack" | "profile" | "orbit" | "steps" | "proposal" | "checklist" | "compose" | "library" | "form";
export type BodyLayout = "rows" | "zigzag" | "bento" | "layers" | "scrolly" | "article" | "process";
export type Design = {
  hero: HeroLayout;
  visual: HeroVisualKind;
  body: BodyLayout;
  /** Dark body (technology pages). */
  dark?: boolean;
  faq: "accordion" | "grid" | "lines";
  cta: "panel" | "fullbleed" | "split";
  /** How table blocks render. */
  table?: "table" | "pairs";
  /** Show the Related pages band (default true). */
  related?: boolean;
  /** How H3 subsections render. */
  subs?: "steps" | "horizontal" | "library";
};

const BY_ROUTE: Record<string, Design> = {
  "/services/": { hero: "center", visual: "none", body: "process", faq: "lines", cta: "fullbleed", related: false },
  "/about/": { hero: "editorial", visual: "orbit", body: "bento", faq: "accordion", cta: "split" },
  "/how-it-works/": { hero: "center", visual: "steps", body: "article", faq: "grid", cta: "fullbleed", subs: "horizontal" },
  "/pricing/": { hero: "split", visual: "proposal", body: "article", faq: "accordion", cta: "split", table: "pairs" },
  "/why-convergeflow/": { hero: "split", visual: "checklist", body: "scrolly", faq: "grid", cta: "panel", table: "pairs" },
  "/contact/": { hero: "split", visual: "compose", body: "bento", faq: "accordion", cta: "fullbleed" },
  "/resources/": { hero: "center", visual: "library", body: "article", faq: "grid", cta: "split", subs: "library" },
  "/demo/": { hero: "split", visual: "form", body: "rows", faq: "accordion", cta: "panel" },
  "/technology/": { hero: "center", visual: "stack", body: "layers", dark: true, faq: "accordion", cta: "fullbleed" },
  "/technology/security/": { hero: "center", visual: "stack", body: "layers", dark: true, faq: "accordion", cta: "panel" },
};

export function designFor(page: Page): Design {
  const exact = BY_ROUTE[page.route];
  if (exact) return exact;
  if (page.category === "industries") return { hero: "editorial", visual: "profile", body: "zigzag", faq: "accordion", cta: "split" };
  if (page.category === "services") return { hero: "split", visual: "locator", body: "process", faq: "lines", cta: "fullbleed", related: false };
  return { hero: "split", visual: "locator", body: "rows", faq: "accordion", cta: "panel" };
}
