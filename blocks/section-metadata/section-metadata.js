export default function decorate(block) {
  const section = block.closest('.section');
  if (!section) return;

  [...block.children].forEach((row) => {
    const key = row.children[0]?.textContent?.trim().toLowerCase();
    const value = row.children[1]?.textContent?.trim();
    if (key === 'style') {
      value.split(',').map((s) => s.trim()).filter(Boolean).forEach((s) => {
        section.classList.add(s);
      });
    } else if (key && value) {
      section.dataset[key] = value;
    }
  });

  block.closest('.section-metadata-wrapper')?.remove();
}
