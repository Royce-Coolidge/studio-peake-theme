---
phase: 3
slug: product-data-bridge
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — Shopify theme; manual browser testing |
| **Config file** | None |
| **Quick run command** | Open product page, trigger modal, inspect title/image/hidden field |
| **Full suite command** | Navigate between 2+ product pages, verify modal updates for each |
| **Estimated runtime** | ~2 minutes (manual) |

---

## Sampling Rate

- **After every task commit:** Validate via browser dev tools and Shopify preview
- **After every plan wave:** Full manual test across multiple product pages
- **Before `/gsd:verify-work`:** Full suite must pass
- **Max feedback latency:** ~120 seconds (manual)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | DATA-01 | manual | Browser: open modal on product page, verify heading shows product title | N/A | ⬜ pending |
| 03-01-02 | 01 | 1 | DATA-02 | manual | Browser: open modal, verify product image in left panel | N/A | ⬜ pending |
| 03-01-03 | 01 | 1 | DATA-03 | manual | Browser: inspect form HTML, verify hidden field with product name | N/A | ⬜ pending |
| 03-01-04 | 01 | 1 | DATA-04 | manual | Browser: navigate to different product, open modal, verify data updates | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. All validations are manual (Shopify theme — no automated test framework).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Product title in modal heading | DATA-01 | DOM manipulation by JS | Open product page → trigger modal → verify heading text matches product title |
| Product image in left panel | DATA-02 | Visual verification | Open modal on desktop → verify featured image appears full-bleed in left panel |
| Hidden field in form | DATA-03 | Form inspection | Open modal → inspect form HTML → verify hidden input with contact[Product] and correct value |
| Multi-product navigation | DATA-04 | Cross-page behavior | Visit Product A → open modal → verify → navigate to Product B → open modal → verify different data |
| Fallback image | CONTEXT decision | Schema setting behavior | Set fallback image in theme editor → visit product with no image → verify fallback shows |

---

## Validation Sign-Off

- [ ] All tasks have manual verify instructions
- [ ] Sampling continuity: manual check after each task
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
