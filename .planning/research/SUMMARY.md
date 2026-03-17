# Project Research Summary

**Project:** Studio Peake — Product Enquiry Modal
**Domain:** Shopify theme modal — product-contextual overlay with contact form on Prestige v10.7.0
**Researched:** 2026-03-17
**Confidence:** HIGH

## Executive Summary

This is an additive feature on an existing Shopify theme — not a ground-up build. The right approach treats every decision as an integration question: which existing system handles this, and what is the minimal intervention to slot the new behaviour in? Research across all four areas converges on the same answer: the Prestige theme already has a complete modal system (`x-modal` / `DialogElement`), a proven overlay group pattern for global overlays (cart drawer, newsletter popup), a contact form pattern (`{% form 'contact' %}`), and a styling convention (inline section `<style>` blocks). The enquiry modal is a composition of these existing parts, not a new system.

The recommended build is a single new section file (`sections/product-enquiry-modal.liquid`) registered in the overlay group, using `x-modal` directly (not a subclass), triggered via `aria-controls` on an existing button block, with product data passed from the product section to the modal via JavaScript data attributes. The contact form uses the standard Shopify POST flow. No new web component class. No AJAX. Minimal JavaScript. The feature is well-scoped and all required technical primitives exist in the codebase.

The dominant risk is the cross-section product data problem: the modal lives in a global overlay group where the Liquid `product` object is nil, but the modal must display product title and image. This is the one non-obvious architectural challenge. The solution is a JavaScript data bridge — the product section writes `data-enquiry-product-title` and `data-enquiry-product-image` attributes to the DOM; a small script in `studio-peake.js` reads them and populates the modal on open. A secondary risk is ID coordination: the `x-modal` element and the trigger button's `aria-controls` attribute must match exactly, and since they live in different sections with different `section.id` values, the ID must be hard-coded as a fixed string. Both risks are fully understood and have clear mitigations.

---

## Key Findings

### Recommended Stack

Every technology decision is constrained by the existing Prestige v10.7.0 codebase. The stack is not a choice — it is an inventory of what already exists and how to use it correctly. All components needed are already present.

**Core technologies:**

- `x-modal` (Modal web component, `theme.js`) — modal open/close, focus trap, scroll lock, Escape key, editor events — use directly, no subclassing needed
- `{% form 'contact' %}` (Shopify Liquid tag) — standard contact form POST to `/contact`, CSRF-free, store owner email notification — confirmed working in `sections/contact.liquid`
- Shadow DOM `::part()` selectors (`studio-peake.css`) — only valid way to style the modal chrome (`::part(content)`) since shadow DOM blocks regular CSS
- `data-` attributes + `studio-peake.js` — the data bridge for passing `product.title` and `product.featured_image` from product section to global modal
- Section settings checkboxes (Shopify schema) — merchant-configurable field toggles without blocks, modelled on newsletter-popup pattern
- Overlay group (`sections/overlay-group.json`) — established registration point for all global overlays; cart drawer and newsletter popup already use this

No new JavaScript files. Extensions go in `studio-peake.js`. Section-scoped layout goes in inline `<style>` blocks.

### Expected Features

**Must have (table stakes):**
- Product name as modal heading and hidden form field — user expects modal to know which product they're asking about
- Product featured image in left panel — visual reassurance; essential for luxury positioning
- Name (first + last), Email (required), Notes/message fields — minimum viable enquiry
- Close button + Escape key + focus trap + scroll lock — WCAG and UX baseline; all handled by `DialogElement`
- `role="dialog"` + `aria-labelledby` — screen reader requirement; WCAG 2.1
- Visible form labels (not placeholder-only) — WCAG 1.3.5
- Inline success message on `form.posted_successfully?` — user must know submission worked without a redirect to a dead page
- Error messages from `form.errors` — user must know what went wrong
- Responsive layout: 50/50 desktop, stacked mobile — most luxury customers browse on mobile

**Should have (differentiators):**
- Configurable field set via theme editor (checkbox settings per field) — merchant value; avoids future support requests
- Optional fields: Company, Phone, Address, Country, Postcode, Marketing opt-in — B2B use case; consent compliance
- Brand typography parity: button font on labels, underline-only inputs — Studio Peake quality signal
- Full-height product image with `object-fit: cover` — editorial 50/50 editorial feel

**Defer (post-MVP):**
- Marketing opt-in field — GDPR consent handling needs consideration; low risk to defer
- Country / Address / Postcode fields — B2B edge case; toggle off by default initially

**Explicit anti-features (do not build):**
- AJAX form submission, custom email templates, third-party form integrations, variant selection inside modal, file upload, multi-step wizard, auto-open on page load, nested confirmation modals, separate thank-you page redirect

### Architecture Approach

The architecture is an integration into the existing overlay group pattern. The enquiry modal section registers in `overlay-group.json` alongside cart drawer and newsletter popup. Product data flows from `main-product.liquid` (via `data-` attributes) through a JS bridge in `studio-peake.js` into the modal's DOM before it opens. Form submission is a standard Shopify contact form POST — no JavaScript in the submission path. Trigger wiring uses `aria-controls` on the existing button block, which `DialogElement` picks up via a delegated body-level click listener. The `x-modal` element must carry a fixed hard-coded `id` (not `section.id`) because the trigger and modal render in different sections.

**Major components:**

1. `sections/product-enquiry-modal.liquid` (new) — the primary deliverable: `x-modal` markup, Shopify contact form, field toggle schema, `handle-editor-events` attribute, fixed `id="product-enquiry-modal"`
2. `assets/studio-peake.js` (modify) — JS data bridge: reads `data-enquiry-product-title` and `data-enquiry-product-image` from the product container; populates modal image `src` and hidden `contact[product_name]` field on DOMContentLoaded
3. `sections/main-product.liquid` (modify) — data source: adds `data-enquiry-product-title` and `data-enquiry-product-image` attributes to a container element
4. `blocks/button.liquid` (modify) — trigger: passes `aria_controls: 'product-enquiry-modal'` to `render 'button'` (or hardcode in product section)
5. `sections/overlay-group.json` (modify) — registers the new section
6. `assets/studio-peake.css` (modify) — `::part(content)` override for full-screen layout; 50/50 grid; mobile stack; underline inputs; label typography

### Critical Pitfalls

1. **Wrong section group schema** — The existing `contact.liquid` has `disabled_on: custom.overlay`. Do not copy its schema. The new section must have `enabled_on: { groups: ["custom.overlay"] }` or no `disabled_on` for the overlay group. Write from scratch, modelled on `newsletter-popup.liquid`.

2. **Button block does not pass `aria-controls`** — The `button` block's schema only wires up `href`. Do not use the block's URL field for modal triggering — it will navigate rather than open the modal. Hard-code `aria_controls: 'product-enquiry-modal'` in the render call from the product section, bypassing the block's URL setting.

3. **Modal ID must be a fixed string** — `x-modal` matches by `this.id` against `[aria-controls]`. Using `section.id` in the modal and a different `section.id` in the product section will never match. Use `id="product-enquiry-modal"` — hard-coded — in both places.

4. **`product` object is nil in overlay group** — The modal section renders globally; Liquid `{{ product.title }}` returns empty string. Use the JS data bridge to populate product title and image client-side, not Liquid server-side.

5. **Contact form redirect vs. modal success state** — After POST, Shopify reloads the page with `?contact_posted=true`. The modal must reopen on this query param (matching the `newsletter-popup.liquid` pattern: `{% if posted_successfully %}open{% endif %}`), and render a success message replacing the form. Do not redirect to `/contact` — ensure the form `action` defaults to the current product page URL.

---

## Implications for Roadmap

Based on research, the build has clear sequential dependencies and naturally maps to 5 focused implementation steps. This is a single-phase feature in terms of merchant value, but has internal sequencing requirements.

### Phase 1: Modal Scaffolding and Overlay Registration

**Rationale:** All other steps depend on the modal element existing in the DOM with the correct ID. This is the foundation everything else attaches to.
**Delivers:** `sections/product-enquiry-modal.liquid` with `x-modal` structure, fixed `id="product-enquiry-modal"`, `handle-editor-events`, section schema (field toggle checkboxes), registered in `overlay-group.json`. Modal opens and closes correctly (even with no product data and no form yet).
**Addresses (from FEATURES.md):** Close button, Escape key, focus trap, scroll lock, `role="dialog"`, `aria-labelledby`
**Avoids (from PITFALLS.md):** Pitfall 1 (schema group), Pitfall 3 (fixed ID), Pitfall 7 (x-modal vs x-drawer), Pitfall 9 (handle-editor-events)

### Phase 2: Contact Form and Field Toggle System

**Rationale:** Form is the core functional payload of the modal. Build it with placeholder product fields (empty hidden input) before wiring up the data bridge.
**Delivers:** Shopify `{% form 'contact' %}` inside the modal with required fields (first name, last name, email, notes), hidden `contact[product_name]` field, optional fields gated by `section.settings` checkboxes, `form.posted_successfully?` success state, `form.errors` error display, modal reopen on `?contact_posted=true`
**Addresses (from FEATURES.md):** All form fields, success feedback, error messages, field toggle system
**Avoids (from PITFALLS.md):** Pitfall 5 (form redirect), Pitfall 8 (email non-toggleable), Pitfall 11 (hidden field name collision)

### Phase 3: Product Data Bridge

**Rationale:** Depends on modal structure (Phase 1) and form hidden field (Phase 2) both existing. This is the only JS work required.
**Delivers:** `data-enquiry-product-title` and `data-enquiry-product-image` attributes in `main-product.liquid`; JS in `studio-peake.js` to populate modal image `src` and hidden product name field on DOMContentLoaded
**Addresses (from FEATURES.md):** Product name as heading, product image in left panel, hidden product field in form
**Avoids (from PITFALLS.md):** Pitfall 4 (product context lost), Pitfall 10 (image_url width parameter)

### Phase 4: Trigger Wiring

**Rationale:** Can proceed independently after Phase 1 (modal must exist), but best done after Phase 2 and 3 so the trigger can be tested end-to-end.
**Delivers:** Modified `blocks/button.liquid` (or product section render call) passing `aria_controls: 'product-enquiry-modal'` so the "Enquire" button opens the modal
**Avoids (from PITFALLS.md):** Pitfall 2 (button block href vs aria-controls), Pitfall 3 (ID coordination)

### Phase 5: Visual Design and Brand Styling

**Rationale:** All functionality complete; final pass aligns styling with Studio Peake design system.
**Delivers:** `studio-peake.css` additions — `x-modal::part(content)` override for full-screen, 50/50 grid layout, mobile stacked layout, underline-only inputs, uppercase button-font labels, full-height product image with `object-fit: cover`
**Addresses (from FEATURES.md):** Typography parity, full-height editorial image, responsive layout, luxury aesthetic
**Avoids (from PITFALLS.md):** Pitfall 6 (shadow DOM styling — use `::part()`)

### Phase Ordering Rationale

- Phase 1 before everything because `x-modal` registration is the dependency root — nothing else wires up without the element in the DOM
- Phase 2 before Phase 3 because the hidden product name field must exist before the JS bridge can target it
- Phase 4 is nearly independent but benefits from being tested against a working form (Phase 2) and data bridge (Phase 3)
- Phase 5 is always last — styling over working functionality, not alongside it

### Research Flags

Phases with standard patterns (can proceed without deeper research):
- **Phase 1:** Direct precedent in `newsletter-popup.liquid` and `cart-drawer.liquid` — pattern is fully documented
- **Phase 2:** `sections/contact.liquid` is a working reference; Shopify contact form behaviour is well-understood
- **Phase 3:** JS data bridge is a simple DOM read/write; no external APIs involved
- **Phase 4:** `snippets/button.liquid` already supports `aria_controls`; modification is minimal
- **Phase 5:** CSS conventions well-documented in `codebase/CONVENTIONS.md`; `::part()` is the correct selector

No phases require additional `/gsd:research-phase` — all unknowns were resolved during this research cycle.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All components read directly from `assets/theme.js`, `snippets/`, `sections/` — no inference |
| Features | HIGH | Requirements confirmed in PROJECT.md; accessibility standards from W3C/WCAG authoritative sources |
| Architecture | HIGH | Data flow pattern derived from direct code inspection of `theme.js:1650` and overlay group sections |
| Pitfalls | HIGH | Every pitfall sourced from direct codebase analysis; no speculative entries |

**Overall confidence:** HIGH

### Gaps to Address

- **Marketing opt-in GDPR handling:** The research deferred this field to post-MVP. If it becomes in-scope, the consent mechanism (checkbox, stored consent, email marketing list opt-in) needs a separate decision — Shopify's contact form does not handle consent storage natively.
- **Variant-specific product image:** If the requirement is extended to show the selected variant image (not just the featured image) in the modal, the JS bridge needs to listen to variant change events. This is explicitly out of current scope but is the most likely near-term extension.
- **Multiple enquiry buttons on one page:** If a page has both a product section and a featured-product section, two buttons could both carry `aria-controls="product-enquiry-modal"` pointing at the same single modal. The data bridge must identify which product to show — this edge case is not handled in current research and needs consideration if featured-product sections display the enquiry button.

---

## Sources

### Primary (HIGH confidence)

- Direct codebase inspection: `assets/theme.js` lines 1630–2042 — `DialogElement`, `Modal`, `Drawer`, `PopIn` class definitions and event delegation
- Direct codebase inspection: `snippets/shadow-dom-templates.liquid` — modal-default-template shadow DOM structure
- Direct codebase inspection: `snippets/button.liquid` — `aria_controls` parameter support
- Direct codebase inspection: `blocks/button.liquid` — block schema (confirms no `aria_controls` exposed)
- Direct codebase inspection: `sections/newsletter-popup.liquid` — reference implementation for overlay-group modal with form, `handle-editor-events`, `posted_successfully?` reopen
- Direct codebase inspection: `sections/contact.liquid` — `disabled_on: custom.overlay` constraint; contact form pattern
- Direct codebase inspection: `sections/overlay-group.json` — registration format
- Direct codebase inspection: `snippets/input.liquid` — form field rendering API
- [W3C ARIA Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/) — focus trap, role, aria-labelledby requirements
- [Shopify Accessibility Best Practices](https://shopify.dev/docs/storefronts/themes/best-practices/accessibility) — official Shopify docs

### Secondary (MEDIUM confidence)

- [Shopify Contact Form Redirect Behaviour](https://community.shopify.com/c/shopify-design/how-can-i-link-my-contact-form-to-a-thank-you-page/) — community thread confirming inline success behaviour
- [Modal UX Anti-Patterns](https://blog.logrocket.com/ux-design/modal-ux-best-practices/) — UX research on nested modals and overuse patterns

---

*Research completed: 2026-03-17*
*Ready for roadmap: yes*
