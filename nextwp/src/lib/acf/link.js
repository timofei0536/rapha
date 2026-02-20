/**
 * Normalize ACF link field to { text, href, target? }.
 * ACF returns { url, title, target }; also support { href, text }.
 *
 * @param {unknown} raw Raw value from ACF or similar
 * @returns {{ text: string; href: string; target?: string } | undefined}
 */
export function normalizeLink(raw) {
  if (raw == null || typeof raw !== "object") return undefined;
  const href = raw.href ?? raw.url;
  if (!href || typeof href !== "string" || !href.trim()) return undefined;
  const text = raw.text ?? raw.title ?? "";
  const target = raw.target;
  return {
    text: String(text ?? "").trim(),
    href: href.trim(),
    ...(target != null && String(target).trim() ? { target: String(target).trim() } : {}),
  };
}
