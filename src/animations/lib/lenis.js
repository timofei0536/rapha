import Lenis from 'lenis';

/**
 * Lenis from sites/template (`scrollbarFix.js`), aligned with zeph.
 * v1.3 uses `syncTouch` instead of `smoothTouch`.
 */
const LENIS_OPTIONS = {
  duration: 1,
  smoothWheel: true,
  syncTouch: false,
  wheelMultiplier: 0.7,
};

function createSmoothbarCompat(lenis) {
  return {
    get scrollTop() {
      return lenis.scroll ?? lenis.animatedScroll ?? 0;
    },
    addListener(fn) {
      lenis.on('scroll', fn);
    },
    update() {
      lenis.resize?.();
    },
    scrollTo(_x, y, durationMs) {
      const duration = typeof durationMs === 'number' ? durationMs / 1000 : 1;
      lenis.scrollTo(y, { duration });
    },
  };
}

export function initLenis() {
  if (typeof window === 'undefined') return null;
  if (window.lenis) return window.lenis;
  if (!window.its_desktop) return null;

  const gsap = window.gsap;
  const lenis = new Lenis(LENIS_OPTIONS);

  if (gsap && !window.__raphaLenisGsapTicker) {
    window.__raphaLenisGsapTicker = true;
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  let scrollTriggerUpdateQueued = false;
  lenis.on('scroll', () => {
    if (!window.ScrollTrigger) return;
    if (scrollTriggerUpdateQueued) return;
    scrollTriggerUpdateQueued = true;
    requestAnimationFrame(() => {
      scrollTriggerUpdateQueued = false;
      window.ScrollTrigger?.update?.();
    });
  });

  window.lenis = lenis;
  window.smoothbar = createSmoothbarCompat(lenis);

  return lenis;
}

export function scrollToTop(event) {
  event?.preventDefault?.();
  if (window.lenis) {
    window.lenis.scrollTo(0, { duration: 1.15 });
    return;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
