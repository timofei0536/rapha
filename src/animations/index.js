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
  sectionPin({
    sectionSelector: '.about',
    pinSelector: '.about__gm',
    getEnd: (el) => {
      const pb = parseFloat(getComputedStyle(el).paddingBottom) || 0;
      return `bottom bottom+=${pb + 40}`;
    },
  });
  sectionPin({
    sectionSelector: '.new',
    pinSelector: '.new__img',
    getEnd: 'bottom bottom+=30',
  });
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
