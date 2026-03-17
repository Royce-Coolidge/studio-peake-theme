# Phase 4: Trigger Wiring - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

The existing button block on the product page opens the enquiry modal. This phase adds an `aria_controls` schema setting to the button block so merchants can point it at `enquiry-modal`. No new UI components — just wiring an existing button to an existing modal.

</domain>

<decisions>
## Implementation Decisions

### Trigger Approach
- **Reuse existing button block** in `main-product.liquid` — no new block type needed
- **Add `aria_controls` text setting** to the button block schema so merchants can configure the target modal ID
- **When `aria_controls` is set**, the button renders as a `<button>` with `aria-controls` attribute instead of an `<a>` with `href`
- **The button snippet already supports `aria_controls` parameter** — the modal block type already uses it (line 487 of `product-info.liquid`)
- **Default value should be empty** — button works as a normal link by default, only becomes a modal trigger when merchant sets `aria_controls` to `enquiry-modal`

### Button Behavior
- **No page navigation** when `aria_controls` is set — the button must not navigate away from the product page (per TRIG-03)
- **Button text remains merchant-configurable** via the existing `text` setting (e.g. "Enquire", "Ask About This Product")

### Claude's Discretion
- Exact conditional logic in product-info.liquid for rendering with aria_controls vs href
- Whether to use the existing `link` setting or skip it when `aria_controls` is present
- Schema setting placement within the button block settings array

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `snippets/button.liquid`: Already supports `aria_controls` parameter — generates `aria-controls` attribute on the rendered element
- `snippets/product-info.liquid` line 515: Current button block render call — `render 'button', href: block.settings.link, content: block.settings.text, stretch: block.settings.stretch, background: block.settings.background, text_color: block.settings.text_color`
- Modal block (line 487): Already uses `aria_controls` with the button snippet — proven pattern

### Established Patterns
- The `x-modal` web component listens for clicks on elements with `aria-controls` matching its `id` — no additional JS needed
- Button snippet: when `href` is blank and `aria_controls` is set, renders a `<button>` element (not `<a>`)

### Integration Points
- `snippets/product-info.liquid` — button block rendering (line 515) needs `aria_controls` parameter added
- `sections/main-product.liquid` — button block schema needs `aria_controls` text setting added
- `sections/product-enquiry-modal.liquid` — already has `id="enquiry-modal"`, no changes needed

</code_context>

<specifics>
## Specific Ideas

No specific requirements — the approach is straightforward: add a schema setting, pass it to the button snippet render call.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-trigger-wiring*
*Context gathered: 2026-03-17*
