# 10 — Quick reference

## Before touching the repository

- [ ] I know what outcome I want.
- [ ] I know whether the change is public content, code, design, automation or governance.
- [ ] I have a public source and owner for new factual claims.
- [ ] I am not copying from `.tmp/` or `.memories/`.
- [ ] I know which reviewer should be involved.

## First commands in a new session

```text
git status
git branch --show-current
git remote -v
node --version
npm --version
```

## Standard content-change sequence

```text
npm ci
npm test
npm run dev
npm run validate
git diff --check
git diff
```

Use `npm ci` only when dependencies are missing or the lock file changed. Stop `npm run dev` with `Ctrl+C` when finished.

## Standard branch sequence

```text
git switch -c <short-purpose-branch>
# edit files
npm run validate
git diff --check
git status
git add <files>
git diff --cached
git commit -m "<short description>"
git push -u origin <short-purpose-branch>
```

Replace angle-bracket placeholders. Never stage everything blindly when the working tree contains unrelated files.

## Task-to-file lookup

| Task | File or folder |
| --- | --- |
| Add article | `src/content/posts/<slug>.md` |
| Correct article metadata | The same Markdown file |
| Change post parsing/sanitisation | `src/content.ts` |
| Change home/story/start/library structure | `src/main.ts` |
| Change page interaction | `src/main.ts`, then check keyboard behaviour |
| Change visual design | `src/style.css` |
| Change page metadata | `index.html` |
| Add a stable public asset | `public/` |
| Add/import an application asset | `src/assets/` and a source import |
| Change news or report cards | `src/content.ts` |
| Change full deck | `presentation.html` |
| Change short deck | `presentation-short.html` |
| Change content checks | `scripts/validate-content.mjs` |
| Change build inputs/base path | `vite.config.ts` |
| Change npm command/dependency | `package.json`, usually `package-lock.json` via npm |
| Change CI or deployment | `.github/workflows/` |
| Change required reviewer | `.github/CODEOWNERS` |
| Change repository process | `CONTRIBUTING.md`, `GOVERNANCE.md`, `SECURITY.md`, `SUPPORT.md` |

## Supported post categories

Use exactly one of:

```text
Guide
Field note
Story
Report
Announcement
```

## Required post front matter

```yaml
---
slug: unique-lowercase-slug
title: Reader-facing title
deck: One-sentence summary.
date: 2026-09-11
category: Guide
readTime: 5 min read
tags: [Topic, Audience]
featured: false
---
```

## Route reference

```text
#/              Home
#/home          Home
#/story         Our story
#/start         Start here
#/library       Library
#/post/<slug>   Article
```

## Glossary

| Term | Meaning in this project |
| --- | --- |
| Action | A reusable GitHub workflow step, such as checkout or setup-node |
| Artifact | A file produced by a workflow, such as the Pages bundle or SBOM |
| Build | Transforming source files into browser-ready static files |
| CI | Automated checks run for a change, usually in GitHub Actions |
| CSS | Rules controlling visual presentation and layout |
| Front matter | Metadata at the top of a Markdown post |
| Git | Local version-control system |
| GitHub Actions | GitHub’s automation service for checks and deployment |
| GitHub Pages | Static website hosting used by this project |
| Hash route | A route after `#`, such as `#/library`, handled in the browser |
| HTML | Markup describing page structure |
| Markdown | Plain text syntax used for articles and documentation |
| npm | Node’s package manager and script runner |
| Pull request | A reviewed proposal to merge a branch |
| SBOM | Software bill of materials listing dependencies |
| Static site | A site served as files, without a runtime backend |
| TypeScript | Checked JavaScript used for the application source |
| Vite | Development server and production build tool |

## Escalation guide

Contact or involve a specialist instead of guessing when the topic is:

- security vulnerability or exposed credential → `SECURITY.md`, `opensource@amadeus.com`;
- conduct concern → `CODE_OF_CONDUCT.md`;
- public question or correction → `SUPPORT.md` or an appropriate issue template;
- legal/IP/licence question → legal/IP reviewer;
- project fact → project maintainer/story owner;
- ownership or merge policy → `GOVERNANCE.md` and code owner;
- workflow/dependency issue → engineering or security reviewer.

## The final question

Before you merge, ask:

> “If this change were copied, indexed and read by someone outside Amadeus tomorrow, would I still be comfortable with its wording, source, ownership, licence, accessibility and maintenance cost?”

If the answer is not clearly yes, pause the merge and ask for review.
