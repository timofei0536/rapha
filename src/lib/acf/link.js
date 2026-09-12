import { literalNewlines } from "./text.js";
import { normalizeHref } from "./href.js";

const WP_ORIGIN =
  typeof process !== "undefined"
    ? (() => {
        const base = (process.env.NEXT_PUBLIC_WP_API_URL || "").trim().replace(/\/$/, "");
        if (!base) return "";
        try {
          return new URL(base).origin;
        } catch {
          return "";
        }
      })()
    : "";

/** WP full URL → path. Один сегмент /slug = пост → /news/slug. */
const PAGES = new Set(["about", "contact", "services", "careers", "news", "results", "privacy-policy", "terms-conditions", "home"]);

function toRelativePath(href) {
  if (!href || typeof href !== "string") return href;
  const s = href.trim();
  if (!s.startsWith("http://") && !s.startsWith("https://")) return s;
  if (!WP_ORIGIN) return s;
  try {
    const u = new URL(s);
    if (u.origin !== WP_ORIGIN) return s;
    const search = u.search || "";
    let path = u.pathname || "/";
    const seg = path.replace(/\/+$/, "").split("/").filter(Boolean);
    if (seg.length === 1 && !PAGES.has(seg[0])) path = `/news/${seg[0]}`;
    return path + search;
  } catch {
    /* invalid URL */
  }
  return s;
}

/**
 * Normalize ACF link field to { text, href, target? }.
 * Universal: WP full URLs are converted to relative paths for Next.js; applies to all blocks (services, infra, etc.).
 *
 * @param {unknown} raw Raw value from ACF or similar
 * @returns {{ text: string; href: string; target?: string } | undefined}
 */
export function normalizeLink(raw) {
  if (raw == null) return undefined;
  if (typeof raw === "string") {
    const href = toRelativePath(normalizeHref(raw) || "");
    return href ? { text: "", href } : undefined;
  }
  if (typeof raw !== "object") return undefined;
  const rawHref = raw.href ?? raw.url;
  if (!rawHref || typeof rawHref !== "string" || !rawHref.trim()) return undefined;
  const href = toRelativePath(normalizeHref(rawHref) || "");
  const text = raw.text ?? raw.title ?? "";
  const target = raw.target;
  return {
    text: literalNewlines(String(text ?? "").trim()),
    href,
    ...(target != null && String(target).trim() ? { target: String(target).trim() } : {}),
  };
}
