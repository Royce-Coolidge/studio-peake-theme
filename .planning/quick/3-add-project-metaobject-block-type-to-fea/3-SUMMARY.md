---
phase: quick
plan: 3
subsystem: sections/snippets
tags: [metaobject, featured-collections, project-card, block-type]
dependency_graph:
  requires: []
  provides: [project-card-snippet, featured-collections-project-block]
  affects: [sections/featured-collections.liquid]
tech_stack:
  added: []
  patterns: [metaobject-reference-block, product-card-css-reuse]
key_files:
  created:
    - snippets/project-card.liquid
  modified:
    - sections/featured-collections.liquid
decisions:
  - "Used list.metaobject_reference + metaobject_type: project for schema field (correct Shopify syntax vs single-string plan notation)"
  - "project.system.display_name used for title (not project.title) — metaobjects expose display name via system object"
  - "project.system.url used for card links — metaobject page URL, not a product page"
  - "Reused product-card CSS classes entirely — no new CSS needed for project cards"
metrics:
  duration: 5
  completed_date: "2026-03-30"
  tasks_completed: 2
  files_modified: 2
---

# Quick Task 3: Add Project Metaobject Block Type to Featured Collections — Summary

**One-liner:** Project metaobject block type added to featured-collections section with a new project-card snippet that mirrors product-card CSS for grid/carousel rendering without new styles.

## What Was Built

**snippets/project-card.liquid** — New snippet rendering a project metaobject as a card visually consistent with product-card. Accepts `project`, `reveal`, `position`, `hide_product_information` variables. Links image and title to `project.system.url`. Displays optional category subtitle from `project.category.value.title`. Supports lazy loading, line-clamp, and reveal-on-scroll via the same `<product-card>` custom element.

**sections/featured-collections.liquid** — Two changes: (1) rendering loop now branches on `block.type == 'project'` to render project-card for project blocks and keep existing product-card rendering for collection blocks; (2) schema gains a "Project" block type with `list.metaobject_reference` (metaobject_type: project) for the projects setting, plus title, link_url, link_text.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create project-card.liquid snippet | 4774283 | snippets/project-card.liquid (created) |
| 2 | Add project block type to featured-collections section | 3dadf31 | sections/featured-collections.liquid (modified) |

## Decisions Made

- **Schema field type:** Plan notation `list.metaobject_reference.project` is shorthand; actual Shopify schema uses `"type": "list.metaobject_reference"` with a separate `"metaobject_type": "project"` field. Used correct syntax.
- **Title field:** Used `project.system.display_name` for the card title — the metaobject display name is accessed via the system object, not a custom field called `title`.
- **URL:** `project.system.url` correctly resolves to the metaobject's page URL in Shopify's metaobject system.
- **CSS reuse:** No new CSS required — `<product-card>` custom element and `.product-card` class hierarchy already handle grid, carousel, reveal, and image aspect ratio.

## Deviations from Plan

None — plan executed exactly as written, with one schema syntax clarification (see Decisions).

## Self-Check

- [x] `snippets/project-card.liquid` exists
- [x] `sections/featured-collections.liquid` contains `block.type == 'project'` branch
- [x] `sections/featured-collections.liquid` contains `"type": "project"` block in schema
- [x] `sections/featured-collections.liquid` contains `render 'project-card'`
- [x] Commit 4774283 exists
- [x] Commit 3dadf31 exists
