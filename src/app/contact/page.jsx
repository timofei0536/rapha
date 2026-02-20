import Contact from "@/components/Contact/Contact";
import { getPagePropsFromSearchParams } from "@/lib/wp-api";
import { ContactDefaults } from "@/components/Contact/defaults";

export const metadata = {
  title: "Contact",
};

export default async function ContactPage({ searchParams }) {
  const props = await getPagePropsFromSearchParams(
    "contact",
    "contact",
    ContactDefaults,
    searchParams
  );

  return (
    <main>
      <Contact map={props.map} items={props.items} />
    </main>
  );
}
