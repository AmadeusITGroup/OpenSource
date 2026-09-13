# 06 — Maintain the presentations

## Learning goal

You will learn how the two presentation files differ from the main site and how to edit them without accidentally breaking slide navigation or publication claims.

## The two decks

| File | Purpose | Current shape |
| --- | --- | --- |
| `presentation.html` | Full Board narrative | 19-slide self-contained deck about the journey, evidence, people, governance and publishing framework |
| `presentation-short.html` | Short announcement briefing | 7-slide, approximately five-minute deck for the public-front-door announcement |

Both are plain HTML files. They contain their own:

- `<head>` metadata;
- CSS inside a `<style>` element;
- slide sections;
- navigation controls;
- small JavaScript navigation script.

They do not use the main site’s `src/main.ts` or `src/style.css`.

## How a slide works

A slide is a `<section>` with the class `slide`:

```html
<section class="slide" data-title="A short title">
  ...slide content...
</section>
```

Only one slide has `is-active` at a time. The embedded script:

1. finds all `.slide` elements;
2. numbers them;
3. creates navigation dots;
4. shows one slide at a time;
5. responds to the buttons and keyboard arrows.

Use:

- `ArrowRight` or the right button for the next slide;
- `ArrowLeft` or the left button for the previous slide;
- `Home` for the first slide;
- `End` for the last slide;
- the space bar for the next slide.

The HTML includes print rules so a browser print action can produce one slide per page.

## Safest way to edit a slide

For a wording or source correction:

1. search for a distinctive sentence or slide `data-title`;
2. edit the text, not the surrounding structure;
3. preserve the slide’s class and `data-title`;
4. preserve public source links and their dates;
5. run `npm run build`;
6. open the generated presentation in a browser;
7. click through every slide and test keyboard navigation;
8. check a narrow viewport and print preview if the layout changed.

The files use long lines for compact slide markup. Do not reformat the entire file just to change one sentence; doing so creates a noisy pull request and makes review harder.

## Choosing the right deck

Use the long deck when the audience needs:

- the historical journey;
- the Manifesto and principles;
- evidence definitions and caveats;
- the Board case mix;
- project pathways;
- the public-report framework;
- a detailed decision ask.

Use the short deck when the audience needs:

- the announcement;
- a short journey summary;
- the purpose of the public landing page;
- a compact three-step ask.

Do not copy a draft metric from one deck to the other without checking its source, date, population and publication status. A slide deck is a publication surface, not a private scratchpad once it is committed.

## Evidence labels matter

The long deck deliberately distinguishes:

- observed facts captured from a source;
- reported figures from supplied drafts;
- interpretations that combine evidence;
- pending claims awaiting approval or refresh.

Keep those labels when editing. If a figure is not current or approved, say so on the slide or remove it. Never improve the appearance of a number by hiding its caveat.

## Presentation-specific checks

For each deck, check:

- the title and date are correct;
- author/byline information is approved;
- every external link is public and valid;
- no private path, internal URL or confidential project name appears;
- slide count and slide numbers agree;
- the first slide fits without clipping;
- content does not overflow on a narrow screen;
- controls have accessible labels;
- keyboard navigation still works;
- print output remains usable.

The full build includes both files because they are listed in `vite.config.ts`. A change can therefore break the production build even when the main site looks unchanged.

## Avoid accidental branding or factual drift

The presentation files contain custom visual treatments and self-contained styles. Do not introduce a logo, mark, font or claim from an unapproved source. For Amadeus branding, use approved assets and guidance rather than inventing a new mark.

If a slide references local evidence such as `.memories/`, that is a draft-workflow reference and is not a public URL. Before launch, replace it with an approved public method/source or remove the reference.
