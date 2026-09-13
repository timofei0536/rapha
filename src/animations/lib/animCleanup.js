/**
 * Shared animation registry for cleanup on page change.
 * Modules register triggers/timelines/listeners via helpers — no duplication.
 * On register, elements get data-anim-clean="<type>" for automatic binding.
 */

const PREFIX = 'data-anim-clean';

const registry = {
  scrollTriggers: [],
  timelines: [],
  listeners: [],
  cleanupFns: [],
};

function markElement(el, type) {
  if (el && el.setAttribute) el.setAttribute(PREFIX, type);
}

/** Register a ScrollTrigger — killed in runCleanup. */
export function registerScrollTrigger(trigger, element) {
  if (!trigger) return;
  registry.scrollTriggers.push(trigger);
  const t = trigger.trigger;
  const el = element || (t && (Array.isArray(t) ? t[0] : t));
  if (el && typeof el.setAttribute === 'function') markElement(el, 'scroll-trigger');
}

/** Register a timeline — killed in runCleanup. */
export function registerTimeline(timeline, element) {
  if (!timeline) return;
  registry.timelines.push(timeline);
  if (element) markElement(element, 'timeline');
}

/** Register a listener — removed in runCleanup. */
export function registerListener(element, event, handler) {
  if (!element || !handler) return;
  registry.listeners.push({ element, event, handler });
  markElement(element, 'listener');
}

/** Register a reset function (classes, clearProps, delete window.x, etc.). */
export function registerCleanupFn(fn) {
  if (typeof fn === 'function') registry.cleanupFns.push(fn);
}

/**
 * Clear everything registered. Called from refreshAnimations().
 */
export function runCleanup() {
  registry.scrollTriggers.forEach((t) => t.kill());
  registry.scrollTriggers.length = 0;

  registry.timelines.forEach((t) => t.kill());
  registry.timelines.length = 0;

  registry.listeners.forEach(({ element, event, handler }) => {
    if (element && handler) element.removeEventListener(event, handler);
  });
  registry.listeners.length = 0;

  registry.cleanupFns.forEach((fn) => fn());
  registry.cleanupFns.length = 0;
}
