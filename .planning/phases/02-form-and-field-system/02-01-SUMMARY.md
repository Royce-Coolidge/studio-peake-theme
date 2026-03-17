---
phase: 02-form-and-field-system
plan: 01
subsystem: ui
tags: [shopify, liquid, contact-form, modal, form-fields]

# Dependency graph
requires:
  - phase: 01-infrastructure-visual-foundation
    provides: product-enquiry-modal section shell with x-modal wrapper and 40/60 layout
provides:
  - Complete Shopify contact form inside enquiry modal with 10 togglable field blocks
  - Inline success state (WE'LL BE IN TOUCH) using posted_successfully? with auto-open after POST redirect
  - Error banner rendering via banner snippet with auto-open on validation errors
  - Form reset on modal close via dialog:after-hide JS event
  - Default block entries in overlay-group.json for all 10 fields
  - Underline-only input styling and outlined submit button
  - Marketing opt-in with richtext editable disclaimer
affects:
  - 03-product-context-bridge
  - 04-keyline-animation-system

# Tech tracking
tech-stack:
  added: []
  patterns:
    - collect-then-render pairing for sibling fields (first_name/last_name, country/postcode)
    - block-type toggling via schema limit:1 blocks, merchant controls field visibility
    - all_country_option_tags for country select dropdown
    - auto-open modal after Shopify contact form POST redirect using DOMContentLoaded JS

key-files:
  created: []
  modified:
    - sections/product-enquiry-modal.liquid
    - sections/overlay-group.json

key-decisions:
  - "Collect-then-render pattern: first pass detects which paired fields are present, second pass renders in merchant block order — avoids fixed layout assumptions while preserving 50/50 pairing"
  - "notes field uses contact[body] not contact[notes] — Shopify maps contact[body] to email body"
  - "No required HTML attrs on any field — server-side validation only (per prior decision)"
  - "Marketing disclaimer uses richtext setting so merchant can include links in consent text"
  - "Both success and form states rendered in DOM simultaneously; JS toggles visibility — required because Shopify contact form POST causes full page reload"
  - "Modal auto-opens after POST redirect via JS checking Liquid-rendered data attribute on DOMContentLoaded"

patterns-established:
  - "Collect-then-render: scan blocks first pass for flags, render in second pass with rendered_* guard vars to avoid duplicate output"
  - "Fieldset-row wrapping: paired fields share a single fieldset-row div; single field renders in plain div — auto-fit columns handle width automatically"
  - "Auto-open modal after Shopify form POST: Liquid writes posted_successfully/errors state into data attribute; JS reads on DOMContentLoaded and calls modal.show()"

requirements-completed: [FORM-01, FORM-02, FORM-03, FORM-04, FORM-05, FORM-06, FORM-07, FORM-08, FORM-09, FORM-10, SUBM-01, SUBM-02, SUBM-03, SUBM-04, SUBM-05]

# Metrics
duration: ~90min
completed: 2026-03-17
---

# Phase 2 Plan 01: Form and Field System Summary

**Shopify contact form with 10 togglable schema blocks, collect-then-render paired field layout, auto-open modal after POST redirect, inline success state, and form reset on modal close**

## Performance

- **Duration:** ~90 min
- **Started:** 2026-03-17
- **Completed:** 2026-03-17
- **Tasks:** 3 (2 auto + 1 checkpoint:human-verify — approved)
- **Files modified:** 2

## Accomplishments

- Built complete contact form inside enquiry-modal__form-content using Shopify's `form 'contact'` tag
- Implemented 10 block types (first_name, last_name, email, company, phone, address, country, postcode, notes, marketing) each with schema limit: 1 for merchant toggling
- Paired first_name/last_name and country/postcode in fieldset-row divs using collect-then-render pattern
- Country field uses all_country_option_tags via select snippet for full country dropdown
- Modal auto-opens after Shopify contact form POST redirect (both success and validation error paths) via JS on DOMContentLoaded
- Success state shows "WE'LL BE IN TOUCH" heading inline; form resets to blank on dialog:after-hide
- Added 10 default blocks to overlay-group.json for out-of-box experience
- Underline-only input styling, outlined submit button, and marketing opt-in with editable richtext disclaimer — finalized during human verification

## Task Commits

Each task was committed atomically:

1. **Task 1: Build complete form template with 10 field blocks and schema** - `4390fc5` (feat)
2. **Task 2: Add default block entries to overlay group JSON** - `d928c4e` (feat)
3. **Task 3: Human verification checkpoint — approved** - (no single commit; fixes applied during review)

**Checkpoint review fixes (applied during human verification):**
- `cc883f9` — render both form states in DOM for JS reset toggle
- `d70431e` — auto-open modal after form submission to show success state
- `f955873` — auto-open modal on form validation errors
- `a8f2e67` — button-font labels and underline-only inputs
- `ead5c04` — revert: remove button font from input placeholder text
- `5954fd3` — revert: remove button font from form labels
- `cd27ad6` — marketing opt-in layout and outlined submit button
- `91ca527` — align marketing disclaimer with label and adjust font weights
- `24da422` — reduce marketing heading to regular font weight

## Files Created/Modified

- `sections/product-enquiry-modal.liquid` — Complete contact form replacing placeholder; form tag, success/error states, 10 block renderers, auto-open JS, form reset handler, 10-block schema
- `sections/overlay-group.json` — Added blocks and block_order to product-enquiry-modal entry with all 10 field types in natural form flow order

## Decisions Made

- **Both states in DOM simultaneously:** Shopify contact form POSTs to the same URL, causing a full page reload. The modal does not persist across this reload. Rendering both states in the DOM and toggling via JS (rather than Liquid if/else) allows form.reset() to work and the auto-open JS to target the correct state.
- **Auto-open modal after POST redirect:** JS checks a Liquid-rendered data attribute (posted_successfully? or form.errors) on DOMContentLoaded and calls modal.show(). This is the only way to restore modal context after the page reload.
- **Collect-then-render pattern:** First pass through blocks sets has_* flags; second pass renders in merchant block order. When the first of a pair is encountered, the fieldset-row div containing both fields is output. Merchants can reorder blocks freely.
- **contact[body] for notes:** Shopify maps this field to the email body; contact[notes] would not appear in the sent email.
- **Marketing disclaimer as richtext:** Merchants can include hyperlinks (e.g., to privacy policy) in the consent text.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Both form states must be in DOM for post-reload modal to work correctly**
- **Found during:** Task 3 checkpoint review
- **Issue:** Original implementation used Liquid if/else for success vs form states. After Shopify POST redirect the page reloads — the modal was not reopening, so the success state was never visible to the user.
- **Fix:** Render both states in the DOM with JS visibility toggle; added auto-open logic on DOMContentLoaded reading Liquid-rendered data attributes
- **Files modified:** sections/product-enquiry-modal.liquid
- **Committed in:** cc883f9, d70431e, f955873

**2. [Rule 1 - Bug] Reverted button font from inputs and labels after visual review**
- **Found during:** Task 3 checkpoint review
- **Issue:** Applying button-font class to input placeholder text and form labels produced incorrect visual results
- **Fix:** Applied 2f8cec5 (placeholder), then reverted via ead5c04 and 5954fd3; button-font retained only on submit button
- **Files modified:** sections/product-enquiry-modal.liquid
- **Committed in:** ead5c04, 5954fd3

---

**Total deviations:** 2 auto-fixed (both Rule 1 bugs discovered during human verification)
**Impact on plan:** Both fixes essential for the form to function correctly and look correct. No scope creep.

## Issues Encountered

- Shopify contact form POST navigates to the same page URL, causing a full reload. Modal state does not survive the reload. Solved by rendering both states simultaneously and using JS to reopen the modal based on Liquid-rendered data attributes on DOMContentLoaded.

## User Setup Required

None — no external service configuration required. Shopify contact form routes to the store owner email automatically.

## Next Phase Readiness

- Form system complete and verified by user in browser and theme editor
- All 10 fields togglable, paired rows working, success/error states working, form reset working
- Ready for Phase 3: Product context bridge — pass product title/handle into the form via data attributes on main-product.liquid
- Phase 3 blocker noted in STATE.md: `product` Liquid object is nil inside overlay group, data bridge required

---
*Phase: 02-form-and-field-system*
*Completed: 2026-03-17*

## Self-Check: PASSED

- sections/product-enquiry-modal.liquid: FOUND
- sections/overlay-group.json: FOUND
- .planning/phases/02-form-and-field-system/02-01-SUMMARY.md: FOUND (this file)
- Commit 4390fc5: FOUND
- Commit d928c4e: FOUND
- Checkpoint review commits cc883f9, d70431e, f955873, a8f2e67, cd27ad6: FOUND
