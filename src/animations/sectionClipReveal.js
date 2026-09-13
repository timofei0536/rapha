/**
 * Clip the section from the top: clip-path from 5.25rem → 0.
 * ScrollTrigger: start "bottom bottom", end "center center".
 */

function isFooterClipDisabled() {
  if (typeof window === 'undefined' || !window.location) return false;
  const path = (window.location.pathname || '').replace(/\/$/, '') || '/';
  // text pages (single section: /about, /privacy, /terms-conditions, etc.)
  if (path !== '/' && path !== '/careers' && /^\/[^/]+$/.test(path)) return true;
  return false;
}

import { registerScrollTrigger, registerCleanupFn } from './lib/animCleanup';

export const selector = '.footer__inner';
export const desktopOnly = true;

export function init() {
  const gsap = window.gsap;

  if (isFooterClipDisabled()) {
    gsap.set(document.querySelectorAll('.footer__inner'), { clearProps: 'clipPath' });
    return;
  }

  const sections = document.querySelectorAll('.footer__inner');

  sections.forEach((section) => {
    const tween = gsap.fromTo(
      section,
      { clipPath: 'inset(5.25rem 0px 0px 0px)' },
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
    if (window.gsap) window.gsap.set(document.querySelectorAll('.footer__inner'), { clearProps: 'clipPath' });
  });
}

// /**
//  * Team: .team__bg layer (bottom: 100%, height: 7rem) on scroll
//  * bottom bottom → bottom center clips height to 100%.
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
