# Design Factory, brand and accessibility checklist

## Design system

- Resolve colors, spacing, typography, radii, states and shadows through existing `--df-*` tokens or documented local aliases
- Reuse `.section-shell`, buttons, links, cards and established breakpoints before creating variants
- Do not add a framework or full component library for a local change
- Keep content readable with translations that may be about 30% longer

## Amadeus brand

- Use only the official wordmark in `src/assets/amadeus-wordmark-dark-sky.svg`
- Preserve its SVG canvas, aspect ratio, clear space and minimum visible size
- Keep product descriptors separate from the artwork
- Do not crop, recolor, rotate, stretch, outline, mask, shadow or combine the mark with another lockup
- Keep public copy enthusiastic, genuine, expert and simple

## Accessibility

- Use landmarks, native controls and logical heading order
- Keep links descriptive and buttons action-led
- Provide a skip link, visible focus and keyboard access
- Do not communicate status through color alone
- Use concise alt text for meaningful images and empty alt text for decoration
- Respect `prefers-reduced-motion`
- Check zoom/reflow and horizontal overflow at 320 px
- Verify adequate text/background and focus-indicator contrast

## Browser matrix

- Home: navigation, hero CTAs, content cards, diagrams and footer
- Story and Start: reading order and cards
- Library: filters, post cards and reports
- Post: headings, links, lists, quotes and code overflow
- Presentations: keyboard controls, viewport fit and print rendering

Record viewport size, route, interaction tested, console result and screenshot for every changed visual surface.
