# Dependency and workflow review checklist

## npm changes

- Explain why the dependency is needed and whether it runs in the browser, build or development only
- Check direct and transitive diff in `package-lock.json`
- Review upstream release notes and advisories from an official source
- Look for package source, integrity, lifecycle-script and maintainer changes
- Retest Markdown rendering when `marked` or `DOMPurify` changes
- Generate `npm sbom --sbom-format cyclonedx --sbom-type application`
- Keep `npm audit --audit-level=high` green or document an approved exception

## GitHub Actions

- Keep actions pinned to full commit SHAs with a release comment
- Keep explicit least-privilege `permissions`
- Preserve `persist-credentials: false` unless a reviewed write operation requires otherwise
- Review `pull_request_target`, write tokens, artifact input, shell interpolation and third-party action provenance carefully
- Treat scheduled or cross-repository evidence collection as access to potentially personal/internal data

## Rendering and validation

- Preserve `marked` → `DOMPurify` for Markdown
- Preserve `escapeHtml()` for dynamic plain text
- Do not relax forbidden-content patterns to make a check pass
- Add a regression check when fixing a validation or sanitization gap

## Handover

Report risk level, affected surface, upstream evidence, commands run, behavior checked, remaining warnings, rollback and required human reviewer.
