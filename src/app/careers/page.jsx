import PageScreen from "@/components/PageScreen/PageScreen";
import Careers from "@/components/Careers/Careers";
import { getBlockPropsForPage } from "@/lib/rapha";

export const metadata = {
  title: "Careers",
};

const PAGE_TITLE = "Join Our Team at El-Rapha";
const PAGE_IMAGE = { src: "/images/careers-page.png", alt: "Join Our Team at El-Rapha" };

export default async function CareersPage({ searchParams }) {
  const props = await getBlockPropsForPage("careers", "careers", searchParams);

  return (
    <main>
      <PageScreen title={PAGE_TITLE} image={PAGE_IMAGE} />
      <Careers {...props} />
    </main>
  );
}
