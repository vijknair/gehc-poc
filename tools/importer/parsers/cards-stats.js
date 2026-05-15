/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-stats variant.
 * Base block: cards
 * Source selector: .ge-highlight-keystats
 * Generated: 2026-05-14
 *
 * Extracts key statistics cards from the source page. Each card has a large
 * numeric value (.keystat-value) and a description paragraph (.text-paragraph-s p).
 * Output: one row per stat with value in col1 and description in col2.
 */
export default function parse(element, { document }) {
  // Find all stat cards within the keystats wrapper
  const cards = element.querySelectorAll('.keystats-card');

  const cells = [];

  cards.forEach((card) => {
    // Extract the stat value (e.g. "$1B", "259K", "4M", "2B+")
    const valueEl = card.querySelector('.keystat-value');
    // Extract the description paragraph
    const descEl = card.querySelector('.text-paragraph-s p, .text-paragraph-s');

    // Build the row: value in col1, description in col2
    const valueText = valueEl ? valueEl.textContent.trim() : '';
    const descText = descEl ? descEl.textContent.trim() : '';

    if (valueText || descText) {
      cells.push([valueText, descText]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-stats',
    cells,
  });

  element.replaceWith(block);
}
