import PageScreen from "@/components/PageScreen/PageScreen";
import News from "@/components/News/News";
import Service from "@/components/Service/Service";
import { getBlockPropsForPage, getWpServices, getNewsPageFeatured } from "@/lib/rapha";

export const metadata = {
  title: "Our Services",
  description:
    "Explore El-Rapha medical services: emergencies, surgery, imaging, laboratory analysis, gynecology, and more.",
};

export default async function ServicesPage() {
  const [serviceProps, newsProps, pageScreenProps, wpServices, featured] = await Promise.all([
    getBlockPropsForPage("services", "service"),
    getBlockPropsForPage("services", "news"),
    getBlockPropsForPage("services", "pageScreen"),
    getWpServices(),
    getNewsPageFeatured("news"),
  ]);

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
