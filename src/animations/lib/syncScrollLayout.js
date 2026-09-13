/** Lenis dimensions + ScrollTrigger.refresh after layout changes (images, route, init). */
export function syncScrollTriggerLayout() {
  if (typeof window === 'undefined') return;
  window.lenis?.resize?.();
  window.ScrollTrigger?.refresh?.();
}
