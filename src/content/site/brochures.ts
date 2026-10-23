/**
 * The two ConvergeFlow brochures as previews: each page rendered from the PDF
 * in /public/resources (1600px wide JPGs in /assets/resources/v3, in the logo
 * palette), with the page's own heading, the topics the brochure covers and
 * the file details.
 */
export type Brochure = {
  /** The PDF this preview belongs to (matches the downloads section's href). */
  href: string;
  short: string;
  /** Page width / height. */
  aspect: number;
  sizeKb: number;
  topics: string[];
  pages: { src: string; title: string }[];
};

const pages = (key: string, titles: string[]) => titles.map((title, i) => ({ src: `/assets/resources/v3/${key}-p${i + 1}.jpg`, title }));

export const BROCHURES: Brochure[] = [
  {
    href: "/resources/convergeflow-rcm-brochure.pdf",
    short: "RCM",
    aspect: 1000 / 2318,
    sizeKb: 391,
    topics: ["Before care", "After care & submission", "Payment & resolution", "Getting started"],
    pages: pages("rcm", ["Your revenue cycle, fully managed", "Why ConvergeFlow", "Before care", "After care & submission", "Payment & resolution", "Getting started"]),
  },
  {
    href: "/resources/convergeflow-dental-billing-brochure.pdf",
    short: "Dental",
    aspect: 1000 / 1414,
    sizeKb: 410,
    topics: ["Benefits", "CDT coding", "Attachments", "Claim balances", "Specialty workflows", "Working together"],
    pages: pages("dental", [
      "Dental billing, fully managed",
      "Why ConvergeFlow",
      "Before treatment",
      "Clinical & claim preparation",
      "After submission & closure",
      "Working together",
    ]),
  },
];

export const brochureFor = (href: string) => BROCHURES.find((b) => b.href === href);
