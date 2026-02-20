/**
 * Normalize ACF/WP image field to { src, alt }.
 * WP may return object with source_url, url, alt_text, alt, id, etc.
 *
 * @param {unknown} raw Raw value from ACF (object or undefined)
 * @returns {{ src: string; alt: string } | undefined}
 */
export function normalizeImage(raw) {
  if (raw == null || typeof raw !== "object") return undefined;
  const img = raw;
  const src = img.src ?? img.url ?? img.source_url ?? null;
  const alt = img.alt ?? img.alt_text ?? "";
  if (!src || typeof src !== "string" || !src.trim()) return undefined;
  return { src: src.trim(), alt: String(alt ?? "").trim() };
}
