'use client';

import { useEffect, useRef, useState } from 'react';
import { shouldSkipIntro } from '@/lib/skipIntro';
import './Preloader.scss';

// Site name used to check the referrer — skip the preloader on internal navigations
const SITE_REFERRER_KEY = 'raph';

export default function Preloader() {
  const [shouldRender, setShouldRender] = useState(true);
  const [hideClass, setHideClass] = useState(false);
  const preloaderRef = useRef(null);

  useEffect(() => {
    const preloader = preloaderRef.current;
    if (!preloader) return;

    const finish = () => {
      window.preloaderDone = true;
      window.dispatchEvent(new CustomEvent('preloaderEnd'));
      setShouldRender(false);
    };

    const isFromSite = typeof document !== 'undefined' && document.referrer && document.referrer.indexOf(SITE_REFERRER_KEY) !== -1;
    const isLocalhost = typeof location !== 'undefined' && location.href.indexOf('localhost') !== -1;

    if (shouldSkipIntro() || (isFromSite && !isLocalhost)) {
      finish();
      return;
    }

    const t1 = setTimeout(() => setHideClass(true), 1500);
    const t2 = setTimeout(finish, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      ref={preloaderRef}
      className={`preloader${hideClass ? ' preloader--hide' : ''}`}
      aria-hidden="true"
    >
      <div className="preloader__logo">
        <img src="/images/logo--white.png" alt="logo" />
      </div>
    </div>
  );
}
