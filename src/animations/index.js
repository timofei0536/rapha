import '@/lib/gsap';
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
import * as imgParallax from './imgParallax';
import { runCleanup } from './lib/animCleanup';
import { initLenis } from './lib/lenis';
import { whenImagesReady } from './lib/whenImagesReady';
import { syncScrollTriggerLayout } from './lib/syncScrollLayout';

export { textLinesScript } from './textLines';
export { registerScrollTrigger, registerTimeline, registerListener, registerCleanupFn } from './lib/animCleanup';
export { syncScrollTriggerLayout };

let animationsBootstrapDone = false;

const ANIMATIONS = [
  heroEntrance,
  headerWhite,
  sectionPin,
  parallaxAppearance,
  sectionClipReveal,
  pageScreenParallax,
  teamGallery,
  imgParallax,
  mobileMenu,
];

function whenWindowLoadComplete() {
  if (document.readyState === 'complete') return Promise.resolve();
  return new Promise((resolve) => {
    window.addEventListener('load', resolve, { once: true });
  });
}

function whenPreloaderFinishedIfPresent() {
  if (!document.querySelector('.preloader') || window.preloaderDone) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    window.addEventListener('preloaderEnd', resolve, { once: true });
  });
}

function scheduleRunScrollTriggersAfterLayout() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      void runScrollTriggers();
    });
  });
}

async function runScrollTriggers() {
  const hero = document.querySelector('.hero');
  if (!hero) {
    const header = document.querySelector('.header');
    if (header && window.gsap && window.its_desktop) {
      window.gsap.set(header, { y: 0 });
    }
  }

  for (const entry of ANIMATIONS) {
    if (entry.desktopOnly && !window.its_desktop) continue;
    if (entry.selector && !document.querySelector(entry.selector)) continue;
    if (typeof entry.init !== 'function') continue;
    await entry.init();
  }

  if (window.its_desktop) structureColumns();
  syncScrollTriggerLayout();
}

function armScrollTriggersWhenReady() {
  Promise.all([whenWindowLoadComplete(), whenPreloaderFinishedIfPresent()]).then(
    scheduleRunScrollTriggersAfterLayout,
  );
}

export function initAnimations() {
  if (typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger) return;
  if (animationsBootstrapDone) return;
  animationsBootstrapDone = true;

  window.gsap.registerPlugin(window.ScrollTrigger);
  initGlobals();
  initLenis();

  const hero = document.querySelector('.hero');
  if (hero) setHeroInitialState();

  armScrollTriggersWhenReady();
}

/** For Next.js: restart animations after a client-side page change. */
export function refreshAnimations() {
  if (typeof window === 'undefined' || !window.ScrollTrigger) return;
  runCleanup();
  resetHeroInitialState();

  scheduleRunScrollTriggersAfterLayout();

  const container = document.querySelector('main') || document.body;
  whenImagesReady(container, () => {
    syncScrollTriggerLayout();
  });
}
