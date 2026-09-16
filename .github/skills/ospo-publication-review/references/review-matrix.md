# Public-release review matrix

| Material or change | Minimum evidence | Required reviewer role | Block when |
| --- | --- | --- | --- |
| Stable public guidance | Approved public source and owner | Editorial/OSPO | Source or owner is unclear |
| Metric or trend | Query/export, capture date, population, caveat, refresh date | Evidence owner and editorial | Cohort or calculation cannot be reproduced |
| Project story/status | Public repository/source, scope, license, maintainer | Project maintainer and editorial | Private facts, unclear ownership or maturity inflation |
| Board case | Dated Board evidence and status semantics | Board-status and governance/IP reviewer | Internal process, IP details or approval missing |
| Named person/quote | Exact wording, context and consent/public source | Editorial plus privacy/communications as needed | Consent or public relevance is unclear |
| Third-party image/chart/text | Source, license/permission and attribution | Legal/IP | Rights to copy, modify or redistribute are unclear |
| Amadeus wordmark | Official supplied asset and documented use | Brand/design when treatment changes | Asset is modified or used outside guidance |
| Security/process guidance | Public-safe technical source | Security/engineering | Sensitive details or unsafe advice may be exposed |
| Workflow/dependency | Diff, permissions, provenance, tests and rollback | Security/engineering | Permissions expand or source cannot be trusted |

## Evidence classes

- **Observed:** directly captured from a stated source on a stated date
- **Reported:** supplied by an owner or draft but not independently recomputed
- **Interpreted:** analysis or recommendation, clearly presented as such
- **Pending:** awaiting validation, approval, refresh or owner

Only Observed or approved Reported claims are candidates for publication. Classification is not approval.

## Repository-specific red flags

- `.tmp/` or `.memories/` paths in public prose or links
- SharePoint, Amadeus Workplace, internal hostnames or local filesystem paths
- Private repository names or invention/IP case details
- A fork described as an Amadeus-led project
- Board `Approved` described as `Published`
- The 180-member GitHub team merged with the reported ~220-person community cohort
- Analyzer `avg_languages_per_member` or CSV aggregate merge rate used as authoritative
- Yggy target architecture described as shipped
- Think Inside the Box described as an adopted standard
- Software Water described as an official GSF deliverable without updated approval
