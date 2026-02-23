'use client';

import { useEffect, useRef, useState } from 'react';
import './Preloader.scss';

// Имя сайта для проверки referrer — не показывать прелоадер при переходе с внутренних страниц
const SITE_REFERRER_KEY = 'rapha';

export default function Preloader() {
  const [shouldRender, setShouldRender] = useState(true);
  const [hideClass, setHideClass] = useState(false);
  const preloaderRef = useRef(null);

  useEffect(() => {
    const preloader = preloaderRef.current;
    if (!preloader) return;

    const isFromSite = typeof document !== 'undefined' && document.referrer && document.referrer.indexOf(SITE_REFERRER_KEY) !== -1;
    // на localhost прелоадер всегда показываем (для разработки)
    const isLocalhost = typeof location !== 'undefined' && location.href.indexOf('localhost') !== -1;

    if (isFromSite && !isLocalhost) {
      window.dispatchEvent(new CustomEvent('preloaderEnd'));
      setShouldRender(false);
      return;
    }

    const t1 = setTimeout(() => {
      setHideClass(true);
    }, 2500);

    const t2 = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('preloaderEnd'));
      setShouldRender(false);
    }, 4000);

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
        <img src="/images/logo--white.png" alt="" />
      </div>
    </div>
  );
}
