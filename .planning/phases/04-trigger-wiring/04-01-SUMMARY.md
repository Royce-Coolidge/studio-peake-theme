---
phase: 04-trigger-wiring
plan: 01
subsystem: ui
tags: [liquid, shopify, aria-controls, modal, button-block, product-page]

# Dependency graph
requires:
  - phase: 01-infrastructure-visual-foundation
    provides: product-enquiry-modal section with fixed id="enquiry-modal"
  - phase: 02-form-and-field-system
    provides: enquiry modal with functional contact form
provides:
  - aria_controls text setting on button block in main-product.liquid
  - conditional render branch in product-info.liquid wiring button to modal
affects:
  - 04-trigger-wiring (checkpoint verification in Task 2)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Conditional render branching — aria_controls branch omits href so button.liquid renders <button> not <a>; link branch preserves original behaviour

key-files:
  created: []
  modified:
    - sections/main-product.liquid
    - snippets/product-info.liquid

key-decisions:
  - "aria_controls setting uses plain string label (not t: key) — adding locale keys is out of scope; button_group block already uses plain strings, consistent approach"
  - "href and aria_controls are mutually exclusive per render branch — no mixed render call; prevents button.liquid rendering <a> when modal target is set"

patterns-established:
  - "Modal trigger pattern: render 'button' with aria_controls only (no href) — button.liquid produces <button aria-controls='...'>; existing x-modal handles clicks natively"

requirements-completed: [TRIG-01, TRIG-02, TRIG-03]

# Metrics
duration: 5min
completed: 2026-03-17
---

# Phase 4 Plan 1: Trigger Wiring Summary

**Button block wired to enquiry modal via aria_controls schema setting and conditional render branch — clicking Enquire renders a `<button aria-controls="enquiry-modal">` without navigation**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-17T16:07:00Z
- **Completed:** 2026-03-17T16:12:15Z
- **Tasks:** 1 of 2 (Task 2 is a human-verify checkpoint — paused)
- **Files modified:** 2

## Accomplishments

- Added `aria_controls` text setting to button block schema in `main-product.liquid` (after link URL, before text setting), with info text guiding merchants
- Updated render call in `product-info.liquid` to branch on `aria_controls`: modal-trigger path passes `aria_controls` with no `href`; link path preserves original `href` behaviour
- No JavaScript added — `x-modal` already handles `aria-controls` click events natively

## Task Commits

1. **Task 1: Add aria_controls schema setting and conditional render call** - `5c07dd8` (feat)

**Plan metadata:** TBD (docs: after checkpoint approval)

## Files Created/Modified

- `sections/main-product.liquid` — Added `aria_controls` text setting to button block schema (lines 1761-1765)
- `snippets/product-info.liquid` — Replaced single render call with conditional branch (lines 513-521)

## Decisions Made

- Plain string label used for `aria_controls` setting (`"Modal ID (aria-controls)"`) rather than a translation key — consistent with `button_group` block which also uses plain strings; locale files are out of scope
- `href` and `aria_controls` are mutually exclusive in the render call — prevents `button.liquid` from rendering an `<a>` element when a modal target is set (which would navigate on click and break TRIG-03)

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Task 1 complete and committed. Waiting for human verification in Task 2.
- After checkpoint approval: plan is complete, all TRIG requirements met.
- Merchant must enter `enquiry-modal` in the "Modal ID (aria-controls)" field on each product page button block to activate the trigger.

---
*Phase: 04-trigger-wiring*
*Completed: 2026-03-17*
