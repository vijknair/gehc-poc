const CHEVRON_SVG = `<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.25 15C5.18 15.001 5.12 14.988 5.06 14.963C5 14.937 4.94 14.899 4.9 14.851C4.85 14.806 4.81 14.751 4.79 14.691C4.76 14.631 4.75 14.566 4.75 14.501C4.75 14.435 4.76 14.37 4.79 14.31C4.81 14.25 4.85 14.195 4.9 14.151L11.04 8.001L4.9 1.851C4.85 1.806 4.81 1.751 4.79 1.691C4.76 1.631 4.75 1.566 4.75 1.501C4.75 1.435 4.76 1.37 4.79 1.31C4.81 1.25 4.85 1.195 4.9 1.151C4.94 1.103 5 1.065 5.06 1.039C5.12 1.012 5.18 0.999 5.25 0.999C5.32 0.999 5.38 1.012 5.44 1.039C5.5 1.065 5.55 1.103 5.6 1.151L12.1 7.651C12.15 7.695 12.19 7.75 12.21 7.81C12.24 7.87 12.25 7.935 12.25 8.001C12.25 8.066 12.24 8.131 12.21 8.191C12.19 8.251 12.15 8.306 12.1 8.351L5.6 14.851C5.55 14.899 5.5 14.937 5.44 14.963C5.38 14.988 5.32 15.001 5.25 15Z" fill="currentColor"/>
</svg>`;

export default function decorate(block) {
  const slides = [...block.children];
  const isSingle = slides.length <= 1;

  slides.forEach((slide) => {
    const cols = [...slide.children];
    const imageCol = cols[0];
    const contentCol = cols[1];

    if (imageCol) imageCol.classList.add('hero-carousel-image');
    if (contentCol) contentCol.classList.add('hero-carousel-content');

    if (contentCol) {
      const card = document.createElement('div');
      card.classList.add('hero-carousel-card');

      if (!isSingle) {
        const controls = document.createElement('div');
        controls.classList.add('hero-carousel-controls');
        controls.innerHTML = `
          <span class="hero-carousel-counter">1 / ${slides.length}</span>
          <button class="hero-carousel-prev" aria-label="Previous">${CHEVRON_SVG}</button>
          <button class="hero-carousel-pause" aria-label="Pause">${CHEVRON_SVG}</button>
          <button class="hero-carousel-next" aria-label="Next">${CHEVRON_SVG}</button>
        `;
        card.append(controls);
      }

      const textWrap = document.createElement('div');
      textWrap.classList.add('hero-carousel-text');
      while (contentCol.firstChild) textWrap.append(contentCol.firstChild);

      const ctaLink = textWrap.querySelector('a');
      if (ctaLink) {
        ctaLink.classList.add('hero-carousel-cta');
        ctaLink.innerHTML = `${ctaLink.textContent} ${CHEVRON_SVG}`;
      }

      card.append(textWrap);
      contentCol.append(card);
    }

    slide.classList.add('hero-carousel-slide');
    if (slides.indexOf(slide) === 0) slide.classList.add('hero-carousel-slide-active');
  });
}
