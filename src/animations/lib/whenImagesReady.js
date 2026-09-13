/**
 * Ждёт загрузки уже запрошенных (не lazy) img в контейнере, затем вызывает callback.
 * Lazy-картинки ниже фолда не блокируют: у них load может не прийти, пока их не проскроллили.
 */

export function whenImagesReady(container, callback) {
  if (!container) {
    callback();
    return;
  }
  const pending = Array.from(container.querySelectorAll('img')).filter(
    (img) => !img.complete && img.loading !== 'lazy'
  );
  if (pending.length === 0) {
    callback();
    return;
  }
  Promise.all(
    pending.map(
      (img) =>
        new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        })
    )
  ).then(callback);
}
