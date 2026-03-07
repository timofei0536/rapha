'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { initAnimations, refreshAnimations } from '@/animations';

export default function AnimationsInit() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    console.log('[anim] AnimationsInit mount → initAnimations()');
    initAnimations();
  }, []);

  useEffect(() => {
    console.log('[anim] pathname effect', pathname, 'isFirst:', isFirst.current);
    if (!pathname) return;
    document.body.classList.toggle('page-home', pathname === '/');
    if (isFirst.current) {
      isFirst.current = false;
      console.log('[anim] first load, skip refreshAnimations');
      return;
    }
    console.log('[anim] client nav → refreshAnimations()');
    refreshAnimations();
  }, [pathname]);

  return null;
}
