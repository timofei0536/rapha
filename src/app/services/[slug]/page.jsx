import Image from "next/image";
import PageScreen from "@/components/PageScreen/PageScreen";
import News from "@/components/News/News";
import Service from "@/components/Service/Service";
import ServiceContent from "@/components/ServiceContent/ServiceContent";
import { getBlockPropsForPage, getWpServices, getWpServiceBySlug } from "@/lib/rapha";
import { ServiceDefaults } from "@/components/Service/defaults";
import { ServiceContentDefaults } from "@/components/ServiceContent/defaults";

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

export default async function ServicePage({ params, searchParams }) {
  const { slug } = await params;
  const [serviceProps, newsProps, wpServices, wpServiceBySlug] = await Promise.all([
    getBlockPropsForPage("services", "service", searchParams ?? {}),
    getBlockPropsForPage("services", "news", searchParams ?? {}),
    getWpServices(),
    getWpServiceBySlug(slug),
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
  const titleLines = pageTitle.split("\n");

  const pageScreenImage = activeService?.image ?? wpServiceBySlug?.image;
  const pageScreenSrc =
    typeof pageScreenImage === "object" && pageScreenImage?.src ? pageScreenImage.src : "/images/service-page.png";
  const pageScreenAlt = typeof pageScreenImage === "object" && pageScreenImage?.alt != null ? pageScreenImage.alt : pageTitle;

  return (
    <main>
      <PageScreen className="page-screen--blur">
        <Image
          src={pageScreenSrc}
          alt={pageScreenAlt}
          className="page-screen__bg"
          width={1920}
          height={1070}
        />
        <h1 className="simple-title simple-title--large">
          {titleLines.length > 1 ? (
            titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))
          ) : (
            pageTitle
          )}
        </h1>
      </PageScreen>
      <ServiceContent
        content={
          (wpServiceBySlug?.content ?? activeService?.content ?? "") ||
          (typeof ServiceContentDefaults[slug] === "string" ? ServiceContentDefaults[slug].trim() : "")
        }
        services={list}
        activeSlug={slug}
      />
      <Service {...serviceProps} services={list} activeSlug={slug} activeService={activeService} />
      <News {...newsProps} items={(newsProps.items ?? []).slice(0, 3)} />
    </main>
  );
}
