# Architecture

**Analysis Date:** 2026-03-10

## Pattern Overview

**Overall:** Shopify Theme Component Architecture (Prestige Theme)

**Key Characteristics:**
- Section-based modular component system
- Block-driven customizable content composition
- Liquid templating with JSON configuration
- Color scheme abstraction layer for theming
- Responsive responsive design system with Tailwind-like utility classes
- Hierarchical template + section + block structure
- Snippet-based reusable component library

## Layers

**Layout Layer:**
- Purpose: Root HTML structure and global context setup
- Location: `layout/theme.liquid`
- Contains: Document head (meta, assets, fonts), global scripts, body structure, header/footer group references
- Depends on: Shopify platform APIs, asset references, section groups
- Used by: All page templates via content_for_layout

**Template Layer:**
- Purpose: Page-specific content composition and section orchestration
- Location: `templates/*.json`
- Contains: JSON configurations that declare which sections to render and in what order
- Depends on: Section definitions, color schemes, settings
- Used by: Shopify request handling to render specific page types (product, collection, homepage, etc.)

**Section Layer:**
- Purpose: Reusable page components with configurable blocks and settings
- Location: `sections/*.liquid`
- Contains: Component logic, styling (scoped), schema definitions, block rendering loops, responsive behavior
- Depends on: Block definitions, snippets, Shopify platform features
- Used by: Templates (via section references), dynamically composed on pages

**Block Layer:**
- Purpose: Sub-components within sections that provide granular customization
- Location: `blocks/*.liquid`
- Contains: Minimal template code, delegating to snippets or rendering directly
- Depends on: Snippet helpers, block settings schema
- Used by: Sections (via block loops and case statements)

**Snippet Layer (Reusable Components):**
- Purpose: Shared template utilities and component abstractions
- Location: `snippets/*.liquid`
- Contains: Partial templates (buttons, product cards, galleries, form components, meta tags)
- Depends on: Shopify helpers, CSS classes, settings passed via parameters
- Used by: Sections, blocks, other snippets

**Configuration Layer:**
- Purpose: Theme-wide settings, color schemes, fonts, branding
- Location: `config/settings_schema.json`, `config/settings_data.json`, `config/markets.json`, `config/metafields.json`
- Contains: Schema definitions for customizer UI, applied settings, market configurations, metafield definitions
- Depends on: Theme customizer (Shopify platform)
- Used by: All sections and snippets via `settings` and `color_scheme` context

**Styling Layer:**
- Purpose: Global and component-scoped CSS
- Location: `assets/theme.css`, `assets/custom-fonts.css`, component-level `<style>` blocks in sections
- Contains: Base styles, utility classes, CSS variables (theme-wide: colors, spacing, fonts), responsive media queries
- Depends on: CSS custom properties, Tailwind-like utility naming
- Used by: Layout, sections, blocks, snippets

**Asset Layer:**
- Purpose: Non-template assets and libraries
- Location: `assets/`
- Contains: JavaScript files (theme.js, vendor.min.js, newsletter-popup.js, photoswipe.min.js), SVGs, custom fonts (.otf)
- Depends on: ES module import system, Shopify asset URL filters
- Used by: Layout theme.liquid, conditional loads for specific pages

**Localization Layer:**
- Purpose: Multi-language string management
- Location: `locales/*.json`, `locales/*.schema.json`
- Contains: Translation strings organized by feature/component, schema translations
- Depends on: Shopify Liquid translation filters (| t)
- Used by: All templates, sections, snippets via t filter

## Data Flow

**Page Render Flow:**

1. Shopify routes request to page type (product, collection, index, etc.)
2. Loads corresponding `templates/[page-type].json` configuration
3. Template JSON declares sections in order: `{ "sections": { "section-id": { "type": "section-name" } } }`
4. Layout `layout/theme.liquid` wraps content:
   - Renders `header-group` sections (before main)
   - Renders `content_for_layout` (template-generated HTML)
   - Renders `footer-group` sections (inside main)
5. Each section (`sections/section-name.liquid`):
   - Accesses `section.settings` (customizer values)
   - Accesses `section.blocks` (child components)
   - Loops through blocks with case statement matching `block.type`
   - Each block delegates to specific rendering (direct HTML or snippet call)
6. Snippets render partial templates with passed parameters
7. CSS is scoped via section/block ID selectors using Liquid injection
8. Liquid filters apply settings (colors, fonts, localization)

**Settings Application Flow:**

1. `config/settings_schema.json` defines all customizer UI fields
2. User customizes in Shopify admin
3. Settings stored in `config/settings_data.json`
4. Liquid accesses via `settings.*` (global) or `color_scheme.settings.*` (scheme-specific)
5. Colors, fonts, spacing applied to CSS custom properties
6. Responsive breakpoints (mobile: <700px, tablet: 700px-1000px, desktop: 1000px+)

**Product Page Data Flow (Example):**

1. Request to `/products/product-slug`
2. Loads `templates/product.json`
3. Declares section "main-product" with nested blocks (vendor, title, price, gallery, variant-picker, buy-buttons)
4. `sections/main-product.liquid` renders:
   - Uses Liquid `for block in section.blocks` loop
   - Each block type has dedicated rendering (some inline, some via snippets like `product-gallery`)
   - Snippets receive `product`, `variant` data and render accordingly
5. Gallery snippet initializes JavaScript for zoom/carousel
6. Variant picker snippet handles form submission

**State Management:**

- Form state: Managed via Shopify form helpers (`form` object), no explicit state library
- Cart state: Managed by Shopify (form_id references)
- Page state: Managed via URL parameters (filters, sorting, pagination)
- Component state: JavaScript custom elements (e.g., `<x-header>`, `<product-rerender>`) manage visibility, animations
- Customizer state: Stored in `settings_data.json`, accessed globally

## Key Abstractions

**Section:**
- Purpose: Represents a configurable page component with blocks and settings
- Examples: `sections/slideshow.liquid`, `sections/featured-product.liquid`, `sections/header.liquid`
- Pattern: Liquid template with `<style>`, HTML, and `{% schema %}` block containing JSON config

**Block:**
- Purpose: Child component within a section that users can add/remove/reorder
- Examples: `blocks/button.liquid`, `blocks/image.liquid`, `blocks/video.liquid`
- Pattern: Minimal code, usually delegates to snippets via `{% render %}`

**Snippet:**
- Purpose: Reusable template partial
- Examples: `snippets/button.liquid`, `snippets/product-gallery.liquid`, `snippets/social-meta-tags.liquid`
- Pattern: Pure template function taking parameters, returns rendered HTML

**Color Scheme:**
- Purpose: Abstraction over color palettes with customizable values
- Examples: scheme-1 (white bg, dark text), scheme-2 (light gray bg), scheme-3 (dark bg, white text), scheme-4 (transparent)
- Implementation: `config/settings_data.json` contains scheme definitions with background/text/button colors
- Usage: Sections apply via `color-scheme--{{ section.settings.color_scheme.id }}` class

**Container:**
- Purpose: Width constraint wrapper
- Implementation: CSS class `container--lg`, `container--xl`, `container--full`
- Used to: Constrain section content width responsively

**Responsive Spacing:**
- Purpose: Consistent spacing system
- Examples: `gap-4` (0.5rem), `gap-5` (1rem), `sm:gap-5` (gap-5 on tablet+)
- Values: Defined in CSS with TW-like naming (xs, sm, md, lg, xl)

## Entry Points

**Layout Entry:**
- Location: `layout/theme.liquid`
- Triggers: Every page load (universal wrapper)
- Responsibilities:
  - Renders HTML document structure
  - Outputs head meta/preconnect/fonts/CSS
  - Calls `{%- sections 'header-group' -%}` to render header
  - Calls `{%- sections 'overlay-group' -%}` for modal/drawer sections
  - Outputs `{{ content_for_layout }}` (template sections)
  - Calls `{%- sections 'footer-group' -%}` for footer

**Product Page Entry:**
- Location: `templates/product.json`
- Triggers: GET /products/:slug
- Responsibilities: Declares section "main-product" with blocks (vendor, title, price, gallery, variant-picker, buy-buttons, complementary-products, related-products)

**Homepage Entry:**
- Location: `templates/index.json`
- Triggers: GET /
- Responsibilities: Declares ordered sections (slideshow, logo-list, collection-list, featured-collections, media-grid, shop-the-look, blog-posts, apps)

**Collection Page Entry:**
- Location: `templates/collection.json`
- Triggers: GET /collections/:handle
- Responsibilities: Declares "main-collection" section with filters and product grid

**Header Group Entry:**
- Location: `sections/header-group.json` (linked group)
- Sections: header.liquid (sticky nav with logo/menu), announcement-bar.liquid, search-modal.liquid
- Responsibilities: Navigation, branding, search functionality

**Footer Group Entry:**
- Location: `sections/footer-group.json` (linked group)
- Sections: footer.liquid with blocks for links, images, text
- Responsibilities: Links, contact info, social, newsletter signup

## Error Handling

**Strategy:** Progressive enhancement with fallback rendering

**Patterns:**

- **Blank Check:** Most rendering blocks check `if product != blank` or `if block.settings.image != blank` before rendering
  - Example: `{% if block.settings.image != blank %} <img> {% else %} {{ placeholder_image | placeholder_svg_tag }} {% endif %}`
  - Location: Used throughout sections (featured-product.liquid, media-grid.liquid)

- **Placeholder Fallbacks:** When product/image missing, render placeholder SVG
  - Example: slideshow.liquid uses `{% cycle 'placeholder': 'lifestyle-1', 'lifestyle-2' %}` when image is blank
  - Location: `sections/slideshow.liquid` lines 20-23

- **Form Validation:** Delegated to Shopify form helpers (built-in validation)
  - Location: `sections/main-product.liquid` (buy_buttons block uses Shopify form)

- **No explicit error logging** - All errors surface as missing content or broken forms
  - Assumption: Theme author/shop owner monitors admin for misconfigurations

## Cross-Cutting Concerns

**Logging:** No explicit logging implemented. Relies on Shopify admin console and browser DevTools.

**Validation:**
- Schema field validation handled by Shopify customizer (enforces required/type)
- Product/collection existence checked with blank conditional rendering
- Form validation handled by Shopify (required field, inventory check)

**Authentication:** Not implemented in theme. Delegated to Shopify (customer login via form submission).

**Color Consistency:**
- Global color schemes defined in settings_data.json
- Sections apply scheme via CSS class: `color-scheme--{{ scheme.id }}`
- CSS custom properties expose color values: `var(--color-scheme-background)`
- Example in header.liquid: `color-scheme color-scheme--{{ section.settings.color_scheme.id }}`

**Responsive Behavior:**
- Mobile: <700px (base, "mobile" class in body)
- Tablet: 700px-1000px (sm: prefix in Liquid classes)
- Desktop: 1000px+ (default, sm: queries kick in)
- Example: `class="h6 sm:h4"` renders h6 on mobile, h4 on tablet+

**Accessibility:**
- ARIA attributes in templates (aria-hidden, role="region")
- Skip-to-content link in layout
- Alt text via `image_tag` filter (auto-generated or manual)
- Example in layout.liquid: `<a href="#main" allow-hash-change class="skip-to-content sr-only">`

**Internationalization:**
- String keys in schema/templates as `t:path.to.key`
- Locales in `locales/*.json` contain translations
- Applied via Liquid filter: `{{ 'general.page' | t: page: current_page }}`
- Supports 32+ languages via multiple locale files

**Performance Optimization:**
- Lazy loading: `loading: 'lazy'` on non-critical images
- Preload: Critical fonts/images use `rel="preload"`
- Asset optimization: Vendored scripts minified (vendor.min.js)
- Example in layout.liquid: `<link rel="preload" href="{{ settings.heading_font | font_url }}" as="font">`

---

*Architecture analysis: 2026-03-10*
