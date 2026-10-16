# Technology Overview: Developer Handoff

Status: Human review draft. Proposed route: /technology/

## Head fields

Title: Revenue Cycle Management Technology | ConvergeFlow
Description: Evaluate revenue cycle management technology through data flow, exceptions and reporting questions. Review ConvergeFlow’s available views in a demo.
Canonical after domain confirmation: https://marketing-domain.invalid/technology/
Language: en-US

## Build rules

- Staging must remain noindex; production indexing requires editorial and business approval.
- Replace marketing-domain.invalid consistently before release; the placeholder is not a production domain.
- Render exactly one visible H1; exclude the file title and bracketed component markers. Use the visible breadcrumb trail supplied above the hero.
- Keep visible FAQ and schema answers identical. Embed schema.jsonld as application/ld+json without introducing additional capability claims.
- Use the complete CEO navigation; these evaluation pages do not replace the full RCM menu. All linked routes are in the proposed revision inventory; expose links only when their destination is built.
- Preserve Schedule a Demo → /demo/ and Explore the Services → /services/. Connect and test the actual request endpoint; a request-received state must not imply a scheduled appointment.
- Product imagery must use clearly illustrative synthetic data; do not show patient data, credentials, live counters, badges, customer logos or fabricated endorsements.
- Page-specific boundary: Architecture, supported systems, automation behavior, transactions and evidence access. Keep these as questions until evidence is approved.

## Schema delivery

Use the adjacent schema.jsonld. Types: WebPage, BreadcrumbList, FAQPage. Stable business reference: https://marketing-domain.invalid/#business. No Service, Offer or feature assertions are added for unconfirmed capabilities.

