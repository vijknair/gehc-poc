import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 768px)');

function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
}

function closeMegaMenu(nav) {
  nav.querySelectorAll('.nav-sections .nav-drop').forEach((drop) => {
    drop.setAttribute('aria-expanded', 'false');
  });
  nav.querySelectorAll('.nav-sections .nav-category[aria-expanded="true"]').forEach((cat) => {
    cat.setAttribute('aria-expanded', 'false');
  });
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  if (fragment) {
    while (fragment.firstElementChild) nav.append(fragment.firstElementChild);
  }

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // strip button classes from all sections
  nav.querySelectorAll('.button').forEach((btn) => {
    btn.className = '';
    const bc = btn.closest('.button-container');
    if (bc) bc.className = '';
  });

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      const hasChildren = navSection.querySelector('ul');
      if (hasChildren) {
        navSection.classList.add('nav-drop');
        navSection.setAttribute('aria-expanded', 'false');

        // find 2nd-level items that have 3rd-level children
        navSection.querySelectorAll(':scope > ul > li').forEach((category) => {
          if (category.querySelector('ul')) {
            category.classList.add('nav-category');
            category.setAttribute('aria-expanded', 'false');

            category.addEventListener('mouseenter', () => {
              if (!isDesktop.matches) return;
              navSection.querySelectorAll('.nav-category').forEach((c) => {
                c.setAttribute('aria-expanded', 'false');
              });
              category.setAttribute('aria-expanded', 'true');
            });

            category.addEventListener('click', (e) => {
              if (isDesktop.matches) return;
              e.stopPropagation();
              const exp = category.getAttribute('aria-expanded') === 'true';
              category.setAttribute('aria-expanded', exp ? 'false' : 'true');
            });
          }
        });

        // top-level click to open/close mega menu
        const trigger = navSection.querySelector(':scope > p, :scope > a');
        if (trigger) {
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const exp = navSection.getAttribute('aria-expanded') === 'true';
            closeMegaMenu(nav);
            if (!exp) navSection.setAttribute('aria-expanded', 'true');
          });
        }
      }
    });
  }

  // close mega menu on click outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeMegaMenu(nav);
  });

  // close on escape
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') closeMegaMenu(nav);
  });

  // hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
