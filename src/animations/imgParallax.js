/**
 * Vertical image parallax: `.img-parallax > .img-parallax__wrap > img`.
 * Scale + yPercent (zeph/mystic), not clip-path — the frame stays filled.
 */
import { registerScrollTrigger, registerCleanupFn } from './lib/animCleanup';

export const selector = '.img-parallax';
export const desktopOnly = true;

const SCALE = 1.15;
const YPERCENT_RANGE = 7.5;

export function init() {
  const gsap = window.gsap;
  if (!gsap || !window.its_desktop) return;

  const items = document.querySelectorAll('.img-parallax');
  if (!items.length) return;

  items.forEach((item) => {
    const wrap = item.querySelector(':scope > .img-parallax__wrap');
    if (!wrap) return;

    const tween = gsap.fromTo(
      wrap,
      { scale: SCALE, yPercent: -YPERCENT_RANGE, transformOrigin: 'center center' },
      {
        scale: SCALE,
        yPercent: YPERCENT_RANGE,
        ease: 'none',
        immediateRender: true,
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
    if (tween.scrollTrigger) registerScrollTrigger(tween.scrollTrigger, item);
  });

  registerCleanupFn(() => {
    if (!window.gsap) return;
    document.querySelectorAll('.img-parallax > .img-parallax__wrap').forEach((el) => {
      window.gsap.set(el, { clearProps: 'transform' });
    });
  });
}
