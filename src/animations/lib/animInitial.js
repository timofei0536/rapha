/**
 * Начальное состояние для GSAP: класс .anim-initial + CSS-переменные (--anim-opacity, --anim-y, …).
 * Используется из JS для динамических элементов (hero lines, parallax, mobile menu).
 */

function px(val) {
  if (val == null || val === '') return undefined;
  const s = String(val).trim();
  return /^\d+$/.test(s) ? `${s}px` : s;
}

/** Выставить элементу начальное состояние (opacity, y, x, scale) — класс .anim-initial и CSS-переменные. */
export function setInitialData(el, state) {
  if (!el || !state || typeof state !== 'object') return;
  el.classList.add('anim-initial');
  if (state.opacity !== undefined) el.style.setProperty('--anim-opacity', String(state.opacity));
  if (state.y !== undefined) el.style.setProperty('--anim-y', px(state.y));
  if (state.x !== undefined) el.style.setProperty('--anim-x', px(state.x));
  if (state.scale !== undefined) el.style.setProperty('--anim-scale', String(state.scale));
}
