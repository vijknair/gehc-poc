/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-product-media
 * Base block: carousel
 * Source selector: .ge-product-media-carousel
 * Source: https://www.gehealthcare.com/en-gb/products/ultrasound/point-of-care-ultrasound/venue-fit
 * Generated: 2026-05-15
 *
 * Product media carousel with images and/or videos. Each slide has a media element
 * (image or video thumbnail) and optional caption/secondary caption.
 *
 * Source structure:
 *   .ge-product-media-carousel
 *     .ge-product-media-carousel__top-container
 *       .ge-product-media-carousel__container
 *         .ge-product-media-carousel__title.eyebrow (optional eyebrow text)
 *         h2.ge-product-media-carousel__componentTitle (section heading)
 *         .ge-product-media-carousel__descp (optional description)
 *         a.link-cta (optional CTA)
 *     .cmp-carousel__content
 *       .cmp-carousel-wrap-items
 *         .cmp-carousel__item (slides - may include cloned .slick-cloned)
 *           .productmediacarousel
 *             .ge-product-media-carousel__carousel-container
 *               .ge-outer-media_container
 *                 (video: .video-wrapper with iframe) OR
 *                 (image: .ge-product-media-carousel__picture with img)
 *               .ge-product-media-carousel__captions (primary caption)
 *               .ge-product-media-carousel__secondary_captions (secondary caption)
 *
 * Target table: Carousel block
 *   Row 1 (header): eyebrow + title + description + CTA combined in a single cell
 *   Subsequent rows: col1 = image/video thumbnail, col2 = caption text
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Extract header content (eyebrow, title, description, CTA) ---
  const eyebrow = element.querySelector('.ge-product-media-carousel__title.eyebrow');
  const title = element.querySelector('h2.ge-product-media-carousel__componentTitle, h2[class*="componentTitle"]');
  const description = element.querySelector('.ge-product-media-carousel__descp');
  const ctaLink = element.querySelector('.ge-product-media-carousel__container a.link-cta, .ge-product-media-carousel__container a.cmp-link');

  // Build header row if any header content exists
  const headerContent = [];
  if (eyebrow && eyebrow.textContent.trim()) {
    const eyebrowEl = document.createElement('p');
    eyebrowEl.textContent = eyebrow.textContent.trim();
    headerContent.push(eyebrowEl);
  }
  if (title && title.textContent.trim()) {
    headerContent.push(title);
  }
  if (description && description.textContent.trim()) {
    const descEl = document.createElement('p');
    descEl.textContent = description.textContent.trim();
    headerContent.push(descEl);
  }
  if (ctaLink) {
    const cleanLink = document.createElement('a');
    cleanLink.href = ctaLink.href;
    const linkText = ctaLink.querySelector('.cmp-link__text');
    cleanLink.textContent = linkText ? linkText.textContent.trim() : ctaLink.textContent.trim();
    headerContent.push(cleanLink);
  }

  if (headerContent.length > 0) {
    cells.push([headerContent]);
  }

  // --- Extract carousel slides ---
  // Select only non-cloned slides to avoid duplicates from Slick carousel
  let slides = Array.from(element.querySelectorAll('.cmp-carousel__item:not(.slick-cloned)'));

  // Fallback: if no non-cloned slides found, deduplicate all slides by content
  if (slides.length === 0) {
    const allSlides = Array.from(element.querySelectorAll('.cmp-carousel__item'));
    const seenKeys = new Set();
    slides = allSlides.filter((slide) => {
      const img = slide.querySelector('img.ge-product-media-carousel__image, .s7responsiveContainer img.fluidimage, .ge-outer-media_container img:not([src^="data:"]), img[class*="vidyard"]');
      const caption = slide.querySelector('.ge-product-media-carousel__captions');
      const key = (img ? (img.alt || img.src) : '') + '|' + (caption ? caption.textContent.trim() : '');
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });
  }

  slides.forEach((slide) => {
    // Determine media type: video or image
    let mediaEl = null;

    // Check for video (Vidyard iframe with thumbnail)
    const videoWrapper = slide.querySelector('.video-wrapper');
    if (videoWrapper) {
      // Use the vidyard thumbnail image as the media element
      const vidThumb = videoWrapper.querySelector('img.vidyard-player-embed, img[class*="vidyard"], .vidyard-source-video.desktop img');
      const vidIframe = videoWrapper.querySelector('iframe[src*="vidyard"], iframe[src*="play.vidyard"]');
      if (vidThumb && vidThumb.src && !vidThumb.src.startsWith('data:')) {
        mediaEl = vidThumb;
      } else if (vidIframe) {
        // Create a link to the video as fallback
        const videoLink = document.createElement('a');
        videoLink.href = vidIframe.src;
        videoLink.textContent = vidIframe.title || 'Video';
        mediaEl = videoLink;
      }
    }

    // Check for static image (product media carousel picture)
    if (!mediaEl) {
      // Prefer the ge-product-media-carousel__image (download-safe image)
      const carouselImg = slide.querySelector('img.ge-product-media-carousel__image');
      if (carouselImg && carouselImg.src && !carouselImg.src.startsWith('data:')) {
        mediaEl = carouselImg;
      } else {
        // Fallback to scene7/fluidimage
        const fluidImg = slide.querySelector('.s7responsiveContainer img.fluidimage');
        if (fluidImg && fluidImg.src && !fluidImg.src.startsWith('data:')) {
          mediaEl = fluidImg;
        } else {
          // Last fallback: any non-data img in the media container
          const anyImg = slide.querySelector('.ge-outer-media_container img:not([src^="data:"])');
          if (anyImg) {
            mediaEl = anyImg;
          }
        }
      }
    }

    // Extract captions
    const primaryCaption = slide.querySelector('.ge-product-media-carousel__captions');
    const secondaryCaption = slide.querySelector('.ge-product-media-carousel__secondary_captions');

    const captionContent = [];
    if (primaryCaption && primaryCaption.textContent.trim()) {
      const captionEl = document.createElement('p');
      captionEl.textContent = primaryCaption.textContent.trim();
      captionContent.push(captionEl);
    }
    if (secondaryCaption && secondaryCaption.textContent.trim()) {
      const secCaptionEl = document.createElement('em');
      secCaptionEl.textContent = secondaryCaption.textContent.trim();
      captionContent.push(secCaptionEl);
    }

    // Only add row if we have media or caption content
    if (mediaEl || captionContent.length > 0) {
      const col1 = mediaEl || '';
      const col2 = captionContent.length > 0 ? captionContent : '';
      cells.push([col1, col2]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-product-media', cells });
  element.replaceWith(block);
}
