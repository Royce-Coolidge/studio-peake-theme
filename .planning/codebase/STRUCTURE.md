# Codebase Structure

## Directory Layout

```
studio-peake-theme/
├── assets/           # Static assets (JS, CSS, fonts, SVGs)
├── blocks/           # Theme blocks (11 block types)
├── config/           # Theme configuration (settings_schema, settings_data, markets)
├── layout/           # Theme layouts (theme.liquid)
├── locales/          # Translation/localization files
├── sections/         # Theme sections (62 section files)
├── snippets/         # Reusable Liquid snippets (51 snippets)
├── templates/        # Page templates (20 templates, JSON + Liquid)
│   └── customers/    # Customer account templates
└── .planning/        # Project planning documents
```

## Key Locations

### Assets (`assets/`)
- `theme.js` (5,868 lines) — Main JavaScript bundle, monolithic
- `theme.css` (169KB) — Main stylesheet
- `vendor.min.js` (53KB) — Third-party vendor scripts
- `photoswipe.min.js` (60KB) — Image lightbox library
- `newsletter-popup.js` — Standalone newsletter popup script
- `custom-fonts.css` — Custom font declarations (currently empty)
- `roxboroughcf-medium.otf` — Custom font file
- SVG assets: `checkmark.svg`, `cursor-zoom-in.svg` (with .liquid variants)

### Sections (`sections/`) — 62 files
**Largest/most complex:**
- `main-product.liquid` (1,807 lines) — Product detail page
- `featured-product.liquid` (1,712 lines) — Featured product section
- `slideshow.liquid` (832 lines) — Hero slideshow
- `media-grid.liquid` (655 lines) — Media grid layout
- `header.liquid` (630 lines) — Site header/navigation

**Group JSON sections:**
- `header-group.json` — Header section group
- `footer-group.json` — Footer section group

### Snippets (`snippets/`) — 51 files
**UI Components:** `button.liquid`, `banner.liquid`, `icon.liquid`, `checkbox.liquid`, `input.liquid`
**Product/Commerce:** `buy-buttons.liquid`, `price-list.liquid`, `inventory.liquid`, `pickup-availability.liquid`, `line-item.liquid`
**Navigation:** `mega-menu.liquid`, `mega-menu-images.liquid`, `header-search.liquid`, `header-sidebar.liquid`
**Layout/Style:** `css-variables.liquid`, `js-variables.liquid`, `direction.liquid`
**SEO/Data:** `microdata-schema.liquid`, `predictive-search-result-item.liquid`
**Filtering:** `facets.liquid`, `active-facets.liquid`, `option-value.liquid`

### Blocks (`blocks/`) — 11 files
- `accordion.liquid`, `badge.liquid`, `button-group.liquid`, `button.liquid`
- `heading.liquid`, `icon.liquid`, `image.liquid`, `liquid.liquid`
- `page-content.liquid`, `rich-text.liquid`, `video.liquid`

### Templates (`templates/`) — 20 files
**JSON templates:** `index.json`, `product.json`, `collection.json`, `cart.json`, `blog.json`, `article.json`, `search.json`, `page.json`, `404.json`, `password.json`, `list-collections.json`
**Alternate templates:** `product.pre-order.json`, `collection.artist-collection-page.json`, `collection.cat-product-list-page.json`, `page.about.json`, `page.contact.json`, `page.faq.json`, `article.image-gallery.json`
**Liquid template:** `gift_card.liquid`
**Customer templates:** `templates/customers/` subdirectory

### Configuration (`config/`)
- `settings_schema.json` — Theme settings schema definition
- `settings_data.json` — Current theme settings values
- `markets.json` — Market/region configuration

### Layout (`layout/`)
- `theme.liquid` — Single main layout file (entry point for all pages)

## Naming Conventions

### Files
- **Sections:** `kebab-case.liquid` — descriptive names matching functionality
- **Sections with `main-` prefix:** Page-specific main content sections (e.g., `main-product.liquid`, `main-collection.liquid`, `main-cart.liquid`)
- **Snippets:** `kebab-case.liquid` — component/utility names
- **Blocks:** `kebab-case.liquid` — simple content type names
- **Templates:** `type.variant.json` format (e.g., `product.pre-order.json`, `page.about.json`)
- **Assets:** `kebab-case` with appropriate extensions

### Code Patterns
- Liquid variables: `snake_case` (e.g., `product_form_id`, `color_scheme`)
- CSS classes: `kebab-case` (e.g., `.section-header`, `.product-form`)
- JavaScript: Custom elements with `kebab-case` tag names
- Schema block types: `kebab-case` identifiers

## File Count Summary

| Directory | Count | Primary Extension |
|-----------|-------|-------------------|
| sections  | 62    | .liquid, .json    |
| snippets  | 51    | .liquid           |
| templates | 20    | .json, .liquid    |
| blocks    | 11    | .liquid           |
| assets    | 12    | .js, .css, .svg, .otf |
| config    | 3     | .json             |
| layout    | 1     | .liquid           |
| locales   | varies| .json             |
