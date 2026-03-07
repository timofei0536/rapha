/**
 * Ждёт загрузки всех img в контейнере, затем вызывает callback.
 */

export function whenImagesReady(container, callback) {
  if (!container) {
    callback();
    return;
  }
  const images = Array.from(container.querySelectorAll('img'));
  const pending = images.filter((img) => !img.complete);
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
