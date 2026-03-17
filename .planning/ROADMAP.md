# Roadmap: Product Enquiry Modal

## Overview

Build a product-specific enquiry modal on the Prestige v10.7.0 Shopify theme by composing existing primitives — the `x-modal` web component, the overlay group pattern, and the Shopify contact form. The work proceeds in five sequential phases: scaffold the modal shell, add the contact form with configurable fields, wire in the product data bridge, connect the trigger button, and apply final brand styling. Each phase delivers a verifiable capability that the next phase depends on.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Modal Scaffolding** - `x-modal` shell registered in overlay group, opens and closes correctly
- [ ] **Phase 2: Form and Field System** - Contact form with all configurable fields, success state, and error handling
- [ ] **Phase 3: Product Data Bridge** - Product title and image flow dynamically from product page into modal
- [ ] **Phase 4: Trigger Wiring** - Enquire button on product page opens the modal end-to-end
- [ ] **Phase 5: Visual Design** - Brand-aligned styling: layout, typography, inputs, image treatment

## Phase Details

### Phase 1: Modal Scaffolding
**Goal**: A full-screen modal overlay registered in the overlay group that opens, closes, traps focus, and survives editor events
**Depends on**: Nothing (first phase)
**Requirements**: MODL-01, MODL-02, MODL-03, MODL-04, MODL-05, MODL-06
**Success Criteria** (what must be TRUE):
  1. Clicking any trigger with `aria-controls="enquiry-modal"` opens a full-screen overlay
  2. The modal closes on the X button click, Escape key press, and backdrop click
  3. Focus is trapped inside the modal while open; scroll is locked on the body
  4. The modal survives Shopify theme editor open/close events without breaking
  5. The modal is present in the DOM on every page (registered in overlay group)
**Plans:** 1 plan
Plans:
- [ ] 01-01-PLAN.md — x-modal shell with layout, CSS, overlay group registration, and visual verification

### Phase 2: Form and Field System
**Goal**: A working Shopify contact form inside the modal with all ten fields individually togglable in the theme editor, inline success state, and error handling
**Depends on**: Phase 1
**Requirements**: FORM-01, FORM-02, FORM-03, FORM-04, FORM-05, FORM-06, FORM-07, FORM-08, FORM-09, FORM-10, SUBM-01, SUBM-02, SUBM-03, SUBM-04, SUBM-05
**Success Criteria** (what must be TRUE):
  1. Submitting the form sends an email to the store owner via Shopify's contact form
  2. After submission, the modal displays a "WE'LL BE IN TOUCH" success message without navigating away
  3. The success state preserves the 40/60 layout on desktop (image left, confirmation right)
  4. Each form field can be individually toggled on/off in the Shopify theme editor
  5. Form validation errors appear inline within the modal (not on a separate page)
**Plans**: TBD

### Phase 3: Product Data Bridge
**Goal**: The modal displays the correct product title and featured image for whichever product page the visitor is on
**Depends on**: Phase 2
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04
**Success Criteria** (what must be TRUE):
  1. The modal heading shows the product title of the current product page
  2. The product's featured image appears in the left panel of the modal on desktop
  3. The product name is included in the enquiry email submission (hidden field)
  4. Navigating between different product pages shows the correct product in the modal for each
**Plans**: TBD

### Phase 4: Trigger Wiring
**Goal**: The existing Enquire button block on the product page opens the enquiry modal
**Depends on**: Phase 1
**Requirements**: TRIG-01, TRIG-02, TRIG-03
**Success Criteria** (what must be TRUE):
  1. Clicking the Enquire button on any product page opens the enquiry modal
  2. A merchant can configure the button's `aria-controls` target via the theme editor
  3. The button does not navigate away from the product page when clicked
**Plans**: TBD

### Phase 5: Visual Design
**Goal**: The modal matches the Studio Peake brand: full-screen 40/60 desktop layout, underline-only inputs, uppercase button-font labels, full-height editorial product image
**Depends on**: Phase 4
**Requirements**: STYL-01, STYL-02, STYL-03, STYL-04, STYL-05, STYL-06
**Success Criteria** (what must be TRUE):
  1. On desktop, the modal presents a 40/60 split — product image fills the left panel edge-to-edge at full height
  2. On mobile, the layout is a single column showing only the form (no image)
  3. Form field labels are uppercase in the button font; inputs show an underline border only (no box)
  4. First Name / Last Name and Country / Postcode each appear on a single row as 50/50 grids
  5. The submit button matches the theme's standard button styling
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Modal Scaffolding | 0/1 | Planned | - |
| 2. Form and Field System | 0/? | Not started | - |
| 3. Product Data Bridge | 0/? | Not started | - |
| 4. Trigger Wiring | 0/? | Not started | - |
| 5. Visual Design | 0/? | Not started | - |
