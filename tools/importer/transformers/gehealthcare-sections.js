/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: GE HealthCare UK section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks where a style is defined.
 *
 * Supports multiple templates (en-gb-homepage and product-detail) via payload.template.sections.
 * Detects the active template from payload and applies the corresponding section definitions.
 *
 * Handles:
 * - String selectors (e.g. ".contactus")
 * - Array selectors (e.g. [".featureslist", ".carousel-container"]) — uses first match as anchor
 * - :nth-of-type() pseudo-selectors for repeated components
 *
 * en-gb-homepage sections (5):
 *   1. Hero Carousel — selector: .carousel-container (no style)
 *   2. Category Quick Links — selector: .quicklinkscarousel (no style)
 *   3. Key Statistics — selector: .highlightkeystats (no style)
 *   4. What's New Articles — selector: .relatedcontent (no style)
 *   5. Contact Us — selector: .contactus (style: contact-us)
 *
 * product-detail sections (10):
 *   1. Breadcrumb + Sub-Nav — selector: .secondarynavigation (no style)
 *   2. Product Hero — selector: .herobanner (no style)
 *   3. At a Glance + Media — selector: [".featureslist", ".carousel-container"] (no style)
 *   4. Features Sticky Scroll — selector: .herostickyscrolling (no style)
 *   5. Key Care Areas — selector: .relatedcontent (no style)
 *   6. Clinical Images — selector: .carousel-container:nth-of-type(2) (no style)
 *   7. Feature Cards — selector: .featurecards (no style)
 *   8. Related Content — selector: .relatedcontent:nth-of-type(2) (no style)
 *   9. Contact Form — selector: .contactus (style: contact-us)
 *  10. Veeva Doc ID — selector: .veevadocumentid (style: veevadocid)
 *
 * All selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Resolves a section selector (string or array) to a DOM element.
 * For array selectors, returns the first matching element found.
 * Handles :nth-of-type() by finding all matches and selecting the correct index.
 */
function resolveSectionElement(element, selector) {
  if (Array.isArray(selector)) {
    // Array selector: find the first matching element from the list
    for (const sel of selector) {
      const el = resolveSectionElement(element, sel);
      if (el) return el;
    }
    return null;
  }

  // Handle :nth-of-type(n) pseudo-selector manually for class selectors
  const nthMatch = selector.match(/^(.+):nth-of-type\((\d+)\)$/);
  if (nthMatch) {
    const baseSelector = nthMatch[1];
    const index = parseInt(nthMatch[2], 10) - 1; // Convert to 0-based
    const allMatches = element.querySelectorAll(baseSelector);
    return allMatches[index] || null;
  }

  // Standard selector
  return element.querySelector(selector);
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const doc = element.ownerDocument || document;
    const sections = payload && payload.template && payload.template.sections;

    if (!sections || sections.length < 2) {
      return;
    }

    // Process sections in reverse order to avoid offset issues when inserting elements
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      const sectionEl = resolveSectionElement(element, section.selector);
      if (!sectionEl) {
        continue;
      }

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Insert <hr> before every section except the first
      if (section.id !== sections[0].id) {
        const hr = doc.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
