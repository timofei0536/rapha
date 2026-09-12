/**
 * Fetch WordPress page by slug (headless). ACF fields are expected in response.acf.
 * Clone fields are stored as component_<name>_<field> (e.g. component_careers_title).
 *
 * Set NEXT_PUBLIC_WP_API_URL to your WP site URL (e.g. https://rapha.tim-work.com).
 */

import { normalizeAcfTree } from "@/lib/acf";
import { applyBlockFilter } from "@/lib/block-filter";
import { wpPublicFetchCacheOptions } from "../../wp-cms.config.mjs";

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
const wpFetchOpts = wpPublicFetchCacheOptions();

export async function getPageBySlug(slug) {
  if (!WP_API_BASE) return null;
  try {
    const res = await fetch(
      `${WP_API_BASE}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_embed`,
      wpFetchOpts
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
 * Fetch all page slugs from WP for static export (generateStaticParams).
 * @returns {Promise<Array<{ slug: string }>>}
 */
export async function getPageSlugs() {
  if (!WP_API_BASE) return [];
  try {
    const res = await fetch(
      `${WP_API_BASE}/wp-json/wp/v2/pages?per_page=100&_fields=slug`,
      wpFetchOpts
    );
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    return list
      .map((p) => (p && typeof p.slug === "string" ? { slug: p.slug.trim() } : null))
      .filter(Boolean)
      .filter((s) => s.slug && !["not-found"].includes(s.slug));
  } catch {
    return [];
  }
}

/**
 * Convert component key to ACF key format.
 * "AboutScreen" → "aboutscreen", "pageScreen" → "pagescreen"
 */
function toAcfComponentKey(name) {
  return String(name).replace(/[^a-z0-9]/gi, "_").toLowerCase();
}

/**
 * Get component data from page ACF.
 * Supports: 1) nested acf.component_careers = { title, content, gallery }; 2) flat component_careers_title, ...
 * @param {Record<string, unknown> | null} page Page from getPageBySlug
 * @param {string} componentKey ACF clone name without prefix (e.g. 'careers' for component_careers)
 * @returns {Record<string, unknown> | null} Raw { title, content, gallery, ... } or null
 */
export function getComponentData(page, componentKey) {
  if (!page || typeof page !== "object") return null;
  const acf = page.acf;
  if (!acf || typeof acf !== "object") return null;

  const acfKey = toAcfComponentKey(componentKey);
  const nestedKey = `component_${acfKey}`;
  let nested = acf[nestedKey];
  if (!nested && acf[acfKey] && typeof acf[acfKey] === "object" && !Array.isArray(acf[acfKey])) {
    nested = acf[acfKey];
  }
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
 * Fetch WP block data and normalize ACF values. Empty when WP is unset or the block is empty.
 * @param {string} slug Page slug (e.g. 'careers')
 * @param {string} componentKey ACF clone key (e.g. 'careers')
 * @returns {Promise<Record<string, unknown>>} Props to pass to component
 */
export async function getPageProps(slug, componentKey) {
  if (!WP_API_BASE) return {};
  const raw = await getPageComponentData(slug, componentKey);
  return applyBlockFilter(normalizeAcfTree(raw));
}

/**
 * Same as getPageProps (kept for existing call sites).
 * @param {string} slug Page slug in WP (e.g. 'home', 'careers', 'contact')
 * @param {string} componentKey ACF block key (e.g. 'infra', 'hero', 'contact')
 * @returns {Promise<Record<string, unknown>>} Props to spread into the component
 */
export async function getBlockProps(slug, componentKey) {
  return getPageProps(slug, componentKey);
}

/** Re-export from lib/acf for backward compatibility. */
export { normalizeGallery } from "@/lib/acf";
