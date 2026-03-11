# Concerns

## Critical Issues

### 1. Monolithic JavaScript Bundle
- **File:** `assets/theme.js` — **5,868 lines** in a single file
- **Impact:** Impossible to maintain, debug, or optimize
- **Risk:** Every page loads the entire bundle regardless of what's needed
- **Recommendation:** Modularize into section-specific JS files or use code splitting

### 2. Oversized Section Files
- `sections/main-product.liquid` — **1,807 lines**
- `sections/featured-product.liquid` — **1,712 lines**
- `sections/slideshow.liquid` — **832 lines**
- **Impact:** Difficult to maintain, review, and debug
- **Recommendation:** Extract repeated patterns into snippets, break complex sections into smaller components

### 3. Zero Test Coverage
- No test framework, no test files, no CI/CD
- No linting or static analysis (Theme Check not configured)
- **Impact:** Changes risk breaking existing functionality with no safety net
- **Recommendation:** Start with Theme Check, then add visual regression testing

## Security Concerns

### 4. Potential XSS Vectors
- `innerHTML` usage in `theme.js` without consistent sanitization
- Inline event handlers in Liquid templates
- Deprecated `document.execCommand()` usage
- **Impact:** User-generated content could introduce XSS vulnerabilities
- **Recommendation:** Audit all innerHTML usage, prefer textContent where possible

### 5. No Content Security Policy
- No CSP headers configured at theme level
- Third-party scripts loaded without integrity checks
- **Recommendation:** Work with Shopify's CSP capabilities

## Performance Concerns

### 6. Single Large CSS Bundle
- `assets/theme.css` — **169KB** loaded on every page
- No critical CSS extraction or lazy loading
- **Impact:** Render-blocking on initial page load

### 7. Single Large JS Bundle
- `assets/theme.js` (269KB) + `vendor.min.js` (53KB) + `photoswipe.min.js` (60KB)
- All loaded regardless of page type
- **Impact:** Unnecessary JavaScript parsing/execution on simple pages
- **Recommendation:** Defer non-critical scripts, lazy-load photoswipe

### 8. No Image Optimization Configuration
- SVG files have both raw and `.liquid` variants (duplication)
- No evidence of responsive image strategy beyond Shopify defaults

## Technical Debt

### 9. Silent Error Handling
- Empty catch blocks throughout `theme.js`
- Errors swallowed without logging or user feedback
- **Impact:** Bugs are hidden, making debugging extremely difficult

### 10. Memory Leak Potential
- `setTimeout`/`setInterval` calls without cleanup
- Event listeners potentially not removed on element disconnection
- Custom elements may not properly clean up in `disconnectedCallback`

### 11. No Dependency Management
- No `package.json` — all vendor code is committed as static files
- `vendor.min.js` and `photoswipe.min.js` versions unknown
- **Impact:** Can't easily update dependencies or track vulnerabilities

### 12. Empty/Unused Files
- `assets/custom-fonts.css` — **0 bytes** (empty file)
- Potential dead code in the large theme.js bundle

## Accessibility Concerns

### 13. Accessibility Gaps
- Missing ARIA labels on interactive elements
- Keyboard navigation support may be incomplete
- Focus management in modals/drawers needs audit
- **Recommendation:** Run Axe or Lighthouse accessibility audit

## Browser Compatibility

### 14. Modern API Assumptions
- Uses modern JavaScript APIs (Custom Elements, IntersectionObserver)
- No polyfills or graceful degradation detected
- **Impact:** Older browsers may have broken functionality
- **Risk Level:** Low (Shopify's target audience typically uses modern browsers)

## Fragile Areas

### 15. Product Page Complexity
- `main-product.liquid` at 1,807 lines is the most fragile file
- Handles variants, media, forms, reviews, complementary products
- Any change risks cascading issues

### 16. Featured Product Duplication
- `featured-product.liquid` (1,712 lines) likely duplicates much of `main-product.liquid`
- Changes to product display logic must be synchronized across both files
- **Recommendation:** Extract shared product display logic into snippets

### 17. Header/Navigation
- `header.liquid` (630 lines) with dependent snippets (`mega-menu.liquid`, `header-sidebar.liquid`, `header-search.liquid`)
- Complex interaction between mobile/desktop navigation states
- Fragile when adding new menu items or navigation patterns
