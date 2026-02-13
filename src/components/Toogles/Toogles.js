'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Toogles() {
  const pathname = usePathname();

  useEffect(() => {
    // Ждем GSAP из CDN
    if (typeof window === 'undefined' || !window.gsap) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger; 
    let busy = false;
    const D = 0.5, E = 'power2.out';

    const $  = (s, c=document) => c.querySelector(s);
    const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

    // INIT: скрыть все неактивные при загрузке/переходе
    $$('.toogles__item-content').forEach(c => {
      const p = c.closest('.toogles__item--active');
      c.style.display = p ? 'block' : 'none';
    });

    // Анимация
    const animate = (type, el, show) => {
      if (!el) return Promise.resolve();
      gsap.killTweensOf(el);

      if (type === 'fade') {
        if (show) {
          el.style.display = 'block';
          return gsap.fromTo(el, {autoAlpha:0}, {autoAlpha:1, duration:D, ease:E})
            .then(() => gsap.set(el, {clearProps:'opacity,visibility'}));
        }
        return gsap.to(el, {autoAlpha:0, duration:D, ease:E})
          .then(() => { el.style.display='none'; gsap.set(el, {clearProps:'opacity,visibility'}); });
      }

      // slide
      if (show) {
        el.style.display='block';
        el.style.overflow='hidden';
        el.style.height='auto'; 
        const h = el.scrollHeight;
        return gsap.fromTo(el, {height:0}, {height:h, duration:D, ease:E})
          .then(() => { el.style.height='auto'; el.style.overflow=''; });
      }
      el.style.overflow='hidden';
      el.style.height = el.scrollHeight + 'px';
      return gsap.to(el, {height:0, duration:D, ease:E})
        .then(() => { el.style.display='none'; el.style.height=''; el.style.overflow=''; });
    };

    const handleClick = async (e) => {
      const title = e.target.closest('.toogles__title');
      if (!title || title.closest('.mobile-menu')) return;

      const wrap = title.closest('.toogles');
      // Твоя проверка на десктоп (window.its_desktop заменил на ширину, верни если есть глобальная переменная)
      if (!wrap || (wrap.classList.contains('toogles--mobile') && window.innerWidth > 992) || busy) return;
      busy = true;

      const isFade = wrap.classList.contains('toogles--fade');
      const type   = isFade ? 'fade' : 'slide';
      const group  = title.getAttribute('data-toogles') || '1';

      const items  = $$(`.toogles__item[data-toogles="${group}"]`, wrap);
      const conts  = items.map(it => $('.toogles__item-content', it)).filter(Boolean);
      if (!conts.length) { busy = false; return; }

      const groupActive = items.every(it => it.classList.contains('toogles__item--active'));

      // Закрыть текущую
      if (groupActive) {
        title.classList.remove('toogles__title--active');
        await Promise.all(conts.map((c,i) => animate(type, c, false).then(() => items[i].classList.remove('toogles__item--active'))));

        if (ScrollTrigger) ScrollTrigger.refresh();
        busy = false; return;
      }

      title.classList.add('toogles__title--active');

      // Закрыть соседей
      const others = $$('.toogles__item--active', wrap).filter(it => it.getAttribute('data-toogles') !== group);
      if (others.length) {
         // Снимаем класс active у заголовков соседей
         others.forEach(o => {
            const g = o.getAttribute('data-toogles');
            $$(`.toogles__title[data-toogles="${g}"]`, wrap).forEach(t => t.classList.remove('toogles__title--active'));
         });

        await Promise.all(others.map(it => {
          const c = $('.toogles__item-content', it);
          return animate(type, c, false).then(() => it.classList.remove('toogles__item--active'));
        }));
        if (isFade) await gsap.to({}, {duration: D});
      }

      // Открыть
      await Promise.all(conts.map((c,i) => animate(type, c, true).then(() => items[i].classList.add('toogles__item--active'))));
      
      if (ScrollTrigger) ScrollTrigger.refresh();

      if (window.smoothbar && window.innerWidth > 992 && title.classList.contains('toogles__title--active')) {
        setTimeout(() => { try { window.smoothbar.update(); } catch(_){} }, D * 1000);
      }

      busy = false;
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      gsap.killTweensOf('.toogles__item-content');
    };

  }, [pathname]); 

  return null;
}