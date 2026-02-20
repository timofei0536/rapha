import Contact from "@/components/Contact/Contact";
import { getPageComponentData } from "@/lib/wp-api";

export const metadata = {
  title: "Contact",
};

const ContactDefaults = {
  map: {
    title: "Polyclinique El Rapha - Libreville",
    src: "https://www.google.com/maps?q=Polyclinique+El+Rapha+Libreville+Gabon&z=16&output=embed",
  },
  items: [
    {
      title: "Polyclinique El Rapha",
      link: {
        text: "Three Quarters,\n256 Libreville,\nGabon",
        href: "https://www.google.com/maps/search/?api=1&query=Three+Quarters,+256+Libreville,+Gabon",
        target: "_blank",
      },
    },
    {
      title: "Call us",
      link: {
        text: "+241 077 986 660",
        href: "tel:+241077986660",
      },
    },
    {
      title: "Email us",
      link: {
        text: "contact@el-raphaga.com",
        href: "mailto:contact@el-raphaga.com",
      },
    },
  ],
};

export default async function ContactPage() {
  const data = await getPageComponentData("contact", "contact");
  const mapSrc = data?.map?.src ?? data?.map?.url;
  const map = mapSrc ? { title: data?.map?.title ?? "", src: mapSrc } : ContactDefaults.map;
  const items =
    Array.isArray(data?.items) && data.items.length > 0 ? data.items : ContactDefaults.items;

  return (
    <main>
      <Contact map={map} items={items} />
    </main>
  );
}
