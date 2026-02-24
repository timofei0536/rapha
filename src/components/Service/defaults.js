/**
 * Service component default props (services list page block).
 * Repeater (ACF): title, link (Page Link) — те же поля, что и в block "services"; ссылки из ACF.
 */
export const ServiceDefaults = {
  services: [
    { slug: "resuscitation", title: "Resuscitation", link: { href: "", text: "" } },
    { slug: "surgery-operating-room", title: "Surgery & Operating Room", link: { href: "", text: "" } },
    { slug: "emergencies", title: "Emergencies", link: { href: "", text: "" } },
    { slug: "internal-medicine-dialysis", title: "Internal Medicine Dialysis", link: { href: "", text: "" } },
    { slug: "analysis-laboratory", title: "Analysis Laboratory", link: { href: "", text: "" } },
    { slug: "other-specialties", title: "Other Specialties", link: { href: "", text: "" } },
    { slug: "hospitality-catering", title: "Hospitality & Catering", link: { href: "", text: "" } },
    { slug: "medical-imaging", title: "Medical Imaging", link: { href: "", text: "" } },
    { slug: "gynecology-obstetrics", title: "Gynecology-Obstetrics", link: { href: "", text: "" } },
  ],
};
