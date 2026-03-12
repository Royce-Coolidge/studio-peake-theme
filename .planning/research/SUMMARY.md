# Project Research Summary

**Project:** Studio Peake Custom Theme
**Domain:** Premium Shopify theme customisation (interior design studio portfolio + curated product shop)
**Researched:** 2026-03-12
**Confidence:** HIGH

## Executive Summary

Studio Peake is a luxury interior design studio website built on Prestige v10.7.0, a mature Shopify theme with 80+ Web Components, a bundled animation library (Motion One), and a comprehensive CSS custom property system. The project requires 35 custom features spanning animation systems, interactive product experiences, portfolio filtering, and adaptive layouts. The fundamental approach is extension, not replacement: Prestige already provides the component model (Web Components), animation engine (Motion One via vendor.min.js), carousel primitives, and colour scheme infrastructure. Every custom feature should follow the theme's established patterns.

The recommended architecture separates all custom code into dedicated files -- `studio-peake.css` and `studio-peake.js` -- loaded alongside (not merged into) Prestige's core files. New sections use an `sp-` prefix, new snippets follow the same convention, and all interactive behaviour is implemented as custom elements. This separation is the single most important architectural decision: it preserves the ability to accept Prestige theme updates without losing custom work. The stack requires zero new dependencies -- CSS animations, CSS transitions, Motion One imports from `"vendor"`, and native Web Components cover every feature requirement.

The primary risks are CSS specificity conflicts with Prestige's 8,080-line stylesheet, layout thrashing from scroll-linked animations on mobile, and breaking Shopify's theme editor compatibility. All three are preventable by following established patterns: namespace custom CSS with `.sp-*` classes, animate only `transform` and `opacity`, and use Web Components exclusively so `connectedCallback`/`disconnectedCallback` handle editor lifecycle events automatically. Cross-browser SVG stroke animation inconsistencies are a secondary risk specific to the signature keyline draw-on feature -- mitigated by using the `pathLength="1"` SVG attribute.

## Key Findings

### Recommended Stack

No new dependencies are needed. Prestige bundles everything required: Motion One (animate, inView, scroll, timeline, stagger), event delegation (Delegate), focus management (FocusTrap), and lightbox (PhotoSwipeLightbox). Custom code imports from the existing `"vendor"` import map entry.

**Core technologies:**
- **Motion One (bundled):** Animation orchestration -- scroll-triggered reveals, timeline sequences, stagger effects. Already imported throughout theme.js.
- **CSS transitions + @keyframes:** Hover states, looping animations, colour-bleed effects. 60+ existing transition declarations in theme.css to extend.
- **Web Components (vanilla):** All interactive features. 80+ existing custom elements establish the pattern. No framework needed.
- **SVG stroke-dasharray/dashoffset:** Keyline draw-on animation. Native technique, triggered by Motion's `inView()`.
- **CSS custom properties:** Design token system. Already the core of Prestige's theming; all new components consume existing variables.
- **URL parameters:** Filter state for cross-page category navigation. Follows Prestige's existing `facets-form` pattern.

**Critical constraints:** No build process (no TypeScript, no SCSS, no JSX). Safari 14.1+ baseline (no `@container`, no `:has()`, no `scroll-timeline`). All settings merchant-configurable via section schemas.

### Expected Features

**Must have (table stakes) -- 22 features:**
- Gradient overlays for text legibility on full-bleed images
- Hero load sequence (choreographed first impression)
- Responsive image containers with focal-point cropping
- Colour-bleed button hover/tap states (signature interaction)
- Nav bar show/hide on scroll direction (already done)
- Portfolio dropdown with gallery filtering + cross-page filter state
- Featured projects carousel with drag/arrow navigation
- Expandable info panels / accordions
- Subscribe popup (timed + scroll-triggered)
- Mobile parity: hover-to-tap conversion, persistent gradients, swipe gestures

**Should have (differentiators) -- 13 features:**
- Keyline draw-on animation system (SVG stroke reveals -- highest differentiation value)
- Product image interactive hotspot tags (pulsing dots with expandable info)
- Two-column independent scroll layout (sticky right, scrolling left)
- Dual-image crossfade on hover
- Room scheme auto-rotation (2s fade cycle)
- About section text toggle with image update
- Per-instance colour assignment per component

**Defer if scope pressure arises:**
- Hotspot tags, two-column scroll, and room scheme auto-rotation can slip without the site feeling incomplete. Everything else is committed scope per the client specification.

### Architecture Approach

All custom code lives in dedicated files (`studio-peake.css`, `studio-peake.js`, `sp-*.liquid` sections/snippets) loaded alongside Prestige's untouched core. Data flows from section schemas through Liquid templates (rendering HTML with `data-*` attributes and CSS custom properties) into Web Components that import animation utilities from `"vendor"`. Filtering uses URL parameters as the canonical state, with client-side show/hide via a `<sp-gallery-filter>` Web Component.

**Major components:**
1. **studio-peake.css** -- All custom styles: gradients, colour-bleed, keyline animations, layout utilities. Loaded after theme.css.
2. **studio-peake.js** -- All custom Web Components (11 defined: sp-keyline-reveal, sp-colour-bleed, sp-gallery-filter, sp-image-crossfade, sp-image-hotspot, sp-auto-rotate, sp-hero-sequence, sp-split-scroll, sp-subscribe-popup, sp-project-carousel, sp-mobile-filter).
3. **sp-* sections** -- 8 new section files for custom page components (hero, carousel, gallery, two-column, hotspots, video, about toggle, careers).
4. **sp-* snippets** -- 5 reusable Liquid partials (gradient overlay, keyline button, project card, filter button, scroll reveal).
5. **css-variables.liquid** -- Already customised with Studio Peake design tokens; extended as needed.

### Critical Pitfalls

1. **CSS specificity wars with Prestige** -- Use `.sp-*` namespaced classes, never `!important` for layout/visual styling, load custom CSS after theme.css. Establish naming convention in Phase 1.
2. **Layout thrashing from animation JS** -- Animate only `transform` and `opacity` (compositor-friendly). Use Motion One's utilities instead of raw scroll listeners. Batch reads before writes.
3. **Theme editor incompatibility** -- Use Web Components exclusively. `connectedCallback`/`disconnectedCallback` handle Shopify's dynamic section insertion/removal automatically. Test every section in the editor.
4. **Theme update destruction** -- Never modify theme.js, theme.css, or vendor.min.js. All custom code in separate files. Mark any unavoidable Prestige file edits with `<!-- SP CUSTOM -->` comments.
5. **Mobile touch conflicts** -- Use CSS `touch-action` to declare gesture intent. Use Pointer Events API. Never prevent vertical scrolling for horizontal gesture capture. Test on real devices.

## Implications for Roadmap

### Phase 1: Infrastructure and Visual Foundation
**Rationale:** Everything depends on the CSS/JS file infrastructure and core visual patterns. Gradient overlays alone unblock project cards, hero, and mobile layouts. Font loading must be resolved before typography-dependent work.
**Delivers:** Custom CSS/JS file loading in theme.liquid, importmap entry, gradient overlay system, responsive image containers, hero load sequence, emblem overlay, custom font loading (WOFF2 conversion + preload).
**Addresses:** 4 table-stakes features (gradients, image containers, hero, emblem) + infrastructure.
**Avoids:** Pitfall #1 (CSS specificity -- establishes naming convention), Pitfall #4 (theme updates -- establishes file separation), Pitfall #13 (font loading flash).

### Phase 2: Interaction Systems
**Rationale:** The colour-bleed and keyline systems define Studio Peake's interaction language. Every subsequent feature references these patterns. Keyline is the highest-differentiation feature and needs early cross-browser validation.
**Delivers:** Colour-bleed button states, keyline draw-on SVG animation system, button hover/click keyline, close icon rotation.
**Addresses:** 4 table-stakes features + 2 differentiator features.
**Avoids:** Pitfall #2 (layout thrashing -- establishes compositor-only animation rule), Pitfall #9 (SVG browser inconsistencies -- validates `pathLength="1"` approach early), Pitfall #11 (paint storms -- establishes pseudo-element pattern).

### Phase 3: Navigation and Filtering
**Rationale:** Portfolio dropdown and gallery filtering are tightly coupled. Cross-page filter state (URL params) must be designed holistically. This phase has moderate complexity and benefits from the animation patterns established in Phase 2.
**Delivers:** Portfolio dropdown with active state, gallery filter bar with filled-circle indicators, cross-page category filtering, mobile navigation filter, workshop dropdown, anchor links.
**Addresses:** 6 table-stakes features.
**Avoids:** Pitfall #14 (filter state loss -- URL params as source of truth), Pitfall #7 (Liquid rendering performance -- client-side filtering).

### Phase 4: Carousels and Gallery
**Rationale:** Carousels depend on understanding Prestige's existing `effect-carousel` and `scroll-carousel` patterns. The project card hover state consumes the gradient overlay system from Phase 1. Touch handling must be solved once for all carousels.
**Delivers:** Featured projects carousel, project card hover state, dual-image crossfade, product image carousel, journal notes carousel, mobile swipe gestures.
**Addresses:** 5 table-stakes features + 1 differentiator.
**Avoids:** Pitfall #5 (mobile touch conflicts -- establishes touch pattern for all carousels), Pitfall #8 (memory leaks -- AbortController pattern for carousel listeners).

### Phase 5: Advanced Layouts and Interactive Content
**Rationale:** Two-column scroll and hotspot tags are the highest-complexity differentiators. They benefit from all patterns established in previous phases. These are the features most likely to need iteration.
**Delivers:** Two-column independent scroll, expandable info panels / accordions, product image hotspot tags, room scheme auto-rotation, about section text toggle.
**Addresses:** 2 table-stakes features + 4 differentiator features.
**Avoids:** Pitfall #6 (accessibility -- auto-rotation pause control, keyboard support for hotspots), Pitfall #12 (z-index chaos -- hotspot popovers need defined stacking), Pitfall #10 (section context assumptions -- sections must work on any page).

### Phase 6: Pages, Polish, and Completion
**Rationale:** These features are largely independent and can be built in parallel once all foundational patterns exist. Lower risk, lower complexity.
**Delivers:** Subscribe popup, contact form, careers collapsible block, blog modular template, project video section, tearsheet PDF, per-instance colour assignment, navigation split option, press keyline links, mobile menu colour-bleed animation.
**Addresses:** Remaining 10 features across table stakes and differentiators.
**Avoids:** Pitfall #3 (theme editor -- popup and careers must handle section lifecycle), Pitfall #15 (monolithic JS -- consider splitting JS by feature area at this scale).

### Phase Ordering Rationale

- **Dependency-driven:** Gradient overlays, image containers, and the CSS/JS infrastructure are consumed by nearly every subsequent feature. They must come first.
- **Risk-front-loaded:** The keyline SVG animation (Phase 2) is the highest-risk differentiator due to cross-browser inconsistencies. Validating it early prevents late-stage surprises.
- **Feature grouping by architecture pattern:** Carousels share touch handling and extend Prestige's carousel base. Filtering shares URL state management. Grouping by pattern reduces context-switching.
- **Pitfall mitigation cascades:** Establishing the AbortController cleanup pattern, compositor-only animation rule, and `.sp-*` naming convention in Phases 1-2 prevents the most damaging pitfalls from ever occurring.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Navigation/Filtering):** Cross-page filter state design needs careful URL parameter architecture. How Prestige's existing `facets-form` integrates with custom filtering needs codebase investigation.
- **Phase 4 (Carousels):** Prestige's `effect-carousel` and `scroll-carousel` internals need study to determine extension points vs. custom implementation.
- **Phase 5 (Hotspot Tags):** Admin configurability for hotspot positioning (metafields vs. block settings) needs prototyping to determine the best merchant experience.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** CSS file loading, importmap configuration, gradient overlays, and image containers are well-documented, established patterns.
- **Phase 2 (Interaction Systems):** SVG stroke animation and CSS transitions are thoroughly documented. The `pathLength="1"` technique is standard.
- **Phase 6 (Pages/Polish):** Subscribe popups, contact forms, accordions, and video sections are standard Shopify patterns with clear Prestige precedents.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Based on direct codebase analysis of Prestige's vendor.min.js exports, theme.js patterns, and theme.css techniques. Zero ambiguity -- the stack is already in the theme. |
| Features | MEDIUM | Feature specs come from detailed Figma comments. Reference site analysis (Studio Ashby, Norm CPH, etc.) based on training data, not live verification. Core patterns are stable luxury web conventions. |
| Architecture | HIGH | Based on direct analysis of Prestige v10.7.0 codebase structure, 80+ existing Web Components, and established Shopify Online Store 2.0 patterns. |
| Pitfalls | HIGH | Based on codebase analysis (8,080-line CSS, 5,868-line JS, 98 connectedCallback instances, 34 layout reads) combined with established Shopify theme development failure modes. |

**Overall confidence:** HIGH

### Gaps to Address

- **Custom font loading:** `custom-fonts.css` is currently empty (0 bytes). Font loading strategy (WOFF2 conversion, preload, fallback metrics) must be implemented in Phase 1. Exact font file availability needs verification.
- **Prestige carousel extension points:** Whether to extend `effect-carousel` / `scroll-carousel` or build custom carousel components is unclear without deeper analysis of their APIs. Resolve during Phase 4 planning.
- **Metafield schema for filtering:** The exact metafield structure for project categories (single value vs. list, metaobject vs. simple metafield) needs design during Phase 3 planning.
- **Header modifications audit:** The existing header customisation (commit 5c40ab1) should be reviewed against the "never modify Prestige core files" principle. If header.liquid was modified in-place, changes need `<!-- SP CUSTOM -->` markers.
- **Reference site patterns:** Feature analysis of competitor sites (studioashby.com, normcph.com) is based on training data, not live verification. Patterns may have evolved since early 2025.

## Sources

### Primary (HIGH confidence)
- Prestige v10.7.0 codebase analysis -- theme.js (5,868 lines, 80+ custom elements), theme.css (8,080 lines), vendor.min.js (Motion One exports)
- layout/theme.liquid -- importmap configuration, script loading order
- snippets/css-variables.liquid -- CSS custom property injection pattern
- .planning/codebase/CONCERNS.md -- 17 documented codebase concerns
- PROJECT.md -- project constraints, tech stack, scope boundaries

### Secondary (MEDIUM confidence)
- Figma comments document (figma-comments.md) -- feature specifications and design intent
- custom-code-tasks.md -- complete task inventory (35 features)
- Luxury interior design web conventions (studioashby.com, normcph.com, andtradition.com, audocph.com patterns from training data)
- Shopify Online Store 2.0 section architecture documentation
- WCAG 2.1 AA requirements for animation and interactive content

### Tertiary (LOW confidence)
- Reference site current state -- sites may have updated since training data cutoff (early 2025)

---
*Research completed: 2026-03-12*
*Ready for roadmap: yes*
