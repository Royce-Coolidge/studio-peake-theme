# Studio Peake — Custom Theme Build

## What This Is

A custom Shopify theme for Studio Peake, an interior design studio, built by extending the Prestige v10.7.0 base theme. The build adds bespoke animations, interactions, navigation patterns, and layout components specified in the Figma design to transform Prestige into a distinctive brand experience — while keeping Shopify admin usability as the top priority for the client.

## Core Value

The theme must feel unmistakably Studio Peake — not a stock Prestige install — through polished interactions (animations, transitions, hover states) that the client can populate and manage entirely through the Shopify admin without developer assistance.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Prestige v10.7.0 base theme — installed and configured
- ✓ Studio Peake design tokens (colours, typography, spacing) — applied
- ✓ Header layout with emblem/logo — implemented
- ✓ Nav bar show/hide on scroll direction — implemented
- ✓ Section-based modular architecture — inherited from Prestige
- ✓ Colour scheme system with CSS custom properties — inherited
- ✓ Web Components pattern for interactive features — inherited
- ✓ Responsive breakpoints (mobile <700px, tablet 700-1000px, desktop 1000px+) — inherited

### Active

<!-- Current scope. Building toward these. -->

**Animation & Interaction:**
- [ ] Gradient overlays on image sections (CSS-based, top/bottom, for text legibility)
- [ ] Keyline draw-on animation (SVG stroke reveal on scroll/interaction)
- [ ] Colour-bleed button states (soft colour expansion on hover/tap)
- [ ] Button hover keyline animation
- [ ] Button click keyline draw animation
- [ ] Hero load sequence (image first, then logo fade-in)
- [ ] Close icon rotation on hover/tap
- [ ] Product image interactive tags (pulsing hotspots with expandable info)

**Layout & UI Components:**
- [ ] Two-column independent scroll (sticky right panel, scrolling left gallery)
- [ ] Dual-image crossfade on hover
- [ ] Adaptive image containers with focal point cropping
- [ ] Room scheme auto-rotation (2s fade cycle)
- [ ] Expandable info panel / accordion (no-reflow reveal)
- [ ] Emblem overlay on product pages (brand colour)
- [ ] Per-instance colour assignment for components

**Navigation & Filtering:**
- [ ] Portfolio dropdown with active state filtering (60% opacity)
- [ ] Workshop dropdown navigation
- [ ] Gallery filter bar with filled-circle indicators
- [ ] Cross-page category filtering (homepage → gallery pre-filtered)
- [ ] Mobile navigation filter (sub-categories)
- [ ] Mobile menu open animation (colour-bleed downward)

**Carousel & Gallery:**
- [ ] Featured projects carousel (full-bleed, drag + arrow)
- [ ] Project card hover state (gradient strengthen + zoom)
- [ ] Product image carousel (swipe navigation)
- [ ] Journal notes carousel (arrows desktop, stack mobile)
- [ ] Mobile carousel swipe gestures

**Pages & Sections:**
- [ ] Subscribe pop-up (10s delay OR 30% scroll trigger, footer link trigger)
- [ ] Careers collapsible block (toggleable, repeatable job specs)
- [ ] Tearsheet PDF auto-open
- [ ] Project video section (looping, auto-play on scroll, replaceable with image)
- [ ] About section text toggle with image update
- [ ] Blog page modular template (repeatable content blocks)
- [ ] Contact form (placeholder behaviour, validation states, radio buttons)

**Links & Routing:**
- [ ] Anchor links (Our Process / Our Team smooth scroll)
- [ ] Navigation split option (Workshop right-aligned)
- [ ] Press & Accolades link with keyline animation

### Out of Scope

- Full theme rebuild — extending Prestige, not replacing it
- E-commerce checkout customisation — using Shopify default checkout
- Multi-language content — English only for v1
- Custom app integrations — standard Shopify apps only
- Performance optimisation beyond what Prestige provides — address only if issues surface

## Context

- **Base theme:** Prestige v10.7.0 by Maestrooo, with Web Components, CSS custom properties, and modular section architecture already in place
- **Design source:** Figma comments document (`figma-comments.md`) with reference sites (studioashby.com, studiogorman.com, normcph.com, andtradition.com, audocph.com). Client will share Figma file URLs during build.
- **Designer/developer notes by:** Anna Vail
- **Client feedback by:** Sarah Peake
- **Existing JS patterns:** theme.js uses custom elements, vendor.min.js provides `inView` and `animate` animation utilities
- **CSS approach:** theme.css with CSS variables, scoped section styles, Tailwind-like utility classes
- **No build tooling:** Assets served directly through Shopify, no bundler

## Constraints

- **Tech stack**: Must extend Prestige Liquid/JS/CSS — no external frameworks or build tools
- **Merchant UX**: Every custom feature must be configurable through Shopify admin (section settings, blocks, metafields) without code changes
- **Animation library**: Use existing `vendor.min.js` (`inView`, `animate`) where possible before adding new dependencies
- **Browser support**: Chrome/Edge 90+, Firefox 88+, Safari 14.1+, modern mobile browsers
- **Mobile parity**: All desktop interactions must have mobile equivalents (hover → tap)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Extend Prestige rather than rebuild | Preserves proven e-commerce foundation, reduces risk, faster delivery | — Pending |
| Merchant UX prioritised over pixel-perfect fidelity | Client needs to manage content independently | — Pending |
| Gradient overlays as first phase | Unblocks project card hover, hero section, mobile tiles; pure CSS = low risk | — Pending |
| No hard deadline | Quality over speed | — Pending |

---
*Last updated: 2026-03-12 after initialization*
