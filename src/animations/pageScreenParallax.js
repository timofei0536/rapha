export function pageScreenParallax() {
  if (typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger) return;

  const gsap = window.gsap;

  document.querySelectorAll('.page-screen').forEach((section) => {
    const h1 = section.querySelector('h1');
    const bg = section.querySelector('.page-screen__bg');

    const st = {
      trigger: section,
      start: 'top top',
      end: 'bottom 35%',
      scrub: true,
    };

    if (h1) {
      gsap.to(h1, { opacity: 0, scrollTrigger: st });
    }
  });
}
