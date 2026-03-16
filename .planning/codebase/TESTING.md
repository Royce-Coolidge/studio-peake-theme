# Testing Patterns

**Analysis Date:** 2026-03-16

## Test Framework

**Runner:**
- Not detected - no test framework installed or configured
- No jest.config.js, vitest.config.ts, or equivalent found
- No test files (*.test.*, *.spec.*) found in codebase

**Assertion Library:**
- None - no testing infrastructure

**Run Commands:**
```bash
# No test commands available - testing not implemented
```

## Test File Organization

**Status:** Not implemented

No test files found in the codebase. Testing infrastructure is not currently set up.

## Test Structure

**Development Approach:**
- Theme development appears to follow manual testing approach
- Code changes committed directly (e.g., `feat(04.1): add SP Carousel with text section`)
- Testing done through Shopify admin preview or live theme

**Manual Testing Indicators:**
- JavaScript functions tested by visual inspection of behavior
- CSS animations tested by rendering in browser
- Components verified through Shopify theme editor

## Mocking

**Framework:** None

No mocking library detected.

**Real API Calls:**
- Clipboard API used directly with feature detection: `if (navigator.clipboard && window.isSecureContext)`
- DOM queries executed directly without abstraction layer
- Shopify liquid filters (e.g., `font_face`, `color_mix`) used without mock support

## Fixtures and Factories

**Status:** Not implemented

No test data fixtures, factories, or test helpers found.

**Component Testing:**
- Components tested visually in Shopify theme editor
- No programmatic test data generation

## Coverage

**Requirements:** None enforced

No coverage tooling detected. Code coverage not measured.

## Test Types

**Unit Tests:**
- Not implemented
- Individual functions like `copyDiscountCode()`, `fallbackCopyText()`, `showCopySuccess()` not tested programmatically

**Integration Tests:**
- Not implemented
- Clipboard functionality and DOM mutations not tested automatically

**E2E Tests:**
- Not implemented - Shopify admin provides visual verification

**Visual Regression:**
- Manual verification through Shopify theme editor
- CSS changes inspected by rendering templates

## Common Patterns

**Manual Testing Process:**
1. Code changes committed to git
2. Shopify theme dev server reloads changes
3. Merchant views updated in admin editor or storefront
4. Visual inspection confirms expected behavior

**Browser Compatibility Testing:**
- Feature detection used in code: `if (navigator.clipboard && window.isSecureContext)` with fallback
- Media query breakpoints for responsive testing
- CSS prefix handling for vendor support

**Validation:**
- Liquid blank checks: `if image == blank` then `{%- break -%}`
- JavaScript guard clauses: `if (!codeElement || !copyBtn) return;`
- DOM element existence checked before manipulation

**Event Handler Testing (Manual):**
The following event handlers are tested visually:
- Newsletter popup copy button: clicks and keyboard (Enter/Space) trigger `copyDiscountCode()`
- Discount code element: clicks auto-select text via `document.createRange()`
- Close buttons: rotation animation on hover/tap

**Example from `newsletter-popup.js`:**
```javascript
// Manual DOM interaction - tested by user actions
document.addEventListener('DOMContentLoaded', function() {
  const copyBtn = document.querySelector('.copy-code-btn');
  if (copyBtn) {
    copyBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyDiscountCode();
      }
    });
  }
});
```

Testing approach: User clicks button or presses Enter/Space in browser, visual feedback confirms success.

## Testing Recommendations for Future Implementation

**When adding automated testing:**

1. **Framework Choice:**
   - Jest for JavaScript unit/integration tests
   - Playwright for E2E visual testing
   - Vitest as lightweight alternative for unit tests

2. **What to Test First:**
   - `copyDiscountCode()` - Clipboard API behavior with fallback
   - `fallbackCopyText()` - DOM manipulation, text selection
   - Animation state classes - `classList.add('sp-is-visible')`

3. **Testing Approach for Shopify Theme:**
   - Unit test pure functions (clipboard, DOM helpers)
   - Integration test DOM state mutations
   - E2E test full user flows through theme editor preview

4. **Coverage Gaps:**
   - Clipboard API success/failure paths not tested
   - Browser compatibility fallbacks not verified
   - Animation triggering (IntersectionObserver via `inView`) not tested
   - Event listener attachment not verified

---

*Testing analysis: 2026-03-16*
