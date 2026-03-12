# Technology Stack

**Project:** Studio Peake Custom Theme
**Researched:** 2026-03-12

## Recommended Stack

The stack recommendation is conservative by design: Prestige v10.7.0 already ships Motion (formerly motion-one), Web Components, CSS custom properties, and a mature overlay/gradient system. The job is to extend these existing patterns, not introduce new dependencies.

### Animation Layer

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Motion (via vendor.min.js) | Bundled with Prestige | JS-driven animations: fade, slide, opacity, transform sequences | Already imported throughout theme.js. Provides `animate`, `inView`, `scroll`, `timeline`. No additional dependency needed. | HIGH |
| CSS @keyframes | Native | Looping animations: pulse hotspots, room scheme rotation, icon spin on hover | Simpler than JS for continuous/looping states. Theme already uses `@keyframes animateIconInline` and `animateIconBlock`. | HIGH |
| CSS transitions | Native | Hover states: colour-bleed buttons, gradient intensification, opacity changes | Already the primary interaction pattern in theme.css (60+ transition declarations). Consistent with existing UX. | HIGH |
| Web Animations API (element.animate()) | Native | Simple one-shot animations: crossfade between images, close icon rotation | Already used directly in theme.js (product-card.liquid line ~2630). Lighter than Motion for trivial cases. | HIGH |

**Do NOT use:**

| Technology | Why Not |
|------------|---------|
| GSAP | Commercial license required for Shopify themes (business use). Overkill for the animations specified. Motion already handles timeline sequencing. |
| Anime.js | Adds unnecessary dependency when Motion is already bundled. Overlapping API surface. |
| CSS scroll-driven animations (`animation-timeline: scroll()`) | Safari support landed in Safari 18 (Sep 2024) but the project targets Safari 14.1+. Use Motion's `scroll()` function instead -- it polyfills scroll-linked animations via the Web Animations API with broad support. |
| Lottie / Rive | Heavyweight for the animations described (stroke reveals, fades, transforms). Adds runtime dependency and asset pipeline complexity to a no-build Shopify theme. |
| Framer Motion (React) | Wrong ecosystem entirely. Prestige is vanilla JS + Liquid. |

### CSS Techniques

| Technique | Purpose | How | Browser Support | Confidence |
|-----------|---------|-----|-----------------|------------|
| `linear-gradient` overlays via `::before` pseudo-elements | Gradient overlays on image sections for text legibility | Prestige already does this with `content-over-media` pattern using `--content-over-media-overlay` CSS variable. Extend, don't reinvent. | All targets | HIGH |
| `background-size` transition for colour-bleed | Button hover colour expansion effect | Theme already uses this pattern (theme.css line ~380): transition `background-size` from `0% 100%` to `100% 100%` with cubic-bezier easing. Apply same pattern to new buttons. | All targets | HIGH |
| `stroke-dasharray` + `stroke-dashoffset` for SVG keyline draw | SVG stroke reveal animation on scroll | Set `stroke-dasharray` to path length, animate `stroke-dashoffset` from path length to 0. Use `getTotalLength()` in JS to compute. Trigger via Motion's `inView()`. | All targets | HIGH |
| `position: sticky` for independent scroll columns | Two-column layout with sticky right panel | Use `position: sticky; top: 0; height: 100vh` on right panel while left scrolls. Theme already has `safe-sticky` custom element handling edge cases. | All targets | HIGH |
| CSS `mix-blend-mode` | Emblem overlay blending on product pages | `mix-blend-mode: multiply` or `screen` for brand colour emblem overlay. Pure CSS, no JS. | All targets (Chrome 90+, FF 88+, Safari 14.1+) | MEDIUM |
| `@media (prefers-reduced-motion)` | Accessibility: disable animations for users who prefer reduced motion | Theme already implements this check in JS (ImageParallax component). Apply consistently to all new CSS animations with `@media (prefers-reduced-motion: reduce) { animation: none; transition: none; }`. | All targets | HIGH |

### JavaScript Patterns

| Pattern | Purpose | Why | Confidence |
|---------|---------|-----|------------|
| Web Components (Custom Elements) | All new interactive components | Prestige defines 80+ custom elements. This is the established pattern. Every new interactive feature (hotspot tags, filter bars, accordions, carousels) should be a custom element registered with `customElements.define()`. | HIGH |
| `import { animate, inView, scroll, timeline } from "vendor"` | Animation orchestration | The existing import pattern. Motion's `inView()` handles IntersectionObserver for reveal-on-scroll. `scroll()` handles scroll-linked parallax. `timeline()` handles sequenced animations (hero load sequence). | HIGH |
| `connectedCallback()` / `disconnectedCallback()` lifecycle | Component setup/teardown | Standard Web Components lifecycle. Used throughout theme.js. `connectedCallback` for event listeners + IntersectionObserver setup. `disconnectedCallback` for cleanup (AbortController pattern). | HIGH |
| `AbortController` for event cleanup | Preventing memory leaks | Theme.js uses `this.#abortController = new AbortController()` with `{ signal: this.#abortController.signal }` on event listeners. Abort in `disconnectedCallback`. | HIGH |
| URL params for filter state | Cross-page category filtering, gallery filters | Theme already uses URL parameters for faceted filtering (`facets-form` element). Encode filter state in URL params for shareable/bookmarkable filtered views. | HIGH |
| `data-*` attributes for configuration | Passing settings from Liquid to JS | Standard Shopify theme pattern. Liquid renders `data-delay="10000"` or `data-scroll-threshold="0.3"`, JS reads via `this.getAttribute()` or `this.dataset`. | HIGH |

**Do NOT use:**

| Pattern | Why Not |
|---------|---------|
| React/Vue/Svelte components | No build tooling. Prestige is vanilla. Adding a framework means adding a bundler, which breaks the Shopify asset pipeline. |
| ES modules with bare specifiers (except "vendor") | Shopify serves assets directly. Only `"vendor"` is import-mapped. New JS files must use `{{ 'file.js' \| asset_url }}` with `<script>` tags or inline in sections. |
| jQuery | Not present in Prestige. Modern Web Components + vanilla JS cover all use cases. Adding jQuery in 2026 is backwards. |
| Third-party carousel libraries (Swiper, Flickity, Splide) | Prestige ships `effect-carousel` and `scroll-carousel` custom elements with full touch/drag/arrow support. Extend these. |
| npm packages requiring bundling | No build process. Any library must be a single ES module or IIFE that can live in `assets/`. |

### SVG Stroke Animation Approach

| Aspect | Recommendation | Confidence |
|--------|---------------|------------|
| Technique | CSS `stroke-dasharray` + `stroke-dashoffset` animated via Motion `animate()` triggered by `inView()` | HIGH |
| Path preparation | Export SVG paths from Figma with `fill="none"` and explicit `stroke` attributes. Use `getTotalLength()` at runtime to set `stroke-dasharray`. | HIGH |
| Hosting | Inline SVG in Liquid templates (not `<img>` tags) so stroke properties are CSS-accessible | HIGH |
| Fallback | For `prefers-reduced-motion`, show the fully-drawn keyline immediately (set `stroke-dashoffset: 0`) | HIGH |
| Library | None needed. Native SVG + CSS + Motion's `animate()` is sufficient. | HIGH |

**Example pattern for keyline draw-on:**
```javascript
// Inside a custom element's connectedCallback
import { inView, animate } from "vendor";

class KeylineDraw extends HTMLElement {
  connectedCallback() {
    const path = this.querySelector('path');
    const length = path.getTotalLength();

    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    inView(this, () => {
      animate(path,
        { strokeDashoffset: [length, 0] },
        { duration: 1.2, easing: [0.645, 0.045, 0.355, 1] }
      );
    });
  }
}

if (!window.customElements.get('keyline-draw')) {
  window.customElements.define('keyline-draw', KeylineDraw);
}
```

### Liquid Template Patterns

| Pattern | Purpose | Why | Confidence |
|---------|---------|-----|------------|
| Section schema with `"type": "range"` settings | Configurable animation timing, opacity, delays | Lets merchants adjust overlay opacity (0-100), animation duration, scroll trigger threshold from Shopify admin. Prestige already uses range for `overlay_opacity`. | HIGH |
| Block-based repeatable content | Careers collapsible blocks, blog content modules, hotspot tags | Merchants add/remove/reorder blocks in admin. Each block is a `{% case block.type %}` in the section Liquid. | HIGH |
| Snippet parameters for reusable components | Shared button styles, card layouts, gradient overlays | `{% render 'button', style: 'colour-bleed', color_scheme: section.settings.color_scheme %}`. Keeps DRY. | HIGH |
| `color_scheme` setting type | Per-instance colour assignment | Prestige's colour scheme system (`color-scheme--{{ scheme.id }}`) already supports this. Add `color_scheme` to any new section's schema. | HIGH |
| `"type": "image_picker"` + focal point | Adaptive image containers | Shopify's image picker includes focal point data. Access via `image.presentation.focal_point`. Use `object-position` CSS. | HIGH |
| Metafield-backed settings | Complex data (project categories, filter taxonomies) | Use `metaobject` definitions for structured data that doesn't fit section settings. Define in `.shopify/metafields.json`. | MEDIUM |
| `{% style %}` tag for scoped CSS | Per-section CSS variable injection | Pattern used throughout Prestige: `{% style %}#shopify-section-{{ section.id }} { --overlay-opacity: {{ section.settings.overlay_opacity }}; }{% endstyle %}`. | HIGH |

### Supporting Infrastructure

| Technology | Purpose | Why | Confidence |
|------------|---------|-----|------------|
| Shopify CLI | Local development and theme preview | Standard tooling. `shopify theme dev` for live preview. | HIGH |
| CSS custom properties (variables) | Theme-wide design token system | Already the core of Prestige's theming. All new components must use existing variables (`--color-scheme-background`, `--text-color`, etc.) and add new ones following the naming convention. | HIGH |
| Shopify asset pipeline | Asset delivery | No CDN setup needed. `{{ 'file.js' \| asset_url }}` handles versioning and delivery. | HIGH |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Animation engine | Motion (bundled) | GSAP | License cost, unnecessary dependency when Motion is already present |
| Animation engine | Motion (bundled) | CSS scroll-driven animations | Safari 14.1 not supported; Motion's `scroll()` provides equivalent functionality |
| Component model | Web Components | Lit / Stencil | Adds build step and dependency. Prestige proves vanilla custom elements work at scale (80+ components). |
| Carousel | Prestige's built-in carousels | Swiper.js | Additional 40KB+ dependency. Prestige carousels already handle touch, drag, arrows, responsive. |
| SVG animation | Native stroke-dash + Motion | Vivus.js / SVG.js | Unnecessary dependency for stroke-dashoffset animation, which is ~10 lines of code. |
| State management | URL params + data attributes | Alpine.js | Adds dependency. The features don't require reactive state -- they're animation/interaction states managed by custom element internals. |
| Gradient overlays | CSS `::before` + `linear-gradient` | Canvas overlay | Massively overcomplicated for a gradient. CSS is the right tool. |
| Filtering | URL params + Liquid | Algolia / instant search | Out of scope per PROJECT.md. Standard Shopify filtering with `facets-form` pattern is sufficient for portfolio/gallery filtering. |

## Installation

```bash
# No installation needed for core stack -- it's already in the theme.

# Development only:
shopify theme dev --store=studio-peake.myshopify.com
```

New JavaScript files are added directly to `assets/` and loaded via Liquid:
```liquid
{%- comment -%} In the section that needs the component {%- endcomment -%}
<script src="{{ 'studio-peake-animations.js' | asset_url }}" defer></script>
```

Or inline in section files for small, section-specific components.

## Key Constraints to Remember

1. **No build process.** Every JS/CSS file must work as-is when served by Shopify. No JSX, no TypeScript, no SCSS, no PostCSS.
2. **Motion imports only via `"vendor"` specifier.** The import map in Prestige maps `"vendor"` to `vendor.min.js`. New files that need Motion must use `import { animate } from "vendor"` and be loaded as ES modules.
3. **Safari 14.1+ baseline.** No `@container` queries (Safari 16+), no `:has()` pseudo-class (Safari 15.4+), no `scroll-timeline` (Safari 18). Use feature detection or stick to widely-supported CSS.
4. **Reduced motion must be respected.** Check `prefers-reduced-motion` in both CSS (`@media`) and JS (`window.matchMedia`) before running animations. Prestige already does this -- follow the pattern.
5. **All settings must be merchant-configurable.** Animation durations, colours, opacities, delays -- expose via section schema, not hardcoded values.

## Sources

- Prestige theme.js source analysis (80+ custom elements, Motion imports confirmed)
- Prestige theme.css source analysis (transition/keyframe patterns, overlay system)
- Prestige vendor.min.js analysis (Motion library with animate, inView, scroll, timeline, FocusTrap, Delegate exports)
- PROJECT.md constraints (no external frameworks, Safari 14.1+ target, no build tooling)
- Prestige section schemas (overlay_opacity range pattern, color_scheme settings)

---

*Stack research: 2026-03-12*
