/**
 * Инициализация глобальных констант в window.
 * Вызывать в браузере после наличия document.body.
 */
export function initGlobals() {
  if (typeof window === 'undefined') return;

  window.SCROLL_EL = 'html';
  window.LARGE_TABLET = 1023;

  window.its_desktop = true;
  const body = document.querySelector('body');
  if (body && body.clientWidth < window.LARGE_TABLET) {
    window.its_desktop = false;
  }

}
