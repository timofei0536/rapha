import { textLinesScript } from './textLines';

let heroInitialStatePromise = null;

/** Подготовка hero: разбивка заголовка на строки. Начальные CSS-состояния заданы в Hero.scss. */
export function setHeroInitialState() {
  if (typeof window === 'undefined' || !window.gsap) return Promise.resolve();
  if (heroInitialStatePromise) return heroInitialStatePromise;

  const hero = document.querySelector('.hero');
  const titleEl = hero?.querySelector('.hero__title');

  if (!hero || !titleEl) return Promise.resolve();

  const gsap = window.gsap;

  heroInitialStatePromise = (async () => {
    await textLinesScript(titleEl, false, true);

    const lines = hero.querySelectorAll('.anim-line');
    gsap.set(lines, { opacity: 0, y: 28 });
  })();

  return heroInitialStatePromise;
}

export function resetHeroInitialState() {
  heroInitialStatePromise = null;
}

export async function heroEntrance() {
  if (typeof window === 'undefined' || !window.gsap) return;

  const hero = document.querySelector('.hero');
  const header = document.querySelector('.header');
  const titleEl = hero?.querySelector('.hero__title');
  const bgEl = hero?.querySelector('.hero__bg img');
  const formElems = hero?.querySelectorAll('.hero__form-title , .hero .form');

  if (!hero || !titleEl) return;

  await setHeroInitialState();

  const lines = hero.querySelectorAll('.anim-line');
  const gsap = window.gsap;

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  if (header) header.classList.add('header--white');
  tl.set(titleEl, { opacity: 1 }, 0);
  tl.to(lines, { opacity: 1, y: 0, duration: 1, stagger: 0.2 }, 0);
  if (window.its_desktop) tl.to(formElems, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power2.out' }, 1);
  if (window.its_desktop) tl.to(header, { y: 0, duration: 1, ease: 'power2.out' }, 1);
  tl.to(bgEl, { scale: 1, duration: 5, ease: 'power3.out' }, 0);
}
