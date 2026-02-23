import { initGlobals } from '@/globals';
import { headerWhite } from './headerWhite';
import { sectionPin } from './sectionPin';
import { initMobileMenu } from './mobileMenu';
import { heroEntrance, setHeroInitialState, resetHeroInitialState } from './heroEntrance';
import { parallaxAppearance } from './parallaxAppearance';
import { sectionClipReveal } from './sectionClipReveal';
// import { teamClipReveal } from './sectionClipReveal';
import { teamGallery } from './teamGallery';

export { textLinesScript } from './textLines';

function addLoadEvent(func) {
  const oldonload = window.onload;
  if (typeof window.onload !== 'function') {
    window.onload = func;
  } else {
    window.onload = function () {
      if (oldonload) oldonload();
      func();
    };
  }
}

function runScrollTriggers() {
  if (document.querySelector('.hero')) {
    heroEntrance();
  }
  window.ScrollTrigger.refresh();
  headerWhite();
  parallaxAppearance();
  sectionClipReveal(); // только footer clip-path
  // teamClipReveal();
  if (document.querySelector('.team__wrap')) teamGallery();
  if (document.querySelector('.calc')) calcCards();
  if (window.its_desktop) sectionPin();
  initMobileMenu();
  window.ScrollTrigger.refresh();
}

export function initAnimations() {
  if (typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);
  initGlobals();
  window.addLoadEvent = addLoadEvent;

  const hasPreloader = document.querySelector('.preloader');

  if (hasPreloader) {
    if (document.querySelector('.hero')) setHeroInitialState();
    window.addEventListener('preloaderEnd', runScrollTriggers, { once: true });
  } else {
    if (document.readyState === 'complete') {
      runScrollTriggers();
    } else {
      addLoadEvent(runScrollTriggers);
    }
  }
}

/** Для Next.js: перезапуск анимаций после смены страницы (клиентский переход). */
export function refreshAnimations() {
  if (typeof window === 'undefined' || !window.ScrollTrigger) return;
  window.ScrollTrigger.getAll().forEach((t) => t.kill());
  resetHeroInitialState();
  runScrollTriggers();
}
