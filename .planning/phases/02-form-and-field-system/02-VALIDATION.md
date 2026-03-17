---
phase: 2
slug: form-and-field-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — Shopify theme; manual browser/editor testing |
| **Config file** | None |
| **Quick run command** | Open Shopify theme editor, verify block toggle + preview |
| **Full suite command** | Submit form on development store; check store owner email |
| **Estimated runtime** | ~2 minutes (manual) |

---

## Sampling Rate

- **After every task commit:** Validate via Shopify theme editor preview
- **After every plan wave:** Full manual test on development store
- **Before `/gsd:verify-work`:** Full suite must pass
- **Max feedback latency:** ~120 seconds (manual)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | FORM-01 | manual | Theme editor toggle + browser preview | N/A | ⬜ pending |
| 02-01-02 | 01 | 1 | FORM-02 | manual | Theme editor toggle + browser preview | N/A | ⬜ pending |
| 02-01-03 | 01 | 1 | FORM-03 | manual | Theme editor toggle + browser preview | N/A | ⬜ pending |
| 02-01-04 | 01 | 1 | FORM-04 | manual | Theme editor toggle + browser preview | N/A | ⬜ pending |
| 02-01-05 | 01 | 1 | FORM-05 | manual | Theme editor toggle + browser preview | N/A | ⬜ pending |
| 02-01-06 | 01 | 1 | FORM-06 | manual | Theme editor toggle + browser preview | N/A | ⬜ pending |
| 02-01-07 | 01 | 1 | FORM-07 | manual | Browser: open modal, inspect country dropdown | N/A | ⬜ pending |
| 02-01-08 | 01 | 1 | FORM-08 | manual | Theme editor toggle + browser preview | N/A | ⬜ pending |
| 02-01-09 | 01 | 1 | FORM-09 | manual | Browser: open modal, inspect textarea | N/A | ⬜ pending |
| 02-01-10 | 01 | 1 | FORM-10 | manual | Theme editor: change disclaimer text, verify update | N/A | ⬜ pending |
| 02-02-01 | 02 | 1 | SUBM-01 | manual | Submit form on dev store; check store email inbox | N/A | ⬜ pending |
| 02-02-02 | 02 | 1 | SUBM-02 | manual | Submit valid form; verify success state inline | N/A | ⬜ pending |
| 02-02-03 | 02 | 1 | SUBM-03 | manual | Submit valid form; verify heading text | N/A | ⬜ pending |
| 02-02-04 | 02 | 1 | SUBM-04 | manual | Submit on desktop; verify 40/60 layout preserved | N/A | ⬜ pending |
| 02-02-05 | 02 | 1 | SUBM-05 | manual | Verify submit button text is "Submit Enquiry" | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. All validations are manual (Shopify theme — no automated test framework).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Field toggle on/off | FORM-01 through FORM-10 | Shopify theme editor interaction | Open theme editor → select Product Enquiry Modal → add/remove field blocks → verify preview updates |
| Form sends email | SUBM-01 | Requires dev store email delivery | Submit form on dev store → check store owner inbox for contact notification |
| Success state inline | SUBM-02, SUBM-03 | Requires page reload with posted_successfully? | Submit valid form → verify modal shows success heading without full page navigation |
| Success state layout | SUBM-04 | Visual verification | Submit on desktop → verify image panel visible, 40/60 layout preserved |
| Form reset on close | CONTEXT decision | JS event handler behavior | Close modal after success → reopen → verify fresh empty form |
| Paired field layout | STYL-04 (carried) | CSS layout behavior | Enable First + Last Name → verify 50/50 desktop, 100% mobile; enable only one → verify full width |

---

## Validation Sign-Off

- [ ] All tasks have manual verify instructions
- [ ] Sampling continuity: manual check after each task
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
