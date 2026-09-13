# 08 — Protect the public boundary

## Learning goal

You will learn how to decide whether material belongs in this repository, when a change needs specialist review, and what to do if something sensitive is exposed.

## Public is a deliberate status

A public GitHub repository may be copied, indexed, cached, forked, screenshotted and read by people outside Amadeus. “It is only a draft” is not a sufficient reason to publish it.

Before adding content, ask:

1. Is the source approved for public use?
2. Does it contain personal data, private repository names, internal URLs, credentials, invention-disclosure material or confidential business/technical information?
3. Are the names, metrics, dates, project status and ownership still accurate?
4. Is the licence compatible with the intended publication?
5. Does the content need OSPO/editorial, project, legal/IP, security, communications or accessibility review?
6. Can a reader verify the important claims from public sources?

If any answer is uncertain, pause and ask the appropriate owner.

## The local/public boundary in this repository

The working folders `.tmp/` and `.memories/` are ignored by `.gitignore`. They contain research and evidence material that must not be published.

That ignore rule helps prevent accidental staging; it does not prevent:

- manually forcing a file into Git;
- copying private text into a tracked Markdown file;
- adding a link that exposes an internal URL;
- including a private path in a presentation;
- leaving sensitive data in commit history.

Treat the boundary as a content and process decision, not just a Git setting.

## Security-sensitive changes

Ask for security review before changing:

- `DOMPurify` usage or Markdown rendering;
- `escapeHtml()` or dynamic HTML generation;
- content validation forbidden patterns;
- `.github/workflows/` permissions or action references;
- dependency versions or package sources;
- public links to security, infrastructure or internal systems;
- any file that could expose credentials or confidential material.

The Markdown safety chain is:

```text
Markdown source
      │
      ├── validator rejects selected unsafe/internal patterns
      │
      ├── marked parses Markdown into HTML
      │
      └── DOMPurify sanitises the rendered HTML
```

Do not remove a layer because a post is “trusted.” Public repositories have multiple contributors and durable history.

## Licensing and attribution

The repository declares Apache License 2.0 for its original code, documentation and presentation materials unless a file says otherwise. `NOTICE` explains that third-party names, trademarks, fonts, linked documents and external content remain subject to their own terms.

Before adding an image, font, quote, chart, report excerpt or copied text:

- identify the source;
- check its licence or permission;
- record attribution where required;
- check whether modification and redistribution are allowed;
- involve legal/IP reviewers when unclear.

A public URL does not automatically mean that its contents can be copied into this repository.

## Public claims and evidence

For metrics, project stories and historical statements, keep a small evidence record with:

- the exact claim;
- the source URL or approved source reference;
- the date captured;
- the population and scope counted;
- the owner who can confirm it;
- limitations and known uncertainty;
- the next refresh date if the claim can change.

Use careful wording:

- “captured on…” for a dated observation;
- “the draft report states…” for unvalidated supplied material;
- “we interpret this as…” for synthesis;
- “pending validation” when approval or refresh is incomplete.

Do not make a number sound live when it is a dated snapshot.

## Review responsibilities

The repository’s governance documents describe these areas:

| Area | Typical reviewer |
| --- | --- |
| Code, build and publication workflow | Code owner |
| Editorial voice and OSPO story | OSPO/community editorial owner |
| Project facts and technical scope | Project maintainer or story owner |
| Metrics and reports | Evidence owner plus OSPO/editorial reviewer |
| Licensing and third-party material | Legal/IP specialist |
| Security, dependencies and workflows | Security or engineering specialist |
| Layout, semantics and keyboard behaviour | Accessibility-aware reviewer |

The current backup and specialist ownership model is still to be confirmed. Do not invent an owner in a public file.

## If you see a suspected vulnerability

Do not open a public issue or paste sensitive details into a pull request. Follow `SECURITY.md`:

- email `opensource@amadeus.com` privately;
- describe the affected file/page/workflow;
- provide reproduction and impact information;
- suggest mitigation if known;
- allow maintainers to coordinate the response.

If a credential may be exposed, request revocation or rotation through the credential owner immediately. Do not include the credential in the report.

## If sensitive material was committed

Deleting it in a later commit is not enough. Stop and escalate. Security or repository administrators may need to rotate credentials, remove history, assess copies and coordinate disclosure.

Do not run destructive history-rewriting commands on a shared branch without explicit direction from the repository administrators.

## Publication review for the current draft

Before the site is presented as publicly launched, review especially:

- target GitHub repository and Pages URL;
- contact and GitHub links;
- project and contributor stories;
- draft metrics and dates;
- references to local evidence paths;
- presentation bylines and claims;
- confirmed owners and code reviewers;
- licence and third-party assets;
- branch protection and GitHub security settings.

The repository currently documents several of these as pending. That is useful honesty; keep the pending status visible until the decision is made.
