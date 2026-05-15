/* eslint-disable */
/* global WebImporter */

/**
 * Parser for contact-form
 * Base block: contact-form
 * Source selector: .gehc-marketo-form-wraper
 * Source URL: https://www.gehealthcare.com/en-gb/products/ultrasound/point-of-care-ultrasound/venue-fit
 * Generated: 2026-05-15
 *
 * Extracts a Marketo form embed container from the source page.
 * Creates a placeholder block preserving:
 *   - Heading text from the form header
 *   - Marketo form ID extracted from the form element's id attribute (e.g. mktoForm_146322 -> 146322)
 *
 * Target table structure:
 *   Row 1: Heading text (e.g. "Have a question? We would love to hear from you.")
 *   Row 2: Marketo form ID reference (e.g. "Form ID: 146322")
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Extract heading text from the form header ---
  // Validated selectors from source HTML:
  //   .marketo-form-header-container .marketo-heading p
  //   .marketo-form-header-top .title-s p
  const headingEl = element.querySelector(
    '.marketo-heading p, .marketo-form-header-top .title-s p, .marketo-form-header-container p',
  );

  if (headingEl) {
    const heading = document.createElement('h2');
    heading.textContent = headingEl.textContent.trim();
    cells.push([heading]);
  }

  // --- Extract Marketo form ID from the form element ---
  // Validated selector: form[id^="mktoForm_"]
  // The form id follows the pattern mktoForm_{ID} e.g. mktoForm_146322
  const formEl = element.querySelector('form[id^="mktoForm_"], form.mktoForm');
  let formId = '';

  if (formEl) {
    const formIdAttr = formEl.getAttribute('id') || '';
    const match = formIdAttr.match(/mktoForm_(\d+)/);
    if (match) {
      formId = match[1];
    }
  }

  // Fallback: check parent for form id if not found within the wrapper
  if (!formId) {
    const parentForm = element.closest('.gehc-marketo-form');
    if (parentForm) {
      const parentFormEl = parentForm.querySelector('form[id^="mktoForm_"]');
      if (parentFormEl) {
        const formIdAttr = parentFormEl.getAttribute('id') || '';
        const match = formIdAttr.match(/mktoForm_(\d+)/);
        if (match) {
          formId = match[1];
        }
      }
    }
  }

  // Create form reference cell with the Marketo form ID
  if (formId) {
    const formRef = document.createElement('p');
    formRef.textContent = `Form ID: ${formId}`;
    cells.push([formRef]);
  } else {
    // Even without a form ID, note that this is a Marketo form placeholder
    const formRef = document.createElement('p');
    formRef.textContent = 'Marketo Form (ID not found)';
    cells.push([formRef]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'contact-form', cells });
  element.replaceWith(block);
}
