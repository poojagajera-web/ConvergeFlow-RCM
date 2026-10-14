/**
 * Home page copy and product data. Wording is carried over from the original
 * site so business meaning stays intact; only presentation changed.
 */

export const HERO = {
  eyebrow: "AI-powered revenue cycle management",
  titleLead: "Your revenue cycle,",
  titleAccent: "running without you.",
  body: "ConvergeFlow automates every step of RCM — from eligibility verification to payment posting — so your clinical team focuses on patients, not paperwork.",
  primaryCta: "Schedule a Demo",
  secondaryCta: "See What We Automate",
  video: {
    title: "ConvergeFlow Engine Demonstration",
    src: "https://player.vimeo.com/video/1230658346?h=a43767f572&autoplay=1",
  },
};

export const PAYERS = ["BCBS PPO", "Aetna Dental", "UnitedHealthcare", "Cigna Health", "Delta Dental", "MetLife Dental"];

export const CONSOLE_KPIS = [
  { label: "Verified today", value: 14842, decimals: 0, suffix: "", note: "Auto-verified" },
  { label: "Success rate", value: 99.4, decimals: 1, suffix: "%", note: "Clean first-pass match" },
  { label: "Avg. cycle", value: 1.2, decimals: 1, suffix: "s", note: "EDI 270/271" },
  { label: "Exceptions", value: 3, decimals: 0, suffix: "", note: "Manual triage queue", attention: true },
];

export type StreamRow = { patient: string; payer: string; detail: string; status: "verified" | "exception" };

export const STREAM_INITIAL: StreamRow[] = [
  { patient: "Elena Martinez", payer: "BCBS PPO", detail: "Copay $25 • In-Network", status: "verified" },
  { patient: "Marcus Chen", payer: "Aetna Dental", detail: "100% Preventive Cleanings", status: "verified" },
  { patient: "Sarah Jenkins", payer: "UnitedHealthcare", detail: "Prior Authorization Required", status: "exception" },
  { patient: "David Kim", payer: "Cigna Health", detail: "Deductible Met • 0% Coinsurance", status: "verified" },
];

export const STREAM_POOL: StreamRow[] = [
  { patient: "Amanda Ross", payer: "Delta Dental Premier", detail: "$1,850 Annual Max Remaining", status: "verified" },
  { patient: "Robert Taylor", payer: "Humana ChoiceCare", detail: "Specialist Referral Active", status: "verified" },
  { patient: "Jennifer White", payer: "Guardian Life", detail: "Out-of-Area Payer Portal Latency", status: "exception" },
  { patient: "Michael Brooks", payer: "MetLife Dental", detail: "Basic 80% / Major 50% Verified", status: "verified" },
  { patient: "Rachel Green", payer: "Anthem BlueCross", detail: "Individual Deductible $350 Remaining", status: "verified" },
  { patient: "Carlos Mendez", payer: "Ameritas PPO", detail: "Waiting Period Waived", status: "verified" },
  { patient: "Sophia Patel", payer: "Principal Financial", detail: "Missing Group Policy ID", status: "exception" },
];

export const LEDGER_STATS = [
  { prefix: "", value: 94, suffix: "%", label: "Reduction in manual eligibility time" },
  { prefix: "", value: 3, suffix: "×", label: "Faster claim submission cycle" },
  { prefix: "$", value: 42, suffix: "K", label: "Average annual revenue recovered per provider" },
  { prefix: "", value: 99, suffix: "%", label: "Clean claim rate within 30 days" },
];

export const REVENUE_CYCLE = {
  eyebrow: "What is RCM",
  title: "The financial engine your practice can’t afford to ignore",
  body: "ConvergeFlow automates the entire cycle with AI, making sure nothing falls through the cracks — from first verification through final payment posting.",
  cta: "Get a Free RCM Assessment",
  phases: [
    {
      when: "Before the visit",
      title: "Eligibility & Authorization",
      body: "Automated insurance verification and prior authorization so your team walks in prepared, not guessing.",
    },
    {
      when: "During the visit",
      title: "Charge Capture & Pre-Auth",
      body: "Zero missed copays, automated fee schedules, and point-of-care deductible calculation written into patient charts.",
    },
    {
      when: "After the visit",
      title: "Claims, Denials & Collections",
      body: "Clean claim submission, intelligent denial management, patient billing, and payment posting — closed-loop, every time.",
    },
  ],
};

export type Telemetry = { label: string; value: string; tone: "success" | "active" | "neutral" };

export type PipelineStep = {
  key: string;
  short: string;
  name: string;
  phase: string;
  protocol: string;
  headline: string;
  body: string;
  metric: { label: string; value: string; change: string };
  bullets: string[];
  telemetry: { title: string; status: string; rows: Telemetry[]; log: string };
};

export const PIPELINE = {
  eyebrow: "Full-cycle services",
  title: "Every step of the revenue cycle, running on autopilot",
  body: "From the instant a patient schedules to final zero-balance ERA reconciliation — ConvergeFlow closes every loop with sub-second autonomous accuracy.",
  status: { value: "99.8%", label: "Autonomous processing", sub: "Live clearinghouse bridge active" },
  groups: [
    { label: "Eligibility & Intake", range: [0, 1], stat: "94% less manual work" },
    { label: "Prior Authorization", range: [2, 2], stat: "98.6% approval rate" },
    { label: "Claims & Scrubbing", range: [3, 4], stat: "99.2% clean first-pass" },
    { label: "Denials & Posting", range: [5, 7], stat: "35% faster cash flow" },
  ],
  steps: [
    {
      key: "patient-intake",
      short: "Intake",
      name: "Patient Intake & OCR",
      phase: "Pre-visit ingestion",
      protocol: "HL7 / FHIR / OCR engine",
      headline: "Instant demographic extraction with automated OCR verification",
      body: "Patient information, front & back insurance card imagery, and referral documents are parsed in sub-second time. Zero manual transcription into your PMS/EHR.",
      metric: { label: "Intake transcription time", value: "0.2s", change: "99.8% field accuracy" },
      bullets: [
        "Bi-directional PMS synchronization",
        "Dentrix, Epic, Athena, Eaglesoft",
        "Mobile patient pre-registration OCR",
        "Front & back insurance card image cleanup",
        "Encrypted subscriber identity validation",
        "Zero-touch chart demographic creation",
      ],
      telemetry: {
        title: "Intake & Card OCR Extraction",
        status: "Parsed • 100% match",
        rows: [
          { label: "Subscriber name", value: "Jennifer R. Adams", tone: "success" },
          { label: "Member ID / Group", value: "BCBS-9844201 / GRP-7720", tone: "success" },
          { label: "Payer identification", value: "Blue Cross Blue Shield Dental (EDI 00020)", tone: "neutral" },
          { label: "OCR image quality", value: "Crisp High-Res (99.8% confidence)", tone: "success" },
        ],
        log: "[FHIR_INGEST] Patient demographics validated. Tokenized credentials stored in KMS.",
      },
    },
    {
      key: "eligibility-verification",
      short: "Eligibility",
      name: "Eligibility Check",
      phase: "Real-time verification",
      protocol: "EDI 270/271 real-time bus",
      headline: "Deep benefit breakdown with guaranteed audit screenshot proof",
      body: "Automated inquiries across 1,000+ commercial, Medicare & Medicaid payers. Co-pays, coinsurance, and deductibles are extracted and written directly into patient charts.",
      metric: { label: "Verification latency", value: "0.4s", change: "1,000+ payers supported" },
      bullets: [
        "Full dental & medical breakdown of benefits",
        "Deductible, frequency & maximum limits",
        "Automated screenshot evidence archived",
        "Bulletproof carrier audit defense",
        "Direct writeback into PMS appointments",
        "Zero portal logins required by staff",
      ],
      telemetry: {
        title: "EDI 271 Benefit Decomposition",
        status: "Active coverage confirmed",
        rows: [
          { label: "Individual deductible", value: "$50.00 ($0 Remaining)", tone: "success" },
          { label: "Preventive care coverage", value: "100% (No copay required)", tone: "success" },
          { label: "Major restorative coverage", value: "80% (Subject to yearly max)", tone: "neutral" },
          { label: "Annual benefit remaining", value: "$1,850.00 / $2,000.00", tone: "active" },
        ],
        log: "[EDI_271] Response 005010X279A1 parsed in 380ms. Chart fields populated.",
      },
    },
    {
      key: "prior-authorization",
      short: "Pre-Auth",
      name: "Prior Authorization",
      phase: "Clinical clearance",
      protocol: "AI auth comms & EDI 278",
      headline: "Autonomous clinical packet assembly and payer submission",
      body: "Extracts clinical notes, radiographs, and diagnosis codes straight from the EHR, matching payer medical necessity rules and transmitting authorized requests in minutes.",
      metric: { label: "Auth approval rate", value: "98.6%", change: "72h faster clearances" },
      bullets: [
        "AI extraction of operative notes & diagnostic charts",
        "Auto-cross-referencing against payer LCD/NCD policies",
        "Electronic 278 dispatch with secure carrier attachments",
        "Continuous webhook status polling",
        "Instant peer-to-peer review alerting",
        "Auto-generation of clinical necessity letters",
      ],
      telemetry: {
        title: "EDI 278 Prior Auth Dispatcher",
        status: "Approved • Auth #PA-89102",
        rows: [
          { label: "Procedure code", value: "D4341 (Perio Scaling & Root Planing)", tone: "neutral" },
          { label: "Clinical attachment", value: "Full-mouth probe chart + 4 bitewings (Attached)", tone: "success" },
          { label: "Payer policy reference", value: "Aetna Dental CPB #0245 (Criterion Met)", tone: "success" },
          { label: "Authorization status", value: "Approved — 60 Day Validity Window", tone: "active" },
        ],
        log: "[AUTH_ENGINE] Packet compiled in 2.1s. Digital approval received via Availity Gateway.",
      },
    },
    {
      key: "charge-capture-coding",
      short: "Coding",
      name: "Charge Capture & Coding",
      phase: "Charge capture",
      protocol: "CDT / CPT / ICD-10 scrubber",
      headline: "Prevent missed revenue with automated clinical code crosswalks",
      body: "Every completed encounter is analyzed against documented chart notes. Identifies unbilled procedures, verifies modifiers, and eliminates cross-coding compliance vulnerabilities.",
      metric: { label: "Unbilled revenue recovered", value: "$12.4K", change: "Per provider / quarter" },
      bullets: [
        "CDT to CPT medical cross-coding crosswalks",
        "Clinical note natural language understanding (NLU)",
        "Automated modifier verification (-25, -59, -LT/RT)",
        "Real-time fee schedule reconciliation",
        "Unbilled procedure detection",
        "Automated compliance audit trail",
      ],
      telemetry: {
        title: "NLU Charge Capture Engine",
        status: "Cross-coded • 0 discrepancies",
        rows: [
          { label: "Chart encounter", value: "Surgical Extraction + Bone Grafting", tone: "neutral" },
          { label: "Primary CDT code", value: "D7210 (Extraction) + D7953 (Bone Replacement)", tone: "success" },
          { label: "Medical cross-code", value: "CPT 21210 / ICD-10 M27.2 (Billed to Medical)", tone: "active" },
          { label: "Charge accuracy", value: "100% compliant with payer fee schedule", tone: "success" },
        ],
        log: "[NLU_CODER] Chart notes cross-referenced. Additional $450 medical reimbursement unlocked.",
      },
    },
    {
      key: "claims-submission",
      short: "Claims",
      name: "Claims Scrubbing & EDI",
      phase: "Dispatch & transmission",
      protocol: "EDI 837P / 837I / 837D",
      headline: "50+ rule validation edits executed in 40ms before transmission",
      body: "Pre-clearinghouse rules engine verifies NPI, taxonomy, subscriber eligibility, and mutually exclusive codes, guaranteeing a 99.2% clean first-pass submission rate.",
      metric: { label: "Clean first-pass rate", value: "99.2%", change: "<40ms scrubbing latency" },
      bullets: [
        "Pre-submission validation against 1,200+ payer rule sets",
        "National Correct Coding Initiative (NCCI) unbundling checks",
        "Automated 277CA clearinghouse acknowledgment tracking",
        "Sub-second batch transmission to Change & Availity",
        "Automated electronic signature injection",
        "Immediate error alerts before carrier receipt",
      ],
      telemetry: {
        title: "EDI 837 Outbound Batch Engine",
        status: "Clean dispatch • ACK 999",
        rows: [
          { label: "Batch submission", value: "Batch #4109 (148 claims queued)", tone: "neutral" },
          { label: "NCCI rule validation", value: "Passed 48/48 unbundling checks", tone: "success" },
          { label: "Clearinghouse ACK 999", value: "Accepted without exceptions (0ms lag)", tone: "success" },
          { label: "Estimated settlement", value: "Within 7-10 business days (EFT Direct)", tone: "active" },
        ],
        log: "[EDI_837] ISA-IEA envelope generated. Dispatched to Change Healthcare gateway.",
      },
    },
    {
      key: "denial-management",
      short: "Denials",
      name: "Denial Management",
      phase: "Autonomous appeals",
      protocol: "AI cause analysis & appeals",
      headline: "Automated root-cause diagnosis and one-click appeal generation",
      body: "Every rejection is instantly categorized by CARC/RARC code. The AI generates tailored appeal packages citing the exact carrier clinical guidelines to recover stalled revenue.",
      metric: { label: "Denial recovery rate", value: "82%", change: "<24h appeal turnaround" },
      bullets: [
        "Automatic CARC/RARC code mapping with root-cause categorization",
        "Pre-built appeal briefs citing active carrier policy guidelines",
        "Automated work-queue prioritization ranked by recovery value",
        "Instant radiograph & probe chart re-attachment",
        "Carrier filing deadline auto-monitoring",
        "Recurring denial prevention rule updates",
      ],
      telemetry: {
        title: "Denial Resolution & Appeal Bot",
        status: "Auto-appeal dispatched",
        rows: [
          { label: "Denial reason", value: "CARC 97: Bundled Procedure Disputed", tone: "neutral" },
          { label: "Clinical reference", value: "Cited AMA CPT Assistant Nov 2024 precedent", tone: "success" },
          { label: "Supporting evidence", value: "Operative report & radiographs attached", tone: "success" },
          { label: "Recovery probability", value: "High (91.4% calculated resolution)", tone: "active" },
        ],
        log: "[DENIAL_AI] Appeal brief generated in 1.4s. Dispatched with evidence attachments.",
      },
    },
    {
      key: "payment-posting",
      short: "Posting",
      name: "Payment Posting & Reconciliation",
      phase: "Closed-loop reconciliation",
      protocol: "ERA 835 auto-posting",
      headline: "Electronic Remittance Advice auto-reconciled down to the penny",
      body: "ERA 835 files and merchant credit card deposits are matched against open patient encounters. Adjustments, write-offs, and co-pays are closed out with zero human touch.",
      metric: { label: "Auto-posting rate", value: "99.4%", change: "Zero suspense balances" },
      bullets: [
        "Automated contractual write-off calculation based on fee schedules",
        "Multi-provider EFT deposit reconciliation against daily banking feeds",
        "Instant split between insurance reimbursement and patient responsibility",
        "Direct ledger update into Dentrix, Epic, Athena & Eaglesoft",
        "Secondary claim auto-generation with attached primary EOB",
        "Zero-balance audit validation for clinic books",
      ],
      telemetry: {
        title: "ERA 835 Ledger Reconciliation",
        status: "Balanced • Closed-loop",
        rows: [
          { label: "Remittance reference", value: "ERA #835-90142 ($1,420.00)", tone: "neutral" },
          { label: "Payer EFT match", value: "Matched to Chase Deposit Feed #9021", tone: "success" },
          { label: "Contractual write-off", value: "$320.00 posted per contractual discount", tone: "success" },
          { label: "Ledger discrepancy", value: "$0.00 (Perfect penny reconciliation)", tone: "active" },
        ],
        log: "[ERA_835] 12 patient encounters posted to Dentrix ledger. Zero manual entries required.",
      },
    },
    {
      key: "ar-management",
      short: "AR",
      name: "AR Velocity & Predictive Analytics",
      phase: "Cash velocity & recovery",
      protocol: "Executive predictive analytics",
      headline: "Predictive AR velocity with continuous aged-balance recovery",
      body: "Monitors claims aging past 30, 60, and 90 days. Identifies persistent payer delay patterns, automates inquiry follow-ups, and protects practice cash flow with precision forecasting.",
      metric: { label: "Days in AR reduction", value: "18.4 days", change: "35% faster cash inflow" },
      bullets: [
        "Proactive aged-claim follow-up triggers before filing limits approach",
        "Executive cash flow forecasting powered by historical payment cycles",
        "Granular provider production and net collection rate reporting",
        "Automatic payer delay pattern detection across regional carriers",
        "Real-time practice revenue health score dashboard",
        "Exportable board-level financial recovery telemetry",
      ],
      telemetry: {
        title: "Accounts Receivable Telemetry",
        status: "Accelerated • Optimal",
        rows: [
          { label: "Overall days in AR", value: "22.4 Days (Industry average: 40+)", tone: "success" },
          { label: "AR aging 0-30 days", value: "88.6% of total receivables", tone: "success" },
          { label: "AR aging >90 days", value: "<2.4% (Industry benchmark: 12-18%)", tone: "active" },
          { label: "Recovered aged balances", value: "$124,500.00 collected this quarter", tone: "neutral" },
        ],
        log: "[ANALYTICS] Cash velocity benchmark: 99.2% net collection rate reached.",
      },
    },
  ] satisfies PipelineStep[],
};

export const INDUSTRIES = {
  eyebrow: "Practice verticals",
  title: "Engineered for every type of healthcare practice",
  body: "Whether you operate an independent dental office or a multi-location health enterprise, ConvergeFlow integrates directly into your existing EHR/PMS without disrupting clinical operations.",
  items: [
    {
      id: "industry-dental",
      name: "Dental Practices",
      systems: "Dentrix • Eaglesoft • OpenDental",
      body: "Automated breakdown of benefits, fee schedules, and real-time eligibility verification for private and group dental practices.",
      metric: "94% less front-desk work",
    },
    {
      id: "industry-dso",
      name: "DSO & Group Practices",
      systems: "Multi-location enterprise",
      body: "Centralized verification and billing automation across 10 to 200+ dental clinic locations with unified executive analytics.",
      metric: "Enterprise multi-PMS sync",
    },
    {
      id: "industry-medical",
      name: "Medical & Primary Care",
      systems: "Primary & urgent care",
      body: "Point-of-care copay calculation, annual deductible verification, and clean charge capture directly at patient check-in.",
      metric: "Sub-400ms verification",
    },
    {
      id: "industry-specialty",
      name: "Specialty Clinics",
      systems: "Ortho • Cardio • Surgery",
      body: "Autonomous prior authorization packet assembly, complex CPT mapping, and high-dollar procedure clinical notes cross-referencing.",
      metric: "98.6% auth approval",
    },
    {
      id: "industry-hospitals",
      name: "Hospitals & Health Systems",
      systems: "Epic • Cerner • Meditech",
      body: "High-volume institutional 837I scrubbing, financial clearance automation, and zero-touch electronic remittance posting.",
      metric: "Full inpatient / outpatient",
    },
    {
      id: "industry-behavioral",
      name: "Behavioral Health",
      systems: "Carve-outs & auth tracking",
      body: "Automated verification of mental health carve-out benefits, session limits, and recurring authorization renewal tracking.",
      metric: "Session limits guard",
    },
  ],
  partner: {
    title: "Are you an RCM Billing Company or MSO?",
    body: "Deploy ConvergeFlow as your proprietary white-labeled automation engine and 4× biller output.",
    cta: "Partner With Us",
  },
};

export type ProcessStep = {
  tab: string;
  timeline: string;
  badge: string;
  title: string;
  body: string;
  features: { title: string; body: string }[];
  stat: { label: string; value: string };
  system: string;
  logs: string[];
};

export const PROCESS = {
  eyebrow: "Implementation process",
  title: "Live automation in weeks, not months",
  body: "A dedicated implementation team maps your payer mix, validates PMS writeback, and ensures smooth clinical cutover with zero downtime.",
  steps: [
    {
      tab: "PMS Connect",
      timeline: "Days 1–3",
      badge: "API bridge active",
      title: "Connect your practice management systems",
      body: "We establish a secure, zero-overhead bi-directional API bridge with your EHR and PMS. Epic, Dentrix, AthenaHealth, Eaglesoft, or OpenDental — onboarding completes in days without interrupting clinical workflows.",
      features: [
        { title: "Zero-overhead bi-directional bridge", body: "Direct real-time synchronization with Dentrix, Epic, Athena, and Eaglesoft calendars." },
        { title: "256-bit hardware vault security", body: "HSM-protected zero-knowledge credentials with automated multi-factor key rotation." },
        { title: "Parallel sandbox verification", body: "Every clinical integration is tested in shadow mode before live clinical cutover." },
      ],
      stat: { label: "Deployment SLA", value: "3-day cutover" },
      system: "Bi-directional PMS & EHR synchronization",
      logs: [
        "[TLS 1.3] Handshake established with Practice Management Gateway",
        "[AUTH] OAuth2 scoped bearer token acquired for calendar writeback",
      ],
    },
    {
      tab: "Payer Rules",
      timeline: "Days 4–7",
      badge: "1,240+ payers mapped",
      title: "Map carrier fee schedules & payer rules",
      body: "Our onboarding specialists configure your top commercial, Medicaid, and Medicare payer matrix. Custom fee schedules, CPT and CDT rules, and clearinghouse webhooks are automated without manual spreadsheets.",
      features: [
        { title: "1,240+ pre-configured payers", body: "Instant rules compiled for BCBS, Aetna, Cigna, Delta Dental, MetLife, and CMS." },
        { title: "Specialty CPT & CDT fee compiling", body: "Practice-specific clinical fee schedules and billing requirements mapped to the code." },
        { title: "Clearinghouse webhook routing", body: "Direct automated validation across Change Healthcare, Availity, and regional payers." },
      ],
      stat: { label: "Payer coverage", value: "1,240+ payers" },
      system: "Carrier rules engine & automated routing",
      logs: [
        "[RULES] Payer rule compilation complete for BCBS, Aetna, Cigna, MetLife",
        "[ROUTER] Clearinghouse webhook endpoints verified (Change & Availity)",
      ],
    },
    {
      tab: "Nightly Batch",
      timeline: "04:00 AM",
      badge: "Batch run 04:00 AM",
      title: "Autonomous batch verification runs overnight",
      body: "Before your front desk opens, ConvergeFlow verifies every scheduled patient, extracts remaining deductibles and copays, and scrubs all unbilled claims against 50+ payer rules.",
      features: [
        { title: "Automated EDI 270 overnight runs", body: "100% of next-day appointments verified by 04:00 AM without staff intervention." },
        { title: "50+ rule claims scrubbing engine", body: "Deep inspection against CCI edits, medical necessity, and prior-authorization checks." },
        { title: "Direct PMS appointment writeback", body: "Exact copays, deductibles, and eligibility status written into patient chairs." },
      ],
      stat: { label: "Verification latency", value: "Sub-400ms batch" },
      system: "Autonomous pre-visit clearance & claim scrubbing",
      logs: [
        "[04:12:00] Real-time EDI 270 inquiry dispatched for tomorrow's schedule",
        "[04:22:10] Copay and deductible balances written directly into PMS chairs",
      ],
    },
    {
      tab: "Front Desk",
      timeline: "Morning open",
      badge: "Zero portal logins",
      title: "Your front desk sees answers — not tasks",
      body: "No more logging into 15 carrier portals. Staff see exact patient responsibility and verified benefits inside the PMS calendar. Uninsured or inactive coverage triggers instant alerts.",
      features: [
        { title: "Zero carrier portal logins", body: "Eliminates 3.8 hours per day of tedious manual payer website lookups." },
        { title: "Point-of-care copay calculation", body: "Exact out-of-pocket responsibility is displayed at patient check-in." },
        { title: "Proactive exception triage", body: "Instant alerts for inactive coverage so issues are resolved before treatment." },
      ],
      stat: { label: "Portal time saved", value: "3.8 hrs / day" },
      system: "Instant front-desk clarity at patient check-in",
      logs: [
        "[PMS DISPATCH] Patient Elena M. check-in screen populated with $25 copay",
        "[STATUS] All morning clinical chairs cleared with verified benefits",
      ],
    },
    {
      tab: "Auto Reconcile",
      timeline: "Continuous",
      badge: "Cash flow maximized",
      title: "Closed-loop reconciliation through to final deposit",
      body: "Clean claims clear on first pass. Unavoidable carrier rejections trigger automated appeal packages. Remittances and bank deposits are auto-posted to the penny.",
      features: [
        { title: "99.2% first-pass clean claims", body: "Near-zero initial submission rejection rate keeps clinical revenue flowing." },
        { title: "ERA 835 automated posting", body: "Electronic remittances reconciled directly to PMS patient ledgers." },
        { title: "Automated AI appeal packages", body: "Immediate resubmission briefs with cited payer guidelines for faster recovery." },
      ],
      stat: { label: "Clean claim rate", value: "99.2% first-pass" },
      system: "End-to-end electronic remittance & treasury vault",
      logs: [
        "[ERA 835] Electronic remittance #89301 posted to ledger accounts",
        "[RECONCILED] Daily bank deposit reconciled with PMS ledger balance",
      ],
    },
  ] satisfies ProcessStep[],
};

export const TECHNOLOGY = {
  eyebrow: "Under the hood",
  title: "Built on AI and robotics — not offshore manual headcount",
  body: "ConvergeFlow is powered by QuantumDataLytica — an AI orchestration engine that manages every workflow, carrier credential, and exception without human delays.",
  core: {
    name: "Orchestration Engine (QDL)",
    badge: "AI core",
    body: "Powered by QuantumDataLytica — a distributed event scheduler handling high-concurrency job parallelization and self-healing pipeline recovery.",
    status: "Autonomous queue",
  },
  modules: [
    {
      name: "Portal Automation (Selenium RPA)",
      badge: "Selenium engine",
      body: "Headless browser robotics interact with archaic commercial and state Medicaid web portals, extracting deep benefit grids and capturing timestamped audit screenshots.",
      status: "Active RPA cluster",
    },
    {
      name: "Direct EDI & Clearinghouse Bus",
      badge: "EDI 270/271/837",
      body: "Direct EDI pipes connecting to Availity, Change Healthcare, Waystar, and regional clearinghouses with sub-millisecond response caching.",
      status: "Sub-400ms gateway",
    },
    {
      name: "Encrypted Credential Vault",
      badge: "AES-256 HSM",
      body: "Zero-knowledge AES-256 hardware security modules (HSM) storing carrier logins with automated multi-factor authentication (MFA) and rotated audit keys.",
      status: "HIPAA & SOC 2 ready",
    },
    {
      name: "Intelligent Exception Classifier",
      badge: "ML classifier",
      body: "Machine learning models differentiate true payer rejections from temporary gateway outages, auto-retrying errors and escalating only genuine anomalies.",
      status: "Zero noise alerts",
    },
    {
      name: "Cryptographic Audit Ledger",
      badge: "SHA-256 ledger",
      body: "Immutable transaction logs recording every eligibility check, prior authorization approval, and payment posting with non-repudiation.",
      status: "100% audit proof",
    },
  ],
  security: {
    title: "Enterprise HIPAA & SOC 2 Type II security",
    body: "BAA executed upon contract. Zero-knowledge KMS vaults protect all PHI across all clinical endpoints.",
    points: ["BAA executed upon contract", "AES-256 encryption at rest", "Immutable audit trail", "Role-based access"],
    cta: "Discuss your security review",
  },
};

export const RESULTS = {
  eyebrow: "Measurable outcomes",
  title: "The numbers your CFO and board want to see",
  body: "ConvergeFlow clients consistently see measurable financial and front-desk ROI within 60 to 90 days of going live.",
  cta: "Calculate Practice ROI",
  hero: {
    label: "Top financial recovery",
    prefix: "$",
    value: 42,
    suffix: "K+",
    title: "Average annual revenue recovered per provider",
    body: "Directly capturing under-billed procedures, uncollected patient deductibles, and secondary payer claims through closed-loop automated reconciliation.",
    footer: ["Validated across 1,200+ practices", "90-Day ROI Guarantee"],
  },
  items: [
    {
      label: "vs. manual verification",
      value: 94,
      suffix: "%",
      title: "Reduction in manual eligibility verification time",
      body: "Eliminating 3 to 4 hours of tedious carrier web portal lookups per clinic location every single morning.",
      footer: "",
    },
    {
      label: "Pre-submission",
      value: 31,
      suffix: "%",
      title: "Reduction in initial denial rate",
      body: "50+ pre-clearinghouse NCCI validation rules catch errors before carrier transmission.",
      footer: "Sub-40ms rule engine",
    },
    {
      label: "Cash velocity",
      value: 14,
      suffix: " days",
      title: "Faster payment turnaround",
      body: "Same-day clean electronic dispatch accelerates practice cash inflow significantly.",
      footer: "ERA auto-posting active",
    },
  ],
};

export const TESTIMONIALS = {
  eyebrow: "Client feedback",
  title: "Trusted by 100+ clinical and financial leaders",
  body: "Hear how independent practices, DSOs, and specialty groups achieved revenue cycle autonomy with ConvergeFlow.",
  items: [
    {
      initials: "SM",
      name: "Dr. Sarah Mitchell, DDS",
      role: "Lead Practitioner & Founder",
      practice: "Mitchell Family Dental (Charlotte, NC)",
      pms: "Dentrix Enterprise",
      outcome: "Saved 4 hours daily",
      tenure: "18 months on platform",
      quote:
        "Before ConvergeFlow, my front desk spent 3 to 4 hours every single morning logging into 14 separate carrier portals. Now, every patient's benefits are verified and written directly into our Dentrix schedule before we open our doors.",
    },
    {
      initials: "JO",
      name: "James Okonkwo, MHA",
      role: "Chief Operating Officer",
      practice: "Summit Specialty Health (8 Locations)",
      pms: "Epic & AthenaHealth",
      outcome: "Denials reduced to 2.4%",
      tenure: "Multi-location DSO",
      quote:
        "Our initial claim denial rate plummeted from 12% to under 2.4% within 60 days of going live. The automated scrubbing and root-cause denial appeal briefs recovered over $280K in stalled cashflow in our first quarter alone.",
    },
    {
      initials: "MC",
      name: "Maria Chen, CPB",
      role: "Director of Revenue Operations",
      practice: "Metro Comprehensive Care Network",
      pms: "OpenDental & Eaglesoft",
      outcome: "$140K annual recoveries",
      tenure: "24 providers",
      quote:
        "The credential encryption vault and HIPAA-compliant audit logs gave our compliance board immediate peace of mind. Zero downtime during our EHR cutover, and our billers now handle 3× the claim volume without burnout.",
    },
  ],
};

/** Answers are drawn only from commitments made elsewhere on the site. */
export const FAQ = {
  eyebrow: "FAQ",
  title: "Questions practices ask before they switch",
  items: [
    {
      q: "How long does implementation take?",
      a: "Most practices go live in 2 to 4 weeks with zero clinical downtime. The PMS and EHR bridge is typically connected within the first three days, payer rules and fee schedules are mapped in days four to seven, and every integration runs in shadow mode before live cutover.",
    },
    {
      q: "Which practice management and EHR systems do you integrate with?",
      a: "ConvergeFlow synchronizes bi-directionally with Dentrix, Epic, AthenaHealth, Eaglesoft and OpenDental, and supports systems such as eClinicalWorks, Cerner and Meditech. Verified benefits, copays and deductibles are written straight back into your PMS calendar.",
    },
    {
      q: "How is patient data and payer credential security handled?",
      a: "A BAA is executed upon contract. Carrier credentials are stored in a zero-knowledge AES-256 vault with automated multi-factor authentication and key rotation, and every eligibility check, authorization and posting is recorded in an immutable audit ledger.",
    },
    {
      q: "How many payers are supported?",
      a: "Automated inquiries run across 1,000+ commercial, Medicare and Medicaid payers, with 1,240+ payer rule sets pre-configured for onboarding — including BCBS, Aetna, Cigna, Delta Dental, MetLife and CMS.",
    },
    {
      q: "When will we see a return on investment?",
      a: "Clients typically see measurable financial and front-desk ROI within 60 to 90 days of going live. Your demo includes a free revenue cycle audit that estimates recoverable revenue on your specific payer mix.",
    },
    {
      q: "Do we need to sign a long-term contract?",
      a: "No. There is no long-term contract required to get started.",
    },
  ],
};

export const DEMO = {
  eyebrow: "Get started",
  title: "See what ConvergeFlow can recover for your practice",
  body: "Schedule a 30-minute consultation with an RCM automation engineer. We will audit your current claim rejection rate, identify stalled revenue, and show live PMS writeback on your specific payer mix.",
  checklist: [
    "No long-term contract required to get started",
    "Free practice revenue cycle audit included with every demo",
    "Live go-live in 2 to 4 weeks with zero clinical downtime",
  ],
  security: {
    title: "Enterprise healthcare security standard",
    body: "BAA executed upon onboarding • SOC 2 Type II Ready • 256-bit AES encryption",
  },
  form: {
    title: "Request your 30-minute live demo",
    body: "Fill out your practice details below for a tailored revenue assessment.",
    submit: "Request 30-Minute Live Demo & Audit",
    privacy: "All inquiries protected under standard HIPAA confidentiality.",
    pms: [
      { value: "Dentrix", label: "Dentrix" },
      { value: "Epic", label: "Epic" },
      { value: "AthenaHealth", label: "AthenaHealth" },
      { value: "Eaglesoft", label: "Eaglesoft" },
      { value: "OpenDental", label: "OpenDental" },
      { value: "eClinicalWorks", label: "eClinicalWorks" },
      { value: "Other", label: "Other System" },
    ],
    practiceTypes: [
      { value: "Dental Practice", label: "Dental Practice (Private)" },
      { value: "DSO Group", label: "Dental Support Organization (DSO)" },
      { value: "Medical Clinic", label: "Medical / Primary Care" },
      { value: "Specialty Group", label: "Specialty Group / Surgery Center" },
      { value: "Hospital System", label: "Hospital & Health System" },
      { value: "Billing Service", label: "RCM Billing Company" },
    ],
    locations: [
      { value: "1 Location", label: "1 Location" },
      { value: "2-5 Locations", label: "2–5 Locations" },
      { value: "6-15 Locations", label: "6–15 Locations" },
      { value: "16+ Locations", label: "16+ Locations (Enterprise)" },
    ],
  },
  success: {
    title: "Demo request confirmed",
    body: (name: string) =>
      `Thank you, ${name}. A ConvergeFlow RCM specialist will review your payer mix and send your calendar link within 2 hours.`,
    again: "Submit another request",
  },
};

export const FOOTER = {
  tagline: "Autonomous revenue cycle management for dental practices, medical groups, and healthcare enterprises.",
  cta: "Book a 30-Min Practice Audit",
  trust: ["HIPAA compliant • BAA standard execution", "SOC 2 Type II ready infrastructure"],
  credit: { lead: "Design & Developed by", name: "Softqubes Technologies LLC", href: "https://softqubes.com/" },
  legal: "Built on QuantumDataLytica AI.",
};
