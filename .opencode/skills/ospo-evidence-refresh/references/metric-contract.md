# OSPO evidence and metric contract

## Required metadata for every capture

- UTC capture date and time
- Analyzer repository URL and exact Git commit
- Exact command without credentials
- GitHub organization/team/repository and reporting window
- API/query semantics and cache policy
- Output files and validation result
- Previous comparable capture
- Evidence owner and next refresh date

## Current source contracts

### Organization inventory

Count total, fork/non-fork and public/private repositories from a dated organization API response. Never place private repository names in summaries or public material. Inventory is not activity.

### Open Source Board

Keep GitHub issue state separate from the Project custom `Status`. Preserve unknowns. `Approved` is not `Published`. Board narratives require Board-status and governance/IP review.

### Contributor team

The team capture measures public/API-visible activity for the named team and time window. It does not measure all Amadeus open source activity or community health.

Use the bundled `safe-team-capture.py` adapter. At the reviewed analyzer revision, the lower-level team analyzer forwards its resolved token in child-process arguments and logs the command. It also retains raw GitHub issue and pull-request payloads that can contain internal references or credential-shaped examples. The adapter keeps authentication in the environment or `gh` credential store, forces fresh member API reads, stages raw payloads outside the repository and retains only minimized aggregate JSON without member profiles or named repositories.

Use `team_stats.json` as the aggregate source. Do not use:

- zero-valued `avg_languages_per_member`, which is a known stub-derived field
- the zero merge-rate field in `team_stats_aggregate.csv`

Use JSON `team_insights.quality_indicators.team_merge_rate` for the team merge rate. Do not merge the 180-member 2026 GitHub team capture with the separately reported ~220-person community cohort.

## Comparison rules

Do not calculate a trend unless organization/team scope, membership semantics, start date, end date, API behavior and analyzer revision are comparable. If they differ, explain the break instead of presenting a percentage change.

Do not rank or profile individuals publicly by default. Contributor outputs may contain personal/public profile data and require privacy-purpose review, minimization and retention decisions.

## Evidence lifecycle

1. Collect into an ephemeral, restricted staging path
2. Validate structure and scan for credentials/internal URLs before retaining the dated capture
3. Compare with the prior equivalent capture
4. Record caveats and tool revision in the ledger
5. Obtain data-quality and privacy review
6. Draft public wording separately
7. Obtain project/editorial/governance approval
8. Publish a dated claim and set its refresh date
