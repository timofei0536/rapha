/**
 * Mobile menu: open/close by burger (burger turns into X when open).
 * Animation: menu panel height 0 → 100% (bg first), then nav + search stagger.
 */

import { registerTimeline, registerListener, registerCleanupFn } from './lib/animCleanup';
import { setInitialData } from './lib/animInitial';

export const selector = '.mobile-menu';

export function init() {
  const header = document.querySelector('.header');
  const burger = document.querySelector('.header__burger');
  const menu = document.querySelector('.mobile-menu');
  if (!header || !burger || !menu) return;

  const gsap = window.gsap;

  if (typeof window.stopScrollMobile !== 'function') {
    window.stopScrollMobile = () => { document.body.style.overflow = 'hidden'; };
  }
  if (typeof window.startScrollMobile !== 'function') {
    window.startScrollMobile = () => { document.body.style.overflow = ''; };
  }

  const menuItemsSelector = '.mobile-menu__nav-item, .mobile-menu .search';

  const viewMenuAnimation = gsap.timeline({ paused: true });

  viewMenuAnimation.to('.mobile-menu', {
    duration: 0.7,
    height: '100%',
    display: 'flex',
    ease: 'power2.out',
  }, 0);

  viewMenuAnimation.to(
    menuItemsSelector,
    {
      opacity: 1,
      y: 0,
      duration: 0.55,
      delay: 0.25,
      stagger: { amount: 0.45 },
      ease: 'power2.out',
    },
    0.3
  );

  viewMenuAnimation.eventCallback('onComplete', () => menu.classList.add('mobile-menu--overflow'));
  viewMenuAnimation.eventCallback('onReverseComplete', () => {
    header.classList.remove('header--menu-open');
    menu.classList.remove('mobile-menu--overflow');
    menu.classList.remove('mobile-menu--active');
  });

  window.hideMenu = function () {
    viewMenuAnimation.reverse();
    if (!window.its_desktop) window.startScrollMobile();
    burger.classList.remove('header__burger--active');
    burger.setAttribute('aria-label', 'Open menu');
  };

  function openMenu() {
    header.classList.add('header--menu-open');
    menu.classList.add('mobile-menu--active');
    burger.classList.add('header__burger--active');
    burger.setAttribute('aria-label', 'Close menu');
    document.querySelectorAll(menuItemsSelector).forEach((el) => setInitialData(el, { opacity: '0', y: '40' }));
    viewMenuAnimation.play();
    if (!window.its_desktop) window.stopScrollMobile();
  }

  function toggleMenu() {
    if (menu.classList.contains('mobile-menu--active')) {
      window.hideMenu();
    } else {
      openMenu();
    }
  }

  registerTimeline(viewMenuAnimation, menu);
  registerListener(burger, 'click', toggleMenu);
  burger.addEventListener('click', toggleMenu);

  registerCleanupFn(() => {
    header.classList.remove('header--menu-open');
    menu.classList.remove('mobile-menu--overflow', 'mobile-menu--active');
    burger.classList.remove('header__burger--active');
    burger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    if (window.gsap) {
      window.gsap.set(['.mobile-menu', '.mobile-menu__nav-item', '.mobile-menu .search'], { clearProps: 'all' });
    }
    delete window.hideMenu;
  });
}
