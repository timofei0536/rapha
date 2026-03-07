import { registerScrollTrigger } from './lib/animCleanup';

const PINS = [
  { section: '.about > .center-wrap', pin: '.about__gm' },
  { section: '.new__wrap', pin: '.new__img' },
];

export const selector = null;
export const desktopOnly = true;

export function init() {
  const headerEl = document.querySelector('.header');
  const start = `top ${(headerEl ? headerEl.offsetHeight : 0) + 50}px`;

  PINS.forEach(({ section, pin }) => {
    const sectionEl = document.querySelector(section);
    const pinEl = document.querySelector(pin);
    if (!sectionEl || !pinEl) return;

    const trigger = window.ScrollTrigger.create({
      trigger: sectionEl,
      endTrigger: sectionEl,
      start,
      end: '+=' + (sectionEl.offsetHeight - pinEl.offsetHeight) + 'px',
      pin: pinEl,
      invalidateOnRefresh: true,
    });
    registerScrollTrigger(trigger, sectionEl);
  });
}
