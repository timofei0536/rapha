/**
 * Services component default props.
 * Data from WP: getBlockPropsForPage("home", "services") → component_services (title, image, services repeater).
 * Repeater fields (ACF): title (Text), content (Wysiwyg), link (Page Link) — ссылки только из ACF.
 */
export const ServicesDefaults = {
  title: "Our Services",
  image: { src: "/images/services.png", alt: "services-background" },
  services: [
    { title: "Emergencies", content: "", link: { href: "", text: "" } },
    { title: "Surgery &\nOperating room", content: "", link: { href: "", text: "" } },
    { title: "Medical Imaging", content: "", link: { href: "", text: "" } },
    { title: "Analysis Laboratory", content: "", link: { href: "", text: "" } },
    { title: "Gynecology-Obstetrics", content: "", link: { href: "", text: "" } },
  ],
};
