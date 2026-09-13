# 03 — Use Git and GitHub safely

## Learning goal

You will learn the smallest useful set of Git and GitHub concepts for maintaining this repository without accidentally publishing work or bypassing review.

## Git concepts without jargon

- A **working tree** is the copy of the repository on your computer.
- A **change** is a difference between your working tree and the last recorded version.
- A **commit** is a named checkpoint in local history.
- A **branch** is a separate line of work. It lets you work without changing `main` immediately.
- A **remote** is the hosted repository address, usually on GitHub.
- A **push** sends commits from your computer to the remote.
- A **pull request** asks people and automation to review a proposed branch before it is merged.
- **Merge** incorporates an approved pull request into another branch, normally `main`.
- `main` is the branch that the deployment workflow watches. Treat it as publishable.

A useful picture is:

```text
your branch → commit → push → pull request → checks/review → merge to main → GitHub Pages
```

Git is not the same as GitHub. Git works locally; GitHub hosts a copy and adds review, permissions and Actions.

## Inspect before you edit

Start every session with:

```text
git status
git branch --show-current
git remote -v
```

`git status` tells you whether you have uncommitted changes. If it shows changes you do not recognise, stop and ask the person who made them before editing.

`git branch --show-current` tells you which branch you are on.

`git remote -v` tells you where pushes would go. Confirm the owner and repository before pushing. A remote URL is an operational detail, not proof that you have permission to publish.

## Create a working branch

Use a short name that describes one focused change:

```text
git switch -c docs/beginner-maintainer-guide
```

Examples:

- `content/add-project-story`
- `docs/update-setup-guide`
- `fix/mobile-library-layout`
- `chore/update-dependency`

If your Git version does not support `switch`, the older equivalent is `git checkout -b <branch-name>`.

## Make one focused change

Keep a pull request easy to understand. A content correction, a style adjustment and a workflow change normally deserve separate changes unless they are inseparable.

After editing, inspect the differences:

```text
git diff --check
git diff
```

`git diff --check` finds whitespace errors. `git diff` shows exactly what changed. Read it as if you were a reviewer.

For a new untracked file, `git diff` does not show the file until it is staged. Use `git status` and open the file directly as well.

## Stage and commit

Staging chooses which changes belong in the next commit:

```text
git add docs/maintainer-guide README.md
```

Review the staged version:

```text
git diff --cached
```

Then create a commit:

```text
git commit -m "docs: add beginner maintainer guide"
```

A commit message should describe the result, not the hours spent. Do not include confidential information in a commit message; commit history is durable.

## Push and open a pull request

The first push of a new branch normally looks like:

```text
git push -u origin docs/beginner-maintainer-guide
```

Open the branch on GitHub and create a pull request into `main`. The repository supplies a pull-request template. Complete it rather than deleting its review questions.

Include:

- what changed;
- why it is needed;
- how you validated it;
- public sources and dates for new claims;
- whether legal/IP, security, accessibility or specialist review is needed.

The initial code owner is `@wherka-ama`. Changes under the paths listed in `.github/CODEOWNERS` should request that review. Future maintainers should update `CODEOWNERS`, `MAINTAINERS.md` and `GOVERNANCE.md` together when ownership changes.

## Checks are part of review

The pull request can run GitHub Actions such as:

- content validation, TypeScript checking, Vite build and npm audit;
- dependency review;
- CodeQL analysis;
- OpenSSF Scorecard.

A green check means that a specific automated check passed. It does not mean the text is factually approved or safe to publish. Human review still matters.

## Safe ways to undo local work

If you edited a file but have not committed it and want to discard only that file:

```text
git restore path/to/file
```

If you staged a file but want to unstage it while keeping the edit:

```text
git restore --staged path/to/file
```

Be careful with commands that rewrite history, such as `git reset --hard`, `git clean`, force-push and branch deletion. Ask a maintainer first, especially if a commit was pushed.

## If you accidentally commit sensitive information

Do not assume that deleting the file in a later commit solves the problem. The original commit remains in Git history and may already have been copied.

1. Do not push further changes that spread the material.
2. Contact the repository security route immediately: `opensource@amadeus.com`.
3. If a credential was exposed, ask the credential owner to revoke or rotate it.
4. Preserve enough context for the security response, but do not repeat the secret in a ticket or chat.

## What “merge to main” means here

The deployment workflow runs on pushes to `main`. Merging a pull request can therefore publish the site after the Pages workflow succeeds. Treat merge approval as publication approval, not merely code integration.

Before merge, verify:

- the final rendered content is correct;
- claims have owners and sources;
- links do not point to private or internal material;
- the relevant review has happened;
- validation is green;
- no ignored working material was staged.
