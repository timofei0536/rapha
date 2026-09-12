import PageScreen from "@/components/PageScreen/PageScreen";
import News from "@/components/News/News";
import Service from "@/components/Service/Service";
import { getBlockPropsForPage, getWpServices, getNewsPageFeatured } from "@/lib/rapha";
import { ServiceDefaults } from "@/components/Service/defaults";

export const metadata = {
  title: "Our Services",
};

const SERVICES_PAGE_SCREEN_FALLBACK = {
  title: "Our Services",
  image: { src: "/images/services-screen.png", alt: "Our Services" },
};

export default async function ServicesPage() {
  const [serviceProps, newsProps, pageScreenProps, wpServices, featured] = await Promise.all([
    getBlockPropsForPage("services", "service", {}),
    getBlockPropsForPage("services", "news", {}),
    getBlockPropsForPage("services", "pageScreen", {}),
    getWpServices(),
    getNewsPageFeatured("news"),
  ]);

  const rawFromWp = Array.isArray(wpServices) && wpServices.length > 0 ? wpServices : null;
  const rawFromBlock = Array.isArray(serviceProps?.services) && serviceProps.services.length > 0 ? serviceProps.services : null;
  const servicesList = rawFromWp ?? rawFromBlock ?? ServiceDefaults.services ?? [];
  const pageScreen = {
    title: pageScreenProps?.title?.trim() || SERVICES_PAGE_SCREEN_FALLBACK.title,
    image: pageScreenProps?.image?.src ? pageScreenProps.image : SERVICES_PAGE_SCREEN_FALLBACK.image,
    className: "page-screen--blur",
  };
  return (
    <main>
      <PageScreen {...pageScreen} />
      <Service {...serviceProps} services={servicesList} />
      <News {...newsProps} items={(newsProps.items ?? []).slice(0, 3)} featured={featured} />
    </main>
  );
}
