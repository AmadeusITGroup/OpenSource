# Security Policy

## Supported versions

This repository publishes the current `main` branch as a static GitHub Pages site. There are no versioned software releases at this time.

| Version | Supported |
| --- | --- |
| `main` / current published site | Yes |
| Older unpublished revisions | No |

## Reporting a vulnerability

Please do **not** report security vulnerabilities through public GitHub issues or pull requests.

Report them privately to **opensource@amadeus.com** with:

- a description of the issue;
- the affected file, page or workflow;
- reproduction steps or a proof of concept;
- the potential impact; and
- any suggested mitigation.

This repository is a static site, so relevant reports may include cross-site scripting or unsafe Markdown rendering, exposed confidential content, dependency vulnerabilities, compromised build actions, or accidental publication of credentials.

The shared OSPO mailbox is the current reporting route. A GitHub private vulnerability-reporting workflow may be enabled when the target repository is created and configured.

## What to expect

The initial project target is to acknowledge a report within five business days and communicate next steps as soon as practical. This is a proposed repository target, not an Amadeus-wide SLA. Response and disclosure timing will depend on severity, affected systems and coordination requirements.

Please allow the maintainers to investigate and coordinate a fix before public disclosure.

## Security practices

- Keep dependencies and GitHub Actions updated.
- Do not commit secrets, private data or internal documents.
- Keep `.tmp/`, `.memories/`, `.env` and `.env.*` outside public commits.
- Review public Markdown as rendered HTML, not only as source text.
- Require review for changes to `.github/workflows/`, `src/content/` and publication metadata.
