/**
 * Parallax-появление: trigger = сам элемент, stagger через fromY (без delay — старт при входе).
 */

export function parallaxAppearance() {
  if (typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger) return;

  const gsap = window.gsap;
  const stDefaults = { start: 'top bottom', end: 'top center', scrub: 1 };
  const TWEEN_DURATION = 2;

  function animateItem(el, fromY, opacityDuration = 1) {
    gsap.set(el, { opacity: 0, y: fromY });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, ...stDefaults },
    });
    tl.to(el, { opacity: 1, duration: opacityDuration }, 0);
    tl.to(el, { y: 0, duration: TWEEN_DURATION }, '<');
  }

  // fromY растёт по индексу в ряду → визуальный stagger, анимация стартует при входе (top bottom)
  const BASE_Y = 50;
  const BASE_Y_INFRA_NEWS = 15;
  const STAGGER_Y = 25;

  // const BASE_BTN_Y = 0;
  // const STAGGER_BTN_Y = 0;

  const SERVICES_COLUMNS = 3;
  const NEWS_COLUMNS = 3;
  const INFRA_COLUMNS = 3;

  const servicesSection = document.querySelector('.services');
  if (servicesSection) {
    servicesSection.querySelectorAll('.services__item').forEach((el, i) => {
      const indexInRow = i % SERVICES_COLUMNS;
      animateItem(el, BASE_Y + indexInRow * STAGGER_Y, 0.5);
    });
    // servicesSection.querySelectorAll('.services__btns .btn').forEach((el, i) => {
    //   animateItem(el, BASE_BTN_Y + i * STAGGER_BTN_Y, 0.5);
    // });
  }

  document.querySelectorAll('.infra__item').forEach((el, i) => {
    animateItem(el, BASE_Y_INFRA_NEWS + (i % INFRA_COLUMNS) * STAGGER_Y);
  });

  const newsSection = document.querySelector('.news');
  if (newsSection) {
    newsSection.querySelectorAll('.news__item').forEach((el, i) => {
      animateItem(el, BASE_Y_INFRA_NEWS + (i % NEWS_COLUMNS) * STAGGER_Y);
    });
    // newsSection.querySelectorAll('.news__more .btn').forEach((el, i) => {
    //   animateItem(el, BASE_BTN_Y + i * STAGGER_BTN_Y);
    // });
  }
}
