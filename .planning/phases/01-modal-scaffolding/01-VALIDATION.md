---
phase: 1
slug: modal-scaffolding
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual browser testing (Shopify theme — no automated test framework) |
| **Config file** | none |
| **Quick run command** | `shopify theme dev` (visual inspection) |
| **Full suite command** | `shopify theme check` (Liquid linting) |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `shopify theme check` for Liquid/schema errors
- **After every plan wave:** Visual inspection via `shopify theme dev`
- **Before `/gsd:verify-work`:** Full theme check must pass
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | MODL-01 | manual | Visual: modal opens as overlay | N/A | ⬜ pending |
| 01-01-02 | 01 | 1 | MODL-05 | manual | Check overlay-group.json has section | N/A | ⬜ pending |
| 01-01-03 | 01 | 1 | MODL-06 | manual | Inspect DOM for id="enquiry-modal" | N/A | ⬜ pending |
| 01-01-04 | 01 | 1 | MODL-02 | manual | Visual: 40/60 grid on desktop | N/A | ⬜ pending |
| 01-01-05 | 01 | 1 | MODL-03 | manual | Visual: single column on mobile | N/A | ⬜ pending |
| 01-01-06 | 01 | 1 | MODL-04 | manual | Close button with animation | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework setup needed — Shopify themes use visual/manual validation.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Modal opens on trigger click | MODL-01 | Browser interaction required | Click element with aria-controls="enquiry-modal", verify overlay appears |
| 40/60 desktop layout | MODL-02 | Visual layout check | Open modal at >1000px viewport, verify image 40% / content 60% |
| Single column mobile | MODL-03 | Visual layout check | Open modal at <700px viewport, verify form-only single column |
| Close button animation | MODL-04 | Animation requires visual check | Click X, verify close icon inherits theme animation |
| Focus trap + scroll lock | MODL-01 | Keyboard interaction required | Tab through modal, verify focus stays trapped; verify body scroll locked |
| Theme editor survival | MODL-01 | Editor interaction required | Open modal in theme editor, switch sections, verify modal still functions |
| Overlay group registration | MODL-05 | Config file check | Verify overlay-group.json contains enquiry-modal section |

---

## Validation Sign-Off

- [ ] All tasks have manual verify instructions
- [ ] Sampling continuity: theme check after each commit
- [ ] No automated test framework needed (Shopify theme)
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
