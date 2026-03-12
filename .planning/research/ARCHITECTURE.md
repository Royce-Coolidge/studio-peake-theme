# Architecture Patterns

**Domain:** Shopify theme customisation -- integrating custom animations, interactive components, and filtering into Prestige v10.7.0
**Researched:** 2026-03-12
**Confidence:** HIGH (based on direct codebase analysis of existing Prestige patterns)

## Recommended Architecture

Custom code integrates into Prestige's existing layered architecture. The key principle: **follow Prestige's own patterns** -- Web Components for JS behaviour, scoped `<style>` blocks for section CSS, snippets for reusable Liquid, and section schemas for admin configurability. Do not invent new patterns when the theme already has proven ones.

### Architecture Diagram

```
layout/theme.liquid
  |
  +-- snippets/css-variables.liquid     (Studio Peake design tokens already here)
  +-- snippets/js-variables.liquid      (expose settings to JS)
  +-- importmap { "vendor", "theme", "studio-peake" }
  |                                      ^^ NEW custom JS entry
  +-- assets/theme.css                  (Prestige base styles)
  +-- assets/studio-peake.css           (NEW: all custom CSS)
  |
  +-- sections/header-group
  |     +-- sections/header.liquid      (already customised)
  |
  +-- content_for_layout
  |     +-- templates/*.json            (section composition)
  |           +-- sections/sp-*.liquid  (NEW custom sections, sp- prefix)
  |           +-- sections/*.liquid     (extended Prestige sections)
  |                 +-- blocks/*.liquid
  |                 +-- snippets/sp-*.liquid  (NEW reusable partials)
  |
  +-- assets/studio-peake.js           (NEW: custom Web Components)
  +-- assets/vendor.min.js             (Motion One: animate, inView, scroll, timeline, stagger)
  +-- assets/theme.js                  (Prestige Web Components -- DO NOT EDIT)
```

### Component Boundaries

| Component | Responsibility | Communicates With | Location |
|-----------|---------------|-------------------|----------|
| **studio-peake.css** | All custom styles: gradient overlays, colour-bleed buttons, keyline animations, layout utilities | Consumed by all custom sections/snippets | `assets/studio-peake.css` |
| **studio-peake.js** | Custom Web Components for interactive features | Imports from `vendor` (Motion One), reads `data-*` attributes from Liquid | `assets/studio-peake.js` |
| **sp-* sections** | New full sections (e.g., `sp-project-carousel`, `sp-gallery-filter`) | Use sp-* snippets, schema settings, custom Web Components | `sections/sp-*.liquid` |
| **sp-* snippets** | Reusable Liquid partials (e.g., `sp-gradient-overlay`, `sp-keyline-button`) | Consumed by sections via `{% render %}`, receive params | `snippets/sp-*.liquid` |
| **Extended sections** | Modified Prestige sections (minimise changes) | Reference sp-* snippets for new behaviours | `sections/*.liquid` (existing files) |
| **css-variables.liquid** | Design token injection (already customised) | All CSS consumes these variables | `snippets/css-variables.liquid` |

## Where Custom Code Should Live

### CSS Strategy: Dedicated Asset File

**Use `assets/studio-peake.css`** for all custom styles. Do NOT scatter custom CSS into `theme.css`.

**Rationale:**
- Prestige's `theme.css` is the vendor file. Modifying it makes theme updates impossible to merge.
- Section-scoped `<style>` blocks work for section-specific overrides (and Prestige uses them), but shared styles (gradient overlays, button animations, keyline patterns) need a single source of truth.
- Shopify serves assets from CDN -- a separate file is negligible overhead and caches independently.

**Loading:** Add to `layout/theme.liquid` after theme.css:

```liquid
{{- 'studio-peake.css' | asset_url | stylesheet_tag -}}
```

**Section-scoped styles** (using Liquid-injected CSS variables) still go in `<style>` blocks within each section, following Prestige's pattern:

```liquid
<style>
  #shopify-section-{{ section.id }} {
    --sp-gradient-opacity: {{ section.settings.gradient_opacity | divided_by: 100.0 }};
    --sp-gradient-color: {{ section.settings.gradient_color.rgb }};
  }
</style>
```

The shared `.sp-gradient-overlay` class lives in `studio-peake.css` and reads those variables.

### JavaScript Strategy: Custom Web Components via Dedicated Module

**Use `assets/studio-peake.js`** as a single ES module containing all custom Web Components.

**Rationale:**
- Prestige's `theme.js` is compiled/minified from a source build system we do not have. Editing it is fragile and blocks theme updates.
- The importmap in `layout/theme.liquid` already supports module resolution. Add `"studio-peake"` as a new entry.
- Custom elements follow the identical pattern: class extends HTMLElement, register with `customElements.define()`, import `{ animate, inView, timeline, scroll, stagger }` from `"vendor"`.

**Loading:** Add to `layout/theme.liquid` importmap and script tags:

```html
<script type="importmap">
  {
    "imports": {
      "vendor": "{{ 'vendor.min.js' | asset_url }}",
      "theme": "{{ 'theme.js' | asset_url }}",
      "studio-peake": "{{ 'studio-peake.js' | asset_url }}"
    }
  }
</script>
<script type="module" src="{{ 'studio-peake.js' | asset_url }}"></script>
```

**Available from vendor.min.js (Motion One + utilities):**
- `animate` -- animate elements with WAAPI (Web Animations API) with fallback
- `inView` -- IntersectionObserver wrapper for scroll-triggered animations
- `timeline` -- sequence multiple animations
- `scroll` -- scroll-linked animations (parallax, progress-based)
- `stagger` -- delay animations across multiple elements
- `Delegate` -- event delegation utility
- `FocusTrap` -- focus management for modals/drawers
- `PhotoSwipeLightbox` -- lightbox (already used for product galleries)
- `ScrollOffset` -- scroll position constants

### Liquid Strategy: Snippets for Reusable Patterns, Sections for Page Components

**Reusable animation/interaction patterns go in snippets.** Use the `sp-` prefix to distinguish custom code from Prestige code.

**Key snippets to create:**

| Snippet | Purpose | Used By |
|---------|---------|---------|
| `sp-gradient-overlay.liquid` | Renders gradient overlay on image containers | Hero sections, project cards, mobile tiles |
| `sp-keyline-button.liquid` | Button with keyline draw animation | CTAs throughout site |
| `sp-animate-on-scroll.liquid` | Wrapper that applies scroll-reveal attributes | Any section needing reveal animation |
| `sp-image-hotspot.liquid` | Pulsing hotspot with expandable info panel | Product image tags |
| `sp-crossfade-images.liquid` | Dual-image hover crossfade | Portfolio cards, product previews |

**Pattern for snippet-driven animation:**

```liquid
{%- comment -%}
SP-GRADIENT-OVERLAY
Renders a CSS gradient overlay on an image container.

Supported variables:
* position: 'top', 'bottom', 'both' (default: 'bottom')
* color: CSS color value (default: uses color scheme)
* opacity: 0-100 (default: 60)
{%- endcomment -%}

{%- assign sp_gradient_position = position | default: 'bottom' -%}
{%- assign sp_gradient_opacity = opacity | default: 60 -%}

<div class="sp-gradient-overlay sp-gradient-overlay--{{ sp_gradient_position }}"
     style="--sp-gradient-opacity: {{ sp_gradient_opacity | divided_by: 100.0 }};
            {%- if color %} --sp-gradient-color: {{ color }};{%- endif -%}">
</div>
```

### Admin Configurability: Section Schemas

Every custom feature must be configurable through Shopify admin. Three mechanisms, ordered by preference:

**1. Section Settings (primary)** -- for per-section configuration:

```json
{
  "type": "range",
  "id": "gradient_opacity",
  "label": "Gradient overlay opacity",
  "min": 0,
  "max": 100,
  "step": 5,
  "default": 60,
  "unit": "%"
}
```

**2. Block Settings** -- for repeatable/reorderable sub-components within sections:

```json
{
  "type": "image_hotspot",
  "name": "Product tag",
  "limit": 6,
  "settings": [
    { "type": "range", "id": "x_position", "label": "Horizontal position", "min": 0, "max": 100, "default": 50, "unit": "%" },
    { "type": "range", "id": "y_position", "label": "Vertical position", "min": 0, "max": 100, "default": 50, "unit": "%" },
    { "type": "product", "id": "product", "label": "Product" },
    { "type": "text", "id": "label", "label": "Tag label" }
  ]
}
```

**3. Metafields** -- for per-product/per-collection data that sections read:

Use metafields for data that belongs to a resource (product, collection) rather than a section instance. Example: a product's "room scheme" images for auto-rotation, or a project's "category" for filtering.

Define in `config/metafields.json`:
```json
{
  "metafields": [
    {
      "namespace": "studio_peake",
      "key": "project_category",
      "name": "Project Category",
      "type": "single_line_text_field",
      "owner_type": "PRODUCT"
    }
  ]
}
```

Access in Liquid: `{{ product.metafields.studio_peake.project_category.value }}`

## Data Flow

### Custom Animation Data Flow

```
Section Schema (admin settings)
  |
  v
Section Liquid (reads section.settings, renders HTML with data attributes)
  |
  v
Snippet Liquid (renders reusable pattern with CSS classes + data-* attrs)
  |
  v
studio-peake.css (styles based on CSS classes, reads CSS custom properties)
  |
  v
studio-peake.js Web Component (enhances with JS behaviour via custom element)
  |
  v
vendor.min.js Motion One (executes animations: animate, inView, timeline)
```

### Filtering Data Flow

```
Collection/Product Metafields (category, tags)
  |
  v
Section Liquid (renders filter bar UI + product grid with data-category attributes)
  |
  v
Web Component <sp-gallery-filter> (reads data attributes, shows/hides items)
  |
  v
URL Parameters (preserves filter state for cross-page navigation)
  |
  v
animate() from vendor (fade/slide transitions on filter change)
```

### Cross-Page Filter Navigation

```
Homepage project card (links to /pages/gallery?category=residential)
  |
  v
Gallery page section Liquid (reads URL param: request.params.category)
  |
  v
<sp-gallery-filter> Web Component (initialises with pre-selected filter)
```

## Patterns to Follow

### Pattern 1: Web Component with Motion One

**What:** Extend HTMLElement, import Motion One from vendor, use `inView` for scroll triggers and `animate` for animations. Register with guard check.

**When:** Any interactive behaviour that goes beyond CSS (scroll-triggered sequences, gesture handling, state management).

**Example:**

```javascript
// In studio-peake.js
import { animate, inView, timeline } from "vendor";

var SpKeylineReveal = class extends HTMLElement {
  connectedCallback() {
    // Only animate if user hasn't requested reduced motion
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    inView(this, () => {
      let path = this.querySelector("path");
      let length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

      animate(path, { strokeDashoffset: 0 }, {
        duration: parseFloat(this.getAttribute("data-duration") || "1.5"),
        easing: "ease-out"
      });
    }, { margin: "-10%" });
  }
};
if (!window.customElements.get("sp-keyline-reveal")) {
  window.customElements.define("sp-keyline-reveal", SpKeylineReveal);
}
```

**Liquid usage:**

```liquid
<sp-keyline-reveal data-duration="{{ section.settings.animation_duration }}">
  <svg>
    <path d="{{ section.settings.keyline_path }}" fill="none" stroke="currentColor" stroke-width="1"/>
  </svg>
</sp-keyline-reveal>
```

### Pattern 2: CSS-Only Animation with Liquid-Injected Variables

**What:** Pure CSS animations configured through section settings, no JS required.

**When:** Gradient overlays, hover states, colour transitions, simple transforms.

**Example:**

```css
/* studio-peake.css */
.sp-gradient-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.sp-gradient-overlay--bottom {
  background: linear-gradient(
    to top,
    rgb(var(--sp-gradient-color, 0 0 0) / var(--sp-gradient-opacity, 0.6)) 0%,
    transparent 60%
  );
}

.sp-colour-bleed-button {
  position: relative;
  overflow: hidden;
  transition: color 0.3s ease;
}

.sp-colour-bleed-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--sp-button-bleed-color, currentColor);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.sp-colour-bleed-button:hover::before,
.sp-colour-bleed-button:focus-visible::before {
  transform: scaleX(1);
}
```

### Pattern 3: Section Schema for Admin Control

**What:** Every visual parameter exposed as a section setting with sensible defaults.

**When:** Always. The client must be able to adjust colours, speeds, toggle animations, and configure content without code.

**Example schema pattern:**

```json
{
  "type": "header",
  "content": "Animation"
},
{
  "type": "checkbox",
  "id": "enable_animation",
  "label": "Enable scroll animation",
  "default": true
},
{
  "type": "range",
  "id": "animation_duration",
  "label": "Animation speed",
  "min": 0.3,
  "max": 3.0,
  "step": 0.1,
  "default": 1.0,
  "unit": "s"
},
{
  "type": "select",
  "id": "animation_style",
  "label": "Animation style",
  "options": [
    { "value": "fade", "label": "Fade in" },
    { "value": "slide-up", "label": "Slide up" },
    { "value": "reveal", "label": "Reveal" }
  ],
  "default": "fade"
}
```

### Pattern 4: Progressive Enhancement

**What:** Features work without JS (content visible, layout intact), JS enhances with animation and interactivity.

**When:** Always. Ensures content is accessible, crawlable, and works in edge cases.

**Example:**

```liquid
{%- comment -%} Gallery items are visible by default, filter JS hides non-matching ones {%- endcomment -%}
<sp-gallery-filter>
  <div class="sp-filter-bar">
    {%- for tag in collection.all_tags -%}
      <button class="sp-filter-button" data-filter="{{ tag | handleize }}">{{ tag }}</button>
    {%- endfor -%}
  </div>

  <div class="sp-gallery-grid">
    {%- for product in collection.products -%}
      <div class="sp-gallery-item" data-category="{{ product.metafields.studio_peake.project_category.value | handleize }}">
        {%- render 'product-card', product: product -%}
      </div>
    {%- endfor -%}
  </div>
</sp-gallery-filter>
```

Without JS: all items show, filter buttons do nothing. With JS: the Web Component enables filtering with animated transitions.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Editing theme.js or theme.css

**What:** Modifying Prestige's compiled/vendor files directly.
**Why bad:** Prestige releases updates. Any merge becomes impossible. The theme.js source is compiled from a private build system -- edits to the minified output are fragile and unreadable.
**Instead:** Create `studio-peake.js` and `studio-peake.css` as separate files. Override Prestige styles via CSS specificity (use `#shopify-section-{{ section.id }}` scoping when needed).

### Anti-Pattern 2: Inline onclick Handlers

**What:** Using `onclick="doSomething()"` in Liquid templates.
**Why bad:** Requires global function scope, breaks Content Security Policy, difficult to test, couples Liquid to JS implementation. The existing `newsletter-popup.js` uses this pattern -- do not replicate it.
**Instead:** Use Web Components. The element encapsulates its own behaviour. Liquid just renders the element with data attributes.

### Anti-Pattern 3: jQuery or External Animation Libraries

**What:** Adding jQuery, GSAP, Anime.js, or other animation libraries.
**Why bad:** vendor.min.js already bundles Motion One (animate, inView, timeline, scroll, stagger). Adding another library duplicates functionality, increases payload, and introduces API inconsistency.
**Instead:** Use Motion One via `import { animate, inView } from "vendor"`. It provides everything needed: WAAPI-based animations, scroll triggers, timeline sequencing, and stagger utilities.

### Anti-Pattern 4: CSS in Liquid Assigns

**What:** Building CSS strings in Liquid and injecting them inline on elements.
**Why bad:** Unreadable, uncacheable, impossible to override, defeats DevTools inspection.
**Instead:** Use CSS custom properties set via `<style>` blocks scoped to `#shopify-section-{{ section.id }}`, consumed by classes in `studio-peake.css`.

### Anti-Pattern 5: Modifying Existing Section Schemas Heavily

**What:** Adding many custom settings to Prestige's existing section schemas.
**Why bad:** Theme updates will conflict. The admin UI becomes cluttered.
**Instead:** Create new `sp-*` sections that wrap or replace Prestige sections. For minor extensions to existing sections (e.g., adding gradient overlay to slideshow), add minimal settings and document each change clearly with comments.

## Component Definitions

### Custom Web Components to Build

| Component | HTML Tag | Responsibility | Dependencies |
|-----------|----------|---------------|--------------|
| Keyline Reveal | `<sp-keyline-reveal>` | SVG stroke-dashoffset animation on scroll | `inView`, `animate` from vendor |
| Colour Bleed Button | `<sp-colour-bleed>` | Enhanced button hover/click with colour expansion | CSS-only (no JS needed) |
| Gallery Filter | `<sp-gallery-filter>` | Client-side filtering with animated show/hide | `animate`, `stagger` from vendor |
| Image Crossfade | `<sp-image-crossfade>` | Dual image hover crossfade | CSS-only with optional JS for touch |
| Image Hotspot | `<sp-image-hotspot>` | Pulsing dot with expandable info panel | `animate` from vendor, `Delegate` for event handling |
| Auto Rotation | `<sp-auto-rotate>` | Timed crossfade between child elements | `animate`, `timeline` from vendor |
| Hero Sequence | `<sp-hero-sequence>` | Orchestrated load: image first, then logo fade | `timeline` from vendor |
| Two Column Scroll | `<sp-split-scroll>` | Sticky right panel, scrolling left gallery | CSS `position: sticky` + `scroll` from vendor |
| Subscribe Popup | `<sp-subscribe-popup>` | Timed/scroll-triggered popup (extends existing newsletter-popup pattern) | `inView` from vendor |
| Project Carousel | `<sp-project-carousel>` | Full-bleed drag + arrow carousel for featured projects | Extends Prestige's `effect-carousel` pattern |
| Mobile Nav Filter | `<sp-mobile-filter>` | Sub-category filter in mobile nav | `animate` from vendor |

### Custom Sections to Build

| Section File | Purpose | Blocks | Key Settings |
|-------------|---------|--------|--------------|
| `sp-hero.liquid` | Hero with load sequence + gradient overlay | heading, subheading, button | image, gradient_opacity, gradient_position, enable_load_animation |
| `sp-project-carousel.liquid` | Featured projects full-bleed carousel | project_slide | autoplay, transition_speed, gradient_on_hover |
| `sp-gallery-filter.liquid` | Filterable project/product gallery | (none -- uses collection products) | collection, filter_source, columns, animation_style |
| `sp-two-column.liquid` | Independent scroll two-column layout | left_image, right_content | sticky_side, gap |
| `sp-image-hotspots.liquid` | Product image with interactive tags | hotspot | image, mobile_image, hotspot_color |
| `sp-video-section.liquid` | Looping video with fallback image | (none) | video, fallback_image, autoplay_on_scroll |
| `sp-about-toggle.liquid` | Text toggle with image update | content_panel | default_panel, transition_style |
| `sp-careers.liquid` | Collapsible job spec blocks | job_posting | (inherits Prestige accordion pattern) |

### Custom Snippets to Build

| Snippet File | Purpose | Parameters |
|-------------|---------|------------|
| `sp-gradient-overlay.liquid` | Gradient overlay on images | position, color, opacity |
| `sp-keyline-button.liquid` | Button with keyline draw animation | content, href, style, animation_type |
| `sp-project-card.liquid` | Project card with hover gradient + zoom | project, show_gradient, gradient_strength |
| `sp-filter-button.liquid` | Filter bar button with filled-circle indicator | label, filter_value, active |
| `sp-scroll-reveal.liquid` | Wrapper for scroll-triggered reveal | animation_type, duration, delay |

## File Organisation Summary

```
assets/
  studio-peake.css          # All custom styles
  studio-peake.js           # All custom Web Components
  theme.css                 # DO NOT EDIT (Prestige)
  theme.js                  # DO NOT EDIT (Prestige)
  vendor.min.js             # DO NOT EDIT (Motion One + utilities)
  custom-fonts.css          # Already customised for SP fonts

sections/
  sp-hero.liquid            # New sections with sp- prefix
  sp-project-carousel.liquid
  sp-gallery-filter.liquid
  sp-two-column.liquid
  sp-image-hotspots.liquid
  sp-video-section.liquid
  sp-about-toggle.liquid
  sp-careers.liquid
  header.liquid             # Already modified (minimal changes)
  slideshow.liquid           # May need minimal gradient overlay addition

snippets/
  sp-gradient-overlay.liquid
  sp-keyline-button.liquid
  sp-project-card.liquid
  sp-filter-button.liquid
  sp-scroll-reveal.liquid
  css-variables.liquid       # Already customised with SP tokens

layout/
  theme.liquid              # Add studio-peake.css + studio-peake.js loading

config/
  metafields.json           # Add studio_peake namespace metafield defs
```

## Build Order (Dependencies)

Components have dependencies that dictate implementation order:

```
Phase 1: Foundation (no dependencies)
  |-- studio-peake.css file + loading in theme.liquid
  |-- studio-peake.js file + importmap entry in theme.liquid
  |-- sp-gradient-overlay snippet (CSS-only, used everywhere)
  |-- CSS custom properties for SP animation tokens
  |
Phase 2: CSS-Only Animations (depends on Phase 1)
  |-- Gradient overlays on image sections
  |-- Colour-bleed button states (CSS transitions)
  |-- Button hover keyline animation (CSS)
  |-- Close icon rotation (CSS)
  |
Phase 3: Core Web Components (depends on Phase 1)
  |-- <sp-keyline-reveal> (SVG stroke animation)
  |-- <sp-hero-sequence> (load orchestration)
  |-- <sp-image-crossfade> (hover crossfade)
  |-- <sp-auto-rotate> (room scheme rotation)
  |
Phase 4: Layout Components (depends on Phase 1)
  |-- <sp-split-scroll> (two-column layout)
  |-- sp-two-column section
  |-- Accordion/expandable panel (extends Prestige accordion)
  |
Phase 5: Carousel Components (depends on Phase 3)
  |-- <sp-project-carousel> (builds on carousel knowledge from Phase 3)
  |-- sp-project-carousel section
  |-- Project card hover state (uses gradient overlay from Phase 2)
  |-- Journal notes carousel
  |
Phase 6: Filtering System (depends on Phase 1, 3)
  |-- Metafield definitions for categories
  |-- <sp-gallery-filter> Web Component
  |-- sp-gallery-filter section
  |-- Cross-page filter navigation (URL params)
  |-- Mobile nav filter
  |
Phase 7: Page-Specific Sections (depends on Phase 1-4)
  |-- sp-image-hotspots section
  |-- sp-video-section
  |-- sp-about-toggle section
  |-- sp-careers section
  |-- Subscribe popup enhancement
  |-- Contact form styling
  |
Phase 8: Navigation Enhancements (depends on Phase 2, 6)
  |-- Portfolio dropdown with active state
  |-- Workshop dropdown
  |-- Mobile menu colour-bleed animation
  |-- Anchor link smooth scroll
```

**Ordering rationale:**
1. Foundation first because everything depends on the CSS/JS infrastructure
2. CSS-only animations next because they are low-risk, high-visibility, and unblock visual review
3. Core Web Components before complex sections because sections compose these components
4. Filtering after core components because it needs the animation patterns established earlier
5. Page-specific sections last because they are independent and can be built in parallel once patterns are established

## Scalability Considerations

| Concern | Current (10 components) | Future (30+ components) |
|---------|------------------------|------------------------|
| JS file size | Single studio-peake.js is fine | Consider splitting into multiple files with dynamic import if >100KB |
| CSS file size | Single studio-peake.css is fine | Stays single file -- CSS is small and cacheable |
| Section count | sp-* sections manageable | Shopify handles unlimited sections -- not a concern |
| Admin UX | Clear sp- prefixed settings | Group settings with `header` type dividers, use `info` hints |

## Sources

- Direct analysis of Prestige v10.7.0 codebase (HIGH confidence)
- `assets/vendor.min.js` exports: Motion One (animate, inView, scroll, timeline, stagger), Delegate, FocusTrap, PhotoSwipeLightbox
- `assets/theme.js`: 80+ custom elements registered, all following identical pattern
- `layout/theme.liquid`: importmap configuration, script loading order
- `snippets/css-variables.liquid`: CSS custom property injection pattern
- `snippets/js-variables.liquid`: `window.themeVariables` exposure pattern
- Shopify theme development patterns (training data, MEDIUM confidence)

---

*Architecture analysis: 2026-03-12*
