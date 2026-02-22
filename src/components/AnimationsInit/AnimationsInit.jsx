'use client';

import { useEffect } from 'react';
import { initAnimations } from '@/animations';

export default function AnimationsInit() {
  useEffect(() => {
    initAnimations();
  }, []);
  return null;
}
