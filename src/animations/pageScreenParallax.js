import { registerScrollTrigger } from './lib/animCleanup';

export const selector = '.page-screen';
export const desktopOnly = true;

export function init() {
  const gsap = window.gsap;

  document.querySelectorAll('.page-screen').forEach((section) => {
    const h1 = section.querySelector('h1');
    const st = {
      trigger: section,
      start: 'top top',
      end: 'bottom 35%',
      scrub: true,
    };

    if (h1) {
      const tween = gsap.to(h1, { opacity: 0, scrollTrigger: st });
      if (tween.scrollTrigger) registerScrollTrigger(tween.scrollTrigger, section);
    }
  });
}
