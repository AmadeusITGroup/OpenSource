# 09 — Troubleshoot common problems

## Learning goal

Use this module when something fails. Start with the command or browser symptom, then work from the first meaningful error.

## The general troubleshooting method

1. Describe the symptom in one sentence.
2. Reproduce it with the smallest steps possible.
3. Note which file and command were involved.
4. Read the first error, not only the last line.
5. Change one thing at a time.
6. Re-run the smallest relevant check.
7. Finish with `npm run validate`.
8. Record the fix in the pull request.

Do not hide an error by deleting the check that found it.

## “`node` or `npm` is not recognised”

**Likely cause:** Node.js is not installed, or the terminal was opened before installation and has an old `PATH`.

**Try:**

```text
node --version
npm --version
```

Install or enable the approved Node.js LTS version, then close and reopen VS Code. Ask your IT support team if corporate device controls prevent installation.

## “`git` is not recognised”

Install Git through the approved corporate route, reopen the terminal and check:

```text
git --version
```

## `npm ci` fails

Check:

1. You are in the repository root, where `package.json` and `package-lock.json` exist.
2. You have a supported Node.js version.
3. The lock file is present and was not edited manually.
4. Your corporate network/proxy permits npm registry access.
5. The error is not a certificate, proxy or policy message requiring IT support.

Do not replace `npm ci` with random npm flags. Capture the exact error and ask for help if the environment is the issue.

## `npm test` reports missing front matter

Open the named Markdown file and confirm it begins with a line containing exactly `---`, followed by the required fields, then another `---` line.

Required fields:

```text
slug, title, deck, date, category, readTime, tags, featured
```

Keep each field on one line. Copy the template in `README.md` or [04 — Editing content](04-editing-content.md).

## `npm test` reports a duplicate slug

Search all posts for the same `slug:` value. Slugs, not filenames, define the post route. Give the new post a unique lowercase hyphenated slug.

Changing an already published slug can break links. If a published slug must change, agree a redirect or communication plan first; the current application has no redirect system.

## `npm test` reports a forbidden pattern

The validator protects against selected unsafe or internal patterns, including:

- `<script>`;
- inline event handlers such as `onclick=`;
- `javascript:` links;
- `sharepoint`;
- `amadeusworkplace`.

First decide whether the text should be public at all. Do not evade the check by changing capitalisation or spelling. If a legitimate public example is being blocked, ask a security-aware maintainer to review the rule and add a precise, tested exception only if appropriate.

## TypeScript errors during `npm run build`

Read the filename, line and message. Common causes are:

- a misspelled variable or property;
- an unused import or variable (`noUnusedLocals` is enabled);
- an invalid type passed to a function;
- an unbalanced edit in a template string;
- a missing import.

Make the smallest correction and rerun the build. Do not disable strict checks to make the message disappear.

## The browser shows a blank page

Check in this order:

1. Is `npm run dev` still running?
2. Did the terminal report a build or module error?
3. Open the browser developer tools and look at the Console tab.
4. Confirm the URL is the Vite URL, not a stale file opened directly from disk.
5. Check that `index.html` still contains `id="app"` and the module script.
6. Check the first error in `src/main.ts` or `src/content.ts`.
7. Stop and restart the dev server if the module graph is stale.

## A post does not appear

Check:

- the file is under `src/content/posts/`;
- the filename ends in `.md`;
- the front matter is valid;
- `npm test` passes;
- the browser was refreshed after adding the file;
- the post category and date are what you expect;
- the slug is unique.

Vite discovers posts at build/dev-server time. If a new file is not picked up, restart `npm run dev`.

## A link does not navigate inside the site

Internal application links should normally use hash routes:

```text
#/story
#/start
#/library
#/post/first-steps
```

A link such as `/library` asks the server for a real `/library` path and may fail on GitHub Pages. Use `encodeURIComponent()` in code when a slug is placed into a generated URL.

## The wrong post opens

The current renderer falls back to the first post when a post slug is not found. This can happen after a slug change or a typo in a link. Search for the route value, compare it with the post’s `slug`, and update the link or restore the intended slug.

If the desired behaviour is a real not-found page, that is a code change requiring route design and tests; it is not solved by adding another Markdown file.

## Styles look wrong after an edit

Check:

- selector spelling and braces;
- whether a later rule overrides the rule you changed;
- whether the selector is inside the correct media query;
- whether a global CSS variable changed more pages than intended;
- wide, medium and narrow viewport sizes;
- keyboard focus and reduced-motion behaviour.

Use the browser inspector to see which CSS rule wins. Avoid changing many unrelated rules in one pull request.

## `presentation.html` or `presentation-short.html` does not work

Open the file through the Vite preview or the built `dist/` copy rather than relying only on a direct file path. Then check:

- the deck has at least one `.slide.is-active`;
- the controls still exist;
- the embedded script is not missing or malformed;
- slide sections have not been accidentally nested;
- the slide count and generated dots match;
- keyboard navigation works.

Run `npm run build` because both decks are Vite build inputs.

## The production preview is stale

`npm run preview` serves `dist/`, not your source files directly. Run:

```text
npm run build
npm run preview
```

If another preview process is using the port, stop it or use the new address printed by Vite.

## GitHub Pages shows an old or broken site

Check:

1. the pull request was merged into the branch watched by deployment;
2. the CI and deploy Actions runs passed;
3. the Pages artifact was uploaded;
4. the Pages environment is configured;
5. the URL is correct for a project site versus an organization site;
6. `BASE_PATH` matches the URL shape;
7. the browser cache is not hiding the new version.

Do not commit `dist/` as a workaround. Inspect the workflow logs and the generated artifact instead.

## CI fails but local validation passes

Compare environments:

- CI uses `npm ci`, not an arbitrary local dependency tree;
- CI uses Node.js LTS;
- CI starts from a clean checkout;
- CI may run additional security workflows;
- a public repository may have permissions or Pages settings your local machine cannot reproduce.

Read the failing job’s first error and include its run link in the pull request conversation.

## Dependency or Dependabot change

Do not blindly merge a dependency update. Read the changelog, inspect the lock-file diff, run `npm run validate`, and check whether the package changes Markdown rendering, HTML handling, build output or workflow security.

A dependency PR may be mechanically valid while still needing a human security or compatibility review.

## When to stop troubleshooting yourself

Stop and ask a maintainer or specialist when:

- the problem involves a credential, private URL or confidential file;
- Git history needs rewriting;
- a workflow permission or action pin must change;
- licensing is unclear;
- a public metric or project status is disputed;
- the fix would add a framework, service or dependency;
- you cannot explain what the proposed fix changes.
