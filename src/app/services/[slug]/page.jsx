import PageScreen from "@/components/PageScreen/PageScreen";
import News from "@/components/News/News";
import Service from "@/components/Service/Service";
import ServiceContent from "@/components/ServiceContent/ServiceContent";
import { getBlockPropsForPage, getWpServices, getWpServiceBySlug, getNewsPageFeatured } from "@/lib/rapha";

export async function generateStaticParams() {
  const services = await getWpServices();
  return (services || [])
    .map((s) => (s && s.slug ? { slug: String(s.slug).trim() } : null))
    .filter(Boolean);
}

function formatServiceTitle(slug) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const wpService = await getWpServiceBySlug(slug);
  const title = wpService?.title || formatServiceTitle(slug);
  return {
    title,
    description: `${title} at El-Rapha polyclinic: how the service works and how to book care.`,
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const [serviceProps, newsProps, wpServices, wpServiceBySlug, featured] = await Promise.all([
    getBlockPropsForPage("services", "service"),
    getBlockPropsForPage("services", "news"),
    getWpServices(),
    getWpServiceBySlug(slug),
    getNewsPageFeatured("news"),
  ]);

  const rawFromWp = Array.isArray(wpServices) && wpServices.length > 0 ? wpServices : null;
  const rawFromBlock = Array.isArray(serviceProps?.services) && serviceProps.services.length > 0 ? serviceProps.services : null;
  let list = rawFromWp ?? rawFromBlock ?? [];
  if (wpServiceBySlug && slug) {
    list = list.map((item) =>
      item.slug === slug ? { ...item, ...wpServiceBySlug } : item
    );
  }
  const activeService = list.find((s) => s.slug === slug) ?? wpServiceBySlug ?? list[0];
  const pageTitle = activeService?.title ?? formatServiceTitle(slug);
  const pageScreenImage = activeService?.image ?? wpServiceBySlug?.image;

  return (
    <main>
      <PageScreen
        title={pageTitle}
        image={
          typeof pageScreenImage === "object" && pageScreenImage?.src
            ? { src: pageScreenImage.src, alt: pageScreenImage.alt ?? pageTitle }
            : undefined
        }
        className="page-screen--blur"
      />
      <ServiceContent
        content={wpServiceBySlug?.content ?? activeService?.content ?? ""}
        services={list}
        activeSlug={slug}
      />
      <Service {...serviceProps} services={list} activeSlug={slug} activeService={activeService} />
      <News {...newsProps} items={(newsProps.items ?? []).slice(0, 3)} featured={featured} />
    </main>
  );
}
