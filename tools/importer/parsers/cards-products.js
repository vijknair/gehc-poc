/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-products variant.
 * Base block: cards
 * Source selector: .ge-product-feature
 * Generated: 2026-05-15
 *
 * Source structure (validated against live page):
 *   .ge-product-feature-header-eyebrow.text-eyebrow -> eyebrow (e.g. "PRODUCTS")
 *   h2.ge-product-feature-header-title -> section heading
 *   .ge-product-feature-header-bodycopy -> optional sub-heading text
 *   .ge-product-feature-cards > .ge-product-feature-card -> card items
 *     .ge-product-feature-card-media-wraper picture img -> product image
 *     h3.ge-product-feature-card-body-title -> product name
 *     .ge-product-feature-card-body-wraper .text-paragraph-s -> product description
 *     a.ge-product-feature-card-link-custom -> CTA link ("View product")
 *
 * Target table structure:
 *   Row 1: [eyebrow, heading, description (optional)]
 *   Rows 2..N: [image, product name, description, CTA link text]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Section header (eyebrow + heading + optional description)
  const eyebrowEl = element.querySelector('.ge-product-feature-header-eyebrow, .text-eyebrow');
  const headingEl = element.querySelector('h2.ge-product-feature-header-title, .ge-product-feature-header-title');
  const headerDescEl = element.querySelector('.ge-product-feature-header-bodycopy');

  const eyebrowText = eyebrowEl ? eyebrowEl.textContent.trim() : '';
  const headingText = headingEl ? headingEl.textContent.trim() : '';
  const headerDescText = headerDescEl ? headerDescEl.textContent.trim() : '';

  if (eyebrowText || headingText) {
    cells.push([eyebrowText, headingText, headerDescText]);
  }

  // Card rows: one row per product card
  const cards = element.querySelectorAll('.ge-product-feature-card');
  cards.forEach((card) => {
    // Image: get from picture element or fall back to img
    const picture = card.querySelector('.ge-product-feature-card-media-wraper picture, .ge-product-feature-card-media picture');
    const img = card.querySelector('.ge-product-feature-card-media-wraper img, .ge-product-feature-card-media img');
    let imageCell = '';
    if (picture) {
      imageCell = picture;
    } else if (img) {
      imageCell = img;
    }

    // Product name from h3
    const titleEl = card.querySelector('h3.ge-product-feature-card-body-title, .ge-product-feature-card-body-title');
    let titleText = '';
    if (titleEl) {
      // Title may contain a <p> inside it
      const innerP = titleEl.querySelector('p');
      titleText = innerP ? innerP.textContent.trim() : titleEl.textContent.trim();
    }

    // Product description
    const descEl = card.querySelector('.ge-product-feature-card-body-wraper .text-paragraph-s, .ge-product-feature-card-body .text-paragraph-s');
    const descText = descEl ? descEl.textContent.trim() : '';

    // CTA link
    const ctaLink = card.querySelector('a.ge-product-feature-card-link-custom, a.link-cta, .ge-product-feature-card-link a');
    let ctaText = '';
    let ctaHref = '';
    if (ctaLink) {
      const linkTextEl = ctaLink.querySelector('.cmp-link__text');
      ctaText = linkTextEl ? linkTextEl.textContent.trim() : ctaLink.textContent.trim();
      ctaHref = ctaLink.getAttribute('href') || '';
    }

    // Build CTA cell: create link element if href is available, otherwise use text
    let ctaCell = ctaText;
    if (ctaHref && ctaText) {
      const link = document.createElement('a');
      link.href = ctaHref;
      link.textContent = ctaText;
      ctaCell = link;
    }

    cells.push([imageCell, titleText, descText, ctaCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-products', cells });
  element.replaceWith(block);
}
