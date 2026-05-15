import { createOptimizedPicture } from '../../scripts/aem.js';

const CHEVRON_SVG = `<svg width="16" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.25 15C5.18 15 5.12 14.99 5.06 14.96C5 14.94 4.94 14.9 4.9 14.85C4.85 14.81 4.81 14.75 4.79 14.69C4.76 14.63 4.75 14.57 4.75 14.5C4.75 14.43 4.76 14.37 4.79 14.31C4.81 14.25 4.85 14.2 4.9 14.15L11.04 8L4.9 1.85C4.85 1.81 4.81 1.75 4.79 1.69C4.76 1.63 4.75 1.57 4.75 1.5C4.75 1.43 4.76 1.37 4.79 1.31C4.81 1.25 4.85 1.2 4.9 1.15C4.94 1.1 5 1.06 5.06 1.04C5.12 1.01 5.18 1 5.25 1C5.32 1 5.38 1.01 5.44 1.04C5.5 1.06 5.55 1.1 5.6 1.15L12.1 7.65C12.15 7.7 12.19 7.75 12.21 7.81C12.24 7.87 12.25 7.93 12.25 8C12.25 8.07 12.24 8.13 12.21 8.19C12.19 8.25 12.15 8.31 12.1 8.35L5.6 14.85C5.55 14.9 5.5 14.94 5.44 14.96C5.38 14.99 5.32 15 5.25 15Z" fill="currentColor"/>
</svg>`;

function addScrollArrows(block, ul) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ql-scroll-wrapper';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'ql-scroll-btn ql-scroll-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = CHEVRON_SVG;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'ql-scroll-btn ql-scroll-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = CHEVRON_SVG;

  const scrollAmount = () => {
    const card = ul.querySelector('li');
    if (!card) return 180;
    return card.offsetWidth + 24;
  };

  prevBtn.addEventListener('click', () => {
    ul.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    ul.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  });

  block.parentElement.insertBefore(wrapper, block);
  wrapper.append(block);
  wrapper.append(prevBtn);
  wrapper.append(nextBtn);
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else if (div.children.length === 1 && div.querySelector('.icon')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(ul);

  if (block.classList.contains('quick-links')) {
    addScrollArrows(block, ul);
  }
}
