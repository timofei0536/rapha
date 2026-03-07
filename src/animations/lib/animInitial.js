/**
 * Единый стандарт начального состояния для GSAP: только data-атрибуты + один слой.
 * Задаём в JSX (data-anim-opacity, data-anim-y, …) или в JS (setInitialData + apply).
 * Один универсальный CSS (.anim-initial) в globals; значения применяются через JS из атрибутов.
 */

const ATTRS = ['animOpacity', 'animY', 'animX', 'animScale'];

function parseValue(key, value) {
  if (value == null || value === '') return undefined;
  const v = String(value).trim();
  if (key === 'animOpacity' || key === 'animScale') return v;
  return v;
}

/** Прочитать начальное состояние с элемента (data-anim-opacity, data-anim-y, …). */
export function getInitialState(el) {
  if (!el || !el.dataset) return {};
  const state = {};
  ATTRS.forEach((attr) => {
    const val = el.dataset[attr];
    if (val !== undefined) state[attr.replace('anim', '').toLowerCase()] = parseValue(attr, val);
  });
  return state;
}

/** Применить начальное состояние к элементу: выставить CSS-переменные и класс .anim-initial. */
export function applyInitialState(el) {
  if (!el) return;
  const state = getInitialState(el);
  if (Object.keys(state).length === 0) return;
  el.classList.add('anim-initial');
  if (state.opacity !== undefined) el.style.setProperty('--anim-opacity', state.opacity);
  if (state.y !== undefined) el.style.setProperty('--anim-y', /^\d+$/.test(state.y) ? `${state.y}px` : state.y);
  if (state.x !== undefined) el.style.setProperty('--anim-x', /^\d+$/.test(state.x) ? `${state.x}px` : state.x);
  if (state.scale !== undefined) el.style.setProperty('--anim-scale', state.scale);
}

/** Задать data-атрибуты и применить (для динамических значений из JS). */
export function setInitialData(el, state) {
  if (!el) return;
  if (state.opacity !== undefined) el.dataset.animOpacity = state.opacity;
  if (state.y !== undefined) el.dataset.animY = state.y;
  if (state.x !== undefined) el.dataset.animX = state.x;
  if (state.scale !== undefined) el.dataset.animScale = state.scale;
  applyInitialState(el);
}

/** Применить начальное состояние ко всем элементам в контейнере с data-anim-*. */
export function applyInitialStateIn(container) {
  if (!container) return;
  const sel = ATTRS.map((a) => `[data-${a.replace(/([A-Z])/g, '-$1').toLowerCase()}]`).join(', ');
  container.querySelectorAll(sel).forEach(applyInitialState);
}
