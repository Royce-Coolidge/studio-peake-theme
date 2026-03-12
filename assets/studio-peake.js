// Studio Peake custom components and interactions
// Loaded as ES module -- can import from "vendor" via importmap

import { inView } from "vendor";

// === SP Link Keyline Draw-On (INTR-04, Phase 4) ===
// Animates bottom border left-to-right when element scrolls into view.

document.querySelectorAll(".sp-link-group").forEach((group) => {
  inView(group, () => {
    group.classList.add("sp-is-visible");
  });
});

document.querySelectorAll(".sp-link-row:not(.sp-link-group .sp-link-row)").forEach((link) => {
  inView(link, () => {
    link.classList.add("sp-is-visible");
  });
});
