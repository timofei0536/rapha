import Image from "next/image";
import PageScreen from "@/components/PageScreen/PageScreen";
import News from "@/components/News/News";
import Service from "@/components/Service/Service";
import { getBlockPropsForPage } from "@/lib/rapha";

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
  const [serviceProps, newsProps] = await Promise.all([
    getBlockPropsForPage("services", "service", searchParams ?? {}),
    getBlockPropsForPage("services", "news", searchParams ?? {}),
  ]);

  const list = Array.isArray(serviceProps?.services) ? serviceProps.services : [];
  const activeService = list.find((s) => s.slug === slug) ?? list[0];
  const pageTitle = activeService?.title ?? formatServiceTitle(slug);
  const titleLines = pageTitle.split("\n");

  return (
    <main>
      <PageScreen className="page-screen--blur">
        <Image
          src="/images/services-screen.png"
          alt={pageTitle}
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
      <Service {...serviceProps} activeSlug={slug} />
      <News {...newsProps} />
    </main>
  );
}
