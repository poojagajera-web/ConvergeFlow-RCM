/**
 * Homepage (V2 order): offer → the claim story → who does what → the journey
 * → dental detail → working together → accountability & evidence → questions
 * → request. Sources: RCM brochure, Dental billing brochure, V2 design notes.
 */
import type { Cta, DocSpec, Faq, Item, Photo } from "./types";

export const HOME_META = {
  title: "Managed Revenue Cycle Management for Dental & Medical Practices | ConvergeFlow",
  description:
    "ConvergeFlow's specialists manage the revenue cycle for dental and medical practices: benefits verified before care, claims prepared and followed to a decision, payments posted and balances closed.",
};

export const HOME_HERO = {
  eyebrow: "Managed revenue cycle services",
  title: "Your revenue cycle,",
  accent: "fully managed.",
  lead: "From verified coverage before the visit to a reconciled account after it. ConvergeFlow's specialists handle verification, coding, claims, payments and follow-up for dental and medical practices.",
  actions: [
    { label: "Request a Demo", href: "/demo/" },
    { label: "Explore services", href: "/services/" },
  ],
  facts: ["For dental and medical practices", "Starting with OpenDental", "Evidence for every check"],
};

export type StoryChapter = { key: string; label: string; title: string; accent: string; body: string; points: string[]; href: string; doc: DocSpec };

/** The claim file's three chapters, ending in a closed account. */
export const HOME_STORY: { eyebrow: string; title: string; accent: string; chapters: StoryChapter[]; closing: { title: string; sub: string } } = {
  eyebrow: "From the chair to a closed account",
  title: "One claim file,",
  accent: "followed all the way.",
  chapters: [
    {
      key: "before",
      label: "01 · Before care",
      title: "Clean claims start",
      accent: "before the patient arrives.",
      body: "Registration, benefits and authorization checked across payer portals, then returned to your practice system with evidence.",
      points: ["Registration & demographics", "Eligibility & benefits", "Prior authorization"],
      href: "/services/eligibility-verification/",
      doc: {
        kind: "insurance",
        title: "Benefits verification",
        ref: "Carrier 1 · PPO",
        rows: [
          ["Coverage", "Active"],
          ["Deductible", "Met"],
          ["Frequency", "2 per year"],
          ["Payer order", "Primary"],
        ],
        stamp: "Verified",
      },
    },
    {
      key: "claims",
      label: "02 · Claims",
      title: "Every service captured.",
      accent: "Every claim scrubbed.",
      body: "Documentation and coding reviewed, charges captured and claims scrubbed before they are sent, with proof of every transmission.",
      points: ["Dental coding & preparation", "Claim scrubbing", "Electronic submission"],
      href: "/services/claims-submission/",
      doc: {
        kind: "claim",
        title: "Claim · 837D",
        ref: "Tooth 30 · M O",
        rows: [
          ["Procedure", "Restoration"],
          ["Chart", "Matches"],
          ["Attachment", "Linked"],
          ["Scrub", "Passed"],
        ],
        stamp: "Submitted",
      },
    },
    {
      key: "payments",
      label: "03 · Payments & follow-up",
      title: "Paid accurately.",
      accent: "Closed cleanly.",
      body: "Remittances matched to deposits, denials worked to the root cause and balances followed to a documented resolution.",
      points: ["Payment posting", "Denial management", "AR & reporting"],
      href: "/services/payment-posting/",
      doc: {
        kind: "remittance",
        title: "Remittance",
        ref: "Illustrative",
        rows: [
          ["Plan pays", "$400"],
          ["Patient share", "$400"],
          ["Adjustment", "$200"],
          ["Deposit", "Matched"],
        ],
        stamp: "Paid",
      },
    },
  ],
  closing: { title: "Account closed.", sub: "The cycle ends only when the account has a documented financial resolution." },
};

export const HOME_WHO = {
  eyebrow: "Who does what",
  title: "Your practice keeps the care.",
  accent: "We own the agreed work.",
  intro: "Before we start, we agree the scope, the owners and how we report. Every handoff gets an owner and a documented status.",
  practice: {
    title: "Your practice",
    note: "the chart is yours",
    items: ["Clinical records and signed documentation", "Provider details and payer contracts", "Treatment and clinical decisions", "Timely answers when we ask"],
  },
  team: {
    title: "ConvergeFlow team",
    note: "we take it from here",
    items: ["Verification, benefits and authorizations", "Coding review, claims and submission", "Posting, denials and A/R follow-up", "Evidence, status and agreed reporting"],
  },
};

/** The eight stages as tabbed folders (one per lifecycle group). */
export const HOME_JOURNEY: { eyebrow: string; title: string; accent: string; intro: string; folders: { photo: Photo; note: string }[] } = {
  eyebrow: "The managed journey",
  title: "Eight stages,",
  accent: "one accountable team.",
  intro: "Choose the stages in your agreed scope. Each one has a named owner, a documented status and evidence you can check.",
  folders: [
    {
      photo: { src: "/assets/photos/v2/d-registration.jpg", alt: "Patient handing her insurance card to a front-desk coordinator", caption: "before the visit" },
      note: "Active coverage is only the starting point.",
    },
    {
      photo: { src: "/assets/photos/v2/d-claims-submission.jpg", alt: "Billing specialist sending a claim from her laptop", caption: "matched to the chart" },
      note: "Reimbursement preferences never determine the code.",
    },
    {
      photo: { src: "/assets/photos/v2/d-payment-posting.jpg", alt: "Finance coordinator checking an itemised statement", caption: "posted & reconciled" },
      note: "A contractual adjustment is never billed to the patient.",
    },
  ],
};

export const HOME_DENTAL = {
  eyebrow: "Dental work, explained concretely",
  title: "Dental claims fail",
  accent: "for dental reasons.",
  body: "A missing tooth number, an expired frequency limit, a radiograph that never got attached. Our team works the whole cycle so those gaps get caught before the payer finds them.",
  chips: ["Deductibles", "Annual maximum", "Coverage %", "Frequencies", "Waiting periods", "Payer order"],
  audiences: [
    { label: "Dental practices", href: "/industries/dental/", body: "Dental billing, fully managed." },
    { label: "DSOs & groups", href: "/industries/dso/", body: "Responsibilities agreed location by location." },
    { label: "Medical practices", href: "/industries/medical/", body: "Coverage to a reconciled account." },
  ],
};

export const HOME_TOGETHER: { eyebrow: string; title: string; accent: string; intro: string; steps: Item[]; ongoing: string } = {
  eyebrow: "Working together",
  title: "An operating model",
  accent: "you can see.",
  intro: "Onboarding comes first; then the day-to-day work runs on an agreed rhythm. No fixed rollout duration is promised; it depends on your scope and payers.",
  steps: [
    { icon: "clipboard", title: "Practice inputs", body: "Complete clinical records, provider details, payer contracts and timely clarification." },
    { icon: "lock", title: "Access setup", body: "Approved system access starting with OpenDental, payer connectivity and secure credential handling." },
    { icon: "route", title: "Agreed workflow", body: "Coding review, claim preparation, submission monitoring, posting and follow-up, with owners named." },
    { icon: "flag", title: "Launch review", body: "Work queues, escalation contacts, reporting cadence and acceptance criteria confirmed." },
  ],
  ongoing: "Then verifications run on schedule ahead of every visit, and the work continues with daily queues and weekly reviews.",
};

export const HOME_PROOF = {
  statement: { text: "We don't just report the problem.", accent: "We fix it." },
  evidence: {
    eyebrow: "Accountability & evidence",
    title: "Evidence for",
    accent: "every check.",
    body: "Portal captures, reference numbers and timestamps, stored securely, so you can see what was done and when.",
    items: [
      { icon: "eye", title: "Portal capture", body: "What the payer showed at the time." },
      { icon: "stamp", title: "Payer reference", body: "Recorded against the patient and visit." },
      { icon: "clock", title: "Timestamp", body: "When each check or submission ran." },
      { icon: "user", title: "Named owner", body: "Who is accountable for the next step." },
    ] as Item[],
  },
  cadence: [
    { icon: "clock", title: "Daily", body: "Incomplete records, claims on hold, rejections and unposted receipts." },
    { icon: "calendar", title: "Weekly", body: "Denial causes, aging balances, underpayments and attachment delays." },
    { icon: "chart", title: "Defined measures", body: "Days in A/R, denial rate, net collection rate and verification success by payer, defined with you." },
  ] as Item[],
  note: "Targets are set from your baseline and agreed scope. No reimbursement outcome is guaranteed.",
};

export const HOME_FAQ: Faq[] = [
  { q: "Is ConvergeFlow software or a service?", a: "A fully managed service. Our specialists own the agreed work, not just a dashboard, with workflow technology supporting them." },
  { q: "Which stages can you take on?", a: "Any of the eight, from registration to A/R and reporting. Scope is agreed with your practice before we start, and recorded so ownership is clear." },
  { q: "Which systems do you work with?", a: "We start with OpenDental, so results land where your staff already look. Other practice systems are confirmed during scoping." },
  { q: "What does our practice stay responsible for?", a: "Clinical records and decisions, provider details, payer contracts, approved access and timely answers to clarification questions." },
  { q: "How do we get a proposal?", a: "Request a demo. We'll discuss your workflow and scope, then prepare a proposal based on the stages our team would own." },
  { q: "Do you guarantee payment?", a: "No. Automation supports staff review, and final payment always depends on payer adjudication. Targets are set from your baseline and agreed scope." },
];

export const HOME_CTA: Cta = {
  title: "Bring your practice workflow",
  accent: "to the team.",
  body: "Tell us where claims stall today. We'll show you the stages our specialists would own, and how you'll see every handoff.",
  actions: [
    { label: "Request a Demo", href: "/demo/" },
    { label: "Contact the team", href: "/contact/" },
  ],
};

/* ------------------------------------------------------------------ */
/* V4 homepage additions (dark "glow" design). Sources: RCM brochure, */
/* Dental billing brochure. No figures beyond the brochure's own.     */
/* ------------------------------------------------------------------ */

/** Revenue-cycle shorthand floating around the hero (decorative). */
export const HOME_TOKENS = [
  { text: "837D", x: 8, y: 22, depth: 0.9, rotate: -6, boxed: true },
  { text: "ERA → EFT", x: 4, y: 52, depth: 0.55 },
  { text: "CDT", x: 14, y: 72, depth: 1, rotate: 8, boxed: true },
  { text: "#30 · M O", x: 82, y: 20, depth: 0.7 },
  { text: "COB", x: 88, y: 46, depth: 1, rotate: -8, boxed: true },
  { text: "EOB", x: 80, y: 70, depth: 0.6 },
  { text: "A/R 61–90", x: 22, y: 40, depth: 0.35 },
  { text: "NPI", x: 72, y: 34, depth: 0.35 },
  { text: "PPO", x: 66, y: 80, depth: 0.45 },
  { text: "ADA 1–32", x: 30, y: 84, depth: 0.4 },
];

export const HOME_HERO_POINTS = ["Benefits verified before care", "Claims followed to a decision", "Balances resolved with an owner"];

/** Illustrative status chips for the ticker rows (no figures). */
export const HOME_TICKER: { label: string; status: string; tone: "ok" | "work" }[][] = [
  [
    { label: "Benefits", status: "Verified", tone: "ok" },
    { label: "Claim 837D", status: "Accepted", tone: "ok" },
    { label: "Prior auth", status: "Tracked", tone: "work" },
    { label: "ERA", status: "Posted", tone: "ok" },
    { label: "Attachment", status: "Linked", tone: "ok" },
    { label: "Denial", status: "Appealed", tone: "work" },
    { label: "COB", status: "Confirmed", tone: "ok" },
    { label: "Balance", status: "Resolved", tone: "ok" },
  ],
  [
    { label: "Registration", status: "Duplicate caught", tone: "work" },
    { label: "Coverage", status: "Active", tone: "ok" },
    { label: "Frequency", status: "Checked", tone: "ok" },
    { label: "Scrub", status: "Passed", tone: "ok" },
    { label: "Rejection", status: "Fixed at source", tone: "work" },
    { label: "Deposit", status: "Matched", tone: "ok" },
    { label: "Underpayment", status: "Reviewed", tone: "work" },
    { label: "Credit", status: "Reconciled", tone: "ok" },
  ],
];

export const HOME_INTRO = {
  marquee: "Verification · Coding · Claims · Payments · Follow-up · ",
  big: "Your practice keeps the care.",
  bigAccent: "We own the agreed work.",
  chip: "What is ConvergeFlow?",
  title: "Fully managed revenue cycle for dental and medical practices.",
  body: [
    "ConvergeFlow handles verification, coding, claims, payments and follow-up, so your team can focus on patients.",
    "Before we start, we agree on scope, owners and how we'll report, so you always know where every claim stands.",
  ],
};

export const HOME_FACTS: { title: string; accent: string; intro: string; cells: { value: string; label: string; detail: string; viz: "ring" | "core" | "clock" | "week" }[] } = {
  title: "From the chair",
  accent: "to a closed account.",
  intro: "The cycle ends only when the account has a documented financial resolution.",
  cells: [
    { value: "8", label: "Managed stages", detail: "From registration to A/R and reporting.", viz: "ring" },
    { value: "1", label: "Accountable team", detail: "Owning every stage in your agreed scope.", viz: "core" },
    { value: "Daily", label: "Queue reviews", detail: "Incomplete records, holds, rejections, unposted receipts.", viz: "clock" },
    { value: "Weekly", label: "Trend reviews", detail: "Denial causes, aging, underpayments, attachment delays.", viz: "week" },
  ],
};

export const HOME_HELIX = {
  eyebrow: "Fully managed service",
  title: "Our specialists own the work,",
  accent: "not just a dashboard.",
  body: "One accountable team works the whole cycle, and results land where your staff already look, starting with OpenDental.",
  word: "Fully managed",
  roles: [
    { icon: "shield", title: "Verification specialists", body: "Benefits checks, portal changes, MFA and exceptions resolved." },
    { icon: "tooth", title: "Coding and claim specialists", body: "Documentation reviewed, codes matched to the record, claims scrubbed and sent." },
    { icon: "coins", title: "Payment and A/R specialists", body: "Posting, denials and balances followed to resolution." },
  ] as { icon: "shield" | "tooth" | "coins"; title: string; body: string }[],
};

/** "How it works": the four onboarding steps, each with an illustrative card. */
export const HOME_STEPS = {
  title: "How does it",
  accent: "work?",
  intro: "Your path to a managed revenue cycle.",
  steps: [
    {
      title: "Practice inputs",
      body: "Complete clinical records, provider details, payer contracts and timely clarification. We agree the scope and owners before anything moves.",
      card: { kicker: "Inputs", rows: ["Clinical records", "Provider details", "Payer contracts", "Escalation contacts"] },
    },
    {
      title: "Access setup",
      body: "Approved system access, payer connectivity, secure exchange and privacy arrangements, starting with OpenDental.",
      card: { kicker: "Access", rows: ["Practice system · approved", "Payer portals · approved", "Secure exchange · set", "Credentials · secured"] },
    },
    {
      title: "Agreed workflow",
      body: "Coding review, claim preparation, submission monitoring, posting and follow-up, each with a named owner.",
      card: { kicker: "Workflow", rows: ["Coding review", "Claim preparation", "Submission monitoring", "Posting & follow-up"] },
    },
    {
      title: "Launch review",
      body: "Work queues, escalation contacts, reporting cadence and acceptance criteria confirmed. Then the daily work begins.",
      card: { kicker: "Launch", rows: ["Work queues", "Reporting cadence", "Acceptance criteria", "Daily & weekly reviews"] },
    },
  ],
};

/** Big split words around a glowing claim card. */
export const HOME_STATUS = {
  left: "Verified",
  right: "Paid",
  caption: "Every claim followed to a decision, with the payer reference, dates and submission proof retained.",
  states: [
    { kicker: "Benefits verification", title: "Coverage active", meta: [["Deductible", "Met"], ["Payer order", "Primary"]], ring: "Verified" },
    { kicker: "Claim submission", title: "837D accepted", meta: [["Scrub", "Passed"], ["Attachment", "Linked"]], ring: "Accepted" },
    { kicker: "Payment posting", title: "ERA posted", meta: [["Deposit", "Matched"], ["Adjustment", "Traceable"]], ring: "Paid" },
  ] as { kicker: string; title: string; meta: [string, string][]; ring: string }[],
};

/** The six "Why ConvergeFlow" reasons from the dental billing brochure. */
export const HOME_WHY: { title: string; accent: string; intro: string; items: { art: "orbit" | "window" | "tooth" | "chain" | "stack" | "bars"; title: string; body: string }[] } = {
  title: "Why practices choose",
  accent: "ConvergeFlow",
  intro: "Dental claims fail for dental reasons. Our team works the whole cycle so those gaps get caught before the payer finds them.",
  items: [
    { art: "orbit", title: "Fully managed service", body: "Our specialists own the work, not just a dashboard." },
    { art: "window", title: "Built into your PMS", body: "Starting with OpenDental, results land where staff already look." },
    { art: "tooth", title: "Dental-specific expertise", body: "CDT codes, tooth and surface detail, narratives and attachments." },
    { art: "chain", title: "Clear accountability", body: "Every handoff has a named owner and a documented status." },
    { art: "stack", title: "Evidence for every step", body: "Payer references, dates and submission proof retained." },
    { art: "bars", title: "Reporting you can act on", body: "Daily queues and weekly trends, on measures we agree together." },
  ],
};

/** The dental cycle's four stages, as rising points on a grid floor. */
export const HOME_TIMELINE = {
  title: "Dental claims fail",
  accent: "for dental reasons.",
  body: "A missing tooth number, an expired frequency limit, a radiograph that never got attached. Our team works the whole cycle so those gaps get caught before the payer finds them.",
  stages: [
    { label: "Before treatment", body: "Registration, benefits verification, treatment planning and estimates." },
    { label: "Clinical & claim prep", body: "Documented care, validated CDT codes and claim attachments." },
    { label: "After submission", body: "Payer acceptance, payment posting, denials and secondary claims." },
    { label: "Account closure", body: "Verified patient balances, reconciled credits and reporting." },
  ],
};

/** Illustrative reporting view (no figures). */
export const HOME_DASH = {
  chip: "Client reporting",
  title: "Every handoff,",
  accent: "visible.",
  body: "Daily queues and weekly trends on measures we agree together, with evidence for every check and a named owner for every next step.",
  daily: ["Incomplete records", "Claims on hold", "Rejections", "Unposted receipts"],
  weekly: ["Denial causes", "Aging balances", "Underpayments", "Attachment delays"],
  evidence: ["Portal capture", "Payer reference", "Timestamp", "Named owner"],
};


