import Image from "next/image";
import PageScreen from "@/components/PageScreen/PageScreen";
import Contact from "@/components/Contact/Contact";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main>
      <Contact />
    </main>
  );
}
