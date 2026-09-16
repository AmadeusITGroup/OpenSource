---
name: ospo-maintainer
description: "Guide a maintainer through any OSPO landing-page task, especially when they are unsure where to start or are not technical. Use for maintain this repo, what should I do, routine maintenance, prepare a change, update the site, contributor handover, or choose the right OSPO skill."
argument-hint: "Describe what you want to change or check"
---

# OSPO maintainer

Use this as the front door. Reduce choices, explain terms plainly and perform tool-based steps for the maintainer instead of handing them a command list.

## Procedure

1. Restate the intended outcome and identify whether it changes public content, code/design, dependencies/workflows, evidence, or publication state.
2. Read [the task map](./references/task-map.md), the relevant module under `docs/maintainer-guide/`, and current `git status`.
3. Route the work to the smallest focused skill:
   - `ospo-content-authoring` for posts, news, report cards and editorial copy
   - `ospo-publication-review` for claims, sources, legal/IP, privacy and release readiness
   - `ospo-design-accessibility` for UI, Design Factory, wordmark and accessibility work
   - `ospo-site-validation` for builds, previews, routes, presentations and release checks
   - `ospo-dependency-security` for packages, workflows and supply-chain changes
   - `ospo-evidence-refresh` for GitHub, Board and contributor figures
4. Build a short checklist with three states: automated, maintainer review, specialist approval.
5. Make or review the smallest safe change. Do not turn uncertainty into a guessed answer.
6. Run the relevant focused checks and finish with `npm run validate` plus `git diff --check` for tracked changes.
7. Return a plain-language handover: changed files, checks passed, evidence used, open decisions, reviewer roles and next action.

## Stop conditions

Stop before publication when a source is not public-approved, a claim lacks provenance, a third-party asset lacks rights, personal/private data may be exposed, or the responsible human owner is unknown.
