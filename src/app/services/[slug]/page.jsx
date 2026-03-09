import PageScreen from "@/components/PageScreen/PageScreen";
import News from "@/components/News/News";
import Service from "@/components/Service/Service";
import ServiceContent from "@/components/ServiceContent/ServiceContent";
import { getBlockPropsForPage, getWpServices, getWpServiceBySlug, getNewsPageFeatured } from "@/lib/rapha";
import { ServiceDefaults } from "@/components/Service/defaults";
import { ServiceContentDefaults } from "@/components/ServiceContent/defaults";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const services = await getWpServices();
  const slugs = (services || [])
    .map((s) => (s && s.slug ? { slug: String(s.slug).trim() } : null))
    .filter(Boolean);
  return slugs.length > 0 ? slugs : [{ slug: "surgery-operating-room" }];
}

function formatServiceTitle(slug) {
  if (!slug) return "Our Services";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = formatServiceTitle(slug);
  return { title };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const [serviceProps, newsProps, wpServices, wpServiceBySlug, featured] = await Promise.all([
    getBlockPropsForPage("services", "service", {}),
    getBlockPropsForPage("services", "news", {}),
    getWpServices(),
    getWpServiceBySlug(slug),
    getNewsPageFeatured("news"),
  ]);

  const rawFromWp = Array.isArray(wpServices) && wpServices.length > 0 ? wpServices : null;
  const rawFromBlock = Array.isArray(serviceProps?.services) && serviceProps.services.length > 0 ? serviceProps.services : null;
  let list = rawFromWp ?? rawFromBlock ?? ServiceDefaults.services ?? [];
  // Enrich active item with WP data (content, image) when available
  if (wpServiceBySlug && slug) {
    list = list.map((item) =>
      item.slug === slug ? { ...item, ...wpServiceBySlug } : item
    );
  }
  const activeService = list.find((s) => s.slug === slug) ?? list[0];
  const pageTitle = activeService?.title ?? formatServiceTitle(slug);
  const pageScreenImage = activeService?.image ?? wpServiceBySlug?.image;
  const pageScreen = {
    title: pageTitle,
    image:
      typeof pageScreenImage === "object" && pageScreenImage?.src
        ? { src: pageScreenImage.src, alt: pageScreenImage.alt ?? pageTitle }
        : { src: "/images/service-page.png", alt: pageTitle },
    className: "page-screen--blur",
  };

  return (
    <main>
      <PageScreen {...pageScreen} />
      <ServiceContent
        content={
          (wpServiceBySlug?.content ?? activeService?.content ?? "") ||
          (typeof ServiceContentDefaults[slug] === "string" ? ServiceContentDefaults[slug].trim() : "")
        }
        services={list}
        activeSlug={slug}
      />
      <Service {...serviceProps} services={list} activeSlug={slug} activeService={activeService} />
      <News {...newsProps} items={(newsProps.items ?? []).slice(0, 3)} featured={featured} />
    </main>
  );
}
