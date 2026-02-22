const PINS = [
  { section: '.about > .center-wrap', pin: '.about__gm' },
  { section: '.new__wrap', pin: '.new__img' },
];

function getEnd(sectionEl) {
  const pb = parseFloat(getComputedStyle(sectionEl).paddingBottom) || 0;
  return `bottom bottom+=${pb + 40}`;
}

export function sectionPin() {
  const headerEl = document.querySelector('.header');
  const start = `top ${(headerEl ? headerEl.offsetHeight : 0) + 50}px`;

  PINS.forEach(({ section, pin }) => {
    const sectionEl = document.querySelector(section);
    const pinEl = document.querySelector(pin);
    if (!sectionEl || !pinEl) return;

    window.ScrollTrigger.create({
      trigger: sectionEl,
      endTrigger: sectionEl,
      // start,
      start: "top top",
      // end: getEnd(sectionEl),
      end: "+="+ ( sectionEl.offsetHeight - pinEl.offsetHeight * 1 ) + "px",
      pin: pinEl,
      invalidateOnRefresh: true,
    });

  });
}
