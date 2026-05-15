import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const sections = footer.querySelectorAll('.section');
  if (sections[0]) sections[0].classList.add('footer-nav');
  if (sections[1]) sections[1].classList.add('footer-legal');

  footer.querySelectorAll('.button').forEach((btn) => {
    btn.className = '';
    const bc = btn.closest('.button-container');
    if (bc) bc.className = '';
  });

  const navSection = footer.querySelector('.footer-nav .default-content-wrapper');
  if (navSection) {
    const lists = navSection.querySelectorAll(':scope > ul');
    if (lists[1]) lists[1].classList.add('footer-social');
  }

  block.append(footer);
}
