# External Integrations

**Analysis Date:** 2026-03-10

## APIs & External Services

**Email Marketing:**
- Mailchimp Email + SMS
  - SDK/Client: Shopify app block integration
  - Auth: App configured directly in Shopify admin
  - Block ID: `shopify://apps/mailchimp-email-sms/blocks/mailchimp_for_shopify_script/e3b67dce-fd41-4b61-b3cf-961c12344cde`
  - Location: `config/settings_data.json` - configured as enabled theme app block
  - Purpose: Newsletter subscription and email campaign integration

**Product Reviews:**
- Judge.me Reviews
  - SDK/Client: Shopify app block integration
  - Auth: App configured directly in Shopify admin
  - Block ID: `shopify://apps/judge-me-reviews/blocks/judgeme_core/61ccd3b1-a9f2-4160-9fe9-4fec8413e5d8`
  - Location: `config/settings_data.json` - configured as enabled theme app block
  - Purpose: Customer product reviews and ratings display
  - Metafield used: `reviews.rating` and `reviews.rating_count` (custom metafield definitions in `.shopify/metafields.json`)

**Google Integration:**
- Google Shopping Feed Integration
  - Metafields defined: Product condition, age group, MPN, custom labels (0-4), gender, size type, size system
  - Namespace: `mm-google-shopping`
  - Purpose: Google Shopping and Google Merchant Center integration

## Data Storage

**Databases:**
- Shopify Admin API - GraphQL/REST
  - Connection: Via Shopify theme system (automatic)
  - Data model: Products, collections, customers, orders (native Shopify)

**Custom Metafields:**
- Product metafields (primary custom data):
  - Namespace: `custom`
    - `flavour` - Product flavor
    - `flavour_description` - Rich text description
    - `flavour_note_description_html` - HTML flavor notes
    - `olive_type` - Product olive variety
    - `fruitiness_level` - Integer 1-9 scale
    - `pepperiness_level` - Integer 1-9 scale
    - `nutritional_information` - Text field
    - `short_description` - Multi-line text
    - `gta` - Award star rating
    - `gta_comment` - Award comment
    - `gta_icon` - Award icon file
    - Food pairing images (3x file references)
    - Food pairing descriptions (3x text fields)
    - Flavour note header and background
  - Namespace: `ecomposer`
    - `countdown` - Date/time for product countdown
    - `countdown_from` - Countdown start date/time
  - Namespace: `reviews`
    - `rating` - Average product rating
    - `rating_count` - Total rating count

- Collection metafields:
  - Namespace: `ecomposer`
    - `collections` - Sub-collection references
  - Namespace: `custom`
    - `product_details` - Collection-level product details
    - `tasting_profile` - Collection flavor profile
    - `description` - Collection description
    - `tagline` - Collection tagline

**File Storage:**
- Shopify CDN - Asset hosting
  - Connection: Automatic through Shopify platform
  - Assets stored in: `assets/` directory
  - URL pattern: `https://cdn.shopify.com/...`

**Caching:**
- Shopify-managed caching layer
- Browser caching via HTTP headers
- No explicit caching service configured

## Authentication & Identity

**Auth Provider:**
- Shopify Native
  - Implementation: Shopify session management
  - Customer authentication via Shopify login
  - No external auth service integration
  - Location: Handled by `layout/theme.liquid` (content_for_header)

## Monitoring & Observability

**Error Tracking:**
- None detected - App relies on Shopify error reporting

**Logs:**
- Browser console logging only
- No centralized logging service configured
- Newsletter popup errors logged to console: `console.error('Failed to copy text: ', err)`

## CI/CD & Deployment

**Hosting:**
- Shopify Theme Hosting
  - Theme deployed via Shopify CLI or Shopify admin
  - Automatic deployment to Shopify CDN

**CI Pipeline:**
- None detected - Manual deployment via Shopify admin or CLI

**Deployment Model:**
- Live theme (currently active)
- Preset themes available (Allure, Couture, Vogue configurations)

## Environment Configuration

**Required env vars:**
- None - theme uses Shopify admin-managed settings

**Secrets location:**
- Shopify Admin Panel (settings stored in `config/settings_data.json`)
- App credentials managed by Shopify platform (Mailchimp, Judge.me)
- No local secrets files

**Theme Settings (publicly accessible):**
- Store: Social media links (Facebook, Twitter, Instagram)
- Store: Favicon reference
- Theme customization: Typography, colors, spacing, borders
- Feature flags: Button transition, image zoom, product rating display

## Webhooks & Callbacks

**Incoming:**
- Shopify Section Events (theme-native):
  - `shopify:section:select` - Section selection in editor
  - `shopify:block:select` - Block selection in editor
  - `shopify:block:deselect` - Block deselection in editor
  - `cart-changed` - Cart update from Shopify
  - Handlers in: `assets/theme.js`

**Outgoing:**
- None detected - theme is read-only consumer of Shopify data

## Shopify-Specific Integrations

**Shopify Cart API:**
- Endpoints used:
  - `GET /cart.js` - Fetch current cart
  - `POST /cart/update.js` - Update cart attributes
  - `POST /cart/change.js` - Change cart line items
  - `POST /cart/prepare_shipping_rates.json` - Get shipping rates by zip/country
  - Location: Cart fetch utility in `assets/theme.js`

**Gift Card Support:**
- QR code generation via Shopify's `vendor/qrcode.js`
- Template: `templates/gift_card.liquid`
- Conditional loading: Only loaded on gift card pages

**Shopify Liquid Global Objects:**
- `shop` - Store information
- `request` - Current request context
- `product` - Product data
- `collection` - Collection data
- `customer` - Customer data
- `settings` - Theme settings from admin
- `page_description`, `page_title`, `canonical_url` - SEO metadata

**Form Handlers:**
- Shopify-native form endpoints (no custom backend)
- Cart forms submit to Shopify endpoints
- Customer account forms use Shopify endpoints

## Social Integration

**Social Media Links:**
- Facebook: `https://www.facebook.com/pyramidchester/`
- Twitter/X: `https://x.com/i/flow/login?redirect_after_login=%2Fpyramidchester`
- Instagram: `https://www.instagram.com/pyramidchester/`
- Social meta tags render via: `snippets/social-meta-tags.liquid`

## Market & Localization

**Markets Configuration:**
- File: `config/markets.json` (currently empty)
- Potential for multi-market support (not currently configured)

**Localization:**
- Liquid translation system with `t` filter
- Language keys: `general.`, `global.`, `theme_settings.` prefixes
- Support for multiple locales managed by Shopify

---

*Integration audit: 2026-03-10*
