export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const introRow = rows[0];
  const featureRows = rows.slice(1);

  block.textContent = '';

  // intro section (full-width text above the sticky layout)
  const introCol = introRow.children[1] || introRow.children[0];
  if (introCol) {
    const intro = document.createElement('div');
    intro.className = 'sticky-scroll-intro';
    while (introCol.firstChild) intro.append(introCol.firstChild);
    block.append(intro);
  }

  // two-column sticky layout
  const layout = document.createElement('div');
  layout.className = 'sticky-scroll-layout';

  const textTrack = document.createElement('div');
  textTrack.className = 'sticky-scroll-text';

  const imageTrack = document.createElement('div');
  imageTrack.className = 'sticky-scroll-images';

  featureRows.forEach((row, idx) => {
    const cols = [...row.children];
    const imgCol = cols.find((c) => c.querySelector('picture'));
    const textCol = cols.find((c) => !c.querySelector('picture'));

    // text panel
    const textPanel = document.createElement('div');
    textPanel.className = 'sticky-scroll-feature';
    textPanel.dataset.index = idx;
    if (textCol) while (textCol.firstChild) textPanel.append(textCol.firstChild);
    textTrack.append(textPanel);

    // image
    const imagePanel = document.createElement('div');
    imagePanel.className = `sticky-scroll-image${idx === 0 ? ' active' : ''}`;
    imagePanel.dataset.index = idx;
    if (imgCol) {
      const picture = imgCol.querySelector('picture');
      if (picture) imagePanel.append(picture);
    }
    imageTrack.append(imagePanel);
  });

  layout.append(textTrack);
  layout.append(imageTrack);
  block.append(layout);

  // scroll observer: crossfade images when text enters viewport
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = entry.target.dataset.index;
          imageTrack.querySelectorAll('.sticky-scroll-image').forEach((img) => {
            img.classList.toggle('active', img.dataset.index === idx);
          });
        }
      });
    }, { threshold: 0.5 });

    textTrack.querySelectorAll('.sticky-scroll-feature').forEach((feature) => {
      observer.observe(feature);
    });
  }
}
