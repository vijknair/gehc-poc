const CHEVRON_SVG = `<svg width="16" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.25 15C5.18 15 5.12 14.99 5.06 14.96C5 14.94 4.94 14.9 4.9 14.85C4.85 14.81 4.81 14.75 4.79 14.69C4.76 14.63 4.75 14.57 4.75 14.5C4.75 14.43 4.76 14.37 4.79 14.31C4.81 14.25 4.85 14.2 4.9 14.15L11.04 8L4.9 1.85C4.85 1.81 4.81 1.75 4.79 1.69C4.76 1.63 4.75 1.57 4.75 1.5C4.75 1.43 4.76 1.37 4.79 1.31C4.81 1.25 4.85 1.2 4.9 1.15C4.94 1.1 5 1.06 5.06 1.04C5.12 1.01 5.18 1 5.25 1C5.32 1 5.38 1.01 5.44 1.04C5.5 1.06 5.55 1.1 5.6 1.15L12.1 7.65C12.15 7.7 12.19 7.75 12.21 7.81C12.24 7.87 12.25 7.93 12.25 8C12.25 8.07 12.24 8.13 12.21 8.19C12.19 8.25 12.15 8.31 12.1 8.35L5.6 14.85C5.55 14.9 5.5 14.94 5.44 14.96C5.38 14.99 5.32 15 5.25 15Z" fill="currentColor"/>
</svg>`;

function createVidyardEmbed(videoId) {
  const wrapper = document.createElement('div');
  wrapper.className = 'carousel-video-wrapper';
  const iframe = document.createElement('iframe');
  iframe.src = `https://play.vidyard.com/${videoId}?disable_popouts=1&type=inline&preload=auto&muted=1&autoplay=1&loop=1`;
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'autoplay; fullscreen');
  wrapper.append(iframe);
  return wrapper;
}

export default function decorate(block) {
  const rows = [...block.children];
  const slides = [];
  let header = null;

  rows.forEach((row, idx) => {
    const cols = [...row.children];
    const col1Text = cols[0]?.textContent?.trim() || '';
    const col2Text = cols[1]?.textContent?.trim() || '';

    if (idx === 0 && !cols[0]?.querySelector('picture') && !col1Text.startsWith('vidyard:')) {
      const headerCol = cols[0];
      const eyebrowEl = headerCol.querySelector('p:first-child');
      const titleEl = headerCol.querySelector('h2');
      const descEl = titleEl?.nextElementSibling?.tagName === 'P' ? titleEl.nextElementSibling : null;
      const ctaLink = headerCol.querySelector('a');
      header = {
        eyebrow: eyebrowEl && eyebrowEl !== descEl ? eyebrowEl.textContent.trim() : null,
        title: titleEl ? titleEl.textContent.trim() : col2Text || null,
        description: descEl ? descEl.textContent.trim() : (cols[2]?.textContent?.trim() || null),
        cta: ctaLink ? { text: ctaLink.textContent.trim(), href: ctaLink.href } : null,
      };
    } else {
      const picture = cols[0]?.querySelector('picture');
      const isVideo = col1Text.startsWith('vidyard:');
      slides.push({
        type: isVideo ? 'video' : 'image',
        videoId: isVideo ? col1Text.replace('vidyard:', '') : null,
        picture: picture || null,
        caption: col2Text || null,
        subCaption: cols[2]?.textContent?.trim() || null,
      });
    }
  });

  block.textContent = '';

  if (header && (header.eyebrow || header.title)) {
    const headerEl = document.createElement('div');
    headerEl.className = 'carousel-header';
    if (header.eyebrow) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'carousel-eyebrow';
      eyebrow.textContent = header.eyebrow;
      headerEl.append(eyebrow);
    }
    if (header.title) {
      const title = document.createElement('h2');
      title.className = 'carousel-title';
      title.textContent = header.title;
      headerEl.append(title);
    }
    if (header.description) {
      const desc = document.createElement('p');
      desc.className = 'carousel-description';
      desc.textContent = header.description;
      headerEl.append(desc);
    }
    if (header.cta && header.cta.href) {
      const cta = document.createElement('a');
      cta.className = 'carousel-cta';
      cta.href = header.cta.href;
      cta.innerHTML = `${header.cta.text} ${CHEVRON_SVG}`;
      headerEl.append(cta);
    }
    block.append(headerEl);
  }

  const track = document.createElement('div');
  track.className = 'carousel-track';

  slides.forEach((slide, idx) => {
    const slideEl = document.createElement('div');
    slideEl.className = 'carousel-slide';
    if (idx === 0) slideEl.classList.add('carousel-slide-active');

    const media = document.createElement('div');
    media.className = 'carousel-media';
    if (slide.type === 'video') {
      media.append(createVidyardEmbed(slide.videoId));
    } else if (slide.picture) {
      media.append(slide.picture);
    }
    slideEl.append(media);

    if (slide.caption) {
      const captionEl = document.createElement('div');
      captionEl.className = 'carousel-caption';
      const primary = document.createElement('p');
      primary.className = 'carousel-caption-primary';
      primary.textContent = slide.caption;
      captionEl.append(primary);
      if (slide.subCaption) {
        const secondary = document.createElement('p');
        secondary.className = 'carousel-caption-secondary';
        secondary.textContent = slide.subCaption;
        captionEl.append(secondary);
      }
      slideEl.append(captionEl);
    }

    track.append(slideEl);
  });

  block.append(track);

  if (slides.length > 1) {
    const nav = document.createElement('div');
    nav.className = 'carousel-nav';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-prev';
    prevBtn.setAttribute('aria-label', 'Previous');
    prevBtn.innerHTML = CHEVRON_SVG;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-next';
    nextBtn.setAttribute('aria-label', 'Next');
    nextBtn.innerHTML = CHEVRON_SVG;

    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dots.append(dot);
    });

    nav.append(prevBtn);
    nav.append(nextBtn);
    track.append(nav);

    block.append(dots);

    let current = 0;
    const showSlide = (idx) => {
      track.querySelectorAll('.carousel-slide').forEach((s, i) => {
        s.classList.toggle('carousel-slide-active', i === idx);
      });
      dots.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
      current = idx;
    };

    prevBtn.addEventListener('click', () => {
      showSlide((current - 1 + slides.length) % slides.length);
    });
    nextBtn.addEventListener('click', () => {
      showSlide((current + 1) % slides.length);
    });
    dots.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.addEventListener('click', () => showSlide(i));
    });

    let autoplay = setInterval(() => {
      showSlide((current + 1) % slides.length);
    }, 5000);

    track.addEventListener('mouseenter', () => clearInterval(autoplay));
    track.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => {
        showSlide((current + 1) % slides.length);
      }, 5000);
    });
  }
}
