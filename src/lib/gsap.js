import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
}

export { gsap, ScrollTrigger };
