/**
 * Normalize ACF group: single object with each key normalized by the given normalizer.
 *
 * @param {unknown} raw Raw object from ACF
 * @param {Record<string, (v: unknown) => unknown>} normalizersByKey Map field name → normalizer(rawValue)
 * @returns {Record<string, unknown> | undefined}
 */
export function normalizeGroup(raw, normalizersByKey) {
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  if (!normalizersByKey || typeof normalizersByKey !== "object") return undefined;
  const keys = Object.keys(normalizersByKey);
  if (keys.length === 0) return undefined;
  const out = {};
  for (const key of keys) {
    const fn = normalizersByKey[key];
    if (typeof fn !== "function") continue;
    const value = fn(raw[key]);
    if (value !== undefined) out[key] = value;
  }
  return Object.keys(out).length ? out : undefined;
}
