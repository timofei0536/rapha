import Lenis from 'lenis';

/**
 * Lenis from sites/template (`scrollbarFix.js`), aligned with zeph/sda:
 * scrollerProxy + GSAP ticker, no per-scroll ScrollTrigger.update()
 * (native html scroll + proxy keep ST in sync; extra update() was doubling work).
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
  const ScrollTrigger = window.ScrollTrigger;
  const lenis = new Lenis(LENIS_OPTIONS);

  if (ScrollTrigger && !window.__raphaLenisScrollerProxy) {
    window.__raphaLenisScrollerProxy = true;
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        const current = window.lenis;
        if (!current) return window.scrollY || 0;
        if (arguments.length) {
          current.scrollTo(value, { immediate: true });
        }
        return current.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });
    ScrollTrigger.defaults({ scroller: document.documentElement });
    ScrollTrigger.addEventListener('refresh', () => {
      window.lenis?.resize();
    });
  }

  if (gsap && !window.__raphaLenisGsapTicker) {
    window.__raphaLenisGsapTicker = true;
    gsap.ticker.add((time) => {
      window.lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

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
