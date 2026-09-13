/**
 * Waits for already requested (non-lazy) images in the container, then calls the callback.
 * Lazy images below the fold do not block: their load may not fire until they are scrolled into view.
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
