# Technology Stack: Product Enquiry Modal

**Project:** Studio Peake — Product Enquiry Modal
**Researched:** 2026-03-17
**Scope:** Additive milestone on Prestige v10.7.0. Not a ground-up decision — every choice must fit the existing system.

---

## Summary Recommendation

Build the enquiry modal as a new section in the overlay group, using the existing `x-modal` web component with a custom shadow DOM template, triggered by the existing button block via `aria-controls`. Use `{% form 'contact' %}` for form submission. No new JavaScript framework, no new JS file unless strictly necessary.

---

## Core Approach: `x-modal` Web Component

**Use:** `<x-modal>` (the `Modal` class registered at `window.customElements.define("x-modal", Modal)`)

**Why not `x-drawer`:** The design spec calls for a full-screen 50/50 layout — image left, form right. This is a modal pattern, not a sidebar drawer. The `Drawer` class slides in from the side and uses `drawer-default-template`; `Modal` fades in centered and uses `modal-default-template`. The full-screen variant needs neither of those defaults — it needs a custom shadow DOM template (see below).

**Why not a native `<dialog>` element:** The theme already has `DialogElement` → `Modal` → `Drawer` as a complete, production-tested abstraction with focus trap (via `FocusTrap` from vendor), scroll lock, Escape key handling, editor event integration (`shopify:block:select` / `shopify:block:deselect`), and animation via the motion library. Re-implementing any of that would be duplication and would miss the editor integration for free.

**Confidence:** HIGH — sourced directly from `assets/theme.js` (lines 1963–2000).

---

## Trigger Mechanism: `aria-controls` on Existing Button Block

**Use:** The existing `button` block (`blocks/button.liquid`) already passes `aria_controls` to the `button` snippet, which renders it as `aria-controls="[id]"` on the `<button>` element.

**How it works:** `DialogElement.connectedCallback()` registers a delegated click listener on `document.body` matching `[aria-controls="${this.id}"]`. Any button anywhere on the page with `aria-controls` pointing at the modal's ID will open it — no custom JS needed.

**What this means in practice:** The product page already has a button block. The merchant configures that block's URL field to be empty and sets an `aria-controls` value pointing at the enquiry modal's section ID. The modal opens automatically.

**Constraint:** The existing `button` block schema (`blocks/button.liquid`) does not have an `aria_controls` settings field — it only has `url`, `text`, `style`, `background`, `text_color`. The button snippet supports `aria_controls` as a parameter but the block's schema does not expose it. This means either: (a) the button block schema needs a new `text` setting for the modal ID, or (b) the button block renders with a hardcoded `aria-controls` value pointing at a stable ID. Option (b) is cleaner — hardcode the modal ID (e.g., `product-enquiry-modal`) in the button block render call within the product section, and give the modal section that stable ID.

**Confidence:** HIGH — sourced from `snippets/button.liquid` (line 82) and `assets/theme.js` (line 1650).

---

## Modal Placement: Overlay Group Section

**Use:** Add a new section (e.g., `sections/product-enquiry-modal.liquid`) to `sections/overlay-group.json`.

**Why:** The overlay group (`sections/overlay-group.json`, type `custom.overlay`) is the established pattern for globally-available overlays: cart-drawer and newsletter-popup already live here. This ensures the modal markup is present on every page without being tied to a specific template, and it benefits from the overlay group's position in the DOM (appended to body via `shouldAppendToBody: true` on `DialogElement`).

**Why not inside `main-product` section:** Putting a modal inside the product section ties it to the product template only and complicates section schema nesting. The overlay group keeps global overlays decoupled from page-specific sections, matching the existing pattern.

**Confidence:** HIGH — sourced from `sections/overlay-group.json` and `sections/cart-drawer.liquid`.

---

## Shadow DOM Template: Custom, Not Default

**Use:** A new custom shadow DOM template defined in `snippets/shadow-dom-templates.liquid`, not `modal-default-template`.

**Why:** `modal-default-template` includes a fixed header slot and a body slot — it has no provision for a two-column layout, no image slot, and its close button is in the shadow DOM header (not in the light DOM form panel). The enquiry modal needs a full-screen 50/50 grid: image column (left) and form panel (right). This requires a bespoke template structure, e.g.:

```html
<template id="product-enquiry-modal-template">
  <div part="base">
    <div part="overlay"></div>
    <div part="content">
      <slot name="image"></slot>
      <div part="form-panel">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
```

The close button moves to the light DOM (inside the default slot, in the form panel), using the existing `dialog-close-button` web component which works anywhere in the light or shadow DOM.

**How to activate it:** Add `template="product-enquiry-modal-template"` attribute to the `<x-modal>` element.

**Confidence:** HIGH — sourced from `snippets/shadow-dom-templates.liquid` and `assets/theme.js` (line 1969, `getAttribute("template")`).

---

## Form Submission: `{% form 'contact' %}`

**Use:** Shopify's built-in `{% form 'contact' %}` Liquid tag.

**Why:** This is the standard pattern for all store-owner email contact forms in Shopify themes. It generates a `<form>` that POSTs to `/contact` and routes submissions to the store's notification email. It handles CSRF automatically, provides `form.posted_successfully?` and `form.errors` objects, and requires zero server-side configuration. The existing `sections/contact.liquid` in this codebase uses exactly this pattern — the enquiry modal reuses it without modification.

**Hidden product field:** Include `<input type="hidden" name="contact[body]" value="{{ product.title }}">` (or append to it) to carry the product name into the submission. Use `contact[tags]` with a value like `product-enquiry` to allow filtering in the Shopify admin notifications.

**Submission behaviour:** Standard browser POST with redirect to `/contact#contact_form` on success. The `form.posted_successfully?` flag is checked on re-render to show a success state. This is intentional — out of scope is AJAX submission.

**Confidence:** HIGH — this is stable Shopify platform behaviour, confirmed in `sections/contact.liquid`.

---

## Form Fields: Section Settings (Checkboxes), Not Blocks

**Use:** Each form field (First Name, Last Name, Company, Email, Phone, Address, Country, Postcode, Notes, Marketing opt-in) as a `checkbox` setting in the section schema, not as blocks.

**Why not blocks:** The contact section uses blocks for arbitrary custom fields. The enquiry modal has a known, finite set of specific fields. Using blocks would require the merchant to manually add each field and get the field names right — which breaks the "toggle on/off" requirement. Settings checkboxes are simpler, more robust, and match the newsletter-popup pattern (`show_newsletter_form` checkbox).

**Why not hardcode all fields:** Some fields (Company, Address, Country, Postcode) are optional for many product enquiries. Merchant-controllable toggles avoid cluttering the form for use cases that don't need them.

**Implementation pattern (from `snippets/input.liquid`):** Each field renders via `{% render 'input', type: 'text', name: 'contact[first_name]', label: 'First Name', required: true %}`. The checkbox pattern from `snippets/checkbox.liquid` handles the marketing opt-in.

**Confidence:** HIGH — sourced from `sections/newsletter-popup.liquid` (checkbox settings pattern) and `sections/contact.liquid` (form field pattern).

---

## Product Data Injection: Liquid via `product` Object

**Use:** The `product` global Liquid object, available on product pages where the modal is triggered.

**Approach:** The enquiry modal section renders in the overlay group, which is global. The `product` object is only available when the current template is a product page. Use conditional rendering:

```liquid
{%- if product -%}
  {%- assign enquiry_image = product.featured_image -%}
  {%- assign enquiry_title = product.title -%}
{%- endif -%}
```

The product image renders via `{% render 'image', image: enquiry_image %}` (using the existing snippet). The product title populates both the modal heading and a hidden form field.

**Why not JavaScript injection:** Keeping this in Liquid avoids a JS dependency for data that is available server-side. The `product` object is reliably available on product pages — where the enquiry button exists.

**Constraint:** On non-product pages the modal section still renders (it's in the overlay group), but `product` will be nil. The modal simply won't be triggered on non-product pages because the button is only in the product template. The empty modal rendering is harmless.

**Confidence:** HIGH — the `product` object is a standard Shopify global, and the pattern of conditional rendering around it exists throughout this codebase (confirmed in `sections/main-product.liquid` patterns and `codebase/ARCHITECTURE.md`).

---

## Styling: Inline Section `<style>` + Existing CSS Classes

**Use:** Inline `<style>` block scoped to `#shopify-section-{{ section.id }}` within the section file, plus existing utility classes from the theme.

**Why:** This is the established convention for all sections in this codebase (confirmed in `codebase/ARCHITECTURE.md`: "Dynamic CSS computed in section `<style>` block"). The 50/50 layout grid, image sizing, form panel padding, and mobile stack behaviour all belong in this scoped block.

**CSS classes to reuse:** `.form`, `.form-control`, `.fieldset`, `.button`, `.button--outline`, `color-scheme`, `color-scheme--{{ section.settings.color_scheme.id }}` — all present in theme.css and used by existing sections.

**Do not add to `studio-peake.css`:** Section-scoped styles belong in the section file, not the global custom CSS file. `studio-peake.css` is for cross-section, theme-wide Studio Peake customisations.

**Confidence:** HIGH — sourced from `codebase/ARCHITECTURE.md` and `codebase/CONVENTIONS.md`.

---

## No New JavaScript Required

**Assertion:** For the described requirements, no new JS file is needed.

**Rationale:**
- Modal open/close: handled by `DialogElement` in `theme.js` via `aria-controls`
- Focus trap + Escape key: handled by `DialogElement` (uses `FocusTrap` from vendor)
- Close button: handled by `dialog-close-button` web component already in `theme.js`
- Form submission: standard browser POST, no JS needed
- Product data: injected via Liquid at render time

**Exception — if needed:** If the product image needs to be updated dynamically when the modal opens (e.g., to reflect a selected variant), a small enhancement to `assets/studio-peake.js` would be appropriate. This is out of scope per the PROJECT.md requirements. If it becomes in-scope, extend `studio-peake.js` — do not create a new file.

**Confidence:** HIGH for current requirements. MEDIUM for variant-image future requirement.

---

## What NOT to Use

| Approach | Why Not |
|---|---|
| Native `<dialog>` HTML element | Bypasses the theme's `DialogElement` system — loses focus trap, scroll lock, editor events, animation |
| Third-party form library (Klaviyo, Typeform embed) | Explicitly out of scope; adds dependency |
| AJAX form submission | Explicitly out of scope; standard POST is sufficient |
| New web component class | Nothing in the requirements exceeds what `x-modal` + `aria-controls` already provides |
| Inline JavaScript in section Liquid | Violates codebase conventions; JS belongs in assets |
| `x-drawer` component | Wrong motion model (slide-in sidebar) for a full-screen centered modal |
| Adding the modal to `main-product` section | Couples modal to product template; overlay group is the correct pattern |

---

## File Inventory

Files to create or modify:

| File | Action | Purpose |
|---|---|---|
| `sections/product-enquiry-modal.liquid` | Create | The modal section: markup, form, schema with field toggle settings |
| `snippets/shadow-dom-templates.liquid` | Modify | Add `product-enquiry-modal-template` template element |
| `sections/overlay-group.json` | Modify | Register the new section in the overlay group |

No new assets files unless a JS enhancement becomes necessary.

---

## Confidence Summary

| Area | Confidence | Basis |
|---|---|---|
| `x-modal` web component | HIGH | Read directly from `assets/theme.js` |
| `aria-controls` trigger mechanism | HIGH | Read directly from `assets/theme.js` and `snippets/button.liquid` |
| Overlay group placement | HIGH | Read directly from `sections/overlay-group.json` |
| Custom shadow DOM template | HIGH | Read directly from `snippets/shadow-dom-templates.liquid` |
| `{% form 'contact' %}` | HIGH | Confirmed in `sections/contact.liquid` |
| Section settings for field toggles | HIGH | Confirmed against newsletter-popup pattern |
| Product object availability | HIGH | Standard Shopify platform behaviour |
| No JS required | HIGH for current scope | All required behaviour is in existing components |
