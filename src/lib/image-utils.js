/** next/image quality (must be listed in images.qualities in next.config). */
export const IMAGE_QUALITY = 95;

/**
 * Returns a low-resolution image URL for a blur placeholder.
 * For WordPress, swaps in the -150x150 thumbnail path that WP creates on upload.
 * For local paths, returns src unchanged.
 *
 * @param {string} [src] Original image URL
 * @returns {string} URL to load at low quality
 */
export function getLowResImageSrc(src) {
  if (!src || typeof src !== "string") return null;
  try {
    const u = new URL(src, "https://dummy.example");
    const isWp =
      u.hostname !== "dummy.example" &&
      (u.pathname.includes("/wp-content/uploads/") ||
        u.pathname.includes("/wp-includes/"));
    if (!isWp) return src;

    // WP creates thumbnails: photo.jpg → photo-150x150.jpg, photo-1024x768.jpg → photo-150x150.jpg
    // Strip -scaled and any existing -WxH, then insert -150x150
    const pathname = u.pathname.replace(
      /^(.+?)(-scaled)?(-\d+x\d+)?(\.[a-zA-Z0-9]+)$/i,
      "$1-150x150$4"
    );
    u.pathname = pathname;
    u.search = ""; // drop query so we do not fetch the full-size file
    return u.toString();
  } catch {
    // ignore
  }
  return src;
}
