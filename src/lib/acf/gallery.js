/**
 * Normalize ACF/WP gallery to { image: { src, alt } }[].
 * WP may return items with url, source_url, or nested item.image.
 *
 * @param {unknown} gallery Raw gallery from ACF (array or undefined)
 * @returns {{ image: { src: string; alt: string } }[] | undefined}
 */
export function normalizeGallery(gallery) {
  if (!Array.isArray(gallery) || gallery.length === 0) return undefined;
  const out = gallery
    .map((item) => {
      const img = item?.image ?? item;
      if (img == null || typeof img !== "object") return null;
      const src =
        img.src ?? img.url ?? img.source_url ?? (typeof img === "string" ? img : null);
      const alt = img?.alt ?? img?.alt_text ?? "";
      if (!src) return null;
      return { image: { src: String(src).trim(), alt: String(alt ?? "").trim() } };
    })
    .filter(Boolean);
  return out.length ? out : undefined;
}
