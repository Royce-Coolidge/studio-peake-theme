# Architecture Patterns: Product Enquiry Modal

**Domain:** Shopify theme modal — product-contextual overlay with contact form
**Researched:** 2026-03-17
**Overall confidence:** HIGH (based on direct code inspection of the existing theme)

---

## Recommended Architecture

The enquiry modal integrates as a new section inside the existing overlay group, driven by the `x-modal` web component (which extends `DialogElement` → `Modal`). The trigger is the existing `button` block on the product page, modified with an `aria-controls` value pointing at the modal's section ID.

```
layout/theme.liquid
  └── sections/overlay-group.json        ← registers enquiry-modal section
        └── sections/enquiry-modal.liquid ← NEW section (primary deliverable)
              ├── <x-modal id="enquiry-modal-{{ section.id }}">
              │     ├── [slot="header"]  ← product title (hidden field mirror)
              │     └── [body slot]
              │           ├── .enquiry-modal__image  ← product featured image
              │           └── {%- form 'contact' -%}  ← Shopify contact form
              │                 ├── hidden: contact[body] = product title
              │                 └── visible fields (toggled via section.settings)
              └── {% schema %}           ← checkbox settings for each form field

templates/product.json
  └── sections/main-product.liquid
        └── blocks/button.liquid         ← MODIFIED: aria-controls points at modal
              └── snippets/button.liquid ← already supports aria_controls param
```

---

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `sections/overlay-group.json` | Registers all global overlay sections; rendered once in layout | `layout/theme.liquid` (rendered via `content_for_header`); hosts the new section |
| `sections/enquiry-modal.liquid` | Renders the full-screen modal HTML, contact form, image slot, and schema | Receives product data from Liquid page context; outputs `x-modal` web component |
| `x-modal` web component (theme.js) | Opens/closes modal, traps focus, locks scroll, handles Escape key, appends to body | Listens for clicks on `[aria-controls="<its-id>"]` anywhere in the DOM |
| `blocks/button.liquid` (on product page) | Triggers the modal open via `aria-controls` | Renders via `snippets/button.liquid` which already emits the `aria-controls` attribute |
| `snippets/button.liquid` | Renders `<button aria-controls="...">` | Called from `blocks/button.liquid`; `aria_controls` param supported natively |
| `snippets/input.liquid` | Renders individual form fields (text, email, tel, textarea) | Called from inside `{%- form 'contact' -%}` in the modal section |
| Shopify contact form (`form 'contact'`) | POSTs to Shopify, emails store owner, redirects back | No JS dependency; standard Shopify form action |

---

## Data Flow

### Product Context into the Modal

The modal section is in the overlay group, which is rendered globally (not on a specific page). The product object is **not available** in that context. Product data must be passed from the product page to the modal via the DOM.

Two proven patterns exist in this theme and Shopify ecosystem:

**Pattern A — JavaScript data bridge via `data-` attributes (recommended)**

The `main-product` section renders `data-product-title` and `data-product-image` on a container element. A small script in `studio-peake.js` reads these on page load and writes them into the modal's image `src` and the hidden `contact[body]` field.

```
main-product.liquid
  └── <div data-enquiry-product-title="{{ product.title }}"
            data-enquiry-product-image="{{ product.featured_image | image_url: width: 800 }}">

studio-peake.js (or inline <script> in modal section)
  └── reads data attributes → sets modal image src + hidden field value

enquiry-modal.liquid
  └── <img id="enquiry-modal-product-image" src="" alt="">
  └── <input type="hidden" name="contact[body]" id="enquiry-modal-product-name" value="">
```

This is consistent with how `js-variables.liquid` and CSS variable patterns work in the theme — Liquid writes data to the DOM; JavaScript reads it.

**Pattern B — Liquid variables in layout (not recommended)**

Attempting to access `product` inside the overlay group section fails because the overlay group renders outside of page template context. The `product` object is only available in product-scoped templates. Do not rely on this.

### Form Submission Flow

```
User fills form
  → POST /contact (Shopify native contact form action)
  → Shopify emails store owner
  → Page reload with form.posted_successfully? = true
  → Modal section renders success state
```

No AJAX. No third-party service. Standard redirect-on-submit. The `form 'contact'` tag is used in `sections/contact.liquid` already, confirming the pattern works in this theme.

### Trigger Flow

```
Product page renders
  └── button block outputs:
        <button aria-controls="enquiry-modal-{{ section.id }}">Enquire</button>

x-modal connectedCallback() (theme.js:1650)
  └── Delegate listens for click on [aria-controls="enquiry-modal-..."]
  └── On click: calls this.show() → adds open attribute → runs enter animation
  └── Focus trapped, scroll locked, Escape closes
```

The modal ID must match exactly. The overlay group section ID is stable (set in `overlay-group.json`). The button block's `aria-controls` value must be hardcoded to match — or both must use a shared identifier. The safest approach: use a predictable fixed ID (e.g., `enquiry-modal`) rather than `section.id`, since `section.id` in the overlay group differs from `section.id` in the product section.

---

## Patterns to Follow

### Pattern 1: Overlay Group Section Registration

`sections/cart-drawer.liquid` and `sections/newsletter-popup.liquid` are the two reference implementations. Both follow this structure:

- The section file wraps content in a web component custom element (`<cart-drawer>`, `<newsletter-popup>`).
- The web component extends `DialogElement` (for `pop-in`) or `Drawer`/`Modal`.
- The section is registered in `sections/overlay-group.json` with a named key.
- No `presets` or `enabled_on` schema entry is needed — the overlay group handles placement.

For the enquiry modal, use `<x-modal>` directly (it is already registered; no new custom element class required unless custom behaviour is needed). The `x-modal` element is the right choice over `x-drawer` because the design is a full-screen centred overlay, not a side panel.

### Pattern 2: Shadow DOM Template

`x-modal` uses `modal-default-template` by default (defined in `snippets/shadow-dom-templates.liquid`). That template provides:
- `part="overlay"` — the backdrop (click to close)
- `part="content"` — the white panel
- `slot="header"` — receives header slot content
- Default `<slot>` — receives body content
- Built-in close button via `dialog-close-button`

The 50/50 layout lives **inside** the default body slot. No need to create a custom shadow DOM template — override with CSS targeting `::part(content)` to set `max-width: 100%; width: 100%` for full-screen behaviour.

### Pattern 3: Button Block aria-controls

`snippets/button.liquid` already supports `aria_controls` (line 27 in that file). The `blocks/button.liquid` currently passes `href` and `style` but not `aria_controls`. The required change is:

1. Add an `aria_controls` setting to `blocks/button.liquid` schema (a `text` type input, or a hardcoded render pass-through).
2. Pass `aria_controls: block.settings.aria_controls` (or a hardcoded string) to the `render 'button'` call.

The `snippets/button.liquid` will then emit `aria-controls="enquiry-modal"` on the rendered `<button>` element, and `x-modal` will pick it up automatically.

### Pattern 4: Field Toggle via Section Settings

`sections/contact.liquid` uses block-level field toggling. For the enquiry modal, since fields are fixed (not merchant-added), use `section.settings` checkboxes instead:

```liquid
{%- if section.settings.show_phone -%}
  {%- render 'input', type: 'tel', name: 'contact[Phone]', label: 'Phone Number' -%}
{%- endif -%}
```

Each configurable field gets a `checkbox` setting in the schema. This is simpler than blocks for a fixed-field form.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Accessing `product` in the Overlay Group Section

**What goes wrong:** `product` is `nil` in the overlay group context. Image and title will be blank at render time.

**Why bad:** The overlay group renders once globally, outside product template scope. Liquid server-render happens before any product page context is established.

**Instead:** Use the JavaScript data bridge (Pattern A above). Render the modal structure with empty `src` and `value` attributes; populate them client-side from `data-` attributes set by `main-product.liquid`.

### Anti-Pattern 2: Creating a New Custom Element Class for a Standard Modal

**What goes wrong:** Unnecessary complexity; diverges from theme conventions.

**Why bad:** `x-modal` already does full-screen modal, focus trap, scroll lock, Escape handling, and aria. Creating a new element (e.g., `enquiry-modal`) requires adding JS to `studio-peake.js`, risks breaking future theme updates, and adds maintenance burden.

**Instead:** Use `<x-modal id="enquiry-modal">` directly. Only extend if genuinely new behaviour is needed (e.g., pre-populating fields on open — which can be done with a small `<script>` in the section or in `studio-peake.js` instead).

### Anti-Pattern 3: Embedding the Modal in `main-product.liquid`

**What goes wrong:** The modal renders once per product section instance. If `featured-product` also appears on the homepage, duplicate modals appear.

**Why bad:** Overlay group is the established pattern for global one-instance overlays. It ensures the modal exists once in the DOM regardless of how many product sections are on a page.

**Instead:** Place the section in the overlay group, populate data via JS.

### Anti-Pattern 4: Using a Fixed `aria-controls` Value Without Coordination

**What goes wrong:** The `x-modal` id and the button's `aria-controls` value must match exactly. If the modal uses `id="enquiry-modal-{{ section.id }}"`, the button block cannot know the `section.id` of the overlay group section at render time.

**Instead:** Use a fixed, predictable ID string (e.g., `enquiry-modal`) for the `x-modal` element, not `section.id`. This makes the wiring explicit and avoids coordination problems between sections.

---

## Build Order (Phase Dependencies)

The components have clear sequential dependencies:

```
Step 1: sections/enquiry-modal.liquid (the modal section)
  - Define x-modal structure with fixed id="enquiry-modal"
  - Add Shopify contact form with hidden product field (empty value initially)
  - Add product image placeholder (empty src initially)
  - Add section schema with field-toggle checkboxes
  - Register in sections/overlay-group.json

Step 2: CSS for modal layout
  - Full-screen override for ::part(content)
  - 50/50 desktop grid, stacked mobile layout
  - Input label styling (uppercase button font, underline inputs)
  - Lives in assets/studio-peake.css

Step 3: JS data bridge in assets/studio-peake.js
  - On DOMContentLoaded, read data attributes from main-product container
  - Write product title into hidden contact field
  - Write product image URL into modal image src
  - Runs only if both the data source and modal target exist in the DOM

Step 4: Trigger wiring — blocks/button.liquid modification
  - Add aria_controls setting to schema (text input, default "enquiry-modal")
  - Pass aria_controls to render 'button' call
  - Verify button text renders "Enquire" by default

Step 5: main-product.liquid data attributes
  - Add data-enquiry-product-title and data-enquiry-product-image to a container
  - These are the source for the Step 3 JS bridge
```

Steps 1 and 2 can be developed together. Step 3 depends on Steps 1 and 5. Step 4 is independent and can proceed any time after Step 1 (since x-modal only cares that the element with the matching ID exists in the DOM at click time).

---

## Scalability Considerations

| Concern | Approach |
|---------|----------|
| Multiple product sections on one page (e.g., featured-product on homepage) | Single modal in overlay group; JS bridge only fires on product template pages where `data-enquiry-product-*` attributes exist |
| Theme editor live preview | x-modal respects `shopify:section:select` and `shopify:block:select` events (already in DialogElement); `handle-editor-events` attribute on the element enables this |
| Form submission redirect | Standard Shopify contact form redirect returns to same URL; modal will not auto-reopen (acceptable per project scope, which excludes AJAX submission) |
| Locale/translation | Form labels should use `'t'` filter keys added to `locales/en.default.json`; field labels are visible text so they need translation entries |

---

## Key File Locations

| File | Role | Action |
|------|------|--------|
| `sections/enquiry-modal.liquid` | Primary new file | Create |
| `sections/overlay-group.json` | Overlay registration | Modify — add enquiry-modal entry |
| `blocks/button.liquid` | Trigger wiring | Modify — add aria_controls setting |
| `assets/studio-peake.css` | Modal layout styles | Modify — add enquiry modal rules |
| `assets/studio-peake.js` | JS data bridge | Modify — add product data population |
| `sections/main-product.liquid` | Data source | Modify — add data-enquiry-* attributes |
| `snippets/shadow-dom-templates.liquid` | Shadow DOM templates | Read-only reference (no changes needed) |
| `snippets/input.liquid` | Form field rendering | Read-only reference (use as-is) |
| `snippets/button.liquid` | Button rendering | Read-only reference (aria_controls already supported) |
| `locales/en.default.json` | Translation strings | Modify — add enquiry modal label keys |

---

## Sources

- Direct code inspection: `assets/theme.js` lines 1630–2042 (DialogElement, Modal, Drawer, PopIn class implementations)
- Direct code inspection: `snippets/shadow-dom-templates.liquid` (modal-default-template structure)
- Direct code inspection: `snippets/button.liquid` (aria_controls parameter support confirmed)
- Direct code inspection: `sections/newsletter-popup.liquid` and `sections/cart-drawer.liquid` (overlay group section pattern)
- Direct code inspection: `sections/overlay-group.json` (overlay group registration format)
- Direct code inspection: `sections/contact.liquid` (Shopify contact form pattern)
- Direct code inspection: `snippets/input.liquid` (form field rendering API)
- Project requirements: `.planning/PROJECT.md`
- Existing architecture analysis: `.planning/codebase/ARCHITECTURE.md`
