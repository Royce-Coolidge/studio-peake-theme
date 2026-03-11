# Testing

## Current State

**No testing infrastructure exists in this codebase.**

### What's Missing
- No test framework configured (no Jest, Mocha, Vitest, or Playwright)
- No test files present anywhere in the project
- No `package.json` — no Node.js tooling at all
- No CI/CD pipeline configuration
- No linting tools (ESLint, Stylelint, Theme Check)
- No pre-commit hooks or quality gates
- No `node_modules/` or dependency management

### Shopify Theme-Specific Testing Options

**Theme Check (Shopify's official linter):**
- Static analysis tool for Shopify themes
- Catches Liquid syntax errors, deprecated features, performance issues
- Not currently configured

**Shopify CLI:**
- `shopify theme check` — Run theme linting
- `shopify theme dev` — Local development preview
- No evidence of Shopify CLI configuration in the repo

## Validation Strategy

Currently, validation appears to be entirely manual:
1. Preview changes in Shopify theme editor
2. Visual inspection across pages
3. No automated regression testing

## Recommendations for Future Testing

### Priority 1: Theme Check
- Install and configure Shopify Theme Check
- Catches common Liquid issues, accessibility gaps, performance problems

### Priority 2: Visual Regression
- Implement screenshot-based testing for key pages
- Tools: Percy, Chromatic, or Playwright visual comparisons

### Priority 3: JavaScript Unit Tests
- The 5,868-line `theme.js` would benefit from modularization and unit tests
- Custom elements could be tested with @open-wc/testing or similar

### Priority 4: End-to-End
- Playwright or Cypress for critical user flows (add to cart, checkout, search)
- Requires a running Shopify dev store
