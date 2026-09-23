# Validation matrix

| Change | Required automated checks | Required inspection |
| --- | --- | --- |
| Markdown post | `npm test`, `npm run validate` | Library filter, post route, links, wide and 320 px |
| News/report data | `npm run build`, `npm run validate` | Home or Library card, dates, destination |
| TypeScript behavior | `npm run build`, `npm run validate` | Changed interaction, keyboard, console |
| CSS/design | `npm run build`, `npm run validate` | 320, ~768 and 1280+ px; focus, overflow, reduced motion |
| Asset | `npm run build`, `npm run validate` | Load, dimensions, alt behavior, license/brand review |
| Presentation | `npm run build`, `npm run validate` | Both decks as applicable, keyboard and print |
| Dependency | `npm ci`, `npm run validate`, SBOM | Runtime smoke test and dependency/security review |
| Workflow | YAML review plus relevant local commands | Permissions, triggers, SHA pins and security review |
| Evidence only (`.memories`) | Evidence validator | Delta, provenance, privacy and owner review |

## Standard result format

| Check | Status | Notes |
| --- | --- | --- |
| Content structure | Pass / Fail / Not applicable | |
| TypeScript and production build | Pass / Fail / Not run | |
| Dependency audit | Pass / Fail / Not run | |
| Browser routes | Pass / Fail / Not run | |
| Keyboard and responsive behavior | Pass / Fail / Not run | |
| Claims/public-release review | Ready / Needs review / Blocked | |

Never collapse “Not run” into “Pass.”
