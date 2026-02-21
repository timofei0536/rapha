/**
 * Replaces literal \n (backslash + n) with real newline. For use in WP text/link title.
 * @param {string} s
 * @returns {string}
 */
export function literalNewlines(s) {
  return String(s).replace(/\\n/g, "\n");
}

/**
 * Normalize ACF text field.
 * @param {unknown} raw
 * @returns {string | undefined} Trimmed non-empty string or undefined
 */
export function normalizeText(raw) {
  const s = raw != null ? String(raw).trim() : "";
  const out = literalNewlines(s);
  return out || undefined;
}
