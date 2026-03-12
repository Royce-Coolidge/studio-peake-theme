# Requirements: Studio Peake Custom Theme Build

**Defined:** 2026-03-12
**Core Value:** The theme must feel unmistakably Studio Peake through polished interactions that the client can manage entirely through Shopify admin.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Visual Foundation

- [ ] **VISF-01**: Image sections with overlaid text display CSS-based gradient overlays (top and bottom) for text legibility, applied in the layout layer (not baked into images)
- [ ] **VISF-02**: Image containers enforce a defined aspect ratio with configurable focal-point cropping, scaling fluidly across breakpoints without fixed heights
- [ ] **VISF-03**: Specific components adapt layout when image proportions differ (e.g. square vs landscape), reshuffling text alignment and spacing while maintaining balance
- [ ] **VISF-04**: Homepage hero image loads first, followed by a smooth fade-in of the logo with intentional timing delay
- [ ] **VISF-05**: Product pages display the Studio Peake emblem overlaying images in clotted cream brand colour, with matching nav treatment

### Interaction System

- [ ] **INTR-01**: Buttons display a colour-bleed effect — a subtle colour that softly expands into view on hover (desktop) and tap (mobile)
- [ ] **INTR-02**: "Read More" / "Learn More" buttons display a keyline that animates across the button on hover
- [ ] **INTR-03**: Buttons trigger a brief keyline drawing animation on click during page transition for visual continuity
- [ ] **INTR-04**: Decorative keylines throughout the site animate into view as if being drawn on — SVG stroke reveals progressively along its path on scroll
- [ ] **INTR-05**: Project gallery cards display centre-aligned copy over a soft gradient, with gradient strengthening and gentle image zoom on hover (ref: studioashby.com/projects/)
- [ ] **INTR-06**: On mobile, project gallery cards display persistent gradient overlay (desktop hover state as default)
- [ ] **INTR-07**: Close icon (X) gently rotates on hover (desktop) or tap (mobile) and returns to original position on leave
- [ ] **INTR-08**: Two images stacked in the same fixed frame crossfade on hover — second image fades in while first fades out (homepage + workshop)

### Navigation & Filtering

- [ ] **NAVF-01**: Portfolio section uses dropdown navigation where the active page displays at 60% opacity and clicking filters the gallery to that category
- [ ] **NAVF-02**: Workshop section uses the same dropdown navigation pattern with active category at 60% opacity
- [ ] **NAVF-03**: Gallery filter bar displays with filled-circle indicators for selected state, defaulting to "All Projects" filled
- [ ] **NAVF-04**: Clicking a portfolio category on the homepage navigates to the gallery page with results pre-filtered to that category
- [ ] **NAVF-05**: Mobile filter reveals sub-categories on tap, matching the desktop category structure
- [ ] **NAVF-06**: "Our Process" and "Our Team" links smooth-scroll to the corresponding section on the page
- [ ] **NAVF-07**: Navigation supports a split layout option with all items centralised except "The Workshop" right-aligned

### Carousel & Gallery

- [ ] **CARG-01**: Featured projects carousel displays full-bleed slides with smooth transitions, navigable via drag and arrow controls
- [ ] **CARG-02**: Product image carousel supports horizontal swipe gesture navigation
- [ ] **CARG-03**: All carousels support horizontal swipe gesture navigation on mobile devices
- [ ] **CARG-04**: Journal notes carousel navigates via arrows on desktop with smooth transitions, and stacks vertically on mobile
- [ ] **CARG-05**: Room scheme section auto-rotates between images with a fade transition every 2 seconds

### Layout & Content

- [ ] **LAYC-01**: Project detail page uses a two-column layout where the left image gallery scrolls normally and the right content panel is sticky or scrolls independently
- [ ] **LAYC-02**: Expandable info panels reveal additional content on arrow click without reflowing surrounding layout, with arrow rotating to indicate open state
- [ ] **LAYC-03**: Product images display interactive tags (hotspot dots) that pulse to draw attention and expand to reveal product information on click
- [ ] **LAYC-04**: About section filter/tabs reveal different text blocks while simultaneously updating the accompanying image
- [ ] **LAYC-05**: Components support per-instance colour assignment, allowing block colour to be set specifically per product or section via Shopify admin
- [ ] **LAYC-06**: Blog page uses the same modular, block-based template approach as project pages with repeatable content-type blocks

### Pages & Sections

- [ ] **PAGE-01**: Subscribe pop-up appears after 10-second delay or 30% page scroll on Workshop page, and when clicking Subscribe in the footer; displays centred on screen
- [ ] **PAGE-02**: Contact form clears placeholder text on input, highlights affected fields on validation errors, and uses filled-circle radio buttons for selection
- [ ] **PAGE-03**: Careers section functions as a collapsible block toggling between hiring and not-hiring states, with repeatable/duplicatable job specification blocks
- [ ] **PAGE-04**: Project video section plays looping video that auto-starts when scrolled into view, with option to replace with full-bleed image or hide entirely
- [ ] **PAGE-05**: Clicking "Tearsheet" on product pages automatically opens the product PDF
- [ ] **PAGE-06**: Press & Accolades links use the keyline draw-on animation
- [ ] **PAGE-07**: Mobile menu open triggers a colour-bleed transition animating downward from the top of the screen

## v2 Requirements

None — all 35 features scoped for v1.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Full theme rebuild | Extending Prestige, not replacing it |
| Checkout customisation | Using Shopify default checkout |
| Multi-language content | English only for v1 |
| Custom app integrations | Standard Shopify apps only |
| Parallax scrolling | Dated pattern, causes motion sickness, inconsistent mobile performance |
| SPA-style page transitions | Shopify is multi-page; fighting this breaks analytics and adds fragility |
| Custom cursor / cursor follower | Distracting, interferes with accessibility |
| Scroll-hijacking | Intrusive, breaks native scroll and accessibility tools |
| Heavy animation libraries (GSAP) | No build tooling; Motion One already bundled in vendor.min.js |
| Infinite scroll on gallery | Prevents reaching footer, contradicts curated luxury feel |
| Skeleton loading / shimmer effects | Feels like a web app, not a luxury studio |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| VISF-01 | Phase 1 | Pending |
| VISF-02 | Phase 1 | Pending |
| VISF-03 | Phase 1 | Pending |
| VISF-04 | Phase 1 | Pending |
| VISF-05 | Phase 1 | Pending |
| INTR-01 | TBD | Pending |
| INTR-02 | TBD | Pending |
| INTR-03 | TBD | Pending |
| INTR-04 | TBD | Pending |
| INTR-05 | TBD | Pending |
| INTR-06 | TBD | Pending |
| INTR-07 | TBD | Pending |
| INTR-08 | TBD | Pending |
| NAVF-01 | TBD | Pending |
| NAVF-02 | TBD | Pending |
| NAVF-03 | TBD | Pending |
| NAVF-04 | TBD | Pending |
| NAVF-05 | TBD | Pending |
| NAVF-06 | TBD | Pending |
| NAVF-07 | TBD | Pending |
| CARG-01 | TBD | Pending |
| CARG-02 | TBD | Pending |
| CARG-03 | TBD | Pending |
| CARG-04 | TBD | Pending |
| CARG-05 | TBD | Pending |
| LAYC-01 | TBD | Pending |
| LAYC-02 | TBD | Pending |
| LAYC-03 | TBD | Pending |
| LAYC-04 | TBD | Pending |
| LAYC-05 | TBD | Pending |
| LAYC-06 | TBD | Pending |
| PAGE-01 | TBD | Pending |
| PAGE-02 | TBD | Pending |
| PAGE-03 | TBD | Pending |
| PAGE-04 | TBD | Pending |
| PAGE-05 | TBD | Pending |
| PAGE-06 | TBD | Pending |
| PAGE-07 | TBD | Pending |

**Coverage:**
- v1 requirements: 38 total
- Mapped to phases: 5
- Unmapped: 33 (TBD — assigned during roadmap creation)

---
*Requirements defined: 2026-03-12*
*Last updated: 2026-03-12 after initial definition*
