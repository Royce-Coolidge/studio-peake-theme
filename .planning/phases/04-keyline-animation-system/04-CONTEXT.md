# Phase 4: Keyline Animation System - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

SVG decorative keylines that animate as drawn-on strokes when scrolled into view, implemented as a link block within the existing image-with-text section. Button click keyline (INTR-03) and keyline visual style are already handled by existing implementations. Press & Accolades links (PAGE-06) use the same link button underline pattern from Phase 1.

</domain>

<decisions>
## Implementation Decisions

### SVG draw-on behaviour
- Draw direction: start-to-end (left to right for horizontal lines)
- Animation speed: use theme default animation settings (not custom timing)
- Trigger: once only — draws the first time the element scrolls into view, stays visible after
- Keylines appear inside specific sections, not as dividers between sections

### Keyline link block
- Not a new section — a link block added to the existing image-with-text section
- Use the image-with-text section as the blueprint for structure
- Block contains link functionality with keyline draw-on decoration

### Button click keyline (INTR-03)
- SKIP — existing button behaviour already covers this. Keyline appears on click without additional work.

### Keyline visual style
- SKIP — already implemented in prior phases

### Press & Accolades links (PAGE-06)
- Use the same underline draw-on animation as regular link buttons (Phase 1 implementation)
- No custom SVG treatment needed — consistent with link button pattern

### Claude's Discretion
- SVG stroke-dasharray/dashoffset implementation details
- How to integrate the link block schema into image-with-text section
- IntersectionObserver vs `inView` utility choice for scroll detection
- Exact SVG path structure for the keyline decoration

</decisions>

<specifics>
## Specific Ideas

- Use existing `inView` and `animate` from vendor.min.js (Motion One) — already used extensively in theme.js custom elements
- Prestige has stroke-dasharray/dashoffset patterns in theme.css (circular progress) that can inform the SVG draw-on approach
- The link block should be merchanty configurable via Shopify admin within image-with-text section settings

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `inView` / `animate` from vendor.min.js (Motion One): Used by MarqueeText, EffectCarousel, ScrollCarousel, RevealItems, VideoAutoplay for scroll-triggered animations
- `stroke-dasharray` / `stroke-dashoffset` pattern: Used in `.circular-progress` for slideshow autoplay indicator
- Link button keyline (Phase 1): CSS `background-size` underline draw-on already working for `.link`, `.link-reverse`, `.prose a`

### Established Patterns
- Custom elements extend HTMLElement, register via `window.customElements.define()`
- `inView(element, callback, options)` pattern for scroll-triggered behaviour with optional margin
- Private fields via WeakMap for encapsulation in custom elements
- `import { inView, animate } from "vendor"` via importmap in studio-peake.js

### Integration Points
- `sections/image-with-text-overlay.liquid` or equivalent image-with-text section: where the link block schema needs to be added
- `assets/studio-peake.js`: where the custom element for keyline draw-on will live
- `assets/studio-peake.css`: where keyline SVG styles will be added

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-keyline-animation-system*
*Context gathered: 2026-03-12*
