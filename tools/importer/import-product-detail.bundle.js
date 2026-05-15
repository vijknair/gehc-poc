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

  // tools/importer/import-product-detail.js
  var import_product_detail_exports = {};
  __export(import_product_detail_exports, {
    default: () => import_product_detail_default
  });

  // tools/importer/parsers/breadcrumb.js
  function parse(element, { document: document2 }) {
    const breadcrumbItems = element.querySelectorAll(".ge-secondary-nav-breadcrumb:not(.link-seperator)");
    const links = [];
    breadcrumbItems.forEach((item) => {
      const anchor = item.querySelector("a");
      if (!anchor) return;
      const textSpan = anchor.querySelector("span.text-caption");
      const linkText = textSpan ? textSpan.textContent.trim() : anchor.textContent.trim();
      if (!linkText) return;
      const link = document2.createElement("a");
      link.href = anchor.href || anchor.getAttribute("href") || "#";
      link.textContent = linkText;
      links.push(link);
    });
    const cells = [];
    if (links.length > 0) {
      cells.push([links]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "breadcrumb", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/sub-nav.js
  function parse2(element, { document: document2 }) {
    const visibleLinks = element.querySelectorAll(".ge-secondary-nav-pagelinks-wrapper .ge-secondary-nav-pagelink a");
    const overflowLinks = element.querySelectorAll(".ge-secondary-nav-pagelinks-overflow-panel-items .ge-secondary-nav-pagelink a");
    const ctaLinks = element.querySelectorAll(".ge-secondary-nav-ctas a.cmp-button");
    const cells = [];
    visibleLinks.forEach((link) => {
      const text = link.textContent.trim();
      const href = link.getAttribute("href") || "#";
      if (text) {
        const a = document2.createElement("a");
        a.href = href;
        a.textContent = text;
        cells.push([a]);
      }
    });
    overflowLinks.forEach((link) => {
      const text = link.textContent.trim();
      const href = link.getAttribute("href") || "#";
      if (text) {
        const a = document2.createElement("a");
        a.href = href;
        a.textContent = text;
        cells.push([a]);
      }
    });
    ctaLinks.forEach((link) => {
      const textEl = link.querySelector(".cmp-button__text");
      const text = textEl ? textEl.textContent.trim() : link.textContent.trim();
      const href = link.getAttribute("href") || "#";
      if (text) {
        const a = document2.createElement("a");
        a.href = href;
        a.textContent = text;
        cells.push([a]);
      }
    });
    if (cells.length === 0) {
      const allLinks = element.querySelectorAll("a[href]");
      allLinks.forEach((link) => {
        const text = link.textContent.trim();
        const href = link.getAttribute("href") || "#";
        if (text && href) {
          const a = document2.createElement("a");
          a.href = href;
          a.textContent = text;
          cells.push([a]);
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "sub-nav", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-product.js
  function parse3(element, { document: document2 }) {
    const cells = [];
    const introSection = element.querySelector(".ge-feature-hero-section-intro");
    if (introSection) {
      const eyebrow = introSection.querySelector(".ge-feature-hero-content-body-eyebrow");
      const heading = introSection.querySelector(".title-m, .ge-feature-hero-content-body-title-medium");
      const bodyText = introSection.querySelector(".ge-feature-hero-content-body-text p, .ge-feature-hero-content-body-text");
      const contentCol = [];
      if (eyebrow) {
        const eyebrowEl = document2.createElement("p");
        eyebrowEl.textContent = eyebrow.textContent.trim();
        contentCol.push(eyebrowEl);
      }
      if (heading) {
        const headingEl = document2.createElement("h2");
        headingEl.textContent = heading.textContent.trim();
        contentCol.push(headingEl);
      }
      if (bodyText) {
        const bodyEl = bodyText.tagName === "P" ? bodyText : bodyText.querySelector("p") || bodyText;
        contentCol.push(bodyEl);
      }
      const ctaLinks = introSection.querySelectorAll("a.primary-btn, a.secondary-btn, a.cmp-button, a.link-cta");
      ctaLinks.forEach((cta) => {
        const link = document2.createElement("a");
        link.href = cta.href || cta.getAttribute("href") || "#";
        const btnText = cta.querySelector(".cmp-button__text, span");
        link.textContent = btnText ? btnText.textContent.trim() : cta.textContent.trim();
        contentCol.push(link);
      });
      if (contentCol.length > 0) {
        cells.push(["", contentCol]);
      }
    }
    const featuresSection = element.querySelector(".ge-feature-hero-section-features");
    if (featuresSection) {
      const featureWrappers = featuresSection.querySelectorAll(":scope > .ge-feature-hero-wrapper");
      featureWrappers.forEach((wrapper) => {
        const contentWrapper = wrapper.querySelector(".ge-feature-hero-content-wrapper");
        const mediaContainer = wrapper.querySelector(".ge-feature-hero-media-container");
        const contentCol = [];
        if (contentWrapper) {
          const eyebrow = contentWrapper.querySelector(".ge-feature-hero-content-body-eyebrow");
          const heading = contentWrapper.querySelector(".title-s, .title-m, .ge-feature-hero-content-body-title-small, .ge-feature-hero-content-body-title-medium");
          const bodyText = contentWrapper.querySelector(".ge-feature-hero-content-body-text-small p, .ge-feature-hero-content-body-text p, .ge-feature-hero-content-body-text-small, .ge-feature-hero-content-body-text");
          if (eyebrow) {
            const eyebrowEl = document2.createElement("p");
            eyebrowEl.textContent = eyebrow.textContent.trim();
            contentCol.push(eyebrowEl);
          }
          if (heading) {
            const headingEl = document2.createElement("h3");
            headingEl.textContent = heading.textContent.trim();
            contentCol.push(headingEl);
          }
          if (bodyText) {
            const bodyEl = bodyText.tagName === "P" ? bodyText : bodyText.querySelector("p") || bodyText;
            contentCol.push(bodyEl);
          }
          const ctaLinks = contentWrapper.querySelectorAll("a.primary-btn, a.secondary-btn, a.cmp-button, a.link-cta");
          ctaLinks.forEach((cta) => {
            const link = document2.createElement("a");
            link.href = cta.href || cta.getAttribute("href") || "#";
            const btnText = cta.querySelector(".cmp-button__text, span");
            link.textContent = btnText ? btnText.textContent.trim() : cta.textContent.trim();
            contentCol.push(link);
          });
        }
        const image = mediaContainer ? mediaContainer.querySelector("picture, img") : null;
        if (image || contentCol.length > 0) {
          cells.push([image || "", contentCol]);
        }
      });
    }
    if (cells.length === 0) {
      const allContentWrappers = element.querySelectorAll(".ge-feature-hero-content-wrapper");
      const allMediaContainers = element.querySelectorAll(".ge-feature-hero-media-container");
      allContentWrappers.forEach((contentWrapper, index) => {
        const contentCol = [];
        const eyebrow = contentWrapper.querySelector(".ge-feature-hero-content-body-eyebrow");
        const heading = contentWrapper.querySelector(".title-s, .title-m");
        const bodyText = contentWrapper.querySelector('[class*="ge-feature-hero-content-body-text"] p, [class*="ge-feature-hero-content-body-text"]');
        if (eyebrow) {
          const eyebrowEl = document2.createElement("p");
          eyebrowEl.textContent = eyebrow.textContent.trim();
          contentCol.push(eyebrowEl);
        }
        if (heading) {
          const headingEl = document2.createElement("h3");
          headingEl.textContent = heading.textContent.trim();
          contentCol.push(headingEl);
        }
        if (bodyText) {
          const bodyEl = bodyText.tagName === "P" ? bodyText : bodyText.querySelector("p") || bodyText;
          contentCol.push(bodyEl);
        }
        const image = allMediaContainers[index] ? allMediaContainers[index].querySelector("picture, img") : null;
        if (image || contentCol.length > 0) {
          cells.push([image || "", contentCol]);
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-at-a-glance.js
  function parse4(element, { document: document2 }) {
    const cards = element.querySelectorAll(".ge-features-list-card, .keystats-card");
    const cells = [];
    cards.forEach((card) => {
      const iconEl = card.querySelector(".ge-features-list-card-icon svg, .ge-features-list-card-icon img");
      const headlineEl = card.querySelector(
        ".ge-features-list-card-headline p, .ge-features-list-card-headline, h3"
      );
      const descEl = card.querySelector(
        ".ge-features-list-card-bodycopy .text-paragraph-s p, .ge-features-list-card-bodycopy p, .text-paragraph-s p"
      );
      const headlineText = headlineEl ? headlineEl.textContent.trim() : "";
      const descText = descEl ? descEl.textContent.trim() : "";
      if (headlineText || descText) {
        const row = [];
        if (iconEl) {
          row.push(iconEl);
        } else {
          row.push("");
        }
        row.push(headlineText);
        row.push(descText);
        cells.push(row);
      }
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "cards-at-a-glance",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-product-media.js
  function parse5(element, { document: document2 }) {
    const cells = [];
    const eyebrow = element.querySelector(".ge-product-media-carousel__title.eyebrow");
    const title = element.querySelector('h2.ge-product-media-carousel__componentTitle, h2[class*="componentTitle"]');
    const description = element.querySelector(".ge-product-media-carousel__descp");
    const ctaLink = element.querySelector(".ge-product-media-carousel__container a.link-cta, .ge-product-media-carousel__container a.cmp-link");
    const headerContent = [];
    if (eyebrow && eyebrow.textContent.trim()) {
      const eyebrowEl = document2.createElement("p");
      eyebrowEl.textContent = eyebrow.textContent.trim();
      headerContent.push(eyebrowEl);
    }
    if (title && title.textContent.trim()) {
      headerContent.push(title);
    }
    if (description && description.textContent.trim()) {
      const descEl = document2.createElement("p");
      descEl.textContent = description.textContent.trim();
      headerContent.push(descEl);
    }
    if (ctaLink) {
      const cleanLink = document2.createElement("a");
      cleanLink.href = ctaLink.href;
      const linkText = ctaLink.querySelector(".cmp-link__text");
      cleanLink.textContent = linkText ? linkText.textContent.trim() : ctaLink.textContent.trim();
      headerContent.push(cleanLink);
    }
    if (headerContent.length > 0) {
      cells.push([headerContent]);
    }
    let slides = Array.from(element.querySelectorAll(".cmp-carousel__item:not(.slick-cloned)"));
    if (slides.length === 0) {
      const allSlides = Array.from(element.querySelectorAll(".cmp-carousel__item"));
      const seenKeys = /* @__PURE__ */ new Set();
      slides = allSlides.filter((slide) => {
        const img = slide.querySelector('img.ge-product-media-carousel__image, .s7responsiveContainer img.fluidimage, .ge-outer-media_container img:not([src^="data:"]), img[class*="vidyard"]');
        const caption = slide.querySelector(".ge-product-media-carousel__captions");
        const key = (img ? img.alt || img.src : "") + "|" + (caption ? caption.textContent.trim() : "");
        if (seenKeys.has(key)) return false;
        seenKeys.add(key);
        return true;
      });
    }
    slides.forEach((slide) => {
      let mediaEl = null;
      const videoWrapper = slide.querySelector(".video-wrapper");
      if (videoWrapper) {
        const vidThumb = videoWrapper.querySelector('img.vidyard-player-embed, img[class*="vidyard"], .vidyard-source-video.desktop img');
        const vidIframe = videoWrapper.querySelector('iframe[src*="vidyard"], iframe[src*="play.vidyard"]');
        if (vidThumb && vidThumb.src && !vidThumb.src.startsWith("data:")) {
          mediaEl = vidThumb;
        } else if (vidIframe) {
          const videoLink = document2.createElement("a");
          videoLink.href = vidIframe.src;
          videoLink.textContent = vidIframe.title || "Video";
          mediaEl = videoLink;
        }
      }
      if (!mediaEl) {
        const carouselImg = slide.querySelector("img.ge-product-media-carousel__image");
        if (carouselImg && carouselImg.src && !carouselImg.src.startsWith("data:")) {
          mediaEl = carouselImg;
        } else {
          const fluidImg = slide.querySelector(".s7responsiveContainer img.fluidimage");
          if (fluidImg && fluidImg.src && !fluidImg.src.startsWith("data:")) {
            mediaEl = fluidImg;
          } else {
            const anyImg = slide.querySelector('.ge-outer-media_container img:not([src^="data:"])');
            if (anyImg) {
              mediaEl = anyImg;
            }
          }
        }
      }
      const primaryCaption = slide.querySelector(".ge-product-media-carousel__captions");
      const secondaryCaption = slide.querySelector(".ge-product-media-carousel__secondary_captions");
      const captionContent = [];
      if (primaryCaption && primaryCaption.textContent.trim()) {
        const captionEl = document2.createElement("p");
        captionEl.textContent = primaryCaption.textContent.trim();
        captionContent.push(captionEl);
      }
      if (secondaryCaption && secondaryCaption.textContent.trim()) {
        const secCaptionEl = document2.createElement("em");
        secCaptionEl.textContent = secondaryCaption.textContent.trim();
        captionContent.push(secCaptionEl);
      }
      if (mediaEl || captionContent.length > 0) {
        const col1 = mediaEl || "";
        const col2 = captionContent.length > 0 ? captionContent : "";
        cells.push([col1, col2]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-product-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/sticky-scroll.js
  function parse6(element, { document: document2 }) {
    const cells = [];
    const introSection = element.querySelector(".ge-feature-hero-section-intro");
    if (introSection) {
      const eyebrow = introSection.querySelector(".ge-feature-hero-content-body-eyebrow");
      const heading = introSection.querySelector(".title-m, .ge-feature-hero-content-body-title-medium");
      const bodyText = introSection.querySelector(".ge-feature-hero-content-body-text p, .ge-feature-hero-content-body-text");
      const contentCol = [];
      if (eyebrow) {
        const eyebrowEl = document2.createElement("p");
        eyebrowEl.textContent = eyebrow.textContent.trim();
        contentCol.push(eyebrowEl);
      }
      if (heading) {
        const headingEl = document2.createElement("h2");
        headingEl.textContent = heading.textContent.trim();
        contentCol.push(headingEl);
      }
      if (bodyText) {
        const bodyEl = bodyText.tagName === "P" ? bodyText : bodyText.querySelector("p") || bodyText;
        const p = document2.createElement("p");
        p.textContent = bodyEl.textContent.trim();
        contentCol.push(p);
      }
      if (contentCol.length > 0) {
        cells.push(["", contentCol]);
      }
    }
    const featuresSection = element.querySelector(".ge-feature-hero-section-features");
    if (featuresSection) {
      const featureWrappers = featuresSection.querySelectorAll(".ge-feature-hero-wrapper");
      featureWrappers.forEach((wrapper) => {
        const contentWrapper = wrapper.querySelector(".ge-feature-hero-content-wrapper");
        const mediaContainer = wrapper.querySelector(".ge-feature-hero-media-container");
        const contentCol = [];
        if (contentWrapper) {
          const eyebrow = contentWrapper.querySelector(".ge-feature-hero-content-body-eyebrow");
          const heading = contentWrapper.querySelector(".title-s, .title-m, .ge-feature-hero-content-body-title-small, .ge-feature-hero-content-body-title-medium");
          const bodyText = contentWrapper.querySelector(".ge-feature-hero-content-body-text-small p, .ge-feature-hero-content-body-text p, .ge-feature-hero-content-body-text-small, .ge-feature-hero-content-body-text");
          if (eyebrow) {
            const eyebrowEl = document2.createElement("p");
            eyebrowEl.textContent = eyebrow.textContent.trim();
            contentCol.push(eyebrowEl);
          }
          if (heading) {
            const headingEl = document2.createElement("h3");
            headingEl.textContent = heading.textContent.trim();
            contentCol.push(headingEl);
          }
          if (bodyText) {
            const bodyEl = bodyText.tagName === "P" ? bodyText : bodyText.querySelector("p") || bodyText;
            const p = document2.createElement("p");
            p.textContent = bodyEl.textContent.trim();
            contentCol.push(p);
          }
        }
        const image = mediaContainer ? mediaContainer.querySelector("picture, img") : null;
        if (image || contentCol.length > 0) {
          cells.push([image || "", contentCol]);
        }
      });
    }
    if (cells.length === 0) {
      const allContentWrappers = element.querySelectorAll(".ge-feature-hero-content-wrapper");
      const allMediaContainers = element.querySelectorAll(".ge-feature-hero-media-container");
      allContentWrappers.forEach((contentWrapper, index) => {
        const contentCol = [];
        const eyebrow = contentWrapper.querySelector(".ge-feature-hero-content-body-eyebrow");
        const heading = contentWrapper.querySelector(".title-s, .title-m");
        const bodyText = contentWrapper.querySelector('[class*="ge-feature-hero-content-body-text"] p, [class*="ge-feature-hero-content-body-text"]');
        if (eyebrow) {
          const eyebrowEl = document2.createElement("p");
          eyebrowEl.textContent = eyebrow.textContent.trim();
          contentCol.push(eyebrowEl);
        }
        if (heading) {
          const headingEl = document2.createElement("h3");
          headingEl.textContent = heading.textContent.trim();
          contentCol.push(headingEl);
        }
        if (bodyText) {
          const bodyEl = bodyText.tagName === "P" ? bodyText : bodyText.querySelector("p") || bodyText;
          const p = document2.createElement("p");
          p.textContent = bodyEl.textContent.trim();
          contentCol.push(p);
        }
        const image = allMediaContainers[index] ? allMediaContainers[index].querySelector("picture, img") : null;
        if (image || contentCol.length > 0) {
          cells.push([image || "", contentCol]);
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "sticky-scroll", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-care-areas.js
  function parse7(element, { document: document2 }) {
    const eyebrowEl = element.querySelector(".ge-related-content-header-eyebrow .text-eyebrow, .text-eyebrow");
    const headingEl = element.querySelector(".ge-related-content-header-title h2, .ge-related-content-header-title h3, h2.title-m");
    if (eyebrowEl) {
      const eyebrowP = document2.createElement("p");
      eyebrowP.textContent = eyebrowEl.textContent.trim();
      element.before(eyebrowP);
    }
    if (headingEl) {
      const headingClone = headingEl.cloneNode(true);
      element.before(headingClone);
    }
    let cards = element.querySelectorAll(".ge-related-content-card");
    if (!cards.length) {
      cards = element.querySelectorAll(".ge-quicklink-card-carousel-slide");
    }
    const cells = [];
    cards.forEach((card) => {
      const mediaLink = card.querySelector(".ge-related-content-card-media a, .ge-related-content-card-media-wraper");
      const picture = card.querySelector("picture");
      const img = card.querySelector(".ge-related-content-card-media img, picture img, img");
      let imageCell = "";
      if (picture) {
        imageCell = picture;
      } else if (img) {
        const src = img.getAttribute("src") || "";
        if (src && !src.startsWith("data:")) {
          imageCell = img;
        }
      }
      const titleEl = card.querySelector(".ge-related-content-card-body-title h3, .ge-related-content-card-body h3, h3");
      const titleText = titleEl ? titleEl.textContent.trim() : "";
      const descEl = card.querySelector(".ge-related-content-card-body-copy p, .ge-related-content-card-body-copy .text-paragraph-s p, .text-paragraph-s p");
      const descText = descEl ? descEl.textContent.trim() : "";
      const linkEl = mediaLink || card.querySelector("a[href]");
      const linkHref = linkEl ? linkEl.getAttribute("href") || linkEl.href || "" : "";
      if (!titleText && !imageCell) return;
      const contentContainer = document2.createElement("div");
      if (titleText) {
        const titleNode = document2.createElement("strong");
        titleNode.textContent = titleText;
        contentContainer.appendChild(titleNode);
      }
      if (descText) {
        const descP = document2.createElement("p");
        descP.textContent = descText;
        contentContainer.appendChild(descP);
      }
      if (linkHref) {
        const linkA = document2.createElement("a");
        linkA.href = linkHref;
        linkA.textContent = titleText || "Learn more";
        contentContainer.appendChild(linkA);
      }
      cells.push([imageCell, contentContainer]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-care-areas", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature-cards.js
  function parse8(element, { document: document2 }) {
    const sectionTitle = element.querySelector(".ge-feature-cards-title h2, .ge-feature-card-section-1 h2");
    const cards = element.querySelectorAll(".ge-feature-card");
    const cells = [];
    cards.forEach((card) => {
      const picture = card.querySelector(".ge-feature-card-image picture");
      const img = card.querySelector(".ge-feature-card-image img");
      const imageEl = picture || img;
      const titleEl = card.querySelector(".ge-feature-card-content-body-title h3");
      const descriptionEl = card.querySelector(".ge-feature-card-content-body-text");
      const ctaLink = card.querySelector(".ge-feature-card-content-body-link a.link-cta, .ge-feature-card-content-body-link a");
      const imageCell = [];
      if (imageEl) {
        imageCell.push(imageEl);
      }
      const contentCell = [];
      if (titleEl) {
        const heading = document2.createElement("h3");
        heading.textContent = titleEl.textContent.trim();
        contentCell.push(heading);
      }
      if (descriptionEl) {
        const paragraphs = descriptionEl.querySelectorAll("p");
        paragraphs.forEach((p) => {
          contentCell.push(p);
        });
      }
      if (ctaLink) {
        const link = document2.createElement("a");
        link.href = ctaLink.href;
        link.textContent = ctaLink.textContent.trim();
        if (ctaLink.getAttribute("aria-label")) {
          link.setAttribute("aria-label", ctaLink.getAttribute("aria-label"));
        }
        contentCell.push(link);
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell.length > 0 ? imageCell : "", contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-feature-cards", cells });
    if (sectionTitle) {
      const wrapper = document2.createElement("div");
      const heading = document2.createElement("h2");
      heading.textContent = sectionTitle.textContent.trim();
      wrapper.appendChild(heading);
      wrapper.appendChild(block);
      element.replaceWith(wrapper);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/cards-products.js
  function parse9(element, { document: document2 }) {
    const cells = [];
    const eyebrowEl = element.querySelector(".ge-product-feature-header-eyebrow, .text-eyebrow");
    const headingEl = element.querySelector("h2.ge-product-feature-header-title, .ge-product-feature-header-title");
    const headerDescEl = element.querySelector(".ge-product-feature-header-bodycopy");
    const eyebrowText = eyebrowEl ? eyebrowEl.textContent.trim() : "";
    const headingText = headingEl ? headingEl.textContent.trim() : "";
    const headerDescText = headerDescEl ? headerDescEl.textContent.trim() : "";
    if (eyebrowText || headingText) {
      cells.push([eyebrowText, headingText, headerDescText]);
    }
    const cards = element.querySelectorAll(".ge-product-feature-card");
    cards.forEach((card) => {
      const picture = card.querySelector(".ge-product-feature-card-media-wraper picture, .ge-product-feature-card-media picture");
      const img = card.querySelector(".ge-product-feature-card-media-wraper img, .ge-product-feature-card-media img");
      let imageCell = "";
      if (picture) {
        imageCell = picture;
      } else if (img) {
        imageCell = img;
      }
      const titleEl = card.querySelector("h3.ge-product-feature-card-body-title, .ge-product-feature-card-body-title");
      let titleText = "";
      if (titleEl) {
        const innerP = titleEl.querySelector("p");
        titleText = innerP ? innerP.textContent.trim() : titleEl.textContent.trim();
      }
      const descEl = card.querySelector(".ge-product-feature-card-body-wraper .text-paragraph-s, .ge-product-feature-card-body .text-paragraph-s");
      const descText = descEl ? descEl.textContent.trim() : "";
      const ctaLink = card.querySelector("a.ge-product-feature-card-link-custom, a.link-cta, .ge-product-feature-card-link a");
      let ctaText = "";
      let ctaHref = "";
      if (ctaLink) {
        const linkTextEl = ctaLink.querySelector(".cmp-link__text");
        ctaText = linkTextEl ? linkTextEl.textContent.trim() : ctaLink.textContent.trim();
        ctaHref = ctaLink.getAttribute("href") || "";
      }
      let ctaCell = ctaText;
      if (ctaHref && ctaText) {
        const link = document2.createElement("a");
        link.href = ctaHref;
        link.textContent = ctaText;
        ctaCell = link;
      }
      cells.push([imageCell, titleText, descText, ctaCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-products", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-relatedcontent.js
  function parse10(element, { document: document2 }) {
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
        const link = document2.createElement("a");
        link.href = mediaLink.href;
        link.appendChild(picture.cloneNode(true));
        imageCell = link;
      } else if (img && mediaLink) {
        const link = document2.createElement("a");
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
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-relatedcontent", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/contact-form.js
  function parse11(element, { document: document2 }) {
    const cells = [];
    const headingEl = element.querySelector(
      ".marketo-heading p, .marketo-form-header-top .title-s p, .marketo-form-header-container p"
    );
    if (headingEl) {
      const heading = document2.createElement("h2");
      heading.textContent = headingEl.textContent.trim();
      cells.push([heading]);
    }
    const formEl = element.querySelector('form[id^="mktoForm_"], form.mktoForm');
    let formId = "";
    if (formEl) {
      const formIdAttr = formEl.getAttribute("id") || "";
      const match = formIdAttr.match(/mktoForm_(\d+)/);
      if (match) {
        formId = match[1];
      }
    }
    if (!formId) {
      const parentForm = element.closest(".gehc-marketo-form");
      if (parentForm) {
        const parentFormEl = parentForm.querySelector('form[id^="mktoForm_"]');
        if (parentFormEl) {
          const formIdAttr = parentFormEl.getAttribute("id") || "";
          const match = formIdAttr.match(/mktoForm_(\d+)/);
          if (match) {
            formId = match[1];
          }
        }
      }
    }
    if (formId) {
      const formRef = document2.createElement("p");
      formRef.textContent = `Form ID: ${formId}`;
      cells.push([formRef]);
    } else {
      const formRef = document2.createElement("p");
      formRef.textContent = "Marketo Form (ID not found)";
      cells.push([formRef]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "contact-form", cells });
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
  function resolveSectionElement(element, selector) {
    if (Array.isArray(selector)) {
      for (const sel of selector) {
        const el = resolveSectionElement(element, sel);
        if (el) return el;
      }
      return null;
    }
    const nthMatch = selector.match(/^(.+):nth-of-type\((\d+)\)$/);
    if (nthMatch) {
      const baseSelector = nthMatch[1];
      const index = parseInt(nthMatch[2], 10) - 1;
      const allMatches = element.querySelectorAll(baseSelector);
      return allMatches[index] || null;
    }
    return element.querySelector(selector);
  }
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const doc = element.ownerDocument || document;
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) {
        return;
      }
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        const sectionEl = resolveSectionElement(element, section.selector);
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
        if (section.id !== sections[0].id) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-product-detail.js
  var parsers = {
    "breadcrumb": parse,
    "sub-nav": parse2,
    "hero-product": parse3,
    "cards-at-a-glance": parse4,
    "carousel-product-media": parse5,
    "sticky-scroll": parse6,
    "cards-care-areas": parse7,
    "cards-feature-cards": parse8,
    "cards-products": parse9,
    "cards-relatedcontent": parse10,
    "contact-form": parse11
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "product-detail",
    description: "Product detail page \u2014 hero, at-a-glance, features, care areas, media, related content, contact form",
    urls: [
      "https://www.gehealthcare.com/en-gb/products/ultrasound/point-of-care-ultrasound/venue-fit"
    ],
    blocks: [
      { name: "breadcrumb", instances: [".ge-secondary-nav-section-breadcrumbs"] },
      { name: "sub-nav", instances: [".ge-secondary-nav-section-pagelinks"] },
      { name: "hero-product", instances: [".ge-feature-hero"] },
      { name: "cards-at-a-glance", instances: [".ge-features-list"] },
      { name: "carousel-product-media", instances: [".ge-product-media-carousel"] },
      { name: "sticky-scroll", instances: [".ge-feature-hero-container"] },
      { name: "cards-care-areas", instances: ["#RelatedContentModel-1822868214"] },
      { name: "cards-feature-cards", instances: [".ge-feature-cards"] },
      { name: "cards-products", instances: [".ge-product-feature"] },
      { name: "cards-relatedcontent", instances: [".ge-related-content"] },
      { name: "contact-form", instances: [".gehc-marketo-form-wraper"] }
    ],
    sections: [
      { id: "section-1", name: "Breadcrumb + Sub-Nav", selector: ".secondarynavigation", style: null, blocks: ["breadcrumb", "sub-nav"], defaultContent: [] },
      { id: "section-2", name: "Product Hero", selector: ".herobanner", style: null, blocks: ["hero-product"], defaultContent: [] },
      { id: "section-3", name: "At a Glance + Media", selector: [".featureslist", ".carousel-container"], style: null, blocks: ["cards-at-a-glance", "carousel-product-media"], defaultContent: [] },
      { id: "section-4", name: "Features Sticky Scroll", selector: ".herostickyscrolling", style: null, blocks: ["sticky-scroll"], defaultContent: [] },
      { id: "section-5", name: "Key Care Areas", selector: ".relatedcontent", style: null, blocks: ["cards-care-areas"], defaultContent: [] },
      { id: "section-6", name: "Clinical Images", selector: ".carousel-container:nth-of-type(2)", style: null, blocks: ["carousel-product-media"], defaultContent: [] },
      { id: "section-7", name: "Feature Cards", selector: ".featurecards", style: null, blocks: ["cards-feature-cards"], defaultContent: [] },
      { id: "section-8", name: "Related Content", selector: ".relatedcontent:nth-of-type(2)", style: null, blocks: ["cards-relatedcontent"], defaultContent: [] },
      { id: "section-9", name: "Contact Form", selector: ".contactus", style: "contact-us", blocks: ["contact-form"], defaultContent: [".ge-contact-us .title h2"] },
      { id: "section-10", name: "Veeva Doc ID", selector: ".veevadocumentid", style: "veevadocid", blocks: [], defaultContent: [".ge-veevadocument-id-container"] }
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
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
  var import_product_detail_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_product_detail_exports);
})();
