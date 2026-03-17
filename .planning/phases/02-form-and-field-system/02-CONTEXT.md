# Phase 2: Form and Field System - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

A working Shopify contact form inside the enquiry modal with all ten fields individually togglable in the theme editor, inline success state, and error handling. This phase builds on the modal shell from Phase 1. Product data wiring (Phase 3), trigger button (Phase 4), and visual styling (Phase 5) are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Field Configuration
- Use Shopify **blocks pattern** so merchants can drag-and-drop reorder fields in the theme editor
- Each of the 10 fields is a separate block type that can be added/removed/reordered
- **Fixed labels** — hardcoded in templates (e.g. always "First Name", "Email Address"), not editable by merchant
- **First Name/Last Name and Country/Postcode always pair** into 50/50 grid rows on desktop regardless of block position
- **On mobile, paired fields stack to 100% width** (full-width single column)
- Fixed field order is the default block order; merchant can rearrange via editor

### Success State
- Show **"WE'LL BE IN TOUCH" heading + short subtext** (e.g. "Thank you for your enquiry. We'll get back to you shortly.")
- Success heading and body text are **hardcoded** — not editable by merchant
- Modal **stays open** until user manually closes it (no auto-close)
- **Resets to form on close** — reopening the modal shows a fresh empty form, allowing multiple enquiries

### Validation & Errors
- **Single error banner at top** of form (matches existing contact.liquid pattern using `render 'banner'`)
- **Accept standard Shopify page reload** on validation error — no JS to auto-reopen modal with errors
- **Server-side validation only** — no client-side validation, no HTML5 required attributes
- **No loading/disabled state** on submit button — standard browser form submission behavior

### Form Field Behavior
- **Email and First Name are required** when their blocks are enabled; all other fields are optional
- **Country field is a dropdown** with a standard country list (use existing `select.liquid` snippet)
- **Pre-fill name and email** for logged-in Shopify customers (using `customer.name`, `customer.email`)
- **Marketing opt-in disclaimer text is editable** by merchant via a block setting (since legal requirements vary by region)

### Claude's Discretion
- Block type naming and schema structure details
- How to implement the form reset on modal close (JS approach)
- Exact subtext wording for success state
- Country list source (Shopify's built-in or hardcoded)
- How the 50/50 pairing logic works when fields are reordered (CSS approach)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `snippets/input.liquid`: Existing text/email/multiline input component with label, name, value, required params
- `snippets/select.liquid`: Existing dropdown component with option_values, show_empty_value, name, label, required params
- `snippets/button.liquid`: Existing button component with content, type params
- `snippets/banner.liquid`: Existing status banner (success/error) component with status, content params
- `snippets/icon.liquid`: Icon renderer used for close button

### Established Patterns
- Contact form: `{% form 'contact' %}` with `form.posted_successfully?` and `form.errors` pattern (see `sections/contact.liquid`)
- Field naming: `contact[field_name]` for form data sent to Shopify
- Error display: Single banner using `render 'banner', status: 'error', content: content`
- Success display: Banner using `render 'banner', status: 'success', content: content`
- Customer pre-fill: `value: customer.name`, `value: customer.email`
- Fieldset layout: `div.fieldset` with `div.fieldset-row` for grouped fields

### Integration Points
- Modal shell: `sections/product-enquiry-modal.liquid` — form goes inside `enquiry-modal__form-content` div
- Schema: Section schema needs blocks array for the 10 field types
- Overlay group: Section already registered with `enabled_on: groups: ["custom.overlay"]`

</code_context>

<specifics>
## Specific Ideas

- Submit button text: "Submit Enquiry" (per SUBM-05)
- The form should feel like a natural extension of the modal shell — content replaces the placeholder text in `enquiry-modal__form-content`

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-form-and-field-system*
*Context gathered: 2026-03-17*
