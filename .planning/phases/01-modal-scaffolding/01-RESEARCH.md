# Phase 1: Modal Scaffolding - Research

**Researched:** 2026-03-17
**Domain:** Shopify theme overlay — `x-modal` web component registration, shadow DOM, overlay group schema
**Confidence:** HIGH

---

## Summary

Phase 1 is purely structural: get a full-screen `x-modal` element into the DOM, registered in the overlay group, with working open/close/focus-trap/editor-event behaviour. No product data, no form, no styling. This is the dependency root for all subsequent phases.

The Prestige v10.7.0 codebase provides every primitive needed: `x-modal` (the `Modal` class in `theme.js`), `dialog-close-button` web component, `handle-editor-events` attribute wiring, and `sections/overlay-group.json` as the established home for global overlays. The work is almost entirely structural Liquid — correct schema + correct element attributes + correct overlay-group.json registration.

The single most important constraint is the hardcoded `id="enquiry-modal"` on the `<x-modal>` element. The `DialogElement` registers click delegation at `connectedCallback` keyed on `this.id` (theme.js line 1650). If the ID uses `section.id`, the trigger from the product page (a different section with a different ID) can never match. A fixed string eliminates the coordination problem entirely and satisfies MODL-06.

**Primary recommendation:** Create `sections/product-enquiry-modal.liquid` as a new section modelled on `sections/newsletter-popup.liquid`, register it in `sections/overlay-group.json`, and use `<x-modal id="enquiry-modal" handle-editor-events>` with the default `modal-default-template`. Override the shadow `::part(content)` with CSS to make the panel full-screen. Do not create a new custom shadow DOM template for Phase 1 — the default template is sufficient to prove open/close/focus-trap/editor behaviour before the layout work in later phases.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MODL-01 | Modal opens as full-screen overlay using existing `x-modal` web component | `x-modal` is the registered tag for the `Modal` class (theme.js:1998). Full-screen achieved via `::part(content)` CSS override. |
| MODL-02 | Desktop layout is 40/60 split — product image left (40%), form/content right (60%) | Scaffold the two-column slot structure now; actual image and form content are later phases. The column containers live in the light DOM (slotted content), styled via regular CSS. |
| MODL-03 | Mobile layout is single column — form only, no image | Image column hidden via CSS at mobile breakpoint. Scaffold both columns; hide image column in CSS. |
| MODL-04 | Close button (X) positioned top-right of form panel, inherits cross icon animation from theme settings | `dialog-close-button` web component in light DOM (inside the default slot). Uses `{%- render 'icon' with 'close' -%}` which inherits `settings.icon_stroke_width`. |
| MODL-05 | Modal registered in overlay group (`sections/overlay-group.json`) | Add entry to `sections` object and `order` array in `overlay-group.json`. Section schema must use `"enabled_on": { "groups": ["custom.overlay"] }`. |
| MODL-06 | Hardcoded modal ID (`enquiry-modal`) for reliable trigger wiring | Set `id="enquiry-modal"` directly in the Liquid markup, not `id="{{ section.id }}"`. The `DialogElement` delegates clicks to `[aria-controls="${this.id}"]` (theme.js:1650) — fixed string is the only coordination-safe approach. |
</phase_requirements>

---

## Standard Stack

### Core

| Component | Source | Purpose | Why Standard |
|-----------|--------|---------|--------------|
| `<x-modal>` | `assets/theme.js` (lines 1963–2000) | Modal open/close, focus trap, scroll lock, Escape key, body append | Already registered; all overlay behaviour included |
| `<dialog-close-button>` | `assets/theme.js` (lines 1945–1956) | Dispatches `dialog:force-close` event on click | Works in light DOM; zero custom JS needed |
| `{% render 'icon' with 'close' %}` | `snippets/icon.liquid` (line 84) | SVG cross icon using `settings.icon_stroke_width` | Inherits theme settings automatically |
| `sections/overlay-group.json` | `sections/overlay-group.json` | Registration point for all global overlays | Established pattern; cart-drawer and newsletter-popup already here |
| `handle-editor-events` attribute | `assets/theme.js` (line 1663) | Wires `shopify:section:select` to open the modal in theme editor | Required for editor preview to work |

### Patterns in Use

| Instead of | Use | Reason |
|------------|-----|--------|
| `id="{{ section.id }}"` on `x-modal` | `id="enquiry-modal"` (hardcoded) | Modal and trigger are in different sections with different `section.id` values |
| `x-drawer` | `x-modal` | Drawer uses slide-from-side animation and `drawer-default-template`; modal uses fade/slide-up and `modal-default-template` |
| Native `<dialog>` | `<x-modal>` | Native dialog misses focus trap, scroll lock, editor events, and body append that `DialogElement` provides |
| Copying `contact.liquid` schema | Writing schema from scratch | `contact.liquid` has `"disabled_on": { "groups": ["custom.overlay"] }` — it cannot be added to the overlay group |
| Custom shadow DOM template | Default `modal-default-template` | The default template already provides overlay, content panel, header slot, body slot, and close button chrome. Full-screen override via CSS is sufficient for Phase 1. |

---

## Architecture Patterns

### Section File Structure

```
sections/product-enquiry-modal.liquid
├── <x-modal id="enquiry-modal" handle-editor-events ...>
│     ├── <dialog-close-button> (light DOM, in form panel)
│     │     └── <button> + {%- render 'icon' with 'close' -%}
│     ├── <div class="enquiry-modal__image-panel"> (slotted, light DOM)
│     │     └── (empty placeholder — product image added Phase 3)
│     └── <div class="enquiry-modal__form-panel"> (slotted, light DOM)
│           └── (empty placeholder — form added Phase 2)
├── <style> scoped to #shopify-section-{{ section.id }}
│     ├── x-modal::part(content) { full-screen overrides }
│     ├── .enquiry-modal__layout { 40/60 desktop grid }
│     └── @media mobile { hide image panel }
└── {% schema %} with enabled_on: custom.overlay
```

### Pattern 1: Overlay Group Section Schema

The `enabled_on` constraint is required for the section to appear in the overlay group. Do not copy the `disabled_on` pattern from `contact.liquid`.

```json
{%- comment %} In {% schema %} block: {%- endcomment %}
{
  "name": "Product Enquiry Modal",
  "class": "shopify-section--enquiry-modal",
  "enabled_on": {
    "groups": ["custom.overlay"]
  },
  "settings": [
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "t:global.colors.scheme",
      "default": "scheme-1"
    }
  ]
}
```

Source: Confirmed by `sections/cart-drawer.liquid` and `sections/newsletter-popup.liquid` schemas — both use `enabled_on: groups: custom.overlay` or absence of `disabled_on`.

### Pattern 2: x-modal Element in Light DOM

```liquid
{%- comment %} Source: theme.js lines 1963–2000 and newsletter-popup.liquid line 12 {%- endcomment %}
<x-modal
  id="enquiry-modal"
  class="enquiry-modal color-scheme color-scheme--{{ section.settings.color_scheme.id }}"
  handle-editor-events
  aria-label="Product Enquiry"
>
  <div class="enquiry-modal__layout">
    <div class="enquiry-modal__image-panel">
      {{- comment -}} Phase 3: product image goes here {{- endcomment -}}
    </div>

    <div class="enquiry-modal__form-panel">
      <dialog-close-button class="contents">
        <button type="button" class="enquiry-modal__close-button tap-area" aria-label="{{ 'general.accessibility.close' | t }}">
          {%- render 'icon' with 'close' -%}
        </button>
      </dialog-close-button>

      {{- comment -}} Phase 2: form goes here {{- endcomment -}}
    </div>
  </div>
</x-modal>
```

### Pattern 3: Full-Screen Modal via CSS Part Override

The `modal-default-template` shadow DOM sets `part="content"` on the panel element. Override it with `::part()` — the only selector that can reach shadow DOM parts from outside:

```css
/* Source: shadow-dom-templates.liquid — part="content" is on the inner panel */
/* Scoped to #shopify-section-{{ section.id }} in the section <style> block */
#shopify-section-{{ section.id }} x-modal::part(content) {
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  border-radius: 0;
}
```

The light DOM children (`.enquiry-modal__layout`, image panel, form panel) are slotted content — styled with normal CSS selectors inside the scoped `<style>` block.

### Pattern 4: overlay-group.json Registration

```json
{
  "type": "custom.overlay",
  "name": "Overlay group",
  "sections": {
    "cart-drawer": { ... },
    "newsletter-popup": { ... },
    "privacy-banner": { ... },
    "product-enquiry-modal": {
      "type": "product-enquiry-modal",
      "settings": {
        "color_scheme": ""
      }
    }
  },
  "order": [
    "cart-drawer",
    "newsletter-popup",
    "privacy-banner",
    "product-enquiry-modal"
  ]
}
```

Source: Direct inspection of `sections/overlay-group.json`. The `type` value must match the section filename without `.liquid`.

### Pattern 5: handle-editor-events Wiring

From `assets/theme.js` lines 1658–1668:

```javascript
// Fires when merchant clicks the section in theme editor
if (this.hasAttribute("handle-editor-events")) {
  this._shopifySection.addEventListener(
    "shopify:section:select",
    (event) => this.show(!event.detail.load),
    { signal: this.abortController.signal }
  );
  this._shopifySection.addEventListener(
    "shopify:section:deselect",
    this.hide.bind(this),
    { signal: this.abortController.signal }
  );
}
```

Without `handle-editor-events` on the `<x-modal>` element, the modal will not open when selected in the Shopify theme editor. This makes the section appear blank and is the single most common missed attribute.

### Anti-Patterns to Avoid

- **Dynamic modal ID from `section.id`:** `id="enquiry-modal-{{ section.id }}"` will never match the trigger button's `aria-controls` value because the two sections have different IDs. Use `id="enquiry-modal"` (hardcoded).
- **Placing the close button in the shadow DOM template:** `modal-default-template` already has a close button in the shadow header. For Phase 1, the close button is in the light DOM inside the form panel (MODL-04 requirement). Do not add a custom shadow template just for this — place a `dialog-close-button` in the light DOM and disable/hide the shadow close button with CSS if needed.
- **Copying `contact.liquid` schema:** It has `"disabled_on": { "groups": ["custom.overlay"] }`. The new section needs the opposite.
- **Putting the modal in `main-product.liquid`:** Duplicates the modal if featured-product sections appear elsewhere on a page. Overlay group is the single-instance home.
- **Using `x-drawer`:** Drawer extends Modal with slide-from-side animation. Full-screen centred modal requires `x-modal` (Modal class).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus trap | Custom focus management JS | `DialogElement` (via `x-modal`) | `FocusTrap` from vendor is already wired; `shouldTrapFocus` returns `true` |
| Scroll lock | `document.body.style.overflow = 'hidden'` | `DialogElement` via `shouldLock = true` | Lock count (`lockLayerCount`) is managed to support nested overlays; custom implementation breaks count |
| Escape key close | `keydown` listener | `DialogElement` built-in | Already handled internally in `DialogElement` |
| Close button click handler | `addEventListener('click', close)` | `<dialog-close-button>` web component | Dispatches `dialog:force-close` event which `DialogElement` listens to |
| Editor open-on-select | `shopify:section:select` listener | `handle-editor-events` attribute | `DialogElement` wires this up automatically when the attribute is present |
| Body append (z-index / stacking) | `document.body.appendChild(modal)` | `shouldAppendToBody = true` in `Modal` | Already happens on `show()` — manual append creates duplicate DOM |

---

## Common Pitfalls

### Pitfall 1: Wrong Schema Group Constraint
**What goes wrong:** Copying `contact.liquid` schema brings `"disabled_on": { "groups": ["custom.overlay"] }`, silently preventing the section from appearing in the overlay group.
**Why it happens:** `contact.liquid` was explicitly excluded from overlay use. The new section is the opposite case.
**How to avoid:** Write schema from scratch. Use `"enabled_on": { "groups": ["custom.overlay"] }`. Verify by opening Shopify admin and confirming "Product Enquiry Modal" appears in the overlay group section list.
**Warning signs:** Section does not appear as an option when editing the overlay group in the theme editor.

### Pitfall 2: Dynamic Modal ID Mismatch
**What goes wrong:** `id="enquiry-modal-{{ section.id }}"` cannot be matched by a trigger button in a different section using a hardcoded `aria-controls` value.
**Why it happens:** The button rendering and modal rendering are in different sections; each has its own `section.id`.
**How to avoid:** Set `id="enquiry-modal"` as a literal string in the Liquid. MODL-06 explicitly requires this.
**Warning signs:** Clicking any trigger does nothing. DevTools: button has `aria-controls="enquiry-modal"`, but DOM search for `id="enquiry-modal"` finds nothing (only `id="enquiry-modal-abc123"` or similar).

### Pitfall 3: Missing handle-editor-events
**What goes wrong:** Section appears blank in the Shopify theme editor. The modal only opens via external trigger, never from the editor panel.
**Why it happens:** `DialogElement.connectedCallback()` only wires `shopify:section:select` when `handle-editor-events` attribute is present (theme.js line 1663).
**How to avoid:** Add `handle-editor-events` to the `<x-modal>` element.
**Warning signs:** Click the "Product Enquiry Modal" section in the theme editor sidebar — modal does not open.

### Pitfall 4: Shadow DOM Close Button Conflict
**What goes wrong:** `modal-default-template` already renders a close button in the shadow DOM header. The requirement (MODL-04) places the close button top-right of the form panel in the light DOM. Both buttons end up present, and the shadow close button may obscure the layout.
**Why it happens:** The default template includes `<dialog-close-button>` in the shadow header automatically.
**How to avoid:** Either (a) hide the shadow close button via `x-modal::part(close-button) { display: none; }` and place the light-DOM `dialog-close-button` in the form panel, or (b) add a custom shadow template without a close button. Option (a) is simpler for Phase 1.
**Warning signs:** Two X icons visible in the modal; or close button in wrong position.

### Pitfall 5: Regular CSS Cannot Style Shadow Parts
**What goes wrong:** `.enquiry-modal x-modal .content { width: 100% }` has no effect. The `modal-default-template` renders inside a shadow root.
**Why it happens:** Shadow DOM encapsulation blocks external CSS selectors from penetrating the boundary.
**How to avoid:** Use `x-modal::part(content) { ... }` for shadow chrome. Slotted light DOM content (the `enquiry-modal__layout` div and its children) is styled normally.
**Warning signs:** CSS rules that should resize the modal panel have zero effect; inspector shows the rule is not matched.

---

## Code Examples

### Minimal Phase 1 x-modal Element

```liquid
{%- comment %} Source: theme.js lines 1963–2000, newsletter-popup.liquid line 12 {%- endcomment %}
<x-modal
  id="enquiry-modal"
  class="enquiry-modal color-scheme color-scheme--{{ section.settings.color_scheme.id }}"
  handle-editor-events
>
  <div class="enquiry-modal__layout">
    <div class="enquiry-modal__image-panel" aria-hidden="true">
      {{- comment -}} Phase 3: product image {{- endcomment -}}
    </div>

    <div class="enquiry-modal__form-panel">
      <dialog-close-button class="contents">
        <button type="button" class="enquiry-modal__close tap-area" aria-label="{{ 'general.accessibility.close' | t }}">
          {%- render 'icon' with 'close' -%}
        </button>
      </dialog-close-button>

      {{- comment -}} Phase 2: contact form {{- endcomment -}}
    </div>
  </div>
</x-modal>
```

### Minimal Phase 1 Section Schema

```json
{% schema %}
{
  "name": "Product Enquiry Modal",
  "class": "shopify-section--enquiry-modal",
  "enabled_on": {
    "groups": ["custom.overlay"]
  },
  "settings": [
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "t:global.colors.scheme",
      "default": "scheme-1"
    }
  ]
}
{% endschema %}
```

### overlay-group.json Entry

```json
"product-enquiry-modal": {
  "type": "product-enquiry-modal",
  "settings": {
    "color_scheme": ""
  }
}
```

Add `"product-enquiry-modal"` to the `"order"` array as well.

### Full-Screen CSS Override (scoped style block)

```css
/* Source: shadow-dom-templates.liquid — part names confirmed */
x-modal#enquiry-modal::part(overlay) {
  background: rgba(0, 0, 0, 0.5);
}

x-modal#enquiry-modal::part(content) {
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  border-radius: 0;
  display: flex;
}

x-modal#enquiry-modal::part(body) {
  padding: 0;
  flex: 1;
  overflow: hidden;
}

/* Hide default shadow close button — Phase 1 uses light DOM close button */
x-modal#enquiry-modal::part(close-button) {
  display: none;
}

/* 40/60 two-column desktop layout */
.enquiry-modal__layout {
  display: grid;
  grid-template-columns: 40fr 60fr;
  height: 100%;
  width: 100%;
}

/* Mobile: single column, hide image panel */
@media screen and (max-width: 749px) {
  .enquiry-modal__layout {
    grid-template-columns: 1fr;
  }

  .enquiry-modal__image-panel {
    display: none;
  }
}

/* Close button: top-right of form panel */
.enquiry-modal__form-panel {
  position: relative;
  overflow-y: auto;
}

.enquiry-modal__close {
  position: absolute;
  top: var(--spacing-5, 20px);
  right: var(--spacing-5, 20px);
}
```

### Modal Animation Behaviour (from theme.js, read-only reference)

```javascript
// Source: theme.js lines 1977–1996
// Desktop (sm breakpoint): simple opacity fade
// Mobile: overlay fades + content slides up from bottom
createEnterAnimationControls() {
  if (matchesMediaQuery("sm")) {
    return animate(this, { opacity: [0, 1] }, { duration: 0.2 });
  } else {
    return timeline([
      [overlay, { opacity: [0, 1] }, { duration: 0.3 }],
      [content, { transform: ["translateY(100%)", "translateY(0)"] }, { duration: 0.3, at: "<" }]
    ]);
  }
}
```

The animation uses `getShadowPartByName("overlay")` and `getShadowPartByName("content")` — these are the shadow parts. The light DOM content is unaffected by this animation.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual browser verification — no automated test framework configured for this Shopify theme |
| Config file | None |
| Quick run command | Open theme preview in browser, verify in Chrome DevTools |
| Full suite command | Full phase gate: theme editor verification + browser interaction testing |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Verification Method | Automated? |
|--------|----------|-----------|---------------------|------------|
| MODL-01 | Modal opens as full-screen overlay on trigger click | Manual smoke | Click a button with `aria-controls="enquiry-modal"`; verify modal covers viewport | Manual |
| MODL-02 | Desktop: 40/60 split layout | Manual smoke | Inspect `.enquiry-modal__layout` in DevTools at > 749px; verify grid columns | Manual |
| MODL-03 | Mobile: single column, no image | Manual smoke | Resize to < 749px; verify `.enquiry-modal__image-panel` is hidden | Manual |
| MODL-04 | Close button top-right of form panel | Manual smoke | Open modal; verify X button position; click to close | Manual |
| MODL-05 | Section registered in overlay group | Manual smoke | Open theme editor; confirm "Product Enquiry Modal" section appears in overlay group | Manual |
| MODL-06 | Hardcoded `id="enquiry-modal"` | Manual smoke | View source / DevTools; confirm `<x-modal id="enquiry-modal">` in DOM | Manual |

**Additional editor verification:**
- Click "Product Enquiry Modal" section in theme editor sidebar → modal opens (tests `handle-editor-events`)
- Press Escape key while modal open → modal closes (tests `DialogElement` Escape handling)
- Tab through modal → focus stays within modal (tests `FocusTrap`)
- Page behind modal is not scrollable while modal is open (tests `shouldLock = true`)

### Wave 0 Gaps

None — this is a Shopify theme with no automated test infrastructure. All verification is manual browser testing.

---

## Files to Create / Modify

| File | Action | Phase 1 Scope |
|------|--------|---------------|
| `sections/product-enquiry-modal.liquid` | Create | `x-modal` element with layout scaffolding, close button, scoped CSS, schema |
| `sections/overlay-group.json` | Modify | Add `product-enquiry-modal` to `sections` object and `order` array |

Files modified in later phases (not Phase 1):
- `assets/studio-peake.css` — layout styling (Phase 1 uses inline section `<style>`)
- `assets/studio-peake.js` — product data bridge (Phase 3)
- `sections/main-product.liquid` — data attributes (Phase 3)
- `blocks/button.liquid` — trigger wiring (Phase 4)

---

## Open Questions

1. **Shadow close button vs. light DOM close button conflict**
   - What we know: `modal-default-template` includes a `dialog-close-button` in the shadow header (shadow-dom-templates.liquid line 58). MODL-04 requires the close button in the form panel (light DOM).
   - What's unclear: Whether hiding the shadow close button via `::part(close-button) { display: none }` is the cleanest approach, or whether a custom shadow template (without a built-in close button) is preferred.
   - Recommendation: Hide shadow close button with `::part(close-button) { display: none }` for Phase 1. Revisit if the shadow header causes layout problems once the full-screen CSS override is applied.

2. **`modal-default-template` header slot in full-screen context**
   - What we know: The shadow DOM template has a `<header part="header">` that contains a `<slot name="header">`. In a full-screen modal this header may add unwanted top padding or structure.
   - What's unclear: Whether the shadow header needs to be hidden as well.
   - Recommendation: Check in browser after Phase 1 CSS override is applied. If the header part creates unwanted space, add `x-modal#enquiry-modal::part(header) { display: none; }`.

---

## Sources

### Primary (HIGH confidence)

- Direct code inspection: `assets/theme.js` lines 1628–1670 — `DialogElement` constructor, `connectedCallback`, `aria-controls` click delegation, `handle-editor-events` wiring
- Direct code inspection: `assets/theme.js` lines 1963–2000 — `Modal` class: `shadowDomTemplate`, `shouldLock`, `shouldAppendToBody`, enter/leave animation
- Direct code inspection: `assets/theme.js` lines 1945–1956 — `DialogCloseButton` class: `dialog:force-close` event dispatch
- Direct code inspection: `snippets/shadow-dom-templates.liquid` lines 50–70 — `modal-default-template` structure: `part="overlay"`, `part="content"`, `part="header"`, `part="body"`, `part="close-button"`
- Direct code inspection: `sections/overlay-group.json` — current registration format, section key naming, `order` array structure
- Direct code inspection: `sections/newsletter-popup.liquid` — reference implementation: `handle-editor-events`, `dialog-close-button` in light DOM, overlay group section schema pattern
- Direct code inspection: `sections/cart-drawer.liquid` lines 1–2 — `id` as hardcoded string + `handle-editor-events` pattern
- Direct code inspection: `snippets/icon.liquid` line 84–87 — `'close'` icon SVG using `settings.icon_stroke_width`

### Secondary (MEDIUM confidence)

- `.planning/research/STACK.md` — synthesised analysis of `x-modal` vs `x-drawer`, custom shadow DOM template decision, overlay group placement rationale
- `.planning/research/ARCHITECTURE.md` — component boundaries, ID coordination problem and fixed-string solution, build order
- `.planning/research/PITFALLS.md` — all 11 pitfalls with detection methods, Phase 1 relevant: Pitfall 1 (schema group), Pitfall 3 (fixed ID), Pitfall 7 (x-modal tag), Pitfall 9 (handle-editor-events)
- `.planning/research/SUMMARY.md` — Phase 1 scope definition and dependency rationale

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `x-modal`, `dialog-close-button`, `handle-editor-events` all read directly from `theme.js`
- Architecture: HIGH — overlay group registration format read directly from `overlay-group.json`; shadow part names from `shadow-dom-templates.liquid`
- Pitfalls: HIGH — all derived from direct codebase inspection, not inference

**Research date:** 2026-03-17
**Valid until:** Stable — Prestige v10.7.0 is pinned; no upstream changes expected
