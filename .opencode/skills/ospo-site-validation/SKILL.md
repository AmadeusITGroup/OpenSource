---
name: ospo-site-validation
description: "Run and explain the OSPO landing-page validation and release checks. Use for validate the repo, check my change, test the site, build failure, preview the website, verify routes, test presentations, release checklist, Pages readiness, or pre-PR validation."
argument-hint: "Name the change or validation scope"
---

# OSPO site validation

Run checks for the maintainer and translate failures into clear next actions.

## Procedure

1. Read `docs/maintainer-guide/07-validation-and-publishing.md` and [the validation matrix](./references/validation-matrix.md).
2. Inspect `git status` and the diff to determine affected surfaces. Do not stage or discard unrelated work.
3. If `node_modules/` is absent, run `npm ci`; do not use `npm install` to rewrite the lock file during validation.
4. Use the smallest useful check while iterating: `npm test` for content, `npm run build` for source/design/presentations.
5. Finish with `npm run validate` and `git diff --check`.
6. For visible or interactive changes, start the site, inspect the relevant routes, exercise keyboard behavior, check 320/768/1280+ widths and look for console errors or horizontal overflow.
7. For presentation changes, inspect both HTML decks, keyboard navigation and print behavior.
8. Summarize each check as Pass, Fail, Warning or Not run. Include the first actionable error, not a wall of logs.

## Boundaries

A passing suite proves structure, compilation and dependency-audit thresholds. It does not prove factual accuracy, public approval, accessibility at every configuration, legal rights or correct GitHub settings. Route those questions to the appropriate focused skill and human reviewer.
