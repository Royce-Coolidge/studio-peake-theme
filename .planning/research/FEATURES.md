# Feature Landscape: Product Enquiry Modal

**Domain:** Product enquiry / contact modal for Shopify luxury goods theme
**Researched:** 2026-03-17
**Confidence:** HIGH (requirements confirmed in PROJECT.md; accessibility and UX patterns from WCAG/W3C authoritative sources)

---

## Table Stakes

Features users expect from a product enquiry modal. Missing any of these makes the experience feel broken or incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Product context in modal | User clicked from a product page — they expect the modal to know which product they're asking about | Low | Product name + image pulled dynamically from product page context |
| Product name as modal heading | Confirms to user they're enquiring about the right thing | Low | Use `product.title` via Liquid |
| Product image displayed | Provides visual reassurance; luxury goods especially rely on visual identity | Low | Featured image, full-height on desktop |
| Name fields (first + last) | Standard contact form minimum — who are you? | Low | First and last as separate fields (needed for personalised merchant reply) |
| Email field (required) | Without email, merchant cannot reply | Low | Required; `type="email"` for browser validation |
| Message / Notes field | The actual enquiry — without this the form has no purpose | Low | Textarea; required or optional is a product call |
| Submit button | Obvious | Low | Styled per theme — button font, uppercase |
| Close button (X) | Users must be able to dismiss without submitting | Low | Top-right of form panel; keyboard-accessible |
| Escape key closes modal | WCAG keyboard interaction requirement; also standard UX expectation | Low | Handled by existing `Drawer` web component |
| Focus trap inside modal | Prevents keyboard users from tabbing into background content | Low | WCAG 2.5.3 — existing Drawer pattern should handle |
| Focus returns to trigger on close | Users shouldn't lose their place on the page | Low | Return focus to the "Enquire" button that opened the modal |
| `role="dialog"` + `aria-labelledby` | Screen readers need to announce the modal correctly | Low | Required by WCAG; add to modal container |
| Form field labels visible | Labels must be visible (not just placeholders) — WCAG 1.3.5 | Low | Placeholder-only is an accessibility failure |
| Error messages on invalid submit | User must know what went wrong | Low | Shopify contact form returns errors via `form.errors` |
| Success feedback | User must know submission worked | Low | Standard Shopify contact form `form.posted_successfully?` — show inline message |
| Mobile responsive layout | Most luxury customers browse on mobile | Medium | Stack: image top, form below on mobile; 50/50 on desktop |
| Scroll lock on background | Without this, background scrolls while modal is open — disorienting | Low | `overflow: hidden` on `<body>` when modal open |
| Hidden field for product name | Submission email must include which product was enquired about | Low | `<input type="hidden" name="contact[body]" ...>` or `contact[product]` prefix |

---

## Differentiators

Features that are not universally expected but raise the quality of the experience and suit Studio Peake's luxury positioning.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Configurable field set via theme editor | Merchant can toggle fields without touching code — reduces support burden and future customisation cost | Medium | Shopify section `settings` with `type: "checkbox"` per field; fields render conditionally |
| Optional fields: Company, Phone, Address, Country, Postcode, Marketing opt-in | B2B enquiries need company/address context; marketing opt-in respects consent regulations | Low–Med | Each field is a separate togglable setting; marketing opt-in requires a checkbox input (not a hidden field) |
| Typography parity with brand | Form labels in button font (uppercase); inputs in body font — matches design system | Low | CSS class-driven; labels get `.button-font` or equivalent |
| Full-height product image (desktop) | Creates the editorial 50/50 feel that signals luxury positioning | Low | `object-fit: cover`, `height: 100%` on image container |
| Underline-only input styling | Minimal visual style consistent with luxury aesthetic | Low | Remove default borders; add `border-bottom` only |
| Product name in submission email subject / body | Merchant's inbox immediately identifies which product triggered the enquiry — no manual lookup required | Low | Hidden field ensures context survives form post |

---

## Anti-Features

Things to deliberately NOT build. Each has a reason.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| AJAX / async form submission | Adds JavaScript complexity and failure modes; Shopify contact form is a standard POST — no AJAX needed for MVP | Standard form POST with inline success message |
| Custom email templates | Shopify's contact form notification handles delivery; custom templates require Notification API or Email templates editor and are out of scope | Use default Shopify contact notification |
| Third-party form integrations (Klaviyo, HubSpot) | Adds dependencies, auth tokens, webhook maintenance; out of scope for this milestone | Shopify email via built-in contact form action |
| Variant selection inside modal | Enquiry is about the product category, not a specific variant; adding a variant picker makes the modal a mini-PDP, which is scope creep | Keep focus on enquiry; variant context is irrelevant for an enquiry flow |
| File / image upload | Adds significant complexity (Storefront API, asset handling); not needed for a standard enquiry | Notes textarea is sufficient |
| Multi-step / wizard form | Adds complexity for no gain in this context; the field set is short enough to be single-screen | One screen, scrollable on mobile if needed |
| Auto-open on page load | Interrupts browsing; enquiry modals should only open on explicit user action | Trigger only via "Enquire" button click |
| Nested modals (confirmation dialog inside enquiry modal) | Anti-pattern — removes the emergency exit and disorients users | Inline success message replaces form content on submit |
| Redirect to a separate thank-you page | Breaks the "stay on product page" value proposition; also loses the product context | Inline success state within the modal |
| ReCAPTCHA / spam protection | Shopify's contact form has basic spam protection built in; adding reCAPTCHA requires Google API setup and adds friction | Rely on Shopify's native spam protection |
| Save draft / resume later | Over-engineered for a simple enquiry flow | Users re-open and re-fill if needed |

---

## Feature Dependencies

```
Product context (name + image) → All product-specific display features
  ↳ Dynamic product title as heading
  ↳ Featured image in modal left panel
  ↳ Hidden product name field in form

Form field toggles (theme editor) → Each optional field
  ↳ Company Name field
  ↳ Phone Number field
  ↳ Address / Country / Postcode fields
  ↳ Marketing opt-in checkbox

Modal open/close → All interaction features
  ↳ Focus trap (requires modal to be open)
  ↳ Scroll lock (requires modal to be open)
  ↳ Escape key handler (requires modal to be open)
  ↳ Focus return (requires knowing what opened the modal)

Form submission → Success / error feedback
  ↳ Inline success message (replaces form on posted_successfully?)
  ↳ Error messages (from form.errors)
```

---

## MVP Recommendation

The requirements in PROJECT.md are already well-scoped to a clean MVP. Priority order:

1. Modal open/close with correct accessibility (focus trap, escape, focus return, aria) — foundation; nothing works without this
2. Product context: dynamic title heading + featured image — core value of the feature
3. Contact form with required fields (name, email, notes) + hidden product field — minimum viable enquiry
4. Configurable optional fields via theme editor — merchant value; enables B2B use case
5. Responsive layout (50/50 desktop, stacked mobile) — required for mobile shoppers
6. Brand typography alignment (button font labels, underline inputs) — Studio Peake quality signal

Defer to post-MVP:
- Marketing opt-in field — requires consideration of consent handling (GDPR); low risk to defer
- Country / Address / Postcode fields — B2B edge case; can be toggled off by default

---

## Sources

- [W3C ARIA Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/) — Authoritative; focus trap, role, aria-labelledby requirements (HIGH confidence)
- [Shopify Accessibility Best Practices](https://shopify.dev/docs/storefronts/themes/best-practices/accessibility) — Official Shopify docs (HIGH confidence)
- [Accessible Modal Dialogs: Focus Trapping](https://testparty.ai/blog/modal-dialog-accessibility) — Practical Shopify-context accessibility guide (MEDIUM confidence)
- [Shopify Contact Form Redirect Behaviour](https://community.shopify.com/c/shopify-design/how-can-i-link-my-contact-form-to-a-thank-you-page/) — Community thread confirming default inline success behaviour (MEDIUM confidence)
- [Modal UX Anti-Patterns](https://blog.logrocket.com/ux-design/modal-ux-best-practices/) — UX research on nested modals, overuse patterns (MEDIUM confidence)
- [Shopify Form Design Best Practices](https://www.shopify.com/blog/form-design-examples) — Official Shopify guidance (HIGH confidence)
