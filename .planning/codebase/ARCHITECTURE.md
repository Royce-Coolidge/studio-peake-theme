# Architecture

**Analysis Date:** 2026-03-16

## Pattern Overview

**Overall:** Shopify Dawn-based Theme with Modular Section Architecture

**Key Characteristics:**
- JSON Schema-driven configuration for dynamic sections and blocks
- Liquid templating with reusable snippet components
- Client-side JavaScript enhancement using custom web components
- CSS-in-JS via Liquid computed variables for dynamic styling
- Metaobject-based data structure for custom content types (e.g., projects, artworks)
- Multi-locale support with translation strings in `locales/`

## Layers

**Presentation Layer (Client-Facing):**
- Purpose: Render HTML, CSS, and interactive components to the browser
- Location: `templates/`, `sections/`, `blocks/`, `snippets/`
- Contains: Liquid markup, inline styles, custom HTML elements
- Depends on: Shopify liquid filters, settings from `config/`, locale strings
- Used by: Browser renders this as the visible page

**Section & Block Layer (Dynamic Content):**
- Purpose: Modular content blocks that merchants can add/configure in Shopify admin
- Location: `sections/*.liquid`, `blocks/*.liquid`
- Contains: 60 section files (e.g., `featured-product.liquid`, `hero-banner.liquid`), 12 block files (e.g., `accordion.liquid`, `button.liquid`)
- Depends on: Shopify section schema, product/collection objects, settings
- Used by: Templates reference sections; sections reference blocks

**Configuration Layer:**
- Purpose: Define theme-wide settings, color schemes, and font choices
- Location: `config/settings_schema.json`, `config/settings_data.json`, `config/markets.json`
- Contains: Color scheme definitions, typography settings, spacing presets, feature toggles
- Depends on: Shopify admin inputs
- Used by: Rendered as CSS variables by `css-variables.liquid` snippet

**Snippet Reusable Components:**
- Purpose: Shared Liquid components used across sections and templates
- Location: `snippets/*.liquid` (54 files total)
- Contains: Icons (`icon.liquid`), form inputs (`input.liquid`, `checkbox.liquid`), product components (`product-gallery.liquid`, `product-info.liquid`), UI elements (`button.liquid`, `banner.liquid`)
- Depends on: Liquid filters, locale strings, CSS classes
- Used by: Called via `{% render %}` from sections and templates

**Data/Content Layer:**
- Purpose: Shopify data (products, collections, pages) and custom metaobject data
- Location: Shopify admin (remote), plus `templates/metaobject/` for custom metaobject templates
- Contains: Product catalog, collections, pages, custom metaobject entries (e.g., `project.kensington-townhouse.json`)
- Depends on: Shopify GraphQL API or Liquid object access
- Used by: Sections render product/collection data; metaobject templates render custom content

**Asset/Static Files:**
- Purpose: Compiled CSS, JavaScript, fonts, and SVG assets
- Location: `assets/` (16 subdirectories or files)
- Contains: `theme.css`, `theme.js`, `vendor.min.js`, `studio-peake.css`, `studio-peake.js`, `custom-fonts.css`, font files, SVG utilities
- Depends on: Build process (external)
- Used by: Included in `layout/theme.liquid` via `asset_url` filter

**Locale/Internationalization:**
- Purpose: Multi-language support with translation strings
- Location: `locales/` (32 language files)
- Contains: JSON translation keys for all UI text
- Depends on: Request locale
- Used by: Liquid `t` filter translates keys to user's language

## Data Flow

**Page Request Flow:**

1. Shopify routes request to `layout/theme.liquid`
2. Layout renders `<head>` with CSS, fonts, and JS imports
3. Layout renders body with header/footer sections (from `sections/`)
4. Layout renders `{{ content_for_template }}` which loads the appropriate template (e.g., `templates/index.json`, `templates/product.json`)
5. Template defines which sections to render and their block configuration
6. Each section renders its configured blocks, calling snippets for reusable components
7. Browser executes JavaScript modules to enhance interactivity (web components, carousels, etc.)

**Section Configuration Flow:**

1. Merchant configures section settings in Shopify admin
2. Settings stored in template JSON file (e.g., `templates/index.json`)
3. Section Liquid accesses settings via `section.settings` object
4. Settings map to schema-defined input types (color picker, text field, range, etc.)
5. Dynamic CSS computed in section `<style>` block using Liquid math
6. Section renders with merchant-configured appearance

**Block Nesting Flow:**

1. Section defines `blocks` array in its schema (e.g., announcement-bar allows up to 5 message blocks)
2. Template populates blocks in section configuration
3. Section loops through `section.blocks` and renders each block with `block.shopify_attributes` for admin editing
4. Each block has independent settings (e.g., text, color, link)

**State Management:**

- **Client-side state:** Web component properties, localStorage (for cart data, user preferences)
- **Server-side state:** Shopify admin configuration, product/inventory data, customer accounts
- **Shared state:** CSS custom properties (computed in Liquid, consumed by CSS and JavaScript)

## Key Abstractions

**Section Abstraction:**
- Purpose: Encapsulate a page component with configurable settings and nested blocks
- Examples: `sections/featured-product.liquid` (1712 lines), `sections/hero-banner.liquid`, `sections/collection-list.liquid`
- Pattern: Each section file contains markup, inline `<style>`, and `{% schema %}` defining inputs

**Block Abstraction:**
- Purpose: Small, reusable components nested within sections (e.g., carousel slides, accordion items)
- Examples: `blocks/accordion.liquid`, `blocks/button.liquid`, `blocks/icon.liquid`
- Pattern: Block files are minimal; sections loop through `section.blocks` and render them

**Snippet Abstraction:**
- Purpose: Reusable Liquid components for shared UI patterns
- Examples: `snippets/icon.liquid` (82,032 bytes - large SVG icon library), `snippets/button.liquid`, `snippets/product-gallery.liquid`
- Pattern: Called via `{% render 'snippet-name' with param1: value1 %}`, parameters passed in

**Color Scheme Abstraction:**
- Purpose: Define cohesive color palettes for different sections of the site
- Implementation: `config/settings_schema.json` defines `color_scheme_group` with multiple schemes
- Usage: Sections apply `class="color-scheme color-scheme--{{ section.settings.color_scheme.id }}"` to inherit colors

**CSS Variables Pattern:**
- Purpose: Dynamic styling computed in Liquid, consumed by CSS and JavaScript
- Implementation: `snippets/css-variables.liquid` (15,902 bytes) renders CSS custom properties based on settings
- Example: `--announcement-bar-height` set in JavaScript, used by announcement-bar section styling

## Entry Points

**Layout Entry Point:**
- Location: `layout/theme.liquid`
- Triggers: Every page load
- Responsibilities: Render HTML doctype, head metadata, script/style imports, body wrapper with header/footer sections, locale tracking

**Template Entry Points (Page-Type Specific):**
- `templates/index.json`: Homepage configuration
- `templates/product.json`: Product page layout (uses `main-product` section)
- `templates/collection.json`: Collection listing page
- `templates/page.json`: Static pages
- `templates/article.json`: Blog post pages
- `templates/customers/*.json`: Customer account pages (login, account, order history)

**Section Entry Points (Dynamic Content Areas):**
- Major sections: `featured-product` (1712 lines), `main-product` (1807 lines), `slideshow` (832 lines), `collection-list` (421 lines)
- Supporting sections: `announcement-bar`, `cart-drawer`, `footer`, `header`, etc.
- Each has schema defining which templates can use it

**Metaobject Data Entry Points:**
- Location: `templates/metaobject/` directory
- Purpose: Custom content types beyond products/collections
- Example: `templates/metaobject/project.kensington-townhouse.json` - renders portfolio/project entries

## Error Handling

**Strategy:** Silent fallbacks and conditional rendering

**Patterns:**
- `{%- if product -%}...{%- endif -%}` - Check for required objects before rendering
- `{%- unless settings.heading_font.system? -%}...{%- endunless -%}` - Conditional resource loading
- `{% if section.blocks.size > 0 %}` - Only render section if blocks exist
- No explicit error messages; missing data results in empty/skipped sections

## Cross-Cutting Concerns

**Logging:** Minimal client-side logging; errors surfaced via browser console from JavaScript modules

**Validation:** Shopify schema validation in admin UI; theme enforces no explicit validation

**Authentication:** Shopify handles customer authentication; theme renders customer-specific content based on `customer` object (when logged in)

**Accessibility:**
- ARIA labels on interactive elements (e.g., `aria-controls`, `aria-hidden`)
- Skip-to-content link in layout: `<a href="#main" class="skip-to-content sr-only">`
- Semantic HTML (`<button>`, `<nav>`, `<section>`)
- Localization via translation filters

**Styling Approach:**
- Utility-first CSS with Tailwind-like class names (e.g., `sm:place-self-end-center`)
- Inline scoped styles in sections (`<style>` tags with `#shopify-section-{{ section.id }}` selectors)
- Dynamic CSS variables for merchant-configured settings

---

*Architecture analysis: 2026-03-16*
