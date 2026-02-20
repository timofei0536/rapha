/**
 * One block filter: takes merged result (or raw) + defaults, returns props for component.
 * No array gluing: for array keys we use either full raw or full default.
 * Uses canonicalize to ensure link (href+target), image (src+alt).
 */

import { canonicalize } from "@/lib/canonicalize";

/**
 * Unwrap one level if value is object with single key (e.g. { link: { href, target } } from API).
 *
 * @param {unknown} val
 * @returns {unknown}
 */
function unwrapOneLevel(val) {
  if (val == null || typeof val !== "object" || Array.isArray(val)) return val;
  const keys = Object.keys(val);
  if (keys.length !== 1) return val;
  const inner = val[keys[0]];
  if (inner == null || typeof inner !== "object") return val;
  return inner;
}

/**
 * Apply block filter: canonicalize result so link has target, image has alt.
 * When used after getBlockProps, result is already merged; this only ensures canonical shape.
 *
 * @param {Record<string, unknown>} result Props from getBlockProps (or raw from getPageComponentData)
 * @param {Record<string, unknown>} defaults Default props for the block (fallback when result empty)
 * @returns {Record<string, unknown>} Props to pass to component
 */
export function applyBlockFilter(result, defaults) {
  const src = result && typeof result === "object" ? result : defaults;
  if (!src || typeof src !== "object") return {};
  const unwrapped = {};
  for (const key of Object.keys(src)) {
    let val = src[key];
    unwrapped[key] = unwrapOneLevel(val);
  }
  return canonicalize(unwrapped);
}
