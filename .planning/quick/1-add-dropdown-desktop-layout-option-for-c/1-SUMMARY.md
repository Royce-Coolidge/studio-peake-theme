---
phase: quick
plan: 1
subsystem: ui
tags: [shopify-liquid, collection-filters, popover, facets, css]

# Dependency graph
requires: []
provides:
  - "Dropdown filter layout option for collection pages"
  - "Popover-based filter UI with radio-circle styling"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "sp-filter-dropdown component pattern with toggle popover and facets-form integration"

key-files:
  created: []
  modified:
    - sections/main-collection.liquid
    - assets/studio-peake.css
    - locales/en.default.schema.json
    - locales/fr.schema.json
    - snippets/active-facets.liquid

key-decisions:
  - "Used facets-form with update-on-change for immediate AJAX filtering (consistent with sidebar behavior)"
  - "Checkbox inputs with radio-circle visual styling to support multi-select while matching brand design"
  - "Drawer completely hidden via hidden attribute when dropdown layout selected (no fallback)"
  - "Popover positioned left-aligned on both mobile and desktop for consistent behavior"

patterns-established:
  - "sp-filter-dropdown: Popover toggle pattern with aria-expanded and click-outside close"

requirements-completed: [DROPDOWN-FILTER-LAYOUT]

# Metrics
duration: 5min
completed: 2026-03-27
---

# Quick Task 1: Add Dropdown Desktop Layout Option for Collection Filters Summary

**Dropdown filter popover with radio-circle styled values, facets-form AJAX filtering, and responsive popover on all screen sizes**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-27T16:22:47Z
- **Completed:** 2026-03-27T16:28:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Added "Dropdown" as third desktop layout option in collection filter settings (alongside Sidebar and Drawer)
- Built popover filter UI with radio-circle indicators using brand color rgb(74, 38, 43)
- Integrated facets-form component with update-on-change for immediate AJAX filter application
- Added English and French locale translations

## Task Commits

Each task was committed atomically:

1. **Task 1: Add dropdown schema option, locale translations, and template conditionals** - `63746a0` (feat)
2. **Task 2: Add dropdown filter popover CSS with radio-circle styling** - `3a15727` (feat)

## Files Created/Modified
- `sections/main-collection.liquid` - Schema option, dropdown popover HTML with facets-form, toggle script, drawer hidden for dropdown
- `assets/studio-peake.css` - Full sp-filter-dropdown component styles (popover, radio circles, responsive)
- `locales/en.default.schema.json` - "Dropdown" English translation
- `locales/fr.schema.json` - "Menu deroulant" French translation
- `snippets/active-facets.liquid` - Center active facets for dropdown layout

## Decisions Made
- Used checkbox inputs with radio-circle visual styling since Shopify facets support multi-select
- Drawer is completely hidden (not just md:hidden) for dropdown layout per user requirement
- Popover works identically on mobile and desktop (no drawer fallback)
- Used existing `collection.faceting.filter_button` locale key for button text
- All filter text uppercased to match brand design

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Combined HTML popover into Task 1**
- **Found during:** Task 1
- **Issue:** Plan split HTML creation into Task 2, but the template conditionals and popover HTML were tightly coupled and needed to be in the same conditional block
- **Fix:** Included the full popover HTML and toggle script in Task 1 alongside schema/locale changes; Task 2 focused purely on CSS
- **Files modified:** sections/main-collection.liquid
- **Verification:** Both grep verifications pass
- **Committed in:** 63746a0

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Minor structural reorganization between tasks. All planned functionality delivered.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Dropdown filter layout is fully functional and selectable in theme editor
- No blockers or concerns

---
*Quick Task: 1-add-dropdown-desktop-layout-option-for-c*
*Completed: 2026-03-27*
