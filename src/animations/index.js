import { initGlobals } from '@/globals';
import { setHeroInitialState, resetHeroInitialState } from './heroEntrance';
import * as heroEntrance from './heroEntrance';
import * as headerWhite from './headerWhite';
import * as sectionPin from './sectionPin';
import * as parallaxAppearance from './parallaxAppearance';
import * as sectionClipReveal from './sectionClipReveal';
import * as pageScreenParallax from './pageScreenParallax';
import * as teamGallery from './teamGallery';
import * as mobileMenu from './mobileMenu';
import { structureColumns } from './structureColumns';
import { runCleanup } from './lib/animCleanup';
import { whenImagesReady } from './lib/whenImagesReady';

export { textLinesScript } from './textLines';
export { registerScrollTrigger, registerTimeline, registerListener, registerCleanupFn } from './lib/animCleanup';

const ANIMATIONS = [
  heroEntrance,
  headerWhite,
  sectionPin,
  parallaxAppearance,
  sectionClipReveal,
  pageScreenParallax,
  teamGallery,
  mobileMenu,
];

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

async function runScrollTriggers() {
  const hero = document.querySelector('.hero');
  if (!hero) {
    const header = document.querySelector('.header');
    if (header && window.gsap && window.its_desktop) {
      window.gsap.set(header, { y: 0 });
    }
  } else {
    await heroEntrance.init();
  }

  ANIMATIONS.forEach((entry) => {
    if (entry === heroEntrance) return;
    if (entry.desktopOnly && !window.its_desktop) return;
    if (entry.selector && !document.querySelector(entry.selector)) return;
    if (typeof entry.init !== 'function') return;
    entry.init();
  });

  if (window.its_desktop) structureColumns();
  if (window.ScrollTrigger) window.ScrollTrigger.refresh();
}

export function initAnimations() {
  if (typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);
  initGlobals();
  window.addLoadEvent = addLoadEvent;

  let readyCount = 0;
  const checkReady = () => {
    readyCount++;
    if (readyCount === 3) runScrollTriggers();
  };

  const hero = document.querySelector('.hero');
  if (hero) setHeroInitialState();

  checkReady();
  if (document.readyState === 'complete') {
    checkReady();
  } else {
    addLoadEvent(() => checkReady());
  }
  const hasPreloader = document.querySelector('.preloader');
  if (hasPreloader) {
    window.addEventListener('preloaderEnd', () => checkReady(), { once: true });
  } else {
    checkReady();
  }
}

/** Для Next.js: перезапуск анимаций после смены страницы (клиентский переход). */
export function refreshAnimations() {
  if (typeof window === 'undefined' || !window.ScrollTrigger) return;
  runCleanup();
  resetHeroInitialState();
  const container = document.querySelector('main') || document.body;

  let runScrollTriggersCalled = false;
  const runOnce = () => {
    if (runScrollTriggersCalled) return;
    runScrollTriggersCalled = true;
    runScrollTriggers();
  };

  whenImagesReady(container, runOnce);
  const REFRESH_IMAGES_TIMEOUT_MS = 3000;
  setTimeout(runOnce, REFRESH_IMAGES_TIMEOUT_MS);
}
