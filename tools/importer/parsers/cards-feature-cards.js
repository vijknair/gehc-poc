/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature-cards
 * Base block: cards
 * Source: https://www.gehealthcare.com/en-gb/products/ultrasound/point-of-care-ultrasound/venue-fit
 * Selector: .ge-feature-cards
 * Generated: 2026-05-15
 *
 * Feature cards section with 1 full-width + 2 half-width promotional cards.
 * Each card has an image, title, description, and optional CTA link.
 * May have a section title above the cards.
 *
 * Source structure:
 *   .ge-feature-cards
 *     .ge-feature-card-section-1 > .ge-feature-cards-title > h2 (section title)
 *     .ge-feature-card-section-2 > .card > .ge-feature-card
 *       .ge-feature-card-content > .ge-feature-card-content-body
 *         .ge-feature-card-content-body-title > h3
 *         .ge-feature-card-content-body-text > p
 *         .ge-feature-card-content-body-link > a.link-cta
 *       .ge-feature-card-image > picture > img
 *
 * Target table structure (Cards block):
 *   Row per card: [image] | [title, description, CTA]
 */
export default function parse(element, { document }) {
  // Extract section title (optional - above the cards)
  const sectionTitle = element.querySelector('.ge-feature-cards-title h2, .ge-feature-card-section-1 h2');

  // Extract all feature cards
  const cards = element.querySelectorAll('.ge-feature-card');

  const cells = [];

  // Process each card into a row: [image, content]
  cards.forEach((card) => {
    // Extract image - look for picture element first, fall back to img
    const picture = card.querySelector('.ge-feature-card-image picture');
    const img = card.querySelector('.ge-feature-card-image img');
    const imageEl = picture || img;

    // Extract title - h3 inside body-title div
    const titleEl = card.querySelector('.ge-feature-card-content-body-title h3');

    // Extract description - paragraph(s) inside body-text div
    const descriptionEl = card.querySelector('.ge-feature-card-content-body-text');

    // Extract CTA link - the link-cta anchor in body-link div
    const ctaLink = card.querySelector('.ge-feature-card-content-body-link a.link-cta, .ge-feature-card-content-body-link a');

    // Build image cell
    const imageCell = [];
    if (imageEl) {
      imageCell.push(imageEl);
    }

    // Build content cell - title, description, CTA
    const contentCell = [];

    if (titleEl) {
      // Create a clean heading element for the title
      const heading = document.createElement('h3');
      // The h3 may contain a nested <p>, extract just the text
      heading.textContent = titleEl.textContent.trim();
      contentCell.push(heading);
    }

    if (descriptionEl) {
      // Clone description paragraphs to preserve inline links
      const paragraphs = descriptionEl.querySelectorAll('p');
      paragraphs.forEach((p) => {
        contentCell.push(p);
      });
    }

    if (ctaLink) {
      // Create a clean link element for the CTA
      const link = document.createElement('a');
      link.href = ctaLink.href;
      link.textContent = ctaLink.textContent.trim();
      if (ctaLink.getAttribute('aria-label')) {
        link.setAttribute('aria-label', ctaLink.getAttribute('aria-label'));
      }
      contentCell.push(link);
    }

    // Only add the row if we have meaningful content
    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell.length > 0 ? imageCell : '', contentCell]);
    }
  });

  // Create the block with the exact variant name
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature-cards', cells });

  // If there's a section title, prepend it before the block
  if (sectionTitle) {
    const wrapper = document.createElement('div');
    const heading = document.createElement('h2');
    heading.textContent = sectionTitle.textContent.trim();
    wrapper.appendChild(heading);
    wrapper.appendChild(block);
    element.replaceWith(wrapper);
  } else {
    element.replaceWith(block);
  }
}
