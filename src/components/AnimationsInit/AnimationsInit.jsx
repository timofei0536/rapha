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
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => refreshAnimations());
    });
    return () => cancelAnimationFrame(t);
  }, [pathname]);

  return null;
}
