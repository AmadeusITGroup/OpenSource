# Maintainer task map

| Maintainer says | Primary skill | Automated work | Human decision |
| --- | --- | --- | --- |
| “Add or improve a post” | `ospo-content-authoring` | Template, duplicate search, validation, preview | Editorial approval and factual ownership |
| “Can we publish this?” | `ospo-publication-review` | Claim inventory, boundary scan, review record | Publication, legal/IP, privacy and project approval |
| “Update the look” | `ospo-design-accessibility` | Token review, responsive and keyboard checks | Brand/design preference and exception approval |
| “Check everything” | `ospo-site-validation` | Content test, build, audit, browser checks | Acceptance of warnings and publication decision |
| “Review Dependabot/workflow” | `ospo-dependency-security` | Diff, audit, build, SBOM and permission checks | Security and compatibility approval |
| “Refresh the report numbers” | `ospo-evidence-refresh` | Dated collection, validation and delta | Data quality, privacy and public-use approval |

## Change risk levels

- **Routine:** typo or approved wording correction with no factual change
- **Reviewed:** new post, news item, report card, design adjustment or external link
- **Specialist:** metric, project status, named person, third-party asset, license, dependency, workflow or security behavior
- **Stop:** credential, confidential material, unclear rights, private repository, unapproved internal source or missing accountable owner

## Handover format

Always finish with:

1. outcome and changed files
2. automated checks and results
3. evidence and capture dates
4. warnings or assumptions
5. human reviews still required
6. the single next action
