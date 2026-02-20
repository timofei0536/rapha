/**
 * Fetch WordPress page by slug (headless). ACF fields are expected in response.acf.
 * NextWP stores clone fields as component_<name>_<field> (e.g. component_careers_title).
 *
 * Set NEXT_PUBLIC_WP_API_URL to your WP site URL (e.g. https://rapha.tim-work.com).
 * If unset, no fetch is performed and components use their default props.
 */

import { normalizeGallery as normalizeGalleryAcf, normalizeText } from "@/lib/acf";

const WP_API_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_WP_API_URL
    ? process.env.NEXT_PUBLIC_WP_API_URL.replace(/\/$/, "")
    : "";

/**
 * Fetch page by slug from WP REST API. ACF in response when exposed by plugin.
 * GET /wp-json/wp/v2/pages?slug=<slug> → array, page is first item.
 *
 * @param {string} slug Page slug (e.g. 'careers')
 * @returns {Promise<Record<string, unknown> | null>} Page object or null
 */
const isDev = typeof process !== "undefined" && process.env.NODE_ENV === "development";

export async function getPageBySlug(slug) {
  if (!WP_API_BASE) return null;
  try {
    const res = await fetch(
      `${WP_API_BASE}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_embed`,
      isDev ? { cache: "no-store" } : { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const page = Array.isArray(data) ? data[0] : data;
    return page && typeof page === "object" ? page : null;
  } catch {
    return null;
  }
}

/**
 * Get component data from page ACF.
 * Supports: 1) nested acf.component_careers = { title, content, gallery }; 2) flat component_careers_title, ...
 * @param {Record<string, unknown> | null} page Page from getPageBySlug
 * @param {string} componentKey ACF clone name without prefix (e.g. 'careers' for component_careers)
 * @returns {Record<string, unknown> | null} Normalized { title, content, gallery, ... } or null
 */
export function getComponentData(page, componentKey) {
  if (!page || typeof page !== "object") return null;
  const acf = page.acf;
  if (!acf || typeof acf !== "object") return null;

  const nestedKey = `component_${componentKey}`;
  const nested = acf[nestedKey];
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return nested;
  }

  const prefix = `${nestedKey}_`;
  const out = {};
  for (const [key, value] of Object.entries(acf)) {
    if (key.startsWith(prefix) && value !== undefined && value !== null) {
      const field = key.slice(prefix.length);
      out[field] = value;
    }
  }
  return Object.keys(out).length ? out : null;
}

/**
 * Fetch page by slug and return component data (one call instead of getPageBySlug + getComponentData).
 *
 * @param {string} slug Page slug (e.g. 'careers')
 * @param {string} componentKey Component key (e.g. 'careers' for component_careers)
 * @returns {Promise<Record<string, unknown> | null>} Component data { title, content, gallery, ... } or null
 */
export async function getPageComponentData(slug, componentKey) {
  const page = await getPageBySlug(slug);
  return getComponentData(page, componentKey);
}

/** Re-export from lib/acf for backward compatibility. */
export { normalizeGallery } from "@/lib/acf";

/**
 * Return value if non-empty string, else undefined (so component can use DEFAULT_*).
 * Uses normalizeText from lib/acf.
 *
 * @param {unknown} value
 * @returns {string | undefined}
 */
export function orDefault(value) {
  return normalizeText(value);
}

/**
 * Extract phone, address, email from Contact page component data (items: [address, phone, email]).
 * Returns null for missing fields when no data.
 *
 * @param {Record<string, unknown> | null} data getPageComponentData("contact", "contact")
 * @returns {{ phone: { text, href } | null, address: { text, href } | null, email: { text, href } | null } | null}
 */
export function getContactInfo(data) {
  if (!data || typeof data !== "object") return null;
  const items = Array.isArray(data.items) ? data.items : [];
  const link = (i) => {
    const item = items[i];
    const l = item?.link ?? item;
    if (!l?.href) return null;
    return { text: l.text ?? "", href: l.href };
  };
  return {
    phone: link(1) ?? null,
    address: link(0) ?? null,
    email: link(2) ?? null,
  };
}
