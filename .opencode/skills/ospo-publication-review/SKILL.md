---
name: ospo-publication-review
description: "Assess whether OSPO content is ready and safe for public release. Use for publication review, legal or IP check, evidence check, claim validation, privacy review, confidential-content check, approve a report, review a presentation, source a metric, or decide whether material from .tmp or .memories may be used."
argument-hint: "Name the files or claims to review"
---

# OSPO publication review

Prepare an evidence-based recommendation. This skill never grants legal, IP, privacy, security, editorial or publication approval.

## Procedure

1. Define the exact publication surface and diff. Treat tracked files and Git history as public.
2. Read `docs/maintainer-guide/08-security-and-publication.md`, `NOTICE`, `SECURITY.md`, `.github/PULL_REQUEST_TEMPLATE.md` and [the review matrix](./references/review-matrix.md).
3. Inventory new or changed claims, figures, names, quotes, project statuses, links and third-party assets.
4. Create one [claim record](./assets/claim-record.md) per material claim. Require source, capture date, population/scope, owner, caveat, evidence class and refresh rule.
5. Compare factual claims with `.memories/evidence-ledger.md` only for provenance. Do not expose local paths or convert internal evidence into public approval.
6. Scan for credentials, personal data, private repository names, internal URLs, invention/IP details, draft-only metrics and misleading status changes.
7. Check source rights: public visibility alone does not grant copying, modification or redistribution rights.
8. Assign each finding: **Block**, **Needs specialist**, **Needs owner**, **Editorial fix**, or **Ready for final human review**.
9. Complete [the publication decision](./assets/publication-decision.md), listing evidence and named reviewer roles. Never fabricate reviewer names.
10. Run `npm run validate` when tracked content changed, but state clearly that a green build is not publication approval.

## Mandatory escalation

- Governance/IP: internal sources, Board cases, inventions, licensing ambiguity, third-party assets
- Project maintainer: project scope, maturity, ownership or release status
- Evidence owner: metrics, cohort definitions, calculations or freshness
- Security: credentials, workflows, sanitization, sensitive links or suspected exposure
- Accessibility/design: visual, interaction, presentation or brand concerns
