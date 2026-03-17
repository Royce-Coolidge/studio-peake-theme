# Domain Pitfalls: Shopify Product Enquiry Modal

**Domain:** Shopify theme modal with contact form — Prestige v10.7.0 base
**Researched:** 2026-03-17
**Confidence:** HIGH — based on direct codebase analysis of the existing modal/drawer system

---

## Critical Pitfalls

Mistakes that cause rewrites or major functional failures.

---

### Pitfall 1: Section Placed in Wrong Group (contact section cannot live in overlay group)

**What goes wrong:** The existing `contact` section has `"disabled_on": { "groups": ["header", "custom.overlay"] }` in its schema. If you try to add the contact section directly to `sections/overlay-group.json`, Shopify will silently reject or error. The enquiry modal section must be a new section (or adapted from `newsletter-popup`/`cart-drawer` patterns) — not a reuse of the existing `contact` section.

**Why it happens:** The existing `contact` section was deliberately excluded from the overlay group to prevent misuse as a popup. A new dedicated section for the modal must not inherit this `disabled_on` constraint — it needs `"enabled_on": { "groups": ["custom.overlay"] }` (or no restriction at all if it should also be usable on other templates).

**Consequences:** Section never appears in overlay group; Shopify admin refuses the configuration; confusing silent failure in theme editor.

**Prevention:** Write the enquiry modal as a new section file (e.g., `sections/product-enquiry.liquid`) modelled on `newsletter-popup.liquid`, not on `contact.liquid`. Do not reference or copy `contact.liquid`'s schema restrictions. Confirm the schema has `"enabled_on": { "groups": ["custom.overlay"] }` or no `disabled_on` block for that group.

**Detection:** In Shopify admin, overlay-group section list does not show the new section as an option. Liquid rendering produces no output in the overlay group.

**Phase:** Implementation — section schema definition.

---

### Pitfall 2: Button Block Cannot Pass aria-controls to the Modal

**What goes wrong:** The existing `button` block (`blocks/button.liquid`) renders via `snippets/button.liquid` and passes `aria_controls` to the element — but only if the caller explicitly passes it. The block schema (`blocks/button.liquid`) currently has no `aria_controls` setting exposed to the merchant. If you rely on a merchant-entered URL (the `url` field) pointing to the modal, clicking the button will navigate away from the page entirely rather than opening the modal.

**Why it happens:** `snippets/button.liquid` generates an `<a href="...">` when `href` is provided, and a `<button aria-controls="...">` when `aria_controls` is provided. These are mutually exclusive code paths. The `button` block only passes `href: block.settings.url` — there is no `aria_controls` parameter wired up in the block schema.

**Consequences:** The "Enquire" button navigates the user to a dead URL or `#` fragment rather than opening the modal. The modal never opens. No JS error — it just silently navigates.

**Prevention:** Either (a) add a hidden `aria_controls` setting to the button block schema so the button can be wired to the modal ID, or (b) hard-code the `aria_controls` value inside the product section by rendering the button snippet directly with `aria_controls: 'product-enquiry'` rather than relying on the block's `url` setting. Option (b) is simpler and more reliable for a fixed modal ID.

**Detection:** Clicking "Enquire" does not open a modal. Check the rendered HTML — if the trigger element is `<a href="...">` rather than `<button aria-controls="...">`, this pitfall is active.

**Phase:** Implementation — button trigger wiring.

---

### Pitfall 3: Modal ID Must Match Across Section and Trigger at Runtime

**What goes wrong:** The `DialogElement` web component registers click handlers using `[aria-controls="${this.id}"]` (line 1650, `theme.js`). The trigger button's `aria-controls` value must be an exact string match of the modal element's `id` attribute. If these differ by even one character — or if the section ID is used as a prefix in a way that differs between where the button renders and where the modal renders — the modal never opens.

**Why it happens:** The button block renders inside `sections/main-product.liquid` (a different section with a different `section.id`), while the modal renders inside `sections/overlay-group.json` (which has its own section ID). If either side uses `section.id` dynamically in the ID value, they will never match.

**Consequences:** Clicking the trigger does nothing. No JS error. The `dialog:before-show` event never fires.

**Prevention:** Give the modal a fixed, predictable `id` attribute — e.g., `id="product-enquiry-modal"` — hard-coded in the section Liquid, not derived from `section.id`. The trigger button must use the identical hard-coded value in `aria-controls`. Do not use `section.id` as part of the modal ID.

**Detection:** Open DevTools, find the trigger button and inspect its `aria-controls` attribute, then search the DOM for an element with that exact `id`. If none is found, or the IDs differ, this pitfall is active.

**Phase:** Implementation — ID wiring between trigger and modal.

---

### Pitfall 4: Product Context Lost Because Modal Is in a Different Section

**What goes wrong:** The enquiry modal lives in `overlay-group.json` (a global section rendered once per page, not scoped to a product). Liquid variables like `product.title` and `product.featured_image` are not available in a global overlay section — they are only available in product template sections. Attempting to use `{{ product.title }}` in the modal section Liquid will render nothing or the wrong product.

**Why it happens:** Shopify Liquid sections in the overlay group render with global context. The `product` object is only populated for sections that are part of a product template. A global overlay section has no `product` scope.

**Consequences:** Modal opens with blank product name and no image. The core value proposition of the feature — showing the product in the modal — is broken.

**Prevention:** Pass product data to the modal via JavaScript or HTML data attributes on the trigger element. The pattern: the trigger button (on the product page) carries `data-product-title="{{ product.title | escape }}"` and `data-product-image="{{ product.featured_image | image_url: width: 800 }}"`. JavaScript intercepts the click, reads these values, and populates the modal's DOM before showing it. Alternatively, render the product image and title as hidden elements inside the product section and populate the modal slots via JS on open.

**Detection:** Modal opens but product name heading is blank and image area is empty. Inspect the overlay section's Liquid output in source — `{{ product.title }}` will render as empty string.

**Phase:** Implementation — product data pass-through.

---

### Pitfall 5: Shopify Contact Form Redirect Breaks Modal UX

**What goes wrong:** Shopify's `{% form 'contact' %}` performs a standard HTTP POST and redirects the page (or reloads it) after submission. When a form inside a modal submits, the entire page reloads. The user loses their place on the product page, the modal closes, and they land on the same product page with a success flash or a scroll-to-top.

**Why it happens:** The project scope explicitly rules out AJAX form submission. Shopify's standard contact form action (`/contact`) does a full redirect back to the same URL with `?contact_posted=true`. This is the expected server-side flow but it is disorienting when triggered from inside a modal.

**Consequences:** After submitting, the page reloads and scrolls to the top. The modal is gone. The user must scroll back down. The success state is shown inline on the page (via `form.posted_successfully?`) but only if the form action targets the current page — which requires the `action` attribute to be set correctly.

**Prevention:** Ensure the `{% form 'contact' %}` tag renders with no explicit `action` so it defaults to the current product page URL (which carries `?contact_posted=true` on redirect). Then in the modal section, check `{% if form.posted_successfully? %}` and render a success message inside the modal markup. The modal can be opened with `open` attribute by default when this query param is present — matching the pattern used by `newsletter-popup.liquid` (line 12: `{% if posted_successfully %}open{% endif %}`).

**Detection:** Submit the form and observe the redirect destination. If it goes to `/contact` or `/` rather than the current product page, the `action` attribute is wrong. If `posted_successfully?` never renders true, the form is posting to the wrong URL.

**Phase:** Implementation — form submission and success state handling.

---

## Moderate Pitfalls

---

### Pitfall 6: Shadow DOM Styling Cannot Be Reached with Regular CSS

**What goes wrong:** The `modal-default-template` renders inside a Shadow DOM (`this.attachShadow()`). CSS in `studio-peake.css` or section `<style>` blocks cannot pierce Shadow DOM boundaries. Attempts to style `.modal .content` or `x-modal [part="content"]` from outside the shadow root will be silently ignored.

**Prevention:** Style shadow parts using `::part()` selectors in `studio-peake.css` (e.g., `x-modal::part(content) { ... }`). For the 50/50 layout, the slotted content (the light DOM children) can be styled normally — only the wrapper chrome (overlay, content panel, close button) lives in Shadow DOM. The form and product image are slotted content and are styled as usual.

**Detection:** Apply a CSS rule to the modal content area. If it has no effect, the selector is targeting a shadow part. Switch to `::part()`.

**Phase:** Styling phase.

---

### Pitfall 7: Focus Trap Prevents Interaction With Page Elements If Modal Is Not Appended to Body

**What goes wrong:** `Modal` extends `DialogElement` with `shouldAppendToBody = true`. When the modal opens, it is detached from its original DOM position inside the Shopify section wrapper and re-appended to `document.body`. If the modal is not a `Modal` subclass (or uses `x-modal` incorrectly), it may remain inside the `shopify-section--overlay-group` wrapper, which can cause stacking context and z-index issues and interfere with focus trapping.

**Prevention:** Use `<x-modal>` as the custom element tag (not `<x-drawer>`). `x-modal` inherits `shouldAppendToBody = true` and `shouldLock = true`. This ensures body scroll locking and correct DOM position when open. Do not override these defaults.

**Detection:** Modal opens but page behind it is still scrollable, or interactive elements behind the modal overlay can still receive focus.

**Phase:** Implementation — custom element tag selection.

---

### Pitfall 8: Configurable Fields via Schema Settings — Required Field Validation Bypassed When Field Hidden

**What goes wrong:** Each form field is toggled on/off via `section.settings.show_[field]` checkboxes. If a field like Email is toggled off but the Shopify contact form server-side validation requires an email address, the form will silently fail or return a validation error even though the user cannot see the email field.

**Prevention:** Email should never be made optional at the schema level — it is required by Shopify's contact form. Keep Email as a non-toggleable required field. Only fields like Company Name, Phone, Address, Country, Postcode, and Marketing opt-in should be toggleable. Document this constraint in the section schema info text.

**Detection:** Merchant disables the Email field in the editor; form submissions begin failing server-side with a form error that cannot be shown because the field is hidden.

**Phase:** Implementation — schema field design.

---

### Pitfall 9: `handle-editor-events` Attribute Needed for Theme Editor Preview

**What goes wrong:** Without `handle-editor-events` on the modal element, clicking the section in the Shopify theme editor will not open the modal for live preview. The section will appear blank in the editor. The `shopify:section:select` event handler (line 1664, `theme.js`) is only wired up when this attribute is present.

**Prevention:** Add `handle-editor-events` to the `<x-modal>` element in the Liquid markup, matching the pattern in `newsletter-popup.liquid` (line 12) and `cart-drawer.liquid` (line 1).

**Detection:** Click the enquiry modal section in the Shopify theme editor. If the modal does not open automatically, the attribute is missing.

**Phase:** Implementation.

---

## Minor Pitfalls

---

### Pitfall 10: Product Image `image_url` Filter Width Must Be Specified

**What goes wrong:** Using `{{ product.featured_image | image_url }}` without a `width:` parameter generates a URL that may serve an excessively large image, or may fail in newer Shopify API versions that require an explicit transform.

**Prevention:** Always use `| image_url: width: 1200` (or an appropriate size for a half-screen image). Use `| image_tag` with `widths` and `sizes` attributes for responsive serving.

**Phase:** Implementation — product image rendering.

---

### Pitfall 11: Hidden Product Name Field Name Collision

**What goes wrong:** Shopify contact form field names of the pattern `contact[...]` are what appear in the submitted email. A hidden field for the product name should use a specific key like `contact[product]` to appear clearly in the notification email. Using a generic name like `contact[name]` will collide with the standard Name field and overwrite it.

**Prevention:** Use `contact[Product Enquiry]` or `contact[product_name]` as the hidden input name. Verify the key appears correctly in a test submission.

**Phase:** Implementation — form field naming.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| New section schema definition | `contact` section `disabled_on` constraint; schema group targeting | Write new section, use `enabled_on: custom.overlay` |
| Button trigger wiring | `button` block only supports `href`, not `aria-controls` | Pass `aria_controls` directly from product section, not via block URL field |
| Modal ID assignment | Dynamic `section.id` makes ID unpredictable | Use a fixed hard-coded ID string |
| Product data in modal | `product` object not available in overlay group section | Pass title/image via data attributes on trigger; populate via JS |
| Form submission and success | Full-page redirect from contact form | Set no explicit `action`; check `form.posted_successfully?` to reopen modal |
| Shadow DOM layout styling | Regular CSS does not penetrate shadow root | Use `::part()` for shadow chrome; light DOM slotted content styled normally |
| Theme editor preview | Modal invisible in editor without `handle-editor-events` | Add attribute to `<x-modal>` element |
| Toggleable field schema | Email hidden by mistake causes silent form failure | Keep Email non-toggleable; note in schema info text |

---

## Sources

All findings are HIGH confidence — derived from direct analysis of the production codebase:

- `assets/theme.js` lines 1640–2026: `DialogElement`, `Modal`, `Drawer` class definitions and ID-matching event delegation
- `snippets/shadow-dom-templates.liquid`: Shadow DOM template structure for modals
- `snippets/button.liquid`: `aria_controls` pass-through logic vs `href` path
- `blocks/button.liquid`: Block schema (no `aria_controls` setting exposed)
- `sections/newsletter-popup.liquid`: Reference pattern for overlay-group modal with form + `handle-editor-events` + `posted_successfully?` reopen
- `sections/contact.liquid`: `disabled_on: custom.overlay` constraint that prevents reuse
- `sections/overlay-group.json`: Existing overlay group structure and section types
