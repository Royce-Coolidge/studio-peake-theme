# Phase 1: Infrastructure + Visual Foundation - Research

**Researched:** 2026-03-12
**Domain:** Shopify Liquid theme extension, CSS overlays, responsive image containers
**Confidence:** HIGH

## Summary

Phase 1 establishes the custom CSS/JS loading infrastructure and implements two visual systems: gradient overlays for text legibility on image sections, and responsive image containers with focal-point cropping. The codebase analysis reveals that Prestige v10.7.0 already provides mature versions of both systems -- the work is to extend them with Studio Peake's specific design values, not build from scratch.

The gradient overlay system is especially well-positioned: Prestige's `content-over-media` class uses a `::before` pseudo-element that renders either a solid overlay (`--content-over-media-overlay`) or a gradient overlay (`--content-over-media-gradient-overlay`). The slideshow section already demonstrates the gradient path via `color_background` setting type. Studio Peake's specific gradient values (warm brown top, cooler brown bottom) need a dual-gradient approach (both top and bottom simultaneously), which differs from Prestige's single-gradient pattern. This is the primary design challenge.

For focal-point cropping, Shopify's `image_picker` setting type includes a built-in focal point picker. The focal point data is accessible via `image.presentation.focal_point.x` and `image.presentation.focal_point.y` (percentages 0-100, defaulting to 50/50 center). This maps directly to CSS `object-position`, making the implementation straightforward.

**Primary recommendation:** Create `studio-peake.css` and `studio-peake.js` asset files loaded after Prestige core files in `theme.liquid`, then extend Prestige's existing `content-over-media` overlay system with Studio Peake's dual-gradient pattern using the `.sp-*` namespace.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Top gradient: `linear-gradient(0deg, rgba(255, 255, 255, 0.00) 46.76%, rgba(71, 60, 60, 0.40) 100%)` -- warm brown tint, transparent from bottom to ~47%, then fading to 40% opacity
- Bottom gradient: `linear-gradient(0deg, rgba(255, 255, 255, 0.00) 17.9%, rgba(60, 53, 53, 0.40) 100%)` -- slightly different brown tone, starts visible sooner (~18%)
- Default to these exact Figma values but allow per-section override via section settings (opacity/strength slider)
- Toggle per section -- checkbox in section settings to enable/disable gradient overlay
- Both top and bottom gradients applied simultaneously where text overlays images

### Claude's Discretion
- Focal point implementation -- use Shopify's built-in focal point picker or custom X/Y settings (choose the approach that gives best merchant UX)
- Adaptive layout exception mode -- determine which components use this and how text repositions for square vs landscape images
- File loading strategy -- how studio-peake.css/js are loaded relative to Prestige assets, whether JS uses ES modules via importmap or script tags
- Gradient implementation approach -- whether to extend Prestige's existing `content-over-media` overlay system or create a separate gradient utility

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| VISF-01 | Image sections with overlaid text display CSS-based gradient overlays (top and bottom) for text legibility, applied in the layout layer (not baked into images) | Prestige `content-over-media` overlay system with `::before` pseudo-element; extend with `::after` for dual-gradient; exact Figma gradient values provided |
| VISF-02 | Image containers enforce a defined aspect ratio with configurable focal-point cropping, scaling fluidly across breakpoints without fixed heights | Prestige `--aspect-ratio` / `--default-aspect-ratio` CSS variable system; Shopify `image.presentation.focal_point` (x/y percentages) mapped to `object-position` |
| VISF-03 | Specific components adapt layout when image proportions differ (e.g. square vs landscape), reshuffling text alignment and spacing while maintaining balance | CSS `aspect-ratio` detection via container queries or `@media` + Liquid-level aspect ratio calculation from `image.aspect_ratio` property |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Prestige theme.css | v10.7.0 | Base styles, `content-over-media` overlay system | Already provides overlay infrastructure; extend, do not rebuild |
| Prestige theme.js | v10.7.0 | Web Components, Motion animation, custom elements | 80+ custom elements already defined; follow established patterns |
| studio-peake.css | New | All Studio Peake custom styles | Namespace `.sp-*`; loads after theme.css |
| studio-peake.js | New | All Studio Peake custom JS components | ES module; loads after theme.js |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Motion (via vendor.min.js) | Bundled | `inView()` for scroll-triggered reveals | Only needed if JS-driven animation is required (Phase 1 is pure CSS) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Extending `content-over-media` | Separate `.sp-gradient-overlay` class | Separate class is cleaner -- avoids modifying Prestige's pseudo-element chain. **Recommended.** |
| Shopify focal point picker | Custom X/Y range sliders | Built-in picker is better UX -- visual drag on actual image. **Use built-in.** |
| `@container` queries for aspect ratio detection | Liquid-calculated classes | Container queries require Safari 16+; Liquid calculation works everywhere. **Use Liquid.** |

## Architecture Patterns

### File Loading Strategy (Discretion Decision)

**Recommendation: Load via `<link>` and `<script type="module">` tags in `theme.liquid`, after Prestige core files.**

In `layout/theme.liquid`, add immediately after line 67 (`theme.css` stylesheet tag):
```liquid
{{- 'studio-peake.css' | asset_url | stylesheet_tag -}}
```

For JS, add after line 63 (`theme.js` module script):
```html
<script type="module" src="{{ 'studio-peake.js' | asset_url }}"></script>
```

**Why this approach:**
- CSS loads after `theme.css`, so `.sp-*` rules can override/extend Prestige styles with equal or higher specificity
- JS loads as ES module, enabling `import { inView, animate } from "vendor"` via the existing importmap (line 51-60)
- No importmap modification needed -- `"vendor"` is already mapped
- `defer` is implicit for `type="module"` scripts

### Recommended File Structure
```
assets/
  studio-peake.css     # All custom CSS, .sp-* namespace
  studio-peake.js      # All custom JS components (Web Components)
  custom-fonts.css     # Already exists, has Mynaruse Flare @font-face
layout/
  theme.liquid         # Modified: add 2 asset tags after Prestige files
snippets/
  sp-gradient-overlay.liquid  # Reusable gradient snippet for sections
```

### Pattern 1: Dual Gradient Overlay via ::before and ::after
**What:** Studio Peake requires both a top gradient and a bottom gradient simultaneously. Prestige's `content-over-media` only uses `::before` for a single overlay.
**When to use:** Any image section with overlaid text (slideshow, image-with-text-overlay, image-with-text-block, collection banners).

**Implementation approach -- create a separate CSS utility class rather than modifying Prestige's pseudo-element:**

```css
/* studio-peake.css */

/* Top gradient (warm brown, fades in from ~47% upward) */
.sp-gradient-overlay::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--sp-gradient-top,
    linear-gradient(0deg, rgba(255, 255, 255, 0.00) 46.76%, rgba(71, 60, 60, 0.40) 100%)
  );
  z-index: 1;
  pointer-events: none;
  border-radius: inherit;
}

/* Bottom gradient (cooler brown, starts visible from ~18% upward) */
.sp-gradient-overlay::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--sp-gradient-bottom,
    linear-gradient(180deg, rgba(255, 255, 255, 0.00) 17.9%, rgba(60, 53, 53, 0.40) 100%)
  );
  z-index: 1;
  pointer-events: none;
  border-radius: inherit;
}
```

**Critical note:** This means the `.sp-gradient-overlay` class replaces (not stacks with) Prestige's built-in overlay on sections where it is applied. The section's `--content-over-media-overlay` should be disabled when Studio Peake gradients are active.

### Pattern 2: Focal Point Cropping via object-position
**What:** Map Shopify's built-in focal point data to CSS `object-position`.
**When to use:** Any image container with `object-fit: cover` that needs focal-point awareness.

```liquid
{%- comment -%} In section Liquid, set object-position from focal point data {%- endcomment -%}
<style>
  #shopify-section-{{ section.id }} .sp-focal-image img {
    object-position: {{ section.settings.image.presentation.focal_point }};
  }
</style>
```

Shopify's `focal_point` object outputs as `"X% Y%"` string when referenced directly (e.g., `"50% 30%"`), which is exactly the format CSS `object-position` expects. The defaults are `50% 50%` (center) when no focal point is set.

**Source:** Shopify Liquid docs -- `image.presentation.focal_point.x` returns horizontal % (0-100), `.y` returns vertical %. The object itself stringifies to `"X% Y%"`.

### Pattern 3: Adaptive Layout via Liquid Aspect Ratio Detection (VISF-03)
**What:** Components detect whether their image is portrait, square, or landscape and adjust text layout accordingly.
**When to use:** Components that must handle varying image proportions (e.g., image-with-text-block where square images need different text positioning than landscape).

```liquid
{%- liquid
  assign ratio = section.settings.image.aspect_ratio | default: 1.0
  if ratio < 0.9
    assign sp_layout_mode = 'portrait'
  elsif ratio > 1.2
    assign sp_layout_mode = 'landscape'
  else
    assign sp_layout_mode = 'square'
  endif
-%}

<div class="sp-adaptive sp-adaptive--{{ sp_layout_mode }}">
  {%- comment -%} Content here {%- endcomment -%}
</div>
```

```css
/* studio-peake.css */
.sp-adaptive--portrait .sp-adaptive__text {
  text-align: center;
  padding-inline: var(--sp-spacing-md);
}

.sp-adaptive--landscape .sp-adaptive__text {
  text-align: start;
  padding-inline-start: var(--sp-spacing-lg);
}

.sp-adaptive--square .sp-adaptive__text {
  text-align: center;
  max-width: 80%;
  margin-inline: auto;
}
```

**Why Liquid over CSS:** The `image.aspect_ratio` property is available in Liquid at render time. Using CSS `@container` queries would require Safari 16+ (beyond the Safari 14.1+ baseline implied by the theme, though Prestige itself uses `:has()` which requires Safari 15.4+). The Liquid approach works universally and avoids client-side layout shifts.

### Pattern 4: Section Schema for Gradient Toggle and Strength
**What:** Merchant-facing controls for enabling/disabling gradients and adjusting strength.

```json
{
  "type": "checkbox",
  "id": "sp_enable_gradient",
  "label": "Enable Studio Peake gradient overlay",
  "default": true
},
{
  "type": "range",
  "id": "sp_gradient_strength",
  "label": "Gradient strength",
  "min": 0,
  "max": 100,
  "step": 5,
  "unit": "%",
  "default": 100,
  "info": "Adjusts the opacity of the gradient overlay"
}
```

The strength slider scales the gradient opacity proportionally:
```liquid
{%- if section.settings.sp_enable_gradient -%}
  <style>
    #shopify-section-{{ section.id }} .sp-gradient-overlay::before,
    #shopify-section-{{ section.id }} .sp-gradient-overlay::after {
      opacity: {{ section.settings.sp_gradient_strength | divided_by: 100.0 }};
    }
  </style>
{%- endif -%}
```

### Anti-Patterns to Avoid
- **Modifying theme.css or theme.js directly:** Breaks the "never modify Prestige core files" principle. All customisation goes in `studio-peake.css` and `studio-peake.js`.
- **Using `!important` to override Prestige styles:** Use specificity (section ID selectors) or source order (loading after theme.css) instead.
- **Baking gradient values into images:** VISF-01 explicitly requires gradients in the layout layer, not baked into uploaded images.
- **Using fixed pixel heights for image containers:** VISF-02 requires fluid scaling via `aspect-ratio`, not fixed heights.
- **JavaScript-driven gradient rendering:** Gradients are pure CSS -- no JS needed. Do not use canvas or JS-based overlay rendering.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focal point picker | Custom X/Y coordinate inputs | Shopify's built-in `image_picker` focal point | Built into the image picker UI; merchants drag a point on the actual image. Better UX than numeric inputs. |
| Overlay system | New pseudo-element overlay framework | Extend Prestige's `content-over-media` pattern | Already handles z-index, pointer-events, border-radius inheritance, responsive gaps. |
| Aspect ratio enforcement | JavaScript-based resize observer | CSS `aspect-ratio` property with `--aspect-ratio` variable | Prestige already has this system with `@supports` fallback for older browsers. |
| Image srcset/sizes | Manual responsive image markup | Shopify's `image_url` + `image_tag` Liquid filters | Handles CDN URLs, format negotiation (WebP/AVIF), and width descriptors automatically. |
| Section-scoped CSS | Global class selectors | `#shopify-section-{{ section.id }}` scoping | Prestige's established pattern; prevents style leaking between sections. |

**Key insight:** The gradient overlay is the only genuinely new CSS pattern. Focal-point cropping, aspect ratios, and responsive images are all extensions of existing Prestige infrastructure.

## Common Pitfalls

### Pitfall 1: Pseudo-element Collision with Prestige's ::before
**What goes wrong:** Adding `.sp-gradient-overlay::before` to an element that already has Prestige's `content-over-media::before` causes only one pseudo-element to render (the one with higher specificity wins, or they collide).
**Why it happens:** CSS only allows one `::before` and one `::after` per element.
**How to avoid:** When `.sp-gradient-overlay` is applied to a `.content-over-media` element, the Studio Peake gradient `::before` must intentionally replace Prestige's overlay. Disable Prestige's overlay by setting `--content-over-media-overlay: transparent` or `--content-over-media-gradient-overlay: none` on the section. Use `::before` for the top gradient and `::after` for the bottom gradient.
**Warning signs:** Gradient appears but section's built-in overlay colour bleeds through, or gradient renders only on top but not bottom.

### Pitfall 2: object-position Not Working Without object-fit
**What goes wrong:** Setting `object-position` on an `<img>` has no visible effect.
**Why it happens:** `object-position` only affects images when `object-fit` is set to something other than `fill` (the default). Images must have `object-fit: cover` (or `contain`) for focal-point cropping to work.
**How to avoid:** Always pair focal-point object-position with `object-fit: cover`. Prestige already sets `object-fit: cover` on `.content-over-media` images, so this works automatically for those sections. Verify any new containers also set it.
**Warning signs:** Focal point setting in admin has no visible effect on the rendered image.

### Pitfall 3: Gradient z-index Covering Interactive Content
**What goes wrong:** Gradient overlays (positioned with `z-index: 1`) block clicks on buttons and links within the content.
**Why it happens:** The `::before`/`::after` pseudo-elements sit above the image but may also sit above content elements if z-index stacking is wrong.
**How to avoid:** Ensure `pointer-events: none` on both gradient pseudo-elements (already in the pattern above). Also ensure content elements have `z-index: 1` and `position: relative` (Prestige already does this for `.content-over-media > :not(img, ...)` children).
**Warning signs:** Buttons and links inside gradient-overlaid sections are not clickable.

### Pitfall 4: custom-fonts.css Loading Order
**What goes wrong:** The `custom-fonts.css` file exists (with Mynaruse Flare @font-face) but is not loaded anywhere in `theme.liquid`.
**Why it happens:** The file was created but never linked in the layout. STATE.md flags this as a known concern.
**How to avoid:** Include `custom-fonts.css` in the asset loading additions to `theme.liquid`. Place it before `studio-peake.css` so font-family references in custom styles resolve correctly.
**Warning signs:** Custom font defined but never rendered; browser uses fallback fonts.

### Pitfall 5: Liquid Division Returns Integer
**What goes wrong:** `{{ 75 | divided_by: 100 }}` returns `0` in Liquid (integer division).
**Why it happens:** Liquid performs integer division by default.
**How to avoid:** Use `divided_by: 100.0` (with decimal) to force float division. The gradient strength pattern above already accounts for this.
**Warning signs:** Gradient opacity slider has no visible effect (always outputs `0` or `1`).

## Code Examples

### Example 1: theme.liquid Asset Loading (Lines to Add)
```liquid
{%- comment -%} After line 67: {{- 'theme.css' | asset_url | stylesheet_tag: preload: true -}} {%- endcomment -%}
{{- 'custom-fonts.css' | asset_url | stylesheet_tag -}}
{{- 'studio-peake.css' | asset_url | stylesheet_tag -}}

{%- comment -%} After line 63: <script type="module" src="{{ 'theme.js' | asset_url }}"></script> {%- endcomment -%}
<script type="module" src="{{ 'studio-peake.js' | asset_url }}"></script>
```

### Example 2: Gradient Overlay Snippet (snippets/sp-gradient-overlay.liquid)
```liquid
{%- comment -%}
  Renders Studio Peake gradient overlay settings for a section.
  Usage: {% render 'sp-gradient-overlay', section: section %}
{%- endcomment -%}

{%- if section.settings.sp_enable_gradient -%}
  <style>
    #shopify-section-{{ section.id }} .sp-gradient-overlay::before,
    #shopify-section-{{ section.id }} .sp-gradient-overlay::after {
      opacity: {{ section.settings.sp_gradient_strength | divided_by: 100.0 }};
    }

    {%- comment -%} Disable Prestige's built-in overlay when SP gradient is active {%- endcomment -%}
    #shopify-section-{{ section.id }} .content-over-media:before {
      background: transparent;
    }
  </style>
{%- endif -%}
```

### Example 3: Focal Point Image Container
```liquid
{%- comment -%} Section-scoped focal point style {%- endcomment -%}
{%- if section.settings.image != blank -%}
  <style>
    #shopify-section-{{ section.id }} .sp-focal-image img {
      object-fit: cover;
      object-position: {{ section.settings.image.presentation.focal_point | default: '50% 50%' }};
    }
  </style>

  <div class="sp-focal-image">
    {{ section.settings.image | image_url: width: section.settings.image.width | image_tag: sizes: '100vw', widths: '400,600,800,1000,1200,1600,2000,2400,3200' }}
  </div>
{%- endif -%}
```

### Example 4: Adaptive Layout Class Assignment
```liquid
{%- liquid
  assign img = section.settings.image
  if img != blank
    assign ratio = img.aspect_ratio
    if ratio < 0.9
      assign sp_layout = 'portrait'
    elsif ratio > 1.2
      assign sp_layout = 'landscape'
    else
      assign sp_layout = 'square'
    endif
  else
    assign sp_layout = 'landscape'
  endif
-%}
```

### Example 5: Minimal studio-peake.js Scaffold
```javascript
// assets/studio-peake.js
// Studio Peake custom components and interactions
// Loaded as ES module -- can import from "vendor" via importmap

// Phase 1: No JS components needed (gradient overlays and focal point are pure CSS/Liquid)
// This file is scaffolded now for future phases

console.log('[Studio Peake] Custom theme layer loaded');
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `padding-bottom` hack for aspect ratio | CSS `aspect-ratio` property | 2021 (Safari 15+) | Prestige uses `aspect-ratio` with `@supports not` fallback for the padding hack. Use `aspect-ratio` directly. |
| Manual focal point X/Y inputs | Shopify `image_picker` built-in focal point | 2022 (Online Store 2.0) | No need for custom X/Y settings. Shopify's visual picker is superior UX. |
| Single overlay via `::before` | Dual gradient via `::before` + `::after` | N/A (project-specific) | Studio Peake's design requires two distinct gradients (top and bottom) simultaneously. |

**Browser support note:** Prestige v10.7.0 already uses `:has()` (53 occurrences in theme.css), which requires Safari 15.4+. This effectively raises the practical browser baseline above the stated Safari 14.1+ target. All Phase 1 CSS patterns (aspect-ratio, object-position, linear-gradient, ::before/::after) are supported in Safari 15.4+.

## Open Questions

1. **Which sections need gradient overlays?**
   - What we know: Sections using `content-over-media` pattern include: slideshow, newsletter, video, image-with-text-overlay, image-with-text-block, collection-banner, collection-list, main-blog, main-list-collections, media-grid, countdown.
   - What's unclear: Which of these specifically should receive the Studio Peake dual-gradient by default. The design says "image sections with overlaid text" -- this likely means slideshow, image-with-text-overlay, and image-with-text-block at minimum.
   - Recommendation: Apply to all `content-over-media` sections that have text content overlaid. Make it toggleable per section so the merchant can disable where not wanted.

2. **Adaptive layout exception mode (VISF-03) -- which components?**
   - What we know: VISF-03 says "specific components" adapt layout for different image proportions.
   - What's unclear: The Figma design would specify which components; we don't have access to the Figma file.
   - Recommendation: Implement the Liquid aspect-ratio detection utility (portrait/square/landscape classes) and initially apply to `image-with-text-block` and `image-with-text-overlay` sections. The CSS rules for each mode can be refined once Figma access clarifies the design intent.

3. **custom-fonts.css -- should it be merged into studio-peake.css?**
   - What we know: `custom-fonts.css` already exists with a Mynaruse Flare @font-face definition. It is 7 lines.
   - What's unclear: Whether additional custom fonts will be added in later phases.
   - Recommendation: Keep it separate for clarity, load it before `studio-peake.css` in `theme.liquid`. The separation makes font management clearer for future phases.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual browser testing (no automated test framework in Shopify theme projects) |
| Config file | none |
| Quick run command | `shopify theme dev --store=studio-peake.myshopify.com` |
| Full suite command | Manual cross-browser testing at breakpoints: 375px (mobile), 768px (tablet), 1440px (desktop) |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| VISF-01 | Gradient overlays render on image sections with text, both top and bottom visible | manual | Browser DevTools: inspect `::before` and `::after` computed styles on `.sp-gradient-overlay` elements | N/A |
| VISF-01 | Gradient toggle checkbox disables/enables overlay per section | manual | Shopify admin: toggle setting, preview section | N/A |
| VISF-01 | Gradient strength slider adjusts overlay opacity | manual | Shopify admin: adjust slider, verify opacity in DevTools | N/A |
| VISF-02 | Images maintain aspect ratio across mobile/tablet/desktop | manual | Resize browser window, verify no fixed-height layout breaks | N/A |
| VISF-02 | Focal point cropping positions image from configured point | manual | Set focal point on image in admin, verify `object-position` changes in preview | N/A |
| VISF-03 | Portrait images get different text layout than landscape | manual | Upload square vs landscape images to same section, compare text positioning | N/A |
| INFRA | studio-peake.css loads after theme.css without errors | smoke | Browser DevTools Network tab: verify load order and no 404s | N/A |
| INFRA | studio-peake.js loads after theme.js without errors | smoke | Browser console: verify `[Studio Peake]` log message, no errors | N/A |

### Sampling Rate
- **Per task commit:** `shopify theme dev` -- verify in browser preview
- **Per wave merge:** Full cross-browser check at 3 breakpoints (375px, 768px, 1440px)
- **Phase gate:** All sections with gradient overlays tested with light images, dark images, and mixed-contrast images

### Wave 0 Gaps
- [ ] `assets/studio-peake.css` -- new file, must be created
- [ ] `assets/studio-peake.js` -- new file, must be created
- [ ] `snippets/sp-gradient-overlay.liquid` -- reusable gradient snippet
- [ ] `layout/theme.liquid` -- must be modified to load new assets (2 lines added)

## Sources

### Primary (HIGH confidence)
- Prestige `theme.css` source analysis -- `content-over-media` class definition (lines 571-706), aspect-ratio system (lines 1656-1666), overlay pseudo-element pattern
- Prestige `theme.liquid` source analysis -- asset loading order (lines 51-67), importmap configuration
- Prestige `slideshow.liquid` -- `color_background` setting type for `gradient_overlay`, inline style injection via `--content-over-media-gradient-overlay`
- Prestige `image-with-text-overlay.liquid` -- overlay_color/overlay_opacity schema pattern, section-scoped CSS variables
- Shopify Liquid docs (shopify.dev) -- `focal_point` object: `x` and `y` properties (0-100 percentages), stringifies to `"X% Y%"` format
- Shopify Liquid docs (shopify.dev) -- `image_presentation` object with `focal_point` property

### Secondary (MEDIUM confidence)
- `.planning/research/STACK.md` -- project-level stack decisions (confirmed via source analysis)
- `.planning/phases/01-infrastructure-visual-foundation/01-CONTEXT.md` -- user decisions and code context insights

### Tertiary (LOW confidence)
- VISF-03 adaptive layout specifics -- which exact components need this treatment is unclear without Figma access. Liquid aspect-ratio detection approach is verified but application targets are assumed.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all patterns verified directly in Prestige source code
- Architecture (gradient overlay): HIGH -- `content-over-media` pattern fully understood, dual-gradient approach is standard CSS
- Architecture (focal point): HIGH -- Shopify API verified via official docs, CSS mapping is straightforward
- Architecture (adaptive layout): MEDIUM -- approach is sound but target components unclear without Figma
- Pitfalls: HIGH -- all identified from direct code analysis of collision points

**Research date:** 2026-03-12
**Valid until:** 2026-04-12 (stable -- Prestige theme and Shopify Liquid API change slowly)
