/**
 * Parallax-появление: trigger = сам элемент, stagger через fromY (без delay — старт при входе).
 */

import { registerScrollTrigger } from './lib/animCleanup';
import { setInitialData } from './lib/animInitial';

export const selector = null;
export const desktopOnly = true;

export function init() {
  const gsap = window.gsap;
  const stDefaults = { start: 'top bottom', end: 'top center', scrub: 1 };
  const TWEEN_DURATION = 2;

  function animateItem(el, fromY, opacityDuration = 1) {
    setInitialData(el, { opacity: '0', y: String(fromY) });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, ...stDefaults },
    });
    registerScrollTrigger(tl.scrollTrigger, el);
    tl.to(el, { opacity: 1, duration: opacityDuration }, 0);
    tl.to(el, { y: 0, duration: TWEEN_DURATION }, '<');
  }

  const BASE_Y = 50;
  const BASE_Y_INFRA_NEWS = 15;
  const STAGGER_Y = 25;
  const SERVICES_COLUMNS = 3;
  const NEWS_COLUMNS = 3;
  const INFRA_COLUMNS = 3;

  const servicesSection = document.querySelector('.services');
  if (servicesSection) {
    servicesSection.querySelectorAll('.services__item').forEach((el, i) => {
      const indexInRow = i % SERVICES_COLUMNS;
      animateItem(el, BASE_Y + indexInRow * STAGGER_Y, 0.5);
    });
  }

  document.querySelectorAll('.infra__item').forEach((el, i) => {
    animateItem(el, BASE_Y_INFRA_NEWS + (i % INFRA_COLUMNS) * STAGGER_Y);
  });

  const newsSection = document.querySelector('.news');
  if (newsSection) {
    newsSection.querySelectorAll('.news__item').forEach((el, i) => {
      animateItem(el, BASE_Y_INFRA_NEWS + (i % NEWS_COLUMNS) * STAGGER_Y);
    });
  }
}
