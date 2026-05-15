export default function decorate(block) {
  // product variant: no additional JS decoration needed
  // button primary/secondary classes are assigned by decorateButtons in scripts.js
  // based on <strong> (primary) and <em> (secondary) wrapping in authored content
  block.classList.add('loaded');
}
