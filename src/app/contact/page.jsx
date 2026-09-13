import Contact from "@/components/Contact/Contact";
import { getBlocksPropsForPage, getWpServices } from "@/lib/rapha";

export const metadata = {
  title: "Contact",
  description:
    "Contact El-Rapha polyclinic: phone, address, opening hours, and book an appointment online.",
};

export default async function ContactPage() {
  const [contact, wpServices] = await Promise.all([
    getBlocksPropsForPage("contact", ["contact", "form"]),
    getWpServices(),
  ]);
  const props = contact.contact;
  const formProps = contact.form;

  return (
    <main>
      <Contact map={props.map} items={props.items} form={formProps} services={wpServices} />
    </main>
  );
}
