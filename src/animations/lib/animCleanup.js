/**
 * Единый реестр анимаций для очистки при смене страницы.
 * Модули регистрируют триггеры/таймлайны/слушатели через хелперы — дублирования нет.
 * На элементах при регистрации ставится data-anim-clean="<type>" для автоматической привязки.
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

/** Зарегистрировать ScrollTrigger — при runCleanup будет убит. */
export function registerScrollTrigger(trigger, element) {
  if (!trigger) return;
  registry.scrollTriggers.push(trigger);
  const t = trigger.trigger;
  const el = element || (t && (Array.isArray(t) ? t[0] : t));
  if (el && typeof el.setAttribute === 'function') markElement(el, 'scroll-trigger');
}

/** Зарегистрировать таймлайн — при runCleanup будет убит. */
export function registerTimeline(timeline, element) {
  if (!timeline) return;
  registry.timelines.push(timeline);
  if (element) markElement(element, 'timeline');
}

/** Зарегистрировать слушатель — при runCleanup будет снят. */
export function registerListener(element, event, handler) {
  if (!element || !handler) return;
  registry.listeners.push({ element, event, handler });
  markElement(element, 'listener');
}

/** Зарегистрировать функцию сброса (классы, clearProps, delete window.x и т.д.). */
export function registerCleanupFn(fn) {
  if (typeof fn === 'function') registry.cleanupFns.push(fn);
}

/**
 * Очистить всё зарегистрированное. Вызывается из refreshAnimations().
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
