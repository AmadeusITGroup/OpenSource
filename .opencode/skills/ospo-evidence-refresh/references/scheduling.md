# Scheduler-ready evidence refresh blueprint

Do not enable a schedule until the landing-page repository origin and visibility, analyzer checkout access, secret owner, token scope, artifact retention, privacy purpose and reviewing team are confirmed.

## Recommended model

A quarterly workflow should:

1. run on `workflow_dispatch` and a quarterly cron
2. check out the landing page with persisted credentials disabled
3. check out `Amadeus-xDLC/coe.github-activity-analyzer` at an explicitly reviewed commit into `tools/github-activity-analyzer`
4. install the analyzer with `uv sync --frozen --dev`
5. run analyzer tests
6. run `refresh-evidence.py --execute` with `ANALYZER_DIR` pointing to that checkout and output to a temporary workspace
7. run `validate-evidence.py --strict`
8. upload the dated capture and delta as a restricted-retention artifact
9. notify or assign the evidence/data-quality reviewer
10. require a separate, human-reviewed change to update `.memories/evidence-ledger.md` or public content

## Never automate

- Direct deployment of refreshed figures
- Creation of public contributor rankings
- Publication of raw member-level data
- Approval of Board narratives, project status, legal/IP or privacy
- Use of a broad personal token when a narrower app/token is available

## Secrets and permissions

Use `contents: read` by default. A token for the analyzer repository or GitHub API must be stored as a repository/environment secret, owned and rotated by an accountable team. Never echo it, pass it as a command-line argument or upload caches containing request metadata.

Keep the safe team adapter in the scheduled path until the analyzer no longer forwards tokens through process arguments. Re-audit this boundary whenever the pinned analyzer revision changes.

## Retention

Set the shortest practical artifact retention. Keep curated aggregate evidence according to the approved reporting policy; delete raw member-level output and caches when their reviewed purpose ends.

## Activation checklist

- [ ] Landing-page repository origin and visibility confirmed
- [ ] Analyzer source/ref approved and reachable by Actions
- [ ] GitHub App/token scopes approved
- [ ] Data protection purpose and retention approved
- [ ] Evidence and backup reviewers assigned
- [ ] Failure notification route assigned
- [ ] Manual dispatch tested with a non-public artifact
- [ ] Public update remains a separate reviewed pull request
