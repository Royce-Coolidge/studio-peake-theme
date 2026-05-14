# Studio Peake Theme

Custom Shopify theme for Studio Peake, built on the **Prestige** base theme (v10.7.0). Liquid + ES-module JavaScript + hand-rolled CSS. No build step — Shopify handles bundling and CDN delivery.

---

## Quick Start

Requires the [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) and access to the Studio Peake Shopify store.

```bash
# Authenticate once
shopify login --store studio-peake.myshopify.com

# Boot a local dev server with hot reload against the live store data
shopify theme dev

# Pull the live theme's settings_data.json / templates if you need to sync
shopify theme pull --live

# Push to a development theme (creates an unpublished theme to preview)
shopify theme push --unpublished --json

# Push to a specific theme by ID
shopify theme push --theme=<theme_id>
```

`shopify theme dev` proxies the store and live-reloads on file changes. **Never push directly to the published theme** — push to an unpublished theme, share the preview URL, then publish from the admin once approved.

---

## Stack

| Layer | Tech |
|---|---|
| Templating | Liquid (Shopify) |
| Client JS | ES modules (no bundler) via `<script type="module">` + importmap |
| Styling | Plain CSS with CSS custom properties; utility-first class names (`sm:`, `lg:` prefixes) |
| Animation | [Motion](https://motion.dev/) — imported as `vendor` (alias in importmap) |
| Gallery | PhotoSwipe 5.4.4 (`assets/photoswipe.min.js`) |
| Misc | QRCode.js (gift cards), Intersection Observer (scroll triggers) |
| Data | Shopify products/collections + a custom `project` metaobject for portfolio entries |
| i18n | 32 locales under `locales/` |

There is **no `package.json`, no Node toolchain, no test suite**. Everything ships as-is to Shopify's asset CDN.

---

## Directory Layout

```
layout/        theme.liquid — the single HTML wrapper for every page
templates/     JSON page configs (index, product, collection, page.*, article.*, customers/, metaobject/)
sections/      60 modular content sections (each: markup + inline <style> + {% schema %})
blocks/        12 nested sub-components used inside sections
snippets/      54 reusable Liquid partials, rendered via {% render %}
config/        settings_schema.json (theme-editor controls) + settings_data.json (current values) + markets.json
assets/        Compiled CSS, JS, fonts, SVGs — served from Shopify CDN
locales/       32 translation JSON files
copy/          Marketing copy drafts (reference only, not rendered)
.shopify/      metafields.json — metafield/metaobject definitions synced with admin
```

### Critical files

- `layout/theme.liquid` — page shell, asset loading, header/footer
- `snippets/css-variables.liquid` (~16KB) — computes dynamic CSS custom properties from theme settings
- `snippets/js-variables.liquid` — bridges Liquid values into JS
- `snippets/icon.liquid` (~82KB) — central SVG icon library
- `sections/main-product.liquid` (1807 lines) — product page
- `sections/featured-product.liquid` (1712 lines) — homepage product showcase
- `assets/theme.css` / `assets/theme.js` — base Prestige bundle (don't edit unless you mean it)
- `assets/studio-peake.css` / `assets/studio-peake.js` — Studio Peake overrides and additions

---

## Studio Peake vs Prestige

The base theme is Shopify's Prestige. Studio Peake-specific additions follow a consistent prefix so you can tell custom code from vendor code at a glance:

| Prefix / location | Meaning |
|---|---|
| `sections/sp-*.liquid` | Custom sections built for Studio Peake |
| `snippets/sp-*.liquid` | Custom snippets (e.g. `sp-focal-image`, `sp-gradient-overlay`) |
| `assets/studio-peake.{css,js}` | Custom styles/scripts |
| CSS class `.sp-*` | Custom classes (`.sp-link-group`, `.sp-focal-image`, `.sp-is-visible`) |
| Liquid var `sp_*` | Scoped variables inside custom snippets |

**Rule of thumb:** prefer adding new `sp-*` files over editing Prestige sections. If you must edit a vendor file, leave a `{% comment %} === SP override === {% endcomment %}` marker so future merges from Prestige updates can find it.

---

## Adding Things

### A new section

1. Copy an existing `sections/sp-*.liquid` as a starting point.
2. Markup → inline `<style>` (scoped via `#shopify-section-{{ section.id }}`) → `{% schema %}` block at the bottom.
3. Add settings/blocks in the schema; reference them via `section.settings.*` and loop `section.blocks`.
4. Wire it into a template under `templates/*.json` (or let merchants add it via the theme editor if `presets` is defined).
5. Add any new strings to `locales/en.default.json` + `en.default.schema.json` (schema labels live there).

### A new snippet

1. Create `snippets/sp-my-thing.liquid`.
2. Document parameters in a Liquid comment header at the top of the file (existing snippets follow this pattern).
3. Render with explicit named params: `{% render 'sp-my-thing', image: section.settings.image, sizes: '100vw' %}`.

### A new translation key

Add the key to `locales/en.default.json` first, then mirror it to all other locales (or rely on `| default:` fallback in Liquid). Schema labels go in `en.default.schema.json`.

### A custom page (e.g. /pages/about)

1. Create the page in Shopify admin with a handle (e.g. `about`).
2. Add `templates/page.about.json` listing the sections.
3. Theme auto-binds the template to the page by handle.

### A new metaobject template

1. Define the metafield/metaobject schema in `.shopify/metafields.json` and sync via `shopify theme metafields pull` (or via admin).
2. Add `templates/metaobject/<type>.<slug>.json`. See `templates/metaobject/project.kensington-townhouse.json` for the pattern.

---

## Conventions

- **Indentation:** 2 spaces everywhere (Liquid, CSS, JS).
- **File names:** `kebab-case.liquid` / `kebab-case.css` / `kebab-case.js`.
- **JS:** camelCase, ES modules only, guard-clause-style early returns, fall back gracefully (e.g. clipboard API → `execCommand`).
- **Liquid vars:** `snake_case`, prefixed with the component name when scoped (`sp_sizes`, `sp_focal`).
- **CSS:** BEM-like (`block__element--modifier`); state classes use `.is-*` or `.sp-is-*`.
- **CSS custom props:** kebab-case with `--` prefix; colors stored as RGB triplets and wrapped at use-site: `rgb(var(--text-color))`.
- **Comments:** purpose header at top of each snippet; section dividers use long dashed banners.
- **Linting:** none configured. Match what's around the code you're editing.

---

## Theme Settings & Customization

- Merchant-editable settings live in `config/settings_schema.json` (controls) and `config/settings_data.json` (current values).
- Colors are managed via the **color scheme** group — sections apply `class="color-scheme color-scheme--{{ section.settings.color_scheme.id }}"` to inherit a palette. Don't hardcode colors; pull from the active scheme.
- Fonts come from the Shopify Font CDN (`fonts.shopifycdn.com`) plus the custom `mynaruse_flare_regular.ttf` declared in `assets/custom-fonts.css`.
- `settings_data.json` drifts whenever someone edits in the admin — pull it before making schema changes you want to keep in sync.

---

## Deployment

| Action | Command |
|---|---|
| Preview a branch on an unpublished theme | `shopify theme push --unpublished --json` |
| Update an existing dev theme | `shopify theme push --theme=<id>` |
| Pull live settings_data / templates | `shopify theme pull --live` |
| List themes on the store | `shopify theme list` |
| Diff before pushing | `shopify theme push --dry-run` |

No CI/CD pipeline is configured — pushes are manual. The `.gitignore` only excludes `.DS_Store`, so theme settings and assets are tracked in git. Recent commits with the prefix `Update from Shopify for theme studio-peake-theme/main` come from Shopify's GitHub integration syncing changes made in the admin.

---

## Gotchas

- **No build step.** `assets/theme.js` and `assets/vendor.min.js` are pre-bundled; don't try to `import` from a third-party npm package — add it as a vendor file in `assets/` or pull it in via the importmap.
- **`settings_data.json` is a live document.** Pull from the store before editing, or your changes will be overwritten on the next admin save.
- **Inline section styles use `#shopify-section-{{ section.id }}`** as the scope selector. Don't write global styles inside a section's `<style>` block.
- **Section/block schema is JSON, not Liquid.** No comments, no trailing commas. The theme editor will silently refuse to load a section with malformed schema.
- **Translations are required for the locales you ship.** Missing keys fall back to the key name in the UI — check the theme editor language switcher when adding strings.
- **Customer account pages** at `templates/customers/*.json` use Shopify's classic accounts. If the store flips to "new customer accounts," these templates stop being used.

---

## Planning & Docs

Detailed codebase analysis lives in `.planning/codebase/` (git-ignored): `STACK.md`, `ARCHITECTURE.md`, `STRUCTURE.md`, `CONVENTIONS.md`, `TESTING.md`, `INTEGRATIONS.md`, `CONCERNS.md`. Re-generate with `/gsd:map-codebase` after significant changes.
