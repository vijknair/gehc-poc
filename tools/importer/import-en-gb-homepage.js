/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCarouselParser from './parsers/hero-carousel.js';
import cardsQuickLinksParser from './parsers/cards-quick-links.js';
import cardsStatsParser from './parsers/cards-stats.js';
import cardsNewsParser from './parsers/cards-news.js';

// TRANSFORMER IMPORTS
import gehealthcareCleanupTransformer from './transformers/gehealthcare-cleanup.js';
import gehealthcareSectionsTransformer from './transformers/gehealthcare-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-carousel': heroCarouselParser,
  'cards-quick-links': cardsQuickLinksParser,
  'cards-stats': cardsStatsParser,
  'cards-news': cardsNewsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  gehealthcareCleanupTransformer,
  gehealthcareSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'en-gb-homepage',
  description: 'GE HealthCare UK Homepage — hero carousel, category quick links, key stats, article cards, contact CTA',
  urls: [
    'https://www.gehealthcare.com/en-gb',
  ],
  blocks: [
    {
      name: 'hero-carousel',
      instances: ['.ge-homepage-hero-carousel'],
    },
    {
      name: 'cards-quick-links',
      instances: ['.ge-quicklink-card-carousel'],
    },
    {
      name: 'cards-stats',
      instances: ['.ge-highlight-keystats'],
    },
    {
      name: 'cards-news',
      instances: ['.ge-related-content'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '.carousel-container',
      style: null,
      blocks: ['hero-carousel'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Category Quick Links',
      selector: '.quicklinkscarousel',
      style: null,
      blocks: ['cards-quick-links'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Key Statistics',
      selector: '.highlightkeystats',
      style: null,
      blocks: ['cards-stats'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'What\'s New Articles',
      selector: '.relatedcontent',
      style: null,
      blocks: ['cards-news'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Contact Us',
      selector: '.contactus',
      style: 'purple',
      blocks: [],
      defaultContent: ['.ge-contact-us .title h2', '.ge-contact-us .cta-wrap a'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
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

/**
 * Find all blocks on the page based on the embedded template configuration
 */
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

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
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
