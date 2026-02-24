import { literalNewlines } from "./text.js";

/**
 * Normalize ACF link field to { text, href, target? }.
 * ACF Page Link in REST API returns a URL string; Link field returns { url, title, target }; also support { href, text }.
 *
 * @param {unknown} raw Raw value from ACF or similar
 * @returns {{ text: string; href: string; target?: string } | undefined}
 */
export function normalizeLink(raw) {
  if (raw == null) return undefined;
  if (typeof raw === "string") {
    const href = raw.trim();
    return href ? { text: "", href } : undefined;
  }
  if (typeof raw !== "object") return undefined;
  const href = raw.href ?? raw.url;
  if (!href || typeof href !== "string" || !href.trim()) return undefined;
  const text = raw.text ?? raw.title ?? "";
  const target = raw.target;
  return {
    text: literalNewlines(String(text ?? "").trim()),
    href: href.trim(),
    ...(target != null && String(target).trim() ? { target: String(target).trim() } : {}),
  };
}
