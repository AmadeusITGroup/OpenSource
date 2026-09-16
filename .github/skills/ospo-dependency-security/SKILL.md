---
name: ospo-dependency-security
description: "Review dependency, lockfile, GitHub Actions or security-sensitive changes in the OSPO landing page. Use for Dependabot PR, npm update, vulnerability, package.json, package-lock, workflow update, action SHA, DOMPurify, marked, escapeHtml, sanitizer, SBOM, CodeQL, or supply-chain review."
argument-hint: "Name the dependency, advisory or workflow change"
---

# OSPO dependency and security review

Explain risk and compatibility without weakening controls or claiming a security approval.

## Procedure

1. Read `SECURITY.md`, `docs/maintainer-guide/08-security-and-publication.md`, the changed manifest/workflow files and [the review checklist](./references/review-checklist.md).
2. Determine whether the change affects runtime rendering, Markdown parsing/sanitization, build tooling, deployment permissions or only development tooling.
3. For dependency changes, inspect both `package.json` and `package-lock.json`; identify direct/transitive changes, release notes, breaking behavior and known advisories.
4. Treat `marked`, `DOMPurify`, dynamic HTML, `escapeHtml()`, validation patterns and Vite as high-attention paths.
5. For Actions, preserve least privilege, `persist-credentials: false`, explicit permissions and immutable commit-SHA pins. Verify the comment identifies the intended upstream release.
6. Run `npm ci`, `npm run validate`, `npm audit --audit-level=high` and an SBOM generation check when dependencies change.
7. Review the diff for unexpected lifecycle scripts, registries, package sources, workflow triggers, secrets access or permission expansion.
8. Report risk, evidence, compatibility checks, rollback and the security/engineering review still required.

## Incident boundary

If a credential or vulnerability may already be public, do not open a public issue or paste details into a PR. Follow `SECURITY.md` and request credential revocation/rotation immediately where relevant.
