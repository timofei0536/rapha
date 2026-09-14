/**
 * Lenis dimensions + throttled ScrollTrigger.refresh — same as zeph/sda.
 */
const REFRESH_THROTTLE_MS = 1500;

function nowMs() {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
}

export function refreshScrollTriggerThrottled() {
  if (typeof window === 'undefined') return false;
  const st = window.ScrollTrigger;
  if (!st || typeof st.refresh !== 'function') return false;

  const t = nowMs();
  const last = Number(window.__raphaLastScrollTriggerRefreshMs || 0);
  if (t - last < REFRESH_THROTTLE_MS) return false;

  window.__raphaLastScrollTriggerRefreshMs = t;
  st.refresh();
  return true;
}

export function syncScrollTriggerLayoutForce() {
  if (typeof window === 'undefined') return;
  window.lenis?.resize?.();
  const st = window.ScrollTrigger;
  if (!st || typeof st.refresh !== 'function') return;
  st.refresh();
  window.__raphaLastScrollTriggerRefreshMs = nowMs();
}

export function syncScrollTriggerLayout() {
  if (typeof window === 'undefined') return;
  window.lenis?.resize?.();
  refreshScrollTriggerThrottled();
}
