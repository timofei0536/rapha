import { textLinesScript } from './textLines';

export async function heroEntrance() {
  if (typeof window === 'undefined' || !window.gsap) return;

  const hero = document.querySelector('.hero');
  const header = document.querySelector('.header');
  const titleEl = hero?.querySelector('.hero__title');
  const bgEl = hero?.querySelector('.hero__bg img');
  const formElems = hero?.querySelectorAll('.hero__form-title , .hero .form');

  if (!hero || !titleEl) return;

  const gsap = window.gsap;

  // Начальные состояния
  gsap.set(header, { yPercent: -100 });
  gsap.set(bgEl, { scale: 1.1 });
  gsap.set(formElems, { y: 40, opacity: 0 });

  // Разбить заголовок на строки
  await textLinesScript(titleEl, false, true);

  const lines = hero.querySelectorAll('.anim-line');
  gsap.set(lines, { opacity: 0, y: 28 });

  // Таймлайн появления
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });


  // 2) Строки заголовка со stagger
  tl.to(lines, { opacity: 1, y: 0, duration: 1, stagger: 0.2 }, 0);

  tl.to(formElems, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power2.out' }, 1);
  tl.to(header, { yPercent: 0, duration: 1, ease: 'power2.out' }, 1);
    
  // Фон: scale 1.1 -> 1, 5 сек (параллельно с таймлайном)
  tl.to(bgEl, { scale: 1, duration: 5, ease: 'power2.out' },0);

}
