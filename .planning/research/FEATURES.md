# Feature Landscape

**Domain:** Premium interior design studio website (portfolio + curated product shop)
**Researched:** 2026-03-12
**Confidence:** MEDIUM (based on training data knowledge of luxury design sites studioashby.com, normcph.com, andtradition.com, audocph.com and detailed Figma design specs; web verification tools unavailable)

---

## Table Stakes

Features users expect from a premium interior design studio site. Missing any of these and the site feels unfinished or amateur compared to peers like Studio Ashby, Norm CPH, and Studio Gorman.

### Visual Foundation

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Gradient overlays for text legibility** | Every luxury portfolio site overlays text on full-bleed imagery. Without coded gradients, text is unreadable on light images or the client bakes gradients into images (fragile, non-responsive). Industry standard. | Low | Pure CSS. Top + bottom gradients. Must be in layout layer, not image files. Unlocks project cards, hero, mobile tiles. |
| **Responsive image containers with focal-point cropping** | Luxury sites never show broken layouts from uploaded images. Aspect-ratio enforcement + focal-point control is standard on any site where the client manages their own imagery. | Medium | CSS `aspect-ratio` + `object-position`. The "exception mode" (layout reshuffles for different proportions) adds complexity. |
| **Hero load sequence** | A considered first impression is non-negotiable. Studio Gorman, Studio Ashby, and peers all have choreographed hero moments. A plain image pop-in feels cheap. | Low | Image loads first, logo fades in with timed delay. CSS animation + small JS for sequencing. |
| **Emblem overlay on product pages** | Brand mark presence on product imagery is standard for luxury. Without it, product pages feel generic / stock-theme. | Low | CSS positioned overlay element with brand colour. |

### Navigation & Wayfinding

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Nav bar show/hide on scroll direction** | Already implemented. Standard pattern on luxury sites (ref: studioashby.com). Maximises image real estate while keeping nav accessible. | Low | Done. |
| **Portfolio dropdown with active state** | Category filtering in navigation is standard for multi-project studios. normcph.com uses this exact pattern. Without it, users have no way to browse by project type. | Medium | Dropdown + 60% opacity active indicator + gallery filtering integration. |
| **Gallery filter bar with filled-circle indicators** | Visual filter state is expected. Users need to know what they are looking at. The filled-circle radio pattern is clean and on-brand. | Medium | Custom radio-style UI. Default "All Projects" filled state. |
| **Cross-page category filtering** | Clicking "Residential" on homepage must land on gallery pre-filtered. Without this, the navigation feels disconnected. Every portfolio site with category nav does this. | Medium | URL parameter passing + filter state initialisation on page load. |
| **Anchor links (Our Process / Our Team)** | Long-form pages without anchor nav feel broken. Users expect in-page navigation on about/studio pages. | Low | Smooth scroll to ID targets. |
| **Mobile navigation with sub-categories** | Mobile users are 50%+ of traffic. They need the same filtering capability as desktop users, adapted for touch. | Medium | Tap-to-reveal sub-categories matching desktop structure. |

### Interaction Feedback

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Colour-bleed button states** | Buttons without hover/active feedback feel dead. The colour-bleed effect is the Studio Peake signature interaction -- it replaces generic hover darkening. | Medium | Soft colour expansion on hover (desktop) / tap (mobile). Used on buttons AND mobile menu open. |
| **Button hover keyline animation** | "Read More" / "Learn More" buttons need clear hover indication. The keyline draw is the site's interaction language. Without it, CTAs feel like a different site. | Medium | Keyline animates across button on hover. Must feel connected to the global keyline system. |
| **Project card hover state** | Full-bleed project cards without hover feedback feel static and unclickable. Gradient strengthening + gentle zoom is the standard luxury pattern (ref: studioashby.com/projects/). | Medium | Gradient darkens + image scale(1.03-1.05) on hover. On mobile: persistent gradient (no hover). |
| **Close icon rotation** | Small touch, but expected on any site with modal/overlay UI. A static X icon feels unfinished when everything else animates. | Low | CSS rotate on hover/tap, return on leave. |

### Content Display

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Featured projects carousel** | Full-bleed project showcase is the centrepiece of every interior design portfolio. Without it, the homepage has no hero content flow. | Medium | Drag + arrow navigation. Smooth transitions. Full-bleed slides. |
| **Product image carousel (swipe)** | Standard e-commerce pattern. Users expect to swipe through product images. | Low | Horizontal swipe on product pages. Prestige likely has a base to extend. |
| **Mobile carousel swipe gestures** | Touch users expect swipe. Arrows-only on mobile is a UX failure. | Low-Med | Horizontal swipe gesture handler for all carousels. |
| **Expandable info panel / accordion** | Project and product detail needs progressive disclosure. andtradition.com reference. No-reflow reveal is critical -- the page must not jump. | Medium | Arrow rotates on open. Content reveals without reflowing surrounding layout. |
| **Subscribe pop-up** | Email capture is a business requirement. Every luxury brand has a newsletter signup. The pattern (delay OR scroll trigger + footer link trigger) is standard. | Medium | 10s delay OR 30% scroll on Workshop. Footer link trigger. Centred overlay. |
| **Contact form with validation** | A contact page without proper form behaviour (placeholder clearing, error states, radio buttons) feels broken. | Low-Med | Standard form patterns with brand-consistent styling. |

### Mobile Parity

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Hover-to-tap conversion (global)** | All desktop hover interactions must have mobile tap equivalents. This is a design system rule, not a single feature. | Low | Applied per-component during implementation. |
| **Persistent gradient on mobile project cards** | Since hover is unavailable, mobile cards need the gradient overlay permanently applied. Without it, text on images is illegible on mobile. | Low | CSS media query or class-based approach. |
| **Mobile menu colour-bleed animation** | The menu open transition is a key brand moment on mobile. A plain slide-down feels generic. | Medium | Colour-bleed animates downward from top. Reuses the colour-bleed system from buttons. |

---

## Differentiators

Features that set Studio Peake apart from typical interior design sites. Not expected by users, but they create the "this site feels special" reaction.

### Signature Animations

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Keyline draw-on animation (global)** | The single most distinctive visual element. SVG stroke paths that progressively reveal create an "architectural drawing" metaphor perfectly suited to an interior design studio. No competitor does this at a system level. | High | SVG stroke-dasharray/dashoffset animation triggered by scroll (IntersectionObserver or existing `inView`). Must work on decorative lines, buttons, and Press page. Global system = high complexity but high payoff. |
| **Button click keyline draw (page transition)** | Animation during page transition provides visual continuity that most sites lack. The brief keyline draw bridges the gap between click and new page load. | Medium | Must be fast enough to complete before navigation. Ties into the keyline system. |
| **Hero logo fade-in with choreographed timing** | Beyond the basic hero load, the precise choreography (image first, then logo with specific timing) creates a memorable first-visit experience. | Low | The sequencing is the differentiator, not the fade itself. |
| **Dual-image crossfade on hover** | Two stacked images in a fixed frame with crossfade is an elegant way to show before/after, styled/unstyled, or alternate angles. More sophisticated than a simple image swap. | Medium | Two `<img>` elements with opacity transition. Fixed frame prevents layout shift. Used on homepage + workshop. |

### Interactive Product Experience

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Product image interactive hotspot tags** | Pulsing dots on product images that expand to reveal info is a genuinely engaging feature. It turns static product photography into an explorable experience. Few Shopify stores do this well. | High | Pulsing animation (CSS keyframes), click-to-expand with product info, positioned via Shopify admin (metafields or block settings). The admin configurability is the hard part. |
| **Room scheme auto-rotation** | 2-second fade cycle between room images creates ambient motion that feels alive without being distracting. Subtle but effective for showing scheme variations. | Low-Med | `setInterval` + CSS opacity transitions. Must pause on interaction or when out of viewport. |
| **Two-column independent scroll** | Sticky right panel with scrolling left gallery is a premium layout pattern. Creates an immersive project viewing experience that separates content from context. | High | CSS `position: sticky` with scroll syncing. Edge cases around mobile fallback, varying content heights, and scroll-end behaviour. |

### Content Interaction

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **About section text toggle with image update** | Filter-style content switching where both text and image update simultaneously creates a dynamic storytelling experience without page navigation. | Medium | Tab/filter UI that swaps text block + image. Animation on transition. |
| **Per-instance colour assignment** | Allowing each component instance to have its own brand colour creates visual variety across pages while maintaining design consistency. Most themes only offer global colours. | Medium | Block-level colour setting in Shopify admin. CSS custom property override per block. |
| **Journal notes carousel (adaptive)** | Arrow-navigated on desktop, vertical stack on mobile. The adaptive behaviour shows attention to how content is consumed on each device. | Medium | Responsive component that switches between carousel and stack layouts. |
| **Blog page modular template** | Block-based composition matching project pages means the journal feels intentional, not like a stock blog template bolted on. | Medium | Repeatable content blocks in Shopify section architecture. |

### Brand Details

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Careers collapsible block** | Toggle between hiring/not-hiring states with repeatable job specs shows operational polish. Most studios just have a static paragraph. | Medium | Toggle state + repeatable/duplicatable blocks in Shopify admin. |
| **Press & Accolades link with keyline animation** | The keyline animation on press links ties the decorative system into functional navigation. Small detail, big impression. | Low | Reuses keyline draw-on system. |
| **Navigation split option** | "The Workshop" right-aligned while portfolio is centred creates visual hierarchy that distinguishes the shop from the studio. Subtle but effective information architecture. | Low-Med | CSS flexbox/grid layout adjustment. Configurable via theme settings. |
| **Project video section (scroll-triggered)** | Looping video that auto-plays on scroll-in (ref: audocph.com) adds cinematic quality. The option to replace with image or hide entirely gives the client flexibility. | Medium | IntersectionObserver for auto-play. Shopify admin toggle for video/image/hidden states. |
| **Tearsheet PDF auto-open** | One-click PDF access for product tearsheets is a luxury trade-oriented feature. Interior designers and specifiers expect this workflow. | Low | Simple link handler. The value is in having the feature, not its complexity. |

---

## Anti-Features

Features to explicitly NOT build. These are patterns that feel tempting but would hurt the Studio Peake experience.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Parallax scrolling** | Feels dated (2015-era). Causes motion sickness issues. Luxury sites have moved to simpler scroll-triggered reveals. Inconsistent performance on mobile. | Use the keyline draw-on and gradient transitions as scroll-triggered elements instead. These are more distinctive and less nauseating. |
| **Page transition animations (full SPA-style)** | Shopify is multi-page by nature. Fighting this with complex page transitions (AJAX navigation, barba.js) introduces fragility, breaks Shopify analytics, and adds massive complexity for marginal benefit. | The button click keyline draw during navigation is sufficient visual continuity. Let pages load naturally. |
| **Cursor follower / custom cursor** | Trendy but distracting. Interferes with accessibility. Not aligned with Studio Peake's refined aesthetic. Adds unnecessary JS overhead. | The hover states (colour-bleed, keyline, crossfade) provide sufficient interaction feedback. |
| **Scroll-hijacking / smooth scroll libraries** | Taking control of the user's scroll feels intrusive. Breaks native scroll behaviour, accessibility tools, and mobile performance. | Native CSS `scroll-behavior: smooth` for anchor links only. Let the browser handle scroll everywhere else. |
| **Heavy animation libraries (GSAP, Framer Motion)** | The project has no build tooling. Adding large animation libraries to a Shopify theme served directly increases load time and adds a dependency that conflicts with the "extend Prestige" approach. | Use CSS animations + the existing `vendor.min.js` utilities (`inView`, `animate`). Only the SVG keyline draw needs JS, and that is achievable with vanilla IntersectionObserver + stroke-dasharray. |
| **Infinite scroll on gallery** | Feels cheap and makes it impossible for users to reach the footer. Contradicts the curated, intentional feel of a luxury portfolio. | Paginated or "load more" if the gallery grows large. For the current project count, show all filtered results. |
| **Auto-playing audio/sound effects** | Never appropriate. Universally disliked. | None needed. The video section handles its own audio (muted autoplay). |
| **Cookie consent pop-up stacking with subscribe pop-up** | Two overlays competing for attention is hostile UX. | Ensure cookie consent (if needed) and subscribe pop-up never appear simultaneously. Subscribe pop-up should check for active overlays before triggering. |
| **Complex carousel libraries (Slick, Swiper full bundle)** | Heavyweight dependencies for what are fundamentally simple slide/swipe interactions. Prestige likely has carousel primitives. | Build on Prestige's existing carousel patterns or use lightweight CSS scroll-snap + minimal JS for touch handling. |
| **Skeleton loading screens / shimmer effects** | Feels like a web app, not a luxury design studio. These patterns belong on dashboards and e-commerce marketplaces, not curated portfolios. | Let images load with the browser's natural behaviour. The hero load sequence provides the only choreographed loading moment needed. |

---

## Feature Dependencies

These dependencies determine build order. Features higher in the chain must be built first.

```
Gradient Overlays
  --> Project Card Hover State (needs gradient as base)
  --> Mobile Persistent Gradient (needs gradient system)
  --> Hero Load Sequence (needs gradient for text legibility)
  --> Subscribe Pop-up Overlay (shares overlay pattern)

Keyline Draw-On System (SVG animation engine)
  --> Button Hover Keyline
  --> Button Click Keyline Draw
  --> Press & Accolades Link Animation
  (All three consume the same animation utility)

Colour-Bleed System
  --> Button States (hover/tap)
  --> Mobile Menu Open Animation
  --> Mobile Button Active State
  (Same animation primitive, different triggers)

Portfolio Dropdown + Gallery Filter Bar
  --> Cross-Page Category Filtering (needs filter system working first)
  --> Mobile Navigation Filter (mobile adaptation of desktop filter)

Responsive Image Containers
  --> Dual-Image Crossfade (needs fixed-frame container)
  --> Room Scheme Auto-Rotation (needs consistent image sizing)
  --> Product Image Carousel (needs container system)
  --> Two-Column Independent Scroll (needs predictable image heights)
  --> Adaptive Image Containers Exception Mode (extends base containers)

Per-Instance Colour Assignment
  --> Emblem Overlay (uses per-instance colour)
  (Colour system must exist before components consume it)

Expandable Info Panel / Accordion
  --> Careers Collapsible Block (reuses accordion pattern)
  --> About Section Text Toggle (similar progressive disclosure)

Featured Projects Carousel
  --> Journal Notes Carousel (same carousel engine, different content)
  --> Product Image Carousel (same swipe/drag mechanics)
  --> Mobile Carousel Swipe (touch layer for all carousels)
```

---

## MVP Recommendation

Prioritise in this order to create maximum visual impact with minimum risk:

### Phase 1: Visual Foundation (unblocks everything)
1. **Gradient overlays** -- pure CSS, zero risk, unblocks project cards, hero, and mobile
2. **Responsive image containers** -- foundational; every image-based feature depends on this
3. **Hero load sequence** -- first impression; low complexity
4. **Emblem overlay** -- brand presence on product pages; low complexity

### Phase 2: Interaction System (the "feel")
5. **Colour-bleed button states** -- defines the interaction language
6. **Keyline draw-on system** -- the signature animation; high effort but high differentiation
7. **Button hover/click keyline** -- consumes the keyline system
8. **Close icon rotation** -- quick win

### Phase 3: Navigation & Filtering (the "find")
9. **Portfolio dropdown with active state**
10. **Gallery filter bar**
11. **Cross-page category filtering**
12. **Mobile navigation filter**
13. **Workshop dropdown**
14. **Anchor links**

### Phase 4: Carousels & Galleries (the "show")
15. **Featured projects carousel**
16. **Project card hover state** (consumes gradient system)
17. **Dual-image crossfade**
18. **Product image carousel**
19. **Journal notes carousel**
20. **Mobile carousel swipe**

### Phase 5: Layout & Content (the "depth")
21. **Two-column independent scroll**
22. **Expandable info panel / accordion**
23. **Product image interactive hotspot tags**
24. **Room scheme auto-rotation**
25. **About section text toggle**

### Phase 6: Pages & Polish (the "complete")
26. **Subscribe pop-up**
27. **Contact form**
28. **Careers collapsible block**
29. **Blog page modular template**
30. **Project video section**
31. **Tearsheet PDF auto-open**
32. **Per-instance colour assignment**
33. **Navigation split option**
34. **Press & Accolades keyline link**
35. **Mobile menu colour-bleed animation**

**Defer:** Nothing should be deferred -- the client has specified all 35 features. But if scope pressure arises, the differentiators (hotspot tags, two-column scroll, room scheme auto-rotation) can slip without the site feeling incomplete. The table stakes features are non-negotiable.

---

## Sources

- Figma comments document (`figma-comments.md`) -- primary source for all feature specifications and design intent
- `PROJECT.md` -- project constraints, tech stack, and scope boundaries
- `custom-code-tasks.md` -- complete task inventory
- Reference sites cited in Figma: studioashby.com, normcph.com, andtradition.com, audocph.com, studiogorman.com (knowledge from training data, not live-verified -- MEDIUM confidence)
- Luxury interior design web patterns from training data (studioashby.com project hover patterns, normcph.com dropdown filtering, andtradition.com accordion behaviour are well-documented patterns in the luxury design web space)

**Confidence note:** Web search and fetch tools were unavailable during this research session. All reference site analysis is based on training data knowledge of these sites (up to early 2025). The sites may have updated since then, but the core patterns (gradient overlays, scroll-triggered nav, project card hover states, dropdown filtering) are stable, long-standing luxury web conventions unlikely to have changed.
