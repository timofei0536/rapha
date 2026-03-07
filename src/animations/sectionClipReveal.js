/**
 * Анимация обрезки секции сверху: clip-path от 5rem → 0.
 * ScrollTrigger: start "bottom bottom", end "center center".
 */

function isFooterClipDisabled() {
  if (typeof window === 'undefined' || !window.location) return false;
  const path = (window.location.pathname || '').replace(/\/$/, '') || '/';
  // careers: без footer parallax
  if (path === '/careers') return true;
  // single news
  if (path.startsWith('/news/')) return true;
  // текстовые страницы (одна секция: /about, /privacy, /terms-conditions и т.д.)
  if (path !== '/' && /^\/[^/]+$/.test(path)) return true;
  return false;
}

import { registerScrollTrigger, registerCleanupFn } from './lib/animCleanup';

export const selector = '.footer';
export const desktopOnly = true;

export function init() {
  const gsap = window.gsap;

  if (isFooterClipDisabled()) {
    gsap.set(document.querySelectorAll('.footer'), { clearProps: 'clipPath' });
    return;
  }

  const sections = document.querySelectorAll('.footer');

  sections.forEach((section) => {
    const tween = gsap.fromTo(
      section,
      { clipPath: 'inset(7rem 0px 0px 0px)' },
      {
        clipPath: 'inset(0px 0px 0px 0px)',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 2,
        },
      }
    );
    if (tween.scrollTrigger) registerScrollTrigger(tween.scrollTrigger, section);
  });

  registerCleanupFn(() => {
    if (window.gsap) window.gsap.set(document.querySelectorAll('.footer'), { clearProps: 'clipPath' });
  });
}

// /**
//  * Team: слой .team__bg (bottom: 100%, height: 7rem) при скролле
//  * bottom bottom → bottom center клипается по высоте на 100%.
//  */
// export function teamClipReveal() {
//   if (typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger) return;

//   const bg = document.querySelector('.team__bg');
//   const team = document.querySelector('.team');
//   if (!bg || !team) return;

//   const gsap = window.gsap;
//   gsap.fromTo(
//     bg,
//     { clipPath: 'inset(0 0 0 0)' },
//     {
//       clipPath: 'inset(0 0 100% 0)',
//       ease: 'none',
//       scrollTrigger: {
//         trigger: team,
//         start: 'bottom bottom',
//         end: 'bottom 40%',
//         scrub: 2,
//       },
//     }
//   );
// }
