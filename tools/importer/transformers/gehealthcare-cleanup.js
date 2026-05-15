/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: GE HealthCare UK site-wide cleanup.
 * Removes non-authorable content (header, footer, country selector, cookie banner,
 * search overlay, modals) so only page-level authorable content remains.
 *
 * All selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Country selector modal overlay (line 888: <div id="csModalWrapper" class="ge_cs-modal-wrapper hide-visibility">)
    // Buy-now modal overlay (line 1224: <div id="csBuynowModalWrapper" class="ge_cs-buynow-modal-wrapper hidden">)
    // Cookie banner (line 2946: <div id="_evidon_banner" class="evidon-banner">)
    // Cookie background overlay (line 2953: <div id="_evidon-background" class="evidon-background">)
    WebImporter.DOMUtils.remove(element, [
      '#csModalWrapper',
      '#csBuynowModalWrapper',
      '#_evidon_banner',
      '#_evidon-background',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Country selector experience fragment (line 51: class="cmp-experiencefragment cmp-experiencefragment--country-selector")
    // Header experience fragment (line 149: class="cmp-experiencefragment cmp-experiencefragment--header")
    // Global search bar (line 901: <div id="global-search-bar" class="ge-global-search hidden">)
    // Footer experience fragment (line 2804: class="cmp-experiencefragment cmp-experiencefragment--footer")
    // Link elements (lines 31-45: <link href="..."> stylesheets/hreflang)
    // Noscript elements
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--country-selector',
      '.cmp-experiencefragment--header',
      '#global-search-bar',
      '.cmp-experiencefragment--footer',
      'link',
      'noscript',
    ]);
  }
}
