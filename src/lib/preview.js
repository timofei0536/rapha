/**
 * WordPress preview: fetch draft pages/posts/services by preview_id and preview_nonce.
 * Uses REST API with X-WP-Nonce for cookie authentication.
 * High-level getTextPageData / getNewsPageData / getServicePageData keep page components thin.
 */
import { cache } from "react";
import { normalizeContent } from "@/lib/acf";
import { getPageBySlug } from "@/lib/wp-api";
import {
  getSingleNewsBySlug,
  getSingleNewsDataFromPost,
  mapWpPostToService,
  getBlockPropsForPage,
  getWpServices,
  getWpServiceBySlug,
  getNewsPageFeatured,
} from "@/lib/rapha";
import { NewDefaults } from "@/components/New/defaults";
import { ServiceDefaults } from "@/components/Service/defaults";
import { ServiceContentDefaults } from "@/components/ServiceContent/defaults";

const WP_API_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_WP_API_URL
    ? process.env.NEXT_PUBLIC_WP_API_URL.replace(/\/$/, "")
    : "";

/**
 * Resolve searchParams (may be Promise in Next 15/16) and return preview_id / preview_nonce as strings.
 * @param {Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>} [searchParams]
 * @returns {Promise<{ previewId: string | null, previewNonce: string | null }>}
 */
export async function getPreviewParams(searchParams) {
  const raw = typeof searchParams?.then === "function" ? await searchParams : searchParams ?? {};
  const toStr = (v) => (Array.isArray(v) ? v[0] : v);
  const id = toStr(raw.preview_id);
  const nonce = toStr(raw.preview_nonce);
  return {
    previewId: id != null && String(id).trim() ? String(id).trim() : null,
    previewNonce: nonce != null && String(nonce).trim() ? String(nonce).trim() : null,
  };
}

function previewFetchOpts(nonce, cookie) {
  const headers = {
    "X-WP-Nonce": typeof nonce === "string" ? nonce : String(nonce ?? ""),
  };
  if (cookie && typeof cookie === "string" && cookie.trim()) headers.Cookie = cookie;
  return { cache: "no-store", headers };
}

/**
 * Fetch a single page draft by ID with preview nonce.
 * Pass cookie from incoming request so WP can validate nonce (same-domain only).
 * @param {string|number} previewId
 * @param {string} previewNonce
 * @param {string} [cookie] Cookie header from request (optional)
 * @returns {Promise<Record<string, unknown> | null>}
 */
export async function fetchPreviewPage(previewId, previewNonce, cookie) {
  if (!WP_API_BASE || previewId == null || !previewNonce) return null;
  const id = String(previewId).trim();
  if (!id) return null;
  try {
    const res = await fetch(
      `${WP_API_BASE}/wp-json/wp/v2/pages/${id}?context=edit`,
      previewFetchOpts(previewNonce, cookie)
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

/** Cached per-request: use in generateMetadata + page to avoid duplicate fetch. */
export const fetchPreviewPageCached = cache(fetchPreviewPage);

/**
 * Fetch a single post draft by ID with preview nonce. Pass cookie for same-domain auth.
 */
export async function fetchPreviewPost(previewId, previewNonce, cookie) {
  if (!WP_API_BASE || previewId == null || !previewNonce) return null;
  const id = String(previewId).trim();
  if (!id) return null;
  try {
    const res = await fetch(
      `${WP_API_BASE}/wp-json/wp/v2/posts/${id}?context=edit&_embed`,
      previewFetchOpts(previewNonce, cookie)
    );
    if (!res.ok) return null;
    const post = await res.json();
    if (!post || typeof post !== "object") return null;
    return getSingleNewsDataFromPost(post);
  } catch {
    return null;
  }
}

/** Cached per-request: use in generateMetadata + page to avoid duplicate fetch. */
export const fetchPreviewPostCached = cache(fetchPreviewPost);

/**
 * Fetch a single service (CPT) draft by ID with preview nonce. Pass cookie for same-domain auth.
 */
export async function fetchPreviewService(previewId, previewNonce, cookie) {
  if (!WP_API_BASE || previewId == null || !previewNonce) return null;
  const id = String(previewId).trim();
  if (!id) return null;
  try {
    const res = await fetch(
      `${WP_API_BASE}/wp-json/wp/v2/services/${id}?context=edit`,
      previewFetchOpts(previewNonce, cookie)
    );
    if (!res.ok) return null;
    const post = await res.json();
    if (!post || typeof post !== "object") return null;
    const service = mapWpPostToService(post);
    return service?.slug ? service : null;
  } catch {
    return null;
  }
}

/** Cached per-request: use in generateMetadata + page to avoid duplicate fetch. */
export const fetchPreviewServiceCached = cache(fetchPreviewService);

// --- High-level page data (preview + normal in one call) ---

function decodeTitle(str) {
  if (typeof str !== "string") return "";
  return str.replace(/&#038;/g, "&").replace(/&amp;/g, "&").trim();
}
function getTitleFromPage(page) {
  const raw = page?.title?.rendered ?? page?.acf?.pageTitle ?? "";
  return decodeTitle(typeof raw === "string" ? raw : String(raw || ""));
}
function getContentFromPage(page) {
  const acf = page?.acf && typeof page.acf === "object" ? page.acf : {};
  const fromAcf = normalizeContent(acf.pageContent);
  if (fromAcf) return fromAcf;
  const rendered = page?.content?.rendered;
  return rendered ? String(rendered).trim() : "";
}

/**
 * Text page [slug]: returns { title, content } or null. Handles preview and normal fetch.
 * Cached per-request so generateMetadata + page share one run.
 * @param {{ slug: string }} paramsResolved
 * @param {Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>} [searchParams]
 */
export const getTextPageData = cache(async function getTextPageData(paramsResolved, searchParams, cookie) {
  const { slug } = paramsResolved;
  const { previewId, previewNonce } = await getPreviewParams(searchParams);
  const page =
    previewId && previewNonce
      ? await fetchPreviewPageCached(previewId, previewNonce, cookie)
      : await getPageBySlug(slug);
  if (!page || typeof page !== "object") return null;
  return { title: getTitleFromPage(page), content: getContentFromPage(page) };
});

function slugToTitle(slug) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace(/\b24 7\b/i, "24/7");
}

/**
 * News [slug]: returns { title, date, image, content, shareUrl }. Handles preview and normal fetch. Cached per-request.
 */
export const getNewsPageData = cache(async function getNewsPageData(paramsResolved, searchParams, cookie) {
  const { slug } = paramsResolved;
  const { previewId, previewNonce } = await getPreviewParams(searchParams);
  const strictWp = process.env.NEXT_PUBLIC_STRICT_WP === "true";
  const article =
    previewId && previewNonce
      ? await fetchPreviewPostCached(previewId, previewNonce, cookie)
      : await getSingleNewsBySlug(slug);
  const title = article?.title ?? (strictWp ? "" : slugToTitle(slug));
  const date = article?.date ?? (strictWp ? "" : NewDefaults.date);
  const image = article?.image ?? (strictWp ? null : NewDefaults.image);
  const content = article?.content ?? (strictWp ? "" : NewDefaults.content);
  const baseUrl =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
      : "";
  const shareUrl = baseUrl ? `${baseUrl}/news/${slug}/` : "";
  return { title, date, image, content, shareUrl };
});

function formatServiceTitle(slug) {
  if (!slug) return "Our Services";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Services [slug]: returns full props for the service page. Handles preview and normal fetch. Cached per-request.
 */
export const getServicePageData = cache(async function getServicePageData(paramsResolved, searchParams, cookie) {
  const { slug } = paramsResolved;
  const { previewId, previewNonce } = await getPreviewParams(searchParams);

  const [serviceProps, newsProps, wpServices, wpServiceBySlugFromApi, featured, previewService] = await Promise.all([
    getBlockPropsForPage("services", "service", {}),
    getBlockPropsForPage("services", "news", {}),
    getWpServices(),
    previewId && previewNonce ? Promise.resolve(null) : getWpServiceBySlug(slug),
    getNewsPageFeatured("news"),
    previewId && previewNonce ? fetchPreviewServiceCached(previewId, previewNonce, cookie) : Promise.resolve(null),
  ]);

  const wpServiceBySlug = previewService ?? wpServiceBySlugFromApi;
  const rawFromWp = Array.isArray(wpServices) && wpServices.length > 0 ? wpServices : null;
  const rawFromBlock = Array.isArray(serviceProps?.services) && serviceProps.services.length > 0 ? serviceProps.services : null;
  let list = rawFromWp ?? rawFromBlock ?? ServiceDefaults.services ?? [];
  if (previewService) {
    list = list.some((s) => s.slug === previewService.slug)
      ? list.map((item) => (item.slug === previewService.slug ? { ...item, ...previewService } : item))
      : [previewService, ...list];
  } else if (wpServiceBySlug && slug) {
    list = list.map((item) => (item.slug === slug ? { ...item, ...wpServiceBySlug } : item));
  }
  const activeSlug = previewService?.slug ?? slug;
  const activeService = list.find((s) => s.slug === activeSlug) ?? list[0];
  const pageTitle = activeService?.title ?? formatServiceTitle(activeSlug);
  const pageScreenImage = activeService?.image ?? wpServiceBySlug?.image;
  const pageScreen = {
    title: pageTitle,
    image:
      typeof pageScreenImage === "object" && pageScreenImage?.src
        ? { src: pageScreenImage.src, alt: pageScreenImage.alt ?? pageTitle }
        : { src: "/images/service-page.png", alt: pageTitle },
    className: "page-screen--blur",
  };
  const content =
    (wpServiceBySlug?.content ?? activeService?.content ?? "") ||
    (typeof ServiceContentDefaults[activeSlug] === "string" ? ServiceContentDefaults[activeSlug].trim() : "");

  return {
    pageScreen,
    content,
    list,
    activeSlug,
    activeService,
    serviceProps,
    newsProps,
    featured,
  };
});
