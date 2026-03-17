---
phase: 4
slug: trigger-wiring
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — Shopify theme; manual browser testing |
| **Config file** | None |
| **Quick run command** | Click enquire button on product page, verify modal opens |
| **Full suite command** | Configure aria_controls in editor, test on multiple products |
| **Estimated runtime** | ~1 minute (manual) |

---

## Sampling Rate

- **After every task commit:** Validate via Shopify preview
- **After every plan wave:** Full manual test
- **Before `/gsd:verify-work`:** Full suite must pass
- **Max feedback latency:** ~60 seconds (manual)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | TRIG-01 | manual | Click enquire button, verify modal opens | N/A | ⬜ pending |
| 04-01-02 | 01 | 1 | TRIG-02 | manual | Theme editor: set aria_controls to enquiry-modal | N/A | ⬜ pending |
| 04-01-03 | 01 | 1 | TRIG-03 | manual | Click button, verify no page navigation | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. All validations are manual.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Button opens modal | TRIG-01 | Browser interaction | Click enquire button on product page → verify modal opens |
| aria_controls configurable | TRIG-02 | Theme editor interaction | Set aria_controls in editor → verify button targets correct modal |
| No page navigation | TRIG-03 | Browser behavior | Click button → verify URL doesn't change, page doesn't reload |

---

## Validation Sign-Off

- [ ] All tasks have manual verify instructions
- [ ] Sampling continuity: manual check after each task
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
