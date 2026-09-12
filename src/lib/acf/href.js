/**
 * Normalize ACF url/href field (single URL string: tel:, mailto:, https:, etc.).
 * @param {unknown} raw
 * @returns {string | undefined} Non-empty URL or undefined
 */
export function normalizeHref(raw) {
  const s = raw != null ? String(raw).trim() : "";
  if (!s) return undefined;
  if (s.toLowerCase().startsWith("tel:")) {
    const rest = s.slice(4).replace(/[^\d+*#]/g, "");
    return rest ? `tel:${rest}` : undefined;
  }
  return s;
}
