/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-carousel
 * Base block: hero + carousel (custom combination)
 * Source selector: .ge-homepage-hero-carousel
 * Generated: 2026-05-14
 *
 * Extracts slides from a Slick carousel. Each slide contains:
 *   - Full-bleed background image
 *   - Heading (h1)
 *   - Subtext paragraph
 *   - CTA link
 *
 * Target table: one row per slide, col1 = image, col2 = heading + subtext + CTA
 */
export default function parse(element, { document }) {
  // Find all carousel slide items
  const slides = element.querySelectorAll('.cmp-carousel__item');
  const cells = [];

  slides.forEach((slide) => {
    // Col 1: background image — grab the <picture> element for responsive sources
    const picture = slide.querySelector('.ge-hero-carousel__picture picture, picture');
    const img = picture || slide.querySelector('.ge-hero-carousel__picture img, picture img');

    // Col 2 content: heading, subtext, CTA
    // Scope heading and subtext to captions_wrap to avoid picking up slide counter text
    const captionsWrap = slide.querySelector('.ge-hero-carousel__captions_wrap');
    const heading = captionsWrap
      ? captionsWrap.querySelector('h1, h2, .title-m')
      : slide.querySelector('h1, h2, .title-m');
    const subtext = captionsWrap
      ? captionsWrap.querySelector('.text-paragraph-s p, .text-paragraph-s')
      : slide.querySelector('.ge-hero-carousel__captions_wrap .text-paragraph-s p');
    const ctaLink = slide.querySelector('.ge-hero-carousel__cta a, a.link-cta');

    // Build col 2 content array
    const contentCol = [];

    if (heading) {
      contentCol.push(heading);
    }

    if (subtext) {
      // Use the <p> element if found; otherwise the container
      const subtextEl = subtext.tagName === 'P' ? subtext : subtext.querySelector('p') || subtext;
      contentCol.push(subtextEl);
    }

    if (ctaLink) {
      // Clone the link to get clean text (strip icon spans)
      const cleanLink = document.createElement('a');
      cleanLink.href = ctaLink.href;
      const linkText = ctaLink.querySelector('.cmp-link__text');
      cleanLink.textContent = linkText ? linkText.textContent.trim() : ctaLink.textContent.trim();
      contentCol.push(cleanLink);
    }

    // Only add the row if we have meaningful content
    if (img || contentCol.length > 0) {
      const col1 = img || '';
      cells.push([col1, contentCol]);
    }
  });

  // If no slides found via .cmp-carousel__item, fall back to .homepageherocarousel
  if (cells.length === 0) {
    const fallbackSlides = element.querySelectorAll('.homepageherocarousel');
    fallbackSlides.forEach((slide) => {
      const img = slide.querySelector('.ge-hero-carousel__picture img, picture img');
      const heading = slide.querySelector('h1, h2, .title-m');
      const subtext = slide.querySelector('.text-paragraph-s p');
      const ctaLink = slide.querySelector('.ge-hero-carousel__cta a, a.link-cta');

      const contentCol = [];
      if (heading) contentCol.push(heading);
      if (subtext) contentCol.push(subtext);

      if (ctaLink) {
        const cleanLink = document.createElement('a');
        cleanLink.href = ctaLink.href;
        const linkText = ctaLink.querySelector('.cmp-link__text');
        cleanLink.textContent = linkText ? linkText.textContent.trim() : ctaLink.textContent.trim();
        contentCol.push(cleanLink);
      }

      if (img || contentCol.length > 0) {
        cells.push([img || '', contentCol]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-carousel', cells });
  element.replaceWith(block);
}
