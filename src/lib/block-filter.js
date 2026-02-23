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
 * @param {boolean} [strictWp] If true, never use defaults; use only result (empty object when result empty)
 * @returns {Record<string, unknown>} Props to pass to component
 */
function emptyForStrict(key, defaults) {
  const def = defaults?.[key];
  if (Array.isArray(def)) return [];
  if (typeof def === "string") return "";
  return undefined;
}

export function applyBlockFilter(result, defaults, strictWp = false) {
  const src = strictWp
    ? (result && typeof result === "object" ? result : {})
    : (result && typeof result === "object" ? result : defaults);
  if (!src || typeof src !== "object") return {};
  const unwrapped = {};
  const keys = strictWp ? new Set([...Object.keys(result || {}), ...Object.keys(defaults || {})]) : Object.keys(src);
  for (const key of keys) {
    let val = strictWp ? (result && result[key]) : src[key];
    if (strictWp && val === undefined) val = emptyForStrict(key, defaults);
    if (strictWp && val === undefined) continue;
    unwrapped[key] = unwrapOneLevel(val);
  }
  return canonicalize(unwrapped);
}
