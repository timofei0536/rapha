/**
 * Normalize ACF url/href field (single URL string: tel:, mailto:, https:, etc.).
 * @param {unknown} raw
 * @returns {string | undefined} Non-empty URL or undefined
 */
export function normalizeHref(raw) {
  const s = raw != null ? String(raw).trim() : "";
  return s || undefined;
}
