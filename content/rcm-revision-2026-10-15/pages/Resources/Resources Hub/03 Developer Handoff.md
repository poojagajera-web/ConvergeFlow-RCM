# Resources — developer handoff

Status: draft only. Never publish handoff notes, draft status, keyword brief or placeholder schema URLs as visible public copy. Layout markers are implementation annotations.

## Head and rendering

- Proposed route: `/resources/`; one H1; server/static rendered copy and real anchor links.
- Title: `RCM Resources | Workflow Questions and Guides`
- Description: `Explore RCM resources for verification, eligibility and revenue-cycle handoffs. Prepare practical questions before reviewing your practice workflow.`
- Set html lang=en-US. Visible breadcrumbs Home → Resources match BreadcrumbList.
- schema.jsonld is a valid planning graph using marketing-domain.invalid only. Replace origin consistently with confirmed marketing domain before publishing. Never use beta product origin as marketing canonical.
- Canonical: one absolute self-referencing confirmed production URL; preview protected/noindex. No live redirect is requested.
- No Offer, rating, certification, financial outcome, invented contactPoint or person data in schema. FAQPage intentionally omitted; visible Q&A remains accessible HTML.
- Internal route links are proposed inventory dependencies. Verify destinations are released and return 200; withhold links/page if essential destination is not ready. Do not point to authenticated app routes.

## Components and content boundary

Keep noindex and exclude XML sitemap until at least three independently reviewed Final articles are deployed and hub approved. No invented article assets; suppress empty taxonomy links to case studies/downloads/webinars. Not a BlogPosting. No ItemList nodes for unpublished material.

Use the revised CEO navy/teal design direction with readable contrast, keyboard focus, skip link, labeled controls and reduced motion. Illustrations use synthetic data and an explicit illustrative caption. Never display live patient data or a simulated running transaction as proof.

## Forms and measurement

Any form needs an approved endpoint, recipient, retention/privacy wording, spam controls and accessible errors before transmission. Preview must stay non-operational with a clear notice. Preserve entered fields on safe retry; prevent double submit; never put contact values in URL/query/title or analytics. Success comes from confirmed backend acceptance. A request is not a scheduled meeting. Measurement events carry only fixed generic labels, no form values or PHI/PII. No unapproved marketing consent, SLA or security promise.

## Release QA

- Human fact/claim/copy review and final URL approval.
- Confirm no internal notes or invalid-domain assets leak into deployed body/head.
- Mobile 320px, 200% zoom, keyboard/screen-reader and contrast checks.
- Validate schema and initial HTML metadata; verify status, canonical and robots directives.
- Where relevant, verify form acceptance and delivery, errors, deduplication and sanitized payloads.
