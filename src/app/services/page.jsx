import Image from "next/image";
import PageScreen from "@/components/PageScreen/PageScreen";
import News from "@/components/News/News";
import { getNewsItemsForBlock } from "@/components/News/defaults";
import Service from "@/components/Service/Service";
import { getBlockPropsForPage } from "@/lib/rapha";

export const metadata = {
  title: "Our Services",
};

export default async function ServicesPage({ searchParams }) {
  const [serviceProps, newsProps] = await Promise.all([
    getBlockPropsForPage("services", "service", searchParams),
    getBlockPropsForPage("services", "news", searchParams),
  ]);

  return (
    <main>
      <PageScreen className="page-screen--blur">
        <Image
          src="/images/services-screen.png"
          alt="Our Services"
          className="page-screen__bg"
          width={1920}
          height={1070}
        />
        <h1 className="simple-title simple-title--large">Our<br /> Services</h1>
      </PageScreen>
      <Service {...serviceProps} />
      <News {...newsProps} items={getNewsItemsForBlock(newsProps.items || [], { limit: 3 })} />
    </main>
  );
}
