/**
 * Normalize ACF text field.
 * @param {unknown} raw
 * @returns {string | undefined} Trimmed non-empty string or undefined
 */
export function normalizeText(raw) {
  const s = raw != null ? String(raw).trim() : "";
  return s || undefined;
}
