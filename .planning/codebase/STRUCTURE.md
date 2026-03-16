# Codebase Structure

**Analysis Date:** 2026-03-16

## Directory Layout

```
studio-peake-theme/
├── layout/              # Master HTML template wrapper
│   └── theme.liquid     # Single entry point for all pages
├── templates/           # Page templates (homepage, product, collection, etc.)
│   ├── index.json       # Homepage layout
│   ├── product.json     # Product page layout
│   ├── collection.json  # Collection listing layout
│   ├── page.*.json      # Custom page templates (about, contact, careers, press, faq)
│   ├── article.*.json   # Blog templates
│   ├── customers/       # Customer account pages (login, register, account, addresses, orders)
│   └── metaobject/      # Custom content type templates (projects, artworks, etc.)
├── sections/            # Reusable content sections (60 total)
│   ├── featured-product.liquid      # Large product showcase
│   ├── main-product.liquid          # Primary product page section
│   ├── hero-banner.liquid           # Full-width hero with image/video
│   ├── slideshow.liquid             # Image carousel with text overlays
│   ├── collection-list.liquid       # Product grid/list display
│   ├── header.liquid                # Site header with navigation
│   ├── footer.liquid                # Site footer
│   ├── media-grid.liquid            # Image/video grid layout
│   ├── image-with-text*.liquid      # Content blocks with media + copy
│   ├── sp-*.liquid                  # Studio Peake custom sections
│   └── [50+ additional sections]    # Announcements, carousels, accordions, carousels, tabs, etc.
├── blocks/              # Nested sub-components (12 total)
│   ├── accordion.liquid # Collapsible content block
│   ├── button.liquid    # CTA button block
│   ├── heading.liquid   # Text heading block
│   ├── icon.liquid      # Icon display block
│   ├── image.liquid     # Image block
│   ├── rich-text.liquid # Rich text editor block
│   ├── video.liquid     # Video block
│   └── [5+ additional blocks]
├── snippets/            # Reusable Liquid components (54 total)
│   ├── icon.liquid                  # SVG icon library (82KB)
│   ├── button.liquid                # Styled button component
│   ├── input.liquid                 # Form input elements
│   ├── product-gallery.liquid       # Product image gallery with zoom/video
│   ├── product-info.liquid          # Product details, price, add-to-cart
│   ├── css-variables.liquid         # Dynamic CSS custom properties
│   ├── social-meta-tags.liquid      # Open Graph / Meta tags
│   ├── microdata-schema.liquid      # Structured data markup
│   ├── js-variables.liquid          # JavaScript constants from settings
│   ├── accordion.liquid             # Accordion functionality
│   ├── checkbox.liquid              # Checkbox component
│   ├── address-form.liquid          # Address entry form
│   ├── facets.liquid                # Filter/facet UI for collections
│   ├── active-facets.liquid         # Applied filters display
│   ├── blog-post-card.liquid        # Blog preview card
│   ├── banner.liquid                # Alert/notice banner
│   ├── complementary-products.liquid # "You might also like" section
│   ├── free-shipping-bar.liquid     # Shipping threshold indicator
│   ├── header-*.liquid              # Header sub-components
│   └── [30+ additional snippets]
├── config/              # Theme-wide configuration
│   ├── settings_schema.json         # UI controls for theme customization (color schemes, fonts, spacing)
│   ├── settings_data.json           # Current theme settings values
│   └── markets.json                 # Multi-market configuration
├── assets/              # Compiled static files
│   ├── theme.css                    # Main stylesheet (~170KB)
│   ├── theme.js                     # Main JavaScript bundle (~270KB)
│   ├── vendor.min.js                # Vendor dependencies (~53KB)
│   ├── studio-peake.css             # Studio Peake custom styles (~5.5KB)
│   ├── studio-peake.js              # Studio Peake custom scripts (~589 bytes)
│   ├── custom-fonts.css             # Custom font declarations
│   ├── photoswipe.min.js            # Image gallery library
│   ├── newsletter-popup.js          # Newsletter signup widget
│   ├── mynaruse_flare_regular.ttf   # Custom font file
│   ├── emblem.svg                   # Brand logo asset
│   ├── cursor-zoom-in.svg.liquid    # Interactive SVG asset
│   ├── checkmark.svg.liquid         # SVG component
│   └── documentation.txt            # Asset documentation
├── locales/             # Multi-language translations (32 languages)
│   ├── en.default.json              # English translations + schema
│   ├── en.default.schema.json       # English translation keys schema
│   ├── fr.json, de.json, etc.       # [30 other language translations]
│   └── [Arabic, Chinese, Japanese, Spanish, etc.]
├── copy/                # Content/copy files
│   └── [Marketing copy and text fragments]
├── .planning/           # Project planning (auto-generated, not committed)
│   ├── config.json      # GSD configuration
│   ├── REQUIREMENTS.md  # Feature requirements (deleted, auto-generated)
│   ├── ROADMAP.md       # Project roadmap (deleted, auto-generated)
│   └── codebase/        # Analysis documents
│       ├── ARCHITECTURE.md      # This architecture
│       ├── STRUCTURE.md         # This file
│       ├── STACK.md             # Technology dependencies
│       ├── INTEGRATIONS.md      # External API integrations
│       ├── CONVENTIONS.md       # Coding standards
│       ├── TESTING.md           # Testing patterns
│       └── CONCERNS.md          # Technical debt and issues
├── .shopify/            # Shopify CLI configuration
│   └── metafields.json  # Metafield definitions
├── .claude/             # Claude Code project config
│   └── settings.local.json
├── .git/                # Version control
├── .gitignore           # Git ignore rules
├── .DS_Store            # macOS metadata (not committed)
└── layout/, templates/, etc. in root
```

## Directory Purposes

**layout/**
- Purpose: Master HTML wrapper for all pages
- Contains: Single `theme.liquid` file that wraps all page content
- Key files: `layout/theme.liquid` - Entry point for rendering; includes `<head>`, navigation, footer

**templates/**
- Purpose: Page-type templates that define which sections compose each page
- Contains: JSON config files (not Liquid) that list sections and block configuration
- Key files:
  - `templates/index.json` - Homepage layout (slideshow, product features, etc.)
  - `templates/product.json` - Product detail page (main-product section)
  - `templates/collection.json` - Collection listing page
  - `templates/page.*.json` - Custom pages (about, contact, careers, press, faq)
  - `templates/article.json` - Blog post template
  - `templates/customers/*` - Customer account pages
  - `templates/metaobject/*` - Custom data type templates

**sections/**
- Purpose: Modular, reusable page components with configurable settings
- Contains: 60 Liquid files; each has markup, inline CSS, and schema definition
- Key files (by size/complexity):
  - `sections/main-product.liquid` - Product page, 1807 lines
  - `sections/featured-product.liquid` - Product showcase, 1712 lines
  - `sections/slideshow.liquid` - Image carousel, 832 lines
  - `sections/media-grid.liquid` - Grid layout, 735 lines
  - `sections/header.liquid` - Site navigation, 630 lines
  - `sections/sp-image-carousel-with-text.liquid` - Studio Peake custom carousel, 456 lines

**blocks/**
- Purpose: Nested sub-components within sections (e.g., carousel slides, accordion items)
- Contains: 12 Liquid files; minimal, focused components
- Key files: `accordion.liquid`, `button.liquid`, `heading.liquid`, `icon.liquid`, `image.liquid`

**snippets/**
- Purpose: Reusable Liquid components called from multiple sections
- Contains: 54 Liquid files; shared UI patterns, forms, product components
- Key files by function:
  - **Icons/Assets:** `icon.liquid` (82KB SVG library)
  - **Product Components:** `product-gallery.liquid`, `product-info.liquid`, `buy-buttons.liquid`
  - **Form Elements:** `input.liquid`, `checkbox.liquid`, `address-form.liquid`
  - **Styling/Config:** `css-variables.liquid` (15.9KB), `js-variables.liquid`
  - **Meta/SEO:** `social-meta-tags.liquid`, `microdata-schema.liquid`
  - **Navigation/Filters:** `facets.liquid`, `active-facets.liquid`, `header-sidebar.liquid`
  - **Cards/Previews:** `blog-post-card.liquid`, `product-card.liquid`

**config/**
- Purpose: Theme-wide settings and configuration
- Contains: 3 JSON files
- Key files:
  - `config/settings_schema.json` - UI controls (color schemes, fonts, spacing, features) - 23.5KB
  - `config/settings_data.json` - Current active settings - 8.9KB
  - `config/markets.json` - Multi-market/currency configuration - 14 bytes

**assets/**
- Purpose: Compiled static assets (CSS, JS, fonts, images)
- Contains: 15+ files
- Key files:
  - `assets/theme.css` - Main stylesheet (169.5KB)
  - `assets/theme.js` - Main JS bundle (269.6KB)
  - `assets/vendor.min.js` - Third-party dependencies (53.6KB)
  - `assets/studio-peake.css` - Custom Studio Peake styles (5.5KB)
  - `assets/studio-peake.js` - Custom Studio Peake scripts (589 bytes)
  - `assets/custom-fonts.css` - Font declarations
  - `assets/mynaruse_flare_regular.ttf` - Custom font file
  - `assets/photoswipe.min.js` - Image gallery library

**locales/**
- Purpose: Multi-language translation strings
- Contains: 32 language JSON files
- Key files: `en.default.json`, `en.default.schema.json`, plus translations for FR, DE, ES, IT, JA, ZH-CN, etc.

**copy/**
- Purpose: Marketing content and copy fragments
- Contains: Project-specific text content files
- Usage: Content referenced by sections and pages

**.planning/codebase/**
- Purpose: Code analysis documents (generated by GSD mapping)
- Contains: ARCHITECTURE.md, STRUCTURE.md, STACK.md, INTEGRATIONS.md, CONVENTIONS.md, TESTING.md, CONCERNS.md
- Generated: Yes (auto-generated by `/gsd:map-codebase`)
- Committed: No (in .planning/ which is git-ignored)

## Key File Locations

**Entry Points:**
- `layout/theme.liquid` - Master HTML template; rendered for every page load
- `templates/index.json` - Homepage configuration; defines sections and blocks for /
- `templates/product.json` - Product page; defines main-product section and related sections
- `templates/collection.json` - Collection page; defines collection-list and related sections

**Configuration:**
- `config/settings_schema.json` - All customizable theme settings (colors, fonts, spacing, toggles)
- `config/settings_data.json` - Current active setting values
- `.shopify/metafields.json` - Shopify metafield type definitions

**Core Logic:**
- `snippets/css-variables.liquid` - Computes dynamic CSS custom properties from settings
- `snippets/js-variables.liquid` - Passes Liquid variables to JavaScript
- `snippets/product-gallery.liquid` - Product image/video display with zoom
- `snippets/product-info.liquid` - Product details, price, variants, add-to-cart

**Styling:**
- `assets/theme.css` - Main stylesheet (all utility and component styles)
- `assets/studio-peake.css` - Custom overrides for Studio Peake
- `assets/custom-fonts.css` - Font family declarations

**JavaScript:**
- `assets/theme.js` - Main JS bundle (web components, carousels, form handling)
- `assets/studio-peake.js` - Custom Studio Peake JavaScript
- `assets/vendor.min.js` - Third-party libraries (Shopify dependencies, polyfills)
- `assets/photoswipe.min.js` - Image gallery interaction
- `assets/newsletter-popup.js` - Newsletter signup modal

**Testing:**
- No test files found; this is a theme (client-side only, no test suite)

## Naming Conventions

**Files:**
- Sections: `kebab-case.liquid` (e.g., `featured-product.liquid`, `image-with-text.liquid`)
- Blocks: `kebab-case.liquid` (e.g., `accordion.liquid`, `rich-text.liquid`)
- Snippets: `kebab-case.liquid` (e.g., `product-gallery.liquid`, `css-variables.liquid`)
- Templates: `type.name.json` or `type.json` (e.g., `product.json`, `page.about.json`, `article.image-gallery.json`)
- Assets: `kebab-case.ext` (e.g., `theme.js`, `custom-fonts.css`)
- Locales: `language-code.json` (e.g., `en.default.json`, `fr.json`, `de.json`)

**Directories:**
- Snake_case or kebab-case: `sections`, `blocks`, `snippets`, `templates`, `locales`, `assets`
- Customer paths: `templates/customers/login.json`, `templates/customers/register.json`
- Metaobject paths: `templates/metaobject/project.slug.json`

**CSS Classes:**
- Utility-first: `sm:`, `lg:` prefixes for responsive (Tailwind-like)
- BEM-like: `product-gallery__slide`, `product-info__price`
- State: `.is-selected`, `.is-active`, `.is-sticky`
- Feature flags: `.features--button-transition`, `.features--zoom-image`
- Color schemes: `color-scheme--1`, `color-scheme--bg-hash`

**Liquid Variable Names:**
- camelCase: `productGalleryId`, `isSticky`, `maxImageZoom`
- Section ID: `section.id`, `section.settings`, `section.blocks`
- Settings: `section.settings.product`, `section.settings.color_scheme.id`
- Loop variables: `forloop.first`, `block.shopify_attributes`

## Where to Add New Code

**New Section (e.g., custom gallery feature):**
1. Create `sections/my-new-section.liquid` (copy structure from `sections/featured-product.liquid`)
2. Add Liquid markup in main body
3. Add inline `<style>` with section-specific styles
4. Add `{% schema %}` JSON defining settings and blocks
5. Reference new section in template: add to `templates/index.json` or appropriate page template
6. Test in Shopify admin theme editor

**New Snippet (e.g., utility component):**
1. Create `snippets/my-utility.liquid`
2. Define parameters via Liquid capture/assign or pass via `render 'my-utility' with param: value`
3. Call from sections/blocks via `{% render 'my-utility' with settings: settings %}`
4. Keep logic minimal; prefer configuration over computation

**New Translation String:**
1. Add key to `locales/en.default.json` (e.g., `"my_feature": { "label": "My Feature Label" }`)
2. Add same key to all other language files in `locales/` (or use `t: | default` fallback in Liquid)
3. Reference in Liquid: `{{ 'my_feature.label' | t }}`

**Custom Fonts:**
1. Add font file to `assets/` (e.g., `my-custom-font.ttf`)
2. Update `assets/custom-fonts.css` with `@font-face` declaration
3. Reference in settings schema or CSS variables

**New Asset (JS/CSS):**
1. Add file to `assets/` (e.g., `my-feature.js`, `my-feature.css`)
2. Include in `layout/theme.liquid` if global, or in specific section if local
3. Use `asset_url` filter in Liquid: `{{ 'my-feature.js' | asset_url }}`

**New Custom Page:**
1. Create page in Shopify admin with handle (e.g., "careers")
2. Create template: `templates/page.careers.json`
3. Add sections to JSON (reuse existing section types)
4. Add locale strings to `locales/en.default.json` (and other languages)
5. Theme will automatically use matching template when page is published

**New Metaobject Template:**
1. Define metafield schema in `.shopify/metafields.json`
2. Create template: `templates/metaobject/type.slug.json`
3. Include sections that reference metaobject data
4. Use Liquid object `metaobject.field_name` to access custom data

## Special Directories

**assets/**
- Purpose: Static files served by Shopify CDN
- Generated: No (manually added/maintained)
- Committed: Yes (required for theme to function)
- Notes: CSS/JS files are included in `layout/theme.liquid` with preload/defer hints

**locales/**
- Purpose: Translation strings for UI and marketing copy
- Generated: No (manually edited)
- Committed: Yes (required for multi-language support)
- Notes: 32 languages supported; follow ISO language codes

**config/**
- Purpose: Theme configuration
- Generated: Partially (settings_data.json updated by Shopify admin)
- Committed: Yes (settings_schema.json committed; settings_data.json may drift)
- Notes: settings_schema.json defines UI controls; settings_data.json stores current values

**.planning/**
- Purpose: Project planning and analysis (GSD)
- Generated: Yes (auto-generated by `/gsd:map-codebase`, `/gsd:plan-phase`, etc.)
- Committed: No (git-ignored)
- Notes: Not part of theme; used internally for development planning

**.shopify/**
- Purpose: Shopify CLI and configuration
- Generated: Partially (by Shopify CLI)
- Committed: Yes
- Notes: Contains metafield definitions that sync with Shopify admin

---

*Structure analysis: 2026-03-16*
