/**
 * Анимация обрезки секции сверху: clip-path от 5rem → 0.
 * ScrollTrigger: start "bottom bottom", end "center center".
 */

export function sectionClipReveal() {
  if (typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger) return;

  const gsap = window.gsap;
  // const sections = document.querySelectorAll('.infra, .footer');
  const sections = document.querySelectorAll('.footer');

  sections.forEach((section) => {
    // const isFooter = section.classList.contains('footer');
    gsap.fromTo(
      section,
      { clipPath: 'inset(7rem 0px 0px 0px)' },
      {
        clipPath: 'inset(0px 0px 0px 0px)',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 2,
        },
      }
    );
  });
}

// /**
//  * Team: слой .team__bg (bottom: 100%, height: 7rem) при скролле
//  * bottom bottom → bottom center клипается по высоте на 100%.
//  */
// export function teamClipReveal() {
//   if (typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger) return;

//   const bg = document.querySelector('.team__bg');
//   const team = document.querySelector('.team');
//   if (!bg || !team) return;

//   const gsap = window.gsap;
//   gsap.fromTo(
//     bg,
//     { clipPath: 'inset(0 0 0 0)' },
//     {
//       clipPath: 'inset(0 0 100% 0)',
//       ease: 'none',
//       scrollTrigger: {
//         trigger: team,
//         start: 'bottom bottom',
//         end: 'bottom 40%',
//         scrub: 2,
//       },
//     }
//   );
// }
