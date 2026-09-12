export function debounce(fn, waitMs) {
  let t;
  return () => {
    clearTimeout(t);
    t = setTimeout(fn, waitMs);
  };
}
