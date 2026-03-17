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
  - end-to-end trigger path: clicking Enquire on any product page opens the enquiry modal without navigation
affects:
  - 05-keyline-animation-system

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Conditional render branching — aria_controls branch omits href so button.liquid renders <button> not <a>; link branch preserves original behaviour
    - Plain string labels for schema settings outside the t: translation system — consistent with button_group block

key-files:
  created: []
  modified:
    - sections/main-product.liquid
    - snippets/product-info.liquid

key-decisions:
  - "aria_controls setting uses plain string label (not t: key) — adding locale keys is out of scope; button_group block already uses plain strings, consistent approach"
  - "href and aria_controls are mutually exclusive per render branch — no mixed render call; prevents button.liquid rendering <a> when modal target is set"
  - "Reuse existing button block as trigger — no new block type created"

patterns-established:
  - "Modal trigger pattern: render 'button' with aria_controls only (no href) — button.liquid produces <button aria-controls='...'>; existing x-modal handles clicks natively"
  - "Backward compatibility: when aria_controls is blank, render falls through to href branch preserving original link button behaviour"

requirements-completed: [TRIG-01, TRIG-02, TRIG-03]

# Metrics
duration: ~30min
completed: 2026-03-17
---

# Phase 4 Plan 1: Trigger Wiring Summary

**Button block wired to enquiry modal via aria_controls schema setting and conditional render branch — clicking Enquire renders `<button aria-controls="enquiry-modal">` without navigation, verified end-to-end by human**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-03-17T16:07:00Z
- **Completed:** 2026-03-17
- **Tasks:** 2 of 2 (including human-verify checkpoint — approved)
- **Files modified:** 2

## Accomplishments

- Added `aria_controls` text setting to button block schema in `main-product.liquid` (after link URL, before text setting), with info text guiding merchants
- Updated render call in `product-info.liquid` to branch on `aria_controls`: modal-trigger path passes `aria_controls` with no `href`; link path preserves original `href` behaviour
- No JavaScript added — `x-modal` already handles `aria-controls` click events natively
- Human verified end-to-end: button opens modal without page navigation; backward compatibility with link mode confirmed
- Additional commits during checkpoint review: `aria_controls` wired in `button_group` block for both buttons (`d86d127`); smooth modal open/close transitions added (`5c91e8d`)

## Task Commits

1. **Task 1: Add aria_controls schema setting and conditional render call** — `5c07dd8` (feat)
2. **Checkpoint additions: button_group block wiring** — `d86d127` (feat)
3. **Checkpoint additions: modal open/close transitions** — `5c91e8d` (feat)

**Plan metadata:** `6022cb3` (docs: complete trigger wiring plan)

## Files Created/Modified

- `sections/main-product.liquid` — Added `aria_controls` text setting to button block schema (lines 1761-1765)
- `snippets/product-info.liquid` — Replaced single render call with conditional branch (lines 513-521)

## Decisions Made

- Plain string label used for `aria_controls` setting (`"Modal ID (aria-controls)"`) rather than a translation key — consistent with `button_group` block which also uses plain strings; locale files are out of scope
- `href` and `aria_controls` are mutually exclusive in the render call — prevents `button.liquid` from rendering an `<a>` element when a modal target is set (which would navigate on click and break TRIG-03)
- Reused existing button block rather than creating a new block type — per prior planning decision

## Deviations from Plan

None — plan executed exactly as written. Commits `d86d127` and `5c91e8d` were added during the checkpoint review window and extend coverage; they are not unplanned deviations from this plan's scope.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All TRIG requirements met (TRIG-01, TRIG-02, TRIG-03)
- Merchant must enter `enquiry-modal` in the "Modal ID (aria-controls)" field on each product page button block to activate the trigger
- Core user-facing interaction (enquire → modal opens) is fully functional end-to-end
- Ready for next phase — review `04-CONTEXT.md` before planning the keyline animation system

## Self-Check: PASSED

- `sections/main-product.liquid` modified: confirmed
- `snippets/product-info.liquid` modified: confirmed
- Commit `5c07dd8` exists: confirmed
- Commit `d86d127` exists: confirmed
- Commit `5c91e8d` exists: confirmed

---
*Phase: 04-trigger-wiring*
*Completed: 2026-03-17*
