# Technology Stack

**Analysis Date:** 2026-03-16

## Languages

**Primary:**
- Liquid - Shopify template language used for all page templates, sections, blocks, and snippets
- JavaScript/ES modules - Used for interactive components and animations

**Secondary:**
- CSS - Custom styling and component styles
- JSON - Theme configuration, section schemas, and metaobject definitions
- HTML - Markup structure embedded in Liquid templates

## Runtime

**Environment:**
- Shopify Theme runtime (Liquid renderer)
- Browser (Modern ES modules support required)

**Package Manager:**
- None - This is a Shopify theme, not a Node.js project
- No `package.json` or dependency lockfile present

## Frameworks

**Core:**
- Shopify Theme Framework (v10.7.0, "Prestige" base theme) - Custom liquid sections and blocks
- Shopify Metaobjects - Data structure for custom content types (`project` metaobject defined in `templates/metaobject/`)

**Frontend/Interaction:**
- Web Components - Custom elements (`<confirm-button>`, `<copy-button>`, `<share-button>`, `<marquee-text>`, `<dialog-close-button>`, etc.)
- Intersection Observer API - Animation triggering via `inView()` utility from vendor library
- Fetch API - Cart and checkout operations

**Animation/Motion:**
- Motion library (imported as "vendor") - Provides `inView()` for scroll-based animations and `animate()` for animation sequences

**Asset Handling:**
- PhotoSwipe 5.4.4 - Image gallery and lightbox functionality (`assets/photoswipe.min.js`)
- QRCode.js - QR code generation for gift cards

## Key Dependencies

**Critical:**
- Shopify Asset Pipeline - Handles CSS/JS compilation and CDN delivery
- Shopify Liquid Filters - Image processing, translation, URL generation

**Infrastructure:**
- Shopify Font CDN (`fonts.shopifycdn.com`) - Web font delivery for custom typefaces
- Shopify Metafield API - Custom field storage on products, pages, and custom metaobjects
- Shopify Cart API - JavaScript cart manipulation via `/cart.js`, `/cart/add.js`, `/cart/change.js`

## Configuration

**Environment:**
- Shopify store-specific settings configured via Shopify admin
- Theme settings defined in `config/settings_schema.json`
- Color schemes, typography, spacing, and feature toggles configurable through theme editor

**Build:**
- No build system detected - Shopify handles bundling and deployment
- Asset URLs use Shopify liquid filters: `{{ 'filename.js' | asset_url }}`
- Metafield definitions in `.shopify/metafields.json` (auto-generated)

**Theme Configuration Files:**
- `config/settings_schema.json` - Theme editor settings (appearance, colors, typography, social links)
- `config/settings_data.json` - Current theme configuration snapshot
- `.shopify/metafields.json` - Metafield definitions for custom data structures

## Platform Requirements

**Development:**
- Shopify CLI (implied for theme management)
- Text editor with Liquid syntax support
- Modern browser for testing (ES modules support required)
- No build tools required

**Production:**
- Shopify Plus or Standard plan with theme store access
- Deployed via Shopify theme upload/CLI

## Static Assets

**Hosted on Shopify CDN:**
- CSS files:
  - `assets/theme.css` - Core theme styles
  - `assets/custom-fonts.css` - Custom font declarations
  - `assets/studio-peake.css` - Studio Peake custom component layer

- JavaScript files (ES modules):
  - `assets/vendor.min.js` - External libraries (motion library, utility functions)
  - `assets/theme.js` - Core theme components (web components, cart logic)
  - `assets/studio-peake.js` - Studio Peake specific interactions
  - `assets/newsletter-popup.js` - Newsletter signup functionality
  - `assets/photoswipe.min.js` - Image gallery library

- Fonts:
  - `assets/mynaruse_flare_regular.ttf` - Custom display font
  - Web fonts from `fonts.shopifycdn.com`

- Images/Icons:
  - `assets/emblem.svg` - Theme logo/emblem
  - `assets/cursor-zoom-in.svg.liquid` - Liquid-generated SVG for zoom cursor
  - `assets/checkmark.svg.liquid` - Liquid-generated SVG for checkmarks

## API Endpoints (Shopify Native)

**Cart Operations:**
- `GET /cart.js` - Fetch current cart state
- `POST /cart/add.js` - Add items to cart
- `POST /cart/change.js` - Update cart item quantities
- `POST /cart/update.js` - Update cart attributes
- `POST /cart/prepare_shipping_rates.json` - Calculate shipping
- `GET /cart/async_shipping_rates.json` - Async shipping rates

**Metaobject Queries:**
- Via Shopify GraphQL admin API (configured in `.shopify/metafields.json`)
- `project` metaobject with fields for portfolio/project data

---

*Stack analysis: 2026-03-16*
