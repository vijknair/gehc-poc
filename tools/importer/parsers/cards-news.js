/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-news variant.
 * Base block: cards
 * Source selector: .ge-related-content
 * Generated: 2026-05-14
 *
 * Source structure:
 *   .ge-related-content-header .text-eyebrow -> eyebrow text
 *   .ge-related-content-cards > .ge-related-content-card -> card items
 *     .ge-related-content-card-media a picture img -> linked card image
 *     .ge-related-content-card-body-title h3 -> article title
 *     .ge-related-content-card-body-copy .text-paragraph-s p -> optional category
 *     .ge-related-content-card-metadata-publishdate -> publish date
 *   .ge-related-content-link a -> trailing CTA link
 *
 * Target table (from library example):
 *   Row 1: [empty, eyebrow, empty, empty]
 *   Rows 2..N: [image, title, category (optional), date]
 *   Last row: [empty, link text, empty, link href]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Eyebrow header
  const eyebrowEl = element.querySelector('.ge-related-content-header .text-eyebrow');
  const eyebrowText = eyebrowEl ? eyebrowEl.textContent.trim() : '';
  if (eyebrowText) {
    cells.push(['', eyebrowText, '', '']);
  }

  // Card rows: one row per card
  const cards = element.querySelectorAll('.ge-related-content-card');
  cards.forEach((card) => {
    // Image: get the picture element (or fall back to img) inside the media link
    const mediaLink = card.querySelector('.ge-related-content-card-media a');
    const picture = card.querySelector('.ge-related-content-card-media picture');
    const img = card.querySelector('.ge-related-content-card-media img');

    let imageCell = '';
    if (picture && mediaLink) {
      // Wrap picture in a link to preserve the card's destination URL
      const link = document.createElement('a');
      link.href = mediaLink.href;
      link.appendChild(picture.cloneNode(true));
      imageCell = link;
    } else if (img && mediaLink) {
      const link = document.createElement('a');
      link.href = mediaLink.href;
      link.appendChild(img.cloneNode(true));
      imageCell = link;
    } else if (picture) {
      imageCell = picture;
    } else if (img) {
      imageCell = img;
    }

    // Title (h3)
    const titleEl = card.querySelector('.ge-related-content-card-body-title h3, .ge-related-content-card-body h3');
    const titleText = titleEl ? titleEl.textContent.trim().replace(/\s+/g, ' ') : '';

    // Optional category
    const categoryEl = card.querySelector('.ge-related-content-card-body-copy .text-paragraph-s p, .ge-related-content-card-body-copy p');
    const categoryText = categoryEl ? categoryEl.textContent.trim() : '';

    // Date
    const dateEl = card.querySelector('.ge-related-content-card-metadata-publishdate');
    const dateText = dateEl ? dateEl.textContent.trim() : '';

    cells.push([imageCell, titleText, categoryText, dateText]);
  });

  // Trailing CTA row
  const ctaLink = element.querySelector('.ge-related-content-link a.link-cta, .ge-related-content-link a');
  if (ctaLink) {
    const linkTextEl = ctaLink.querySelector('.cmp-link__text');
    const linkText = linkTextEl ? linkTextEl.textContent.trim() : ctaLink.textContent.trim();
    const linkHref = ctaLink.getAttribute('href') || '';
    cells.push(['', linkText, '', linkHref]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
