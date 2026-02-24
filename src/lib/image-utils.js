/**
 * Возвращает URL изображения в низком разрешении для подложки с blur.
 * Для WordPress подставляет путь к миниатюре (-150x150), которую WP создаёт при загрузке.
 * Для локальных путей возвращает src без изменений.
 *
 * @param {string} [src] Исходный URL изображения
 * @returns {string} URL для загрузки в плохом качестве
 */
export function getLowResImageSrc(src) {
  if (!src || typeof src !== "string") return src ?? "";
  try {
    const u = new URL(src, "https://dummy.example");
    const isWp =
      u.hostname !== "dummy.example" &&
      (u.pathname.includes("/wp-content/uploads/") ||
        u.pathname.includes("/wp-includes/"));
    if (!isWp) return src;

    // WP создаёт миниатюры: photo.jpg → photo-150x150.jpg, photo-1024x768.jpg → photo-150x150.jpg
    // Убираем -scaled и любой существующий -WxH, вставляем -150x150
    const pathname = u.pathname.replace(
      /^(.+?)(-scaled)?(-\d+x\d+)?(\.[a-zA-Z0-9]+)$/i,
      "$1-150x150$4"
    );
    u.pathname = pathname;
    u.search = ""; // убираем query, чтобы не тянуть полный размер
    return u.toString();
  } catch {
    // ignore
  }
  return src;
}
