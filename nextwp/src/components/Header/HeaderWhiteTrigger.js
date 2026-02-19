'use client';

import { useEffect } from 'react';

export default function HeaderWhiteTrigger() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const header = document.querySelector('.header');
    const getSections = () => document.querySelectorAll('.white-header');
    if (!header) return;

    const updateHeaderClass = () => {
      const sections = getSections();
      if (!sections.length) return;
      const headerTop = header.querySelector('.header__top');
      const refEl = headerTop || header;
      const refRect = refEl.getBoundingClientRect();
      const centerY = refRect.top + refRect.height / 2;
      let inside = false;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (centerY >= rect.top && centerY <= rect.bottom) {
          inside = true;
        }
      });
      header.classList.toggle('header--white', inside);
    };

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 0,
      end: 'max',
      onUpdate: updateHeaderClass,
    });

    updateHeaderClass();

    const onRefresh = () => {
      ScrollTrigger.refresh();
      updateHeaderClass();
    };
    window.addEventListener('resize', onRefresh);

    return () => {
      trigger.kill();
      window.removeEventListener('resize', onRefresh);
    };
  }, []);

  return null;
}
