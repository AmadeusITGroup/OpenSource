# Contributing to the Amadeus OSPO landing page

Thank you for helping make the Amadeus Open Source story clearer, more useful and more welcoming.

This repository is a public-facing static site and content project. Contributions are welcome from people who improve the site, documentation, accessibility, contributor experience, project stories or public reporting.

Please read the [Code of Conduct](CODE_OF_CONDUCT.md) before participating. For security issues, do not open a public issue; follow [SECURITY.md](SECURITY.md).

If you use a coding agent, the shared public-safety, architecture and validation rules are in [AGENTS.md](AGENTS.md). Automated assistance does not replace the human reviews described below.

## What you can contribute

- Website fixes and accessibility improvements.
- Documentation, guides and onboarding content.
- Corrections to public facts, links or dates.
- Public project and contributor stories.
- Reports, evidence notes and reproducible methodology.
- Design, information architecture and editorial improvements.
- Tests, validation tooling and build/deployment improvements.

Do not submit confidential Amadeus information, private repository names, internal links, invention-disclosure material, personal data, credentials or unreleased metrics.

## Development setup

Requirements: Node.js 20.19+ or a current LTS release and npm.

1. Install dependencies with `npm ci`.
2. Run the development server with `npm run dev`.
3. Run the validation suite with `npm run validate`.
4. Preview the production build with `npm run preview` after `npm run build`.

Markdown posts live in `src/content/posts/`. Use the frontmatter format described in `README.md`.

## Before opening a pull request

- Keep the change focused.
- Update documentation when behavior or content conventions change.
- Do not add files from `.tmp/` or `.memories/`.
- Check that all public claims have an owner, source and capture date where applicable.
- Run `npm run validate` locally.
- Check the site at desktop and mobile widths.
- Check keyboard navigation and visible focus states for interactive changes.

## Pull request expectations

Describe:

- what changed;
- why it changed;
- how it was tested;
- which public sources support new claims; and
- whether communications, legal/IP or security review is needed.

The initial code owner is `@wherka-ama`. Additional OSPO, editorial, project and legal/IP owners will be added to `CODEOWNERS` as the public ownership model is confirmed.

The initial repository target is to acknowledge issues and pull requests within five business days. This is a proposed project target, not an Amadeus-wide service-level commitment.

## Content review

Content contributions are reviewed for:

- factual accuracy and source quality;
- public-release approval;
- clarity and inclusive language;
- licensing and attribution;
- privacy, security and confidential-information risks; and
- consistency with the Amadeus Open Source Manifesto.

A pull request can be declined when the material is not public-safe, cannot be verified, does not fit the site's purpose or belongs in a project repository instead.
