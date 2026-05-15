/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import breadcrumbParser from './parsers/breadcrumb.js';
import subNavParser from './parsers/sub-nav.js';
import heroProductParser from './parsers/hero-product.js';
import cardsAtAGlanceParser from './parsers/cards-at-a-glance.js';
import carouselProductMediaParser from './parsers/carousel-product-media.js';
import stickyScrollParser from './parsers/sticky-scroll.js';
import cardsCareAreasParser from './parsers/cards-care-areas.js';
import cardsFeatureCardsParser from './parsers/cards-feature-cards.js';
import cardsProductsParser from './parsers/cards-products.js';
import cardsRelatedcontentParser from './parsers/cards-relatedcontent.js';
import contactFormParser from './parsers/contact-form.js';

// TRANSFORMER IMPORTS
import gehealthcareCleanupTransformer from './transformers/gehealthcare-cleanup.js';
import gehealthcareSectionsTransformer from './transformers/gehealthcare-sections.js';

// PARSER REGISTRY
const parsers = {
  'breadcrumb': breadcrumbParser,
  'sub-nav': subNavParser,
  'hero-product': heroProductParser,
  'cards-at-a-glance': cardsAtAGlanceParser,
  'carousel-product-media': carouselProductMediaParser,
  'sticky-scroll': stickyScrollParser,
  'cards-care-areas': cardsCareAreasParser,
  'cards-feature-cards': cardsFeatureCardsParser,
  'cards-products': cardsProductsParser,
  'cards-relatedcontent': cardsRelatedcontentParser,
  'contact-form': contactFormParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  gehealthcareCleanupTransformer,
  gehealthcareSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'product-detail',
  description: 'Product detail page — hero, at-a-glance, features, care areas, media, related content, contact form',
  urls: [
    'https://www.gehealthcare.com/en-gb/products/ultrasound/point-of-care-ultrasound/venue-fit',
  ],
  blocks: [
    { name: 'breadcrumb', instances: ['.ge-secondary-nav-section-breadcrumbs'] },
    { name: 'sub-nav', instances: ['.ge-secondary-nav-section-pagelinks'] },
    { name: 'hero-product', instances: ['.ge-feature-hero'] },
    { name: 'cards-at-a-glance', instances: ['.ge-features-list'] },
    { name: 'carousel-product-media', instances: ['.ge-product-media-carousel'] },
    { name: 'sticky-scroll', instances: ['.ge-feature-hero-container'] },
    { name: 'cards-care-areas', instances: ['#RelatedContentModel-1822868214'] },
    { name: 'cards-feature-cards', instances: ['.ge-feature-cards'] },
    { name: 'cards-products', instances: ['.ge-product-feature'] },
    { name: 'cards-relatedcontent', instances: ['.ge-related-content'] },
    { name: 'contact-form', instances: ['.gehc-marketo-form-wraper'] },
  ],
  sections: [
    { id: 'section-1', name: 'Breadcrumb + Sub-Nav', selector: '.secondarynavigation', style: null, blocks: ['breadcrumb', 'sub-nav'], defaultContent: [] },
    { id: 'section-2', name: 'Product Hero', selector: '.herobanner', style: null, blocks: ['hero-product'], defaultContent: [] },
    { id: 'section-3', name: 'At a Glance + Media', selector: ['.featureslist', '.carousel-container'], style: null, blocks: ['cards-at-a-glance', 'carousel-product-media'], defaultContent: [] },
    { id: 'section-4', name: 'Features Sticky Scroll', selector: '.herostickyscrolling', style: null, blocks: ['sticky-scroll'], defaultContent: [] },
    { id: 'section-5', name: 'Key Care Areas', selector: '.relatedcontent', style: null, blocks: ['cards-care-areas'], defaultContent: [] },
    { id: 'section-6', name: 'Clinical Images', selector: '.carousel-container:nth-of-type(2)', style: null, blocks: ['carousel-product-media'], defaultContent: [] },
    { id: 'section-7', name: 'Feature Cards', selector: '.featurecards', style: null, blocks: ['cards-feature-cards'], defaultContent: [] },
    { id: 'section-8', name: 'Related Content', selector: '.relatedcontent:nth-of-type(2)', style: null, blocks: ['cards-relatedcontent'], defaultContent: [] },
    { id: 'section-9', name: 'Contact Form', selector: '.contactus', style: 'contact-us', blocks: ['contact-form'], defaultContent: ['.ge-contact-us .title h2'] },
    { id: 'section-10', name: 'Veeva Doc ID', selector: '.veevadocumentid', style: 'veevadocid', blocks: [], defaultContent: ['.ge-veevadocument-id-container'] },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
