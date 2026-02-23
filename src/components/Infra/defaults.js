/**
 * Infra component default props.
 * items[].link = ACF Page Link → { href, text, target? }
 */
export const InfraDefaults = {
  title: "Our Infrastructure",
  items: [
    { slug: "24-7-ambulance", image: { src: "/images/infra1.png", alt: "24/7 Ambulance" }, title: "24/7 Ambulance", content: "Our ambulance service is available around the clock to ensure prompt emergency response and safe patient transport whenever needed.", link: { href: "/news/24-7-ambulance", text: "Learn More" } },
    { slug: "food-and-dietetics", image: { src: "/images/infra2.png", alt: "Food and Dietetics" }, title: "Food and Dietetics", content: "Professional dietetic support and tailored nutrition plans for patients, supporting recovery and overall wellbeing during their stay.", link: { href: "/news/food-and-dietetics", text: "Learn More" } },
    { slug: "special-nurses", image: { src: "/images/infra3.png", alt: "Special Nurses" }, title: "Special Nurses", content: "Dedicated nursing care with specialized training to meet the diverse needs of our patients and maintain the highest standards of care.", link: { href: "/news/special-nurses", text: "Learn More" } },
  ],
};
