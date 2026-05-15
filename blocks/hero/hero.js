export default function decorate(block) {
  if (block.classList.contains('product')) {
    const buttons = block.querySelectorAll('.button-container');
    buttons.forEach((bc, i) => {
      const btn = bc.querySelector('a.button');
      if (btn) {
        btn.classList.remove('primary', 'secondary', 'accent');
        btn.classList.add(i === 0 ? 'primary' : 'secondary');
      }
    });
  }
}
