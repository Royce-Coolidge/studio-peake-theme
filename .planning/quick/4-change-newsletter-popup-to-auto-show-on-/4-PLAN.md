---
phase: quick
plan: 4
type: execute
wave: 1
depends_on: []
files_modified:
  - sections/newsletter-popup.liquid
autonomous: true
requirements: []
must_haves:
  truths:
    - "Newsletter popup auto-shows on /collections/workshop"
    - "Newsletter popup does NOT auto-show on /pages/the-workshop"
    - "Footer subscribe link still opens popup on any page"
  artifacts:
    - path: "sections/newsletter-popup.liquid"
      provides: "Workshop page detection for auto-show"
      contains: "/collections/workshop"
  key_links: []
---

<objective>
Change the newsletter popup auto-show trigger from /pages/the-workshop to /collections/workshop.

Purpose: The workshop content has moved from a page to a collection. The popup should auto-show on the new URL.
Output: Updated newsletter-popup.liquid with corrected path check and updated comments.
</objective>

<execution_context>
@/Users/rowleythompson/.claude/get-shit-done/workflows/execute-plan.md
@/Users/rowleythompson/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@sections/newsletter-popup.liquid

NOTE: Per user preference, provide copy-paste ready code. Do NOT commit code changes -- user applies manually via Shopify editor.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update workshop path detection in newsletter-popup.liquid</name>
  <files>sections/newsletter-popup.liquid</files>
  <action>
In sections/newsletter-popup.liquid, make these three changes:

1. Line 6 comment -- update from:
   `Only auto-show popup on workshop page; footer subscribe link works on all pages`
   to:
   `Only auto-show popup on workshop collection; footer subscribe link works on all pages`

2. Line 8 path check -- change from:
   `{%- if request.path contains '/pages/the-workshop' -%}`
   to:
   `{%- if request.path contains '/collections/workshop' -%}`

3. Line 152 schema paragraph -- update from:
   `Auto-shows on the workshop page only. Can also be triggered via footer subscribe link on any page.`
   to:
   `Auto-shows on the workshop collection page only. Can also be triggered via footer subscribe link on any page.`

Present the FULL updated file as copy-paste ready code for the user to apply in Shopify editor. Do NOT commit.
  </action>
  <verify>
    <automated>grep -n "collections/workshop" sections/newsletter-popup.liquid | head -5</automated>
  </verify>
  <done>newsletter-popup.liquid contains /collections/workshop instead of /pages/the-workshop. Comment and schema paragraph updated to reflect the collection URL. Footer subscribe link behavior unchanged.</done>
</task>

</tasks>

<verification>
- `grep '/pages/the-workshop' sections/newsletter-popup.liquid` returns no matches
- `grep '/collections/workshop' sections/newsletter-popup.liquid` returns the path check on line 8
- Footer subscribe link code (lines 112-119) is unchanged
</verification>

<success_criteria>
Newsletter popup auto-shows on /collections/workshop instead of /pages/the-workshop. All other popup behavior (footer link trigger, delay, show-once, discount code) remains unchanged.
</success_criteria>

<output>
After completion, create `.planning/quick/4-change-newsletter-popup-to-auto-show-on-/4-SUMMARY.md`
</output>
