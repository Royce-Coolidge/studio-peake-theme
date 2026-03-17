# Phase 3: Product Data Bridge - Research

**Researched:** 2026-03-17
**Domain:** Shopify Liquid data bridging, vanilla JS DOM, section schema image settings
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Image Display**
- Full-bleed cover — product image fills the entire 40% left panel edge-to-edge, full height, object-fit: cover
- Image stays visible on success state — preserves 40/60 layout during confirmation (per SUBM-04)
- Merchant-selectable fallback image — add a section setting for a default/fallback image shown when the product has no featured image (or on non-product pages)
- Product featured image is the default source — JS data bridge passes the featured image URL; merchant fallback only used when no product image is available

**Product Title**
- Show as modal heading above the form fields — replaces the current placeholder heading (per DATA-01)
- JS data bridge updates the heading text with the current product's title

**Hidden Field & Email**
- Hidden field uses `contact[Product]` — appears as "Product: Kensington Sideboard" in the enquiry email
- Title only in the hidden field (no URL)
- Product name in email body as a field, not as the email subject line — subject stays as Shopify's default

### Claude's Discretion
- JS data bridge implementation approach (data attributes, custom events, or direct DOM queries)
- How the merchant-selectable fallback image setting is structured in the schema
- How to handle non-product pages (if modal is triggered from a non-product page)
- Image sizing/srcset for performance

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DATA-01 | Product title displayed as modal heading (dynamic, from current product page) | JS bridge reads `data-product-title` from main-product section; writes to heading element in modal |
| DATA-02 | Product featured image displayed in left panel on desktop (dynamic) | JS bridge reads `data-product-image` URL from main-product section; swaps placeholder SVG for `<img>` tag; falls back to merchant section setting |
| DATA-03 | JS data bridge passes product context from product page into overlay group modal | `product` Liquid object is nil in overlay group — data attributes on main-product section div is the confirmed approach |
| DATA-04 | Hidden form field includes product name in email submission | Static hidden input `contact[Product]` rendered inside the form; value set by JS bridge from `data-product-title` |
</phase_requirements>

---

## Summary

The `product` Liquid object is nil inside overlay group sections. This is a Shopify platform constraint — overlay group sections render in a global context, not within any product page context. The confirmed workaround is a data attribute bridge: `sections/main-product.liquid` renders `data-` attributes containing product title and featured image URL onto a container div that exists in the product page DOM. A small JS snippet in `sections/product-enquiry-modal.liquid` reads those attributes and updates the modal's heading, image panel, and hidden field.

The image panel already has full CSS coverage (`object-fit: cover`, full width/height). The only DOM change needed is replacing the placeholder SVG with a real `<img>` element. The modal section schema needs one new setting: a merchant-selectable fallback `image_picker` used when no product data is found on the page.

The heading currently renders as a hardcoded placeholder `<p class="h2">PLACEHOLDER TITLE</p>` (within `.enquiry-modal__fields`). There is no existing heading element — one must be added. The hidden field `contact[Product]` must be added inside the `{% form 'contact' %}` block.

**Primary recommendation:** Use `data-enquiry-product-title` and `data-enquiry-image-url` attributes on the main-product section's outer wrapper div; read them via `document.querySelector` in the modal script on DOMContentLoaded.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Liquid (`product` object) | Shopify platform | Source of truth for product data at render time | Only way to access product data server-side in a section that has product context |
| Vanilla JS | ES2020+ | DOM manipulation to bridge data into modal | No framework; theme uses vanilla JS throughout |
| Shopify `image_url` + `image_tag` filters | Platform | Responsive image markup | Used consistently across all sections in this theme |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `section.settings.image` (image_picker) | Schema setting | Merchant fallback image | When `data-enquiry-image-url` is absent or empty |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| data attributes | Custom events dispatched from main-product | Events are less reliable — they fire once and the modal may not be listening yet; data attributes persist in DOM and can be read at any time |
| data attributes | `window.*` global variables | Globals work but pollute namespace and are harder to trace; data attributes are self-documenting and scoped to the element |
| `featured_media` (image object) | `featured_image` | `featured_media` is the correct property for the first media item; `featured_image` is a legacy alias — both work but `featured_media` is current |

---

## Architecture Patterns

### Data Flow

```
sections/main-product.liquid (product page)
  └── outer wrapper div
        data-enquiry-product-title="{{ product.title | escape }}"
        data-enquiry-image-url="{{ product.featured_media | image_url: width: 1200 }}"

sections/product-enquiry-modal.liquid (overlay group)
  └── DOMContentLoaded JS script
        1. querySelector('[data-enquiry-product-title]')
        2. Read title → update heading element text
        3. Read image URL → swap placeholder SVG for <img>
        4. Set hidden input value
        5. If no data found → show fallback image from section setting
```

### Pattern 1: Data Attribute Bridge on Main Product Section

**What:** Render product data as `data-` attributes on the main-product section's outermost div. The modal JS reads these at DOMContentLoaded.

**When to use:** Always — this is the locked project decision and the only clean solution given that `product` Liquid is nil in overlay group.

**Example — Liquid side (main-product.liquid):**
```liquid
{# Add to the outer section wrapper div #}
<div class="section-spacing ..."
     data-enquiry-product-title="{{ product.title | escape }}"
     data-enquiry-image-url="{{ product.featured_media | image_url: width: 1200 }}">
```

**Example — JS side (product-enquiry-modal.liquid script block):**
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('enquiry-modal');
  if (!modal) return;

  // Read product data from main-product section
  const productSource = document.querySelector('[data-enquiry-product-title]');
  const productTitle = productSource?.dataset.enquiryProductTitle || '';
  const imageUrl = productSource?.dataset.enquiryImageUrl || '';

  // Update heading
  const heading = modal.querySelector('.enquiry-modal__product-heading');
  if (heading && productTitle) heading.textContent = productTitle;

  // Update hidden field
  const hiddenField = modal.querySelector('input[name="contact[Product]"]');
  if (hiddenField && productTitle) hiddenField.value = productTitle;

  // Update image
  const imagePanel = modal.querySelector('.enquiry-modal__image-panel');
  if (imagePanel && imageUrl) {
    imagePanel.innerHTML = `<img class="enquiry-modal__image" src="${imageUrl}" alt="${productTitle}" loading="eager">`;
  }
  // else: fallback image already rendered server-side from section setting
});
```

### Pattern 2: Fallback Image via Section Setting

**What:** A server-side rendered `<img>` from `section.settings.fallback_image` acts as the default content of the image panel. JS replaces it if product data is found.

**Why:** Handles non-product pages and products with no featured image. The fallback is always in the DOM — JS only replaces it when product data is available.

**Example — Liquid (product-enquiry-modal.liquid image panel):**
```liquid
<div class="enquiry-modal__image-panel" aria-hidden="true">
  {%- if section.settings.fallback_image != blank -%}
    {{- section.settings.fallback_image | image_url: width: section.settings.fallback_image.width
        | image_tag: class: 'enquiry-modal__image',
                     sizes: '40vw',
                     widths: '400,600,800,1000,1200,1600',
                     loading: 'eager' -}}
  {%- else -%}
    {{- 'lifestyle-1' | placeholder_svg_tag: 'enquiry-modal__image placeholder' -}}
  {%- endif -%}
</div>
```

**Example — Schema setting:**
```json
{
  "type": "image_picker",
  "id": "fallback_image",
  "label": "Fallback image",
  "info": "Shown when no product image is available"
}
```

### Pattern 3: Hidden Form Field for Email

**What:** A static hidden `<input>` inside the `{% form 'contact' %}` block. Value is set by JS bridge. Shopify contact form emails render `contact[Product]` as "Product: [value]".

**Example:**
```liquid
{%- form 'contact', class: 'form' -%}
  <input type="hidden" name="contact[Product]" value="">
  {# ... rest of form ... #}
{%- endform -%}
```

### Pattern 4: Product Heading Element

**What:** A new `<p class="h2 enquiry-modal__product-heading">` element inserted above `.enquiry-modal__fields`. This replaces what the CONTEXT.md calls the "placeholder heading".

**When to use:** Always rendered in the DOM (even with empty text), so JS can target it reliably.

**Example:**
```liquid
<div class="enquiry-modal__fields" {% if form.posted_successfully? %}hidden{% endif %}>
  <p class="h2 enquiry-modal__product-heading"></p>
  {# ... form fields ... #}
</div>
```

### Anti-Patterns to Avoid

- **Reading product data from the URL:** Fragile — URL structure is not guaranteed; handle tag and collection context breaks it.
- **Shopify AJAX API fetch for product data:** Adds async complexity and a network request. Data attributes are synchronous and available immediately.
- **Setting `innerHTML` of the heading with `productTitle` directly from a `data-` attribute without escaping:** The Liquid `escape` filter on the data attribute handles HTML entities server-side. Do not re-escape in JS — just use `textContent` for heading and hidden field value (not `innerHTML`).
- **Putting product data in `sessionStorage` or `localStorage`:** Stale data risk between product page navigations in a SPA-style browsing pattern. Data attributes update on every fresh page load.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive product images | Custom CDN URL manipulation | Shopify `image_url: width: N` filter | Shopify CDN handles format negotiation, WebP, etc. |
| Image srcset | Manual string concatenation | `image_tag` filter with `widths:` parameter | Theme pattern — consistent with all other sections |
| HTML entity encoding in data attributes | Custom JS escaping | Liquid `escape` filter at render time | Applied in Liquid; `textContent` in JS is safe by design |

---

## Common Pitfalls

### Pitfall 1: `product` is nil in Overlay Group — No Liquid Shortcut

**What goes wrong:** Developer tries to use `{{ product.title }}` or `{{ product.featured_media }}` directly inside `sections/product-enquiry-modal.liquid`. These return empty strings silently.

**Why it happens:** Shopify overlay group sections render without a product context. The `product` Liquid object is only available in sections rendered on product templates.

**How to avoid:** ALL product data must come via the JS data bridge from `main-product.liquid`. This is confirmed in STATE.md blockers.

**Warning signs:** Heading stays blank, image panel stays as placeholder SVG even after JS runs — check that the `data-enquiry-product-title` attribute actually exists in the DOM on a product page.

### Pitfall 2: JS Runs Before or After the Data Attribute Element is Present

**What goes wrong:** `document.querySelector('[data-enquiry-product-title]')` returns null even on a product page.

**Why it happens:** If the script runs before `DOMContentLoaded`, the main-product section element may not be in the DOM yet. Also possible if the modal script is in the `<head>` without `defer`.

**How to avoid:** The existing modal script already wraps in `DOMContentLoaded`. Keep the bridge logic inside the same listener. The `main-product.liquid` section is always rendered before the overlay group on a product page.

### Pitfall 3: `image_url` Filter Requires a Media Object, not `featured_image`

**What goes wrong:** Using `product.featured_image | image_url: width: 1200` on a media object where `featured_image` is a legacy shortcut. The result is fine in most cases but `featured_media` is the correct object for media with `image_url` filter.

**Why it happens:** Shopify docs sometimes show both; `featured_image` predates the media API.

**How to avoid:** Use `product.featured_media | image_url: width: 1200`. This is consistent with how `main-product.liquid` itself accesses the primary product image (see line 115 in the file: `product.selected_or_first_available_variant.featured_media | default: product.featured_media`).

**Warning signs:** Filter returns empty string for products with non-image media as their first item.

### Pitfall 4: Empty Heading on Non-Product Pages

**What goes wrong:** Modal is triggered from a non-product page (e.g., a custom page with a button). The heading element is empty and there is no fallback text.

**Why it happens:** `data-enquiry-product-title` attribute is absent when `main-product.liquid` is not on the page.

**How to avoid:** JS bridge is a no-op when `productSource` is null — `querySelector` returns null, optional chaining `?.dataset` returns undefined, heading stays empty. This is acceptable per CONTEXT.md ("Claude's Discretion" for non-product page handling). Heading simply stays blank. Fallback image shows from section setting if configured.

### Pitfall 5: `imagePanel.innerHTML =` Breaks Event Listeners

**What goes wrong:** Overwriting `innerHTML` of the image panel removes any child elements that may have event listeners attached.

**Why it happens:** `innerHTML` replaces the entire DOM subtree.

**How to avoid:** The image panel currently only contains a placeholder SVG with no event listeners — replacing `innerHTML` is safe here. Alternatively, create an `<img>` element and use `replaceChildren()` for clarity.

---

## Code Examples

### Complete Data Attribute Emission (main-product.liquid)

```liquid
{# Source: sections/main-product.liquid — outermost section wrapper div #}
<div class="section-spacing section-spacing--tight color-scheme color-scheme--{{ section.settings.color_scheme.id }} color-scheme--bg-{{ color_scheme_hash }}"
     {%- if product != blank -%}
     data-enquiry-product-title="{{ product.title | escape }}"
     data-enquiry-image-url="{{ product.featured_media | image_url: width: 1200 }}"
     {%- endif -%}>
```

### image_url Filter Pattern (consistent with theme)

```liquid
{# Source: sections/main-product.liquid line 115-116 — how theme generates product image URLs #}
{%- assign default_media = product.selected_or_first_available_variant.featured_media | default: product.featured_media -%}
{{- default_media | image_url: width: default_media.width | image_tag: loading: 'lazy', sizes: '60px', widths: '60,120,180' -}}
```

For the modal's 40vw panel, use widths that cover common screen sizes:
```
widths: '400,600,800,1000,1200,1600'
sizes: '40vw'
```

### Shopify Contact Form Hidden Field

```liquid
{# Inside {% form 'contact' %} block — appears in email as "Product: Kensington Sideboard" #}
<input type="hidden" name="contact[Product]" value="">
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `product.featured_image` | `product.featured_media` | Shopify media API introduction | `featured_media` supports all media types; `featured_image` is a legacy shortcut that still works but is less precise |

---

## Open Questions

1. **Should `data-enquiry-image-url` use a fixed width (e.g., 1200) or the image's natural width?**
   - What we know: Theme pattern for section images uses `image_url: width: object.width` to pass the natural width; for responsive `image_tag`, widths are specified separately.
   - What's unclear: For the data attribute approach, we're passing a single URL (not a srcset), so we need to pick a reasonable size.
   - Recommendation: Use `width: 1200` as a reasonable upper bound for a 40vw panel. The image will rarely exceed 600px actual display size even on large monitors (40% of 1600px = 640px). 1200 provides 2x retina headroom.

2. **Should the JS-injected `<img>` include a srcset?**
   - What we know: The data attribute approach passes a single URL. Generating a srcset in JS requires knowing multiple URLs.
   - What's unclear: Whether the image data attribute should carry multiple sized URLs.
   - Recommendation: Pass a single URL via data attribute at width 1200. This keeps the bridge simple. Full srcset optimization is a v2 concern (ENH-02 area). The image is decorative/contextual, not hero content.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual browser testing (no automated test framework detected) |
| Config file | none |
| Quick run command | Load product page in browser, open modal |
| Full suite command | Test on multiple products, non-product page, mobile viewport |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DATA-01 | Product title appears as modal heading | manual | n/a — DOM inspection | n/a |
| DATA-02 | Product featured image fills image panel | manual | n/a — visual check | n/a |
| DATA-03 | JS data bridge populates from main-product data attributes | manual | n/a — browser devtools | n/a |
| DATA-04 | Hidden field `contact[Product]` has product title value | manual | n/a — form submission check | n/a |

### Sampling Rate

- **Per task:** Load a product page, open the modal, verify heading text matches product title and image is correct
- **Per wave merge:** Test on at least 2 different products + 1 non-product page
- **Phase gate:** All 4 DATA requirements visually confirmed before `/gsd:verify-work`

### Wave 0 Gaps

None — no automated test infrastructure needed; all validation is manual browser testing for this phase.

---

## Sources

### Primary (HIGH confidence)

- Direct code inspection: `sections/product-enquiry-modal.liquid` — existing modal structure, JS script, schema
- Direct code inspection: `sections/main-product.liquid` — confirms `product` Liquid object is available; `featured_media` usage at line 115
- Direct code inspection: `assets/studio-peake.css` — confirms `.enquiry-modal__image` CSS is already present with `object-fit: cover`
- STATE.md — confirms "product Liquid object is nil inside overlay group — data bridge required, no Liquid shortcut"
- CONTEXT.md — confirms locked decisions and `data-` attribute approach

### Secondary (MEDIUM confidence)

- Theme pattern observation: `image_url: width: N` + `image_tag: widths:` is the consistent Shopify CDN image pattern across all theme sections (newsletter.liquid, footer.liquid, main-product.liquid, etc.)
- Shopify contact form: `contact[Product]` naming convention follows Shopify's key-value email rendering pattern (confirmed by existing `contact[body]` and `contact[marketing]` fields in the form)

### Tertiary (LOW confidence)

- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — confirmed by direct code inspection; no external dependencies needed
- Architecture: HIGH — data attribute bridge is confirmed project decision; all moving parts are visible in existing code
- Pitfalls: HIGH — confirmed by STATE.md blockers and direct Liquid behavior knowledge

**Research date:** 2026-03-17
**Valid until:** Stable indefinitely (Shopify platform constraint on overlay groups is fundamental, not version-specific)
