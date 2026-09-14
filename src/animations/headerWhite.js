import { registerScrollTrigger, registerCleanupFn } from './lib/animCleanup';

export const selector = '.header';

const WHITE_SECTIONS = '.white-header';
const WHITE_CHECK_MIN_DELTA_PX = 10;

export function init() {
  const header = document.querySelector('.header');
  if (!header || !window.ScrollTrigger) return;

  let sections = Array.from(document.querySelectorAll(WHITE_SECTIONS));
  let lastCheckScroll = Number(window.scrollY) || 0;

  const collectSections = () => {
    sections = Array.from(document.querySelectorAll(WHITE_SECTIONS));
  };

  const updateHeaderClass = () => {
    if (!sections.length) {
      header.classList.remove('header--white');
      return;
    }
    const headerTop = header.querySelector('.header__top');
    const refEl = headerTop || header;
    const refRect = refEl.getBoundingClientRect();
    const centerY = refRect.top + refRect.height / 2;
    let inside = false;
    for (let i = 0; i < sections.length; i += 1) {
      const rect = sections[i].getBoundingClientRect();
      if (centerY >= rect.top && centerY <= rect.bottom) {
        inside = true;
        break;
      }
    }
    header.classList.toggle('header--white', inside);
  };

  const onUpdate = (self) => {
    const scrollY =
      typeof self?.scroll === 'function'
        ? Number(self.scroll()) || 0
        : Number(self?.scroll ?? window.scrollY) || 0;
    if (Math.abs(scrollY - lastCheckScroll) < WHITE_CHECK_MIN_DELTA_PX) return;
    lastCheckScroll = scrollY;
    updateHeaderClass();
  };

  const onRefreshInit = () => {
    collectSections();
    updateHeaderClass();
  };
  window.ScrollTrigger.addEventListener('refreshInit', onRefreshInit);

  const trigger = window.ScrollTrigger.create({
    trigger: document.body,
    start: 0,
    end: 'max',
    onUpdate,
  });
  registerScrollTrigger(trigger, document.body);
  registerCleanupFn(() => {
    window.ScrollTrigger?.removeEventListener('refreshInit', onRefreshInit);
    header.classList.remove('header--white');
  });
  updateHeaderClass();
}
