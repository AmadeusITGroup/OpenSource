# OSPO maintainer skills

These repository-local skills turn recurring maintenance work into guided workflows. In VS Code Chat, type `/` and choose a skill, or describe the task naturally.

| Skill | Use it when you want to… |
| --- | --- |
| `ospo-maintainer` | work out where to start and get a guided handover |
| `ospo-content-authoring` | add or edit a post, news item, report card or public copy |
| `ospo-publication-review` | check claims, sources, privacy, legal/IP and public-release readiness |
| `ospo-design-accessibility` | review Design Factory alignment, branding, responsive design or accessibility |
| `ospo-site-validation` | run build, content, browser, presentation and release checks |
| `ospo-dependency-security` | review npm, lockfile, workflow or rendering-security changes |
| `ospo-evidence-refresh` | refresh and validate organization, Board and contributor evidence |

Skills automate preparation and verification. They do not replace accountable human approval for publication, facts, project status, legal/IP, privacy, security or brand exceptions.

The repository runs `scripts/validate-skills.mjs` through `npm test` to verify each skill's metadata and linked resources.
