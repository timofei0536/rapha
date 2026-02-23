/**
 * Mobile menu: open/close by burger (burger turns into X when open).
 * Animation: menu panel height 0 → 100% (bg first), then nav + search stagger.
 */
let previousBurgerToggle = null;
let previousTimeline = null;

export function initMobileMenu() {
  const header = document.querySelector('.header');
  const burger = document.querySelector('.header__burger');
  const menu = document.querySelector('.mobile-menu');
  if (!header || !burger || !menu) return;

  const gsap = window.gsap;
  const isReinit = previousBurgerToggle !== null;

  if (typeof window.stopScrollMobile !== 'function') {
    window.stopScrollMobile = () => { document.body.style.overflow = 'hidden'; };
  }
  if (typeof window.startScrollMobile !== 'function') {
    window.startScrollMobile = () => { document.body.style.overflow = ''; };
  }

  if (isReinit) {
    if (previousTimeline) previousTimeline.kill();
    gsap.set(['.mobile-menu', '.mobile-menu__nav-item', '.mobile-menu .search'], { clearProps: 'all' });
    header.classList.remove('header--menu-open');
    menu.classList.remove('mobile-menu--overflow', 'mobile-menu--active');
    burger.classList.remove('header__burger--active');
    burger.setAttribute('aria-label', 'Open menu');
    if (!window.its_desktop) window.startScrollMobile?.();
  }

  if (previousBurgerToggle) {
    burger.removeEventListener('click', previousBurgerToggle);
  }
  previousBurgerToggle = toggleMenu;
  burger.addEventListener('click', previousBurgerToggle);

  function openMenu() {
    header.classList.add('header--menu-open');
    menu.classList.add('mobile-menu--active');
    burger.classList.add('header__burger--active');
    burger.setAttribute('aria-label', 'Close menu');
    viewMenuAnimation.play();
    if (!window.its_desktop) window.stopScrollMobile();
  }

  window.hideMenu = function () {
    viewMenuAnimation.reverse();
    if (!window.its_desktop) window.startScrollMobile();
    burger.classList.remove('header__burger--active');
    burger.setAttribute('aria-label', 'Open menu');
  };

  function toggleMenu() {
    if (menu.classList.contains('mobile-menu--active')) {
      window.hideMenu();
    } else {
      openMenu();
    }
  }

  const viewMenuAnimation = gsap.timeline({ paused: true });

  // 1) BG выезжает сверху вниз (height 0 → 100%)
  viewMenuAnimation.to('.mobile-menu', {
    duration: 0.7,
    height: '100%',
    display: 'flex',
    ease: 'power2.out',
  }, 0);

  // 2) Элементы по stagger после фона
  viewMenuAnimation.fromTo(
    '.mobile-menu__nav-item, .mobile-menu .search',
    { opacity: 0, y: 40 },
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

  previousTimeline = viewMenuAnimation;
}
