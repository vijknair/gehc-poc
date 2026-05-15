/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-product
 * Base block: hero
 * Source selector: .ge-feature-hero
 * Source URL: https://www.gehealthcare.com/en-gb/products/ultrasound/point-of-care-ultrasound/venue-fit
 * Generated: 2026-05-15
 *
 * Extracts product feature hero content from the ge-feature-hero component.
 * Structure: an intro section + multiple feature items, each with:
 *   - Eyebrow text (category label, e.g. "FEATURES", "MOVES WITH YOU")
 *   - Heading/title (medium or small)
 *   - Body copy description
 *   - Accompanying product image (feature items only; intro may lack image)
 *   - Optional CTA links
 *
 * Target table: one row per feature item
 *   - Col 1: image (picture element or empty if intro)
 *   - Col 2: eyebrow + heading + description + optional CTAs
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Handle the intro section (no image, has medium title) ---
  const introSection = element.querySelector('.ge-feature-hero-section-intro');
  if (introSection) {
    const eyebrow = introSection.querySelector('.ge-feature-hero-content-body-eyebrow');
    const heading = introSection.querySelector('.title-m, .ge-feature-hero-content-body-title-medium');
    const bodyText = introSection.querySelector('.ge-feature-hero-content-body-text p, .ge-feature-hero-content-body-text');

    const contentCol = [];
    if (eyebrow) {
      const eyebrowEl = document.createElement('p');
      eyebrowEl.textContent = eyebrow.textContent.trim();
      contentCol.push(eyebrowEl);
    }
    if (heading) {
      const headingEl = document.createElement('h2');
      headingEl.textContent = heading.textContent.trim();
      contentCol.push(headingEl);
    }
    if (bodyText) {
      const bodyEl = bodyText.tagName === 'P' ? bodyText : bodyText.querySelector('p') || bodyText;
      contentCol.push(bodyEl);
    }

    // Check for CTA links in intro
    const ctaLinks = introSection.querySelectorAll('a.primary-btn, a.secondary-btn, a.cmp-button, a.link-cta');
    ctaLinks.forEach((cta) => {
      const link = document.createElement('a');
      link.href = cta.href || cta.getAttribute('href') || '#';
      const btnText = cta.querySelector('.cmp-button__text, span');
      link.textContent = btnText ? btnText.textContent.trim() : cta.textContent.trim();
      contentCol.push(link);
    });

    if (contentCol.length > 0) {
      cells.push(['', contentCol]);
    }
  }

  // --- Handle feature items in the features section ---
  const featuresSection = element.querySelector('.ge-feature-hero-section-features');
  if (featuresSection) {
    const featureWrappers = featuresSection.querySelectorAll(':scope > .ge-feature-hero-wrapper');

    featureWrappers.forEach((wrapper) => {
      // Extract content from the content wrapper
      const contentWrapper = wrapper.querySelector('.ge-feature-hero-content-wrapper');
      const mediaContainer = wrapper.querySelector('.ge-feature-hero-media-container');

      const contentCol = [];

      if (contentWrapper) {
        const eyebrow = contentWrapper.querySelector('.ge-feature-hero-content-body-eyebrow');
        const heading = contentWrapper.querySelector('.title-s, .title-m, .ge-feature-hero-content-body-title-small, .ge-feature-hero-content-body-title-medium');
        const bodyText = contentWrapper.querySelector('.ge-feature-hero-content-body-text-small p, .ge-feature-hero-content-body-text p, .ge-feature-hero-content-body-text-small, .ge-feature-hero-content-body-text');

        if (eyebrow) {
          const eyebrowEl = document.createElement('p');
          eyebrowEl.textContent = eyebrow.textContent.trim();
          contentCol.push(eyebrowEl);
        }
        if (heading) {
          const headingEl = document.createElement('h3');
          headingEl.textContent = heading.textContent.trim();
          contentCol.push(headingEl);
        }
        if (bodyText) {
          const bodyEl = bodyText.tagName === 'P' ? bodyText : bodyText.querySelector('p') || bodyText;
          contentCol.push(bodyEl);
        }

        // Check for CTA links in feature item
        const ctaLinks = contentWrapper.querySelectorAll('a.primary-btn, a.secondary-btn, a.cmp-button, a.link-cta');
        ctaLinks.forEach((cta) => {
          const link = document.createElement('a');
          link.href = cta.href || cta.getAttribute('href') || '#';
          const btnText = cta.querySelector('.cmp-button__text, span');
          link.textContent = btnText ? btnText.textContent.trim() : cta.textContent.trim();
          contentCol.push(link);
        });
      }

      // Extract image from media container
      const image = mediaContainer
        ? mediaContainer.querySelector('picture, img')
        : null;

      // Only add row if we have content
      if (image || contentCol.length > 0) {
        cells.push([image || '', contentCol]);
      }
    });
  }

  // --- Fallback: if no intro/features structure, treat as flat feature items ---
  if (cells.length === 0) {
    const allContentWrappers = element.querySelectorAll('.ge-feature-hero-content-wrapper');
    const allMediaContainers = element.querySelectorAll('.ge-feature-hero-media-container');

    allContentWrappers.forEach((contentWrapper, index) => {
      const contentCol = [];
      const eyebrow = contentWrapper.querySelector('.ge-feature-hero-content-body-eyebrow');
      const heading = contentWrapper.querySelector('.title-s, .title-m');
      const bodyText = contentWrapper.querySelector('[class*="ge-feature-hero-content-body-text"] p, [class*="ge-feature-hero-content-body-text"]');

      if (eyebrow) {
        const eyebrowEl = document.createElement('p');
        eyebrowEl.textContent = eyebrow.textContent.trim();
        contentCol.push(eyebrowEl);
      }
      if (heading) {
        const headingEl = document.createElement('h3');
        headingEl.textContent = heading.textContent.trim();
        contentCol.push(headingEl);
      }
      if (bodyText) {
        const bodyEl = bodyText.tagName === 'P' ? bodyText : bodyText.querySelector('p') || bodyText;
        contentCol.push(bodyEl);
      }

      const image = allMediaContainers[index]
        ? allMediaContainers[index].querySelector('picture, img')
        : null;

      if (image || contentCol.length > 0) {
        cells.push([image || '', contentCol]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-product', cells });
  element.replaceWith(block);
}
