---
phase: 1
slug: infrastructure-visual-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-12
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual browser testing (no automated test framework in Shopify theme projects) |
| **Config file** | none |
| **Quick run command** | `shopify theme dev --store=studio-peake.myshopify.com` |
| **Full suite command** | Manual cross-browser testing at breakpoints: 375px (mobile), 768px (tablet), 1440px (desktop) |
| **Estimated runtime** | ~30 seconds per section check |

---

## Sampling Rate

- **After every task commit:** Run `shopify theme dev` — verify in browser preview
- **After every plan wave:** Full cross-browser check at 3 breakpoints (375px, 768px, 1440px)
- **Before `/gsd:verify-work`:** All sections with gradient overlays tested with light, dark, and mixed-contrast images
- **Max feedback latency:** ~30 seconds (page reload)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | INFRA | smoke | Browser DevTools Network tab: verify load order and no 404s | N/A | ⬜ pending |
| 01-01-02 | 01 | 1 | INFRA | smoke | Browser console: verify `[Studio Peake]` log, no errors | N/A | ⬜ pending |
| 01-02-01 | 02 | 1 | VISF-01 | manual | DevTools: inspect `::before` and `::after` computed styles on gradient overlay elements | N/A | ⬜ pending |
| 01-02-02 | 02 | 1 | VISF-01 | manual | Shopify admin: toggle gradient setting, verify in preview | N/A | ⬜ pending |
| 01-02-03 | 02 | 1 | VISF-02 | manual | Resize browser window, verify no fixed-height layout breaks | N/A | ⬜ pending |
| 01-02-04 | 02 | 1 | VISF-02 | manual | Set focal point in admin, verify `object-position` in preview | N/A | ⬜ pending |
| 01-02-05 | 02 | 1 | VISF-03 | manual | Upload square vs landscape images, compare text positioning | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `assets/studio-peake.css` — new file, must be created
- [ ] `assets/studio-peake.js` — new file, must be created
- [ ] `snippets/sp-gradient-overlay.liquid` — reusable gradient snippet (if approach uses snippet)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Gradient overlays render on image sections with text | VISF-01 | Visual appearance requires human judgement | Inspect `::before`/`::after` computed styles, verify gradient colours match Figma spec |
| Gradient toggle and strength slider work | VISF-01 | Shopify admin interaction | Toggle checkbox in section settings, adjust opacity slider, verify in preview |
| Images maintain aspect ratio across breakpoints | VISF-02 | Responsive layout requires visual check | Resize browser 375px → 768px → 1440px, verify no distortion |
| Focal point cropping positions correctly | VISF-02 | Requires admin + visual verification | Set focal point on image, verify `object-position` matches |
| Portrait/landscape adaptive layout | VISF-03 | Layout behaviour varies by image content | Upload square and landscape images to same section, compare |

---

## Validation Sign-Off

- [ ] All tasks have manual verify instructions
- [ ] Sampling continuity: browser check after each task commit
- [ ] Wave 0 covers all new file creation
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
