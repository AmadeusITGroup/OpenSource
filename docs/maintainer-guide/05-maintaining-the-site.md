# 05 — Maintain the site code and design

## Learning goal

You will learn enough HTML, CSS and TypeScript vocabulary to make small safe changes and to explain a larger change to a specialist.

## Three languages, three jobs

### HTML: structure and meaning

HTML describes what a page contains: headings, paragraphs, links, buttons, navigation, articles and lists.

Examples from this project include:

- `<header>` for the site header;
- `<nav>` for navigation;
- `<main>` for the active page content;
- `<article>` for a post or card;
- `<button>` for the mobile menu and Library filters;
- `<a>` for links.

Semantic HTML helps screen readers, keyboard users and maintainers understand the page. Do not replace a button with a clickable `<div>` just because it is visually convenient.

### CSS: appearance and layout

CSS controls colours, fonts, spacing, borders, responsive layout and hover/focus states. This site uses one global stylesheet, `src/style.css`, with no CSS framework.

The stylesheet imports Amadeus Design Factory v22 CSS tokens from `@design-factory/tokens`. Local aliases near the top of the file, such as `--ink`, `--paper`, `--coral`, `--mint` and `--shell`, keep the existing component CSS readable while resolving visual decisions through Design Factory tokens. Changing an alias can affect many pages, so inspect the whole site after a global change.

The stylesheet follows Design Factory and Bootstrap breakpoints at `992px` and `576px`. Always inspect a desktop and narrow viewport after changing a grid, button or navigation rule.

Do not install `@design-factory/design-factory` or `@design-factory/angular` unless the project has separately approved an Angular migration. Do not import the full `@design-factory/styles` bundle for a small visual change: it brings a wider Bootstrap and component-library dependency surface. Prefer an existing token and the smallest local selector change.

### TypeScript: behaviour and data

TypeScript is JavaScript with additional checks. In this project it:

- chooses the page from the hash route;
- creates page HTML strings;
- imports post data;
- escapes dynamic text;
- attaches the mobile menu and Library filters;
- renders Markdown safely.

You do not need to memorise TypeScript syntax. Look for the function that owns the visible behaviour you want to change.

## `index.html`: the shell

`index.html` contains the document metadata and:

```html
<div id="app"></div>
<script type="module" src="/src/main.ts"></script>
```

`#app` is an empty mounting point. `main.ts` fills it after the browser loads the module.

The `<head>` contains the page title, description, theme colour and social preview metadata. Update these when the public identity or purpose changes. Keep the metadata factual and public-safe.

## `src/main.ts`: the page renderer

The file has four broad responsibilities:

1. **Route reading** — `getRoute()` reads `window.location.hash`.
2. **HTML rendering** — functions such as `renderHome()`, `renderStory()`, `renderStart()`, `renderLibrary()` and `renderPost()` return HTML strings.
3. **Shared framing** — `renderHeader()` and `renderFooter()` wrap every page.
4. **Interactions** — `bindInteractions()` attaches event listeners after each render.

### Rendering flow

The key flow is:

```text
hashchange or initial load
          │
          ▼
       render()
          │
          ├── getRoute()
          ├── choose a page renderer
          ├── app.innerHTML = header + main + footer
          └── bindInteractions()
```

When a hash link changes, the browser does not request a new HTML document. The `hashchange` event calls `render()` again.

### Shared helpers

- `escapeHtml()` protects dynamic text inserted into HTML strings.
- `formatDate()` turns ISO-like dates such as `2026-09-10` into readable dates.
- `renderPill()` renders a tag.
- `renderPostCard()` renders a reusable article card.
- `renderMarkdown()` is imported from `src/content.ts` and sanitises the article body.

If you add a new dynamic value to an HTML string, ask whether it came from content or user-controlled input. Use `escapeHtml()` for plain text. Do not bypass sanitisation for Markdown.

### Adding or changing a route

For a new route, a specialist should update all of these deliberately:

1. the `Route` type;
2. `getRoute()`;
3. the page selection in `render()`;
4. header active-state logic if needed;
5. navigation links or cards;
6. the page renderer;
7. browser and mobile checks.

A route is not complete if a page exists but no user can reach it.

### Current route quirks

The current `getRoute()` treats an unknown hash as the home route. Although `renderNotFound()` exists, it is not used for every unknown hash. Also, a post route with an unknown slug currently falls back to the first post. Treat these as existing behaviour; do not promise a 404 unless the routing code is intentionally changed and tested.

## `src/content.ts`: the content data layer

This file defines the TypeScript shapes for:

- `Post` — article metadata and body;
- `NewsItem` — home-page update rows;
- `Report` — Library report cards;
- `ContentType` — allowed post category names.

It also:

- discovers Markdown files with Vite’s glob import;
- parses the simple front matter;
- sorts posts by date;
- configures `marked` for GitHub-Flavoured Markdown;
- sanitises rendered HTML with `DOMPurify`;
- exports the fixed `news` and `reports` arrays.

A type such as `Post` describes the expected shape of data. It does not automatically validate every value at runtime. That is why content validation and human review are both needed.

## `src/style.css`: the design system

The stylesheet is organised as a set of reusable patterns:

- the Design Factory token import and local aliases in `:root`;
- global element defaults;
- shared shells, buttons, links and typography;
- page-specific sections;
- responsive media queries;
- reduced-motion support.

Useful classes include:

- `.section-shell` — shared content width;
- `.button`, `.button-primary`, `.button-quiet` — button styles;
- `.post-card` — article cards;
- `.site-header`, `.site-nav`, `.site-footer` — shared framing;
- `.sr-only` — visually hidden but screen-reader-readable text.

When making a visual change:

1. change the smallest selector possible;
2. use an existing `--df-*` token instead of adding a hardcoded colour, spacing value or radius;
3. avoid changing a global alias unless the whole site should change;
4. check keyboard focus and hover states;
5. inspect at wide, medium and narrow widths;
6. test reduced-motion behaviour if you touched transitions or animation.

### Content-led illustrations

The home-page illustrations are diagrams built with semantic HTML and Design Factory tokens. They explain two ideas that are central to this site: how a first contribution moves from a question through review to shared learning, and how the OSPO connects people with guidance and open source outcomes.

Keep illustrations tied to a specific part of the OSPO story. Prefer recognizable open source practices, such as a focused change, review, upstream contribution or documented decision, over generic networks, orbiting shapes or decorative technology motifs. Use the existing Design Factory palette, spacing and radius tokens. Do not place the Amadeus wordmark inside an illustration or use it as a decorative graphic.

If an illustration communicates meaning, give its container `role="img"` and a concise `aria-label`. Hide the internal decorative markup from assistive technology. The label should explain the idea rather than list every visible shape or colour.

## Images and public assets

`src/assets/hero.png` is an application asset location. An asset imported by TypeScript or CSS is processed by Vite.

`public/` is for files that should be copied to the built site with their public path, such as `robots.txt` and the SVG favicon.

Use a clear rule:

- If the asset is part of a component and can be imported, prefer `src/assets/`.
- If it must be available at a stable root path, use `public/`.

Before adding an image, confirm its licence, source, accessibility text, file size and public-release approval.

`src/assets/amadeus-wordmark-dark-sky.svg` is the official Dark Sky RGB wordmark supplied through the Amadeus Brand Guidelines. Do not crop, recolour, stretch, rotate or add effects to it. Its SVG canvas includes the required clear space, and the site renders it large enough to keep the visible wordmark above the recommended 32 px digital height. The downloaded source package and guidelines are kept locally under `.tmp/resources/` and are intentionally excluded from Git.

## `vite.config.ts`: how the build is assembled

The Vite configuration:

- sets `base` from `BASE_PATH` or `/`;
- defines three build inputs: `index.html`, `presentation.html` and `presentation-short.html`.

Do not remove a presentation from the input list just because the main app does not import it. The list is what makes it part of the production build.

## `tsconfig.json`: TypeScript guardrails

The configuration targets modern JavaScript and browser APIs, uses bundler-style module resolution and turns on useful checks such as:

- no unused local variables or parameters;
- no fall-through in `switch` statements;
- no emitted JavaScript from TypeScript (`noEmit: true`);
- DOM and ES2023 library types.

When `npm run build` reports a TypeScript error, read the file and line named in the output. Do not silence the error by weakening the configuration unless a specialist agrees.

## A small change example: changing a fixed page message

For a sentence that is always visible on a page:

1. locate the relevant `render...()` function in `src/main.ts`;
2. edit only the text inside the template string;
3. keep HTML tags balanced;
4. run `npm run validate`;
5. inspect the route in a browser;
6. check the source is public-safe and factually approved.

For a sentence that belongs in an article, prefer a Markdown post instead of adding more hardcoded text to `main.ts`.

## When not to make a code change

Do not add a framework, CMS, database or new build dependency merely to solve a small editorial problem. The current design is intentionally lightweight. Propose an architectural change only when the maintenance problem is real, documented and reviewed.
