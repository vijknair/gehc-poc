/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: GE HealthCare UK section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks where a style is defined.
 *
 * Sections from page-templates.json (en-gb-homepage):
 *   1. Hero Carousel — selector: .carousel-container (no style)
 *   2. Category Quick Links — selector: .quicklinkscarousel (no style)
 *   3. Key Statistics — selector: .highlightkeystats (no style)
 *   4. What's New Articles — selector: .relatedcontent (no style)
 *   5. Contact Us — selector: .contactus (style: purple)
 *
 * All selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element };
    const doc = document || element.ownerDocument;
    const sections = payload && payload.template && payload.template.sections;

    if (!sections || sections.length < 2) {
      return;
    }

    // Process sections in reverse order to avoid offset issues when inserting elements
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      const sectionEl = element.querySelector(section.selector);
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
      if (section !== sections[0]) {
        const hr = doc.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
