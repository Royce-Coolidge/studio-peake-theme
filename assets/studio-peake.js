// Studio Peake custom components and interactions
// Loaded as ES module -- can import from "vendor" via importmap

import { inView, PhotoSwipeLightbox } from "vendor";

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

// === SP Media Grid Lightbox ===

function spInitLightbox(section) {
  if (section._spLightbox) return;

  const grid = section.querySelector("media-grid");
  if (!grid || !grid.querySelector("[data-lightbox-trigger]")) return;

  const lightbox = new PhotoSwipeLightbox({
    gallery: grid,
    children: "[data-lightbox-trigger]",
    pswpModule: () => import("photoswipe"),
  });

  lightbox.addFilter("itemData", (itemData) => {
    const img = itemData.element?.querySelector("img[data-lightbox-src]");
    if (img) {
      itemData.src = img.dataset.lightboxSrc;
      itemData.w = parseInt(img.dataset.lightboxW, 10);
      itemData.h = parseInt(img.dataset.lightboxH, 10);
      itemData.alt = img.dataset.lightboxAlt || "";
      itemData.msrc = img.currentSrc || img.src;
    }
    return itemData;
  });

  lightbox.addFilter("thumbEl", (_thumb, itemData) => {
    return itemData.element?.querySelector("img") || _thumb;
  });

  lightbox.init();
  section._spLightbox = lightbox;
}

function spDestroyLightbox(section) {
  if (section._spLightbox) {
    section._spLightbox.destroy();
    section._spLightbox = null;
  }
}

document.querySelectorAll(".shopify-section--media-grid").forEach(spInitLightbox);

document.addEventListener("shopify:section:load", (e) => {
  if (e.target.classList.contains("shopify-section--media-grid")) {
    spInitLightbox(e.target);
  }
});

document.addEventListener("shopify:section:unload", (e) => {
  if (e.target.classList.contains("shopify-section--media-grid")) {
    spDestroyLightbox(e.target);
  }
});
