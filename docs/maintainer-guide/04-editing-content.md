# 04 — Edit articles and editorial data

## Learning goal

You will learn how the content system works and how to add or correct a post without touching the application code.

## “Content as code” in this repository

The site does not use a CMS or database. Articles are plain-text Markdown files committed to the repository. That gives every article:

- a visible history;
- pull-request review;
- reproducible builds;
- a clear owner;
- a place for sources and dates.

The trade-off is that a content editor needs a basic Git workflow and must run the checks.

## Where posts live

Create or edit files only under:

```text
src/content/posts/
```

The filename is useful for humans, but the public route normally comes from the `slug` in the front matter. Use lowercase letters, numbers and hyphens for both. Avoid changing a published slug casually because links may already use it.

## Front matter: the information above the article

Each post begins with a small metadata block between two lines containing three hyphens:

```markdown
---
slug: a-short-slug
title: A clear, useful title
deck: One sentence that tells readers why this is useful.
date: 2026-09-11
category: Guide
readTime: 5 min read
tags: [Onboarding, Contribution]
featured: false
---
```

The fields mean:

| Field | Meaning | Safe practice |
| --- | --- | --- |
| `slug` | URL-friendly identifier used after `#/post/` | Keep it short, lowercase and unique |
| `title` | Article heading | Say what the reader will gain |
| `deck` | Short description shown on cards | One clear sentence |
| `date` | Editorial date used for sorting and display | Use `YYYY-MM-DD` |
| `category` | Library grouping | Use `Guide`, `Field note`, `Story`, `Report` or `Announcement` exactly |
| `readTime` | Display text, not a calculation | Examples: `4 min read`, `10 min read` |
| `tags` | Comma-separated list inside brackets | Keep labels short and consistent |
| `featured` | Whether the post can be selected for the home feature area | Use `true` or `false` |

The parser in `src/content.ts` is intentionally small. It is not a full YAML parser. Keep metadata on one line per field and use the simple array format shown above. Do not add nested YAML, multi-line metadata, comments inside the metadata block or untested custom types.

The validator requires all eight fields, checks duplicate slugs and rejects several unsafe/internal patterns. It does **not** prove that a claim is accurate, that a date is real, that a category is spelled correctly or that a public-release decision exists. Human review remains necessary.

## Write the article body in Markdown

Markdown is plain text with a few conventions:

```markdown
## A section heading

A paragraph can contain **bold text**, *emphasis* and [a link](https://example.com).

- A bullet point
- Another bullet point

1. A numbered step
2. The next step

> A quotation or important note.

```text
A code or command example
```
```

Useful habits:

- Leave a blank line between paragraphs and lists.
- Use one `#` heading only if the rendering design expects it; article titles already come from front matter, so body sections normally start at `##`.
- Use descriptive link text instead of “click here.”
- Link only to public, approved destinations.
- Write dates and metric definitions explicitly when the content could become stale.
- Explain limitations instead of implying certainty.

The application passes article Markdown through `marked` and then `DOMPurify`. This protects readers from many unsafe HTML patterns, but it is not permission to paste unreviewed HTML or confidential text.

## Add a new post: complete procedure

### 1. Decide whether a post is the right format

Use a post for a guide, field note, story, report or announcement that belongs in the public OSPO library. Use the repository documentation for maintenance instructions. Use an issue first if the idea, owner or public-release approval is not yet clear.

### 2. Create the file

Example filename:

```text
src/content/posts/contribution-office-hours.md
```

Copy the front matter template and fill every field.

### 3. Write for the intended reader

State:

- the problem or question;
- the context a newcomer needs;
- the practical lesson or evidence;
- what is known and what is not known;
- the next step for the reader.

Avoid assuming that every reader knows Amadeus internal processes, GitHub vocabulary or the project history.

### 4. Validate immediately

Run:

```text
npm test
```

Typical failures:

- missing `---` delimiters;
- missing one of the eight fields;
- a slug already used by another post;
- an unsafe or internal-link pattern in the source.

### 5. Preview the real result

Run:

```text
npm run dev
```

Open the Library, filter by the category, open the new post and check:

- title and deck;
- date and read time;
- tags;
- headings and lists;
- links;
- code blocks;
- mobile layout;
- browser console for errors.

### 6. Run the complete check

```text
npm run validate
```

### 7. Review the public claim

Before opening a pull request, record the source, owner and capture date for every material claim. If the source is an internal document, do not copy it into public content until the publication decision and any legal/IP/security review are complete.

## How posts appear on the site

At build time, `src/content.ts`:

1. discovers all `.md` files in `src/content/posts/`;
2. parses the simple front matter;
3. uses the filename as a fallback slug;
4. applies fallbacks for missing values during rendering;
5. sorts posts by date, newest first;
6. exposes the result as the `posts` array;
7. renders the article body only when a reader opens a post.

The home page’s `renderFeatured()` function chooses the first `featured` post in the already date-sorted list as the primary feature, then shows two supporting posts. Keep the number of featured posts intentional; do not assume every `featured: true` post will appear as a large feature.

## Update news and reports

News and report cards are not Markdown posts. They are fixed arrays in `src/content.ts`:

- `news: NewsItem[]` powers the “Notes from the open” list on the home page;
- `reports: Report[]` powers the “Reports & briefs” cards in the Library.

To update one:

1. edit the relevant object in `src/content.ts`;
2. keep the TypeScript fields and allowed status/type values correct;
3. use public links and approved wording;
4. run `npm run validate`;
5. inspect the home page or Library in a browser.

A news item needs a hash route or public URL in `href`. A report card is currently informational; it does not automatically link to a report file.

## Keep editorial facts honest

The repository contains draft evidence and working snapshots. A good public sentence distinguishes:

- **observed:** directly captured from a stated source at a stated date;
- **reported:** supplied by a draft or stakeholder and still needing confirmation;
- **interpreted:** a human synthesis rather than a new measurement;
- **pending:** awaiting an owner, approval, refresh or specialist check.

Do not turn an approved proposal into a published project, a fork into an Amadeus-led project, or a contribution count into a claim about community health without evidence.

## Content mistakes to avoid

| Mistake | Result | Prevention |
| --- | --- | --- |
| Reusing a slug | Duplicate-route ambiguity and validator failure | Search existing `slug:` values first |
| Using a capitalised or misspelled category | Filters may not include the post | Copy one of the five supported category names |
| Putting a colon-heavy or multi-line value in front matter | The simple parser may interpret it unexpectedly | Keep metadata simple; move detail into the body |
| Pasting internal links | Public-content validation or review failure | Use approved public sources only |
| Linking to `.memories/` | The link will not exist on the public site | Convert the evidence into approved public references or omit it |
| Setting every post to `featured: true` | The home page loses editorial hierarchy | Choose a primary feature deliberately |
| Editing `dist/` | The next build overwrites the change | Edit source files instead |
