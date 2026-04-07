---
phase: quick
plan: 4
subsystem: newsletter-popup
tags: [newsletter, popup, workshop, collections]
key_files:
  modified:
    - sections/newsletter-popup.liquid
decisions:
  - Workshop content moved from /pages/the-workshop to /collections/workshop; popup path check updated to match
metrics:
  completed_date: "2026-04-07"
---

# Quick Task 4: Change Newsletter Popup to Auto-Show on /collections/workshop — Summary

**One-liner:** Updated newsletter popup path detection from `/pages/the-workshop` to `/collections/workshop` to reflect workshop content moving from a page to a collection.

## What Was Done

Three targeted changes to `sections/newsletter-popup.liquid`:

1. **Line 6 comment** — Updated from "workshop page" to "workshop collection"
2. **Line 8 path check** — Changed `request.path contains '/pages/the-workshop'` to `request.path contains '/collections/workshop'`
3. **Line 152 schema paragraph** — Updated descriptive text from "workshop page only" to "workshop collection page only"

All other popup behavior is unchanged: footer subscribe link, delay, show-once, discount code reveal.

## Delivery

Code provided as copy-paste ready snippet for manual application in Shopify editor (per user preference). No commit made.

## Deviations from Plan

None — plan executed exactly as written.
