# Denial management: review the response and next action: Developer Handoff

**Status: Draft—human review.** Not approved for production.

## Build and routing

- Route: `/services/denial-management/`. UTF-8, en-US, one visible H1. Render all substantive copy and FAQs in initial HTML.
- Visible breadcrumb: Home → Services → Denial management. Match schema exactly.
- Primary button: /demo/. Confirm actual booking or lead destination before activation; never simulate successful submission.
- Secondary button: /services/. Resolve to the approved services hub.
- Show noindex,nofollow on review/staging builds; robots.txt is not access control. Production indexing needs explicit release approval.
- Do not expose planned routes until built. No publishing is authorized by these files.

## Head tags

Title: Denial Management Workflow Review | ConvergeFlow

Description: Plan denial review around the response, source evidence and next owner. Confirm available ConvergeFlow support for your follow-up workflow in a demo.

Canonical: resolve `/services/denial-management/` against the confirmed marketing origin. Do not point to the beta product host or invent a domain.

## Layout and accessibility

Hero with two actions; short sections with clear headings; related-topic links; visible FAQs; final two actions. Keep capability limitations next to the relevant promise. Use real button/link semantics, visible focus, accessible accordion controls if used, and readable mobile line length. Product imagery must use synthetic records and observed views; illustrations must not imply untested live execution.

## Schema

Load sibling schema.jsonld only after resolving relative URLs and IDs against the confirmed origin. WebPage name/description match metadata; FAQ text matches the visible copy. Stable global website entity is /#website. No Service, Offer, Product, rating or certification nodes: those could imply unverified delivery or commercial terms. Validate resolved JSON-LD at implementation.

## Required confirmations

Available actions and unsupported steps; supported systems/data flows; medical-specific scope; who performs work; demo endpoint; company contact; commercial terms. Do not add QDL, automation, security, compliance, payer coverage, results or testimonials without approved evidence.
