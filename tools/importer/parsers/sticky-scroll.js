/* eslint-disable */
/* global WebImporter */

/**
 * Parser for sticky-scroll
 * Base block: sticky-scroll
 * Source selector: .ge-feature-hero-container
 * Source URL: https://www.gehealthcare.com/en-gb/products/ultrasound/point-of-care-ultrasound/venue-fit
 * Generated: 2026-05-15
 *
 * Extracts a sticky-scroll feature section with multiple feature slides.
 * Structure:
 *   - Intro row (no image): eyebrow + heading (h2) + body paragraph
 *   - Feature slide rows: each has image (col 1) + eyebrow + heading (h3) + body (col 2)
 *
 * Source DOM structure:
 *   .ge-feature-hero-container
 *     .ge-feature-hero-section-intro (eyebrow, title-m heading, body text)
 *     .ge-feature-hero-section-features
 *       .ge-feature-hero-wrapper (repeated per slide)
 *         .ge-feature-hero-content-wrapper (eyebrow, title-s heading, body text)
 *         .ge-feature-hero-media-container (picture > img)
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Intro section (no image, has medium title) ---
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
      const p = document.createElement('p');
      p.textContent = bodyEl.textContent.trim();
      contentCol.push(p);
    }

    if (contentCol.length > 0) {
      cells.push(['', contentCol]);
    }
  }

  // --- Feature slides in the features section ---
  const featuresSection = element.querySelector('.ge-feature-hero-section-features');
  if (featuresSection) {
    const featureWrappers = featuresSection.querySelectorAll('.ge-feature-hero-wrapper');

    featureWrappers.forEach((wrapper) => {
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
          const p = document.createElement('p');
          p.textContent = bodyEl.textContent.trim();
          contentCol.push(p);
        }
      }

      // Extract image from media container
      const image = mediaContainer
        ? mediaContainer.querySelector('picture, img')
        : null;

      // Only add row if we have content or image
      if (image || contentCol.length > 0) {
        cells.push([image || '', contentCol]);
      }
    });
  }

  // --- Fallback: if no structured sections found, extract all content/media pairs ---
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
        const p = document.createElement('p');
        p.textContent = bodyEl.textContent.trim();
        contentCol.push(p);
      }

      const image = allMediaContainers[index]
        ? allMediaContainers[index].querySelector('picture, img')
        : null;

      if (image || contentCol.length > 0) {
        cells.push([image || '', contentCol]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'sticky-scroll', cells });
  element.replaceWith(block);
}
