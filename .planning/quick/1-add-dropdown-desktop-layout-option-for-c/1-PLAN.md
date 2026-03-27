---
phase: quick
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - sections/main-collection.liquid
  - snippets/active-facets.liquid
  - locales/en.default.schema.json
  - locales/fr.schema.json
  - assets/studio-peake.css
autonomous: true
requirements: [DROPDOWN-FILTER-LAYOUT]
must_haves:
  truths:
    - "Theme editor shows Dropdown as a third desktop layout option under Filters and sorting"
    - "Selecting Dropdown renders a FILTER button in the collection toolbar on desktop"
    - "Clicking the FILTER button toggles a popover showing filter options with radio-button styling"
    - "Selecting a filter value applies it immediately via AJAX"
    - "On mobile, dropdown popover also appears (same popover behavior as desktop)"
  artifacts:
    - path: "sections/main-collection.liquid"
      provides: "Schema option + template conditionals + popover HTML for dropdown layout"
      contains: "dropdown"
    - path: "assets/studio-peake.css"
      provides: "Radio-button styled filter items in popover"
      contains: "sp-filter-dropdown"
    - path: "locales/en.default.schema.json"
      provides: "English translation for dropdown option"
      contains: "Dropdown"
  key_links:
    - from: "sections/main-collection.liquid"
      to: "snippets/facets.liquid"
      via: "facets-form with update_on_change"
      pattern: "facets-form.*update_on_change"
    - from: "sections/main-collection.liquid"
      to: "assets/studio-peake.css"
      via: "sp-filter-dropdown CSS classes"
      pattern: "sp-filter-dropdown"
---

<objective>
Add a "Dropdown" desktop layout option to the collection page Filters and sorting settings. When selected, filters appear as a popover anchored to a FILTER button in the toolbar, with radio-button-styled filter values matching the brand aesthetic.

Purpose: Give merchants a third, more minimal filter presentation that keeps the page clean while still being accessible from the toolbar.
Output: Working dropdown filter layout selectable in theme editor, with popover behavior on both mobile and desktop.
</objective>

<execution_context>
@/Users/rowleythompson/.claude/get-shit-done/workflows/execute-plan.md
@/Users/rowleythompson/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@sections/main-collection.liquid
@snippets/facets.liquid
@snippets/active-facets.liquid
@locales/en.default.schema.json
@locales/fr.schema.json
@assets/studio-peake.css
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add dropdown schema option, locale translations, and template conditionals</name>
  <files>sections/main-collection.liquid, locales/en.default.schema.json, locales/fr.schema.json, snippets/active-facets.liquid</files>
  <action>
1. In sections/main-collection.liquid schema, find the filter_layout select setting (around line 346-361). Add a third option after "drawer":
   value: "dropdown", label: "t:sections.main-collection.desktop_layout_options.dropdown"

2. In locales/en.default.schema.json, find the desktop_layout_options object (around line 153) and add:
   "dropdown": "Dropdown"

3. In locales/fr.schema.json, find the equivalent desktop_layout_options object and add:
   "dropdown": "Menu d\u00e9roulant"
   (Check whether the file uses Unicode escapes or raw accents and match the convention.)

4. In sections/main-collection.liquid, review ALL existing filter_layout conditionals. The dropdown layout should behave like drawer for grid purposes (full-width, no sidebar column):
   - Line ~77 (CSS grid class): Existing check is filter_layout == 'sidebar' only. Dropdown is NOT sidebar, so no change needed here.
   - Line ~89 (grid-template-columns): Same sidebar-only check, no change needed.
   - Line ~132 (filter button md:hidden when sidebar): Dropdown needs the filter button visible on desktop. Existing logic already only hides for sidebar, so no change needed.
   - Line ~191 (drawer container): For dropdown, the drawer should be completely hidden since the popover is used on ALL screen sizes. Add a `hidden` class (or equivalent) when filter_layout == 'dropdown' so the drawer never shows for this layout.
   - Line ~205-209 (sidebar render): Only renders when sidebar. No change needed.

5. In snippets/active-facets.liquid line ~75: The justify-center class applies when filter_layout == 'drawer'. Add "or section.settings.filter_layout == 'dropdown'" so active facets also center for the dropdown layout.
  </action>
  <verify>
    <automated>cd /Users/rowleythompson/Projects/claude-projects/shopify/studio-peake-theme && grep -n "dropdown" sections/main-collection.liquid locales/en.default.schema.json locales/fr.schema.json snippets/active-facets.liquid | head -20</automated>
  </verify>
  <done>Dropdown appears as selectable option in schema with English and French translations. All template conditionals handle the dropdown case: full-width grid, visible filter button on desktop, drawer hidden on desktop but shown on mobile, active facets centered.</done>
</task>

<task type="auto">
  <name>Task 2: Add dropdown filter popover HTML and custom CSS</name>
  <files>sections/main-collection.liquid, assets/studio-peake.css</files>
  <action>
1. In sections/main-collection.liquid, add the dropdown filter popover HTML inside the toolbar area, near the sort-by popover (around line 150-162). Wrap in a conditional: if section.settings.filter_layout == 'dropdown'

   Follow the existing sort-by popover pattern but use the facets-form component for filter functionality:

   - A wrapper div with class "sp-filter-dropdown"
   - A trigger button with class "button button--outlined sp-filter-dropdown__trigger", aria-controls pointing to the popover id, aria-expanded="false"
   - Button text: use the existing locale key 'collection.faceting.filter' | t, uppercased
   - Include a chevron SVG (small downward arrow, 12x8, stroke currentColor)
   - A popover div with id="filter-dropdown-popover", class "sp-filter-dropdown__popover", initially hidden
   - Inside the popover, a facets-form component with section-id="{{ section.id }}" and update_on_change attribute
   - Inside facets-form, a form with id="FacetFiltersFormDropdown"
   - Loop through collection.filters, for each filter where filter.type == 'list':
     - A group div with class "sp-filter-dropdown__group"
     - A group label paragraph showing filter.label uppercased
     - A ul with role="listbox" containing filter values
     - Each value is a li > label containing:
       - A visually-hidden checkbox input with name="{{ value.param_name }}" value="{{ value.value }}" and checked if value.active
       - A span with class "sp-filter-dropdown__radio-circle" (styled as radio button)
       - A span with the value label uppercased
       - A span showing the count in parentheses

   IMPORTANT: Use checkbox inputs (not radio) because the facets system supports multi-select. The radio-button styling is purely visual per the design screenshots. The facets-form web component with update_on_change handles AJAX submission automatically when inputs change.

2. Add an inline script at the bottom of the dropdown conditional block for toggle behavior:
   - On trigger click: toggle aria-expanded and popover hidden attribute
   - On document click outside .sp-filter-dropdown: close the popover
   - Rotate chevron via CSS (aria-expanded state, no JS needed for rotation)

3. In assets/studio-peake.css, add styles using the sp- namespace:

   .sp-filter-dropdown: position relative, display inline-block

   .sp-filter-dropdown__trigger: inline-flex, align-items center, gap 0.5rem, uppercase, letter-spacing 0.08em, font-size 0.875rem

   .sp-filter-dropdown__chevron: transition transform 0.2s ease
   .sp-filter-dropdown__trigger[aria-expanded="true"] .sp-filter-dropdown__chevron: transform rotate(180deg)

   .sp-filter-dropdown__popover: position absolute, top calc(100% + 0.5rem), right 0, z-index 10, min-width 240px, max-height 400px, overflow-y auto, background rgb(var(--color-background)), border 1px solid rgba(var(--color-foreground), 0.12), border-radius 0.5rem, padding 1rem, box-shadow 0 4px 12px rgba(0,0,0,0.08)

   .sp-filter-dropdown__group + .sp-filter-dropdown__group: margin-top 1rem, padding-top 1rem, border-top 1px solid rgba(var(--color-foreground), 0.08)

   .sp-filter-dropdown__group-label: font-size 0.75rem, letter-spacing 0.1em, color rgba(var(--color-foreground), 0.5), margin-bottom 0.5rem

   .sp-filter-dropdown__options: list-style none, padding 0, margin 0, flex column, gap 0.25rem

   .sp-filter-dropdown__label: display flex, align-items center, gap 0.625rem, padding 0.5rem 0.25rem, cursor pointer, transition opacity 0.15s
   .sp-filter-dropdown__label:hover: opacity 0.7

   .sp-filter-dropdown__radio-circle: width 18px, height 18px, border-radius 50%, border 1.5px solid rgb(74, 38, 43), flex-shrink 0, transition background-color 0.15s
   When checked (.sp-filter-dropdown__label.is-active or :has(input:checked)): background-color rgb(74, 38, 43), box-shadow inset 0 0 0 3px rgb(var(--color-background)) — creates filled radio dot effect

   .sp-filter-dropdown__text: font-size 0.8125rem, letter-spacing 0.08em, uppercase
   .sp-filter-dropdown__count: font-size 0.75rem, color rgba(var(--color-foreground), 0.4), margin-left auto

   Mobile responsiveness: .sp-filter-dropdown__popover on small screens uses min-width 200px and right 0 to fit within viewport. The popover is used on ALL screen sizes (no drawer fallback).
  </action>
  <verify>
    <automated>cd /Users/rowleythompson/Projects/claude-projects/shopify/studio-peake-theme && grep -c "sp-filter-dropdown" assets/studio-peake.css && grep -c "filter-dropdown-popover" sections/main-collection.liquid</automated>
  </verify>
  <done>Filter dropdown popover renders on desktop with FILTER button and chevron. Popover toggles open/closed on click, closes on outside click. Filter values display as radio-button styled items with dark brown brand color circles. Selecting a value applies the filter immediately via facets-form AJAX. Popover hidden on mobile where drawer is used instead.</done>
</task>

</tasks>

<verification>
1. In Shopify theme editor, navigate to Collection page section settings > Filters and sorting
2. Confirm "Dropdown" appears as a third option in Desktop layout setting
3. Select "Dropdown" and preview the collection page on desktop
4. Verify FILTER button visible in toolbar area with chevron
5. Click FILTER button — popover appears below with filter options
6. Filter options show radio-button circles with dark brown brand color
7. Click a filter value — page updates with filtered products via AJAX
8. Click outside popover — it closes
9. Resize to mobile — FILTER dropdown hidden, drawer button appears instead
</verification>

<success_criteria>
- Theme editor shows Sidebar, Drawer, and Dropdown as desktop layout options
- Dropdown layout renders full-width product grid (no sidebar column)
- FILTER button with chevron appears in toolbar on desktop
- Popover toggles on click with smooth chevron rotation
- Filter values display as radio-button styled items with brand color circles
- Selecting a filter applies it immediately via AJAX (update_on_change)
- Popover works on both mobile and desktop (no drawer fallback)
- English and French locale translations present
</success_criteria>

<output>
After completion, create `.planning/quick/1-add-dropdown-desktop-layout-option-for-c/1-SUMMARY.md`
</output>
