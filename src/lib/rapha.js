/**
 * Project-specific helpers for El-Rapha. Use for rapha-only logic, not generic wp-api/acf.
 */
import { getPageBySlug, getComponentData, getPageProps, getPagePropsFromPage } from "@/lib/wp-api";
import { normalizeText, normalizeContent, normalizeImage, normalizeHref } from "@/lib/acf";
import { getSearchResults } from "@/lib/search";
import { wpPublicFetchCacheOptions } from "../../wp-cms.config.mjs";

const WP_API_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_WP_API_URL
    ? process.env.NEXT_PUBLIC_WP_API_URL.replace(/\/$/, "")
    : "";

const wpFetchOpts = wpPublicFetchCacheOptions();

async function getPostsByIds(ids) {
  if (!WP_API_BASE || !Array.isArray(ids) || ids.length === 0) return [];
  const unique = [...new Set(ids.map(Number).filter(Boolean))];
  if (!unique.length) return [];
  try {
    const res = await fetch(
      `${WP_API_BASE}/wp-json/wp/v2/posts?include=${unique.join(",")}&_embed&per_page=100`,
      wpFetchOpts
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function getPostBySlug(slug) {
  if (!WP_API_BASE || !slug || typeof slug !== "string") return null;
  try {
    const res = await fetch(
      `${WP_API_BASE}/wp-json/wp/v2/posts?slug=${encodeURIComponent(String(slug).trim())}&_embed`,
      wpFetchOpts
    );
    if (!res.ok) return null;
    const data = await res.json();
    const post = Array.isArray(data) ? data[0] : data;
    return post && typeof post === "object" ? post : null;
  } catch {
    return null;
  }
}

async function getPosts() {
  if (!WP_API_BASE) return [];
  try {
    const res = await fetch(
      `${WP_API_BASE}/wp-json/wp/v2/posts?per_page=100&_embed&orderby=date&order=desc`,
      wpFetchOpts
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Return post slugs for static export (generateStaticParams) on news/[slug].
 * @returns {Promise<Array<{ slug: string }>>}
 */
export async function getPostSlugs() {
  const posts = await getPosts();
  return (posts || [])
    .map((p) => ({ slug: String((p && p.slug) || "").trim() }))
    .filter((s) => s.slug);
}

/**
 * Fetch services CPT from WP. Returns array of { slug, title, content, image? }.
 * Used for Services block (home), Service list and ServiceContent (services pages).
 *
 * @returns {Promise<Array<{ slug: string, title: string, content: string, image?: { src: string, alt: string } }>>}
 */
export async function getWpServices() {
  if (!WP_API_BASE) return [];
  try {
    const res = await fetch(
      `${WP_API_BASE}/wp-json/wp/v2/services?per_page=100&orderby=menu_order&order=asc&_fields=id,slug,title,content,acf`,
      wpFetchOpts
    );
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    return list.map((post) => mapWpPostToService(post)).filter((s) => s.slug);
  } catch {
    return [];
  }
}

/**
 * Decode HTML entities in string (e.g. &#038; → &, &amp; → &).
 * @param {string} str
 * @returns {string}
 */
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

/**
 * Map raw WP post object to service shape { slug, title, content, image? }.
 * @param {Record<string, unknown>} post
 * @returns {{ slug: string, title: string, content: string, image?: { src: string, alt: string } }}
 */
function mapWpPostToService(post) {
  const contentFromPost =
    post.content?.rendered ??
    (typeof post.content === "string" ? post.content : null) ??
    post.raw_content;
  const contentFromAcf =
    typeof post.acf?.content === "string"
      ? post.acf.content
      : post.acf?.content?.rendered ?? post.acf?.content?.value ?? null;
  const contentRaw = contentFromPost ?? contentFromAcf ?? "";
  const content = contentRaw != null ? String(contentRaw).trim() : "";
  const rawTitle = (normalizeText(post.title?.rendered) ?? "").trim() || String(post.title?.rendered ?? "").trim();
  const titleStr = decodeHtmlEntities(rawTitle);
  const acfImg = post.acf?.image;
  const image =
    acfImg && (acfImg.url || acfImg.src)
      ? { src: ensureAbsoluteImageUrl(acfImg.url || acfImg.src), alt: String(acfImg.alt ?? "").trim() }
      : undefined;
  return {
    slug: String(post.slug ?? post.id ?? "").trim() || "",
    title: titleStr,
    content,
    ...(image && { image }),
  };
}

/**
 * Fetch one service by slug from WP. Use on inner service page for content + image.
 *
 * @param {string} slug
 * @returns {Promise<{ slug: string, title: string, content: string, image?: { src: string, alt: string } } | null>}
 */
export async function getWpServiceBySlug(slug) {
  if (!WP_API_BASE || !slug || typeof slug !== "string") return null;
  const slugTrim = String(slug).trim();
  if (!slugTrim) return null;
  try {
    const params = new URLSearchParams({ slug: slugTrim, per_page: "1" });
    const res = await fetch(
      `${WP_API_BASE}/wp-json/wp/v2/services?${params}`,
      wpFetchOpts
    );
    if (!res.ok) return null;
    const data = await res.json();
    const post = Array.isArray(data) ? data[0] : data;
    if (!post || typeof post !== "object") return null;
    let service = mapWpPostToService(post);
    if (service.slug && !service.content && post.id) {
      const byIdRes = await fetch(
        `${WP_API_BASE}/wp-json/wp/v2/services/${post.id}`,
        wpFetchOpts
      );
      if (byIdRes.ok) {
        const fullPost = await byIdRes.json();
        if (fullPost && typeof fullPost === "object") service = mapWpPostToService(fullPost);
      }
    }
    return service.slug ? service : null;
  } catch {
    return null;
  }
}

function ensureAbsoluteImageUrl(src) {
  if (typeof src !== "string" || !src.trim()) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/") && WP_API_BASE) return WP_API_BASE + src;
  return src;
}

function ensureAbsoluteImageUrls(obj, depth = 0) {
  if (depth > 8) return obj;
  if (obj == null) return obj;
  if (Array.isArray(obj)) return obj.map((o) => ensureAbsoluteImageUrls(o, depth + 1));
  if (typeof obj !== "object") return obj;
  const out = { ...obj };
  if ("src" in out && (out.alt !== undefined || "alt" in out) && typeof out.src === "string") out.src = ensureAbsoluteImageUrl(out.src);
  for (const k of Object.keys(out)) out[k] = ensureAbsoluteImageUrls(out[k], depth + 1);
  return out;
}

function normalizeChartNode(node, depth = 0) {
  if (!node || typeof node !== "object" || depth > 20) return undefined;
  const out = { ...node };
  if ("image" in out) {
    const image = normalizeImage(out.image);
    if (image?.src) {
      out.image = ensureAbsoluteImageUrl(image.src) ? { ...image, src: ensureAbsoluteImageUrl(image.src) } : image;
    } else if (out.image == null) {
      out.image = undefined;
    }
  }
  const rawChildren = Array.isArray(out.children) ? out.children : [];
  out.children = rawChildren
    .map((child) => normalizeChartNode(child, depth + 1))
    .filter(Boolean);
  return out;
}

function normalizeChartProps(props) {
  const source = props && typeof props === "object" ? props : {};
  const normalizedData = normalizeChartNode(source.data);
  const title =
    source.title != null && String(source.title).trim()
      ? String(source.title).trim()
      : "";
  return {
    ...source,
    title,
    data: normalizedData,
  };
}

// --- News ---
const txt = (v) => (v && (typeof v.rendered === "string" ? v.rendered : String(v)))?.trim() ?? "";
const acfWysiwyg = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "object" && typeof v.rendered === "string") return v.rendered.trim();
  if (typeof v === "object" && typeof v.value === "string") return v.value.trim();
  return "";
};
const img = (post) => {
  const acfImg = post.acf?.image && typeof post.acf.image === "object" ? normalizeImage(post.acf.image) : null;
  if (acfImg?.src) return { src: ensureAbsoluteImageUrl(acfImg.src), alt: acfImg.alt ?? "" };
  const emb = post._embedded?.["wp:featuredmedia"]?.[0];
  const src = emb?.source_url ?? emb?.url ?? "";
  if (typeof src === "string" && src.trim()) return { src: ensureAbsoluteImageUrl(src.trim()), alt: String(emb?.alt_text ?? "").trim() };
  return { src: "", alt: "" };
};
function postToNewsItem(post) {
  const slug = String(post.slug ?? post.id ?? "");
  const title = (normalizeText(txt(post.title)) || txt(post.title) || "").trim();
  const content = acfWysiwyg(post.acf?.content) || normalizeContent(txt(post.content)) || "";
  const previewRaw = acfWysiwyg(post.acf?.preview);
  const preview = previewRaw || content;
  return { slug, title, image: img(post), content, preview };
}
function idsFromRaw(raw) {
  if (raw == null) return [];
  const arr = Array.isArray(raw) ? raw : [raw];
  return [...new Set(arr.map((v) => (v != null && typeof v === "object" ? Number(v.id ?? v.ID ?? v.post_id) : Number(v))).filter((id) => !Number.isNaN(id) && id > 0))];
}
async function resolveNewsItemsFromIds(raw) {
  const ids = idsFromRaw(raw);
  if (!ids.length) return [];
  const posts = await getPostsByIds(ids);
  const order = new Map(ids.map((id, i) => [id, i]));
  return [...posts].sort((a, b) => (order.get(Number(a.id)) ?? 99) - (order.get(Number(b.id)) ?? 99)).map(postToNewsItem);
}
async function resolveFeaturedFromPage(page) {
  const raw = page?.acf?.featured_news;
  const ids = idsFromRaw(Array.isArray(raw) ? raw : raw != null ? [raw] : []);
  if (!ids.length) return null;
  const items = await resolveNewsItemsFromIds(Array.isArray(raw) ? raw : [raw]);
  return items[0] ?? null;
}

export async function getNewsPageFeatured(pageSlug = "news") {
  const page = await getPageBySlug(pageSlug);
  return page ? resolveFeaturedFromPage(page) : null;
}

export async function getNewsListForPage() {
  if (!WP_API_BASE) return { pageTitle: "", featured: null, items: [] };
  const [posts, page] = await Promise.all([getPosts(), getPageBySlug("news")]);
  const allItems = (posts || []).map(postToNewsItem);
  const featured = page ? await resolveFeaturedFromPage(page) : null;
  const pageTitle = page ? txt(page.title) : "";
  return { pageTitle, featured, items: featured ? allItems.filter((i) => i.slug !== featured.slug) : allItems };
}

export async function getSingleNewsBySlug(slug) {
  const post = await getPostBySlug(slug);
  if (!post) return null;
  const item = postToNewsItem(post);
  const d = post.date || post.date_gmt;
  const date = d && !Number.isNaN(new Date(d).getTime())
    ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";
  return { title: item.title, date, image: item.image?.src ? item.image : null, content: item.content || "" };
}

// --- Block props ---

function pickNewsRaw(page, fallbackPage) {
  const fromPage = page ? getComponentData(page, "news") : null;
  if (fromPage?.items != null && idsFromRaw(fromPage.items).length > 0) return fromPage;
  const fromFallback = fallbackPage ? getComponentData(fallbackPage, "news") : null;
  if (fromFallback?.items != null && idsFromRaw(fromFallback.items).length > 0) return fromFallback;
  return fromPage;
}

async function newsPropsFromPages(page, fallbackPage) {
  if (!WP_API_BASE) return { title: "", items: [] };
  const raw = pickNewsRaw(page, fallbackPage);
  const items = raw?.items != null ? await resolveNewsItemsFromIds(raw.items) : [];
  const title = raw?.title != null && String(raw.title).trim() ? String(raw.title).trim() : "";
  return ensureAbsoluteImageUrls({ title, items });
}

function pageScreenPropsFromPage(page) {
  const data = page ? getComponentData(page, "pagescreen") : null;
  const titleFromAcf = data?.title != null ? normalizeText(data.title) ?? "" : "";
  const rawImage = data?.image;
  const imageRaw = Array.isArray(rawImage) && rawImage.length > 0 ? rawImage[0] : rawImage;
  let image = imageRaw != null ? normalizeImage(imageRaw) : undefined;
  if (image?.src) image = { ...image, src: ensureAbsoluteImageUrl(image.src) };
  return ensureAbsoluteImageUrls({
    ...(titleFromAcf ? { title: titleFromAcf } : {}),
    ...(image?.src ? { image } : {}),
  });
}

async function getBlockPropsFromPage(page, componentKey, searchParams, fallbackNewsPage) {
  const params = typeof searchParams?.then === "function" ? await searchParams : searchParams ?? {};

  if (componentKey === "news") {
    return newsPropsFromPages(page, fallbackNewsPage);
  }

  if (componentKey === "chart") {
    return normalizeChartProps(getPagePropsFromPage(page, componentKey));
  }

  if (componentKey === "pageScreen") {
    return pageScreenPropsFromPage(page);
  }

  if (componentKey === "results") {
    const out = ensureAbsoluteImageUrls(getPagePropsFromPage(page, componentKey));
    const queryParam = params?.q ?? params?.query;
    const searchQuery = Array.isArray(queryParam) ? queryParam[0] ?? "" : (queryParam ?? "");
    const query = (typeof searchQuery === "string" ? searchQuery.trim() : "") || out.query || "";
    const items = query ? await getSearchResults(query) : (Array.isArray(out.items) ? out.items : []);
    return { ...out, query, items };
  }

  return ensureAbsoluteImageUrls(getPagePropsFromPage(page, componentKey));
}

/**
 * One page fetch, then local props for each block (Zeph-style getBlocksPropsForSlug).
 * News IDs fall back to the news page in parallel, not via sequential slug guesses.
 *
 * @param {string} slug
 * @param {string[]} componentKeys
 * @param {Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>} [searchParams]
 * @returns {Promise<Record<string, Record<string, unknown>>>}
 */
export async function getBlocksPropsForPage(slug, componentKeys, searchParams) {
  const keys = Array.isArray(componentKeys) ? componentKeys : [];
  const empty = Object.fromEntries(keys.map((key) => [key, {}]));
  if (!WP_API_BASE || !keys.length) return empty;

  const needsNewsFallback = keys.includes("news") && slug !== "news";
  const needsServicesAlt = keys.includes("pageScreen") && slug === "services";
  const [page, newsPage, servicesAltPage] = await Promise.all([
    getPageBySlug(slug),
    needsNewsFallback ? getPageBySlug("news") : Promise.resolve(null),
    needsServicesAlt ? getPageBySlug("our-services") : Promise.resolve(null),
  ]);

  const sourceFor = (key) => {
    if (key === "pageScreen" && !page) return servicesAltPage;
    return page;
  };

  const entries = await Promise.all(
    keys.map(async (key) => [key, await getBlockPropsFromPage(sourceFor(key), key, searchParams, newsPage)])
  );
  return Object.fromEntries(entries);
}

/**
 * Get block props from WP only.
 * News block: resolved in rapha (ACF relationship items → posts from WP).
 *
 * @param {string} slug Page slug (e.g. 'home', 'careers', 'contact')
 * @param {string} componentKey Block key (e.g. 'infra', 'careers', 'contact', 'news')
 * @param {Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>} [searchParams]
 * @returns {Promise<Record<string, unknown>>}
 */
export async function getBlockPropsForPage(slug, componentKey, searchParams) {
  const blocks = await getBlocksPropsForPage(slug, [componentKey], searchParams);
  return blocks[componentKey] ?? {};
}

/**
 * Contact info for layout (header/footer): phone, address, email from Contact page data.
 * @returns {Promise<{ phone: { text: string; href: string } | null; address: { text: string; href: string } | null; email: { text: string; href: string } | null }>}
 */
export async function getContactInfoForLayout() {
  const contactProps = await getPageProps("contact", "contact");
  const items = Array.isArray(contactProps?.items) ? contactProps.items : [];
  const link = (i) => {
    const l = items[i]?.link;
    return l?.href ? { text: l.text ?? "", href: normalizeHref(l.href) || l.href } : null;
  };
  return {
    phone: link(1),
    address: link(0),
    email: link(2),
  };
}

function navHrefFromUrl(u) {
  if (!u || typeof u !== "string") return "";
  const s = u.trim();
  if (!s.startsWith("http")) return s.replace(/\/+$/, "") || "/";
  try {
    return new URL(s).pathname.replace(/\/+$/, "") || "/";
  } catch {
    return s;
  }
}

/** ACF post_object → { href, text } from the page itself. */
function navItemFromPage(item) {
  if (item == null) return null;
  if (typeof item === "string") {
    const href = navHrefFromUrl(item);
    return href ? { href, text: "" } : null;
  }
  if (typeof item !== "object") return null;
  const slug = String(item.post_name ?? item.slug ?? "").trim();
  const href = slug === "home" || slug === "front-page"
    ? "/"
    : slug
      ? `/${slug}`
      : navHrefFromUrl(item.link ?? item.url ?? item.href ?? "");
  const text = decodeHtmlEntities(
    String(item.post_title ?? item.title?.rendered ?? item.title ?? item.text ?? "").trim()
  );
  return href ? { href, text } : null;
}

function resolveNavigation(rawNav) {
  if (!Array.isArray(rawNav) || rawNav.length === 0) return null;
  const seen = new Set();
  const out = [];
  for (const raw of rawNav) {
    const item = navItemFromPage(raw);
    const href = String(item?.href ?? "");
    if (!item || seen.has(href)) continue;
    seen.add(href);
    out.push(item);
  }
  return out.length ? out : null;
}

function normalizeLinkItem(item) {
  if (!item) return null;
  if (typeof item === "string") {
    const href = item.trim();
    return href ? { href, text: href } : null;
  }
  if (typeof item !== "object") return null;
  const link = item.link && typeof item.link === "object" ? item.link : item;
  const href = String(link.href ?? link.url ?? "").trim();
  const text = String(link.text ?? link.title ?? "").trim();
  return href ? { href, text: text || href } : null;
}

/**
 * General block for layout (labels, schedule, navigation). From home page, block "general".
 */
export async function getGeneralForLayout() {
  const page = await getPageBySlug("home");
  const general = getPagePropsFromPage(page, "general");
  const raw = page ? getComponentData(page, "general") : null;
  const nav = resolveNavigation(raw?.navigation) ?? [];
  const nav2 = resolveNavigation(raw?.navigation2) ?? [];
  const emails = (Array.isArray(raw?.emails_list) ? raw.emails_list : [])
    .map(normalizeLinkItem)
    .filter(Boolean);

  return {
    ...general,
    navigation: Array.isArray(nav) ? nav : [],
    navigation2: Array.isArray(nav2) ? nav2 : [],
    emails_list: emails,
  };
}
