/**
 * Анимация .team__gallery-part: opacity 0.6 → 1, scale 0.9 → 1.
 * Trigger: .team__wrap, start: top bottom, end: center center.
 */

export function teamGallery() {
  if (typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger) return;

  const teamWrap = document.querySelector('.team__wrap');
  const galleryParts = document.querySelectorAll('.team__gallery-part');
  if (!teamWrap || !galleryParts.length) return;

  const gsap = window.gsap;

  gsap.fromTo(
    galleryParts,
    { opacity: 0.6, scale: 0.9 },
    {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: teamWrap,
        start: 'center bottom',
        end: 'center center',
        scrub: 2,
      },
    }
  );
}
