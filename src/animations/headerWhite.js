import { registerScrollTrigger, registerCleanupFn } from './lib/animCleanup';

export const selector = '.header';

export function init() {
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
  const trigger = window.ScrollTrigger.create({
    trigger: document.body,
    start: 0,
    end: 'max',
    onUpdate: updateHeaderClass,
  });
  registerScrollTrigger(trigger, document.body);
  registerCleanupFn(() => header.classList.remove('header--white'));
  updateHeaderClass();
}
