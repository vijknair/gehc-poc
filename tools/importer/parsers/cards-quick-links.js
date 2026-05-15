/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-quick-links
 * Base block: cards
 * Source selector: .ge-quicklink-card-carousel
 * Generated: 2026-05-14
 *
 * Source structure:
 *   .ge-quicklink-card-carousel
 *     .ge-quicklink-card-carousel-intro .text-eyebrow  -> eyebrow text ("Explore by category")
 *     .ge-quicklink-card-carousel-slide (multiple)
 *       .ge-quicklink-card-carousel-slide-iamge span img  -> SVG icon (note: "iamge" is a typo in source)
 *       .ge-quicklink-card-carousel-slide-label            -> category label text
 *
 * Target: Cards (quick-links) block table
 *   Each row = one card: col1 = icon image, col2 = label text
 *   Eyebrow text ("Explore by category") is output as default content above the block.
 */
export default function parse(element, { document }) {
  // Extract eyebrow intro text (e.g., "Explore by category")
  const eyebrow = element.querySelector('.ge-quicklink-card-carousel-intro .text-eyebrow');

  // If eyebrow exists, insert it as a paragraph before the block element
  if (eyebrow) {
    const eyebrowPara = document.createElement('p');
    eyebrowPara.textContent = eyebrow.textContent.trim();
    element.before(eyebrowPara);
  }

  // Select all carousel slides (each is a category card)
  // Note: source class has typo "iamge" for image container
  const slides = element.querySelectorAll('.ge-quicklink-card-carousel-slide');

  const cells = [];

  slides.forEach((slide) => {
    // Extract the label text
    const label = slide.querySelector('.ge-quicklink-card-carousel-slide-label');
    const labelText = label ? label.textContent.trim() : '';

    if (!labelText) return;

    // Try to find a real (non-data-URI) icon image on the slide
    const iconImg = slide.querySelector('.ge-quicklink-card-carousel-slide-iamge img')
      || slide.querySelector('.ge-quicklink-card-carousel-slide-image img')
      || slide.querySelector('svg')
      || slide.querySelector('img');

    // Determine if the icon has a usable (non-data:) src
    let hasRealImage = false;
    if (iconImg && iconImg.tagName === 'IMG') {
      const src = iconImg.getAttribute('src') || '';
      if (src && !src.startsWith('data:')) {
        hasRealImage = true;
      }
    }

    // Build row content: [col1 = icon, col2 = label]
    // Source icons are inline SVG data URIs which cannot be serialized to markdown.
    // When a real image URL is available, use the img element directly.
    // Otherwise, generate a placeholder icon paragraph from the label slug.
    // The actual SVG icons should be uploaded to /icons/ in the project.
    const slugLabel = labelText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    let col1;
    if (hasRealImage) {
      col1 = iconImg;
    } else {
      // Create a paragraph with the icon slug as placeholder
      const iconP = document.createElement('p');
      iconP.textContent = `icon-${slugLabel}`;
      col1 = iconP;
    }

    const labelP = document.createElement('p');
    labelP.textContent = labelText;

    cells.push([col1, labelP]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-quick-links', cells });
  element.replaceWith(block);
}
