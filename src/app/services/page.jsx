import PageScreen from "@/components/PageScreen/PageScreen";
import News from "@/components/News/News";
import Service from "@/components/Service/Service";
import { getBlocksPropsForPage, getWpServices, getNewsPageFeatured } from "@/lib/rapha";

export const metadata = {
  title: "Our Services",
  description:
    "Explore El-Rapha medical services: emergencies, surgery, imaging, laboratory analysis, gynecology, and more.",
};

export default async function ServicesPage() {
  const [servicesPage, wpServices, featured] = await Promise.all([
    getBlocksPropsForPage("services", ["service", "news", "pageScreen"]),
    getWpServices(),
    getNewsPageFeatured("news"),
  ]);
  const { service: serviceProps, news: newsProps, pageScreen: pageScreenProps } = servicesPage;

  const rawFromWp = Array.isArray(wpServices) && wpServices.length > 0 ? wpServices : null;
  const rawFromBlock = Array.isArray(serviceProps?.services) && serviceProps.services.length > 0 ? serviceProps.services : null;
  const servicesList = rawFromWp ?? rawFromBlock ?? [];
  return (
    <main>
      <PageScreen {...pageScreenProps} className="page-screen--blur" />
      <Service {...serviceProps} services={servicesList} />
      <News {...newsProps} items={(newsProps.items ?? []).slice(0, 3)} featured={featured} />
    </main>
  );
}
