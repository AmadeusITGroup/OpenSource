---
name: ospo-evidence-refresh
description: "Refresh, validate or explain the GitHub evidence behind OSPO figures and reports. Use for refresh the figures, update GitHub metrics, contributor activity, Open Source Board quarterly report, organization inventory, annual report data, stale evidence, scheduled evidence job, run github-activity-analyzer, or validate team_stats.json."
argument-hint: "Choose org, Board, team or all; include capture date if needed"
---

# OSPO evidence refresh

Produce immutable, dated evidence and a delta for human review. Never update public claims automatically.

## Before any network call

1. Read `.memories/README.md`, `.memories/evidence-ledger.md`, `.memories/handover-map.md`, [the metric contract](./references/metric-contract.md) and the external analyzer README.
2. Confirm scope: organization inventory, Board quarter, contributor team, or all. Confirm capture date, reporting window, output location and evidence owner.
3. Confirm authentication without exposing a token. Use `GITHUB_TOKEN` or existing `gh` authentication; never place a token in arguments, logs, files or chat.
4. Locate the analyzer using `ANALYZER_DIR`; the local default is the sibling `../github-activity-analyzer`. Record its Git revision.
5. Use the bundled safe team adapter. The current external analyzer's lower-level team runner forwards its resolved token to child command arguments; do not invoke that path directly until it is fixed upstream.
6. Preview the exact plan without network access:
   `python3 .github/skills/ospo-evidence-refresh/scripts/refresh-evidence.py --mode <scope>`
7. Only after the maintainer confirms the scope and network operation, rerun with `--execute`.

## Refresh and validate

1. The script collects into an ephemeral staging directory, validates the complete capture, then writes new dated artifacts under `.memories/evidence/`. It refuses overwrite and retains nothing when validation fails.
2. Team collection stages raw member payloads in a restricted temporary directory, retains only minimized aggregate JSON, disables the member-response cache and stops if any member analysis fails. Raw payloads are removed when the adapter exits.
3. Validate a capture with:
   `python3 .github/skills/ospo-evidence-refresh/scripts/validate-evidence.py <capture-path>`
4. Run the offline helper tests with:
   `python3 -m unittest discover -s .github/skills/ospo-evidence-refresh/tests -p 'test_*.py'`
5. Run analyzer tests when the analyzer revision changed: `uv run pytest` from its checkout.
6. Compare with the previous equivalent capture. Explain changes in cohort, query, date range, status semantics and tool revision before comparing values.
7. Update `.memories/evidence-ledger.md` and add a delta note. Keep captures append-only.
8. Route Board status to the Board reviewer, metrics to the evidence/data-quality owner and publication to governance/IP plus editorial review.
9. Update public content only through `ospo-content-authoring` and `ospo-publication-review` after approval.

## Scheduling

Read [the scheduling blueprint](./references/scheduling.md). Scheduled collection may create a private artifact or review PR, but must never publish figures directly. Do not enable a schedule until repository origin, analyzer access, token scope, retention, privacy and reviewer ownership are confirmed.
