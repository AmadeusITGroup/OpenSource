# Agent guidance for the OSPO landing page

This file applies to the whole repository. The project is a public-facing, static Amadeus Open Source Program Office site. Optimize for public safety, factual integrity, accessibility and low maintenance cost—not for architectural novelty.

## Start every task safely

1. Read `git status` before editing. Preserve unrelated and pre-existing work; do not stage, discard or rewrite it unless the user asks.
2. Read the relevant module in `docs/maintainer-guide/` before changing its area.
3. For multi-step work, use the matching repository skill under `.github/skills/`; start with `ospo-maintainer` when the route is unclear.
4. Inspect the source that owns the behavior before editing. Make the smallest coherent source change and avoid drive-by reformatting.
5. Test during implementation. Finish tracked changes with `npm run validate` and `git diff --check`.
6. Report what changed, what was actually checked, warnings or assumptions, human decisions still required, and one next action. Never present a green check as publication approval.

## Protect the public boundary

Treat every tracked file, branch, pull request, issue, workflow log and built artifact as potentially public.

- Never add internal URLs, private repository names, credentials, personal data, invention-disclosure material, unreleased figures or confidential strategy to tracked files.
- `.tmp/` and `.memories/` are ignored local research areas, not approved publication sources and not security boundaries. Do not force-add them, link public readers to them or copy their contents into tracked files without the required review.
- Do not expose secrets in source, chat, command arguments, process listings, logs, fixtures, screenshots or artifacts. Use environment-based authentication and redact diagnostic output.
- If sensitive material may have entered Git history, stop. Request security/repository-owner handling and credential rotation where relevant; do not rewrite shared history autonomously.
- A public URL does not grant permission to copy its content. Confirm licensing, attribution, privacy and publication rights for images, fonts, quotations, data and third-party material.
- Pause and request the accountable reviewer when public status, ownership, factual accuracy, licensing, legal/IP, privacy, security or brand use is uncertain.

See `docs/maintainer-guide/08-security-and-publication.md`, `SECURITY.md`, `NOTICE` and `LICENSE`.

## Keep claims evidence-led

Classify material claims as:

- **Observed** — directly measured in a dated capture;
- **Reported** — stated by an identified source;
- **Interpreted** — analysis or synthesis, clearly labelled as such;
- **Pending** — not yet validated or approved.

Before adding a changing fact or figure, require its exact source, capture date, population and scope, accountable owner, caveats and refresh date. Public content must cite an approved public source, never a local evidence path.

Preserve these distinctions:

- a fork is not necessarily an Amadeus-led project;
- Open Source Board `Approved` does not mean publicly `Published`;
- contributor cohorts with different membership or activity definitions must not be merged;
- a dated snapshot must not be described as live data;
- correlation, interpretation and supplied claims must not be presented as observed fact.

Use `ospo-publication-review` for claims or release readiness and `ospo-evidence-refresh` for GitHub-derived figures. Evidence collection never updates public content automatically. Human evidence, privacy, editorial and publication review remains mandatory.

## Preserve the architecture

The intentional stack is framework-free Vite, TypeScript, Markdown and CSS:

- `index.html` is the application shell.
- `src/main.ts` owns hash routing, page rendering and interactions.
- `src/content.ts` discovers/parses posts and stores typed news/report data.
- `src/content/posts/*.md` contains Library articles.
- `src/style.css` contains the site-wide visual system.
- `presentation.html` and `presentation-short.html` are standalone HTML/CSS/JavaScript documents and separate Vite build inputs.
- `public/` is copied as-is; `src/assets/` is processed by Vite.
- `vite.config.ts` derives the deployment base from `BASE_PATH`.

Do not add a framework, CMS, backend, database or a full Design Factory component stack for a local change. Such a change requires a separately justified and approved architecture decision. Keep hash routes so GitHub Pages does not require server rewrites.

Never edit generated `dist/`, installed `node_modules/` or `package-lock.json` by hand. Use `npm ci` when dependencies are absent; use `npm install` only for an intentional dependency change.

## Apply the rules for the area you change

### Public copy and posts

- Read `docs/maintainer-guide/04-editing-content.md` and use `ospo-content-authoring`.
- Write in clear, genuine, expert language: simple verbs, sentence case, descriptive links and no unsupported hype.
- Keep all eight frontmatter fields valid: `slug`, `title`, `deck`, `date`, `category`, `readTime`, `tags`, `featured`. Reuse the template in `.github/skills/ospo-content-authoring/assets/post-template.md`.
- Search for duplicate topics and slugs. Use only the supported categories defined in `src/content.ts`.
- Do not invent people, quotations, sources, results, approvals, project status or contact routes.

### TypeScript and rendered HTML

- Preserve the Markdown safety chain: content validation, `marked` parsing and `DOMPurify` sanitization.
- Escape dynamic plain text with `escapeHtml()` before inserting it into HTML template strings.
- Do not weaken sanitization, escaping, forbidden-pattern checks or TypeScript compiler settings without security review.
- Use semantic elements and native controls. Preserve keyboard operation, meaningful headings and link text, visible focus, reduced-motion behavior and responsive layouts.
- Treat the documented route fallbacks as existing behavior: unknown hashes currently resolve to Home, and an unknown post slug falls back to the first post. Do not claim or implement 404 behavior accidentally.

### Design and assets

- Read `docs/maintainer-guide/05-maintaining-the-site.md`; use `ospo-design-accessibility` for visual work.
- Reuse Design Factory tokens and existing local aliases in `src/style.css`. Do not invent brand colors or add Angular, Bootstrap, AgnosUI or the full Design Factory component library for a scoped change.
- Do not alter `src/assets/amadeus-wordmark-dark-sky.svg`; no cropping, recoloring, stretching, rotation, masking or decorative effects.
- Make illustrations content-led rather than generic. Give meaningful visuals an accessible name and hide internal decorative markup from assistive technology.
- Inspect visible changes at 320 px, around 768 px and at least 1280 px. Check keyboard use, focus, overflow, reduced motion and browser-console errors.

### Presentations

- Read `docs/maintainer-guide/06-maintaining-presentations.md`.
- Keep both decks self-contained and included in `vite.config.ts`.
- Check both keyboard navigation and print behavior. Remember that even an internal-audience deck is public when tracked here.

### Dependencies, workflows and security controls

- Use `ospo-dependency-security` and read the relevant workflow before changing it.
- Keep GitHub Actions pinned to immutable commit SHAs and permissions least-privileged. Do not weaken CI, CodeQL, dependency review, Scorecard or SBOM generation.
- Review both `package.json` and `package-lock.json` for an intentional dependency change. Do not accept automated upgrades solely because the build is green.
- Changes to `DOMPurify`, `marked`, `escapeHtml()`, validators, workflow permissions or action references require security-focused review.

### Evidence tooling

- Read `.github/skills/ospo-evidence-refresh/SKILL.md` and its metric contract before running any collection.
- Preview first; network collection requires explicit confirmation, approved authentication scope and an evidence owner.
- Keep captures dated, append-only and outside tracked content. Validate before retention; never publish raw member-level data or partial aggregates.
- Use the bundled safe adapter for team analysis. Do not bypass its token, staging, cache and minimization safeguards.
- Do not activate scheduled collection until repository access, token ownership/scope, retention, privacy purpose, reviewer ownership and failure handling are approved.

## Route work to the focused skill

| Task | Skill |
| --- | --- |
| Unsure where to start or multi-area maintenance | `ospo-maintainer` |
| Post, news, report-card or public copy | `ospo-content-authoring` |
| Claim, source, legal/IP, privacy or release review | `ospo-publication-review` |
| UI, Design Factory, responsive or accessibility work | `ospo-design-accessibility` |
| Build, browser, presentation or pre-PR checks | `ospo-site-validation` |
| Package, lockfile, workflow or supply-chain review | `ospo-dependency-security` |
| Organization, Board or contributor evidence | `ospo-evidence-refresh` |

Skills automate preparation and verification. They do not grant approvals.

## Validate according to impact

Use the smallest useful check while iterating, then the full applicable gate:

- Content or skill edits: `npm test`
- TypeScript, CSS, assets, HTML or presentations: `npm run build`
- All tracked changes before handoff: `npm run validate` and `git diff --check`
- Evidence helper changes: `python3 -m unittest discover -s .github/skills/ospo-evidence-refresh/tests -p 'test_*.py'`
- Analyzer revision changes: `uv run pytest` in the separately reviewed analyzer checkout
- Visible/interactive changes: browser inspection of affected routes at wide and narrow widths, keyboard behavior and console output
- Presentation changes: both decks plus print behavior

`npm run validate` runs content validation, skill validation, TypeScript, all Vite entries and the high-severity npm audit. It does not prove factual accuracy, public approval, accessibility in every configuration, licensing rights or repository settings.

## Human decision gates

Agents may prepare, implement, test, compare and explain. Agents must not approve:

- publication or public-release readiness;
- factual ownership, project status or metric interpretation;
- legal/IP rights, licensing exceptions or privacy purpose/retention;
- security risk acceptance or workflow-permission expansion;
- brand exceptions;
- final editorial positioning.

Use `.github/PULL_REQUEST_TEMPLATE.md` for the handoff and identify the required reviewer role rather than inventing a person. Do not merge, publish, deploy, commit or push unless the user explicitly requests it and all applicable human decisions are recorded.
