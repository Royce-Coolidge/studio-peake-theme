# Phase 1: Infrastructure + Visual Foundation - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Custom CSS/JS file infrastructure for all Studio Peake customisations, plus gradient overlays for text legibility on image sections and responsive image containers with configurable focal-point cropping. The adaptive image container exception mode (layout reshuffling for different image proportions) is also in scope.

</domain>

<decisions>
## Implementation Decisions

### Gradient overlay style
- Top gradient: `linear-gradient(0deg, rgba(255, 255, 255, 0.00) 46.76%, rgba(71, 60, 60, 0.40) 100%)` — warm brown tint, transparent from bottom to ~47%, then fading to 40% opacity
- Bottom gradient: `linear-gradient(0deg, rgba(255, 255, 255, 0.00) 17.9%, rgba(60, 53, 53, 0.40) 100%)` — slightly different brown tone, starts visible sooner (~18%)
- Default to these exact Figma values but allow per-section override via section settings (opacity/strength slider)
- Toggle per section — checkbox in section settings to enable/disable gradient overlay
- Both top and bottom gradients applied simultaneously where text overlays images

### Claude's Discretion
- Focal point implementation — use Shopify's built-in focal point picker or custom X/Y settings (choose the approach that gives best merchant UX)
- Adaptive layout exception mode — determine which components use this and how text repositions for square vs landscape images
- File loading strategy — how studio-peake.css/js are loaded relative to Prestige assets, whether JS uses ES modules via importmap or script tags
- Gradient implementation approach — whether to extend Prestige's existing `content-over-media` overlay system or create a separate gradient utility

</decisions>

<specifics>
## Specific Ideas

- Exact gradient CSS values provided from Figma — these are the designed values, not approximations
- The top gradient uses a slightly warmer brown (71,60,60) while the bottom uses a cooler brown (60,53,53) — this is intentional differentiation
- Merchant should have control but should not need to configure gradients for the site to look correct out of the box

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `content-over-media` CSS class: Prestige's overlay system with `--content-over-media-overlay` and `--content-over-media-gradient-overlay` CSS variables. The `:before` pseudo-element applies the overlay.
- `aspect-ratio` system: Prestige uses `--aspect-ratio` and `--default-aspect-ratio` CSS variables with `@supports` fallback for older browsers
- `object-fit: cover` + `object-position: center`: Standard pattern used throughout for image cropping

### Established Patterns
- Section-scoped CSS via `#shopify-section-{{ section.id }}` selectors for admin-configurable values
- Overlay settings in section schemas: `overlay_color` (colour picker) and `overlay_opacity` (range slider) — used in newsletter.liquid and other sections
- Colour scheme system: sections apply `color-scheme--{{ section.settings.color_scheme.id }}` class

### Integration Points
- `layout/theme.liquid`: Where studio-peake.css and studio-peake.js asset tags should be added
- Existing `content-over-media` sections: slideshow, newsletter, video, image-with-text-block — gradient overlays may extend or complement these
- Section schema patterns: `overlay_color`, `overlay_opacity` range (0-100) already established as merchant-facing controls

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-infrastructure-visual-foundation*
*Context gathered: 2026-03-12*
