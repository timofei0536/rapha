'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { initAnimations, refreshAnimations } from '@/animations';

export default function AnimationsInit() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    initAnimations();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    document.body.classList.toggle('page-home', pathname === '/');
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    // При возврате на главную даём странице время загрузиться (Hero — серверный компонент)
    const delay = pathname === '/' ? 150 : 0;
    const t = delay
      ? setTimeout(refreshAnimations, delay)
      : requestAnimationFrame(() => {
          requestAnimationFrame(refreshAnimations);
        });
    return () => (delay ? clearTimeout(t) : cancelAnimationFrame(t));
  }, [pathname]);

  return null;
}
