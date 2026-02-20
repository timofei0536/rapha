/**
 * Ensure objects have canonical shape: link = href + target, image = src + alt.
 * Recursive; max depth to avoid cycles. Used after filter, before passing to component.
 *
 * @param {unknown} obj Any value (object, array, primitive)
 * @param {number} [depth=0] Current depth (max 7)
 * @returns {unknown} New value with canonical shape (mutates only added keys; nested objects are copied)
 */
export function canonicalize(obj, depth = 0) {
  const MAX_DEPTH = 7;
  if (depth > MAX_DEPTH) return obj;
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => canonicalize(item, depth + 1));
  }

  const o = obj;
  const keys = Object.keys(o);
  let out = { ...o };

  const hasHref = "href" in o || "url" in o;
  const hasTarget = "target" in o;
  const hasSrc = "src" in o;
  const hasAlt = "alt" in o;
  if (hasHref && !hasTarget) {
    out.target = out.target ?? "_self";
  }
  if (hasSrc && !hasAlt) {
    out.alt = out.alt ?? "";
  }

  for (const key of keys) {
    const val = o[key];
    if (val !== null && typeof val === "object") {
      out[key] = canonicalize(Array.isArray(val) ? [...val] : { ...val }, depth + 1);
    }
  }
  return out;
}
