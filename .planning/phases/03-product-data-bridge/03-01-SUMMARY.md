---
phase: 03-product-data-bridge
plan: 01
subsystem: ui
tags: [shopify, liquid, javascript, data-attributes, contact-form, modal]

# Dependency graph
requires:
  - phase: 02-form-and-field-system
    provides: enquiry modal with contact form fields, hidden field infrastructure, DOMContentLoaded script
provides:
  - Product title displayed as modal heading via JS data bridge
  - Product featured image rendered in modal left panel via JS-created img element
  - Hidden contact[Product] field pre-populated with product title for email submission
  - Fallback image setting for non-product pages (merchant-configurable in theme editor)
  - data-enquiry-product-title and data-enquiry-image-url attributes on main-product.liquid wrapper
affects: [04-keyline-animation-system, any phase modifying enquiry modal or main-product section]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Data attribute bridge pattern: product context emitted as data-* on main-product.liquid outermost div, consumed by modal JS via querySelector
    - replaceChildren() for safe DOM replacement (not innerHTML)
    - Merchant fallback image via image_picker schema setting with Shopify image_tag filter

key-files:
  created: []
  modified:
    - sections/main-product.liquid
    - sections/product-enquiry-modal.liquid

key-decisions:
  - "data-* attributes on outermost main-product div chosen as bridge mechanism because product Liquid object is nil inside overlay group sections"
  - "replaceChildren() used instead of innerHTML for image panel replacement — safer and explicit"
  - "Fallback image uses merchant-configurable image_picker setting; JS only replaces it if a real product imageUrl is present"
  - "Product heading element renders empty in Liquid; JS populates textContent (not innerHTML) since escape filter handles encoding"

patterns-established:
  - "Data attribute bridge: emit on source section wrapper, consume via querySelector in overlay section JS"
  - "Conditional data attributes: only rendered when product != blank, preventing empty attributes on non-product pages"

requirements-completed: [DATA-01, DATA-02, DATA-03, DATA-04]

# Metrics
duration: ~45min
completed: 2026-03-17
---

# Phase 3 Plan 01: Product Data Bridge Summary

**JS data bridge connecting main-product.liquid data attributes to enquiry modal heading, featured image panel, and hidden contact[Product] form field**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-03-17
- **Completed:** 2026-03-17
- **Tasks:** 2 (1 auto, 1 human-verify checkpoint)
- **Files modified:** 2

## Accomplishments

- Product title flows from product page into modal heading via JS reading data-enquiry-product-title attribute
- Product featured image replaces fallback/placeholder in left panel using JS-created img element via replaceChildren()
- Hidden input contact[Product] pre-populated with product title so it appears in the Shopify contact form email
- Fallback image_picker setting added to schema so merchants can configure a placeholder for non-product pages
- Two cosmetic spacing improvements applied during checkpoint review (product heading margin, marketing opt-in gap)

## Task Commits

Each task was committed atomically:

1. **Task 1: Emit product data attributes and build modal receiver** - `eebb1d1` (feat)
2. **Additional: Add spacing between product heading and form fields** - `db64758` (feat)
3. **Additional: Increase spacing between marketing opt-in and submit button** - `b6162bd` (feat)

## Files Created/Modified

- `sections/main-product.liquid` — Added data-enquiry-product-title and data-enquiry-image-url on outermost wrapper div, conditional on product != blank
- `sections/product-enquiry-modal.liquid` — Added: fallback image in image panel, empty product heading p.h2, hidden contact[Product] input, JS bridge reading data attributes and updating heading/image/hidden field; fallback_image schema setting

## Decisions Made

- data-* attribute bridge is the only viable approach — product Liquid object is nil inside overlay group sections, so Liquid cannot pass product context directly
- replaceChildren() preferred over innerHTML for DOM safety; textContent for heading since Liquid escape filter handles encoding
- Fallback image rendered in Liquid on page load; JS replaces it only when imageUrl is present, ensuring non-product pages always show the merchant-configured image

## Deviations from Plan

None — plan executed exactly as written. Two spacing commits (db64758, b6162bd) were cosmetic refinements discovered during the human-verify checkpoint and committed under the same plan scope.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. Merchants can optionally configure a fallback image via the "Fallback image" setting in the Product Enquiry Modal section in the Shopify theme editor.

## Next Phase Readiness

- All DATA requirements verified by user in browser across multiple product pages
- Product title, featured image, and hidden form field confirmed working
- Ready for Phase 4: Keyline Animation System

---
*Phase: 03-product-data-bridge*
*Completed: 2026-03-17*
