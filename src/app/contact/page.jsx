import Contact from "@/components/Contact/Contact";
import { getBlockPropsForPage, getWpServices } from "@/lib/rapha";
import { getPageProps } from "@/lib/wp-api";

export const metadata = {
  title: "Contact",
  description:
    "Contact El-Rapha polyclinic: phone, address, opening hours, and book an appointment online.",
};

export default async function ContactPage() {
  const [props, formProps, wpServices] = await Promise.all([
    getBlockPropsForPage("contact", "contact"),
    getPageProps("contact", "form"),
    getWpServices(),
  ]);

  return (
    <main>
      <Contact map={props.map} items={props.items} form={formProps} services={wpServices} />
    </main>
  );
}
