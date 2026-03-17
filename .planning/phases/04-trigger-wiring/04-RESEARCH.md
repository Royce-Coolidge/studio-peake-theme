# Phase 04: Trigger Wiring - Research

**Researched:** 2026-03-17
**Domain:** Shopify Liquid — block schema extension, snippet render parameter passing
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Reuse existing button block in `main-product.liquid` — no new block type needed
- Add `aria_controls` text setting to the button block schema so merchants can configure the target modal ID
- When `aria_controls` is set, the button renders as a `<button>` with `aria-controls` attribute instead of an `<a>` with `href`
- The button snippet already supports `aria_controls` parameter — the modal block type already uses it (line 487 of `product-info.liquid`)
- Default value should be empty — button works as a normal link by default, only becomes a modal trigger when merchant sets `aria_controls` to `enquiry-modal`
- No page navigation when `aria_controls` is set — the button must not navigate away from the product page (per TRIG-03)
- Button text remains merchant-configurable via the existing `text` setting

### Claude's Discretion
- Exact conditional logic in product-info.liquid for rendering with aria_controls vs href
- Whether to use the existing `link` setting or skip it when `aria_controls` is present
- Schema setting placement within the button block settings array

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TRIG-01 | Existing button block on product page triggers the modal | Schema + render call changes in main-product.liquid and product-info.liquid enable this |
| TRIG-02 | Add `aria_controls` schema setting to button block for merchant flexibility | Shopify text schema type is the correct mechanism; confirmed empty default is valid |
| TRIG-03 | `aria-controls="enquiry-modal"` wiring between button and modal — no page navigation | button.liquid renders `<button>` (not `<a>`) when `href` is blank; x-modal listens on aria-controls clicks |
</phase_requirements>

## Summary

This phase wires the existing product page button block to the existing enquiry modal. Everything required already exists in the codebase — the button snippet supports `aria_controls`, the modal's `x-modal` component listens for clicks on elements whose `aria-controls` matches its own `id`, and the modal already has `id="enquiry-modal"`. The only work is: (1) adding an `aria_controls` text setting to the button block schema in `main-product.liquid`, and (2) passing that setting value through the render call in `product-info.liquid`.

The conditional rendering behaviour (button vs link) is already handled inside `button.liquid` at line 126: when `href` is blank it renders `<button>`, when `href` is present it renders `<a>`. The discretion question (what to do when both `link` and `aria_controls` are set) resolves naturally — pass `aria_controls` to the render call and either omit `href` or pass it normally; because `aria_controls` does not suppress `href` inside button.liquid, the safer pattern is to conditionally omit `href` when `aria_controls` is set.

No JavaScript changes are required. No new components. No new files. This is a two-touch change — one schema addition, one render call update.

**Primary recommendation:** Add the `aria_controls` text setting after the existing `link` URL setting in the button block schema, then pass `aria_controls: block.settings.aria_controls` in the render call — and conditionally blank `href` when `aria_controls` is present so the button does not navigate.

## Standard Stack

### Core

| Asset | Location | Purpose | Confidence |
|-------|----------|---------|------------|
| `snippets/button.liquid` | Already exists | Renders `<a>` or `<button>` based on `href` presence; outputs `aria-controls` when `aria_controls` param is set | HIGH |
| `snippets/product-info.liquid` line 513–516 | Already exists | Button block case statement — render call to extend | HIGH |
| `sections/main-product.liquid` lines 1746–1780 | Already exists | Button block schema — where new setting is inserted | HIGH |
| `x-modal` web component | Theme JS (not modified) | Listens for clicks on elements with `aria-controls` matching its `id` | HIGH |

No new packages. No installs.

## Architecture Patterns

### How button.liquid Decides Element Type

```liquid
{%- if href != blank -%}
  <a {{ attributes }} {{ block.shopify_attributes }}>
    {{- button_content -}}
  </a>
{%- else -%}
  <button type="{{ type | default: 'button' }}" {{ attributes }} {{ block.shopify_attributes }}>
    {{- button_content -}}
  </button>
{%- endif -%}
```

Source: `snippets/button.liquid` lines 126–134 (read directly from codebase)

**Key behaviour:** `href` controls the element type. `aria_controls` is output as an attribute regardless of which branch is taken. So to get a `<button aria-controls="enquiry-modal">` with no navigation, pass `aria_controls` and leave `href` blank.

### Proven Pattern — Modal Block (line 487 of product-info.liquid)

```liquid
{%- render 'button',
  content: block.settings.button_title,
  aria_controls: modal_id,
  style: block.settings.button_style,
  stretch: block.settings.stretch_button,
  background: block.settings.button_background,
  text_color: block.settings.button_text_color -%}
```

Source: `snippets/product-info.liquid` line 487 (read directly from codebase). Note: no `href` parameter — renders as `<button>`.

### Recommended Conditional Logic for Button Block Render Call

When `aria_controls` is set, skip passing `href` to prevent navigation. When it is blank, pass `href` as before — preserving backward compatibility for any existing button blocks that use a link.

```liquid
{%- when 'button' -%}
  {%- if block.settings.text != blank -%}
    {%- if block.settings.aria_controls != blank -%}
      {%- render 'button',
        aria_controls: block.settings.aria_controls,
        content: block.settings.text,
        stretch: block.settings.stretch,
        background: block.settings.background,
        text_color: block.settings.text_color -%}
    {%- else -%}
      {%- render 'button',
        href: block.settings.link,
        content: block.settings.text,
        stretch: block.settings.stretch,
        background: block.settings.background,
        text_color: block.settings.text_color -%}
    {%- endif -%}
  {%- endif -%}
```

This is the implementation the planner should prescribe. It satisfies TRIG-03 by ensuring no `href` is emitted when `aria_controls` is set.

### Schema Setting to Add

Insert after the existing `link` URL setting (line 1755–1758 of main-product.liquid), before `text`:

```json
{
  "type": "text",
  "id": "aria_controls",
  "label": "Modal ID (aria-controls)",
  "info": "Enter the ID of the modal this button should open (e.g. enquiry-modal). Leave blank to use the link above."
}
```

No translation key required for this project — plain string labels are used throughout the existing button block schema (confirmed in lines 1748–1779).

### Anti-Patterns to Avoid

- **Passing both `href` and `aria_controls` simultaneously:** button.liquid renders an `<a>` tag when `href` is present, meaning the button would navigate AND attempt to open the modal. Use the conditional branch above.
- **Adding a new block type for the enquiry trigger:** The user decision locks reuse of the existing button block. A new block adds merchant confusion and is unnecessary.
- **Using `data-modal-target` or custom JS:** The `x-modal` component already handles clicks on `aria-controls` elements natively. No JS is needed.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal open trigger | Custom JS event dispatcher | `aria-controls` on `<button>` matched by `x-modal` | Already wired in theme; adding JS creates a second code path |
| Element-type switching | Custom Liquid tag | `href` presence in button.liquid | Logic already exists; adding more is duplication |

## Common Pitfalls

### Pitfall 1: Both `href` and `aria_controls` set simultaneously

**What goes wrong:** Merchant fills in both the Link field and the Modal ID field. The button renders as an `<a>` (because `href` is non-blank) and navigates away on click, violating TRIG-03.
**Why it happens:** button.liquid's element-type decision is based solely on `href` presence.
**How to avoid:** Use the `if aria_controls != blank` conditional in product-info.liquid to route to two separate render calls — one with `href`, one without.
**Warning signs:** Test by setting both fields and verifying the rendered element is still `<button>`, not `<a>`.

### Pitfall 2: Schema `info` text creates user confusion

**What goes wrong:** Merchant sets `aria_controls` to something other than `enquiry-modal`, modal does not open, no error is shown.
**Why it happens:** The `x-modal` ID match is case-sensitive and exact.
**How to avoid:** Schema `info` text should state the exact value to enter: "Enter `enquiry-modal` to open the enquiry modal."

### Pitfall 3: Forgetting to pass `style` to the render call

**What goes wrong:** The button loses its visual style when the `aria_controls` branch is used.
**Why it happens:** The current render call at line 515 does not pass `style` — it relies on the default (`link`). If the button block has no `style` setting, this is fine. Confirm no `style` setting exists before assuming.
**How to avoid:** Match the params of the two branches (aria_controls branch and href branch) so styling is consistent.

## Code Examples

### Current render call (product-info.liquid line 515)

```liquid
{%- render 'button', href: block.settings.link, content: block.settings.text, stretch: block.settings.stretch, background: block.settings.background, text_color: block.settings.text_color -%}
```

Source: `snippets/product-info.liquid` line 515, read directly from codebase.

### Target render call (after this phase)

See "Recommended Conditional Logic" section above.

## State of the Art

| Area | Current State | After This Phase |
|------|--------------|-----------------|
| Button block | Renders link only (`href` required for function) | Renders as modal trigger when `aria_controls` is set |
| x-modal trigger | No product-page button wired to it | Button block wired via `aria-controls="enquiry-modal"` |
| Merchant control | No theme-editor way to open modal from button | `aria_controls` text setting in button block schema |

## Open Questions

1. **Does the button block schema use translation keys for setting labels?**
   - What we know: The existing button block settings (lines 1750–1779) use `t:` keys for most labels (e.g., `t:sections.main_product.blocks.button.link`).
   - What's unclear: Whether the planner should add a new translation key or use a plain string label.
   - Recommendation: Use a plain string label for the new setting (`"label": "Modal ID (aria-controls)"`) — translation keys require locales file edits across multiple languages and that overhead is out of scope for a single setting. Confirm by checking if any other settings in the block use plain strings.

2. **Does the button block currently have a `style` setting?**
   - What we know: The schema at lines 1749–1780 shows: `paragraph`, `url` (link), `text` (text), `checkbox` (stretch), `color` (background), `color` (text_color) — no `style` setting.
   - Recommendation: The `aria_controls` render branch does not need to pass `style` — the default (`link`) is already used by the existing call.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual browser testing (no automated test framework detected in this Shopify theme) |
| Config file | none |
| Quick run command | Open product page in Shopify preview, click Enquire button |
| Full suite command | Verify button renders as `<button aria-controls="enquiry-modal">` in browser DevTools, modal opens on click, no navigation occurs |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TRIG-01 | Clicking Enquire button opens enquiry modal | smoke | manual — open product page preview, click button | N/A |
| TRIG-02 | Merchant can set `aria_controls` in theme editor | manual | manual — open theme editor, locate button block, verify setting appears | N/A |
| TRIG-03 | Button does not navigate away when `aria_controls` is set | smoke | manual — inspect rendered HTML for `<button>` not `<a>`, confirm no navigation | N/A |

### Sampling Rate

- **Per task commit:** Inspect rendered HTML with DevTools to confirm element type
- **Per wave merge:** Open product page in Shopify preview and confirm modal opens on button click
- **Phase gate:** All three TRIG requirements manually verified before `/gsd:verify-work`

### Wave 0 Gaps

None — no test infrastructure setup required. This is a Shopify theme with no unit/integration test framework. All validation is manual browser testing.

## Sources

### Primary (HIGH confidence)

- `snippets/button.liquid` — read directly; confirms `aria_controls` parameter support and `href`-based element-type switching
- `snippets/product-info.liquid` lines 483–516 — read directly; confirms current button block render call and modal block proven pattern
- `sections/main-product.liquid` lines 1746–1780 — read directly; confirms button block schema structure and existing settings

### Secondary (MEDIUM confidence)

- `.planning/phases/04-trigger-wiring/04-CONTEXT.md` — user decisions and code insights documented during /gsd:discuss-phase
- `.planning/STATE.md` — accumulated project decisions confirming x-modal aria-controls mechanism

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all files read directly from codebase, no speculation
- Architecture: HIGH — proven pattern exists (modal block at line 487) and button.liquid logic is explicit
- Pitfalls: HIGH — derived from reading actual code paths, not inferred

**Research date:** 2026-03-17
**Valid until:** Until button.liquid or main-product.liquid schema is modified (stable theme files)
