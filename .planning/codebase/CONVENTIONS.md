# Coding Conventions

**Analysis Date:** 2026-03-10

## Naming Patterns

**Files:**
- Liquid sections: `kebab-case.liquid` (e.g., `featured-product.liquid`, `main-product.liquid`)
- Liquid snippets: `kebab-case.liquid` (e.g., `blog-post-card.liquid`, `section-header.liquid`)
- JavaScript: `kebab-case.js` (e.g., `newsletter-popup.js`)
- Custom elements: `kebab-case.js` compiled from source (e.g., `CountrySelector` → `country-selector`)

**Functions:**
- Vanilla JavaScript (in `assets/newsletter-popup.js`): camelCase for standalone functions
  - `copyDiscountCode()`, `fallbackCopyText()`, `showCopySuccess()`
- Custom elements (in compiled `theme.js`): PascalCase for class names
  - `ConfirmButton`, `CopyButton`, `ShareButton`, `MarqueeText`, `GestureArea`, `CountrySelector`
- Private methods in classes: suffixed with `_fn` (e.g., `copyToClipboard_fn`, `onCountryChanged_fn`)

**Variables:**
- Liquid: snake_case for assigns and captures
  - `color_scheme_hash`, `has_content_below_gallery`, `product_form_id`, `accessibility_text`
- JavaScript: camelCase for local variables and object properties
  - `codeElement`, `copyBtn`, `copyText`, `deltaX`, `deltaY`

**Types:**
- Custom HTML elements (web components): kebab-case
  - `<product-rerender>`, `<countdown-timer>`, `<slideshow-carousel>`, `<x-tabs>`, `<x-header>`
- CSS classes: kebab-case with BEM-style modifiers
  - `button`, `button--outline`, `button-sm`, `button--subdued`
  - `slideshow__slide`, `content-over-media--large`

## Code Style

**Formatting:**
- Liquid: Consistent spacing around liquid tags
  - Use `{%- ... -%}` to strip whitespace when needed
  - Multi-line liquid statements use indentation for clarity
  - Example from `snippets/button.liquid`:
    ```liquid
    {%- capture class_attribute
      if style == 'link'
        echo 'link'
      else
        echo 'button'
      endif
    endcapture -%}
    ```

**Linting:**
- No dedicated linter config files detected
- JavaScript uses minified/compiled output (`theme.js` is minified with private field transpilation)
- Follows ES2020+ syntax patterns with private fields and methods

## Import Organization

**Liquid Render Order:**
1. Style blocks (CSS)
2. Liquid logic and assigns
3. HTML/template markup
4. Schema definitions (JSON)

**Example structure from `sections/featured-product.liquid`:**
```liquid
<style>
  /* CSS definitions */
</style>

{%- liquid
  assign color_scheme_hash = ...
  capture product_form_id = ...
-%}

<div class="section-spacing ...">
  {%- render 'product-gallery', ... -%}
  {%- render 'product-info', ... -%}
</div>

{% schema %}
{ ... }
{% endschema %}
```

**Liquid Snippet Inclusion:**
- Use `{% render 'snippet-name', param1: value1, param2: value2 -%}` pattern
- Parameters documented in comment block at snippet top
- Example from `snippets/button.liquid`:
  - 30+ line documentation comment block listing all supported variables
  - Parameters passed explicitly with Liquid filter chain

**Path Aliases:**
- Not applicable to Liquid/JavaScript theme structure
- Snippets/sections referenced by filename without path prefix

## Error Handling

**Patterns:**

**JavaScript Error Handling:**
- Try-catch blocks for operations that may throw
  - Example from `assets/newsletter-popup.js` (lines 35-41):
    ```javascript
    try {
      document.execCommand('copy');
      showCopySuccess(copyBtn, copyText, copiedText);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    ```

- Promise rejection handling with `.catch()` chains
  - Example (lines 14-21):
    ```javascript
    navigator.clipboard.writeText(codeText).then(() => {
      showCopySuccess(copyBtn, copyText, copiedText);
    }).catch(() => {
      fallbackCopyText(codeText, copyBtn, copyText, copiedText);
    });
    ```

- Graceful degradation with null/undefined checks
  - Example from `assets/theme.js` (line 39): `if (!navigator.clipboard) { return; }`
  - Fallback to legacy APIs when modern APIs unavailable

**Liquid Error Handling:**
- Conditional rendering instead of exceptions
  - Check for blank values: `if section.settings.content != blank`
  - Safe defaults with `| default:` filter
  - Example from `sections/featured-product.liquid` (line 40): `assign color_scheme_hash = section.settings.color_scheme.settings.background_gradient | default: section.settings.color_scheme.settings.background | md5`

- Silent failures preferred over exceptions
  - Loop with fallback rendering in case of empty collections
  - Example from `sections/blog-posts.liquid`:
    ```liquid
    {%- for article in section.settings.blog.articles limit: section.settings.posts_count -%}
      {%- render 'blog-post-card', ... -%}
    {%- else -%}
      {%- for i in (1..3) -%}
        {%- render 'blog-post-card', ... -%}
      {%- endfor -%}
    {%- endfor -%}
    ```

## Logging

**Framework:** `console` API (native browser logging)

**Patterns:**
- Minimal console usage in production code
- `console.error()` for exceptions: `assets/newsletter-popup.js` line 39
- `console.warn()` for validation issues: `assets/theme.js` includes warning for required attributes

**Example from `assets/newsletter-popup.js`:**
```javascript
console.error('Failed to copy text: ', err);
```

## Comments

**When to Comment:**
- Required for complex sections with multiple features
- Document significant code blocks in sections with warnings
  - Example from `sections/slideshow.liquid`:
    ```liquid
    {%- comment -%}
    DEVELOPER NOTE: the slideshow is one of Prestige most complex sections due to the large number of settings it offers. We
    highly recommend you to not edit the code unless you have fully reviewed and understood all the code. A simple change
    may have important consequence on the section itself.
    {%- endcomment -%}
    ```

- Visual separators in large files
  - Example pattern: `------------ MEDIA ----------------`

**Snippet/Component Documentation:**
- Every reusable snippet includes a comprehensive comment block at top
- Lists all supported parameters and their purposes
- Example from `snippets/button.liquid` (lines 1-30):
  ```liquid
  {%- comment -%}
  BUTTON COMPONENT

  Generate a button (or link styled as a button). It supports wide range of attributes...

  ********************************************
  Supported variables
  ********************************************

  * content: the content of the button
  * href: an optional link to set...
  ```

**No JSDoc/TSDoc:**
- Not used in this codebase
- JavaScript is compiled/minified so documentation is in Liquid components

## Function Design

**Size:**
- Liquid filters and helper functions are typically single-purpose
- Snippets abstract frequently-used patterns and keep sections under 100 lines where possible

**Parameters:**
- Liquid snippets: Named parameters passed explicitly (no positional args)
  - `{% render 'button', href: link_url, content: button_text, style: 'outline' %}`
- JavaScript functions: Concise parameter lists
  - Example `fallbackCopyText(text, copyBtn, copyText, copiedText)` - 4 params max

**Return Values:**
- Liquid: Assigns and captures used for data flow (no explicit returns)
- JavaScript: Functions return data or Promises
  - `cachedFetch()` returns Promise
  - Most class methods return void (handlers)

## Module Design

**Exports:**
- Liquid snippets: Define reusable components
  - Rendered via `{% render 'snippet-name', vars... %}`
  - No explicit module exports (implicit via file)

- JavaScript custom elements: Registered globally via `window.customElements.define()`
  - Example from `theme.js`:
    ```javascript
    if (!window.customElements.get("confirm-button")) {
      window.customElements.define("confirm-button", ConfirmButton);
    }
    ```

**Barrel Files:**
- Not used in Shopify theme structure
- Sections/snippets referenced individually

**Custom Element Pattern:**
- Base class extends `HTMLElement`
- Private fields stored in `WeakMap` (for encapsulation)
- Registered with kebab-case names
- Example:
  ```javascript
  class CopyButton extends HTMLElement {
    constructor() {
      super();
      __privateAdd(this, _CopyButton_instances);
      this.addEventListener("click", __privateMethod(this, _CopyButton_instances, copyToClipboard_fn));
    }
  }
  if (!window.customElements.get("copy-button")) {
    window.customElements.define("copy-button", CopyButton);
  }
  ```

---

*Convention analysis: 2026-03-10*
