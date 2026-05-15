/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-en-gb-homepage.js
  var import_en_gb_homepage_exports = {};
  __export(import_en_gb_homepage_exports, {
    default: () => import_en_gb_homepage_default
  });

  // tools/importer/parsers/hero-carousel.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".cmp-carousel__item");
    const cells = [];
    slides.forEach((slide) => {
      const picture = slide.querySelector(".ge-hero-carousel__picture picture, picture");
      const img = picture || slide.querySelector(".ge-hero-carousel__picture img, picture img");
      const captionsWrap = slide.querySelector(".ge-hero-carousel__captions_wrap");
      const heading = captionsWrap ? captionsWrap.querySelector("h1, h2, .title-m") : slide.querySelector("h1, h2, .title-m");
      const subtext = captionsWrap ? captionsWrap.querySelector(".text-paragraph-s p, .text-paragraph-s") : slide.querySelector(".ge-hero-carousel__captions_wrap .text-paragraph-s p");
      const ctaLink = slide.querySelector(".ge-hero-carousel__cta a, a.link-cta");
      const contentCol = [];
      if (heading) {
        contentCol.push(heading);
      }
      if (subtext) {
        const subtextEl = subtext.tagName === "P" ? subtext : subtext.querySelector("p") || subtext;
        contentCol.push(subtextEl);
      }
      if (ctaLink) {
        const cleanLink = document.createElement("a");
        cleanLink.href = ctaLink.href;
        const linkText = ctaLink.querySelector(".cmp-link__text");
        cleanLink.textContent = linkText ? linkText.textContent.trim() : ctaLink.textContent.trim();
        contentCol.push(cleanLink);
      }
      if (img || contentCol.length > 0) {
        const col1 = img || "";
        cells.push([col1, contentCol]);
      }
    });
    if (cells.length === 0) {
      const fallbackSlides = element.querySelectorAll(".homepageherocarousel");
      fallbackSlides.forEach((slide) => {
        const img = slide.querySelector(".ge-hero-carousel__picture img, picture img");
        const heading = slide.querySelector("h1, h2, .title-m");
        const subtext = slide.querySelector(".text-paragraph-s p");
        const ctaLink = slide.querySelector(".ge-hero-carousel__cta a, a.link-cta");
        const contentCol = [];
        if (heading) contentCol.push(heading);
        if (subtext) contentCol.push(subtext);
        if (ctaLink) {
          const cleanLink = document.createElement("a");
          cleanLink.href = ctaLink.href;
          const linkText = ctaLink.querySelector(".cmp-link__text");
          cleanLink.textContent = linkText ? linkText.textContent.trim() : ctaLink.textContent.trim();
          contentCol.push(cleanLink);
        }
        if (img || contentCol.length > 0) {
          cells.push([img || "", contentCol]);
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-quick-links.js
  function parse2(element, { document }) {
    const eyebrow = element.querySelector(".ge-quicklink-card-carousel-intro .text-eyebrow");
    if (eyebrow) {
      const eyebrowPara = document.createElement("p");
      eyebrowPara.textContent = eyebrow.textContent.trim();
      element.before(eyebrowPara);
    }
    const slides = element.querySelectorAll(".ge-quicklink-card-carousel-slide");
    const cells = [];
    slides.forEach((slide) => {
      const label = slide.querySelector(".ge-quicklink-card-carousel-slide-label");
      const labelText = label ? label.textContent.trim() : "";
      if (!labelText) return;
      const iconImg = slide.querySelector(".ge-quicklink-card-carousel-slide-iamge img") || slide.querySelector(".ge-quicklink-card-carousel-slide-image img") || slide.querySelector("svg") || slide.querySelector("img");
      let hasRealImage = false;
      if (iconImg && iconImg.tagName === "IMG") {
        const src = iconImg.getAttribute("src") || "";
        if (src && !src.startsWith("data:")) {
          hasRealImage = true;
        }
      }
      const slugLabel = labelText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      let col1;
      if (hasRealImage) {
        col1 = iconImg;
      } else {
        const iconP = document.createElement("p");
        iconP.textContent = `icon-${slugLabel}`;
        col1 = iconP;
      }
      const labelP = document.createElement("p");
      labelP.textContent = labelText;
      cells.push([col1, labelP]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-quick-links", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-stats.js
  function parse3(element, { document }) {
    const cards = element.querySelectorAll(".keystats-card");
    const cells = [];
    cards.forEach((card) => {
      const valueEl = card.querySelector(".keystat-value");
      const descEl = card.querySelector(".text-paragraph-s p, .text-paragraph-s");
      const valueText = valueEl ? valueEl.textContent.trim() : "";
      const descText = descEl ? descEl.textContent.trim() : "";
      if (valueText || descText) {
        cells.push([valueText, descText]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-stats",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse4(element, { document }) {
    const cells = [];
    const eyebrowEl = element.querySelector(".ge-related-content-header .text-eyebrow");
    const eyebrowText = eyebrowEl ? eyebrowEl.textContent.trim() : "";
    if (eyebrowText) {
      cells.push(["", eyebrowText, "", ""]);
    }
    const cards = element.querySelectorAll(".ge-related-content-card");
    cards.forEach((card) => {
      const mediaLink = card.querySelector(".ge-related-content-card-media a");
      const picture = card.querySelector(".ge-related-content-card-media picture");
      const img = card.querySelector(".ge-related-content-card-media img");
      let imageCell = "";
      if (picture && mediaLink) {
        const link = document.createElement("a");
        link.href = mediaLink.href;
        link.appendChild(picture.cloneNode(true));
        imageCell = link;
      } else if (img && mediaLink) {
        const link = document.createElement("a");
        link.href = mediaLink.href;
        link.appendChild(img.cloneNode(true));
        imageCell = link;
      } else if (picture) {
        imageCell = picture;
      } else if (img) {
        imageCell = img;
      }
      const titleEl = card.querySelector(".ge-related-content-card-body-title h3, .ge-related-content-card-body h3");
      const titleText = titleEl ? titleEl.textContent.trim().replace(/\s+/g, " ") : "";
      const categoryEl = card.querySelector(".ge-related-content-card-body-copy .text-paragraph-s p, .ge-related-content-card-body-copy p");
      const categoryText = categoryEl ? categoryEl.textContent.trim() : "";
      const dateEl = card.querySelector(".ge-related-content-card-metadata-publishdate");
      const dateText = dateEl ? dateEl.textContent.trim() : "";
      cells.push([imageCell, titleText, categoryText, dateText]);
    });
    const ctaLink = element.querySelector(".ge-related-content-link a.link-cta, .ge-related-content-link a");
    if (ctaLink) {
      const linkTextEl = ctaLink.querySelector(".cmp-link__text");
      const linkText = linkTextEl ? linkTextEl.textContent.trim() : ctaLink.textContent.trim();
      const linkHref = ctaLink.getAttribute("href") || "";
      cells.push(["", linkText, "", linkHref]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/gehealthcare-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#csModalWrapper",
        "#csBuynowModalWrapper",
        "#_evidon_banner",
        "#_evidon-background"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--country-selector",
        ".cmp-experiencefragment--header",
        "#global-search-bar",
        ".cmp-experiencefragment--footer",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/gehealthcare-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element };
      const doc = document || element.ownerDocument;
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) {
        return;
      }
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) {
          continue;
        }
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section !== sections[0]) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-en-gb-homepage.js
  var parsers = {
    "hero-carousel": parse,
    "cards-quick-links": parse2,
    "cards-stats": parse3,
    "cards-news": parse4
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "en-gb-homepage",
    description: "GE HealthCare UK Homepage \u2014 hero carousel, category quick links, key stats, article cards, contact CTA",
    urls: [
      "https://www.gehealthcare.com/en-gb"
    ],
    blocks: [
      {
        name: "hero-carousel",
        instances: [".ge-homepage-hero-carousel"]
      },
      {
        name: "cards-quick-links",
        instances: [".ge-quicklink-card-carousel"]
      },
      {
        name: "cards-stats",
        instances: [".ge-highlight-keystats"]
      },
      {
        name: "cards-news",
        instances: [".ge-related-content"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: ".carousel-container",
        style: null,
        blocks: ["hero-carousel"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Category Quick Links",
        selector: ".quicklinkscarousel",
        style: null,
        blocks: ["cards-quick-links"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Key Statistics",
        selector: ".highlightkeystats",
        style: null,
        blocks: ["cards-stats"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "What's New Articles",
        selector: ".relatedcontent",
        style: null,
        blocks: ["cards-news"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Contact Us",
        selector: ".contactus",
        style: "purple",
        blocks: [],
        defaultContent: [".ge-contact-us .title h2", ".ge-contact-us .cta-wrap a"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_en_gb_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_en_gb_homepage_exports);
})();
