export function sectionPin(config) {
  const { sectionSelector, pinSelector, getEnd } = config;
  const sectionEl = document.querySelector(sectionSelector);
  const pinEl = document.querySelector(pinSelector);
  if (!sectionEl || !pinEl) return;
  const headerEl = document.querySelector('.header');
  const getStart = () => {
    const h = headerEl ? headerEl.offsetHeight : 0;
    return `top ${h + 48}px`;
  };
  const endValue = typeof getEnd === 'function' ? getEnd(sectionEl) : getEnd;
  window.ScrollTrigger.create({
    trigger: sectionEl,
    endTrigger: sectionEl,
    start: getStart(),
    end: endValue,
    pin: pinEl,
    invalidateOnRefresh: true,
  });
}
