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

const ENTRY_NAMES = {
  [heroEntrance]: 'heroEntrance',
  [headerWhite]: 'headerWhite',
  [sectionPin]: 'sectionPin',
  [parallaxAppearance]: 'parallaxAppearance',
  [sectionClipReveal]: 'sectionClipReveal',
  [pageScreenParallax]: 'pageScreenParallax',
  [teamGallery]: 'teamGallery',
  [mobileMenu]: 'mobileMenu',
};

async function runScrollTriggers() {
  console.log('[anim] runScrollTriggers() start');
  const hero = document.querySelector('.hero');
  console.log('[anim] hero:', !!hero, 'its_desktop:', window.its_desktop);
  if (!hero) {
    const header = document.querySelector('.header');
    if (header && window.gsap && window.its_desktop) {
      window.gsap.set(header, { y: 0 });
      console.log('[anim] header set y:0 (no hero)');
    }
  } else {
    console.log('[anim] heroEntrance.init()...');
    await heroEntrance.init();
    console.log('[anim] heroEntrance.init() done');
  }

  ANIMATIONS.forEach((entry) => {
    const name = ENTRY_NAMES[entry] || '?';
    if (entry === heroEntrance) {
      console.log('[anim] skip', name, '(already ran)');
      return;
    }
    if (entry.desktopOnly && !window.its_desktop) {
      console.log('[anim] skip', name, 'desktopOnly && !its_desktop');
      return;
    }
    if (entry.selector && !document.querySelector(entry.selector)) {
      console.log('[anim] skip', name, 'no selector', entry.selector);
      return;
    }
    if (typeof entry.init !== 'function') {
      console.log('[anim] skip', name, 'no init');
      return;
    }
    console.log('[anim] init', name);
    entry.init();
  });

  if (window.its_desktop) {
    console.log('[anim] structureColumns()');
    structureColumns();
  }
  if (window.ScrollTrigger) {
    console.log('[anim] ScrollTrigger.refresh()');
    window.ScrollTrigger.refresh();
  }
  console.log('[anim] runScrollTriggers() end');
}

export function initAnimations() {
  console.log('[anim] initAnimations() called', {
    hasWindow: typeof window !== 'undefined',
    hasGsap: !!window.gsap,
    hasScrollTrigger: !!window.ScrollTrigger,
    readyState: typeof document !== 'undefined' ? document.readyState : 'n/a',
  });
  if (typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger) {
    console.log('[anim] initAnimations() early return (no gsap/ST)');
    return;
  }
  window.gsap.registerPlugin(window.ScrollTrigger);
  initGlobals();
  console.log('[anim] initGlobals done, its_desktop:', window.its_desktop);
  window.addLoadEvent = addLoadEvent;

  let readyCount = 0;
  const checkReady = (label) => {
    if (label) console.log('[anim]', label, `(${readyCount + 1}/3)`);
    readyCount++;
    if (readyCount === 3) {
      console.log('[anim] readyCount === 3 → runScrollTriggers()');
      runScrollTriggers();
    }
  };

  const hero = document.querySelector('.hero');
  if (hero) {
    console.log('[anim] setHeroInitialState() (hero found)');
    setHeroInitialState();
  }

  checkReady('GSAP ready');
  if (document.readyState === 'complete') {
    checkReady('window.load (already complete)');
  } else {
    addLoadEvent(() => checkReady('window.load'));
  }
  const hasPreloader = document.querySelector('.preloader');
  console.log('[anim] hasPreloader:', !!hasPreloader);
  if (hasPreloader) {
    window.addEventListener('preloaderEnd', () => checkReady('preloader done'), { once: true });
  } else {
    checkReady('no preloader');
  }
}

/** Для Next.js: перезапуск анимаций после смены страницы (клиентский переход). */
export function refreshAnimations() {
  console.log('[anim] refreshAnimations() called', {
    hasWindow: typeof window !== 'undefined',
    hasScrollTrigger: !!window.ScrollTrigger,
  });
  if (typeof window === 'undefined' || !window.ScrollTrigger) {
    console.log('[anim] refreshAnimations() early return');
    return;
  }
  console.log('[anim] runCleanup()');
  runCleanup();
  console.log('[anim] resetHeroInitialState()');
  resetHeroInitialState();
  const container = document.querySelector('main') || document.body;
  const images = container ? Array.from(container.querySelectorAll('img')) : [];
  const pending = images.filter((img) => !img.complete);
  console.log('[anim] whenImagesReady: container=', !!container, 'images=', images.length, 'pending=', pending.length);

  let runScrollTriggersCalled = false;
  const runOnce = () => {
    if (runScrollTriggersCalled) return;
    runScrollTriggersCalled = true;
    console.log('[anim] runScrollTriggers() (images ready or timeout)');
    runScrollTriggers();
  };

  whenImagesReady(container, runOnce);
  const REFRESH_IMAGES_TIMEOUT_MS = 3000;
  setTimeout(runOnce, REFRESH_IMAGES_TIMEOUT_MS);
}
