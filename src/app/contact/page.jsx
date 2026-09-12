import Contact from "@/components/Contact/Contact";
import { getBlockPropsForPage } from "@/lib/rapha";
import { getBlockProps } from "@/lib/wp-api";

export const metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const [props, formProps] = await Promise.all([
    getBlockPropsForPage("contact", "contact", {}),
    getBlockProps("contact", "form", {
      title: "Book an appointment",
      doctors: [],
      insurance: [],
    }),
  ]);

  return (
    <main>
      <Contact map={props.map} items={props.items} form={formProps} />
    </main>
  );
}
