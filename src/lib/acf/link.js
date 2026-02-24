import { literalNewlines } from "./text.js";

const WP_API_BASE =
  typeof process !== "undefined"
    ? (process.env.NEXT_PUBLIC_WP_API_URL || "").trim().replace(/\/$/, "")
    : "";
const WP_ORIGIN = WP_API_BASE
  ? (() => {
      try {
        return new URL(WP_API_BASE).origin;
      } catch {
        return "";
      }
    })()
  : "";

/**
 * Convert ACF Page Link URL (WP domain) to Next.js relative path for client-side routing.
 * If href is a full URL pointing to WP origin, returns pathname+search; otherwise returns href as-is.
 *
 * @param {string} href
 * @returns {string}
 */
function toNextPath(href) {
  if (!href || typeof href !== "string") return href;
  const s = href.trim();
  if (!s.startsWith("http://") && !s.startsWith("https://")) return s;
  if (!WP_ORIGIN) return s;
  try {
    const u = new URL(s);
    if (u.origin === WP_ORIGIN) {
      return u.pathname + u.search || "/";
    }
  } catch {
    // invalid URL
  }
  return s;
}

/**
 * Normalize ACF link field to { text, href, target? }.
 * ACF Page Link in REST API returns a URL string; Link field returns { url, title, target }; also support { href, text }.
 * WP full URLs are converted to relative paths for Next.js client-side routing.
 *
 * @param {unknown} raw Raw value from ACF or similar
 * @returns {{ text: string; href: string; target?: string } | undefined}
 */
export function normalizeLink(raw) {
  if (raw == null) return undefined;
  if (typeof raw === "string") {
    const href = toNextPath(raw.trim());
    return href ? { text: "", href } : undefined;
  }
  if (typeof raw !== "object") return undefined;
  const rawHref = raw.href ?? raw.url;
  if (!rawHref || typeof rawHref !== "string" || !rawHref.trim()) return undefined;
  const href = toNextPath(rawHref.trim());
  const text = raw.text ?? raw.title ?? "";
  const target = raw.target;
  return {
    text: literalNewlines(String(text ?? "").trim()),
    href,
    ...(target != null && String(target).trim() ? { target: String(target).trim() } : {}),
  };
}
