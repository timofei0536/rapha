/**
 * Fetch WordPress page by slug (headless). ACF fields are expected in response.acf.
 * NextWP stores clone fields as component_<name>_<field> (e.g. component_careers_title).
 *
 * Set NEXT_PUBLIC_WP_API_URL to your WP site URL (e.g. https://rapha.tim-work.com).
 * If unset, no fetch is performed and components use their default props.
 * Strict WP mode: set ?wp=1 in URL or NEXT_PUBLIC_STRICT_WP=true to use only WP data (no default fallback).
 */

import {
  normalizeText,
  normalizeContent,
  normalizeHref,
  normalizeImage,
  normalizeGallery,
  normalizeLink,
  normalizeRepeater,
} from "@/lib/acf";

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

/**
 * Infer normalizer function for a key from its default value shape.
 * @param {string} key
 * @param {unknown} defaultVal
 * @returns {(raw: unknown) => unknown}
 */
function getNormalizerForKey(key, defaultVal) {
  if (typeof defaultVal === "string") {
    return (raw) => (key === "content" ? normalizeContent(raw) : normalizeText(raw));
  }
  if (Array.isArray(defaultVal)) {
    const first = defaultVal[0];
    if (first && typeof first === "object") {
      if ("image" in first && typeof first.image === "object") return (raw) => normalizeGallery(raw);
      if ("link" in first || ("href" in first && "title" in first))
        return (raw) => normalizeRepeater(raw, { title: normalizeText, link: normalizeLink });
      if ("content" in first && "image" in first)
        return (raw) =>
          normalizeRepeater(raw, {
            content: normalizeContent,
            image: normalizeImage,
            layout: (v) => normalizeText(v),
          });
    }
    return (raw) => (Array.isArray(raw) ? raw : undefined);
  }
  if (defaultVal && typeof defaultVal === "object") {
    if ("src" in defaultVal && "alt" in defaultVal) return (raw) => normalizeImage(raw);
    if (("href" in defaultVal || "url" in defaultVal) && ("text" in defaultVal || "title" in defaultVal))
      return (raw) => normalizeLink(raw);
    if ("title" in defaultVal && "src" in defaultVal && !("alt" in defaultVal))
      return (raw) => {
        if (!raw || typeof raw !== "object") return undefined;
        const src = normalizeHref(raw.url ?? raw.src);
        const title = normalizeText(raw.title) ?? "";
        return src ? { title, src } : undefined;
      };
    if ("left" in defaultVal && "right" in defaultVal)
      return (raw) => {
        if (!raw || typeof raw !== "object") return undefined;
        const left = Array.isArray(raw.left) ? raw.left : [];
        const right = Array.isArray(raw.right) ? raw.right : [];
        return { left, right };
      };
  }
  return (raw) => (raw !== undefined && raw !== null ? raw : undefined);
}

/**
 * Fetch WP data and merge with defaults. One entry point for page component props.
 * @param {string} slug Page slug (e.g. 'careers')
 * @param {string} componentKey ACF clone key (e.g. 'careers')
 * @param {Record<string, unknown>} defaults Default props (keys = component props)
 * @param {{ strictWp?: boolean }} [options] strictWp: if true, only use WP values (no default fallback)
 * @returns {Promise<Record<string, unknown>>} Props to pass to component
 */
export async function getPageProps(slug, componentKey, defaults, options = {}) {
  const { strictWp = false } = options;
  if (!WP_API_BASE) return { ...defaults };

  const raw = await getPageComponentData(slug, componentKey);
  const result = {};
  for (const key of Object.keys(defaults)) {
    const normalizer = getNormalizerForKey(key, defaults[key]);
    const value = normalizer(raw?.[key]);
    if (value !== undefined) {
      result[key] = value;
    } else if (!strictWp) {
      result[key] = defaults[key];
    } else {
      result[key] = undefined;
    }
  }
  return result;
}

/**
 * Universal: get block props from WP page (slug + componentKey), merge with defaults, strictWp from searchParams/env.
 * Use on any page for any block (hero, infra, news, …).
 * @param {string} slug Page slug in WP (e.g. 'page', 'careers', 'contact')
 * @param {string} componentKey ACF block key (e.g. 'infra', 'hero', 'contact')
 * @param {Record<string, unknown>} defaults Default props for the block
 * @param {Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>} [searchParams] Next.js page searchParams (for ?wp=1)
 * @returns {Promise<Record<string, unknown>>} Props to spread into the component
 */
export async function getBlockProps(slug, componentKey, defaults, searchParams) {
  const params = typeof searchParams?.then === "function" ? await searchParams : searchParams ?? {};
  const strictWp = params?.wp === "1" || process.env.NEXT_PUBLIC_STRICT_WP === "true";
  return getPageProps(slug, componentKey, defaults, { strictWp });
}

/**
 * @deprecated Use getBlockProps. Same signature.
 */
export async function getPagePropsFromSearchParams(slug, componentKey, defaults, searchParams) {
  return getBlockProps(slug, componentKey, defaults, searchParams);
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
 * @deprecated Use getPageProps; then derive phone/address/email from props.items in layout.
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
