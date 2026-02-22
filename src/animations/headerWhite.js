export function headerWhite() {
  const header = document.querySelector('.header');
  if (!header) return;
  const getSections = () => document.querySelectorAll('.white-header');
  const updateHeaderClass = () => {
    const sections = getSections();
    if (!sections.length) return;
    const headerTop = header.querySelector('.header__top');
    const refEl = headerTop || header;
    const refRect = refEl.getBoundingClientRect();
    const centerY = refRect.top + refRect.height / 2;
    let inside = false;
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (centerY >= rect.top && centerY <= rect.bottom) inside = true;
    });
    header.classList.toggle('header--white', inside);
  };
  window.ScrollTrigger.create({
    trigger: document.body,
    start: 0,
    end: 'max',
    onUpdate: updateHeaderClass,
  });
  updateHeaderClass();
}
