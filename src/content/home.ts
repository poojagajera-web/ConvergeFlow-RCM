/**
 * Homepage copy, read from the SEO team's revised homepage JSON
 * (content/rcm-revision-2026-10-15 → src/content/generated/homepage.json).
 * Sections follow the CEO order 00–11. Copy is used as supplied; nothing here
 * adds statistics, testimonials, badges or commercial promises.
 */
import home from "./generated/homepage.json";

type Action = { label: string; url: string };
type Card = { title: string; body: string; url?: string };

type Section = {
  id: string;
  eyebrow?: string;
  heading: string;
  intro: string;
  body?: string;
  cards?: Card[];
  pipeline?: Card[];
  steps?: Card[];
  bullets?: string[];
  badges?: string[];
  fields?: { label: string; required: boolean }[];
  submit?: string;
  privacy?: string;
  primary?: Action;
  secondary?: Action;
};

const sections = home.sections as Section[];
const section = (id: string): Section => {
  const s = sections.find((x) => x.id === id);
  if (!s) throw new Error(`Homepage section "${id}" missing from generated content`);
  return s;
};

export const HOME_META = { title: home.title, description: home.description };
export const HOME_SCHEMA = home.schema;

export const HERO = section("hero");
export const TRUST = section("trust");
export const RCM = section("what-is-rcm");
export const PIPELINE = section("services");
export const INDUSTRIES = section("industries");
export const STEPS = section("how-it-works");
export const TECHNOLOGY = section("technology");
export const RESULTS = section("results");
export const EVIDENCE = section("customer-evidence");
export const DEMO = section("demo");
export const FOOTER = section("footer");

/** Practice types offered in the demo request; mirrors the approved audience list. */
export const PRACTICE_TYPES = [...(INDUSTRIES.cards ?? []).map((c) => c.title), "Other"];

export const LOCATION_OPTIONS = ["1", "2–5", "6–15", "16 or more"];

/** Shown beside every demo form until delivery is configured and approved. */
export const FORM_NOTICE =
  "Online demo requests are not enabled yet. The form will open once request delivery and the privacy notice are confirmed.";
