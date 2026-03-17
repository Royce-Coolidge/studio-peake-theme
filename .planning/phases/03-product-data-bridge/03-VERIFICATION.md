---
phase: 03-product-data-bridge
verified: 2026-03-17T00:00:00Z
status: human_needed
score: 4/5 must-haves verified
human_verification:
  - test: "Navigate to a product page, open the enquiry modal, and verify the heading shows the product title"
    expected: "Modal heading (p.h2.enquiry-modal__product-heading) displays the current product's title, not empty text"
    why_human: "JS assignment of textContent is runtime behaviour; grep confirms the code path exists but cannot confirm it executes correctly in the Shopify storefront context"
  - test: "Verify the product's featured image appears in the left panel on desktop (not the SVG placeholder or fallback)"
    expected: "An img element with the product's featured image URL fills the 40% left panel full-bleed on desktop"
    why_human: "replaceChildren() call is runtime DOM manipulation; cannot confirm the Shopify CDN image URL resolves and renders correctly"
  - test: "Inspect the hidden input after the modal opens and verify it holds the product title"
    expected: "input[name='contact[Product]'].value equals the product title shown in the heading"
    why_human: "JS value assignment happens at runtime; the HTML source always ships with value=''"
  - test: "Navigate to a second product page, open the modal, and verify title and image changed"
    expected: "Each product page shows its own title and image in the modal, not the previous product's data"
    why_human: "Requires cross-page navigation; each page load re-runs DOMContentLoaded from scratch, which grep cannot simulate"
  - test: "On a non-product page (or with fallback_image configured in theme editor), open the modal and verify the fallback image renders"
    expected: "Merchant-configured fallback image renders in the image panel when no product data attribute is present"
    why_human: "Requires theme editor configuration and a non-product page context; both are runtime conditions"
---

# Phase 3: Product Data Bridge — Verification Report

**Phase Goal:** The modal displays the correct product title and featured image for whichever product page the visitor is on
**Verified:** 2026-03-17
**Status:** human_needed — automated checks fully pass; runtime browser verification required to confirm goal achievement
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Modal heading shows the product title of the current product page | ? NEEDS HUMAN | Code path verified: `heading.textContent = productTitle` at modal line 187; heading element `p.h2.enquiry-modal__product-heading` present at line 38. Runtime confirmation required. |
| 2 | Product featured image appears in the left panel of the modal on desktop | ? NEEDS HUMAN | Code path verified: `imagePanel.replaceChildren(img)` with `img.src = imageUrl` at modal lines 197-203; `imageUrl` sourced from `data-enquiry-image-url` attribute. Runtime confirmation required. |
| 3 | Hidden field contact[Product] contains the product title and is submitted with the form | ? NEEDS HUMAN | Code path verified: `hiddenField.value = productTitle` at modal line 191; `<input type="hidden" name="contact[Product]" value="">` present at line 26. Runtime confirmation required. |
| 4 | Navigating to a different product page shows that product's data in the modal | ? NEEDS HUMAN | Behaviour follows from truths 1-3 executing on each page load; architecture is correct (no caching, DOMContentLoaded fires fresh per page). Requires multi-page browser test. |
| 5 | When no product data is available, a merchant-configured fallback image appears | ? NEEDS HUMAN | Code path verified: Liquid conditional `{%- if section.settings.fallback_image != blank -%}` at modal line 7; JS only replaces with real image when `imageUrl` is truthy (line 194). Requires theme editor + non-product page test. |

**Score:** 0/5 truths can be confirmed programmatically (all code paths verified; all blocked at runtime confirmation stage)

**Automated code verification score: 5/5** — every code path required to achieve each truth is present, substantive, and wired.

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `sections/main-product.liquid` | Data attribute emission for product title and featured image URL | VERIFIED | Lines 44-47: `data-enquiry-product-title="{{ product.title \| escape }}"` and `data-enquiry-image-url="{{ product.featured_media \| image_url: width: 1200 }}"` added conditionally inside `{%- if product != blank -%}` on the outermost wrapper div (line 43) |
| `sections/product-enquiry-modal.liquid` | JS bridge, fallback image setting, product heading, hidden field | VERIFIED | All four components present: fallback image Liquid conditional (lines 7-15), empty product heading `<p class="h2 enquiry-modal__product-heading">` (line 38), hidden input `contact[Product]` (line 26), JS bridge block (lines 180-204) |

Both artifacts are substantive (non-stub) and wired to each other via the data attribute mechanism.

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `sections/main-product.liquid` outermost div | `sections/product-enquiry-modal.liquid` JS | `data-enquiry-product-title` attribute read by `querySelector('[data-enquiry-product-title]')` | WIRED | Attribute emitted at line 45 of main-product.liquid; consumed at modal line 181 |
| `sections/product-enquiry-modal.liquid` JS | `.enquiry-modal__product-heading` element | `textContent` assignment | WIRED | `heading.textContent = productTitle` at line 187; element `p.h2.enquiry-modal__product-heading` at line 38 |
| `sections/product-enquiry-modal.liquid` JS | `input[name="contact[Product]"]` | `value` assignment | WIRED | `hiddenField.value = productTitle` at line 191; hidden input at line 26 |
| `sections/product-enquiry-modal.liquid` JS | `.enquiry-modal__image-panel` | `replaceChildren(img)` with `img.src = imageUrl` | WIRED | imageUrl sourced from `dataset.enquiryImageUrl` at line 183; replaceChildren at line 202 |
| Liquid fallback conditional | `.enquiry-modal__image-panel` | `section.settings.fallback_image` image_picker schema setting | WIRED | `fallback_image` image_picker setting in schema (lines 236-240); conditional renders merchant image or SVG at lines 7-15 |

All five key links verified present and correctly wired.

---

### Requirements Coverage

| Requirement | Description | Status | Evidence |
|-------------|-------------|--------|----------|
| DATA-01 | Product title displayed as modal heading (dynamic, from current product page) | VERIFIED (code) | `p.h2.enquiry-modal__product-heading` element present; JS assigns `heading.textContent = productTitle` where `productTitle` comes from `data-enquiry-product-title` on main-product.liquid |
| DATA-02 | Product featured image displayed in left panel on desktop (dynamic) | VERIFIED (code) | `imagePanel.replaceChildren(img)` call with `img.src = imageUrl` where `imageUrl` is sourced from `data-enquiry-image-url` on main-product.liquid; image panel targeted by `.enquiry-modal__image-panel` |
| DATA-03 | JS data bridge passes product context from product page into overlay group modal | VERIFIED (code) | Bridge mechanism: `data-*` attributes on main-product.liquid outermost div, consumed via `document.querySelector('[data-enquiry-product-title]')` in DOMContentLoaded listener inside the overlay group modal section |
| DATA-04 | Hidden form field includes product name in email submission | VERIFIED (code) | `<input type="hidden" name="contact[Product]" value="">` inside `{% form 'contact' %}` block; JS sets `hiddenField.value = productTitle` on page load |

No orphaned requirements: REQUIREMENTS.md traceability table lists DATA-01 through DATA-04 under Phase 3, all claimed in 03-01-PLAN.md frontmatter, all with code evidence.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | — | — | No anti-patterns found |

- No TODO/FIXME/HACK/PLACEHOLDER comments in either modified file (the one hit for "placeholder" was a schema translation key and the SVG comment in the else branch — both legitimate).
- No empty handler stubs (`return null`, `=> {}`, `console.log`-only implementations).
- No static returns masking database/API calls.
- `replaceChildren()` used instead of `innerHTML` (correct per plan research note).
- `textContent` used for heading (not `innerHTML`) — correct, since Liquid `escape` filter handles encoding.

---

### Human Verification Required

The following browser tests are required to confirm goal achievement. All code paths are verified; these tests confirm runtime execution.

#### 1. Product title in modal heading

**Test:** Open any product page in the Shopify theme preview (e.g. Kensington Sideboard). Open the enquiry modal (click any trigger with `aria-controls="enquiry-modal"` or run `document.getElementById('enquiry-modal').show()` in the browser console).
**Expected:** The modal heading (`p.h2.enquiry-modal__product-heading`) displays the product title (e.g. "Kensington Sideboard") — not empty, not a placeholder.
**Why human:** JS `textContent` assignment happens at runtime; cannot be confirmed by static analysis.

#### 2. Product featured image in left panel

**Test:** With the modal open on a product page, inspect the image panel on desktop (viewport ≥ 1000px).
**Expected:** The 40% left panel shows the product's featured image full-bleed (not the SVG placeholder or a blank space). The image should be object-fit cover, filling the full panel height.
**Why human:** `replaceChildren()` and the Shopify CDN image URL resolution are runtime behaviours.

#### 3. Hidden field value

**Test:** With the modal open on a product page, right-click > Inspect the form element. Find `<input type="hidden" name="contact[Product]">`.
**Expected:** The input's `value` attribute equals the product title shown in the heading.
**Why human:** JS assigns `hiddenField.value` at runtime; HTML source always ships with `value=""`.

#### 4. Cross-product navigation

**Test:** Navigate to a second, different product page. Open the modal again.
**Expected:** The modal heading and featured image have changed to reflect the new product.
**Why human:** Requires multi-page navigation in a live browser session.

#### 5. Fallback image on non-product pages

**Test:** In the Shopify theme editor, set a "Fallback image" in the Product Enquiry Modal section settings. Then visit a non-product page (e.g. the homepage or contact page), open the modal.
**Expected:** The merchant-configured fallback image appears in the left panel (not the SVG placeholder).
**Why human:** Requires theme editor configuration and a non-product page context.

---

### Gaps Summary

No gaps found. All code required to achieve the phase goal is present, substantive, and wired:

- `sections/main-product.liquid` correctly emits `data-enquiry-product-title` and `data-enquiry-image-url` conditionally when a product exists.
- `sections/product-enquiry-modal.liquid` correctly consumes both attributes via a DOMContentLoaded JS bridge, updates the heading, replaces the image panel, and pre-populates the hidden form field.
- The fallback image Liquid conditional and `image_picker` schema setting are correctly implemented.
- All four DATA requirements have clear code-level evidence.
- Three commits (`eebb1d1`, `db64758`, `b6162bd`) verified in git history.

The human verification gate (Task 2 in the plan) was acknowledged as passed by the user at plan execution time. The items above represent the standing verification checklist for any future regression.

---

_Verified: 2026-03-17_
_Verifier: Claude (gsd-verifier)_
