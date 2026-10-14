/**
 * Information architecture from ConvergeFlow_RCM_Sitemap.xlsx (Nav Structure).
 *
 * Each entry keeps its planned sitemap slug in `route`. Until that page ships
 * it is added to BUILT_ROUTES, links resolve to the matching section of the
 * home page (`anchor`), so no navigation item ever leads to a 404.
 */

export type NavLink = {
  label: string;
  /** Planned sitemap URL. */
  route: string;
  /** Home-page fallback while the route is not built yet. */
  anchor?: string;
  note?: string;
};

/** Routes that exist in the app today. Add a slug here when its page ships. */
export const BUILT_ROUTES = new Set<string>(["/", "/demo"]);

export function resolveHref(link: NavLink): string | null {
  if (BUILT_ROUTES.has(link.route)) return link.route;
  if (link.anchor) return `/#${link.anchor}`;
  return null;
}

export const SERVICE_LINKS: NavLink[] = [
  { label: "Eligibility Verification", route: "/services/eligibility-verification", anchor: "eligibility-verification", note: "Real-time EDI 270/271 with audit evidence" },
  { label: "Prior Authorization", route: "/services/prior-authorization", anchor: "prior-authorization", note: "Packet assembly, 278 dispatch, status polling" },
  { label: "Charge Capture & Coding", route: "/services/charge-capture-coding", anchor: "charge-capture-coding", note: "CDT / CPT / ICD-10 crosswalks" },
  { label: "Claims Submission", route: "/services/claims-submission", anchor: "claims-submission", note: "Scrubbed 837 batches, clearinghouse ACKs" },
  { label: "Denial Management", route: "/services/denial-management", anchor: "denial-management", note: "Root-cause mapping and appeal briefs" },
  { label: "Payment Posting", route: "/services/payment-posting", anchor: "payment-posting", note: "ERA 835 auto-posting to the penny" },
  { label: "AR Management", route: "/services/ar-management", anchor: "ar-management", note: "Aged-balance recovery and forecasting" },
];

export const SERVICES_OVERVIEW: NavLink = { label: "All eight service pillars", route: "/services", anchor: "pipeline" };

export const INDUSTRY_LINKS: NavLink[] = [
  { label: "Dental Practices", route: "/industries/dental", anchor: "industry-dental", note: "Primary market" },
  { label: "DSO / Group Practices", route: "/industries/dso-groups", anchor: "industry-dso", note: "Multi-location" },
  { label: "Medical Clinics", route: "/industries/medical-clinics", anchor: "industry-medical", note: "Primary & urgent care" },
  { label: "Specialty Practices", route: "/industries/specialty", anchor: "industry-specialty", note: "High prior-auth volume" },
  { label: "Hospitals & Health Systems", route: "/industries/hospitals", anchor: "industry-hospitals", note: "Enterprise scale" },
  { label: "Behavioral Health", route: "/industries/behavioral-health", anchor: "industry-behavioral", note: "Session limits & carve-outs" },
  { label: "RCM Billing Companies", route: "/industries/billing-companies", anchor: "billing-companies", note: "White-label engine" },
];

export const INDUSTRIES_OVERVIEW: NavLink = { label: "Every practice vertical", route: "/industries", anchor: "industries" };

export const RESOURCE_LINKS: NavLink[] = [
  { label: "Client stories", route: "/resources/case-studies", anchor: "testimonials", note: "Results from live practices" },
  { label: "Implementation process", route: "/resources/guides", anchor: "how-it-works", note: "From PMS connect to go-live" },
  { label: "FAQ", route: "/resources/faq", anchor: "faq", note: "Security, setup time, ROI" },
];

export const PRIMARY_NAV = {
  technology: { label: "Technology", route: "/technology", anchor: "technology" } satisfies NavLink,
  outcomes: { label: "Outcomes", route: "/roi-calculator", anchor: "results" } satisfies NavLink,
  demo: { label: "Schedule a Demo", route: "/demo", anchor: "demo" } satisfies NavLink,
};

export const COMPANY_LINKS: NavLink[] = [
  { label: "Why ConvergeFlow", route: "/about/why-convergeflow", anchor: "revenue-cycle" },
  { label: "QuantumDataLytica platform", route: "/technology/qdl-platform", anchor: "technology" },
  { label: "Security & HIPAA", route: "/technology/security", anchor: "security" },
  { label: "Measurable outcomes", route: "/roi-calculator", anchor: "results" },
  { label: "Contact & demo", route: "/demo", anchor: "demo" },
];
