/**
 * Unwrap one-level wrappers and canonicalize link/image shapes.
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
 * @param {Record<string, unknown> | null | undefined} result
 * @returns {Record<string, unknown>}
 */
export function applyBlockFilter(result) {
  if (!result || typeof result !== "object") return {};
  const unwrapped = {};
  for (const key of Object.keys(result)) {
    unwrapped[key] = unwrapOneLevel(result[key]);
  }
  return canonicalize(unwrapped);
}
