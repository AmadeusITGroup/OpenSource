# Beginner maintainer guide

Welcome. This guide explains how to maintain the Amadeus OSPO landing-page repository if you work in an IT organisation but do not normally write software.

You do **not** need to become a professional programmer. You need a reliable mental model, a safe editing routine, and enough vocabulary to know when a change is simple and when it needs a specialist review.

The guide is deliberately practical. It describes this repository as it exists today: a small, static Vite/TypeScript website with Markdown content, two self-contained HTML presentations, and GitHub Actions that validate and publish the site.

> **Status note:** the repository is a working draft for public-launch preparation. Confirm the target repository, public owners, approved links, metrics and publication decision before treating draft content as public fact.

## How to use this guide

Read the modules in order the first time. Later, use the task table to jump directly to the relevant module.

| Module | What you will learn |
| --- | --- |
| [01 — Repository map](01-repository-map.md) | What the folders and technologies mean, and which files control which parts of the site |
| [02 — Tools and local setup](02-tools-and-setup.md) | How to install the small toolchain, open the project and run it safely |
| [03 — Git and GitHub workflow](03-git-and-github-workflow.md) | How changes move from your computer to review and publication |
| [04 — Editing content](04-editing-content.md) | How to write posts, update news and reports, and use Markdown front matter |
| [05 — Maintaining the site](05-maintaining-the-site.md) | How the TypeScript, HTML, CSS, routes, assets and data fit together |
| [06 — Maintaining presentations](06-maintaining-presentations.md) | How to edit and check the long and short self-contained slide decks |
| [07 — Validation and publishing](07-validation-and-publishing.md) | What the checks do, how GitHub Actions deploys the site, and how to diagnose a failed build |
| [08 — Security and public release](08-security-and-publication.md) | How to protect confidential information, licensing, public claims and reviewer decisions |
| [09 — Troubleshooting](09-troubleshooting.md) | Practical fixes for the problems a new maintainer is most likely to meet |
| [10 — Quick reference](10-quick-reference.md) | Checklists, file-to-task lookup, glossary and copyable command sequences |
| [11 — AI-assisted maintenance](11-ai-assisted-maintenance.md) | How to use the repository skills, what they automate and which decisions stay human |

## The five-minute mental model

The repository is a **recipe for a website**, not a running server:

```text
Markdown + TypeScript + CSS + images
                │
                ▼
       npm run build (Vite)
                │
                ▼
       static files in dist/
                │
                ▼
    GitHub Pages serves the files
```

There is no database, backend API, login system or content-management interface in this project. A content change is made as a file change, reviewed in a pull request, built into static files and then published.

The main working loop is:

```text
read → edit a small change → validate → inspect in a browser → open a pull request → review → merge → deploy
```

## Start here if you only need to make a small content change

1. Ask `/ospo-content-authoring` to guide the change, or follow the manual steps below.
2. Read [CONTRIBUTING.md](../../CONTRIBUTING.md) and [SUPPORT.md](../../SUPPORT.md).
3. Check that the material is approved for public use. Never copy from `.tmp/` or `.memories/` into a public file.
4. Create or edit a Markdown file under `src/content/posts/`.
5. Run `npm ci` if dependencies are not installed.
6. Run `npm run validate`.
7. Run `npm run dev` and inspect the page in a browser, including a narrow mobile width.
8. Review `git diff` before opening a pull request.
9. Describe the evidence class, source, date, scope, owner, caveat and refresh rule for every new public claim.

If you are changing code, workflows, licensing, security behaviour or public metrics, read the relevant full module and involve the named reviewers.

## What is safe to change without being a specialist?

Usually safe with normal review:

- correcting an approved public sentence;
- adding a well-sourced public post;
- fixing a typo, link or date;
- adjusting the wording of a presentation slide;
- changing colours or spacing in `src/style.css` when you check desktop and mobile layouts;
- updating the `news` or `reports` arrays in `src/content.ts` with approved content.

Ask for specialist help before changing:

- `.github/workflows/` or deployment permissions;
- security validation or Markdown sanitisation;
- dependencies in `package.json` or `package-lock.json`;
- licensing, attribution or third-party material;
- public metrics, project ownership or legal/IP claims;
- repository settings, branch protection or GitHub Pages settings;
- anything copied from an internal document or private repository.

## The public boundary

The repository contains both publication material and local working material. The following directories are intentionally ignored:

- `.tmp/` — local drafts, source documents and working issue material;
- `.memories/` — evidence captures, raw exports and handover notes;
- `node_modules/` — installed dependencies;
- `dist/` — generated production output.

An ignored file is not a security boundary. It is still possible to force-add an ignored file or paste its contents into another file. Treat confidential information as confidential at every step.

## A note about terminology

This guide uses “maintainer” broadly. In this project it can mean an editor, OSPO representative, designer, project-story owner, reviewer, accessibility checker, release coordinator or developer. The repository needs all of those roles; writing code is only one of them.
