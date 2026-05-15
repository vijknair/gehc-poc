/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-care-areas
 * Base block: cards
 * Source selector: #RelatedContentModel-1822868214 (.ge-related-content on product page)
 * Source URL: https://www.gehealthcare.com/en-gb/products/ultrasound/point-of-care-ultrasound/venue-fit
 * Generated: 2026-05-15
 *
 * Source structure (product page "Key Care Areas" section):
 *   .ge-related-content
 *     .ge-related-content-container
 *       .ge-related-content-header
 *         .ge-related-content-header-eyebrow .text-eyebrow  -> eyebrow text ("KEY CARE AREAS")
 *         .ge-related-content-header-title h2.title-m       -> section heading
 *       .ge-related-content-cards
 *         .ge-related-content-card (multiple)
 *           .ge-related-content-card-media a[href] picture img -> linked card image (photography)
 *           .ge-related-content-card-body
 *             .ge-related-content-card-body-title h3          -> card title
 *             .ge-related-content-card-body-copy p            -> card description
 *
 * Target table (Cards care-areas):
 *   Row per card: [col1: image, col2: title + description + link]
 *   Eyebrow and section heading are output as default content before the block.
 */
export default function parse(element, { document }) {
  // --- Extract eyebrow and section heading (output as default content above block) ---
  const eyebrowEl = element.querySelector('.ge-related-content-header-eyebrow .text-eyebrow, .text-eyebrow');
  const headingEl = element.querySelector('.ge-related-content-header-title h2, .ge-related-content-header-title h3, h2.title-m');

  // Insert eyebrow as a paragraph before the block
  if (eyebrowEl) {
    const eyebrowP = document.createElement('p');
    eyebrowP.textContent = eyebrowEl.textContent.trim();
    element.before(eyebrowP);
  }

  // Insert section heading before the block
  if (headingEl) {
    const headingClone = headingEl.cloneNode(true);
    element.before(headingClone);
  }

  // --- Extract care area cards ---
  // Primary pattern: .ge-related-content-card (product page care areas)
  let cards = element.querySelectorAll('.ge-related-content-card');

  // Fallback: if using quicklink carousel pattern with real images (not icons)
  if (!cards.length) {
    cards = element.querySelectorAll('.ge-quicklink-card-carousel-slide');
  }

  const cells = [];

  cards.forEach((card) => {
    // --- Image extraction ---
    // Product page pattern: image inside linked media wrapper
    const mediaLink = card.querySelector('.ge-related-content-card-media a, .ge-related-content-card-media-wraper');
    const picture = card.querySelector('picture');
    const img = card.querySelector('.ge-related-content-card-media img, picture img, img');

    let imageCell = '';
    if (picture) {
      imageCell = picture;
    } else if (img) {
      // Only use img if it has a real src (not data URI)
      const src = img.getAttribute('src') || '';
      if (src && !src.startsWith('data:')) {
        imageCell = img;
      }
    }

    // --- Title extraction ---
    const titleEl = card.querySelector('.ge-related-content-card-body-title h3, .ge-related-content-card-body h3, h3');
    const titleText = titleEl ? titleEl.textContent.trim() : '';

    // --- Description extraction ---
    const descEl = card.querySelector('.ge-related-content-card-body-copy p, .ge-related-content-card-body-copy .text-paragraph-s p, .text-paragraph-s p');
    const descText = descEl ? descEl.textContent.trim() : '';

    // --- Link extraction ---
    // The card link comes from the media wrapper <a> or a dedicated CTA link
    const linkEl = mediaLink || card.querySelector('a[href]');
    const linkHref = linkEl ? (linkEl.getAttribute('href') || linkEl.href || '') : '';

    // Skip cards with no meaningful content
    if (!titleText && !imageCell) return;

    // --- Build content cell (col2): title + description + link ---
    const contentContainer = document.createElement('div');

    if (titleText) {
      const titleNode = document.createElement('strong');
      titleNode.textContent = titleText;
      contentContainer.appendChild(titleNode);
    }

    if (descText) {
      const descP = document.createElement('p');
      descP.textContent = descText;
      contentContainer.appendChild(descP);
    }

    if (linkHref) {
      const linkA = document.createElement('a');
      linkA.href = linkHref;
      linkA.textContent = titleText || 'Learn more';
      contentContainer.appendChild(linkA);
    }

    cells.push([imageCell, contentContainer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-care-areas', cells });
  element.replaceWith(block);
}
