---
phase: quick
plan: 3
type: execute
wave: 1
depends_on: []
files_modified:
  - sections/featured-collections.liquid
  - snippets/project-card.liquid
autonomous: true
requirements: [QUICK-3]

must_haves:
  truths:
    - "Merchant can add a 'project' block in the featured-collections section via the theme editor"
    - "Project blocks accept a metaobject reference to a project metaobject"
    - "Project cards render with image, title, and optional category, linking to the metaobject page URL"
    - "Existing collection blocks continue to work unchanged"
  artifacts:
    - path: "snippets/project-card.liquid"
      provides: "Project metaobject card rendering"
    - path: "sections/featured-collections.liquid"
      provides: "Updated schema with project block type and rendering logic"
  key_links:
    - from: "sections/featured-collections.liquid"
      to: "snippets/project-card.liquid"
      via: "render tag inside project block loop"
      pattern: "render 'project-card'"
---

<objective>
Add a "project" block type to the featured-collections section so merchants can display project metaobject references as cards that link to the project's metaobject page URL (not a product page).

Purpose: The "Explore Projects" section on project pages currently requires a parallel products collection. With a project block type, merchants can reference project metaobjects directly, keeping content management cleaner.

Output: Updated featured-collections.liquid with project block type, new project-card.liquid snippet.
</objective>

<execution_context>
@/Users/rowleythompson/.claude/get-shit-done/workflows/execute-plan.md
@/Users/rowleythompson/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@sections/featured-collections.liquid
@snippets/product-card.liquid
@snippets/product-card-placeholder.liquid
@templates/metaobject/project.json

<interfaces>
<!-- Key patterns from existing product-card.liquid that project-card should mirror -->

product-card.liquid renders inside a `<product-card>` custom element with classes:
- `.product-card` wrapper
- `.product-card__figure` for media
- `.product-card__media` for the link wrapping the image
- `.product-card__image--primary` for the image itself
- `.product-card__info` for text content
- `.product-title` for the title link

featured-collections.liquid renders blocks in a loop (line 66-111):
- Captures `product_list` for each block
- Iterates `block.settings.collection.products` with `limit: block.settings.products_count`
- Renders via `render 'product-card'`
- Uses `product-list` class wrapper for both stacked and carousel layouts

The section schema (line 233-271) defines a single "collection" block type with settings:
collection, products_count, title, link_url, link_text
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create project-card.liquid snippet</name>
  <files>snippets/project-card.liquid</files>
  <action>
Create a new snippet `snippets/project-card.liquid` that renders a project metaobject as a card visually consistent with `product-card.liquid`. The snippet accepts these variables:

- `project` — a metaobject reference (the project metaobject object)
- `reveal` — boolean for scroll reveal animation
- `position` — position in list for eager/lazy loading logic
- `hide_product_information` — boolean to hide text content (image-only grid mode)

Structure (mirror product-card.liquid markup for CSS compatibility):

```liquid
{%- comment -%}
PROJECT CARD COMPONENT
Renders a project metaobject as a card. Mirrors product-card markup for CSS reuse.
Supported variables: project, reveal, position, hide_product_information
{%- endcomment -%}
```

1. Use the same `product-card` CSS class structure so existing grid/carousel styles apply without new CSS. Wrap in `<product-card class="product-card">` (the custom element handles reveal-on-scroll).

2. Image: Use `project.featured_image` for the card image. If the metaobject has a `featured_image` field, render it. If no image, render a placeholder SVG using the same pattern as product-card-placeholder.liquid (`placeholder_svg_tag`). Apply the same aspect ratio classes: `product-card__image product-card__image--primary` plus `object-cover` if `settings.product_image_aspect_ratio contains 'crop'` and `aspect-{{ settings.product_image_aspect_ratio | split: '_' | first }}`.

3. Link: Wrap the image and title in an `<a>` tag linking to `project.system.url` — this is the metaobject's page URL. Do NOT link to a product page.

4. Title: Display `project.title` (metaobject display_name) using `.product-title` class, same as product-card. Apply `line-clamp` with `settings.product_title_max_lines` like product-card does.

5. Category subtitle: If `project.category.value` exists (metaobject reference field), render it as a subtitle using the same `.smallcaps` vendor-like pattern from product-card (where vendor is displayed). Use `project.category.value.title` for the display text. If `hide_product_information` is true, hide all text including category.

6. Lazy loading: Follow same pattern — if `section.index > 3 or position > 3`, use lazy loading strategy.

7. No quick-buy button, no price, no badges, no swatches, no rating — these are product-specific and do not apply to project metaobjects.
  </action>
  <verify>
    <automated>cd /Users/rowleythompson/Projects/claude-projects/shopify/studio-peake-theme && test -f snippets/project-card.liquid && grep -q "project.system.url" snippets/project-card.liquid && grep -q "product-card" snippets/project-card.liquid && echo "PASS" || echo "FAIL"</automated>
  </verify>
  <done>project-card.liquid exists, renders a metaobject as a card linking to project.system.url, reuses product-card CSS classes</done>
</task>

<task type="auto">
  <name>Task 2: Add project block type to featured-collections section</name>
  <files>sections/featured-collections.liquid</files>
  <action>
Modify `sections/featured-collections.liquid` in two places:

**A. Schema — add "project" block type (after the existing "collection" block, around line 270):**

Add a new block type `"project"` with these settings:
- `projects` — type: `list.metaobject_reference.project`, label: "Projects", info: "Select project metaobjects to display"
- `title` — type: `inline_richtext`, label (use existing t-key `t:global.text.heading`), info similar to collection title info: "If empty, defaults to 'Projects'"
- `link_url` — type: `url`, label (use `t:global.text.link_url`)
- `link_text` — type: `text`, label (use `t:global.text.link_text`), default: "View all"

Name the block "Project" (plain string, not a t-key since this is a custom SP block type).

**B. Rendering — update the block loop (lines 66-81) to handle project blocks:**

Inside the `{%- for block in section.blocks -%}` loop, the `{%- capture product_list -%}` block currently only handles collection blocks. Add a conditional branch:

```liquid
{%- if block.type == 'project' -%}
  {%- for project_ref in block.settings.projects -%}
    {%- render 'project-card', project: project_ref, reveal: should_reveal, position: forloop.index, hide_product_information: section.settings.hide_product_information -%}
  {%- else -%}
    {%- for i in (1..4) -%}
      {%- render 'product-card-placeholder', reveal: should_reveal, loop_index: forloop.index0, hide_product_information: section.settings.hide_product_information -%}
    {%- endfor -%}
  {%- endfor -%}
{%- else -%}
  {%- comment -%} existing collection block code {%- endcomment -%}
  {%- for product in block.settings.collection.products limit: block.settings.products_count -%}
    ... (keep existing code unchanged)
  {%- endfor -%}
{%- endif -%}
```

**C. Header link/title — update the header area (lines 43-60):**

The tab navigation button (line 44) already uses `block.settings.title | default: block.settings.collection.title | default: 'Collection'`. Update the fallback chain so project blocks also work:
- Change `default: 'Collection'` to `default: 'Projects'` is NOT correct — instead keep the chain as-is since `block.settings.title` is shared by both block types. The fallback `block.settings.collection.title` will be blank for project blocks, so the final `default: 'Collection'` fallback catches it. This is acceptable, OR change the final default to something more generic. Keep it as `'Collection'` to avoid breaking existing installs — the merchant should set a custom title on project blocks.

The header link area (lines 54-60) references `first_block.settings.link_url | default: first_block.settings.collection.url`. For project blocks, `collection.url` won't exist. The `default:` chain handles this gracefully since `link_url` is the primary setting and `collection.url` is just a fallback. No change needed here — the existing logic works for both block types.

Do NOT modify any other part of the section. The carousel/stack rendering logic, CSS custom properties, and all other settings remain unchanged.
  </action>
  <verify>
    <automated>cd /Users/rowleythompson/Projects/claude-projects/shopify/studio-peake-theme && grep -q '"type": "project"' sections/featured-collections.liquid && grep -q "list.metaobject_reference.project" sections/featured-collections.liquid && grep -q "render 'project-card'" sections/featured-collections.liquid && echo "PASS" || echo "FAIL"</automated>
  </verify>
  <done>featured-collections.liquid schema includes a "project" block type with metaobject reference list setting; rendering loop branches on block.type to render project-card snippet for project blocks; existing collection blocks unchanged</done>
</task>

</tasks>

<verification>
1. Schema validation: The section JSON schema parses without error (Shopify theme editor loads the section)
2. Project block appears in theme editor when adding a block to featured-collections
3. Project cards render with image and title linking to metaobject page URL
4. Collection blocks continue to render identically to before
5. Both stacked and carousel layouts work with project blocks
</verification>

<success_criteria>
- featured-collections section accepts both "collection" and "project" block types
- Project cards link to metaobject page URLs (project.system.url), not product pages
- Visual consistency with existing product cards (same CSS classes, layout)
- No regression to existing collection block functionality
</success_criteria>

<output>
After completion, create `.planning/quick/3-add-project-metaobject-block-type-to-fea/3-SUMMARY.md`
</output>
