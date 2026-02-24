import Image from "next/image";
import PageScreen from "@/components/PageScreen/PageScreen";
import News from "@/components/News/News";
import Service from "@/components/Service/Service";
import { getBlockPropsForPage, getWpServices } from "@/lib/rapha";
import { ServiceDefaults } from "@/components/Service/defaults";

export const metadata = {
  title: "Our Services",
};

export default async function ServicesPage({ searchParams }) {
  const [serviceProps, newsProps, wpServices] = await Promise.all([
    getBlockPropsForPage("services", "service", searchParams),
    getBlockPropsForPage("services", "news", searchParams),
    getWpServices(),
  ]);

  const rawFromWp = Array.isArray(wpServices) && wpServices.length > 0 ? wpServices : null;
  const rawFromBlock = Array.isArray(serviceProps?.services) && serviceProps.services.length > 0 ? serviceProps.services : null;
  const servicesList = rawFromWp ?? rawFromBlock ?? ServiceDefaults.services ?? [];
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
      <Service {...serviceProps} services={servicesList} />
      <News {...newsProps} items={(newsProps.items ?? []).slice(0, 3)} />
    </main>
  );
}
