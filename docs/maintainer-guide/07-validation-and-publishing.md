# 07 — Validate, build and publish

## Learning goal

You will understand what happens locally, what happens in GitHub Actions and why a successful local edit is not published until the correct branch and Pages workflow succeed.

## The local command ladder

Use the smallest command that answers your question, then finish with the full check.

| Command | What it does | When to use it |
| --- | --- | --- |
| `npm test` | Runs `scripts/validate-content.mjs` | After editing or adding a Markdown post |
| `npm run build` | Runs `tsc` and then `vite build` | After any source, style, post or presentation change |
| `npm run preview` | Serves the existing `dist/` output | To inspect the production result after a build |
| `npm audit --audit-level=high` | Checks npm dependency vulnerabilities at high severity or above | When dependencies change or the full check reports a problem |
| `npm run validate` | Runs content validation, build and high-severity audit | Before every pull request and before release |

The repository does not have a conventional unit-test suite. Its automated safety net is currently content validation, TypeScript checking, the production build, dependency audit and GitHub security workflows. A green build is necessary but not sufficient for editorial approval.

## What `npm test` checks

`scripts/validate-content.mjs`:

1. reads every `.md` file in `src/content/posts/`;
2. requires front matter delimited by `---`;
3. requires `slug`, `title`, `deck`, `date`, `category`, `readTime`, `tags` and `featured`;
4. checks that slugs are unique;
5. rejects `<script>`, inline event handlers, `javascript:`, `sharepoint` and `amadeusworkplace` patterns;
6. fails when no posts exist.

The script exits with status `1` when it finds an error. That non-zero status stops a chained command and fails CI.

It does not check:

- whether an external link still responds;
- whether a claim is approved;
- whether a metric is current;
- whether the category is one of the intended values;
- whether an image has the correct licence or alternative text;
- whether a layout is accessible at every viewport.

Those are review responsibilities and future opportunities for automation.

## What `npm run build` does

`package.json` defines:

```text
npm run build = tsc && vite build
```

The `&&` means Vite runs only if TypeScript checking succeeds.

TypeScript uses `noEmit: true`, so `tsc` checks the code but does not write JavaScript files. Vite then bundles the application and copies/builds the three HTML inputs:

- `index.html`;
- `presentation.html`;
- `presentation-short.html`.

The result goes into `dist/`. The exact asset filenames may contain hashes; do not rely on them or edit them manually.

## What happens in CI

`.github/workflows/ci.yml` runs on pushes and pull requests targeting `main`:

1. checks out the repository;
2. sets up Node.js LTS;
3. runs `npm ci` from the lock file;
4. runs `npm run validate`;
5. generates an npm CycloneDX SBOM;
6. uploads the SBOM as a workflow artifact.

Other workflows provide additional controls:

- `dependency-review.yml` checks dependency changes in pull requests;
- `codeql.yml` analyzes JavaScript and TypeScript on pushes, pull requests and a weekly schedule;
- `scorecard.yml` runs OpenSSF Scorecard on pushes, branch-protection events and a weekly schedule;
- `dependabot.yml` asks GitHub to propose npm and GitHub Actions updates weekly;
- `deploy.yml` builds and deploys the Pages artifact on pushes to `main` or a manual dispatch.

The workflow actions are pinned to commit SHAs rather than mutable tags. Do not replace a SHA with a convenient tag without a security review.

## How GitHub Pages deployment works

The Pages workflow has two jobs:

### Build job

The build job installs dependencies, runs `npm run build`, and uploads `dist/` as a Pages artifact.

### Deploy job

The deploy job waits for the build job, uses the `github-pages` environment, and deploys the artifact. It does not rebuild the site.

GitHub Pages therefore publishes the result of the workflow, not the repository source files directly.

## The `BASE_PATH` setting

A GitHub Pages project site normally lives under a repository path:

```text
https://owner.github.io/repository/
```

An organization site normally lives at the root:

```text
https://owner.github.io/
```

The deployment workflow calculates a `BASE_PATH` based on the repository name. `vite.config.ts` uses that value as Vite’s `base`.

To test project-site output locally, use a repository path when building:

```text
BASE_PATH=/ospo-landing-page/ npm run build
```

Hash routes such as `#/library` are intentionally used so navigation does not require server rewrites.

## Manual publication checklist

Before merging a publication change:

- [ ] The target repository and Pages source are confirmed.
- [ ] The `main` branch is protected according to governance.
- [ ] The pull request has the required code-owner and specialist reviews.
- [ ] `npm run validate` passes locally.
- [ ] CI and security checks pass on the pull request.
- [ ] The built pages were inspected locally.
- [ ] Public claims have source, date, owner and limitations.
- [ ] No `.tmp/`, `.memories/`, credential or internal-only material is included.
- [ ] The final merge is intentionally a publication decision.

After merge:

1. open the Actions tab;
2. inspect the deploy workflow run;
3. wait for the build and deploy jobs to pass;
4. open the Pages URL;
5. test Home, Story, Start, Library, a post and both presentations;
6. check browser console errors and key links;
7. record notable publication changes in `CHANGELOG.md`.

## Rollback thinking

Because the site is built from `main`, the simplest rollback is usually a reviewed revert commit that restores the last known-good source. Do not manually edit `dist/` or deploy an unreviewed artifact.

If a security or confidentiality issue is live, follow `SECURITY.md` first. A normal content revert may not remove material from Git history, caches or screenshots.

## Future improvements

The README identifies link checking and accessibility checks as useful next refinements. If you add one:

- document the purpose and failure conditions;
- keep it deterministic in CI;
- explain how a non-coder can interpret failures;
- update this guide and `CONTRIBUTING.md`;
- avoid turning a simple content task into an opaque pipeline.
