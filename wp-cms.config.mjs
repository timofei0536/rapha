/**
 * TEMPORARY: Next.js Data Cache for public WP `fetch`.
 * Set to `false` when CMS edits must appear immediately.
 */
export const WP_TEMP_FULL_DATA_CACHE = true;

/** Public WP fetch cache TTL in seconds when `WP_TEMP_FULL_DATA_CACHE` is enabled. */
export const WP_TEMP_FULL_DATA_CACHE_REVALIDATE_SECONDS = 300;

/**
 * Public WP `fetch` cache policy.
 * @returns {{ cache: "no-store" } | { next: { revalidate: number } }}
 */
export function wpPublicFetchCacheOptions() {
  if (WP_TEMP_FULL_DATA_CACHE) {
    const ttl = Number(WP_TEMP_FULL_DATA_CACHE_REVALIDATE_SECONDS);
    const revalidate = Number.isFinite(ttl) && ttl > 0 ? Math.floor(ttl) : 60;
    return { next: { revalidate } };
  }
  return { cache: 'no-store' };
}
