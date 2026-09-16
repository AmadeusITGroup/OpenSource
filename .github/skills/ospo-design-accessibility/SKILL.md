---
name: ospo-design-accessibility
description: "Review or change the OSPO site's visual design using Amadeus Design Factory and brand guidance. Use for UI review, UX review, accessibility, responsive layout, CSS, Design Factory tokens, wordmark, illustration, keyboard navigation, color contrast, presentation design, or visual regression checks."
argument-hint: "Name the page, component or design concern"
---

# OSPO design and accessibility

Keep the editorial experience recognizable, accessible and maintainable without introducing a new UI stack.

## Procedure

1. Read `docs/maintainer-guide/05-maintaining-the-site.md`, `docs/maintainer-guide/06-maintaining-presentations.md` when relevant, and [the design checklist](./references/design-checklist.md).
2. Inspect the current implementation before proposing changes. Reuse existing patterns and Design Factory tokens.
3. Keep the official wordmark file unchanged. Never crop, recolor, stretch, rotate, mask or decorate it; keep descriptors outside its clear space.
4. For meaningful visuals, connect the illustration to a real OSPO practice and provide concise accessible meaning. Avoid generic networks, orbiting shapes and decorative technology motifs.
5. Verify semantic structure, heading order, descriptive links, image alternatives, keyboard operation, visible focus, reduced motion and information that does not depend on color alone.
6. Inspect Home, Story, Start, Library, a post and changed presentations at 320 px, around 768 px and at least 1280 px. Check horizontal overflow and browser-console errors.
7. Run `npm run build`, then `npm run validate` before handoff.
8. Report objective findings separately from design preferences and identify anything requiring a brand, communications or accessibility specialist.

## Architecture boundary

Use `@design-factory/tokens` through `src/style.css`. Do not add Angular, Bootstrap, the full Design Factory component stack or a new framework for a local visual change.
