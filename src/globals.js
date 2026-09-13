/**
 * Initialize global constants on window.
 * Call in the browser after document.body exists.
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
