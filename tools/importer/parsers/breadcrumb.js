/* eslint-disable */
/* global WebImporter */

/**
 * Parser for breadcrumb
 * Base block: breadcrumb
 * Source selector: .ge-secondary-nav-section-breadcrumbs
 * Generated: 2026-05-15
 *
 * Extracts breadcrumb navigation links from the secondary nav section.
 * Source structure:
 *   - .ge-secondary-nav-breadcrumb.link-active — parent page link with <a> containing <span class="text-caption">
 *   - .ge-secondary-nav-breadcrumb.link-seperator — "/" separator (skipped)
 *   - .ge-secondary-nav-breadcrumb.link-inactive — current page link with <a class="text-caption">
 *
 * Target table: single row with all breadcrumb links (text + href) as anchor elements.
 */
export default function parse(element, { document }) {
  // Select all breadcrumb items that contain links (skip separators)
  const breadcrumbItems = element.querySelectorAll('.ge-secondary-nav-breadcrumb:not(.link-seperator)');

  const links = [];

  breadcrumbItems.forEach((item) => {
    const anchor = item.querySelector('a');
    if (!anchor) return;

    // Extract link text — may be in a nested span.text-caption or directly on the anchor
    const textSpan = anchor.querySelector('span.text-caption');
    const linkText = textSpan
      ? textSpan.textContent.trim()
      : anchor.textContent.trim();

    if (!linkText) return;

    // Create a clean link element
    const link = document.createElement('a');
    link.href = anchor.href || anchor.getAttribute('href') || '#';
    link.textContent = linkText;
    links.push(link);
  });

  // Build cells: single row with all breadcrumb links
  const cells = [];
  if (links.length > 0) {
    cells.push([links]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'breadcrumb', cells });
  element.replaceWith(block);
}
