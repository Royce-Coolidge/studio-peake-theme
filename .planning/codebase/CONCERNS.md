# Codebase Concerns

**Analysis Date:** 2026-03-16

## Tech Debt

**Large Liquid Template Files:**
- Issue: Product and section files exceed 1700+ lines, making maintenance difficult
- Files: `sections/main-product.liquid` (1807 lines), `sections/featured-product.liquid` (1712 lines), `sections/slideshow.liquid` (832 lines), `sections/media-grid.liquid` (735 lines)
- Impact: Hard to locate specific features, increased risk of unintended side effects during edits, difficult for new team members to understand
- Fix approach: Break into smaller, reusable snippets; separate schema definitions and logic; consider component-based architecture with clearer separation of concerns

**Monolithic Product Info Snippet:**
- Issue: `snippets/product-info.liquid` (570 lines) handles multiple responsibilities
- Files: `snippets/product-info.liquid`
- Impact: Single point of failure for product display; changes to one feature may break others
- Fix approach: Split by feature (pricing, variants, reviews, etc.) into distinct snippets

**Icons Snippet Complexity:**
- Issue: `snippets/icon.liquid` (734 lines) contains all icon definitions inline
- Files: `snippets/icon.liquid`
- Impact: Long load times for icon discovery; scales poorly as icon library grows
- Fix approach: Consider icon sprite approach or external icon system

## Missing Error Handling

**Unsafe JSON Parsing in Product Page:**
- Issue: No error handling for JSON.parse() in localStorage operations
- Files: `sections/main-product.liquid` (lines 168)
- Trigger: Corrupted or malformed localStorage data could crash the page
- Impact: Recently viewed products feature fails silently, no recovery path
- Recommendation: Wrap in try-catch, validate parsed data structure, provide fallback

**Missing Null Checks in Theme JavaScript:**
- Issue: Assumes DOM elements always exist before querying
- Files: `assets/newsletter-popup.js` (lines 72-83), `assets/theme.js` (multiple locations)
- Trigger: Conditional rendering of elements; feature-flagged sections
- Impact: Runtime errors if expected elements are missing; console spam in users' browsers
- Recommendation: Add existence checks before element interactions

**Incomplete Fallback for Clipboard API:**
- Issue: Fallback code in `newsletter-popup.js` doesn't handle older browser scenarios fully
- Files: `assets/newsletter-popup.js` (lines 24-43)
- Trigger: Older iOS versions, some security contexts
- Impact: Copy functionality may silently fail; no user feedback
- Recommendation: Add explicit error message feedback to user

## Security Considerations

**Unescaped User Input in Custom Liquid Block:**
- Issue: The "liquid" block type allows merchants to input arbitrary Liquid code
- Files: `blocks/liquid.liquid`
- Risk: Liquid injection attacks; merchants could expose sensitive information or break site
- Current mitigation: Theme editor ACL controls (shop owner only)
- Recommendations: Add documentation warning; consider sanitizing block input; audit Liquid filters used; log changes to this block

**localStorage Vulnerability Window:**
- Issue: Recently viewed products stored in localStorage without validation
- Files: `sections/main-product.liquid`, `assets/theme.js`
- Risk: XSS attacks could read/modify recently viewed product list; fingerprinting risk
- Current mitigation: Product IDs are non-sensitive
- Recommendations: Add Content Security Policy headers; validate array structure; consider session-only storage instead

## Performance Bottlenecks

**Large Asset Files:**
- Issue: `assets/theme.js` (263KB) and `assets/theme.css` (166KB) are monolithic
- Impact: Initial page load time affected; parsing time on lower-end devices
- Cause: All theme components bundled together; minified but not code-split
- Improvement path: Implement lazy loading for non-critical components; tree-shake unused code; consider splitting by page type

**Hero Image Sections Without Responsive Optimization:**
- Issue: Image sections (gallery, slideshow) don't consistently optimize for mobile bandwidth
- Files: `sections/media-grid.liquid`, `sections/slideshow.liquid`, `sections/image-with-text-overlay.liquid`
- Cause: Some image tags missing `sizes` attribute or `srcset` optimization
- Improvement path: Audit all image renders; add responsive image attributes; use Shopify image_url filter with width parameter

**Multiple Render Calls in Product Page:**
- Issue: 309+ render/include statements across sections create multiple file lookups
- Impact: TTFB affected; potential waterfalls in Liquid rendering pipeline
- Cause: Deep component nesting; each render adds overhead
- Improvement path: Cache frequently rendered snippets; combine related renders; optimize variable passing

## Fragile Areas

**Product Rerender Component Assumption:**
- Issue: `<product-rerender>` web component depends on specific DOM structure and form IDs
- Files: `sections/main-product.liquid` (lines 45, 110)
- Why fragile: Hard to debug if form ID generation changes; assumes component always exists; no fallback
- Safe modification: Never change form ID pattern without updating both locations; add console validation
- Test coverage: No visible unit tests for product form state sync

**Sticky Bar Implementation:**
- Issue: Sticky ATC bar depends on form visibility and variant selection
- Files: `sections/main-product.liquid` (lines 109-155)
- Why fragile: Hidden when product unavailable; relies on product-rerender re-sync; mobile/desktop differences
- Safe modification: Test on multiple screen sizes; verify form state after variant change
- Test coverage: No automated tests visible

**Color Scheme CSS Generation:**
- Issue: Color scheme hash generation via MD5 filter could cause collisions
- Files: `sections/main-product.liquid` (line 40), `sections/blog-posts.liquid`, multiple sections
- Why fragile: Hash-based class names; if colors ever match, CSS conflicts occur
- Safe modification: Consider using color scheme ID instead; validate uniqueness
- Test coverage: No tests for color collision scenarios

**Meta Fields Structure:**
- Issue: Metafields.json is empty; future Shopify App integration risk
- Files: `.shopify/metafields.json`
- Why fragile: If custom apps add metafields later, conflicts may arise; no schema definition
- Safe modification: Document any custom metafield requirements before integration
- Test coverage: No validation of metafield usage

## Scaling Limits

**Locale Management:**
- Current capacity: 32 locale files maintained manually
- Limit: Adding new locales requires duplicating schema across multiple JSON files (en.default.schema.json, fr.schema.json)
- Scaling path: Implement locale inheritance; use single schema with locale overrides; consider headless/PWA approach

**Product Variant Limits:**
- Issue: Product page doesn't specify handling for products with 100+ variants
- Current capacity: Unknown (Shopify default is 100+ variants)
- Scaling path: Add variant pagination; implement variant search/filter

## Dependencies at Risk

**Third-Party JavaScript Library (vendor.min.js):**
- Risk: Minified vendor library with no source attribution visible
- Impact: Difficult to audit for security; impossible to debug
- Migration plan: Document vendor origins; consider replacing with modern libraries; audit for deprecated APIs

**jQuery-like Patterns in theme.js:**
- Risk: Codebase relies on custom animation patterns that may not be maintainable
- Current state: Uses private fields and WeakSet patterns (modern JS)
- Migration plan: Document custom patterns; consider standardizing on Web Components library

## Missing Critical Features

**No Locale Fallback Strategy:**
- Problem: Missing translations in minor languages fall through to source key
- Blocks: Multilingual stores with incomplete translations
- Recommendation: Implement locale hierarchy (e.g., de-CH → de → en)

**No A/B Testing Framework:**
- Problem: No built-in mechanism for variant testing
- Blocks: Performance optimization; feature rollout
- Recommendation: Add experiment framework or integrate with Shopify's Pixel API

## Test Coverage Gaps

**No Automated Tests for Product Form Sync:**
- What's not tested: Product rerender component state synchronization
- Files: `sections/main-product.liquid`, `assets/theme.js`
- Risk: Variant selection may desync sticky bar; form submission failures go undetected
- Priority: High

**No Tests for Responsive Image Loading:**
- What's not tested: Image srcset and sizes attributes on mobile
- Files: Multiple sections with `image_tag` filters
- Risk: Oversized images on mobile; bandwidth waste
- Priority: Medium

**No Tests for Locale Completeness:**
- What's not tested: All translation keys present in all locale files
- Files: `locales/*.json`
- Risk: Fallback to untranslated key names displayed to users
- Priority: Medium

**No Tests for CSS Color Scheme Conflicts:**
- What's not tested: Hash-based color scheme class uniqueness
- Files: Multiple sections
- Risk: CSS cascade issues if hashes collide
- Priority: Low

**No Tests for localStorage Edge Cases:**
- What's not tested: localStorage unavailable (private mode), quota exceeded, corrupted data
- Files: `sections/main-product.liquid`, `assets/theme.js`
- Risk: Feature fails silently; poor user experience
- Priority: Medium

## Known Bugs

**None explicitly marked in codebase** - Search for TODO, FIXME, HACK, XXX, BUG, BROKEN revealed no documented issues.

**However, inferred bugs based on code patterns:**

**Potential Clipboard Copy Timeout Race Condition:**
- Symptoms: Copy button shows "Copied" state but doesn't revert if page navigates or component destroys
- Files: `assets/newsletter-popup.js` (lines 51-55)
- Trigger: User copies discount code and immediately navigates away
- Workaround: Increase timeout from 2500ms; add cleanup on page unload

**Marquee Text Animation May Stutter on Mobile:**
- Symptoms: Marquee animation pauses/resumes inconsistently
- Files: `assets/theme.js` (MarqueeText class)
- Trigger: Mobile Safari background tab throttling
- Workaround: Test on actual devices; consider request animation frame approach

---

*Concerns audit: 2026-03-16*
