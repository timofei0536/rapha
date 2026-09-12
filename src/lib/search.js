/**
 * WordPress search: posts, pages, services. Used by the Results block.
 */
import { wpPublicFetchCacheOptions } from "../../wp-cms.config.mjs";

const WP_API_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_WP_API_URL
    ? process.env.NEXT_PUBLIC_WP_API_URL.replace(/\/$/, "")
    : "";

const SEARCH_PER_TYPE = 10;
const SEARCH_MAX_ITEMS = 20;

function decodeHtmlEntities(str) {
  if (typeof str !== "string" || !str) return str;
  return str
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

/** Strip HTML tags and decode entities, limit length. */
function excerptFromRendered(rendered) {
  if (rendered == null || typeof rendered !== "string") return "";
  const stripped = rendered.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return decodeHtmlEntities(stripped).slice(0, 280);
}

/** ACF WYSIWYG / content: string or { rendered, value }. */
function acfContent(raw) {
  if (raw == null) return "";
  if (typeof raw === "string") return raw.trim();
  if (typeof raw === "object" && typeof raw.rendered === "string") return raw.rendered.trim();
  if (typeof raw === "object" && typeof raw.value === "string") return raw.value.trim();
  return "";
}

/** Build internal path: post → /news/slug, page → /slug, services → /services/slug. */
function searchItemHref(item) {
  const slug = item.slug && String(item.slug).trim();
  const type = (item.type || item.post_type || "").toLowerCase();
  if (!slug) return "/";
  if (type === "post") return `/news/${slug}`;
  if (type === "services" || type === "service") return `/services/${slug}`;
  return `/${slug}`;
}

/**
 * Search WordPress posts, pages, and services. Returns items for Results block.
 * Preview: ACF content for posts/services; no text for pages.
 *
 * @param {string} query Search phrase (e.g. from ?q=)
 * @returns {Promise<Array<{ title: string, description: string, link: { href: string, target?: string } }>>}
 */
export async function getSearchResults(query) {
  const q = typeof query === "string" ? query.trim() : "";
  if (!q || !WP_API_BASE) return [];

  const search = encodeURIComponent(q);
  const fetchOpts = wpPublicFetchCacheOptions();
  const perPage = String(SEARCH_PER_TYPE);

  const [postsRes, pagesRes, servicesRes] = await Promise.all([
    fetch(`${WP_API_BASE}/wp-json/wp/v2/posts?search=${search}&per_page=${perPage}&_embed`, fetchOpts),
    fetch(`${WP_API_BASE}/wp-json/wp/v2/pages?search=${search}&per_page=${perPage}&_embed`, fetchOpts),
    fetch(`${WP_API_BASE}/wp-json/wp/v2/services?search=${search}&per_page=${perPage}`, fetchOpts).catch(() => null),
  ]);

  const toItem = (item) => {
    const title = (item.title?.rendered != null ? item.title.rendered : item.title) ?? "";
    const type = (item.type || "").toLowerCase();
    let description = "";
    if (type === "post" || type === "services" || type === "service") {
      const contentRaw = acfContent(item.acf?.content) || (item.content?.rendered ?? item.content ?? "");
      description = excerptFromRendered(contentRaw || (item.excerpt?.rendered ?? item.excerpt));
    }
    const href = searchItemHref(item);
    return {
      title: decodeHtmlEntities(typeof title === "string" ? title.replace(/<[^>]+>/g, "").trim() : String(title)),
      description: typeof description === "string" ? description : "",
      link: { href, target: undefined },
    };
  };

  const posts = postsRes.ok ? (await postsRes.json()) : [];
  const pages = pagesRes.ok ? (await pagesRes.json()) : [];
  const services = servicesRes?.ok ? (await servicesRes.json()) : [];

  const combined = [
    ...(Array.isArray(posts) ? posts : []).map((p) => ({ ...p, type: "post" })),
    ...(Array.isArray(pages) ? pages : []).map((p) => ({ ...p, type: "page" })),
    ...(Array.isArray(services) ? services : []).map((p) => ({ ...p, type: "services" })),
  ];

  return combined.slice(0, SEARCH_MAX_ITEMS).map(toItem);
}
