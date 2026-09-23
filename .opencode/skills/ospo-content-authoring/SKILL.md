---
name: ospo-content-authoring
description: "Create, edit or review OSPO public content in this repository. Use for add a post, write an article, update news, add a report card, edit site copy, improve a title or deck, calculate read time, choose frontmatter, or prepare Markdown for the Library."
argument-hint: "Describe the content, audience and approved sources"
---

# OSPO content authoring

Create useful public content without requiring the maintainer to understand TypeScript or the frontmatter parser.

## Before writing

1. Read `docs/maintainer-guide/04-editing-content.md`, `docs/maintainer-guide/08-security-and-publication.md` and [the editorial checklist](./references/editorial-checklist.md).
2. Identify audience, reader need, next action, content type, owner and approved public sources.
3. If facts come from `.tmp/`, `.memories/`, a private repository or an internal document, invoke `ospo-publication-review` before drafting public copy.
4. If the content includes figures, invoke `ospo-evidence-refresh` when captures are stale or scopes do not match.

## Create a post

1. Search existing `src/content/posts/*.md` for duplicate topics, slugs and tags.
2. Copy [the post template](./assets/post-template.md) to `src/content/posts/<slug>.md` and replace every placeholder.
3. Use one of: `Guide`, `Field note`, `Story`, `Report`, `Announcement`.
4. Keep the title useful, the deck to one clear sentence, headings in sentence case and links descriptive out of context.
5. Structure the body around the reader's question, essential context, practical guidance/evidence, limitations and next step.
6. Use `featured: true` only after checking the existing editorial hierarchy.

## Update fixed editorial data

For home news or Library report cards, edit only the typed `news` or `reports` arrays in `src/content.ts`. Do not add a new content system for a small update.

## Review and validate

1. Apply Amadeus voice: enthusiastic without hype, genuine, expert without superiority, and simple.
2. Flag every unsupported claim; never invent a source, owner, result or approval.
3. Run `npm test`, inspect the Library/post route in a browser at wide and narrow widths, then run `npm run validate`.
4. Hand off the draft with sources, capture dates, evidence class, open approvals and refresh needs.
