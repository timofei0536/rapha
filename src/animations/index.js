import { initGlobals } from '@/globals';
import { headerWhite } from './headerWhite';
import { sectionPin } from './sectionPin';

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
  window.ScrollTrigger.refresh();
  headerWhite();
  sectionPin();
  window.ScrollTrigger.refresh();
}

export function initAnimations() {
  if (typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);
  initGlobals();
  window.addLoadEvent = addLoadEvent;
  if (document.readyState === 'complete') {
    runScrollTriggers();
  } else {
    addLoadEvent(runScrollTriggers);
  }
}
