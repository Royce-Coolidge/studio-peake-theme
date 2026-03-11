# Technology Stack

**Analysis Date:** 2026-03-10

## Languages

**Primary:**
- Liquid - Shopify template language for theme development
- JavaScript/ES6+ - Client-side interactivity

**Secondary:**
- HTML - Template markup structure
- CSS - Theme styling

## Runtime

**Environment:**
- Shopify Theme Runtime - Merchant-provided Shopify platform

**Platform:**
- Shopify Plus/Advanced Plan - Theme hosting and rendering

## Frameworks

**Core:**
- Prestige Theme v10.7.0 - Base theme framework by Maestrooo
  - Location: Shopify theme template system
  - Purpose: Provides theme foundation, layout components, and styling system

**Frontend Libraries:**
- Motion library (likely) - Animation framework for marquee and carousel functionality
  - Imported as `vendor` in `assets/vendor.min.js`
  - Provides: `inView`, `animate` functions

**UI Components:**
- Web Components (Custom Elements) - For interactive features
  - `confirm-button` - Confirmation dialogs
  - `copy-button` - Clipboard interactions
  - `share-button` - Native share functionality
  - `marquee-text` - Animated marquee text
  - `carousel` - Image/product carousel functionality
  - `quick-buy-modal` - Product quick-view modal
  - `loading-bar` - Loading indicators
  - Located in: `assets/theme.js`

**Image Gallery:**
- PhotoSwipe v5 (minified)
  - File: `assets/photoswipe.min.js`
  - Purpose: Lightbox/image gallery functionality

## Key Dependencies

**Critical:**
- Shopify Liquid - Theme template rendering
- Shopify JavaScript APIs:
  - `Shopify.routes` - Route generation
  - Cart API endpoints (`/cart.js`, `/cart/update.js`, `/cart/change.js`)
  - Shipping rates API (`/cart/prepare_shipping_rates.json`)
  - QR code library (`vendor/qrcode.js` for gift cards)

**Infrastructure:**
- Shopify CDN for fonts - `fonts.shopifycdn.com`
- Custom fonts via Shopify asset pipeline
- Theme asset versioning through Shopify's built-in system

**Vendor JavaScript:**
- `vendor.min.js` (52.5KB) - Contains:
  - Focus trap library
  - Intersection Observer utilities
  - Animation libraries
  - Event handling utilities

## Configuration

**Environment:**
- Theme settings defined via `config/settings_schema.json`
- Theme data stored in `config/settings_data.json`
- No external environment variables required (theme-native configuration only)

**Build:**
- No build process detected
- Assets served directly through Shopify
- Liquid files compiled by Shopify servers
- JavaScript compiled/minified (pre-compiled in assets)

**Theme Configuration Files:**
- `config/settings_schema.json` - Theme customization settings exposed to Shopify admin
- `config/settings_data.json` - Current theme settings and app integrations
- `config/markets.json` - Market/locale configuration (empty in current config)
- `.shopify/metafields.json` - Custom metafield definitions
- Layout: `layout/theme.liquid`

## Platform Requirements

**Development:**
- Shopify CLI (for local development)
- Web browser with JavaScript ES6+ support
- No Node.js/npm required for theme itself

**Production:**
- Shopify store account (any plan level)
- Modern browser support required (ES6+, Web Components, CSS Grid, Flexbox)
- Internet connection for Shopify CDN assets

**Browser Requirements:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14.1+
- Modern mobile browsers

## Asset Pipeline

**CSS:**
- `assets/theme.css` - Main stylesheet
- `assets/custom-fonts.css` - Custom font definitions
- CSS variables for theming (configured in theme settings)

**JavaScript:**
- `assets/theme.js` (5,868 lines) - Main application bundle
- `assets/vendor.min.js` (22 lines minified) - Vendor dependencies
- `assets/photoswipe.min.js` - Image gallery library
- `assets/newsletter-popup.js` (83 lines) - Newsletter subscription popup

**Fonts:**
- Custom fonts served via Shopify asset pipeline:
  - Located in: `assets/` directory
  - Example: `roxboroughcf-medium.otf`

**Images/Media:**
- SVG assets: `assets/checkmark.svg`, `assets/cursor-zoom-in.svg`
- Served through Shopify CDN

---

*Stack analysis: 2026-03-10*
