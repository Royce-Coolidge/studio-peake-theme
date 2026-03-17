# Phase 02: Form and Field System - Research

**Researched:** 2026-03-17
**Domain:** Shopify Liquid contact form, section blocks, modal success state, form reset on close
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use Shopify **blocks pattern** so merchants can drag-and-drop reorder fields in the theme editor
- Each of the 10 fields is a separate block type that can be added/removed/reordered
- **Fixed labels** — hardcoded in templates (e.g. always "First Name", "Email Address"), not editable by merchant
- **First Name/Last Name and Country/Postcode always pair** into 50/50 grid rows on desktop regardless of block position
- **On mobile, paired fields stack to 100% width** (full-width single column)
- Fixed field order is the default block order; merchant can rearrange via editor
- Show **"WE'LL BE IN TOUCH" heading + short subtext** (e.g. "Thank you for your enquiry. We'll get back to you shortly.")
- Success heading and body text are **hardcoded** — not editable by merchant
- Modal **stays open** until user manually closes it (no auto-close)
- **Resets to form on close** — reopening the modal shows a fresh empty form
- **Single error banner at top** of form (matches existing contact.liquid pattern using `render 'banner'`)
- **Accept standard Shopify page reload** on validation error — no JS to auto-reopen modal with errors
- **Server-side validation only** — no client-side validation, no HTML5 required attributes
- **No loading/disabled state** on submit button — standard browser form submission behavior
- **Email and First Name are required** when their blocks are enabled; all other fields are optional
- **Country field is a dropdown** with a standard country list (use existing `select.liquid` snippet)
- **Pre-fill name and email** for logged-in Shopify customers (using `customer.name`, `customer.email`)
- **Marketing opt-in disclaimer text is editable** by merchant via a block setting

### Claude's Discretion
- Block type naming and schema structure details
- How to implement the form reset on modal close (JS approach)
- Exact subtext wording for success state
- Country list source (Shopify's built-in or hardcoded)
- How the 50/50 pairing logic works when fields are reordered (CSS approach)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FORM-01 | First Name field (togglable in theme editor) | Block type `first_name`; `render 'input'` with `name: 'contact[first_name]'`, `required: true` when block enabled |
| FORM-02 | Last Name field (togglable in theme editor) | Block type `last_name`; pairs with FORM-01 in `fieldset-row` |
| FORM-03 | Company Name field (togglable in theme editor) | Block type `company`; `render 'input'` with `name: 'contact[company]'` |
| FORM-04 | Email Address field (togglable in theme editor) | Block type `email`; `render 'input', type: 'email'`, `required: true` when block enabled |
| FORM-05 | Phone Number field (togglable in theme editor) | Block type `phone`; `render 'input', type: 'tel'` |
| FORM-06 | Address field (togglable in theme editor) | Block type `address`; `render 'input'` with `name: 'contact[address]'` |
| FORM-07 | Country field (togglable in theme editor) | Block type `country`; `render 'select'` with `options: all_country_option_tags`, pairs with FORM-08 |
| FORM-08 | Postcode field (togglable in theme editor) | Block type `postcode`; pairs with FORM-07 in `fieldset-row` |
| FORM-09 | Add Notes field (togglable in theme editor) | Block type `notes`; `render 'input'` with `multiline: 4` |
| FORM-10 | Marketing opt-in checkbox with editable disclaimer (togglable) | Block type `marketing`; `render 'checkbox'`; disclaimer text as block setting |
| SUBM-01 | Form submits via `{% form 'contact' %}` to store email | Standard Shopify contact form tag; no AJAX needed |
| SUBM-02 | Success state shown inside modal using `form.posted_successfully?` | Conditional block swapping form content for success markup |
| SUBM-03 | "WE'LL BE IN TOUCH" heading with confirmation text | Hardcoded strings in Liquid template |
| SUBM-04 | Success state keeps 40/60 layout on desktop | Image panel is outside the conditional; only form-content div switches |
| SUBM-05 | "Submit Enquiry" button text | `render 'button', content: 'Submit Enquiry', type: 'submit'` |
</phase_requirements>

---

## Summary

This phase wires a fully functional Shopify `{% form 'contact' %}` into the modal shell built in Phase 1. The core technical work is: (1) defining 10 named block types in the section schema so merchants can toggle/reorder fields in the theme editor, (2) rendering each block's corresponding snippet inside the form, (3) implementing the `form.posted_successfully?` inline success state, and (4) resetting the modal to the form view when it closes.

The codebase provides all the building blocks needed: `snippets/input.liquid`, `snippets/select.liquid`, `snippets/checkbox.liquid`, `snippets/button.liquid`, and `snippets/banner.liquid`. The `sections/contact.liquid` file establishes the exact Liquid patterns (form tag, error display, block iteration) that this phase follows. The `x-modal` element exposes a `dialog:after-hide` event that is the correct hook for form reset, confirmed by the `QuickBuyModal` precedent in `assets/theme.js`.

**Primary recommendation:** Implement each field as its own named block type (not a generic configurable block). This gives predictable pairing logic (always render first-name and last-name together when both blocks are present), hardcoded labels, and predictable field order defaults.

---

## Standard Stack

### Core
| Library/Tag | Version | Purpose | Why Standard |
|-------------|---------|---------|--------------|
| `{% form 'contact' %}` | Shopify Liquid | Generates contact form; POSTs to store email | Only supported mechanism for contact email in Shopify; no alternatives |
| `form.posted_successfully?` | Shopify Liquid | Boolean — true after successful POST | Built-in; works with page reload, no JS needed |
| `form.errors` | Shopify Liquid | Validation errors object | Built-in server-side validation |

### Supporting (existing snippets)
| Snippet | Purpose | Key Parameters |
|---------|---------|----------------|
| `snippets/input.liquid` | Text, email, tel, textarea fields | `name`, `type`, `value`, `required`, `multiline`, `autocomplete` |
| `snippets/select.liquid` | Country dropdown | `name`, `label`, `options` (HTML), `show_empty_value`, `required` |
| `snippets/checkbox.liquid` | Marketing opt-in | `name`, `value`, `label`, `required` |
| `snippets/button.liquid` | Submit button | `content`, `type: 'submit'` |
| `snippets/banner.liquid` | Error and success banners | `status: 'error'` or `'success'`, `content` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Named block types per field | Generic `text` block type | Generic approach requires editable labels and allows duplicates — conflicts with fixed-label requirement |
| `all_country_option_tags` global | Hardcoded country array | `all_country_option_tags` is a Shopify global (confirmed: available everywhere including in overlay sections); no need to hardcode |

---

## Architecture Patterns

### Recommended Section Structure

The modal section already exists at `sections/product-enquiry-modal.liquid`. This phase adds:
1. The `{% form 'contact' %}` block inside `enquiry-modal__form-content`
2. A `blocks` array to the schema with 10 named block types
3. A small inline `<script>` or separate asset JS for form reset on close

```
sections/
└── product-enquiry-modal.liquid   # Modified: add form + blocks schema
assets/
└── enquiry-modal.js               # New: form reset on dialog:after-hide (optional — may inline)
```

### Pattern 1: Named Block Types Per Field

**What:** Each of the 10 fields is a distinct block type identified by a semantic `type` string. The template uses `{% if block.type == 'first_name' %}` conditionals to render the correct snippet.

**When to use:** Required — matches the decision to use hardcoded labels and enable first-name/last-name pairing logic.

**Example (schema excerpt):**
```json
"blocks": [
  {
    "type": "first_name",
    "name": "First Name",
    "limit": 1,
    "settings": []
  },
  {
    "type": "last_name",
    "name": "Last Name",
    "limit": 1,
    "settings": []
  },
  {
    "type": "email",
    "name": "Email Address",
    "limit": 1,
    "settings": []
  },
  {
    "type": "company",
    "name": "Company Name",
    "limit": 1,
    "settings": []
  },
  {
    "type": "phone",
    "name": "Phone Number",
    "limit": 1,
    "settings": []
  },
  {
    "type": "address",
    "name": "Address",
    "limit": 1,
    "settings": []
  },
  {
    "type": "country",
    "name": "Country",
    "limit": 1,
    "settings": []
  },
  {
    "type": "postcode",
    "name": "Postcode",
    "limit": 1,
    "settings": []
  },
  {
    "type": "notes",
    "name": "Add Notes",
    "limit": 1,
    "settings": []
  },
  {
    "type": "marketing",
    "name": "Marketing Opt-in",
    "limit": 1,
    "settings": [
      {
        "type": "richtext",
        "id": "disclaimer_text",
        "label": "Disclaimer text",
        "default": "<p>I agree to receive marketing communications from Studio Peake.</p>"
      }
    ]
  }
]
```

### Pattern 2: First-Name/Last-Name and Country/Postcode Pairing

**What:** The pairing requirement says these pairs always appear in 50/50 `fieldset-row` divs regardless of block order. The implementation approach is to use two passes over blocks — one to collect which block types are present, then render paired rows first, then individual fields.

**Recommended approach — collect-then-render:**

Since Liquid loops are forward-only, collect presence flags first, then render a fixed layout:

```liquid
{%- assign has_first_name = false -%}
{%- assign has_last_name = false -%}
{%- assign has_country = false -%}
{%- assign has_postcode = false -%}
{%- for block in section.blocks -%}
  {%- if block.type == 'first_name' %}{%- assign has_first_name = true -%}{%- endif -%}
  {%- if block.type == 'last_name' %}{%- assign has_last_name = true -%}{%- endif -%}
  {%- if block.type == 'country' %}{%- assign has_country = true -%}{%- assign country_block = block -%}{%- endif -%}
  {%- if block.type == 'postcode' %}{%- assign has_postcode = true -%}{%- endif -%}
{%- endfor -%}
```

Then render paired rows when either of the pair is enabled:

```liquid
{%- if has_first_name or has_last_name -%}
  <div class="fieldset-row">
    {%- if has_first_name -%}
      {%- render 'input', type: 'text', name: 'contact[first_name]', label: 'First Name', value: customer.first_name, required: true -%}
    {%- endif -%}
    {%- if has_last_name -%}
      {%- render 'input', type: 'text', name: 'contact[last_name]', label: 'Last Name' -%}
    {%- endif -%}
  </div>
{%- endif -%}
```

**CSS note:** When only one field is in a `fieldset-row`, it expands to full width naturally if the grid uses `auto-fit` or `1fr 1fr` with the single child taking full width. Verify the existing `fieldset-row` CSS handles the single-child case; if not, add a modifier class.

### Pattern 3: Inline Success State

**What:** After successful submission, show "WE'LL BE IN TOUCH" in place of the form. The image panel is unaffected — only the form-content div changes.

**Source:** `sections/contact.liquid` and `sections/newsletter-popup.liquid` establish this pattern.

```liquid
{%- form 'contact', class: 'form' -%}
  {%- if form.posted_successfully? -%}
    <div class="enquiry-modal__success">
      <p class="h2">WE'LL BE IN TOUCH</p>
      <p>Thank you for your enquiry. We'll get back to you shortly.</p>
    </div>
  {%- else -%}
    {%- comment -%}Error banner{%- endcomment -%}
    {%- if form.errors -%}
      {%- capture content -%}{{ form.errors.translated_fields[form.errors.first] | capitalize }} {{ form.errors.messages[form.errors.first] }}{%- endcapture -%}
      {%- render 'banner', status: 'error', content: content -%}
    {%- endif -%}

    {%- comment -%}Field blocks loop + submit button{%- endcomment -%}
    ...
    {%- render 'button', content: 'Submit Enquiry', type: 'submit' -%}
  {%- endif -%}
{%- endform -%}
```

**Critical:** `form.posted_successfully?` is only `true` on the page load immediately following a successful POST. On subsequent loads or modal close/reopen, it returns `false` automatically — the "reset on close" requirement is already handled server-side for the success-to-form transition. The JS reset is only needed to clear field values that the browser may have retained.

### Pattern 4: Form Reset on Modal Close (JS)

**What:** When the modal closes, reset form field values so reopening shows a blank form.

**Source:** `assets/theme.js` — `dialog:after-hide` custom event is dispatched by `DialogElement.hide()` (line 1835). `QuickBuyModal` uses this event (line 3237) to clear its innerHTML. The same hook is appropriate here.

**Recommended approach:** Add a small inline `<script>` in the section (or a dedicated `enquiry-modal.js` asset) that subclasses nothing — just queries the modal and listens:

```javascript
// In enquiry-modal.js or inline script
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('enquiry-modal');
  if (!modal) return;
  modal.addEventListener('dialog:after-hide', () => {
    const form = modal.querySelector('form');
    if (form) form.reset();
  });
});
```

`HTMLFormElement.reset()` clears all input, textarea, select, and checkbox values back to their defaults. This satisfies "resets to form on close" without any framework.

**Alternative:** Because the modal content is static Liquid (not dynamically loaded like QuickBuyModal), `form.reset()` is sufficient. No need to re-render HTML.

### Anti-Patterns to Avoid

- **Using `contact.liquid`'s `disabled_on` schema:** That section has `"disabled_on": { "groups": ["custom.overlay"] }`. The enquiry modal must use `"enabled_on": { "groups": ["custom.overlay"] }` (already correct in Phase 1 output).
- **Relying on block order for pairs:** Block order is merchant-controllable. Do not rely on "first_name is block[0]" — use type-matching conditionals.
- **Wrapping the entire layout in the posted_successfully? conditional:** Only the form-content should swap. The image panel and close button must remain outside the conditional to preserve the 40/60 layout on success (SUBM-04).
- **Using `required` attribute on inputs:** CONTEXT.md explicitly prohibits HTML5 required attributes (server-side validation only). The `input.liquid` snippet supports `required` — simply omit the parameter.
- **Generic block types from contact.liquid:** The existing `contact.liquid` uses generic `text`/`dropdown` block types with editable titles. This phase uses named, semantic block types (first_name, last_name, etc.) with hardcoded labels — a deliberate departure.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Country dropdown | Custom country array in Liquid | `all_country_option_tags` global (HTML `<option>` tags) | Shopify maintains this list; includes correct country codes for address data |
| Form POST to email | Custom endpoint / fetch() | `{% form 'contact' %}` | Handles CSRF, routing, email delivery, spam protection |
| Error messages | Custom error string assembly | `form.errors.translated_fields` + `form.errors.messages` (as in contact.liquid) | Shopify-translated field names, locale-aware |
| Form state after close | URL params, sessionStorage | `dialog:after-hide` + `form.reset()` | Event is already dispatched by x-modal; browser native reset clears all fields |
| Checkbox input | Raw `<input type="checkbox">` | `render 'checkbox'` | Consistent styled checkbox markup matching theme CSS |

---

## Common Pitfalls

### Pitfall 1: `all_country_option_tags` Availability
**What goes wrong:** Assuming `all_country_option_tags` is only available in address form contexts.
**Why it happens:** It is most commonly seen in `{% form 'customer_address' %}` contexts.
**How to avoid:** `all_country_option_tags` is a Shopify global (available anywhere in Liquid, including inside `{% form 'contact' %}`). Pass it as `options:` to `render 'select'` directly.
**Warning signs:** Dropdown renders empty or errors in template.

### Pitfall 2: `form.posted_successfully?` Truthy After Redirect
**What goes wrong:** Expecting `posted_successfully?` to persist across multiple requests or to be `true` when the modal reopens.
**Why it happens:** Misunderstanding the session flash behavior.
**How to avoid:** `posted_successfully?` is `true` only on the single page load immediately after successful POST. When the modal closes and reopens, the page is not reloaded — the success state has already cleared. The JS `form.reset()` handles input values; the Liquid success/form toggle is automatic on next page load.
**Warning signs:** Success state appears permanently or unexpectedly.

### Pitfall 3: Paired Fields When Only One is Enabled
**What goes wrong:** `fieldset-row` renders with one child; CSS grid shows half-width field instead of full-width.
**Why it happens:** The existing `fieldset-row` CSS likely assumes two children.
**How to avoid:** Check `assets/base.css` (or equivalent) for `fieldset-row` CSS. If it uses a fixed two-column grid, add a modifier: render a plain `<div class="fieldset">` instead of `fieldset-row` when only one of the pair is enabled. Pattern: `{%- if has_first_name and has_last_name -%}<div class="fieldset-row">{%- else -%}<div class="fieldset">{%- endif -%}`.
**Warning signs:** Single field in a row appears at 50% width.

### Pitfall 4: Page Reload on Validation Error Loses Modal State
**What goes wrong:** When Shopify's contact form returns a validation error, it reloads the page — the modal is closed.
**Why it happens:** Standard Shopify form POST behavior. CONTEXT.md explicitly accepts this tradeoff.
**How to avoid:** This is by design — nothing to fix. The error banner inside the form will appear after reload IF the modal is re-opened. But since the modal is in an overlay group (not auto-opened), the user sees a blank page after reload. The error is effectively lost.
**Mitigation considered and rejected:** CONTEXT.md says "accept standard Shopify page reload on validation error". Do not attempt JS interception.
**Warning signs:** Merchants complain about losing error context — this is a v2 concern (ENH-01: AJAX submission).

### Pitfall 5: `contact[body]` Field Name for Notes
**What goes wrong:** Using `contact[notes]` or `contact[add_notes]` for the message body field.
**Why it happens:** Field naming confusion.
**How to avoid:** Shopify's contact form maps `contact[body]` to the email body. Use `name: 'contact[body]'` for the "Add Notes" field (FORM-09). Other fields use `contact[first_name]`, `contact[last_name]`, `contact[email]`, `contact[phone]`, `contact[company]`, `contact[address]`, `contact[country]`, `contact[postcode]`. Custom field names like `contact[company]` appear in the email body as labeled key-value pairs.
**Warning signs:** Notes field content missing from received email.

### Pitfall 6: Marketing Checkbox Not Submitted When Unchecked
**What goes wrong:** Expecting the form to receive a `false` value when the marketing checkbox is unchecked.
**Why it happens:** Unchecked HTML checkboxes are not submitted in form POST data — this is standard HTML behavior.
**How to avoid:** For this v1 implementation, a missing `contact[marketing]` field in the email is acceptable — if checked, it appears; if not, it's absent. No hidden field workaround needed unless server-side logic requires explicit false.

---

## Code Examples

### Complete Form Tag Pattern
```liquid
{%- form 'contact', class: 'form' -%}
  {%- if form.posted_successfully? -%}
    {%- comment -%}Success state — image panel stays visible in parent layout{%- endcomment -%}
    <div class="enquiry-modal__success">
      <p class="h2">WE'LL BE IN TOUCH</p>
      <p class="text-subdued">Thank you for your enquiry. We'll get back to you shortly.</p>
    </div>
  {%- else -%}
    {%- if form.errors -%}
      {%- capture error_content -%}{{ form.errors.translated_fields[form.errors.first] | capitalize }} {{ form.errors.messages[form.errors.first] }}{%- endcapture -%}
      {%- render 'banner', status: 'error', content: error_content -%}
    {%- endif -%}
    <div class="fieldset">
      {%- comment -%}... blocks render here ...{%- endcomment -%}
    </div>
    {%- render 'button', content: 'Submit Enquiry', type: 'submit' -%}
  {%- endif -%}
{%- endform -%}
```
Source: pattern from `sections/contact.liquid` (lines 8–55) adapted for modal context.

### Country Block Rendering
```liquid
{%- elsif block.type == 'country' -%}
  {%- comment -%}Rendered as part of country/postcode paired row — see pairing logic{%- endcomment -%}
  {%- render 'select', name: 'contact[country]', label: 'Country', options: all_country_option_tags, show_empty_value: true, autocomplete: 'country' -%}
```
Source: `snippets/address-form.liquid` uses `all_country_option_tags` with `render 'select'` — same pattern.

### Marketing Opt-in Block
```liquid
{%- for block in section.blocks -%}
  {%- if block.type == 'marketing' -%}
    {%- render 'checkbox', name: 'contact[marketing]', value: 'yes', label: block.settings.disclaimer_text -%}
  {%- endif -%}
{%- endfor -%}
```
Source: `snippets/checkbox.liquid` — `label` param accepts richtext string output.

### Form Reset on Modal Close
```javascript
// Source: pattern from QuickBuyModal (assets/theme.js line 3237) — dialog:after-hide hook
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('enquiry-modal');
  if (!modal) return;
  modal.addEventListener('dialog:after-hide', () => {
    const form = modal.querySelector('form');
    if (form) form.reset();
  });
});
```

### Pre-fill Customer Data
```liquid
{%- render 'input', type: 'text', name: 'contact[first_name]', label: 'First Name',
    value: customer.first_name, required: true, autocomplete: 'given-name' -%}
{%- render 'input', type: 'email', name: 'contact[email]', label: 'Email Address',
    value: customer.email, required: true, autocomplete: 'email' -%}
```
Source: `sections/contact.liquid` line 22–25 — `customer.name` / `customer.email` pattern confirmed. Note: `customer.first_name` is available if using individual name fields (vs `customer.name` for combined).

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Generic `text` block type with editable label | Named semantic block type per field (`first_name`, `email`, etc.) | Enables hardcoded labels; prevents duplicates via `limit: 1`; enables type-matching pairing logic |
| Custom AJAX submission | Standard `{% form 'contact' %}` POST | Simpler, no JS maintenance, Shopify handles spam/delivery |

---

## Open Questions

1. **Single-field `fieldset-row` CSS behaviour**
   - What we know: `fieldset-row` is used in address-form.liquid for paired fields (city/zip)
   - What's unclear: Whether the theme's `fieldset-row` CSS collapses gracefully to full-width when it has one child (needed when only first_name OR last_name is enabled)
   - Recommendation: In Wave 0 of planning, read the `fieldset-row` CSS rule (likely in `assets/base.css` or a component stylesheet). If it's a two-column fixed grid, add a modifier class `fieldset-row--single` or use the plain `fieldset` wrapper when only one of the pair is active.

2. **`customer.first_name` vs `customer.name` for pre-fill**
   - What we know: `contact.liquid` uses `customer.name` (combined name field). This phase has separate first/last name fields.
   - What's unclear: Whether `customer.first_name` and `customer.last_name` are standard Shopify customer object properties.
   - Recommendation: Use `customer.first_name` and `customer.last_name` — these are standard Shopify customer object properties. If the customer object is nil (guest), these evaluate to blank, which is correct.

3. **`enquiry-modal.js` separate asset vs inline script**
   - What we know: The theme uses `assets/theme.js` as the compiled bundle. Adding a new asset requires referencing it with `{{ 'enquiry-modal.js' | asset_url | script_tag }}` in the section.
   - What's unclear: Whether the theme build system (if any) requires JS to be bundled.
   - Recommendation: Use an inline `<script>` in the section for the minimal form-reset logic (< 10 lines). Avoids build system concerns and keeps the logic co-located with the section.

---

## Validation Architecture

> `nyquist_validation: true` in `.planning/config.json` — section included.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — Shopify theme; manual browser/editor testing |
| Config file | None |
| Quick run command | Open Shopify theme editor, verify block toggle + preview |
| Full suite command | Submit form on development store; check store owner email |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FORM-01 | First Name block appears/disappears when toggled | manual | Theme editor toggle + browser preview | N/A |
| FORM-02 | Last Name block appears/disappears when toggled | manual | Theme editor toggle + browser preview | N/A |
| FORM-03 | Company Name block appears/disappears | manual | Theme editor toggle + browser preview | N/A |
| FORM-04 | Email block appears/disappears | manual | Theme editor toggle + browser preview | N/A |
| FORM-05 | Phone block appears/disappears | manual | Theme editor toggle + browser preview | N/A |
| FORM-06 | Address block appears/disappears | manual | Theme editor toggle + browser preview | N/A |
| FORM-07 | Country dropdown renders with all countries | manual | Browser: open modal, inspect country dropdown | N/A |
| FORM-08 | Postcode block appears/disappears | manual | Theme editor toggle + browser preview | N/A |
| FORM-09 | Notes textarea renders multiline | manual | Browser: open modal, inspect textarea | N/A |
| FORM-10 | Marketing checkbox + editable disclaimer | manual | Theme editor: change disclaimer text, verify update | N/A |
| SUBM-01 | Form POST sends email to store owner | manual | Submit form on dev store; check store email inbox | N/A |
| SUBM-02 | `form.posted_successfully?` shows success state inline | manual | Submit valid form; verify no page navigation away from modal | N/A |
| SUBM-03 | "WE'LL BE IN TOUCH" heading + subtext visible on success | manual | Submit valid form; verify heading text | N/A |
| SUBM-04 | Image panel visible on desktop success state | manual | Submit on desktop; verify 40/60 layout preserved | N/A |
| SUBM-05 | Submit button shows "Submit Enquiry" | manual | Open modal; inspect button text | N/A |

**Note:** All tests are manual-only. This is a Shopify Liquid + JS theme — no automated test runner applies. Shopify's theme CI tooling (`shopify theme check`) is the closest automated check but validates syntax, not behavior.

### Sampling Rate
- **Per task:** Open modal in browser, verify visible output matches task goal
- **Per wave merge:** Full manual walkthrough — toggle all 10 blocks, submit form, verify success state, close and reopen to verify reset
- **Phase gate:** All 5 success criteria verified on development store before `/gsd:verify-work`

### Wave 0 Gaps
None — no test files to create. Manual verification checklist above serves as the test plan.

---

## Sources

### Primary (HIGH confidence)
- `sections/contact.liquid` — `{% form 'contact' %}`, `posted_successfully?`, `form.errors`, block iteration pattern
- `sections/newsletter-popup.liquid` — inline success/error state inside a modal-like component
- `snippets/address-form.liquid` — `all_country_option_tags` usage with `render 'select'`
- `snippets/input.liquid`, `snippets/select.liquid`, `snippets/checkbox.liquid`, `snippets/button.liquid`, `snippets/banner.liquid` — confirmed parameter signatures
- `assets/theme.js` lines 1835, 3229–3258 — `dialog:after-hide` event + `QuickBuyModal` form-clear pattern
- Shopify Liquid docs (via WebFetch) — `form.posted_successfully?`, `all_country_option_tags` global scope

### Secondary (MEDIUM confidence)
- Shopify Liquid docs (via WebFetch) — `all_country_option_tags` confirmed as globally available, though contact-form specific context not explicitly documented

### Tertiary (LOW confidence)
- `customer.first_name` / `customer.last_name` as separate properties — inferred from standard Shopify customer object; not verified in this codebase's existing usage (contact.liquid uses combined `customer.name`)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all snippets read directly from codebase; form pattern from contact.liquid
- Architecture: HIGH — block schema structure, pairing logic, and success state all derived from existing code patterns
- Pitfalls: HIGH (validation error reload, paired field CSS) to MEDIUM (checkbox unsubmitted when unchecked)
- JS reset pattern: HIGH — confirmed via theme.js source code

**Research date:** 2026-03-17
**Valid until:** 2026-06-17 (stable Shopify Liquid API; codebase patterns stable until theme upgrade)
