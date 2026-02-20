import Contact from "@/components/Contact/Contact";
import { getPageComponentData } from "@/lib/wp-api";

export const metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const data = await getPageComponentData("contact", "contact");
  const mapSrc = data?.map?.src ?? data?.map?.url;
const map = mapSrc ? { title: data?.map?.title ?? "", src: mapSrc } : undefined;
  const items = Array.isArray(data?.items) && data.items.length > 0 ? data.items : undefined;

  return (
    <main>
      <Contact map={map} items={items} />
    </main>
  );
}
