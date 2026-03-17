# Phase 3: Product Data Bridge - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

The modal displays the correct product title and featured image for whichever product page the visitor is on. Product data flows from the product page into the overlay group modal via a JS data bridge (the `product` Liquid object is nil inside overlay group sections). This phase connects the existing form (Phase 2) with product-specific data. Trigger wiring (Phase 4) and visual styling (Phase 5) are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Image Display
- **Full-bleed cover** — product image fills the entire 40% left panel edge-to-edge, full height, object-fit: cover
- **Image stays visible on success state** — preserves 40/60 layout during confirmation (per SUBM-04)
- **Merchant-selectable fallback image** — add a section setting for a default/fallback image shown when the product has no featured image (or on non-product pages)
- **Product featured image is the default source** — JS data bridge passes the featured image URL; merchant fallback only used when no product image is available

### Product Title
- **Show as modal heading** above the form fields — replaces the current placeholder heading (per DATA-01)
- JS data bridge updates the heading text with the current product's title

### Hidden Field & Email
- **Hidden field uses `contact[Product]`** — appears as "Product: Kensington Sideboard" in the enquiry email
- **Title only** in the hidden field (no URL)
- **Product name in email body** as a field, not as the email subject line — subject stays as Shopify's default

### Claude's Discretion
- JS data bridge implementation approach (data attributes, custom events, or direct DOM queries)
- How the merchant-selectable fallback image setting is structured in the schema
- How to handle non-product pages (if modal is triggered from a non-product page)
- Image sizing/srcset for performance

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `sections/product-enquiry-modal.liquid`: Modal shell with image panel (`enquiry-modal__image-panel`) and form panel, already has placeholder SVG in image panel and placeholder heading
- `sections/main-product.liquid`: Has access to `product` Liquid object — `product.title`, `product.featured_media`
- CSS already styles `.enquiry-modal__image` with `object-fit: cover`, `width: 100%`, `height: 100%`

### Established Patterns
- Project decision: JS data bridge via `data-` attributes on `main-product.liquid`
- `product` Liquid object is nil inside overlay group — confirmed in STATE.md blockers
- Modal uses `x-modal` web component with `dialog:after-hide` event for JS hooks

### Integration Points
- `sections/main-product.liquid` — source of product data (title, image URL)
- `sections/product-enquiry-modal.liquid` — target: heading text, image src, hidden form field
- `sections/overlay-group.json` — modal registered here, no changes needed
- The modal already has `enquiry-modal__image-panel` div and `enquiry-modal__form-content` div as targets

</code_context>

<specifics>
## Specific Ideas

- The image panel already has CSS for full-bleed cover treatment — just need to swap the placeholder SVG for an actual `<img>` tag
- The heading currently renders as `<p class="h2">PLACEHOLDER TITLE</p>` in the success state and as the form heading — both should update with product title

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-product-data-bridge*
*Context gathered: 2026-03-17*
