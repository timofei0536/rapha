import Contact from "@/components/Contact/Contact";
import { getBlockPropsForPage } from "@/lib/rapha";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const props = await getBlockPropsForPage("contact", "contact", {});

  return (
    <main>
      <Contact map={props.map} items={props.items} />
    </main>
  );
}
