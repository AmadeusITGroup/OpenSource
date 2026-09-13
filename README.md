# Amadeus OSPO landing page

A lightweight, content-led single-page application for the Amadeus Open Source Program Office. It is designed to work well as a GitHub Pages project site while keeping the maintenance model intentionally small.

**Status:** working draft for public-launch preparation. The target public destination is `https://amadeusitgroup.github.io/OpenSource`.

## What is included

- A responsive landing page with a clear OSPO story and calls to action.
- Hash-based navigation for Home, Our story, Start here, Library and individual posts. This avoids server-side routing requirements on GitHub Pages.
- Markdown-as-code posts in `src/content/posts/`, parsed at build time with [`marked`](https://github.com/markedjs/marked).
- A library filter for guides, field notes and stories.
- Report and briefing cards ready to connect to real program data later.
- Accessible focus states, semantic landmarks, reduced-motion support and a mobile navigation menu.
- A pinned-shape GitHub Pages Actions workflow in `.github/workflows/deploy.yml`.
- A self-contained concept presentation in `presentation.html`.
- A dedicated five-minute Board briefing in `presentation-short.html`.

Repository community and governance documents:

- [Contributing guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)
- [Support](SUPPORT.md)
- [Governance](GOVERNANCE.md)
- [Maintainers](MAINTAINERS.md)
- [Changelog](CHANGELOG.md)
- [Beginner maintainer guide](docs/maintainer-guide/README.md)
- [Apache-2.0 license](LICENSE)

The presentation is now a dated, evidence-led Board narrative. It covers the Amadeus open-source journey, Manifesto principles, refreshed 2026 Board and contributor signals, project-story examples, a public-report framework, reproducibility rules and a decision ask. The supporting evidence and future-agent handover map live under `.memories/`.

`presentation-short.html` is the compact announcement deck for the 10 September 2026 Board session. It announces the target public home at `https://amadeusitgroup.github.io/OpenSource`, explains the journey and distinctive model, summarises the supplied impact baseline, previews the landing-page “shop window” and ends with a three-step launch ask. The target URL returned 404 during the 11 September 2026 validation capture, so the deck deliberately labels it as a target destination pending publication.

## Beginner maintainer guide

The [beginner maintainer guide](docs/maintainer-guide/README.md) explains the repository from first principles for colleagues who work in IT but do not normally write code. It covers setup, Git and GitHub, Markdown posts, the TypeScript/CSS site, presentations, validation, deployment, security and troubleshooting.

## Run locally

Requirements: Node.js 20.19+ (or a current LTS release) and npm.

```text
npm install
npm run dev
```

Open the local URL printed by Vite. The dev server supports hot module replacement, so editing a TypeScript, CSS or Markdown file updates the page immediately.

To test the production output locally:

```text
npm run build
npm run preview
```

The production preview is served from `dist/` and is the closest local check to what GitHub Pages will publish.

The repository also has a lightweight validation suite:

```text
npm test
npm run validate
```

`npm test` validates Markdown frontmatter and rejects common unsafe or internal-link patterns. `npm run validate` runs content validation, the production build and a high-severity dependency audit.

## Add a post

1. Create a Markdown file in `src/content/posts/`.
2. Add frontmatter with the fields below.
3. Write the post body in Markdown.
4. Run `npm run build` and open the generated post through the Library.

```yaml
---
slug: a-short-slug
title: A clear, useful title
deck: One sentence that tells people why they should read it.
date: 2026-09-10
category: Guide
readTime: 5 min read
tags: [Community, Contribution]
featured: false
---
```

Supported categories are `Guide`, `Field note`, `Story`, `Report` and `Announcement`. The first `featured: true` post after date sorting is used as the primary homepage feature, followed by two supporting posts; keep the featured flags intentional.

## Deploy to GitHub Pages

1. Push the repository to GitHub.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. Push to `main`, or trigger **Deploy site to GitHub Pages** manually from the Actions tab.
4. The workflow builds `dist/`, uploads it as a Pages artifact and deploys it to the `github-pages` environment.

`vite.config.ts` reads `BASE_PATH`. The workflow calculates the correct base automatically for both a project site (`/<repository>/`) and an organization site (`/`). For a local build that mimics a project site, use a repository path when invoking Vite:

```text
BASE_PATH=/ospo-landing-page/ npm run build
```

## Content and ownership model

The first version intentionally keeps content close to the code rather than adding a CMS. That makes reviews, history and publishing transparent on GitHub. A later phase can add a small content collection or headless CMS only if the editorial workflow becomes the bottleneck.

Suggested ownership:

- **OSPO team:** editorial direction, reports, program stories.
- **Project maintainers:** technical details and contribution guidance.
- **Communications/design partners:** voice, visuals and announcements.
- **Legal/security partners:** links and guidance for policy-sensitive topics.

The initial code owner is `@wherka-ama`; see [MAINTAINERS.md](MAINTAINERS.md) and [CODEOWNERS](.github/CODEOWNERS). Additional OSPO, editorial, project and specialist owners should be confirmed before public launch.

## Public repository boundary

The following directories are research/workspace material and must not be published:

- `.tmp/` — local drafts, source documents and working issue material.
- `.memories/` — evidence captures, raw API exports and handover notes.

They are ignored by `.gitignore`. Public content belongs in the repository root, `src/content/` or an explicitly reviewed documentation path. Never commit private repository names, internal URLs, invention disclosures, credentials, personal data or unreleased metrics.

## License

Original repository code, documentation and presentation materials are released under the [Apache License 2.0](LICENSE), unless a file states otherwise. Third-party names, trademarks, linked documents, fonts and external content remain subject to their respective terms. See [NOTICE](NOTICE).

## Suggested next refinements

- Replace placeholder program metrics and contact links with approved Amadeus destinations.
- Add a real projects index sourced from the Amadeus GitHub organization.
- Publish the first annual report and a small set of contributor stories.
- Add automated link checking and accessibility checks to CI.
- Decide whether the final repository should be an organization site (`AmadeusITGroup.github.io`) or a project site.
- Validate the draft 2026 report figures and assign owners before publishing them as current public metrics.
