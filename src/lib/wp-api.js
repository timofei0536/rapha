/**
 * Fetch WordPress page by slug (headless). ACF fields are expected in response.acf.
 * NextWP stores clone fields as component_<name>_<field> (e.g. component_careers_title).
 *
 * Set NEXT_PUBLIC_WP_API_URL to your WP site URL (e.g. https://rapha.tim-work.com).
 * If unset, no fetch is performed and components use their default props.
 */

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
export async function getPageBySlug(slug) {
  if (!WP_API_BASE) return null;
  try {
    const res = await fetch(
      `${WP_API_BASE}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_embed`,
      { next: { revalidate: 60 } }
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

/**
 * Normalize ACF/WP gallery to { image: { src, alt } }[].
 * WP may return items with url, source_url, or nested item.image.
 *
 * @param {unknown} gallery Raw gallery from ACF (array or undefined)
 * @returns {{ image: { src: string; alt: string } }[] | undefined}
 */
export function normalizeGallery(gallery) {
  if (!Array.isArray(gallery) || gallery.length === 0) return undefined;
  const out = gallery.map((item) => {
    const img = item?.image ?? item;
    const src = img?.src ?? img?.url ?? img?.source_url ?? (typeof img === "string" ? img : null);
    const alt = img?.alt ?? img?.alt_text ?? "";
    if (!src) return null;
    return { image: { src, alt } };
  }).filter(Boolean);
  return out.length ? out : undefined;
}

/**
 * Return value if non-empty string, else undefined (so component can use DEFAULT_*).
 *
 * @param {unknown} value
 * @returns {string | undefined}
 */
export function orDefault(value) {
  const s = value != null ? String(value).trim() : "";
  return s || undefined;
}
