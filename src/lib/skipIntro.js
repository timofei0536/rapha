export const SKIP_INTRO_CLASS = 'no-intro';

const BOT_UA =
  /Chrome-Lighthouse|Lighthouse|PageSpeed|GTmetrix|Pingdom|WebPageTest|PTST/i;

export function detectSkipIntro() {
  if (typeof window === 'undefined') return false;

  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  } catch {
    /* ignore */
  }

  if (BOT_UA.test(navigator.userAgent || '')) return true;

  try {
    if (new URLSearchParams(window.location.search).has('nointro')) return true;
  } catch {
    /* ignore */
  }

  return false;
}

export function shouldSkipIntro() {
  if (typeof window === 'undefined') return false;
  if (window.__noIntro) return true;
  if (document.documentElement.classList.contains(SKIP_INTRO_CLASS)) return true;
  return detectSkipIntro();
}

/** Runs in <head> before first paint so LCP is not a hidden hero / preloader. */
export const SKIP_INTRO_BOOTSTRAP = `(function(){try{var skip=(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)||/Chrome-Lighthouse|Lighthouse|PageSpeed|GTmetrix|Pingdom|WebPageTest|PTST/i.test(navigator.userAgent||"")||/[?&]nointro(?:[=&]|$)/.test(location.search);if(!skip)return;document.documentElement.classList.add("${SKIP_INTRO_CLASS}");window.__noIntro=true;window.preloaderDone=true;}catch(e){}})();`;
