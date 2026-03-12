# Roadmap: Studio Peake Custom Theme

## Overview

This roadmap transforms Prestige v10.7.0 into a distinctive Studio Peake brand experience across 9 phases. The structure follows dependency chains: visual foundations and interaction patterns are established first because they are consumed by nearly every subsequent feature. Navigation, carousels, layouts, and page-level features follow once the core animation language exists. All custom code lives in dedicated files (studio-peake.css, studio-peake.js) -- Prestige core files are never modified.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Infrastructure + Visual Foundation** - CSS/JS file infrastructure, gradient overlays, responsive image containers
- [ ] **Phase 2: Hero + Brand Identity** - Hero load sequence, emblem overlay on product pages
- [ ] **Phase 3: Colour-Bleed Interactions** - Colour-bleed button states, close icon rotation animation
- [ ] **Phase 4: Keyline Animation System** - SVG stroke draw-on reveals, button keyline hover/click, press links
- [ ] **Phase 5: Project Cards + Image Interactions** - Project card hover states, mobile card treatment, dual-image crossfade
- [ ] **Phase 6: Navigation + Filtering** - Portfolio/workshop dropdowns, gallery filter bar, cross-page filtering, mobile filter, anchor links, nav split
- [ ] **Phase 7: Carousels** - Featured projects carousel, product image carousel, journal notes carousel, room scheme auto-rotation, mobile swipe
- [ ] **Phase 8: Advanced Layouts** - Two-column scroll, expandable panels, hotspot tags, about toggle, per-instance colour, blog template
- [ ] **Phase 9: Pages + Sections** - Subscribe popup, contact form, careers block, project video, tearsheet PDF, mobile menu animation

## Phase Details

### Phase 1: Infrastructure + Visual Foundation
**Goal**: Custom CSS/JS infrastructure is in place and image sections display polished gradient overlays with responsive focal-point cropping
**Depends on**: Nothing (first phase)
**Requirements**: VISF-01, VISF-02, VISF-03
**Success Criteria** (what must be TRUE):
  1. studio-peake.css and studio-peake.js load after Prestige core files on every page without errors
  2. Image sections with overlaid text show gradient overlays that make text legible across light and dark images
  3. Image containers maintain aspect ratio and crop from the configured focal point across mobile, tablet, and desktop
  4. Components with differing image proportions (square vs landscape) adapt their text layout without breaking visual balance
**Plans**: TBD

Plans:
- [ ] 01-01: TBD
- [ ] 01-02: TBD

### Phase 2: Hero + Brand Identity
**Goal**: The homepage makes an immediate brand impression through a choreographed hero sequence, and product pages carry Studio Peake identity
**Depends on**: Phase 1
**Requirements**: VISF-04, VISF-05
**Success Criteria** (what must be TRUE):
  1. Homepage hero loads the background image first, then the logo fades in with a visible timing delay
  2. Product pages display the Studio Peake emblem overlaying product images in clotted cream brand colour
  3. Navigation on product pages reflects the emblem colour treatment
**Plans**: TBD

Plans:
- [ ] 02-01: TBD

### Phase 3: Colour-Bleed Interactions
**Goal**: Buttons and close icons respond to user interaction with the signature Studio Peake colour-bleed effect
**Depends on**: Phase 1
**Requirements**: INTR-01, INTR-07
**Success Criteria** (what must be TRUE):
  1. Buttons display a soft colour expansion effect on hover (desktop) that feels organic, not mechanical
  2. The same colour-bleed effect triggers on tap for mobile devices
  3. Close icons (X) rotate smoothly on hover/tap and return to original position on leave
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

### Phase 4: Keyline Animation System
**Goal**: Decorative keylines throughout the site animate as drawn-on strokes, and buttons use keyline animations for hover and click states
**Depends on**: Phase 1
**Requirements**: INTR-02, INTR-03, INTR-04, PAGE-06
**Success Criteria** (what must be TRUE):
  1. SVG decorative keylines progressively draw on screen as the user scrolls them into view
  2. "Read More" / "Learn More" buttons display a keyline that animates across the button on hover
  3. Buttons trigger a brief keyline drawing animation on click during page transitions
  4. Press and Accolades links use the same keyline draw-on animation pattern
  5. Keyline animations render consistently across Chrome, Firefox, Safari, and mobile browsers
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

### Phase 5: Project Cards + Image Interactions
**Goal**: Project gallery cards and image components deliver the polished hover interactions that distinguish Studio Peake from stock themes
**Depends on**: Phase 1 (gradient overlays), Phase 3 (colour-bleed pattern)
**Requirements**: INTR-05, INTR-06, INTR-08
**Success Criteria** (what must be TRUE):
  1. Project gallery cards display centre-aligned copy over a soft gradient, with gradient strengthening and gentle image zoom on hover
  2. On mobile, project gallery cards show the gradient overlay persistently (the hover state becomes the default state)
  3. Two stacked images in a fixed frame crossfade on hover -- second image fades in while first fades out
**Plans**: TBD

Plans:
- [ ] 05-01: TBD

### Phase 6: Navigation + Filtering
**Goal**: Users can browse and filter project portfolios across pages, with category state preserved during navigation
**Depends on**: Phase 1, Phase 4 (keyline animations for nav elements)
**Requirements**: NAVF-01, NAVF-02, NAVF-03, NAVF-04, NAVF-05, NAVF-06, NAVF-07
**Success Criteria** (what must be TRUE):
  1. Portfolio section dropdown shows categories with the active page at 60% opacity; clicking filters the gallery
  2. Workshop section uses the same dropdown pattern with active state styling
  3. Gallery filter bar displays filled-circle indicators for the selected category, defaulting to "All Projects"
  4. Clicking a portfolio category on the homepage navigates to the gallery with results pre-filtered to that category
  5. Mobile filter reveals sub-categories on tap matching the desktop category structure
**Plans**: TBD

Plans:
- [ ] 06-01: TBD
- [ ] 06-02: TBD

### Phase 7: Carousels
**Goal**: All carousel and auto-rotation components work with smooth transitions, supporting both pointer and touch input
**Depends on**: Phase 1 (responsive containers), Phase 5 (project card hover states for carousel slides)
**Requirements**: CARG-01, CARG-02, CARG-03, CARG-04, CARG-05
**Success Criteria** (what must be TRUE):
  1. Featured projects carousel displays full-bleed slides navigable via drag and arrow controls with smooth transitions
  2. Product image carousel supports horizontal swipe gesture navigation on mobile
  3. Journal notes carousel navigates via arrows on desktop and stacks vertically on mobile
  4. Room scheme section auto-rotates between images with a 2-second fade transition cycle
  5. All carousels support horizontal swipe on mobile without interfering with vertical page scrolling
**Plans**: TBD

Plans:
- [ ] 07-01: TBD
- [ ] 07-02: TBD

### Phase 8: Advanced Layouts
**Goal**: Project detail pages, product pages, and content sections use sophisticated layout patterns that maintain visual polish across breakpoints
**Depends on**: Phase 1 (responsive containers), Phase 3 (colour-bleed for interactive elements)
**Requirements**: LAYC-01, LAYC-02, LAYC-03, LAYC-04, LAYC-05, LAYC-06
**Success Criteria** (what must be TRUE):
  1. Project detail page left gallery scrolls while the right content panel stays sticky, creating an independent scroll experience
  2. Expandable info panels reveal content on click without reflowing surrounding layout, with arrow rotation indicating state
  3. Product images display pulsing hotspot dots that expand to show product information on click
  4. About section tabs switch text blocks while simultaneously updating the accompanying image
  5. Components accept per-instance colour assignment via Shopify admin settings
**Plans**: TBD

Plans:
- [ ] 08-01: TBD
- [ ] 08-02: TBD

### Phase 9: Pages + Sections
**Goal**: All remaining page-level features work correctly and are fully manageable through Shopify admin
**Depends on**: Phase 1, Phase 3 (colour-bleed for mobile menu), Phase 4 (keyline for press links -- already done)
**Requirements**: PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-07
**Success Criteria** (what must be TRUE):
  1. Subscribe popup appears after 10s delay or 30% scroll on Workshop page, and via footer Subscribe link
  2. Contact form clears placeholders on focus, highlights fields on validation errors, and uses filled-circle radio buttons
  3. Careers section toggles between hiring/not-hiring states with repeatable job specification blocks
  4. Project video loops and auto-plays when scrolled into view, with option to replace with image or hide
  5. Clicking Tearsheet on product pages opens the product PDF automatically
**Plans**: TBD

Plans:
- [ ] 09-01: TBD
- [ ] 09-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Infrastructure + Visual Foundation | 0/TBD | Not started | - |
| 2. Hero + Brand Identity | 0/TBD | Not started | - |
| 3. Colour-Bleed Interactions | 0/TBD | Not started | - |
| 4. Keyline Animation System | 0/TBD | Not started | - |
| 5. Project Cards + Image Interactions | 0/TBD | Not started | - |
| 6. Navigation + Filtering | 0/TBD | Not started | - |
| 7. Carousels | 0/TBD | Not started | - |
| 8. Advanced Layouts | 0/TBD | Not started | - |
| 9. Pages + Sections | 0/TBD | Not started | - |
