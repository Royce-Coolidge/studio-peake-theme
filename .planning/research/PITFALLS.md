# Domain Pitfalls

**Domain:** Shopify premium theme customization (Prestige v10.7.0)
**Researched:** 2026-03-12
**Confidence:** HIGH (based on codebase analysis + established Shopify development patterns)

## Critical Pitfalls

Mistakes that cause rewrites, broken merchant experiences, or major performance regressions.

### Pitfall 1: CSS Specificity Wars with the Base Theme

**What goes wrong:** Custom styles silently lose to Prestige's existing selectors, or developers reach for `!important` to force overrides. Prestige already uses 24 `!important` declarations in theme.css. Adding more creates an escalation spiral where every future change requires `!important`, making the stylesheet unmaintainable.

**Why it happens:** Prestige's 8,080-line theme.css uses deeply nested selectors, component-scoped classes, and utility classes. Custom CSS added at the end of the cascade may not win specificity battles, especially for states like `:hover`, `:focus`, and media-query-scoped rules.

**Consequences:**
- Styles that work in one context break in another (e.g., product card in collection vs. featured section)
- `!important` chains that cannot be overridden by Shopify's colour scheme system (which uses CSS custom properties)
- Theme editor preview shows different results than storefront

**Prevention:**
- Establish a custom CSS file (e.g., `studio-peake.css`) loaded AFTER theme.css. Separation prevents merge conflicts on theme updates.
- Use Prestige's own naming conventions and selector patterns rather than inventing new ones. Match or extend existing selectors rather than fighting them.
- Scope all custom styles to a custom attribute or class (e.g., `[data-sp-section]` or `.sp-*` prefix) to create a clean namespace.
- Never use `!important` for layout or visual styling. Reserve it only for JavaScript-toggled state classes where there is no alternative.
- When overriding a Prestige style, document the original selector and line number in a comment so future developers can trace conflicts.

**Detection:** Styles that require `!important` to work. Styles that break when a section is moved to a different page template. Visual differences between theme editor and storefront.

**Phase relevance:** Every phase. Establish the CSS strategy and naming convention in Phase 1 before any custom styling begins.

---

### Pitfall 2: Layout Thrashing from Animation JavaScript

**What goes wrong:** Custom scroll-triggered animations and interactive components read layout properties (`getBoundingClientRect`, `offsetHeight`, `scrollTop`) and then immediately write to the DOM (changing classes, styles, dimensions), causing the browser to recalculate layout on every frame. The existing theme.js already makes 34 layout-reading calls (`getBoundingClientRect`, `offsetWidth`, `offsetHeight`, etc.), and adding more without batching creates compounding forced reflows.

**Why it happens:** The project requires scroll-linked animations (keyline draw-on, parallax, sticky panels, scroll-triggered video), hover state transitions, and interactive tags -- all of which need layout information. Naive implementations interleave reads and writes.

**Consequences:**
- Janky scrolling on mobile devices (especially older iPhones and Android mid-range)
- Dropped frames during the hero load sequence and carousel interactions
- CPU spikes that drain battery and trigger thermal throttling on mobile
- Lighthouse performance score plummets below 50

**Prevention:**
- Batch all DOM reads before DOM writes. Use `requestAnimationFrame` for write operations after reads are complete.
- Use the existing `vendor.min.js` `animate` and `inView` utilities (Motion One / motion library) which handle compositor-friendly animations. The theme already uses `animate18` and `timeline9` throughout -- follow this pattern.
- For scroll-linked effects, use CSS `scroll-timeline` or `animation-timeline: scroll()` where browser support allows (Safari 16.4+), with IntersectionObserver fallback. Avoid `scroll` event listeners.
- Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`. Only animate `transform` and `opacity` which run on the GPU compositor thread.
- For the two-column independent scroll feature, use `position: sticky` (CSS-only) rather than JavaScript scroll position tracking.
- Profile with Chrome DevTools Performance tab before and after adding each animation component.

**Detection:** Chrome DevTools shows purple "Layout" bars exceeding 10ms in the Performance timeline. `Forced reflow` warnings in the console. Frame rate drops below 30fps on mobile during scroll.

**Phase relevance:** Phase 1 (animation foundations). Set performance budget and compositor-only animation rule before building any animated components.

---

### Pitfall 3: Breaking Shopify Theme Editor Compatibility

**What goes wrong:** Custom JavaScript that initializes on `DOMContentLoaded` or page load does not re-initialize when the theme editor dynamically adds, removes, or reorders sections. The merchant drags a section in the editor and the custom animations/interactions simply stop working until a full page refresh.

**Why it happens:** Shopify's theme editor uses AJAX to swap section HTML without full page reloads. It dispatches `shopify:section:load`, `shopify:section:unload`, `shopify:section:select`, and `shopify:section:reorder` events. If custom code does not listen for these events, components break on editor interaction.

**Consequences:**
- Client (Sarah Peake) cannot rearrange or preview sections in the theme editor
- Support burden -- developer called for every content change
- Violates the core project requirement: "every custom feature must be configurable through Shopify admin without code changes"

**Prevention:**
- Use Web Components (`customElements.define`) for ALL custom interactive elements. Prestige already follows this pattern with 90+ custom elements. Web Components automatically initialize when inserted into the DOM via `connectedCallback` and clean up via `disconnectedCallback`, which aligns perfectly with the theme editor's dynamic HTML swapping.
- For any code that cannot be a Web Component, listen for `shopify:section:load` to reinitialize and `shopify:section:unload` to clean up.
- Always implement `disconnectedCallback` to remove event listeners, cancel animations, and clear intervals/timeouts. The existing theme has 98 `connectedCallback` calls but an unknown number of `disconnectedCallback` calls -- audit this ratio for any custom components.
- Test every custom section in the theme editor by adding, removing, reordering, and editing settings. This is not optional testing -- it is a core requirement.

**Detection:** Open theme editor, add a custom section, change a setting, drag it to a new position. If the animation/interaction does not work without a page reload, this pitfall has been hit.

**Phase relevance:** Every phase. Mandate Web Components from Phase 1. Include theme editor testing in every feature's definition of done.

---

### Pitfall 4: Theme Update Destruction

**What goes wrong:** Maestrooo releases a Prestige update (bug fixes, Shopify API changes, new features) and applying it overwrites all custom modifications to theme.js, theme.css, and Liquid section/snippet files. All custom work is lost or requires painful manual merging.

**Why it happens:** Shopify's theme update mechanism replaces files wholesale. There is no merge strategy. If custom code is added directly into theme.js or theme.css, it will be overwritten. If Liquid sections are modified in-place (e.g., editing `header.liquid` or `main-product.liquid`), those changes are lost.

**Consequences:**
- Hours or days of re-integration work after every theme update
- Risk of shipping a broken storefront if update is applied without developer review
- Subtle regressions where a previously-fixed interaction breaks silently

**Prevention:**
- NEVER modify `theme.js`, `theme.css`, or `vendor.min.js` directly. These are Prestige's files and will be overwritten.
- Create separate custom asset files: `studio-peake.css`, `studio-peake.js` (or multiple section-specific JS files). Load them via a custom snippet included in `theme.liquid`.
- For Liquid sections that need modification, prefer creating NEW section files (e.g., `sp-hero.liquid`, `sp-featured-projects.liquid`) rather than modifying existing Prestige sections. Use Prestige sections as reference but own the custom ones.
- When modifying existing Prestige sections is unavoidable (e.g., `header.liquid` for the custom nav), document every change with `<!-- SP CUSTOM START -->` / `<!-- SP CUSTOM END -->` comment markers so changes can be re-applied after updates.
- Keep a changelog of all Prestige files modified and what was changed.
- Pin the Prestige version (v10.7.0) and only update deliberately after testing.

**Detection:** `git diff` against the original Prestige v10.7.0 commit (3d1a0f9) shows the exact scope of modifications. If the diff touches core Prestige files extensively, update risk is high.

**Phase relevance:** Phase 1 (project setup). Establish the file separation strategy before writing any custom code. The header customization already committed (5c40ab1) should be audited against this principle.

---

### Pitfall 5: Mobile Touch Event Conflicts with Shopify and Prestige Handlers

**What goes wrong:** Custom touch handlers for swipe gestures (carousel swipe, mobile menu animation, drag interactions) conflict with Prestige's existing touch handling (23 touch/pointer event references in theme.js), Shopify's scroll restoration, and the browser's native scroll/zoom gestures. Double-tap zoom, pull-to-refresh, and swipe-back navigation break.

**Why it happens:** Multiple JavaScript listeners on `touchstart`, `touchmove`, `touchend` compete for the same gesture. Calling `preventDefault()` on touch events to implement custom swipe disables the browser's native scrolling. Passive event listener violations cause scroll jank.

**Consequences:**
- Users cannot scroll past a carousel section on mobile (touch events consumed)
- iOS Safari's swipe-back navigation breaks on pages with horizontal swipe components
- Double-tap zoom disabled inadvertently, creating accessibility issues
- 300ms tap delay reintroduced on older devices
- Scroll jank from non-passive touch listeners

**Prevention:**
- Use CSS `touch-action` property to declare gesture intent (e.g., `touch-action: pan-y` on horizontal carousels to allow vertical scroll but capture horizontal swipe).
- Register touch event listeners as `{ passive: true }` unless `preventDefault` is genuinely needed. If `preventDefault` is needed, use `{ passive: false }` explicitly and scope it tightly.
- Use Pointer Events API (`pointerdown`, `pointermove`, `pointerup`) instead of separate mouse/touch handlers. Pointer Events unify input handling.
- Never prevent vertical scrolling to capture horizontal gestures. Use a gesture threshold (e.g., 10px horizontal movement before locking to horizontal axis).
- Test on actual iOS Safari and Android Chrome, not just desktop emulation. Touch handling differs significantly between real devices and Chrome DevTools simulation.
- Delegate to Prestige's existing carousel components where possible rather than building parallel touch handling.

**Detection:** On a real mobile device, try scrolling vertically through a page with custom touch interactions. If scrolling sticks, stutters, or is hijacked, this pitfall has been hit. Test iOS Safari swipe-back from edges of the screen.

**Phase relevance:** Carousel and gallery phases, mobile navigation phase. Establish touch handling patterns early with the first carousel implementation.

---

### Pitfall 6: Accessibility Violations from Custom Animations and Interactions

**What goes wrong:** Custom animations ignore `prefers-reduced-motion`, interactive elements lack keyboard support and ARIA attributes, focus traps are missing from modals/popovers, and auto-rotating content (room scheme 2s fade cycle) causes seizure risks and WCAG failures.

**Why it happens:** Prestige has partial `prefers-reduced-motion` support (7 CSS references, 3 JS references), but custom code must independently respect this preference. Developers focus on visual polish and forget that 15-20% of users have some form of disability.

**Consequences:**
- WCAG 2.1 AA violations (increasingly a legal requirement for e-commerce)
- Users with vestibular disorders experience nausea from animations
- Keyboard-only users cannot interact with custom components
- Screen reader users encounter unlabelled interactive elements
- Auto-rotating content with no pause control fails WCAG 2.2.2

**Prevention:**
- Wrap ALL custom animations in `@media (prefers-reduced-motion: no-preference)` in CSS, and check `window.matchMedia('(prefers-reduced-motion: no-preference)').matches` in JS before starting animations. Follow Prestige's existing pattern.
- Every interactive custom element must support keyboard operation: Enter/Space for activation, Escape to dismiss, Tab for focus navigation, Arrow keys for lists/carousels.
- Auto-rotating content (room scheme carousel) MUST have a visible pause/play button. WCAG 2.2.2 requires users to be able to pause, stop, or hide auto-updating content.
- Use Prestige's existing ARIA patterns from `DialogElement`, `Popover`, `AccordionDisclosure` as templates for custom interactive components.
- Add `aria-live="polite"` regions for content that changes dynamically (filter results, accordion reveals).
- Product image interactive tags (pulsing hotspots) need meaningful `aria-label` text describing what the tag reveals.
- Run `axe-core` or Lighthouse accessibility audit after each phase delivery.

**Detection:** Unplug your mouse and navigate the page with keyboard only. Turn on VoiceOver (macOS) or NVDA (Windows) and try to use every custom component. Enable "Reduce motion" in OS settings and verify no animations play.

**Phase relevance:** Every phase. Bake accessibility into the component pattern from Phase 1. Do not defer it -- retrofitting is 3-5x more expensive than building it in.

## Moderate Pitfalls

### Pitfall 7: Liquid Rendering Performance with Complex Sections

**What goes wrong:** Custom Liquid sections with nested `for` loops, multiple `render` calls to snippets, and conditional logic chains cause server-side rendering to exceed Shopify's Liquid rendering budget (100ms target, 500ms hard warning). Page load times spike, especially on collection pages with many products.

**Why it happens:** Each `{% render %}` call has overhead. Nested loops over products/variants/metafields multiply render time. The existing `main-product.liquid` (1,807 lines) is already at the complexity ceiling.

**Prevention:**
- Keep new section Liquid files under 300 lines. Extract repeated markup into snippets.
- Avoid nested `for` loops over product data. If you need product variant data in a gallery, pass it as JSON via `{{ product.variants | json }}` and process client-side.
- Use `{% capture %}` to build strings in Liquid rather than concatenating in output.
- Profile with Shopify's `Shopify.designMode` and Theme Inspector Chrome extension.
- For the gallery filter bar, compute filter data in Liquid once and output as JSON; do filtering client-side with JavaScript.

**Detection:** Shopify Theme Inspector shows Liquid render times above 100ms. `x-shopify-server-timing` response header shows high render times.

**Phase relevance:** Layout/UI components phase, filtering/navigation phase. Keep filter logic client-side from the start.

---

### Pitfall 8: Memory Leaks from Undisposed Event Listeners and Intervals

**What goes wrong:** Custom components attach `scroll`, `resize`, `IntersectionObserver`, and `setInterval` handlers but do not clean them up when the component is removed from the DOM. Shopify's section rendering and AJAX navigation keep components in memory.

**Why it happens:** The existing codebase already has this concern (CONCERNS.md item 10: "setTimeout/setInterval calls without cleanup"). Adding more custom components with the same pattern compounds the problem.

**Consequences:**
- Memory usage grows continuously as users navigate between pages
- Stale event listeners fire on removed elements, causing errors
- Multiple intervals stack up (e.g., room scheme auto-rotation spawns a new interval every time the section is re-rendered)

**Prevention:**
- Every `connectedCallback` that adds a listener must have a corresponding `disconnectedCallback` that removes it.
- Store references to all listeners, observers, and intervals as instance properties.
- Use `AbortController` with `signal` option for `addEventListener` -- calling `controller.abort()` in `disconnectedCallback` removes all listeners in one call.
- For `IntersectionObserver`, call `observer.disconnect()` in `disconnectedCallback`.
- For `setInterval`, always store the ID and call `clearInterval` in `disconnectedCallback`.

**Detection:** Chrome DevTools Memory tab -- take heap snapshots before and after navigating through several pages. If "Detached HTMLElement" count grows, listeners are holding references.

**Phase relevance:** Every phase. Establish the `AbortController` cleanup pattern in the first custom Web Component as a template.

---

### Pitfall 9: SVG Stroke Animation Browser Inconsistencies

**What goes wrong:** The keyline draw-on animation (SVG `stroke-dasharray` / `stroke-dashoffset` technique) renders differently across browsers. Safari calculates path lengths differently than Chrome for complex paths. Firefox has sub-pixel rendering differences. The animation appears to "jump" or leave gaps.

**Why it happens:** SVG path length calculation is not perfectly standardized. `getTotalLength()` returns slightly different values across browsers. Complex bezier curves and path commands (`C`, `S`, `Q`) amplify the differences.

**Prevention:**
- Use `pathLength="1"` attribute on SVG paths to normalize the total length to 1 across all browsers. Then animate `stroke-dashoffset` from 1 to 0 instead of using `getTotalLength()`.
- Keep keyline SVG paths simple (prefer `L` line segments and simple curves over complex compound paths).
- Test in Safari, Chrome, and Firefox at multiple viewport sizes.
- Use CSS animations (`@keyframes`) for the stroke reveal rather than JavaScript where possible -- CSS animations are compositor-friendly.
- Provide a `prefers-reduced-motion` fallback that simply fades the keyline in rather than drawing it.

**Detection:** Compare the animation in Safari vs Chrome. Look for gaps in the stroke, visible jumps at animation start/end, or different animation speeds.

**Phase relevance:** Animation phase (keyline draw-on). Test cross-browser early with a prototype before building all keyline variants.

---

### Pitfall 10: Shopify Section Rendering Context Assumptions

**What goes wrong:** Custom Liquid sections assume they will always render in a specific context (e.g., homepage only) but Shopify allows merchants to add any section to any page template via the theme editor. A section designed for the homepage breaks when added to a product page or a custom page.

**Why it happens:** Shopify's Online Store 2.0 architecture makes all sections available everywhere. Developers hardcode assumptions about page context (e.g., `collection.products` being available, or `product` object existing).

**Prevention:**
- Always check for object existence before use: `{% if collection %}` before accessing `collection.products`.
- Use section settings for data sources rather than relying on page context. Let the merchant choose which collection to display.
- Test each custom section on at least 3 different page types (homepage, product page, custom page).
- Design sections to be self-contained -- they should work with only their own settings and blocks, not page-level objects.

**Detection:** Add the custom section to a blank custom page in the theme editor. If it errors or shows empty, it has context dependencies.

**Phase relevance:** Layout/UI components phase. Design sections as context-independent from the start.

---

### Pitfall 11: CSS Animation Paint Storms from Box Shadows and Filters

**What goes wrong:** The gradient overlay effects, colour-bleed button states, and hover zoom interactions use `box-shadow`, `filter: blur()`, or `backdrop-filter`, which trigger paint operations on every frame during animation. Combined with scroll-triggered effects, this creates "paint storms" where the browser repaints large areas continuously.

**Why it happens:** Unlike `transform` and `opacity` (which can be composited on the GPU), `box-shadow`, `filter`, `background-color`, and `border-radius` changes trigger the paint phase. Animating these properties at 60fps overwhelms the main thread.

**Prevention:**
- For gradient overlays, use `::before`/`::after` pseudo-elements with the gradient, and animate their `opacity` rather than animating the gradient itself.
- For colour-bleed button effects, use `transform: scale()` on a pseudo-element with the target colour, clipped with `overflow: hidden`. Scale + opacity are compositor-friendly.
- For hover zoom on project cards, use `transform: scale(1.05)` on the image, not `width`/`height` changes.
- Apply `will-change: transform` or `will-change: opacity` only to elements that will actually animate, and only just before the animation (not permanently -- permanent `will-change` wastes GPU memory).
- Avoid animating `box-shadow`. Instead, place the shadow on a pseudo-element and animate the pseudo-element's opacity.

**Detection:** Chrome DevTools -- enable "Paint flashing" in Rendering tab. Green flashes indicate paint operations. Large green areas during scroll or hover mean paint storms.

**Phase relevance:** Animation phase (gradient overlays, button states, hover effects). Establish compositor-only animation patterns first.

## Minor Pitfalls

### Pitfall 12: Z-Index Stacking Context Chaos

**What goes wrong:** Custom overlays, sticky headers, modals, popover tags, and gradient pseudo-elements create competing stacking contexts. The subscribe popup appears behind the header. Product hotspot popovers clip behind adjacent sections.

**Prevention:**
- Audit Prestige's existing z-index values before adding any. Document them in a z-index scale.
- Use a defined z-index scale with gaps: content (1-10), sticky elements (100-199), overlays (200-299), modals (300-399), notifications (400+).
- Remember that `transform`, `filter`, `will-change`, and `opacity < 1` all create new stacking contexts that reset z-index to their local scope.

**Phase relevance:** Layout/UI components phase, especially the subscribe popup and product image tags.

---

### Pitfall 13: Custom Font Loading Flash (FOUT/FOIT)

**What goes wrong:** The custom font file (`mynaruse_flare_regular.ttf`) causes a flash of unstyled text or invisible text during page load. The `custom-fonts.css` file is currently 0 bytes (empty), suggesting font loading strategy has not been implemented yet.

**Prevention:**
- Populate `custom-fonts.css` with `@font-face` declarations using `font-display: swap` to show fallback text immediately.
- Convert TTF to WOFF2 for 30-50% smaller file size. Serve WOFF2 as primary, TTF as fallback.
- Preload the primary font: `<link rel="preload" href="mynaruse_flare_regular.woff2" as="font" type="font/woff2" crossorigin>`.
- Set a CSS fallback font with similar metrics to minimize layout shift when the custom font loads.

**Phase relevance:** Phase 1 (design tokens/foundations). Font loading should be resolved before any typography-dependent layout work.

---

### Pitfall 14: Cross-Page Filtering State Loss

**What goes wrong:** The "homepage to gallery pre-filtered" feature requires passing filter state between pages. Using URL parameters works but creates stale bookmarks. Using `sessionStorage` works but fails when users open links in new tabs.

**Prevention:**
- Use URL query parameters (`?category=kitchens`) as the canonical filter state. This makes filtered views linkable and shareable.
- On the gallery page, read query parameters on load and apply filters client-side.
- Do not use `sessionStorage` or `localStorage` as the primary state mechanism -- they create invisible state that confuses users.
- Ensure the back button works correctly by using `replaceState` rather than `pushState` for filter changes within the gallery page.

**Phase relevance:** Navigation/filtering phase. Design the URL-based state pattern before implementing any filtering UI.

---

### Pitfall 15: Monolithic Custom JavaScript File

**What goes wrong:** Following Prestige's pattern of a single large `theme.js` (5,868 lines), developers create a single `studio-peake.js` that grows unmanageably. Since there is no build tooling, all custom JS loads on every page.

**Prevention:**
- Since there is no bundler, create separate JS files per feature area: `sp-animations.js`, `sp-carousel.js`, `sp-filters.js`, `sp-newsletter.js`.
- Load section-specific JS only in sections that need it using `{% javascript %}` tag or conditional `<script>` tags within section Liquid files.
- Keep each JS file focused on registering Web Components related to one feature area.
- Use native ES module `<script type="module">` for new code -- supported by all target browsers and enables lazy loading.

**Phase relevance:** Phase 1 (project setup). Establish the multi-file JS strategy before writing any custom JavaScript.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Animation foundations | Paint storms from non-compositor properties (#11) | Establish transform+opacity-only rule; create gradient overlay with pseudo-element pattern |
| Keyline SVG animations | Cross-browser path length differences (#9) | Use `pathLength="1"` attribute; test Safari early |
| Button interactions | CSS specificity conflicts with Prestige button styles (#1) | Audit existing `.button` selectors; use scoped `.sp-button` class |
| Two-column scroll layout | Layout thrashing from scroll position tracking (#2) | Use CSS `position: sticky` only; zero JS for the sticky behavior |
| Carousel/gallery | Mobile touch conflicts (#5) | Use CSS `touch-action: pan-y`; pointer events API |
| Product image hotspots | Z-index chaos with popovers (#12) | Audit stacking contexts; use fixed z-index scale |
| Gallery filtering | State loss on navigation (#14) | URL query params as source of truth from day one |
| Auto-rotation (room scheme) | Accessibility -- no pause control (#6) | Add visible pause button; respect `prefers-reduced-motion` |
| Subscribe popup | Theme editor re-init failure (#3) | Web Component with connectedCallback/disconnectedCallback |
| Mobile navigation | Touch event hijacking (#5) | Test on real iOS/Android devices; passive listeners |
| All sections | Theme update file overwrite (#4) | Never modify Prestige core files; use separate custom files |
| All components | Memory leaks from stale listeners (#8) | AbortController pattern in every custom element |

## Sources

- Codebase analysis: `assets/theme.js` (5,868 lines, 90+ custom elements, 98 connectedCallback instances, 34 layout-reading calls)
- Codebase analysis: `assets/theme.css` (8,080 lines, 24 `!important` declarations, 7 `prefers-reduced-motion` references)
- Codebase analysis: `.planning/codebase/CONCERNS.md` (17 documented concerns including memory leaks, XSS vectors, monolithic bundles)
- Shopify Online Store 2.0 section rendering architecture (established platform behavior)
- Web Components lifecycle specification (`connectedCallback`/`disconnectedCallback` behavior with dynamic DOM insertion)
- CSS Compositing model (transform/opacity compositor promotion vs. paint-triggering properties)
- WCAG 2.1 AA requirements (2.2.2 Pause Stop Hide, 2.3.1 Three Flashes, 1.3.1 Info and Relationships)
- SVG `pathLength` attribute specification for cross-browser stroke animation normalization
