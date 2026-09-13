import { registerScrollTrigger, registerCleanupFn } from './lib/animCleanup';

export const selector = '.header';

const WHITE_SECTIONS = '.white-header';

export function init() {
  const header = document.querySelector('.header');
  if (!header || !window.ScrollTrigger) return;

  let sections = Array.from(document.querySelectorAll(WHITE_SECTIONS));

  const collectSections = () => {
    sections = Array.from(document.querySelectorAll(WHITE_SECTIONS));
  };

  const updateHeaderClass = () => {
    if (!sections.length) {
      header.classList.remove('header--white');
      return;
    }
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

  const onRefreshInit = () => {
    collectSections();
    updateHeaderClass();
  };
  window.ScrollTrigger.addEventListener('refreshInit', onRefreshInit);

  const trigger = window.ScrollTrigger.create({
    trigger: document.body,
    start: 0,
    end: 'max',
    onUpdate: updateHeaderClass,
  });
  registerScrollTrigger(trigger, document.body);
  registerCleanupFn(() => {
    window.ScrollTrigger?.removeEventListener('refreshInit', onRefreshInit);
    header.classList.remove('header--white');
  });
  updateHeaderClass();
}
