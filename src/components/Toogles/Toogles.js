// section.toogles
//      .toogles__item(data-toogles="1")
//          .toogles__item-content
//              div
//                  MY CONTENT
//      .toogles__title(data-toogles="1")
(() => {
  if (!document.querySelector('[data-toogles]')) return;

  let busy = false;
  const D = 0.5, E = 'power2.out';
  const $  = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

  // init: скрыть все неактивные
  $$('.toogles__item-content').forEach(c => {
    c.style.display = c.closest('.toogles__item--active') ? 'block' : 'none';
  });

  // универсальная анимация: slide или fade
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
      const h = el.scrollHeight;
      return gsap.fromTo(el, {height:0}, {height:h, duration:D, ease:E})
        .then(() => { el.style.height='auto'; el.style.overflow=''; });
    }
    el.style.overflow='hidden';
    el.style.height = el.scrollHeight + 'px';
    return gsap.to(el, {height:0, duration:D, ease:E})
      .then(() => { el.style.display='none'; el.style.height=''; el.style.overflow=''; });
  };

  document.addEventListener('click', async (e) => {
    const title = e.target.closest('.toogles__title');
    if (!title || title.closest('.mobile-menu')) return;

    const wrap = title.closest('.toogles');
    if (!wrap || (wrap.classList.contains('toogles--mobile') && window.its_desktop) || busy) return;
    busy = true;

    const isFade = wrap.classList.contains('toogles--fade');
    const type   = isFade ? 'fade' : 'slide';
    const group  = title.getAttribute('data-toogles') || '1';

    const items  = $$(`.toogles__item[data-toogles="${group}"]`, wrap);
    const conts  = items.map(it => $('.toogles__item-content', it)).filter(Boolean);
    if (!conts.length) { busy = false; return; }

    const groupActive = items.every(it => it.classList.contains('toogles__item--active'));

    // закрыть/открыть группу параллельно
    if (groupActive) {
      title.classList.remove('toogles__title--active');
      await Promise.all(conts.map((c,i) => animate(type, c, false).then(() => items[i].classList.remove('toogles__item--active'))));

      if (window.ScrollTrigger) ScrollTrigger.refresh(); // ← ДОБАВИТЬ ЗДЕСЬ
      busy = false; return;
    }

    title.classList.add('toogles__title--active');

    // закрыть другие активные группы (параллельно)
    const others = $$('.toogles__item--active', wrap).filter(it => it.getAttribute('data-toogles') !== group);
    if (others.length) {
      await Promise.all(others.map(it => {
        const c = $('.toogles__item-content', it);
        return animate(type, c, false).then(() => it.classList.remove('toogles__item--active'));
      }));
      if (isFade) await gsap.to({}, {duration: D}); // задержка как в оригинале
    }

    // открыть текущую группу (параллельно)
    await Promise.all(conts.map((c,i) => animate(type, c, true).then(() => items[i].classList.add('toogles__item--active'))));
    
    if (window.ScrollTrigger) ScrollTrigger.refresh(); // ← ДОБАВИТЬ ЗДЕСЬ

    if (window.smoothbar && window.its_desktop && title.classList.contains('toogles__title--active')) {
      setTimeout(() => { try { window.smoothbar.update(); } catch(_){} }, D * 1000);
    }

    busy = false;
  });
})();
