# Product Enquiry Modal

## What This Is

A product-specific contact/enquiry modal for the Studio Peake Shopify theme (Prestige v10.7.0 base). When a user clicks the "Enquire" button on any product page, a full-screen modal opens with a 50/50 layout — product image on the left, enquiry form on the right. The product name and image are populated dynamically from the current product. Form submissions go to the store email via Shopify's built-in contact form.

## Core Value

Customers can enquire about any specific product through a visually rich, on-page modal without leaving the product page — with the product context (name, image) carried through automatically.

## Requirements

### Validated

- ✓ Prestige v10.7.0 base theme — installed and configured
- ✓ Overlay group pattern for modals (cart-drawer, newsletter-popup) — existing
- ✓ Drawer/modal web component system — existing in theme.js
- ✓ Product page with block-based layout — existing
- ✓ Button block on product page — existing
- ✓ Shopify contact form action for email submissions — available

### Active

- [ ] Product enquiry modal section in overlay group
- [ ] 50/50 layout: product image left, form right
- [ ] Dynamic product image from current product page
- [ ] Dynamic product title as modal heading
- [ ] Configurable form fields (toggle on/off in theme editor):
  - First Name, Last Name, Company Name, Email Address, Phone Number, Address, Country, Postcode, Notes, Marketing opt-in
- [ ] Form submits to store email via Shopify contact form
- [ ] Product name included in submission (hidden field)
- [ ] "Submit Enquiry" button styled with theme button font
- [ ] Close button (X) top-right of form panel
- [ ] Existing product page button block triggers the modal (via aria-controls)
- [ ] Mobile responsive: stacks vertically (image top, form below)
- [ ] Form field labels use button font (uppercase), inputs use body font
- [ ] Customise existing sections and blocks — no unnecessary new components

### Out of Scope

- Custom email templates — uses Shopify's default contact form notification
- Third-party form integrations (Klaviyo, HubSpot) — Shopify email only
- AJAX form submission — standard Shopify form post with redirect
- Product variant selection within the modal

## Context

- The theme already has a modal/drawer system using web components (`Drawer` class in theme.js) with shadow DOM templates
- The overlay group (`sections/overlay-group.json`) holds global overlays like cart-drawer and newsletter-popup
- Existing `button` block on the product page can point at a modal via `aria-controls`
- Form field labels should match the screenshot: uppercase button font, underline-only inputs
- The product image in the modal should be the featured image, full-height on desktop
- Studio Peake brand colours and typography already configured in theme settings

## Constraints

- **Tech stack**: Shopify Liquid + existing web component patterns (no new JS frameworks)
- **Theme editor**: All form fields must be togglable via section settings in Shopify admin
- **Approach**: Customise existing sections/blocks rather than creating new ones where possible
- **Accessibility**: Modal must trap focus, close on Escape, and label form fields properly

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Shopify contact form action | Simple, no third-party dependency, submissions go to store email | — Pending |
| Configurable fields via settings | Merchant flexibility without code changes | — Pending |
| Reuse existing button block as trigger | Avoid creating a new block type, customise what exists | — Pending |
| Overlay group section | Follows existing theme pattern for modals | — Pending |

---
*Last updated: 2026-03-17 after initialization*
