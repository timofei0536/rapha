/**
 * Normalize ACF repeater: array of objects, each key normalized by the given normalizer.
 *
 * @param {unknown} raw Raw array from ACF
 * @param {Record<string, (v: unknown) => unknown>} normalizersByKey Map field name → normalizer(rawValue)
 * @returns {Record<string, unknown>[] | undefined}
 */
export function normalizeRepeater(raw, normalizersByKey) {
  if (!Array.isArray(raw) || !normalizersByKey || typeof normalizersByKey !== "object")
    return undefined;
  const keys = Object.keys(normalizersByKey);
  if (keys.length === 0) return undefined;
  const out = raw
    .map((item) => {
      if (item == null || typeof item !== "object") return null;
      const obj = {};
      for (const key of keys) {
        const fn = normalizersByKey[key];
        if (typeof fn !== "function") continue;
        const value = fn(item[key]);
        if (value !== undefined) obj[key] = value;
      }
      return Object.keys(obj).length ? obj : null;
    })
    .filter(Boolean);
  return out.length ? out : undefined;
}
