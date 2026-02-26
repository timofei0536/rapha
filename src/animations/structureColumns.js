export function structureColumns() {
  document.querySelectorAll('.structure').forEach((s) => {
    const nav = s.querySelector('.structure__nav');
    const tabs = s.querySelectorAll('.structure__tab');
    if (!nav) return;
    const apply = () => tabs.forEach((t) => {
      const wrapper = t.closest('.toogles__item-content');
      const wasHidden = wrapper && wrapper.style.display === 'none';
      if (wasHidden) wrapper.style.cssText = 'display:block !important; position:absolute; visibility:hidden; pointer-events:none;';
      t.style.cssText = 'height:auto !important; column-count:1 !important;';
      const naturalH = t.scrollHeight;
      t.style.cssText = '';
      t.style.height = Math.max(nav.offsetHeight, Math.ceil(naturalH / 2 + 20)) + 'px';
      if (wasHidden) wrapper.style.cssText = 'display:none;';
    });
    apply();
    new ResizeObserver(apply).observe(nav);
    s.addEventListener('click', (e) => { if (e.target.closest('.toogles__title')) requestAnimationFrame(() => requestAnimationFrame(apply)); });
  });
}
