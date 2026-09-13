/**
 * Normalize a raw ACF value by inspecting the value (and field name for content).
 */

import { normalizeText } from "./text.js";
import { normalizeContent } from "./content.js";
import { normalizeHref } from "./href.js";
import { normalizeImage } from "./image.js";
import { normalizeGallery } from "./gallery.js";
import { normalizeLink } from "./link.js";

function isPlainObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function isContentKey(key) {
  return key === "content" || (typeof key === "string" && key.startsWith("content_"));
}

function isLinkKey(key) {
  return (
    key === "link" ||
    key === "href" ||
    key === "all_services" ||
    (typeof key === "string" && (key.startsWith("link_") || key.endsWith("_link")))
  );
}

function isImageLike(obj) {
  if (!isPlainObject(obj)) return false;
  const src = obj.src ?? obj.url ?? obj.source_url;
  if (typeof src !== "string" || !src.trim()) return false;
  if ("sizes" in obj || "mime_type" in obj || "alt" in obj || "alt_text" in obj || "source_url" in obj) {
    return true;
  }
  return "src" in obj && "alt" in obj;
}

function isLinkLike(obj) {
  if (!isPlainObject(obj)) return false;
  const href = obj.href ?? obj.url;
  if (typeof href !== "string" || !href.trim()) return false;
  if ("sizes" in obj || "mime_type" in obj || "alt" in obj || "alt_text" in obj || "source_url" in obj) {
    return false;
  }
  return "target" in obj || "title" in obj || "text" in obj;
}

function isFileLike(obj) {
  if (!isPlainObject(obj)) return false;
  const src = obj.url ?? obj.src;
  return typeof src === "string" && src.trim() && "title" in obj && !("alt" in obj) && !("alt_text" in obj) && !isLinkLike(obj);
}

/**
 * @param {string} [key]
 * @param {unknown} raw
 * @returns {unknown}
 */
export function normalizeAcfValue(key, raw) {
  if (raw == null || raw === false || raw === "") return undefined;
  if (typeof raw === "number" || typeof raw === "boolean") return raw;

  if (typeof raw === "string") {
    if (isLinkKey(key)) return normalizeLink(raw);
    return isContentKey(key) ? normalizeContent(raw) : normalizeText(raw);
  }

  if (Array.isArray(raw)) {
    if (raw.length === 0) return undefined;
    if (key === "gallery" || (typeof key === "string" && key.endsWith("_gallery"))) {
      const gallery = normalizeGallery(raw);
      if (gallery) return gallery;
    }
    const items = raw
      .map((item) => {
        if (isImageLike(item)) return normalizeImage(item);
        if (isLinkLike(item)) return normalizeLink(item);
        return normalizeAcfValue(key, item);
      })
      .filter((item) => item !== undefined);
    return items.length ? items : undefined;
  }

  if (!isPlainObject(raw)) return undefined;

  if (isLinkKey(key)) return normalizeLink(raw);
  if (key === "file") {
    const src = normalizeHref(raw.url ?? raw.src);
    return src ? { title: normalizeText(raw.title) ?? "", src } : undefined;
  }
  if (isImageLike(raw)) return normalizeImage(raw);
  if (isLinkLike(raw)) return normalizeLink(raw);
  if (isFileLike(raw)) {
    const src = normalizeHref(raw.url ?? raw.src);
    const title = normalizeText(raw.title) ?? "";
    return src ? { title, src } : undefined;
  }

  return normalizeAcfTree(raw);
}

/**
 * @param {Record<string, unknown> | null | undefined} raw
 * @returns {Record<string, unknown>}
 */
export function normalizeAcfTree(raw) {
  if (!isPlainObject(raw)) return {};
  const out = {};
  for (const [key, value] of Object.entries(raw)) {
    const normalized = normalizeAcfValue(key, value);
    if (normalized !== undefined) out[key] = normalized;
  }
  return out;
}
