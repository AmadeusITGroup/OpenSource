# 11 — Use the maintainer assistant safely

## Learning goal

You will learn how the repository's AI skills reduce routine work, which skill to choose and which decisions must still be made by an accountable person.

## What the system is

The repository contains one shared agent contract at the root and focused skills under `.github/`:

```text
.
├── AGENTS.md
└── .github/
        └── skills/
                ├── ospo-maintainer/
                ├── ospo-content-authoring/
                ├── ospo-publication-review/
                ├── ospo-design-accessibility/
                ├── ospo-site-validation/
                ├── ospo-dependency-security/
                └── ospo-evidence-refresh/
```

`AGENTS.md` applies the most important safety and implementation rules to every task. Skills load detailed procedures only when the request needs them. This keeps normal conversations focused while making specialist workflows repeatable.

## Start with ordinary language

You do not need to know a skill name. Ask for the outcome:

- “Add a Library post from these approved public sources.”
- “Check whether this report is ready to publish.”
- “Review this page against Design Factory and accessibility guidance.”
- “Validate my changes and explain any failures.”
- “Review this Dependabot pull request.”
- “Plan a refresh of the contributor and Board figures without running it yet.”

If you are unsure, use `/ospo-maintainer`. It identifies the risk level, chooses the focused workflow and gives you one next action.

## What the assistant can do

The system can:

- find the right files and templates;
- draft or edit content from approved sources;
- create claim and publication-review records;
- run content, build, audit and browser checks;
- review Design Factory token use and common accessibility concerns;
- inspect dependency and workflow diffs;
- plan and execute a confirmed evidence capture;
- validate analyzer output and highlight known unusable fields;
- produce a plain-language handover for reviewers.

The assistant should perform available mechanical work instead of asking a nontechnical maintainer to copy commands into a terminal.

## What stays human

The system cannot approve:

- public release;
- factual ownership or project status;
- legal/IP rights and licensing exceptions;
- privacy purpose, consent or retention;
- security risk acceptance;
- brand exceptions;
- the meaning of a metric when domain judgment is required.

A response such as “checks passed” means the automated checks passed. It never means “Amadeus approved publication.”

## The standard maintenance flow

```text
Describe the outcome
        │
        ▼
Choose the focused skill
        │
        ▼
Check source, owner and public boundary
        │
        ▼
Draft or collect into a reviewable change
        │
        ▼
Run deterministic validation
        │
        ▼
Record specialist and owner decisions
        │
        ▼
Open a pull request and publish only after approval
```

## Content workflow

Use `ospo-content-authoring`. Provide the audience, goal and approved public sources. The skill checks existing topics, creates valid frontmatter, applies the editorial voice, previews the route and runs validation.

If the content introduces a changing fact, figure, named person, project status, quote or third-party asset, also use `ospo-publication-review`.

## Publication workflow

Use `ospo-publication-review`. It inventories claims and risks, creates claim records and assigns reviewer roles. Findings use clear states:

- **Block:** sensitive, unsupported or unsafe material
- **Needs specialist:** legal/IP, privacy, security, brand or accessibility decision
- **Needs owner:** missing factual or editorial accountability
- **Editorial fix:** wording or structure can be corrected without changing approval
- **Ready for final human review:** evidence is complete, but approval remains human

## Design workflow

Use `ospo-design-accessibility`. It preserves the framework-free architecture, existing Design Factory tokens and official wordmark. It checks keyboard use, focus, responsive layouts, reduced motion, semantic structure and meaningful image descriptions.

## Validation workflow

Use `ospo-site-validation`. It runs checks and explains the first useful failure. The final baseline is:

```text
npm run validate
git diff --check
```

Visible changes also need browser checks. Presentation changes need both decks checked with keyboard and print behavior.

## Evidence refresh workflow

Use `ospo-evidence-refresh`. The source analyzer is a separate checkout of `Amadeus-xDLC/coe.github-activity-analyzer`; its revision is recorded with every capture.

The refresh command is safe by default: without `--execute` it only prints the plan. A confirmed run stages the capture outside the repository, validates it, then writes new dated artifacts under ignored `.memories/evidence/` and leaves public content unchanged. A blocked capture is removed instead of being retained.

Team collection uses a repository-local safety adapter because the reviewed analyzer revision otherwise forwards its resolved token through child-process arguments and retains raw activity payloads. The adapter keeps authentication out of arguments and logs, stages raw data outside the repository, keeps only minimized aggregate JSON, disables response-cache reuse and stops rather than writing a partial aggregate when one member analysis fails.

The workflow separates:

1. mechanical collection;
2. data-quality and privacy review;
3. ledger and delta update;
4. public drafting;
5. publication approval.

This prevents a scheduled job from silently changing public figures.

### Scheduling status

The evidence skill contains a scheduler-ready blueprint, not an active workflow. This is intentional. The landing-page checkout currently has no Git remote configured, and scheduled access to the analyzer repository, token scope, retention and reviewers are not yet approved.

Enable scheduling only after completing the activation checklist in `.github/skills/ospo-evidence-refresh/references/scheduling.md`.

## Check the skill system itself

`npm test` validates content and skill structure. You can run only the skill check with:

```text
node scripts/validate-skills.mjs
```

It verifies required skills, YAML frontmatter names/descriptions, size limits and linked resources.

## A good handover

Every assisted task should finish with:

1. what changed;
2. files affected;
3. commands and browser checks run;
4. evidence used and capture dates;
5. warnings and assumptions;
6. human reviewers still needed;
7. one next action.

If the handover does not distinguish checks from approvals, ask the assistant to correct it before review.
