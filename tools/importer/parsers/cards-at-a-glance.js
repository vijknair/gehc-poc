/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-at-a-glance variant.
 * Base block: cards
 * Source selector: .ge-features-list
 * Source URL: https://www.gehealthcare.com/en-gb/products/ultrasound/point-of-care-ultrasound/venue-fit
 * Generated: 2026-05-15
 *
 * Extracts "At a Glance" feature cards from a product detail page.
 * Each card has an icon (SVG), a headline (h3 > p), and a short description (.text-paragraph-s p).
 * Output: one row per card with icon in col1, headline in col2, description in col3.
 */
export default function parse(element, { document }) {
  // Find all feature cards — supports both .ge-features-list-card and .keystats-card structures
  const cards = element.querySelectorAll('.ge-features-list-card, .keystats-card');

  const cells = [];

  cards.forEach((card) => {
    // Extract the icon (SVG element or image)
    const iconEl = card.querySelector('.ge-features-list-card-icon svg, .ge-features-list-card-icon img');

    // Extract the headline text from the card
    const headlineEl = card.querySelector(
      '.ge-features-list-card-headline p, .ge-features-list-card-headline, h3'
    );

    // Extract the description text
    const descEl = card.querySelector(
      '.ge-features-list-card-bodycopy .text-paragraph-s p, .ge-features-list-card-bodycopy p, .text-paragraph-s p'
    );

    // Get text content for headline and description
    const headlineText = headlineEl ? headlineEl.textContent.trim() : '';
    const descText = descEl ? descEl.textContent.trim() : '';

    // Build the row: icon (as element or placeholder), headline, description
    if (headlineText || descText) {
      const row = [];

      // Icon cell - preserve SVG element if available, otherwise use placeholder
      if (iconEl) {
        row.push(iconEl);
      } else {
        row.push('');
      }

      // Headline cell
      row.push(headlineText);

      // Description cell
      row.push(descText);

      cells.push(row);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-at-a-glance',
    cells,
  });

  element.replaceWith(block);
}
