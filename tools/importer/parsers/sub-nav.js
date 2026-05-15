/* eslint-disable */
/* global WebImporter */

/**
 * Parser for sub-nav variant.
 * Base block: sub-nav (custom)
 * Source: https://www.gehealthcare.com/en-gb/products/ultrasound/point-of-care-ultrasound/venue-fit
 * Selector: .ge-secondary-nav-section-pagelinks
 * Generated: 2026-05-15
 *
 * Extracts navigation page links and CTA buttons from the sticky secondary nav bar.
 * Each nav item becomes a single row with a link element (text + href).
 * Links from both the visible wrapper and the overflow panel are collected,
 * followed by CTA action links.
 */
export default function parse(element, { document }) {
  // Collect all page navigation links from both visible and overflow sections
  const visibleLinks = element.querySelectorAll('.ge-secondary-nav-pagelinks-wrapper .ge-secondary-nav-pagelink a');
  const overflowLinks = element.querySelectorAll('.ge-secondary-nav-pagelinks-overflow-panel-items .ge-secondary-nav-pagelink a');

  // Collect CTA links
  const ctaLinks = element.querySelectorAll('.ge-secondary-nav-ctas a.cmp-button');

  const cells = [];

  // Add visible page links as rows
  visibleLinks.forEach((link) => {
    const text = link.textContent.trim();
    const href = link.getAttribute('href') || '#';
    if (text) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      cells.push([a]);
    }
  });

  // Add overflow page links as rows (these are hidden on desktop but present in DOM)
  overflowLinks.forEach((link) => {
    const text = link.textContent.trim();
    const href = link.getAttribute('href') || '#';
    if (text) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      cells.push([a]);
    }
  });

  // Add CTA links as rows
  ctaLinks.forEach((link) => {
    const textEl = link.querySelector('.cmp-button__text');
    const text = textEl ? textEl.textContent.trim() : link.textContent.trim();
    const href = link.getAttribute('href') || '#';
    if (text) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      cells.push([a]);
    }
  });

  // Fallback: if no links found via specific selectors, try generic anchor extraction
  if (cells.length === 0) {
    const allLinks = element.querySelectorAll('a[href]');
    allLinks.forEach((link) => {
      const text = link.textContent.trim();
      const href = link.getAttribute('href') || '#';
      if (text && href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        cells.push([a]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'sub-nav', cells });
  element.replaceWith(block);
}
