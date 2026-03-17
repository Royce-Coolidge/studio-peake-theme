# Requirements: Product Enquiry Modal

**Defined:** 2026-03-17
**Core Value:** Customers can enquire about any specific product through a visually rich, on-page modal without leaving the product page

## v1 Requirements

### Modal Structure

- [ ] **MODL-01**: Modal opens as full-screen overlay using existing `x-modal` web component
- [ ] **MODL-02**: Desktop layout is 40/60 split — product image left (40%), form/content right (60%)
- [ ] **MODL-03**: Mobile layout is single column — form only, no image
- [ ] **MODL-04**: Close button (X) positioned top-right of form panel, inherits cross icon animation from theme settings
- [ ] **MODL-05**: Modal registered in overlay group (`sections/overlay-group.json`)
- [ ] **MODL-06**: Hardcoded modal ID (`enquiry-modal`) for reliable trigger wiring

### Product Data

- [x] **DATA-01**: Product title displayed as modal heading (dynamic, from current product page)
- [x] **DATA-02**: Product featured image displayed in left panel on desktop (dynamic)
- [x] **DATA-03**: JS data bridge passes product context from product page into overlay group modal
- [x] **DATA-04**: Hidden form field includes product name in email submission

### Form Fields

- [x] **FORM-01**: First Name field (togglable in theme editor)
- [x] **FORM-02**: Last Name field (togglable in theme editor)
- [x] **FORM-03**: Company Name field (togglable in theme editor)
- [x] **FORM-04**: Email Address field (togglable in theme editor)
- [x] **FORM-05**: Phone Number field (togglable in theme editor)
- [x] **FORM-06**: Address field (togglable in theme editor)
- [x] **FORM-07**: Country field (togglable in theme editor)
- [x] **FORM-08**: Postcode field (togglable in theme editor)
- [x] **FORM-09**: Add Notes field (togglable in theme editor)
- [x] **FORM-10**: Marketing opt-in checkbox with disclaimer text (togglable in theme editor)

### Form Submission

- [x] **SUBM-01**: Form submits via Shopify `{% form 'contact' %}` to store email
- [x] **SUBM-02**: Success state shown inside modal using `form.posted_successfully?` pattern
- [x] **SUBM-03**: Success state displays "WE'LL BE IN TOUCH" heading with confirmation text
- [x] **SUBM-04**: Success state keeps 40/60 layout on desktop (image left, confirmation right)
- [x] **SUBM-05**: "Submit Enquiry" button text

### Trigger

- [x] **TRIG-01**: Existing button block on product page triggers the modal
- [x] **TRIG-02**: Add `aria_controls` schema setting to button block for merchant flexibility
- [x] **TRIG-03**: `aria-controls="enquiry-modal"` wiring between button and modal

### Styling

- [ ] **STYL-01**: Field labels use button font (uppercase, small)
- [ ] **STYL-02**: Inputs use underline-only style (no box border)
- [ ] **STYL-03**: Submit button matches theme button styling
- [ ] **STYL-04**: First Name / Last Name and Country / Postcode in 50/50 grid rows
- [ ] **STYL-05**: Form panel background matches theme color scheme
- [ ] **STYL-06**: Product image is full-height, object-fit cover on desktop

## v2 Requirements

### Enhancements

- **ENH-01**: AJAX form submission (no page reload)
- **ENH-02**: Variant-specific image in modal
- **ENH-03**: GDPR-compliant marketing consent with Shopify customer tags
- **ENH-04**: Custom email templates for enquiry notifications

## Out of Scope

| Feature | Reason |
|---------|--------|
| Third-party form integrations (Klaviyo, HubSpot) | Shopify email sufficient for v1 |
| AJAX form submission | Standard Shopify form post with `posted_successfully?` is simpler and reliable |
| Variant selection in modal | Adds complexity, not needed for enquiry |
| Custom redirect after submission | Success state shown in-modal instead |
| Nested confirmation dialogs | Anti-pattern, adds UX complexity |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| MODL-01 | Phase 1 | Pending |
| MODL-02 | Phase 1 | Pending |
| MODL-03 | Phase 1 | Pending |
| MODL-04 | Phase 1 | Pending |
| MODL-05 | Phase 1 | Pending |
| MODL-06 | Phase 1 | Pending |
| DATA-01 | Phase 3 | Complete |
| DATA-02 | Phase 3 | Complete |
| DATA-03 | Phase 3 | Complete |
| DATA-04 | Phase 3 | Complete |
| FORM-01 | Phase 2 | Complete |
| FORM-02 | Phase 2 | Complete |
| FORM-03 | Phase 2 | Complete |
| FORM-04 | Phase 2 | Complete |
| FORM-05 | Phase 2 | Complete |
| FORM-06 | Phase 2 | Complete |
| FORM-07 | Phase 2 | Complete |
| FORM-08 | Phase 2 | Complete |
| FORM-09 | Phase 2 | Complete |
| FORM-10 | Phase 2 | Complete |
| SUBM-01 | Phase 2 | Complete |
| SUBM-02 | Phase 2 | Complete |
| SUBM-03 | Phase 2 | Complete |
| SUBM-04 | Phase 2 | Complete |
| SUBM-05 | Phase 2 | Complete |
| TRIG-01 | Phase 4 | Complete |
| TRIG-02 | Phase 4 | Complete |
| TRIG-03 | Phase 4 | Complete |
| STYL-01 | Phase 5 | Pending |
| STYL-02 | Phase 5 | Pending |
| STYL-03 | Phase 5 | Pending |
| STYL-04 | Phase 5 | Pending |
| STYL-05 | Phase 5 | Pending |
| STYL-06 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 34 total
- Mapped to phases: 34
- Unmapped: 0

---
*Requirements defined: 2026-03-17*
*Last updated: 2026-03-17 after roadmap creation*
