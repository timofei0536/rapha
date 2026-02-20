/**
 * Normalize ACF content/wysiwyg field (HTML string).
 * @param {unknown} raw
 * @returns {string | undefined} Trimmed non-empty string or undefined
 */
export function normalizeContent(raw) {
  const s = raw != null ? String(raw).trim() : "";
  return s || undefined;
}
